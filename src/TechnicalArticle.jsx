import {ArrowUpRight} from '@phosphor-icons/react';

export function sourceUrl(project,index){
 const [path]=project.article.sources[index];
 return project.repository+'/blob/'+project.article.snapshot+'/'+path.split('/').map(encodeURIComponent).join('/');
}

export function ArticleBlock({block}){
 return <div className="technical-block">
  {block.title&&<h3>{block.title}</h3>}
  {block.note&&<aside className="technical-note">{block.note}</aside>}
  {block.paragraphs?.map((p,i)=><p key={i}>{p}</p>)}
  {block.items&&<ul className="technical-list">{block.items.map((p,i)=><li key={i}>{p}</li>)}</ul>}
  {block.steps&&<ol className="technical-steps">{block.steps.map((p,i)=><li key={i}><span>{String(i+1).padStart(2,'0')}</span><p>{p}</p></li>)}</ol>}
  {block.table&&<div className="technical-table-wrap"><table className="technical-table"><thead><tr>{block.table.headers.map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{block.table.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=>j===0?<th scope="row" key={j}>{cell}</th>:<td data-label={block.table.headers[j]} key={j}>{cell}</td>)}</tr>)}</tbody></table></div>}
  {block.timeline&&<ol className="technical-timeline">{block.timeline.map((event,i)=><li key={i}><p className="event-date">{event.when}</p><h3>{event.title}</h3><p>{event.body}</p></li>)}</ol>}
 </div>;
}

export function TechnicalArticle({project}){
 const article=project.article;
 return <>
  {article.sections.map((section,i)=><section id={'project-chapter-'+section.id} key={section.id} className="technical-section" aria-labelledby={'chapter-heading-'+section.id}>
   <div className="technical-section-heading"><span>{String(i+1).padStart(2,'0')}</span><h2 id={'chapter-heading-'+section.id}>{section.title}</h2></div>
   {section.blocks.map((block,j)=><ArticleBlock block={block} key={j}/>)}
   {section.refs?.length>0&&<div className="chapter-sources"><span>本章依据</span>{section.refs.map(n=><a href={sourceUrl(project,n)} key={n} target="_blank" rel="noopener noreferrer">{article.sources[n][1]} <ArrowUpRight size={13}/></a>)}</div>}
  </section>)}
  <section id="project-chapter-bibliography" aria-labelledby="chapter-heading-bibliography" className="technical-section">
   <div className="technical-section-heading"><span>{String(article.sections.length+1).padStart(2,'0')}</span><h2 id="chapter-heading-bibliography">资料来源与版本</h2></div>
   <p className="source-note">本文依据项目公开文档与实现整理，历史实验为原报告记录，本次扩写未重新运行。各章出处固定至同一仓库版本，便于核对技术方案与当时结论。</p>
   <div className="source-snapshot"><span>参考版本</span><a href={project.repository+'/tree/'+article.snapshot} target="_blank" rel="noopener noreferrer">{article.snapshot.slice(0,12)} <ArrowUpRight size={14}/></a><span>{article.version}</span></div>
   <ol className="bibliography-list">{article.sources.map(([path,label],i)=><li key={path}><a href={sourceUrl(project,i)} target="_blank" rel="noopener noreferrer"><span>{label}</span><ArrowUpRight size={16}/></a></li>)}</ol>
  </section>
 </>;
}
