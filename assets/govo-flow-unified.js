/* GOVO old classic UI restore loader */
(function(){
  var css='/assets/govo-old-classic-ui.css';
  var js='/assets/govo-old-classic-ui.js';
  var v='oldclassic';
  if(!document.querySelector('link[href^="'+css+'"]')){
    var l=document.createElement('link');
    l.rel='stylesheet';
    l.href=css+'?v='+v;
    document.head.appendChild(l);
  }
  if(!document.querySelector('script[src^="'+js+'"]')){
    var s=document.createElement('script');
    s.src=js+'?v='+v;
    s.defer=true;
    document.head.appendChild(s);
  }
})();
