# AWS EC2 本地向量化 Demo

这个 demo 不调用 AWS、Bedrock 或云端向量数据库：首次运行会下载一个多语言 Embedding 模型，之后用本地模型把 5 条 EC2 知识向量化，并用余弦相似度检索。

```bash
cd /Users/wangxiaojie/aws-ec2-local-demo
uv run --with sentence-transformers --with numpy demo.py
```

首次运行会下载模型（约数百 MB），模型缓存后可离线运行。生成的 `index.npz` 和 `metadata.json` 是本地索引。后续只需把 `DOCS` 替换为清洗后的 AWS 文档切片即可。

## Web Demo

```bash
uv run --with fastapi --with uvicorn --with sentence-transformers --with numpy \
  uvicorn web_demo:app --host 127.0.0.1 --port 8000
```

浏览器打开 http://127.0.0.1:8000

## 获取 AWS EC2 中文文档

AWS 文档页面提供对应的 Markdown 版本，因此直接下载 `.md` 比抓 HTML 更适合建知识库：

```bash
./scripts/fetch_aws_ec2_docs.sh
```

原始文档保存到 `source_docs/raw/`，保留官方链接和 Markdown 格式，下一步可直接切片并写入 Qdrant。
