import {useEffect,useRef,useState} from 'react';
import {getDocument,GlobalWorkerOptions} from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {Minus,Plus,DownloadSimple} from '@phosphor-icons/react';
GlobalWorkerOptions.workerSrc=workerUrl;

// Reserve space for every page, rendering only nearby pages to bound memory use.
function PdfPage({pdf,number,width,zoom,stage,title,onVisible}){
 const element=useRef(null),canvas=useRef(null);
 const [near,setNear]=useState(false),[ratio,setRatio]=useState(1.414),[error,setError]=useState('');
 const displayWidth=width*zoom;
 useEffect(()=>{let live=true;pdf.getPage(number).then(p=>{if(live){const v=p.getViewport({scale:1});setRatio(v.height/v.width);}}).catch(()=>{if(live)setError('这一页暂时无法显示，请重新打开文件。');});return()=>{live=false;};},[pdf,number]);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setNear(entry.isIntersecting),{root:stage.current,rootMargin:'800px 0px'});observer.observe(element.current);return()=>observer.disconnect();},[stage]);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting)onVisible(number);},{root:stage.current,rootMargin:'0px 0px -65% 0px',threshold:0});observer.observe(element.current);return()=>observer.disconnect();},[stage,number,onVisible]);
 useEffect(()=>{if(!near)return;let cancelled=false,render;setError('');
  (async()=>{try{const p=await pdf.getPage(number);if(cancelled)return;
   const native=p.getViewport({scale:1}),viewport=p.getViewport({scale:displayWidth/native.width});
   const density=Math.min(window.devicePixelRatio||1,2),target=canvas.current;
   target.width=Math.floor(viewport.width*density);target.height=Math.floor(viewport.height*density);
   render=p.render({canvasContext:target.getContext('2d'),viewport,transform:density===1?null:[density,0,0,density,0,0]});await render.promise;
  }catch(e){if(!cancelled&&e.name!=='RenderingCancelledException')setError('这一页暂时无法显示，请重新打开文件。');}})();
  return()=>{cancelled=true;render?.cancel();};
 },[pdf,number,near,displayWidth]);
 return <div className="pdf-page" ref={element} style={{width:displayWidth,height:displayWidth*ratio}} aria-label={'第 '+number+' 页'}>
  {near?<canvas ref={canvas} role="img" aria-label={title+'，第 '+number+' 页'}/>:<span className="pdf-page-placeholder">第 {number} 页</span>}
  {error&&<p className="pdf-page-error" role="alert">{error}</p>}
 </div>;
}

export function PdfPreview({item}){
 const [pdf,setPdf]=useState(null),[page,setPage]=useState(1),[zoom,setZoom]=useState(1),[width,setWidth]=useState(600),[error,setError]=useState('');
 const stage=useRef(null);const [full,setFull]=useState(false);
 useEffect(()=>{const sync=()=>setFull(Boolean(document.fullscreenElement));document.addEventListener('fullscreenchange',sync);return()=>document.removeEventListener('fullscreenchange',sync);},[]);
 async function fullscreen(){const d=stage.current.closest('dialog');try{if(document.fullscreenElement)await document.exitFullscreen();else await d.requestFullscreen();}catch{d.classList.toggle('expanded-reader');setFull(d.classList.contains('expanded-reader'));}}
 useEffect(()=>{let live=true;setError('');setPdf(null);setPage(1);setZoom(1);stage.current.scrollTop=0;
  const base=import.meta.env.BASE_URL;
  const task=getDocument({url:item.url,disableRange:true,cMapUrl:base+'pdf-assets/cmaps/',cMapPacked:true,standardFontDataUrl:base+'pdf-assets/standard_fonts/',wasmUrl:base+'pdf-assets/wasm/'});
  task.promise.then(doc=>{if(live)setPdf(doc);}).catch(()=>{if(live)setError('PDF 无法加载，请关闭后重新预览。');});
  return()=>{live=false;task.destroy().catch(()=>{});};
 },[item.id,item.url]);
 useEffect(()=>{const observer=new ResizeObserver(entries=>setWidth(Math.max(100,entries[0].contentRect.width-32)));observer.observe(stage.current);return()=>observer.disconnect();},[]);
 return <div className="pdf-preview"><div className="pdf-toolbar">
  <span className="continuous-label">连续阅读 · 上下滚动</span>
  <a className="file-open" href={item.url} download={item.title.replace(/\.pdf$/i,'')+'.pdf'}><DownloadSimple size={18}/>下载文件</a>
  <button className="fullscreen-button" onClick={fullscreen}>{full?'退出全屏':'全屏预览'}</button>
  <div className="zoom-controls"><button aria-label="缩小" disabled={zoom<=.75} onClick={()=>setZoom(z=>Math.max(.75,z-.25))}><Minus size={18}/></button><button onClick={()=>setZoom(1)} title="恢复适合宽度">{Math.round(zoom*100)}%</button><button aria-label="放大" disabled={zoom>=2} onClick={()=>setZoom(z=>Math.min(2,z+.25))}><Plus size={18}/></button></div>
 </div><div className="pdf-status" role="status">{error||(!pdf?'正在加载 PDF…':'第 '+page+' 页 · 共 '+pdf.numPages+' 页')}</div>
 <div className="pdf-scroll" ref={stage} aria-label="PDF 连续阅读区域" tabIndex={0} aria-busy={!pdf&&!error}><div className="pdf-canvas">
 {pdf&&Array.from({length:pdf.numPages},(_,i)=><PdfPage key={item.id+'-'+i} pdf={pdf} number={i+1} width={width} zoom={zoom} stage={stage} title={item.title} onVisible={setPage}/>)}
 </div></div></div>;
}
