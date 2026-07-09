/* GOVO unified loader — Phase 8 single UI cleanup */
(function(){
  var css='/assets/govo-phase8-single-ui.css';
  var js='/assets/govo-phase8-single-ui.js';
  var v='phase8single';

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
