"use client";

import { Badge } from "@/components/ui/badge";
import { formatPeriods, getBusinessHoursStatus, getTaiwanNow, weekdays } from "@/lib/businessHours";
import type { Hospital } from "@/types/hospital";

type BusinessHours = NonNullable<Hospital["business_hours"]>;

type BusinessHoursSummaryProps = {
  businessHours?: Hospital["business_hours"];
  fallbackHours?: string;
};

export default function BusinessHoursSummary({ businessHours, fallbackHours }: BusinessHoursSummaryProps) {
  if (!businessHours) {
    if (!fallbackHours) return null;

    return (
      <div>
        <div className="text-xs font-bold text-stone-500">營業時間</div>
        <p className="mt-1 whitespace-pre-wrap text-sm leading-7 text-stone-700">{fallbackHours}</p>
      </div>
    );
  }

  const now = new Date();
  const todayKey = getTaiwanNow(now).weekday;
  const todayLabel = weekdays.find((weekday) => weekday.key === todayKey)?.label || "今日";
  const todayPeriods = businessHours[todayKey] || [];
  const todayStatus = getBusinessHoursStatus(businessHours as BusinessHours, now);

  return (
    <section className="md:col-span-2">
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-xs font-bold text-stone-500">營業時間</div>
        {todayStatus.kind !== "open" && (
          <Badge
            className={
              todayStatus.kind === "closed-today"
                ? "bg-petal-100 text-rose-700"
                : "bg-honey-100 text-clay-700"
            }
          >
            {todayStatus.badge}
          </Badge>
        )}
      </div>

      <div className="mt-2 rounded-xl border border-sage-100 bg-white p-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <div className="text-sm font-extrabold text-forest-900">今日，{todayLabel}</div>
            <p className="mt-1 text-base font-bold text-forest-900">{todayStatus.summary}</p>
          </div>
          <p className="text-sm leading-6 text-stone-700">{formatPeriods(todayPeriods)}</p>
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-sage-100 bg-white">
        {weekdays.map((weekday) => {
          const periods = businessHours[weekday.key] || [];
          const isToday = weekday.key === todayKey;

          return (
            <div
              key={weekday.key}
              className={`grid grid-cols-[48px_1fr_auto] items-center gap-3 border-b border-sage-100 px-3 py-2 text-sm last:border-b-0 ${
                isToday ? "bg-sage-50" : ""
              }`}
            >
              <span className="font-bold text-forest-900">{weekday.label}</span>
              <span className={periods.length > 0 ? "text-stone-700" : "text-stone-500"}>
                {formatPeriods(periods)}
              </span>
              {isToday && (
                <Badge variant="outline" className="border-sage-200 bg-white text-forest-900">
                  今天
                </Badge>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-2 text-xs leading-6 text-stone-500">
        營業狀態依整理時段初步判斷，特寵門診、指定醫師與臨時異動仍請致電確認。
      </p>
    </section>
  );
}
