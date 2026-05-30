## Context

CritterMap 的醫院分類原本直接顯示 `typeText`。但 `typeText` 同時承擔資料分類與 UI 文案兩種角色，容易讓使用者看到較長或不一致的文字。這次改為保留原始分類資料，新增顯示層轉換，讓 UI 使用更短的診療分類。

## Goals / Non-Goals

**Goals:**
- 將畫面分類文字統一為 `"犬貓診療、特寵診療"`、`"特寵診療"` 或 `"犬貓診療"`
- 不批次改動醫院資料檔中的原始 `typeText`
- 讓列表、Modal 與地圖 popup 使用同一套轉換邏輯

**Non-Goals:**
- 不重整所有醫院資料分類
- 不改變寵物分類篩選邏輯
- 不新增新的使用者篩選條件

## Decisions

### 決策 1：顯示層標準化

新增 `getHospitalTypeDisplayText()`，根據 `pet_category_group` 判斷是否支援犬貓與特寵。若分類資料不足，才退回檢查原始 `typeText` 是否包含特寵相關文字。

### 決策 2：保留原始 typeText

`typeText` 繼續作為資料維護時的原始分類欄位。這避免一次修改大量縣市資料，也保留過去整理資訊。

## Risks / Trade-offs

- **[Trade-off] 顯示與資料分離**：UI 較穩定，但維護者需要知道 `typeText` 不一定是最後顯示文字
- **[風險] pet_category_group 不完整**：若分類缺漏，顯示 helper 會退回使用 `typeText` 推斷，但仍可能不如完整分類精準
