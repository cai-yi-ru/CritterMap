import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangleIcon, CheckCircle2Icon, ClockIcon, PhoneCallIcon, ShieldCheckIcon } from "lucide-react";

const noticeItems = [
  {
    title: "營業與門診可能異動",
    description: "實際看診、休診、指定醫師與收費標準，請以醫院公告或電話回覆為準。",
    icon: ClockIcon,
  },
  {
    title: "出發前請先致電",
    description: "特寵門診常見預約制或限定時段，先確認可減少撲空與延誤。",
    icon: PhoneCallIcon,
  },
  {
    title: "篩選結果僅供參考",
    description: "平台整理的服務與寵物分類，不代表該院完整醫療能力或即時收案狀態。",
    icon: CheckCircle2Icon,
  },
];

export default function DisclaimerSection() {
  return (
    <section className="mt-10 border-t border-sage-100 bg-sage-50/70 py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-sage-100 bg-card">
          <div className="grid lg:grid-cols-[minmax(320px,0.95fr)_1.25fr]">
            <Alert className="rounded-none border-0 border-b border-sage-100 bg-transparent p-5 sm:p-6 lg:border-b-0 lg:border-r">
              <AlertTriangleIcon className="mt-1 text-clay-700" />
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <AlertTitle className="text-lg font-extrabold text-forest-900">免責注意事項</AlertTitle>
                  <Badge className="bg-honey-100 text-clay-700">出發前確認</Badge>
                </div>
                <AlertDescription className="max-w-[58ch] text-sm leading-7 text-stone-700">
                  小獸所提供整理後的查詢資訊，不取代獸醫師診斷，也不代表推薦特定醫院。若寵物有急症，請立即聯繫最近的動物醫院或 24 小時急診醫院。
                </AlertDescription>
              </div>
            </Alert>

            <div className="grid divide-y divide-sage-100 md:grid-cols-3 md:divide-x md:divide-y-0">
              {noticeItems.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.title} className="flex gap-3 p-5 sm:p-6 md:flex-col">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sage-100 text-forest-800">
                      <Icon />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold leading-6 text-forest-900">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-stone-600">{item.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t border-sage-100 bg-honey-100/45 px-5 py-3 text-sm leading-6 text-clay-700 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span className="inline-flex items-center gap-2 font-bold text-forest-900">
              <ShieldCheckIcon className="shrink-0" />
              資料會持續整理，但醫院現場狀況可能即時變動。
            </span>
            <span className="text-stone-700">看診前請以電話、官方公告或院方回覆為準。</span>
          </div>
        </div>
      </div>
    </section>
  );
}
