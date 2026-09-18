import csv
import json
import os
import re
import sqlite3
import threading
import uuid
from pathlib import Path

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
KEY_FILE = Path(os.getenv('DASHSCOPE_CREDENTIAL_FILE', '/Users/wangxiaojie/Downloads/默认业务空间-apiKey-7312314.csv'))
DB = ROOT / 'data/qdrant'
HISTORY_DB = ROOT / 'data/history.sqlite3'
COLLECTION = 'aws_ec2_zh_cn'

def config():
    with KEY_FILE.open(encoding='utf-8-sig', newline='') as f:
        return {r[0].strip(): r[1].strip() for r in csv.reader(f) if len(r) >= 2}

cfg = config()
api = OpenAI(api_key=cfg['apiKey'], base_url=f"https://{cfg['apiHost'].rstrip('/')}/compatible-mode/v1")
qdrant = QdrantClient(path=str(DB))
sessions: dict[str, Agent] = {}
lock = threading.Lock()

def init_history():
    HISTORY_DB.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(HISTORY_DB) as conn:
        conn.execute('''CREATE TABLE IF NOT EXISTS conversations (
            session_id TEXT PRIMARY KEY, title TEXT NOT NULL, created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL)''')
        conn.execute('''CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT, session_id TEXT NOT NULL,
            role TEXT NOT NULL, content TEXT NOT NULL, created_at TEXT NOT NULL,
            FOREIGN KEY(session_id) REFERENCES conversations(session_id))''')

init_history()

def save_message(session_id: str, role: str, content: str, title: str = ''):
    import datetime
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    with sqlite3.connect(HISTORY_DB) as conn:
        conn.execute('INSERT OR IGNORE INTO conversations VALUES (?, ?, ?, ?)', (session_id, title or 'AWS 客服对话', now, now))
        if title:
            conn.execute('UPDATE conversations SET title=?, updated_at=? WHERE session_id=?', (title[:80], now, session_id))
        else:
            conn.execute('UPDATE conversations SET updated_at=? WHERE session_id=?', (now, session_id))
        conn.execute('INSERT INTO messages(session_id, role, content, created_at) VALUES (?, ?, ?, ?)', (session_id, role, content, now))

def list_history():
    with sqlite3.connect(HISTORY_DB) as conn:
        conn.row_factory = sqlite3.Row
        return [dict(row) for row in conn.execute('SELECT session_id, title, created_at, updated_at FROM conversations ORDER BY updated_at DESC LIMIT 100')]

def get_history(session_id: str):
    with sqlite3.connect(HISTORY_DB) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute('SELECT role, content, created_at FROM messages WHERE session_id=? ORDER BY id', (session_id,)).fetchall()
        return [dict(row) for row in rows]

@tool
def search_aws_knowledge_base(query: str) -> str:
    """Search the local AWS EC2 official-document knowledge base and return evidence with citations."""
    vector = api.embeddings.create(model='qwen3.7-text-embedding-flash', input=[query]).data[0].embedding
    hits = qdrant.query_points(COLLECTION, query=vector, limit=5, with_payload=True).points
    if not hits or hits[0].score < 0.35:
        return json.dumps({'found': False, 'message': '知识库没有找到足够相关的 AWS 官方资料。'}, ensure_ascii=False)
    return json.dumps({'found': True, 'evidence': [
        {'id': h.payload['id'], 'score': round(h.score, 4), 'title': h.payload['title'], 'text': h.payload['text'],
         'source_file': h.payload['source_file'], 'source_url': h.payload['source_url']} for h in hits
    ]}, ensure_ascii=False)

def new_agent() -> Agent:
    model = OpenAIModel(client_args={'api_key': cfg['apiKey'], 'base_url': f"https://{cfg['apiHost'].rstrip('/')}/compatible-mode/v1"}, model_id='qwen3.8-flash', params={'temperature': 0.2, 'max_tokens': 1800})
    return Agent(model=model, tools=[search_aws_knowledge_base], system_prompt='''
你是 AWS 技术客服 Agent。每次回答 AWS 技术问题前，必须调用 search_aws_knowledge_base。
只能依据工具返回的 AWS 官方资料回答，资料不足时明确说“知识库没有足够依据”，不能编造。
使用中文，回答清晰、可执行。末尾必须列出“引用来源”，包含资料 ID、本地文件和官方链接。
保留对话上下文，支持多轮追问。不要执行任何云资源修改操作。
''')

class ChatRequest(BaseModel):
    session_id: str | None = None
    message: str

app = FastAPI(title='AWS 客服 Agent')
app.add_middleware(CORSMiddleware, allow_origins=['http://localhost:5173','http://127.0.0.1:5173'], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])
app.mount('/assets', StaticFiles(directory=str(ROOT / 'assets')), name='assets')
HTML = (ROOT / 'index.html').read_text(encoding='utf-8')
HTML = re.sub(
    r'<div class="mascot">.*?</div></aside>',
    '<div class="mascot"><img src="/assets/ai-dlc-mascot.png" alt="AI-DLC 先锋创造营"><div class="brand-cn">AI-DLC 先锋创造营</div><div class="brand-en">Start Your Journey as a Pioneer</div></div></aside>',
    HTML,
    count=1,
    flags=re.DOTALL,
)
HTML = HTML.replace('.ghost{font-size:90px;filter:drop-shadow(0 0 18px #7d43ff);margin-bottom:8px}', '.mascot img{display:block;width:205px;max-width:100%;height:auto;margin:0 auto;filter:drop-shadow(0 0 18px #7d43ff)}')
HTML = HTML.replace('</style>', '.brand-cn{color:#a45cff;font-size:16px;font-weight:800;margin-top:4px}.brand-en{color:#aeb0c9;font-size:11px;margin-top:5px}</style>')
HTML = HTML.replace('</style>', '.nav,.send,.badge,.source,.history-item{cursor:pointer}.nav:active,.send:active{transform:scale(.98)}</style>')
HTML = HTML.replace(
    '<div class="nav"><span>◷</span>历史记录</div>',
    '<div class="nav" id="historyNav"><span>◷</span>历史记录</div><div id="historyPanel" class="history-panel"></div>',
)
HTML = HTML.replace('</style>', '.history-panel{display:none;margin:0 8px 8px;background:#171a2d;border:1px solid #2d3150;border-radius:10px;max-height:220px;overflow:auto}.history-panel.open{display:block}.history-item{padding:10px 12px;color:#c6c7dc;font-size:12px;border-bottom:1px solid #292c47;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.history-item:hover{background:#29214b;color:white}</style>')
HTML = HTML.replace('</script>', ''';async function loadHistory(){const p=document.querySelector('#historyPanel');p.classList.toggle('open');if(!p.classList.contains('open'))return;const d=await fetch('/api/history').then(r=>r.json());p.innerHTML=d.items.length?d.items.map(x=>`<div class="history-item" data-id="${x.session_id}">${x.title}</div>`).join(''):'<div class="history-item">暂无历史记录</div>';p.querySelectorAll('[data-id]').forEach(x=>x.onclick=()=>restoreHistory(x.dataset.id))}async function restoreHistory(id){const d=await fetch('/api/history/'+id).then(r=>r.json());sid=id;chat.innerHTML='';d.messages.forEach(m=>m.role==='user'?addUser(m.content):addAgent(m.content));document.querySelector('#historyPanel').classList.remove('open')}document.querySelector('#historyNav').onclick=loadHistory;</script>''', 1)

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
    sid = req.session_id or str(uuid.uuid4())
    with lock:
        agent = sessions.setdefault(sid, new_agent())
    save_message(sid, 'user', req.message, req.message)
    result = agent(req.message)
    vector = api.embeddings.create(model='qwen3.7-text-embedding-flash', input=[req.message]).data[0].embedding
    hits = qdrant.query_points(COLLECTION, query=vector, limit=5, with_payload=True).points
    sources = [{'id': h.payload['id'], 'score': round(h.score, 4), 'title': h.payload['title'], 'source_file': h.payload['source_file'], 'source_url': h.payload['source_url']} for h in hits]
    answer = str(result)
    save_message(sid, 'assistant', answer)
    return {'session_id': sid, 'answer': answer, 'sources': sources}
