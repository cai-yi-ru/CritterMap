import type { Hospital } from "@/types/hospital";

export function getHospitalReservationLabel(hospital: Pick<Hospital, "reservationRequired">) {
  if (hospital.reservationRequired === true) return "需預約";
  if (hospital.reservationRequired === false) return "可現場掛號";
  return "請致電確認";
}

export function getHospitalReservationTone(hospital: Pick<Hospital, "reservationRequired">) {
  if (hospital.reservationRequired === true) return "required";
  if (hospital.reservationRequired === false) return "walkIn";
  return "unknown";
}
