"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MenuIcon, XIcon } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const links = [
    { href: '/', label: '找醫院', active: pathname === '/' },
    { href: '/hospitals', label: '縣市名單', active: pathname?.startsWith('/hospitals') },
    { href: '/emergency', label: '急診聯絡', active: pathname?.startsWith('/emergency') },
    { href: '/blog', label: '照護文章', active: pathname?.startsWith('/blog') },
  ];

  return (
    <nav aria-label="主要導覽" onKeyDown={(event) => { if (event.key === 'Escape' && mobileMenuOpen) { setMobileMenuOpen(false); menuButton.current?.focus(); } }} className="fixed inset-x-0 top-0 z-50 border-b border-sage-100 bg-background">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex min-h-11 items-center gap-3">
          <div aria-hidden="true" className="flex size-9 flex-col items-center justify-center rounded-lg bg-primary text-[11px] font-bold leading-[0.95] text-primary-foreground">
            <span>特</span>
            <span>寵</span>
          </div>
          <div>
            <div className="text-base font-bold text-forest-900">小獸所</div>
            <div className="text-xs font-medium text-stone-500">特寵醫院地圖</div>
          </div>
        </Link>

        <div className="hidden h-full items-center gap-6 md:flex">
          {links.map((link) => <Link key={link.href} href={link.href}
            aria-current={pathname === link.href ? 'page' : link.active ? 'location' : undefined}
            className={`flex h-full items-center border-b-2 px-0.5 text-sm font-medium transition-colors ${link.active ? 'border-forest-800 text-forest-900' : 'border-transparent text-stone-600 hover:text-forest-900'}`}>
            {link.label}
          </Link>)}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <span className="text-xs font-medium text-clay-700">
            出發前請先致電確認
          </span>
        </div>

        <Button
          ref={menuButton}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          variant="outline"
          size="icon-lg"
          className="rounded-lg md:hidden"
          aria-label={mobileMenuOpen ? "關閉選單" : "開啟選單"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div id="mobile-navigation" className="border-t border-sage-100 bg-background px-4 py-3 md:hidden">
          <div className="mx-auto grid max-w-7xl divide-y divide-sage-100">
            {links.map((link) => <Link key={link.href} href={link.href}
              aria-current={pathname === link.href ? 'page' : link.active ? 'location' : undefined}
              className={`min-h-11 px-1 py-3 text-sm font-medium ${link.active ? 'text-forest-900' : 'text-stone-600'}`}
              onClick={() => setMobileMenuOpen(false)}>
              {link.label}
            </Link>)}
            <div className="bg-honey-100/55 px-1 py-3 text-xs font-medium leading-6 text-clay-700">
              資訊僅供參考，實際看診與門診時段請以醫院公告為準。
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
