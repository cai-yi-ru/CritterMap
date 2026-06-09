"use client";

import React from "react";
import { petCategoryFilterOptions } from "@/lib/petIcons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";

type FilterPanelProps = {
  city?: string;
  petCategory?: string;
  reservationRequiredOnly?: boolean;
  openNowOnly?: boolean;
  hasEmergencyServiceOnly?: boolean;
  compact?: boolean;
  onCityChange?: (value: string) => void;
  onPetCategoryChange?: (value: string) => void;
  onReservationRequiredToggle?: (checked: boolean) => void;
  onOpenNowToggle?: (checked: boolean) => void;
  onHasEmergencyServiceToggle?: (checked: boolean) => void;
  onSearch?: () => void;
};

const cityOptions = [
  "all",
  "基隆市",
  "台北市",
  "新北市",
  "桃園市",
  "新竹市",
  "新竹縣",
  "苗栗縣",
  "台中市",
  "彰化縣",
  "南投縣",
  "嘉義市",
  "台南市",
  "高雄市",
  "屏東縣",
  "宜蘭縣",
  "台東縣",
];

function getCityLabel(value: string) {
  return value === "all" ? "全部城市" : value;
}

function getPetCategoryLabel(value: string) {
  return value === "all" ? "全部類別" : value;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  city = "台北市",
  petCategory = "all",
  reservationRequiredOnly = false,
  openNowOnly = false,
  hasEmergencyServiceOnly = false,
  compact = false,
  onCityChange,
  onPetCategoryChange,
  onReservationRequiredToggle,
  onOpenNowToggle,
  onHasEmergencyServiceToggle,
  onSearch,
}) => {
  return (
    <section className={`mb-5 overflow-hidden rounded-2xl border border-sage-100 bg-card ${compact ? "p-4" : "p-4 sm:p-5"}`}>
      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-forest-900">篩選條件</h2>
          <p className="mt-1 text-sm leading-6 text-stone-500">先用條件篩選，再致電確認門診時間與是否能看診。</p>
        </div>
        <div className="flex w-fit items-center gap-2 rounded-full border border-sage-100 bg-sage-50 px-3 py-2 text-xs font-bold text-stone-600">
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-sage-500" />一般標記</span>
          <span className="h-4 w-px bg-sage-200" />
          <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-petal-400" />急診標記</span>
        </div>
      </div>
      <div className={`grid grid-cols-1 items-end gap-3 ${compact ? "md:grid-cols-2" : "xl:grid-cols-[240px_minmax(280px,1fr)_minmax(420px,2fr)_150px]"}`}>
        <div className="order-1">
          <label htmlFor="city" className="mb-2 block text-xs font-extrabold tracking-wide text-forest-900">
            城市
          </label>
          <Select
            value={city}
            onValueChange={(value) => {
              if (value) onCityChange?.(value);
            }}
          >
            <SelectTrigger id="city" className="h-11 w-full rounded-xl border-sage-200 bg-sage-50 px-3 text-forest-900">
              <span className="truncate">{getCityLabel(city)}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {cityOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {getCityLabel(option)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="order-2">
        <label htmlFor="petCategory" className="mb-2 block text-xs font-extrabold tracking-wide text-forest-900">
            支援寵物類別
        </label>
        <Select
            value={petCategory}
            onValueChange={(value) => {
              if (value) onPetCategoryChange?.(value);
            }}
        >
          <SelectTrigger id="petCategory" className="h-11 w-full rounded-xl border-sage-200 bg-sage-50 px-3 text-forest-900">
            <span className="truncate">{getPetCategoryLabel(petCategory)}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">全部類別</SelectItem>
              {petCategoryFilterOptions.map((definition) => (
                <SelectItem key={definition.key} value={definition.label}>
                  {definition.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        </div>

        <div className={`order-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 ${compact ? "md:col-span-2" : ""}`}>
            <label className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
              reservationRequiredOnly
                ? "border-sage-300 bg-sage-50"
                : "border-sage-100 bg-white hover:border-sage-200"
            }`}>
                <Checkbox
                    id="reservationRequired"
                    checked={reservationRequiredOnly}
                    onCheckedChange={(checked) => onReservationRequiredToggle?.(checked === true)}
                />
                <span>
                  <span className="block text-sm font-bold text-forest-900">非預約制</span>
                  <span className="block text-xs text-stone-500">僅顯示可不預約資訊</span>
                </span>
            </label>

            <label className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
              openNowOnly
                ? "border-sage-300 bg-sage-50"
                : "border-sage-100 bg-white hover:border-sage-200"
            }`}>
                <Checkbox
                    id="openNow"
                    checked={openNowOnly}
                    onCheckedChange={(checked) => onOpenNowToggle?.(checked === true)}
                />
                <span>
                  <span className="block text-sm font-bold text-forest-900">目前營業中</span>
                  <span className="block text-xs text-stone-500">依營業時間資料判斷</span>
                </span>
            </label>

            <label className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
              hasEmergencyServiceOnly
                ? "border-petal-200 bg-petal-50"
                : "border-sage-100 bg-white hover:border-sage-200"
            }`}>
                <Checkbox
                    id="hasEmergencyService"
                    checked={hasEmergencyServiceOnly}
                    onCheckedChange={(checked) => onHasEmergencyServiceToggle?.(checked === true)}
                />
                <span>
                  <span className="block text-sm font-bold text-forest-900">有急診服務</span>
                  <span className="block text-xs text-stone-500">仍建議先電話確認</span>
                </span>
            </label>
        </div>

        <div className={compact ? "order-4 md:col-span-2" : "order-4 flex items-end xl:col-auto"}>
          <Button
            onClick={onSearch}
            className="min-h-11 w-full font-extrabold"
            size="lg"
          >
            <SearchIcon data-icon="inline-start" />
            搜尋
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FilterPanel;
