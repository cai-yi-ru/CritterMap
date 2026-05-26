# Hospital 欄位說明清單

本文件說明 `src/types/hospital.ts` 中 `Hospital` 資料欄位的用途與填寫原則，供新增或整理醫院資料時參考。

| 欄位 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `id` | `string` | 是 | 醫院唯一識別碼，應穩定且不可與其他醫院重複。 |
| `name` | `string` | 是 | 醫院名稱。 |
| `address` | `string` | 是 | 醫院完整地址。 |
| `city` | `string` | 否 | 縣市名稱，例如 `台北市`。 |
| `district` | `string` | 否 | 行政區名稱，例如 `中正區`。 |
| `phone` | `string` | 否 | 聯絡電話。 |
| `type` | `string` | 是 | 醫院分類。特寵資料使用 `exotic`。 |
| `typeText` | `string` | 是 | 顯示用分類文字。特寵資料限用 `特殊寵物診療` 或 `犬貓與特寵診療`。 |
| `emergency` | `boolean` | 否 | 舊版急診標記，保留相容性。 |
| `rating` | `string` | 否 | 評分文字。 |
| `services` | `string[]` | 否 | 提供的服務項目，例如內科、外科、健康檢查。 |
| `pets` | `string[]` | 否 | 可診療的具體動物種類，例如犬、貓、兔、倉鼠、鸚鵡。 |
| `pet_category_group` | `string[]` | 否 | 篩選用寵物分類。特寵資料不得為空，限用 `狗`、`貓`、`兔`、`鼠`、`天竺鼠`、`鳥類`、`爬蟲`、`刺蝟`、`蜜袋鼯`、`貂`、`龍貓`、`兩棲`、`野生動物`、`其他特寵`。 |
| `website` | `string` | 否 | 官方網站網址。 |
| `hours` | `string` | 否 | 人類可讀的營業時間描述。 |
| `business_hours` | `{ mon: string[]; tue: string[]; wed: string[]; thu: string[]; fri: string[]; sat: string[]; sun: string[] }` | 否 | 程式使用的營業時間。每個時段使用 `HH:MM-HH:MM`，休診日使用空陣列。 |
| `reservationRequired` | `boolean` | 否 | 是否需要預約。特寵資料需明確填寫。 |
| `hasEmergencyService` | `boolean` | 否 | 是否提供急診服務。特寵資料需明確填寫；無法確認時填 `false`。 |
| `emergencyHours` | `string` | 否 | 急診服務時間。無急診或無法確認時填空字串。 |
| `nightClinic` | `boolean` | 否 | 是否有夜間門診。特寵資料需明確填寫。 |
| `specialties` | `string[]` | 否 | 醫院特色或專科項目，例如特殊寵物診療、鳥類專科。 |
| `appointmentLink` | `string` | 否 | 線上預約連結。 |
| `transportTips` | `string` | 否 | 交通或停車提示。 |
| `clinicNotes` | `string` | 否 | 看診注意事項、預約規則或其他補充資訊。 |
| `lat` | `number` | 是 | 緯度。 |
| `lng` | `number` | 是 | 經度。 |
| `socialMedia` | `object` | 否 | 社群連結，常用鍵包含 `facebook`、`instagram`、`line`，也可放其他字串鍵。 |
| `createdAt` | `string` | 否 | 資料建立日期或時間。 |
| `updatedAt` | `string` | 否 | 資料更新日期或時間。 |
| `last_checked` | `string` | 否 | 資料最後確認日期，格式為 `YYYY-MM-DD`。特寵資料需填寫。 |
| `google_place_id` | `string` | 否 | Google Place ID。 |
| `fb` | `object` | 否 | Facebook 內容快取資訊，包含最近貼文日期與文字。 |
| `specialEvents` | `string[]` | 否 | 臨時休診、假期公告等特殊事件描述。 |

## 特寵資料整理規則

- `typeText` 僅使用 `特殊寵物診療` 或 `犬貓與特寵診療`。
- `pet_category_group` 僅使用標準分類值；狗分類應寫為 `狗`，`貂`、`龍貓`、`兩棲`、`野生動物` 不歸入 `其他特寵`。
- `business_hours` 每個星期鍵值都要是字串陣列，時段 dash 使用半形 `-`。
- `reservationRequired`、`hasEmergencyService`、`nightClinic` 需明確為 `true` 或 `false`。
- 無法確認急診服務時，`hasEmergencyService` 填 `false`，`emergencyHours` 填空字串。
- 缺少 `last_checked` 時，以本次整理日期 `2026-03-25` 補齊。
