---
target: 特寵醫院地圖首頁
total_score: 25
p0_count: 0
p1_count: 4
timestamp: 2026-08-13T03-08-53Z
slug: src-app-homeclient-tsx
---
# 特寵醫院地圖首頁設計審查

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---:|---|
| 1 | Visibility of System Status | 2/4 | 搜尋有 loading 與結果數，但篩選尚未套用、醫院詳情載入與失敗都沒有明確回饋。 |
| 2 | Match System / Real World | 3/4 | 用語大致貼近飼主情境，但「夜間急診」和全站單一最新日期容易被理解成即時可收案或全部資料都很新。 |
| 3 | User Control and Freedom | 3/4 | 有重設、地圖／清單切換與可關閉詳情；篩選不寫入 URL，重新整理、返回與分享會失去狀態。 |
| 4 | Consistency and Standards | 3/4 | shadcn 元件和品牌語彙一致；最新更新卡片卻以不可聚焦的 `article onClick` 實作。 |
| 5 | Error Prevention | 3/4 | 多處提醒先致電是優點；詳情頁仍把「導航路線」放在「撥打電話」之前，與產品承諾衝突。 |
| 6 | Recognition Rather Than Recall | 2/4 | 清單寵物只顯示圖示，地圖標記名稱大量重複，卡片也未顯示即時營業摘要與資料確認日。 |
| 7 | Flexibility and Efficiency | 2/4 | 已有城市、寵物與條件篩選，但缺少附近搜尋、區域／名稱搜尋、排序與可分享結果。 |
| 8 | Aesthetic and Minimalist Design | 2/4 | 色彩克制且整潔，但首頁由指標卡、圓角面板、膠囊與徽章反覆堆疊，查詢層級被稀釋。 |
| 9 | Error Recovery | 2/4 | 零結果有下一步，但搜尋、詳情與地圖失敗沒有可見錯誤、重試或保留狀態的處理。 |
| 10 | Help and Documentation | 3/4 | 出發前確認、免責與更新來源清楚；資料欄位定義、涵蓋率和每院查核日期仍不足。 |
| **Total** |  | **25/40** | **Acceptable：基礎可信，但核心找院效率仍需顯著改善。** |

## Anti-Patterns Verdict

**Does this look AI-generated?** 不會一眼被判定為 AI 介面。特寵圖示、台灣用語、查核提醒與一致色盤帶有明確產品脈絡。不過，首屏三個指標卡、整頁相似的圓角邊框面板、大量 badge／pill，是常見的生成式產品頁骨架。尤其「目前整理／搜尋結果／資料最近整理」形成 hero-metric 模板，對找醫院任務沒有等比例價值。

**Deterministic scan：** `detect.mjs --json src/app/HomeClient.tsx` 回傳 exit code 0、0 findings。這代表單一入口檔沒有命中 detector 的語法規則，不代表跨元件互動、手機首屏或醫療語意沒有問題。

**Visual overlays：** 沒有可靠 overlay。瀏覽器安全政策阻擋 mutable injection，title 未變更且 preflight script 數量為 0，因此沒有啟動 detector live-server，也沒有注入 `detect.js`。替代證據來自桌機／手機 DOM snapshot、尺寸、ARIA 狀態與實際切換操作。

## Overall Impression

介面已有可信、溫和且不誇張的底子，詳細資料也比許多地圖目錄完整。最大的機會不是換色或增加裝飾，而是把「在手機上快速找到可打電話確認的醫院」拉回第一順位。現在首屏、地圖密度與結果卡資訊都讓使用者多花一步理解。

## What's Working

- 品牌一致：森林綠、sage、honey 與 petal 的角色清楚，Noto Sans TC、固定字級和 focus／reduced-motion 基礎也合理。
- 醫療語氣克制：首頁、導覽與免責區都提醒先致電；詳情提供營業時段、公告、服務與來源日期，沒有把平台資料包裝成診斷或推薦。
- 基本響應式結構成立：桌機清單與地圖並排，手機切換鈕的 `aria-pressed` 狀態可正確互換，兩個實測 viewport 都沒有水平溢位。

## Cognitive Load

首屏同時呈現標語、標題、說明、三個指標、地圖圖例、城市、寵物、三個 checkbox、搜尋與地圖／清單切換。主要決策點明顯超過 4 個，且資訊沒有依任務順序分層。手機實測 CSS viewport 約 433×938，搜尋按鈕 top 約 944px，地圖／清單切換 top 約 1030px，代表使用者第一個畫面還無法完成搜尋。

建議把首屏壓成「城市／附近、寵物、搜尋」三件事；營業、免預約、急診放在可見但次一層的進階條件。三個指標改成結果工具列的一行資訊，避免先閱讀平台統計才開始任務。

## Emotional Journey

入口給人的第一感受是平靜、可信，這點正確。情緒低谷發生在急著找院的手機使用者必須滑過介紹與統計，接著面對 136 個全台標記；結果卡又沒有「現在是否營業、何時查核、能否立刻撥號」等關鍵判斷。詳情 modal 是目前體驗高點，資訊完整且底部有行動，但主要按鈕先導航、後致電，讓結尾動作偏離「出發前先確認」的承諾。

## Priority Issues

### [P1] 手機首屏沒有直接服務找院

**Why it matters：** 時間壓力下，使用者在第一個 viewport 看不到完整搜尋動作。首頁 header 的三個指標卡重複占用垂直空間，搜尋結果與地圖入口被推到下方。

**Fix：** 手機縮成一行品牌／標題與一句安全提醒；把城市、寵物、搜尋放在首屏，三個 checkbox 收進次層；將總數、結果數與日期合併到結果工具列。搜尋後讓結果工具列固定在可觸及區域，並評估手機預設顯示可撥號的清單，而不是全台地圖。

**Suggested command：** `$impeccable adapt`

### [P1] 136 個未聚合標記讓地圖既吵又不準

**Why it matters：** `MapPanel` 直接 map 全部醫院，並用固定城市中心與 zoom 更新視角。全台標記大量重疊；新北市等範圍大的區域也可能有結果落在初始視窗外。輔助科技看到的大量名稱又只會重複「動物醫院」。

**Fix：** 加入 marker clustering／supercluster，只渲染 viewport 需要的標記；搜尋後以結果座標 `fitBounds`，單一結果才使用固定 zoom。清單 hover／focus／selection 要高亮對應 marker，marker 選取也要定位並高亮清單。標記 accessible name 應包含醫院名稱，並避免讓 136 個 marker 都成為冗長 tab stops。

**Suggested command：** `$impeccable optimize`

### [P1] 結果卡缺少做決定與聯絡所需的資訊

**Why it matters：** 清單目前只有院名、地區、Google 參考、類型與預約 badge。使用者仍必須開 modal 才知道營業狀態、電話與查核時間，寵物支援又只用圖示呈現。詳情底部把「導航路線」設為主要動作，容易讓人先出發再確認。

**Fix：** 在 `HospitalSummary` 加入今日營業摘要、電話、資料查核日與可讀的寵物文字；提供中性的排序方式，例如距離、目前營業、最近查核，不建立不透明的醫療排名。清單提供明確「查看詳情」與「撥打電話」；詳情有電話時以撥號為主要按鈕，導航為次要。將「夜間急診」改成「可先電話詢問夜間急診」，並一起顯示已知時段／查核時間。

**Suggested command：** `$impeccable shape`

### [P1] 鍵盤與觸控的替代路徑仍不完整

**Why it matters：** `HospitalUpdates` 使用 `<article onClick>`，無法用 Tab 或 Enter 開啟；地圖標記 accessible name 重複；醫院清單隱藏 scrollbar；手機地圖／清單切換實測高約 40px，低於 44px 觸控建議。對鍵盤、低視力或單手使用者都是實質阻力。

**Fix：** 更新卡改成真正的 button／link，保留來源連結為獨立操作；提供唯一且完整的 marker 名稱與清單等價路徑；手機清單取消固定高度的隱藏內捲動，或至少保留可見 scrollbar／漸層提示；所有主要觸控目標提升到至少 44×44px。

**Suggested command：** `$impeccable audit`

### [P2] 篩選狀態、資料新鮮度與失敗復原不足

**Why it matters：** 城市與寵物只存在 client state，重新整理、返回與分享都不能保留。全站「資料最近整理」取所有醫院日期中的最大值，只能證明某一筆很新，且超過三個月時反而完全隱藏。搜尋與詳情 server action 也沒有 catch、錯誤訊息或重試。

**Fix：** 將篩選、排序、view 寫入 URL search params；顯示每間醫院的 `last_checked`／`updatedAt`，另以資料涵蓋率表達整體新鮮度，過舊時顯示警示而非隱藏。搜尋與詳情加入明確 pending、失敗、重試和保持既有結果的狀態。

**Suggested command：** `$impeccable harden`

## Persona Red Flags

**Jordan（第一次使用）：** 第一個手機畫面先看到產品介紹和統計，無法在 5 秒內完成城市＋寵物搜尋；清單的寵物圖示缺少可見文字，可能無法確定院方是否看自己的物種。

**Sam（鍵盤／低視力）：** 最新更新卡無法聚焦；大量地圖 marker 名稱相同；隱藏 scrollbar 使清單可捲動性不明；40px 切換鈕對動作控制較困難。

**Casey（分心的單手手機使用者）：** 搜尋按鈕與 view toggle 都在首屏下方；預設地圖有 136 個標記；切到清單後又遇到固定高度的內部捲動；打電話需要先開詳情。

**怡君（焦慮的特寵飼主）：** 她需要立即確認「看不看這個物種、現在能不能聯絡、資料何時確認」。目前卡片沒有這三項完整答案，「夜間急診」又可能被誤讀成正在收案，而主要動作卻是導航。

## Minor Observations

- 桌機與手機實測都沒有水平 overflow，響應式斷點基礎良好。
- 手機 map／list 的 `aria-pressed` 切換正確，這個模式可以保留。
- `rounded-2xl` 依目前 radius token 約為 21.6px，高於 DESIGN.md 的 12–16px；主要面板可統一降到 12–16px，減少「每塊都是卡片」的感覺。
- 無 AdSense 設定時仍渲染「預留版位」，看起來像未完成內容；沒有實際贊助內容時應完全不顯示。
- 行動版選單打開後按鈕的 aria-label 仍是「開啟選單」，應隨狀態切換成「關閉選單」。
- `scrollWheelZoom` 預設啟用可能攔截頁面捲動，可改為地圖 focus／互動後才啟用，或增加手勢提示。

## Questions to Consider

- 手機上的真正主角是地圖，還是一份能快速撥號、依距離與營業狀態排序的清單？
- 如果飼主只有 60 秒，醫院卡片上不可缺少的三個答案是否就是物種、目前狀態與電話？
- 全站最新一筆更新日期，真的足以代表 136 間資料的可信度嗎？
- 「急診」應描述院方曾提供的服務，還是平台能證明的即時可聯絡狀態？
