import {ArrowRight,ArrowUpRight,BookOpen,Newspaper,Code} from '@phosphor-icons/react';

export function Home({categories,total,loading,onNavigate,onCategory}){
 const notes=categories.filter(c=>c.id!=='news').reduce((sum,c)=>sum+c.items.length,0);
 const news=categories.find(c=>c.id==='news');
 return <div className="home-page">
  <section className="home-welcome" aria-labelledby="welcome-title">
   <div className="home-intro">
    <p className="eyebrow">KINGSLEY’S DIGITAL STUDY</p>
    <h1 id="welcome-title">所学，所想，<br/><span>有所归处。</span></h1>
    <p className="home-description">你好，我是 Kingsley。<br/>欢迎来到我的数字书房。把学习留下的笔记、阅读中的发现，<br className="desktop-break"/>和动手构建的想法，慢慢收藏在这里。</p>
    <div className="home-actions"><button className="primary" onClick={()=>onNavigate('资料归档')}>进入知识书架 <ArrowRight size={21}/></button><button className="text-link" onClick={()=>onNavigate('关于')}>关于这个小站 <ArrowUpRight size={18}/></button></div>
    <div className="home-record" aria-label="书房收录概览"><span><b>{loading?'—':total}</b> 份资料已归档</span><span><b>{loading?'—':categories.length}</b> 个知识板块</span><span>持续积累中</span></div>
   </div>
   <aside className="study-object" aria-label="书房寄语">
    <div className="study-object-top"><span>THE QUIET CORNER</span><span>知隅 / 01</span></div>
    <img src="./assets/project-notebook.png" alt="暖白色笔记本与橄榄枝"/>
    <div className="study-object-caption"><p>让零散的发现，<br/>长成自己的知识。</p><span>阅读 · 思考 · 构建</span></div>
   </aside>
  </section>
  <section className="home-explore" aria-labelledby="explore-title">
   <div className="home-section-heading"><div><p className="eyebrow">A PLACE FOR EVERY IDEA</p><h2 id="explore-title">从这里，开始探索。</h2></div><p>循着兴趣，找到值得停留的一页。</p></div>
   <div className="home-paths">
    <button className="home-path" onClick={()=>onNavigate('学习笔记')}><div className="path-top"><BookOpen size={26} weight="light"/><span>01 / STUDY</span></div><h3>学习笔记</h3><p>从一个定义，到一次推导。<br/>整理数学课程里的理解与思考。</p><div className="path-bottom"><span>{loading?'课程笔记':notes+' 份课程笔记'}</span><ArrowRight size={20}/></div></button>
    <button className="home-path" onClick={()=>onCategory('news')}><div className="path-top"><Newspaper size={26} weight="light"/><span>02 / READING</span></div><h3>信息与阅读</h3><p>把值得留下的信息收进档案，<br/>在时间的脉络里重新发现。</p><div className="path-bottom"><span>{loading?'信息报归档':(news?.items.length||0)+' 份信息报'}</span><ArrowRight size={20}/></div></button>
    <button className="home-path" onClick={()=>onNavigate('项目程序')}><div className="path-top"><Code size={26} weight="light"/><span>03 / MAKING</span></div><h3>项目实践</h3><p>让想法走出纸面，<br/>记录程序与作品的构建过程。</p><div className="path-bottom"><span>3 个项目 · 中文技术档案</span><ArrowRight size={20}/></div></button>
   </div>
  </section>
  <section className="home-closing"><span>ABOUT THIS SPACE</span><p>保持好奇，持续构建。<br/><small>一个安放知识，也留给新想法的地方。</small></p><button className="text-link" onClick={()=>onNavigate('关于')}>认识知隅 <ArrowUpRight size={18}/></button></section>
 </div>;
}
