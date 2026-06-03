import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BlogPost, BlogPostMeta } from "@/lib/blog";

export function BlogHero({ title, description }: { title: string; description: string }) {
  return (
    <header className="rounded-2xl border border-sage-100 bg-card p-6 sm:p-8">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-petal-200 bg-petal-100 px-3 py-1 text-xs font-bold text-clay-700">
        小獸照護筆記
      </div>
      <h1 className="text-balance text-3xl font-extrabold text-forest-900 sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">{description}</p>
    </header>
  );
}

export function BlogPostCard({ post }: { post: BlogPostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group overflow-hidden rounded-2xl border border-sage-100 bg-card transition hover:border-sage-300"
    >
      <div className="relative aspect-[16/9] bg-sage-50">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.coverAlt || post.title}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">✦</div>
        )}
      </div>
      <article className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-forest-900">{post.petCategory}</Badge>
          <time className="text-xs font-medium text-stone-500" dateTime={post.date}>{post.date}</time>
          <span className="text-xs font-medium text-stone-500">{post.readingTime}</span>
        </div>
        <h2 className="mt-3 text-xl font-extrabold leading-8 text-forest-900 group-hover:text-sage-600">{post.title}</h2>
        <p className="mt-2 line-clamp-3 text-sm leading-7 text-stone-600">{post.excerpt}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.topicTags.map((tag) => (
            <Badge key={tag} className="bg-honey-100 text-clay-700">
              {tag}
            </Badge>
          ))}
        </div>
      </article>
    </Link>
  );
}

export function BlogImage({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-sage-100 bg-white">
      <div className="relative aspect-[16/10] bg-sage-50">
        <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 768px) 760px, 100vw" />
      </div>
      {caption && <figcaption className="px-4 py-3 text-sm leading-6 text-stone-500">{caption}</figcaption>}
    </figure>
  );
}

export function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="my-6 border-sage-100 bg-sage-50">
      <CardHeader>
        <CardTitle className="text-base font-extrabold text-forest-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-7 text-stone-600">{children}</CardContent>
    </Card>
  );
}

export function ReminderCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Alert className="my-6 border-honey-200 bg-honey-100">
      <AlertTitle className="text-base font-extrabold text-clay-700">{title}</AlertTitle>
      <AlertDescription className="text-sm leading-7 text-clay-700">{children}</AlertDescription>
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
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
