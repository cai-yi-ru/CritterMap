"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// 動物醫院圖示 SVG - 使用腳印圖示
const petHospitalSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20">
        <path fill="currentColor" d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5.3-86.2 32.6-96.8S212.2 50 226.5 92.9zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"/>
    </svg>
`

const createHospitalIcon = (isEmergency) => {
  return new L.DivIcon({
    className: 'custom-marker',
    html: `
      <div style="background-color: ${isEmergency ? '#FADADD' : '#7CC4B2'}; width: 36px; height: 36px; display: flex; justify-content: center; align-items: center; border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.2); border: 2px solid white;">
        <div style="color: ${isEmergency ? '#B91C1C' : '#FFFFFF'}; width: 20px; height: 20px; display: flex; justify-content: center; align-items: center;">
          ${petHospitalSvg}
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center]);
  return null;
}

export default function MapPanel({ hospitals, center }) {
  useEffect(() => {
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
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        className="h-full w-full rounded-xl"
      >
        <MapUpdater center={center} />
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
