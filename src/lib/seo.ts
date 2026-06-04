export const siteUrl = "https://critter-map.vercel.app";
export const siteName = "小獸所";
export const defaultTitle = "小獸所｜特寵醫院地圖查詢平台";
export const defaultDescription = "查詢全台支援特殊寵物的動物醫院地圖、看診資訊與照護文章。";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

