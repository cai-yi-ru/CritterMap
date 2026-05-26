## Why

各縣市特寵醫院資料由不同人員維護，導致欄位填寫不一致、格式錯誤或缺漏，影響地圖篩選功能的準確性。統一資料品質可確保使用者能正確依寵物種類篩選特寵醫院。

## What Changes

- 審查 16 個縣市醫院清單中所有特寵醫院（`type: "exotic"` 或 `typeText` 含「特寵」）的資料
- 統一 `typeText` 的表達方式（規範為：`"特殊寵物診療"` 或 `"犬貓與特寵診療"`）
- 補全所有特寵醫院的 `pet_category_group`、`pets`、`services`、`specialties` 欄位
- 修正 `business_hours` 格式（確保每天為時段字串陣列）
- 補全 `reservationRequired`、`hasEmergencyService`、`nightClinic` 等布林欄位
- 補充缺少的 `last_checked` 日期欄位

## Capabilities

### New Capabilities

- `exotic-hospital-data-standard`: 定義特寵醫院資料的欄位規範與填寫標準，確保各縣市資料格式一致

### Modified Capabilities

<!-- 無現有 spec 需修改 -->

## Impact

- **受影響檔案**：`src/utils/*HospitalList.ts`（16 個縣市）、`src/types/hospital.ts`
- **受影響功能**：首頁寵物種類篩選（`pet_category_group`）、營業時間顯示（`business_hours`）、特寵醫院標記
- **無 breaking change**：僅補全現有資料欄位，不修改型別定義或 API 介面
