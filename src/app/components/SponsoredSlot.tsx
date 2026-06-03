import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SponsoredSlotProps = {
  context: "home" | "blog-list" | "blog-article";
  className?: string;
};

const copyByContext: Record<SponsoredSlotProps["context"], { title: string; description: string }> = {
  home: {
    title: "給特寵飼主的贊助資訊",
    description: "這裡預留給與照護、用品或醫療準備相關的合作內容，不會插入醫院清單或影響排序。",
  },
  "blog-list": {
    title: "照護相關贊助資訊",
    description: "文章列表中的低干擾版位，適合放置清楚標示的合作內容。",
  },
  "blog-article": {
    title: "延伸閱讀或合作提醒",
    description: "文章內版位會避開急症提醒與檢查清單，避免干擾重要照護資訊。",
  },
};

export default function SponsoredSlot({ context, className }: SponsoredSlotProps) {
  const copy = copyByContext[context];

  return (
    <aside
      className={cn(
        "rounded-2xl border border-honey-200 bg-accent/45 px-4 py-3 text-sm text-accent-foreground",
        className,
      )}
      aria-label="贊助資訊版位"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="outline" className="border-honey-200 bg-white/70 text-clay-700">
              贊助資訊
            </Badge>
            <span className="font-bold text-forest-900">{copy.title}</span>
          </div>
          <p className="leading-6 text-clay-700">{copy.description}</p>
        </div>
        <span className="text-xs font-medium text-clay-700/80">預留版位</span>
      </div>
    </aside>
  );
}
