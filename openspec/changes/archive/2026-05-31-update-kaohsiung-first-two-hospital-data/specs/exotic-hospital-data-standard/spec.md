## ADDED Requirements

### Requirement: 查核到地址搬遷時同步座標
當醫院的已驗證地址發生變更時，地圖座標 SHALL 同步更新為目前已驗證地點的座標。

#### Scenario: 醫院地址變更
- **WHEN** 醫院資料由舊地址更新為新的已驗證地址
- **THEN** `lat` 與 `lng` SHALL 更新為新地點座標

### Requirement: 月門診異動記錄於 announcements
當官方來源提供與常規 `business_hours` 不同的特定日期營業時間時，特定月份門診異動 SHALL 記錄於 `announcements`。

#### Scenario: 官方月門診表列出特定日期異動
- **WHEN** 官方來源列出某月份的特定日期營業時段
- **THEN** 醫院資料 SHALL 包含一筆 `hours_change` 公告，並記錄受影響日期、時段、來源名稱、來源網址與查核日期

#### Scenario: 常規營業時間與例外異動分開保存
- **WHEN** 月門診例外異動已記錄於 `announcements`
- **THEN** 週期性的 `business_hours` SHALL 繼續代表常規週營業時間
