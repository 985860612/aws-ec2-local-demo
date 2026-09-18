import csv
import json
import os
import re
import threading
import uuid
from pathlib import Path

from fastapi import FastAPI
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
COLLECTION = 'aws_ec2_zh_cn'

def config():
    with KEY_FILE.open(encoding='utf-8-sig', newline='') as f:
        return {r[0].strip(): r[1].strip() for r in csv.reader(f) if len(r) >= 2}

cfg = config()
api = OpenAI(api_key=cfg['apiKey'], base_url=f"https://{cfg['apiHost'].rstrip('/')}/compatible-mode/v1")
qdrant = QdrantClient(path=str(DB))
sessions: dict[str, Agent] = {}
lock = threading.Lock()

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

@app.get('/', response_class=HTMLResponse)
def home():
    return HTML

@app.post('/api/chat')
def chat(req: ChatRequest):
    sid = req.session_id or str(uuid.uuid4())
    with lock:
        agent = sessions.setdefault(sid, new_agent())
    result = agent(req.message)
    vector = api.embeddings.create(model='qwen3.7-text-embedding-flash', input=[req.message]).data[0].embedding
    hits = qdrant.query_points(COLLECTION, query=vector, limit=5, with_payload=True).points
    sources = [{'id': h.payload['id'], 'score': round(h.score, 4), 'title': h.payload['title'], 'source_file': h.payload['source_file'], 'source_url': h.payload['source_url']} for h in hits]
    return {'session_id': sid, 'answer': str(result), 'sources': sources}
