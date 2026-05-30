export interface HospitalAnnouncement {
    id: string; // 公告唯一識別碼，建議用可讀的 kebab-case。
    type: "closure" | "hours_change" | "service_change" | "notice"; // 公告類型：休診、營業時間異動、服務異動或一般提醒。
    title: string; // 公告標題，顯示在醫院詳情的最新訊息區。
    content?: string; // 公告詳細內容，可放休診原因、異動說明或注意事項。
    startDate?: string; // 公告生效開始日期，格式 YYYY-MM-DD；未填代表立即有效。
    endDate?: string; // 公告生效結束日期，格式 YYYY-MM-DD；未填代表不自動過期。
    sourceLabel?: string; // 資料來源名稱，例如官方網站、Facebook、Google 商家。
    sourceUrl?: string; // 資料來源網址，供使用者或維護者追查公告依據。
    verifiedAt?: string; // 最後確認公告內容的日期，格式 YYYY-MM-DD。
  }

export interface HospitalUpdate {
    id: string; // 更新動態唯一識別碼，建議包含醫院與日期。
    hospitalId: string; // 對應 Hospital.id，用來找到更新所屬醫院並開啟詳情。
    type: "hours" | "content" | "announcement" | "services" | "contact"; // 更新類型：時間、內容、公告、服務或聯絡資訊。
    title: string; // 更新標題，供列表或後續管理顯示。
    summary: string; // 更新摘要，顯示在首頁最新更新區塊。
    updatedAt: string; // 更新發生或資料整理日期，格式 YYYY-MM-DD，用於排序。
    sourceLabel?: string; // 更新依據來源名稱，例如官方 Facebook。
    sourceUrl?: string; // 更新依據來源網址。
    verifiedAt?: string; // 最後確認此更新內容的日期，格式 YYYY-MM-DD。
  }

export interface Hospital {
    id: string; // 醫院唯一識別碼，用於列表 key、更新動態關聯與資料維護。
    name: string; // 醫院名稱，顯示在列表、地圖 popup 與詳情 Modal。
    address: string; // 醫院地址，用於顯示與 Google Maps 導航。
    city?: string; // 縣市名稱，用於城市篩選與地圖定位。
    district?: string; // 鄉鎮市區，供顯示或未來更細篩選使用。
    phone?: string; // 聯絡電話，顯示在醫院詳情。
    type: string; // 醫院分類代碼，例如 exotic；供資料分類或未來邏輯使用。
    typeText: string; // 醫院分類原始文字；畫面會標準化顯示為「犬貓診療、特寵診療」或「特寵診療」。
    emergency?: boolean; // Legacy 急診標記；新資料建議優先使用 hasEmergencyService。
    rating?: string; // 評分文字；目前 UI 多數地方未啟用，保留資料相容。
    services?: string[]; // 可提供服務項目，例如內科、外科、健康檢查。
    pets?: string[]; // 可看診寵物名稱，顯示在詳情與列表圖示摘要。
    pet_category_group?: string[]; // 標準化寵物分類，用於首頁寵物類型篩選。
    website?: string; // 官方網站或主要資訊頁，顯示為外部連結。
    hours?: string; // 人類可讀的營業時間文字，顯示在醫院詳情。
    business_hours?: {
      mon: string[]; // 週一營業時段，格式 HH:MM-HH:MM；休診日填空陣列。
      tue: string[]; // 週二營業時段，格式 HH:MM-HH:MM；休診日填空陣列。
      wed: string[]; // 週三營業時段，格式 HH:MM-HH:MM；休診日填空陣列。
      thu: string[]; // 週四營業時段，格式 HH:MM-HH:MM；休診日填空陣列。
      fri: string[]; // 週五營業時段，格式 HH:MM-HH:MM；休診日填空陣列。
      sat: string[]; // 週六營業時段，格式 HH:MM-HH:MM；休診日填空陣列。
      sun: string[]; // 週日營業時段，格式 HH:MM-HH:MM；休診日填空陣列。
    };
    reservationRequired?: boolean; // 是否需要預約；用於「非預約制」篩選與就診提醒。
    hasEmergencyService?: boolean; // 是否提供急診或夜間急診服務，用於地圖標記與詳情提醒。
    emergencyHours?: string; // 急診服務時間或說明，搭配 hasEmergencyService 顯示。
    nightClinic?: boolean; // 是否有夜間門診，與急診不同，可供未來篩選使用。
    specialties?: string[]; // 專長或特色門診，例如鼠兔專科、中獸醫、復健。
    appointmentLink?: string; // 線上預約連結，若醫院有提供可在未來 UI 使用。
    transportTips?: string; // 交通提醒，例如捷運出口、停車資訊或地標。
    clinicNotes?: string; // 維護者整理的就診備註與注意事項，顯示在詳情。
    lat: number; // 緯度，用於地圖 Marker 位置。
    lng: number; // 經度，用於地圖 Marker 位置。
    socialMedia?: {
      facebook?: string; // Facebook 粉專或貼文頁網址。
      instagram?: string; // Instagram 帳號或頁面網址。
      line?: string; // LINE 官方帳號、預約或聯絡連結。
      [key: string]: string | undefined; // 其他社群或聯絡平台網址。
    };
    createdAt?: string; // 資料建立時間，通常為 ISO datetime。
    updatedAt?: string; // 資料最後更新時間，通常為 ISO datetime。
    last_checked?: string; // 最後人工確認資料日期，格式 YYYY-MM-DD。
    google_place_id?: string; // Google Places ID，供未來串接地點 API 或比對資料使用。
    fb?: {
      last_fb_post_date?: string; // 最後擷取或紀錄的 Facebook 貼文日期。
      last_fb_post_text?: string; // 最後擷取或紀錄的 Facebook 貼文摘要。
    };
    announcements?: HospitalAnnouncement[]; // 結構化最新訊息，例如臨時休診、時間異動或服務提醒。
    specialEvents?: string[]; // Legacy: 建議新資料改用 announcements 記錄結構化公告。
  }
