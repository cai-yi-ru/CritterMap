import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  AlertTriangleIcon,
  ArrowUpRightIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ClockIcon,
  StethoscopeIcon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BlogPost, BlogPostMeta } from "@/lib/blog";

export function BlogHero({
  title,
  description,
  postCount,
}: {
  title: string;
  description: string;
  postCount?: number;
}) {
  return (
    <header className="overflow-hidden rounded-xl border border-sage-100 bg-card">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="p-5 sm:p-8 lg:p-9">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sage-200 bg-sage-50 px-3 py-1 text-xs font-bold text-forest-900">
            <BookOpenIcon className="size-3.5" aria-hidden="true" />
            小獸照護筆記
          </div>
          <h1 className="max-w-3xl text-balance text-3xl font-extrabold leading-tight text-forest-900 sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-700 sm:text-base">{description}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-stone-600">
            <span className="rounded-full bg-honey-100 px-3 py-1.5 text-clay-700">文章僅供照護參考</span>
            {typeof postCount === "number" && (
              <span className="rounded-full bg-sage-100 px-3 py-1.5 text-forest-900">{postCount} 篇已整理文章</span>
            )}
          </div>
        </div>
        <div className="border-t border-sage-100 bg-sage-50/70 p-5 lg:border-l lg:border-t-0 lg:p-7">
          <div className="flex h-full flex-col justify-between gap-5">
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-forest-800 text-white">
                <StethoscopeIcon className="size-5" aria-hidden="true" />
              </div>
              <p className="mt-4 text-sm font-bold leading-7 text-forest-900">看診前仍請致電醫院確認。</p>
              <p className="mt-2 text-sm leading-7 text-stone-700">
                特寵狀況變化快，文章可以協助整理線索，但不能取代獸醫師診斷。
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-sage-200 bg-card px-3 py-2 text-sm font-bold text-forest-900 transition hover:bg-sage-100 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              查詢特寵醫院
              <ArrowUpRightIcon className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export function BlogPostCard({ post, featured = false }: { post: BlogPostMeta; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex h-full overflow-hidden rounded-xl border border-sage-100 bg-card transition hover:border-sage-300 hover:bg-sage-50/35 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${
        featured ? "flex-col md:grid md:grid-cols-[minmax(260px,0.92fr)_minmax(0,1fr)]" : "flex-col"
      }`}
    >
      <div className={`relative bg-sage-50 ${featured ? "aspect-[16/10] md:aspect-auto md:min-h-[280px]" : "aspect-[16/9]"}`}>
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.coverAlt || post.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-bold text-sage-600">無封面圖片</div>
        )}
        <div className="absolute left-3 top-3 rounded-full bg-card/95 px-3 py-1 text-xs font-bold text-forest-900">
          {post.petCategory}
        </div>
      </div>
      <article className={`flex flex-1 flex-col ${featured ? "p-5 sm:p-7" : "p-5"}`}>
        {featured && <p className="mb-2 text-sm font-extrabold text-forest-900">最新整理</p>}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-stone-600">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDaysIcon className="size-3.5" aria-hidden="true" />
            <time dateTime={post.date}>{post.date}</time>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon className="size-3.5" aria-hidden="true" />
            {post.readingTime}
          </span>
        </div>
        <h2 className={`${featured ? "mt-3 text-2xl leading-9" : "mt-3 text-xl leading-8"} font-extrabold text-forest-900 group-hover:text-sage-600`}>
          {post.title}
        </h2>
        <p className={`${featured ? "mt-3 text-base leading-8" : "mt-2 line-clamp-3 text-sm leading-7"} text-stone-700`}>
          {post.excerpt}
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          {post.topicTags.map((tag) => (
            <Badge key={tag} className="bg-honey-100 text-clay-700 hover:bg-honey-100">
              {tag}
            </Badge>
          ))}
        </div>
        <span className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-extrabold text-forest-800">
          閱讀文章
          <ArrowUpRightIcon className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </span>
      </article>
    </Link>
  );
}

export function BlogImage({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="my-8 overflow-hidden rounded-xl border border-sage-100 bg-white">
      <div className="bg-sage-50">
        {/* Preserve article image proportions so portrait infographics are not cropped. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="blog-article-image h-auto w-full" loading="lazy" decoding="async" />
      </div>
      {caption && <figcaption className="border-t border-sage-100 px-4 py-3 text-sm leading-6 text-stone-600">{caption}</figcaption>}
    </figure>
  );
}

export function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="my-7 rounded-xl border-sage-100 bg-sage-50 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-extrabold text-forest-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-7 text-stone-700">{children}</CardContent>
    </Card>
  );
}

export function ReminderCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Alert
      role="note"
      className="my-7 max-w-2xl rounded-xl border-honey-200 bg-honey-100/70 px-4 py-4 text-clay-700 sm:px-5"
    >
      <AlertTriangleIcon className="mt-1 text-clay-700" aria-hidden="true" />
      <AlertTitle className="text-base font-extrabold leading-7 text-forest-900">{title}</AlertTitle>
      <AlertDescription className="prose-reminder-description mt-1 max-w-none text-[0.95rem] leading-8 text-clay-700">
        {children}
      </AlertDescription>
    </Alert>
  );
}

export function BlogRenderer({ post }: { post: BlogPost }) {
  const blocks = post.content.split(/\n{2,}/).filter(Boolean);

  return (
    <div className="prose-critter">
      {blocks.map((block, index) => renderBlock(block.trim(), index))}
    </div>
  );
}

function renderBlock(block: string, index: number) {
  const image = parseComponent(block, "BlogImage");
  if (image) {
    return <BlogImage key={index} src={image.src || ""} alt={image.alt || ""} caption={image.caption} />;
  }

  const infoCard = parseComponent(block, "InfoCard");
  if (infoCard) {
    return <InfoCard key={index} title={infoCard.title || "照護筆記"}>{infoCard.children}</InfoCard>;
  }

  const reminderCard = parseComponent(block, "ReminderCard");
  if (reminderCard) {
    return <ReminderCard key={index} title={reminderCard.title || "重要提醒"}>{reminderCard.children}</ReminderCard>;
  }

  if (block.startsWith("### ")) {
    return <h3 key={index}>{renderInline(block.slice(4))}</h3>;
  }

  if (block.startsWith("## ")) {
    return <h2 key={index}>{renderInline(block.slice(3))}</h2>;
  }

  if (block.startsWith("> ")) {
    return <blockquote key={index}>{renderInline(block.replace(/^>\s?/gm, ""))}</blockquote>;
  }

  if (/^- /m.test(block)) {
    return (
      <ul key={index}>
        {block.split(/\r?\n/).map((item) => (
          <li key={item}>{renderInline(item.replace(/^- /, ""))}</li>
        ))}
      </ul>
    );
  }

  if (/^\d+\. /m.test(block)) {
    return (
      <ol key={index}>
        {block.split(/\r?\n/).map((item) => (
          <li key={item}>{renderInline(item.replace(/^\d+\. /, ""))}</li>
        ))}
      </ol>
    );
  }

  return <p key={index}>{renderInline(block)}</p>;
}

function parseComponent(block: string, componentName: string) {
  const selfClosing = new RegExp(`^<${componentName}([\\s\\S]*?)\\/>$`).exec(block);
  const paired = new RegExp(`^<${componentName}([\\s\\S]*?)>([\\s\\S]*?)<\\/${componentName}>$`).exec(block);
  const match = selfClosing || paired;

  if (!match) return undefined;

  const attrs: Record<string, string> = {};
  const attrSource = match[1];
  const attrPattern = /([A-Za-z0-9_]+)="([^"]*)"/g;
  let attrMatch: RegExpExecArray | null;

  while ((attrMatch = attrPattern.exec(attrSource))) {
    attrs[attrMatch[1]] = attrMatch[2];
  }

  if (paired) {
    attrs.children = paired[2].trim();
  }

  return attrs;
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link;
      const isExternal = /^https?:\/\//.test(href);
      return (
        <Link
          key={`${href}-${index}`}
          href={href}
          className="font-bold text-forest-800 underline decoration-sage-300 underline-offset-4 transition hover:text-sage-700"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {label}
        </Link>
      );
    }
    return part;
  });
}
