import "server-only";

import { getActiveAnnouncements } from "@/lib/hospitalAnnouncements";
import { getHospitalDisplayTags } from "@/lib/hospitalDisplayTags";
import { getHospitalReservationLabel, getHospitalReservationTone } from "@/lib/hospitalReservation";
import { isOpenNow } from "@/lib/businessHours";
import { getCanonicalPetCategory } from "@/lib/petIcons";
import type { Hospital } from "@/types/hospital";
import type { HospitalSummary } from "@/types/hospitalPublic";

type HospitalSearchFilters = {
  city?: string;
  petCategory?: string;
  reservationRequiredOnly?: boolean;
  openNowOnly?: boolean;
};

export function filterHospitals(hospitals: Hospital[], filters: HospitalSearchFilters) {
  let filtered = hospitals;

  if (filters.city && filters.city !== "all") {
    filtered = filtered.filter((hospital) => hospital.city === filters.city);
  }

  if (filters.petCategory && filters.petCategory !== "all") {
    filtered = filtered.filter((hospital) => {
      const categories = [...(hospital.pet_category_group || []), ...(hospital.pets || [])];
      return categories.some((category) => getCanonicalPetCategory(category) === filters.petCategory);
    });
  }

  if (filters.reservationRequiredOnly) {
    filtered = filtered.filter((hospital) => hospital.reservationRequired === false);
  }

  if (filters.openNowOnly) {
    filtered = filtered.filter((hospital) => isOpenNow(hospital.business_hours));
  }

  return filtered;
}

export function summarizeHospital(hospital: Hospital): HospitalSummary {
  const activeAnnouncements = getActiveAnnouncements(hospital.announcements);

  return {
    id: hospital.id,
    name: hospital.name,
    city: hospital.city,
    district: hospital.district,
    lat: hospital.lat,
    lng: hospital.lng,
    pets: (hospital.pets || []).slice(0, 4),
    displayTags: getHospitalDisplayTags(hospital),
    reservationLabel: getHospitalReservationLabel(hospital),
    reservationTone: getHospitalReservationTone(hospital),
    hasEmergencyService: hospital.hasEmergencyService,
    googleRating: hospital.google?.rating,
    googleReviewCount: hospital.google?.reviewCount,
    hasActiveAnnouncement: activeAnnouncements.length > 0,
    hasClosureAnnouncement: activeAnnouncements.some((announcement) => announcement.type === "closure"),
    specialClinicLabel: hospital.specialClinic?.hasExoticSpecialClinic
      ? hospital.specialClinic.label || "特寵特別門診"
      : undefined,
  };
}

export function summarizeHospitals(hospitals: Hospital[]) {
  return hospitals.map(summarizeHospital);
}
