"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MenuIcon, XIcon } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isBlog = pathname?.startsWith("/blog");

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-sage-100 bg-background">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="回到小獸所首頁">
          <div className="flex size-9 flex-col items-center justify-center rounded-lg bg-primary text-[11px] font-bold leading-[0.95] text-primary-foreground">
            <span>特</span>
            <span>寵</span>
          </div>
          <div>
            <div className="text-base font-bold text-forest-900">小獸所</div>
            <div className="text-xs font-medium text-stone-500">特寵醫院地圖</div>
          </div>
        </Link>

        <div className="hidden h-full items-center gap-6 md:flex">
          <Link
            href="/"
            aria-current={!isBlog ? "page" : undefined}
            className={`flex h-full items-center border-b-2 px-0.5 text-sm font-medium transition-colors ${
              isBlog
                ? "border-transparent text-stone-600 hover:text-forest-900"
                : "border-forest-800 text-forest-900"
            }`}
          >
            找醫院
          </Link>
          <Link
            href="/blog"
            aria-current={isBlog ? "page" : undefined}
            className={`flex h-full items-center border-b-2 px-0.5 text-sm font-medium transition-colors ${
              isBlog
                ? "border-forest-800 text-forest-900"
                : "border-transparent text-stone-600 hover:text-forest-900"
            }`}
          >
            照護文章
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <span className="text-xs font-medium text-clay-700">
            出發前請先致電確認
          </span>
        </div>

        <Button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          variant="outline"
          size="icon-lg"
          className="rounded-lg md:hidden"
          aria-label={mobileMenuOpen ? "關閉選單" : "開啟選單"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-sage-100 bg-background px-4 py-3 md:hidden">
          <div className="mx-auto grid max-w-7xl divide-y divide-sage-100">
            <Link
              href="/"
              aria-current={!isBlog ? "page" : undefined}
              className={`px-1 py-3 text-sm font-medium ${
                isBlog ? "text-stone-600" : "text-forest-900"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              找醫院
            </Link>
            <Link
              href="/blog"
              aria-current={isBlog ? "page" : undefined}
              className={`px-1 py-3 text-sm font-medium ${
                isBlog ? "text-forest-900" : "text-stone-600"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              照護文章
            </Link>
            <div className="bg-honey-100/55 px-1 py-3 text-xs font-medium leading-6 text-clay-700">
              資訊僅供參考，實際看診與門診時段請以醫院公告為準。
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
