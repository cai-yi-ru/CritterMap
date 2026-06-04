import type { Hospital } from "@/types/hospital";

export type HospitalSummary = {
  id: Hospital["id"];
  name: string;
  city?: string;
  district?: string;
  lat: number;
  lng: number;
  pets: string[];
  displayTags: string[];
  reservationLabel: string;
  reservationTone: "required" | "walkIn" | "unknown";
  hasEmergencyService?: boolean;
  googleRating?: string;
  googleReviewCount?: number;
  hasActiveAnnouncement: boolean;
  hasClosureAnnouncement: boolean;
  specialClinicLabel?: string;
};

