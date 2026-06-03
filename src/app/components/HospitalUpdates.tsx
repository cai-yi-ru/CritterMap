'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Hospital, HospitalUpdate } from '@/types/hospital';

interface HospitalUpdatesProps {
  updates: HospitalUpdate[];
  hospitals: Hospital[];
  onHospitalClick: (hospital: Hospital) => void;
}

const updateTypeText: Record<HospitalUpdate['type'], string> = {
  hours: '營業時間更新',
  content: '內容更新',
  announcement: '最新公告',
  services: '服務項目',
  contact: '聯絡資訊',
};

export default function HospitalUpdates({ updates, hospitals, onHospitalClick }: HospitalUpdatesProps) {
  const [expanded, setExpanded] = useState(false);
  const [defaultVisibleCount, setDefaultVisibleCount] = useState(9);
  const hospitalById = useMemo(
    () => new Map(hospitals.map((hospital) => [hospital.id, hospital])),
    [hospitals],
  );
  const allVisibleUpdates = updates
    .map((update) => ({
      update,
      hospital: hospitalById.get(update.hospitalId),
    }))
    .filter((item): item is { update: HospitalUpdate; hospital: Hospital } => Boolean(item.hospital));
  const visibleUpdates = expanded ? allVisibleUpdates : allVisibleUpdates.slice(0, defaultVisibleCount);
  const canExpand = allVisibleUpdates.length > defaultVisibleCount;

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 1024) {
        setDefaultVisibleCount(9);
      } else if (window.innerWidth >= 768) {
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
    <section className="mt-5 rounded-[28px] border border-sage-100 bg-white/88 p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-forest-900">最新更新</h2>
          <p className="text-xs font-medium text-stone-500">資料有異動時會整理在這裡</p>
        </div>
        <span className="rounded-full bg-honey-100 px-3 py-1 text-xs font-bold text-clay-700">
          顯示 {visibleUpdates.length} / {allVisibleUpdates.length} 筆
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {visibleUpdates.map(({ update, hospital }) => (
          <article
            key={update.id}
            className="cursor-pointer rounded-3xl border border-sage-100 bg-linen-50 p-4 transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white"
            onClick={() => onHospitalClick(hospital)}
          >
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-sage-100 px-2.5 py-1 text-xs font-bold text-forest-900">
                    {updateTypeText[update.type]}
                  </span>
                  <time className="text-xs font-medium text-stone-500" dateTime={update.updatedAt}>
                    更新於 {update.updatedAt}
                  </time>
                </div>
                <h3 className="mt-3 text-sm font-extrabold text-forest-900">{hospital.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-stone-600">{update.summary}</p>
            </div>
            {update.sourceLabel && (
              <div className="mt-3 text-xs font-medium text-stone-500">
                來源：
                {update.sourceUrl ? (
                  <a
                    href={update.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-forest-800 hover:text-sage-600"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {update.sourceLabel}
                  </a>
                ) : (
                  update.sourceLabel
                )}
              </div>
            )}
          </article>
        ))}
      </div>
      {canExpand && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="rounded-full border border-sage-200 bg-white px-5 py-2.5 text-sm font-extrabold text-forest-900 shadow-soft transition hover:bg-sage-100"
          >
            {expanded ? '收合最新更新' : `展開全部 ${allVisibleUpdates.length} 筆更新`}
          </button>
        </div>
      )}
    </section>
  );
}
