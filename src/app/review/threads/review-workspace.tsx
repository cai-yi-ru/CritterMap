'use client';

import { useEffect, useState } from 'react';
import { Check, Copy, ExternalLink, FileText, MapPin } from 'lucide-react';
import Link from 'next/link';
import type { ReviewDraft, ReviewSection } from '@/lib/threads-review-types';
import styles from './review.module.css';

function InlineText({ text }: { text: string }) {
  const tokens = text.split(/(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|`[^`]+`)/g);
  return <>{tokens.map((token, i) => {
    const link = token.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (link) return <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer">{link[1]}</a>;
    if (token.startsWith('`')) return <code key={i}>{token.slice(1, -1)}</code>;
    return token;
  })}</>;
}

function Notes({ section }: { section: ReviewSection }) {
  const paragraphs = section.body.split(/\n\n+/);
  return <section className={styles.notesSection}>
    <h3>{section.title}</h3>
    {paragraphs.map((paragraph, i) => {
      if (paragraph.startsWith('|')) {
        const rows = paragraph.split('\n').filter((row) => !/^\|[\s:|-]+\|$/.test(row))
          .map((row) => row.split('|').slice(1, -1).map((cell) => cell.trim()));
        return <div key={i} className={styles.tableScroll}><table>
          <thead><tr>{rows[0]?.map((cell, j) => <th key={j}><InlineText text={cell} /></th>)}</tr></thead>
          <tbody>{rows.slice(1).map((row, j) => <tr key={j}>{row.map((cell, k) => <td key={k}><InlineText text={cell} /></td>)}</tr>)}</tbody>
        </table></div>;
      }
      return <p key={i} className={styles.paragraph}><InlineText text={paragraph} /></p>;
    })}
  </section>;
}

function CopyPost({ title, text }: { title: string; text: string }) {
  const [message, setMessage] = useState('');
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setMessage('已複製');
    } catch {
      setMessage('無法複製，請選取下方文字手動複製。');
    }
  }
  return <article className={styles.post}>
    <header className={styles.postHeader}>
      <div><h3>{title}</h3><span>{Array.from(text).length} 字元</span></div>
      <button onClick={copy} className={styles.copyButton}><Copy size={15} aria-hidden="true" />複製文字</button>
    </header>
    <div className={styles.postText}>{text}</div>
    <p role="status" className={styles.copyStatus}>{message}</p>
  </article>;
}

function DraftContent({ draft }: { draft: ReviewDraft }) {
  const [tab, setTab] = useState('posts');
  const [query, setQuery] = useState('');
  const [checked, setChecked] = useState<string[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [storageMessage, setStorageMessage] = useState('');
  const storageKey = `crittermap-review:${draft.id}:${draft.version}`;
  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
      if (Array.isArray(stored)) setChecked(stored.filter((id): id is string => typeof id === 'string' && draft.sources.some((source) => source.id === id)));
    } catch {
      setStorageMessage('瀏覽器無法讀取紀錄；本次勾選仍可使用。');
    }
    setStorageReady(true);
  }, [storageKey, draft.sources]);
  function toggleSource(id: string) {
    const next = checked.includes(id) ? checked.filter((value) => value !== id) : [...checked, id];
    setChecked(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); }
    catch { setStorageMessage('瀏覽器無法儲存紀錄；離開後勾選不會保留。'); }
  }
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const sources = draft.sources.filter((source) => `${source.hospital} ${source.purpose} ${source.label}`.toLocaleLowerCase().includes(normalizedQuery));

  return <div className={styles.content}>
    <header className={styles.cityHeader}>
      <div><p>{draft.month.replace('-', ' 年 ')} 月</p><h2>{draft.city}<span>特寵醫院更新</span></h2></div>
      <span className={draft.reviewed ? styles.reviewed : styles.pending}>
        {draft.reviewed ? <Check size={14} aria-hidden="true" /> : null}
        {draft.reviewed ? '獨立文案覆核通過' : '未記錄獨立文案覆核'}
      </span>
    </header>
    <div className={styles.tabs} role="group" aria-label="查看內容">
      {[
        ['posts', '文案', draft.posts.length], ['sources', '來源備查', draft.sources.length], ['notes', '查核結果', null],
      ].map(([id, label, count]) => <button key={id} type="button" aria-pressed={tab === id} onClick={() => setTab(String(id))}>
        {label}{count !== null ? <span>{count}</span> : null}
      </button>)}
    </div>
    {tab === 'posts' && <div className={styles.panel}>
      <p className={styles.hint}>依序複製主文與留言。這裡顯示草稿，尚未發布到 Threads。</p>
      {draft.posts.length ? draft.posts.map((post, i) => <CopyPost key={i} {...post} />) : <p>這份文件尚未包含可複製的貼文。</p>}
    </div>}
    {tab === 'sources' && <div className={styles.panel}>
      <div className={styles.sourceToolbar}>
        <div><h3>逐筆對照院方公告</h3><p>已勾選 {checked.length} / {draft.sources.length} 筆</p></div>
        <label className={styles.search}><span>找院所或更新內容</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例如：休診、醫師姓名" /></label>
      </div>
      <p className={styles.hint}>點來源會開啟新分頁。「我已覆核」是你的個人紀錄，只保存在此瀏覽器；文案變更後重新勾選。</p>
      {draft.sourceHeading !== '來源備查' && <p className={styles.notice}>這份草稿的來源整理在「{draft.sourceHeading}」；原文件也有未入選院所的紀錄，請依每筆說明對照文案。</p>}
      {storageMessage && <p role="status" className={styles.notice}>{storageMessage}</p>}
      <div className={styles.sourceList}>{sources.map((source) => <article key={source.id} className={styles.source}>
        <div className={styles.sourceDescription}><h4>{source.hospital}</h4><p>{source.purpose}</p>
          <a href={source.url} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
            {source.label}<ExternalLink size={14} aria-hidden="true" /><span className={styles.srOnly}>（開啟新分頁）</span>
          </a>
          <span className={styles.domain}>{new URL(source.url).hostname}</span>
        </div>
        <label className={styles.checkbox}><input type="checkbox" aria-label={`${source.hospital} ${source.label}：我已覆核`} disabled={!storageReady} checked={checked.includes(source.id)} onChange={() => toggleSource(source.id)} />我已覆核</label>
      </article>)}</div>
      {!sources.length && <p className={styles.empty}>{draft.sources.length ? '沒有符合的來源，試試其他院名或清除搜尋。' : '這份文件尚未附上來源連結。'}</p>}
    </div>}
    {tab === 'notes' && <div className={styles.panel}>
      {draft.review ? <Notes section={draft.review} /> : <p className={styles.notice}>這份文件尚未記錄新建 reviewer 的獨立文案覆核結果。以下保留原本的查核與選材紀錄。</p>}
      <Notes section={{ title: '文案範圍與發文方式', body: draft.introduction }} />
      {draft.notes.map((section, i) => <Notes key={i} section={section} />)}
    </div>}
    <footer className={styles.document}>文件：{draft.filename}</footer>
  </div>;
}

export default function ReviewWorkspace({ drafts }: { drafts: ReviewDraft[] }) {
  const months = [...new Set(drafts.map((draft) => draft.month))];
  const [month, setMonth] = useState(months[0] ?? '');
  const [selectedId, setSelectedId] = useState(drafts[0]?.id ?? '');
  const visible = drafts.filter((draft) => draft.month === month);
  const selected = visible.find((draft) => draft.id === selectedId) ?? visible[0];
  return <main id="main-content" tabIndex={-1} className={styles.page}>
    <header className={styles.header}>
      <Link href="/" className={styles.brand}><MapPin size={18} aria-hidden="true" />小獸所</Link>
      <span className={styles.headerLabel}>文案工作頁</span>
      <a href="/" target="_blank" rel="noopener noreferrer" className={styles.mapLink}>開啟主頁地圖<ExternalLink size={14} aria-hidden="true" /></a>
    </header>
    <div className={styles.titleRow}><div><h1>Threads 文案覆核</h1><p>看文案、開來源，確認後再發文。</p></div><span className={styles.indexLabel}>已設定不納入搜尋</span></div>
    <div className={styles.workspace}>
      <aside className={styles.sidebar} aria-label="選擇縣市文案">
        <label className={styles.monthLabel}>文案月份<select value={month} onChange={(event) => setMonth(event.target.value)}>{months.map((value) => <option key={value} value={value}>{value.replace('-', ' 年 ')} 月</option>)}</select></label>
        <p className={styles.sidebarSummary}>{visible.length} 份文案，{visible.filter((draft) => draft.reviewed).length} 份獨立覆核通過</p>
        <nav className={styles.cityList} aria-label="縣市">{visible.map((draft) => <button key={draft.id} onClick={() => setSelectedId(draft.id)} aria-current={selected?.id === draft.id ? 'true' : undefined}>
          <FileText size={16} aria-hidden="true" /><span>{draft.city}</span><span className={draft.reviewed ? styles.statusDot : styles.pendingDot} aria-label={draft.reviewed ? '獨立覆核通過' : '未記錄獨立覆核'} />
        </button>)}</nav>
        <p className={styles.sidebarNote}>文案覆核狀態與醫院資料查核範圍不同，詳細說明見「查核結果」。</p>
      </aside>
      {selected ? <DraftContent key={`${selected.id}:${selected.version}`} draft={selected} /> : <div className={styles.empty}>目前沒有縣市文案。</div>}
    </div>
    <p className={styles.pageFootnote}>本頁未列入 sitemap，並設有 noindex。知道網址的人仍可開啟。</p>
  </main>;
}
