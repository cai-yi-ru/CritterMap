import { getHospitals } from '@/lib/getHospitals';
import { getCityDirectories, hospitalCities } from '@/lib/hospitalDirectory';
import { directoryMetadata } from '@/lib/seo';
import HospitalDirectoryPage from '@/app/components/HospitalDirectoryPage';

export const revalidate = 300;
export const metadata = directoryMetadata('台北特寵急診｜醫院電話與接診時段確認', '查詢台北特寵急診聯絡資訊，查看醫院電話、地址、急診時段與物種限制。鳥類、兔子、倉鼠或爬蟲的接診安排依院方而異，請先電話確認當日是否可接診。', '/emergency/taipei');

export default async function TaipeiEmergencyPage() {
  const hospitals = await getHospitals();
  const city = hospitalCities.find((entry) => entry.slug === 'taipei')!;
  return <HospitalDirectoryPage emergency city={city} hospitals={hospitals.filter((hospital) => hospital.city === city.name && hospital.hasEmergencyService === true)} relatedCities={getCityDirectories(hospitals).filter((entry) => [city.slug, ...city.nearby].includes(entry.slug))} />;
}
