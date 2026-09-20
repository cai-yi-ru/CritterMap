import type { Hospital } from '@/types/hospital';
import { getCanonicalPetCategory } from '@/lib/petIcons';
import { latestDate } from '@/lib/seo';

export const hospitalCities = [
  { slug: 'taipei', name: '台北市', label: '台北', nearby: ['new-taipei', 'keelung'] },
  { slug: 'new-taipei', name: '新北市', label: '新北', nearby: ['taipei', 'taoyuan', 'keelung'] },
  { slug: 'keelung', name: '基隆市', label: '基隆', nearby: ['taipei', 'new-taipei', 'yilan'] },
  { slug: 'taoyuan', name: '桃園市', label: '桃園', nearby: ['new-taipei', 'hsinchu-county', 'hsinchu-city'] },
  { slug: 'hsinchu-city', name: '新竹市', label: '新竹市', nearby: ['hsinchu-county', 'taoyuan', 'miaoli'] },
  { slug: 'hsinchu-county', name: '新竹縣', label: '新竹縣', nearby: ['hsinchu-city', 'taoyuan', 'miaoli'] },
  { slug: 'miaoli', name: '苗栗縣', label: '苗栗', nearby: ['hsinchu-city', 'hsinchu-county', 'taichung'] },
  { slug: 'taichung', name: '台中市', label: '台中', nearby: ['changhua', 'nantou', 'miaoli'] },
  { slug: 'changhua', name: '彰化縣', label: '彰化', nearby: ['taichung', 'nantou', 'yunlin'] },
  { slug: 'nantou', name: '南投縣', label: '南投', nearby: ['taichung', 'changhua', 'yunlin'] },
  { slug: 'yunlin', name: '雲林縣', label: '雲林', nearby: ['changhua', 'chiayi-city', 'nantou'] },
  { slug: 'chiayi-city', name: '嘉義市', label: '嘉義市', nearby: ['yunlin', 'tainan'] },
  { slug: 'tainan', name: '台南市', label: '台南', nearby: ['chiayi-city', 'kaohsiung'] },
  { slug: 'kaohsiung', name: '高雄市', label: '高雄', nearby: ['tainan', 'pingtung'] },
  { slug: 'pingtung', name: '屏東縣', label: '屏東', nearby: ['kaohsiung', 'taitung'] },
  { slug: 'yilan', name: '宜蘭縣', label: '宜蘭', nearby: ['keelung', 'taipei', 'hualien'] },
  { slug: 'hualien', name: '花蓮縣', label: '花蓮', nearby: ['yilan', 'taitung'] },
  { slug: 'taitung', name: '台東縣', label: '台東', nearby: ['hualien', 'pingtung'] },
];

export type HospitalCity = typeof hospitalCities[number];

export function getCityDirectories(hospitals: Hospital[]) {
  return hospitalCities.map((city) => ({
    ...city,
    hospitals: hospitals.filter((hospital) => hospital.city === city.name),
  })).filter((city) => city.hospitals.length > 0);
}

export function getHospitalDataDate(hospitals: Hospital[]) {
  return latestDate(hospitals.flatMap((hospital) => [
    hospital.updatedAt, hospital.last_checked, hospital.google?.verifiedAt,
    hospital.specialClinic?.verifiedAt,
    ...(hospital.announcements || []).map((announcement) => announcement.verifiedAt),
  ]))?.slice(0, 10);
}

export function getDirectorySpecies(hospitals: Hospital[]) {
  const counts = new Map<string, number>();
  for (const hospital of hospitals) {
    const pets = new Set((hospital.pet_category_group?.length ? hospital.pet_category_group : hospital.pets || []).map(getCanonicalPetCategory));
    for (const pet of pets) {
      if (!['狗', '貓', '其他特寵'].includes(pet)) counts.set(pet, (counts.get(pet) || 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

export function getCityDescription(city: HospitalCity, hospitals: Hospital[]) {
  const districts = [...new Set(hospitals.map((hospital) => hospital.district).filter(Boolean))];
  const area = districts.length ? `涵蓋${districts.slice(0, 3).join('、')}${districts.length > 3 ? '等地區' : ''}，` : '';
  return `${city.label}特寵醫院名單：整理 ${hospitals.length} 間醫院的電話、地址、看診物種與預約方式。${area}可比較門診時段及特寵接診限制，出發前請先致電確認。`;
}

export function hospitalMapUrl(city?: string, emergency = false) {
  const params = new URLSearchParams();
  if (city) params.set('city', city);
  if (emergency) params.set('emergency', '1');
  return params.size ? `/?${params.toString()}` : '/';
}
