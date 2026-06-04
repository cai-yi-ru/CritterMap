import type { Metadata } from "next";
import Script from "next/script";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import Analytics from './components/Analytics';
import { defaultDescription, defaultTitle, siteName, siteUrl } from "@/lib/seo";

const notoSansTc = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s｜小獸所",
  },
  description: defaultDescription,
  applicationName: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: siteUrl,
    siteName,
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary",
    title: defaultTitle,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="zh-Hant" className={notoSansTc.variable}>
      <head>
        <Analytics />
        {adsenseClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
