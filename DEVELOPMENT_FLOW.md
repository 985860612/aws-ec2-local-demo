# AWS 客服 Agent 开发流程

## 1. 项目目标

构建一个面向 AWS EC2 的中文客服 Agent：

- 使用 AWS 官方文档作为知识库
- 本地运行 Qdrant 向量数据库
- 使用通义千问云端模型
- 支持引用来源和历史记录
- 使用 React 构建前端
- 通过 Tailscale 和公网 Nginx 对外提供服务

公网地址：`https://aws.100c.fun`

## 2. 文档获取

数据源为 AWS EC2 中文官方文档：

`https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/concepts.html`

文档下载并清洗后保存在：

```text
source_docs/
```

## 3. 向量知识库

Qdrant 本地数据目录：

```text
data/qdrant/
```

集合名称：`aws_ec2_zh_cn`

知识处理流程：

```text
AWS 官方文档 → 清洗 → 文本切分 → DashScope Embedding → Qdrant → 相似度检索
```

当前使用的模型：

```text
向量模型：qwen3.7-text-embedding-flash
问答模型：qwen3.8-flash
```

大模型不在本地部署，仅在本地保存向量数据，模型通过 DashScope 云端 API 调用。

## 4. 后端

后端使用 FastAPI，主要接口：

```text
GET  /
POST /api/chat
GET  /api/history
GET  /api/history/{session_id}
```

问答流程：

```text
用户问题 → 问题向量化 → Qdrant 检索 → 拼接上下文 → Qwen 生成 → 回答与引用
```

历史记录保存在：

```text
data/history.sqlite3
```

API Key 通过凭证文件配置，不写入代码：

```bash
export DASHSCOPE_CREDENTIAL_FILE=/path/to/credentials.csv
chmod 600 /path/to/credentials.csv
```

## 5. React 前端

前端目录：

```text
frontend/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── style.css
│   ├── markdown.css
│   ├── markdown-overrides.css
│   └── scrollbar.css
└── dist/
```

当前前端功能：

- Kiro 风格深色界面
- AWS 客服对话
- 历史记录
- 引用来源
- 知识库检索过程
- Markdown 标题、列表、代码块、表格和链接渲染
- 设置面板
- 自定义深色滚动条
- AI-DLC 吉祥物

本地开发：

```bash
cd frontend
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 6. 设置功能

设置面板包含：

- 问答模型和向量模型展示
- 检索 Top-K 配置
- 显示或隐藏引用来源
- 显示或隐藏检索过程
- 开启或关闭历史记录自动保存
- API、Qdrant 和知识库状态

浏览器设置使用 `localStorage` 保存，不修改服务器端密钥。

## 7. 部署架构

```text
浏览器
  ↓
aws.100c.fun
  ↓
公网 Nginx 网关
  ├── /       → Mac mini:5173 React 静态页面
  └── /api/   → Mac mini:8000 FastAPI
```

Mac mini 的 Tailscale 地址：`100.112.98.4`

React 静态页面：`100.112.98.4:5173`

FastAPI：`100.112.98.4:8000`

## 8. 前端部署

本地构建：

```bash
cd frontend
npm install
npm run build
```

将 `frontend/dist` 同步到 Mac mini：

```text
/Users/wangxiaojie/services/aws-agent/frontend/dist
```

Mac mini 启动静态服务：

```bash
cd /Users/wangxiaojie/services/aws-agent
nohup /usr/bin/python3 -m http.server 5173 \
  --bind 0.0.0.0 \
  --directory /Users/wangxiaojie/services/aws-agent/frontend/dist \
  > frontend.log 2>&1 < /dev/null &
```

## 9. 后端部署

```bash
cd /Users/wangxiaojie/services/aws-agent

DASHSCOPE_CREDENTIAL_FILE=/Users/wangxiaojie/services/aws-agent/.dashscope.csv \
nohup ./run_web.sh > server.log 2>&1 < /dev/null &
```

后端监听 `0.0.0.0:8000`。

## 10. Nginx 和 HTTPS

Nginx 配置：

```text
/etc/nginx/sites-available/aws.100c.fun
```

证书：

```text
/etc/letsencrypt/live/aws.100c.fun/fullchain.pem
/etc/letsencrypt/live/aws.100c.fun/privkey.pem
```

修改 Nginx 后验证：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 11. 验收

```bash
curl -I https://aws.100c.fun
curl -s https://aws.100c.fun/api/history
```

预期结果：

- 首页返回 React 构建页面
- `/api/history` 返回历史会话列表
- `/api/chat` 返回回答、`session_id` 和引用来源

## 12. 当前完成状态

系统已经完成：

- AWS EC2 官方文档知识库
- 本地 Qdrant 向量存储
- Qwen 云端向量模型和问答模型
- FastAPI 后端
- React 前端
- 前后端分离部署
- Tailscale 内网连接
- 公网 HTTPS
- 历史记录
- 引用来源
- Markdown 渲染
- 设置面板
- 自定义滚动条
- Mac mini 服务运行


## 13. 知识库阅读页面

React 侧边栏的“知识库”打开文档阅读页，支持主题树、全文关键词搜索、
Markdown 表格与代码、章节跳转、文档内链、官方原文和选定文档提问。
目录和正文独立滚动；目录可收起，手机端默认收起。

数据来自 `source_docs/ec2_user_guide/*.md`，层级来自同目录的
`toc-contents.json`。目录数量从文件实际统计；不表示向量索引状态。
目录在服务进程内缓存，更新文档后重启后端生效。文档插图使用原文的 AWS 图片链接。

新增只读接口：

- `GET /api/knowledge`：文档摘要与主题树。
- `GET /api/knowledge/search?q=关键词`：标题、文件名、正文关键词搜索，最多返回 60 条。
- `GET /api/knowledge/documents/{doc_id}`：正文和官方链接。

浏览地址：`http://localhost:5173/?view=knowledge&doc=ec2-security-groups`。
运行方式沿用前端 Vite 与后端 FastAPI；生产部署需要同时更新前后端文件，
包括新增的 `knowledge_base.py`。无需重新生成向量索引。

`POST /api/chat` 接受可选 `document_id`。服务端从受控目录加载参考正文，
长文档按问题相关章节节选，并将选定文档加入引用来源。
前端“基于此文提问”只选择上下文，不会自动发送问题。
模型客户端与 Qdrant 在首次问答时初始化，因此仅浏览知识库无需模型凭证。

验证：`python -m unittest discover -s tests -v`（在项目虚拟环境中运行），
以及 `cd frontend && npm run build`。
