const PKEY='shima_products_v2';const PRODUCTS_URL='./products.json';const PHONE='09129487759';const WA_NUM='989129487759';
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const fa=n=>Number(n||0).toLocaleString('fa-IR');
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function getLocal(){try{const v=localStorage.getItem(PKEY);if(v===null)return null;const a=JSON.parse(v);if(Array.isArray(a))return a;return null}catch(e){return null}}
let SITE_CACHE=[];let SITE_LOADED=false;
function getP(){const l=getLocal();if(l!==null)return l;if(SITE_LOADED)return SITE_CACHE;return []}
let state={q:'',cat:'all',sort:'newest'};let cache=[];let qvList=[],qvIdx=0,qvName='';
function priceAfter(p){return Math.round((+p.price||0)*(100-(+p.off||0))/100)}
function waLink(n,pr){return 'https://wa.me/'+WA_NUM+'?text='+encodeURIComponent('سلام برای سفارش محصول «'+n+'» ('+Number(pr).toLocaleString('en-US')+' تومان) پیام می‌دهم.')}
async function fetchRemote(){try{localStorage.removeItem('shima_products')}catch(e){}try{const r=await fetch(PRODUCTS_URL+'?v='+Date.now(),{cache:'no-store'});if(r.ok){const j=await r.json();if(Array.isArray(j))SITE_CACHE=j}}catch(e){}SITE_LOADED=true;if(getLocal()===null){try{renderProducts()}catch(e){}}}
function renderProducts(){
try{
const all=getP();
let l=all.filter(p=>(state.cat==='all'||p.cat===state.cat)&&((p.name||'').includes(state.q)||(p.desc||'').includes(state.q)));
if(state.sort==='cheap')l=l.slice().sort((a,b)=>priceAfter(a)-priceAfter(b));
else if(state.sort==='exp')l=l.slice().sort((a,b)=>priceAfter(b)-priceAfter(a));
else if(state.sort==='off')l=l.slice().sort((a,b)=>(b.off||0)-(a.off||0));
else l=l.slice().sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
cache=l;
const rc=$('#resultCount');if(rc)rc.textContent=l.length?l.length.toLocaleString('fa-IR')+' محصول':'محصولی ثبت نشده';
const g=$('#productGrid');if(!g)return;
if(!l.length){g.innerHTML='<p style="grid-column:1/-1;text-align:center;color:#888;padding:2rem;background:#fff;border:1px dashed #e9e1d2;border-radius:14px">هنوز محصولی ثبت نشده. به‌زودی کالاهای جدید اضافه می‌شود.<br>برای سفارش با '+PHONE+' در تماس باشید.</p>';return}
let h='';
l.forEach(p=>{
const pa=priceAfter(p);const im=(p.imgs||[]).filter(Boolean);
const media=im.length?'<img loading="lazy" decoding="async" src="'+im[0]+'" alt="'+esc(p.name)+'">':'<div class="p-noimg"><div><b>SH</b><span>'+esc(p.name)+'</span></div></div>';
h+='<article class="p-card reveal" data-id="'+p.id+'"><div class="p-media" data-open="'+p.id+'">'+media+(p.off?'<span class="p-off">'+fa(p.off)+'٪ تخفیف</span>':'')+(!p.stock?'<span class="p-out">ناموجود</span>':'')+(im.length>1?'<button class="g-arrow r" data-go="1" data-id="'+p.id+'">‹</button><button class="g-arrow l" data-go="-1" data-id="'+p.id+'">›</button>':'')+'<button class="qv-btn" data-qv="'+p.id+'">مشاهده و سفارش</button></div><div class="p-body"><span class="p-cat">'+esc(p.cat)+'</span><h3>'+esc(p.name)+'</h3><div class="p-price"><b>'+fa(pa)+' تومان</b>'+(p.off?'<s>'+fa(p.price)+'</s>':'')+'</div><div class="p-foot"><span class="stock '+(!p.stock?'no':p.stock<10?'low':'')+'">'+(!p.stock?'ناموجود':p.stock<10?'تنها '+fa(p.stock)+' عدد':'موجود')+'</span><button class="order-btn" data-qv="'+p.id+'" '+(!p.stock?'disabled style="opacity:.5"':'')+'>سفارش</button></div></div></article>';
});
g.innerHTML=h;observe();
}catch(e){}
}
function openQV(id){
try{
const p=(cache.find(x=>x.id===id)||getP().find(x=>x.id===id));if(!p)return;
qvList=(p.imgs||[]).filter(Boolean);qvIdx=0;qvName=p.name;
$('#qvName').textContent=p.name;$('#qvCat').textContent=p.cat;$('#qvDesc').textContent=p.desc||'بدون توضیح';
$('#qvPrice').textContent=fa(priceAfter(p))+' تومان';$('#qvOld').textContent=p.off?fa(p.price)+' تومان':'';
$('#qvWa').href=waLink(p.name,priceAfter(p));updQV();
$('#quickModal').classList.add('show');document.body.style.overflow='hidden';
}catch(e){}
}
function updQV(){
try{
const w=$('#qvImgWrap'),c=$('#qvCounter'),t=$('#qvThumbs');if(!w)return;w.innerHTML='';
if(!qvList.length){w.innerHTML='<div class="qv-noimg"><div><b>SH</b><span>'+esc(qvName)+'</span></div></div>';if(c)c.textContent='بدون عکس';if(t)t.innerHTML='';return}
const im=document.createElement('img');im.src=qvList[qvIdx];im.alt=qvName;
im.onclick=()=>{const lb=$('#lbWrap');if(!lb)return;lb.innerHTML='';const b=document.createElement('img');b.src=im.src;lb.appendChild(b);$('#lightbox').classList.add('show')};
w.appendChild(im);
if(c)c.textContent=(qvIdx+1).toLocaleString('fa-IR')+' از '+qvList.length.toLocaleString('fa-IR');
if(t){t.innerHTML='';qvList.forEach((s,k)=>{const th=document.createElement('img');th.src=s;th.loading='lazy';if(k===qvIdx)th.className='on';th.onclick=()=>{qvIdx=k;updQV()};th.onerror=()=>{th.style.display='none'};t.appendChild(th)})}
}catch(e){}
}
function closeQV(){try{$('#quickModal').classList.remove('show');if(!document.body.classList.contains('menu-open'))document.body.style.overflow=''}catch(e){}}
let obs=null;
function observe(){
try{
const els=$$('.reveal:not(.visible)');if(!els.length)return;
if(!('IntersectionObserver' in window)){els.forEach(el=>el.classList.add('visible'));return}
if(!obs){obs=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');obs.unobserve(x.target);if(x.target.hasAttribute('data-count'))runCount(x.target)}}),{threshold:.08,rootMargin:'0px 0px 30px 0px'})}
els.forEach(el=>obs.observe(el));
}catch(e){}
}
function runCount(el){try{const end=+el.getAttribute('data-count');if(!end)return;el.removeAttribute('data-count');const t0=performance.now();(function fr(t){const k=Math.min(1,(t-t0)/1000);const e2=1-Math.pow(1-k,3);el.textContent=Math.round(end*e2).toLocaleString('fa-IR')+'+';if(k<1)requestAnimationFrame(fr)})(t0)}catch(e){}}
function setupMenu(){
const hamb=$('#hamb'),nav=$('#mainNav'),ov=$('#navOverlay'),closeB=$('#navClose');
if(!hamb||!nav||!ov)return;
function openM(){nav.classList.add('open');hamb.classList.add('active');document.body.classList.add('menu-open');hamb.setAttribute('aria-expanded','true')}
function closeM(){nav.classList.remove('open');hamb.classList.remove('active');document.body.classList.remove('menu-open');if(!$('#quickModal')||!$('#quickModal').classList.contains('show'))document.body.style.overflow='';hamb.setAttribute('aria-expanded','false')}
window._closeMenu=closeM;
hamb.onclick=e=>{e.stopPropagation();if(nav.classList.contains('open'))closeM();else openM()};
if(closeB)closeB.onclick=e=>{e.stopPropagation();closeM()};
ov.onclick=closeM;
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeM));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeM()});
window.addEventListener('resize',()=>{if(window.innerWidth>860&&nav.classList.contains('open'))closeM()},{passive:true});
}
document.addEventListener('DOMContentLoaded',()=>{
setupMenu();
try{renderProducts()}catch(e){}
try{observe()}catch(e){}
fetchRemote();
try{setTimeout(()=>{const p=$('#preloader');if(p)p.classList.add('hide')},300)}catch(e){}
const bar=$('#progressBar'),top=$('#backTop');let tick=false;
function onScroll(){if(tick)return;tick=true;requestAnimationFrame(()=>{try{const y=window.scrollY||0;const h=document.documentElement.scrollHeight-window.innerHeight;if(bar)bar.style.width=(h>0?(y/h*100):0)+'%';if(top)top.classList.toggle('show',y>600)}catch(e){}tick=false})}
window.addEventListener('scroll',onScroll,{passive:true});
if(top)top.onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
const grid=$('#productGrid');
if(grid){grid.addEventListener('click',e=>{
const q=e.target.closest('[data-qv]');if(q){e.stopPropagation();openQV(q.dataset.qv);return}
const go=e.target.closest('[data-go]');if(go){e.stopPropagation();const p=cache.find(x=>x.id===go.dataset.id)||getP().find(x=>x.id===go.dataset.id);if(!p)return;const im=(p.imgs||[]).filter(Boolean);if(im.length<2)return;const card=e.target.closest('.p-card');const imgEl=card?card.querySelector('img'):null;if(!imgEl)return;let idx=+(imgEl.dataset.i||0);idx=(idx+(+go.dataset.go)+im.length)%im.length;imgEl.dataset.i=idx;imgEl.src=im[idx];return}
const op=e.target.closest('[data-open]');if(op){openQV(op.dataset.open)}
});}
$$('.f-btn').forEach(b=>b.addEventListener('click',()=>{$$('.f-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.cat=b.dataset.filter;renderProducts()}));
let tm;const si=$('#searchInput');if(si)si.addEventListener('input',e=>{clearTimeout(tm);tm=setTimeout(()=>{state.q=e.target.value.trim();renderProducts()},240)});
const ss=$('#sortSelect');if(ss)ss.addEventListener('change',e=>{state.sort=e.target.value;renderProducts()});
$$('.cat-card').forEach(c=>c.addEventListener('click',()=>{const v=c.dataset.goto;if(!v)return;state.cat=v;$$('.f-btn').forEach(x=>x.classList.toggle('active',x.dataset.filter===v));renderProducts()}));
const qc=$('#qvClose');if(qc)qc.onclick=closeQV;
const qm=$('#quickModal');if(qm)qm.addEventListener('click',e=>{if(e.target.id==='quickModal')closeQV()});
const qn=$('#qvNext');if(qn)qn.onclick=e=>{e.stopPropagation();if(!qvList.length)return;qvIdx=(qvIdx+1)%qvList.length;updQV()};
const qp=$('#qvPrev');if(qp)qp.onclick=e=>{e.stopPropagation();if(!qvList.length)return;qvIdx=(qvIdx-1+qvList.length)%qvList.length;updQV()};
const lb=$('#lightbox');if(lb)lb.addEventListener('click',()=>lb.classList.remove('show'));
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id&&id.length>1){const el=document.querySelector(id);if(el){e.preventDefault();try{el.scrollIntoView({behavior:'smooth'})}catch(err){el.scrollIntoView()}if(window._closeMenu)window._closeMenu()}}}));
});
window.addEventListener('storage',e=>{if(e.key===PKEY){try{renderProducts()}catch(err){}}});