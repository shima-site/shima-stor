const PKEY='shima_products';const PHONE='09129487759';const WA_NUM='989129487759';
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const fa=n=>Number(n||0).toLocaleString('fa-IR');
// عکس‌های پیش‌فرض : اگر می‌خواهی عکس خودت را بگذاری، لینک‌های imgs زیر را عوض کن یا از پنل مدیریت محصول جدید بساز
const FALLBACK='https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=700&auto=format&fit=crop';
const defaults=[
{id:'1',name:'ست پذیرایی سرامیکی ۶ نفره',cat:'ظروف',price:2850000,off:12,stock:14,desc:'ست کامل سرامیکی لعاب مات، مناسب مهمانی و استفاده روزمره. شامل بشقاب، پیش‌دستی، کاسه و فنجان.',imgs:['https://images.unsplash.com/photo-1603199506016-b9a594b593c0?q=80&w=700&auto=format&fit=crop','https://images.unsplash.com/photo-1577937927133-66ef06acdf18?q=80&w=700&auto=format&fit=crop'],createdAt:3},
{id:'2',name:'گلدان دکوراتیو مینیمال',cat:'اکسسوری',price:890000,off:8,stock:22,desc:'گلدان سرامیکی دست‌ساز با طراحی مینیمال برای دکور مدرن.',imgs:['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=700&auto=format&fit=crop'],createdAt:2},
{id:'3',name:'ست قهوه‌خوری ۱۲ پارچه',cat:'ظروف',price:1650000,off:0,stock:9,desc:'ست قهوه‌خوری با لعاب براق و دسته ارگونومیک.',imgs:['https://images.unsplash.com/photo-1577937927133-66ef06acdf18?q=80&w=700&auto=format&fit=crop'],createdAt:5},
{id:'4',name:'شمع و استند چوبی',cat:'اکسسوری',price:540000,off:15,stock:30,desc:'ست شمع معطر با استند چوب گردو برای فضای آرام.',imgs:['https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?q=80&w=700&auto=format&fit=crop'],createdAt:1},
{id:'5',name:'دیس پذیرایی بزرگ',cat:'ظروف',price:720000,off:0,stock:0,desc:'دیس سرامیکی بزرگ برای سرو میوه و شیرینی.',imgs:['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=700&auto=format&fit=crop'],createdAt:4},
{id:'6',name:'آینه دکوراتیو حصیری',cat:'اکسسوری',price:1980000,off:10,stock:7,desc:'آینه دیواری با قاب حصیری دستبافت.',imgs:['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=700&auto=format&fit=crop'],createdAt:6}
];
function getP(){try{const a=JSON.parse(localStorage.getItem(PKEY));if(Array.isArray(a)&&a.length)return a}catch(e){}return defaults}
let state={q:'',cat:'all',sort:'newest'};let qvImgs=[],qvIdx=0;
function priceAfter(p){return Math.round(p.price*(100-(p.off||0))/100)}
function waLink(name,price){return 'https://wa.me/'+WA_NUM+'?text='+encodeURIComponent('سلام برای سفارش محصول «'+name+'» ('+Number(price).toLocaleString('en-US')+' تومان) پیام می‌دهم.')}
function renderProducts(){
const all=getP();
let l=all.filter(p=>(state.cat==='all'||p.cat===state.cat)&&(p.name.includes(state.q)||(p.desc||'').includes(state.q)));
if(state.sort==='cheap')l.sort((a,b)=>priceAfter(a)-priceAfter(b));
else if(state.sort==='exp')l.sort((a,b)=>priceAfter(b)-priceAfter(a));
else if(state.sort==='off')l.sort((a,b)=>(b.off||0)-(a.off||0));
else l.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
const rc=$('#resultCount');if(rc)rc.textContent=l.length?l.length.toLocaleString('fa-IR')+' محصول':'محصولی یافت نشد';
const g=$('#productGrid');if(!g)return;g.innerHTML='';
if(!l.length){g.innerHTML='<p style="grid-column:1/-1;text-align:center;color:#888;padding:2rem;background:#fff;border:1px dashed #e9e1d2;border-radius:16px">محصولی پیدا نشد. برای موجودی با '+PHONE+' در تماس باشید.</p>';return}
l.forEach((p,i)=>{
const pa=priceAfter(p);const imgs=p.imgs&&p.imgs.length?p.imgs:[FALLBACK];
const card=document.createElement('article');card.className='p-card reveal';card.setAttribute('data-reveal','up');card.style.transitionDelay=((i%4)*0.07)+'s';
card.innerHTML='<div class="p-media"><img loading="lazy" decoding="async" src="'+imgs[0]+'" alt="'+p.name+'" data-id="'+p.id+'" onerror="this.src=\''+FALLBACK+'\'">'+(p.off?'<span class="p-off">'+fa(p.off)+'٪ تخفیف</span>':'')+(!p.stock?'<span class="p-out">ناموجود</span>':'')+(imgs.length>1?'<button class="g-arrow r" data-a="1">‹</button><button class="g-arrow l" data-a="-1">›</button><div class="g-dots">'+imgs.map((_,k)=>'<span class="'+(k===0?'on':'')+'"></span>').join('')+'</div>':'')+'<button class="qv-btn" data-qv="'+p.id+'">مشاهده و سفارش</button></div><div class="p-body"><span class="p-cat">'+p.cat+'</span><h3>'+p.name+'</h3><div class="p-price"><b>'+fa(pa)+' تومان</b>'+(p.off?'<s>'+fa(p.price)+'</s>':'')+'</div><div class="p-foot"><span class="stock '+(!p.stock?'no':p.stock<10?'low':'')+'">'+(!p.stock?'ناموجود':p.stock<10?'تنها '+fa(p.stock)+' عدد':'موجود')+'</span><button class="order-btn" '+( !p.stock?'disabled style="opacity:.5"':'')+' data-qv="'+p.id+'">سفارش</button></div></div>';
card.dataset.imgs=JSON.stringify(imgs);card.dataset.idx=0;g.appendChild(card);
});
observe();bindCards();
}
function bindCards(){
$$('#productGrid .p-media img').forEach(im=>{im.onclick=()=>openQV(im.dataset.id)});
$$('#productGrid [data-qv]').forEach(b=>b.onclick=e=>{e.stopPropagation();openQV(b.dataset.qv)});
$$('#productGrid .p-card').forEach(card=>{
let imgs=[];try{imgs=JSON.parse(card.dataset.imgs||'[]')}catch(e){}
if(imgs.length<2)return;
const img=card.querySelector('img'),dots=[...card.querySelectorAll('.g-dots span')];
const media=card.querySelector('.p-media');
function go(d){let k=(+card.dataset.idx+d+imgs.length)%imgs.length;card.dataset.idx=k;img.style.opacity='0';setTimeout(()=>{img.src=imgs[k];img.onload=()=>{img.style.opacity='1'};setTimeout(()=>{img.style.opacity='1'},250)},120);dots.forEach((x,j)=>x.classList.toggle('on',j===k))}
card.querySelectorAll('.g-arrow').forEach(btn=>btn.onclick=e=>{e.stopPropagation();go(+btn.dataset.a)});
let sx=0;media.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
media.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>38)go(dx<0?1:-1)},{passive:true});
});
}
function openQV(id){
const p=getP().find(x=>x.id===id);if(!p)return;
qvImgs=p.imgs&&p.imgs.length?p.imgs:[FALLBACK];qvIdx=0;
$('#qvName').textContent=p.name;$('#qvCat').textContent=p.cat;$('#qvDesc').textContent=p.desc||'بدون توضیح';
$('#qvPrice').textContent=fa(priceAfter(p))+' تومان';$('#qvOld').textContent=p.off?fa(p.price)+' تومان':'';
$('#qvWa').href=waLink(p.name,priceAfter(p));$('#qvImg').alt=p.name;
updQV();$('#quickModal').classList.add('show');document.body.style.overflow='hidden';
}
function updQV(){
const im=$('#qvImg');im.style.opacity='0';im.src=qvImgs[qvIdx];im.onload=()=>{im.style.opacity='1'};setTimeout(()=>{im.style.opacity='1'},300);
$('#qvCounter').textContent=(qvIdx+1).toLocaleString('fa-IR')+' از '+qvImgs.length.toLocaleString('fa-IR');
const t=$('#qvThumbs');t.innerHTML='';
qvImgs.forEach((s,k)=>{const th=document.createElement('img');th.src=s;th.loading='lazy';if(k===qvIdx)th.className='on';th.onclick=()=>{qvIdx=k;updQV()};th.onerror=()=>{th.src=FALLBACK};t.appendChild(th)});
}
function closeQV(){$('#quickModal').classList.remove('show');document.body.style.overflow=''}
let revealObs=null;
function observe(){
const els=$$('.reveal:not(.visible)');
if(!('IntersectionObserver' in window)){els.forEach(el=>el.classList.add('visible'));return}
if(!revealObs){revealObs=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');revealObs.unobserve(x.target);if(x.target.hasAttribute('data-count'))runCount(x.target)}}),{threshold:.12,rootMargin:'0px 0px -40px 0px'})}
els.forEach(el=>revealObs.observe(el));
}
function runCount(el){const end=+el.getAttribute('data-count');if(!end)return;el.removeAttribute('data-count');const t0=performance.now(),dur=1200;function fr(t){const k=Math.min(1,(t-t0)/dur);const e=1-Math.pow(1-k,3);el.textContent=Math.round(end*e).toLocaleString('fa-IR')+'+';if(k<1)requestAnimationFrame(fr)}requestAnimationFrame(fr)}
window.addEventListener('storage',e=>{if(e.key===PKEY)renderProducts()});
document.addEventListener('DOMContentLoaded',()=>{
renderProducts();observe();
setTimeout(()=>$('#preloader').classList.add('hide'),600);
const header=$('#header'),bar=$('#progressBar'),top=$('#backTop');
window.addEventListener('scroll',()=>{
const y=window.scrollY;header.classList.toggle('scrolled',y>10);
const h=document.documentElement.scrollHeight-window.innerHeight;bar.style.width=(h>0?(y/h*100):0)+'%';
top.classList.toggle('show',y>600);
},{passive:true});
top.onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
const nav=$('#mainNav'),ov=$('#navOverlay');
function closeNav(){nav.classList.remove('open');ov.classList.remove('show')}
$('#hamb').onclick=()=>{const o=nav.classList.toggle('open');ov.classList.toggle('show',o)};
ov.onclick=closeNav;$$('#mainNav a').forEach(a=>a.onclick=closeNav);
$$('.f-btn').forEach(b=>b.onclick=()=>{$$('.f-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.cat=b.dataset.filter;renderProducts()});
let t;$('#searchInput').addEventListener('input',e=>{clearTimeout(t);t=setTimeout(()=>{state.q=e.target.value.trim();renderProducts()},180)});
$('#sortSelect').onchange=e=>{state.sort=e.target.value;renderProducts()};
$$('.cat-card').forEach(c=>c.addEventListener('click',()=>{const v=c.dataset.goto;state.cat=v;$$('.f-btn').forEach(x=>x.classList.toggle('active',x.dataset.filter===v));renderProducts()}));
$$('.faq-q').forEach(q=>q.onclick=()=>{const it=q.parentElement;const was=it.classList.contains('open');$$('.faq-item').forEach(x=>x.classList.remove('open'));if(!was)it.classList.add('open')});
$('#qvClose').onclick=closeQV;
$('#quickModal').addEventListener('click',e=>{if(e.target.id==='quickModal')closeQV()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeQV();$('#lightbox').classList.remove('show');closeNav()}});
$('#qvNext').onclick=e=>{e.stopPropagation();qvIdx=(qvIdx+1)%qvImgs.length;updQV()};
$('#qvPrev').onclick=e=>{e.stopPropagation();qvIdx=(qvIdx-1+qvImgs.length)%qvImgs.length;updQV()};
const gal=$('#qvGal');if(gal){let sx=0;gal.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});gal.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40){qvIdx=(qvIdx+(dx<0?1:-1)+qvImgs.length)%qvImgs.length;updQV()}},{passive:true})}
$('#qvImg').onclick=()=>{$('#lbImg').src=$('#qvImg').src;$('#lightbox').classList.add('show')};
$('#lbClose').onclick=()=>$('#lightbox').classList.remove('show');
$('#lightbox').onclick=()=>$('#lightbox').classList.remove('show');
const hv=$('#heroVisual');
if(hv&&window.matchMedia('(pointer:fine)').matches){document.addEventListener('mousemove',e=>{const x=(e.clientX/window.innerWidth-.5)*10,y=(e.clientY/window.innerHeight-.5)*10;hv.style.translate=x+'px '+y+'px'},{passive:true})}
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id.length>1){const el=document.querySelector(id);if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth'})}}}));
});