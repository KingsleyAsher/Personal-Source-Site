import {useEffect,useRef,useState} from 'react';
import {ArrowRight,ArrowLeft,ArrowUpRight,List} from '@phosphor-icons/react';
import {projects,articleCharacters} from './projects.js';
import {TechnicalArticle} from './TechnicalArticle.jsx';

const readRoute=()=>({id:location.hash.split('/')[1]||'',chapter:location.hash.split('/')[2]||''});
const chapterUrl=(project,chapter)=>'#projects/'+project.id+(chapter?'/'+chapter:'');
export function Projects(){
 const [route,setRoute]=useState(readRoute),[filter,setFilter]=useState('全部'),[tocOpen,setTocOpen]=useState(()=>!matchMedia('(max-width:900px)').matches);
 const [activeChapter,setActiveChapter]=useState('');
 const tocRef=useRef(null);
 useEffect(()=>{const sync=()=>{setRoute(readRoute());setTocOpen(!matchMedia('(max-width:900px)').matches);};addEventListener('hashchange',sync);return()=>removeEventListener('hashchange',sync);},[]);
 useEffect(()=>{const media=matchMedia('(max-width:900px)');const sync=()=>setTocOpen(!media.matches);media.addEventListener('change',sync);return()=>media.removeEventListener('change',sync);},[]);
 const current=projects.find(p=>p.id===route.id);
 const chapters=current?.article.sections||[];
 useEffect(()=>{
  if(!current||!route.chapter)return;
  const frame=requestAnimationFrame(()=>document.getElementById('project-chapter-'+route.chapter)?.scrollIntoView({block:'start',behavior:'instant'}));
  return()=>cancelAnimationFrame(frame);
 },[route.id,route.chapter,current]);
 useEffect(()=>{
  if(!current){setActiveChapter('');return;}
  const sections=current.article.sections.map(s=>document.getElementById('project-chapter-'+s.id)).filter(Boolean);
  let frame=0;
  const update=()=>{
   frame=0;
   const line=Math.min(140,innerHeight*.22);
   let active=sections[0];
   for(const section of sections){if(section.getBoundingClientRect().top<=line)active=section;else break;}
   if(scrollY+innerHeight>=document.documentElement.scrollHeight-3)active=sections.at(-1);
   if(active)setActiveChapter(active.id.replace('project-chapter-',''));
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
  const observer=new ResizeObserver(schedule);
  const prose=document.querySelector('.continuous-project .project-prose');if(prose)observer.observe(prose);
  schedule();
  return()=>{removeEventListener('scroll',schedule);removeEventListener('resize',schedule);observer.disconnect();cancelAnimationFrame(frame);};
 },[current?.id]);
 useEffect(()=>{
  const nav=tocRef.current,link=nav?.querySelector('[aria-current="location"]');
  if(!nav||!link||!tocOpen)return;
  const bounds=nav.getBoundingClientRect(),item=link.getBoundingClientRect();
  const toggle=nav.querySelector('.toc-toggle');
  const top=bounds.top+(toggle?.getBoundingClientRect().height||0)+12;
  if(item.top<top)nav.scrollTop-=top-item.top;
  else if(item.bottom>bounds.bottom-12)nav.scrollTop+=item.bottom-bounds.bottom+12;
 },[activeChapter,tocOpen]);
 if(current)return <article className="project-detail continuous-project" key={route.id}>
  <div className="project-breadcrumb"><a className="text-link" href="#projects"><ArrowLeft size={17}/>全部项目</a></div>
  <header className="project-title"><p className="eyebrow">项目技术档案 / {current.category}</p><h1>{current.name}</h1><p>{current.subtitle}</p><div className="project-metadata"><span>{current.status}</span><span>详细技术档案 · 更新于 2026-11-05</span></div><a className="repo-link" href={current.repository} target="_blank" rel="noopener noreferrer">访问项目仓库 <ArrowUpRight size={19}/><span>{current.repository.replace('https://github.com/','')}</span></a><div className="article-overview"><span>{chapters.length} 个章节</span><span>约 {Math.round(articleCharacters(current.article)/1000*10)/10} 千字</span><span>{current.article.version}</span></div></header>
  <div className={'project-reading-layout '+(tocOpen?'toc-expanded':'toc-retracted')}>
   <nav className="project-toc" ref={tocRef} aria-label="项目文章目录"><button className="toc-toggle" aria-label={tocOpen?'收起侧边目录':'展开侧边目录'} aria-expanded={tocOpen} aria-controls="project-chapter-links" onClick={()=>setTocOpen(v=>!v)}><List size={19}/><span>{tocOpen?'收起':'目录'}</span></button><div className="toc-items" id="project-chapter-links"><p className="continuous-toc-label">本文目录</p>{chapters.map((c,i)=><a key={c.id} href={chapterUrl(current,c.id)} aria-current={activeChapter===c.id?'location':undefined} onClick={()=>{if(route.chapter===c.id){if(matchMedia('(max-width:900px)').matches)setTocOpen(false);requestAnimationFrame(()=>document.getElementById('project-chapter-'+c.id)?.scrollIntoView({block:'start',behavior:'instant'}));}}}><span>{String(i+1).padStart(2,'0')}</span>{c.title}</a>)}</div></nav>
   <div className="project-prose">
    {chapters.map((chapter,index)=><TechnicalArticle key={chapter.id} section={chapter} index={index}/>)}
    <div className="project-end"><a className="text-link" href="#projects"><ArrowLeft size={17}/>全部项目</a><a className="text-link" href={current.repository} target="_blank" rel="noopener noreferrer">项目仓库 <ArrowUpRight size={17}/></a></div>
   </div>
  </div>
 </article>;

 return <section className="projects-page"><header className="projects-intro"><p className="eyebrow">构建与探索</p><h1>让想法，<br/><span>在实践中生长。</span></h1><p>记录我做过的项目，也记录它们为什么这样构建。<br/>从计划目标与设计，到技术路径、架构机制和重大更新。</p><div className="project-summary"><b>{projects.length}</b> 个项目<span>知识管理 · 智能体工具 · 检索研究</span></div></header>
 <div className="projects-list-heading"><h2>项目档案</h2><div className="project-filters" aria-label="项目分类">{['全部',...new Set(projects.map(p=>p.category))].map(v=><button key={v} aria-pressed={filter===v} onClick={()=>setFilter(v)}>{v}</button>)}</div></div>
 <div className="projects-list">{projects.filter(p=>filter==='全部'||filter===p.category).map(p=><article className="project-entry" key={p.id}><span className="project-number">0{projects.indexOf(p)+1}</span><div className="project-entry-content"><div className="project-entry-kicker"><span>{p.category}</span><span>{p.status}</span></div><h3><a href={chapterUrl(p)}>{p.name}</a></h3><p>{p.subtitle}</p><p className="project-article-meta">{p.article.sections.length} 个章节 · 约 {Math.round(articleCharacters(p.article)/1000*10)/10} 千字 · 含设计与演进记录</p><div className="project-tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div><div className="project-entry-actions"><a href={chapterUrl(p)} className="text-link">阅读技术说明 <ArrowRight size={18}/></a><a className="project-repo" href={p.repository} target="_blank" rel="noopener noreferrer">项目仓库 <ArrowUpRight size={17}/></a></div></div></article>)}</div>
 </section>;
}
