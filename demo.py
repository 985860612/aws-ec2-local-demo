"""最小本地 RAG 检索 demo：文档向量化、持久化、相似度搜索。"""
from pathlib import Path
import json
import numpy as np
from sentence_transformers import SentenceTransformer

ROOT = Path(__file__).parent
INDEX = ROOT / "index.npz"
META = ROOT / "metadata.json"

DOCS = [
    ("ec2-basics", "EC2 实例是 AWS 云中的虚拟服务器。启动实例时需要选择 AMI、实例类型、密钥对和网络配置。实例类型决定计算、内存、存储和网络性能。"),
    ("security-group", "Security Group 是实例级别的虚拟防火墙，控制进出实例的流量。它是有状态的，只需要允许请求方向的流量，返回流量会自动允许。"),
    ("network-acl", "Network ACL 是子网级别的防火墙，控制进出子网的流量。它是无状态的，入站和出站规则需要分别配置。规则按编号从小到大匹配。"),
    ("ebs", "Amazon EBS 为 EC2 提供持久化块存储。gp3 是通用型 SSD，适合大多数工作负载；io2 适合需要更高 IOPS 和更高持久性的关键业务。"),
    ("ssh-troubleshooting", "EC2 无法通过 SSH 连接时，应检查实例运行状态、系统状态检查、公网 IP、路由表、Internet Gateway、Security Group 的 22 端口和操作系统中的 sshd 服务。"),
]
MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"

model = SentenceTransformer(MODEL_NAME)


def build_index(model: SentenceTransformer) -> None:
    texts = [text for _, text in DOCS]
    embeddings = model.encode(texts, normalize_embeddings=True, show_progress_bar=False)
    np.savez_compressed(INDEX, embeddings=np.asarray(embeddings, dtype=np.float32))
    META.write_text(json.dumps([{"id": i, "title": t, "text": x} for i, (t, x) in enumerate(DOCS)], ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"已向量化 {len(DOCS)} 条文档，维度={embeddings.shape[1]}，写入 {INDEX.name}")


def search(model: SentenceTransformer, query: str, top_k: int = 3) -> None:
    for item in search_items(model, query, top_k):
        print(f"\n[{item['score']:.4f}] {item['title']}\n{item['text']}")

def search_items(model: SentenceTransformer, query: str, top_k: int = 3) -> list[dict]:
    if not INDEX.exists() or not META.exists():
        build_index(model)
    embeddings = np.load(INDEX)["embeddings"]
    metadata = json.loads(META.read_text(encoding="utf-8"))
    q = model.encode([query], normalize_embeddings=True)[0]
    scores = embeddings @ q
    results = []
    for rank in np.argsort(-scores)[:top_k]:
        item = metadata[int(rank)]
        results.append({"score": round(float(scores[rank]), 4), "title": item["title"], "text": item["text"]})
    return results


if __name__ == "__main__":
    print(f"加载本地 Embedding 模型：{MODEL_NAME}")
    question = input("请输入 AWS/EC2 问题（直接回车使用示例）：").strip() or "为什么我的 EC2 无法 SSH 登录？"
    search(model, question)
