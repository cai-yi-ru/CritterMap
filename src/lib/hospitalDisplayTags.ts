import type { Hospital } from "@/types/hospital";
import { getHospitalTypeDisplayText } from "./hospitalTypeText";

export function getHospitalDisplayTags(hospital: Hospital) {
  return getHospitalTypeDisplayText(hospital)
    .split(/[、,，/]+/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}
