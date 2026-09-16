'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { HospitalUpdate } from '@/types/hospital';
import type { HospitalSummary } from '@/types/hospitalPublic';

interface HospitalUpdatesProps {
  updates: HospitalUpdate[];
  hospitals: HospitalSummary[];
  onUpdateClick: (update: HospitalUpdate, hospital: HospitalSummary) => void;
}

const updateTypeText: Record<HospitalUpdate['type'], string> = {
  hours: '營業時間更新',
  content: '內容更新',
  announcement: '最新公告',
  services: '服務項目',
  contact: '聯絡資訊',
};

export default function HospitalUpdates({ updates, hospitals, onUpdateClick }: HospitalUpdatesProps) {
  const [expanded, setExpanded] = useState(false);
  const [defaultVisibleCount, setDefaultVisibleCount] = useState(6);
  const hospitalById = useMemo(
    () => new Map(hospitals.map((hospital) => [hospital.id, hospital])),
    [hospitals],
  );
  const allVisibleUpdates = updates
    .map((update) => ({
      update,
      hospital: hospitalById.get(update.hospitalId),
    }))
    .filter((item): item is { update: HospitalUpdate; hospital: HospitalSummary } => Boolean(item.hospital));
  const visibleUpdates = expanded ? allVisibleUpdates : allVisibleUpdates.slice(0, defaultVisibleCount);
  const canExpand = allVisibleUpdates.length > defaultVisibleCount;

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 768) {
        setDefaultVisibleCount(6);
      } else {
        setDefaultVisibleCount(3);
      }
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  useEffect(() => {
    setExpanded(false);
  }, [defaultVisibleCount]);

  if (allVisibleUpdates.length === 0) {
    return null;
  }

  return (
    <section id="latest-updates" aria-labelledby="latest-updates-title" className="mt-8 w-full scroll-mt-28 border-t border-sage-200 pt-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 id="latest-updates-title" className="text-lg font-bold text-forest-900">最新更新</h2>
          <p className="mt-1 text-sm text-stone-600">近期整理的營業、公告與聯絡資訊</p>
        </div>
        <span className="shrink-0 text-sm tabular-nums text-stone-500">
          {visibleUpdates.length} / {allVisibleUpdates.length} 筆
        </span>
      </div>
      <div className="grid border-t border-sage-100 lg:grid-cols-2 lg:gap-x-8">
        {visibleUpdates.map(({ update, hospital }) => {
          const summaryItems = update.summary
            .split('；')
            .map((item) => item.trim())
            .filter(Boolean);

          return (
            <article
              key={update.id}
              className="min-w-0 border-b border-sage-100 py-5 lg:odd:border-r lg:odd:pr-8 lg:even:pl-8"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs">
                <span className="font-semibold text-forest-800">{updateTypeText[update.type]}</span>
                <time className="text-stone-500" dateTime={update.updatedAt}>
                  {update.updatedAt}
                </time>
                {update.sourceLabel && (
                  <span className="text-stone-500 lg:ml-auto">
                    來源：
                    {update.sourceUrl ? (
                      <a
                        href={update.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-forest-800 hover:text-sage-600 hover:underline"
                      >
                        {update.sourceLabel}
                      </a>
                    ) : (
                      update.sourceLabel
                    )}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="group mt-3 block w-full min-w-0 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 focus-visible:ring-offset-2"
                onClick={() => onUpdateClick(update, hospital)}
              >
                <span className="block text-base font-semibold text-forest-900 transition-colors group-hover:text-sage-600">{hospital.name}</span>
                <span role="list" className="mt-1 block space-y-1 text-sm leading-6 text-stone-600">
                  {summaryItems.map((item, index) => (
                    <span key={`${update.id}-summary-${index}`} role="listitem" className="grid grid-cols-[auto_minmax(0,1fr)] gap-2">
                      <span aria-hidden="true" className="font-semibold text-sage-600">•</span>
                      <span>{item}</span>
                    </span>
                  ))}
                </span>
              </button>
            </article>
          );
        })}
      </div>
      {canExpand && (
        <div className="mt-4 flex justify-center">
          <Button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            variant="outline"
            className="rounded-lg font-medium"
          >
            {expanded ? '收合最新更新' : `展開全部 ${allVisibleUpdates.length} 筆更新`}
          </Button>
        </div>
      )}
    </section>
  );
}
