import React from "react";
import type { Hospital } from '@/types/hospital';
import { getActiveAnnouncements } from '@/lib/hospitalAnnouncements';
import { getHospitalTypeDisplayText } from '@/lib/hospitalTypeText';

interface HospitalListProps {
  hospitals: Hospital[];
  onHospitalClick: (hospital: Hospital) => void;
}

const petEmojis: Record<string, string> = {
  "貓": "🐱",
  "狗": "🐶",
  "犬": "🐶",
  "倉鼠": "🐹",
  "鼠": "🐹",
  "兔子": "🐰",
  "兔": "🐰",
  "鳥類": "🦜",
  "鳥": "🦜",
  "爬蟲類": "🦎",
  "刺蝟": "🦔"
};

const HospitalList: React.FC<HospitalListProps> = ({ hospitals, onHospitalClick }) => {
  if (hospitals.length === 0) {
    return <div className="text-center py-8 text-gray-500">沒有符合條件的動物醫院</div>;
  }

  return (
    <div className="mx-auto space-y-4 overflow-y-auto max-h-[600px] pr-2 hospital-list-container">
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
        
        let petIcons = hospital.pets?hospital.pets.slice(0, 4).map(p => petEmojis[p] || "").join(" "):"";
        if (hospital.pets && hospital.pets.length > 4) {
          petIcons += ` +${hospital.pets.length - 4}`;
        }
        const activeAnnouncements = getActiveAnnouncements(hospital.announcements);
        const hasClosureAnnouncement = activeAnnouncements.some(announcement => announcement.type === 'closure');
        const specialClinicLabel = hospital.specialClinic?.hasExoticSpecialClinic
          ? hospital.specialClinic.label || '特寵特別門診'
          : '';

        return (
          <div
            key={hospital.id}
            className="hospital-card bg-white rounded-xl p-4 transition duration-200 ease-in-out cursor-pointer shadow-sm hover:shadow-md"
            onClick={() => onHospitalClick(hospital)}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-mintdark">{hospital.name}</h3>
              {/* <span className="rating flex items-center">
                <span className="text-sm text-gray-600 mr-1">{hospital.google?.rating}</span>
                <div
                  className="flex"
                  dangerouslySetInnerHTML={{ __html: starsHtml }}
                ></div>
              </span> */}
            </div>
            <p className="text-gray-600 text-sm mt-2">{hospital.address}</p>
            <div className="flex items-center justify-between mt-3">
              <div>
                <span className="text-xs px-2 py-1 bg-mintlight text-mintdark rounded-full">
                  {getHospitalTypeDisplayText(hospital)}
                </span>
                {hospital.emergency && (
                  <span className="text-xs px-2 py-1 bg-softpink text-red-700 rounded-full ml-2">24小時急診</span>
                )}
                {activeAnnouncements.length > 0 && (
                  <span className="text-xs px-2 py-1 bg-cream text-darktext rounded-full ml-2">
                    {hasClosureAnnouncement ? '休診公告' : '最新公告'}
                  </span>
                )}
                {specialClinicLabel && (
                  <span className="text-xs px-2 py-1 bg-softpink/40 text-red-700 rounded-full ml-2">
                    {specialClinicLabel}
                  </span>
                )}
              </div>
              <div className="text-sm">{petIcons}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HospitalList;
