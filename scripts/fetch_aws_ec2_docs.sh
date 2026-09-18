#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/source_docs/raw"
mkdir -p "$OUT"

BASE="https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide"
pages=(
  "concepts"
  "Instances"
  "instance-types"
  "EC2_GetStarted"
  "ec2-security-groups"
)

for page in "${pages[@]}"; do
  echo "下载 $page.md"
  wget -q --show-progress -O "$OUT/$page.md" "$BASE/$page.md"
done

echo "文档已保存到 $OUT"
