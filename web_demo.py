import csv
import json
import os
import re
import sqlite3
import threading
import uuid
from pathlib import Path

from dashscope_config import resolve_base_url
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from openai import OpenAI
from pydantic import BaseModel
from qdrant_client import QdrantClient
from strands import Agent, tool
from strands.models.openai import OpenAIModel

ROOT = Path(__file__).parent
KEY_FILE = Path(
    os.getenv(
        'DASHSCOPE_CREDENTIAL_FILE',
        '/Users/wangxiaojie/Downloads/默认业务空间-apiKey-7312314.csv',
    )
)
DB = ROOT / 'data/qdrant'
HISTORY_DB = ROOT / 'data/history.sqlite3'
COLLECTION = 'aws_ec2_zh_cn'


def config():
    with KEY_FILE.open(encoding='utf-8-sig', newline='') as file:
        return {
            row[0].strip(): row[1].strip()
            for row in csv.reader(file)
            if len(row) >= 2
        }


cfg = config()
BASE_URL = resolve_base_url(cfg['apiHost'])
api = OpenAI(api_key=cfg['apiKey'], base_url=BASE_URL)
qdrant = QdrantClient(path=str(DB))


def init_history():
    HISTORY_DB.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(HISTORY_DB) as connection:
        connection.execute(
            '''CREATE TABLE IF NOT EXISTS conversations (
                session_id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )'''
        )
        connection.execute(
            '''CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TEXT NOT NULL,
                sources_json TEXT NOT NULL DEFAULT '[]',
                FOREIGN KEY(session_id) REFERENCES conversations(session_id)
            )'''
        )
        columns = {
            row[1] for row in connection.execute('PRAGMA table_info(messages)').fetchall()
        }
        if 'sources_json' not in columns:
            connection.execute(
                "ALTER TABLE messages ADD COLUMN sources_json TEXT NOT NULL DEFAULT '[]'"
            )


init_history()


def save_message(
    session_id: str,
    role: str,
    content: str,
    title: str = '',
    sources: list[dict] | None = None,
):
    import datetime

    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    with sqlite3.connect(HISTORY_DB) as connection:
        connection.execute(
            'INSERT OR IGNORE INTO conversations VALUES (?, ?, ?, ?)',
            (session_id, title or 'AWS 客服对话', now, now),
        )
        if title:
            connection.execute(
                'UPDATE conversations SET title=?, updated_at=? WHERE session_id=?',
                (title[:80], now, session_id),
            )
        else:
            connection.execute(
                'UPDATE conversations SET updated_at=? WHERE session_id=?',
                (now, session_id),
            )
        connection.execute(
            '''INSERT INTO messages(
                session_id, role, content, created_at, sources_json
            ) VALUES (?, ?, ?, ?, ?)''',
            (
                session_id,
                role,
                content,
                now,
                json.dumps(sources or [], ensure_ascii=False),
            ),
        )


def list_history():
    with sqlite3.connect(HISTORY_DB) as connection:
        connection.row_factory = sqlite3.Row
        return [
            dict(row)
            for row in connection.execute(
                '''SELECT session_id, title, created_at, updated_at
                   FROM conversations
                   ORDER BY updated_at DESC
                   LIMIT 100'''
            )
        ]


def get_history(session_id: str):
    with sqlite3.connect(HISTORY_DB) as connection:
        connection.row_factory = sqlite3.Row
        rows = connection.execute(
            '''SELECT role, content, created_at, sources_json
               FROM messages
               WHERE session_id=?
               ORDER BY id''',
            (session_id,),
        ).fetchall()

    messages = []
    for row in rows:
        message = dict(row)
        raw_sources = message.pop('sources_json', '[]')
        try:
            message['sources'] = json.loads(raw_sources) if raw_sources else []
        except json.JSONDecodeError:
            message['sources'] = []
        messages.append(message)
    return messages


def retrieve_aws_knowledge(query: str):
    vector = api.embeddings.create(
        model='qwen3.7-text-embedding-flash', input=[query]
    ).data[0].embedding
    hits = qdrant.query_points(
        COLLECTION, query=vector, limit=5, with_payload=True
    ).points
    if not hits or hits[0].score < 0.35:
        return []
    return hits


def new_agent(search_tool) -> Agent:
    model = OpenAIModel(
        client_args={'api_key': cfg['apiKey'], 'base_url': BASE_URL},
        model_id='qwen3.8-flash',
        params={'temperature': 0.2, 'max_tokens': 1800},
    )
    return Agent(
        model=model,
        tools=[search_tool],
        system_prompt='''
你是 AWS 技术客服 Agent。每次回答 AWS 技术问题前，必须调用 search_aws_knowledge_base。
只能依据工具返回的 AWS 官方资料回答；资料不足时明确说“知识库没有足够依据”，不能编造。

输出与引用规则：
1. 必须使用 GitHub Flavored Markdown 输出，直接输出 Markdown 正文，不要用代码围栏包裹整篇回答。
2. 工具返回的每条 evidence 都有 citation_number。每个基于资料的事实句或段落后，必须紧跟对应的 Markdown 行内引用，格式严格为 `[编号](#source-编号)`，例如 `[1](#source-1)`。
3. 一个事实由多个来源支持时可连续标注，例如 `[1](#source-1) [3](#source-3)`。编号只能使用工具实际返回的 citation_number，不得编造、重排或复用到无关事实。
4. 可以使用标题、列表、加粗、代码块和 Markdown 表格。右侧界面会展示完整来源卡片，因此不要在回答末尾重复输出“引用来源”列表。
5. 使用中文，回答清晰、可执行；保留对话上下文，支持多轮追问；不要执行任何云资源修改操作。
''',
    )


class SessionState:
    def __init__(self):
        self.sources: list[dict] = []
        self.citation_numbers: dict[str, int] = {}
        self.call_lock = threading.Lock()

        @tool
        def search_aws_knowledge_base(query: str) -> str:
            """Search the local AWS EC2 knowledge base and return numbered evidence."""
            return self.search(query)

        self.agent = new_agent(search_aws_knowledge_base)

    def reset_sources(self):
        self.sources = []
        self.citation_numbers = {}

    def search(self, query: str) -> str:
        hits = retrieve_aws_knowledge(query)
        if not hits:
            return json.dumps(
                {
                    'found': False,
                    'message': '知识库没有找到足够相关的 AWS 官方资料。',
                },
                ensure_ascii=False,
            )

        evidence = []
        for hit in hits:
            payload = hit.payload
            document_id = str(payload['id'])
            citation_number = self.citation_numbers.get(document_id)
            if citation_number is None:
                citation_number = len(self.sources) + 1
                self.citation_numbers[document_id] = citation_number
                self.sources.append(
                    {
                        'citation_number': citation_number,
                        'id': document_id,
                        'score': round(hit.score, 4),
                        'title': payload['title'],
                        'source_file': payload['source_file'],
                        'source_url': payload['source_url'],
                    }
                )

            evidence.append(
                {
                    'citation_number': citation_number,
                    'id': document_id,
                    'score': round(hit.score, 4),
                    'title': payload['title'],
                    'text': payload['text'],
                    'source_file': payload['source_file'],
                    'source_url': payload['source_url'],
                }
            )

        return json.dumps({'found': True, 'evidence': evidence}, ensure_ascii=False)


sessions: dict[str, SessionState] = {}
sessions_lock = threading.Lock()


def get_session(session_id: str) -> SessionState:
    with sessions_lock:
        session = sessions.get(session_id)
        if session is None:
            session = SessionState()
            sessions[session_id] = session
        return session


class ChatRequest(BaseModel):
    session_id: str | None = None
    message: str


app = FastAPI(title='AWS 客服 Agent')
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173', 'http://127.0.0.1:5173'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)
app.mount('/assets', StaticFiles(directory=str(ROOT / 'assets')), name='assets')
HTML = (ROOT / 'index.html').read_text(encoding='utf-8')
HTML = re.sub(
    r'<div class="mascot">.*?</div></aside>',
    '<div class="mascot"><img src="/assets/ai-dlc-mascot.png" alt="AI-DLC 先锋创造营"><div class="brand-cn">AI-DLC 先锋创造营</div><div class="brand-en">Start Your Journey as a Pioneer</div></div></aside>',
    HTML,
    count=1,
    flags=re.DOTALL,
)
HTML = HTML.replace(
    '.ghost{font-size:90px;filter:drop-shadow(0 0 18px #7d43ff);margin-bottom:8px}',
    '.mascot img{display:block;width:205px;max-width:100%;height:auto;margin:0 auto;filter:drop-shadow(0 0 18px #7d43ff)}',
)
HTML = HTML.replace(
    '</style>',
    '.brand-cn{color:#a45cff;font-size:16px;font-weight:800;margin-top:4px}.brand-en{color:#aeb0c9;font-size:11px;margin-top:5px}</style>',
)
HTML = HTML.replace(
    '</style>',
    '.nav,.send,.badge,.source,.history-item{cursor:pointer}.nav:active,.send:active{transform:scale(.98)}</style>',
)
HTML = HTML.replace(
    '<div class="nav"><span>◷</span>历史记录</div>',
    '<div class="nav" id="historyNav"><span>◷</span>历史记录</div><div id="historyPanel" class="history-panel"></div>',
)
HTML = HTML.replace(
    '</style>',
    '.history-panel{display:none;margin:0 8px 8px;background:#171a2d;border:1px solid #2d3150;border-radius:10px;max-height:220px;overflow:auto}.history-panel.open{display:block}.history-item{padding:10px 12px;color:#c6c7dc;font-size:12px;border-bottom:1px solid #292c47;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.history-item:hover{background:#29214b;color:white}</style>',
)
HTML = HTML.replace(
    '</script>',
    ''';async function loadHistory(){const p=document.querySelector('#historyPanel');p.classList.toggle('open');if(!p.classList.contains('open'))return;const d=await fetch('/api/history').then(r=>r.json());p.innerHTML=d.items.length?d.items.map(x=>`<div class="history-item" data-id="${x.session_id}">${x.title}</div>`).join(''):'<div class="history-item">暂无历史记录</div>';p.querySelectorAll('[data-id]').forEach(x=>x.onclick=()=>restoreHistory(x.dataset.id))}async function restoreHistory(id){const d=await fetch('/api/history/'+id).then(r=>r.json());sid=id;chat.innerHTML='';d.messages.forEach(m=>m.role==='user'?addUser(m.content):addAgent(m.content));document.querySelector('#historyPanel').classList.remove('open')}document.querySelector('#historyNav').onclick=loadHistory;</script>''',
    1,
)


@app.get('/', response_class=HTMLResponse)
def home():
    return HTML


@app.get('/api/history')
def history():
    return {'items': list_history()}


@app.get('/api/history/{session_id}')
def history_detail(session_id: str):
    return {'session_id': session_id, 'messages': get_history(session_id)}


@app.post('/api/chat')
def chat(req: ChatRequest):
    session_id = req.session_id or str(uuid.uuid4())
    session = get_session(session_id)

    with session.call_lock:
        session.reset_sources()
        save_message(session_id, 'user', req.message, req.message)
        result = session.agent(req.message)
        answer = str(result)
        sources = list(session.sources)
        save_message(session_id, 'assistant', answer, sources=sources)

    return {
        'session_id': session_id,
        'answer': answer,
        'sources': sources,
    }
