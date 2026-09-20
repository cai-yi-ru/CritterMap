import assert from 'node:assert/strict';

const base = process.argv[2] || 'http://127.0.0.1:3000';
const site = 'https://critter-map.vercel.app';
let checks = 0;

async function page(path) {
  const response = await fetch(`${base}${path}`);
  assert.equal(response.status, 200, path);
  checks++;
  return response.text();
}
function expect(condition, message) {
  assert.ok(condition, message);
  checks++;
}
function schemas(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .flatMap((match) => JSON.parse(match[1]));
}

const home = await page('/');
expect(home.includes('138') || /收錄/.test(home), 'Home includes hospital data');
expect(home.includes('所有寵物類別'), 'Unfiltered home defaults to all pets');
expect(home.includes(`rel="canonical" href="${site}"`) || home.includes(`rel="canonical" href="${site}/"`), 'Home canonical');
expect((home.match(/<title>/g) || []).length === 1, 'One document title');
expect(!home.includes('fonts.googleapis.com'), 'No external font stylesheet');
expect(home.includes('跳到主要內容') && home.includes('id="main-content"'), 'Skip navigation target');
expect(schemas(home).some((item) => item['@graph']?.some((entry) => entry['@type'] === 'WebSite')), 'Valid home JSON-LD');

for (const query of ['embed=1', 'city=%E5%8F%B0%E5%8C%97%E5%B8%82&embed=true']) {
  const embed = await page(`/?${query}`);
  expect(/name="robots" content="noindex, follow"/.test(embed), 'Embed noindex regardless of parameter order');
  expect(/name="googlebot" content="noindex, follow"/.test(embed), 'Googlebot respects embed noindex');
}
const invalid = await page('/?pet=unknown&city=unknown');
expect(invalid.includes('所有寵物類別'), 'Invalid pet falls back to all');
const filtered = await page(`/?city=${encodeURIComponent('臺北市')}&pet=${encodeURIComponent('倉鼠')}`);
expect(filtered.includes('台北市 · 鼠'), 'Shared URL applies aliases on the server');
const hospitalList = filtered.match(/<div id="hospital-list"[^>]*>([\s\S]*?)<div id="hospital-map"/);
expect(Boolean(hospitalList) && !hospitalList[1].includes('樂蹦動物醫院'), 'Shared URL excludes other cities from the hospital list');

const listing = await page('/blog');
expect(listing.includes(`rel="canonical" href="${site}/blog"`), 'Blog canonical');
expect(listing.includes('name="twitter:title" content="特寵照護文章與看診準備｜小獸所"'), 'Blog-specific social title');

for (const slug of ['hamster-bar-biting', 'hamster-summer-cooling']) {
  const article = await page(`/blog/${slug}`);
  expect(article.includes(`rel="canonical" href="${site}/blog/${slug}"`), 'Article canonical');
  const data = schemas(article);
  expect(data.some((item) => item['@type'] === 'Article'), 'Article JSON-LD');
  expect(data.some((item) => item['@type'] === 'BreadcrumbList'), 'Breadcrumb JSON-LD');
  const anchors = [...article.matchAll(/href="#(section-\d+)"/g)].map((match) => match[1]);
  expect(anchors.length > 0 && anchors.every((id) => article.includes(`id="${id}"`)), `${slug}: every TOC anchor resolves`);
  const images = [...article.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
  expect(images.every((img) => /width="\d+"/.test(img) && /height="\d+"/.test(img)), 'Article images reserve dimensions');
  expect(!article.includes('DEV：約'), 'No development copy in production');
  expect(article.includes('繼續閱讀'), 'Crawlable related article');
}
const missing = await fetch(`${base}/blog/does-not-exist`);
expect(missing.status === 404, 'Unknown articles return HTTP 404');
const robots = await page('/robots.txt');
expect(!robots.includes('Disallow: /?embed'), 'Embed pages remain crawlable to expose noindex');
const sitemap = await page('/sitemap.xml');
expect(sitemap.includes(`${site}/blog/hamster-summer-cooling`), 'Published articles are in sitemap');
expect(!sitemap.includes('?embed='), 'Sitemap excludes embeds');
console.log(`Passed ${checks} production response checks.`);
