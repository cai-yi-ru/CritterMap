'use client';

import { Dialog,DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import type { Hospital } from '@/types/hospital';



interface HospitalModalProps {
  hospital: Hospital;
  onClose: () => void;
}

export default function HospitalModal({ hospital, onClose }: HospitalModalProps) {
  return (
    <Dialog open={!!hospital} onClose={onClose} className="relative z-50">
      {/* 背景遮罩 */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal 面板 */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-start mb-4">
            <DialogTitle className="text-xl font-bold text-mintdark">
              {hospital.name}
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition duration-150"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start">
              <span className="mr-2 text-mint">📍</span>
              {hospital.address}
            </div>
            {hospital.hours && (
              <div className="flex items-start">
                <span className="mr-2 text-mint ">🕒</span>
                <span className="text-sm text-gray-700 break-words whitespace-pre-wrap">
                    {hospital.hours}
                </span>
              </div>
            )}
            {hospital.phone && (
              <div className="flex items-center">
                <span className="mr-2 text-mint">📞</span>
                {hospital.phone}
              </div>
            )}
            <div className="flex items-center">
              <span className="mr-2 text-mint">🏷️</span>
              {hospital.typeText}
            </div>
            {/* {hospital.rating && (
              <div className="flex items-center">
                <span className="text-yellow-400 mr-2">⭐</span>
                {hospital.rating.toFixed(1)}
              </div>
            )} */}
            {hospital.hasEmergencyService && (
              <div className="p-4 bg-softpink/30 rounded-lg border border-softpink/30">
                <span className="text-red-700 font-medium">🚨 此醫院提供夜間急診服務</span>
                <span className="text-sm text-gray-700 break-words whitespace-pre-wrap ml-1">
                    {hospital.emergencyHours}
                </span>
              </div>
            )}

            {hospital.services && hospital.services?.length > 0 && (
              <div className="border-t border-gray-100 pt-5">
                <h4 className="font-medium text-mintdark mb-3">可提供服務(<strong>僅供參考，前往之前務必致電詢問</strong>)</h4>
                <div className="flex flex-wrap gap-2">
                  {hospital.services.map(service => (
                    <span
                      key={service}
                      className="px-3 py-1 text-sm rounded-full bg-mintlight text-mintdark"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {hospital.pets && hospital.pets?.length > 0 && (
              <div className="border-t border-gray-100 pt-5">
                <h4 className="font-medium text-mintdark mb-3">適合寵物(<strong>僅供參考，前往之前務必致電詢問</strong>)</h4>
                <div className="flex flex-wrap gap-2">
                  {hospital.pets.map(pet => (
                    <span
                      key={pet}
                      className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-cream text-darktext"
                    >
                      {petIcon(pet)} {pet}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {hospital.clinicNotes && (
              <div className="border-t border-gray-100 pt-5">
                <h4 className="font-medium text-mintdark mb-3">備註(<strong>僅供參考</strong>)</h4>
                <div className="flex flex-wrap gap-2">
                  <span
                      className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg bg-cream text-darktext"
                    >
                      {hospital.clinicNotes}
                    </span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-between">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                hospital.address
              )}`}
              target="_blank"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white bg-mint hover:bg-mintdark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mint transition duration-150"
              rel="noopener noreferrer"
            >
              🧭 導航路線
            </a>
            {hospital.website && (
              <a
                href={hospital.website}
                target="_blank"
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-mint border border-mint hover:bg-mint hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mint transition duration-150"
                rel="noopener noreferrer"
              >
                🌐 訪問網站
              </a>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

function petIcon(type: string) {
    switch (type) {
      case '貓': return '🐱';
      case '犬':
      case '狗': return '🐶';
      case '兔': return '🐰';
      case '鳥類': return '🐦';
      case '鼠':
      case '鼠類':
      case '倉鼠':
      case '天竺鼠': return '🐹';
      case '刺蝟': return '🦔';
      case '沙鼠': return '🐭';
      case '烏龜': return '🐢';
      default: return '';
    }
  }