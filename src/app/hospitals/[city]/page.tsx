import { notFound } from 'next/navigation';
import { getHospitals } from '@/lib/getHospitals';
import { getCityDescription, getCityDirectories } from '@/lib/hospitalDirectory';
import { directoryMetadata } from '@/lib/seo';
import HospitalDirectoryPage from '@/app/components/HospitalDirectoryPage';

export const revalidate = 300;
export const dynamicParams = false;
type Props = { params: Promise<{ city: string }> };

export async function generateStaticParams() {
  return getCityDirectories(await getHospitals()).map((city) => ({ city: city.slug }));
}

async function getDirectory(slug: string) {
  const directories = getCityDirectories(await getHospitals());
  const city = directories.find((entry) => entry.slug === slug);
  if (!city) notFound();
  return { city, relatedCities: directories.filter((entry) => city.nearby.includes(entry.slug)) };
}

export async function generateMetadata({ params }: Props) {
  const { city } = await getDirectory((await params).city);
  return directoryMetadata(`${city.label}特寵醫院｜${city.hospitals.length} 間電話、地址與看診物種`, getCityDescription(city, city.hospitals), `/hospitals/${city.slug}`);
}

export default async function CityPage({ params }: Props) {
  const { city, relatedCities } = await getDirectory((await params).city);
  return <HospitalDirectoryPage city={city} hospitals={city.hospitals} relatedCities={relatedCities} />;
}
