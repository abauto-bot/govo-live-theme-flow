(function(){
  const data = {
    areas:["Meherpur","Gangni","Bamundi","Mujibnagar","Amjhupi"],
    shops:[
      {name:"Grocery / Bazar",area:"Meherpur",category:"daily needs",description:"Daily bazar, rice, oil, vegetables",cta:"daily needs"},
      {name:"Pharmacy Support",area:"Meherpur",category:"medicine",description:"Medicine request, emergency delivery support",cta:"medicine"},
      {name:"Mobile Accessories",area:"Gangni",category:"electronics",description:"Charger, cable, earphone, repair pickup.",cta:"View items"},
      {name:"Food Partner",area:"Bamundi",category:"food",description:"Local food order, parcel and meal delivery.",cta:"Order food"}
    ],
    services:[
      {name:"Electrician",area:"Meherpur",category:"home service",description:"Fan, light, switch, wiring repair.",cta:"Book electrician"},
      {name:"Plumber",area:"Gangni",category:"home service",description:"Pipe, water line, bathroom repair.",cta:"Book plumber"},
      {name:"Parcel Delivery",area:"Meherpur",category:"delivery",description:"Pickup and drop support.",cta:"Book delivery"},
      {name:"Document Delivery",area:"Mujibnagar",category:"urgent",description:"Paper/file delivery support.",cta:"Send document"}
    ]
  };

  function p(){ return location.pathname.replace(/\/+$/,'') || '/app'; }
  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

  async function inv(){
    try{
      const r=await fetch('/api/govo-inventory?v='+Date.now(),{cache:'no-store'});
      if(r.ok){
        const j=await r.json();
        return {
          areas:j.areas&&j.areas.length?j.areas:data.areas,
          shops:j.shops&&j.shops.length?j.shops:data.shops,
          services:j.services&&j.services.length?j.services:data.services
        };
      }
    }catch(e){}
    return data;
  }

  function header(){
    return `<div class="govo-old-top">
      <div class="govo-old-brand">
        <div class="govo-old-logo">G</div>
        <div class="govo-old-name">
          <b>GOVO Express</b>
          <span>Premium local delivery & service OS</span>
        </div>
      </div>
      <button class="govo-old-menu">☰</button>
    </div>`;
  }

  function actions(){
    return `<div class="govo-old-actions">
      <a class="govo-old-btn" href="/shops?v=oldclassic">🏪 দোকান দেখুন</a>
      <a class="govo-old-btn dark" href="/services?v=oldclassic">🛠️ সার্ভিস নিন</a>
      <a class="govo-old-btn" href="/order?v=oldclassic">📦 Delivery Book</a>
    </div>`;
  }

  function homeHero(){
    return `<section class="govo-old-hero">
      <div class="govo-old-kicker">🚀 Meherpur local super app shell</div>
      <h1 class="govo-old-title">Delivery, shops, services — এক জায়গায় <em>GOVO.</em></h1>
      <p class="govo-old-sub">GOVO Express হলো local premium trust delivery operating system. Customer request করবে, merchant/rider join করবে, admin lead receive করবে.</p>
      ${actions()}
      <div class="govo-old-note">✅ Rescue shell active: customer button flow restored. Menu serial-wise, language/theme UI, shop/service/order CTA connected.</div>
      <div class="govo-old-chips">${data.areas.map(a=>`<span class="govo-old-chip">${a}</span>`).join('')}</div>
    </section>`;
  }

  function flow(){
    return `<div class="govo-old-head">
      <h2>Customer Flow</h2>
      <a class="govo-old-small" href="/order?v=oldclassic">Start Order</a>
    </div>
    <div class="govo-old-flow">
      <div class="govo-old-flow-card"><div class="govo-old-step">1</div><div><h3>Choose</h3><p>Shop অথবা service category select করুন।</p></div></div>
      <div class="govo-old-flow-card"><div class="govo-old-step">2</div><div><h3>Request</h3><p>Phone, area, delivery/service details submit করুন।</p></div></div>
      <div class="govo-old-flow-card"><div class="govo-old-step">3</div><div><h3>GOVO handles</h3><p>Admin/rider/merchant follow-up করবে।</p></div></div>
    </div>`;
  }

  function card(x){
    return `<div class="govo-old-card">
      <h3>${esc(x.name)}</h3>
      <div class="govo-old-meta">${esc(x.area||'Meherpur')} · ${esc(x.category||'GOVO')}</div>
      <p>${esc(x.description||'')}</p>
      <a class="govo-old-tag" href="/order?v=oldclassic">${esc(x.cta||'Request')}</a>
    </div>`;
  }

  function grid(title, button, items, href){
    return `<div class="govo-old-head">
      <h2>${title}</h2>
      <a class="govo-old-small" href="${href}?v=oldclassic">${button}</a>
    </div>
    <div class="govo-old-grid">${items.map(card).join('')}</div>`;
  }

  function form(type, areas){
    const title = type==='merchant'?'Merchant Join':type==='rider'?'Rider Join':'Start Request';
    return `<div class="govo-old-head"><h2>${title}</h2></div>
    <div class="govo-old-card">
      <p>Phone, area, details দিন — GOVO follow-up করবে।</p>
      <form class="govo-old-form" data-lead="${type}">
        <input name="name" placeholder="নাম / Business name" required>
        <input name="phone" placeholder="Phone / WhatsApp number" required>
        <select name="area">${areas.map(a=>`<option>${esc(a)}</option>`).join('')}</select>
        <textarea name="details" rows="4" placeholder="Details লিখুন"></textarea>
        <button>Submit GOVO Request</button>
      </form>
    </div>`;
  }

  function bottom(){
    const path=p();
    const items=[['/app','🏠','Home'],['/shops','🏪','Shops'],['/services','🛠️','Service'],['/order','📦','Order'],['/support','☎️','Help']];
    return `<div class="govo-old-bottom"><div class="govo-old-bottom-inner">${items.map(([href,ico,label])=>{
      const active=(path===href||(href==='/app'&&path==='/'))?'active':'';
      return `<a class="govo-old-nav ${active}" href="${href}?v=oldclassic"><b>${ico}</b><span>${label}</span></a>`;
    }).join('')}</div></div>`;
  }

  function admin(inventory){
    return `<section class="govo-old-hero">
      <div class="govo-old-kicker">⚡ GOVO Admin</div>
      <h1 class="govo-old-title">Control room <em>ready.</em></h1>
      <p class="govo-old-sub">Inventory, leads, merchant/rider follow-up — old classic GOVO UI.</p>
    </section>
    <div class="govo-old-card">
      <h3>Inventory Status</h3>
      <p>Shops: ${inventory.shops.length} · Services: ${inventory.services.length}</p>
      <form class="govo-old-form" data-admin-add>
        <input name="pin" type="password" placeholder="Admin PIN">
        <select name="kind"><option value="shop">Shop</option><option value="service">Service</option></select>
        <input name="name" placeholder="Shop/Service name" required>
        <input name="category" placeholder="Category" required>
        <select name="area">${inventory.areas.map(a=>`<option>${esc(a)}</option>`).join('')}</select>
        <textarea name="description" rows="3" placeholder="Description"></textarea>
        <button>Add Inventory Item</button>
      </form>
    </div>`;
  }

  function page(inventory){
    const path=p();
    if(path.includes('/shops')) return homeHero()+grid('Popular Shops','View all',inventory.shops,'/shops');
    if(path.includes('/services')) return homeHero()+grid('Available Services','View all',inventory.services,'/services');
    if(path.includes('/order')) return homeHero()+form('order',inventory.areas);
    if(path.includes('/merchant')) return homeHero()+form('merchant',inventory.areas)+grid('Shop Examples','View all',inventory.shops,'/shops');
    if(path.includes('/rider')) return homeHero()+form('rider',inventory.areas);
    if(path.includes('/admin')) return admin(inventory);
    return homeHero()+flow()+grid('Popular Shops','View all',inventory.shops.slice(0,4),'/shops');
  }

  async function render(){
    const inventory=await inv();
    document.body.className='';
    document.body.classList.add('govo-old-ready');
    document.body.innerHTML=`<main class="govo-old-shell">${header()}${page(inventory)}</main>${bottom()}`;

    document.querySelectorAll('[data-lead]').forEach(f=>{
      f.addEventListener('submit',async e=>{
        e.preventDefault();
        const payload=Object.fromEntries(new FormData(f));
        payload.type=f.getAttribute('data-lead');
        try{
          const r=await fetch('/api/govo-leads',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
          const j=await r.json();
          if(j.ok){f.reset();alert('GOVO request saved.');return;}
        }catch(e){}
        localStorage.setItem('govo_lead_backup_'+Date.now(),JSON.stringify(payload));
        f.reset();
        alert('Request saved locally.');
      });
    });

    const af=document.querySelector('[data-admin-add]');
    if(af){
      af.addEventListener('submit',async e=>{
        e.preventDefault();
        const fd=new FormData(af);
        const kind=fd.get('kind');
        const body={action:'add',kind,item:{name:fd.get('name'),category:fd.get('category'),area:fd.get('area'),description:fd.get('description'),cta:kind==='shop'?'Order now':'Book now'}};
        const r=await fetch('/api/govo-inventory',{method:'POST',headers:{'content-type':'application/json','x-govo-pin':fd.get('pin')},body:JSON.stringify(body)});
        const j=await r.json();
        if(j.ok){alert('Inventory added.');location.reload();}
        else alert(j.error||'Failed');
      });
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);
  else render();
})();
