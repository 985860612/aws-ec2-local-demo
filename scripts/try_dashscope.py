"""用本地 CSV 中的百炼凭证试跑 Embedding + 问答；绝不打印 API Key。"""
import csv, json, os
from pathlib import Path
from openai import OpenAI

KEY_FILE = Path('/Users/wangxiaojie/Downloads/默认业务空间-apiKey-7312314.csv')

def read_config():
    config = {}
    with KEY_FILE.open(encoding='utf-8-sig', newline='') as f:
        for row in csv.reader(f):
            if len(row) >= 2:
                config[row[0].strip()] = row[1].strip()
    return config

def main():
    cfg = read_config()
    key = cfg['apiKey']
    host = cfg['apiHost'].strip().rstrip('/')
    client = OpenAI(api_key=key, base_url=f'https://{host}/compatible-mode/v1')

    docs = [
        'Amazon EC2 实例是 AWS 云中的虚拟服务器。实例类型决定计算、内存、存储和网络资源。',
        'Security Group 是实例级别的虚拟防火墙，控制进出实例的流量，并且是有状态的。',
        'EC2 无法通过 SSH 连接时，应检查实例状态、公网 IP、路由表、Internet Gateway、安全组 22 端口和 sshd 服务。',
    ]
    emb = client.embeddings.create(model='qwen3.7-text-embedding-flash', input=docs)
    print(f'Embedding(qwen3.7-text-embedding-flash) 成功：{len(emb.data)} 条，维度={len(emb.data[0].embedding)}')

    context = '\n\n'.join(f'[资料{i+1}] {text}' for i, text in enumerate(docs))
    answer = client.chat.completions.create(
        model='qwen3.8-flash',
        temperature=0.2,
        messages=[
            {'role': 'system', 'content': '你是 AWS EC2 中文客服，只能根据提供的资料回答；资料不足时明确说明。'},
            {'role': 'user', 'content': f'资料：\n{context}\n\n问题：为什么我的 EC2 无法 SSH 登录？请给出排查顺序。'},
        ],
    )
    print('\nQwen(qwen3.8-flash) 问答结果：\n' + answer.choices[0].message.content)

if __name__ == '__main__':
    main()
