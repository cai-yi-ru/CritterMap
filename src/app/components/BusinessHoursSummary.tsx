"use client";

import { Badge } from "@/components/ui/badge";
import type { Hospital } from "@/types/hospital";

type BusinessHours = NonNullable<Hospital["business_hours"]>;
type WeekdayKey = keyof BusinessHours;

type BusinessHoursSummaryProps = {
  businessHours?: Hospital["business_hours"];
  fallbackHours?: string;
};

const weekdays: Array<{ key: WeekdayKey; label: string }> = [
  { key: "mon", label: "週一" },
  { key: "tue", label: "週二" },
  { key: "wed", label: "週三" },
  { key: "thu", label: "週四" },
  { key: "fri", label: "週五" },
  { key: "sat", label: "週六" },
  { key: "sun", label: "週日" },
];

const dayIndexToKey: WeekdayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

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
  const todayKey = dayIndexToKey[now.getDay()];
  const todayLabel = weekdays.find((weekday) => weekday.key === todayKey)?.label || "今日";
  const todayPeriods = businessHours[todayKey] || [];
  const todayStatus = getTodayStatus(todayPeriods, now);

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

function getTodayStatus(periods: string[], now: Date) {
  if (periods.length === 0) {
    return {
      kind: "closed-today" as const,
      badge: "今日休診",
      summary: "今日休診",
    };
  }

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const parsedPeriods = periods.map(parsePeriod).filter(Boolean);
  const currentPeriod = parsedPeriods.find((period) => {
    if (!period) return false;
    return period.end < period.start
      ? nowMinutes >= period.start || nowMinutes <= period.end
      : nowMinutes >= period.start && nowMinutes <= period.end;
  });

  if (currentPeriod) {
    return {
      kind: "open" as const,
      badge: "營業中",
      summary: `營業中至 ${formatMinutes(currentPeriod.end, currentPeriod.end < currentPeriod.start)}`,
    };
  }

  const nextPeriod = parsedPeriods
    .filter((period): period is NonNullable<typeof period> => Boolean(period))
    .filter((period) => period.start > nowMinutes)
    .sort((a, b) => a.start - b.start)[0];

  if (nextPeriod) {
    return {
      kind: "later" as const,
      badge: "今日有營業",
      summary: `今日尚未營業，${formatMinutes(nextPeriod.start)} 開始`,
    };
  }

  return {
    kind: "ended" as const,
    badge: "今日已結束",
    summary: "今日營業時段已結束",
  };
}

function formatPeriods(periods: string[]) {
  if (periods.length === 0) return "休診";
  return periods.map(formatPeriod).join("、");
}

function formatPeriod(period: string) {
  const parsed = parsePeriod(period);
  if (!parsed) return period;

  return `${formatMinutes(parsed.start)}-${formatMinutes(parsed.end, parsed.end < parsed.start)}`;
}

function parsePeriod(period: string) {
  const [start, end] = period.split("-");
  const startMinutes = parseTime(start);
  const endMinutes = parseTime(end);

  if (startMinutes === undefined || endMinutes === undefined) return undefined;

  return {
    start: startMinutes,
    end: endMinutes,
  };
}

function parseTime(value?: string) {
  if (!value) return undefined;
  const [hour, minute] = value.split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return undefined;
  return hour * 60 + minute;
}

function formatMinutes(minutes: number, isNextDay = false) {
  const normalizedMinutes = minutes % (24 * 60);
  const hour = Math.floor(normalizedMinutes / 60).toString().padStart(2, "0");
  const minute = (normalizedMinutes % 60).toString().padStart(2, "0");
  return `${isNextDay ? "隔日 " : ""}${hour}:${minute}`;
}
