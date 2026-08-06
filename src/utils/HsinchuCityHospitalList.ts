import type { Hospital } from '@/types/hospital';

export const HsinchuCityHospitalList: Hospital[] = [
  /*
   * 2026-07-06 查核：Google Maps 可確認仍營業，官方 Facebook 也可確認院所身分、
   * 地址與電話，但未找到院方官方來源明確標示特寵、特殊寵物或非犬貓門診。
   * 故先從特寵清單註解保留原資料，待院方官方資訊補強後再恢復。
  {
    "id": "hsinchu-animal-hospital",
    "name": "新竺動物醫院",
    "city": "新竹市",
    "district": "北區",
    "address": "新竹市北區竹光路98號",
    "lat": 24.8135629,
    "lng": 120.9595005,
    "type": "exotic",
    "typeText": "犬貓診療、特寵診療",
    "phone": "03-5429961",
    "specialEvents": [],
    "hours": "週一至週六 10:00–15:00、17:00–21:00；週日 17:00–21:00",
    "business_hours": {
      "mon": [
        "10:00-15:00",
        "17:00-21:00"
      ],
      "tue": [
        "10:00-15:00",
        "17:00-21:00"
      ],
      "wed": [
        "10:00-15:00",
        "17:00-21:00"
      ],
      "thu": [
        "10:00-15:00",
        "17:00-21:00"
      ],
      "fri": [
        "10:00-15:00",
        "17:00-21:00"
      ],
      "sat": [
        "10:00-15:00",
        "17:00-21:00"
      ],
      "sun": [
        "17:00-21:00"
      ]
    },
    "reservationRequired": false,
    "hasEmergencyService": false,
    "emergencyHours": "",
    "nightClinic": true,
    "services": [
      "犬貓診療",
      "非犬貓動物診療"
    ],
    "pets": [
      "犬",
      "貓",
      "其他動物"
    ],
    "pet_category_group": [
      "狗",
      "貓",
      "其他特寵"
    ],
    "specialties": [
      "犬貓診療",
      "非犬貓動物診療"
    ],
    "website": "",
    "appointmentLink": "",
    "transportTips": "位於新竹市北區竹光路，鄰近新竹火車站，步行可達，周邊有付費停車場。",
    "socialMedia": {
      "facebook": "https://www.facebook.com/hsinchuAH/"
    },
    "google": {
      "rating": "4.1",
      "reviewCount": 421,
      "mapsUrl": "https://www.google.com/maps/place/%E6%96%B0%E7%AB%B9%E5%8B%95%E7%89%A9%E9%86%AB%E9%99%A2/@24.8135629,120.9595005,17z/data=!3m1!4b1!4m6!3m5!1s0x346835b984145369:0x9fa9ca6f78303a74!8m2!3d24.8135629!4d120.9595005!16s%2Fg%2F11b6js5cmw",
      "reviewsUrl": "https://www.google.com/maps/place/%E6%96%B0%E7%AB%B9%E5%8B%95%E7%89%A9%E9%86%AB%E9%99%A2/@24.8135629,120.9595005,17z/data=!4m8!3m7!1s0x346835b984145369:0x9fa9ca6f78303a74!8m2!3d24.8135629!4d120.9595005!9m1!1b1!16s%2Fg%2F11b6js5cmw",
      "placeId": "0x346835b984145369:0x9fa9ca6f78303a74",
      "verifiedAt": "2026-07-06"
    },
    "clinicNotes": "門診時間週一至週六為 10:00–15:00、17:00–21:00，週日僅開放 17:00–21:00。\n新竹市動物友善標章名單標示本院可入內寵物包含犬、貓及其他非犬貓動物；院方現行 Facebook 未列出特寵物種與服務細項，特殊寵物看診、預約方式與急症安排請先電話確認。",
    "updatedAt": "2026-07-06",
    "last_checked": "2026-07-06"
  },
  */
  /*
   * 2026-06-09 查核：未找到院方可用官方來源確認特寵/非犬貓診療。
   * 新竹市 2026-04-20 動物友善標章店家名單僅標示本院為犬、貓友善，
   * 故先從特寵清單註解保留原資料，待院方官方資訊補強後再恢復。
  {
    "id": "quanyu-animal-hospital",
    "name": "全育動物醫院",
    "city": "新竹市",
    "district": "東區",
    "address": "新竹市東區南大路436號",
    "lat": 24.796988,
    "lng": 120.9683904,
    "type": "exotic",
    "typeText": "犬貓診療、特寵診療",
    "phone": "03-5614316",
    "specialEvents": [],
    "hours": "週一、二、三、四、五、六 09:30–11:30、14:30–16:30、18:00–19:30；週日休診",
    "business_hours": {
      "mon": [
        "09:30-11:30",
        "14:30-16:30",
        "18:00-19:30"
      ],
      "tue": [
        "09:30-11:30",
        "14:30-16:30",
        "18:00-19:30"
      ],
      "wed": [
        "09:30-11:30",
        "14:30-16:30",
        "18:00-19:30"
      ],
      "thu": [
        "09:30-11:30",
        "14:30-16:30",
        "18:00-19:30"
      ],
      "fri": [
        "09:30-11:30",
        "14:30-16:30",
        "18:00-19:30"
      ],
      "sat": [
        "09:30-11:30",
        "14:30-16:30"
      ],
      "sun": []
    },
    "reservationRequired": false,
    "hasEmergencyService": false,
    "emergencyHours": "",
    "nightClinic": true,
    "services": [
      "犬貓內外科診療",
      "鼠兔診療",
      "刺蝟診療",
      "蜜袋鼯診療",
      "烏龜診療",
      "疫苗接種",
      "結紮手術"
    ],
    "pets": [
      "犬",
      "貓",
      "鼠",
      "兔",
      "刺蝟",
      "蜜袋鼯",
      "烏龜"
    ],
    "pet_category_group": [
      "狗",
      "貓",
      "兔",
      "鼠",
      "爬蟲",
      "刺蝟",
      "蜜袋鼯",
      "其他特寵"
    ],
    "specialties": [
      "犬貓內外科",
      "小型哺乳類診療"
    ],
    "website": "",
    "appointmentLink": "",
    "transportTips": "位於新竹市東區南大路，鄰近新竹火車站，步行可達，周邊有付費停車場。",
    "socialMedia": {},
    "google": {
      "rating": "4.5",
      "reviewCount": 354,
      "mapsUrl": "https://www.google.com/maps/place/%E5%85%A8%E8%82%B2%E5%8B%95%E7%89%A9%E9%86%AB%E9%99%A2/@24.796988,120.9683904,17z/data=!3m1!4b1!4m6!3m5!1s0x346835ed9e9eee59:0xe8476baccf70d0e5!8m2!3d24.796988!4d120.9683904!16s%2Fg%2F1tltk2wt",
      "reviewsUrl": "https://www.google.com/maps/place/%E5%85%A8%E8%82%B2%E5%8B%95%E7%89%A9%E9%86%AB%E9%99%A2/@24.796988,120.9683904,17z/data=!4m8!3m7!1s0x346835ed9e9eee59:0xe8476baccf70d0e5!8m2!3d24.796988!4d120.9683904!9m1!1b1!16s%2Fg%2F1tltk2wt",
      "placeId": "0x346835ed9e9eee59:0xe8476baccf70d0e5",
      "verifiedAt": "2026-06-03"
    },
    "clinicNotes": "門診時間為週一至週五 09:30–11:30、14:30–16:30、18:00–19:30；週六至 16:30，週日休診。\n目前未確認官方網站或官方社群帳號；特殊寵物實際可看診物種、掛號方式與急症安排建議先電話確認。",
    "updatedAt": "2026-06-01",
    "last_checked": "2026-06-01"
  },
  */
  /*
   * 2026-06-09 查核：官方 Facebook、MainPI 與 Google Maps 可確認營業資訊，
   * 但未找到院方官方來源明確標示特寵/非犬貓診療或具體物種。
   * 故先從特寵清單註解保留原資料，待院方官方資訊補強後再恢復。
  {
    "id": "anding-animal-hospital",
    "name": "安定動物醫院",
    "city": "新竹市",
    "district": "東區",
    "address": "新竹市東區公園路227巷28號",
    "lat": 24.803467,
    "lng": 120.9815298,
    "type": "exotic",
    "typeText": "犬貓診療、特寵診療",
    "phone": "03-5611369",
    "specialEvents": [],
    "hours": "週一至週六 09:00–11:30、14:00–16:30、18:00–20:30；週日休診",
    "business_hours": {
      "mon": [
        "09:00-11:30",
        "14:00-16:30",
        "18:00-20:30"
      ],
      "tue": [
        "09:00-11:30",
        "14:00-16:30",
        "18:00-20:30"
      ],
      "wed": [
        "09:00-11:30",
        "14:00-16:30",
        "18:00-20:30"
      ],
      "thu": [
        "09:00-11:30",
        "14:00-16:30",
        "18:00-20:30"
      ],
      "fri": [
        "09:00-11:30",
        "14:00-16:30",
        "18:00-20:30"
      ],
      "sat": [
        "09:00-11:30",
        "14:00-16:30",
        "18:00-20:30"
      ],
      "sun": []
    },
    "reservationRequired": false,
    "hasEmergencyService": false,
    "emergencyHours": "",
    "nightClinic": true,
    "services": [
      "犬貓內外科診療",
      "鼠兔診療",
      "住院照護",
      "結紮手術"
    ],
    "pets": [
      "犬",
      "貓",
      "鼠",
      "兔"
    ],
    "pet_category_group": [
      "狗",
      "貓",
      "兔",
      "鼠"
    ],
    "specialties": [
      "犬貓內外科",
      "小型哺乳類診療"
    ],
    "website": "",
    "appointmentLink": "https://www.mainpi.com/query?i=1415",
    "transportTips": "位於新竹市東區公園路227巷，建議使用導航前往。",
    "socialMedia": {
      "facebook": "https://www.facebook.com/ANDING5712135/"
    },
    "google": {
      "rating": "4.5",
      "reviewCount": 674,
      "mapsUrl": "https://www.google.com/maps/place/%E5%AE%89%E5%AE%9A%E5%8B%95%E7%89%A9%E9%86%AB%E9%99%A2/@24.803467,120.9815298,17z/data=!3m1!4b1!4m6!3m5!1s0x34683671f49569e5:0xd4f9b111a6893f63!8m2!3d24.803467!4d120.9815298!16s%2Fg%2F11xf7yndk",
      "reviewsUrl": "https://www.google.com/maps/place/%E5%AE%89%E5%AE%9A%E5%8B%95%E7%89%A9%E9%86%AB%E9%99%A2/@24.803467,120.9815298,17z/data=!4m8!3m7!1s0x34683671f49569e5:0xd4f9b111a6893f63!8m2!3d24.803467!4d120.9815298!9m1!1b1!16s%2Fg%2F11xf7yndk",
      "verifiedAt": "2026-06-03"
    },
    "clinicNotes": "門診時間為週一至週六 09:00–11:30、14:00–16:30、18:00–20:30，週日休診。\n現場病患優先掛號；電話掛號後仍需於看診時間內到院，建議先電話確認。特殊寵物實際可看診物種與急症安排也建議先致電確認。",
    "updatedAt": "2026-06-01",
    "last_checked": "2026-06-01"
  },
  */
  {
    "id": "allweather-animal-hospital",
    "name": "全天候動物醫院",
    "city": "新竹市",
    "district": "東區",
    "address": "新竹市東區關新路225號1樓",
    "lat": 24.7878558,
    "lng": 121.0200103,
    "type": "exotic",
    "typeText": "犬貓診療、特寵診療",
    "phone": "03-6686356",
    "specialEvents": [],
    "hours": "全年無休；一般門診 09:00–21:00，夜間急診 21:00–09:00",
    "business_hours": {
      "mon": [
        "00:00-23:59"
      ],
      "tue": [
        "00:00-23:59"
      ],
      "wed": [
        "00:00-23:59"
      ],
      "thu": [
        "00:00-23:59"
      ],
      "fri": [
        "00:00-23:59"
      ],
      "sat": [
        "00:00-23:59"
      ],
      "sun": [
        "00:00-23:59"
      ]
    },
    "reservationRequired": false,
    "hasEmergencyService": true,
    "emergencyHours": "21:00–09:00 夜間急診；全年無休提供 24 小時急診服務",
    "nightClinic": false,
    "services": [
      "犬貓鼠兔門診急診",
      "寵物內視鏡",
      "高壓氧治療中心",
      "高階心臟超音波",
      "重症ICU氧氣病房",
      "專業外科手術",
      "急診/一般外科手術"
    ],
    "pets": [
      "犬",
      "貓",
      "鼠",
      "兔"
    ],
    "pet_category_group": [
      "狗",
      "貓",
      "兔",
      "鼠"
    ],
    "specialties": [
      "犬貓鼠兔急診",
      "重症加護",
      "高壓氧治療",
      "高階心臟超音波",
      "外科手術"
    ],
    "website": "https://www.allweathervet.com/",
    "appointmentLink": "",
    "transportTips": "位於新竹市東區關新路，鄰近新竹科學園區，周邊有付費停車場。",
    "socialMedia": {
      "facebook": "https://www.facebook.com/allweathervet/"
    },
    "google": {
      "rating": "4.0",
      "reviewCount": 331,
      "mapsUrl": "https://www.google.com/maps/place/%E5%85%A8%E5%A4%A9%E5%80%99%E5%8B%95%E7%89%A9%E9%86%AB%E9%99%A2/@24.7878558,121.0200103,17z/data=!3m1!4b1!4m6!3m5!1s0x3468373460d55181:0xe0df728cd95621f1!8m2!3d24.7878558!4d121.0200103!16s%2Fg%2F11ssf7_d23",
      "reviewsUrl": "https://www.google.com/maps/place/%E5%85%A8%E5%A4%A9%E5%80%99%E5%8B%95%E7%89%A9%E9%86%AB%E9%99%A2/@24.7878558,121.0200103,17z/data=!4m8!3m7!1s0x3468373460d55181:0xe0df728cd95621f1!8m2!3d24.7878558!4d121.0200103!9m1!1b1!16s%2Fg%2F11ssf7_d23",
      "placeId": "0x3468373460d55181:0xe0df728cd95621f1",
      "verifiedAt": "2026-08-06"
    },
    "clinicNotes": "全年無休；09:00–21:00 為一般門診，21:00–09:00 為夜間急診。官方明列犬貓鼠兔門診急診，服務對象包含倉鼠與兔子；特殊需求或急症就診前可先致電 03-668-6356 確認。",
    "fb": {
      "last_fb_post_date": "8月（年份未顯示）",
      "last_fb_post_text": "官方 Facebook 最新可見貼文公告 8 月門診表，頁面僅顯示約 3 天前，未提供可安全轉換的確切日期。"
    },
    "announcements": [
      {
        "id": "allweather-2026-07-schedule-notice",
        "type": "notice",
        "title": "2026 年 7 月班表提醒",
        "content": "官方網站已公告 2026 年 7 月班表；本院維持全年無休，一般門診 09:00–21:00，21:00–09:00 為夜間急診，服務對象包含犬、貓、鼠、兔。",
        "startDate": "2026-07-01",
        "endDate": "2026-07-31",
        "sourceLabel": "官方網站",
        "sourceUrl": "https://www.allweathervet.com/paper/share_index.php?id=9291&useno=allweathervet&title_id=8946#page",
        "verifiedAt": "2026-07-16"
      },
      {
        "id": "allweather-2026-08-schedule-notice",
        "type": "notice",
        "title": "2026 年 8 月門診表",
        "content": "官方網站與 Facebook 已公告 2026 年 8 月門診表；全年無休，一般門診 09:00–21:00，21:00–09:00 為夜間急診，犬貓鼠兔門診急診仍依院方公告與現場狀況安排。",
        "startDate": "2026-08-01",
        "endDate": "2026-08-31",
        "sourceLabel": "官方網站、官方 Facebook",
        "sourceUrl": "https://www.allweathervet.com/paper/share_index.php?id=9408&useno=allweathervet&title_id=8946#page",
        "verifiedAt": "2026-08-06"
      }
    ],
    "updatedAt": "2026-08-06",
    "last_checked": "2026-08-06"
  },
  /*
   * 2026-06-09 查核：官方 Facebook 近期公告未明確標示特寵/非犬貓診療，
   * 新竹市官方名冊僅能確認院所存在、地址與負責獸醫，電話來源亦有差異。
   * 故先從特寵清單註解保留原資料，待院方官方資訊補強後再恢復。
  {
    "id": "happiness-animal-hospital",
    "name": "大福小幸動物醫院",
    "city": "新竹市",
    "district": "香山區",
    "address": "新竹市香山區經國路三段92巷6號",
    "lat": 24.7979899,
    "lng": 120.9525492,
    "type": "exotic",
    "typeText": "犬貓診療、特寵診療",
    "phone": "03-5300175",
    "specialEvents": [],
    "hours": "門診時間以官方 Facebook 公告為主；出發前請先電話確認。",
    "business_hours": {
      "mon": [],
      "tue": [],
      "wed": [],
      "thu": [],
      "fri": [],
      "sat": [],
      "sun": []
    },
    "reservationRequired": false,
    "hasEmergencyService": false,
    "emergencyHours": "",
    "nightClinic": false,
    "services": [
      "犬貓診療",
      "特殊寵物診療"
    ],
    "pets": [
      "犬",
      "貓",
      "其他動物"
    ],
    "pet_category_group": [
      "狗",
      "貓",
      "其他特寵"
    ],
    "specialties": [
      "特殊寵物診療"
    ],
    "website": "",
    "appointmentLink": "",
    "transportTips": "位於新竹市香山區經國路三段92巷，鄰近主要道路，周邊有付費停車場。",
    "socialMedia": {
      "facebook": "https://www.facebook.com/HappinesssAnimalHospital/"
    },
    "google": {
      "rating": "4.5",
      "mapsUrl": "https://www.google.com/maps/place/%E5%A4%A7%E7%A6%8F%E5%B0%8F%E5%B9%B8%E5%8B%95%E7%89%A9%E9%86%AB%E9%99%A2/@24.7979899,120.9525492,17z/data=!4m8!3m7!1s0x3468359a85406bcf:0x19f1236446191b34!8m2!3d24.7979899!4d120.9525492!16s%2Fg%2F11f26m8qrh",
      "reviewsUrl": "https://www.google.com/maps/place/%E5%A4%A7%E7%A6%8F%E5%B0%8F%E5%B9%B8%E5%8B%95%E7%89%A9%E9%86%AB%E9%99%A2/@24.7979899,120.9525492,17z/data=!4m8!3m7!1s0x3468359a85406bcf:0x19f1236446191b34!8m2!3d24.7979899!4d120.9525492!9m1!1b1!16s%2Fg%2F11f26m8qrh",
      "placeId": "ChIJz2tAhZo1aDQRNBsZRmQj8Rk",
      "verifiedAt": "2026-06-03"
    },
    "clinicNotes": "官方 Facebook 為主要資訊來源；公開資料對電話與門診時間有差異，出發前請先電話或查閱官方 Facebook 確認當日看診安排。\n目前保守標示為犬貓與特殊寵物診療；急診、夜診、詳細可看診物種與服務項目尚未由官方頁面直接確認。",
    "updatedAt": "2026-06-01",
    "last_checked": "2026-06-01"
  },
  */
  {
    "id": "dodo-animal-hospital",
    "name": "度度鳥特殊寵物專科醫院",
    "city": "新竹市",
    "district": "東區",
    "address": "新竹市東區西大路315巷7號1樓",
    "lat": 24.8011484,
    "lng": 120.9657388,
    "type": "exotic",
    "typeText": "特寵診療",
    "phone": "0965-109-093",
    "specialEvents": [],
    "hours": "週三、週四、週六 14:00–21:00；週一、週二、週五、週日休診",
    "business_hours": {
      "mon": [],
      "tue": [],
      "wed": [
        "14:00-21:00"
      ],
      "thu": [
        "14:00-21:00"
      ],
      "fri": [],
      "sat": [
        "14:00-21:00"
      ],
      "sun": []
    },
    "reservationRequired": true,
    "hasEmergencyService": false,
    "emergencyHours": "",
    "nightClinic": true,
    "services": [
      "非犬貓寵物門診醫療"
    ],
    "pets": [
      "非犬貓寵物"
    ],
    "pet_category_group": [
      "其他特寵"
    ],
    "specialties": [
      "非犬貓寵物門診醫療"
    ],
    "website": "",
    "appointmentLink": "https://line.me/R/ti/p/@978zickn",
    "transportTips": "位於新竹市東區西大路315巷，鄰近大遠百，建議使用導航前往，周邊有付費停車場。",
    "socialMedia": {
      "facebook": "https://www.facebook.com/p/%E5%BA%A6%E5%BA%A6%E9%B3%A5%E7%89%B9%E6%AE%8A%E5%AF%B5%E7%89%A9%E5%B0%88%E7%A7%91%E9%86%AB%E9%99%A2-100075739882784/",
      "line": "https://line.me/R/ti/p/@978zickn"
    },
    "google": {
      "rating": "4.6",
      "reviewCount": 86,
      "mapsUrl": "https://www.google.com/maps/place/%E5%BA%A6%E5%BA%A6%E9%B3%A5%E7%89%B9%E6%AE%8A%E5%AF%B5%E7%89%A9%E5%B0%88%E7%A7%91%E9%86%AB%E9%99%A2%EF%BC%88%E9%A0%90%E7%B4%84%E5%88%B6%EF%BC%89/@24.8011484,120.9657388,17z/data=!3m1!4b1!4m6!3m5!1s0x3468352128b95dd9:0xc08ffb7bf05aa8c6!8m2!3d24.8011484!4d120.9657388!16s%2Fg%2F11tc1s0zwy",
      "reviewsUrl": "https://www.google.com/maps/place/%E5%BA%A6%E5%BA%A6%E9%B3%A5%E7%89%B9%E6%AE%8A%E5%AF%B5%E7%89%A9%E5%B0%88%E7%A7%91%E9%86%AB%E9%99%A2%EF%BC%88%E9%A0%90%E7%B4%84%E5%88%B6%EF%BC%89/@24.8011484,120.9657388,17z/data=!4m8!3m7!1s0x3468352128b95dd9:0xc08ffb7bf05aa8c6!8m2!3d24.8011484!4d120.9657388!9m1!1b1!16s%2Fg%2F11tc1s0zwy",
      "placeId": "0x3468352128b95dd9:0xc08ffb7bf05aa8c6",
      "verifiedAt": "2026-08-06"
    },
    "clinicNotes": "提供非犬貓寵物門診醫療，不包含外科、住院與住宿服務。\n全預約制，不使用 Facebook 預約；請先加入官方 LINE（@978zickn）預約。週一、週二、週五、週日未營業；週三、週四、週六 14:00–21:00。",
    "fb": {
      "last_fb_post_date": "7月28日（年份未顯示）",
      "last_fb_post_text": "官方 Facebook 最新可見貼文分享鸚鵡健康飲食與餵食指南。"
    },
    "announcements": [
      {
        "id": "dodo-line-reservation-notice",
        "type": "notice",
        "title": "預約方式提醒",
        "content": "本院採預約制，不使用 Facebook 預約；請加入官方 LINE ID @978zickn 預約。院方明示提供非犬貓寵物門診醫療，不包含外科、住院與住宿服務。",
        "sourceLabel": "官方 Facebook",
        "sourceUrl": "https://www.facebook.com/permalink.php?story_fbid=pfbid02MseE7dH8gVV3xff25NtkgTD3ErDdTBgxN8qTC3mZTmcYYkGBR3qEVQFsMTRBNRmYl&id=100075739882784",
        "verifiedAt": "2026-08-06"
      }
    ],
    "updatedAt": "2026-08-06",
    "last_checked": "2026-08-06"
  }
];
