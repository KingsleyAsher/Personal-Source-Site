import {useEffect,useState} from 'react';
import {ArrowRight,ArrowLeft,ArrowUpRight} from '@phosphor-icons/react';
import {projects} from './projects.js';
const readId=()=>location.hash.split('/')[1]||'';
const chapters=['项目说明','技术框架','核心机制','实现思路','演进记录','当前边界','说明来源'];
export function Projects(){
 const [id,setId]=useState(readId),[filter,setFilter]=useState('全部');
 useEffect(()=>{const sync=()=>setId(readId());addEventListener('hashchange',sync);return()=>removeEventListener('hashchange',sync);},[]);
 const current=projects.find(p=>p.id===id);
 const open=id=>{location.hash=id?'projects/'+id:'projects';window.scrollTo({top:0,behavior:'instant'});};
 if(current)return <article className="project-detail" key={id}>
  <button className="text-link project-back" onClick={()=>open('')}><ArrowLeft size={18}/>全部项目</button>
  <header className="project-title"><p className="eyebrow">项目技术档案 / {current.category}</p><h1>{current.name}</h1><p>{current.subtitle}</p><div className="project-metadata"><span>{current.status}</span><span>中文说明 · 整理于 2026-11-05</span></div><a className="repo-link" href={current.repository} target="_blank" rel="noopener noreferrer">访问项目仓库 <ArrowUpRight size={19}/><span>{current.repository.replace('https://github.com/','')}</span></a></header>
  <div className="project-reading-layout"><nav className="project-toc" aria-label="项目文章目录"><p>本文目录</p>{chapters.map((title,i)=><button key={title} onClick={()=>document.getElementById('project-chapter-'+i)?.scrollIntoView({behavior:'smooth',block:'start'})}><span>0{i+1}</span>{title}</button>)}</nav>
  <div className="project-prose">
   <section id="project-chapter-0"><h2>项目说明</h2>{current.intro.map(p=><p key={p}>{p}</p>)}</section>
   <section id="project-chapter-1"><h2>技术框架</h2><dl className="framework-list">{current.framework.map(([name,text])=><div key={name}><dt>{name}</dt><dd>{text}</dd></div>)}</dl><div className="project-flow"><p>工作链路</p><ol>{current.flow.map(step=><li key={step}>{step}</li>)}</ol></div></section>
   <section id="project-chapter-2"><h2>核心机制</h2>{current.mechanisms.map(m=><div className="mechanism" key={m.title}><h3>{m.title}</h3><p>{m.text}</p></div>)}</section>
   <section id="project-chapter-3"><h2>实现思路</h2><ol className="approach-list">{current.approach.map(p=><li key={p}>{p}</li>)}</ol></section>
   <section id="project-chapter-4"><h2>演进记录</h2><ol className="project-timeline">{current.evolution.map(([stage,text])=><li key={stage}><h3>{stage}</h3><p>{text}</p></li>)}</ol></section>
   <section id="project-chapter-5"><h2>当前边界</h2><div className="project-boundaries">{current.boundaries.map(p=><p key={p}>{p}</p>)}</div></section>
   <section id="project-chapter-6"><h2>说明来源</h2><p className="source-note">依据项目公开中文文档与当前站点实现整理。以下链接便于追溯设计和版本变化。</p><div className="project-sources">{current.sources.map(s=><a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">{s.label}<ArrowUpRight size={17}/></a>)}</div></section>
   <div className="project-end"><button className="text-link" onClick={()=>open('')}><ArrowLeft size={18}/>返回项目总览</button><a className="text-link" href={current.repository} target="_blank" rel="noopener noreferrer">前往仓库 <ArrowUpRight size={18}/></a></div>
  </div></div>
 </article>;
 return <section className="projects-page"><header className="projects-intro"><p className="eyebrow">构建与探索</p><h1>让想法，<br/><span>在实践中生长。</span></h1><p>记录我做过的项目，也记录它们为什么这样构建。<br/>从技术框架到核心机制，从实现思路到一次次演进。</p><div className="project-summary"><b>{projects.length}</b> 个项目<span>知识管理 · 智能体工具 · 检索研究</span></div></header>
 <div className="projects-list-heading"><h2>项目档案</h2><div className="project-filters" aria-label="项目分类">{['全部',...new Set(projects.map(p=>p.category))].map(v=><button key={v} aria-pressed={filter===v} onClick={()=>setFilter(v)}>{v}</button>)}</div></div>
 <div className="projects-list">{projects.filter(p=>filter==='全部'||filter===p.category).map((p,i)=><article className="project-entry" key={p.id}><span className="project-number">0{projects.indexOf(p)+1}</span><div className="project-entry-content"><div className="project-entry-kicker"><span>{p.category}</span><span>{p.status}</span></div><h3><button onClick={()=>open(p.id)}>{p.name}</button></h3><p>{p.subtitle}</p><div className="project-tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div><div className="project-entry-actions"><a href={'#projects/'+p.id} className="text-link">阅读技术说明 <ArrowRight size={18}/></a><a className="project-repo" href={p.repository} target="_blank" rel="noopener noreferrer">项目仓库 <ArrowUpRight size={17}/></a></div></div></article>)}</div>
 </section>;
}
