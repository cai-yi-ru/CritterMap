## 1. 資料模型

- [x] 1.1 新增 `HospitalAnnouncement` 型別
- [x] 1.2 新增 `HospitalUpdate` 型別
- [x] 1.3 在 `Hospital` 新增 `announcements?: HospitalAnnouncement[]`
- [x] 1.4 保留 `specialEvents?: string[]` 並標記為 legacy

## 2. 更新動態資料

- [x] 2.1 新增 `src/utils/HospitalUpdates.ts`
- [x] 2.2 建立 `HospitalUpdateList` 靜態資料
- [x] 2.3 新增 `getHospitalUpdates()`，依 `updatedAt` 新到舊排序並支援筆數限制

## 3. 公告顯示

- [x] 3.1 新增 active announcement helper
- [x] 3.2 醫院卡片顯示最新公告或休診公告 badge
- [x] 3.3 醫院 Modal 顯示公告標題、日期、內容、來源與確認日期

## 4. 首頁最新更新

- [x] 4.1 新增 `HospitalUpdates` 元件
- [x] 4.2 在 `HomeClient` 載入全站最新更新
- [x] 4.3 在地圖下方顯示最新更新，不受篩選條件影響
- [x] 4.4 點擊更新項目開啟對應醫院詳情

## 5. 驗證

- [x] 5.1 執行 `npx tsc --noEmit`
- [x] 5.2 執行 `npm run build`
- [x] 5.3 啟動本機 dev server 確認可預覽
