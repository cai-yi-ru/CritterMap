"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import {
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

function createHospitalIcon(isEmergency: boolean) {
  return new L.DivIcon({
    className: "hospital-marker-shell",
    html: `
      <span class="hospital-marker${isEmergency ? " hospital-marker--emergency" : ""}" aria-hidden="true">
        <img src="/icons/hospital-paw.webp" alt="" width="22" height="22" aria-hidden="true" />
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

  return (
    <section
      id="map-panel"
      aria-busy={loading}
      className={`relative flex flex-col overflow-hidden rounded-xl border border-sage-100 bg-card ${
        embed
          ? "h-[58vh] min-h-[360px]"
          : "h-[440px] sm:h-[520px] lg:h-[640px]"
      }`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-sage-100 px-4 py-3">
        <div>
          <h2 className="text-base font-semibold text-forest-900">地圖</h2>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600">
            <span>點擊標記查看摘要</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-forest-800" aria-hidden="true" />
              一般
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#b45353]" aria-hidden="true" />
              可詢問急診
            </span>
          </div>
        </div>
        <span className="shrink-0 text-sm font-semibold tabular-nums text-forest-900">
          {loading ? "更新中" : `${hospitals.length} 個標記`}
        </span>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        className="min-h-0 w-full flex-1"
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
                  className="block w-full pr-7 text-left text-base font-semibold leading-6 text-forest-900 transition-colors hover:text-sage-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500"
                  onClick={() => onHospitalClick?.(hospital)}
                >
                  {hospital.name}
                </button>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-700">
                  {[hospital.city, hospital.district].filter(Boolean).join(" ") || "地區整理中"}
                </p>
                {hospital.googleRating && (
                  <p className="mt-2 text-xs text-stone-600">
                    Google ★ {hospital.googleRating}
                    {typeof hospital.googleReviewCount === "number" &&
                      `（${hospital.googleReviewCount.toLocaleString()} 則評論）`}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs leading-5">
                  {hospital.displayTags.length > 0 && <span className="text-stone-600">{hospital.displayTags.join('、')}</span>}
                  {hospital.hasEmergencyService && (
                    <span className="font-semibold text-rose-700">可詢問急診</span>
                  )}
                </div>
                <button
                  type="button"
                  className="mt-4 w-full rounded-lg bg-forest-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2"
                  onClick={() => onHospitalClick?.(hospital)}
                >
                  查看醫院詳情
                </button>
              </div>
            </Popup>
          );

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
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[65px] z-10 grid place-items-center rounded-b-xl bg-white/70" aria-hidden="true">
          <span className="rounded-lg bg-forest-900 px-4 py-2 text-sm font-semibold text-white">正在更新結果</span>
        </div>
      )}
    </section>
  );
}
