# 依 Search Console 查詢詞調整 SEO

## 截圖基準

使用者提供查詢詞、點擊與曝光截圖，未提供日期區間、裝置、國家、平均排名或對應頁面。因此不能只由 CTR 判定標題是低點擊的原因，也不能推算改版後成長幅度。

| 查詢詞 | 點擊 | 曝光 | CTR |
| --- | ---: | ---: | ---: |
| 特寵醫院 | 9 | 727 | 1.24% |
| 特寵動物醫院 | 2 | 87 | 2.30% |
| 特寵急診 | 1 | 32 | 3.13% |
| 全台特寵醫院 | 1 | 16 | 6.25% |
| 基隆特寵醫院 | 1 | 13 | 7.69% |
| 宜蘭特寵醫院 | 1 | 12 | 8.33% |
| 附近特寵醫院 | 1 | 11 | 9.09% |
| 彰化特寵 | 1 | 7 | 14.29% |
| 台北特寵急診 | 1 | 6 | 16.67% |
| 特寵 | 0 | 78 | 0% |

地區詞只有一筆點擊，樣本仍小；本次依明確的找醫院意圖補足頁面，不把這些百分比當作穩定趨勢。

## 已完成

- 首頁標題改為「特寵醫院查詢｜全台名單、看診物種與急診聯絡｜小獸所」，摘要說明物種、位置、電話、門診與預約資訊，H1 與查詢用途一致。
- 新增 `/hospitals` 名單入口及 17 個有資料的縣市頁，包含 `/hospitals/keelung`、`/hospitals/yilan`、`/hospitals/changhua`。沒有資料的縣市不產生空白索引頁。
- 所有 138 間醫院都在對應縣市頁的初始 HTML 出現。這補足手機首頁分批載入及詳情視窗需要互動的限制，也保留既有地圖與篩選功能。
- 縣市頁依行政區列出電話、地址、原始看診物種、門診時間、特寵安排、有效公告、就診備註、來源及整理日期。日期代表最近一項資料更新，不宣稱每個欄位都在同一天完成查核。
- 新增 `/emergency` 與 `/emergency/taipei`，目前分別列出 21 與 4 間可詢問急診的醫院。沿用既有 `hasEmergencyService` 與 `emergencyHours` 資料，保留原始接診限制，不把一般門診物種視為急診物種，也不標成全部 24 小時服務。
- 多支電話拆成獨立 `tel:` 連結；分機採 `;ext=` 保留。
- 新增首頁、導覽與頁尾內部連結、鄰近縣市連結與頁面麵包屑。
- 每個新頁有獨立標題、摘要、自我 canonical、Open Graph 與 Twitter 資訊；純縣市地圖及已有專頁的急診地圖 canonical 指向對應內容頁。
- sitemap 納入 20 個新頁，使用該頁實際醫院資料日期。嵌入模式維持 `noindex, follow`。
- 結構化資料使用 `CollectionPage`、與畫面順序相符的 `ItemList` 及 `BreadcrumbList`；沒有新增虛構評分、醫療背書或 FAQ 富摘要承諾。

## 驗證

正式建置使用隔離目錄 `tmp/seo-build`，本機網址為 `http://127.0.0.1:3102`。

- ESLint、TypeScript／Next.js 正式建置通過。
- `node scripts/validateSite.mjs http://127.0.0.1:3102`：323 項 HTTP 檢查通過。包括全部縣市的內容、唯一 metadata、canonical、schema／畫面順序、完整醫院覆蓋、電話分機、來源日期、急診限制、sitemap、404 與既有首頁／文章功能。
- Lighthouse 13.5.0：正式站首頁基準 SEO 為 100；完成後的本機首頁、基隆頁與台北急診頁，SEO 與 Accessibility 均為 100，Agentic Browsing 適用檢查均通過。技術分數不是排名或收錄預測，正式站基準與本機結果也不是效能前後對照。
- 原始報告：忽略追蹤的 `artifacts/seo-before.json`、`artifacts/seo-after-home.json`、`artifacts/seo-after-keelung.json`、`artifacts/seo-after-emergency.json`。
- Chrome 實測 390px 基隆頁、320px 急診頁及 1751px 名單入口無水平溢出；確認縣市頁至地圖的篩選帶入、手機導覽、全台至台北急診連結。電話僅驗證連結格式，未實際撥號。

## 部署後追蹤

以上為部署前的本機驗證紀錄；當時未部署、提交 sitemap 或操作 Search Console。後續發布狀態以 GitHub main 的 Vercel Production 部署紀錄為準。

1. 部署後確認新路徑為 200、canonical 使用正式網域，sitemap 可取得且無空頁。
2. 在 Search Console 提交或確認 `https://crittermap.snyr.tw/sitemap.xml`，抽查基隆、宜蘭、彰化及台北急診頁的網址檢查與 Google 選定 canonical。
3. 以相同日期長度（例如前後各 28 天）、裝置及國家比較查詢詞與對應頁面，並同時看曝光、CTR、點擊、平均排名與收錄情況，避免把排名或查詢組成變化誤判成標題效果。
4. 若新頁沒有被收錄，先查看 Search Console 的實際原因，再決定補資料、整併或調整頁面；不持續擴建沒有足夠資訊的物種 × 縣市組合頁。

## 查核依據

- [Google：標題連結](https://developers.google.com/search/docs/appearance/title-link)：標題應具體描述頁面，與主要可見標題一致。
- [Google：摘要與 meta description](https://developers.google.com/search/docs/appearance/snippet)：摘要會依查詢與頁面內容產生，meta description 不是固定展示文字。
- [Google：延遲載入內容](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading)：Google 不依靠點擊按鈕載入內容；重要名單需要穩定網址與可讀內容。
- [Google：可爬取連結](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)：使用有 href 的連結及清楚的連結文字。
- [Google：canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)：canonical、內部連結與 sitemap 使用一致的正式網址。
- [Google：麵包屑結構化資料](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)：描述實際導覽階層。
