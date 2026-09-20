# 網站品質與速度優化紀錄

日期：2026-09-20。保留 Next.js 15.3.8；本文件記錄部署前的本機修改與正式版驗證結果，發布狀態以 Git commit 與 Vercel 部署紀錄為準。

## 實測結果

首頁使用 Lighthouse 13.5.0 的手機預設模擬條件：412 × 823、150 ms RTT、1,638.4 Kbps、CPU 4 倍降速。優化前後各以獨立 Chrome 執行三次，採中位數；兩者均為 `next build` 後的 `next start`，不是開發模式。

| 首頁指標 | 優化前 | 優化後 |
| --- | ---: | ---: |
| Performance | 56 | 97 |
| FCP | 9.16 秒 | 1.11 秒 |
| LCP | 10.06 秒 | 2.36 秒 |
| TBT | 2 ms | 100.5 ms |
| CLS | 0 | 0 |
| 傳輸量 | 2,199,344 bytes | 458,228 bytes |
| Accessibility | 100 | 100 |
| SEO | 100 | 100 |

LCP 約縮短 77%，傳輸量減少約 79%。最終三次 LCP 為 2.12、2.58、2.36 秒，效能分數為 99、96、97。TBT 較基準上升，仍低於 200 ms；未以總分掩蓋這項差異。沒有取得真實使用者的 CrUX／INP 資料，以上不是正式站訪客的實際速度保證。

`/blog/hamster-bar-biting` 另做單次診斷，優化前後 Performance 為 57 → 99，LCP 為 10.22 → 2.18 秒，最終 Accessibility／SEO 均為 100、CLS 為 0。文章結果不是三次中位數。

原始 JSON 位於本機忽略追蹤的 `artifacts/quality/`：

- `home-before-{1,2,3}.json`：開始時的網站副本。
- `home-native-{1,2,3}.json`：最終版本。
- `article-before.json`、`article-native.json`：文章單次診斷。
- 其餘 `after`／`final` 檔案為中途字體方案測試，不作為最終數字。

前後均收錄 138 間醫院。基準保留工作開始時的資料副本，最終版也保留工作期間其他醫院資料編修，因此不是逐位元相同的內容快照。外部 Analytics、地圖圖磚和廣告服務可能造成測試波動；手機首頁的地圖與廣告延後到需要時載入，表格不包含打開地圖後的累計流量。

## 速度調整

- 移除網頁中文字體下載與 Google Font 建置依賴。優先使用裝置已有的 Noto Sans TC，再退回 PingFang TC、Microsoft JhengHei、系統無襯線字體。原本字體流量約 1.19 MB，現在為 0；不同裝置的字形會略有差異。
- 手機先顯示醫院清單，切換地圖時才載入 Leaflet；桌面維持並排地圖。
- 醫院詳情與公告抽屜按需載入，並提供載入提示、失敗重試與過期請求保護。
- 廣告接近可見範圍才載入腳本，維持版位最低高度。
- 現有文章圖片改用具有尺寸資訊的 `next/image`，保留圖卡原比例，移除文章重複封面；小型寵物圖示提供正確 `sizes`。
- 文章改為建置時預先產生，設定 5 分鐘重新驗證。新增 MDX 檔仍需正常建置／部署。

Next.js 已能提供伺服器 HTML、靜態文章與按需載入的互動元件。這次量測確認主要負擔來自字體及首屏載入內容，因此沒有為了速度重寫成 Astro。[Next.js Server and Client Components](https://nextjs.org/docs/15/app/getting-started/server-and-client-components)、[Astro islands](https://docs.astro.build/en/concepts/islands/)。

## 介面與文字

保留森林綠、淺綠底與寵物插圖，以查詢為首頁重點。整理搜尋區層次、常用物種快捷鍵、手機清單／地圖切換、醫院卡片、文章標題與目錄。主要控制項至少 44 px，補上鍵盤焦點與跳到主要內容連結；手機選單支援 Escape。

依 Humanizer-zh-TW 原則改寫首頁、搜尋提示、空結果、頁尾及文章列表文案，使用自然的台灣繁體中文，說明下一步操作。醫院資料、文章中的醫療敘述及來源不在本次改寫範圍。

## SEO 與分享網址

- 補完整首頁、文章列表與文章的標題、摘要、canonical、Open Graph／Twitter 資訊。
- 部署核對 GitHub 設定與實際網站後，SEO 網址統一為 `https://paw-map.vercel.app`，修正原先指向不存在網域的 canonical 與 sitemap。
- 文章加入 BreadcrumbList、內部延伸閱讀與對應標題的目錄錨點；JSON-LD 統一安全序列化。
- 讀取文章時統一換行格式，確保 Git 版本中的 Windows 換行不會影響段落與目錄解析。
- 移除不正確的 SearchAction。網址支援縣市、物種及掛號／營業／急診條件，重新開啟分享網址可還原搜尋。
- 嵌入模式回傳 `noindex, follow`，robots.txt 允許爬取，讓搜尋引擎讀到 noindex。[Google robots meta tag](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)。
- sitemap 使用實際資料修改日期，文章列表取所有文章的最新修改日，不使用請求當下時間。[Google sitemap 更新時間建議](https://developers.google.com/search/blog/2014/10/best-practices-for-xml-sitemaps-rssatom)。

SEO 100 是 Lighthouse 的自動檢查分數，優化前也是 100，不代表排名或收錄已提升。

## 驗證與重跑

- `npm run build`：通過，包含 TypeScript 型別檢查。
- `npm run lint`：通過，修復原本無法使用的 lint 指令。
- `npm run check:site`：44 項正式版 HTTP 回應檢查通過；涵蓋 canonical、schema、篩選、嵌入 noindex、文章、404、robots 與 sitemap。
- 瀏覽器確認：縣市＋兔搜尋、結果網址、清除與空結果、地圖標記及醫院詳情、最新公告抽屜、手機選單與 Escape、文章目錄錨點。
- 窄手機、一般手機與桌面檢查無水平溢出；Chrome 的實際 CSS 寬度與 viewport 設定因宿主縮放略有差異，以頁面量到的寬度為準。
- 桌面正式版預覽未觀察到 console error／warning。

重跑：先 `npm run build`，再 `npm run start -- -p 3000`，另開終端執行 `npm run check:site`。其他網址可用 `npm run check:site -- https://example.com`，不會寫入醫院資料。

Lighthouse 指令：

```powershell
npm exec --yes --package=lighthouse -- lighthouse http://127.0.0.1:3000 --output=json --output-path="artifacts/quality/home-check.json" --only-categories=performance,accessibility,seo --chrome-flags="--headless --no-first-run" --quiet
```

部署後再以正式網址確認 CDN、圖片處理與真實使用者 Core Web Vitals。這次優化未更改廣告／Analytics 帳號設定。
