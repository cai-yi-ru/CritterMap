import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, CalendarDaysIcon, ClockIcon, StethoscopeIcon, TagIcon } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SponsoredSlot from "../../components/SponsoredSlot";
import { BlogRenderer } from "../components";
import { getPostBySlug, getPostModifiedDate, getPostTextStats } from "@/lib/blog";
import { absoluteUrl, siteName } from "@/lib/seo";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "文章不存在",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      url: absoluteUrl(`/blog/${post.slug}`),
      siteName,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      modifiedTime: getPostModifiedDate(post),
      images: post.coverImage
        ? [
            {
              url: absoluteUrl(post.coverImage),
              alt: post.coverAlt || post.title,
            },
          ]
        : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();
  const modifiedDate = getPostModifiedDate(post);
  const devTextStats = process.env.NODE_ENV === "development" ? getPostTextStats(post) : null;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: modifiedDate,
    image: post.coverImage ? absoluteUrl(post.coverImage) : undefined,
    inLanguage: "zh-Hant-TW",
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    author: {
      "@type": "Organization",
      name: siteName,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: absoluteUrl("/"),
    },
    about: [post.petCategory, ...post.topicTags],
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-14 pt-24 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-lg border border-sage-100 bg-card px-3 py-2 text-sm font-bold text-forest-900 transition hover:bg-sage-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ArrowLeftIcon className="size-4" aria-hidden="true" />
          回文章列表
        </Link>

        <article className="mt-5">
          <header className="overflow-hidden rounded-xl border border-sage-100 bg-card">
            {post.coverImage && (
              <div className="bg-sage-50">
                {/* Keep article covers uncropped, including portrait images. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverImage}
                  alt={post.coverAlt || post.title}
                  className="h-auto w-full"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            )}
            <div className="p-5 sm:p-8 lg:p-9">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-stone-600">
                <span className="rounded-full bg-sage-100 px-3 py-1.5 font-bold text-forest-900">{post.petCategory}</span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDaysIcon className="size-3.5" aria-hidden="true" />
                  <time dateTime={post.date}>{post.date}</time>
                </span>
                {post.updatedAt && (
                  <span className="inline-flex items-center gap-1.5">
                    更新：
                    <time dateTime={post.updatedAt}>{post.updatedAt}</time>
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <ClockIcon className="size-3.5" aria-hidden="true" />
                  {post.readingTime}
                </span>
                {devTextStats && (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-1 font-mono text-[11px] font-bold text-stone-600"
                    title={`中文 ${devTextStats.cjkCharacterCount.toLocaleString("zh-TW")} 字，英文/數字 ${devTextStats.latinWordCount.toLocaleString("zh-TW")} 詞`}
                  >
                    DEV：約 {devTextStats.wordCount.toLocaleString("zh-TW")} 字
                  </span>
                )}
              </div>
              <h1 className="mt-4 max-w-4xl text-balance text-3xl font-extrabold leading-tight text-forest-900 sm:text-4xl">
                {post.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-stone-700">{post.excerpt}</p>
            </div>
          </header>

          <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,740px)_minmax(240px,1fr)] lg:items-start">
            <div className="min-w-0 px-1 py-1 sm:px-0">
              <BlogRenderer post={post} />
              <SponsoredSlot context="blog-article" className="mt-10" />
            </div>

            <aside className="space-y-4 lg:sticky lg:top-20">
              <section className="rounded-xl border border-honey-200 bg-honey-100 p-4 text-clay-700">
                <div className="flex items-center gap-2 text-sm font-extrabold">
                  <StethoscopeIcon className="size-4" aria-hidden="true" />
                  醫療資訊提醒
                </div>
                <p className="mt-2 text-sm leading-7">
                  文章僅供飼主整理觀察線索。若症狀持續、惡化或你不確定嚴重程度，請直接聯絡特寵醫院。
                </p>
              </section>

              <section className="rounded-xl border border-sage-100 bg-card p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-forest-900">
                  <TagIcon className="size-4" aria-hidden="true" />
                  文章標籤
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.topicTags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?topicTag=${encodeURIComponent(tag)}`}
                      className="rounded-full bg-sage-100 px-3 py-1.5 text-xs font-bold text-forest-900 transition hover:bg-sage-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
