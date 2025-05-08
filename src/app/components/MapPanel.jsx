"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
// 建立自訂 icon
const createHospitalIcon = (isEmergency) => {
  return new L.DivIcon({
    className: 'custom-marker',
    html: `
      <div style="background-color: ${isEmergency ? '#FADADD' : '#7CC4B2'}; width: 36px; height: 36px; display: flex; justify-content: center; align-items: center; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.2); border: 2px solid white;">
        <div style="color: ${isEmergency ? '#B91C1C' : '#FFFFFF'}; width: 20px; height: 20px; display: flex; justify-content: center; align-items: center;">
          🐾
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

export default function MapPanel({ hospitals }) {
  useEffect(() => {
    // 修復 leaflet icon 無預設圖示問題
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '',
      iconUrl: '',
      shadowUrl: '',
    });
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 aspect-square min-h-[300px] lg:aspect-auto lg:h-[600px]">

    <MapContainer
        key="main-map"
      center={[22.622448929879802, 120.3331298763747]}
      zoom={13}
      scrollWheelZoom={true}
      className="h-full w-full rounded-xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />

      {hospitals.map(hospital => (
        <Marker
          key={hospital.id}
          position={[hospital.lat, hospital.lng]}
          icon={createHospitalIcon(hospital.hasEmergencyService)}
        >
          <Popup>
            <div>
              <h3 className="font-bold text-mintdark text-xl">{hospital.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{hospital.address}</p>
              <div className="text-xs mt-1">
                {hospital.typeText} {hospital.hasEmergencyService && <span className="text-red-500 ml-2">夜間急診</span>}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
    </div>
  );
}