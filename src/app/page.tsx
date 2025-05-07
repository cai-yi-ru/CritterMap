// 接下來是將你的 HTML 拆分為 Next.js 專案結構的版本，主要元件會包含：
// - pages/index.tsx (首頁)
// - components/Navbar.tsx (導覽列)
// - components/HospitalList.tsx
// - components/MapContainer.tsx
// - components/FilterPanel.tsx
// - components/HospitalModal.tsx
// 下面為首頁頁面 pages/index.tsx：

'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from './components/Navbar';
import FilterPanel from './components/FilterPanel';
import HospitalList from './components/HospitalList';
import HospitalModal from './components/HospitalModal';
import { hospitals } from '@/utils/hospitalList';

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone?: string;
  lat: number;
  lng: number;
  typeText: string;
  emergency?: boolean;
}

const MapPanel = dynamic(() => import('./components/MapPanel'), {
  ssr: false
});
export default function Home() {
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [city, setCity] = useState("all");
  const [type, setType] = useState("all");
  const [emergencyOnly, setEmergencyOnly] = useState(false);

  const handleSearch = () => {
    console.log("搜尋條件：", { city, type, emergencyOnly });
    // 你可以這裡接資料、呼叫 API 等等
  };

  // 初始載入醫院資料
  useEffect(() => {
    setFilteredHospitals(hospitals);
  }, []);

  return (
    <div className="bg-offwhite min-h-screen">
      <Navbar />
      <main className="pt-20 container mx-auto px-4 py-8">
        <header className="mb-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-mintdark mb-2">動物醫院地圖搜尋</h1>
              <p className="text-gray-600">尋找您附近的動物醫院，查看詳細資訊並獲取聯絡方式</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center justify-center md:justify-end space-x-2">
                <div className="w-3 h-3 rounded-full bg-mint"></div>
                <span className="text-sm text-gray-600">一般動物醫院</span>
                <div className="w-3 h-3 rounded-full bg-softpink ml-3"></div>
                <span className="text-sm text-gray-600">24小時急診</span>
              </div>
            </div>
          </div>
        </header>

        <FilterPanel onCityChange={setCity}
          onTypeChange={setType}
          onEmergencyToggle={setEmergencyOnly}
          onSearch={handleSearch} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="order-1 lg:order-2 lg:col-span-2 aspect-square lg:aspect-auto">
          <MapPanel hospitals={filteredHospitals} />
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
    </div>
  );
}