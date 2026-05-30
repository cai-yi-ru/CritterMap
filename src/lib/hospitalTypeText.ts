import type { Hospital } from '@/types/hospital';

const exoticPetCategories = new Set([
  '兔',
  '鼠',
  '天竺鼠',
  '鳥類',
  '爬蟲',
  '刺蝟',
  '蜜袋鼯',
  '貂',
  '龍貓',
  '兩棲',
  '野生動物',
  '其他特寵',
]);

export function getHospitalTypeDisplayText(hospital: Pick<Hospital, 'pet_category_group' | 'typeText'>) {
  const categories = hospital.pet_category_group || [];
  const hasDogOrCat = categories.includes('狗') || categories.includes('貓');
  const hasExoticPet = categories.some((category) => exoticPetCategories.has(category));

  if (hasDogOrCat && hasExoticPet) {
    return '犬貓診療、特寵診療';
  }

  if (hasExoticPet || hospital.typeText.includes('特寵') || hospital.typeText.includes('特殊寵物')) {
    return '特寵診療';
  }

  if (hasDogOrCat) {
    return '犬貓診療';
  }

  return hospital.typeText;
}
