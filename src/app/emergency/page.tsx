import { getHospitals } from '@/lib/getHospitals';
import { getCityDirectories } from '@/lib/hospitalDirectory';
import { directoryMetadata } from '@/lib/seo';
import HospitalDirectoryPage from '@/app/components/HospitalDirectoryPage';

export const revalidate = 300;
export const metadata = directoryMetadata('特寵急診聯絡｜全台醫院電話、接診物種與時段確認', '整理全台可詢問特寵急診的醫院電話、地址與接診限制。急診服務不代表全天候接診所有特寵，請先致電告知物種與狀況，確認當日醫師、接診時段及到院安排。', '/emergency');

export default async function EmergencyPage() {
  const hospitals = await getHospitals();
  return <HospitalDirectoryPage emergency hospitals={hospitals.filter((hospital) => hospital.hasEmergencyService === true)} relatedCities={getCityDirectories(hospitals).filter((city) => ['taipei', 'taichung', 'kaohsiung'].includes(city.slug))} />;
}
