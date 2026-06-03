import fs from "fs";
import path from "path";

export type BlogPostMeta = {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  petCategory: string;
  topicTags: string[];
  readingTime: string;
  coverImage?: string;
  coverAlt?: string;
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

const blogDirectory = path.join(process.cwd(), "src", "content", "blog");

function parseFrontmatter(source: string): BlogPost {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    throw new Error("Blog post is missing frontmatter.");
  }

  const [, frontmatter, content] = match;
  const meta: Partial<BlogPostMeta> = {};
  const lines = frontmatter.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const keyValue = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);

    if (!keyValue) continue;

    const [, key, rawValue] = keyValue;

    if (rawValue === "") {
      const values: string[] = [];
      while (lines[index + 1]?.trim().startsWith("- ")) {
        index += 1;
        values.push(stripQuotes(lines[index].trim().slice(2)));
      }
      if (key === "topicTags") {
        meta.topicTags = values;
      }
      continue;
    }

    if (key === "topicTags") {
      meta.topicTags = rawValue
        .replace(/^\[/, "")
        .replace(/\]$/, "")
        .split(",")
        .map((value) => stripQuotes(value.trim()))
        .filter(Boolean);
      continue;
    }

    meta[key as keyof BlogPostMeta] = stripQuotes(rawValue) as never;
  }

  const requiredFields: (keyof BlogPostMeta)[] = [
    "title",
    "slug",
    "excerpt",
    "date",
    "petCategory",
    "topicTags",
    "readingTime",
  ];

  for (const field of requiredFields) {
    if (!meta[field]) {
      throw new Error(`Blog post frontmatter is missing ${field}.`);
    }
  }

  return {
    ...(meta as BlogPostMeta),
    content: content.trim(),
  };
}

function stripQuotes(value: string) {
  return value.replace(/^["']/, "").replace(/["']$/, "");
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(blogDirectory)) return [];

  return fs
    .readdirSync(blogDirectory)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const filePath = path.join(blogDirectory, fileName);
      return parseFrontmatter(fs.readFileSync(filePath, "utf8"));
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getPetCategories(posts = getAllPosts()) {
  return Array.from(new Set(posts.map((post) => post.petCategory)));
}

export function getTopicTags(posts = getAllPosts()) {
  return Array.from(new Set(posts.flatMap((post) => post.topicTags)));
}

export function getFilteredPosts({
  petCategory,
  topicTag,
}: {
  petCategory?: string;
  topicTag?: string;
}) {
  return getAllPosts().filter((post) => {
    const matchesCategory = !petCategory || post.petCategory === petCategory;
    const matchesTopic = !topicTag || post.topicTags.includes(topicTag);
    return matchesCategory && matchesTopic;
  });
}
