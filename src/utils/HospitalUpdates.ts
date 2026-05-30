import type { HospitalUpdate } from '@/types/hospital';

export const HospitalUpdateList: HospitalUpdate[] = [
  {
    id: 'update-yilan-sunbaby-hours-2026-05-16',
    hospitalId: 'sunbaby-animal-hospital',
    type: 'hours',
    title: '營業時間資料更新',
    summary: '更新宜蘭縣上寶貝動物醫院門診時間、預約提醒與可診療寵物分類。',
    updatedAt: '2026-05-16',
    sourceLabel: 'Google 商家與官方 Facebook',
    sourceUrl: 'https://www.facebook.com/sunbabyah/',
    verifiedAt: '2026-05-16',
  },
  {
    id: 'update-yilan-pawsome-hours-2026-05-16',
    hospitalId: 'pawsome-animal-hospital',
    type: 'hours',
    title: '營業時間資料更新',
    summary: '更新宜蘭縣柏森動物醫院門診時間、休診日與特寵診療資訊。',
    updatedAt: '2026-05-16',
    sourceLabel: '公開院所資訊',
    verifiedAt: '2026-05-16',
  },
  {
    id: 'update-kaohsiung-lebong-content-2026-03-25',
    hospitalId: 'cb069d91-23ee-4721-9487-c910f950f2d5',
    type: 'content',
    title: '院所內容資料確認',
    summary: '確認樂蹦動物醫院預約制、看診對象與就診提醒內容。',
    updatedAt: '2026-03-25',
    sourceLabel: '官方 Facebook',
    sourceUrl: 'https://www.facebook.com/%E6%A8%82%E8%B9%A6%E5%8B%95%E7%89%A9%E9%86%AB%E9%99%A2-105442371395173/',
    verifiedAt: '2026-03-25',
  },
];
