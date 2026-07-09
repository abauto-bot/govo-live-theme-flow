(function(){
  const logoIcon = '/assets/govo-logo-icon.svg?v=newgo';
  const fullLogo = '/assets/govo-final-logo.svg?v=newgo';

  function replaceImages(){
    document.querySelectorAll('img').forEach(img=>{
      const src = (img.getAttribute('src') || '').toLowerCase();
      const alt = (img.getAttribute('alt') || '').toLowerCase();

      if(src.includes('govo') || src.includes('logo') || alt.includes('govo') || alt.includes('logo')){
        img.src = logoIcon;
        img.classList.add('govo-logo-override-img');
      }
    });
  }

  function replaceTextLogoBoxes(){
    const selectors = [
      '.govo-old-logo',
      '.g8-logo',
      '.govo-phase7-logo',
      '[class*="logo"]'
    ];

    selectors.forEach(sel=>{
      document.querySelectorAll(sel).forEach(box=>{
        const txt = (box.textContent || '').trim();
        const hasImg = box.querySelector('img,svg');
        if((txt === 'G' || txt === 'C' || txt.length <= 2) && !box.dataset.govoLogoDone){
          box.innerHTML = '<img class="govo-logo-override-img" src="'+logoIcon+'" alt="GOVO Express">';
          box.dataset.govoLogoDone = '1';
        }else if(hasImg && !box.dataset.govoLogoDone){
          box.innerHTML = '<img class="govo-logo-override-img" src="'+logoIcon+'" alt="GOVO Express">';
          box.dataset.govoLogoDone = '1';
        }
      });
    });
  }

  function run(){
    replaceImages();
    replaceTextLogoBoxes();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', run);
  }else{
    run();
  }

  setTimeout(run, 700);
  setTimeout(run, 1600);
})();
