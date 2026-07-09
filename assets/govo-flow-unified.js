(function(){
  const DEFAULT_CONFIG = {
    brandName: "GOVO Express",
    subline: "Premium local delivery & service OS",
    tagline: "WHEREVER YOU ARE, WE’RE THERE.",
    primary: "#8cff00",
    secondary: "#14e889"
  };

  const LOGO = "/assets/govo-final-logo.svg";

  const bottomNav = [
    { href:"/app", label:"Home", ico:"🏠", match:["/app","/"] },
    { href:"/shops", label:"Shops", ico:"🏪", match:["/shops"] },
    { href:"/services", label:"Service", ico:"🛠️", match:["/services"] },
    { href:"/order", label:"Order", ico:"📦", match:["/order"] },
    { href:"/support", label:"Help", ico:"☎️", match:["/support","/track","/help"] }
  ];

  const menuLinks = [
    { href:"/app", label:"Customer App" },
    { href:"/shops", label:"Shops" },
    { href:"/services", label:"Services" },
    { href:"/order", label:"Order" },
    { href:"/track", label:"Track" },
    { href:"/merchant", label:"Merchant" },
    { href:"/rider", label:"Rider" },
    { href:"/admin/login", label:"Admin" }
  ];

  function routePath(){
    return window.location.pathname.replace(/\/+$/,"") || "/";
  }

  function isActive(item){
    const p = routePath();
    return item.match.some(m => p === m || p.startsWith(m + "/"));
  }

  function setCssVars(cfg){
    document.documentElement.style.setProperty("--govo-green", cfg.primary || DEFAULT_CONFIG.primary);
    document.documentElement.style.setProperty("--govo-green2", cfg.secondary || DEFAULT_CONFIG.secondary);
  }

  function hideOldShell(){
    const selectors = [
      "body > header",
      ".app-header",
      ".govo-header",
      ".topbar",
      ".navbar",
      ".bottom-nav",
      ".govo-bottom-nav",
      ".mobile-bottom-nav"
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if(el.id === "govo-unified-header") return;
        if(el.id === "govo-unified-bottom-nav") return;
        if(el.id === "govo-unified-menu") return;
        if(el.closest("#govo-unified-header")) return;
        if(el.closest("#govo-unified-bottom-nav")) return;
        if(el.closest("#govo-unified-menu")) return;
        el.classList.add("govo-old-flow-hidden");
      });
    });
  }

  function makeHeader(cfg){
    if(document.getElementById("govo-unified-header")) return;

    const header = document.createElement("div");
    header.id = "govo-unified-header";
    header.innerHTML = `
      <div class="govo-head-brand" role="button" tabindex="0">
        <img class="govo-head-logo" src="${LOGO}" alt="GOVO Express">
        <div class="govo-head-copy">
          <div class="govo-head-title">${cfg.brandName || DEFAULT_CONFIG.brandName}</div>
          <div class="govo-head-sub">${cfg.subline || DEFAULT_CONFIG.subline}</div>
        </div>
      </div>
      <button class="govo-menu-btn" type="button" aria-label="Open GOVO menu">☰</button>
    `;

    document.body.insertBefore(header, document.body.firstChild);

    header.querySelector(".govo-head-brand").addEventListener("click", () => {
      window.location.href = "/app";
    });

    header.querySelector(".govo-menu-btn").addEventListener("click", toggleMenu);
  }

  function makeMenu(){
    if(document.getElementById("govo-unified-menu")) return;

    const menu = document.createElement("div");
    menu.id = "govo-unified-menu";
    menu.setAttribute("hidden", "hidden");

    menu.innerHTML = `
      <div class="govo-menu-backdrop"></div>
      <div class="govo-menu-panel">
        <div class="govo-menu-top">
          <img src="${LOGO}" alt="GOVO Express">
          <div>
            <b>GOVO Express</b>
            <small>One theme. Full flow.</small>
          </div>
          <button type="button" class="govo-menu-close">×</button>
        </div>
        <div class="govo-menu-grid">
          ${menuLinks.map(link => `<a href="${link.href}">${link.label}</a>`).join("")}
        </div>
      </div>
    `;

    document.body.appendChild(menu);

    menu.querySelector(".govo-menu-backdrop").addEventListener("click", closeMenu);
    menu.querySelector(".govo-menu-close").addEventListener("click", closeMenu);
  }

  function toggleMenu(){
    const menu = document.getElementById("govo-unified-menu");
    if(!menu) return;
    if(menu.hasAttribute("hidden")){
      menu.removeAttribute("hidden");
      document.body.classList.add("govo-menu-open");
    }else{
      closeMenu();
    }
  }

  function closeMenu(){
    const menu = document.getElementById("govo-unified-menu");
    if(!menu) return;
    menu.setAttribute("hidden", "hidden");
    document.body.classList.remove("govo-menu-open");
  }

  function makeBottomNav(){
    if(document.getElementById("govo-unified-bottom-nav")) return;

    const bar = document.createElement("div");
    bar.id = "govo-unified-bottom-nav";

    bar.innerHTML = bottomNav.map(item => `
      <a href="${item.href}" class="${isActive(item) ? "active" : ""}">
        <span class="ico">${item.ico}</span>
        <span>${item.label}</span>
      </a>
    `).join("");

    document.body.appendChild(bar);
  }

  function polishPage(){
    document.body.classList.add("govo-flow-active");
    document.body.setAttribute("data-govo-route", routePath());

    document.querySelectorAll("img").forEach(img => {
      const alt = (img.getAttribute("alt") || "").toLowerCase();
      const src = (img.getAttribute("src") || "").toLowerCase();
      if(alt.includes("govo") || src.includes("govo") || src.includes("logo")){
        img.style.objectFit = "contain";
      }
    });
  }

  function boot(cfg){
    cfg = Object.assign({}, DEFAULT_CONFIG, cfg || {});
    setCssVars(cfg);
    hideOldShell();
    makeHeader(cfg);
    makeMenu();
    makeBottomNav();
    polishPage();

    setTimeout(() => {
      hideOldShell();
      polishPage();
    }, 500);
  }

  function loadConfig(){
    fetch("/assets/govo-theme.config.json?v=" + Date.now(), {cache:"no-store"})
      .then(r => r.ok ? r.json() : DEFAULT_CONFIG)
      .then(boot)
      .catch(() => boot(DEFAULT_CONFIG));
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", loadConfig);
  }else{
    loadConfig();
  }
})();

/* GOVO Phase 5 rescue loader */
(function(){
  function add(tag, attrs){
    var el=document.createElement(tag);
    Object.keys(attrs).forEach(function(k){el.setAttribute(k,attrs[k]);});
    document.head.appendChild(el);
  }
  if(!document.querySelector('link[href="/assets/govo-phase5-inventory-rescue.css"]')){
    add('link',{rel:'stylesheet',href:'/assets/govo-phase5-inventory-rescue.css?v=phase5'});
  }
  if(!document.querySelector('script[src="/assets/govo-phase5-inventory-rescue.js"]')){
    add('script',{src:'/assets/govo-phase5-inventory-rescue.js?v=phase5',defer:'defer'});
  }
})();

/* GOVO Phase 6A inventory source renderer loader */
(function(){
  function addScript(src){
    if(document.querySelector('script[src^="'+src+'"]')) return;
    var s=document.createElement('script');
    s.src=src+'?v=phase6a';
    s.defer=true;
    document.head.appendChild(s);
  }
  addScript('/assets/govo-phase6a-inventory-renderer.js');
})();

/* GOVO Phase 6B server API/admin panel loader */
(function(){
  var src='/assets/govo-phase6b-admin-api.js';
  if(document.querySelector('script[src^="'+src+'"]')) return;
  var s=document.createElement('script');
  s.src=src+'?v=phase6b';
  s.defer=true;
  document.head.appendChild(s);
})();

