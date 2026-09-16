import React from "react";
import type { HospitalSummary } from '@/types/hospitalPublic';
import { SearchXIcon } from 'lucide-react';
import { getPetIconDefinition } from '@/lib/petIcons';
import PetIcon from './PetIcon';

interface HospitalListProps {
  hospitals: HospitalSummary[];
  onHospitalClick: (hospital: HospitalSummary) => void;
  loading?: boolean;
}

const HospitalList: React.FC<HospitalListProps> = ({ hospitals, onHospitalClick, loading = false }) => {
  if (hospitals.length === 0) {
    return (
      <section className="rounded-xl border border-sage-100 bg-card p-6 text-center">
        <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-lg bg-petal-100 text-rose-700">
          <SearchXIcon className="size-6" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold text-forest-900">沒有符合條件的醫院</h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">可以放寬城市、寵物類別或營業條件後再試一次。</p>
      </section>
    );
  }

  return (
    <section aria-busy={loading} className="relative flex max-h-[520px] flex-col rounded-xl border border-sage-100 bg-card sm:max-h-[580px] lg:h-[640px] lg:max-h-none">
      <div className="flex items-center justify-between border-b border-sage-100 px-4 py-3">
        <div>
          <h2 className="text-base font-semibold text-forest-900">醫院清單</h2>
          <p className="text-xs font-medium text-stone-600">點擊卡片查看詳細資訊</p>
        </div>
        <span className="text-sm font-semibold tabular-nums text-forest-900">{hospitals.length} 間</span>
      </div>
      <div className={`hide-scrollbar min-h-0 flex-1 overflow-y-auto transition-opacity ${loading ? 'opacity-50' : ''}`}>
      {hospitals.map((hospital) => {
        const visiblePets = hospital.pets || [];
        const uniquePets = Array.from(
          new Map(visiblePets.map((pet) => {
            const definition = getPetIconDefinition(pet);
            return [definition.key, definition];
          })).values(),
        ).slice(0, 3);
        const locationLabel = [hospital.city, hospital.district].filter(Boolean).join(" ");
        const reservationTone = hospital.reservationTone;

        return (
          <button
            type="button"
            key={hospital.id}
            aria-label={`查看${hospital.name}詳情`}
            className="block w-full border-b border-sage-100 bg-card px-4 py-4 text-left transition-colors last:border-b-0 hover:bg-sage-50/70 focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sage-500"
            onClick={() => onHospitalClick(hospital)}
          >
            <div className="min-w-0">
              <h3 className="text-base font-semibold leading-6 text-forest-900">{hospital.name}</h3>
              <p className="mt-0.5 line-clamp-2 text-sm leading-6 text-stone-600">{locationLabel || "地區整理中"}</p>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs leading-5">
              <span className="text-stone-600">{hospital.displayTags.join('、')}</span>
              <span
                className={
                  reservationTone === "required"
                    ? "font-semibold text-clay-700"
                    : reservationTone === "walkIn"
                      ? "font-semibold text-forest-800"
                      : "text-stone-500"
                }
              >
                {hospital.reservationLabel}
              </span>
              {hospital.hasEmergencyService && <span className="font-semibold text-rose-700">可詢問夜間急診</span>}
              {hospital.hasActiveAnnouncement && (
                <span className="font-semibold text-clay-700">
                  {hospital.hasClosureAnnouncement ? '有休診公告' : '有最新公告'}
                </span>
              )}
              {hospital.specialClinicLabel && <span className="font-semibold text-rose-700">{hospital.specialClinicLabel}</span>}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-sage-100 pt-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600">
                {uniquePets.length > 0 ? (
                  uniquePets.map((pet) => (
                    <span key={pet.key} className="inline-flex items-center gap-1">
                      <PetIcon pet={pet.label} size="sm" />
                      <span>{pet.label}</span>
                    </span>
                  ))
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <PetIcon pet="其他特寵" size="sm" />
                    <span>其他特寵</span>
                  </span>
                )}
              </div>
              {hospital.googleRating && (
                <span className="text-xs text-stone-500">
                  Google ★ {hospital.googleRating}
                  {typeof hospital.googleReviewCount === 'number' && `（${hospital.googleReviewCount.toLocaleString()} 則）`}
                </span>
              )}
            </div>
          </button>
        );
      })}
      </div>
      {loading && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center rounded-xl bg-white/75" aria-hidden="true">
          <span className="rounded-lg bg-forest-900 px-4 py-2 text-sm font-semibold text-white">正在更新結果</span>
        </div>
      )}
    </section>
  );
};

export default HospitalList;
