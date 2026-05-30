## Context

CritterMap 目前使用靜態 TypeScript 資料檔維護醫院清單，`getHospitals()` 彙整各縣市醫院資料後供首頁地圖、列表與 Modal 使用。既有欄位 `hours`、`business_hours` 適合固定營業時間，`clinicNotes` 適合長文字備註，但缺少可排序、可過期、可標示來源的公告資料模型。

## Goals / Non-Goals

**Goals:**
- 建立結構化公告模型，支援休診、營業時間異動、服務異動與一般提醒
- 建立獨立更新動態資料，讓首頁可顯示最近有哪些醫院資料被更新
- 保留靜態資料檔工作流，維持低維護成本
- 公告與更新皆支援來源與確認日期，方便日後追查

**Non-Goals:**
- 不建立完整歷史稽核紀錄
- 不導入 CMS、資料庫或後台管理
- 不自動抓取外部網站或社群公告
- 不改變目前「營業中」篩選邏輯

## Decisions

### 決策 1：公告放在 Hospital 內

每間醫院可選填 `announcements?: HospitalAnnouncement[]`。公告屬於單一醫院的目前狀態，放在醫院資料內能讓卡片與 Modal 直接使用，不需要額外 join。

### 決策 2：更新動態獨立成資料表

首頁「最新更新」使用獨立 `HospitalUpdateList`，每筆以 `hospitalId` 對應醫院。這讓首頁可以只維護目前想展示的更新，不必修改每一間醫院資料，也不受篩選條件影響。

### 決策 3：日期使用 YYYY-MM-DD 字串

`startDate`、`endDate`、`updatedAt`、`verifiedAt` 均使用 `YYYY-MM-DD`，便於靜態資料維護、字串排序與人工檢查。

### 決策 4：休診公告只提醒，不影響營業中判斷

`closure` 類型公告會在卡片與 Modal 顯示，但暫時不套入 `isOpenNow()`。這避免臨時公告資料不完整時造成錯誤篩選。

### 決策 5：不捏造真實休診公告

實作只提供欄位與 UI 能力；若沒有可驗證公告來源，不新增假休診資料。示例更新動態只使用現有資料確認日期與公開來源。

## Data Flow

```
Hospital list files ─┐
                     ├─ getHospitals() ────────────┐
HospitalUpdateList ──┴─ getHospitalUpdates()        │
                                                     ▼
HomeClient ── MapPanel / HospitalList / HospitalUpdates
                                                     │
                                                     ▼
                                             HospitalModal
```

## Risks / Trade-offs

- **[Trade-off] 靜態資料維護**：簡單可靠，但需要人工更新 `HospitalUpdates.ts`
- **[風險] 公告過期未清理**：以 active date helper 過濾，沒有日期的公告會視為目前有效
- **[風險] 更新資料 hospitalId 錯誤**：需要透過 build/type check 或人工檢查確認能對應現有醫院
