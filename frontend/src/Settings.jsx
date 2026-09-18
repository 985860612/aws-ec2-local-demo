import React from 'react';
import './settings.css';

function Icon({ name, ...props }) {
  const paths = {
    model: <><path d="m12 3 9 5v8l-9 5-9-5V8Z"/><path d="m3 8 9 5 9-5M12 13v8M7.5 5.5l9 5"/></>,
    preferences: <><path d="M3 6h18M3 12h18M3 18h18"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="9" cy="18" r="2"/></>,
    activity: <path d="M2 12h5l3-9 4 18 3-9h5"/>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></>,
    document: <><path d="M14 3H5v18h14V8ZM14 3v5h5M8 12h8M8 16h8"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}

const preferences = [
  ['showSources', '显示引用来源', '在回答中展示参考文档'],
  ['showProcess', '显示检索过程', '查看问题处理进度'],
  ['autoSave', '自动保存历史', '保留对话，方便随时继续'],
];

export default function Settings({ settings, onChange }) {
  return (
    <main className="settings-page" aria-labelledby="settings-title">
      <div className="settings-content">
        <header className="settings-page-header">
          <div><h1 id="settings-title">设置</h1><p>管理模型配置与对话偏好</p></div>
          <span className="settings-autosave"><span aria-hidden="true">✓</span>更改自动保存</span>
        </header>
        <div className="settings-grid">
          <section className="settings-card" aria-labelledby="model-heading">
            <div className="settings-card-heading"><Icon name="model"/><div><h2 id="model-heading">模型配置</h2><p>查看当前模型，调整知识检索范围</p></div></div>
            <div className="settings-models">
              <label className="settings-model-row"><span>问答模型</span><input readOnly value="qwen3.8-flash"/><span className="settings-readonly"><Icon name="lock"/>只读</span></label>
              <label className="settings-model-row"><span>向量模型</span><input readOnly value="qwen3.7-text-embedding-flash"/><span className="settings-readonly"><Icon name="lock"/>只读</span></label>
            </div>
            <fieldset className="settings-topk">
              <legend>检索 Top-K</legend>
              <p>每次检索返回的参考文档数量</p>
              <div className="settings-segments">
                {[3, 5, 8, 10].map((value) => <label key={value}><input type="radio" name="top-k" value={value} checked={settings.topK === value} onChange={() => onChange({ topK: value })}/><span>{value}</span></label>)}
              </div>
            </fieldset>
          </section>
          <section className="settings-card" aria-labelledby="preferences-heading">
            <div className="settings-card-heading"><Icon name="preferences"/><h2 id="preferences-heading">对话偏好</h2></div>
            <div className="settings-preferences">
              {preferences.map(([key, title, description]) => <label className="settings-preference" key={key}>
                <span><strong id={`setting-${key}`}>{title}</strong><small id={`setting-${key}-help`}>{description}</small></span>
                <input className="settings-switch" type="checkbox" role="switch" aria-labelledby={`setting-${key}`} aria-describedby={`setting-${key}-help`} checked={settings[key]} onChange={(event) => onChange({ [key]: event.target.checked })}/>
              </label>)}
            </div>
          </section>
          <section className="settings-card settings-system" aria-labelledby="system-heading">
            <div className="settings-card-heading"><Icon name="activity"/><h2 id="system-heading">系统状态</h2></div>
            <div className="settings-status-grid">
              <div><i className="settings-status-dot"/><span>API 服务<strong>正常</strong></span></div>
              <div><i className="settings-status-dot"/><span>Qdrant 向量库<strong>已连接</strong></span></div>
              <div><Icon name="document"/><span>知识库<small>AWS EC2 中文文档</small></span></div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
