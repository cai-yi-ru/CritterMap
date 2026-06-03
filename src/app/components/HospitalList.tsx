import React from "react";
import type { Hospital } from '@/types/hospital';
import { getActiveAnnouncements } from '@/lib/hospitalAnnouncements';
import { getHospitalDisplayTags } from '@/lib/hospitalDisplayTags';
import PetIcon from './PetIcon';

interface HospitalListProps {
  hospitals: Hospital[];
  onHospitalClick: (hospital: Hospital) => void;
}

const HospitalList: React.FC<HospitalListProps> = ({ hospitals, onHospitalClick }) => {
  if (hospitals.length === 0) {
    return (
      <section className="rounded-[28px] border border-sage-100 bg-white/88 p-6 text-center shadow-soft">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-petal-100 text-xl">?</div>
        <h2 className="text-lg font-extrabold text-forest-900">沒有符合條件的醫院</h2>
        <p className="mt-2 text-sm leading-6 text-stone-500">可以放寬城市、寵物類別或營業條件後再試一次。</p>
      </section>
    );
  }

  return (
    <section className="flex max-h-[520px] flex-col rounded-[28px] border border-sage-100 bg-white/88 p-3 shadow-soft sm:max-h-[580px] lg:h-[640px] lg:max-h-none">
      <div className="flex items-center justify-between px-2 pb-3 pt-1">
        <div>
          <h2 className="text-lg font-extrabold text-forest-900">醫院清單</h2>
          <p className="text-xs font-medium text-stone-500">點擊卡片查看詳細資訊</p>
        </div>
        <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-bold text-forest-900">
          {hospitals.length} 間
        </span>
      </div>
      <div className="hide-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
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
        
        const visiblePets = hospital.pets?.slice(0, 4) || [];
        const remainingPetCount = hospital.pets && hospital.pets.length > 4
          ? hospital.pets.length - 4
          : 0;
        const activeAnnouncements = getActiveAnnouncements(hospital.announcements);
        const hasClosureAnnouncement = activeAnnouncements.some(announcement => announcement.type === 'closure');
        const specialClinicLabel = hospital.specialClinic?.hasExoticSpecialClinic
          ? hospital.specialClinic.label || '特寵特別門診'
          : '';
        const googleRating = hospital.google?.rating;
        const googleReviewCount = hospital.google?.reviewCount;
        const hospitalTypeTags = getHospitalDisplayTags(hospital);

        return (
          <article
            key={hospital.id}
            className="hospital-card cursor-pointer rounded-3xl border border-sage-100 bg-linen-50 p-4 transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white hover:shadow-soft"
            onClick={() => onHospitalClick(hospital)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-base font-extrabold leading-6 text-forest-900">{hospital.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-stone-600">{hospital.address}</p>
                {googleRating && (
                  <p className="mt-1 text-xs font-semibold text-stone-500">
                    Google 參考：★ {googleRating}
                    {typeof googleReviewCount === 'number' && ` · ${googleReviewCount.toLocaleString()} 則評論`}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1 rounded-2xl bg-white px-2.5 py-2 shadow-[0_4px_16px_rgba(61,91,74,0.08)]">
                {visiblePets.length > 0 ? (
                  <>
                    {visiblePets.map((pet) => (
                      <PetIcon key={pet} pet={pet} size="sm" />
                    ))}
                    {remainingPetCount > 0 && (
                      <span className="text-xs font-bold text-stone-500">+{remainingPetCount}</span>
                    )}
                  </>
                ) : (
                  <PetIcon pet="其他特寵" size="sm" />
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
                {hospitalTypeTags.map((tag) => (
                  <span key={tag} className="rounded-full bg-sage-100 px-2.5 py-1 text-xs font-bold text-forest-900">
                    {tag}
                  </span>
                ))}
                {hospital.emergency && (
                  <span className="rounded-full bg-petal-100 px-2.5 py-1 text-xs font-bold text-rose-700">24小時急診</span>
                )}
                {activeAnnouncements.length > 0 && (
                  <span className="rounded-full bg-honey-100 px-2.5 py-1 text-xs font-bold text-clay-700">
                    {hasClosureAnnouncement ? '休診公告' : '最新公告'}
                  </span>
                )}
                {specialClinicLabel && (
                  <span className="rounded-full bg-petal-100 px-2.5 py-1 text-xs font-bold text-rose-700">
                    {specialClinicLabel}
                  </span>
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
