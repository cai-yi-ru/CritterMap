import Link from 'next/link';
import { getHospitals } from '@/lib/getHospitals';
import { getCityDirectories } from '@/lib/hospitalDirectory';
import { directoryMetadata } from '@/lib/seo';
import HospitalDiscovery from '../components/HospitalDiscovery';
import { DirectoryShell, directoryLinkClass } from '../components/HospitalDirectoryPage';

export const revalidate = 300;
const title = '全台特寵醫院名單｜依縣市查電話、地址與門診';
const description = '依縣市瀏覽特寵動物醫院名單，比較看診物種、電話、地址與預約方式。尋找附近的兔子、倉鼠、鳥類或爬蟲醫院時，先確認物種，再確認當日門診安排。';
export const metadata = directoryMetadata(title, description, '/hospitals');

export default async function HospitalsPage() {
  const hospitals = await getHospitals();
  const cities = getCityDirectories(hospitals);
  return <DirectoryShell title="全台特寵醫院名單" description={description} path="/hospitals" breadcrumbs={[{ name: '首頁', path: '/' }, { name: '全台特寵醫院名單', path: '/hospitals' }]}>
    <p className="text-sm text-muted-foreground">目前整理 {cities.length} 個縣市、{hospitals.length} 間醫院。收錄數量會隨資料查核更新，不代表各地完整醫療量能。</p>
    <HospitalDiscovery hospitals={hospitals} />
    <section className="mt-8 border-t border-border pt-6 text-sm leading-7 text-muted-foreground">
      <h2 className="text-xl font-semibold text-foreground">怎麼找附近能看診的特寵醫院？</h2>
      <p className="mt-3">先選擇目前所在的縣市，再查看名單中的物種與門診安排。兔、倉鼠、天竺鼠、鳥類與爬蟲的接診範圍可能不同，請直接告知院方你的寵物種類，確認醫師與可掛號時段。</p>
      <p className="mt-3">想比較位置，可切換到醫院地圖，篩選縣市與物種後查看分布；如果當地名單較少，也可以比較鄰近縣市。</p>
      <Link href="/" className={`${directoryLinkClass} mt-4`}>開啟特寵醫院地圖</Link>
    </section>
    <section className="mt-8 border-t border-border pt-6 text-sm leading-7 text-muted-foreground">
      <h2 className="text-xl font-semibold text-foreground">醫院資料如何整理？</h2>
      <p className="mt-3">小獸所依醫院官方網站、公開社群公告與 Google 商家資訊整理名單。各院附上可查閱的來源連結與資料整理日期；日期代表最近一項資料的整理時間，不保證所有欄位或當下接診狀態已同步更新。</p>
      <p className="mt-3">名單按縣市及行政區呈現，沒有依醫療品質排名。若公開資訊與院方回覆不同，請以院方最新公告或電話回覆為準。</p>
    </section>
  </DirectoryShell>;
}
