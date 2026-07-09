(function(){
  function logoSvg(){
    return `
    <svg viewBox="0 0 520 520" xmlns="http://www.w3.org/2000/svg" aria-label="GOVO Express logo">
      <defs>
        <linearGradient id="gf_green" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#8cff00"/>
          <stop offset=".55" stop-color="#39ff45"/>
          <stop offset="1" stop-color="#14e889"/>
        </linearGradient>
        <filter id="gf_glow">
          <feGaussianBlur stdDeviation="7" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <ellipse cx="260" cy="444" rx="126" ry="30" fill="none" stroke="#ffffff" stroke-width="22" opacity=".94"/>
      <path filter="url(#gf_glow)" d="M342 86c-36-31-88-43-137-27-74 24-116 96-98 169 12 49 49 88 86 127l67 71 74-80h-72l-25 26-29-31c-32-34-61-65-69-103-11-49 17-99 68-116 38-13 78-2 104 23l31-59z" fill="url(#gf_green)"/>
      <path d="M260 168c-50 0-91 40-91 90s41 90 91 90c42 0 78-28 88-66h-90v-50h149v26c0 82-66 140-147 140-78 0-141-63-141-140s63-140 141-140c43 0 81 19 107 49l-42 34c-16-20-39-33-65-33z" fill="#ffffff"/>
      <path d="M310 244h89v52h-89z" fill="url(#gf_green)"/>
      <path d="M311 344l-27 45h28l-16 50 57-76h-30l18-19z" fill="url(#gf_green)"/>
    </svg>`;
  }

  function footerHtml(){
    return `<footer class="govo-final-footer" data-govo-final-footer="1">
      <div class="govo-final-footer-inner">
        <div class="govo-final-footer-mark">${logoSvg()}</div>
        <div class="govo-final-footer-word">
          <div class="brand">
            <span class="govo">GOVO</span>
            <span class="express">EXPRESS</span>
          </div>
          <div class="govo-final-footer-line"></div>
          <div class="govo-final-footer-tagline">WHEREVER YOU ARE, <b>WE’RE THERE.</b></div>
          <div class="govo-final-footer-sub">Premium local delivery & service OS · Meherpur first, trusted local network.</div>
        </div>
      </div>
    </footer>`;
  }

  function deployFooter(){
    document.querySelectorAll('[data-govo-final-footer="1"]').forEach(function(x){ x.remove(); });

    var candidates = [
      document.querySelector('main'),
      document.querySelector('#root'),
      document.querySelector('.app'),
      document.querySelector('.page'),
      document.querySelector('.govo-app'),
      document.body
    ].filter(Boolean);

    var target = candidates[0] || document.body;
    target.insertAdjacentHTML('beforeend', footerHtml());
  }

  function run(){
    deployFooter();
    setTimeout(deployFooter, 700);
    setTimeout(deployFooter, 1600);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', run);
  }else{
    run();
  }
})();
