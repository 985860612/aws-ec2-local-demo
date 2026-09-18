import React from 'react';
import './settings.css';

function Icon({ name, ...props }) {
  const paths = {
    preferences: <><path d="M3 6h18M3 12h18M3 18h18"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="9" cy="18" r="2"/></>,
    activity: <path d="M2 12h5l3-9 4 18 3-9h5"/>,
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
          <div><h1 id="settings-title">设置</h1><p>管理对话偏好，查看系统状态</p></div>
          <span className="settings-autosave"><span aria-hidden="true">✓</span>更改自动保存</span>
        </header>
        <div className="settings-grid">
          <section className="settings-card" aria-labelledby="preferences-heading">
            <div className="settings-card-heading"><span className="settings-heading-icon"><Icon name="preferences"/></span><div><h2 id="preferences-heading">对话偏好</h2><p>按你的习惯调整对话体验</p></div></div>
            <div className="settings-preferences">
              {preferences.map(([key, title, description]) => <label className="settings-preference" key={key}>
                <span><strong id={`setting-${key}`}>{title}</strong><small id={`setting-${key}-help`}>{description}</small></span>
                <input className="settings-switch" type="checkbox" role="switch" aria-labelledby={`setting-${key}`} aria-describedby={`setting-${key}-help`} checked={settings[key]} onChange={(event) => onChange({ [key]: event.target.checked })}/>
              </label>)}
            </div>
          </section>
          <section className="settings-card settings-system" aria-labelledby="system-heading">
            <div className="settings-card-heading"><span className="settings-heading-icon"><Icon name="activity"/></span><h2 id="system-heading">系统状态</h2></div>
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
