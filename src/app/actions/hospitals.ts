"use server";

import { getHospitals } from "@/lib/getHospitals";
import { filterHospitals, summarizeHospitals } from "@/lib/hospitalSearch";

type SearchHospitalsInput = {
  city?: string;
  petCategory?: string;
  reservationRequiredOnly?: boolean;
  openNowOnly?: boolean;
};

export async function searchHospitals(input: SearchHospitalsInput) {
  const hospitals = await getHospitals();

  return summarizeHospitals(filterHospitals(hospitals, input));
}

export async function getHospitalDetail(id: string) {
  const hospitals = await getHospitals();

  return hospitals.find((hospital) => hospital.id === id) || null;
}
