import csv, json, hashlib, time
from pathlib import Path
from openai import OpenAI
from qdrant_client import QdrantClient, models

ROOT = Path(__file__).parent.parent
KEY_FILE = Path('/Users/wangxiaojie/Downloads/默认业务空间-apiKey-7312314.csv')
CHUNKS = ROOT / 'source_docs/processed/ec2_chunks.jsonl'
DB = ROOT / 'data/qdrant'
COLLECTION = 'aws_ec2_zh_cn'
BATCH = 20  # DashScope embedding API maximum batch size

def config():
    with KEY_FILE.open(encoding='utf-8-sig', newline='') as f:
        return {r[0].strip(): r[1].strip() for r in csv.reader(f) if len(r) >= 2}

def main():
    cfg = config()
    client = OpenAI(api_key=cfg['apiKey'], base_url=f"https://{cfg['apiHost'].rstrip('/')}/compatible-mode/v1")
    chunks = [json.loads(line) for line in CHUNKS.open(encoding='utf-8') if line.strip()]
    db = QdrantClient(path=str(DB))
    if db.collection_exists(COLLECTION):
        existing = db.count(COLLECTION, exact=True).count
        print(f'检测到已有 {existing} 条，断点续跑')
    else:
        db.create_collection(COLLECTION, vectors_config=models.VectorParams(size=1024, distance=models.Distance.COSINE))
        existing = 0
    total = existing
    for start in range(existing, len(chunks), BATCH):
        batch = chunks[start:start+BATCH]
        response = client.embeddings.create(model='qwen3.7-text-embedding-flash', input=[x['text'] for x in batch])
        points = []
        for item, vector in zip(batch, response.data):
            point_id = hashlib.sha1(item['id'].encode()).hexdigest()[:32]
            points.append(models.PointStruct(id=point_id, vector=vector.embedding, payload=item))
        db.upsert(COLLECTION, points=points)
        total += len(points)
        if total % 320 == 0 or total == len(chunks):
            print(f'已写入 {total}/{len(chunks)}')
    print(f'完成：{total} 条向量，Qdrant 本地目录：{DB}')

if __name__ == '__main__':
    main()
