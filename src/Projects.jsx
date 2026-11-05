import {useEffect,useState} from 'react';
import {ArrowRight,ArrowLeft,ArrowUpRight,List} from '@phosphor-icons/react';
import {projects,articleCharacters} from './projects.js';
import {TechnicalArticle} from './TechnicalArticle.jsx';

const readRoute=()=>({id:location.hash.split('/')[1]||'',chapter:location.hash.split('/')[2]||''});
const chapterUrl=(project,chapter)=>'#projects/'+project.id+(chapter?'/'+chapter:'');
function chapterPreview(section){
 const headings=section.blocks.map(b=>b.title).filter(Boolean);
 if(headings.length)return headings.slice(0,3).join(' · ');
 const events=section.blocks.flatMap(b=>b.timeline||[]);
 if(events.length)return events.length+' 个演进与重大事件节点，按阶段和版本展开。';
 const paragraph=section.blocks.flatMap(b=>b.paragraphs||[])[0];
 if(paragraph)return paragraph.split('。')[0]+'。';
 const table=section.blocks.find(b=>b.table)?.table;
 return table?table.rows.slice(0,3).map(row=>row[0]).join(' · '):'技术方案与执行流程。';
}

export function Projects(){
 const [route,setRoute]=useState(readRoute),[filter,setFilter]=useState('全部'),[tocOpen,setTocOpen]=useState(()=>!matchMedia('(max-width:900px)').matches);
 useEffect(()=>{const sync=()=>{setRoute(readRoute());setTocOpen(!matchMedia('(max-width:900px)').matches);};addEventListener('hashchange',sync);return()=>removeEventListener('hashchange',sync);},[]);
 useEffect(()=>{const media=matchMedia('(max-width:900px)');const sync=()=>setTocOpen(!media.matches);media.addEventListener('change',sync);return()=>media.removeEventListener('change',sync);},[]);
 const current=projects.find(p=>p.id===route.id);
 const chapters=current?.article.sections||[];
 const chapterIndex=chapters.findIndex(s=>s.id===route.chapter);
 const chapter=chapters[chapterIndex];
 if(current)return <article className={'project-detail '+(chapter?'chapter-view':'directory-view')} key={route.id}>
  <div className="project-breadcrumb"><a className="text-link" href="#projects"><ArrowLeft size={17}/>全部项目</a>{chapter&&<><span>/</span><a href={chapterUrl(current)}>{current.name}</a></>}</div>
  {chapter?<header className="chapter-page-header"><p className="eyebrow">{current.name} / 技术档案</p><h1>{chapter.title}</h1><p>第 {chapterIndex+1} 章，共 {chapters.length} 章</p></header>:<header className="project-title"><p className="eyebrow">项目技术档案 / {current.category}</p><h1>{current.name}</h1><p>{current.subtitle}</p><div className="project-metadata"><span>{current.status}</span><span>详细技术档案 · 更新于 2026-11-05</span></div><a className="repo-link" href={current.repository} target="_blank" rel="noopener noreferrer">访问项目仓库 <ArrowUpRight size={19}/><span>{current.repository.replace('https://github.com/','')}</span></a><div className="article-overview"><span>{chapters.length} 个章节</span><span>约 {Math.round(articleCharacters(current.article)/1000*10)/10} 千字</span><span>{current.article.version}</span></div></header>}
  {chapter?<div className="project-reading-layout">
   <nav className="project-toc" aria-label="项目文章目录"><details open={tocOpen} onToggle={e=>setTocOpen(e.currentTarget.open)}><summary><span>本项目章节</span><span>{tocOpen?'收起':'展开'}<List size={16}/></span></summary><a className="chapter-directory-link" href={chapterUrl(current)}><List size={16}/>完整目录</a>{chapters.map((c,i)=><a key={c.id} href={chapterUrl(current,c.id)} aria-current={chapter.id===c.id?'page':undefined}><span>{String(i+1).padStart(2,'0')}</span>{c.title}</a>)}</details></nav>
   <div className="project-prose">
    <TechnicalArticle section={chapter} index={chapterIndex}/>
    <nav className="chapter-pagination" aria-label="章节翻页">{chapterIndex>0?<a href={chapterUrl(current,chapters[chapterIndex-1].id)}><span><ArrowLeft size={15}/>上一章</span><strong>{chapters[chapterIndex-1].title}</strong></a>:<a href={chapterUrl(current)}><span><List size={15}/>返回目录</span><strong>查看全部章节</strong></a>}{chapterIndex<chapters.length-1?<a href={chapterUrl(current,chapters[chapterIndex+1].id)}><span>下一章<ArrowRight size={15}/></span><strong>{chapters[chapterIndex+1].title}</strong></a>:<a href={chapterUrl(current)}><span>已读至末章<List size={15}/></span><strong>返回项目目录</strong></a>}</nav>
    <div className="project-end"><a className="text-link" href={chapterUrl(current)}><List size={17}/>完整目录</a><a className="text-link" href={current.repository} target="_blank" rel="noopener noreferrer">项目仓库 <ArrowUpRight size={17}/></a></div>
   </div>
  </div>:<section className="chapter-directory" aria-labelledby="chapter-directory-title"><header><div><p className="eyebrow">按主题阅读</p><h2 id="chapter-directory-title">技术档案目录</h2></div><a className="text-link" href={chapterUrl(current,chapters[0].id)}>从第一章开始<ArrowRight size={18}/></a></header><div className="chapter-directory-grid">{chapters.map((c,i)=><a className="chapter-directory-entry" href={chapterUrl(current,c.id)} key={c.id}><span className="directory-number">{String(i+1).padStart(2,'0')}</span><div><h3>{c.title}</h3><p>{chapterPreview(c)}</p></div><ArrowRight className="directory-arrow" size={18}/></a>)}</div></section>}
 </article>;

 return <section className="projects-page"><header className="projects-intro"><p className="eyebrow">构建与探索</p><h1>让想法，<br/><span>在实践中生长。</span></h1><p>记录我做过的项目，也记录它们为什么这样构建。<br/>从计划目标与设计，到技术路径、架构机制和重大更新。</p><div className="project-summary"><b>{projects.length}</b> 个项目<span>知识管理 · 智能体工具 · 检索研究</span></div></header>
 <div className="projects-list-heading"><h2>项目档案</h2><div className="project-filters" aria-label="项目分类">{['全部',...new Set(projects.map(p=>p.category))].map(v=><button key={v} aria-pressed={filter===v} onClick={()=>setFilter(v)}>{v}</button>)}</div></div>
 <div className="projects-list">{projects.filter(p=>filter==='全部'||filter===p.category).map(p=><article className="project-entry" key={p.id}><span className="project-number">0{projects.indexOf(p)+1}</span><div className="project-entry-content"><div className="project-entry-kicker"><span>{p.category}</span><span>{p.status}</span></div><h3><a href={chapterUrl(p)}>{p.name}</a></h3><p>{p.subtitle}</p><p className="project-article-meta">{p.article.sections.length} 个章节 · 约 {Math.round(articleCharacters(p.article)/1000*10)/10} 千字 · 含设计与演进记录</p><div className="project-tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div><div className="project-entry-actions"><a href={chapterUrl(p)} className="text-link">阅读技术说明 <ArrowRight size={18}/></a><a className="project-repo" href={p.repository} target="_blank" rel="noopener noreferrer">项目仓库 <ArrowUpRight size={17}/></a></div></div></article>)}</div>
 </section>;
}
