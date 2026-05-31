# exotic-special-clinic Specification

## Purpose

定義特寵特別門診的結構化資料與畫面顯示要求，避免使用者將限定時段、指定醫師或特殊預約流程誤認為一般特寵門診可用性。

## Requirements

### Requirement: 特寵特別門診結構化資料
醫院資料 SHALL 支援 optional `specialClinic` object，用來描述特寵診療僅透過特別門診、固定時段、指定醫師或特殊預約流程提供的情況。

`specialClinic` object SHALL 支援以下欄位：
- `hasExoticSpecialClinic`
- `label`
- `note`
- `reservationRequired`
- `sourceLabel`
- `sourceUrl`
- `verifiedAt`

#### Scenario: 醫院有已確認的特寵特別門診
- **WHEN** 醫院只透過特別門診或限定特寵門診安排提供特寵診療
- **THEN** `specialClinic.hasExoticSpecialClinic` SHALL 為 `true`
- **AND** `specialClinic.label` SHALL 包含短顯示文字，例如 `"特寵特別門診"` 或 `"兔病特別門診"`
- **AND** `specialClinic.note` SHALL 摘要說明時段、醫師、預約方式或可用性限制

#### Scenario: 醫院沒有特別門診限制
- **WHEN** 醫院沒有已確認的特寵特別門診限制
- **THEN** `specialClinic` MAY 省略
- **AND** 醫院 SHALL 維持既有分類、服務、寵物與備註顯示行為

---

### Requirement: 特別門診預約旗標限定於特別門診
`specialClinic.reservationRequired` SHALL 描述該特寵特別門診是否需要預約，且 SHALL NOT 取代或驅動醫院層級的 `reservationRequired` 值。

#### Scenario: 特別門診需要預約
- **WHEN** 特寵特別門診需要預約，但醫院整體預約政策更廣或不同
- **THEN** `specialClinic.reservationRequired` SHALL 為 `true`
- **AND** 依賴 `Hospital.reservationRequired` 的既有篩選 SHALL NOT 使用 `specialClinic.reservationRequired`

---

### Requirement: 特別門診來源資訊
當特別門診資料來自可追溯來源時，醫院資料 SHALL 保留可取得的來源與確認資訊。

#### Scenario: 可取得來源與確認日期
- **WHEN** 維護者從官方或已查核來源記錄特別門診資訊
- **THEN** `specialClinic.sourceLabel` SHALL 標示來源名稱
- **AND** `specialClinic.verifiedAt` SHALL 以 `YYYY-MM-DD` 格式記錄確認日期
- **AND** 若存在穩定來源網址，`specialClinic.sourceUrl` SHALL 一併記錄

---

### Requirement: 特別門診 UI 提醒
當 `specialClinic.hasExoticSpecialClinic` 為 true 時，UI SHALL 顯示特別門診資訊。

#### Scenario: 醫院列表顯示特別門診標籤
- **WHEN** 醫院的 `specialClinic.hasExoticSpecialClinic` 為 `true`
- **THEN** 醫院列表 SHALL 顯示 `specialClinic.label`
- **AND** 若 `specialClinic.label` 為空，列表 SHALL 顯示 `"特寵特別門診"`

#### Scenario: 醫院詳情顯示特別門診提醒
- **WHEN** 醫院的 `specialClinic.hasExoticSpecialClinic` 為 `true`
- **THEN** 醫院詳情 SHALL 顯示特別門診提醒
- **AND** 若存在標籤、摘要、預約需求、來源名稱、來源網址與確認日期，提醒區塊 SHALL 顯示這些資訊
