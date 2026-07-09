(function(){
  const state = { data:null };

  const css = `
  .govo-inventory-source-box{
    margin-top:18px;
    border:1px solid rgba(140,255,0,.28);
    border-radius:24px;
    background:rgba(2,5,3,.55);
    padding:16px;
  }
  .govo-inventory-toolbar{
    display:flex;
    gap:10px;
    flex-wrap:wrap;
    margin:12px 0 16px;
  }
  .govo-inventory-pill{
    border:1px solid rgba(140,255,0,.25);
    background:rgba(140,255,0,.08);
    color:#f2fff7;
    border-radius:999px;
    padding:9px 13px;
    font-weight:900;
    cursor:pointer;
  }
  .govo-inventory-pill.active{
    background:linear-gradient(135deg,#8cff00,#14e889);
    color:#031006;
  }
  .govo-inventory-card{
    border:1px solid rgba(140,255,0,.24);
    border-radius:22px;
    background:linear-gradient(145deg,rgba(8,35,19,.76),rgba(2,5,3,.88));
    padding:16px;
    color:#f2fff7;
    box-shadow:0 12px 28px rgba(0,0,0,.25);
  }
  .govo-inventory-card h3{
    margin:0 0 8px;
    color:#8cff00;
    font-size:21px;
  }
  .govo-inventory-meta{
    color:#fff7b8;
    font-weight:900;
    margin-bottom:8px;
  }
  .govo-inventory-card p{
    color:#b7c7be;
    line-height:1.5;
    margin:0 0 12px;
  }
  .govo-inventory-cta{
    display:inline-flex;
    text-decoration:none;
    border-radius:999px;
    padding:10px 13px;
    background:linear-gradient(135deg,#8cff00,#14e889);
    color:#031006;
    font-weight:1000;
  }
  .govo-admin-inventory-note{
    margin-top:14px;
    padding:13px;
    border-radius:18px;
    border:1px dashed rgba(140,255,0,.35);
    color:#fff7b8;
    background:rgba(255,247,184,.06);
    line-height:1.5;
  }`;

  function injectStyle(){
    if(document.getElementById('govo-phase6a-style')) return;
    const s=document.createElement('style');
    s.id='govo-phase6a-style';
    s.textContent=css;
    document.head.appendChild(s);
  }

  function route(){
    return location.pathname.replace(/\/+$/,'') || '/app';
  }

  function esc(v){
    return String(v ?? '').replace(/[&<>"']/g, m => ({
      '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    }[m]));
  }

  function card(x, kind){
    const href = kind === 'shop'
      ? `/order?from=shop&id=${encodeURIComponent(x.id)}`
      : `/order?from=service&id=${encodeURIComponent(x.id)}`;

    return `<div class="govo-inventory-card" data-area="${esc(x.area)}" data-category="${esc(x.category)}">
      <h3>${esc(x.name)}</h3>
      <div class="govo-inventory-meta">${esc(x.area)} · ${esc(x.category)} · ${esc(x.status)}</div>
      <p>${esc(x.description)}</p>
      <a class="govo-inventory-cta" href="${href}">${esc(x.cta || 'Request')}</a>
    </div>`;
  }

  function grid(items, kind){
    const areas = [...new Set(items.map(x=>x.area).filter(Boolean))];
    return `<div class="govo-inventory-source-box">
      <div class="govo-inventory-toolbar">
        <button class="govo-inventory-pill active" data-govo-filter="all">All</button>
        ${areas.map(a=>`<button class="govo-inventory-pill" data-govo-filter="${esc(a)}">${esc(a)}</button>`).join('')}
      </div>
      <div class="govo-phase5-grid govo-inventory-grid">
        ${items.map(x=>card(x,kind)).join('')}
      </div>
    </div>`;
  }

  function bindFilter(root){
    root.querySelectorAll('[data-govo-filter]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const val=btn.getAttribute('data-govo-filter');
        root.querySelectorAll('[data-govo-filter]').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        root.querySelectorAll('.govo-inventory-card').forEach(card=>{
          card.style.display = (val === 'all' || card.dataset.area === val) ? '' : 'none';
        });
      });
    });
  }

  function patchPhase5Content(){
    if(!state.data) return;

    const p = route();
    const phase5 = document.querySelector('.govo-phase5-hero');
    if(!phase5) return;

    const oldGrid = phase5.querySelector('.govo-phase5-grid, .govo-inventory-source-box');
    if(p.includes('/shops')){
      if(oldGrid) oldGrid.outerHTML = grid(state.data.shops || [], 'shop');
      bindFilter(phase5);
    }else if(p.includes('/services')){
      if(oldGrid) oldGrid.outerHTML = grid(state.data.services || [], 'service');
      bindFilter(phase5);
    }else if(p.includes('/app') || p === '/'){
      if(oldGrid){
        const mixed = [...(state.data.shops || []).slice(0,2), ...(state.data.services || []).slice(0,2)];
        oldGrid.outerHTML = grid(mixed, 'service');
        bindFilter(phase5);
      }
    }else if(p.includes('/admin')){
      const note=document.createElement('div');
      note.className='govo-admin-inventory-note';
      note.innerHTML=`<b>Inventory source active:</b><br>
      /var/www/assets/govo-inventory.json<br><br>
      Shops: ${(state.data.shops||[]).length} · Services: ${(state.data.services||[]).length}<br>
      Next phase: admin database/API write panel.`;
      phase5.appendChild(note);
    }
  }

  async function init(){
    injectStyle();
    try{
      const res = await fetch('/assets/govo-inventory.json?v=' + Date.now(), {cache:'no-store'});
      state.data = await res.json();
      patchPhase5Content();
      setTimeout(patchPhase5Content, 800);
    }catch(e){
      console.warn('GOVO inventory source load failed', e);
    }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
