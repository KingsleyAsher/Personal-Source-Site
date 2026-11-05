import {useEffect,useState} from 'react';
import {ArrowRight,ArrowLeft,ArrowUpRight} from '@phosphor-icons/react';
import {projects,articleCharacters} from './projects.js';
import {TechnicalArticle} from './TechnicalArticle.jsx';
const readId=()=>location.hash.split('/')[1]||'';
export function Projects(){
 const [id,setId]=useState(readId),[filter,setFilter]=useState('全部');
 useEffect(()=>{const sync=()=>setId(readId());addEventListener('hashchange',sync);return()=>removeEventListener('hashchange',sync);},[]);
 const current=projects.find(p=>p.id===id);
 const chapters=current?[...current.article.sections.map(s=>({id:s.id,title:s.title})),{id:'bibliography',title:'资料来源与版本'}]:[];
 const open=id=>{location.hash=id?'projects/'+id:'projects';window.scrollTo({top:0,behavior:'instant'});};
 if(current)return <article className="project-detail" key={id}>
  <button className="text-link project-back" onClick={()=>open('')}><ArrowLeft size={18}/>全部项目</button>
  <header className="project-title"><p className="eyebrow">项目技术档案 / {current.category}</p><h1>{current.name}</h1><p>{current.subtitle}</p><div className="project-metadata"><span>{current.status}</span><span>详细技术档案 · 更新于 2026-11-05</span></div><a className="repo-link" href={current.repository} target="_blank" rel="noopener noreferrer">访问项目仓库 <ArrowUpRight size={19}/><span>{current.repository.replace('https://github.com/','')}</span></a><div className="article-overview"><span>{chapters.length} 个章节</span><span>约 {Math.round(articleCharacters(current.article)/1000*10)/10} 千字</span><span>{current.article.version}</span></div></header>
  <div className="project-reading-layout"><nav className="project-toc" aria-label="项目文章目录"><p>本文目录</p>{chapters.map((chapter,i)=><button key={chapter.id} onClick={()=>document.getElementById('project-chapter-'+chapter.id)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})}><span>{String(i+1).padStart(2,'0')}</span>{chapter.title}</button>)}</nav>
  <div className="project-prose">
   <TechnicalArticle project={current}/>
   <div className="project-end"><button className="text-link" onClick={()=>open('')}><ArrowLeft size={18}/>返回项目总览</button><a className="text-link" href={current.repository} target="_blank" rel="noopener noreferrer">前往仓库 <ArrowUpRight size={18}/></a></div>
  </div></div>
 </article>;
 return <section className="projects-page"><header className="projects-intro"><p className="eyebrow">构建与探索</p><h1>让想法，<br/><span>在实践中生长。</span></h1><p>记录我做过的项目，也记录它们为什么这样构建。<br/>从计划目标与设计，到技术路径、架构机制和重大更新。</p><div className="project-summary"><b>{projects.length}</b> 个项目<span>知识管理 · 智能体工具 · 检索研究</span></div></header>
 <div className="projects-list-heading"><h2>项目档案</h2><div className="project-filters" aria-label="项目分类">{['全部',...new Set(projects.map(p=>p.category))].map(v=><button key={v} aria-pressed={filter===v} onClick={()=>setFilter(v)}>{v}</button>)}</div></div>
 <div className="projects-list">{projects.filter(p=>filter==='全部'||filter===p.category).map((p,i)=><article className="project-entry" key={p.id}><span className="project-number">0{projects.indexOf(p)+1}</span><div className="project-entry-content"><div className="project-entry-kicker"><span>{p.category}</span><span>{p.status}</span></div><h3><button onClick={()=>open(p.id)}>{p.name}</button></h3><p>{p.subtitle}</p><p className="project-article-meta">{p.article.sections.length+1} 个章节 · 约 {Math.round(articleCharacters(p.article)/1000*10)/10} 千字 · 含设计与演进记录</p><div className="project-tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div><div className="project-entry-actions"><a href={'#projects/'+p.id} className="text-link">阅读技术说明 <ArrowRight size={18}/></a><a className="project-repo" href={p.repository} target="_blank" rel="noopener noreferrer">项目仓库 <ArrowUpRight size={17}/></a></div></div></article>)}</div>
 </section>;
}
