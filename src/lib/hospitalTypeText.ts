import type { Hospital } from '@/types/hospital';
import { isDogOrCatCategory, isExoticPetCategory } from './petIcons';

export function getHospitalTypeDisplayText(hospital: Pick<Hospital, 'pet_category_group' | 'typeText'>) {
  const categories = hospital.pet_category_group || [];
  const hasDogOrCat = categories.some(isDogOrCatCategory);
  const hasExoticPet = categories.some(isExoticPetCategory);

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
