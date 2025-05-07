"use client";

import React from "react";

type FilterPanelProps = {
  onCityChange?: (value: string) => void;
  onTypeChange?: (value: string) => void;
  onEmergencyToggle?: (checked: boolean) => void;
  onOpenNowToggle?: (checked: boolean) => void;
  onSearch?: () => void;
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  onCityChange,
  onTypeChange,
  onEmergencyToggle,
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
            className="filter-dropdown w-full rounded-lg border-2 border-mint-30 focus:border-mint focus:ring-2 focus:ring-mint-20 outline-none focus:outline-none appearance-none py-2.5 px-3 bg-white"
            onChange={(e) => onCityChange?.(e.target.value)}
            >
            <option value="all">全部城市</option>
            <option value="taipei">台北市</option>
            <option value="newtaipei">新北市</option>
            <option value="taoyuan">桃園市</option>
            <option value="taichung">台中市</option>
            <option value="kaohsiung">高雄市</option>
          </select>
        </div>

        {/* 類型 */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-darktext mb-2">
            專科類型
          </label>
          <select
            id="type"
            className="filter-dropdown w-full rounded-lg border-2 border-mint-30 focus:border-mint focus:ring focus:ring-mint/20 focus:ring-opacity-50 py-2.5 px-3 bg-white"
            onChange={(e) => onTypeChange?.(e.target.value)}
          >
            <option value="all">全部類型</option>
            <option value="general">綜合動物醫院</option>
            <option value="exotic">特殊寵物專科</option>
            <option value="dental">牙科專科</option>
            <option value="surgery">外科專科</option>
            <option value="dermatology">皮膚專科</option>
          </select>
        </div>

        <div className="space-y-6">
            {/* 急診 */}
            <div>
                <label className="block text-sm font-medium text-darktext mb-2">急診服務</label>
                <label className="custom-checkbox flex items-start gap-2">
                <input
                    type="checkbox"
                    id="emergency"
                    onChange={(e) => onEmergencyToggle?.(e.target.checked)}
                    className="mt-1"
                />
                <span className="checkmark" />
                <span className="text-sm text-gray-700">僅顯示24小時急診醫院</span>
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
            className="w-full bg-mint hover:bg-mintdark text-white font-medium py-2.5 px-4 rounded-lg transition duration-150 ease-in-out shadow-sm"
          >
            搜尋
          </button>
        </div>
      </div>
      <div className="mt-6 bg-[#FFF8F8] border-l-4 border-softpink p-4 rounded-lg text-sm text-gray-700 leading-relaxed space-y-2">
        <p>🔔 醫院營運狀況可能隨時調整，<strong>實際是否看診仍以醫院公告或電話詢問為準</strong>。</p>
        <p>📞 為避免撲空或延誤看診，<strong>出發前請務必致電確認是否看特寵，以及是否需要預約</strong>。</p>
        <p className="text-red-700 font-semibold">
            本平台提供「急診」與「目前營業」等篩選功能，僅供快速查詢參考，<strong>不代表完整醫療服務內容</strong>。
        </p>
        <ul className="list-disc pl-5 text-[0.95rem] space-y-1 mt-2">
            <li>部分特寵醫院採預約制，未預約可能無法看診。</li>
            <li>有些醫院僅特定醫師或時段看診特寵，非全天候開放。</li>
            <li>資料僅供參考用途，<strong>非醫療建議，亦不代表推薦特定醫院</strong>。</li>
        </ul>
        </div>
    </div>
  );
};

export default FilterPanel;