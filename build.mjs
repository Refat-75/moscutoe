// build.mjs  -  Google er jonno static page, sitemap.xml, robots.txt toiri kore.
// Chalao:  node build.mjs https://USERNAME.github.io/REPO-NAME
// (GitHub e upload korle .github/workflows/pages.yml eta nijei chalay)
import fs from 'fs';
import vm from 'vm';

const SITE = (process.argv[2] || process.env.SITE_URL || '').replace(/\/+$/, '');
if (!SITE) { console.log('Usage: node build.mjs https://USERNAME.github.io/REPO-NAME'); process.exit(1); }

const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync('data.js', 'utf8'), ctx);
const DB = ctx.window.MOSCUTOE_DB;
const CATS = { university: 'Varendra University', cse: 'CSE Fundamentals', programming: 'Programming', dsa: 'Data Structures & Algorithms', math: 'Mathematics & Digital Systems', advanced: 'Advanced CS' };

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const oneLine = s => s.replace(/\s+/g, ' ').trim();
const used = new Set();
function slug(q) {
  let s = q.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'answer';
  let t = s, n = 2; while (used.has(t)) t = s + '-' + n++;
  used.add(t); return t;
}
const LOGO = '<svg viewBox="0 0 120 120" width="44" height="44" aria-hidden="true"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#52d6ff"/><stop offset="1" stop-color="#9b5cff"/></linearGradient></defs><circle cx="64" cy="54" r="34" fill="none" stroke="url(#g)" stroke-width="11"/><path d="M88 80 L106 102" stroke="url(#g)" stroke-width="11" stroke-linecap="round"/><ellipse cx="40" cy="30" rx="28" ry="9" transform="rotate(-30 40 30)" fill="#6fdcff"/><ellipse cx="62" cy="56" rx="22" ry="6" transform="rotate(40 62 56)" fill="#0b2766"/><circle cx="78" cy="42" r="8" fill="#0b2766"/><circle cx="80" cy="41" r="3" fill="#fff"/></svg>';

function head(title, desc, canonical, pre, extra = '') {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="article"><meta property="og:site_name" content="MosCutoe"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${SITE}/img/og-image.jpg">
<meta name="theme-color" content="#3d6bd6"><link rel="icon" href="${pre}img/icon-192.png">
<link rel="stylesheet" href="${pre}style.css">${extra}
</head><body class="static"><div class="wrap">
<header class="sh"><a href="${pre}./">${LOGO}<span class="brand" style="font-size:26px">Mos<b>Cutoe</b></span></a></header>`;
}
const foot = '<p style="opacity:.8;font-size:14px;margin-top:30px">MosCutoe Search Project - Varendra University, Department of CSE</p></div></body></html>';
function imgs(e, pre) {
  const im = e.images || [];
  if (!im.length) return '';
  return '<div class="people">' + im.map(p => `<figure><img loading="lazy" src="${pre}${esc(p.src)}" alt="${esc(p.name)}"><figcaption>${esc(p.name)}</figcaption></figure>`).join('') + '</div>';
}

fs.mkdirSync('answer', { recursive: true });
for (const f of fs.readdirSync('answer')) fs.unlinkSync('answer/' + f);

const pages = DB.map(e => ({ e, slug: slug(e.q) }));
const urls = [`${SITE}/`, `${SITE}/answers.html`];

for (const { e, slug: s } of pages) {
  const url = `${SITE}/answer/${s}.html`; urls.push(url);
  const desc = oneLine(e.a).slice(0, 155);
  const ld = { '@context': 'https://schema.org', '@type': 'QAPage', mainEntity: { '@type': 'Question', name: e.q, answerCount: 1, acceptedAnswer: { '@type': 'Answer', text: oneLine(e.a) } } };
  const html = head(`${e.q} | MosCutoe`, desc, url, '../', `\n<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`) +
    `<article class="card glass"><h1>${esc(e.q)}</h1><p class="ans" style="white-space:pre-line;line-height:1.7;font-size:17px;margin:0">${esc(e.a)}</p>${imgs(e, '../')}</article>
<div class="tools"><a class="btn primary" href="../?q=${encodeURIComponent(e.q)}">Search this on MosCutoe</a><a class="btn" href="../answers.html">All answers</a></div>` + foot;
  fs.writeFileSync(`answer/${s}.html`, html);
}

// all answers page
let body = '<h1>All answers - MosCutoe</h1><p style="opacity:.9;line-height:1.6">MosCutoe is a search engine built by Varendra University CSE students. Here are all the questions and answers in our database. <a href="./">Open the search engine</a>.</p>';
for (const c of Object.keys(CATS)) {
  const list = pages.filter(p => p.e.cat === c); if (!list.length) continue;
  body += `<h2 class="cat">${esc(CATS[c])}</h2>`;
  for (const { e, slug: s } of list) body += `<article class="card glass"><h3 style="margin:0 0 8px;font-size:19px"><a href="answer/${s}.html">${esc(e.q)}</a></h3><p style="white-space:pre-line;line-height:1.65;margin:0">${esc(e.a)}</p>${imgs(e, '')}</article>`;
}
fs.writeFileSync('answers.html', head('All answers | MosCutoe - Varendra University CSE Search Engine', 'All questions and answers in the MosCutoe search engine: Varendra University, CSE, programming, data structures and more.', `${SITE}/answers.html`, '') + body + foot);

fs.writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

// index.html er seo block update
let idx = fs.readFileSync('index.html', 'utf8');
const site = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'MosCutoe', alternateName: 'Mosquito The', url: `${SITE}/`, description: 'A search engine built by Varendra University CSE students.', potentialAction: { '@type': 'SearchAction', target: `${SITE}/?q={search_term_string}`, 'query-input': 'required name=search_term_string' } };
const seo = `<!-- seo:start -->
<link rel="canonical" href="${SITE}/">
<meta property="og:url" content="${SITE}/">
<meta property="og:image" content="${SITE}/img/og-image.jpg">
<script type="application/ld+json">${JSON.stringify(site)}</script>
<!-- seo:end -->`;
idx = idx.replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, seo);
fs.writeFileSync('index.html', idx);
console.log(`Done: ${pages.length} answer pages, answers.html, sitemap.xml, robots.txt  (site: ${SITE})`);
