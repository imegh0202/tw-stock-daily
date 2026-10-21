(()=>{"use strict";
const entries=[...document.querySelectorAll(".portal-aside-links a[data-nav-section]")].map(link=>({link,section:document.getElementById(link.dataset.navSection)})).filter(x=>x.section);
if(!entries.length)return;
let pending=false;
function update(){
 pending=false;
 const threshold=Math.max(120,innerHeight*.28);
 let active=entries[0];
 for(const entry of entries)if(entry.section.getBoundingClientRect().top<=threshold)active=entry;
 if(innerHeight+scrollY>=document.documentElement.scrollHeight-12)active=entries[entries.length-1];
 for(const entry of entries){
  const selected=entry===active;
  entry.link.classList.toggle("is-current",selected);
  if(selected)entry.link.setAttribute("aria-current","location");
  else entry.link.removeAttribute("aria-current");
 }
}
function schedule(){if(!pending){pending=true;requestAnimationFrame(update)}}
addEventListener("scroll",schedule,{passive:true});addEventListener("resize",schedule);addEventListener("hashchange",schedule);schedule();
})();
