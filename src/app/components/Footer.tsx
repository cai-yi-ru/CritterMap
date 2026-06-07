import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-sage-100 bg-background">
            <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1.3fr_1fr] lg:px-8">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 flex-col items-center justify-center rounded-xl bg-primary text-xs font-black leading-[0.95] text-primary-foreground">
                            <span>特</span>
                            <span>寵</span>
                        </div>
                        <div>
                            <div className="text-lg font-extrabold text-forest-900">小獸所</div>
                            <div className="text-xs font-medium text-stone-500">特寵醫院地圖與照護文章</div>
                        </div>
                    </div>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600">
                        我們整理全台特寵友善醫療資訊，幫助飼主更快找到可詢問的醫療資源。資料仍可能異動，出發前請以醫院公告與電話確認為準。
                    </p>
                </div>
                <div className="flex flex-col gap-3 text-sm font-semibold text-stone-600 md:items-end">
                    <Link href="/" className="hover:text-forest-900">找醫院</Link>
                    <Link href="/blog" className="hover:text-forest-900">照護文章</Link>
                    <p className="pt-2 text-xs font-medium text-stone-500">© 2026 小獸所. 版權所有.</p>
                </div>
            </div>
        </footer>
    );
}
