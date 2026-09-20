"use client";

import { useState } from "react";
import { petCategoryFilterOptions } from "@/lib/petIcons";
import { cityOptions } from "@/lib/hospitalFilters";
import PetIcon from "./PetIcon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from "@/components/ui/select";
import { ChevronDownIcon, EllipsisIcon, LoaderCircleIcon, PawPrintIcon, RotateCcwIcon, SearchIcon, SlidersHorizontalIcon } from "lucide-react";

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

const commonPets = ["兔", "鼠", "天竺鼠", "鳥類", "爬蟲", "烏龜"];
const morePets = petCategoryFilterOptions
  .filter((pet) => !commonPets.includes(pet.label))
  .sort((a, b) => Number(Boolean(b.isExotic)) - Number(Boolean(a.isExotic)));

export default function FilterPanel({
  city = "all", petCategory = "all", reservationRequiredOnly = false,
  openNowOnly = false, hasEmergencyServiceOnly = false, compact = false,
  onCityChange, onPetCategoryChange, onReservationRequiredToggle,
  onOpenNowToggle, onHasEmergencyServiceToggle, onSearch, onReset, isSearching = false,
}: FilterPanelProps) {
  const advancedCount = [reservationRequiredOnly, openNowOnly, hasEmergencyServiceOnly].filter(Boolean).length;
  const [advancedOpen, setAdvancedOpen] = useState(advancedCount > 0);
  const hasActiveFilters = city !== "all" || petCategory !== "all" || advancedCount > 0;
  const selectedMorePet = morePets.find((pet) => pet.label === petCategory);
  const petButtonClass = (selected: boolean) => `flex min-h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-lg border px-1 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${selected ? "border-primary bg-secondary text-foreground ring-1 ring-primary" : "border-transparent bg-muted/60 text-muted-foreground hover:border-input hover:bg-secondary"}`;

  return (
    <form role="search" aria-label="搜尋特寵醫院" onSubmit={(event) => { event.preventDefault(); if (!isSearching) onSearch?.(); }} className="mb-4 rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className={`grid gap-4 ${compact ? "" : "lg:grid-cols-[minmax(180px,0.55fr)_minmax(0,2fr)]"}`}>
        <div className="min-w-0">
          <label htmlFor="city" className="mb-2 block text-sm font-semibold text-foreground">縣市</label>
          <Select disabled={isSearching} value={city} onValueChange={(value) => { if (value) onCityChange?.(value); }}>
            <SelectTrigger id="city" className="min-h-11 w-full rounded-lg bg-card px-3 text-base">
              <span>{city === "all" ? "全部縣市" : city}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {cityOptions.map((option) => <SelectItem key={option} value={option} className="min-h-11">{option === "all" ? "全部縣市" : option}</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <fieldset className="min-w-0">
          <legend className="mb-2 text-sm font-semibold text-foreground">寵物類別</legend>
          <div className={`grid grid-cols-4 gap-2 ${compact ? "" : "sm:grid-cols-8"}`}>
            <button type="button" disabled={isSearching} aria-pressed={petCategory === "all"} onClick={() => onPetCategoryChange?.("all")} className={petButtonClass(petCategory === "all")}>
              <span className="flex size-8 items-center justify-center"><PawPrintIcon className="size-5" aria-hidden="true" /></span>
              全部
            </button>
            {commonPets.map((pet) => (
              <button key={pet} type="button" disabled={isSearching} aria-pressed={petCategory === pet} onClick={() => onPetCategoryChange?.(pet)} className={petButtonClass(petCategory === pet)}>
                <PetIcon pet={pet} size="md" decorative />
                <span>{pet}</span>
              </button>
            ))}
            <Select disabled={isSearching} value={selectedMorePet?.label ?? null} onValueChange={(value) => { if (value) onPetCategoryChange?.(value); }}>
              <SelectTrigger id="petCategory" aria-label={selectedMorePet ? `更多物種，目前選擇${selectedMorePet.label}` : "更多物種"} className={`${petButtonClass(Boolean(selectedMorePet))} h-auto w-full whitespace-normal data-[size=default]:h-auto [&>svg]:hidden`}>
                {selectedMorePet ? <PetIcon pet={selectedMorePet.label} size="md" decorative /> : <span className="flex size-8 items-center justify-center"><EllipsisIcon className="size-5" aria-hidden="true" /></span>}
                <span className="text-center leading-5">{selectedMorePet?.label ?? "更多"}</span>
              </SelectTrigger>
              <SelectContent align="end" alignItemWithTrigger={false} className="w-56">
                <SelectGroup>
                  {morePets.map((pet) => <SelectItem key={pet.key} value={pet.label} className="min-h-12 px-3"><PetIcon pet={pet.label} size="md" showLabel /></SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </fieldset>
      </div>

      <div className="mt-3 border-t border-border/70 pt-1">
        <button type="button" aria-expanded={advancedOpen} aria-controls="additional-filters" onClick={() => setAdvancedOpen((open) => !open)} className="flex min-h-11 w-full items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <SlidersHorizontalIcon className="size-4" aria-hidden="true" />其他條件
          {advancedCount > 0 && <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-foreground">已選 {advancedCount} 項</span>}
          <ChevronDownIcon className={`ml-auto size-4 transition-transform ${advancedOpen ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
        <div id="additional-filters" hidden={!advancedOpen}>
          <div className="flex flex-wrap gap-x-5 gap-y-1 pb-2">
            <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-stone-700">
              <Checkbox disabled={isSearching} checked={reservationRequiredOnly} onCheckedChange={(checked) => onReservationRequiredToggle?.(checked === true)} />可現場掛號
            </label>
            <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-stone-700">
              <Checkbox disabled={isSearching} checked={openNowOnly} onCheckedChange={(checked) => onOpenNowToggle?.(checked === true)} />目前營業中
            </label>
            <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-stone-700">
              <Checkbox disabled={isSearching} checked={hasEmergencyServiceOnly} onCheckedChange={(checked) => onHasEmergencyServiceToggle?.(checked === true)} />可詢問急診
            </label>
          </div>
        </div>
      </div>

      <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-center text-xs leading-5 text-muted-foreground sm:text-left">出發前，請先致電確認能否看診。</p>
        <div className="flex items-center gap-2 sm:min-w-60">
          {hasActiveFilters && <Button type="button" onClick={onReset} disabled={isSearching} variant="ghost" className="min-h-11 rounded-lg px-3"><RotateCcwIcon data-icon="inline-start" />清除</Button>}
          <Button type="submit" disabled={isSearching} className="min-h-11 flex-1 rounded-lg px-6 font-semibold" size="lg">
            {isSearching ? <LoaderCircleIcon data-icon="inline-start" className="animate-spin" /> : <SearchIcon data-icon="inline-start" />}
            {isSearching ? "搜尋中" : "搜尋醫院"}
          </Button>
        </div>
      </div>
    </form>
  );
}
