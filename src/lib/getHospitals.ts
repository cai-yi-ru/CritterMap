
import { TaipeiHospitalList } from '@/utils/TaipeiHospitalList';
import { NewTaipeiHospitalList } from '@/utils/NewTaipeiHospitalList';
import { KeelungHospitalList } from '@/utils/KeelungHospitalList';
import { TaoyuanHospitalList } from '@/utils/TaoyuanHospitalList';
import { HsinchuCountyHospitalList } from '@/utils/HsinchuCountyHospitalList';
import { HsinchuCityHospitalList } from '@/utils/HsinchuCityHospitalList';
import { MiaoliHospitalList } from '@/utils/MiaoliHospitalList';
import { TaichungHospitalList } from '@/utils/TaichungHospitalList';
import { ChanghuaHospitalList } from '@/utils/ChanghuaHospitalList';
import { YunlinHospitalList } from '@/utils/YunlinHospitalList';
import { ChiayiCityHospitalList } from '@/utils/ChiayiCityHospitalList';
import { TainanHospitalList } from '@/utils/TainanHospitalList';
import { KaohsiungHospitalList } from '@/utils/KaohsiungHospitalList';
import { PingtungHospitalList } from '@/utils/PingtungHospitalList';
import { YilanHospitalList } from '@/utils/YilanHospitalList';
import { TaitungHospitalList } from '@/utils/TaitungHospitalList';

export async function getHospitals() {
  // 這裡也可以改為資料庫查詢
  return [
    ...TaipeiHospitalList,
    ...NewTaipeiHospitalList,
    ...KeelungHospitalList,
    ...TaoyuanHospitalList,
    ...HsinchuCityHospitalList,
    ...HsinchuCountyHospitalList,
    ...MiaoliHospitalList,
    ...TaichungHospitalList,
    ...ChanghuaHospitalList,
    ...YunlinHospitalList,
    ...ChiayiCityHospitalList,
    ...TainanHospitalList,
    ...KaohsiungHospitalList,
    ...PingtungHospitalList,
    ...YilanHospitalList,
    ...TaitungHospitalList,
  ];
}