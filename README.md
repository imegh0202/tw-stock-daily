# 📊 Market Journal｜市場觀察紀錄

使用 GitHub Pages 免費展示市場盤後紀錄。**首頁是永久儀表板**，完整日報依日期保存獨立 HTML，歷史清單與統計依 JSON 自動顯示。

## 公開閱讀

- **[固定入口｜市場觀察首頁](https://imegh0202.github.io/tw-stock-daily/)**
- [歷史日報查詢](https://imegh0202.github.io/tw-stock-daily/archive.html)
- [投資理財知識庫（八章、做多做空教學、術語速查）](https://imegh0202.github.io/tw-stock-daily/guide.html)
- [原始碼 Repository](https://github.com/imegh0202/tw-stock-daily)

## 目前檔案

```text
index.html               # 固定入口儀表板，排程不可覆寫
archive.html             # 獨立歷史日報搜尋頁
guide.html               # 投資理財知識庫（8 章 + 術語速查）
assets/guide.css         # 知識庫響應式樣式
assets/dashboard.css     # 入口網站（參考使用者提供的儀表板截圖）樣式
assets/dashboard.js      # 從 JSON 動態載入風險圖表、連結與日報清單
assets/style.css         # 每日完整報告共用 CSS
reports/YYYY-MM-DD.html  # 每日獨立報告
data/YYYY-MM-DD.json     # 每日結構化資料
data/latest.json         # 最新日報，入口首頁使用
data/history.json        # 歷史清單（date 去重），首頁與 archive 都會讀取
```

## 投資觀念專題

- `guide.html#long-short-basics`：看多／做多、看空不做空、空單、反手做空、融券放空與期貨差異；包含概念流程、假設價差與風險提醒。
- `guide.html#long-short-examples`：多空實際情境練習，整理平掉多單 vs. 反手做空、未實現 vs. 已實現損益、停損跳空、停損市價 vs. 停損限價，以及三道可展開答案的測驗。所有金額均屬純假設教學，不代表台股可單日跳漲 20%。
- 此專題為固定教育內容，不參與每日行情排程的 JSON 更新；修改時保留左側章節連結、手機導覽、最小 14px 字級及 `#F6C543` 視覺風格。

## 每日更新規則

1. ChatGPT「每日市場觀察｜HTML」平日台灣時間約 17:00 執行（排程為彈性執行，週末目前沒有啟用）。
2. 查證收盤資料、法人、匯率、主要事件，產生 `reports/YYYY-MM-DD.html` 和當日 JSON。
3. 更新 `data/latest.json` 和 `data/history.json`，保留所有已建立的歷史檔案。
4. **不要更新 `index.html`**：首頁 JavaScript 會在載入時讀取 JSON，立即展示最新日報。
5. 使用者只需要收到固定入口網站網址。

> GitHub 連線可以手動寫入，但每日排程是否能成功使用該連線，仍需等首次排程實際執行驗證。不要把「排程已設定」等同於「自動化已驗證」。

## Google Sheets（GAS 稍後設定）

- Google 試算表 `tw-stock-daily` 已建立「日報索引」欄位，包含日期、星期、報告標題、HTML/JSON 網址、市場狀態、風險等級、指數、漲跌幅、成交值、外資、匯率、發布狀態、同步時間、備註。
- GAS **尚未啟用**。未來建議由 Apps Script 定時讀取 `data/history.json` 與各日 `data/YYYY-MM-DD.json`，按照日期去重並更新試算表；不必新增任何付費後端。
- **不要將私人 Google Sheets 編輯權限或公開編輯連結嵌入 Public 網站。** 請將 Google Sheets 分享權限設定為「限制存取」或至少改成僅檢視。

## 字體與可讀性規範

- **整站最小字級為 12px**：任何可見文字（含首頁、歷史日報、知識庫、日報與手機版）皆不可低於 12px。12px 僅作低優先級標籤、資料來源或簡短註記；一般內容仍以 16px 以上為基準，避免一律縮小。
- 一般閱讀內文建議使用 **16px**，章節標題依層級使用更大的字級。
- 修改排版時優先透過 `assets/dashboard.css`、`assets/guide.css`、`assets/style.css` 管理字級，不要在新的 HTML／JS 中寫入小於 12px 的 inline `font-size`。
- 兼顧桌機和手機閱讀：字體變大後，卡片、表格和導覽要適度換行或允許橫向捲動，避免文字被遮住。

## Portal 視覺設計系統（2026-10-16）

以 Notion `HTML_Specification` 的 Research Dashboard 風格為參考，適用於**整個 Portal、知識庫與每日新生成的報告**；這是長頁式網站，**不採 16:9 投影片／固定頁碼功能**。

- **品牌主色**：`#F6C543`，替代舊紫色；使用在主要按鈕、選中選單、活動焦點和少量強調線條。黃色背景上的文字一律用深色 `#172449`，不得用白色小字。
- **基礎色**：深藍 `#252F60`（標題）、深藍黑 `#172449`（正文）、灰藍 `#586783`（次要資訊）、淺底 `#F5F7FA`、白卡 `#FFFFFF`、分隔線 `#DDE4EF`。
- **功能輔色**：青綠 `#178E83`、冰藍 `#438BBE`、暖橘 `#D88642`；盡量做為卡片頂部細線、圖示與淺色背景，避免大面積飽和填色。
- **風險訊號獨立於品牌色**：高風險紅、風險中等橘、其他狀態青綠；不得把黃色品牌色當成高風險或利空的固定表示。
- **文字與選單**：所有文字最小 `12px`（僅次要標籤使用）、內文建議 `16px`、左側主選單／章節連結建議 `14–16px`；一般標題至少 `18px`，並允許換行。
- **卡片排版**：統一主卡片圓角 `12px`、次級卡片 `10px`、控制項 `8px`；圓形圖例、膠囊型標籤例外。保持低對比陰影、高度自適應，優先 1–3 欄彈性網格，避免過度圓角與無意義留白。
- **手機版**：原有手機底部工具列保留，知識庫額外提供水平可滑動章節捷徑。避免縮字解決內容塞不下的問題。
- **深色模式**：遵守背景與字色成對切換，不用白字疊白卡。深底 `#111827`、卡片 `#202B49`、文字 `#F4F7FF`、邊框 `#344462`。
- **報告自動產生流程**：若沿用 `assets/style.css`，即可繼承新的共用配色。新生成的 HTML 不要寫死舊版的紫色、酒紅漸層或小字覆蓋樣式。
- **維護規則**：新增網站 UI 應先選擇功能性色彩、確認 WCAG 對比與手機換行，避免所有卡片一律使用黃色。


## Portal 首頁 Impeccable UI 改版（2026-10-21）

- **設計方法**：按 Impeccable 的 Audit、Distill、Layout、Typeset、Polish 思路整理首頁；並未把網站套成 Impeccable 的固定範本或移除現有品牌識別。
- **主畫面優先順序**：最新日報（指數、漲跌、風險標籤、閱讀入口）→ 歷史風險比例 → 近期日報／事件 → 風險摘要／系統資訊 → 管理資源。最新觀察是*存檔*，不可描述成即時行情。
- **新增樣式**：`assets/portal-impeccable.css` 僅由 `index.html` 引入，放在 `assets/dashboard.css` 後。首頁特有的編排及色彩請優先改這份檔案；舊版 CSS 暫時保留相容性。
- **資料綁定**：沿用 `assets/dashboard.js` 讀取 `data/latest.json` 和 `data/history.json`。無須 API Key、付費後端或外部 CSS/JS CDN。
- **品牌與可讀性**：保留主金黃 `#F6C543`、深藍 `#252F60`、深色模式及 12px 最小字級（僅次要標籤使用）；漲跌和市場風險使用語意色，不用品牌黃取代風險分類。
- **手機**：保留底部導覽、搜尋及完整報告入口；提供鍵盤焦點、跳過導覽連結與 reduced-motion 降低動態效果。
- **影響範圍**：此次未修改 `reports/`、`data/`、`guide.html`、`archive.html`、每日排程／HTML 產生方式，後續新增日報不需修改首頁。
- **正式驗收**：仍需在部署後使用真實瀏覽器人工確認 360px、768px、桌機與深淺主題的視覺細節。

## Portal 圓角與字級統一（2026-10-21）

- Notion `HTML_Specification` 的主要卡片 `12px`、次級卡片 `10px`、控制項 `8px` 已與首頁同步；視覺設計優先以這些 token 維護。
- `assets/portal-impeccable.css` 透過 `--portal-radius`／`--portal-radius-secondary`／`--portal-radius-control` 管理首頁圓角；`--portal-font-min:12px` 是下限，並非所有文字都應縮為 12px。
- 正文保留 16px，次級註記可採 12–14px；避免因為縮字導致行距、對比與觸控閱讀體驗下降。按鈕優先維持 44px 可操作高度。
- 本次網站改動集中在首頁樣式與快取版本，並未修改資料、每日報告內容、日報 HTML 模板、排程邏輯。

## Portal 左側 Navbar（2026-10-21）
- 左側導覽以 Impeccable 的 Distill、Layout、Polish 原則重整：桌機與平板（寬度 >700px）均使用有文字的固定左側 Navbar；手機保留底部圖示＋文字導覽。
- 分為「工作台」（市場總覽、日報紀錄、事件追蹤、市場風險）與「資料與工具」（全部歷史日報、投資理財知識庫、管理資源、投資觀察室）兩組。外部私人網站保留原有授權限制。
- 左側僅保留累積日報與最新存檔日期；完整風險分布回到主畫面顯示，避免導覽重複。
- 專用樣式與導覽高亮行為：`assets/portal-sidebar.css`、`assets/portal-sidebar.js`。遵守 12/10/8px 圓角、12px 字體下限及深色模式。
- 沒有改動每日報告、JSON、資料載入及排程邏輯；GitHub Pages 無須新後端。

## 資料品質與安全

- 優先使用官方原始資料，列出可點擊來源與觀測時間；未查證值留空。
- 金融市場有波動與本金損失風險；本站內容為教育與風險觀察，非投資建議。
- 公開 Repository 僅放 HTML/CSS/JS/JSON，不要保存個人帳密、Token、Webhook 或 `.env`。
- Pages 網站內容公開，不代表試算表也需要公開。

