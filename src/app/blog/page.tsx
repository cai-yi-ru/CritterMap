import Link from "next/link";
import type { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BlogHero, BlogPostCard } from "./components";
import { getFilteredPosts, getPetCategories, getTopicTags } from "@/lib/blog";

type BlogPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: "照護文章",
  description: "小獸所整理的特寵照護、看診準備與醫療資訊文章。",
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const petCategory = normalizeParam(params?.petCategory);
  const topicTag = normalizeParam(params?.topicTag);
  const posts = getFilteredPosts({ petCategory, topicTag });
  const categories = getPetCategories();
  const topicTags = getTopicTags();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-14 pt-24 sm:px-6 lg:px-8">
        <BlogHero
          title="照護文章"
          description="把看診前準備、日常觀察和特寵照護觀念整理成容易保存的筆記。文章僅供參考，不取代獸醫師診斷。"
        />

        <section className="mt-5 rounded-[28px] border border-sage-100 bg-white/84 p-4 shadow-soft">
          <div className="mb-3 text-sm font-extrabold text-forest-900">依寵物分類</div>
          <div className="flex flex-wrap gap-2">
            <FilterLink href="/blog" active={!petCategory && !topicTag}>全部</FilterLink>
            {categories.map((category) => (
              <FilterLink key={category} href={`/blog?petCategory=${encodeURIComponent(category)}`} active={petCategory === category}>
                {category}
              </FilterLink>
            ))}
          </div>
          <div className="mb-3 mt-5 text-sm font-extrabold text-forest-900">依主題標籤</div>
          <div className="flex flex-wrap gap-2">
            {topicTags.map((tag) => (
              <FilterLink key={tag} href={`/blog?topicTag=${encodeURIComponent(tag)}`} active={topicTag === tag}>
                {tag}
              </FilterLink>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </section>

        {posts.length === 0 && (
          <section className="mt-6 rounded-[28px] border border-sage-100 bg-white/84 p-8 text-center shadow-soft">
            <h2 className="text-xl font-extrabold text-forest-900">目前沒有符合的文章</h2>
            <p className="mt-2 text-sm text-stone-500">可以改用其他分類或回到全部文章。</p>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

function FilterLink({ href, active, children }: { href: string; active?: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
        active ? "bg-forest-800 text-white" : "bg-sage-100 text-forest-900 hover:bg-sage-200"
      }`}
    >
      {children}
    </Link>
  );
}

function normalizeParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
