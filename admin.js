const PKEY='shima_products_v2';const PRODUCTS_URL='./products.json';
const $=s=>document.querySelector(s);const fa=n=>Number(n||0).toLocaleString('fa-IR');
let imgs=[],editId=null,SITE_CACHE=null;
try{var _s=JSON.parse(sessionStorage.getItem('shima_admin_session')||'null');if(!(_s&&_s.exp>Date.now())){if(sessionStorage.getItem('shima_admin_logged_in')!=='true')location.replace('./login.html')}}catch(e){location.replace('./login.html')}
try{localStorage.removeItem('shima_products')}catch(e){}
function getLocal(){try{const v=localStorage.getItem(PKEY);if(v===null)return null;const a=JSON.parse(v);if(Array.isArray(a))return a;return null}catch(e){return null}}
function effectiveProducts(){const l=getLocal();if(l!==null)return l;if(SITE_CACHE!==null)return SITE_CACHE;return []}
function setP(a){localStorage.setItem(PKEY,JSON.stringify(a))}
function msg(t,ok){const m=$('#githubMsg');if(!m)return;m.style.color=ok?'#1e8449':'#c0392b';m.textContent=t}
function renderPrev(){var g=$('#previewGrid');if(!g)return;g.innerHTML='';if(!imgs.length){g.innerHTML='<small style="grid-column:1/-1;color:#999">عکسی انتخاب نشده — طرح SH نمایش داده می‌شود</small>';return}imgs.forEach(function(s,i){var d=document.createElement('div');d.className='prev';var im=document.createElement('img');im.src=s;im.loading='lazy';im.alt='پیش‌نمایش';im.onclick=function(){var t=imgs.splice(i,1)[0];imgs.unshift(t);renderPrev()};d.appendChild(im);if(i===0){var c=document.createElement('span');c.className='cover';c.textContent='کاور';d.appendChild(c)}var b=document.createElement('button');b.textContent='×';b.setAttribute('aria-label','حذف');b.onclick=function(){imgs.splice(i,1);renderPrev()};d.appendChild(b);g.appendChild(d)})}
function compress(f){return new Promise(function(res){try{var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){try{var c=document.createElement('canvas');var m=1000;var w=im.width,h=im.height;if(w>m||h>m){var k=Math.min(m/w,m/h);w=Math.round(w*k);h=Math.round(h*k)}c.width=w;c.height=h;c.getContext('2d').drawImage(im,0,0,w,h);res(c.toDataURL('image/jpeg',.82))}catch(e){res(r.result)}};im.onerror=function(){res(r.result)};im.src=r.result};r.onerror=function(){res(null)};r.readAsDataURL(f)}catch(e){res(null)}})}
function renderList(){
var a=effectiveProducts(),w=$('#productList');if(!w)return;w.innerHTML='';
if(!a.length)w.innerHTML='<p style="grid-column:1/-1;text-align:center;color:#888;padding:1.2rem">هنوز محصولی ثبت نشده — اولین محصول را بالا اضافه کن.</p>';
a.forEach(function(p){
var d=document.createElement('div');d.className='a-card';
var f=(p.imgs||[])[0];
if(f){var im=document.createElement('img');im.src=f;im.loading='lazy';im.alt=p.name;d.appendChild(im)}else{var ph=document.createElement('div');ph.className='a-ph';ph.textContent='SH • '+p.name;d.appendChild(ph)}
var b=document.createElement('div');b.className='a-body';
var t=document.createElement('b');t.textContent=p.name;b.appendChild(t);b.appendChild(document.createElement('br'));
var sm=document.createElement('small');sm.textContent=p.cat+' | '+fa(p.price)+' تومان | موجودی '+fa(p.stock)+' | '+(p.imgs||[]).length+' عکس';b.appendChild(sm);
var btns=document.createElement('div');btns.className='a-btns';
var be=document.createElement('button');be.className='btn btn-ghost';be.textContent='ویرایش';
var bd=document.createElement('button');bd.className='btn btn-dark';bd.textContent='حذف';
be.onclick=function(){editId=p.id;$('#pName').value=p.name;$('#pCat').value=p.cat;$('#pPrice').value=p.price;$('#pOff').value=p.off||0;$('#pStock').value=p.stock;$('#pDesc').value=p.desc||'';imgs=[...(p.imgs||[])];renderPrev();$('#formTitle').textContent='ویرایش محصول';$('#submitBtn').textContent='ذخیره تغییرات';$('#cancelEdit').style.display='';window.scrollTo({top:0,behavior:'smooth'})};
bd.onclick=function(){if(confirm('حذف شود؟')){var cur=effectiveProducts().filter(function(x){return x.id!==p.id});setP(cur);renderList()}};
btns.appendChild(be);btns.appendChild(bd);b.appendChild(btns);d.appendChild(b);w.appendChild(d)});
var tt=$('#statTotal');if(tt)tt.textContent=fa(a.length);
var ss=$('#statStock');if(ss)ss.textContent=fa(a.reduce(function(x,y){return x+(+y.stock||0)},0));
var vv=$('#statValue');if(vv)vv.textContent=fa(a.reduce(function(x,y){return x+(+y.price||0)*(+y.stock||0)},0))+' تومان';
var av=$('#statAvg');if(av)av.textContent=a.length?fa(Math.round(a.reduce(function(x,y){return x+(+y.price||0)},0)/a.length)):'۰';
}
async function silentLoad(){try{const r=await fetch(PRODUCTS_URL+'?v='+Date.now(),{cache:'no-store'});if(!r.ok)return;const j=await r.json();if(!Array.isArray(j))return;SITE_CACHE=j;if(getLocal()===null)renderList()}catch(e){}}
document.addEventListener('DOMContentLoaded',function(){
renderPrev();renderList();silentLoad();
var lo=$('#logoutBtn');if(lo)lo.onclick=function(){try{sessionStorage.removeItem('shima_admin_session');sessionStorage.removeItem('shima_admin_logged_in')}catch(e){}location.replace('./login.html')};
var fi=$('#fileInput');if(fi)fi.onchange=function(e){var files=e.target.files;var i=0;function next(){if(i>=files.length||imgs.length>=8){e.target.value='';renderPrev();return}compress(files[i]).then(function(u){if(u)imgs.push(u);i++;next()})}next()};
var au=$('#addUrlBtn');if(au)au.onclick=function(){var v=$('#imgUrl').value.trim();if(!v||imgs.length>=8)return;imgs.push(v);$('#imgUrl').value='';renderPrev()};
var cl=$('#clearImgs');if(cl)cl.onclick=function(){imgs=[];renderPrev()};
var ce=$('#cancelEdit');if(ce)ce.onclick=function(){editId=null;imgs=[];renderPrev();$('#formTitle').textContent='افزودن محصول جدید';$('#submitBtn').textContent='ثبت محصول';ce.style.display='none';['pName','pPrice','pOff','pStock','pDesc'].forEach(function(id){var el=document.getElementById(id);if(el)el.value=''})};
var sb=$('#submitBtn');if(sb)sb.onclick=function(){
var name=$('#pName').value.trim(),price=+$('#pPrice').value;if(!name||!price){alert('نام و قیمت الزامی است');return}
var a=effectiveProducts().slice();
var obj={id:editId||Date.now()+'',name:name,cat:$('#pCat').value,price:price,off:+$('#pOff').value||0,stock:+$('#pStock').value||0,desc:$('#pDesc').value.trim(),imgs:[...imgs],createdAt:Date.now()};
if(editId)a=a.map(function(x){return x.id===editId?obj:x});else a.unshift(obj);
try{setP(a)}catch(e){alert('حافظه مرورگر پر شد. تعداد عکس‌ها را کم کنید.');return}
editId=null;imgs=[];renderPrev();renderList();if(ce)ce.click();alert('ذخیره شد. برای ماندگار شدن در گیت‌هاب، «دانلود products.json» را بزن و در ریپو جایگزین کن.');
msg('ذخیره موقت انجام شد. یادت نرود «دانلود products.json» را بزنی.',true)};
var dl=$('#downloadJsonBtn');if(dl)dl.onclick=function(){
var data=effectiveProducts();
var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='products.json';document.body.appendChild(a);a.click();
setTimeout(function(){try{URL.revokeObjectURL(a.href)}catch(e){}a.remove()},600);
msg('دانلود شد. حالا همین فایل را در گیت‌هاب جای products.json بگذار و Commit بزن.',true)};
var ls=$('#loadSiteBtn');if(ls)ls.onclick=function(){
fetch(PRODUCTS_URL+'?v='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){
if(!Array.isArray(j))throw 0;SITE_CACHE=j;
if(getLocal()!==null){if(!confirm('محصولات سایت جایگزین حافظه این مرورگر شود؟')){renderList();return}}
setP(j);renderList();msg('از سایت بارگذاری شد ('+j.length+' محصول).',true)}).catch(function(){msg('دریافت نشد. مطمئن شو products.json کنار فایل‌هاست.',false)})};
var imp=$('#importJson');if(imp)imp.onchange=function(e){
var f=e.target.files[0];if(!f)return;var r=new FileReader();
r.onload=function(){try{var j=JSON.parse(r.result);if(!Array.isArray(j))throw 0;var clean=j.filter(function(x){return x&&x.name&&x.price}).slice(0,200);setP(clean);renderList();msg('فایل وارد شد. حالا «دانلود products.json» را بزن.',true)}catch(err){msg('فایل معتبر نیست.',false)}};
r.readAsText(f);e.target.value=''};
var wp=$('#wipeAllBtn');if(wp)wp.onclick=function(){if(confirm('همه محصولات پاک شود؟')){setP([]);imgs=[];editId=null;renderPrev();renderList();msg('همه پاک شد. برای اعمال در سایت، فایل خالی را دانلود و در گیت‌هاب جایگزین کن.',true)}};
});