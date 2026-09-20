import type { Metadata } from 'next';

export const siteUrl = "https://crittermap.snyr.tw";
export const siteName = "小獸所";
export const defaultTitle = "特寵醫院查詢｜全台名單、看診物種與急診聯絡｜小獸所";
export const defaultDescription = "找兔子、倉鼠、天竺鼠、鳥類或爬蟲的動物醫院？依縣市、看診物種與營業狀態查詢全台特寵醫院，查看電話、地址、預約方式及急診聯絡資訊。出發前先致電確認接診。";
export const blogDescription = "從倉鼠的居住環境、日常行為到夏天降溫，整理特寵照護與看診準備。找到適合你家小獸的照護文章，文章供參考，不取代獸醫師診斷。";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function directoryMetadata(title: string, description: string, path: string): Metadata {
  const fullTitle = `${title}｜${siteName}`;
  return {
    title: { absolute: fullTitle }, description,
    alternates: { canonical: path },
    openGraph: { type: 'website', locale: 'zh_TW', siteName, url: absoluteUrl(path), title: fullTitle, description },
    twitter: { card: 'summary', title: fullTitle, description },
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function latestDate(values: (string | undefined | null)[]) {
  return values
    .filter((value): value is string => Boolean(value) && !Number.isNaN(Date.parse(value!)))
    .sort((a, b) => Date.parse(b) - Date.parse(a))[0];
}
