
import {useEffect,useRef,useState} from 'react';
import {getDocument,GlobalWorkerOptions} from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {ArrowLeft,ArrowRight,Minus,Plus,ArrowSquareOut} from '@phosphor-icons/react';
GlobalWorkerOptions.workerSrc=workerUrl;
export function PdfPreview({item}){
 const [pdf,setPdf]=useState(null),[page,setPage]=useState(1),[zoom,setZoom]=useState(1),[width,setWidth]=useState(600),[error,setError]=useState(''),[busy,setBusy]=useState(true);
 const stage=useRef(null),host=useRef(null); const [full,setFull]=useState(false);
 useEffect(()=>{const sync=()=>setFull(Boolean(document.fullscreenElement));document.addEventListener('fullscreenchange',sync);return()=>document.removeEventListener('fullscreenchange',sync);},[]);
 async function fullscreen(){const d=stage.current.closest('dialog');try{if(document.fullscreenElement)await document.exitFullscreen();else await d.requestFullscreen();}catch{d.classList.toggle('expanded-reader');setFull(d.classList.contains('expanded-reader'));}}
 useEffect(()=>{let live=true;setError('');setBusy(true);setPdf(null);setPage(1);setZoom(1);
  const task=getDocument({url:item.url,disableRange:true,cMapUrl:'./pdf-assets/cmaps/',cMapPacked:true,standardFontDataUrl:'./pdf-assets/standard_fonts/',wasmUrl:'./pdf-assets/wasm/'});
  task.promise.then(doc=>{if(live)setPdf(doc);}).catch(e=>{if(live){setError('PDF 无法加载，请关闭后重新预览。');setBusy(false);}});
  return()=>{live=false;task.destroy().catch(()=>{});};
 },[item.id,item.url]);
 useEffect(()=>{const observer=new ResizeObserver(entries=>setWidth(Math.max(180,entries[0].contentRect.width-32)));observer.observe(stage.current);return()=>observer.disconnect();},[]);
 useEffect(()=>{if(!pdf)return;let cancelled=false,render;
  setBusy(true);setError('');
  (async()=>{try{const p=await pdf.getPage(page);if(cancelled)return;const native=p.getViewport({scale:1});const viewport=p.getViewport({scale:width/native.width*zoom});const density=Math.min(window.devicePixelRatio||1,2);
   const canvas=document.createElement('canvas');canvas.width=Math.floor(viewport.width*density);canvas.height=Math.floor(viewport.height*density);canvas.style.width=viewport.width+'px';canvas.style.height=viewport.height+'px';canvas.setAttribute('role','img');canvas.setAttribute('aria-label',item.title+'，第 '+page+' 页');
   render=p.render({canvasContext:canvas.getContext('2d'),viewport,transform:density===1?null:[density,0,0,density,0,0]});await render.promise;
   if(!cancelled){host.current.replaceChildren(canvas);stage.current.scrollTop=0;setBusy(false);}
  }catch(e){if(!cancelled&&e.name!=='RenderingCancelledException'){setError('这一页暂时无法显示，请重试。');setBusy(false);}}})();
  return()=>{cancelled=true;render?.cancel();};
 },[pdf,page,zoom,width,item.title]);
 return <div className="pdf-preview"><div className="pdf-toolbar">
  <div className="page-controls"><button aria-label="上一页" disabled={!pdf||page===1} onClick={()=>setPage(p=>p-1)}><ArrowLeft size={18}/></button><label>第 <input aria-label="页码" type="number" min="1" max={pdf?.numPages||1} value={page} onChange={e=>{const n=Number(e.target.value);if(pdf&&n>=1&&n<=pdf.numPages)setPage(n);}}/> / {pdf?.numPages||'—'} 页</label><button aria-label="下一页" disabled={!pdf||page===pdf.numPages} onClick={()=>setPage(p=>p+1)}><ArrowRight size={18}/></button></div>
  <button className="fullscreen-button" onClick={fullscreen}>{full?'退出全屏':'全屏预览'}</button><div className="zoom-controls"><button aria-label="缩小" disabled={zoom<=.75} onClick={()=>setZoom(z=>Math.max(.75,z-.25))}><Minus size={18}/></button><button onClick={()=>setZoom(1)} title="恢复适合宽度">{Math.round(zoom*100)}%</button><button aria-label="放大" disabled={zoom>=2} onClick={()=>setZoom(z=>Math.min(2,z+.25))}><Plus size={18}/></button></div>
 </div><div className="pdf-status" role="status">{error|| (busy?'正在呈现 PDF…':'第 '+page+' 页 · 共 '+pdf?.numPages+' 页')}</div><div className="pdf-scroll" ref={stage} aria-busy={busy}><div className="pdf-canvas" ref={host}/></div></div>;
}
