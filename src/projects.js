import {knowledgeArticle} from './project-articles/knowledge.js';
import {memoryArticle} from './project-articles/memory.js';
import {seraArticle} from './project-articles/sera.js';

export const projects=[
 {
  id:'knowledge-base',name:'个人知识库',
  subtitle:'把本地资料、阅读与智能协作连成一个工作台。',
  category:'知识管理',status:'插件与客户端持续迭代',
  repository:'https://github.com/KingsleyAsher/Personal-Knowledge-Base',
  tags:['Electron','React','Node.js','混合检索'],article:knowledgeArticle
 },
 {
  id:'dsh-memory',name:'DSH 长期记忆',
  subtitle:'让对话里的长期信息可追溯、可更正，也能按需被想起。',
  category:'智能体工具',status:'公开版本 1.0.4',
  repository:'https://github.com/KingsleyAsher/DSH-Memory',
  tags:['Python','SQLite','DSH 插件','证据与状态'],article:memoryArticle
 },
 {
  id:'sera-retrieval',name:'SERA 检索架构研究',
  subtitle:'探索稀疏激活、状态复用与预测性工作之间的协同。',
  category:'检索研究',status:'研究原型 · 公开阶段档案',
  repository:'https://github.com/KingsleyAsher/SERA-Retrieval',
  tags:['Python','SQLite','USearch','可控 IVF'],article:seraArticle
 }
];

export function articleCharacters(article){
 return JSON.stringify(article.sections).replace(/[A-Za-z0-9\s{}\[\]":,]/g,'').length;
}
