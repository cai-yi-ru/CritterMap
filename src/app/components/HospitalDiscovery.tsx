import Link from 'next/link';
import { getCityDirectories } from '@/lib/hospitalDirectory';
import type { Hospital } from '@/types/hospital';

export default function HospitalDiscovery({ hospitals }: { hospitals: Hospital[] }) {
  const cities = getCityDirectories(hospitals);
  return (
    <section aria-labelledby="city-directory-title" className="mt-8 border-t border-border pt-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="city-directory-title" className="text-xl font-semibold text-foreground">依縣市找特寵醫院</h2>
        <Link href="/hospitals" className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline underline-offset-4">瀏覽全台醫院名單</Link>
      </div>
      <p className="mt-1 text-sm leading-7 text-muted-foreground">各地名單整理醫院電話、地址、看診物種與預約方式，方便比較附近的特寵動物醫院。</p>
      <div className="mt-4 grid grid-cols-2 gap-x-5 sm:grid-cols-3 lg:grid-cols-6">
        {cities.map((city) => <Link key={city.slug} prefetch={false} href={`/hospitals/${city.slug}`} className="flex min-h-11 items-center justify-between gap-2 border-b border-border py-2 text-sm hover:text-primary">
          <span>{city.label}特寵醫院</span><span className="shrink-0 text-xs tabular-nums text-muted-foreground">{city.hospitals.length} 間</span>
        </Link>)}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
        <Link href="/emergency" className="inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4">特寵急診聯絡與接診確認</Link>
        <Link href="/emergency/taipei" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">台北特寵急診聯絡</Link>
      </div>
    </section>
  );
}
