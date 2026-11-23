/* MosCutoe - app.js
   Sob kaj ekhane: login (OTP), search engine, result tabs, history, data add/edit.
   Database ache data.js e (window.MOSCUTOE_DB). */
(function () {
  'use strict';

  /* ---------- helpers ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // phone/browser storage (localStorage). Block thakle memory te kaj kore.
  const mem = {};
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return k in mem ? mem[k] : d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { mem[k] = v; } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } delete mem[k]; }
  };
  let toastTimer;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }
  const CATS = { university: 'Varendra University', cse: 'CSE Fundamentals', programming: 'Programming', dsa: 'Data Structures & Algorithms', math: 'Mathematics & Digital Systems', advanced: 'Advanced CS', local: 'Rajshahi & Varendra News', world: 'World News' };

  /* ---------- state ---------- */
  const BUILTIN = (window.MOSCUTOE_DB || []).slice();
  let ENTRIES = [], BYID = {};
  const state = { incog: false, user: null, custom: [], hist: [], q: '', results: [], view: 'home', tab: 'all', scope: '', chat: [], libCat: 'all', bm: [], sug: true };

  function refreshEntries() {
    ENTRIES = BUILTIN.concat(state.custom);
    BYID = {};
    ENTRIES.forEach(e => { BYID[e.id] = e; });
  }

  /* =====================================================
     SEARCH ENGINE
     1) query ke shobdo e bhangi (common shobdo bad)
     2) proti entry ke score dei: question e mille beshi, keywords e mille beshi, answer e mille kom
     3) sobcheye bhalo gulo ke score onujayi sajai
     ===================================================== */
  const STOP = new Set(('a an the is are was were of in at on to for and or who what which how many much there do does did can could i me my you your it its this that with by from be tell about please give show define explain meaning has have would will whom whose when where why').split(' '));

  function norm(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9ঀ-৿+#]+/g, ' ').trim(); }
  function tokens(s) {
    const seen = {}, out = [];
    norm(s).split(' ').forEach(w => {
      if (w && (w.length >= 2 || w === 'c') && !STOP.has(w) && !seen[w]) { seen[w] = 1; out.push(w); }
    });
    return out;
  }
  function idx(e) {
    if (e._i) return e;
    e._qw = tokens(e.q); e._aw = tokens(e.a); e._kw = tokens(e.alt || ''); e._qn = norm(e.q); e._i = 1;
    return e;
  }
  // duita shobdo ek-ar-kache kina (1 = same, .8 = shuru ek, .6 = ek akkhor vul)
  function lev1(a, b) {
    if (a === b) return true;
    const la = a.length, lb = b.length;
    if (Math.abs(la - lb) > 1) return false;
    let i = 0, j = 0, d = 0;
    while (i < la && j < lb) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++d > 1) return false;
      if (la > lb) i++; else if (lb > la) j++; else { i++; j++; }
    }
    if (i < la || j < lb) d++;
    return d <= 1;
  }
  function sim(w, x) {
    if (w === x) return 1;
    if (w + 's' === x || x + 's' === w || w + 'es' === x || x + 'es' === w) return 1;
    if (w.length >= 4 && x.length >= 4 && (x.startsWith(w) || w.startsWith(x))) return 0.8;
    if (w.length >= 5 && x.length >= 5 && lev1(w, x)) return 0.6;
    return 0;
  }
  function best(w, list) {
    let b = 0;
    for (let i = 0; i < list.length; i++) { const s = sim(w, list[i]); if (s > b) { b = s; if (b === 1) break; } }
    return b;
  }
  function scoreEntry(qw, qn, e) {
    idx(e);
    let score = 0, matched = 0;
    for (let i = 0; i < qw.length; i++) {
      const mq = best(qw[i], e._qw), mk = best(qw[i], e._kw), ma = best(qw[i], e._aw);
      const v = Math.max(mq * 10, mk * 12, ma * 2);
      if (v > 0) { matched++; score += v; }
    }
    if (!matched) return 0;
    let extra = 0;                                   // question er je shobdo user lekhe ni
    for (let i = 0; i < e._qw.length; i++) if (best(e._qw[i], qw) === 0) extra++;
    score -= extra * 0.8;
    if (matched === qw.length) score += 12;          // shob shobdo mille bonus
    if (qn && e._qn.indexOf(qn) !== -1) score += 25; // pura line mille bonus
    return Math.max(score, 0.5);
  }
  function search(q, scope, limit) {
    const qw = tokens(q);
    if (!qw.length) return [];
    const qn = norm(q), out = [];
    for (let i = 0; i < ENTRIES.length; i++) {
      const e = ENTRIES[i];
      if (scope === 'local' && e.cat !== 'university' && e.cat !== 'local') continue;
      if (scope === 'world' && (e.cat === 'university' || e.cat === 'local')) continue;
      const s = scoreEntry(qw, qn, e);
      if (s > 0) out.push({ e: e, s: s });
    }
    out.sort((a, b) => b.s - a.s);
    if (!out.length) return out;
    const top = out[0].s;
    return out.filter(r => r.s >= Math.max(1, top * 0.2)).slice(0, limit || 6);
  }

  /* ---------- render pieces ---------- */
  function imagesOf(e) { return (e && e.images) || []; }
  function peopleHtml(e) {
    const im = imagesOf(e);
    if (im.length < 2) return '';
    return '<div class="people">' + im.map((p, i) =>
      '<figure><img loading="lazy" src="' + esc(p.src) + '" alt="' + esc(p.name) + '" data-lb="' + esc(e.id) + '" data-i="' + i + '"><figcaption>' + esc(p.name) + '</figcaption></figure>').join('') + '</div>';
  }
  function singleHtml(e) {
    const im = imagesOf(e);
    return im.length === 1 ? '<img class="single" loading="lazy" src="' + esc(im[0].src) + '" alt="' + esc(im[0].name || e.q) + '" data-lb="' + esc(e.id) + '" data-i="0">' : '';
  }
  function cardHtml(e, isBest) {
    return '<article class="card">' + singleHtml(e) + (isBest ? '<span class="badge">Best answer</span>' : '') +
      '<h3>' + esc(e.q) + '</h3><p class="ans">' + esc(e.a) + '</p>' + peopleHtml(e) + videoHtml(e) + linkHtml(e) +
      '<div class="cardfoot"><span class="src">MosCutoe database · ' + esc(CATS[e.cat] || 'Other') + '</span>' +
      '<button class="savebtn' + (isSaved(e) ? ' on' : '') + '" data-save="' + esc(e.id) + '"><svg viewBox="0 0 24 24"><path d="M6 4h12v17l-6-4-6 4z"/></svg><span>' + (isSaved(e) ? 'Saved' : 'Save') + '</span></button>' +
      '<button class="savebtn" data-copy="' + esc(e.id) + '"><svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg><span>Copy</span></button></div></article>';
  }
  function ytId(u) { const m = /(?:youtu\.be\/|v=|embed\/)([\w-]{11})/.exec(u || ''); return m ? m[1] : ''; }
  function linkHtml(e) { return e.link ? '<a class="srclink" href="' + esc(e.link) + '" target="_blank" rel="noopener">Source: ' + esc(e.source || e.link) + ' &#8599;</a>' : ''; }
  function videoHtml(e) {
    if (!e.video) return '';
    const id = ytId(e.video);
    if (id) return '<a class="vid" href="' + esc(e.video) + '" target="_blank" rel="noopener"><img loading="lazy" src="https://img.youtube.com/vi/' + id + '/hqdefault.jpg" alt="' + esc(e.q) + '"><i></i></a>';
    return '<video class="vidfile" controls playsinline preload="metadata"' + (e.poster ? ' poster="' + esc(e.poster) + '"' : '') + ' src="' + esc(e.video) + '"></video>';
  }
  function isSaved(e) { return state.bm.indexOf(e.q) !== -1; }
  function saveBm() { store.set('mc_bm_' + state.user.uid, state.bm); }
  function toggleSave(id) {
    const e = BYID[id]; if (!e) return;
    const i = state.bm.indexOf(e.q);
    if (i >= 0) { state.bm.splice(i, 1); toast('Removed from Saved'); } else { state.bm.push(e.q); toast('Saved to Bookmarks'); }
    saveBm(); render();
  }
  function relHtml(list) {
    if (!list.length) return '';
    return '<div class="rel">Related results</div>' + list.map(e => '<a class="rel-item" href="#" data-q="' + esc(e.q) + '">' + esc(e.q) + '</a>').join('');
  }
  function randomQs(n) {
    const a = ENTRIES.slice(), out = [];
    while (a.length && out.length < n) out.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]);
    return out;
  }
  function notFoundHtml() {
    return '<div class="empty">No answer found for &ldquo;' + esc(state.q) + '&rdquo;.<small>Check the spelling or try other words. You can also teach MosCutoe this answer.</small>' +
      '<button class="btn primary" data-act="addq">Add this answer</button></div>' + relHtml(randomQs(3));
  }

  function renderAll() {
    const r = state.results;
    if (!r.length) return '<div class="panel glass"><h2>Search Results</h2>' + notFoundHtml() + '</div>';
    return '<div class="panel glass"><h2>Search Results</h2><p class="meta">' + r.length + ' result' + (r.length > 1 ? 's' : '') + ' for &ldquo;' + esc(state.q) + '&rdquo;</p>' +
      cardHtml(r[0].e, true) + relHtml(r.slice(1).map(x => x.e)) + '</div>';
  }
  function renderImages() {
    const items = [];
    state.results.forEach(r => imagesOf(r.e).forEach((p, i) => items.push({ p: p, e: r.e, i: i })));
    let body;
    if (!items.length) body = '<div class="empty">No pictures for this search.<small>Try: &ldquo;who is the founder of MosCutoe&rdquo;</small></div>';
    else body = '<div class="imggrid">' + items.map(x => '<figure><img loading="lazy" src="' + esc(x.p.src) + '" alt="' + esc(x.p.name) + '" data-lb="' + esc(x.e.id) + '" data-i="' + x.i + '"><figcaption>' + esc(x.p.name) + '<a href="#" data-q="' + esc(x.e.q) + '">' + esc(x.e.q) + '</a></figcaption></figure>').join('') + '</div>';
    return '<div class="panel glass"><h2>Images</h2>' + body + '</div>';
  }
  function renderSoon(kind) {
    return '<div class="panel glass"><h2>' + kind + '</h2><div class="empty">MosCutoe does not have any ' + kind.toLowerCase() + ' yet.<small>We are adding more soon. Try the <b>All</b> or <b>Image</b> tab.</small></div></div>';
  }
  function renderMedia(title, test) {
    const found = state.results.map(r => r.e).filter(test);
    const list = found.length ? found : ENTRIES.filter(test);
    if (!list.length) return renderSoon(title);
    return '<div class="panel glass"><h2>' + (title === 'Videos' ? 'Videos &amp; Walkthroughs' : 'Campus &amp; Technology News') + '</h2><div class="media">' +
      list.map(e => '<article class="mcard">' + videoHtml(e) + singleHtml(e) + (e.date ? '<small>' + esc(e.date) + '</small>' : '') + '<h3><a href="#" data-q="' + esc(e.q) + '">' + esc(e.q) + '</a></h3><p>' + esc(e.a.slice(0, 140)) + (e.a.length > 140 ? '...' : '') + '</p>' + linkHtml(e) + '</article>').join('') + '</div></div>';
  }
  function renderRegion() {
    const loc = state.scope === 'local';
    const list = ENTRIES.filter(e => e.news && e.region === state.scope);
    const head = loc ? ['Local Area', 'Rajshahi &amp; Varendra University'] : ['Worldwide', 'International news and technology'];
    return '<div class="panel glass"><h2>' + head[0] + ' <small class="reg">' + head[1] + '</small></h2>' +
      (list.length ? '<div class="media">' + list.map(e => '<article class="mcard">' + singleHtml(e) + (imagesOf(e).length > 1 ? '<img class="single" loading="lazy" src="' + esc(imagesOf(e)[1].src) + '" alt="' + esc(imagesOf(e)[1].name) + '" data-lb="' + esc(e.id) + '" data-i="1">' : '') +
        (e.date ? '<small>' + esc(e.date) + '</small>' : '') + '<h3><a href="#" data-q="' + esc(e.q) + '">' + esc(e.q) + '</a></h3><p>' + esc(e.a) + '</p>' + linkHtml(e) + '</article>').join('') + '</div>' : '<div class="empty">No news here yet.</div>') +
      '<p class="meta">Type something in the search box to search only ' + (loc ? 'Varendra University &amp; Rajshahi' : 'general and world') + ' answers.</p></div>';
  }
  function openRegion() { state.view = 'region'; state.q = ''; state.results = []; setMode(true); $('#tabs').hidden = true; $('#layout').hidden = false; render(); window.scrollTo(0, 0); }
  function renderLibrary() {
    const cats = ['all'].concat(Object.keys(CATS));
    const chips = '<div class="libfilter">' + cats.map(c => '<button class="chip' + (state.libCat === c ? ' on' : '') + '" data-cat="' + c + '">' + (c === 'all' ? 'All' : esc(CATS[c])) + '</button>').join('') + '</div>';
    const list = ENTRIES.filter(e => state.libCat === 'all' || e.cat === state.libCat);
    return '<div class="panel glass"><h2>Library</h2><p class="meta">' + list.length + ' answers</p>' + chips +
      list.map(e => '<button class="libitem" data-q="' + esc(e.q) + '">' + esc(e.q) + '<small>' + esc(CATS[e.cat] || '') + '</small></button>').join('') + '</div>';
  }
  function aiBotHtml(m) {
    if (m.none) return '<div class="bub bot"><p class="ans">I could not find that in my knowledge yet. Try other words, or teach me with the <b>+</b> button.</p></div>';
    const e = BYID[m.id];
    if (!e) return '';
    const rel = (m.rel || []).map(id => BYID[id]).filter(Boolean);
    return '<div class="bub bot"><h4>' + esc(e.q) + '</h4><p class="ans">' + esc(e.a) + '</p>' + singleHtml(e) + peopleHtml(e) +
      (rel.length ? '<div class="qs">' + rel.map(x => '<button data-q="' + esc(x.q) + '">' + esc(x.q) + '</button>').join('') + '</div>' : '') + '</div>';
  }
  function renderChat() {
    let msgs = '';
    if (!state.chat.length) {
      msgs = '<div class="bub bot"><h4>Hi! I am AI Mood</h4><p class="ans">Ask me about Varendra University, the CSE department, programming or data structures.</p><div class="qs">' +
        randomQs(3).map(x => '<button data-q="' + esc(x.q) + '">' + esc(x.q) + '</button>').join('') + '</div></div>';
    } else {
      msgs = state.chat.map(m => m.role === 'me' ? '<div class="bub me">' + esc(m.text) + '</div>' : aiBotHtml(m)).join('');
    }
    return '<div class="panel glass"><h2>AI Mood</h2><div class="chat">' + msgs + '</div>' +
      '<form class="chatbar" id="chatForm" autocomplete="off"><input id="chatInput" placeholder="Ask anything..." aria-label="Ask AI Mood">' +
      '<button type="button" class="plain" id="chatMic" aria-label="Voice"><svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg></button>' +
      '<button type="submit" class="iconbtn" aria-label="Send"><svg viewBox="0 0 24 24"><path d="M4 12l16-8-6 16-3-7z"/></svg></button></form></div>';
  }

  function render() {
    const c = $('#content');
    const lib = state.view === 'lib';
    $$('.tab[data-tab]').forEach(t => t.classList.toggle('on', !lib && t.dataset.tab === state.tab));
    $$('.sidebtn[data-side]').forEach(b => b.classList.toggle('on', (b.dataset.side === 'library' && lib) || (b.dataset.side === 'image' && !lib && state.tab === 'image')));
    if (state.view === 'region') c.innerHTML = renderRegion();
    else if (lib) c.innerHTML = renderLibrary();
    else if (state.tab === 'ai') { c.innerHTML = renderChat(); const ch = $('.chat', c); if (state.chat.length) ch.lastElementChild.scrollIntoView({ block: 'nearest' }); }
    else if (state.tab === 'image') c.innerHTML = renderImages();
    else if (state.tab === 'video') c.innerHTML = renderMedia('Videos', e => !!e.video);
    else if (state.tab === 'news') c.innerHTML = renderMedia('News', e => !!e.news);
    else c.innerHTML = renderAll();
  }

  function renderHome() {
    const seen = {}, tr = [];
    for (let i = state.hist.length - 1; i >= 0 && tr.length < 5; i--) { const q = state.hist[i].q; if (!seen[q]) { seen[q] = 1; tr.push(q); } }
    for (let i = 0; i < ENTRIES.length && tr.length < 5; i++) if (!seen[ENTRIES[i].q]) { seen[ENTRIES[i].q] = 1; tr.push(ENTRIES[i].q); }
    $('#trendList').innerHTML = tr.map(q => '<li data-q="' + esc(q) + '"><span>' + esc(q) + '</span><svg viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg></li>').join('');
    const news = ENTRIES.filter(e => e.news).slice(-4).reverse();
    const feed = news.length ? news : ENTRIES.slice(0, 4);
    $('#feedTitle').textContent = news.length ? 'Campus & Tech Feed' : 'Popular Answers';
    $('#feedList').innerHTML = '<div class="feed">' + feed.map(e => '<a href="#" class="fitem" data-q="' + esc(e.q) + '"><small>' + esc(e.date || CATS[e.cat] || '') + '</small><b>' + esc(e.q) + '</b><span>' + esc(e.a.slice(0, 80)) + (e.a.length > 80 ? '...' : '') + '</span></a>').join('') + '</div>';
    $('#quick').innerHTML = ENTRIES.length ? '<span>Quick Lookup:</span>' + ENTRIES.slice(0, 5).map(e => '<button type="button" data-q="' + esc(e.q) + '">' + esc((e.q.length > 30 ? e.q.slice(0, 28) + '…' : e.q)) + '</button>').join('') : '';
    $('#homegrid').hidden = !ENTRIES.length;
  }
  function setMode(results) {
    $('#homegrid').hidden = results || !ENTRIES.length; $('#quick').hidden = results;
    document.body.classList.toggle('results', results);
    $('#tabs').hidden = !results;
    $('#layout').hidden = !results;
  }

  /* ---------- running a search ---------- */
  function runSearch(q, opts) {
    opts = opts || {};
    q = (q || '').trim();
    if (!q) return;
    $('#q').value = q; syncClear(); hideSuggest();
    if (!opts.noHistory) pushHistory(q);
    state.q = q; state.view = 'results';
    if (opts.tab) state.tab = opts.tab;
    if (state.tab === 'ai' && state.view === 'results' && !opts.noChat) {
      state.results = search(q, state.scope, 6);
      state.chat.push({ role: 'me', text: q });
      state.chat.push(state.results.length ? { role: 'bot', id: state.results[0].e.id, rel: state.results.slice(1, 4).map(r => r.e.id) } : { role: 'bot', none: true });
    } else {
      state.results = search(q, state.scope, 6);
    }
    setMode(true); render(); renderHistory();
    document.title = q + ' - MosCutoe';
    try { history.replaceState(null, '', '?q=' + encodeURIComponent(q)); } catch (e) { /* ignore */ }
    window.scrollTo(0, 0);
  }
  function setTab(t) {
    state.tab = t; state.view = 'results';
    if (t === 'ai' && state.q && !state.chat.length) {
      state.chat.push({ role: 'me', text: state.q });
      state.chat.push(state.results.length ? { role: 'bot', id: state.results[0].e.id, rel: state.results.slice(1, 4).map(r => r.e.id) } : { role: 'bot', none: true });
    }
    render();
  }
  function goHome() {
    state.q = ''; state.results = []; state.view = 'home'; state.tab = 'all'; state.chat = [];
    $('#q').value = ''; syncClear(); hideSuggest(); setMode(false); renderHome();
    document.title = 'MosCutoe - Search Beyond Limits | Varendra University CSE Search Engine';
    try { history.replaceState(null, '', location.pathname); } catch (e) { /* ignore */ }
    window.scrollTo(0, 0);
  }
  function newChat() {
    state.chat = []; state.q = ''; state.results = []; state.tab = 'ai'; state.view = 'results';
    $('#q').value = ''; syncClear(); setMode(true); render();
  }

  /* ---------- history ---------- */
  function saveHist() { store.set('mc_hist_' + state.user.uid, state.hist); }
  function pushHistory(q) {
    if (state.incog) return;
    const h = state.hist;
    if (h.length && h[h.length - 1].q.toLowerCase() === q.toLowerCase()) h[h.length - 1].t = Date.now();
    else h.push({ q: q, t: Date.now() });
    while (h.length > 50) h.shift();
    saveHist();
  }
  function ago(t) {
    const s = Math.max(0, (Date.now() - t) / 1000);
    if (s < 60) return 'Just now';
    if (s < 3600) { const m = Math.floor(s / 60); return m + (m === 1 ? ' min ago' : ' mins ago'); }
    if (s < 86400) { const h = Math.floor(s / 3600); return h + (h === 1 ? ' hour ago' : ' hours ago'); }
    const d = Math.floor(s / 86400);
    return d === 1 ? 'Yesterday' : d + ' days ago';
  }
  function renderHistory() {
    const ul = $('#histList'), h = state.hist;
    if (!h.length) { ul.innerHTML = '<li class="none">No history yet</li>'; return; }
    let html = '';
    for (let i = h.length - 1; i >= 0; i--) html += '<li data-q="' + esc(h[i].q) + '" title="' + esc(h[i].q) + '"><span>' + esc(h[i].q) + '</span><time>' + ago(h[i].t) + '</time></li>';
    ul.innerHTML = html;
  }
  function undoLast() {
    if (!state.hist.length) { toast('History is already empty'); return; }
    const r = state.hist.pop();
    saveHist(); renderHistory();
    toast('Removed: ' + r.q);
  }

  /* ---------- search box, suggestions, voice ---------- */
  function syncClear() { $('#clearBtn').style.visibility = $('#q').value ? 'visible' : 'hidden'; }
  let sugItems = [], sugPos = -1;
  function hideSuggest() { $('#suggest').hidden = true; sugItems = []; sugPos = -1; }
  function showSuggest() {
    const v = $('#q').value.trim(), box = $('#suggest');
    if (!state.sug) { box.hidden = true; return; }
    let list = [], icon;
    if (v.length >= 2) {
      list = search(v, state.scope, 6).map(r => r.e.q);
      icon = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>';
    } else {
      const seen = {};
      for (let i = state.hist.length - 1; i >= 0 && list.length < 5; i--) { const q = state.hist[i].q; if (!seen[q]) { seen[q] = 1; list.push(q); } }
      icon = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
    }
    sugItems = list; sugPos = -1;
    if (!list.length) { box.hidden = true; return; }
    box.innerHTML = list.map((q, i) => '<li role="option" data-i="' + i + '">' + icon + '<span>' + esc(q) + '</span></li>').join('');
    box.hidden = false;
  }
  function moveSuggest(d) {
    if (!sugItems.length) return;
    sugPos = (sugPos + d + sugItems.length) % sugItems.length;
    $$('#suggest li').forEach((li, i) => li.classList.toggle('on', i === sugPos));
    $('#q').value = sugItems[sugPos]; syncClear();
  }

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  function startVoice(btn, onText) {
    if (!SR) { toast('Voice search works in Chrome / Edge / Safari'); return; }
    try {
      const r = new SR();
      r.lang = 'en-US'; r.interimResults = false; r.maxAlternatives = 1;
      btn.classList.add('rec');
      r.onresult = ev => { const t = ev.results[0][0].transcript; onText(t); };
      r.onerror = ev => { toast(ev.error === 'not-allowed' ? 'Please allow microphone access' : 'Could not hear you, try again'); };
      r.onend = () => btn.classList.remove('rec');
      r.start();
    } catch (e) { btn.classList.remove('rec'); toast('Voice search is not available'); }
  }

  /* ---------- lightbox ---------- */
  let lb = { list: [], i: 0 };
  function openLb(eid, i) {
    const e = BYID[eid]; if (!e) return;
    lb = { list: imagesOf(e), i: i };
    showLb(); $('#lightbox').hidden = false;
  }
  function showLb() {
    const p = lb.list[lb.i]; if (!p) return;
    $('#lbImg').src = p.src; $('#lbImg').alt = p.name || ''; $('#lbCap').textContent = p.name || '';
    const many = lb.list.length > 1;
    $('#lbPrev').hidden = !many; $('#lbNext').hidden = !many;
  }
  function stepLb(d) { lb.i = (lb.i + d + lb.list.length) % lb.list.length; showLb(); }
  function closeLb() { $('#lightbox').hidden = true; }

  /* =====================================================
     LOGIN (Email / Phone OTP)
     Static website e SMS/email pathano jay na, tai OTP ekhane screen e dekhano hoy (demo).
     Real korte hole: Otp.send() ar Otp.verify() ke Firebase Auth / Twilio er sathe bodle dao.
     ===================================================== */
  function hash(s) { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(36); }
  function parseContact(raw) {
    raw = (raw || '').trim();
    if (!raw) return null;
    if (raw.indexOf('@') !== -1) {
      const v = raw.toLowerCase();
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? { type: 'email', value: v } : null;
    }
    const d = raw.replace(/[\s\-().]/g, '');
    if (/^\+?\d{10,15}$/.test(d)) return { type: 'phone', value: d };
    return null;
  }
  function mask(c) {
    if (c.type === 'email') { const p = c.value.split('@'); return p[0].charAt(0) + '***@' + p[1]; }
    return '*******' + c.value.slice(-3);
  }
  const Otp = {
    pending: null,
    send(contact) {
      const a = new Uint32Array(1); (window.crypto || window.msCrypto).getRandomValues(a);
      const code = String(100000 + (a[0] % 900000));
      this.pending = { contact: contact, code: code, exp: Date.now() + 5 * 60 * 1000, tries: 0 };
      return { demoCode: code };
    },
    verify(input) {
      const p = this.pending;
      if (!p) return { ok: false, msg: 'Please request a new OTP' };
      if (Date.now() > p.exp) return { ok: false, msg: 'OTP expired. Please resend' };
      if (p.tries >= 5) return { ok: false, msg: 'Too many wrong tries. Please resend OTP' };
      p.tries++;
      if (input !== p.code) return { ok: false, msg: 'Wrong OTP. ' + (5 - p.tries) + ' tries left' };
      this.pending = null;
      return { ok: true };
    }
  };
  let resendTimer;
  function authStep(step) {
    $('#authChoose').hidden = step !== 'choose';
    $('#authContact').hidden = step !== 'contact';
    $('#authVerify').hidden = step !== 'verify';
  }
  function startResendCountdown() {
    const b = $('#resendBtn'); let n = 30;
    clearInterval(resendTimer); b.disabled = true; b.textContent = 'Resend OTP (' + n + 's)';
    resendTimer = setInterval(() => {
      n--;
      if (n <= 0) { clearInterval(resendTimer); b.disabled = false; b.textContent = 'Resend OTP'; }
      else b.textContent = 'Resend OTP (' + n + 's)';
    }, 1000);
  }
  function sendOtpFor(contact) {
    const r = Otp.send(contact);
    $('#sentTo').textContent = mask(contact);
    $('#demoBox').innerHTML = 'Demo mode: no SMS/email server is connected yet, so your OTP is shown here: <b>' + r.demoCode + '</b>';
    $('#otpInput').value = ''; $('#otpErr').textContent = '';
    authStep('verify'); startResendCountdown();
    setTimeout(() => $('#otpInput').focus(), 50);
  }
  let curContact = null;
  function showAuth() {
    $('#app').hidden = true; $('#auth').hidden = false;
    authStep('choose'); Otp.pending = null; curContact = null;
    $('#contactInput').value = ''; $('#contactErr').textContent = '';
  }
  function login(user) {
    store.set('mc_user', user);
    startApp(user);
  }
  function startApp(user) {
    state.user = user;
    state.hist = store.get('mc_hist_' + user.uid, []);
    state.custom = store.get('mc_custom_' + user.uid, []);
    state.bm = store.get('mc_bm_' + user.uid, []);
    refreshEntries();
    $('#auth').hidden = true; $('#app').hidden = false;
    $('#avatarText').textContent = user.type === 'guest' ? 'G' : (user.label.charAt(0) || 'U').toUpperCase();
    $('#menuWho').textContent = user.type === 'guest' ? 'You are browsing as a Guest' : 'Signed in as ' + user.label;
    $('#signoutItem').textContent = user.type === 'guest' ? 'Log in' : 'Sign out';
    goHome(); renderHistory();
    const q = new URLSearchParams(location.search).get('q');
    if (q) runSearch(q, { noHistory: false });
  }
  function signOut() {
    store.del('mc_user');
    state.user = null;
    goHome();
    showAuth();
  }

  /* ---------- menu & info dialogs ---------- */
  function toggleMenu(force) { const m = $('#menu'); m.hidden = force === undefined ? !m.hidden : !force; }
  const INFO = {
    contact: ['Contact Us', '<p>MosCutoe was built by three students of the Department of CSE, Varendra University:</p><p><b>Md Refat Hossain</b><br><b>Rijonty Moitra</b><br><b>Iemam Hossain Shaon</b></p><p>Please tell us in class if you find a wrong answer or want something added.</p>'],
    privacy: ['Privacy Setting', '<p>Your privacy matters. MosCutoe does not send your searches to any server.</p><p>Your search history and the data you add are saved only in <b>this browser on this device</b>. Use <b>Clear search history</b> in the menu to remove history, or clear your browser data to remove everything.</p><p>Login is a demo: your email or phone number is not stored anywhere except as a hidden id in this browser.</p>'],
    terms: ['Terms of Service', '<p>MosCutoe is a student project made for the Data Structure Lab (CSE 2103).</p><p>The answers come from our own small database and may be incomplete or out of date. Please check important information with official sources.</p>'],
    about: ['About MosCutoe', '<p>MosCutoe (Mosquito The) is a search engine built by Varendra University CSE students. Type a question and it finds the best answer from its own database, with pictures when available.</p><p id="aboutCount"></p>']
  };
  function openInfo(key) {
    const d = INFO[key]; if (!d) return;
    $('#infoTitle').textContent = d[0]; $('#infoBody').innerHTML = d[1];
    const c = $('#aboutCount'); if (c) c.textContent = ENTRIES.length + ' answers in the database.';
    $('#infoDlg').showModal();
  }
  function onMenu(act) {
    toggleMenu(false);
    if (act === 'library') openLibrary();
    else if (act === 'data') openDataDlg();
    else if (act === 'bookmarks') openBookmarks();
    else if (act === 'settings') openSettings();
    else if (act === 'export') exportData();
    else if (act === 'download') downloadAnswers();
    else if (act === 'history') openHistoryDlg();
    else if (act === 'incog') toggleIncog();
    else if (act === 'install') doInstall();
    else if (act === 'clear') { state.hist = []; saveHist(); renderHistory(); toast('History cleared'); }
    else if (act === 'about') openInfo('about');
    else if (act === 'signout') signOut();
  }
  function openBookmarks() {
    const list = state.bm.map(q => ENTRIES.find(e => e.q === q)).filter(Boolean);
    $('#bmList').innerHTML = list.length ? list.map(e => '<div class="bmrow"><div data-q="' + esc(e.q) + '"><b>' + esc(e.q) + '</b><p>' + esc(e.a.slice(0, 110)) + (e.a.length > 110 ? '...' : '') + '</p></div><button class="plain" data-unsave="' + esc(e.id) + '" aria-label="Remove"><svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg></button></div>').join('') : '<p class="emptyline">You have not saved anything yet. Press <b>Save</b> under any answer.</p>';
    $('#bmDlg').showModal();
  }
  function applyDark(on) { document.body.classList.toggle('dark', on); }
  function openSettings() { $('#darkSw').checked = document.body.classList.contains('dark'); $('#sugSw').checked = state.sug; $('#setDlg').showModal(); }
  let vrec = false;
  function openVoice() {
    $('#voiceTry').innerHTML = ENTRIES.slice(0, 4).map(e => '<button type="button" data-say="' + esc(e.q) + '">&ldquo;' + esc(e.q) + '&rdquo;</button>').join('');
    $('#voiceMsg').textContent = 'Tap the microphone to speak your query.';
    $('#voiceDlg').showModal();
  }
  function openLibrary() { state.view = 'lib'; setMode(true); render(); window.scrollTo(0, 0); }

  let deferredInstall = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; $('#installItem').hidden = false; });
  function doInstall() { if (!deferredInstall) return; deferredInstall.prompt(); deferredInstall = null; $('#installItem').hidden = true; }

  /* ---------- add / edit / delete data ---------- */
  let pics = [];
  function saveCustom() { store.set('mc_custom_' + state.user.uid, state.custom); refreshEntries(); }
  function resetForm() {
    $('#fId').value = ''; $('#fQ').value = ''; $('#fA').value = ''; $('#fAlt').value = ''; $('#fCat').value = 'university'; $('#fFiles').value = '';
    pics = []; renderPics();
    $('#dlgTitle').textContent = 'Add new data'; $('#saveBtn').textContent = 'Save';
  }
  function renderPics() {
    $('#picRows').innerHTML = pics.map((p, i) => '<div class="picrow"><img src="' + esc(p.src) + '" alt=""><input data-pn="' + i + '" value="' + esc(p.name) + '" placeholder="Name of this picture"><button type="button" data-prm="' + i + '">Remove</button></div>').join('');
  }
  function renderMyList() {
    $('#myList').innerHTML = state.custom.length ? state.custom.map(e => '<div class="mrow"><span title="' + esc(e.q) + '">' + esc(e.q) + '</span><button data-edit="' + esc(e.id) + '">Edit</button><button data-code="' + esc(e.id) + '">Copy code</button><button data-del="' + esc(e.id) + '">Delete</button></div>').join('') : '<div class="mrow"><span>You have not added any data yet</span></div>';
  }
  function openDataDlg(prefillQ) {
    resetForm(); if (prefillQ) $('#fQ').value = prefillQ;
    renderMyList(); $('#dataDlg').showModal();
  }
  function shrinkImage(file) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onerror = rej;
      fr.onload = () => {
        const img = new Image();
        img.onerror = rej;
        img.onload = () => {
          const max = 600, k = Math.min(1, max / Math.max(img.width, img.height));
          const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          res(c.toDataURL('image/jpeg', 0.78));
        };
        img.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }
  function slug(s) { return norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'photo'; }
  function copyCode(id) {
    const e = state.custom.find(x => x.id === id); if (!e) return;
    const o = { q: e.q, a: e.a, cat: e.cat };
    if (e.alt) o.alt = e.alt;
    if (e.images && e.images.length) o.images = e.images.map((p, i) => ({ src: 'img/' + slug(p.name || e.q) + (e.images.length > 1 ? '-' + (i + 1) : '') + '.jpg', name: p.name }));
    const txt = JSON.stringify(o, null, 1) + ',';
    const done = () => toast('Code copied. Paste it in data.js' + (o.images ? ' and put the picture files in the img folder' : ''));
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, () => window.prompt('Copy this code:', txt));
    else window.prompt('Copy this code:', txt);
  }
  function downloadAnswers() {
    const list = state.results.length ? state.results.map(r => r.e) : ENTRIES;
    const txt = 'MosCutoe - Search Beyond Limits\n' + (state.q ? 'Search: ' + state.q + '\n' : 'All answers\n') + '\n' +
      list.map((e, i) => (i + 1) + '. ' + e.q + '\n' + e.a + (e.link ? '\nSource: ' + e.link : '') + '\n').join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain' }));
    a.download = state.q ? 'moscutoe-' + norm(state.q).replace(/\s+/g, '-').slice(0, 30) + '.txt' : 'moscutoe-answers.txt';
    document.body.appendChild(a); a.click(); a.remove();
    toast('Downloaded ' + list.length + ' answers');
  }
  function openHistoryDlg() {
    const h = state.hist;
    $('#histDlgList').innerHTML = h.length ? h.slice().reverse().map(x => '<div class="bmrow"><div data-q="' + esc(x.q) + '"><b>' + esc(x.q) + '</b><p>' + ago(x.t) + '</p></div></div>').join('') : '<p class="emptyline">No search history yet.</p>';
    $('#histDlg').showModal();
  }
  function toggleIncog() {
    state.incog = !state.incog;
    document.body.classList.toggle('incog', state.incog);
    $('#incogBar').hidden = !state.incog;
    $('#incogItem').textContent = state.incog ? 'Exit Incognito tab' : 'New Incognito tab';
    toast(state.incog ? 'Incognito on: searches are not saved in history' : 'Incognito off');
  }
  function exportData() {
    const blob = new Blob([JSON.stringify(state.custom, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'moscutoe-my-data.json';
    document.body.appendChild(a); a.click(); a.remove();
    toast(state.custom.length ? 'Exported ' + state.custom.length + ' entries' : 'You have no custom data yet (empty file saved)');
  }

  /* ---------- wire up events ---------- */
  function init() {
    // login
    $('#guestBtn').onclick = () => login({ uid: 'guest', type: 'guest', label: 'Guest' });
    $('#otpBtn').onclick = () => { authStep('contact'); setTimeout(() => $('#contactInput').focus(), 50); };
    $$('[data-back]').forEach(b => b.onclick = () => { authStep(b.closest('#authVerify') ? 'contact' : 'choose'); });
    $('#authContact').addEventListener('submit', ev => {
      ev.preventDefault();
      const c = parseContact($('#contactInput').value);
      if (!c) { $('#contactErr').textContent = 'Please enter a valid email (name@gmail.com) or phone number (01XXXXXXXXX)'; return; }
      $('#contactErr').textContent = ''; curContact = c; sendOtpFor(c);
    });
    $('#authVerify').addEventListener('submit', ev => {
      ev.preventDefault();
      const r = Otp.verify($('#otpInput').value.trim());
      if (!r.ok) { $('#otpErr').textContent = r.msg; return; }
      login({ uid: 'u_' + hash(curContact.value), type: curContact.type, label: mask(curContact) });
    });
    $('#resendBtn').onclick = () => { if (curContact) { sendOtpFor(curContact); toast('A new OTP was sent'); } };
    $('#otpInput').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6); });

    // search box
    const q = $('#q');
    $('#searchForm').addEventListener('submit', e => { e.preventDefault(); runSearch(q.value); });
    q.addEventListener('input', () => { syncClear(); showSuggest(); });
    q.addEventListener('focus', showSuggest);
    q.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); if ($('#suggest').hidden) showSuggest(); moveSuggest(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); moveSuggest(-1); }
      else if (e.key === 'Escape') hideSuggest();
    });
    $('#suggest').addEventListener('mousedown', e => e.preventDefault());
    $('#suggest').addEventListener('click', e => { const li = e.target.closest('li'); if (li) runSearch(sugItems[+li.dataset.i]); });
    document.addEventListener('click', e => {
      if (!e.target.closest('.searchwrap')) hideSuggest();
      if (!e.target.closest('.topright')) toggleMenu(false);
    });
    $('#clearBtn').onclick = () => { q.value = ''; syncClear(); q.focus(); showSuggest(); };
    $('#micBtn').onclick = openVoice;
    $('#bigMic').onclick = () => { $('#voiceMsg').textContent = 'Listening...'; startVoice($('#bigMic'), t => { $('#voiceDlg').close(); runSearch(t); }); };
    $('#voiceDlg').addEventListener('click', e => { const s = e.target.closest('[data-say]'); if (s) { $('#voiceDlg').close(); runSearch(s.dataset.say); } });
    $('#voiceX').onclick = () => $('#voiceDlg').close();
    $('#bmX').onclick = () => $('#bmDlg').close();
    $('#histX').onclick = () => $('#histDlg').close();
    $('#histClearBtn').onclick = () => { state.hist = []; saveHist(); renderHistory(); renderHome(); openHistoryDlg(); toast('History cleared'); };
    $('#histDlg').addEventListener('click', e => { const a = e.target.closest('[data-q]'); if (a) { $('#histDlg').close(); runSearch(a.dataset.q); } });
    $('#incogX').onclick = toggleIncog;
    $('#setX').onclick = () => $('#setDlg').close();
    $('#savedTab').onclick = openBookmarks;
    $('#bmDlg').addEventListener('click', e => {
      const u = e.target.closest('[data-unsave]');
      if (u) { const x = BYID[u.dataset.unsave]; if (x) { state.bm = state.bm.filter(q => q !== x.q); saveBm(); openBookmarks(); render(); } return; }
      const a = e.target.closest('[data-q]'); if (a) { $('#bmDlg').close(); runSearch(a.dataset.q); }
    });
    $('#darkSw').onchange = e => { applyDark(e.target.checked); store.set('mc_dark', e.target.checked); };
    $('#sugSw').onchange = e => { state.sug = e.target.checked; store.set('mc_sug', state.sug); };
    $('#setClear').onclick = () => { state.hist = []; saveHist(); renderHistory(); renderHome(); toast('History cleared'); };
    $('#setOut').onclick = () => { $('#setDlg').close(); signOut(); };
    $('#homegrid').addEventListener('click', e => { const a = e.target.closest('[data-q]'); if (a) { e.preventDefault(); runSearch(a.dataset.q); } });
    $('#quick').addEventListener('click', e => { const a = e.target.closest('[data-q]'); if (a) runSearch(a.dataset.q); });
    applyDark(!!store.get('mc_dark', false)); state.sug = store.get('mc_sug', true) !== false;
    $('#aiBtn').onclick = () => { if (q.value.trim()) runSearch(q.value, { tab: 'ai' }); else newChat(); };
    $('#camBtn').onclick = () => toast('Image search is coming soon');
    $('#createImgChip').onclick = () => toast('Create Image is coming soon');
    $('#plusBtn').onclick = () => openDataDlg();
    $$('[data-scope]').forEach(b => b.onclick = () => {
      const s = b.dataset.scope;
      state.scope = state.scope === s ? '' : s;
      $$('[data-scope]').forEach(x => x.classList.toggle('on', x.dataset.scope === state.scope));
      toast(state.scope === 'local' ? 'Local Area: Rajshahi & Varendra University' : state.scope === 'world' ? 'Worldwide: general & international' : 'Showing all answers');
      if (state.q) runSearch(state.q, { noHistory: true, noChat: true });
      else if (state.scope) openRegion();
      else goHome();
    });
    $('#hero').onclick = goHome;
    document.addEventListener('keydown', e => {
      if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) && !$('#app').hidden) { e.preventDefault(); q.focus(); }
      if (e.key === 'Escape') { closeLb(); toggleMenu(false); }
      if (!$('#lightbox').hidden) { if (e.key === 'ArrowLeft') stepLb(-1); if (e.key === 'ArrowRight') stepLb(1); }
    });

    // tabs, sidebar, menu
    $$('.tab[data-tab]').forEach(t => t.onclick = () => setTab(t.dataset.tab));
    $('#moreTab').onclick = e => { e.stopPropagation(); toggleMenu(true); window.scrollTo(0, 0); };
    $$('.sidebtn').forEach(b => b.onclick = () => {
      const s = b.dataset.side;
      if (s === 'new') newChat();
      else if (s === 'library') openLibrary();
      else if (s === 'image') setTab('image');
      else if (s === 'more') { toggleMenu(true); window.scrollTo(0, 0); }
      else if (s === 'history') $('#hist').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    $('#menuBtn').onclick = e => { e.stopPropagation(); toggleMenu(); };
    $('#avatarBtn').onclick = e => { e.stopPropagation(); toggleMenu(); };
    $('#gridBtn').onclick = openLibrary;
    $('#menu').addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (b) onMenu(b.dataset.act); });

    // content (delegated)
    $('#content').addEventListener('click', e => {
      const sv = e.target.closest('[data-save]'); if (sv) { toggleSave(sv.dataset.save); return; }
      const cp = e.target.closest('[data-copy]');
      if (cp) { const x = BYID[cp.dataset.copy]; if (x && navigator.clipboard) navigator.clipboard.writeText(x.q + '\n' + x.a).then(() => toast('Answer copied'), () => toast('Could not copy')); return; }
      const lbImg = e.target.closest('[data-lb]');
      if (lbImg) { openLb(lbImg.dataset.lb, +lbImg.dataset.i); return; }
      const a = e.target.closest('[data-q]');
      if (a) { e.preventDefault(); runSearch(a.dataset.q); return; }
      const cat = e.target.closest('[data-cat]');
      if (cat) { state.libCat = cat.dataset.cat; render(); return; }
      if (e.target.closest('[data-act="addq"]')) { openDataDlg(state.q); return; }
      if (e.target.closest('#chatMic')) startVoice(e.target.closest('#chatMic'), t => { $('#chatInput').value = t; runSearch(t); });
    });
    $('#content').addEventListener('submit', e => {
      if (e.target.id === 'chatForm') { e.preventDefault(); const v = $('#chatInput').value; if (v.trim()) runSearch(v); }
    });
    $('#histList').addEventListener('click', e => { const li = e.target.closest('li[data-q]'); if (li) runSearch(li.dataset.q, { noHistory: false }); });
    $('#undoBtn').onclick = undoLast;

    // footer info
    $$('[data-info]').forEach(b => b.onclick = () => openInfo(b.dataset.info));
    $('#infoClose').onclick = () => $('#infoDlg').close();

    // lightbox
    $('#lbX').onclick = closeLb; $('#lbPrev').onclick = () => stepLb(-1); $('#lbNext').onclick = () => stepLb(1);
    $('#lightbox').addEventListener('click', e => { if (e.target.id === 'lightbox') closeLb(); });

    // data dialog
    $('#closeBtn').onclick = () => $('#dataDlg').close();
    $('#resetBtn').onclick = resetForm;
    $('#fFiles').addEventListener('change', async e => {
      const files = Array.prototype.slice.call(e.target.files).slice(0, 4 - pics.length);
      for (const f of files) {
        try { pics.push({ src: await shrinkImage(f), name: f.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ') }); } catch (err) { toast('Could not read ' + f.name); }
      }
      e.target.value = ''; renderPics();
    });
    $('#picRows').addEventListener('input', e => { if (e.target.dataset.pn !== undefined) pics[+e.target.dataset.pn].name = e.target.value; });
    $('#picRows').addEventListener('click', e => { if (e.target.dataset.prm !== undefined) { pics.splice(+e.target.dataset.prm, 1); renderPics(); } });
    $('#dataForm').addEventListener('submit', e => {
      e.preventDefault();
      const id = $('#fId').value, qv = $('#fQ').value.trim(), av = $('#fA').value.trim();
      if (!qv || !av) { toast('Question and answer are required'); return; }
      const dup = ENTRIES.find(x => x.id !== id && x.q.trim().toLowerCase() === qv.toLowerCase());
      if (dup) { toast('This question already exists'); return; }
      const entry = { id: id || 'c' + Date.now(), q: qv, a: av, cat: $('#fCat').value, alt: $('#fAlt').value.trim(), images: pics.filter(p => p.src).map(p => ({ src: p.src, name: p.name.trim() })), custom: true };
      const i = state.custom.findIndex(x => x.id === entry.id);
      if (i >= 0) state.custom[i] = entry; else state.custom.push(entry);
      saveCustom(); resetForm(); renderMyList(); toast(i >= 0 ? 'Data updated' : 'Data added');
      if (state.q) runSearch(state.q, { noHistory: true, noChat: true });
    });
    $('#myList').addEventListener('click', e => {
      const t = e.target;
      if (t.dataset.edit) {
        const x = state.custom.find(y => y.id === t.dataset.edit); if (!x) return;
        $('#fId').value = x.id; $('#fQ').value = x.q; $('#fA').value = x.a; $('#fAlt').value = x.alt || ''; $('#fCat').value = x.cat;
        pics = (x.images || []).map(p => ({ src: p.src, name: p.name })); renderPics();
        $('#dlgTitle').textContent = 'Edit data'; $('#saveBtn').textContent = 'Update';
        $('#dataDlg').scrollTo({ top: 0, behavior: 'smooth' });
      } else if (t.dataset.code) copyCode(t.dataset.code);
      else if (t.dataset.del) {
        if (!confirm('Delete this data?')) return;
        state.custom = state.custom.filter(y => y.id !== t.dataset.del);
        saveCustom(); renderMyList(); toast('Data deleted');
        if (state.q) runSearch(state.q, { noHistory: true, noChat: true });
      }
    });

    // boot
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => { });
    const u = store.get('mc_user', null);
    if (u && u.uid) startApp(u); else showAuth();
  }

  init();
})();
