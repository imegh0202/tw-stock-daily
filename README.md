# 台股每日觀察

由 ChatGPT 每個交易日盤後整理台股市場資料，產生固定版型 HTML 日報並保存歷史紀錄。

## 結構

- `index.html`：最新日報
- `reports/YYYY-MM-DD.html`：每日歷史日報
- `data/YYYY-MM-DD.json`：每日結構化資料
- `data/latest.json`：最新一日結構化資料
- `assets/style.css`：共用版型

## GitHub Pages

建議使用 GitHub Pages 發布 `main` 分支根目錄。啟用後固定入口為：

`https://imegh0202.github.io/tw-stock-daily/`

> 本網站內容為市場資料整理與風險觀察，不構成投資建議。
