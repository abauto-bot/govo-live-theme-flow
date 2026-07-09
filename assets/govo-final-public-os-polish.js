(function(){
  function path(){
    return location.pathname.replace(/\/+$/,'') || '/app';
  }

  function isMainGovoPage(){
    return /\/(app|shops|services|service|order|merchant|rider|admin\/login)?$/.test(path());
  }

  function insertAfterHeader(html){
    document.querySelectorAll('[data-govo-final-os]').forEach(x=>x.remove());

    var target =
      document.querySelector('main') ||
      document.querySelector('#root') ||
      document.querySelector('.app') ||
      document.body;

    target.insertAdjacentHTML('afterbegin', html);
  }

  function stripHtml(){
    var p = path();

    var title = 'Meherpur-er local service OS';
    var line = 'দোকান, সার্ভিস, ডেলিভারি — এক জায়গায় দ্রুত request করুন।';

    if(p.includes('/shops')){
      title = 'দোকান খুঁজুন, সহজে order করুন';
      line = 'Bazar, pharmacy, mobile accessories, food — local shop flow ready.';
    }else if(p.includes('/services') || p.includes('/service')){
      title = 'Local service এক জায়গায়';
      line = 'Technician, doctor, agri, home helper — request button flow.';
    }else if(p.includes('/order')){
      title = 'Order request করুন';
      line = 'Phone, area, details দিলেই GOVO follow-up করবে।';
    }else if(p.includes('/merchant')){
      title = 'Merchant join করুন';
      line = 'আপনার দোকান GOVO network-এ যুক্ত করুন।';
    }else if(p.includes('/rider')){
      title = 'Rider partner flow';
      line = 'Local delivery partner হিসেবে কাজ শুরু করুন।';
    }else if(p.includes('/admin')){
      title = 'GOVO control room';
      line = 'Lead, order, rider, merchant follow-up এক জায়গায়।';
    }

    return `<section class="govo-final-os-strip" data-govo-final-os="1">
      <b>${title}</b>
      <span>${line}</span>
      <div class="govo-final-os-actions">
        <a href="/shops?v=finalpublic">দোকান</a>
        <a class="dark" href="/services?v=finalpublic">সার্ভিস</a>
        <a href="/order?v=finalpublic">Order</a>
      </div>
    </section>
    <section class="govo-final-trust-row" data-govo-final-os="1">
      <div><b>১</b>সহজ</div>
      <div><b>২</b>লোকাল</div>
      <div><b>৩</b>দ্রুত</div>
      <div><b>৪</b>Follow-up</div>
    </section>`;
  }

  function fixBrandText(){
    var textNodes = [];
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while(walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(function(n){
      if(!n.nodeValue) return;
      n.nodeValue = n.nodeValue
        .replace(/Premium local delivery & s\.\.\./g, 'Premium local delivery & service OS')
        .replace(/Premium local delivery & servic\.\.\./g, 'Premium local delivery & service OS');
    });
  }

  function run(){
    if(!isMainGovoPage()) return;
    insertAfterHeader(stripHtml());
    fixBrandText();

    // remove accidental duplicate final strips
    var seen = false;
    document.querySelectorAll('.govo-final-os-strip').forEach(function(x){
      if(seen) x.remove();
      seen = true;
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', run);
  }else{
    run();
  }

  setTimeout(run, 800);
})();
