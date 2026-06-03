import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SponsoredSlot from "../../components/SponsoredSlot";
import { BlogRenderer } from "../components";
import { getPostBySlug } from "@/lib/blog";

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
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 pb-14 pt-24 sm:px-6 lg:px-8">
        <Link href="/blog" className="inline-flex rounded-full border border-sage-100 bg-card px-4 py-2 text-sm font-bold text-forest-900">
          ← 回文章列表
        </Link>
        <article className="mt-5 rounded-2xl border border-sage-100 bg-card p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-bold text-forest-900">{post.petCategory}</span>
            <time className="text-xs font-medium text-stone-500" dateTime={post.date}>{post.date}</time>
            <span className="text-xs font-medium text-stone-500">{post.readingTime}</span>
          </div>
          <h1 className="mt-4 text-balance text-3xl font-extrabold leading-tight text-forest-900 sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-base leading-8 text-stone-600">{post.excerpt}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {post.topicTags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?topicTag=${encodeURIComponent(tag)}`}
                className="rounded-full bg-honey-100 px-3 py-1 text-xs font-bold text-clay-700"
              >
                {tag}
              </Link>
            ))}
          </div>
          <div className="mt-8 border-t border-sage-100 pt-2">
            <BlogRenderer post={post} />
          </div>
          <SponsoredSlot context="blog-article" className="mt-8" />
        </article>
      </main>
      <Footer />
    </div>
  );
}
