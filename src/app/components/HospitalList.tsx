import React from "react";
import type { HospitalSummary } from '@/types/hospitalPublic';
import { Badge } from '@/components/ui/badge';
import PetIcon from './PetIcon';

interface HospitalListProps {
  hospitals: HospitalSummary[];
  onHospitalClick: (hospital: HospitalSummary) => void;
}

const HospitalList: React.FC<HospitalListProps> = ({ hospitals, onHospitalClick }) => {
  if (hospitals.length === 0) {
    return (
      <section className="rounded-2xl border border-sage-100 bg-card p-6 text-center">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-petal-100 text-xl">?</div>
        <h2 className="text-lg font-extrabold text-forest-900">沒有符合條件的醫院</h2>
        <p className="mt-2 text-sm leading-6 text-stone-500">可以放寬城市、寵物類別或營業條件後再試一次。</p>
      </section>
    );
  }

  return (
    <section className="flex max-h-[520px] flex-col rounded-2xl border border-sage-100 bg-card p-3 sm:max-h-[580px] lg:h-[640px] lg:max-h-none">
      <div className="flex items-center justify-between px-2 pb-3 pt-1">
        <div>
          <h2 className="text-lg font-extrabold text-forest-900">醫院清單</h2>
          <p className="text-xs font-medium text-stone-500">點擊卡片查看詳細資訊</p>
        </div>
        <Badge variant="secondary" className="text-forest-900">
          {hospitals.length} 間
        </Badge>
      </div>
      <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto pr-1">
      {hospitals.map((hospital) => {
        // const ratingValue = hospital.google?.rating ? Number(hospital.google.rating) : undefined;
        // const fullStars = ratingValue ? Math.floor(ratingValue) : 0;
        // const hasHalfStar = ratingValue ? ratingValue % 1 >= 0.5 : false;

        // let starsHtml = "";
        // for (let i = 0; i < 5; i++) {
        //   if (i < fullStars) {
        //     starsHtml += "★";
        //   } else if (i === fullStars && hasHalfStar) {
        //     starsHtml += "<span style='opacity:0.5'>★</span>";
        //   } else {
        //     starsHtml += "<span style='opacity:0.2'>★</span>";
        //   }
        // }
        
        const visiblePets = hospital.pets || [];
        const locationLabel = [hospital.city, hospital.district].filter(Boolean).join(" ");
        const reservationTone = hospital.reservationTone;

        return (
          <article
            key={hospital.id}
            className="cursor-pointer border-b border-sage-100 bg-card p-4 transition last:border-b-0 hover:bg-sage-50"
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
                {visiblePets.length > 0 ? (
                  <>
                    {visiblePets.map((pet) => (
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
          </article>
        );
      })}
      </div>
    </section>
  );
};

export default HospitalList;
