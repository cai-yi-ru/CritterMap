
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from './components/Navbar';
import FilterPanel from './components/FilterPanel';
import HospitalList from './components/HospitalList';
import HospitalModal from './components/HospitalModal';
import HospitalUpdates from './components/HospitalUpdates';
import HospitalUpdateSheet from './components/HospitalUpdateSheet';
import Footer from './components/Footer';
import DisclaimerSection from './components/DisclaimerSection';
import SponsoredSlot from './components/SponsoredSlot';

import { getHospitals } from '@/lib/getHospitals';
import { getHospitalUpdates } from '@/lib/getHospitalUpdates';
import { getCanonicalPetCategory } from '@/lib/petIcons';
import type { Hospital, HospitalUpdate } from '@/types/hospital';

const MapPanel = dynamic(() => import('./components/MapPanel'), {
  ssr: false
});

/** 判斷跨日改良版 */
function isOpenNow(businessHours?: Record<string, string[]>): boolean {
  if (!businessHours) return false;

  const now = new Date();
  const dayIndex = now.getDay(); // 0 是 Sunday
  const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const currentWeekday = weekdays[dayIndex];
  const previousWeekday = weekdays[(dayIndex + 6) % 7];

  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const checkPeriods = [
    ...(businessHours[currentWeekday] || []),
    ...(businessHours[previousWeekday] || []).filter(period => {
      const [start, end] = period.split('-');
      const [startH, startM] = start.split(':').map(Number);
      const [endH, endM] = end.split(':').map(Number);
      return (endH * 60 + endM) < (startH * 60 + startM); // 跨夜時段才會考慮
    }).map(period => {
      const [start, end] = period.split('-');
      return [`-1d ${start}`, end]; // 標記為昨天的跨夜時段
    }),
  ];

  return checkPeriods.some(period => {
    let [start, end] = typeof period === 'string' ? period.split('-') : period;

    const isPreviousDay = start.startsWith('-1d');
    if (isPreviousDay) {
      start = start.replace('-1d ', '');
    }

    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (isPreviousDay) {
      // 跨夜情況：現在時間必須小於 end
      return nowMinutes <= endMinutes;
    } else if (endMinutes < startMinutes) {
      // 當日跨夜：例如 22:00–01:00
      return nowMinutes >= startMinutes || nowMinutes <= endMinutes;
    } else {
      return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
    }
  });
}
export const cityCenterMap: Record<string, [number, number]> = {
    "基隆市": [25.1283, 121.7419],
    "台北市": [25.0330, 121.5654],
    "新北市": [25.0169, 121.4628],
    "桃園市": [24.9937, 121.3000],
    "新竹市": [24.8039, 120.9647],
    "新竹縣": [24.7039, 121.1252],
    "苗栗縣": [24.5602, 120.8214],
    "台中市": [24.1477, 120.6736],
    "彰化縣": [24.0685, 120.5571],
    "南投縣": [23.8388, 120.9876],
    "雲林縣": [23.7092, 120.4313],
    "嘉義市": [23.4801, 120.4491],
    "嘉義縣": [23.4589, 120.5740],
    "台南市": [22.999150190097566, 120.21641191482486],
    "高雄市": [22.6273, 120.3014],
    "屏東縣": [22.6687, 120.5048],
    "宜蘭縣": [24.7021, 121.7378],
    "花蓮縣": [23.9872, 121.6015],
    "台東縣": [23.023905725774426, 121.17445934255785],
    "澎湖縣": [23.5713, 119.5798],
    "金門縣": [24.4321, 118.3171],
    "連江縣": [26.1608, 119.9484],
    "all": [23.7, 120.9]
}

type HomeClientProps = {
  embed?: boolean;
  initialHospitals?: Hospital[];
  initialUpdates?: HospitalUpdate[];
};

export default function HomeClient({ embed = false, initialHospitals = [], initialUpdates = [] }: HomeClientProps) {
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>(initialHospitals);
  const [allHospitals, setAllHospitals] = useState<Hospital[]>(initialHospitals);
  const [hospitalUpdates, setHospitalUpdates] = useState<HospitalUpdate[]>(initialUpdates);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedUpdate, setSelectedUpdate] = useState<{ update: HospitalUpdate; hospital: Hospital } | null>(null);
  const [city, setCity] = useState("台北市");
  const [type, setType] = useState("all");
  const [mapCenter, setMapCenter] = useState<[number, number]>(cityCenterMap['all']);
  const [reservationRequiredOnly, setReservationRequiredOnly] = useState(false);
  const [openNowOnly, setOpenNowOnly] = useState(false);

  const handleSearch = () => {    
    let filtered = allHospitals;

    if (city !== 'all') {
      filtered = filtered.filter(h => h.city === city);
    }

    if (type !== 'all') {
      filtered = filtered.filter(h => {
        const categories = [...(h.pet_category_group || []), ...(h.pets || [])];
        return categories.some(category => getCanonicalPetCategory(category) === type);
      });
    }

    if (reservationRequiredOnly) {
      filtered = filtered.filter(h => h.reservationRequired === false);
    }

    if (openNowOnly) {
      filtered = filtered.filter(h => isOpenNow(h.business_hours));
    }

    setFilteredHospitals(filtered);
    const newCenter = cityCenterMap[city] || cityCenterMap['all'];
    setMapCenter(newCenter);
  };

  // 初始載入醫院資料
  useEffect(() => {
    if (initialHospitals.length > 0) {
      return;
    }

    async function fetchHospitals() {
      const [hospitals, updates] = await Promise.all([
        getHospitals(),
        getHospitalUpdates(30),
      ]);
      setAllHospitals(hospitals);
      setFilteredHospitals(hospitals)
      setHospitalUpdates(updates);
    }
    fetchHospitals();
  }, [initialHospitals.length]);
  useEffect(() => {
    handleSearch()
  }, [allHospitals, city, type, reservationRequiredOnly, openNowOnly]);

  const totalLabel = allHospitals.length > 0 ? `${allHospitals.length} 間` : '整理中';
  const resultLabel = filteredHospitals.length > 0 ? `${filteredHospitals.length} 間符合` : '沒有符合結果';

  return (
    <div className={`site-shell min-h-screen ${embed ? 'embed-shell' : ''}`}>
      {!embed && <Navbar />}
      <main className={embed ? "mx-auto w-full max-w-6xl px-3 py-3 sm:px-5" : "mx-auto w-full max-w-7xl px-4 pb-12 pt-20 sm:px-6 lg:px-8"}>
        <header className={embed ? "mb-4 rounded-2xl border border-sage-100 bg-card p-4" : "mb-5 rounded-2xl border border-sage-100 bg-card p-5 sm:p-6"}>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sage-100 bg-sage-50 px-3 py-1 text-xs font-semibold text-forest-900">
                全台特寵醫療資訊整理
              </div>
              <h1 className="text-balance text-3xl font-extrabold tracking-normal text-forest-900 sm:text-4xl">
                特寵動物醫院地圖查詢
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-stone-600 sm:text-base">
                依縣市、寵物類別、是否營業與預約條件快速篩選。出發前仍請致電醫院確認看診時段與收案狀況。
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
              <div className="rounded-xl border border-sage-100 bg-sage-50 px-4 py-3">
                <div className="text-xs font-medium text-stone-500">目前整理</div>
                <div className="text-xl font-extrabold text-forest-900">{totalLabel}</div>
              </div>
              <div className="rounded-xl border border-honey-200 bg-honey-100 px-4 py-3">
                <div className="text-xs font-medium text-stone-500">搜尋結果</div>
                <div className="text-xl font-extrabold text-forest-900">{resultLabel}</div>
              </div>
            </div>
          </div>
        </header>
        
        <FilterPanel
          city={city}
          petCategory={type}
          reservationRequiredOnly={reservationRequiredOnly}
          openNowOnly={openNowOnly}
          compact={embed}
          onCityChange={setCity}
          onPetCategoryChange={setType}
          onReservationRequiredToggle={setReservationRequiredOnly}
          onOpenNowToggle={setOpenNowOnly}
          onSearch={handleSearch} />

        <div className={embed ? "grid grid-cols-1 gap-4" : "grid grid-cols-1 gap-5 lg:grid-cols-[minmax(320px,420px)_1fr]"}>
          <aside className={embed ? "order-2" : "order-2 lg:order-1"}>
            <HospitalList hospitals={filteredHospitals} onHospitalClick={setSelectedHospital} />
          </aside>
          <section className={embed ? "order-1" : "order-1 lg:order-2"}>
            <MapPanel hospitals={filteredHospitals} center={mapCenter} onHospitalClick={setSelectedHospital} embed={embed} />
          </section>
        </div>

        {!embed && (
          <>
            <SponsoredSlot context="home" className="mt-5" />
            <HospitalUpdates
              updates={hospitalUpdates}
              hospitals={allHospitals}
              onUpdateClick={(update, hospital) => setSelectedUpdate({ update, hospital })}
            />
          </>
        )}
      </main>

      <HospitalUpdateSheet
        update={selectedUpdate?.update || null}
        hospital={selectedUpdate?.hospital || null}
        open={Boolean(selectedUpdate)}
        onOpenChange={(open) => {
          if (!open) setSelectedUpdate(null);
        }}
        onViewHospitalDetail={(hospital) => {
          setSelectedUpdate(null);
          setSelectedHospital(hospital);
        }}
      />

      {selectedHospital && (
        <HospitalModal hospital={selectedHospital} onClose={() => setSelectedHospital(null)} />
      )}
      {!embed && <DisclaimerSection />}
      {!embed && <Footer />}
    </div>
  );
}
