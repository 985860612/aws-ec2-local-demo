import csv, json
from pathlib import Path
from openai import OpenAI
from qdrant_client import QdrantClient

ROOT = Path(__file__).parent.parent
KEY_FILE = Path('/Users/wangxiaojie/Downloads/默认业务空间-apiKey-7312314.csv')
DB = ROOT / 'data/qdrant'
COLLECTION = 'aws_ec2_zh_cn'

def config():
    with KEY_FILE.open(encoding='utf-8-sig', newline='') as f:
        return {r[0].strip(): r[1].strip() for r in csv.reader(f) if len(r) >= 2}

def main():
    cfg = config()
    api = OpenAI(api_key=cfg['apiKey'], base_url=f"https://{cfg['apiHost'].rstrip('/')}/compatible-mode/v1")
    question = '为什么我的 EC2 无法通过 SSH 登录？请给出排查顺序。'
    q = api.embeddings.create(model='qwen3.7-text-embedding-flash', input=[question]).data[0].embedding
    db = QdrantClient(path=str(DB))
    hits = db.query_points(COLLECTION, query=q, limit=5, with_payload=True).points
    context = '\n\n'.join(
        f"[资料{i+1}] {h.payload['text']}\n"
        f"来源文件：{h.payload['source_file']}\n"
        f"官方链接：{h.payload['source_url']}\n"
        f"片段ID：{h.payload['id']}"
        for i, h in enumerate(hits)
    )
    answer = api.chat.completions.create(model='qwen3.8-flash', temperature=0.2, messages=[
        {'role':'system','content':'你是 AWS EC2 中文客服。只能根据资料回答；资料不足时明确说明。回答末尾列出引用来源，引用必须包含资料编号、source_file 和官方链接。'},
        {'role':'user','content':f'资料：\n{context}\n\n问题：{question}'},
    ]).choices[0].message.content
    print(answer)
    print('\n--- 命中的来源 ---')
    for h in hits:
        print(f"{h.score:.4f} {h.payload['id']} {h.payload['source_file']} {h.payload['source_url']}")

if __name__ == '__main__':
    main()
