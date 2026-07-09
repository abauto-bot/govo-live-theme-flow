(function(){
  const GOVO = {
    areas:["Meherpur","Gangni","Bamundi","Mujibnagar","Amjhupi"],
    fallbackShops:[
      {name:"Grocery / Bazar",area:"Meherpur",category:"daily needs",description:"Daily bazar, rice, oil, vegetables",cta:"Order grocery"},
      {name:"Pharmacy Support",area:"Meherpur",category:"medicine",description:"Medicine request, emergency delivery support",cta:"Request medicine"},
      {name:"Mobile Accessories",area:"Gangni",category:"electronics",description:"Charger, cable, earphone, repair pickup",cta:"View items"},
      {name:"Food Partner",area:"Bamundi",category:"food",description:"Local food order and parcel delivery",cta:"Order food"}
    ],
    fallbackServices:[
      {name:"Electrician",area:"Meherpur",category:"home service",description:"Fan, light, switch, wiring repair",cta:"Book electrician"},
      {name:"Plumber",area:"Gangni",category:"home service",description:"Pipe, water line, bathroom repair",cta:"Book plumber"},
      {name:"Parcel Delivery",area:"Meherpur",category:"delivery",description:"Pickup and drop support",cta:"Book delivery"},
      {name:"Document Delivery",area:"Mujibnagar",category:"urgent",description:"Paper/file delivery support",cta:"Send document"}
    ]
  };

  function route(){
    return location.pathname.replace(/\/+$/,'') || '/app';
  }

  function esc(v){
    return String(v ?? '').replace(/[&<>"']/g, m => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    }[m]));
  }

  function logoSvg(){
    return `
    <svg viewBox="0 0 520 520" xmlns="http://www.w3.org/2000/svg" aria-label="GOVO">
      <defs>
        <linearGradient id="g7g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#8cff00"/>
          <stop offset=".55" stop-color="#39ff45"/>
          <stop offset="1" stop-color="#14e889"/>
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse cx="260" cy="444" rx="126" ry="30" fill="none" stroke="#fff" stroke-width="22" opacity=".95"/>
      <path filter="url(#glow)" d="M342 86c-36-31-88-43-137-27-74 24-116 96-98 169 12 49 49 88 86 127l67 71 74-80h-72l-25 26-29-31c-32-34-61-65-69-103-11-49 17-99 68-116 38-13 78-2 104 23l31-59z" fill="url(#g7g)"/>
      <path d="M260 168c-50 0-91 40-91 90s41 90 91 90c42 0 78-28 88-66h-90v-50h149v26c0 82-66 140-147 140-78 0-141-63-141-140s63-140 141-140c43 0 81 19 107 49l-42 34c-16-20-39-33-65-33z" fill="#fff"/>
      <path d="M310 244h89v52h-89z" fill="url(#g7g)"/>
      <path d="M311 344l-27 45h28l-16 50 57-76h-30l18-19z" fill="url(#g7g)"/>
    </svg>`;
  }

  async function loadInventory(){
    try{
      const r = await fetch('/api/govo-inventory?v=' + Date.now(), {cache:'no-store'});
      if(r.ok){
        const j = await r.json();
        return {
          shops: Array.isArray(j.shops) && j.shops.length ? j.shops : GOVO.fallbackShops,
          services: Array.isArray(j.services) && j.services.length ? j.services : GOVO.fallbackServices,
          areas: j.areas || GOVO.areas
        };
      }
    }catch(e){}
    try{
      const r = await fetch('/assets/govo-inventory.json?v=' + Date.now(), {cache:'no-store'});
      const j = await r.json();
      return {
        shops: Array.isArray(j.shops) && j.shops.length ? j.shops : GOVO.fallbackShops,
        services: Array.isArray(j.services) && j.services.length ? j.services : GOVO.fallbackServices,
        areas: j.areas || GOVO.areas
      };
    }catch(e){}
    return {shops:GOVO.fallbackShops,services:GOVO.fallbackServices,areas:GOVO.areas};
  }

  function header(){
    return `<div class="govo-phase7-top">
      <div class="govo-phase7-brand">
        <div class="govo-phase7-logo">${logoSvg()}</div>
        <div class="govo-phase7-name">
          <b>GOVO Express</b>
          <span>Premium local delivery & service OS</span>
        </div>
      </div>
      <button class="govo-phase7-menu" type="button" data-govo-menu>☰</button>
    </div>`;
  }

  function actions(){
    return `<div class="govo-phase7-actions">
      <a class="govo-phase7-btn" href="/shops?v=phase7">দোকান দেখুন</a>
      <a class="govo-phase7-btn dark" href="/services?v=phase7">সার্ভিস নিন</a>
      <a class="govo-phase7-btn" href="/order?v=phase7">Delivery Book</a>
    </div>`;
  }

  function flow(){
    return `<div class="govo-phase7-section-head">
      <h2>Customer Flow</h2>
      <a class="govo-phase7-small-btn" href="/order?v=phase7">Start Order</a>
    </div>
    <div class="govo-phase7-flow">
      <div class="govo-phase7-flow-card">
        <div class="govo-phase7-step">1</div>
        <div><h3>Choose</h3><p>Shop অথবা service category select করুন।</p></div>
        <div class="govo-phase7-icon">▢</div>
      </div>
      <div class="govo-phase7-flow-card">
        <div class="govo-phase7-step">2</div>
        <div><h3>Request</h3><p>Phone, area, delivery/service details submit করুন।</p></div>
        <div class="govo-phase7-icon">✎</div>
      </div>
      <div class="govo-phase7-flow-card">
        <div class="govo-phase7-step">3</div>
        <div><h3>GOVO handles</h3><p>Admin/rider/merchant follow-up করবে।</p></div>
        <div class="govo-phase7-icon">◎</div>
      </div>
    </div>`;
  }

  function card(x, href){
    return `<div class="govo-phase7-card">
      <h3>${esc(x.name)}</h3>
      <div class="govo-phase7-meta">${esc(x.area || 'Meherpur')} · ${esc(x.category || 'GOVO')}</div>
      <p>${esc(x.description || '')}</p>
      <a class="govo-phase7-tag" href="${href}">${esc(x.cta || 'Request')}</a>
    </div>`;
  }

  function grid(title, button, items, hrefBase){
    return `<div class="govo-phase7-section-head">
      <h2>${esc(title)}</h2>
      <a class="govo-phase7-small-btn" href="${hrefBase}?v=phase7">${esc(button)}</a>
    </div>
    <div class="govo-phase7-grid">
      ${items.map(x=>card(x, hrefBase === '/shops' ? '/order?from=shop&v=phase7' : '/order?from=service&v=phase7')).join('')}
    </div>`;
  }

  function form(kind){
    const title = kind === 'merchant' ? 'Merchant Join'
      : kind === 'rider' ? 'Rider Join'
      : 'Delivery / Service Request';
    const subtitle = kind === 'merchant' ? 'দোকান GOVO network-এ add করার জন্য info দিন।'
      : kind === 'rider' ? 'Rider partner হিসেবে join করার info দিন।'
      : 'আপনার request দিন, GOVO follow-up করবে।';

    return `<div class="govo-phase7-section-head"><h2>${title}</h2></div>
    <div class="govo-phase7-card">
      <p>${subtitle}</p>
      <form class="govo-phase7-form" data-govo-lead="${kind}">
        <input name="name" placeholder="নাম / Business name" required>
        <input name="phone" placeholder="Phone / WhatsApp number" required>
        <select name="area">
          ${GOVO.areas.map(a=>`<option>${a}</option>`).join('')}
        </select>
        <textarea name="details" rows="4" placeholder="Details লিখুন"></textarea>
        <button type="submit">✅ Submit GOVO Request</button>
      </form>
    </div>`;
  }

  function adminPanel(inv){
    return `<div class="govo-phase7-section-head">
      <h2>Admin Control</h2>
      <a class="govo-phase7-small-btn" href="/api/govo-inventory" target="_blank">Inventory API</a>
    </div>
    <div class="govo-phase7-card">
      <h3>Inventory Status</h3>
      <p>Shops: ${(inv.shops||[]).length} · Services: ${(inv.services||[]).length}</p>
      <div class="govo-phase7-admin-box">
        API routes: /api/govo-inventory, /api/govo-leads<br>
        PIN path on VPS: /home/abu/.govo_inventory_admin_pin
      </div>
      <form class="govo-phase7-form" data-govo-admin-add>
        <input name="pin" type="password" placeholder="Admin PIN">
        <select name="kind"><option value="shop">Shop</option><option value="service">Service</option></select>
        <input name="name" placeholder="Shop/Service name" required>
        <input name="category" placeholder="Category" required>
        <select name="area">${GOVO.areas.map(a=>`<option>${a}</option>`).join('')}</select>
        <textarea name="description" rows="3" placeholder="Description"></textarea>
        <button type="submit">✅ Add Inventory Item</button>
      </form>
    </div>`;
  }

  function bottom(){
    const p = route();
    const items = [
      ['/app','⌂','Home'],
      ['/shops','▣','Shops'],
      ['/services','⚒','Service'],
      ['/order','▣','Order'],
      ['/support','☏','Help']
    ];
    return `<div class="govo-phase7-bottom"><div class="govo-phase7-bottom-inner">
      ${items.map(([href,ico,label])=>{
        const active = (p === href || (href === '/app' && p === '/')) ? 'active' : '';
        return `<a class="govo-phase7-nav ${active}" href="${href}?v=phase7"><b>${ico}</b><span>${label}</span></a>`;
      }).join('')}
    </div></div>`;
  }

  function pageBody(inv){
    const p = route();
    if(p.includes('/shops')){
      return `<div class="govo-phase7-hero">
        <div class="govo-phase7-kicker">⚡ GOVO Shops</div>
        <h1 class="govo-phase7-title">Local shops <em>one place.</em></h1>
        <p class="govo-phase7-subtitle">দোকান, bazar, pharmacy, accessories — same GOVO premium flow.</p>
        ${actions()}
      </div>${grid('Popular Shops','View all',inv.shops || GOVO.fallbackShops,'/shops')}`;
    }
    if(p.includes('/services')){
      return `<div class="govo-phase7-hero">
        <div class="govo-phase7-kicker">⚡ GOVO Services</div>
        <h1 class="govo-phase7-title">Service nin <em>fast.</em></h1>
        <p class="govo-phase7-subtitle">Electrician, plumber, delivery, document — trusted local service flow.</p>
        ${actions()}
      </div>${grid('Available Services','View all',inv.services || GOVO.fallbackServices,'/services')}`;
    }
    if(p.includes('/order')){
      return `<div class="govo-phase7-hero">
        <div class="govo-phase7-kicker">⚡ Start Order</div>
        <h1 class="govo-phase7-title">Request submit <em>easy.</em></h1>
        <p class="govo-phase7-subtitle">Phone, area, details দিন — GOVO follow-up করবে।</p>
      </div>${form('order')}`;
    }
    if(p.includes('/merchant')){
      return `<div class="govo-phase7-hero">
        <div class="govo-phase7-kicker">⚡ Merchant Network</div>
        <h1 class="govo-phase7-title">Merchant join <em>GOVO.</em></h1>
        <p class="govo-phase7-subtitle">Local business GOVO delivery/service network-এ add হবে।</p>
      </div>${form('merchant')}${grid('Shop Examples','Shops',inv.shops || GOVO.fallbackShops,'/shops')}`;
    }
    if(p.includes('/rider')){
      return `<div class="govo-phase7-hero">
        <div class="govo-phase7-kicker">⚡ Rider Network</div>
        <h1 class="govo-phase7-title">Rider join <em>fast.</em></h1>
        <p class="govo-phase7-subtitle">Delivery partner onboarding, area coverage, follow-up flow।</p>
      </div>${form('rider')}`;
    }
    if(p.includes('/admin')){
      return `<div class="govo-phase7-hero">
        <div class="govo-phase7-kicker">⚡ GOVO Admin</div>
        <h1 class="govo-phase7-title">Control room <em>ready.</em></h1>
        <p class="govo-phase7-subtitle">Inventory, leads, merchant/rider follow-up — same GOVO UI.</p>
      </div>${adminPanel(inv)}`;
    }
    return `<div class="govo-phase7-hero">
      <div class="govo-phase7-kicker">⚡ GOVO Dark Neon Flow</div>
      <h1 class="govo-phase7-title">Delivery, shops, services — <em>GOVO.</em></h1>
      <p class="govo-phase7-subtitle">GOVO Express হলো local premium trust delivery & service OS. Wherever you are, we’re there.</p>
      ${actions()}
    </div>${flow()}${grid('Popular Shops','View all',(inv.shops || GOVO.fallbackShops).slice(0,4),'/shops')}`;
  }

  async function render(){
    document.body.classList.add('govo-phase7-active');

    document.querySelectorAll('.govo-phase7-shell,.govo-phase7-bottom').forEach(x=>x.remove());

    const inv = await loadInventory();

    const shell = document.createElement('div');
    shell.className = 'govo-phase7-shell';
    shell.innerHTML = header() + pageBody(inv);
    document.body.insertBefore(shell, document.body.firstChild);

    document.body.insertAdjacentHTML('beforeend', bottom());

    document.querySelectorAll('[data-govo-lead]').forEach(formEl=>{
      formEl.addEventListener('submit', async e=>{
        e.preventDefault();
        const type = formEl.getAttribute('data-govo-lead');
        const data = Object.fromEntries(new FormData(formEl));
        data.type = type;
        try{
          const res = await fetch('/api/govo-leads', {
            method:'POST',
            headers:{'content-type':'application/json'},
            body:JSON.stringify(data)
          });
          const json = await res.json();
          if(json.ok){
            formEl.reset();
            alert('✅ GOVO request saved on server.');
          }else{
            throw new Error(json.error || 'save failed');
          }
        }catch(err){
          localStorage.setItem('govo_lead_backup_'+Date.now(), JSON.stringify(data));
          alert('✅ Request saved locally. API follow-up needed.');
        }
      });
    });

    const adminAdd = document.querySelector('[data-govo-admin-add]');
    if(adminAdd){
      adminAdd.addEventListener('submit', async e=>{
        e.preventDefault();
        const fd = new FormData(adminAdd);
        const pin = fd.get('pin');
        const kind = fd.get('kind');
        const body = {
          action:'add',
          kind,
          item:{
            name:fd.get('name'),
            category:fd.get('category'),
            area:fd.get('area'),
            description:fd.get('description'),
            cta:kind === 'shop' ? 'Order now' : 'Book now'
          }
        };
        const res = await fetch('/api/govo-inventory', {
          method:'POST',
          headers:{'content-type':'application/json','x-govo-pin':pin},
          body:JSON.stringify(body)
        });
        const json = await res.json();
        if(json.ok){
          alert('✅ Inventory added.');
          location.reload();
        }else{
          alert('❌ ' + (json.error || 'Failed'));
        }
      });
    }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();

  setTimeout(()=>document.querySelectorAll('.govo-phase5-wrap,.govo-admin-api-panel').forEach(x=>x.style.display='none'), 900);
})();
