# AWS 客服 Agent 部署说明

## 线上地址

```text
https://aws.100c.fun
```

DNS：`aws.100c.fun A 101.200.39.48`

## 架构

```text
浏览器 → HTTPS/Nginx(101.200.39.48) → Tailscale → Mac mini(100.112.98.4:8000)
                                                ↓
                               Strands + Qdrant + Qwen 云接口
```

## Mac mini 运行

项目目录：`/Users/wangxiaojie/services/aws-agent`

```bash
cd /Users/wangxiaojie/services/aws-agent
DASHSCOPE_CREDENTIAL_FILE=/Users/wangxiaojie/services/aws-agent/.dashscope.csv \
  nohup ./run_web.sh > server.log 2>&1 < /dev/null &
curl -I http://127.0.0.1:8000/
tail -f /Users/wangxiaojie/services/aws-agent/server.log
```

## 本地运行

```bash
cd /Users/wangxiaojie/aws-ec2-local-demo
./run_web.sh
```

访问 `http://127.0.0.1:8000`。

## 知识库

Qdrant 数据目录：`data/qdrant/`

集合：`aws_ec2_zh_cn`，当前包含 5161 条 EC2 官方文档向量。

更新文档并重新向量化：

```bash
./scripts/fetch_aws_ec2_docs.sh
uv run scripts/build_chunks.py
uv run --with openai --with qdrant-client python scripts/index_qdrant_dashscope.py
```

向量模型：`qwen3.7-text-embedding-flash`；问答模型：`qwen3.8-flash`。向量化脚本支持断点续跑。

## 凭证

API Key 不写入代码。通过环境变量指定凭证 CSV，并限制权限：

```bash
export DASHSCOPE_CREDENTIAL_FILE=/path/to/credentials.csv
chmod 600 /path/to/credentials.csv
```

## Nginx / HTTPS

网关配置：`/etc/nginx/sites-available/aws.100c.fun`。前后端已分流：React 静态构建由 Mac mini 的 `100.112.98.4:5173` 提供，`/api/` 转发到 FastAPI `100.112.98.4:8000`。

证书：`/etc/letsencrypt/live/aws.100c.fun/fullchain.pem` 和 `privkey.pem`，Certbot 已配置自动续期。

修改后：

```bash
nginx -t && nginx -s reload
```

## 更新部署

前端构建：

```bash
cd frontend
npm install
npm run build
```

将 `frontend/dist` 同步到 Mac mini 后启动静态服务：

```bash
cd /Users/wangxiaojie/services/aws-agent
nohup /usr/bin/python3 -m http.server 5173 --bind 0.0.0.0 \
  --directory /Users/wangxiaojie/services/aws-agent/frontend/dist \
  > frontend.log 2>&1 < /dev/null &
```

使用 `remote-dir-sync` 同步到 `/Users/wangxiaojie/services/aws-agent`，再重启：

```bash
ssh wangxiaojie@100.112.98.4 'pkill -f "services/aws-agent/run_web.sh" 2>/dev/null || true; pkill -f "uvicorn.*8000" 2>/dev/null || true; cd /Users/wangxiaojie/services/aws-agent && DASHSCOPE_CREDENTIAL_FILE=/Users/wangxiaojie/services/aws-agent/.dashscope.csv nohup ./run_web.sh > server.log 2>&1 < /dev/null &'
```

## 验收

```bash
curl -I https://aws.100c.fun
curl -s https://aws.100c.fun/api/chat \
  -H 'content-type: application/json' \
  -d '{"message":"EC2 是什么？"}'
```

预期 HTTPS 返回 `200`，API 返回 `session_id`、回答和引用来源。

## 回滚与排障

Nginx 备份：`/etc/nginx/sites-available/aws.100c.fun.bak.*`。

```bash
tail -100 /Users/wangxiaojie/services/aws-agent/server.log
nginx -t && nginx -s reload
```
