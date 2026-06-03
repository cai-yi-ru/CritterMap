import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import Analytics from './components/Analytics';

const notoSansTc = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://critter-map.vercel.app"),
  title: {
    default: "小獸所｜特寵醫院地圖查詢平台",
    template: "%s｜小獸所",
  },
  description: "查詢全台支援特殊寵物的動物醫院地圖、看診資訊與照護文章。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <head>
        <Analytics />
      </head>
      <body
        className={`${notoSansTc.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
