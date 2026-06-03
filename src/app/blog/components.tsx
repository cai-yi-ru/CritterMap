import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { BlogPost, BlogPostMeta } from "@/lib/blog";

export function BlogHero({ title, description }: { title: string; description: string }) {
  return (
    <header className="rounded-[32px] border border-sage-100 bg-white/84 p-6 shadow-soft sm:p-8">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-petal-100 px-3 py-1 text-xs font-bold text-clay-700">
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
      className="group overflow-hidden rounded-[28px] border border-sage-100 bg-white/88 shadow-soft transition hover:-translate-y-1 hover:border-sage-300"
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
          <span className="rounded-full bg-sage-100 px-2.5 py-1 text-xs font-bold text-forest-900">{post.petCategory}</span>
          <time className="text-xs font-medium text-stone-500" dateTime={post.date}>{post.date}</time>
          <span className="text-xs font-medium text-stone-500">{post.readingTime}</span>
        </div>
        <h2 className="mt-3 text-xl font-extrabold leading-8 text-forest-900 group-hover:text-sage-600">{post.title}</h2>
        <p className="mt-2 line-clamp-3 text-sm leading-7 text-stone-600">{post.excerpt}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {post.topicTags.map((tag) => (
            <span key={tag} className="rounded-full bg-honey-100 px-2.5 py-1 text-xs font-bold text-clay-700">
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}

export function BlogImage({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="my-8 overflow-hidden rounded-[28px] border border-sage-100 bg-white shadow-soft">
      <div className="relative aspect-[16/10] bg-sage-50">
        <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 768px) 760px, 100vw" />
      </div>
      {caption && <figcaption className="px-4 py-3 text-sm leading-6 text-stone-500">{caption}</figcaption>}
    </figure>
  );
}

export function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="my-6 rounded-[28px] border border-sage-100 bg-sage-50 p-5">
      <h3 className="mt-0 text-base font-extrabold text-forest-900">{title}</h3>
      <div className="mt-2 text-sm leading-7 text-stone-600">{children}</div>
    </aside>
  );
}

export function ReminderCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="my-6 rounded-[28px] border border-honey-200 bg-honey-100 p-5">
      <h3 className="mt-0 text-base font-extrabold text-clay-700">{title}</h3>
      <div className="mt-2 text-sm leading-7 text-clay-700">{children}</div>
    </aside>
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
