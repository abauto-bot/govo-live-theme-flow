(function(){
  const DATA = {
    areas:["Meherpur","Gangni","Bamundi","Mujibnagar","Amjhupi"],
    shops:[
      {name:"GOVO Grocery Partner", area:"Meherpur", type:"Grocery", note:"Daily bazar, household, fast local delivery", price:"৳40 থেকে delivery"},
      {name:"GOVO Pharmacy Partner", area:"Meherpur", type:"Pharmacy", note:"Medicine request, prescription support, emergency delivery", price:"Priority support"},
      {name:"GOVO Electronics Partner", area:"Gangni", type:"Electronics", note:"Mobile accessories, charger, cable, repair pickup", price:"Fast pickup"},
      {name:"GOVO Food Partner", area:"Bamundi", type:"Food", note:"Local food order and parcel delivery", price:"Area based"}
    ],
    services:[
      {name:"Electrician", area:"Meherpur", note:"Home electric repair and installation", price:"Visit charge applies"},
      {name:"Plumber", area:"Gangni", note:"Pipe, water line, bathroom repair", price:"Visit charge applies"},
      {name:"Bike/Parcel Delivery", area:"Meherpur", note:"Parcel pickup and drop", price:"Distance based"},
      {name:"Document Delivery", area:"Mujibnagar", note:"Urgent paper/document delivery", price:"Priority charge"}
    ]
  };

  function qs(k){ return new URLSearchParams(location.search).get(k); }
  function path(){ return location.pathname.replace(/\/+$/,'') || '/app'; }

  function card(x){
    return `<div class="govo-phase5-card">
      <h3>${x.name}</h3>
      <p><b>${x.area || "Meherpur"}</b> · ${x.type || "Service"}</p>
      <p>${x.note || ""}</p>
      <div class="govo-phase5-price">${x.price || "GOVO support connected"}</div>
    </div>`;
  }

  function shell(title, subtitle, body){
    return `<section class="govo-phase5-wrap">
      <div class="govo-phase5-hero">
        <div class="govo-phase5-badge">⚡ GOVO Dark Neon Flow · Phase 5</div>
        <h1 class="govo-phase5-title">${title}</h1>
        <p class="govo-phase5-sub">${subtitle}</p>
        <div class="govo-phase5-actions">
          <a class="govo-phase5-btn" href="/shops?v=phase5">🏪 দোকান দেখুন</a>
          <a class="govo-phase5-btn ghost" href="/services?v=phase5">🛠️ সার্ভিস নিন</a>
          <a class="govo-phase5-btn" href="/order?v=phase5">📦 Delivery Book</a>
        </div>
        ${body}
      </div>
    </section>`;
  }

  function form(kind){
    return `<form class="govo-phase5-form" onsubmit="event.preventDefault(); localStorage.setItem('govo_${kind}_lead_'+Date.now(), JSON.stringify(Object.fromEntries(new FormData(this)))); this.reset(); alert('GOVO request saved. Admin follow-up needed.');">
      <input name="name" placeholder="নাম / Business name" required>
      <input name="phone" placeholder="Phone / WhatsApp number" required>
      <select name="area">${DATA.areas.map(a=>`<option>${a}</option>`).join("")}</select>
      <textarea name="details" placeholder="কী দরকার / কী service বা product?" rows="4"></textarea>
      <button type="submit">✅ GOVO Lead Save</button>
    </form>
    <div class="govo-phase5-note">এই form এখন browser local lead save করে। Next phase-এ admin database/API connect করবো।</div>`;
  }

  function render(){
    const p = path();
    let html = "";
    if(p.includes('/shops')){
      html = shell("Local shops — <b>এক জায়গায়</b>", "GOVO দোকান inventory flow restored. Customer এখন shop/service/product বুঝে action নিতে পারবে.", `<div class="govo-phase5-grid">${DATA.shops.map(card).join("")}</div>`);
    }else if(p.includes('/services')){
      html = shell("Service nin — <b>trusted local support</b>", "Electrician, delivery, document, repair — সব local service GOVO flow-তে organised.", `<div class="govo-phase5-grid">${DATA.services.map(card).join("")}</div>`);
    }else if(p.includes('/order')){
      html = shell("Delivery Book — <b>fast request</b>", "Customer request করবে, GOVO follow-up করবে, merchant/rider flow connected হবে.", form("order"));
    }else if(p.includes('/merchant')){
      html = shell("Merchant Join — <b>business onboard</b>", "দোকান/merchant GOVO network-এ join করার lead form.", form("merchant"));
    }else if(p.includes('/rider')){
      html = shell("Rider Join — <b>delivery partner</b>", "Rider partner onboarding lead form.", form("rider"));
    }else if(p.includes('/admin')){
      html = shell("Admin Login — <b>control room</b>", "Admin panel theme active. Dispatch, merchant, rider, order tracking next.", `<div class="govo-phase5-note">Admin flow should stay protected. No public token/API exposed.</div>`);
    }else{
      html = shell("Delivery, shops, services — <b>GOVO.</b>", "GOVO Express হলো local premium trust delivery & service OS. Wherever you are, we’re there.", `<div class="govo-phase5-grid">${DATA.shops.slice(0,2).map(card).join("")}${DATA.services.slice(0,2).map(card).join("")}</div>`);
    }

    const old = document.querySelector('.govo-phase5-wrap');
    if(old) old.remove();

    const target = document.querySelector('main') || document.body;
    target.insertAdjacentHTML('afterbegin', html);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();
