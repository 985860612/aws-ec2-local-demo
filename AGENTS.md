# AGENTS.md

## 项目定位

这是一个 AWS EC2 中文知识库客服 Agent。文档与 Qdrant 数据保存在本地，Embedding 和问答调用 DashScope Qwen 云接口。前端为 React + Vite，后端为 FastAPI + Strands Agents。

## 开发约定

- Python 依赖和命令统一使用 `uv`，禁止直接向系统 Python 执行 `pip install`。
- 前端位于 `frontend/`，生产构建输出到 `frontend/dist/`。
- 后端入口是 `web_demo.py`，业务 API 使用 `/api/` 前缀。
- 知识库浏览接口集中在 `knowledge_base.py`。
- 文档位于 `source_docs/ec2_user_guide/`，Qdrant 数据位于 `data/qdrant/`。
- API Key 不得提交，只能通过 `DASHSCOPE_CREDENTIAL_FILE` 指定凭证文件。
- 不得提交 `node_modules/`、Qdrant 数据、SQLite 运行数据或凭证。
- 回答必须基于 AWS 官方资料；非 AWS 问题应礼貌拒绝。
- 保持回答引用编号与右侧来源卡片一致。

## 验证命令

```bash
uv run python -m py_compile web_demo.py knowledge_base.py
npm --prefix frontend install
npm --prefix frontend run build
```

本地启动：

```bash
DASHSCOPE_CREDENTIAL_FILE=/path/to/credentials.csv ./run_web.sh
npm --prefix frontend run dev
```

接口验收：

```bash
curl -fsS http://127.0.0.1:8000/api/history
curl -fsS http://127.0.0.1:8000/api/knowledge
curl -fsS http://127.0.0.1:8000/api/knowledge/documents/concepts
```

## 部署边界

- Mac mini 项目路径：`/Users/wangxiaojie/services/aws-agent`
- FastAPI：`100.112.98.4:8000`
- React 静态服务：`100.112.98.4:5173`
- 公网地址：`https://aws.100c.fun`
- 同步时排除 `node_modules`、`source_docs`、`data/qdrant`、`.git` 和凭证。
- 重启前精确确认监听端口的 PID，禁止使用宽泛的 `pkill -f`。
- 部署后验证首页、`/api/knowledge` 和一篇具体文档。

## Git

- 使用 conventional commits：`feat`、`fix`、`refactor`、`docs`、`chore`、`perf`。
- 不覆盖用户未提交的修改，不自动 push。
- `frontend/src/KnowledgeBase.jsx` 的默认文档必须为 `concepts`。

