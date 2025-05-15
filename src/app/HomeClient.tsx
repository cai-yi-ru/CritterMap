
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from './components/Navbar';
import FilterPanel from './components/FilterPanel';
import HospitalList from './components/HospitalList';
import HospitalModal from './components/HospitalModal';
import Footer from './components/Footer';
import DisclaimerSection from './components/DisclaimerSection';

import { getHospitals } from '@/lib/getHospitals';
import type { Hospital } from '@/types/hospital';

export const metadata = {
  title: '小獸所｜特寵醫院地圖查詢平台',
  description: '查詢全台支援特殊寵物的動物醫院地圖與資訊。',
};
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
const cityCenterMap: Record<string, [number, number]> = {
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

export default function HomeClient() {
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [allHospitals, setAllHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [city, setCity] = useState("台北市");
  const [type, setType] = useState("all");
  const [mapCenter, setMapCenter] = useState<[number, number]>(cityCenterMap['all']);
  const [reservationRequiredOnly, setReservationRequiredOnly] = useState(false);
  const [openNowOnly, setOpenNowOnly] = useState(false);

//   const handleCityChange = (selectedCity: string) => {
//     setCity(selectedCity);
//     const newCenter = cityCenterMap[selectedCity] || cityCenterMap['all'];
//     setMapCenter(newCenter);
//   };
  const handleSearch = () => {
    // console.log("搜尋條件：", { city, type, reservationRequiredOnly, openNowOnly });
    // console.log('allHospitals',allHospitals);
    
    let filtered = allHospitals;
  
    // 篩選城市
    if (city !== 'all') {
      filtered = filtered.filter(h => h.city === city);
    }
  
    // 篩選支援寵物類別
    if (type !== 'all') {
      filtered = filtered.filter(h => h.pet_category_group?.includes(type));
    }
  
    // 篩選是否非預約制
    if (reservationRequiredOnly) {
      filtered = filtered.filter(h => h.reservationRequired === false);
    }
  
    // 篩選是否目前營業
    if (openNowOnly) {
      filtered = filtered.filter(h => isOpenNow(h.business_hours));
    }
  
    // console.log('filteredHospitals', filtered);
    setFilteredHospitals(filtered);
    const newCenter = cityCenterMap[city] || cityCenterMap['all'];
    setMapCenter(newCenter);
  };

  // 初始載入醫院資料
  useEffect(() => {
    async function fetchHospitals() {
      const hospitals = await getHospitals();
      setAllHospitals(hospitals);
      setFilteredHospitals(hospitals)
      handleSearch()
    }
    fetchHospitals();
  }, []);
  useEffect(() => {
    handleSearch()
  }, [allHospitals]);

  return (
    <div className="bg-offwhite min-h-screen">
      <Navbar />
      <main className="pt-20 container mx-auto px-4 py-8">
        <header className="mb-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-mintdark mb-2">特寵動物醫院地圖查詢</h1>
              <p className="text-gray-600">尋找您附近的特寵動物醫院，查看詳細資訊並獲取聯絡方式</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center justify-center md:justify-end space-x-2">
                <div className="w-3 h-3 rounded-full bg-mint"></div>
                <span className="text-sm text-gray-600">一般動物醫院</span>
                <div className="w-3 h-3 rounded-full bg-softpink ml-3"></div>
                <span className="text-sm text-gray-600">夜間急診</span>
              </div>
            </div>
          </div>
        </header>
        
        <FilterPanel onCityChange={setCity}
          onPetCategoryChange={setType}
          onReservationRequiredToggle={setReservationRequiredOnly}
          onOpenNowToggle={setOpenNowOnly}
          onSearch={handleSearch} />
        {/* <div className='my-3'>目前共整理：{allHospitals.length}間，特寵動物醫院</div> */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="order-1 lg:order-2 lg:col-span-2 aspect-square lg:aspect-auto">
          <MapPanel hospitals={filteredHospitals} center={mapCenter}/>
        </div>

        {/* 清單在手機時 order-2，桌機時 order-1 */}
        <div className="order-2 lg:order-1">
          <HospitalList hospitals={filteredHospitals} onHospitalClick={setSelectedHospital} />
        </div>
        </div>
      </main>

      {selectedHospital && (
        <HospitalModal hospital={selectedHospital} onClose={() => setSelectedHospital(null)} />
      )}
      <DisclaimerSection></DisclaimerSection>
      <Footer></Footer>
    </div>
  );
}