
'use client';

import { useCallback, useEffect, useRef, useSyncExternalStore, useTransition, useState } from 'react';
import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { ListIcon, MapIcon, LoaderCircleIcon, CircleAlertIcon } from 'lucide-react';
import Navbar from './components/Navbar';
import FilterPanel from './components/FilterPanel';
import HospitalList from './components/HospitalList';
import HospitalUpdates from './components/HospitalUpdates';
import Footer from './components/Footer';
import DisclaimerSection from './components/DisclaimerSection';
import SponsoredSlot from './components/SponsoredSlot';
import { Button } from '@/components/ui/button';
import { getHospitalDetail, searchHospitals } from './actions/hospitals';
import { cityCenterMap, defaultHospitalFilters, updateFilterUrl, type HospitalFilters } from '@/lib/hospitalFilters';
import type { Hospital, HospitalUpdate } from '@/types/hospital';
import type { HospitalSummary } from '@/types/hospitalPublic';

const HospitalModal = dynamic(() => import('./components/HospitalModal'));
const HospitalUpdateSheet = dynamic(() => import('./components/HospitalUpdateSheet'));

function subscribeToDesktop(callback: () => void) {
  const query = window.matchMedia('(min-width: 1024px)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}
const getDesktopSnapshot = () => window.matchMedia('(min-width: 1024px)').matches;
const getServerSnapshot = () => false;

const MapPanel = dynamic(() => import('./components/MapPanel'), {
  ssr: false,
  loading: () => (
    <div role="status" className="grid h-[440px] place-items-center rounded-xl border border-border bg-muted text-sm font-medium text-muted-foreground sm:h-[520px] lg:h-[640px]">
      地圖載入中，你可以先查看醫院清單。
    </div>
  ),
});

type HomeClientProps = {
  embed?: boolean;
  initialHospitals?: HospitalSummary[];
  initialUpdates?: HospitalUpdate[];
  initialUpdateHospitals?: HospitalSummary[];
  hospitalCount?: number;
  latestHospitalDataDate?: string | null;
  initialFilters?: HospitalFilters;
  discoveryContent?: ReactNode;
};

export default function HomeClient({
  embed = false, initialHospitals = [], initialUpdates = [], initialUpdateHospitals = [],
  hospitalCount = initialHospitals.length, latestHospitalDataDate = null,
  initialFilters = defaultHospitalFilters,
  discoveryContent,
}: HomeClientProps) {
  const [isSearchPending, startSearchTransition] = useTransition();
  const [filteredHospitals, setFilteredHospitals] = useState(initialHospitals);
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [searchError, setSearchError] = useState(false);
  const [detailError, setDetailError] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedUpdate, setSelectedUpdate] = useState<{ update: HospitalUpdate; hospital: Hospital } | null>(null);
  const [mobileView, setMobileView] = useState<'map' | 'list'>('list');
  const isDesktop = useSyncExternalStore(subscribeToDesktop, getDesktopSnapshot, getServerSnapshot);
  const searchRequest = useRef(0);
  const detailRequest = useRef(0);
  const resultHeading = useRef<HTMLParagraphElement | null>(null);
  const revealResults = useRef(false);
  const lastDetail = useRef<{ hospital: HospitalSummary; update?: HospitalUpdate } | null>(null);
  const hasUnappliedChanges = JSON.stringify(filters) !== JSON.stringify(appliedFilters);

  const runSearch = useCallback((nextFilters: HospitalFilters) => {
    const request = ++searchRequest.current;
    setSearchError(false);
    startSearchTransition(async () => {
      try {
        const results = await searchHospitals(nextFilters);
        if (request !== searchRequest.current) return;
        setFilteredHospitals(results);
        setAppliedFilters(nextFilters);
        revealResults.current = true;
        updateFilterUrl(nextFilters);
      } catch {
        if (request === searchRequest.current) setSearchError(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!revealResults.current || isSearchPending) return;
    revealResults.current = false;
    if (!isDesktop) {
      resultHeading.current?.focus({ preventScroll: true });
      resultHeading.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
  }, [filteredHospitals, isSearchPending, isDesktop]);

  const handleReset = useCallback(() => {
    setFilters(defaultHospitalFilters);
    runSearch(defaultHospitalFilters);
  }, [runSearch]);

  const loadDetail = async (hospital: HospitalSummary, update?: HospitalUpdate) => {
    const request = ++detailRequest.current;
    lastDetail.current = { hospital, update };
    setDetailError(false);
    setDetailLoading(true);
    try {
      const detail = await getHospitalDetail(hospital.id);
      if (request !== detailRequest.current) return;
      if (!detail) throw new Error('Hospital not found');
      if (update) setSelectedUpdate({ update, hospital: detail });
      else setSelectedHospital(detail);
    } catch {
      if (request === detailRequest.current) setDetailError(true);
    } finally {
      if (request === detailRequest.current) setDetailLoading(false);
    }
  };

  const resultSummary = [
    appliedFilters.city === 'all' ? '全台' : appliedFilters.city,
    appliedFilters.petCategory === 'all' ? '所有寵物類別' : appliedFilters.petCategory,
    appliedFilters.reservationRequiredOnly && '可現場掛號',
    appliedFilters.openNowOnly && '目前營業中',
    appliedFilters.hasEmergencyServiceOnly && '可詢問急診',
  ].filter(Boolean).join(' · ');

  return (
    <div className={`site-shell min-h-dvh ${embed ? 'embed-shell' : ''}`}>
      {!embed && <Navbar />}
      <main id="main-content" tabIndex={-1} className={embed ? 'mx-auto w-full max-w-6xl px-3 py-3 sm:px-5' : 'mx-auto w-full max-w-7xl px-4 pb-12 pt-20 sm:px-6 sm:pt-24 lg:px-8'}>
        <header className="mb-4 sm:mb-5">
          <h1 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">全台特寵醫院查詢</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            依縣市與物種，查詢電話、門診與急診聯絡資訊。
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground sm:text-sm">
            <span>收錄 <strong className="font-semibold tabular-nums text-foreground">{hospitalCount}</strong> 間醫院</span>
            {latestHospitalDataDate && <span>最近整理 <time dateTime={latestHospitalDataDate}>{latestHospitalDataDate}</time></span>}
          </div>
        </header>

        <FilterPanel {...filters} compact={embed}
          onCityChange={(city) => setFilters((current) => ({ ...current, city }))}
          onPetCategoryChange={(petCategory) => setFilters((current) => ({ ...current, petCategory }))}
          onReservationRequiredToggle={(reservationRequiredOnly) => setFilters((current) => ({ ...current, reservationRequiredOnly }))}
          onOpenNowToggle={(openNowOnly) => setFilters((current) => ({ ...current, openNowOnly }))}
          onHasEmergencyServiceToggle={(hasEmergencyServiceOnly) => setFilters((current) => ({ ...current, hasEmergencyServiceOnly }))}
          onSearch={() => runSearch(filters)} onReset={handleReset} isSearching={isSearchPending}
        />

        {searchError && (
          <div role="alert" className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-petal-200 bg-petal-100 p-4 text-sm text-rose-900">
            <CircleAlertIcon className="size-5 shrink-0" aria-hidden="true" />
            <p className="flex-1">暫時無法更新搜尋結果，目前保留上次的清單。請確認網路後再試一次。</p>
            <Button variant="outline" onClick={() => runSearch(filters)} disabled={isSearchPending}>重新搜尋</Button>
          </div>
        )}

        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
          <p ref={resultHeading} role="status" tabIndex={-1} className="scroll-mt-20 rounded-sm text-muted-foreground">
            {isSearchPending ? '正在更新醫院清單…' : <><strong className="font-semibold tabular-nums text-foreground">{filteredHospitals.length} 間醫院</strong><span className="mx-2" aria-hidden="true">/</span>{resultSummary}</>}
          </p>
          {hasUnappliedChanges && !isSearchPending && <p className="text-clay-700">條件已變更，按「搜尋醫院」更新結果</p>}
        </div>

        {!embed && (
          <div className="mb-4 flex rounded-lg bg-secondary p-1 lg:hidden" role="group" aria-label="檢視方式">
            {(['list', 'map'] as const).map((view) => (
              <button key={view} type="button" aria-pressed={mobileView === view}
                aria-controls={view === 'list' ? 'hospital-list' : 'hospital-map'}
                className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors ${mobileView === view ? 'bg-primary text-primary-foreground' : 'text-secondary-foreground hover:bg-sage-200'}`}
                onClick={() => setMobileView(view)}>
                {view === 'list' ? <ListIcon className="size-4" aria-hidden="true" /> : <MapIcon className="size-4" aria-hidden="true" />}
                {view === 'list' ? '醫院清單' : '地圖位置'}
              </button>
            ))}
          </div>
        )}

        <div className={embed ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 gap-4 lg:grid-cols-[minmax(320px,400px)_minmax(0,1fr)]'}>
          <div id="hospital-list" className={embed ? 'order-2' : `${mobileView === 'list' ? 'block' : 'hidden'} min-w-0 lg:block`}>
            <HospitalList key={JSON.stringify(appliedFilters)} hospitals={filteredHospitals} selectedPet={appliedFilters.petCategory} paginate={!isDesktop} onHospitalClick={(hospital) => void loadDetail(hospital)} loading={isSearchPending} onReset={handleReset} />
          </div>
          <div id="hospital-map" className={embed ? 'order-1' : `${mobileView === 'map' ? 'block' : 'hidden'} min-w-0 lg:block`}>
            {(isDesktop || embed || mobileView === 'map') && <MapPanel hospitals={filteredHospitals} center={cityCenterMap[appliedFilters.city]} zoom={appliedFilters.city === 'all' ? 7 : 12} onHospitalClick={(hospital) => void loadDetail(hospital)} embed={embed} loading={isSearchPending} />}
          </div>
        </div>

        {!embed && <SponsoredSlot context="home" className="mt-5" />}
        {!embed && discoveryContent}
        <HospitalUpdates updates={initialUpdates} hospitals={initialUpdateHospitals} onUpdateClick={(update, hospital) => void loadDetail(hospital, update)} />
        {embed && <DisclaimerSection />}
      </main>

      {(detailLoading || detailError) && (
        <div className="fixed inset-x-4 bottom-5 z-50 mx-auto flex max-w-lg items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm text-foreground">
          {detailLoading ? <><LoaderCircleIcon className="size-5 shrink-0 animate-spin" aria-hidden="true" /><p role="status">正在開啟醫院資訊…</p></> : <>
            <p role="alert" className="flex-1">醫院資訊暫時無法開啟，請再試一次。</p>
            <Button variant="outline" onClick={() => { const last = lastDetail.current; if (last) void loadDetail(last.hospital, last.update); }}>重試</Button>
            <Button variant="ghost" onClick={() => setDetailError(false)}>關閉</Button>
          </>}
        </div>
      )}
      {selectedUpdate && <HospitalUpdateSheet update={selectedUpdate.update} hospital={selectedUpdate.hospital}
        open={Boolean(selectedUpdate)} onOpenChange={(open) => { if (!open) setSelectedUpdate(null); }}
        onViewHospitalDetail={(hospital) => { setSelectedUpdate(null); setSelectedHospital(hospital); }} />}
      {selectedHospital && <HospitalModal hospital={selectedHospital} onClose={() => setSelectedHospital(null)} />}
      {!embed && <DisclaimerSection />}
      {!embed && <Footer />}
    </div>
  );
}
