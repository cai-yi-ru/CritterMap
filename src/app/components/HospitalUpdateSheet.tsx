"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getActiveAnnouncements } from "@/lib/hospitalAnnouncements";
import { getHospitalDisplayTags } from "@/lib/hospitalDisplayTags";
import type { Hospital, HospitalUpdate } from "@/types/hospital";
import { ExternalLinkIcon, MapPinIcon, PhoneIcon, StethoscopeIcon } from "lucide-react";
import PetIcon from "./PetIcon";

type HospitalUpdateSheetProps = {
  update: HospitalUpdate | null;
  hospital: Hospital | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewHospitalDetail: (hospital: Hospital) => void;
};

const updateTypeText: Record<HospitalUpdate["type"], string> = {
  hours: "營業時間更新",
  content: "內容更新",
  announcement: "最新公告",
  services: "服務項目",
  contact: "聯絡資訊",
};

export default function HospitalUpdateSheet({
  update,
  hospital,
  open,
  onOpenChange,
  onViewHospitalDetail,
}: HospitalUpdateSheetProps) {
  const activeAnnouncements = hospital ? getActiveAnnouncements(hospital.announcements) : [];
  const specialClinic = hospital?.specialClinic?.hasExoticSpecialClinic ? hospital.specialClinic : undefined;
  const visiblePets = hospital?.pets?.slice(0, 8) || [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-[calc(100vw-1rem)] border-sage-200 bg-card p-0 sm:max-w-md">
        {update && hospital && (
          <>
            <SheetHeader className="border-b border-sage-100 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-primary text-primary-foreground">{updateTypeText[update.type]}</Badge>
                <time className="text-xs font-medium text-muted-foreground" dateTime={update.updatedAt}>
                  更新於 {update.updatedAt}
                </time>
              </div>
              <SheetTitle className="text-xl font-extrabold leading-7 text-forest-900">
                {update.title}
              </SheetTitle>
              <SheetDescription className="text-pretty leading-7 text-stone-700">
                {update.summary}
              </SheetDescription>
              {(update.sourceLabel || update.verifiedAt) && (
                <div className="text-xs leading-6 text-muted-foreground">
                  {update.sourceLabel && (
                    <>
                      來源：
                      {update.sourceUrl ? (
                        <a
                          href={update.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-primary hover:underline"
                        >
                          {update.sourceLabel}
                        </a>
                      ) : (
                        update.sourceLabel
                      )}
                    </>
                  )}
                  {update.verifiedAt && `，確認日期：${update.verifiedAt}`}
                </div>
              )}
            </SheetHeader>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              <section className="rounded-2xl border border-sage-100 bg-sage-50/70 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary">
                    <StethoscopeIcon />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-extrabold leading-6 text-forest-900">{hospital.name}</h3>
                    <p className="mt-1 text-sm leading-6 text-stone-700">{hospital.address}</p>
                    {hospital.phone && (
                      <p className="mt-1 text-sm font-semibold text-forest-800">{hospital.phone}</p>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {getHospitalDisplayTags(hospital).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-forest-900">
                      {tag}
                    </Badge>
                  ))}
                  {hospital.hasEmergencyService && <Badge className="bg-petal-100 text-rose-700">夜間急診</Badge>}
                  {specialClinic && (
                    <Badge className="bg-petal-100 text-rose-700">
                      {specialClinic.label || "特寵特別門診"}
                    </Badge>
                  )}
                </div>
              </section>

              {visiblePets.length > 0 && (
                <section className="mt-4">
                  <h4 className="mb-2 text-sm font-bold text-forest-900">支援寵物</h4>
                  <div className="flex flex-wrap gap-2">
                    {visiblePets.map((pet) => (
                      <span
                        key={pet}
                        className="inline-flex items-center gap-1 rounded-full border border-sage-100 bg-white px-2.5 py-1 text-xs font-semibold text-forest-900"
                      >
                        <PetIcon pet={pet} size="sm" showLabel />
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {(activeAnnouncements.length > 0 || specialClinic) && (
                <>
                  <Separator className="my-4" />
                  <section>
                    <h4 className="mb-2 text-sm font-bold text-forest-900">就診前提醒</h4>
                    <div className="flex flex-col gap-2">
                      {activeAnnouncements.slice(0, 2).map((announcement) => (
                        <div key={announcement.id} className="rounded-xl border border-petal-200 bg-petal-100/60 p-3">
                          <div className="text-sm font-bold text-rose-700">{announcement.title}</div>
                          {announcement.content && (
                            <p className="mt-1 line-clamp-3 text-sm leading-6 text-stone-700">{announcement.content}</p>
                          )}
                        </div>
                      ))}
                      {specialClinic?.note && (
                        <div className="rounded-xl border border-petal-200 bg-white p-3">
                          <div className="text-sm font-bold text-rose-700">{specialClinic.label || "特寵特別門診"}</div>
                          <p className="mt-1 text-sm leading-6 text-stone-700">{specialClinic.note}</p>
                        </div>
                      )}
                    </div>
                  </section>
                </>
              )}
            </div>

            <SheetFooter className="border-t border-sage-100 bg-white/80 p-4">
              <Button size="lg" onClick={() => onViewHospitalDetail(hospital)}>
                <ExternalLinkIcon data-icon="inline-start" />
                查看完整醫院資料
              </Button>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Button variant="outline" render={<a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hospital.address)}`} target="_blank" rel="noopener noreferrer" />}>
                  <MapPinIcon data-icon="inline-start" />
                  導航路線
                </Button>
                {hospital.phone && (
                  <Button variant="outline" render={<a href={`tel:${hospital.phone}`} />}>
                    <PhoneIcon data-icon="inline-start" />
                    撥打電話
                  </Button>
                )}
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
