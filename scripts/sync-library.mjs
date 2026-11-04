import fs from 'node:fs/promises';
import {scanLibrary} from './local-library.mjs';
const data=await scanLibrary();
if(data.categories.some(c=>c.status!=='ready'))throw Error('Source folder unavailable; export stopped');
await fs.mkdir(new URL('../public/documents/',import.meta.url),{recursive:true});
for(const c of data.categories)for(const i of c.items){await fs.copyFile(data.files.get(i.id).full,new URL('../public/documents/'+i.id+'.pdf',import.meta.url));i.url='documents/'+i.id+'.pdf';}
await fs.writeFile(new URL('../public/library.json',import.meta.url),JSON.stringify({categories:data.categories,total:data.files.size},null,2));
console.log('Exported '+data.files.size+' PDFs');
