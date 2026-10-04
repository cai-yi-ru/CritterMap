import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import type { ReviewDraft, ReviewSection, ReviewSource } from './threads-review-types';

const cities: Record<string, string> = {
  taipei: '台北市', newtaipei: '新北市', taoyuan: '桃園市',
  'hsinchu-city': '新竹市', 'hsinchu-county': '新竹縣', miaoli: '苗栗縣',
  taichung: '台中市', changhua: '彰化縣', nantou: '南投縣', yunlin: '雲林縣',
  chiayi: '嘉義市', 'chiayi-county': '嘉義縣', tainan: '台南市',
  kaohsiung: '高雄市', pingtung: '屏東縣', yilan: '宜蘭縣', hualien: '花蓮縣',
  taitung: '台東縣', keelung: '基隆市', penghu: '澎湖縣', kinmen: '金門縣', lienchiang: '連江縣',
};

function links(text: string) {
  return [...text.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g)]
    .flatMap((match) => {
      try {
        const url = new URL(match[2]);
        return url.protocol === 'http:' || url.protocol === 'https:' ? [{ label: match[1], url: match[2] }] : [];
      } catch { return []; }
    });
}

function plain(text: string) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[`*]/g, '').trim();
}

function getSources(section?: ReviewSection): ReviewSource[] {
  if (!section) return [];
  const result: ReviewSource[] = [];
  for (const line of section.body.split('\n')) {
    const found = links(line);
    if (!found.length) continue;
    const cells = line.startsWith('|') ? line.split('|').slice(1, -1).map((cell) => cell.trim()) : [];
    const purpose = cells.length
      ? plain(cells.slice(1).join('；').replace(/\[[^\]]+\]\([^)]+\)/g, '').replace(/[；、]+$/, ''))
      : plain(line.replace(/^- /, ''));
    const prefix = line.match(/^(?:- )?([^\[]+)[：:]\s*\[/)?.[1];
    const hospital = cells[0] ? plain(cells[0]) : prefix?.trim() ?? found[0].label.split(/[：:]/)[0];
    for (const link of found) {
      result.push({ id: String(result.length), hospital, purpose, ...link });
    }
  }
  return result;
}

/** Read the editorial Markdown directly so the review page cannot drift from the drafts. */
export function getReviewDrafts(): ReviewDraft[] {
  const directory = path.join(process.cwd(), 'docs/social');
  return fs.readdirSync(directory).flatMap((filename) => {
    const match = filename.match(/^(\d{4}-\d{2})-(.+)-threads\.md$/);
    if (!match) return [];
    const [, month, slug] = match;
    const markdown = fs.readFileSync(path.join(directory, filename), 'utf8').replace(/\r\n/g, '\n');
    const chunks = markdown.split(/^## /m);
    const introduction = chunks.shift()!.replace(/^# .*\n/, '').trim();
    const sections: ReviewSection[] = chunks.map((chunk) => {
      const newline = chunk.indexOf('\n');
      return { title: chunk.slice(0, newline).trim(), body: chunk.slice(newline + 1).trim() };
    });
    const posts = sections.flatMap((section) => {
      if (!/^(主文|第.+(?:留言|自回))/.test(section.title)) return [];
      return [...section.body.matchAll(/```(?:text)?\n([\s\S]*?)\n```/g)]
        .map((block) => ({ title: section.title, text: block[1] }));
    });
    const sourceSection = sections.find((section) => section.title === '來源備查')
      ?? sections.find((section) => section.title === '來源與查核範圍')
      ?? sections.find((section) => section.title === '查核與選材回報');
    const review = sections.find((section) => section.title === '獨立文案查核');
    // Only the independent review section determines this badge; data validation is separate.
    const verdict = review?.body.split(/\n\n/)[0] ?? '';
    const reviewed = /通過/.test(verdict) && !/(未通過|待補核|尚未(?:完成)?(?:獨立)?(?:文案)?(?:覆核|查核))/.test(verdict);
    return [{
      id: `${month}-${slug}`, month, city: cities[slug] ?? slug, filename,
      version: createHash('sha256').update(markdown).digest('hex').slice(0, 16),
      introduction, posts, sources: getSources(sourceSection), reviewed,
      sourceHeading: sourceSection?.title ?? '來源備查', review,
      notes: sections.filter((section) => !posts.some((post) => post.title === section.title)
        && section !== review),
    }];
  }).sort((a, b) => b.month.localeCompare(a.month)
    || Object.values(cities).indexOf(a.city) - Object.values(cities).indexOf(b.city));
}
