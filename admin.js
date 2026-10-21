const PKEY='shima_products';let imgs=[],editId=null;
const $=s=>document.querySelector(s);const fa=n=>Number(n||0).toLocaleString('fa-IR');
if(sessionStorage.getItem('shima_admin_logged_in')!=='true')location.href='login.html';
function getP(){try{return JSON.parse(localStorage.getItem(PKEY))||[]}catch(e){return[]}}
function setP(a){localStorage.setItem(PKEY,JSON.stringify(a))}
function renderPrev(){const g=$('#previewGrid');g.innerHTML='';imgs.forEach((s,i)=>{const d=document.createElement('div');d.className='prev';d.innerHTML='<img src="'+s+'">'+(i===0?'<span class="cover">کاور</span>':'')+'<button aria-label="حذف">×</button>';d.querySelector('img').onclick=()=>{const t=imgs.splice(i,1)[0];imgs.unshift(t);renderPrev()};d.querySelector('button').onclick=()=>{imgs.splice(i,1);renderPrev()};g.appendChild(d)})}
function compress(file){return new Promise(res=>{const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas');const m=1000;let w=im.width,h=im.height;if(w>m||h>m){const k=Math.min(m/w,m/h);w=Math.round(w*k);h=Math.round(h*k)}c.width=w;c.height=h;c.getContext('2d').drawImage(im,0,0,w,h);res(c.toDataURL('image/jpeg',.85))};im.src=r.result};r.readAsDataURL(file)})}
function renderList(){
const a=getP(),w=$('#productList');w.innerHTML='';
a.forEach(p=>{const d=document.createElement('div');d.className='a-card';d.innerHTML='<img loading="lazy" src="'+((p.imgs||[])[0]||'')+'"><div class="a-body"><b>'+p.name+'</b><br><small>'+p.cat+' | '+fa(p.price)+' تومان | موجودی '+fa(p.stock)+' | '+(p.imgs||[]).length+' عکس</small><div class="a-btns"><button class="btn btn-ghost" data-e="'+p.id+'">ویرایش</button><button class="btn btn-dark" data-d="'+p.id+'">حذف</button></div></div>';w.appendChild(d)});
$('#statTotal').textContent=fa(a.length);
$('#statStock').textContent=fa(a.reduce((s,x)=>s+(+x.stock||0),0));
$('#statValue').textContent=fa(a.reduce((s,x)=>s+(+x.price||0)*(+x.stock||0),0))+' تومان';
$('#statAvg').textContent=a.length?fa(Math.round(a.reduce((s,x)=>s+(+x.price||0),0)/a.length)):'۰';
w.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{if(confirm('حذف شود؟')){setP(getP().filter(x=>x.id!==b.dataset.d));renderList()}});
w.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>{const p=getP().find(x=>x.id===b.dataset.e);if(!p)return;editId=p.id;$('#pName').value=p.name;$('#pCat').value=p.cat;$('#pPrice').value=p.price;$('#pOff').value=p.off||0;$('#pStock').value=p.stock;$('#pDesc').value=p.desc||'';imgs=[...(p.imgs||[])];renderPrev();$('#formTitle').textContent='ویرایش محصول';$('#submitBtn').textContent='ذخیره تغییرات';$('#cancelEdit').style.display='';window.scrollTo({top:0,behavior:'smooth'})});
}
document.addEventListener('DOMContentLoaded',()=>{
renderPrev();renderList();
$('#logoutBtn').onclick=()=>{sessionStorage.removeItem('shima_admin_logged_in');location.href='login.html'};
$('#fileInput').onchange=async e=>{for(const f of e.target.files){if(imgs.length>=8)break;try{imgs.push(await compress(f))}catch(err){}}e.target.value='';renderPrev()};
$('#addUrlBtn').onclick=()=>{const v=$('#imgUrl').value.trim();if(!v||imgs.length>=8)return;imgs.push(v);$('#imgUrl').value='';renderPrev()};
$('#clearImgs').onclick=()=>{imgs=[];renderPrev()};
$('#cancelEdit').onclick=()=>{editId=null;imgs=[];renderPrev();$('#formTitle').textContent='افزودن محصول جدید';$('#submitBtn').textContent='ثبت محصول';$('#cancelEdit').style.display='none';['pName','pPrice','pOff','pStock','pDesc'].forEach(id=>$('#'+id).value='')};
$('#submitBtn').onclick=()=>{
const name=$('#pName').value.trim(),price=+$('#pPrice').value;if(!name||!price){alert('نام و قیمت الزامی است');return}
let a=getP();
const obj={id:editId||Date.now()+'',name,cat:$('#pCat').value,price,off:+$('#pOff').value||0,stock:+$('#pStock').value||0,desc:$('#pDesc').value.trim(),imgs:imgs.length?[...imgs]:['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=700&auto=format&fit=crop'],createdAt:Date.now()};
if(editId)a=a.map(x=>x.id===editId?obj:x);else a.unshift(obj);
try{setP(a)}catch(e){alert('حافظه مرورگر پر شد. تعداد یا حجم عکس‌ها را کم کنید.');return}
editId=null;imgs=[];renderPrev();renderList();$('#cancelEdit').click();alert('با موفقیت ذخیره شد و در فروشگاه نمایش داده می‌شود');
};
});