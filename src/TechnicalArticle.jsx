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

export function TechnicalArticle({section,index}){
 return <section id={'project-chapter-'+section.id} className="technical-section" aria-labelledby={'chapter-heading-'+section.id}>
   <div className="technical-section-heading"><span>{String(index+1).padStart(2,'0')}</span><h2 id={'chapter-heading-'+section.id}>{section.title}</h2></div>
   {section.blocks.map((block,j)=><ArticleBlock block={block} key={j}/>)}
 </section>;
}
