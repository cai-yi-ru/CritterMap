"use client";

import React from "react";
import { petCategoryFilterOptions } from "@/lib/petIcons";
import { cityOptions } from "@/lib/hospitalFilters";
import PetIcon from './PetIcon';
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

function getCityLabel(value: string) {
  return value === "all" ? "全部縣市" : value;
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
    <form role="search" aria-label="搜尋特寵醫院" onSubmit={(event) => { event.preventDefault(); if (!isSearching) onSearch?.(); }} className={`mb-5 rounded-xl border border-border bg-card ${compact ? "p-4" : "p-4 sm:p-5"}`}>
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="text-base font-semibold text-forest-900">找醫院</h2>
        <p className="hidden text-sm leading-6 text-muted-foreground sm:block">選好條件後，按「搜尋醫院」。</p>
      </div>

      <div className={`grid grid-cols-2 items-end gap-3 ${compact ? "" : "md:grid-cols-[minmax(160px,0.72fr)_minmax(200px,1fr)_auto]"}`}>
        <div className="min-w-0">
          <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-forest-900">
            縣市
          </label>
          <Select
            disabled={isSearching}
            value={city}
            onValueChange={(value) => {
              if (value) onCityChange?.(value);
            }}
          >
            <SelectTrigger id="city" className="min-h-11 w-full rounded-lg border-input bg-card px-3 text-base text-foreground">
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

        <div className="min-w-0">
          <label htmlFor="petCategory" className="mb-1.5 block text-sm font-medium text-forest-900">
            寵物類別
          </label>
          <Select
            disabled={isSearching}
            value={petCategory}
            onValueChange={(value) => {
              if (value) onPetCategoryChange?.(value);
            }}
          >
            <SelectTrigger id="petCategory" className="min-h-11 w-full rounded-lg border-input bg-card px-3 text-base text-foreground">
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

        <div className={`col-span-2 flex min-w-0 items-center gap-2 ${compact ? '' : 'md:col-span-1'}`}>
          <Button
            type="submit"
            disabled={isSearching}
            className="min-h-11 min-w-0 flex-1 rounded-lg px-5 font-semibold"
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
              清除
            </Button>
          )}
        </div>
      </div>

      {!compact && (
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="常用寵物類別">
          {['兔', '鼠', '天竺鼠', '鳥類', '爬蟲', '烏龜'].map((pet) => (
            <button key={pet} type="button" disabled={isSearching} aria-pressed={petCategory === pet}
              onClick={() => onPetCategoryChange?.(petCategory === pet ? 'all' : pet)}
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors disabled:opacity-50 ${petCategory === pet ? 'border-primary bg-secondary text-foreground' : 'border-transparent bg-muted/60 text-muted-foreground hover:border-input hover:bg-secondary'}`}>
              <PetIcon pet={pet} size="md" showLabel />
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-sage-100 pt-2">
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-stone-700">
          <Checkbox
            id="reservationRequired"
            disabled={isSearching}
            checked={reservationRequiredOnly}
            onCheckedChange={(checked) => onReservationRequiredToggle?.(checked === true)}
          />
          <span className={reservationRequiredOnly ? "font-semibold text-forest-900" : ""}>可現場掛號</span>
        </label>

        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-stone-700">
          <Checkbox
            id="openNow"
            disabled={isSearching}
            checked={openNowOnly}
            onCheckedChange={(checked) => onOpenNowToggle?.(checked === true)}
          />
          <span className={openNowOnly ? "font-semibold text-forest-900" : ""}>目前營業中</span>
        </label>

        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-stone-700">
          <Checkbox
            id="hasEmergencyService"
            disabled={isSearching}
            checked={hasEmergencyServiceOnly}
            onCheckedChange={(checked) => onHasEmergencyServiceToggle?.(checked === true)}
          />
          <span className={hasEmergencyServiceOnly ? "font-semibold text-rose-700" : ""}>可詢問急診</span>
        </label>

        <p className="basis-full text-sm leading-6 text-muted-foreground sm:ml-auto sm:basis-auto">
          出發前，請先致電確認能否看診。
        </p>
      </div>
    </form>
  );
};

export default FilterPanel;
