(()=>{"use strict";
const key="tw-stock-daily-theme";
let saved=null;
try{saved=localStorage.getItem(key)}catch(_){}
const media=window.matchMedia?.("(prefers-color-scheme: dark)");
let mode=(saved==="light"||saved==="dark")?saved:(media?.matches?"dark":"light");
function apply(next,save){
 mode=next;
 document.documentElement.dataset.theme=mode;
 document.documentElement.style.colorScheme=mode;
 const meta=document.querySelector('meta[name="theme-color"]');
 if(meta)meta.content=mode==="dark"?"#101522":"#f3f5f8";
 if(save)try{localStorage.setItem(key,mode)}catch(_){}
 document.querySelectorAll("[data-theme-toggle]").forEach(btn=>{
  const nextMode=mode==="dark"?"淺色":"深色";
  btn.setAttribute("aria-label","切換為"+nextMode+"模式");
  btn.setAttribute("title","切換為"+nextMode+"模式");
  btn.setAttribute("aria-pressed",mode==="dark"?"true":"false");
  const icon=btn.querySelector(".theme-icon");
  const label=btn.querySelector(".theme-label");
  if(icon)icon.textContent=mode==="dark"?"☀":"☾";
  if(label)label.textContent=nextMode;
 });
}
apply(mode,false);
document.addEventListener("DOMContentLoaded",()=>{
 apply(mode,false);
 document.querySelectorAll("[data-theme-toggle]").forEach(btn=>{
  btn.addEventListener("click",()=>apply(mode==="dark"?"light":"dark",true));
 });
});
if(media?.addEventListener)media.addEventListener("change",e=>{
 let pref=null;try{pref=localStorage.getItem(key)}catch(_){}
 if(pref!=="dark"&&pref!=="light")apply(e.matches?"dark":"light",false);
});
})();
