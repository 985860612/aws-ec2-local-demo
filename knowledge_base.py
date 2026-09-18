"""Read-only local EC2 documentation catalog, independent of model credentials."""
import json
import re
from functools import lru_cache
from pathlib import Path
from urllib.parse import quote

from fastapi import APIRouter, HTTPException, Query

DOCS = Path(__file__).parent / 'source_docs' / 'ec2_user_guide'
BASE_URL = 'https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/'
router = APIRouter(prefix='/api/knowledge', tags=['knowledge'])
GROUPS = [
    ('getting-started', '快速入门', ['concepts', 'EC2_GetStarted', 'ec2-best-practices']),
    ('instances', '实例与镜像', ['AMIs', 'Instances', 'Fleets']),
    ('network', '连接与网络', ['ec2-networking']),
    ('security', '安全与权限', ['ec2-security']),
    ('storage', '存储', ['Storage']),
    ('monitoring', '监控与排障', ['monitoring_ec2', 'ec2-instance-troubleshoot']),
    ('resources', '资源管理', ['resources']),
    ('reference', '其他参考', ['DocumentHistory']),
]


def plain(text):
    text = re.sub(r'<[^>]*>', '', text)
    text = re.sub(r'!?\[([^\]]*)\]\([^)]*\)', r'\1', text)
    return re.sub(r'\s+', ' ', re.sub(r'[#*`_]', '', text)).strip()


@lru_cache(maxsize=1)
def catalog():
    documents = {}
    for path in sorted(DOCS.glob('*.md')):
        if path.is_symlink():
            continue
        text = path.read_text(encoding='utf-8')
        match = re.search(r'^#\s+(.+)', text, re.M)
        title = plain(match[1]) if match else path.stem
        summary = plain(re.sub(r'^#\s+.*$', '', text, count=1, flags=re.M))[:140]
        documents[path.stem] = dict(id=path.stem, title=title, summary=summary,
                                   filename=path.name, content=text)
    toc_path = DOCS / 'toc-contents.json'
    roots = json.loads(toc_path.read_text(encoding='utf-8'))['contents'] if toc_path.exists() else []
    assigned = set()

    def node(entry, group):
        doc_id = Path(entry.get('href', '').split('#')[0]).stem
        children = [item for child in entry.get('contents', []) if (item := node(child, group))]
        if doc_id not in documents:
            return dict(id=None, title=entry['title'], children=children) if children else None
        assigned.add(doc_id)
        documents[doc_id].setdefault('group', group)
        return dict(id=doc_id, title=entry['title'], children=children)

    groups = []
    for group_id, title, root_ids in GROUPS:
        children = [item for entry in roots if Path(entry.get('href', '')).stem in root_ids
                    if (item := node(entry, group_id))]
        groups.append(dict(id=group_id, title=title, children=children))
    for doc_id, doc in documents.items():
        if doc_id not in assigned:
            doc['group'] = 'reference'
            groups[-1]['children'].append(dict(id=doc_id, title=doc['title'], children=[]))
    return documents, groups


def get_document(doc_id):
    # Catalog lookup, never concatenate an untrusted ID into a filesystem path.
    documents, _ = catalog()
    if doc_id not in documents:
        raise HTTPException(status_code=404, detail='文档不存在')
    return {**documents[doc_id], 'source_url': BASE_URL + quote(doc_id) + '.html'}


@router.get('')
def list_documents():
    documents, groups = catalog()
    return {'total': len(documents), 'groups': groups,
            'documents': [{k: v for k, v in doc.items() if k != 'content'} for doc in documents.values()]}


@router.get('/search')
def search_documents(q: str = Query('', max_length=200)):
    terms = q.casefold().split()
    if not terms:
        return {'total': 0, 'items': []}
    results = []
    for doc in catalog()[0].values():
        title = doc['title'].casefold()
        body = doc['content'].casefold()
        haystack = title + ' ' + doc['id'].casefold() + ' ' + body
        if not all(term in haystack for term in terms):
            continue
        score = sum(20 * (term in title) + 10 * (term in doc['id'].casefold()) for term in terms)
        pos = body.find(terms[0])
        snippet = plain(doc['content'][max(0, pos - 45):max(0, pos - 45) + 230])
        results.append((score, {k: v for k, v in doc.items() if k != 'content'} | {'summary': snippet}))
    results.sort(key=lambda row: (-row[0], row[1]['title']))
    return {'total': len(results), 'items': [row[1] for row in results[:60]]}


@router.get('/documents/{doc_id}')
def document_detail(doc_id: str):
    return get_document(doc_id)


def document_context(doc_id, question, limit=22000):
    """Always include the introduction; select relevant sections for long articles."""
    doc = get_document(doc_id)
    sections = re.split(r'(?m)(?=^#{1,6}\s)', doc['content'])
    terms = re.findall(r'[a-z0-9_-]+|[\u4e00-\u9fff]{2}', question.casefold())
    ranked = sorted(enumerate(sections), key=lambda row: (-sum(row[1].casefold().count(t) for t in terms), row[0]))
    selected = {0: sections[0], 1: sections[1] if len(sections) > 1 else ''}
    used = sum(len(s) for s in selected.values())
    for index, section in ranked:
        if index not in selected and used < limit:
            selected[index] = section[:limit-used]
            used += len(selected[index])
    return '\n'.join(selected[i] for i in sorted(selected))[:limit]
