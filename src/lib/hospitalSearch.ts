import "server-only";

import { getActiveAnnouncements } from "@/lib/hospitalAnnouncements";
import { getHospitalDisplayTags } from "@/lib/hospitalDisplayTags";
import { getHospitalReservationLabel, getHospitalReservationTone } from "@/lib/hospitalReservation";
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

function isOpenNow(businessHours?: Record<string, string[]>): boolean {
  if (!businessHours) return false;

  const now = new Date();
  const dayIndex = now.getDay();
  const weekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const currentWeekday = weekdays[dayIndex];
  const previousWeekday = weekdays[(dayIndex + 6) % 7];
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const checkPeriods = [
    ...(businessHours[currentWeekday] || []),
    ...(businessHours[previousWeekday] || [])
      .filter((period) => {
        const [start, end] = period.split("-");
        const [startH, startM] = start.split(":").map(Number);
        const [endH, endM] = end.split(":").map(Number);
        return endH * 60 + endM < startH * 60 + startM;
      })
      .map((period) => {
        const [start, end] = period.split("-");
        return [`-1d ${start}`, end];
      }),
  ];

  return checkPeriods.some((period) => {
    let [start, end] = typeof period === "string" ? period.split("-") : period;
    const isPreviousDay = start.startsWith("-1d");

    if (isPreviousDay) {
      start = start.replace("-1d ", "");
    }

    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (isPreviousDay) {
      return nowMinutes <= endMinutes;
    }

    if (endMinutes < startMinutes) {
      return nowMinutes >= startMinutes || nowMinutes <= endMinutes;
    }

    return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
  });
}
