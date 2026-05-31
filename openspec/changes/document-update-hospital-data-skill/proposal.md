## 為什麼

目前醫院資料更新需要同時處理官方網站、官方 Facebook / Instagram、Google Maps、既有 `Hospital` 型別欄位與 `HospitalUpdates` 紀錄。若每次都靠人工即興整理，容易出現幾個問題：不同醫院來源混用、舊資料未逐項查核、地址變動但座標未同步、固定營業時間與月門診異動混在一起，以及特寵特別門診限制只寫在自由文字備註中。

本次更新將剛完成的資料整理流程沉澱成專案內 Skill，並以 `中興梅西動物醫療中心（特別寵物科）` 與 `中興農十六特別寵物科` 做實測，確認流程能套用在真實醫院資料上。

## 變更內容

- 新增專案 Skill：`.codex/skills/update-hospital-data/`。
- 將 Skill 內容改為繁體中文，並保留必要的技術識別字，例如欄位名稱、檔案路徑、`multi_agent_v1.spawn_agent` 與 `npx tsc --noEmit`。
- Skill 規範每次更新前必讀：
  - `src/types/hospital.ts`
  - `src/lib/hospitalTypeText.ts`
  - 目標縣市醫院清單
  - `src/utils/HospitalUpdates.ts`
- Skill 明確定義資料來源優先序：官方網站、官方 FB / IG、Google Maps、其他公開資料僅作輔助。
- Skill 補上 Chrome 查核要求：FB、IG、Google Maps 與使用者明確要求 `@chrome` 時，需透過 Chrome plugin 查核可見官方資料。
- Skill 補上 UTF-8 編碼要求：讀寫專案資料檔、Skill 檔與 OpenSpec 文件時一律使用 UTF-8，避免中文醫院資料亂碼。
- Skill 補上全欄位查核原則：若 `hospital.ts` 中任何欄位有可驗證的新資訊，都要一併更新；無來源支持的舊資料不得留在核心欄位。
- Skill 補上地址變動規則：若地址更新，必須同步更新 `city`、`district`、`lat`、`lng`。
- Skill 補上顯示文字語氣規則：`clinicNotes`、公告 `content` 與更新摘要要自然、像人寫的就診提醒，不寫工具載入逾時、可索引頁面、輔助紀錄等查核過程字眼。
- Skill 補上長文字換行規則：文字類型欄位過長時，需依語意適度加入 `\n`，提升資料維護與前端閱讀性。
- 新增結構化 Google 商家欄位：`Hospital.google` 集中保存 `rating`、`reviewCount`、`mapsUrl`、`placeId` 與 `verifiedAt`。
- 採直接替換策略：新資料不再維護根層評分與舊 Place ID 欄位，Google Maps URL 也不再放入社群連結物件。
- Google 評論數只寫入 `google.reviewCount`，不寫進 `clinicNotes`；備註只保留使用者就診時需要知道的提醒。
- Skill 補上多院更新規則：一次更新多間醫院時，一院一個 worker 查核，主 agent 依序套用，避免資料混用或同檔衝突。
- 先以 `中興梅西動物醫療中心（特別寵物科）` 進行流程測試並更新資料：
  - 修正 `typeText` 為 `特寵診療`。
  - 補上 Google 商家評分、評論數、地圖連結與確認日期。
  - 將 `nightClinic` 標記為 true。
  - 依官方分科頁與官方 IG 清理 `services`、`pets`、`pet_category_group`、`specialties`。
  - 移除特寵科核心分類中的 `狗`、`貓`。
  - 補充 `clinicNotes`，說明 Google Maps 商家頁為院本部頁、特寵科門診與專線以官方網站/IG 為準；評論數改放結構化 `google.reviewCount`。
  - 新增 2026 年 5 月農十六整修休診造成梅西加診的公告。
  - 新增 2026 年 6 月門診表已發布公告。
  - 更新 `fb`、`updatedAt`、`last_checked`。
  - 在 `HospitalUpdates.ts` 新增對應更新紀錄。
- 再以 `中興農十六特別寵物科` 實測流程並更新資料：
  - 修正 `typeText` 為 `特寵診療`。
  - 依官方網站修正固定門診時間與 `business_hours`。
  - 補上 Google 商家評分、評論數、地圖連結與確認日期。
  - 依官方網站與官方 IG 清理 `services`、`pets`、`pet_category_group`、`specialties`。
  - 新增 2026 年 5 月農十六整修休診公告。
  - 更新 `clinicNotes`、`fb`、`updatedAt`、`last_checked`。
  - 在 `HospitalUpdates.ts` 新增對應更新紀錄。

## 能力範圍

### 新增能力

- `update-hospital-data`：定義 CritterMap 醫院資料查核與更新流程，涵蓋單院與多院更新、全欄位掃描、來源優先序、地址座標同步、特別門診判斷與更新紀錄維護。
- `hospital-google-profile`：將 Google Maps 商家資訊結構化，讓 UI 與後續維護可直接讀取 `hospital.google`，避免把評分、評論數或 Maps URL 混入自由文字備註與社群欄位。

### 修改既有能力

- `exotic-hospital-data-standard`：補充舊資料若無官方或 Google 登記資訊支持，應從核心欄位移除；必要時移至 `clinicNotes` 標示待確認。
- `exotic-special-clinic`：補充資料查核時若發現特寵僅限特別門診、固定時段、指定醫師或特殊預約流程，應填入 `specialClinic`。

## 影響範圍

- 新增 `.codex/skills/update-hospital-data/SKILL.md` 與 `.codex/skills/update-hospital-data/agents/openai.yaml`。
- 更新 `src/utils/KaohsiungHospitalList.ts` 中的 `中興梅西動物醫療中心（特別寵物科）` 資料。
- 更新 `src/utils/KaohsiungHospitalList.ts` 中的 `中興農十六特別寵物科` 資料。
- 更新 `src/utils/HospitalUpdates.ts`，新增中興梅西特寵科與中興農十六特寵科的資料更新紀錄。
- 更新 `src/types/hospital.ts`，以 `HospitalGoogleProfile` 取代根層評分與舊 Place ID 欄位。
- 不變更路由、UI 行為或新增相依套件。

## 驗證

- 已執行 `npx tsc --noEmit` 並通過。
- 已使用 Chrome 查核兩間院所相關的 Google Maps、官方 IG 與 Facebook 搜尋結果。
- 已使用官方網站查核梅西特寵科與農十六特寵科的固定門診、電話、地址與分科資訊。
- `quick_validate.py` 因本機 `python` 指向 Windows Store alias、缺少可用 Python runtime 而無法執行；已手動檢查 Skill frontmatter 與 `openai.yaml` 基本格式。

## 後續注意事項

- `.gitignore` 目前忽略 `.codex/`，因此 Skill 檔案存在於專案目錄但不會出現在一般 `git status` 未追蹤清單中；若要納入版本控制，需要調整 ignore 規則或使用強制加入。
- 後續更新多間醫院時，應依 Skill 規則讓 worker 只產出單院查核結果，由主 agent 統一套用。
