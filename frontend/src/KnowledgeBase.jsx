import React, {useEffect, useMemo, useRef, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './knowledge.css';

const OFFICIAL = 'https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/';
async function read(path, signal) {
  const response = await fetch(path, {signal});
  if (!response.ok) throw new Error(response.status === 404 ? '未找到这篇文档，请从目录重新选择。' : '文档服务暂时不可用，请稍后重试。');
  return response.json();
}
export function Icon({name = 'book', size = 20}) {
  const paths = {
    book: 'M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Zm0 0v15',
    search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
    arrow: 'M5 12h14m-6-6 6 6-6 6',
    chevron: 'm9 5 7 7-7 7',
    panel: 'M3 4h18v16H3zM9 4v16M5 8h2m-2 4h2',
    file: 'M14 2H5v20h14V7l-5-5Zm0 0v6h5M8 12h8m-8 4h8',
    external: 'M14 3h7v7m0-7L10 14m0-10H3v17h17v-7',
    shield: 'm12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z',
    server: 'M3 3h18v7H3zM3 14h18v7H3zM6 6h1m-1 11h1',
    network: 'M9 2h6v6H9zM2 16h6v6H2zM16 16h6v6h-6zM12 8v4M5 16v-4h14v4',
    chart: 'M3 3v18h18M6 15l4-5 4 3 6-8',
    copy: 'M8 8h13v13H8zM16 8V3H3v13h5',
    close: 'm6 6 12 12M6 18 18 6',
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.book}/></svg>;
}

// Preserve AWS named anchors without rendering untrusted raw HTML.
function prepareMarkdown(text) {
  const lines = text.split('\n'), headings = [];
  let inCode = false;
  const markdown = lines.map((line, index) => {
    if (/^\s*(```|~~~)/.test(line)) inCode = !inCode;
    const heading = !inCode && /^(#{1,6})\s+(.+)/.exec(line);
    if (heading) {
      const anchor = /^\s*<a\s+name="([^"]+)"\s*>\s*<\/a>/.exec(lines[index + 1] || '');
      headings.push({depth: heading[1].length, title: heading[2].replace(/[*`]/g, ''), id: anchor?.[1] || `section-${headings.length}`});
    }
    return inCode ? line : line.replace(/<a\s+name="[^"]+"\s*>\s*<\/a>/g, '');
  }).join('\n');
  function headingIds() {
    return tree => {
      let index = 0;
      function visit(node) {
        if (node.type === 'heading') {
          node.data = {...node.data, hProperties: {id: headings[index++]?.id}};
        }
        node.children?.forEach(visit);
      }
      visit(tree);
    };
  }
  return {markdown, headings, headingIds};
}
function ancestors(nodes, target, trail = []) {
  for (const node of nodes) {
    const next = [...trail, node.id];
    if (node.id === target) return next;
    const match = ancestors(node.children || [], target, next);
    if (match) return match;
  }
  return null;
}
function TreeNode({node, selected, expanded, toggle, navigate, depth = 0}) {
  const hasChildren = node.children.length > 0;
  return <li>
    <div className={`kb-tree-row ${selected === node.id ? 'is-selected' : ''}`}>
      {hasChildren ? <button className="kb-tree-toggle" aria-label={`${expanded.has(node.id) ? '收起' : '展开'}${node.title}`} aria-expanded={expanded.has(node.id)} onClick={() => toggle(node.id)}><span className={expanded.has(node.id) ? 'is-open' : ''}><Icon name="chevron" size={12}/></span></button> : <span className="kb-tree-dot"/>}
      <button className="kb-tree-link" title={node.title} aria-current={selected === node.id ? 'page' : undefined} onClick={() => node.id ? navigate(node.id) : toggle(node.id)}>{node.title}</button>
    </div>
    {hasChildren && expanded.has(node.id) && <ul><TreeNodes nodes={node.children} {...{selected, expanded, toggle, navigate}} depth={depth + 1}/></ul>}
  </li>;
}
function TreeNodes({nodes, ...props}) {return nodes.map((node, i) => <TreeNode key={`${node.id}-${i}`} node={node} {...props}/>);}

export default function KnowledgeBase({docId, anchor, onNavigate, onAsk, onChat}) {
  const [catalog, setCatalog] = useState(null), [catalogError, setCatalogError] = useState('');
  const [doc, setDoc] = useState(null), [error, setError] = useState(''), [busy, setBusy] = useState(true);
  const [expanded, setExpanded] = useState(new Set(['security', 'ec2-security']));
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 680), [all, setAll] = useState(false);
  const [query, setQuery] = useState(''), [results, setResults] = useState(null), [searchError, setSearchError] = useState('');
  const [searchOpen, setSearchOpen] = useState(false), [copied, setCopied] = useState(false), [retry, setRetry] = useState(0);
  const searchRef = useRef(null), articleRef = useRef(null);
  const selected = docId || 'concepts';
  const content = useMemo(() => prepareMarkdown(doc?.content || ''), [doc]);
  const group = catalog?.groups.find(g => g.id === doc?.group);
  const navigate = (id, fragment = '') => {setSearchOpen(false); if (window.innerWidth <= 680) setCollapsed(true); onNavigate(id, fragment);};
  useEffect(() => {
    const controller = new AbortController();
    setCatalogError('');
    read('/api/knowledge', controller.signal).then(setCatalog).catch(e => {if (e.name !== 'AbortError') setCatalogError(e.message);});
    return () => controller.abort();
  }, [retry]);
  useEffect(() => {
    const controller = new AbortController();
    setBusy(true); setError(''); setDoc(null);
    read(`/api/knowledge/documents/${encodeURIComponent(selected)}`, controller.signal)
      .then(setDoc).catch(e => {if (e.name !== 'AbortError') setError(e.message);})
      .finally(() => {if (!controller.signal.aborted) setBusy(false);});
    return () => controller.abort();
  }, [selected, retry]);
  useEffect(() => {
    if (!catalog) return;
    const trail = ancestors(catalog.groups, selected) || [];
    setExpanded(previous => new Set([...previous, ...trail]));
  }, [catalog, selected]);
  useEffect(() => {
    if (!doc) return;
    const target = anchor && document.getElementById(anchor);
    if (target) target.scrollIntoView({block: 'start'});
    else if (articleRef.current) articleRef.current.scrollTop = 0;
  }, [doc, anchor]);
  useEffect(() => {
    const shortcut = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {event.preventDefault(); searchRef.current?.focus(); setSearchOpen(true);}
      if (event.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, []);
  useEffect(() => {
    setResults(null); setSearchError('');
    if (!query.trim()) return;
    const controller = new AbortController();
    const timer = setTimeout(() => read(`/api/knowledge/search?q=${encodeURIComponent(query.trim())}`, controller.signal)
      .then(setResults).catch(e => {if (e.name !== 'AbortError') setSearchError(e.message);}), 220);
    return () => {clearTimeout(timer); controller.abort();};
  }, [query]);
  const toggle = id => setExpanded(previous => {const next = new Set(previous); next.has(id) ? next.delete(id) : next.add(id); return next;});
  async function copyLink() {
    try {const url = new URL(window.location.href); url.searchParams.set('doc', selected); await navigator.clipboard.writeText(url.href); setCopied(true); setTimeout(() => setCopied(false), 1800);}
    catch {setCopied(false);}
  }
  const components = {
    h1: () => null,
    a: ({href = '', children}) => {
      let url;
      try {url = new URL(href, doc?.source_url || OFFICIAL);} catch {return <span>{children}</span>;}
      const id = decodeURIComponent(url.pathname.split('/').pop() || '').replace(/\.(md|html)$/, '');
      const local = url.origin === 'https://docs.aws.amazon.com' && url.pathname.startsWith('/zh_cn/AWSEC2/latest/UserGuide/') && catalog?.documents.some(d => d.id === id);
      if (local) return <a href={`?view=knowledge&doc=${encodeURIComponent(id)}${url.hash}`} onClick={e => {if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {e.preventDefault(); navigate(id, decodeURIComponent(url.hash.slice(1)));}}}>{children}</a>;
      return <a href={url.href.replace(/\.md(?=#|$)/, '.html')} target="_blank" rel="noreferrer">{children}</a>;
    },
    img: ({src, alt}) => <img src={src ? new URL(src, doc?.source_url || OFFICIAL).href : undefined} alt={alt || ''} loading="lazy"/>,
    table: ({children}) => <div className="kb-table-wrap"><table>{children}</table></div>,
  };
  return <main className="kb-page">
    <header className="kb-header"><div><div className="kb-heading-row"><h1>知识库</h1>{catalog && <span className="kb-total">{catalog.total} 篇文档</span>}</div><p>让每一次回答，都有据可查</p></div><button className="kb-button" onClick={onChat}>前往对话 <Icon name="external" size={16}/></button></header>
    <div className="kb-search" onBlur={e => {if (!e.currentTarget.contains(e.relatedTarget)) setSearchOpen(false);}}>
      <Icon name="search"/><input ref={searchRef} aria-label="搜索知识库" placeholder="搜索 EC2 文档、关键词或问题…" value={query} maxLength={200} onFocus={() => setSearchOpen(true)} onChange={e => {setQuery(e.target.value); setSearchOpen(true);}}/>
      {query ? <button aria-label="清空搜索" className="kb-icon-button" onClick={() => {setQuery(''); searchRef.current?.focus();}}><Icon name="close" size={16}/></button> : <kbd>⌘ K</kbd>}
      {searchOpen && query.trim() && <section className="kb-search-results" aria-label="搜索结果" aria-live="polite">
        <div className="kb-results-heading">{searchError || (!results ? '正在搜索…' : results.total ? `找到 ${results.total} 篇文档${results.total > 60 ? '，显示前 60 篇，可细化关键词' : ''}` : '没有找到匹配文档，试试“安全组”或“SSH”。')}</div>
        {results?.items.map(item => <button key={item.id} onClick={() => navigate(item.id)}><Icon name="file" size={18}/><span><strong>{item.title}</strong><small>{item.summary}</small></span><Icon name="arrow" size={16}/></button>)}
      </section>}
    </div>
    <div className={`kb-body ${collapsed ? 'directory-collapsed' : ''}`}>
      {!collapsed && <nav className="kb-directory" aria-label="主题目录">
        <div className="kb-directory-heading"><h2>主题目录</h2><button className="kb-icon-button" aria-label="收起主题目录" onClick={() => setCollapsed(true)}><Icon name="panel" size={18}/></button></div>
        <div className="kb-directory-scroll">
          {catalogError ? <div className="kb-state" role="alert">{catalogError}<button className="kb-button" onClick={() => setRetry(x => x + 1)}>重试</button></div> : !catalog ? <p className="kb-state">正在加载目录…</p> : <>
            <button className={`kb-category kb-all ${all ? 'is-active' : ''}`} onClick={() => setAll(!all)} aria-expanded={all}><Icon name="file"/><span>全部文档</span><small>{catalog.total}</small></button>
            {all ? <ul className="kb-all-documents"><TreeNodes nodes={catalog.documents.map(d => ({id: d.id, title: d.title, children: []}))} selected={selected} {...{expanded, toggle, navigate}}/></ul> : catalog.groups.filter(g => g.children.length).map((g, index) => <div className="kb-group" key={g.id}>
              <button className={`kb-category ${group?.id === g.id ? 'is-active' : ''}`} onClick={() => toggle(g.id)} aria-expanded={expanded.has(g.id)}><Icon name={['book', 'server', 'network', 'shield', 'server', 'chart', 'network', 'file'][index]}/><span>{g.title}</span><span className={expanded.has(g.id) ? 'is-open' : ''}><Icon name="chevron" size={14}/></span></button>
              {expanded.has(g.id) && <ul className="kb-tree"><TreeNodes nodes={g.children.length === 1 && g.children[0].children.length ? [{...g.children[0], title: '概览', children: []}, ...g.children[0].children] : g.children} selected={selected} {...{expanded, toggle, navigate}}/></ul>}
            </div>)}
          </>}
        </div>
        <div className="kb-directory-foot"><span className="kb-local-dot"/> 本地文档 · 按官方目录组织</div>
      </nav>}
      <section className="kb-reader" aria-label="文档阅读区" aria-busy={busy}>
        <div className="kb-reader-toolbar"><button className="kb-icon-button" aria-label={collapsed ? '展开主题目录' : '收起主题目录'} aria-expanded={!collapsed} onClick={() => setCollapsed(!collapsed)}><Icon name="panel" size={18}/></button><span className="kb-breadcrumb">{group?.title || 'EC2 用户指南'}<span>/</span>{doc?.title || '文档'}</span><button className="kb-icon-button kb-copy" aria-label="复制文档链接" title={copied ? '已复制' : '复制文档链接'} onClick={copyLink}>{copied ? <span role="status">已复制</span> : <Icon name="copy" size={18}/>}</button></div>
        <div className="kb-article-scroll" ref={articleRef}>
          {busy ? <div className="kb-state">正在加载文档…</div> : error ? <div className="kb-state" role="alert"><h2>暂时无法打开文档</h2><p>{error}</p><button className="kb-button" onClick={() => setRetry(x => x + 1)}>重新加载</button></div> : doc && <>
            <h1 className="kb-document-title" id={content.headings.find(h => h.depth === 1)?.id}>{doc.title}</h1>
            <div className="kb-article-meta"><span className="kb-chip">AWS 官方文档</span><span>中文</span><span className="kb-file-name">{doc.filename}</span></div>
            {content.headings.some(h => h.depth === 2) && <nav className="kb-sections" aria-label="本文内容"><strong>本文内容</strong>{content.headings.filter(h => h.depth === 2).map(h => <button key={h.id} onClick={() => document.getElementById(h.id)?.scrollIntoView({behavior: 'smooth', block: 'start'})}>{h.title}</button>)}</nav>}
            <article className="kb-markdown"><ReactMarkdown remarkPlugins={[remarkGfm, content.headingIds]} components={components}>{content.markdown}</ReactMarkdown></article>
          </>}
        </div>
        {doc && !busy && <footer className="kb-reader-footer"><a className="kb-button" href={doc.source_url} target="_blank" rel="noreferrer">查看官方原文 <Icon name="external" size={16}/></a><button className="kb-button kb-primary" onClick={() => onAsk(doc)}>基于此文提问 <Icon name="arrow" size={18}/></button></footer>}
      </section>
    </div>
  </main>;
}
