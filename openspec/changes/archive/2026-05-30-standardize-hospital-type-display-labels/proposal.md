## Why

醫院資料中的 `typeText` 原本偏向資料整理分類，例如 `"犬貓與特寵診療"` 或 `"特殊寵物診療"`。使用者介面需要更短、更一致的分類顯示文字，因此改為在顯示層標準化成 `"犬貓診療、特寵診療"`、`"特寵診療"` 或 `"犬貓診療"`。

## What Changes

- 新增分類顯示 helper，根據 `pet_category_group` 與原始 `typeText` 回傳標準顯示文字
- 醫院列表、醫院詳情 Modal 與地圖 popup 改用標準化顯示文字
- 更新 `Hospital.typeText` 註解，說明它是原始分類文字，畫面會另行標準化
- 更新 OpenSpec 主規格，補上顯示文字標準

## Capabilities

### Modified Capabilities

- `exotic-hospital-data-standard`: 補充分類顯示文字標準，並區分原始資料分類與 UI 顯示分類
- `home-map-experience`: 地圖、列表與詳情顯示更簡潔一致的醫院分類

## Impact

- **受影響檔案**：`src/lib/hospitalTypeText.ts`、`src/app/components/HospitalList.tsx`、`src/app/components/HospitalModal.tsx`、`src/app/components/MapPanel.jsx`、`src/types/hospital.ts`
- **受影響功能**：醫院分類標籤顯示
- **無 breaking change**：未批次改動各縣市醫院原始資料的 `typeText`
