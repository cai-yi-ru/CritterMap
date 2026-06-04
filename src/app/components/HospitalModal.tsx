"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { getActiveAnnouncements } from "@/lib/hospitalAnnouncements";
import { getHospitalDisplayTags } from "@/lib/hospitalDisplayTags";
import { getHospitalReservationLabel } from "@/lib/hospitalReservation";
import { getHospitalTypeDisplayText } from "@/lib/hospitalTypeText";
import type { Hospital, HospitalAnnouncement } from "@/types/hospital";
import { ExternalLinkIcon, NavigationIcon, PhoneIcon } from "lucide-react";
import type { ReactNode } from "react";
import BusinessHoursSummary from "./BusinessHoursSummary";
import PetIcon from "./PetIcon";

interface HospitalModalProps {
  hospital: Hospital;
  onClose: () => void;
}

export default function HospitalModal({ hospital, onClose }: HospitalModalProps) {
  const activeAnnouncements = getActiveAnnouncements(hospital.announcements);
  const specialClinic = hospital.specialClinic?.hasExoticSpecialClinic ? hospital.specialClinic : undefined;
  const hospitalTypeTags = getHospitalDisplayTags(hospital);

  return (
    <Dialog open={Boolean(hospital)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex h-[calc(100dvh-1rem)] max-h-[calc(100dvh-1rem)] max-w-[calc(100vw-1rem)] flex-col gap-0 overflow-hidden border-sage-100 bg-card p-0 sm:h-[92vh] sm:max-h-[760px] sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-b border-sage-100 p-5 pr-12 sm:p-6 sm:pr-14">
          <div className="flex flex-wrap gap-2">
            {hospitalTypeTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-forest-900">
                {tag}
              </Badge>
            ))}
            {hospital.hasEmergencyService && <Badge className="bg-petal-100 text-rose-700">夜間急診</Badge>}
            {specialClinic && <Badge className="bg-petal-100 text-rose-700">{specialClinic.label || "特寵特別門診"}</Badge>}
          </div>
          <DialogTitle className="text-2xl font-extrabold leading-8 text-forest-900">
            {hospital.name}
          </DialogTitle>
          <DialogDescription className="leading-7 text-stone-600">
            {hospital.address}
          </DialogDescription>
        </DialogHeader>

        <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          <div className="grid gap-4">
            <section className="rounded-2xl border border-sage-100 bg-sage-50/70 p-4">
              <h3 className="text-sm font-extrabold text-forest-900">就診前重點</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <InfoLine label="電話" value={hospital.phone || "尚未整理"} icon={<PhoneIcon />} />
                <InfoLine label="分類" value={getHospitalTypeDisplayText(hospital)} />
                <InfoLine label="預約方式" value={getHospitalReservationLabel(hospital)} />
                <BusinessHoursSummary businessHours={hospital.business_hours} fallbackHours={hospital.hours} />
                {hospital.google?.rating && (
                  <div className="md:col-span-2">
                    <div className="flex flex-col gap-1 rounded-xl border border-sage-100 bg-white p-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <div className="text-xs font-bold text-stone-500">Google 參考</div>
                        <p className="mt-1 text-sm leading-7 text-stone-700">
                          ★ {hospital.google.rating}
                          {typeof hospital.google.reviewCount === "number" && `，${hospital.google.reviewCount.toLocaleString()} 則評論`}
                        </p>
                      </div>
                      {hospital.google.verifiedAt && (
                        <div className="text-xs text-stone-500 sm:text-right">
                          確認日期：{hospital.google.verifiedAt}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {hospital.hasEmergencyService && (
              <Alert className="border-petal-200 bg-petal-100/70 text-rose-800">
                <AlertTitle className="font-extrabold">此醫院提供夜間急診服務</AlertTitle>
                {hospital.emergencyHours && (
                  <AlertDescription className="mt-1 whitespace-pre-wrap text-stone-700">
                    {hospital.emergencyHours}
                  </AlertDescription>
                )}
              </Alert>
            )}

            {activeAnnouncements.length > 0 && (
              <section className="rounded-2xl border border-petal-200 bg-white p-4">
                <h3 className="text-sm font-extrabold text-forest-900">最新訊息</h3>
                <div className="mt-3 grid gap-3">
                  {activeAnnouncements.map((announcement) => (
                    <article key={announcement.id} className="rounded-xl border border-petal-200 bg-petal-100/50 p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-white text-rose-700">{announcementTypeText(announcement.type)}</Badge>
                        {(announcement.startDate || announcement.endDate) && (
                          <span className="text-xs text-stone-500">
                            {formatDateRange(announcement.startDate, announcement.endDate)}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 font-bold text-forest-900">{announcement.title}</div>
                      {announcement.content && <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-stone-700">{announcement.content}</p>}
                      {announcement.sourceLabel && (
                        <div className="mt-2 text-xs text-stone-500">
                          來源：
                          {announcement.sourceUrl ? (
                            <a href={announcement.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                              {announcement.sourceLabel}
                            </a>
                          ) : (
                            announcement.sourceLabel
                          )}
                          {announcement.verifiedAt && `，確認日期：${announcement.verifiedAt}`}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {hospital.services && hospital.services.length > 0 && (
                <section className="rounded-2xl border border-sage-100 bg-white p-4">
                  <h3 className="text-sm font-extrabold text-forest-900">可提供服務 <span className="text-xs font-medium text-stone-500">僅供參考</span></h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {hospital.services.map((service) => (
                      <Badge key={service} variant="secondary" className="text-forest-900">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}

              {hospital.pets && hospital.pets.length > 0 && (
                <section className="rounded-2xl border border-sage-100 bg-white p-4">
                  <h3 className="text-sm font-extrabold text-forest-900">適合寵物 <span className="text-xs font-medium text-stone-500">僅供參考</span></h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {hospital.pets.map((pet) => (
                      <span key={pet} className="inline-flex items-center gap-1 rounded-full border border-honey-200 bg-honey-100 px-2.5 py-1 text-xs font-semibold text-clay-700">
                        <PetIcon pet={pet} size="sm" showLabel />
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {specialClinic && (
              <Alert className="border-petal-200 bg-petal-100/60">
                <AlertTitle className="font-extrabold text-rose-700">
                  {specialClinic.label || "特寵特別門診"}
                  {specialClinic.reservationRequired && "，需預約"}
                </AlertTitle>
                {specialClinic.note && <AlertDescription className="mt-1 whitespace-pre-wrap text-stone-700">{specialClinic.note}</AlertDescription>}
              </Alert>
            )}

            {hospital.clinicNotes && (
              <section className="rounded-2xl border border-sage-100 bg-white p-4">
                <h3 className="text-sm font-extrabold text-forest-900">備註 <span className="text-xs font-medium text-stone-500">僅供參考</span></h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-stone-700">{hospital.clinicNotes}</p>
              </section>
            )}

            <Separator />
            <p className="text-xs leading-6 text-stone-500">
              資料可能異動，出發前請以醫院公告與電話確認為準。
            </p>
          </div>
        </div>

        <DialogFooter className="mx-0 mb-0 shrink-0 rounded-none border-t border-sage-100 bg-white/85 p-4 sm:flex-row">
          <Button nativeButton={false} render={<a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hospital.address)}`} target="_blank" rel="noopener noreferrer" />}>
            <NavigationIcon data-icon="inline-start" />
            導航路線
          </Button>
          {hospital.phone && (
            <Button variant="outline" nativeButton={false} render={<a href={`tel:${hospital.phone}`} />}>
              <PhoneIcon data-icon="inline-start" />
              撥打電話
            </Button>
          )}
          {hospital.website && (
            <Button variant="outline" nativeButton={false} render={<a href={hospital.website} target="_blank" rel="noopener noreferrer" />}>
              <ExternalLinkIcon data-icon="inline-start" />
              訪問網站
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InfoLine({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div>
      <div className="text-xs font-bold text-stone-500">{label}</div>
      <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-stone-700">
        {icon}
        <span>{value}</span>
      </div>
    </div>
  );
}

function announcementTypeText(type: HospitalAnnouncement["type"]) {
  switch (type) {
    case "closure":
      return "休診";
    case "hours_change":
      return "時間異動";
    case "service_change":
      return "服務異動";
    case "notice":
      return "提醒";
    default:
      return "公告";
  }
}

function formatDateRange(startDate?: string, endDate?: string) {
  if (startDate && endDate && startDate !== endDate) {
    return `${startDate} 至 ${endDate}`;
  }

  return startDate || endDate || "";
}
