"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isBlog = pathname?.startsWith("/blog");

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-sage-100 bg-linen-50/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="回到小獸所首頁">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-800 text-lg text-white shadow-soft transition group-hover:-rotate-3">
            小
          </div>
          <div>
            <div className="text-lg font-extrabold text-forest-900">小獸所</div>
            <div className="text-xs font-medium text-stone-500">特寵醫院地圖</div>
          </div>
        </Link>

        <div className="hidden items-center gap-2 rounded-full border border-sage-100 bg-white/76 p-1 md:flex">
          <Link
            href="/"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isBlog
                ? "text-stone-600 hover:bg-sage-100 hover:text-forest-900"
                : "bg-sage-100 text-forest-900"
            }`}
          >
            找醫院
          </Link>
          <Link
            href="/blog"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isBlog
                ? "bg-petal-100 text-forest-900"
                : "text-stone-600 hover:bg-petal-100 hover:text-forest-900"
            }`}
          >
            照護文章
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <span className="rounded-full bg-honey-100 px-3 py-1.5 text-xs font-semibold text-clay-700">
            出發前請先致電確認
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-sage-100 bg-white text-forest-900 shadow-soft md:hidden"
          aria-label="開啟選單"
          aria-expanded={mobileMenuOpen}
        >
          <span className="sr-only">選單</span>
          <span className="flex flex-col gap-1.5">
            <span className={`h-0.5 w-5 rounded-full bg-current transition ${mobileMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 rounded-full bg-current transition ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-5 rounded-full bg-current transition ${mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-sage-100 bg-linen-50 px-4 py-4 md:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            <Link
              href="/"
              className={`rounded-2xl px-4 py-3 text-sm font-semibold shadow-soft ${
                isBlog ? "bg-white text-forest-900" : "bg-sage-100 text-forest-900"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              找醫院
            </Link>
            <Link
              href="/blog"
              className={`rounded-2xl px-4 py-3 text-sm font-semibold shadow-soft ${
                isBlog ? "bg-petal-100 text-forest-900" : "bg-white text-forest-900"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              照護文章
            </Link>
            <div className="rounded-2xl bg-honey-100 px-4 py-3 text-xs font-semibold leading-6 text-clay-700">
              資訊僅供參考，實際看診與門診時段請以醫院公告為準。
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
