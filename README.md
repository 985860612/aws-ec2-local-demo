# AWS EC2 中文客服 Agent

基于 AWS EC2 中文官方文档的 RAG 客服应用。本地保存官方文档、Qdrant 向量库和会话历史，使用 DashScope Qwen 云接口完成向量化和回答生成。

线上演示：[https://aws.100c.fun](https://aws.100c.fun)

## 功能

- AWS EC2 中文官方文档检索与阅读
- 本地 Qdrant 语义检索
- Qwen 云端问答和引用生成
- Markdown 回答与官方文档引用卡片
- 会话历史记录
- 知识库目录、搜索和文档内问答
- 非 AWS 问题意图限制
- React 设置面板和响应式界面

## 技术架构

```text
React + Vite
      │ /api
      ▼
FastAPI + Strands Agents
      ├── Qdrant（本地向量库）
      ├── SQLite（本地历史记录）
      └── DashScope
          ├── qwen3.7-text-embedding-flash
          └── qwen3.8-flash
```

生产环境由公网 Nginx 提供 HTTPS，通过 Tailscale 转发至 Mac mini：

```text
/       → 100.112.98.4:5173
/api/   → 100.112.98.4:8000
```

## 目录结构

```text
frontend/                 React 前端
web_demo.py               FastAPI 与 Agent 入口
knowledge_base.py         文档目录、搜索和正文 API
scripts/                  文档下载、切片和向量化脚本
source_docs/              AWS EC2 中文官方文档
data/qdrant/              Qdrant 本地数据
data/history.sqlite3      会话历史
deploy/                   Nginx 配置
DEPLOYMENT.md             部署说明
DEVELOPMENT_FLOW.md       开发流程
AGENTS.md                 项目开发约定
```

## 环境要求

- macOS 或 Linux
- Python 3.10+
- `uv`
- Node.js 与 npm
- DashScope API Key

凭证 CSV 不进入仓库：

```bash
export DASHSCOPE_CREDENTIAL_FILE=/path/to/credentials.csv
chmod 600 "$DASHSCOPE_CREDENTIAL_FILE"
```

## 本地运行

启动后端：

```bash
./run_web.sh
```

启动前端：

```bash
npm --prefix frontend install
npm --prefix frontend run dev
```

访问 `http://127.0.0.1:5173`，Vite 会将 `/api` 代理到 `127.0.0.1:8000`。

生产构建：

```bash
npm --prefix frontend run build
```

## 获取并索引文档

```bash
./scripts/fetch_aws_ec2_docs.sh
uv run scripts/build_chunks.py
uv run --with openai --with qdrant-client python scripts/index_qdrant_dashscope.py
```

Qdrant 集合名称：`aws_ec2_zh_cn`。

## 主要 API

```text
POST /api/chat
GET  /api/history
GET  /api/history/{session_id}
GET  /api/knowledge
GET  /api/knowledge/search?q=...
GET  /api/knowledge/documents/{doc_id}
```

## 验证

```bash
uv run python -m py_compile web_demo.py knowledge_base.py
npm --prefix frontend run build
curl -fsS http://127.0.0.1:8000/api/knowledge
```

部署与故障排查参见 [DEPLOYMENT.md](DEPLOYMENT.md)，完整实现过程参见 [DEVELOPMENT_FLOW.md](DEVELOPMENT_FLOW.md)。
