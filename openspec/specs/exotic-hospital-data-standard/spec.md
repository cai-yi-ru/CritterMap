# exotic-hospital-data-standard Specification

## Purpose
TBD - created by archiving change normalize-exotic-hospital-data. Update Purpose after archive.
## Requirements
### Requirement: typeText 原始分類標準

特寵醫院的 `typeText` 欄位 SHALL 使用以下兩種標準值之一作為原始資料分類：
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

### Requirement: 查核到地址搬遷時同步座標

當醫院的已驗證地址發生變更時，地圖座標 SHALL 同步更新為目前已驗證地點的座標。

#### Scenario: 醫院地址變更
- **WHEN** 醫院資料由舊地址更新為新的已驗證地址
- **THEN** `lat` 與 `lng` SHALL 更新為新地點座標

---

### Requirement: 月門診異動記錄於 announcements

當官方來源提供與常規 `business_hours` 不同的特定日期營業時間時，特定月份門診異動 SHALL 記錄於 `announcements`。

#### Scenario: 官方月門診表列出特定日期異動
- **WHEN** 官方來源列出某月份的特定日期營業時段
- **THEN** 醫院資料 SHALL 包含一筆 `hours_change` 公告，並記錄受影響日期、時段、來源名稱、來源網址與查核日期

#### Scenario: 常規營業時間與例外異動分開保存
- **WHEN** 月門診例外異動已記錄於 `announcements`
- **THEN** 週期性的 `business_hours` SHALL 繼續代表常規週營業時間

---

### Requirement: last_checked 欄位補全

每筆特寵醫院資料 SHALL 包含 `last_checked` 欄位，記錄資料最後確認日期（`"YYYY-MM-DD"` 格式）。

#### Scenario: 補填 last_checked
- **WHEN** 特寵醫院資料缺少 `last_checked` 或值為空字串
- **THEN** `last_checked` SHALL 被補填為本次整理日期 `"2026-03-25"`

---

### Requirement: 特寵特別門診不改變醫院分類
當醫院的特寵服務屬於特別門診、限定門診、特定醫師時段或需特別安排時，資料 SHALL 使用 `specialClinic` 記錄此限制，且 SHALL NOT 因此新增或改寫 `type` 分類值。

`type` SHALL 維持既有分類語意，例如 `"exotic"`；`typeText` SHALL 繼續使用既有原始分類標準，例如 `"特殊寵物診療"` 或 `"犬貓與特寵診療"`。

#### Scenario: 兼診犬貓且特寵為固定門診
- **WHEN** 醫院同時提供犬貓診療，且特寵服務只在固定特別門診提供
- **THEN** `type` SHALL 維持 `"exotic"`
- **AND** `typeText` SHALL 維持 `"犬貓與特寵診療"`
- **AND** `specialClinic.hasExoticSpecialClinic` SHALL 為 `true`

#### Scenario: 純特寵醫院有特殊門診限制
- **WHEN** 醫院主要服務特殊寵物，但部分服務需特定門診或特別安排
- **THEN** `type` SHALL 維持 `"exotic"`
- **AND** `specialClinic` SHALL 記錄特別門診或安排限制

---

### Requirement: 特寵特別門診與既有文字欄位並存
`specialClinic` SHALL 作為結構化提醒欄位，並 SHALL 與 `services`、`specialties`、`clinicNotes` 並存。

`services` 與 `specialties` MAY 繼續包含「特寵門診」、「兔病特別門診」等顯示用項目；`clinicNotes` MAY 繼續包含較完整的就診提醒。`specialClinic.note` SHALL 優先提供短摘要，供列表或詳情提醒使用。

#### Scenario: 特寵門診資訊已存在於備註
- **WHEN** `clinicNotes` 已描述特寵門診固定時段、指定醫師或預約限制
- **THEN** 維護者 SHALL 可新增 `specialClinic` 以提供結構化摘要
- **AND** 原本的 `clinicNotes` SHALL 可保留完整說明

#### Scenario: 特別門診作為服務標籤
- **WHEN** 醫院的服務項目包含「兔病特別門診」
- **THEN** `services` SHALL 可保留該服務標籤
- **AND** `specialClinic.label` SHALL 可使用相同或更短的顯示文字
