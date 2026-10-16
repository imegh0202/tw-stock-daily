# 📊 台股每日觀察｜投資日報戰情室

使用 GitHub Pages 免費展示台股盤後日報。**首頁是永久儀表板**，完整日報依日期保存獨立 HTML，歷史清單與統計依 JSON 自動顯示。

## 公開閱讀

- **[固定入口｜台股日報戰情室](https://imegh0202.github.io/tw-stock-daily/)**
- [歷史日報查詢](https://imegh0202.github.io/tw-stock-daily/archive.html)
- [投資理財知識庫（八章與術語速查）](https://imegh0202.github.io/tw-stock-daily/guide.html)
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

## 每日更新規則

1. ChatGPT「台股日報｜GitHub HTML」平日台灣時間約 17:00 執行（排程為彈性執行，週末目前沒有啟用）。
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

- **整站最小字級為 14px**：首頁、歷史日報、投資知識庫及每天新產生的報告皆須遵守。小標籤、表格、卡片說明、按鈕、頁腳與手機版也不可小於 14px。
- 一般閱讀內文建議使用 **16px**，章節標題依層級使用更大的字級。
- 修改排版時優先透過 `assets/dashboard.css`、`assets/guide.css`、`assets/style.css` 管理字級，不要在新的 HTML／JS 中寫入小於 14px 的 inline `font-size`。
- 兼顧桌機和手機閱讀：字體變大後，卡片、表格和導覽要適度換行或允許橫向捲動，避免文字被遮住。

## Portal 視覺設計系統（2026-10-16）

以 Notion `HTML_Specification` 的 Research Dashboard 風格為參考，適用於**整個 Portal、知識庫與每日新生成的報告**；這是長頁式網站，**不採 16:9 投影片／固定頁碼功能**。

- **品牌主色**：`#F6C543`，替代舊紫色；使用在主要按鈕、選中選單、活動焦點和少量強調線條。黃色背景上的文字一律用深色 `#172449`，不得用白色小字。
- **基礎色**：深藍 `#252F60`（標題）、深藍黑 `#172449`（正文）、灰藍 `#586783`（次要資訊）、淺底 `#F5F7FA`、白卡 `#FFFFFF`、分隔線 `#DDE4EF`。
- **功能輔色**：青綠 `#178E83`、冰藍 `#438BBE`、暖橘 `#D88642`；盡量做為卡片頂部細線、圖示與淺色背景，避免大面積飽和填色。
- **風險訊號獨立於品牌色**：高風險紅、風險中等橘、其他狀態青綠；不得把黃色品牌色當成高風險或利空的固定表示。
- **文字與選單**：所有文字最小 `14px`、內文 `16px`、左側主選單／章節連結 `16px`；一般標題至少 `18px`，並允許換行。
- **卡片排版**：常用圓角 `22px`、低對比陰影、內容高度自動；優先 1–3 欄彈性網格與不同功能的淡色卡片，不為對齊製造無意義空白。
- **手機版**：原有手機底部工具列保留，知識庫額外提供水平可滑動章節捷徑。避免縮字解決內容塞不下的問題。
- **深色模式**：遵守背景與字色成對切換，不用白字疊白卡。深底 `#111827`、卡片 `#202B49`、文字 `#F4F7FF`、邊框 `#344462`。
- **報告自動產生流程**：若沿用 `assets/style.css`，即可繼承新的共用配色。新生成的 HTML 不要寫死舊版的紫色、酒紅漸層或小字覆蓋樣式。
- **維護規則**：新增網站 UI 應先選擇功能性色彩、確認 WCAG 對比與手機換行，避免所有卡片一律使用黃色。

## 資料品質與安全

- 優先使用官方原始資料，列出可點擊來源與觀測時間；未查證值留空。
- 金融市場有波動與本金損失風險；本站內容為教育與風險觀察，非投資建議。
- 公開 Repository 僅放 HTML/CSS/JS/JSON，不要保存個人帳密、Token、Webhook 或 `.env`。
- Pages 網站內容公開，不代表試算表也需要公開。

