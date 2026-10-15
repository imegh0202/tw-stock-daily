# 📊 台股每日觀察｜GitHub HTML

台股每個交易日盤後的市場觀察日報。**GitHub Pages 是閱讀入口，GitHub Repository 保存完整歷史 HTML 與 JSON。**

## 閱讀網址

- [最新日報（GitHub Pages）](https://imegh0202.github.io/tw-stock-daily/)：需先到 Repository → Settings → Pages 啟用，網址尚待部署確認。
- [歷史日報索引（GitHub Pages）](https://imegh0202.github.io/tw-stock-daily/archive.html)
- [GitHub Repository](https://github.com/imegh0202/tw-stock-daily)

## GitHub Pages 啟用

1. 將 Repository 設為 Public（已完成）。
2. 到 [Settings → Pages](https://github.com/imegh0202/tw-stock-daily/settings/pages)。
3. Source 選 **Deploy from a branch**。
4. Branch 選 `main`，Folder 選 `/(root)`，按 **Save**。
5. 等 GitHub 完成部署，查看 [Actions](https://github.com/imegh0202/tw-stock-daily/actions) 的 Pages 建置紀錄。

> 只修改 Public 不等於啟用 Pages。頁面若持續 404，請先確認 Pages 發布來源與 Actions 建置狀態。

## 資料結構

```text
index.html               # 最新一期完整日報
archive.html             # 歷史日報搜尋頁
reports/YYYY-MM-DD.html  # 每日歷史日報
data/latest.json         # 最新一期結構化資料
data/YYYY-MM-DD.json     # 每日結構化資料
data/history.json        # 歷史索引清單（依日期去重）
assets/style.css         # 全站共用手機版樣式
```

## 每日排程預期流程

1. ChatGPT 排程「台股日報｜GitHub HTML」週一～週五台北時間約 17:00 執行。
2. 查最新行情、法人、正式 USD/TWD、權值股、族群與已確認未來事件。
3. 產生完整的 HTML 日報和當日 JSON，先保存歷史，再更新 `index.html` 與 `data/latest.json`。
4. 更新 `data/history.json`，同日期只記一筆。
5. 回覆當日 HTML 連結。是否收到手機推播或 Email 由 ChatGPT 通知設定決定。

**注意：此排程寫入 GitHub 的流程尚需在下一次排程執行後驗證，不能只依任務設定就認定自動發布已成功。**

## 資料原則

- 日期與資料時點必須清楚。
- 對未取得正式收盤的數字，顯示待確認，而不是拿盤中或舊數字冒充。
- 網頁上應列出實際查證的來源網址。
- 不預測隔日漲跌；未來情境只列基準、轉強與轉弱條件。
- 不寫入 Notion，不使用付費 OpenAI API 產生日報。

內容僅供研究及風險教育，不構成投資建議。
