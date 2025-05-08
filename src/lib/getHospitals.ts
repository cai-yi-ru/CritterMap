import { KaohsiungHospitalList } from '@/utils/KaohsiungHospitalList';
import { PingtungHospitalList } from '@/utils/PingtungHospitalList';


export async function getHospitals() {
  // 這裡也可以改為資料庫查詢
  return [
    ...KaohsiungHospitalList,
    ...PingtungHospitalList,
  ];
}