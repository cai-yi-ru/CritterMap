import { HospitalUpdateList } from '@/utils/HospitalUpdates';
import type { HospitalUpdate } from '@/types/hospital';

export async function getHospitalUpdates(limit = 8): Promise<HospitalUpdate[]> {
  return [...HospitalUpdateList]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit);
}
