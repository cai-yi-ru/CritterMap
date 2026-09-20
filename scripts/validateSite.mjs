import assert from 'node:assert/strict';

const base = process.argv[2] || 'http://127.0.0.1:3000';
const site = 'https://crittermap.snyr.tw';
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
expect(home.includes(`property="og:url" content="${site}"`) || home.includes(`property="og:url" content="${site}/"`), 'Social URL uses the primary custom domain');
expect(!/(?:paw-map|critter-map)\.vercel\.app/.test(home), 'Home metadata does not promote a Vercel alias');
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
const firstCard = hospitalList?.[1].match(/<button\b[^>]*>([\s\S]*?)<\/button>/)?.[1];
expect(Boolean(firstCard) && firstCard.includes('mouse.webp'), 'Mouse search shows the matched species on the first hospital card');
expect(filtered.includes('更多物種') && filtered.includes('其他條件'), 'Search exposes additional species and optional conditions');
const lizard = await page(`/?pet=${encodeURIComponent('守宮（蜥蜴）')}`);
expect(lizard.includes('全台 · 守宮（蜥蜴）') && lizard.includes('lizard.webp'), 'Canonical lizard label round-trips through shared URLs and card icons');

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
expect(robots.includes(`Host: ${site}`), 'Robots host uses the primary custom domain');
expect(robots.includes(`Sitemap: ${site}/sitemap.xml`), 'Robots sitemap uses the primary custom domain');
const sitemap = await page('/sitemap.xml');
expect(sitemap.includes(`${site}/blog/hamster-summer-cooling`), 'Published articles are in sitemap');
expect(!sitemap.includes('?embed='), 'Sitemap excludes embeds');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
expect(sitemapUrls.length > 0 && sitemapUrls.every((url) => new URL(url).origin === site), 'All sitemap URLs use the primary custom domain');

const cityPaths = sitemapUrls.map((url) => new URL(url).pathname).filter((path) => /^\/hospitals\/[^/]+$/.test(path));
expect(cityPaths.includes('/hospitals/keelung') && cityPaths.includes('/hospitals/yilan') && cityPaths.includes('/hospitals/changhua'), 'Search Console city queries have sitemap destinations');
const directoryTitles = new Set();
const directoryDescriptions = new Set();
const listedHospitals = new Set();
for (const path of ['/hospitals', ...cityPaths, '/emergency', '/emergency/taipei']) {
  const html = await page(path);
  // Inspect actual server HTML, without the RSC payload or a JavaScript click.
  const visibleHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
  expect(html.includes(`rel="canonical" href="${site}${path}"`), `${path}: self canonical`);
  expect(!/name="(?:robots|googlebot)" content="[^"]*noindex/.test(html), `${path}: indexable`);
  expect(html.includes(`property="og:url" content="${site}${path}"`), `${path}: page-specific social URL`);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  expect(Boolean(title) && !directoryTitles.has(title), `${path}: unique title`);
  expect(Boolean(description) && !directoryDescriptions.has(description), `${path}: unique description`);
  directoryTitles.add(title);
  directoryDescriptions.add(description);
  expect((visibleHtml.match(/<h1\b/g) || []).length === 1, `${path}: one clear primary heading`);
  const data = schemas(html);
  expect(data.some((entry) => entry['@type'] === 'BreadcrumbList'), `${path}: breadcrumbs`);
  const list = data.find((entry) => entry['@type'] === 'CollectionPage')?.mainEntity;
  if (path !== '/hospitals') {
    const ids = [...visibleHtml.matchAll(/data-hospital-id="([^"]+)"/g)].map((match) => match[1]);
    expect(ids.length > 0 && ids.length === list?.numberOfItems, `${path}: entire hospital list is server-rendered`);
    expect(list.itemListElement.every((item, index) => item.position === index + 1 && new URL(item.url).hash === `#${ids[index]}`), `${path}: structured data matches visible order and anchors`);
    expect(visibleHtml.includes('href="tel:') && visibleHtml.includes('資料整理'), `${path}: contact details and data dates are visible`);
    const phones = [...visibleHtml.matchAll(/href="tel:([^"]+)"/g)].map((match) => match[1]);
    expect(phones.every((phone) => /^\+?\d{8,15}(;ext=\d+)?$/.test(phone)), `${path}: phone links never concatenate different lines`);
    if (path === '/hospitals/new-taipei') expect(phones.includes('0289211700') && phones.includes('0289211255'), 'Multiple hospital phone lines remain separate');
    if (path === '/hospitals/taoyuan') expect(phones.includes('033322212;ext=100'), 'Hospital phone extensions are preserved');
    if (cityPaths.includes(path)) ids.forEach((id) => listedHospitals.add(id));
  }
  expect(sitemapUrls.includes(`${site}${path}`), `${path}: present in sitemap`);
}
const hospitalCount = Number(home.match(/收錄\s*<strong[^>]*>(\d+)<\/strong>/)?.[1]);
expect(listedHospitals.size === hospitalCount && hospitalCount > 0, 'Every hospital is crawlable through a city directory');
expect(home.includes('href="/hospitals/keelung"') && home.includes('href="/emergency"'), 'Homepage has crawlable discovery links');
const cityMap = await page(`/?city=${encodeURIComponent('基隆市')}`);
expect(cityMap.includes(`rel="canonical" href="${site}/hospitals/keelung"`), 'City map consolidates to the city directory');
const emergencyMap = await page('/?city='+encodeURIComponent('台北市')+'&emergency=1');
expect(emergencyMap.includes(`rel="canonical" href="${site}/emergency/taipei"`), 'Taipei emergency map consolidates to the emergency page');
const emergencyHtml = await page('/emergency/taipei');
expect(emergencyHtml.includes('不代表 24 小時都能接診每種特寵') && emergencyHtml.includes('急診接診限制') && emergencyHtml.includes('一般門診看診物種（急診另行確認）'), 'Emergency claims keep species and hours limitations');
for (const path of ['/hospitals/unknown-city', '/hospitals/yunlin', '/emergency/unknown-city']) {
  const response = await fetch(`${base}${path}`);
  expect(response.status === 404, `${path}: unknown or empty directories do not become thin index pages`);
}
console.log(`Passed ${checks} production response checks.`);
