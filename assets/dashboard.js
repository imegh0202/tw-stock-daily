(()=>{
  "use strict";
  const $=id=>document.getElementById(id);
  const fmtDay=s=>String(s||"").replace(/-/g,"/");
  const num=(v,d=2)=>typeof v==="number"&&Number.isFinite(v)?v.toLocaleString("zh-TW",{minimumFractionDigits:d,maximumFractionDigits:d}):"—";
  const set=(id,t)=>{const el=$(id);if(el)el.textContent=t==null?"—":String(t)};
  const badge=(level)=>{const l=String(level||"").toLowerCase();return l==="high"?"red":l==="medium"||l==="mid"?"yellow":l==="low"?"green":"grey"};
  function elm(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=String(txt);return e}
  function safeReportUrl(path){return /^reports\/\d{4}-\d{2}-\d{2}\.html$/.test(String(path||""))?"./"+path:null}
  const dataRoot="./data/";
  async function getJSON(name){const r=await fetch(dataRoot+name,{cache:"no-store"});if(!r.ok)throw new Error(name+" "+r.status);return await r.json()}
  function renderLatest(v,history){
    const date=fmtDay(v.date||history[0]?.date||"");
    const state=v.market_state||history[0]?.market_state||"待分類";
    const level=v.risk_level||history[0]?.risk_level;
    set("latest-date",date);set("last-report",date);set("risk-label",state);set("snapshot-label",date+"｜正式日報");
    set("latest-taiex",num(v.taiex?.close));
    const n=v.taiex?.change_pct;
    const delta=(typeof n==="number"?(n>0?"+":"")+n.toFixed(2)+"%":"待確認");
    set("latest-change",delta);
    $("latest-change")?.classList.toggle("up",typeof n==="number"&&n>0);
    const badgeEl=$("latest-risk");
    if(badgeEl){badgeEl.className="pill "+badge(level);badgeEl.textContent=state}
    const h=history.find(x=>x.date===v.date)||history[0];
    const href=safeReportUrl(h?.url)|| (v.date?"./reports/"+v.date+".html":"./archive.html");
    ["latest-report-link","top-latest-link","aside-latest-link"].forEach(id=>{const a=$(id);if(a)a.href=href});
    set("data-asof",v.as_of?String(v.as_of).replace("T"," ").slice(0,16):"待核對");
    const snippets=Array.isArray(v.risks)?v.risks:[];
    const box=$("risk-list");if(box){box.replaceChildren();if(!snippets.length){box.append(elm("p","empty","尚無今日風險摘要，請閱讀完整日報。"))}
      snippets.slice(0,4).forEach(s=>{const li=elm("li"),dot=elm("span","bullet"),content=elm("span",null,s);li.append(dot,content);box.append(li)})}
    const events=Array.isArray(v.events)?v.events:[],container=$("event-list");
    if(container){container.replaceChildren();if(!events.length)container.append(elm("p","empty","尚無事件資料，日後由每日報告更新。"));
      events.slice(0,4).forEach(e=>{
        const card=elm("div","event"),hdr=elm("div","event-header"),
          dt=elm("span",null,fmtDay(e.date)||"待確認"),
          priority=elm("span","event-priority "+(e.importance||"low"),e.importance==="high"?"● 高":e.importance==="medium"?"● 中":"● 低");
        hdr.append(dt,priority);
        card.append(hdr,elm("h3",null,e.event||"待確認"),elm("div","small-label",e.time_status?"時間待確認":"未來觀察事件"));container.append(card)
      })}
    set("event-count",events.length+" 項事件");
    const prog=$("event-progress");if(prog)prog.style.width=Math.min(100,events.length*25)+"%";
  }
  function renderHistory(history,filter=""){
    const records=$("records");if(!records)return;
    records.replaceChildren();
    const q=String(filter).trim().toLowerCase();
    const shown=history.filter(r=>(r.date+" "+r.title+" "+r.market_state).toLowerCase().includes(q)).slice(0,8);
    if(!shown.length){records.append(elm("p","empty",history.length?"沒有符合條件的日報。":"尚無歷史報告。"));return}
    shown.forEach(r=>{
      const line=elm("div","record"),date=elm("div","record-date",fmtDay(r.date).slice(5)),content=elm("div");
      content.append(elm("h3",null,r.title||fmtDay(r.date)));
      const p=elm("p",null,r.market_state||"市場狀態待確認");
      content.append(p);
      const a=elm("a",null,"查看報告 ↗");a.href=safeReportUrl(r.url)||"./archive.html";
      line.append(date,content,a);records.append(line);
    })
  }
  function renderCounts(history){
    set("total-count",String(history.length));set("donut-total",String(history.length));set("all-count",history.length+" 篇");
    const parts=new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit"}).formatToParts(new Date());
    const month=parts.find(p=>p.type==="year").value+"-"+parts.find(p=>p.type==="month").value;
    const monthCount=history.filter(x=>(x.date||"").startsWith(month)).length;
    set("month-count",String(monthCount));set("month-count-foot",monthCount+" 篇 / 共 "+history.length+" 篇");
    const p=history.length?Math.round(monthCount/history.length*100):0;
    const bar=$("month-progress");if(bar)bar.style.width=p+"%";
    const high=history.filter(x=>x.risk_level==="high").length,
      mid=history.filter(x=>x.risk_level==="medium"||x.risk_level==="mid").length,
      other=history.length-high-mid;
    set("high-count",String(high));set("mid-count",String(mid));set("other-count",String(other));
    const total=history.length||1;
    const pctH=high/total*100,pctM=mid/total*100;
    const donut=$("donut");
    if(donut)donut.style.background=history.length?
      "conic-gradient(#6248e7 0 "+pctH+"%,#83ced9 "+pctH+"% "+(pctH+pctM)+"%,#b9e8cf "+(pctH+pctM)+"% 100%)":
      "conic-gradient(#e7e9f0 0 100%)";
  }
  async function init(){
    try{
      const [latest,raw]=await Promise.all([getJSON("latest.json"),getJSON("history.json")]);
      if(!Array.isArray(raw))throw new Error("history.json format");
      const history=raw.filter(x=>x&&/^\d{4}-\d{2}-\d{2}$/.test(x.date)).sort((a,b)=>b.date.localeCompare(a.date));
      renderCounts(history);renderLatest(latest||{},history);renderHistory(history);
      $("search-report")?.addEventListener("input",e=>renderHistory(history,e.target.value));
      set("feed-status","資料已同步");const d=$("status-dot");if(d)d.classList.remove("warn");
    }catch(err){
      console.error("台股日報載入失敗",err);
      set("feed-status","資料載入失敗");
      set("latest-taiex","待載入");
      const box=$("records");if(box)box.append(elm("p","empty","目前無法載入最新索引，請前往歷史日報頁查看。"));
    }
  }
  init();
})();