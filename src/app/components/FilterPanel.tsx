"use client";

import React from "react";

type FilterPanelProps = {
  onCityChange?: (value: string) => void;
  onPetCategoryChange?: (value: string) => void;
  onReservationRequiredToggle?: (checked: boolean) => void;
  onOpenNowToggle?: (checked: boolean) => void;
  onSearch?: () => void;
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  onCityChange,
  onPetCategoryChange,
  onReservationRequiredToggle,
  onOpenNowToggle,
  onSearch,
}) => {
  return (
    <div className="bg-cream rounded-2xl shadow-sm p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 城市 */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-darktext mb-2">
            城市
          </label>
          <select
            id="city"
            defaultValue="台北市"
            className="filter-dropdown w-full rounded-lg border-2 border-mint-30 focus:border-mint focus:ring-2 focus:ring-mint-20 outline-none focus:outline-none appearance-none py-2.5 px-3 bg-white"
            onChange={(e) => onCityChange?.(e.target.value)}
            >
            {/* <option value="all">全部城市</option> */}
            <option value="基隆市">基隆市</option>
            <option value="台北市">台北市</option>
            <option value="新北市">新北市</option>
            <option value="桃園市">桃園市</option>
            <option value="新竹市">新竹市</option>
            <option value="新竹縣">新竹縣</option>
            <option value="苗栗縣">苗栗縣</option>
            <option value="台中市">台中市</option>
            <option value="彰化縣">彰化縣</option>
            <option value="嘉義市">嘉義市</option>
            <option value="台南市">台南市</option>
            <option value="高雄市">高雄市</option>
            <option value="屏東縣">屏東縣</option>
            <option value="宜蘭縣">宜蘭縣</option>
            <option value="台東縣">台東縣</option>
          </select>
        </div>

        {/* 支援寵物類別 */}
        <div>
        <label htmlFor="petCategory" className="block text-sm font-medium text-darktext mb-2">
            支援寵物類別
        </label>
        <select
            id="petCategory"
            className="filter-dropdown w-full rounded-lg border-2 border-mint-30 focus:border-mint focus:ring focus:ring-mint/20 focus:ring-opacity-50 py-2.5 px-3 bg-white"
            onChange={(e) => onPetCategoryChange?.(e.target.value)} // 可改為 onPetCategoryChange?
        >
            <option value="all">全部類別</option>
            <option value="貓">🐱 貓</option>
            <option value="狗">🐶 狗</option>
            <option value="兔">🐰 兔</option>
            <option value="鼠">🐹 鼠</option>
            <option value="天竺鼠">🐹 天竺鼠</option>
            <option value="鳥類">🐦 鳥類</option>
            <option value="爬蟲">🦎 爬蟲</option>
            <option value="刺蝟">🦔 刺蝟</option>
            <option value="蜜袋鼯"> 蜜袋鼯</option>
            <option value="其他特寵">🌟 其他特寵</option>
        </select>
        </div>

        <div className="space-y-6">
            {/* 非預約制 */}
            <div>
                <label className="block text-sm font-medium text-darktext mb-2">非預約制</label>
                <label className="custom-checkbox flex items-start gap-2">
                <input
                    type="checkbox"
                    id="emergency"
                    onChange={(e) => onReservationRequiredToggle?.(e.target.checked)}
                    className="mt-1"
                />
                <span className="checkmark" />
                <span className="text-sm text-gray-700">僅顯示非預約制的寵物醫院</span>
                </label>
            </div>

            {/* 現在看診 */}
            <div>
                <label className="block text-sm font-medium text-darktext mb-2">目前營業中</label>
                <label className="custom-checkbox flex items-start gap-2">
                <input
                    type="checkbox"
                    id="openNow"
                    onChange={(e) => onOpenNowToggle?.(e.target.checked)}
                    className="mt-1"
                />
                <span className="checkmark" />
                <span className="text-sm text-gray-700">僅顯示目前有看診的醫院</span>
                </label>
            </div>
        </div>

        {/* 搜尋按鈕 */}
        <div className="flex items-end">
          <button
            onClick={onSearch}
            className="w-full bg-mint hover:bg-mintdark text-white font-medium py-2.5 px-4 rounded-lg transition duration-150 ease-in-out shadow-sm cursor-pointer transform hover:-translate-y-0.5"
          >
            搜尋
          </button>
        </div>
      </div>
      {/* <div className="mt-6 bg-[#FFF8F8] border-l-4 border-softpink p-4 rounded-lg text-sm text-gray-700 leading-relaxed space-y-2">
        <p>🔔 醫院營運狀況可能隨時調整，<strong>實際是否看診仍以醫院公告或電話詢問為準</strong>。</p>
        <p>📞 為避免撲空或延誤看診，<strong>出發前請務必致電確認是否看特寵，以及是否需要預約</strong>。</p>
        <p className="text-red-700 font-semibold">
            本平台提供「目前營業」篩選功能，僅供快速查詢參考，<strong>不代表完整醫療服務內容</strong>。
        </p>
        <ul className="list-disc pl-5 text-[0.95rem] space-y-1 mt-2">
            <li>部分特寵醫院採預約制，未預約可能無法看診。</li>
            <li>有些醫院僅特定醫師或時段看診特寵，非全天候開放。</li>
            <li>資料僅供參考用途，<strong>非代表推薦、醫療建議，亦不代表推薦特定醫院</strong>。</li>
            <li>資料由人工一間一間上網找資料整理，若有錯漏，敬請見諒，出發前請再次致電醫院確認。</li>
        </ul>
      </div> */}
    </div>
  );
};

export default FilterPanel;