"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="navbar fixed w-full z-50 bg-offwhite">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="logo-container flex items-center space-x-2">
            <div className="w-10 h-10 bg-mint rounded-full flex items-center justify-center text-white text-xl">
              🐹
            </div>
            <span className="logo-text">小獸所</span>
          </Link>

          {/* 標題（僅電腦版） */}
          <div className="hidden md:block text-lg font-medium text-mintdark">
            特寵醫院地圖查詢平台
          </div>

          {/* 電腦選單 */}
          <div className="desktop-menu hidden md:flex items-center space-x-4">
            <div className="dropdown relative group">
              <Link href="/blog" className="nav-item">部落格</Link>
              <div className="dropdown-menu absolute hidden group-hover:block bg-white rounded shadow-md mt-2 p-2 z-10">
                <Link href="/blog/mouse" className="dropdown-item block px-4 py-2 hover:bg-mintlight/20">鼠類飼養</Link>
                <Link href="/blog/rabbit" className="dropdown-item block px-4 py-2 hover:bg-mintlight/20">兔兔照護</Link>
                <Link href="/blog/bird" className="dropdown-item block px-4 py-2 hover:bg-mintlight/20">鳥類照顧</Link>
                <Link href="/blog/reptile" className="dropdown-item block px-4 py-2 hover:bg-mintlight/20">爬蟲相關</Link>
                <Link href="/blog/other" className="dropdown-item block px-4 py-2 hover:bg-mintlight/20">其他特寵</Link>
              </div>
            </div>
          </div>

          {/* 手機選單按鈕 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-button md:hidden"
          >
            <svg className="w-6 h-6 text-mintdark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* 手機選單 */}
      <div className={`${mobileMenuOpen ? "" : "hidden"} md:hidden bg-white border-t`}>
        <div className="container mx-auto px-4 py-4">
          <div className="mobile-dropdown-container">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full text-left py-2 flex justify-between items-center"
            >
              <span>部落格</span>
              <svg
                className={`w-4 h-4 transform transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`mobile-dropdown ${dropdownOpen ? "" : "hidden"} pl-4`}>
              {[
                { href: "/blog/mouse", label: "🐭 鼠類飼養" },
                { href: "/blog/rabbit", label: "🐰 兔兔照護" },
                { href: "/blog/bird", label: "🦜 鳥類照顧" },
                { href: "/blog/reptile", label: "🦎 爬蟲相關" },
                { href: "/blog/other", label: "🌟 其他特寵" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="block py-2 px-2 rounded-md text-darktext hover:bg-mintlight/30 active:bg-mintlight/50 transition"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}