import { useEffect, useRef, useState } from "react";
import type { HospitalSummary } from '@/types/hospitalPublic';
import { ChevronRightIcon, SearchXIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getHospitalPetPreview } from '@/lib/hospitalPetPreview';
import PetIcon from './PetIcon';

interface HospitalListProps {
  hospitals: HospitalSummary[];
  onHospitalClick: (hospital: HospitalSummary) => void;
  loading?: boolean;
  onReset?: () => void;
  selectedPet?: string;
  paginate?: boolean;
}

const PAGE_SIZE = 10;

export default function HospitalList({ hospitals, onHospitalClick, loading = false, onReset, selectedPet = 'all', paginate = true }: HospitalListProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const nextFocusIndex = useRef<number | null>(null);
  const firstNewCard = useRef<HTMLButtonElement | null>(null);
  const visibleHospitals = paginate ? hospitals.slice(0, visibleCount) : hospitals;

  useEffect(() => {
    if (nextFocusIndex.current !== null) {
      firstNewCard.current?.focus();
      nextFocusIndex.current = null;
    }
  }, [visibleCount]);

  if (hospitals.length === 0) {
    return (
      <section aria-busy={loading} className="rounded-xl border border-border bg-card px-6 py-12 text-center">
        <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-lg bg-petal-100 text-rose-700">
          <SearchXIcon className="size-6" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold text-forest-900">{loading ? '正在搜尋醫院' : '沒有符合條件的醫院'}</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">試著選擇鄰近縣市，或取消營業與掛號條件。</p>
        {onReset && <Button className="mt-5 min-h-11" variant="outline" onClick={onReset} disabled={loading}>清除條件，查看全部醫院</Button>}
      </section>
    );
  }

  return (
    <section aria-busy={loading} aria-label="醫院清單" className="relative flex flex-col rounded-xl border border-border bg-card lg:h-[640px] lg:overflow-hidden">
      <div className="flex items-center justify-between border-b border-sage-100 px-4 py-3">
        <div>
          <h2 className="text-base font-semibold text-forest-900">醫院清單</h2>
          <p className="mt-1 text-sm text-muted-foreground">查看電話、門診與看診物種</p>
        </div>
        <span className="text-sm font-semibold tabular-nums text-forest-900">{hospitals.length} 間</span>
      </div>
      <div className={`min-h-0 flex-1 rounded-b-xl lg:overflow-y-auto transition-opacity ${loading ? 'opacity-50' : ''}`}>
      {visibleHospitals.map((hospital, index) => {
        const petPreview = getHospitalPetPreview(hospital.pets || [], selectedPet);
        const locationLabel = [hospital.city, hospital.district].filter(Boolean).join(" ");
        const reservationTone = hospital.reservationTone;

        return (
          <button
            type="button"
            key={hospital.id}
            ref={(element) => { if (index === nextFocusIndex.current) firstNewCard.current = element; }}
            className="block w-full scroll-mt-20 border-b border-sage-100 px-4 py-4 text-left transition-colors last:rounded-b-xl last:border-b-0 hover:bg-sage-50/70 focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sage-500"
            disabled={loading}
            onClick={() => onHospitalClick(hospital)}
          >
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold leading-7 text-forest-900">{hospital.name}</h3>
                <ChevronRightIcon className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              </div>
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
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-stone-600">
                {petPreview.visible.length > 0 ? (
                  petPreview.visible.map((pet) => (
                    <span key={pet.key} className={`inline-flex items-center gap-1 ${pet.key === petPreview.selectedKey ? 'rounded-md bg-secondary px-1.5 py-0.5 font-semibold text-foreground' : ''}`}>
                      <PetIcon pet={pet.label} size="sm" decorative />
                      <span>{pet.label}</span>
                    </span>
                  ))
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <PetIcon pet="其他特寵" size="sm" decorative />
                    <span>其他特寵</span>
                  </span>
                )}
                {petPreview.remaining > 0 && <span className="text-xs text-muted-foreground">＋{petPreview.remaining} 種<span className="sr-only">，開啟醫院詳情查看</span></span>}
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
      {paginate && hospitals.length > PAGE_SIZE && (
        <div className="rounded-b-xl border-t border-border px-4 py-4 text-center">
          <p role="status" className="text-xs text-muted-foreground">已顯示 {visibleHospitals.length} / {hospitals.length} 間醫院</p>
          {visibleCount < hospitals.length && <Button type="button" variant="outline" disabled={loading} className="mt-3 min-h-11 w-full" onClick={() => { nextFocusIndex.current = visibleCount; setVisibleCount((count) => count + PAGE_SIZE); }}>再顯示 {Math.min(PAGE_SIZE, hospitals.length - visibleCount)} 間醫院</Button>}
        </div>
      )}
      {loading && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center rounded-xl bg-white/75" aria-hidden="true">
          <span className="rounded-lg bg-forest-900 px-4 py-2 text-sm font-semibold text-white">正在更新結果</span>
        </div>
      )}
    </section>
  );
}
