## 背景

`樂蹦動物醫院` 與 `窩窩兔動物醫院` 已存在於高雄醫院清單，但欄位資料需要重新依 Google 商家與官方社群查核。樂蹦需要釐清 Google 營業時間與官方 Facebook 門診公告的差異；窩窩兔則有新地址、新座標、常規週營業時間、診療服務與 2026 年 5 月門診表公告需要落入資料欄位。

## 目標 / 非目標

**目標：**
- 將更新範圍限制在高雄醫院清單前兩筆資料。
- 保留穩定的 `id` 與既有資料契約。
- 將常規週營業時間放在 `business_hours`，特定月份例外放在 `announcements`。
- 區分來源資料整理欄位與站內標準分類欄位。

**非目標：**
- 不新增逐日門診例外的 UI 呈現行為。
- 不變更 `Hospital` 或 `HospitalAnnouncement` TypeScript 介面。
- 不重整高雄清單第三筆以後的醫院資料。

## 決策

- 以 Google 商家/Google Maps 作為地址、座標、評分與常規週營業時間的主要來源，因為它提供有效商家檔案與地圖點位。
- 樂蹦的 `business_hours` 採 Google 商家時間，官方 Facebook 的門診/最後掛號資訊整理進 `clinicNotes`。
- 窩窩兔的 `business_hours` 維持代表常規週營業時間；2026 年 5 月門診異動記錄在 `announcements`，因目前 schema 沒有逐日營業時間覆寫欄位。
- `typeText` 使用專案標準分類文字；更細的診療特色放入 `specialties`。
- `pet_category_group` 維持站內篩選標準分類，而非來源逐字文字。

## 風險 / 取捨

- 月門診異動以人類可讀的 `content` 儲存，因此 app 無法自動用它計算特定日期是否營業。這符合目前 schema 的限制，並能保留準確來源文字。
- Google/Facebook 來源資料可能變動；`last_checked` 記錄查核日期，方便後續維護重新評估資料新鮮度。
- 將來源原文與站內分類分開保存可避免 UI 篩選混入推論，但需要在 `clinicNotes` 補充分類依據。
