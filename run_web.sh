#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
exec uv run --with fastapi --with uvicorn --with openai --with qdrant-client --with strands-agents --with 'strands-agents[openai]' uvicorn web_demo:app --host 127.0.0.1 --port 8000
