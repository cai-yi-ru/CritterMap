export const siteUrl = "https://paw-map.vercel.app";
export const siteName = "小獸所";
export const defaultTitle = "全台特寵醫院地圖｜兔、倉鼠、鳥類與爬蟲看診查詢｜小獸所";
export const defaultDescription = "依縣市與寵物類別查詢全台特寵動物醫院，比較門診、預約與急診聯絡資訊，查看醫院公告及照護文章。出發前請先致電確認看診物種與時段。";
export const blogDescription = "從倉鼠的居住環境、日常行為到夏天降溫，整理特寵照護與看診準備。找到適合你家小獸的照護文章，文章供參考，不取代獸醫師診斷。";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function latestDate(values: (string | undefined | null)[]) {
  return values
    .filter((value): value is string => Boolean(value) && !Number.isNaN(Date.parse(value!)))
    .sort((a, b) => Date.parse(b) - Date.parse(a))[0];
}
