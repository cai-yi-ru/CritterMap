import { getCanonicalPetCategory, petIconDefinitions } from '@/lib/petIcons';

export type HospitalFilters = {
  city: string;
  petCategory: string;
  reservationRequiredOnly: boolean;
  openNowOnly: boolean;
  hasEmergencyServiceOnly: boolean;
};

export const defaultHospitalFilters: HospitalFilters = {
  city: 'all', petCategory: 'all', reservationRequiredOnly: false,
  openNowOnly: false, hasEmergencyServiceOnly: false,
};

export const cityCenterMap: Record<string, [number, number]> = {
  '基隆市': [25.1283, 121.7419], '台北市': [25.0330, 121.5654],
  '新北市': [25.0169, 121.4628], '桃園市': [24.9937, 121.3000],
  '新竹市': [24.8039, 120.9647], '新竹縣': [24.7039, 121.1252],
  '苗栗縣': [24.5602, 120.8214], '台中市': [24.1477, 120.6736],
  '彰化縣': [24.0685, 120.5571], '南投縣': [23.9160835, 120.6821056],
  '雲林縣': [23.7092, 120.4313], '嘉義市': [23.4801, 120.4491],
  '嘉義縣': [23.4589, 120.5740], '台南市': [22.999150190097566, 120.21641191482486],
  '高雄市': [22.6273, 120.3014], '屏東縣': [22.6687, 120.5048],
  '宜蘭縣': [24.7021, 121.7378], '花蓮縣': [23.970339, 121.5964929],
  '台東縣': [23.023905725774426, 121.17445934255785], '澎湖縣': [23.5713, 119.5798],
  '金門縣': [24.4321, 118.3171], '連江縣': [26.1608, 119.9484],
  all: [23.7, 120.9],
};

export const cityOptions = ['all', ...Object.keys(cityCenterMap).filter((city) => city !== 'all')];

export function readHospitalFilters(params: Record<string, string | string[] | undefined> = {}): HospitalFilters {
  const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const city = first(params.city)?.replace('臺', '台') || 'all';
  const pet = first(params.pet) || 'all';
  return {
    city: cityOptions.includes(city) ? city : 'all',
    petCategory: petIconDefinitions.some((option) => option.filterable && (option.label === pet || option.aliases.includes(pet))) ? getCanonicalPetCategory(pet) : 'all',
    reservationRequiredOnly: first(params.walkIn) === '1',
    openNowOnly: first(params.openNow) === '1',
    hasEmergencyServiceOnly: first(params.emergency) === '1',
  };
}

export function isEmbedView(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value : [value]).some((item) => item === '1' || item === 'true');
}

export function updateFilterUrl(filters: HospitalFilters) {
  const url = new URL(window.location.href);
  const values = {
    city: filters.city === 'all' ? '' : filters.city,
    pet: filters.petCategory === 'all' ? '' : filters.petCategory,
    walkIn: filters.reservationRequiredOnly ? '1' : '',
    openNow: filters.openNowOnly ? '1' : '',
    emergency: filters.hasEmergencyServiceOnly ? '1' : '',
  };
  for (const [key, value] of Object.entries(values)) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}
