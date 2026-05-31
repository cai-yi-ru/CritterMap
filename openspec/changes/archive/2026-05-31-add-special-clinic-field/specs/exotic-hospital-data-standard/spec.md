## ADDED Requirements

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
