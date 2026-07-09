(function(){
  const fallback = {
    areas:["Meherpur","Gangni","Bamundi","Mujibnagar","Amjhupi"],
    shops:[
      {name:"Grocery / Bazar",area:"Meherpur",category:"daily needs",description:"Daily bazar, rice, oil, vegetables",cta:"Order grocery"},
      {name:"Pharmacy Support",area:"Meherpur",category:"medicine",description:"Medicine request, emergency delivery support",cta:"Request medicine"},
      {name:"Mobile Accessories",area:"Gangni",category:"electronics",description:"Charger, cable, earphone, repair pickup",cta:"View items"},
      {name:"Food Partner",area:"Bamundi",category:"food",description:"Local food order and parcel delivery",cta:"Order food"}
    ],
    services:[
      {name:"Electrician",area:"Meherpur",category:"home service",description:"Fan, light, switch, wiring repair",cta:"Book electrician"},
      {name:"Plumber",area:"Gangni",category:"home service",description:"Pipe, water line, bathroom repair",cta:"Book plumber"},
      {name:"Parcel Delivery",area:"Meherpur",category:"delivery",description:"Pickup and drop support",cta:"Book delivery"},
      {name:"Document Delivery",area:"Mujibnagar",category:"urgent",description:"Paper/file delivery support",cta:"Send document"}
    ]
  };

  function route(){ return location.pathname.replace(/\/+$/,'') || '/app'; }
  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

  function logo(){
    return `<svg viewBox="0 0 520 520" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g8g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#8cff00"/>
          <stop offset=".55" stop-color="#38ff45"/>
          <stop offset="1" stop-color="#16ef86"/>
        </linearGradient>
      </defs>
      <ellipse cx="260" cy="444" rx="126" ry="30" fill="none" stroke="#fff" stroke-width="22" opacity=".95"/>
      <path d="M342 86c-36-31-88-43-137-27-74 24-116 96-98 169 12 49 49 88 86 127l67 71 74-80h-72l-25 26-29-31c-32-34-61-65-69-103-11-49 17-99 68-116 38-13 78-2 104 23l31-59z" fill="url(#g8g)"/>
      <path d="M260 168c-50 0-91 40-91 90s41 90 91 90c42 0 78-28 88-66h-90v-50h149v26c0 82-66 140-147 140-78 0-141-63-141-140s63-140 141-140c43 0 81 19 107 49l-42 34c-16-20-39-33-65-33z" fill="#fff"/>
      <path d="M310 244h89v52h-89z" fill="url(#g8g)"/>
      <path d="M311 344l-27 45h28l-16 50 57-76h-30l18-19z" fill="url(#g8g)"/>
    </svg>`;
  }

  async function getInventory(){
    try{
      const r = await fetch('/api/govo-inventory?v=' + Date.now(), {cache:'no-store'});
      if(r.ok){
        const j = await r.json();
        return {
          areas:j.areas || fallback.areas,
          shops:Array.isArray(j.shops)&&j.shops.length?j.shops:fallback.shops,
          services:Array.isArray(j.services)&&j.services.length?j.services:fallback.services
        };
      }
    }catch(e){}
    return fallback;
  }

  function header(){
    return `<div class="g8-top">
      <div class="g8-brand">
        <div class="g8-logo">${logo()}</div>
        <div class="g8-brand-text">
          <b>GOVO Express</b>
          <span>Premium local delivery & service OS</span>
        </div>
      </div>
      <button class="g8-menu" type="button">☰</button>
    </div>`;
  }

  function actions(){
    return `<div class="g8-actions">
      <a class="g8-btn" href="/shops?v=phase8">দোকান দেখুন</a>
      <a class="g8-btn dark" href="/services?v=phase8">সার্ভিস নিন</a>
      <a class="g8-btn" href="/order?v=phase8">Delivery Book</a>
    </div>`;
  }

  function flow(){
    return `<div class="g8-head">
      <h2>Customer Flow</h2>
      <a class="g8-small" href="/order?v=phase8">Start Order</a>
    </div>
    <div class="g8-flow">
      <div class="g8-flow-card"><div class="g8-step">1</div><div><h3>Choose</h3><p>Shop অথবা service category select করুন।</p></div><div class="g8-icon">▢</div></div>
      <div class="g8-flow-card"><div class="g8-step">2</div><div><h3>Request</h3><p>Phone, area, delivery/service details submit করুন।</p></div><div class="g8-icon">✎</div></div>
      <div class="g8-flow-card"><div class="g8-step">3</div><div><h3>GOVO handles</h3><p>Admin/rider/merchant follow-up করবে।</p></div><div class="g8-icon">◎</div></div>
    </div>`;
  }

  function itemCard(x, href){
    return `<div class="g8-card">
      <h3>${esc(x.name)}</h3>
      <div class="g8-meta">${esc(x.area || 'Meherpur')} · ${esc(x.category || 'GOVO')}</div>
      <p>${esc(x.description || '')}</p>
      <a class="g8-tag" href="${href}">${esc(x.cta || 'Request')}</a>
    </div>`;
  }

  function grid(title, linkText, items, href){
    return `<div class="g8-head">
      <h2>${esc(title)}</h2>
      <a class="g8-small" href="${href}?v=phase8">${esc(linkText)}</a>
    </div>
    <div class="g8-grid">${items.map(x=>itemCard(x, '/order?v=phase8')).join('')}</div>`;
  }

  function form(type, areas){
    return `<div class="g8-head"><h2>${type === 'merchant' ? 'Merchant Join' : type === 'rider' ? 'Rider Join' : 'Start Request'}</h2></div>
    <div class="g8-card">
      <p>${type === 'merchant' ? 'দোকান GOVO network-এ add করার info দিন।' : type === 'rider' ? 'Rider partner হিসেবে join করার info দিন।' : 'আপনার request দিন, GOVO follow-up করবে।'}</p>
      <form class="g8-form" data-govo-lead="${type}">
        <input name="name" placeholder="নাম / Business name" required>
        <input name="phone" placeholder="Phone / WhatsApp number" required>
        <select name="area">${areas.map(a=>`<option>${esc(a)}</option>`).join('')}</select>
        <textarea name="details" rows="4" placeholder="Details লিখুন"></textarea>
        <button type="submit">Submit GOVO Request</button>
      </form>
    </div>`;
  }

  function admin(inv){
    return `<div class="g8-head">
      <h2>Admin Control</h2>
      <a class="g8-small" href="/api/govo-inventory" target="_blank">Inventory API</a>
    </div>
    <div class="g8-card">
      <h3>Inventory Status</h3>
      <p>Shops: ${(inv.shops||[]).length} · Services: ${(inv.services||[]).length}</p>
      <form class="g8-form" data-govo-admin-add>
        <input name="pin" type="password" placeholder="Admin PIN">
        <select name="kind"><option value="shop">Shop</option><option value="service">Service</option></select>
        <input name="name" placeholder="Shop/Service name" required>
        <input name="category" placeholder="Category" required>
        <select name="area">${(inv.areas||fallback.areas).map(a=>`<option>${esc(a)}</option>`).join('')}</select>
        <textarea name="description" rows="3" placeholder="Description"></textarea>
        <button type="submit">Add Inventory Item</button>
      </form>
    </div>`;
  }

  function page(inv){
    const p = route();
    if(p.includes('/shops')){
      return `<div class="g8-hero"><div class="g8-kicker">GOVO Shops</div><h1 class="g8-title">Local shops <em>one place.</em></h1><p class="g8-sub">দোকান, bazar, pharmacy, accessories — same GOVO premium flow.</p>${actions()}</div>${grid('Popular Shops','View all',inv.shops,'/shops')}`;
    }
    if(p.includes('/services')){
      return `<div class="g8-hero"><div class="g8-kicker">GOVO Services</div><h1 class="g8-title">Service nin <em>fast.</em></h1><p class="g8-sub">Electrician, plumber, delivery, document — trusted local service flow.</p>${actions()}</div>${grid('Available Services','View all',inv.services,'/services')}`;
    }
    if(p.includes('/order')) return `<div class="g8-hero"><div class="g8-kicker">Start Order</div><h1 class="g8-title">Request submit <em>easy.</em></h1><p class="g8-sub">Phone, area, details দিন — GOVO follow-up করবে।</p></div>${form('order', inv.areas)}`;
    if(p.includes('/merchant')) return `<div class="g8-hero"><div class="g8-kicker">Merchant Network</div><h1 class="g8-title">Merchant join <em>GOVO.</em></h1><p class="g8-sub">Local business GOVO delivery/service network-এ add হবে।</p></div>${form('merchant', inv.areas)}${grid('Shop Examples','Shops',inv.shops,'/shops')}`;
    if(p.includes('/rider')) return `<div class="g8-hero"><div class="g8-kicker">Rider Network</div><h1 class="g8-title">Rider join <em>fast.</em></h1><p class="g8-sub">Delivery partner onboarding, area coverage, follow-up flow।</p></div>${form('rider', inv.areas)}`;
    if(p.includes('/admin')) return `<div class="g8-hero"><div class="g8-kicker">GOVO Admin</div><h1 class="g8-title">Control room <em>ready.</em></h1><p class="g8-sub">Inventory, leads, merchant/rider follow-up — same GOVO UI.</p></div>${admin(inv)}`;
    return `<div class="g8-hero"><div class="g8-kicker">GOVO Dark Neon Flow</div><h1 class="g8-title">Delivery, shops, services — <em>GOVO.</em></h1><p class="g8-sub">GOVO Express হলো local premium trust delivery & service OS. Wherever you are, we’re there.</p>${actions()}</div>${flow()}${grid('Popular Shops','View all',inv.shops.slice(0,4),'/shops')}`;
  }

  function bottom(){
    const p = route();
    const items=[['/app','⌂','Home'],['/shops','▣','Shops'],['/services','⚒','Service'],['/order','▣','Order'],['/support','☏','Help']];
    return `<div class="g8-bottom"><div class="g8-bottom-inner">${items.map(([href,ico,label])=>{
      const active = p === href || (href==='/app' && p==='/') ? 'active' : '';
      return `<a class="g8-nav ${active}" href="${href}?v=phase8"><b>${ico}</b><span>${label}</span></a>`;
    }).join('')}</div></div>`;
  }

  async function render(){
    const inv = await getInventory();

    document.body.className = '';
    document.body.classList.add('govo-phase8-ready');

    document.body.innerHTML = `<div class="g8-shell">${header()}${page(inv)}</div>${bottom()}`;

    document.querySelectorAll('[data-govo-lead]').forEach(f=>{
      f.addEventListener('submit', async e=>{
        e.preventDefault();
        const data = Object.fromEntries(new FormData(f));
        data.type = f.getAttribute('data-govo-lead');
        try{
          const res = await fetch('/api/govo-leads',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});
          const json = await res.json();
          if(json.ok){ f.reset(); alert('GOVO request saved.'); return; }
        }catch(e){}
        localStorage.setItem('govo_lead_backup_'+Date.now(), JSON.stringify(data));
        f.reset();
        alert('Request saved locally. API follow-up needed.');
      });
    });

    const adminForm = document.querySelector('[data-govo-admin-add]');
    if(adminForm){
      adminForm.addEventListener('submit', async e=>{
        e.preventDefault();
        const fd = new FormData(adminForm);
        const kind = fd.get('kind');
        const body = {action:'add',kind,item:{name:fd.get('name'),category:fd.get('category'),area:fd.get('area'),description:fd.get('description'),cta:kind==='shop'?'Order now':'Book now'}};
        const res = await fetch('/api/govo-inventory',{method:'POST',headers:{'content-type':'application/json','x-govo-pin':fd.get('pin')},body:JSON.stringify(body)});
        const json = await res.json();
        if(json.ok){ alert('Inventory added.'); location.reload(); }
        else alert(json.error || 'Failed');
      });
    }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
