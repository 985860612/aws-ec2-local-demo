from pathlib import Path
import json
import re

ROOT = Path(__file__).parent.parent
SRC = ROOT / "source_docs" / "ec2_user_guide"
OUT = ROOT / "source_docs" / "processed" / "ec2_chunks.jsonl"
BASE = "https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/"

def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    total = 0
    with OUT.open("w", encoding="utf-8") as writer:
        for path in sorted(SRC.rglob("*.md")):
            if path.stat().st_size == 0:
                continue
            text = path.read_text(encoding="utf-8", errors="ignore")
            # 以 Markdown 标题切片，同时保留页面标题上下文。
            sections = re.split(r"(?m)(?=^#{1,6}\s+)", text)
            page_title = next((line[2:].strip() for line in text.splitlines() if line.startswith("# ")), path.stem)
            for index, section in enumerate(sections):
                section = section.strip()
                if len(section) < 80:
                    continue
                # 过长章节按字符切分，给后续向量检索稳定的上下文长度。
                for part_index in range(0, len(section), 1800):
                    chunk = section[part_index:part_index + 2200].strip()
                    if len(chunk) < 80:
                        continue
                    writer.write(json.dumps({
                        "id": f"{path.stem}-{index}-{part_index}",
                        "title": page_title,
                        "source_file": str(path.relative_to(ROOT)),
                        "source_url": BASE + path.name,
                        "text": chunk,
                    }, ensure_ascii=False) + "\n")
                    total += 1
    print(f"写入 {total} 个知识片段：{OUT}")

if __name__ == "__main__":
    main()
