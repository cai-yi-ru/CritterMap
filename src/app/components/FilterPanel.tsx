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
import { LoaderCircleIcon, RotateCcwIcon, SearchIcon } from "lucide-react";

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
  onReset?: () => void;
  isSearching?: boolean;
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
  "雲林縣",
  "嘉義市",
  "嘉義縣",
  "台南市",
  "高雄市",
  "屏東縣",
  "宜蘭縣",
  "花蓮縣",
  "台東縣",
  "澎湖縣",
  "金門縣",
  "連江縣",
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
  onReset,
  isSearching = false,
}) => {
  const hasActiveFilters =
    city !== "all" ||
    petCategory !== "all" ||
    reservationRequiredOnly ||
    openNowOnly ||
    hasEmergencyServiceOnly;

  return (
    <section className={`mb-4 border-b border-sage-200 bg-card ${compact ? "px-4 py-4" : "px-4 py-4 sm:px-5"}`}>
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="text-base font-semibold text-forest-900">找醫院</h2>
        <p className="text-xs leading-5 text-stone-600">先選地區與寵物，其他條件可視需要加入。</p>
      </div>

      <div className={`grid grid-cols-1 items-end gap-3 ${compact ? "md:grid-cols-2" : "md:grid-cols-[minmax(180px,0.72fr)_minmax(240px,1fr)_auto]"}`}>
        <div>
          <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-forest-900">
            城市
          </label>
          <Select
            value={city}
            onValueChange={(value) => {
              if (value) onCityChange?.(value);
            }}
          >
            <SelectTrigger id="city" className="h-11 w-full rounded-lg border-sage-200 bg-white px-3 text-forest-900">
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

        <div>
          <label htmlFor="petCategory" className="mb-1.5 block text-sm font-medium text-forest-900">
            寵物類別
          </label>
          <Select
            value={petCategory}
            onValueChange={(value) => {
              if (value) onPetCategoryChange?.(value);
            }}
          >
            <SelectTrigger id="petCategory" className="h-11 w-full rounded-lg border-sage-200 bg-white px-3 text-forest-900">
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

        <div className={compact ? "grid gap-2 md:col-span-2 sm:grid-cols-[1fr_auto]" : "flex items-center gap-2"}>
          <Button
            onClick={onSearch}
            disabled={isSearching}
            className="min-h-11 w-full rounded-lg px-5 font-semibold md:w-auto"
            size="lg"
          >
            {isSearching ? (
              <LoaderCircleIcon data-icon="inline-start" className="animate-spin" />
            ) : (
              <SearchIcon data-icon="inline-start" />
            )}
            {isSearching ? "搜尋中" : "搜尋醫院"}
          </Button>
          {hasActiveFilters && (
            <Button
              type="button"
              onClick={onReset}
              disabled={isSearching}
              variant="ghost"
              size="lg"
              className="min-h-11 shrink-0 rounded-lg px-3 font-medium text-stone-700"
            >
              <RotateCcwIcon data-icon="inline-start" />
              重設
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-sage-100 pt-3">
        <label className="flex min-h-9 cursor-pointer items-center gap-2 text-sm text-stone-700">
          <Checkbox
            id="reservationRequired"
            checked={reservationRequiredOnly}
            onCheckedChange={(checked) => onReservationRequiredToggle?.(checked === true)}
          />
          <span className={reservationRequiredOnly ? "font-semibold text-forest-900" : ""}>可現場掛號</span>
        </label>

        <label className="flex min-h-9 cursor-pointer items-center gap-2 text-sm text-stone-700">
          <Checkbox
            id="openNow"
            checked={openNowOnly}
            onCheckedChange={(checked) => onOpenNowToggle?.(checked === true)}
          />
          <span className={openNowOnly ? "font-semibold text-forest-900" : ""}>目前營業中</span>
        </label>

        <label className="flex min-h-9 cursor-pointer items-center gap-2 text-sm text-stone-700">
          <Checkbox
            id="hasEmergencyService"
            checked={hasEmergencyServiceOnly}
            onCheckedChange={(checked) => onHasEmergencyServiceToggle?.(checked === true)}
          />
          <span className={hasEmergencyServiceOnly ? "font-semibold text-rose-700" : ""}>可詢問急診</span>
        </label>

        <p className="basis-full text-xs leading-5 text-stone-500 sm:basis-auto sm:ml-auto">
          營業、掛號與急診資訊仍請電話確認
        </p>
      </div>
    </section>
  );
};

export default FilterPanel;
