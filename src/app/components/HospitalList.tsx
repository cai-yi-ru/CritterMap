import React from "react";
import type { Hospital } from '@/types/hospital';

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
        // const fullStars = Math.floor(hospital.rating);
        // const hasHalfStar = hospital.rating % 1 >= 0.5;

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

        return (
          <div
            key={hospital.id}
            className="hospital-card bg-white rounded-xl p-4 transition duration-200 ease-in-out cursor-pointer shadow-sm hover:shadow-md"
            onClick={() => onHospitalClick(hospital)}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-mintdark">{hospital.name}</h3>
              {/* <span className="rating flex items-center">
                <span className="text-sm text-gray-600 mr-1">{hospital.rating}</span>
                <div
                  className="flex"
                  dangerouslySetInnerHTML={{ __html: starsHtml }}
                ></div>
              </span> */}
            </div>
            <p className="text-gray-600 text-sm mt-2">{hospital.address}</p>
            <div className="flex items-center justify-between mt-3">
              <div>
                <span className="text-xs px-2 py-1 bg-mintlight text-mintdark rounded-full">{hospital.typeText}</span>
                {hospital.emergency && (
                  <span className="text-xs px-2 py-1 bg-softpink text-red-700 rounded-full ml-2">24小時急診</span>
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