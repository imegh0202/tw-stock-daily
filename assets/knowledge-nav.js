(()=>{"use strict";
const links=[...document.querySelectorAll("a[data-kb-section]")];
const mobile=[...document.querySelectorAll(".kb-mobile-nav a[href^='#']")];
const entries=links.map(link=>({link,id:link.dataset.kbSection,section:document.getElementById(link.dataset.kbSection)}))
  .filter(entry=>entry.section);
if(!entries.length)return;
let selected=location.hash.slice(1),lockUntil=0,pending=false;
function setActive(id){
 selected=id;
 for(const e of entries){
   const active=e.id===id;
   e.link.classList.toggle("is-current",active);
   if(active)e.link.setAttribute("aria-current","location");
   else e.link.removeAttribute("aria-current");
 }
 for(const a of mobile){
   const active=a.getAttribute("href")==="#"+id;
   if(active)a.setAttribute("aria-current","location");
   else a.removeAttribute("aria-current");
 }
}
function update(){
 pending=false;
 if(performance.now()<lockUntil)return;
 const top=Math.max(112,innerHeight*.25);
 let active=null;
 for(const e of entries)if(e.section.getBoundingClientRect().top<=top)active=e;
 if(!active&&entries[0].section.getBoundingClientRect().top>top){
   setActive("");return;
 }
 if(innerHeight+scrollY>=document.documentElement.scrollHeight-10)active=entries[entries.length-1];
 setActive(active?.id||"");
}
function schedule(){if(!pending){pending=true;requestAnimationFrame(update);}}
for(const entry of entries)entry.link.addEventListener("click",()=>{
 setActive(entry.id);lockUntil=performance.now()+800;schedule();
});
for(const a of mobile)a.addEventListener("click",()=>{
 const id=a.getAttribute("href").slice(1);
 if(entries.some(e=>e.id===id)){setActive(id);lockUntil=performance.now()+800;schedule();}
});
addEventListener("scroll",schedule,{passive:true});
addEventListener("resize",schedule);
addEventListener("hashchange",()=>{
 const id=location.hash.slice(1);
 if(entries.some(e=>e.id===id)){setActive(id);lockUntil=performance.now()+800;}
 else schedule();
});
if(entries.some(e=>e.id===selected))setActive(selected);
else setActive("");
schedule();
})();
