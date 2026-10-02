# 日期與更新紀錄

處理查核日期、公告或 `src/utils/HospitalUpdates.ts` 時閱讀。欄位契約以 `src/types/hospital.ts` 為準；公告內容規則見 [欄位判定](field-rules.md)。

## 三種日期分開記

- 查核日：當次實際讀取來源的 `CHECK_DATE`（Asia/Taipei）。
- 發布日：來源自己的刊登日；未標示或年份無法確認就記未知。
- 事件日：搬遷、休診、服務異動等實際生效期間；可能早於或晚於查核日。

跨台北午夜繼續查核時，以各院實際查核日記錄，不把後一天的查核倒填為第一天。多院 worker 接收明確的 `CHECK_DATE`，跨日回報實際查核日。

| 欄位 | 寫入時機與格式 |
| --- | --- |
| Hospital.createdAt | 既有值不動；新增條目依清單慣例記建立時間 |
| Hospital.updatedAt | 院所事實、公告內容或顯示文字實際異動時，依清單慣例填當次 ISO datetime；只刷新查核日期不動它 |
| last_checked | 完整查核所有欄位組後填 YYYY-MM-DD；指定欄位查核或仍有未解的重要事實、來源受阻時不刷新全院日期 |
| google.verifiedAt | 實際讀取並核對目標 Google 商家資料才填查核日；回報本次確認了哪些值，不暗示未讀欄位也獲重證 |
| specialClinic.verifiedAt | 實際重查特別門診限制後才填查核日 |
| announcements[].verifiedAt | 實際重查該事件後才填查核日；不批次刷新所有舊公告 |
| announcements[].startDate／endDate | 來源支持的事件起訖日；單日事件填相同日期，不用查核日代替 |
| fb.last_fb_post_date | 此次摘要所屬 Facebook 貼文的發布日；不是查核日或 IG 轉貼日 |
| HospitalUpdate.updatedAt | 新增紀錄填本次記錄日期，不填未來事件日來推高排序 |
| HospitalUpdate.verifiedAt | 新增或實際重查該更新內容時填查核日 |

「已確認不變」可算查核完成；「證據不足但保留」不等於已確認。完整查核須涵蓋既有物種、服務、急診及就診限制，不能只查聯絡與評分就刷新 `last_checked`。來源未提供的選填值維持未填，不為取得完整狀態硬補預設值。

## HospitalUpdates 是否需要新增

先區分 **院方實際新事件**、**首次收錄院所** 與 **校正既有資料**。首次發現一項早已存在的服務或時間，不代表院方今天才新增。

| 判定 | 動作／type |
| --- | --- |
| 首次收錄有效院所、官方正式改名、全院搬遷或部門獨立設院 | `content`；搬遷事件一筆描述位置與必要聯絡變更 |
| 主要電話或影響就診的聯絡入口實際異動 | `contact`；搬遷附帶的變更併入同一搬遷事件 |
| 固定門診、固定休診日、急診或夜診狀態實際變更 | `hours` |
| 院方明示新增、停辦或調整物種／服務範圍且影響就診 | `services` |
| 重要臨時休診、加診、未來才生效的就診異動 | `announcement`；摘要明寫事件日期與適用範圍 |
| 例行查核、文字潤飾、評分／評論數、補連結、欄位標準化、舊資料校正、specialClinic 結構化 | 不新增 |
| 例行月班表、補登已過期事件、事件時間無法確認 | 不因「這次剛查到」就新增；當期確有重要就診異動時依重要公告規則判定 |

同院同事件優先沿用既有 ID 並修正內容；查核日期不是事件識別。不同院分開記錄。改名兼換電話、搬遷兼換地址等同一事件可合併，不為每個欄位各建一筆。

- 新記錄包含 `id / hospitalId / type / title / summary / updatedAt`，並保留能直接支持內容的 `sourceLabel / sourceUrl / verifiedAt`。
- 既有紀錄僅重查或校正文案時保留原 `updatedAt`，實際重查可更新 `verifiedAt`；不靠改日期延長舊事件的顯示期。
- 舊錯誤資料可直接更正院所內容，不需包裝成院方今日事件。新增院所寫「新增收錄」，除非有開幕證據，不能寫成「新開幕」。
- 未來事件寫進公告時，維持真實 `startDate`；目前詳情在開始日前不顯示該公告。重要預告可透過符合本表的 HospitalUpdate 提醒，不保證每筆動態都會出現在首頁。

## 修改 HospitalUpdates 後的清理

只在本輪有修改 `HospitalUpdates.ts` 時執行；讀 `package.json` 與 `scripts/pruneHospitalUpdates.cjs` 確認現行指令。

1. 先跑 dry-run，將下例日期占位文字換成實際 `CHECK_DATE`：
   `npm run prune:hospital-updates -- --today YYYY-MM-DD`
2. 核對待刪 ID、日期及本輪前的 staged／unstaged 修改。清理按 `updatedAt` 保留本月與上月，不按 `verifiedAt` 或首頁顯示筆數。例如 2026-01-10 的截止日為 2025-12-01。
3. 若待刪項含使用者既有新增／修改，保留該項並回報；不執行會刪掉它的全檔 write。其他無衝突的過期紀錄可用局部補丁刪除。
4. 無衝突且檔案結構適用腳本時執行：
   `npm run prune:hospital-updates:write -- --today YYYY-MM-DD`
5. 重讀並檢查 diff，確認只刪預期紀錄，保留的物件、來源與註解不變。腳本使用大括號掃描與文字擷取；遇到字串中的大括號、區塊間註解等可能誤判的內容，先確認 dry-run 與實際物件一致，無法可靠解析時改局部補丁，不改寫腳本或猜測清理結果。

這項時間窗清理是流程允許的跨院例外；來源不足不構成刪除醫院或公告的理由。未執行、部分清理或清理失敗都須回報。
