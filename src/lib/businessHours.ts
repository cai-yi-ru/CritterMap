import type { Hospital } from "@/types/hospital";

export type BusinessHours = NonNullable<Hospital["business_hours"]>;
export type WeekdayKey = keyof BusinessHours;

export const weekdays: Array<{ key: WeekdayKey; label: string }> = [
  { key: "mon", label: "週一" },
  { key: "tue", label: "週二" },
  { key: "wed", label: "週三" },
  { key: "thu", label: "週四" },
  { key: "fri", label: "週五" },
  { key: "sat", label: "週六" },
  { key: "sun", label: "週日" },
];

export const dayIndexToKey: WeekdayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

type TaiwanNow = {
  weekday: WeekdayKey;
  previousWeekday: WeekdayKey;
  minutes: number;
};

type ParsedPeriod = {
  start: number;
  end: number;
};

type CurrentPeriod = ParsedPeriod & {
  endIsNextDay: boolean;
  isAllDay: boolean;
};

const weekdayPartToKey: Record<string, WeekdayKey> = {
  Sun: "sun",
  Mon: "mon",
  Tue: "tue",
  Wed: "wed",
  Thu: "thu",
  Fri: "fri",
  Sat: "sat",
};

const taiwanDateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Taipei",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function getTaiwanNow(now = new Date()): TaiwanNow {
  const parts = taiwanDateTimeFormatter.formatToParts(now);
  const weekdayPart = parts.find((part) => part.type === "weekday")?.value || "Sun";
  const hourPart = parts.find((part) => part.type === "hour")?.value || "00";
  const minutePart = parts.find((part) => part.type === "minute")?.value || "00";
  const weekday = weekdayPartToKey[weekdayPart] || "sun";
  const weekdayIndex = dayIndexToKey.indexOf(weekday);

  return {
    weekday,
    previousWeekday: dayIndexToKey[(weekdayIndex + 6) % 7],
    minutes: (Number(hourPart) % 24) * 60 + Number(minutePart),
  };
}

export function isOpenNow(businessHours?: Hospital["business_hours"], now = new Date()): boolean {
  if (!businessHours) return false;

  return Boolean(findCurrentPeriod(businessHours, getTaiwanNow(now)));
}

export function getBusinessHoursStatus(businessHours: BusinessHours, now = new Date()) {
  const taiwanNow = getTaiwanNow(now);
  const todayPeriods = businessHours[taiwanNow.weekday] || [];
  const currentPeriod = findCurrentPeriod(businessHours, taiwanNow);

  if (currentPeriod) {
    return {
      kind: "open" as const,
      badge: "營業中",
      summary: currentPeriod.isAllDay
        ? "24 小時營業中"
        : `營業中至 ${formatMinutes(currentPeriod.end, currentPeriod.endIsNextDay)}`,
    };
  }

  if (todayPeriods.length === 0) {
    return {
      kind: "closed-today" as const,
      badge: "今日休診",
      summary: "今日休診",
    };
  }

  const nextPeriod = todayPeriods
    .map(parsePeriod)
    .filter((period): period is ParsedPeriod => Boolean(period))
    .filter((period) => period.start > taiwanNow.minutes)
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

export function formatPeriods(periods: string[]) {
  if (periods.length === 0) return "休診";
  return periods.map(formatPeriod).join("、");
}

function findCurrentPeriod(businessHours: BusinessHours, taiwanNow: TaiwanNow): CurrentPeriod | undefined {
  const todayPeriods = (businessHours[taiwanNow.weekday] || [])
    .map(parsePeriod)
    .filter((period): period is ParsedPeriod => Boolean(period));
  const previousOvernightPeriods = (businessHours[taiwanNow.previousWeekday] || [])
    .map(parsePeriod)
    .filter((period): period is ParsedPeriod => Boolean(period))
    .filter((period) => period.end < period.start);

  const todayPeriod = todayPeriods.find((period) => {
    if (isAllDayPeriod(period)) {
      return true;
    }

    if (period.end < period.start) {
      return taiwanNow.minutes >= period.start;
    }

    return taiwanNow.minutes >= period.start && taiwanNow.minutes <= period.end;
  });

  if (todayPeriod) {
    return {
      ...todayPeriod,
      endIsNextDay: todayPeriod.end < todayPeriod.start,
      isAllDay: isAllDayPeriod(todayPeriod),
    };
  }

  const previousPeriod = previousOvernightPeriods.find((period) => taiwanNow.minutes <= period.end);

  if (!previousPeriod) return undefined;

  return {
    ...previousPeriod,
    endIsNextDay: false,
    isAllDay: false,
  };
}

function formatPeriod(period: string) {
  const parsed = parsePeriod(period);
  if (!parsed) return period;
  if (isAllDayPeriod(parsed)) return "24 小時營業";

  return `${formatMinutes(parsed.start)}-${formatMinutes(parsed.end, parsed.end < parsed.start)}`;
}

function parsePeriod(period: string): ParsedPeriod | undefined {
  const [start, end] = period.split("-");
  const startMinutes = parseTime(start);
  const endMinutes = parseTime(end);

  if (startMinutes === undefined || endMinutes === undefined) return undefined;

  return {
    start: startMinutes,
    end: endMinutes,
  };
}

function isAllDayPeriod(period: ParsedPeriod) {
  return period.start === 0 && (period.end === 0 || period.end === 24 * 60);
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
