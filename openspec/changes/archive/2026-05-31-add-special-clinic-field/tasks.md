## 1. 資料模型

- [x] 1.1 新增 `HospitalSpecialClinic` 型別，包含特別門診旗標、顯示文字、預約、來源與確認日期欄位。
- [x] 1.2 在 `Hospital` 新增 optional `specialClinic`，且不改動既有必填欄位或醫院分類值。

## 2. UI 顯示

- [x] 2.1 當 `specialClinic.hasExoticSpecialClinic` 為 true 時，在醫院列表顯示短標籤。
- [x] 2.2 當資料存在時，在醫院詳情 Modal 顯示特別門診提醒，包含標籤、摘要、預約需求、來源連結與確認日期。
- [x] 2.3 保持既有「非預約制」篩選只依據 `Hospital.reservationRequired`。

## 3. 資料更新

- [x] 3.1 選一筆已查核、既有固定或限定特寵門診的醫院資料，新增 `specialClinic` 範例。
- [x] 3.2 除非需要修正資料，否則保留既有 `services`、`specialties` 與 `clinicNotes` 內容。

## 4. 驗證

- [x] 4.1 執行 TypeScript 檢查。
- [x] 4.2 執行 production build。
- [x] 4.3 手動確認沒有 `specialClinic` 的醫院顯示不變，且範例醫院在列表與詳情頁都有特別門診提醒。
