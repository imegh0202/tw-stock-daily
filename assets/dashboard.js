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
    ["latest-report-link"].forEach(id=>{const a=$(id);if(a)a.href=href});
    set("data-asof",v.as_of?String(v.as_of).replace("T"," ").slice(0,16):"待核對");
    const snippets=Array.isArray(v.risks)?v.risks:[];
    const box=$("risk-list");if(box){box.replaceChildren();if(!snippets.length){box.append(elm("li","empty","尚無今日風險摘要，請閱讀完整日報。"))}
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
  }
  function renderHistory(history,filter=""){
    const records=$("records");if(!records)return;
    records.replaceChildren();
    // 日期索引應包含最新一篇；最新報告在上方卡片突出顯示，在這裡則按日期完整列出。
    const q=String(filter).trim().toLowerCase();
    const shown=history.filter(r=>(r.date+" "+r.title+" "+r.market_state).toLowerCase().includes(q)).slice(0,8);
    if(!shown.length){
      records.append(elm("p","empty",q?"沒有符合條件的日報紀錄。":"尚無日報紀錄。"));
      return;
    }
    shown.forEach(r=>{
      const href=safeReportUrl(r.url);
      if(!href)return;
      const newest=r.date===history[0]?.date;
      const line=elm("a","record"+(newest?" record-latest":""));
      line.href=href;
      line.setAttribute("aria-label","閱讀 "+(r.title||fmtDay(r.date))+" 完整報告");
      const date=elm("span","record-date",fmtDay(r.date).slice(5));
      const content=elm("span","record-detail");
      const heading=elm("span","record-heading");
      heading.append(elm("strong","record-title",r.title||fmtDay(r.date)));
      if(newest)heading.append(elm("span","record-latest-tag","最新"));
      content.append(heading);
      content.append(elm("span","record-status",r.market_state||"市場狀態待確認"));
      line.append(date,content,elm("span","record-arrow","↗"));
      records.append(line);
    });
  }
  function renderCounts(history){
    set("total-count",String(history.length));set("donut-total",String(history.length));
    const parts=new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit"}).formatToParts(new Date());
    const month=parts.find(p=>p.type==="year").value+"-"+parts.find(p=>p.type==="month").value;
    const monthCount=history.filter(x=>(x.date||"").startsWith(month)).length;
    set("month-count",String(monthCount));set("month-count-foot",monthCount+" 篇 / 共 "+history.length+" 篇");
    const high=history.filter(x=>x.risk_level==="high").length,
      mid=history.filter(x=>x.risk_level==="medium"||x.risk_level==="mid").length,
      other=history.length-high-mid;
    set("high-count",String(high));set("mid-count",String(mid));set("other-count",String(other));
    const total=history.length||1;
    const pctH=high/total*100,pctM=mid/total*100;
    const donut=$("donut");
    if(donut)donut.style.background=history.length?
      "conic-gradient(var(--risk-high) 0 "+pctH+"%,var(--risk-mid) "+pctH+"% "+(pctH+pctM)+"%,var(--risk-other) "+(pctH+pctM)+"% 100%)":
      "conic-gradient(#e7e9f0 0 100%)";
  }
  function setupSheetShortcut(){
    const key="tw-stock-daily-sheet-url";
    const form=$("sheet-settings"),input=$("sheet-link-input"),open=$("sheet-open"),state=$("sheet-state"),setupBtn=$("sheet-setup"),save=$("sheet-save"),clear=$("sheet-clear"),message=$("sheet-message");
    if(!form||!input||!open||!state||!setupBtn||!save||!clear)return;
    const valid=(value)=>/^https:\/\/docs\.google\.com\/spreadsheets\/d\/[A-Za-z0-9_-]+(?:\/[^\s]*)?$/.test(value);
    let url="";try{url=localStorage.getItem(key)||""}catch(_){}
    function update(){
      if(url&&valid(url)){open.href=url;open.hidden=false;state.textContent="已在此裝置儲存連結"}else{open.removeAttribute("href");open.hidden=true;state.textContent="尚未在此裝置儲存連結"}
      input.value=url&&valid(url)?url:"";
    }
    setupBtn.addEventListener("click",()=>{form.hidden=!form.hidden;setupBtn.setAttribute("aria-expanded",String(!form.hidden));if(!form.hidden)input.focus()});
    save.addEventListener("click",()=>{
      const val=input.value.trim();
      if(!valid(val)){message.textContent="請貼上有效的 Google Sheets 連結，網址需以 https://docs.google.com/spreadsheets/d/ 開頭。";return}
      try{localStorage.setItem(key,val);url=val;message.textContent="已儲存在這個瀏覽器，沒有上傳到 GitHub。";update()}catch(_){message.textContent="瀏覽器不允許儲存，請確認未封鎖網站資料。"}
    });
    clear.addEventListener("click",()=>{try{localStorage.removeItem(key)}catch(_){}url="";message.textContent="已清除此瀏覽器的試算表連結。";update()});
    update();
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
      console.error("市場紀錄載入失敗",err);
      set("feed-status","資料載入失敗");
      set("latest-taiex","待載入");
      const box=$("records");if(box)box.append(elm("p","empty","目前無法載入最新索引，請前往歷史日報頁查看。"));
    }
  }
  setupSheetShortcut();
  init();
})();