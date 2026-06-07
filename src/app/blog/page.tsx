import Link from "next/link";
import type { ReactNode } from "react";
import { SlidersHorizontalIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SponsoredSlot from "../components/SponsoredSlot";
import { BlogHero, BlogPostCard } from "./components";
import { getFilteredPosts, getPetCategories, getPostModifiedDate, getTopicTags } from "@/lib/blog";
import { absoluteUrl, siteName } from "@/lib/seo";

type BlogPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: "照護文章",
  description: "小獸所整理的特寵照護、看診準備與醫療資訊文章。",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/blog"),
    siteName,
    title: "照護文章｜小獸所",
    description: "小獸所整理的特寵照護、看診準備與醫療資訊文章。",
  },
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const petCategory = normalizeParam(params?.petCategory);
  const topicTag = normalizeParam(params?.topicTag);
  const posts = getFilteredPosts({ petCategory, topicTag });
  const categories = getPetCategories();
  const topicTags = getTopicTags();
  const featuredPost = posts[0];
  const remainingPosts = featuredPost ? posts.slice(1) : posts;
  const activeFilterLabel = petCategory || topicTag || "全部文章";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "小獸所照護文章",
    url: absoluteUrl("/blog"),
    inLanguage: "zh-Hant-TW",
    description: "特寵照護、看診準備與醫療資訊文章列表。",
    hasPart: posts.map((post) => ({
      "@type": "Article",
      headline: post.title,
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: post.date,
      dateModified: getPostModifiedDate(post),
      description: post.excerpt,
      about: [post.petCategory, ...post.topicTags],
    })),
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-14 pt-24 sm:px-6 lg:px-8">
        <BlogHero
          title="照護文章"
          description="把看診前準備、日常觀察和特寵照護觀念整理成容易保存的筆記。文章僅供參考，不取代獸醫師診斷。"
          postCount={posts.length}
        />

        <section className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-xl border border-sage-100 bg-card p-4 lg:sticky lg:top-20 lg:h-fit">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-extrabold text-forest-900">
                <SlidersHorizontalIcon className="size-4" aria-hidden="true" />
                文章篩選
              </div>
              <span className="text-xs font-semibold text-stone-600">{posts.length} 篇</span>
            </div>
            <div className="space-y-5">
              <FilterGroup label="依寵物分類">
                <FilterLink href="/blog" active={!petCategory && !topicTag}>全部文章</FilterLink>
                {categories.map((category) => (
                  <FilterLink key={category} href={`/blog?petCategory=${encodeURIComponent(category)}`} active={petCategory === category}>
                    {category}
                  </FilterLink>
                ))}
              </FilterGroup>
              <FilterGroup label="依主題標籤">
                {topicTags.map((tag) => (
                  <FilterLink key={tag} href={`/blog?topicTag=${encodeURIComponent(tag)}`} active={topicTag === tag}>
                    {tag}
                  </FilterLink>
                ))}
              </FilterGroup>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-col gap-2 border-b border-sage-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-base font-extrabold text-forest-900">{activeFilterLabel}</p>
                <p className="mt-1 text-sm leading-6 text-stone-600">依更新日期排序，優先顯示最近整理的照護內容。</p>
              </div>
              {(petCategory || topicTag) && (
                <Link
                  href="/blog"
                  className="inline-flex w-fit rounded-lg border border-sage-100 bg-card px-3 py-2 text-sm font-bold text-forest-900 transition hover:bg-sage-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  清除篩選
                </Link>
              )}
            </div>

            {featuredPost && (
              <section className="mt-5">
                <BlogPostCard post={featuredPost} featured />
              </section>
            )}

            <SponsoredSlot context="blog-list" className="mt-5" />

            {remainingPosts.length > 0 && (
              <section className="mt-5 grid gap-5 md:grid-cols-2">
                {remainingPosts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} />
                ))}
              </section>
            )}

            {posts.length === 0 && (
              <section className="mt-6 rounded-xl border border-sage-100 bg-card p-8 text-center">
                <h2 className="text-xl font-extrabold text-forest-900">目前沒有符合的文章</h2>
                <p className="mt-2 text-sm text-stone-600">可以改用其他分類，或回到全部文章。</p>
                <Link
                  href="/blog"
                  className="mt-4 inline-flex rounded-lg bg-forest-800 px-4 py-2 text-sm font-bold text-white transition hover:bg-forest-900"
                >
                  查看全部文章
                </Link>
              </section>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs font-bold text-stone-600">{label}</div>
      <div className="flex flex-wrap gap-2 lg:block lg:space-y-2">{children}</div>
    </div>
  );
}

function FilterLink({ href, active, children }: { href: string; active?: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-8 items-center rounded-lg border px-3 py-1.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 lg:w-full ${
        active ? "border-forest-800 bg-forest-800 text-white" : "border-sage-100 bg-sage-50 text-forest-900 hover:bg-sage-100"
      }`}
    >
      {children}
    </Link>
  );
}

function normalizeParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
