import Link from 'next/link';
import type { ReactNode } from 'react';
import { MapPinIcon, PhoneIcon, ArrowUpRightIcon } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import PetIcon from './PetIcon';
import { getHospitalReservationLabel } from '@/lib/hospitalReservation';
import { getHospitalPhoneLinks } from '@/lib/hospitalContact';
import { getActiveAnnouncements } from '@/lib/hospitalAnnouncements';
import { getDirectorySpecies, getHospitalDataDate, hospitalMapUrl, type HospitalCity } from '@/lib/hospitalDirectory';
import { absoluteUrl, serializeJsonLd } from '@/lib/seo';
import type { Hospital } from '@/types/hospital';

export type DirectoryBreadcrumb = { name: string; path: string };
export const directoryLinkClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-primary hover:bg-secondary';

export function DirectoryShell({ title, description, path, breadcrumbs, children, structuredData }: {
  title: string; description: string; path: string; breadcrumbs: DirectoryBreadcrumb[]; children: ReactNode; structuredData?: unknown;
}) {
  const data = [{
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({ '@type': 'ListItem', position: index + 1, name: crumb.name, item: absoluteUrl(crumb.path) })),
  }, ...(structuredData ? [structuredData] : [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, description, url: absoluteUrl(path), inLanguage: 'zh-Hant-TW' }])];
  return <div className="site-shell min-h-dvh">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
    <Navbar />
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 pb-12 pt-20 sm:px-6 sm:pt-24">
      <nav aria-label="麵包屑" className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => <span key={crumb.path} className="inline-flex items-center gap-2">
          {index > 0 && <span aria-hidden="true">/</span>}
          {index === breadcrumbs.length - 1 ? <span aria-current="page">{crumb.name}</span> : <Link href={crumb.path} className="inline-flex min-h-11 items-center hover:text-primary">{crumb.name}</Link>}
        </span>)}
      </nav>
      <header className="mb-6">
        <h1 className="text-2xl font-bold leading-snug text-foreground sm:text-3xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
      </header>
      {children}
    </main>
    <Footer />
  </div>;
}

function HospitalEntry({ hospital, emergency }: { hospital: Hospital; emergency: boolean }) {
  const official = hospital.website || hospital.socialMedia?.facebook || hospital.socialMedia?.instagram;
  const sourceUrl = official || hospital.google?.mapsUrl;
  const sourceDate = getHospitalDataDate([hospital]);
  const announcements = getActiveAnnouncements(hospital.announcements);
  const phones = getHospitalPhoneLinks(hospital.phone);
  const species = hospital.pets?.length ? hospital.pets : hospital.pet_category_group || [];
  return <article id={hospital.id} data-hospital-id={hospital.id} className="min-w-0 scroll-mt-24 rounded-xl border border-border bg-card p-5">
    <div className="flex flex-wrap items-start justify-between gap-2">
      <h3 className="text-lg font-semibold leading-7 text-foreground">{hospital.name}</h3>
      <span className="text-xs leading-7 text-muted-foreground">{getHospitalReservationLabel(hospital)}</span>
    </div>
    <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-muted-foreground"><MapPinIcon className="mt-1 size-4 shrink-0" aria-hidden="true" />{hospital.address}</p>
    {emergency && <div className="mt-4 rounded-lg border border-petal-200 bg-petal-100/50 p-3 text-sm leading-7 text-foreground">
      <p className="font-semibold">急診接診限制</p>
      <p>{hospital.emergencyHours || '急診時段與可接診物種尚需電話確認，請先聯絡醫院。'}</p>
    </div>}
    <dl className="mt-4 space-y-3 text-sm leading-7">
      <div><dt className="font-semibold text-foreground">{emergency ? '一般門診看診物種（急診另行確認）' : '看診物種'}</dt><dd className="text-muted-foreground">{species.length ? [...new Set(species)].join('、') : '請先致電詢問可看診的物種。'}</dd></div>
      <div><dt className="font-semibold text-foreground">一般門診時間</dt><dd className="whitespace-pre-line text-muted-foreground">{hospital.hours || '請查看院方公告或電話確認。'}</dd></div>
      {!emergency && hospital.emergencyHours && <div><dt className="font-semibold text-foreground">急診服務說明</dt><dd className="text-muted-foreground">{hospital.emergencyHours}</dd></div>}
      {hospital.specialClinic?.note && <div><dt className="font-semibold text-foreground">特寵門診安排</dt><dd className="text-muted-foreground">{hospital.specialClinic.note}</dd></div>}
    </dl>
    {announcements.length > 0 && <div className="mt-4 border-t border-border pt-3 text-sm leading-7">
      <p className="font-semibold text-clay-700">近期公告</p>
      {announcements.map((announcement) => <div key={announcement.id} className="mt-2">
        <p className="font-medium">{announcement.title}</p>
        {announcement.content && <p className="text-muted-foreground">{announcement.content}</p>}
        {announcement.sourceUrl && <a href={announcement.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">{announcement.sourceLabel || '院方公告來源'}</a>}
      </div>)}
    </div>}
    {hospital.clinicNotes && <details className="mt-4 text-sm leading-7 text-muted-foreground"><summary className="min-h-11 cursor-pointer py-2 font-medium text-foreground">查看完整就診備註</summary><p className="whitespace-pre-line">{hospital.clinicNotes}</p></details>}
    <div className="mt-5 flex flex-wrap gap-2">
      {phones.map((phone) => <a key={phone.href} href={phone.href} className={`${directoryLinkClass} border-primary bg-primary text-primary-foreground hover:bg-forest-900`}><PhoneIcon className="size-4" aria-hidden="true" />{phone.label}<span className="sr-only">，致電{hospital.name}</span></a>)}
      {sourceUrl && <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className={directoryLinkClass}>{official ? '院方網站／社群' : 'Google 商家資訊'}<ArrowUpRightIcon className="size-4" aria-hidden="true" /><span className="sr-only">：{hospital.name}</span></a>}
    </div>
    <p className="mt-3 text-xs leading-6 text-muted-foreground">{sourceDate && <>資料整理 <time dateTime={sourceDate}>{sourceDate}</time> · </>}看診物種、門診與接診狀態請以院方回覆為準。</p>
  </article>;
}

export default function HospitalDirectoryPage({ city, hospitals, relatedCities, emergency = false }: {
  city?: HospitalCity; hospitals: Hospital[]; relatedCities: HospitalCity[]; emergency?: boolean;
}) {
  const area = city?.label || '全台';
  const path = emergency ? `/emergency${city ? `/${city.slug}` : ''}` : `/hospitals/${city!.slug}`;
  const title = emergency ? `${area}特寵急診聯絡` : `${area}特寵醫院名單`;
  const description = emergency
    ? `整理${city?.name || '全台'} ${hospitals.length} 間可詢問急診的動物醫院聯絡資訊。請先告知寵物種類與目前狀況，確認有可接診的醫師、時段及預約安排，再決定前往。`
    : `整理${city!.name} ${hospitals.length} 間特寵動物醫院，按地區查看電話、地址、看診物種與預約方式。一般營業時間可能與特寵門診不同，出發前請先致電確認。`;
  const breadcrumbs = [
    { name: '首頁', path: '/' },
    { name: emergency ? '特寵急診聯絡' : '全台特寵醫院名單', path: emergency ? '/emergency' : '/hospitals' },
    ...(city ? [{ name: `${area}特寵${emergency ? '急診' : '醫院'}`, path }] : []),
  ];
  const groups = new Map<string, Hospital[]>();
  for (const hospital of hospitals) {
    const name = city ? hospital.district || city.name : hospital.city || '其他地區';
    groups.set(name, [...(groups.get(name) || []), hospital]);
  }
  const species = getDirectorySpecies(hospitals).slice(0, 6);
  const dataDate = getHospitalDataDate(hospitals);
  // Use the same district order in structured data and the visible list.
  const orderedHospitals = [...groups.values()].flat();
  const structuredData = {
    '@context': 'https://schema.org', '@type': 'CollectionPage', '@id': absoluteUrl(path),
    name: title, description, url: absoluteUrl(path), inLanguage: 'zh-Hant-TW', dateModified: dataDate,
    mainEntity: { '@type': 'ItemList', numberOfItems: hospitals.length,
      itemListElement: orderedHospitals.map((hospital, index) => ({ '@type': 'ListItem', position: index + 1, name: hospital.name, url: absoluteUrl(`${path}#${hospital.id}`) })),
    },
  };
  return <DirectoryShell title={title} description={description} path={path} breadcrumbs={breadcrumbs} structuredData={structuredData}>
    {emergency && <aside aria-label="急診聯絡提醒" className="mb-5 rounded-xl border border-petal-200 bg-petal-100/50 p-4 text-sm leading-7 text-foreground">
      <p className="font-semibold">有急診服務，不代表 24 小時都能接診每種特寵。</p>
      <p>下方會保留各院已整理的接診限制；一般門診物種不等於急診接診物種。若需立即協助，請直接致電醫院確認，不要只依營業中標示前往。</p>
    </aside>}
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <Link href={hospitalMapUrl(city?.name, emergency)} className={directoryLinkClass}><MapPinIcon className="size-4" aria-hidden="true" />在地圖查看與篩選</Link>
      {!emergency && <Link href={city?.slug === 'taipei' ? '/emergency/taipei' : '/emergency'} className={directoryLinkClass}>查看特寵急診聯絡</Link>}
      {emergency && !city && <Link href="/emergency/taipei" className={directoryLinkClass}>台北特寵急診聯絡</Link>}
      {dataDate && <p className="text-xs text-muted-foreground">資料最近整理 <time dateTime={dataDate}>{dataDate}</time></p>}
    </div>
    {!emergency && species.length > 0 && <section aria-label="已整理的看診物種" className="mb-6 flex flex-wrap gap-x-5 gap-y-2">
      {species.map(([pet, count]) => <span key={pet} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"><PetIcon pet={pet} size="sm" decorative />{pet} <span className="text-xs">{count} 間</span></span>)}
    </section>}
    {groups.size > 1 && <nav aria-label="跳至地區名單" className="mb-5 flex flex-wrap gap-2">{[...groups.keys()].map((name, index) => <a key={name} href={`#area-${index}`} className={directoryLinkClass}>{name}</a>)}</nav>}
    <div className="space-y-8">
      {[...groups].map(([name, entries], index) => <section key={name} aria-labelledby={`area-${index}`}>
        <h2 id={`area-${index}`} className="mb-3 scroll-mt-24 text-xl font-semibold text-foreground">{name}<span className="ml-2 text-sm font-normal text-muted-foreground">{entries.length} 間</span></h2>
        <div className={`grid items-start gap-4 ${entries.length > 1 ? 'md:grid-cols-2' : 'max-w-3xl'}`}>{entries.map((hospital) => <HospitalEntry key={hospital.id} hospital={hospital} emergency={emergency} />)}</div>
      </section>)}
    </div>
    <section className="mt-8 border-t border-border pt-6 text-sm leading-7">
      <h2 className="text-xl font-semibold text-foreground">{emergency ? '聯絡急診時，先確認這些資訊' : `在${area}找特寵醫院前，先確認什麼？`}</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted-foreground">
        <li>說明寵物的確切物種，確認當日是否有可看診的醫師。</li>
        <li>{emergency ? '詢問目前能否接診、最晚到院時間，以及是否需要先預約或轉介。' : '詢問特寵門診時段、預約方式與最晚掛號時間。'}</li>
        <li>告知就診原因與已有的檢查資料，依院方指示準備就診。</li>
      </ol>
      {!emergency && <p className="mt-3 text-muted-foreground">名單依目前收錄資料整理，不代表{city!.name}所有醫院；「未列入」不等於沒有看診服務。若附近找不到適合的物種，可接著查看鄰近縣市。</p>}
      {relatedCities.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{relatedCities.map((related) => <Link key={related.slug} href={`/hospitals/${related.slug}`} className={directoryLinkClass}>{related.label}特寵醫院</Link>)}</div>}
      <Link href="/hospitals" className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4">查看全台各縣市特寵醫院名單</Link>
    </section>
  </DirectoryShell>;
}
