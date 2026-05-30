## Why

醫院資料目前只有固定營業時間、備註與 legacy `specialEvents` 字串陣列，無法穩定記錄「臨時休診」、「營業時間異動」或「資料更新」這類需要排序、顯示來源與過期判斷的資訊。使用者在看地圖時，也需要快速知道哪些醫院近期有更新，例如營業時間或內容資料已重新確認。

## What Changes

- 在 `Hospital` 型別新增結構化 `announcements` 欄位，用來記錄醫院目前有效的最新訊息
- 新增 `HospitalAnnouncement` 與 `HospitalUpdate` 共用型別
- 保留 `specialEvents?: string[]` 作為 legacy 欄位，後續新資料優先使用 `announcements`
- 新增獨立 `HospitalUpdateList` 靜態資料，專門提供首頁地圖下方「最新更新」區塊
- 新增讀取與排序 helper，依 `updatedAt` 由新到舊回傳最新更新
- 在醫院卡片與 Modal 顯示目前有效的公告
- 在首頁地圖下方顯示全站最新更新，不受城市或寵物篩選影響

## Capabilities

### New Capabilities

- `hospital-announcements`: 醫院可記錄結構化公告，包含公告類型、日期區間、來源與確認日期
- `hospital-updates-feed`: 首頁可顯示目前有效的醫院資料更新動態

### Modified Capabilities

- `hospital-data-model`: 擴充 `Hospital` 型別，保留舊欄位相容性
- `home-map-experience`: 地圖旁/下方新增最新更新區塊，並可點擊更新項目開啟對應醫院詳情

## Impact

- **受影響檔案**：`src/types/hospital.ts`、`src/lib/*`、`src/utils/HospitalUpdates.ts`、`src/app/HomeClient.tsx`、醫院列表與 Modal 元件
- **受影響功能**：首頁醫院資訊展示、醫院詳情 Modal、醫院資料更新維護流程
- **無 breaking change**：既有醫院資料不需要立即補 `announcements`，`specialEvents` 繼續保留
- **非目標**：本次不導入資料庫、不建立後台、不讓臨時休診影響 `isOpenNow()` 判斷
