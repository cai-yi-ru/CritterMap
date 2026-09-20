import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRightIcon, CalendarDaysIcon, ClockIcon, StethoscopeIcon, TagIcon } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SponsoredSlot from "../../components/SponsoredSlot";
import { BlogImage, BlogRenderer } from "../components";
import { getAllPosts, getPostBySlug, getPostHeadings, getPostModifiedDate } from "@/lib/blog";
import { absoluteUrl, serializeJsonLd, siteName } from "@/lib/seo";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

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
    twitter: {
      card: post.coverImage ? 'summary_large_image' as const : 'summary' as const,
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [{ url: absoluteUrl(post.coverImage), alt: post.coverAlt || post.title }] : undefined,
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      url: absoluteUrl(`/blog/${post.slug}`),
      siteName,
      locale: 'zh_TW',
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
  const headings = getPostHeadings(post);
  const relatedPosts = getAllPosts().filter((item) => item.slug !== post.slug && item.petCategory === post.petCategory).slice(0, 2);
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
      url: absoluteUrl('/'),
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
        dangerouslySetInnerHTML={{ __html: serializeJsonLd([
          structuredData,
          { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
            { '@type': 'ListItem', position: 1, name: '小獸所', item: absoluteUrl('/') },
            { '@type': 'ListItem', position: 2, name: '照護文章', item: absoluteUrl('/blog') },
            { '@type': 'ListItem', position: 3, name: post.title, item: absoluteUrl(`/blog/${post.slug}`) },
          ] },
        ]) }}
      />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 pb-14 pt-24 sm:px-6 lg:px-8">
        <nav aria-label="麵包屑" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="inline-flex min-h-11 items-center hover:text-primary">小獸所</Link>
          <ChevronRightIcon className="size-3.5" aria-hidden="true" />
          <Link href="/blog" className="inline-flex min-h-11 items-center hover:text-primary">照護文章</Link>
          <ChevronRightIcon className="size-3.5" aria-hidden="true" />
          <span aria-current="page" className="text-foreground">{post.title}</span>
        </nav>

        <article className="mt-5">
          <header className="overflow-hidden rounded-xl border border-sage-100 bg-card">
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
                <span>小獸所整理</span>
              </div>
              <h1 className="mt-4 max-w-4xl text-balance text-3xl font-extrabold leading-tight text-forest-900 sm:text-4xl">
                {post.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-stone-700">{post.excerpt}</p>
            </div>
          </header>

          <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,740px)_minmax(240px,1fr)] lg:items-start">
            {headings.length > 0 && <details className="rounded-xl border border-border bg-card p-4 lg:hidden">
              <summary className="cursor-pointer py-2 text-sm font-semibold">這篇文章會談到</summary>
              <nav aria-label="文章目錄" className="mt-3 grid gap-1">{headings.map((heading) => <a key={heading.id} href={`#${heading.id}`} className="py-2 text-sm leading-6 text-muted-foreground hover:text-primary">{heading.title}</a>)}</nav>
            </details>}
            <div className="min-w-0 px-1 py-1 sm:px-0">
              {post.coverImage && !post.content.includes(`src="${post.coverImage}"`) && <BlogImage src={post.coverImage} alt={post.coverAlt || post.title} priority />}
              <BlogRenderer post={post} />
              {relatedPosts.length > 0 && <nav aria-label="延伸閱讀" className="mt-10 border-t border-border pt-6">
                <h2 className="text-lg font-semibold text-foreground">繼續閱讀</h2>
                {relatedPosts.map((related) => <Link key={related.slug} href={`/blog/${related.slug}`} className="mt-3 flex items-center justify-between gap-3 py-3 text-base font-medium leading-7 text-primary hover:underline">{related.title}<ChevronRightIcon className="size-5 shrink-0" aria-hidden="true" /></Link>)}
              </nav>}
              <SponsoredSlot context="blog-article" className="mt-10" />
            </div>

            <aside className="space-y-4 lg:sticky lg:top-20">
              {headings.length > 0 && <nav aria-label="文章目錄" className="hidden border-b border-border pb-5 lg:block">
                <h2 className="mb-3 text-sm font-semibold text-foreground">這篇文章會談到</h2>
                {headings.map((heading) => <a key={heading.id} href={`#${heading.id}`} className="block py-2 text-sm leading-6 text-muted-foreground hover:text-primary">{heading.title}</a>)}
              </nav>}
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
                      className="inline-flex min-h-11 items-center rounded-lg bg-sage-100 px-3 py-2 text-sm font-medium text-forest-900 transition hover:bg-sage-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
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
