
import fs from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const config=fileURLToPath(new URL('../.local/library.json',import.meta.url));
const chinese={一:1,二:2,三:3,四:4,五:5,六:6,七:7,八:8,九:9,十:10};
function number(v){if(/^\d+$/.test(v))return Number(v);if(v.includes('十')){const [a,b]=v.split('十');return (a?chinese[a]:1)*10+(chinese[b]||0);}return chinese[v]||0;}
export function order(title){const a=title.match(/^第([零一二三四五六七八九十百\d]+)/);const b=title.match(/§(\d+)/);return (a?number(a[1]):0)*100+(b?Number(b[1]):0)+(title.includes('至')?50:0);}
export async function scanLibrary(){
 const sources=JSON.parse(await fs.readFile(config,'utf8'));const files=new Map();const categories=[];
 for(const source of sources){
  const items=[];let status='ready';let base;
  try{base=await fs.realpath(source.folder);
   async function walk(dir,relative=''){for(const entry of await fs.readdir(dir,{withFileTypes:true})){
    if(entry.isSymbolicLink()||entry.name.startsWith('.'))continue;
    const full=path.join(dir,entry.name),rel=path.join(relative,entry.name);
    if(entry.isDirectory()){await walk(full,rel);continue;}
    if(!entry.isFile()||path.extname(entry.name).toLowerCase()!=='.pdf')continue;
    const stat=await fs.stat(full);const id=createHash('sha256').update(source.id+'/'+rel).digest('hex').slice(0,24);
    files.set(id,{full,base,name:entry.name});
    items.push({id,title:entry.name.replace(/\.pdf$/i,''),filename:entry.name,categoryId:source.id,category:source.name,subsection:relative.split(path.sep).join(' / '),bytes:stat.size,modified:stat.mtime.toISOString(),url:'/api/library/file/'+id});
   }}
   await walk(base);
  }catch{status='unavailable';}
  items.sort((a,b)=>source.id==='news'?b.title.replace(/.*?(\d{4}-\d{2}-\d{2}).*/,'$1').localeCompare(a.title.replace(/.*?(\d{4}-\d{2}-\d{2}).*/,'$1')):order(a.title)-order(b.title)||a.title.localeCompare(b.title,'zh-CN',{numeric:true}));
  categories.push({id:source.id,name:source.name,description:source.description,status,count:items.length,items});
 }
 return {categories,files};
}
export function localLibrary(){
 let current;
 const install=server=>{server.middlewares.use(async(req,res,next)=>{
  if(!req.url?.startsWith('/api/library'))return next();
  const remote=req.socket.remoteAddress;
  if(!['127.0.0.1','::1','::ffff:127.0.0.1'].includes(remote)){res.statusCode=403;return res.end('Local access only');}
  if(req.headers.origin&&req.headers.origin!=='http://'+req.headers.host){res.statusCode=403;return res.end('Origin not allowed');}
  if(!['GET','HEAD'].includes(req.method)){res.statusCode=405;return res.end();}
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
  const url=new URL(req.url,'http://localhost');
  try{
   if(url.pathname==='/api/library'){
    current=await scanLibrary();res.setHeader('Content-Type','application/json; charset=utf-8');
    return res.end(JSON.stringify({categories:current.categories,total:current.files.size}));
   }
   const match=url.pathname.match(/^\/api\/library\/file\/([a-f0-9]{24})$/);
   if(!match){res.statusCode=404;return res.end('Not found');}
   if(!current)current=await scanLibrary();
   const entry=current.files.get(match[1]);if(!entry){res.statusCode=404;return res.end('Not found');}
   const real=await fs.realpath(entry.full),relative=path.relative(entry.base,real);
   if(relative.startsWith('..')||path.isAbsolute(relative)){res.statusCode=403;return res.end('Not allowed');}
   const stat=await fs.stat(real);res.setHeader('Content-Type','application/pdf');res.setHeader('Content-Length',stat.size);
   res.setHeader('Content-Disposition',"inline; filename*=UTF-8''"+encodeURIComponent(entry.name).replace(/'/g,'%27'));
   if(req.method==='HEAD')return res.end();
   const stream=createReadStream(real);stream.on('error',()=>res.destroy());req.on('close',()=>stream.destroy());stream.pipe(res);
  }catch{res.statusCode=503;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:'资料暂时无法读取，请检查本机文件夹后重试。'}));}
 });};
 return {name:'local-knowledge-library',configureServer:install,configurePreviewServer:install};
}
