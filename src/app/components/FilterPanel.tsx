"use client";

import React from "react";
import { petIconDefinitions } from "@/lib/petIcons";

type FilterPanelProps = {
  city?: string;
  petCategory?: string;
  reservationRequiredOnly?: boolean;
  openNowOnly?: boolean;
  compact?: boolean;
  onCityChange?: (value: string) => void;
  onPetCategoryChange?: (value: string) => void;
  onReservationRequiredToggle?: (checked: boolean) => void;
  onOpenNowToggle?: (checked: boolean) => void;
  onSearch?: () => void;
};

const FilterPanel: React.FC<FilterPanelProps> = ({
  city = "台北市",
  petCategory = "all",
  reservationRequiredOnly = false,
  openNowOnly = false,
  compact = false,
  onCityChange,
  onPetCategoryChange,
  onReservationRequiredToggle,
  onOpenNowToggle,
  onSearch,
}) => {
  return (
    <section className={`mb-5 overflow-hidden rounded-[30px] border border-sage-100 bg-white/90 shadow-soft ${compact ? "p-4" : "p-4 sm:p-5"}`}>
      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sage-100 text-sm font-black text-forest-900">
            查
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-forest-900">篩選條件</h2>
            <p className="mt-1 text-sm leading-6 text-stone-500">先縮小範圍，再打電話確認看診資訊。</p>
          </div>
        </div>
        <div className="flex w-fit items-center gap-2 rounded-full border border-sage-100 bg-linen-50 px-3 py-2 text-xs font-bold text-stone-500">
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-sage-500" />一般標記</span>
          <span className="h-4 w-px bg-sage-200" />
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-petal-400" />急診標記</span>
        </div>
      </div>
      <div className={`grid grid-cols-1 items-end gap-3 ${compact ? "md:grid-cols-2" : "xl:grid-cols-[240px_minmax(280px,1fr)_210px_210px_150px]"}`}>
        <div className="order-1">
          <label htmlFor="city" className="mb-2 block text-xs font-extrabold tracking-wide text-forest-900">
            城市
          </label>
          <select
            id="city"
            value={city}
            className="w-full rounded-2xl border border-sage-200 bg-linen-50 px-4 py-3 text-sm font-semibold text-forest-900 outline-none transition focus:border-sage-500 focus:ring-4 focus:ring-sage-100"
            onChange={(e) => onCityChange?.(e.target.value)}
            >
            <option value="all">全部城市</option>
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

        <div className="order-2">
        <label htmlFor="petCategory" className="mb-2 block text-xs font-extrabold tracking-wide text-forest-900">
            支援寵物類別
        </label>
        <select
            id="petCategory"
            value={petCategory}
            className="w-full rounded-2xl border border-sage-200 bg-linen-50 px-4 py-3 text-sm font-semibold text-forest-900 outline-none transition focus:border-sage-500 focus:ring-4 focus:ring-sage-100"
            onChange={(e) => onPetCategoryChange?.(e.target.value)}
        >
            <option value="all">全部類別</option>
            {petIconDefinitions.map((definition) => (
              <option
                key={definition.key}
                value={definition.label}
              >
                {definition.label}
              </option>
            ))}
        </select>
        </div>

        <div className="order-3 grid gap-3 sm:grid-cols-2 xl:contents">
            <label className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
              reservationRequiredOnly
                ? "border-sage-300 bg-sage-50 shadow-[inset_0_0_0_1px_rgba(111,161,109,0.16)]"
                : "border-sage-100 bg-linen-50 hover:border-sage-200"
            }`}>
                <input
                    type="checkbox"
                    id="emergency"
                    checked={reservationRequiredOnly}
                    onChange={(e) => onReservationRequiredToggle?.(e.target.checked)}
                    className="h-5 w-5 rounded border-sage-300 accent-sage-600"
                />
                <span>
                  <span className="block text-sm font-bold text-forest-900">非預約制</span>
                  <span className="block text-xs text-stone-500">僅顯示可不預約資訊</span>
                </span>
            </label>

            <label className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
              openNowOnly
                ? "border-sage-300 bg-sage-50 shadow-[inset_0_0_0_1px_rgba(111,161,109,0.16)]"
                : "border-sage-100 bg-linen-50 hover:border-sage-200"
            }`}>
                <input
                    type="checkbox"
                    id="openNow"
                    checked={openNowOnly}
                    onChange={(e) => onOpenNowToggle?.(e.target.checked)}
                    className="h-5 w-5 rounded border-sage-300 accent-sage-600"
                />
                <span>
                  <span className="block text-sm font-bold text-forest-900">目前營業中</span>
                  <span className="block text-xs text-stone-500">依整理時段初步判斷</span>
                </span>
            </label>
        </div>

        <div className={compact ? "order-4 md:col-span-2" : "order-4 flex items-end xl:col-auto"}>
          <button
            onClick={onSearch}
            className="min-h-14 w-full rounded-2xl bg-forest-800 px-5 py-3 text-sm font-extrabold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-forest-900"
          >
            搜尋
          </button>
        </div>
      </div>
    </section>
  );
};

export default FilterPanel;
