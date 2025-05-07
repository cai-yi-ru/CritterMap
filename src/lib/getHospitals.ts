import { hospitals } from '@/utils/hospitalList';

export async function getHospitals() {
  // 這裡也可以改為資料庫查詢
  return hospitals;
}