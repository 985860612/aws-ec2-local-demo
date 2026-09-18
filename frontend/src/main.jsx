import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './style.css';
import './markdown.css';
import './markdown-overrides.css';
import './scrollbar.css';
import KnowledgeBase from './KnowledgeBase';

const LOADING_STAGES = ['理解问题', '检索 AWS 知识库', '整理证据并生成回答'];
const PROCESS_STEPS = [...LOADING_STAGES, '完成'];
const makeId = () => crypto.randomUUID();
const sourceNumber = (source, index) => source.citation_number || index + 1;

const api = async (path, options) => {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || `请求失败（${response.status}）`);
  }
  return data;
};

const initialMessages = [
  {
    id: 'welcome',
    role: 'assistant',
    content:
      '你好！我是 AWS 技术客服 Agent，可以基于 AWS 官方文档帮助你解答 EC2 相关问题。\n\n我会检索本地知识库，并在回答中提供引用来源和官方链接。',
    sources: [],
  },
];

function App() {
  const [location, setLocation] = useState(() => new URL(window.location.href));
  const [selectedDocument, setSelectedDocument] = useState(null);
  const page = location.searchParams.get('view') === 'knowledge' ? 'knowledge' : 'chat';
  useEffect(() => {
    const update = () => setLocation(new URL(window.location.href));
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);
  function navigatePage(view, doc, anchor = '') {
    const url = new URL(window.location.href);
    url.searchParams.set('view', view);
    if (doc) url.searchParams.set('doc', doc);
    url.hash = anchor;
    window.history.pushState({}, '', url);
    setLocation(url);
  }
  function askDocument(doc) {
    setSelectedDocument(doc);
    navigatePage('chat');
    setTimeout(() => document.querySelector('.composer textarea')?.focus(), 0);
  }
  const [sid, setSid] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const [sources, setSources] = useState([]);
  const [highlightedCitation, setHighlightedCitation] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [processStatus, setProcessStatus] = useState('idle');
  const [activeItem, setActiveItem] = useState(null);
  const [queuedItems, setQueuedItems] = useState([]);
  const [queueExpanded, setQueueExpanded] = useState(true);
  const [settings, setSettings] = useState(() => {
    const defaults = { topK: 5, showSources: true, showProcess: true, autoSave: true };
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem('aws-agent-settings')) };
    } catch {
      return defaults;
    }
  });

  const queueRef = useRef([]);
  const drainingRef = useRef(false);
  const sidRef = useRef(sid);
  const settingsRef = useRef(settings);
  const chatEndRef = useRef(null);

  useEffect(() => {
    sidRef.current = sid;
  }, [sid]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const refreshHistory = () =>
    api('/api/history')
      .then((data) => setHistory(data.items || []))
      .catch(() => {});

  useEffect(() => {
    refreshHistory();
  }, []);

  function updateSettings(patch) {
    const next = { ...settings, ...patch };
    setSettings(next);
    settingsRef.current = next;
    localStorage.setItem('aws-agent-settings', JSON.stringify(next));
  }

  function syncQueueView() {
    setQueuedItems([...queueRef.current]);
  }

  function replacePending(pendingId, replacement) {
    setMessages((current) =>
      current.map((message) =>
        message.id === pendingId ? { id: pendingId, role: 'assistant', ...replacement } : message,
      ),
    );
  }

  async function processItem(item) {
    const pendingId = `pending-${item.id}`;
    setActiveItem(item);
    setLoadingStage(0);
    setProcessStatus('loading');
    setHighlightedCitation(null);
    setMessages((current) => [
      ...current,
      { id: `user-${item.id}`, role: 'user', content: item.text },
      { id: pendingId, role: 'assistant', pending: true, content: '', sources: [] },
    ]);

    const stageTimer = window.setInterval(() => {
      setLoadingStage((stage) => Math.min(stage + 1, LOADING_STAGES.length - 1));
    }, 1400);

    try {
      const requestSid = sidRef.current || makeId();
      if (!sidRef.current) {
        sidRef.current = requestSid;
        setSid(requestSid);
      }

      const data = await api('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ session_id: requestSid, message: item.text, document_id: item.documentId }),
      });
      const responseSid = data.session_id || requestSid;
      const responseSources = data.sources || [];
      sidRef.current = responseSid;
      setSid(responseSid);
      replacePending(pendingId, {
        content: data.answer || '未收到有效回答。',
        sources: responseSources,
      });
      setSources(responseSources);
      setProcessStatus('done');
      if (settingsRef.current.autoSave) refreshHistory();
    } catch (error) {
      replacePending(pendingId, {
        content: `请求失败：${error.message || '请检查服务或 API 配额。'}`,
        failed: true,
        sources: [],
      });
      setProcessStatus('error');
    } finally {
      window.clearInterval(stageTimer);
      setActiveItem(null);
    }
  }

  async function drainQueue() {
    if (drainingRef.current) return;
    drainingRef.current = true;
    setLoading(true);

    try {
      while (queueRef.current.length > 0) {
        const item = queueRef.current.shift();
        syncQueueView();
        await processItem(item);
      }
    } finally {
      drainingRef.current = false;
      setActiveItem(null);
      setLoading(false);
      syncQueueView();
    }
  }

  function enqueueMessage() {
    const text = q.trim();
    if (!text) return;

    const item = { id: makeId(), text, documentId: selectedDocument?.id || null };
    queueRef.current.push(item);
    syncQueueView();
    setQ('');
    if (drainingRef.current) setQueueExpanded(true);
    void drainQueue();
  }

  async function restore(id) {
    if (drainingRef.current || queueRef.current.length > 0) {
      setQueueExpanded(true);
      return;
    }
    const data = await api(`/api/history/${id}`);
    const restoredMessages = (data.messages || []).map((message, index) => ({
      ...message,
      sources: message.sources || [],
      id: `history-${id}-${index}`,
    }));
    const latestSourcedAnswer = [...restoredMessages]
      .reverse()
      .find((message) => message.role === 'assistant' && message.sources.length > 0);

    sidRef.current = id;
    setSid(id);
    setMessages(restoredMessages);
    setSources(latestSourcedAnswer?.sources || []);
    setHighlightedCitation(null);
    setProcessStatus('idle');
    setShowHistory(false);
    setSelectedDocument(null);
    navigatePage('chat');
  }

  function processStepState(index) {
    if (processStatus === 'done') return 'done';
    if (processStatus === 'idle') return 'waiting';
    if (processStatus === 'error') {
      if (index < loadingStage) return 'done';
      if (index === loadingStage) return 'error';
      return 'waiting';
    }
    if (index < loadingStage) return 'done';
    if (index === loadingStage) return 'active';
    return 'waiting';
  }

  function activateCitation(message, citationNumber, shouldScroll = false) {
    const messageSources = message.sources || [];
    const source = messageSources.find(
      (item, index) => sourceNumber(item, index) === citationNumber,
    );
    if (!source) return;

    setSources(messageSources);
    setHighlightedCitation({ messageId: message.id, citationNumber });
    if (shouldScroll) {
      window.requestAnimationFrame(() => {
        document
          .getElementById(`source-${citationNumber}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }

  function clearCitation() {
    setHighlightedCitation(null);
  }

  function markdownComponents(message) {
    return {
      table: ({ node: _node, ...props }) => (
        <div
          className="table-scroll"
          role="region"
          aria-label="回答中的数据表格"
          tabIndex="0"
        >
          <table {...props} />
        </div>
      ),
      a: ({ node: _node, href = '', children, ...props }) => {
        const citationMatch = href.match(/^#source-(\d+)$/);
        if (!citationMatch) {
          const external = /^https?:\/\//.test(href);
          return (
            <a
              {...props}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer noopener' : undefined}
            >
              {children}
            </a>
          );
        }

        const citationNumber = Number(citationMatch[1]);
        const messageSources = message.sources || [];
        const source = messageSources.find(
          (item, index) => sourceNumber(item, index) === citationNumber,
        );
        const tooltipId = `citation-tooltip-${message.id}-${citationNumber}`;
        const isActive =
          highlightedCitation?.messageId === message.id &&
          highlightedCitation?.citationNumber === citationNumber;

        return (
          <span
            className={`citation-wrap${isActive ? ' active' : ''}${source ? '' : ' unavailable'}`}
            onMouseEnter={() => activateCitation(message, citationNumber)}
            onMouseLeave={clearCitation}
          >
            <a
              {...props}
              href={href}
              className="citation-marker"
              aria-label={
                source
                  ? `引用 ${citationNumber}：${source.title}`
                  : `引用 ${citationNumber}：来源详情不可用`
              }
              aria-describedby={tooltipId}
              onFocus={() => activateCitation(message, citationNumber)}
              onBlur={clearCitation}
              onClick={(event) => {
                event.preventDefault();
                activateCitation(message, citationNumber, true);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  clearCitation();
                  event.currentTarget.blur();
                }
              }}
            >
              {citationNumber}
            </a>
            <span className="citation-tooltip" id={tooltipId} role="tooltip">
              <strong>
                {source ? `引用 ${citationNumber} · ${source.title}` : `引用 ${citationNumber}`}
              </strong>
              <small>{source?.source_file || '该历史回答未保存来源详情'}</small>
            </span>
          </span>
        );
      },
    };
  }

  return (
    <div className={`app ${page === 'knowledge' ? 'knowledge-app' : ''}`}>
      <aside className="left">
        <div className="brand">KIRO</div>
        <div className="tag">Think AI-DLC. Build with Kiro.</div>
        <button className={`nav ${page === 'chat' ? 'active' : ''}`} onClick={() => navigatePage('chat')}>▣　对话</button>
        <button className={`nav ${page === 'knowledge' ? 'active' : ''}`} onClick={() => navigatePage('knowledge')}>♧　知识库</button>
        <div className="nav" onClick={() => setShowHistory(!showHistory)}>
          ◷　历史记录
        </div>
        {showHistory && (
          <div className="history">
            {history.length ? (
              history.map((item) => (
                <div
                  className={`history-item${loading ? ' busy' : ''}`}
                  onClick={() => restore(item.session_id)}
                  key={item.session_id}
                  title={loading ? '请等待排队消息处理完成' : item.title}
                >
                  {item.title}
                </div>
              ))
            ) : (
              <div className="history-item empty">暂无历史记录</div>
            )}
          </div>
        )}
        <div
          className={`nav ${showSettings ? 'selected' : ''}`}
          onClick={() => setShowSettings(!showSettings)}
        >
          ⚙　设置
        </div>
        <div className="mascot">
          <img src="/assets/ai-dlc-mascot.png" alt="AI-DLC 先锋创造营" />
          <div className="brand-cn">AI-DLC 先锋创造营</div>
          <div className="brand-en">Start Your Journey as a Pioneer</div>
        </div>
      </aside>

      {page === 'knowledge' ? (
        <KnowledgeBase
          docId={location.searchParams.get('doc')}
          anchor={decodeURIComponent(location.hash.slice(1))}
          onNavigate={(id, anchor) => navigatePage('knowledge', id, anchor)}
          onAsk={askDocument}
          onChat={() => navigatePage('chat')}
        />
      ) : <>
      <main className="main">
        <header className="top">
          <div className="avatar">▱</div>
          <div>
            <div className="title">AWS 客服 Agent</div>
            <div className="status">
              <i />已连接本地 Qdrant · Qwen 云模型
            </div>
          </div>
          <div className="badge">▣ 基于知识库回答</div>
        </header>

        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {activeItem
            ? `Agent 正在${LOADING_STAGES[loadingStage]}${queuedItems.length ? `，另有 ${queuedItems.length} 条消息排队中` : ''}`
            : queuedItems.length
              ? `${queuedItems.length} 条消息等待处理`
              : processStatus === 'done'
                ? 'Agent 回答已完成'
                : processStatus === 'error'
                  ? '当前消息处理失败，后续排队消息将继续处理'
                  : '对话已就绪'}
        </div>
        <section className="chat">
          {messages.map((message, index) => (
            <div
              className={message.role === 'user' ? 'user' : 'agent'}
              key={message.id || `${message.role}-${index}`}
            >
              {message.role === 'assistant' && <div className="bot">🧙</div>}
              <div
                className={`bubble${message.pending ? ' pending' : ''}${message.failed ? ' failed' : ''}`}
                role={message.pending ? 'status' : undefined}
                aria-live={message.pending ? 'polite' : undefined}
              >
                {message.pending ? (
                  <div className="loading-process">
                    <div className="loading-title">
                      <span className="loading-spinner" />
                      {LOADING_STAGES[loadingStage]}…
                    </div>
                    <div className="loading-stages">
                      {LOADING_STAGES.map((stage, stageIndex) => (
                        <span
                          className={
                            stageIndex < loadingStage
                              ? 'done'
                              : stageIndex === loadingStage
                                ? 'active'
                                : ''
                          }
                          key={stage}
                        >
                          {stageIndex < loadingStage ? '✓' : stageIndex + 1}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : message.role === 'assistant' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents(message)}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </section>

        <div className="composer-zone">
          {selectedDocument && <div className="chat-document-context">
            <span>基于文档：{selectedDocument.title}</span>
            <button onClick={() => navigatePage('knowledge', selectedDocument.id)}>查看</button>
            <button aria-label="取消文档上下文" onClick={() => setSelectedDocument(null)}>×</button>
          </div>}
          {(activeItem || queuedItems.length > 0) && (
            <section className="queue-panel" aria-label="消息队列">
              <button
                type="button"
                className="queue-summary"
                aria-expanded={queueExpanded}
                onClick={() => setQueueExpanded((expanded) => !expanded)}
              >
                <span className="queue-summary-title">
                  <i />
                  Agent 正在回答
                  {queuedItems.length > 0 && (
                    <strong>{queuedItems.length} 条消息排队中</strong>
                  )}
                </span>
                <span className="queue-chevron">{queueExpanded ? '⌃' : '⌄'}</span>
              </button>
              {queueExpanded && (
                <div className="queue-body">
                  {activeItem && (
                    <div className="queue-item active">
                      <span>处理中</span>
                      <p>{activeItem.text}</p>
                    </div>
                  )}
                  {queuedItems.length > 0 && (
                    <ol className="queue-list">
                      {queuedItems.map((item, index) => (
                        <li className="queue-item" key={item.id}>
                          <span>等待 {index + 1}</span>
                          <p>{item.text}</p>
                        </li>
                      ))}
                    </ol>
                  )}
                  <div className="queue-help">可继续输入，发送后会按顺序自动处理</div>
                </div>
              )}
            </section>
          )}
          <div className="composer">
            <textarea
              value={q}
              onChange={(event) => setQ(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter' &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  enqueueMessage();
                }
              }}
              placeholder={
                loading ? 'Agent 正在回答，可继续输入，发送后自动排队…' : selectedDocument ? '针对这篇文档，你想了解什么？' : '输入 AWS 相关问题...'
              }
            />
            <button
              type="button"
              onClick={enqueueMessage}
              disabled={!q.trim()}
              aria-label={loading ? '加入消息队列' : '发送消息'}
              title={loading ? '加入消息队列' : '发送消息'}
            >
              ➤
            </button>
          </div>
        </div>
      </main>

      <aside className="right">
        <h2>引用来源</h2>
        {settings.showSources &&
          (sources.length ? (
            sources.map((source, index) => {
              const citationNumber = sourceNumber(source, index);
              const highlighted =
                highlightedCitation?.citationNumber === citationNumber;
              return (
                <div
                  className={`source${highlighted ? ' citation-active' : ''}`}
                  id={`source-${citationNumber}`}
                  key={`${source.id}-${citationNumber}`}
                >
                  <b>
                    <span className="source-number">{citationNumber}</span>
                    {source.title}
                  </b>
                  <p>
                    {source.selected ? '当前选定文档' : <>命中片段：{source.id}<br />相似度：{source.score}</>}
                  </p>
                  <a
                    href={source.source_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`打开引用 ${citationNumber}：${source.title}（新窗口）`}
                  >
                    官方文档 ↗
                  </a>
                </div>
              );
            })
          ) : (
            <div className="source">发送问题后显示相关 AWS 官方文档。</div>
          ))}
        {settings.showProcess && (
          <>
            <h3>知识库检索过程</h3>
            {PROCESS_STEPS.map((step, index) => {
              const state = processStepState(index);
              return (
                <div
                  className={`step ${state}`}
                  key={step}
                  aria-label={`${step}：${state === 'done' ? '已完成' : state === 'error' ? '失败' : state === 'active' ? '进行中' : '等待中'}`}
                >
                  <span aria-hidden="true">
                    {state === 'done'
                      ? '✓'
                      : state === 'error'
                        ? '!'
                        : state === 'active'
                          ? '●'
                          : '○'}
                  </span>
                  　{step}
                </div>
              );
            })}
          </>
        )}
      </aside>

      </>}
      {showSettings && (
        <div className="settings-backdrop" onClick={() => setShowSettings(false)}>
          <section className="settings-panel" onClick={(event) => event.stopPropagation()}>
            <div className="settings-head">
              <h2>设置</h2>
              <button onClick={() => setShowSettings(false)}>×</button>
            </div>
            <h3>模型配置</h3>
            <label>
              问答模型
              <input value="qwen3.8-flash" readOnly />
            </label>
            <label>
              向量模型
              <input value="qwen3.7-text-embedding-flash" readOnly />
            </label>
            <label>
              检索 Top-K
              <select
                value={settings.topK}
                onChange={(event) => updateSettings({ topK: Number(event.target.value) })}
              >
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="8">8</option>
                <option value="10">10</option>
              </select>
            </label>
            <h3>对话偏好</h3>
            <label className="switch-row">
              显示引用来源
              <input
                type="checkbox"
                checked={settings.showSources}
                onChange={(event) => updateSettings({ showSources: event.target.checked })}
              />
            </label>
            <label className="switch-row">
              显示检索过程
              <input
                type="checkbox"
                checked={settings.showProcess}
                onChange={(event) => updateSettings({ showProcess: event.target.checked })}
              />
            </label>
            <label className="switch-row">
              自动保存历史
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(event) => updateSettings({ autoSave: event.target.checked })}
              />
            </label>
            <h3>系统状态</h3>
            <div className="status-card">
              <p>
                <i /> API 服务　正常
              </p>
              <p>
                <i /> Qdrant 向量库　已连接
              </p>
              <p>
                <i /> 知识库　AWS EC2 中文文档
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
