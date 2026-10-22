(()=>{"use strict";
  // A single dashboard row can contain multiple anchor sections (history/events,
  // risks/system). The chosen link must not be replaced by a sibling at the same Y.
  const entries=[...document.querySelectorAll(".portal-aside-links a[data-nav-section]")]
    .map(link=>({link,id:link.dataset.navSection,section:document.getElementById(link.dataset.navSection)}))
    .filter(x=>x.section);
  if(!entries.length)return;
  const byId=new Map(entries.map(e=>[e.id,e]));
  let selectedId=byId.has(location.hash.slice(1))?location.hash.slice(1):entries[0].id;
  let pending=false;
  let clickedUntil=0;
  const groupKey=e=>Math.round(e.section.getBoundingClientRect().top+window.scrollY);
  function setActive(id){
    selectedId=id;
    for(const e of entries){
      const active=e.id===id;
      e.link.classList.toggle("is-current",active);
      if(active)e.link.setAttribute("aria-current","location");
      else e.link.removeAttribute("aria-current");
    }
  }
  function update(){
    pending=false;
    const threshold=Math.max(110,window.innerHeight*.28);
    let visible=entries[0];
    // Find the bottom-most row whose top has reached the viewing threshold.
    // Use strict > so the first entry in a same-row pair wins by default.
    let bestTop=-Infinity;
    for(const e of entries){
      const t=e.section.getBoundingClientRect().top;
      if(t<=threshold&&t>bestTop+5){bestTop=t;visible=e;}
    }
    const atBottom=window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-12;
    if(atBottom)visible=entries[entries.length-1];
    const selected=byId.get(selectedId);
    // User explicitly picked a card in a shared row: keep it selected while
    // that row remains the current section (including smooth scrolling).
    const sameRow=selected&&Math.abs(groupKey(selected)-groupKey(visible))<=5;
    if(!atBottom&&sameRow){setActive(selectedId);return;}
    if(performance.now()<clickedUntil&&!atBottom){return;}
    setActive(visible.id);
  }
  function schedule(){
    if(!pending){pending=true;requestAnimationFrame(update);}
  }
  for(const e of entries){
    e.link.addEventListener("click",()=>{
      setActive(e.id);
      clickedUntil=performance.now()+850;
      schedule();
    });
  }
  addEventListener("scroll",schedule,{passive:true});
  addEventListener("resize",schedule);
  addEventListener("hashchange",()=>{
    const id=location.hash.slice(1);
    if(byId.has(id)){setActive(id);clickedUntil=performance.now()+850;}
    schedule();
  });
  setActive(selectedId);
  schedule();
})();
