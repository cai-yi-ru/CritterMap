# exotic-hospital-data-standard Specification

## Purpose
TBD - created by archiving change normalize-exotic-hospital-data. Update Purpose after archive.
## Requirements
### Requirement: typeText 原始分類標準

特寵醫院的 `typeText` 欄位 SHOULD 使用以下兩種標準值之一作為原始資料分類：
- `"特殊寵物診療"`：主要或專門診療特殊寵物的醫院
- `"犬貓與特寵診療"`：以犬貓為主、兼具特寵診療能力的醫院

畫面顯示文字 SHALL 由顯示層根據 `pet_category_group` 與 `typeText` 標準化，不直接把原始 `typeText` 顯示給使用者。

#### Scenario: 純特寵醫院的 typeText
- **WHEN** 醫院 `type` 為 `"exotic"` 且主要服務對象為特殊寵物（非犬貓）
- **THEN** `typeText` SHALL 為 `"特殊寵物診療"`

#### Scenario: 兼診特寵的醫院 typeText
- **WHEN** 醫院 `type` 為 `"exotic"` 且服務對象同時包含犬貓與特殊寵物
- **THEN** `typeText` SHALL 為 `"犬貓與特寵診療"`

---

### Requirement: 醫院分類顯示文字標準

醫院分類顯示文字 SHALL 使用簡潔的診療分類文字：
- 同時支援犬貓與特寵的醫院 SHALL 顯示 `"犬貓診療、特寵診療"`
- 僅支援特寵的醫院 SHALL 顯示 `"特寵診療"`
- 僅支援犬貓的醫院 SHALL 顯示 `"犬貓診療"`

顯示文字 SHALL 套用在醫院列表、醫院詳情 Modal 與地圖 popup。

#### Scenario: 同時支援犬貓與特寵
- **WHEN** 醫院 `pet_category_group` 同時包含 `"狗"` 或 `"貓"`，且包含任一特寵分類
- **THEN** 畫面 SHALL 顯示 `"犬貓診療、特寵診療"`

#### Scenario: 僅支援特寵
- **WHEN** 醫院 `pet_category_group` 包含特寵分類，且不包含 `"狗"` 或 `"貓"`
- **THEN** 畫面 SHALL 顯示 `"特寵診療"`

---

### Requirement: pet_category_group 完整填寫

特寵醫院的 `pet_category_group` 欄位 SHALL 包含所有實際可診療的寵物分類，不得為空陣列。

允許的分類值集合：`["狗", "貓", "兔", "鼠", "天竺鼠", "鳥類", "爬蟲", "刺蝟", "蜜袋鼯", "貂", "龍貓", "兩棲", "野生動物", "其他特寵"]`

對應規則：
- 狗、犬 → `"狗"`
- 倉鼠、黃金鼠、三線鼠、楓葉鼠 → `"鼠"`
- 貂、雪貂 → `"貂"`
- 龍貓 → `"龍貓"`
- 兩棲類 → `"兩棲"`
- 野生動物 → `"野生動物"`
- 各種爬蟲（蜥蜴、蛇、烏龜、守宮等）→ `"爬蟲"`

#### Scenario: pet_category_group 與 pets 一致
- **WHEN** 醫院 `pets` 欄位包含「倉鼠」
- **THEN** `pet_category_group` SHALL 包含 `"鼠"`

#### Scenario: 特寵醫院不允許空分類
- **WHEN** 醫院 `type` 為 `"exotic"`
- **THEN** `pet_category_group` SHALL NOT 為空陣列

---

### Requirement: 布林欄位完整填寫

特寵醫院的布林欄位 SHALL 明確填寫，不得為 `undefined`。

受影響欄位：`reservationRequired`、`hasEmergencyService`、`nightClinic`

#### Scenario: 預約制欄位填寫
- **WHEN** 醫院 `clinicNotes` 或 `hours` 文字含「預約」
- **THEN** `reservationRequired` SHALL 為 `true`

#### Scenario: 急診欄位預設值
- **WHEN** 無法確認醫院是否提供急診
- **THEN** `hasEmergencyService` SHALL 為 `false`，`emergencyHours` SHALL 為 `""`

---

### Requirement: business_hours 格式正確

特寵醫院的 `business_hours` 欄位 SHALL 符合規定格式：每個星期鍵值（`mon`~`sun`）對應一個字串陣列，每個元素為 `"HH:MM-HH:MM"` 格式的時段字串。休息日對應空陣列 `[]`。

#### Scenario: 正常營業日格式
- **WHEN** 醫院週一有兩個時段（09:00-12:00 和 14:00-18:00）
- **THEN** `business_hours.mon` SHALL 為 `["09:00-12:00", "14:00-18:00"]`

#### Scenario: 休息日格式
- **WHEN** 醫院週三休診
- **THEN** `business_hours.wed` SHALL 為 `[]`

---

### Requirement: last_checked 欄位補全

每筆特寵醫院資料 SHALL 包含 `last_checked` 欄位，記錄資料最後確認日期（`"YYYY-MM-DD"` 格式）。

#### Scenario: 補填 last_checked
- **WHEN** 特寵醫院資料缺少 `last_checked` 或值為空字串
- **THEN** `last_checked` SHALL 被補填為本次整理日期 `"2026-03-25"`
