(function(){
  const style = `
  .govo-admin-api-panel{
    margin-top:18px;
    border:1px solid rgba(140,255,0,.28);
    border-radius:24px;
    padding:16px;
    background:rgba(2,5,3,.58);
    color:#f2fff7;
  }
  .govo-admin-api-panel h2{margin:0 0 10px;color:#8cff00}
  .govo-admin-api-form{display:grid;gap:10px;margin-top:12px}
  .govo-admin-api-form input,
  .govo-admin-api-form select,
  .govo-admin-api-form textarea{
    width:100%;box-sizing:border-box;border:1px solid rgba(140,255,0,.28);
    border-radius:14px;padding:12px;background:rgba(0,0,0,.35);color:#f2fff7
  }
  .govo-admin-api-form button,.govo-admin-api-btn{
    border:0;border-radius:16px;padding:13px 15px;
    background:linear-gradient(135deg,#8cff00,#14e889);color:#031006;
    font-weight:1000;cursor:pointer
  }
  .govo-admin-api-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .govo-admin-api-output{
    margin-top:12px;white-space:pre-wrap;font-family:monospace;font-size:13px;
    color:#b7c7be;background:rgba(0,0,0,.35);border-radius:16px;padding:12px;
    max-height:300px;overflow:auto
  }
  @media(max-width:700px){.govo-admin-api-row{grid-template-columns:1fr}}
  `;
  function addStyle(){
    if(document.getElementById('govo-phase6b-style')) return;
    const s=document.createElement('style');
    s.id='govo-phase6b-style';
    s.textContent=style;
    document.head.appendChild(s);
  }
  function isAdmin(){ return location.pathname.includes('/admin'); }
  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function getPin(){ return localStorage.getItem('govo_admin_pin') || ''; }
  function setPin(v){ localStorage.setItem('govo_admin_pin', v); }

  function adminPanel(){
    const host = document.querySelector('.govo-phase5-hero') || document.querySelector('main') || document.body;
    if(document.querySelector('.govo-admin-api-panel')) return;

    host.insertAdjacentHTML('beforeend', `
      <div class="govo-admin-api-panel">
        <h2>⚡ GOVO Inventory API Panel</h2>
        <p>Server-side inventory/leads active. PIN শুধু owner/admin জানবে।</p>

        <div class="govo-admin-api-form">
          <input id="govoApiPin" type="password" placeholder="Admin PIN" value="${esc(getPin())}">
          <button id="govoSavePin" type="button">Save PIN</button>
        </div>

        <form id="govoAddItemForm" class="govo-admin-api-form">
          <div class="govo-admin-api-row">
            <select name="kind">
              <option value="shop">Shop</option>
              <option value="service">Service</option>
            </select>
            <select name="area">
              <option>Meherpur</option>
              <option>Gangni</option>
              <option>Bamundi</option>
              <option>Mujibnagar</option>
              <option>Amjhupi</option>
            </select>
          </div>
          <input name="name" placeholder="Shop/Service name" required>
          <input name="category" placeholder="Category" required>
          <textarea name="description" placeholder="Description" rows="3"></textarea>
          <input name="cta" placeholder="CTA text e.g. Order now / Book now">
          <button type="submit">✅ Add to GOVO Inventory</button>
        </form>

        <div class="govo-admin-api-row" style="margin-top:12px">
          <button class="govo-admin-api-btn" id="govoLoadInventory">Load Inventory</button>
          <button class="govo-admin-api-btn" id="govoLoadLeads">Load Leads</button>
        </div>
        <div id="govoApiOutput" class="govo-admin-api-output">Ready.</div>
      </div>
    `);

    const out = document.getElementById('govoApiOutput');
    document.getElementById('govoSavePin').onclick = () => {
      setPin(document.getElementById('govoApiPin').value.trim());
      out.textContent = 'PIN saved locally in this browser.';
    };

    document.getElementById('govoAddItemForm').addEventListener('submit', async (e)=>{
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const body = {
        action:'add',
        kind: fd.get('kind'),
        item:{
          name: fd.get('name'),
          area: fd.get('area'),
          category: fd.get('category'),
          description: fd.get('description'),
          cta: fd.get('cta') || 'Request'
        }
      };
      out.textContent = 'Saving...';
      const res = await fetch('/api/govo-inventory', {
        method:'POST',
        headers:{'content-type':'application/json','x-govo-pin':getPin()},
        body:JSON.stringify(body)
      });
      const json = await res.json();
      out.textContent = JSON.stringify(json, null, 2);
      if(json.ok) e.currentTarget.reset();
    });

    document.getElementById('govoLoadInventory').onclick = async ()=>{
      const res = await fetch('/api/govo-inventory?v=' + Date.now(), {cache:'no-store'});
      out.textContent = JSON.stringify(await res.json(), null, 2);
    };

    document.getElementById('govoLoadLeads').onclick = async ()=>{
      const res = await fetch('/api/govo-leads', {headers:{'x-govo-pin':getPin()}});
      out.textContent = JSON.stringify(await res.json(), null, 2);
    };
  }

  function interceptLeadForms(){
    document.addEventListener('submit', async function(e){
      const form = e.target.closest && e.target.closest('.govo-phase5-form');
      if(!form) return;
      e.preventDefault();
      e.stopImmediatePropagation();

      const data = Object.fromEntries(new FormData(form));
      data.type = location.pathname.includes('/merchant') ? 'merchant'
        : location.pathname.includes('/rider') ? 'rider'
        : location.pathname.includes('/order') ? 'order'
        : 'customer';

      try{
        const res = await fetch('/api/govo-leads', {
          method:'POST',
          headers:{'content-type':'application/json'},
          body:JSON.stringify(data)
        });
        const json = await res.json();
        if(json.ok){
          form.reset();
          alert('✅ GOVO request saved on server. Admin follow-up needed.');
        }else{
          alert('❌ Save failed: ' + (json.error || 'unknown'));
        }
      }catch(err){
        alert('❌ Network/API failed. Try again.');
      }
    }, true);
  }

  function init(){
    addStyle();
    interceptLeadForms();
    if(isAdmin()) setTimeout(adminPanel, 700);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
