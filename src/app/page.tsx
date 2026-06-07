
import HomeClient from './HomeClient';
import { getHospitals } from "@/lib/getHospitals";
import { getHospitalUpdates } from "@/lib/getHospitalUpdates";
import { filterHospitals, summarizeHospitals } from "@/lib/hospitalSearch";
import { defaultDescription, defaultTitle, siteName, siteUrl } from "@/lib/seo";

export const metadata = {
  title: defaultTitle,
  description: defaultDescription,
  alternates: {
    canonical: "/",
  },
};

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const [hospitals, updates] = await Promise.all([
    getHospitals(),
    getHospitalUpdates(30),
  ]);
  const embedValue = params?.embed;
  const embed = Array.isArray(embedValue)
    ? embedValue.includes('1') || embedValue.includes('true')
    : embedValue === '1' || embedValue === 'true';
  const cities = Array.from(new Set(hospitals.map((hospital) => hospital.city).filter(Boolean)));
  const pets = Array.from(
    new Set(hospitals.flatMap((hospital) => [...(hospital.pet_category_group || []), ...(hospital.pets || [])])),
  );
  const initialHospitals = summarizeHospitals(filterHospitals(hospitals, { city: "台北市", petCategory: "all" }));
  const updateHospitalIds = new Set(updates.map((update) => update.hospitalId));
  const updateHospitals = summarizeHospitals(hospitals.filter((hospital) => updateHospitalIds.has(hospital.id)));
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: siteName,
        url: siteUrl,
        inLanguage: "zh-Hant-TW",
        description: defaultDescription,
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/?city={city}&pet={pet}`,
          "query-input": ["name=city", "name=pet"],
        },
      },
      {
        "@type": "WebApplication",
        "@id": `${siteUrl}/#app`,
        name: "小獸所特寵醫院地圖",
        url: siteUrl,
        applicationCategory: "HealthApplication",
        operatingSystem: "Web",
        inLanguage: "zh-Hant-TW",
        description: "依縣市、寵物類別、營業狀態與預約條件查詢全台特寵動物醫院。",
      },
      {
        "@type": "Dataset",
        "@id": `${siteUrl}/#hospital-dataset`,
        name: "台灣特寵動物醫院資料",
        url: siteUrl,
        inLanguage: "zh-Hant-TW",
        description: `小獸所整理 ${hospitals.length} 間支援特殊寵物的動物醫院，涵蓋 ${cities.length} 個縣市與多種寵物分類。`,
        keywords: ["特寵醫院", "特殊寵物", "動物醫院", ...cities, ...pets.slice(0, 12)],
        isAccessibleForFree: true,
        creator: {
          "@type": "Organization",
          name: siteName,
          url: siteUrl,
        },
      },
    ],
  };

  return (
    <>
      {!embed && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <HomeClient
        embed={embed}
        initialHospitals={initialHospitals}
        initialUpdates={updates}
        initialUpdateHospitals={updateHospitals}
        hospitalCount={hospitals.length}
      />
    </>
  );
}
