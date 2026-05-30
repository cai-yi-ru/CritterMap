import type { Hospital, HospitalUpdate } from '@/types/hospital';

interface HospitalUpdatesProps {
  updates: HospitalUpdate[];
  hospitals: Hospital[];
  onHospitalClick: (hospital: Hospital) => void;
}

const updateTypeText: Record<HospitalUpdate['type'], string> = {
  hours: '營業時間',
  content: '內容更新',
  announcement: '最新公告',
  services: '服務項目',
  contact: '聯絡資訊',
};

export default function HospitalUpdates({ updates, hospitals, onHospitalClick }: HospitalUpdatesProps) {
  const hospitalById = new Map(hospitals.map((hospital) => [hospital.id, hospital]));
  const visibleUpdates = updates
    .map((update) => ({
      update,
      hospital: hospitalById.get(update.hospitalId),
    }))
    .filter((item): item is { update: HospitalUpdate; hospital: Hospital } => Boolean(item.hospital));

  if (visibleUpdates.length === 0) {
    return null;
  }

  return (
    <section className="mt-4 bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-base font-semibold text-mintdark">最新更新</h2>
        <span className="text-xs text-gray-500">目前顯示最新 {visibleUpdates.length} 筆</span>
      </div>
      <div className="space-y-3">
        {visibleUpdates.map(({ update, hospital }) => (
          <article
            key={update.id}
            className="border border-gray-100 rounded-lg p-3 cursor-pointer transition hover:border-mintlight hover:bg-offwhite"
            onClick={() => onHospitalClick(hospital)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-mintlight text-mintdark">
                    {updateTypeText[update.type]}
                  </span>
                  <time className="text-xs text-gray-500" dateTime={update.updatedAt}>
                    {update.updatedAt}
                  </time>
                </div>
                <h3 className="mt-2 text-sm font-semibold text-darktext">{hospital.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{update.summary}</p>
              </div>
            </div>
            {update.sourceLabel && (
              <div className="mt-2 text-xs text-gray-500">
                來源：
                {update.sourceUrl ? (
                  <a
                    href={update.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mintdark hover:text-mint"
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
    </section>
  );
}
