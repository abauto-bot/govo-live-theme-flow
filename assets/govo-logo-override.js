(function(){
  var icon = '/assets/govo-logo-icon.svg?v=goConceptFinal';
  var full = '/assets/govo-final-logo.svg?v=goConceptFinal';

  function setFavicon(){
    document.querySelectorAll('link[rel="icon"],link[rel="shortcut icon"],link[rel="apple-touch-icon"]').forEach(x=>x.remove());
    var l=document.createElement('link');
    l.rel='icon';
    l.type='image/svg+xml';
    l.href=icon;
    document.head.appendChild(l);
  }

  function replaceLogoImages(){
    document.querySelectorAll('img').forEach(function(img){
      var src=(img.getAttribute('src')||'').toLowerCase();
      var alt=(img.getAttribute('alt')||'').toLowerCase();
      var cls=(img.className||'').toString().toLowerCase();

      if(src.includes('govo') || src.includes('logo') || alt.includes('govo') || alt.includes('logo') || cls.includes('logo')){
        img.src = icon;
        img.alt = 'GOVO Express';
        img.classList.add('govo-logo-override-img');
      }
    });
  }

  function replaceLogoBoxes(){
    var selectors = [
      '.govo-old-logo',
      '.g8-logo',
      '.govo-phase7-logo',
      '.govo-final-footer-mark',
      '[class*="logo"]'
    ];

    selectors.forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(box){
        if(box.dataset.govoGoLogoDone === '1') return;

        var txt=(box.textContent||'').trim();
        var hasImg=box.querySelector('img');
        var hasSvg=box.querySelector('svg');
        var rect=box.getBoundingClientRect();
        var likelyLogo = txt === 'G' || txt === 'C' || txt.length <= 3 || hasImg || hasSvg || rect.width <= 140;

        if(likelyLogo){
          box.innerHTML = '<img class="govo-logo-override-img" src="'+icon+'" alt="GOVO Express">';
          box.dataset.govoGoLogoDone = '1';
        }
      });
    });
  }

  function addFullLogoData(){
    window.GOVO_FINAL_FULL_LOGO = full;
    window.GOVO_FINAL_ICON_LOGO = icon;
  }

  function run(){
    setFavicon();
    replaceLogoImages();
    replaceLogoBoxes();
    addFullLogoData();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();

  setTimeout(run, 700);
  setTimeout(run, 1600);
})();
