import React from "react";
import type { HospitalSummary } from '@/types/hospitalPublic';
import { Badge } from '@/components/ui/badge';
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
      <section className="rounded-2xl border border-sage-100 bg-card p-6 text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-petal-100 text-rose-700">
          <SearchXIcon className="size-6" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-extrabold text-forest-900">沒有符合條件的醫院</h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">可以放寬城市、寵物類別或營業條件後再試一次。</p>
      </section>
    );
  }

  return (
    <section aria-busy={loading} className="relative flex max-h-[520px] flex-col rounded-2xl border border-sage-100 bg-card p-3 sm:max-h-[580px] lg:h-[640px] lg:max-h-none">
      <div className="flex items-center justify-between px-2 pb-3 pt-1">
        <div>
          <h2 className="text-lg font-extrabold text-forest-900">醫院清單</h2>
          <p className="text-xs font-medium text-stone-600">點擊卡片查看詳細資訊</p>
        </div>
        <Badge variant="secondary" className="text-forest-900">
          {hospitals.length} 間
        </Badge>
      </div>
      <div className={`hide-scrollbar min-h-0 flex-1 overflow-y-auto pr-1 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      {hospitals.map((hospital) => {
        const visiblePets = hospital.pets || [];
        const uniquePets = Array.from(
          new Map(visiblePets.map((pet) => [getPetIconDefinition(pet).key, pet])).values(),
        ).slice(0, 4);
        const locationLabel = [hospital.city, hospital.district].filter(Boolean).join(" ");
        const reservationTone = hospital.reservationTone;

        return (
          <button
            type="button"
            key={hospital.id}
            aria-label={`查看${hospital.name}詳情`}
            className="block w-full border-b border-sage-100 bg-card p-4 text-left transition last:border-b-0 hover:bg-sage-50 focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sage-500"
            onClick={() => onHospitalClick(hospital)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-base font-extrabold leading-6 text-forest-900">{hospital.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-stone-600">{locationLabel || "地區整理中"}</p>
                {hospital.googleRating && (
                  <p className="mt-1 text-xs font-semibold text-stone-500">
                    Google 參考：★ {hospital.googleRating}
                    {typeof hospital.googleReviewCount === 'number' && ` · ${hospital.googleReviewCount.toLocaleString()} 則評論`}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1 rounded-xl border border-sage-100 bg-white px-2.5 py-2">
                {uniquePets.length > 0 ? (
                  <>
                    {uniquePets.map((pet) => (
                      <PetIcon key={pet} pet={pet} size="sm" />
                    ))}
                  </>
                ) : (
                  <PetIcon pet="其他特寵" size="sm" />
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
                {hospital.displayTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-forest-900">
                    {tag}
                  </Badge>
                ))}
                <Badge
                  className={
                    reservationTone === "required"
                      ? "bg-honey-100 text-clay-700"
                      : reservationTone === "walkIn"
                        ? "bg-sage-100 text-forest-900"
                        : "bg-white text-stone-600"
                  }
                  variant={reservationTone === "unknown" ? "outline" : "default"}
                >
                  {hospital.reservationLabel}
                </Badge>
                {hospital.hasEmergencyService && <Badge className="bg-petal-100 text-rose-700">夜間急診</Badge>}
                {hospital.hasActiveAnnouncement && (
                  <Badge className="bg-honey-100 text-clay-700">
                    {hospital.hasClosureAnnouncement ? '休診公告' : '最新公告'}
                  </Badge>
                )}
                {hospital.specialClinicLabel && (
                  <Badge className="bg-petal-100 text-rose-700">
                    {hospital.specialClinicLabel}
                  </Badge>
                )}
            </div>
          </button>
        );
      })}
      </div>
      {loading && (
        <div className="pointer-events-none absolute inset-3 grid place-items-center rounded-xl bg-white/70" aria-hidden="true">
          <span className="rounded-full bg-forest-900 px-4 py-2 text-sm font-bold text-white">正在更新結果</span>
        </div>
      )}
    </section>
  );
};

export default HospitalList;
