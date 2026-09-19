import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './style.css';
import './markdown.css';
import './markdown-overrides.css';
import './scrollbar.css';
import KnowledgeBase from './KnowledgeBase';
import Settings from './Settings';

const LOADING_STAGES = ['理解问题', '检索 AWS 知识库', '整理证据并生成回答'];
const PROCESS_STEPS = [...LOADING_STAGES, '完成'];
const makeId = () => crypto.randomUUID();
const sourceNumber = (source, index) => source.citation_number || index + 1;
const formatMessageTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};
const formatMessageDateTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
};

const plainMessagePreview = (content, limit = 180) => {
  const plain = String(content || '')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`#>*_|~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > limit ? `${plain.slice(0, limit)}…` : plain;
};

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
  const view = location.searchParams.get('view');
  const page = ['knowledge', 'settings'].includes(view) ? view : 'chat';
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
  const [replyDraft, setReplyDraft] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
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
  const historyToggleRef = useRef(null);
  const historyPanelRef = useRef(null);
  const conversationVersionRef = useRef(0);
  const composerRef = useRef(null);
  const contextMenuRef = useRef(null);
  const messageNodesRef = useRef(new Map());
  const highlightTimerRef = useRef(null);

  useEffect(() => {
    if (!showHistory) return;

    const closeHistoryOnOutsideClick = (event) => {
      if (
        !historyToggleRef.current?.contains(event.target) &&
        !historyPanelRef.current?.contains(event.target)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener('click', closeHistoryOnOutsideClick, true);
    return () => document.removeEventListener('click', closeHistoryOnOutsideClick, true);
  }, [showHistory]);

  useEffect(() => {
    if (!contextMenu) return;

    const closeOnPointer = (event) => {
      if (!contextMenuRef.current?.contains(event.target)) setContextMenu(null);
    };
    const closeOnKey = (event) => {
      if (event.key === 'Escape') setContextMenu(null);
    };
    const close = () => setContextMenu(null);
    const focusTimer = window.requestAnimationFrame(() => {
      contextMenuRef.current?.querySelector('[role="menuitem"]')?.focus();
    });

    document.addEventListener('pointerdown', closeOnPointer, true);
    window.addEventListener('keydown', closeOnKey);
    window.addEventListener('resize', close);
    window.addEventListener('blur', close);
    return () => {
      window.cancelAnimationFrame(focusTimer);
      document.removeEventListener('pointerdown', closeOnPointer, true);
      window.removeEventListener('keydown', closeOnKey);
      window.removeEventListener('resize', close);
      window.removeEventListener('blur', close);
    };
  }, [contextMenu]);

  useEffect(
    () => () => {
      if (highlightTimerRef.current) window.clearTimeout(highlightTimerRef.current);
    },
    [],
  );

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
        message.id === pendingId
          ? { ...message, id: pendingId, role: 'assistant', ...replacement }
          : message,
      ),
    );
  }

  function openReplyMenu(event, message) {
    if (message.pending) return;
    event.preventDefault();
    const node = messageNodesRef.current.get(message.id);
    const rect = node?.getBoundingClientRect();
    const x = event.clientX || (rect ? rect.left + 24 : 24);
    const y = event.clientY || (rect ? rect.top + 24 : 24);
    const createdAt = message.created_at || message.createdAt || null;
    setContextMenu({
      x: Math.max(8, Math.min(x, window.innerWidth - 132)),
      y: Math.max(8, Math.min(y, window.innerHeight - 58)),
      target: {
        message_id: message.id,
        role: message.role,
        content: String(message.content || '').slice(0, 4000),
        created_at: createdAt,
      },
    });
  }

  function selectReplyTarget() {
    if (!contextMenu?.target) return;
    setReplyDraft({ ...contextMenu.target });
    setContextMenu(null);
    window.requestAnimationFrame(() => composerRef.current?.focus());
  }

  function locateReplyTarget(reply) {
    let targetId = reply?.message_id;
    let target = targetId ? messageNodesRef.current.get(targetId) : null;
    if (!target) {
      const matched = messages.find(
        (message) =>
          message.role === reply?.role &&
          String(message.content || '').startsWith(String(reply?.content || '')),
      );
      targetId = matched?.id;
      target = targetId ? messageNodesRef.current.get(targetId) : null;
    }
    if (!target || !targetId) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
    setHighlightedMessageId(targetId);
    if (highlightTimerRef.current) window.clearTimeout(highlightTimerRef.current);
    highlightTimerRef.current = window.setTimeout(() => {
      setHighlightedMessageId(null);
      highlightTimerRef.current = null;
    }, 1800);
  }

  function startNewConversation() {
    conversationVersionRef.current += 1;
    queueRef.current = [];
    drainingRef.current = false;
    sidRef.current = null;
    setSid(null);
    setMessages(initialMessages);
    setSources([]);
    setHighlightedCitation(null);
    setReplyDraft(null);
    setContextMenu(null);
    setHighlightedMessageId(null);
    if (highlightTimerRef.current) {
      window.clearTimeout(highlightTimerRef.current);
      highlightTimerRef.current = null;
    }
    setSelectedDocument(null);
    setQ('');
    setLoading(false);
    setLoadingStage(0);
    setProcessStatus('idle');
    setActiveItem(null);
    setQueuedItems([]);
    setQueueExpanded(true);
    setShowHistory(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('doc');
    url.hash = '';
    window.history.replaceState({}, '', url);
    setLocation(url);
    composerRef.current?.focus();
    refreshHistory();
  }

  async function processItem(item, version) {
    const userMessageId = `user-${item.id}`;
    const pendingId = `assistant-${item.id}`;
    const startedAt = new Date().toISOString();
    setActiveItem(item);
    setLoadingStage(0);
    setProcessStatus('loading');
    setHighlightedCitation(null);
    setMessages((current) => [
      ...current,
      {
        id: userMessageId,
        role: 'user',
        content: item.text,
        createdAt: startedAt,
        reply: item.reply,
      },
      {
        id: pendingId,
        role: 'assistant',
        pending: true,
        content: '',
        sources: [],
        createdAt: startedAt,
      },
    ]);

    const stageTimer = window.setInterval(() => {
      if (version !== conversationVersionRef.current) return;
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
        body: JSON.stringify({
          session_id: requestSid,
          message: item.text,
          document_id: item.documentId,
          message_id: userMessageId,
          assistant_message_id: pendingId,
          reply: item.reply,
        }),
      });
      if (settingsRef.current.autoSave) refreshHistory();
      if (version !== conversationVersionRef.current) return;
      const responseSid = data.session_id || requestSid;
      const responseSources = data.sources || [];
      sidRef.current = responseSid;
      setSid(responseSid);
      replacePending(pendingId, {
        content: data.answer || '未收到有效回答。',
        sources: responseSources,
        createdAt: new Date().toISOString(),
      });
      setSources(responseSources);
      setProcessStatus('done');
    } catch (error) {
      if (version !== conversationVersionRef.current) return;
      replacePending(pendingId, {
        content: `请求失败：${error.message || '请检查服务或 API 配额。'}`,
        failed: true,
        sources: [],
        createdAt: new Date().toISOString(),
      });
      setProcessStatus('error');
    } finally {
      window.clearInterval(stageTimer);
      if (version === conversationVersionRef.current) setActiveItem(null);
    }
  }

  async function drainQueue() {
    if (drainingRef.current) return;
    drainingRef.current = true;
    const version = ++conversationVersionRef.current;
    setLoading(true);

    try {
      while (version === conversationVersionRef.current && queueRef.current.length > 0) {
        const item = queueRef.current.shift();
        syncQueueView();
        await processItem(item, version);
      }
    } finally {
      if (version === conversationVersionRef.current) {
        drainingRef.current = false;
        setActiveItem(null);
        setLoading(false);
        syncQueueView();
      }
    }
  }

  function enqueueMessage() {
    const text = q.trim();
    if (!text) return;

    const item = {
      id: makeId(),
      text,
      documentId: selectedDocument?.id || null,
      reply: replyDraft ? { ...replyDraft } : null,
    };
    queueRef.current.push(item);
    syncQueueView();
    setQ('');
    setReplyDraft(null);
    if (drainingRef.current) setQueueExpanded(true);
    void drainQueue();
  }

  async function restore(id) {
    if (drainingRef.current || queueRef.current.length > 0) {
      setQueueExpanded(true);
      return;
    }
    const version = ++conversationVersionRef.current;
    let data;
    try {
      data = await api(`/api/history/${id}`);
    } catch {
      return;
    }
    if (version !== conversationVersionRef.current || drainingRef.current) return;
    const restoredMessages = (data.messages || []).map((message, index) => ({
      ...message,
      sources: message.sources || [],
      reply: message.reply || null,
      id: message.id || `history-${id}-${index}`,
    }));
    const latestSourcedAnswer = [...restoredMessages]
      .reverse()
      .find((message) => message.role === 'assistant' && message.sources.length > 0);

    sidRef.current = id;
    setSid(id);
    setMessages(restoredMessages);
    setSources(latestSourcedAnswer?.sources || []);
    setHighlightedCitation(null);
    setReplyDraft(null);
    setContextMenu(null);
    setHighlightedMessageId(null);
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

  function activateCitation(message, citationNumber, occurrenceId, shouldScroll = false) {
    const messageSources = message.sources || [];
    const source = messageSources.find(
      (item, index) => sourceNumber(item, index) === citationNumber,
    );
    if (!source) return;

    setSources(messageSources);
    setHighlightedCitation({ messageId: message.id, citationNumber, occurrenceId });
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
      a: ({ node, href = '', children, ...props }) => {
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
        const position = node?.position?.start;
        const occurrenceId = `${message.id}-${citationNumber}-${position?.offset ?? `${position?.line || 0}-${position?.column || 0}`}`;
        const tooltipId = `citation-tooltip-${occurrenceId}`;
        const isActive =
          highlightedCitation?.messageId === message.id &&
          highlightedCitation?.citationNumber === citationNumber &&
          highlightedCitation?.occurrenceId === occurrenceId;

        return (
          <span
            className={`citation-wrap${isActive ? ' active' : ''}${source ? '' : ' unavailable'}`}
            onMouseEnter={() => activateCitation(message, citationNumber, occurrenceId)}
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
              onFocus={() => activateCitation(message, citationNumber, occurrenceId)}
              onBlur={clearCitation}
              onClick={(event) => {
                event.preventDefault();
                activateCitation(message, citationNumber, occurrenceId, true);
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
    <div className={`app ${page !== 'chat' ? `${page}-app` : ''}`}>
      <aside className="left">
        <div className="brand">KIRO</div>
        <div className="tag">Think AI-DLC. Build with Kiro.</div>
        <button className={`nav ${page === 'chat' ? 'active' : ''}`} aria-current={page === 'chat' ? 'page' : undefined} onClick={() => navigatePage('chat')}><span className="nav-icon" aria-hidden="true">▣</span><span>对话</span></button>
        <button className={`nav ${page === 'knowledge' ? 'active' : ''}`} aria-current={page === 'knowledge' ? 'page' : undefined} onClick={() => navigatePage('knowledge')}><span className="nav-icon" aria-hidden="true">♧</span><span>知识库</span></button>
        <button
          ref={historyToggleRef}
          type="button"
          className="nav history-toggle"
          aria-expanded={showHistory}
          aria-controls="history-panel"
          title={showHistory ? '收起历史记录' : '展开历史记录'}
          onClick={() => setShowHistory((shown) => !shown)}
        >
          <span className="nav-icon" aria-hidden="true">◷</span><span>历史记录</span>
          <svg className="history-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        {showHistory && (
          <div ref={historyPanelRef} id="history-panel" className="history">
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
        <button
          type="button"
          className={`nav ${page === 'settings' ? 'active' : ''}`}
          aria-current={page === 'settings' ? 'page' : undefined}
          onClick={() => navigatePage('settings')}
        >
          <span className="nav-icon" aria-hidden="true">⚙</span><span>设置</span>
        </button>
        <div className="mascot">
          <img src="/assets/ai-dlc-mascot.png" alt="AI-DLC 先锋创造营" />
          <div className="brand-cn">AI-DLC 先锋创造营</div>
          <div className="brand-en">Start Your Journey as a Pioneer</div>
        </div>
      </aside>

      {page === 'settings' ? (
        <Settings settings={settings} onChange={updateSettings} />
      ) : page === 'knowledge' ? (
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
          <div className="avatar">
            <img src="/assets/ai-dlc-mascot.png" alt="AWS 客服 Agent" />
          </div>
          <div>
            <div className="title">AWS 客服 Agent</div>
          </div>
          <button type="button" className="new-chat" onClick={startNewConversation} title="开启独立的新对话">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
            <span>新对话</span>
          </button>
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
        <section className="chat" onScroll={() => setContextMenu(null)}>
          {messages.map((message, index) => {
            const timestamp = message.created_at || message.createdAt;
            const displayTime = formatMessageTime(timestamp);
            return (
              <div
                id={`message-${message.id}`}
                className={`${message.role === 'user' ? 'user' : 'agent'}${highlightedMessageId === message.id ? ' reply-target-highlight' : ''}`}
                key={message.id || `${message.role}-${index}`}
                ref={(node) => {
                  if (node) messageNodesRef.current.set(message.id, node);
                  else messageNodesRef.current.delete(message.id);
                }}
                tabIndex={message.pending ? undefined : 0}
                onContextMenu={(event) => openReplyMenu(event, message)}
                onKeyDown={(event) => {
                  if (!message.pending && (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10'))) {
                    openReplyMenu(event, message);
                  }
                }}
              >
                {message.role === 'assistant' && (
                  <div className="bot">
                    <img src="/assets/ai-dlc-mascot.png" alt="AWS 客服 Agent" />
                  </div>
                )}
                <div className="message-body">
                  {displayTime && (
                    <time
                      className="message-time"
                      dateTime={timestamp}
                      title={formatMessageDateTime(timestamp)}
                    >
                      {displayTime}
                    </time>
                  )}
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
                      <>
                        <div className="user-message-text">{message.content}</div>
                        {message.reply && (
                          <button
                            type="button"
                            className="reply-preview"
                            onClick={() => locateReplyTarget(message.reply)}
                            title="点击定位到被引用消息"
                          >
                            <span>
                              引用{message.reply.role === 'assistant' ? '客服回答' : '用户问题'}
                            </span>
                            <small>{plainMessagePreview(message.reply.content)}</small>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </section>

        <div className="composer-zone">
          {replyDraft && (
            <div className="reply-draft">
              <div>
                <span>引用{replyDraft.role === 'assistant' ? '客服回答' : '用户问题'}</span>
                <p>{plainMessagePreview(replyDraft.content, 220)}</p>
              </div>
              <button
                type="button"
                aria-label="取消引用"
                title="取消引用"
                onClick={() => setReplyDraft(null)}
              >
                ×
              </button>
            </div>
          )}
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
              ref={composerRef}
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

      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="message-context-menu"
          role="menu"
          aria-label="消息操作"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button type="button" role="menuitem" onClick={selectReplyTarget}>
            <span aria-hidden="true">↩</span>
            引用
          </button>
        </div>
      )}

    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
