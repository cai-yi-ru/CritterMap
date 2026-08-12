"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import type { HospitalSummary } from "@/types/hospitalPublic";

type MapPanelProps = {
  hospitals: HospitalSummary[];
  center: [number, number];
  zoom?: number;
  onHospitalClick?: (hospital: HospitalSummary) => void;
  embed?: boolean;
  loading?: boolean;
};

type MapUpdaterProps = {
  center: [number, number];
  zoom: number;
};

const markerPalette = {
  standard: {
    fill: "#2f5d50",
    ring: "#ffffff",
  },
  emergency: {
    fill: "#b45353",
    ring: "#ffffff",
  },
};

function createHospitalIcon(isEmergency: boolean) {
  const label = isEmergency ? "可詢問急診服務的醫院" : "動物醫院";

  return new L.DivIcon({
    className: "hospital-marker-shell",
    html: `
      <span class="hospital-marker${isEmergency ? " hospital-marker--emergency" : ""}" role="img" aria-label="${label}">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18">
          <path fill="currentColor" d="M7.4 9.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Zm9.2 0a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4ZM4 13.1a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm16 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-8 6.1c3.8 0 6.1-1.5 6.1-3.8 0-1.8-1.7-3.1-3-4.1-1.1-.9-1.8-1.4-3.1-1.4s-2 .5-3.1 1.4c-1.3 1-3 2.3-3 4.1 0 2.3 2.3 3.8 6.1 3.8Z" />
        </svg>
      </span>
    `,
    iconSize: [34, 40],
    iconAnchor: [17, 38],
    popupAnchor: [0, -36],
  });
}

function MapUpdater({ center, zoom }: MapUpdaterProps) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, map, zoom]);

  return null;
}

export default function MapPanel({
  hospitals,
  center,
  zoom = 12,
  onHospitalClick,
  embed = false,
  loading = false,
}: MapPanelProps) {
  const standardIcon = useMemo(() => createHospitalIcon(false), []);
  const emergencyIcon = useMemo(() => createHospitalIcon(true), []);
  const useCompactPoints = hospitals.length > 80;

  return (
    <section
      id="map-panel"
      aria-busy={loading}
      className={`relative flex flex-col rounded-2xl border border-sage-100 bg-card p-3 ${
        embed
          ? "h-[58vh] min-h-[360px]"
          : "h-[440px] sm:h-[520px] lg:h-[640px]"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <div>
          <h2 className="text-lg font-extrabold text-forest-900">地圖</h2>
          <p className="text-xs font-medium text-stone-600">
            {useCompactPoints ? "縮小地圖時以圓點顯示，放大後較容易辨識院所" : "點擊標記查看醫院摘要"}
          </p>
        </div>
        <span className="rounded-full border border-sage-100 bg-sage-50 px-3 py-1 text-xs font-bold text-forest-900">
          {loading ? "更新中" : `${hospitals.length} 個標記`}
        </span>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="min-h-0 w-full flex-1 rounded-xl"
      >
        <MapUpdater center={center} zoom={zoom} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />

        {hospitals.map((hospital) => {
          const popup = (
            <Popup>
              <div className="min-w-[220px] max-w-[280px]">
                <button
                  type="button"
                  className="block w-full pr-7 text-left text-base font-extrabold leading-6 text-forest-900 transition hover:text-sage-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
                  onClick={() => onHospitalClick?.(hospital)}
                >
                  {hospital.name}
                </button>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-700">
                  {[hospital.city, hospital.district].filter(Boolean).join(" ") || "地區整理中"}
                </p>
                {hospital.googleRating && (
                  <p className="mt-2 text-xs font-semibold text-stone-600">
                    Google 參考：★ {hospital.googleRating}
                    {typeof hospital.googleReviewCount === "number" &&
                      ` · ${hospital.googleReviewCount.toLocaleString()} 則評論`}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {hospital.displayTags.map((tag) => (
                    <span key={tag} className="rounded-full bg-sage-100 px-2.5 py-1 text-xs font-bold text-forest-900">
                      {tag}
                    </span>
                  ))}
                  {hospital.hasEmergencyService && (
                    <span className="rounded-full bg-petal-100 px-2.5 py-1 text-xs font-bold text-rose-700">
                      可詢問急診
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="mt-4 w-full rounded-lg bg-forest-800 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-forest-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2"
                  onClick={() => onHospitalClick?.(hospital)}
                >
                  查看醫院詳情
                </button>
              </div>
            </Popup>
          );

          if (useCompactPoints) {
            const palette = hospital.hasEmergencyService
              ? markerPalette.emergency
              : markerPalette.standard;

            return (
              <CircleMarker
                key={hospital.id}
                center={[hospital.lat, hospital.lng]}
                radius={hospital.hasEmergencyService ? 7 : 6}
                pathOptions={{
                  color: palette.ring,
                  weight: 2,
                  fillColor: palette.fill,
                  fillOpacity: 0.9,
                }}
              >
                {popup}
              </CircleMarker>
            );
          }

          return (
            <Marker
              key={hospital.id}
              position={[hospital.lat, hospital.lng]}
              icon={hospital.hasEmergencyService ? emergencyIcon : standardIcon}
              title={hospital.name}
              alt={hospital.hasEmergencyService ? `${hospital.name}，可詢問急診服務` : hospital.name}
            >
              {popup}
            </Marker>
          );
        })}
      </MapContainer>

      {loading && (
        <div className="pointer-events-none absolute inset-x-3 bottom-3 top-[59px] z-10 grid place-items-center rounded-xl bg-white/70" aria-hidden="true">
          <span className="rounded-full bg-forest-900 px-4 py-2 text-sm font-bold text-white">正在更新結果</span>
        </div>
      )}
    </section>
  );
}
