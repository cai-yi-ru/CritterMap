'use client';

import { Dialog,DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import type { Hospital, HospitalAnnouncement } from '@/types/hospital';
import { getActiveAnnouncements } from '@/lib/hospitalAnnouncements';
import { getHospitalTypeDisplayText } from '@/lib/hospitalTypeText';
import { getHospitalDisplayTags } from '@/lib/hospitalDisplayTags';
import PetIcon from './PetIcon';



interface HospitalModalProps {
  hospital: Hospital;
  onClose: () => void;
}

export default function HospitalModal({ hospital, onClose }: HospitalModalProps) {
  const activeAnnouncements = getActiveAnnouncements(hospital.announcements);
  const specialClinic = hospital.specialClinic?.hasExoticSpecialClinic
    ? hospital.specialClinic
    : undefined;
  const hospitalTypeTags = getHospitalDisplayTags(hospital);

  return (
    <Dialog open={!!hospital} onClose={onClose} className="relative z-50">
      {/* 背景遮罩 */}
      <div className="fixed inset-0 bg-forest-950/40 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal 面板 */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative mx-4 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[32px] border border-sage-100 bg-linen-50 shadow-[0_30px_80px_rgba(61,91,74,0.22)]">
          <div className="border-b border-sage-100 bg-white/86 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <DialogTitle className="text-xl font-extrabold leading-8 text-forest-900 sm:text-2xl">
                  {hospital.name}
                </DialogTitle>
                <div className="mt-2 flex flex-wrap gap-2">
                  {hospitalTypeTags.map((tag) => (
                    <span key={tag} className="rounded-full bg-sage-100 px-3 py-1 text-xs font-bold text-forest-900">
                      {tag}
                    </span>
                  ))}
                  {hospital.hasEmergencyService && (
                    <span className="rounded-full bg-petal-100 px-3 py-1 text-xs font-bold text-rose-700">
                      夜間急診
                    </span>
                  )}
                  {specialClinic && (
                    <span className="rounded-full bg-petal-100 px-3 py-1 text-xs font-bold text-rose-700">
                      {specialClinic.label || '特寵特別門診'}
                    </span>
                  )}
                </div>
              </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-sage-100 bg-white text-stone-500 transition hover:text-forest-900"
              aria-label="關閉醫院詳情"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            </div>
          </div>

          <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            <div className="space-y-4 text-sm text-stone-700">
              <section className="rounded-3xl border border-sage-100 bg-white/76 p-4">
                <h3 className="mb-3 text-sm font-extrabold text-forest-900">基本資訊</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="mr-2 text-sage-600">📍</span>
                    <span>{hospital.address}</span>
                  </div>
                  {hospital.hours && (
                    <div className="flex items-start">
                      <span className="mr-2 text-sage-600">🕒</span>
                      <span className="break-words whitespace-pre-wrap text-sm leading-7 text-stone-700">
                          {hospital.hours}
                      </span>
                    </div>
                  )}
                  {hospital.phone && (
                    <div className="flex items-center">
                      <span className="mr-2 text-sage-600">📞</span>
                      {hospital.phone}
                    </div>
                  )}
                  {hospital.google?.rating && (
                    <div className="flex items-center">
                      <span className="mr-2 text-sage-600">★</span>
                      <span>
                        Google 參考：{hospital.google.rating}
                        {typeof hospital.google.reviewCount === 'number' && `（${hospital.google.reviewCount.toLocaleString()} 則評論）`}
                        {hospital.google.verifiedAt && `，確認日期：${hospital.google.verifiedAt}`}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <span className="mr-2 text-sage-600">🏷️</span>
                    {getHospitalTypeDisplayText(hospital)}
                  </div>
                </div>
              </section>
              {hospital.hasEmergencyService && (
                <div className="rounded-3xl border border-petal-200 bg-petal-100 p-4">
                  <span className="font-bold text-rose-700">🚨 此醫院提供夜間急診服務</span>
                  <span className="ml-1 break-words whitespace-pre-wrap text-sm text-stone-700">
                      {hospital.emergencyHours}
                  </span>
                </div>
              )}
              {activeAnnouncements.length > 0 && (
                <section className="rounded-3xl border border-petal-200 bg-white/76 p-4">
                  <h4 className="mb-3 font-extrabold text-forest-900">最新訊息</h4>
                  <div className="space-y-3">
                    {activeAnnouncements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className="rounded-3xl border border-petal-200 bg-petal-100/80 p-3"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-rose-700">
                            {announcementTypeText(announcement.type)}
                          </span>
                          {(announcement.startDate || announcement.endDate) && (
                            <span className="text-xs text-stone-500">
                              {formatDateRange(announcement.startDate, announcement.endDate)}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 font-bold text-forest-900">{announcement.title}</div>
                        {announcement.content && (
                          <p className="mt-1 whitespace-pre-wrap text-sm text-stone-700">{announcement.content}</p>
                        )}
                        {announcement.sourceLabel && (
                          <div className="mt-2 text-xs text-stone-500">
                            來源：
                            {announcement.sourceUrl ? (
                              <a
                                href={announcement.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-forest-800 hover:text-sage-600"
                              >
                                {announcement.sourceLabel}
                              </a>
                            ) : (
                              announcement.sourceLabel
                            )}
                            {announcement.verifiedAt && `，確認日期：${announcement.verifiedAt}`}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div className="grid gap-4 md:grid-cols-2">
              {hospital.services && hospital.services?.length > 0 && (
                <section className="rounded-3xl border border-sage-100 bg-white/76 p-4">
                  <h4 className="mb-3 font-extrabold text-forest-900">可提供服務 <span className="text-xs font-medium text-stone-500">僅供參考</span></h4>
                  <div className="flex flex-wrap gap-2">
                    {hospital.services.map(service => (
                      <span
                        key={service}
                        className="rounded-full bg-sage-100 px-3 py-1 text-sm font-semibold text-forest-900"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {hospital.pets && hospital.pets?.length > 0 && (
                <section className="rounded-3xl border border-sage-100 bg-white/76 p-4">
                  <h4 className="mb-3 font-extrabold text-forest-900">適合寵物 <span className="text-xs font-medium text-stone-500">僅供參考</span></h4>
                  <div className="flex flex-wrap gap-2">
                    {hospital.pets.map(pet => (
                      <span
                        key={pet}
                        className="flex items-center gap-1 rounded-full bg-honey-100 px-3 py-1 text-sm font-semibold text-clay-700"
                      >
                        <PetIcon pet={pet} size="sm" showLabel />
                      </span>
                    ))}
                  </div>
                </section>
              )}
              </div>

            {specialClinic && (
              <section className="rounded-3xl border border-petal-200 bg-white/76 p-4">
                <div className="rounded-3xl border border-petal-200 bg-petal-100/80 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-extrabold text-rose-700">特別門診提醒</h4>
                    <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-rose-700">
                      {specialClinic.label || '特寵特別門診'}
                    </span>
                    {specialClinic.reservationRequired && (
                      <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-forest-900">
                        需預約
                      </span>
                    )}
                  </div>
                  {specialClinic.note && (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-stone-700">{specialClinic.note}</p>
                  )}
                  {specialClinic.sourceLabel && (
                    <div className="mt-2 text-xs text-stone-500">
                      來源：
                      {specialClinic.sourceUrl ? (
                        <a
                          href={specialClinic.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-forest-800 hover:text-sage-600"
                        >
                          {specialClinic.sourceLabel}
                        </a>
                      ) : (
                        specialClinic.sourceLabel
                      )}
                      {specialClinic.verifiedAt && `，確認日期：${specialClinic.verifiedAt}`}
                    </div>
                  )}
                </div>
              </section>
            )}
            {hospital.clinicNotes && (
              <section className="rounded-3xl border border-sage-100 bg-white/76 p-4">
                <h4 className="mb-3 font-extrabold text-forest-900">備註 <span className="text-xs font-medium text-stone-500">僅供參考</span></h4>
                <div className="flex flex-wrap gap-2">
                  <span
                      className="flex items-center gap-1 whitespace-pre-wrap rounded-3xl bg-honey-100 px-3 py-2 text-sm text-clay-700"
                    >
                      {hospital.clinicNotes}
                    </span>
                </div>
              </section>
            )}
            </div>
          </div>

          <div className="border-t border-sage-100 bg-white/86 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                hospital.address
              )}`}
              target="_blank"
              className="inline-flex items-center justify-center rounded-2xl bg-forest-800 px-4 py-3 text-sm font-extrabold text-white shadow-soft transition hover:bg-forest-900"
              rel="noopener noreferrer"
            >
              🧭 導航路線
            </a>
            {hospital.website && (
              <a
                href={hospital.website}
                target="_blank"
                className="inline-flex items-center justify-center rounded-2xl border border-sage-300 bg-white px-4 py-3 text-sm font-extrabold text-forest-900 shadow-soft transition hover:bg-sage-100"
                rel="noopener noreferrer"
              >
                🌐 訪問網站
              </a>
            )}
          </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

function announcementTypeText(type: HospitalAnnouncement['type']) {
  switch (type) {
    case 'closure':
      return '休診';
    case 'hours_change':
      return '時間異動';
    case 'service_change':
      return '服務異動';
    case 'notice':
      return '提醒';
    default:
      return '公告';
  }
}

function formatDateRange(startDate?: string, endDate?: string) {
  if (startDate && endDate && startDate !== endDate) {
    return `${startDate} 至 ${endDate}`;
  }

  return startDate || endDate || '';
}
