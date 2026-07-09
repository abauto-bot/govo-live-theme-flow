(function(){
  function cleanBadInsertedBlocks(){
    document.querySelectorAll('.govo-final-os-strip,.govo-final-trust-row').forEach(function(el){
      el.remove();
    });
  }

  function fixText(){
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while(walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(function(n){
      if(!n.nodeValue) return;
      n.nodeValue = n.nodeValue
        .replace(/Premium local delivery & s\.\.\./g, 'Premium local delivery & service OS')
        .replace(/Premium local delivery & servic\.\.\./g, 'Premium local delivery & service OS')
        .replace(/Meherpur-er local service OS/g, 'Meherpur local service OS');
    });
  }

  function run(){
    cleanBadInsertedBlocks();
    fixText();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', run);
  }else{
    run();
  }

  setTimeout(run, 500);
  setTimeout(run, 1300);
})();
