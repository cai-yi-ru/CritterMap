/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const vm = require("vm");

const TARGET_DIR = path.join(process.cwd(), "src", "utils");
const LAST_CHECKED = "2026-03-25";
const GROUP_ORDER = [
  "狗",
  "貓",
  "兔",
  "鼠",
  "天竺鼠",
  "鳥類",
  "爬蟲",
  "刺蝟",
  "蜜袋鼯",
  "貂",
  "龍貓",
  "兩棲",
  "野生動物",
  "其他特寵",
];

function loadHospitalList(filePath) {
  const code = fs.readFileSync(filePath, "utf8");
  const output = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
    },
  }).outputText;
  const sandbox = { exports: {} };
  vm.runInNewContext(output, sandbox, { filename: filePath });
  const exportName = Object.keys(sandbox.exports).find((name) =>
    Array.isArray(sandbox.exports[name])
  );

  if (!exportName) {
    throw new Error(`No exported hospital array found in ${filePath}`);
  }

  return { exportName, hospitals: sandbox.exports[exportName] };
}

function isExoticHospital(hospital) {
  return (
    hospital.type === "exotic" ||
    String(hospital.typeText || "").includes("特寵") ||
    String(hospital.typeText || "").includes("特殊寵物")
  );
}

function normalizeSlot(slot) {
  return String(slot).replace(/[–—]/g, "-");
}

function normalizeBusinessHours(businessHours) {
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const normalized = {};

  for (const day of days) {
    normalized[day] = Array.isArray(businessHours?.[day])
      ? businessHours[day].map(normalizeSlot)
      : [];
  }

  return normalized;
}

function textIncludesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function addGroup(groups, text) {
  if (!text) {
    return;
  }

  if (textIncludesAny(text, ["狗", "犬"])) groups.add("狗");
  if (text.includes("貓")) groups.add("貓");
  if (text.includes("兔")) groups.add("兔");
  if (text.includes("天竺鼠")) groups.add("天竺鼠");
  if (textIncludesAny(text, ["倉鼠", "黃金鼠", "三線鼠", "楓葉鼠", "鼠"])) {
    groups.add("鼠");
  }
  if (textIncludesAny(text, ["鳥", "鸚鵡", "鴿", "禽"])) groups.add("鳥類");
  if (textIncludesAny(text, ["爬蟲", "龜", "蛇", "蜥", "守宮"])) groups.add("爬蟲");
  if (text.includes("刺蝟")) groups.add("刺蝟");
  if (text.includes("蜜袋鼯")) groups.add("蜜袋鼯");
  if (textIncludesAny(text, ["貂", "雪貂"])) groups.add("貂");
  if (text.includes("龍貓")) groups.add("龍貓");
  if (textIncludesAny(text, ["兩棲", "角蛙"])) groups.add("兩棲");
  if (text.includes("野生動物")) groups.add("野生動物");
  if (textIncludesAny(text, ["小型哺乳", "狐獴", "松鼠", "水族", "馬匹", "馬"])) {
    groups.add("其他特寵");
  }
}

function buildPetCategoryGroup(hospital) {
  const groups = new Set();
  const sourceValues = [
    ...(hospital.pet_category_group || []),
    ...(hospital.pets || []),
    ...(hospital.specialties || []),
    ...(hospital.services || []),
    hospital.typeText,
    hospital.clinicNotes,
  ];

  for (const value of sourceValues) {
    addGroup(groups, String(value || ""));
  }

  if (groups.size === 0) {
    groups.add("其他特寵");
  }

  return GROUP_ORDER.filter((group) => groups.has(group));
}

function hasDogOrCat(hospital) {
  const text = [
    ...(hospital.pet_category_group || []),
    ...(hospital.pets || []),
    hospital.typeText,
    hospital.clinicNotes,
  ].join(" ");

  return textIncludesAny(text, ["犬", "狗", "貓"]);
}

function hasNightClinic(businessHours) {
  return Object.values(businessHours).some((slots) =>
    slots.some((slot) => {
      const end = slot.split("-")[1];
      if (!end) return false;
      const [hour, minute] = end.split(":").map(Number);
      return hour > 20 || (hour === 20 && minute > 0);
    })
  );
}

function normalizeHospital(hospital) {
  if (!isExoticHospital(hospital)) {
    return hospital;
  }

  const businessHours = normalizeBusinessHours(hospital.business_hours);
  const text = [hospital.hours, hospital.clinicNotes].join(" ");
  const hasEmergencyService =
    typeof hospital.hasEmergencyService === "boolean"
      ? hospital.hasEmergencyService
      : false;

  return {
    ...hospital,
    typeText: hasDogOrCat(hospital) ? "犬貓與特寵診療" : "特殊寵物診療",
    business_hours: businessHours,
    pet_category_group: buildPetCategoryGroup(hospital),
    reservationRequired:
      typeof hospital.reservationRequired === "boolean"
        ? hospital.reservationRequired
        : text.includes("預約"),
    hasEmergencyService,
    emergencyHours: hasEmergencyService ? hospital.emergencyHours || "" : "",
    nightClinic:
      typeof hospital.nightClinic === "boolean"
        ? hospital.nightClinic
        : hasNightClinic(businessHours),
    last_checked: hospital.last_checked || LAST_CHECKED,
  };
}

function main() {
  const files = fs
    .readdirSync(TARGET_DIR)
    .filter((file) => file.endsWith("HospitalList.ts"))
    .sort();

  for (const file of files) {
    const filePath = path.join(TARGET_DIR, file);
    const { exportName, hospitals } = loadHospitalList(filePath);
    const normalized = hospitals.map(normalizeHospital);
    const content = `export const ${exportName} = ${JSON.stringify(normalized, null, 2)};\n`;
    fs.writeFileSync(filePath, content);
  }
}

main();
