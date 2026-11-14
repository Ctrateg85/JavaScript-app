// Köp dilli interfeýs: türkmen (esasy), rus we iňlis dilleri
//
// Programmanyň ähli tekstleri türkmen dilinde ýazylýar. Rus ýa-da iňlis dili saýlananda sahypa çykan her tekst
// (we title, placeholder, aria-label atributlary) js/i18n-dict.js sözlügi boýunça terjime edilýär:
//  * sanlar "#" bilen çalşylyp gözlenýär we terjimä yzyna goýulýar: "3-nji dereje" → açar "#-nji dereje" → "Level 3";
//  * wagt aralyklary ("2 gün 3 sag") — "⌚", duel botlarynyň atlary ("Opus 5.5") — "§" bilen çalşylýar;
//  * başdaky/soňky emoji we belgiler ("📚 ", " ▶", ":") aýrylyp hem gözlenýär;
//  * "*" bolan açarlar — şablon: "* — sapaga geç" ("*" ýerine islendik tekst, mümkin bolsa ol hem terjime edilýär);
//  * terjimede {1}, {2} ... — sanlaryň tertibi üýtgände: '# minutda # jan' → '{2} heart per {1} min'.
// Sözlükde ýok tekst (sapaklaryň soraglary, ensiklopediýanyň mazmuny) türkmen dilinde galýar.
// MutationObserver täze goşulan ähli tekstleri awtomatik terjime edýär, şonuň üçin sahypalaryň kodunda üýtgeşme gerek däl.
window.App = window.App || {};

App.i18n = (function () {
  const LANGS = { tk: 'Türkmençe', ru: 'Русский', en: 'English' };
  const COL = { ru: 0, en: 1 };
  const SKIP = 'pre, code, textarea, script, style, kbd, .ide-hl, .ide-gutter, .ide-out, .q-text, .options, .chapter-body, [data-noi18n]';
  const ATTRS = ['title', 'placeholder', 'aria-label'];
  // Wagt aralyklary (U.fmtDuration / fmtSeconds): "2 gün 3 sag", "3 sag 5 min", "7 min". Ýeke "3 gün" — adaty san.
  const DUR_RE = /\b\d+ gün \d+ sag|\b\d+ sag(?: \d+ min)?|\b\d+ min\b/g;
  const BOT_RE = /\b(?:Haiku|Sonnet|Opus|Fable) \d+(?:\.\d+)?/g;
  const NUM_RE = /\d+(?:[.,]\d+)*/g;
  const EDGE_RE = /^([^\p{L}#§⌚]*(?:#\.\s+)?)([\s\S]*?)([^\p{L}#§⌚]*)$/u;
  const UNITS = { ru: { gün: 'д', sag: 'ч', min: 'мин' }, en: { gün: 'd', sag: 'h', min: 'min' } };

  let lang = 'tk', dict = null, patterns = [];
  const cache = new Map();
  const mine = new WeakMap();   // node → biziň goýan terjimämiz (öz üýtgeşmelerimizi tanamak üçin)

  function load(l) {
    lang = LANGS[l] ? l : 'tk';
    cache.clear();
    document.documentElement.lang = lang;
    if (lang === 'tk') { dict = null; return; }
    const src = window.I18N_DICT || {}, col = COL[lang];
    dict = new Map();
    patterns = [];
    Object.keys(src).forEach(k => {
      const v = src[k][col];
      if (v === undefined) return;
      if (k.includes('*')) {
        const re = new RegExp('^' + k.split('*').map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('([\\s\\S]+?)') + '$');
        patterns.push([re, v]);
      } else dict.set(k, v);
    });
    patterns.sort((a, b) => b[0].source.length - a[0].source.length);
  }

  // Açaryň terjimesi (sanlar "#" görnüşinde) ýa-da null
  function key(k, depth = 0) {
    if (dict.has(k)) return dict.get(k);
    const m = k.match(EDGE_RE);
    if (m && m[2] && (m[1] || m[3])) {
      if (dict.has(m[2])) return m[1] + dict.get(m[2]) + m[3];
      if (dict.has(m[2] + m[3])) return m[1] + dict.get(m[2] + m[3]);   // "📌 ...alýar?" → açar "...alýar?"
      if (dict.has(m[1] + m[2])) return dict.get(m[1] + m[2]) + m[3];
    }
    if (depth > 2) return null;
    for (const [re, v] of patterns) {
      const g = k.match(re) || (m && m[2] !== k && m[2].match(re));
      if (!g) continue;
      const parts = g.slice(1).map(p => key(p, depth + 1) || p);
      let i = 0;
      const out = v.replace(/\*/g, () => parts[i++] || '');
      return g.input === k ? out : m[1] + out + m[3];
    }
    return null;
  }

  function translateDuration(d) {
    const u = UNITS[lang];
    return d.replace(/gün|sag|min/g, w => u[w]);
  }

  // Bir setiri terjime etmek. Terjime tapylmasa, asyl setir gaýtarylýar.
  function t(text) {
    if (!dict || !text || !/\p{L}/u.test(text)) return text;
    if (cache.has(text)) return cache.get(text);
    const lead = text.match(/^\s*/)[0], trail = text.match(/\s*$/)[0];
    let core = text.trim().replace(/\s+/g, ' ');
    const durs = [], bots = [], nums = [];
    core = core.replace(DUR_RE, x => { durs.push(x); return '⌚'; })
      .replace(BOT_RE, x => { bots.push(x); return '§'; })
      .replace(NUM_RE, x => { nums.push(x); return '#'; });
    const tr = key(core);
    let out = text;
    if (tr !== null) {
      // {1}, {2} ... — sanlaryň tertibi terjimede üýtgese, belgili orun; galan "#" — tertip boýunça
      let a = 0, b = 0, c = 0;
      out = lead + tr.replace(/\{(\d)\}/g, (x, n) => nums[n - 1] || '').replace(/[#§⌚]/g, ch => ch === '#' ? (nums[a++] || '') : ch === '§' ? (bots[b++] || '') : translateDuration(durs[c++] || '')) + trail;
    }
    if (cache.size > 5000) cache.clear();
    cache.set(text, out);
    return out;
  }

  function skip(el) { return !el || !!el.closest(SKIP); }

  function textNode(n) {
    if (skip(n.parentElement)) return;
    const v = n.nodeValue;
    if (mine.get(n) === v) return;
    const tr = t(v);
    if (tr !== v) { n.nodeValue = tr; mine.set(n, tr); }
  }

  function attrs(el) {
    if (skip(el)) return;
    const done = mine.get(el) || {};
    ATTRS.forEach(a => {
      const v = el.getAttribute(a);
      if (!v || done[a] === v) return;
      const tr = t(v);
      if (tr !== v) { done[a] = tr; el.setAttribute(a, tr); }
    });
    mine.set(el, done);
  }

  function apply(root) {
    if (!dict || !root) return;
    if (root.nodeType === 3) return textNode(root);
    if (root.nodeType !== 1) return;
    attrs(root);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let n;
    while ((n = w.nextNode())) n.nodeType === 3 ? textNode(n) : attrs(n);
  }

  function init(l) {
    load(l);
    if (!dict) return;
    apply(document.body);
    document.title = t(document.title);
    new MutationObserver(ms => ms.forEach(m => {
      if (m.type === 'childList') m.addedNodes.forEach(apply);
      else if (m.type === 'characterData') textNode(m.target);
      else attrs(m.target);
    })).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }

  // Dili çalyşmak: sazlama saklanýar we sahypa täzeden ýüklenýär (ähli tekstler arassa görnüşde terjime edilýär)
  function setLang(l) {
    if (!LANGS[l] || l === lang) return;
    App.store.state.settings.lang = l;
    App.store.save();
    location.reload();
  }

  // Dil saýlaýjy (sazlamalarda we ilkinji sahypada). Dilleriň atlary terjime edilmeýär.
  function picker() {
    return `<div class="seg lang-seg" data-noi18n role="group" aria-label="Dil / Язык / Language">${Object.entries(LANGS).map(([k, name]) =>
      `<button type="button" data-lang="${k}" class="${k === lang ? 'on' : ''}" aria-pressed="${k === lang}" lang="${k}">${name}</button>`).join('')}</div>`;
  }
  function bindPicker(root) {
    root.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
  }

  // Başga dilde terjime (sahypany üýtgetmezden; testler üçin)
  function tr(text, l) {
    const prev = lang;
    load(l);
    const out = t(text);
    load(prev);
    return out;
  }

  return { LANGS, init, t, tr, apply, setLang, picker, bindPicker, get lang() { return lang; } };
})();
