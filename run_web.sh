#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
UV_BIN="$(command -v uv 2>/dev/null || true)"
UV_BIN="${UV_BIN:-$HOME/.local/bin/uv}"
exec "$UV_BIN" run --with fastapi --with uvicorn --with openai --with qdrant-client --with strands-agents --with 'strands-agents[openai]' uvicorn web_demo:app --host 0.0.0.0 --port 8000
