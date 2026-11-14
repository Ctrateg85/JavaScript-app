// Kod redaktory: VS Code görnüşli JavaScript redaktory
//
//  * Faýllar (Explorer), goýmalar (tabs), setir belgileri, sintaksis reňkleri, ýaýlaryň jübüt reňkleri.
//  * Awtomatik içeri süýşürmek, ýaýlary we dyrnaklary awtomatik ýapmak, Tab / Shift+Tab, Ctrl+/ — teswir.
//  * ▶ Işlet (Ctrl+Enter ýa-da F5): kod aýratyn Web Worker-de işleýär, console.log netijesi aşaky panelde görünýär.
//    Çäksiz sikl bolsa programma 5 sekuntdan soň togtadylýar.
//  * Faýllar ulanyjynyň ýagdaýynda (localStorage) awtomatik saklanýar.
window.App = window.App || {};
App.views = App.views || {};

(function () {
  const CONTROL = new Set(['if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'return',
    'try', 'catch', 'finally', 'throw', 'await', 'yield', 'import', 'export', 'from', 'as']);
  const KEYWORDS = new Set(['const', 'let', 'var', 'function', 'class', 'extends', 'super', 'this', 'new', 'delete', 'in', 'of',
    'typeof', 'instanceof', 'void', 'async', 'static', 'get', 'set', 'null', 'undefined', 'true', 'false', 'debugger']);
  const BUILTINS = new Set(['console', 'Math', 'JSON', 'Object', 'Array', 'String', 'Number', 'Boolean', 'Promise', 'Map', 'Set',
    'WeakMap', 'WeakSet', 'Date', 'Symbol', 'BigInt', 'Error', 'TypeError', 'RangeError', 'ReferenceError', 'SyntaxError',
    'RegExp', 'Infinity', 'NaN', 'globalThis', 'Intl']);

  // Tokenleriň görnüşleri: 1 — teswir, 2 — setir, 3 — san, 4 — at, 5 — boşluk, 6 — beýleki belgi
  const TOKEN_RE = /(\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|$))|(`(?:\\[\s\S]|[^\\`])*`?|"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?)|(\b0x[\da-f]+n?\b|\b\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?n?\b|\.\d+\b)|([A-Za-z_$À-￿][\w$À-￿]*)|(\s+)|([\s\S])/gi;

  function tokenize(code) {
    const out = [];
    let m, prev = '', depth = 0;
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(code))) {
      const t = m[0];
      let cls = '';
      if (m[1]) cls = 'com';
      else if (m[2]) cls = 'str';
      else if (m[3]) cls = 'num';
      else if (m[4]) {
        if (prev === '.') cls = /^\s*\(/.test(code.slice(TOKEN_RE.lastIndex)) ? 'fn' : 'prop';
        else if (CONTROL.has(t)) cls = 'ctl';
        else if (KEYWORDS.has(t)) cls = 'kw';
        else if (BUILTINS.has(t)) cls = 'cls';
        else if (/^\s*\(/.test(code.slice(TOKEN_RE.lastIndex))) cls = 'fn';
        else if (/^[A-Z]/.test(t)) cls = 'cls';
        else cls = 'var';
      } else if (m[6]) {
        // Ýaýlaryň jübüt reňkleri (VS Code ýaly)
        if ('([{'.includes(t)) { cls = 'br' + (depth % 3); depth++; }
        else if (')]}'.includes(t)) { depth = Math.max(0, depth - 1); cls = 'br' + (depth % 3); }
        else if ('=+-*/%<>!&|?:^~'.includes(t)) cls = 'op';
      }
      if (!m[5]) prev = t;
      out.push([cls, t]);
    }
    return out;
  }

  // Tokenleri setirlere bölüp, her setir üçin HTML taýýarlaýar
  function highlightLines(code, esc) {
    const lines = [''];
    tokenize(code).forEach(([cls, text]) => {
      text.split('\n').forEach((part, i) => {
        if (i > 0) lines.push('');
        if (part) lines[lines.length - 1] += cls ? `<span class="t-${cls}">${esc(part)}</span>` : esc(part);
      });
    });
    return lines;
  }

  // Bahany konsol üçin tekste öwürmek (Worker-de we DOM sahypasynda ulanylýar, şonuň üçin daşky üýtgeýänlere bagly däl)
  function fmt(v, d, top) {
    if (typeof v === 'string') return top ? v : "'" + v + "'";
    if (typeof v === 'bigint') return v + 'n';
    if (typeof v === 'symbol') return v.toString();
    if (typeof v === 'function') return /^class\b/.test(Function.prototype.toString.call(v)) ? '[class ' + (v.name || '') + ']' : '[Function: ' + (v.name || '(anonymous)') + ']';
    if (v === null || typeof v !== 'object') return String(v);
    if (v instanceof Error) return v.name + ': ' + v.message;
    if (typeof Node !== 'undefined' && v instanceof Node) {
      if (v.nodeType !== 1) return v.nodeName + ' ' + JSON.stringify(v.textContent);
      return '<' + v.tagName.toLowerCase() + (v.id ? '#' + v.id : '') + (v.className && typeof v.className === 'string' ? '.' + v.className.trim().split(/\s+/).join('.') : '') + '>';
    }
    if (d > 2) return Array.isArray(v) ? '[Array]' : '[Object]';
    if (typeof NodeList !== 'undefined' && (v instanceof NodeList || v instanceof HTMLCollection)) {
      return v.constructor.name + '(' + v.length + ') [' + Array.from(v).map(x => fmt(x, d + 1)).join(', ') + ']';
    }
    if (Array.isArray(v)) return '[' + v.map(x => fmt(x, d + 1)).join(', ') + ']';
    if (v instanceof Map) return 'Map(' + v.size + ') {' + [...v].map(([k, x]) => fmt(k, d + 1) + ' => ' + fmt(x, d + 1)).join(', ') + '}';
    if (v instanceof Set) return 'Set(' + v.size + ') {' + [...v].map(x => fmt(x, d + 1)).join(', ') + '}';
    if (v instanceof Promise) return 'Promise {}';
    if (v instanceof Date) return v.toISOString();
    if (v instanceof RegExp) return String(v);
    const keys = Object.keys(v);
    const name = v.constructor && v.constructor !== Object && v.constructor.name ? v.constructor.name + ' ' : '';
    return name + (keys.length ? '{ ' + keys.map(k => k + ': ' + fmt(v[k], d + 1)).join(', ') + ' }' : '{}');
  }

  // Worker-iň başyna goşulýan kod: console-y tutmak, taýmerleri sanamak
  function prelude() {
    const send = lvl => (...a) => postMessage({ t: 'log', lvl, text: a.map(x => fmt(x, 0, true)).join(' ') });
    console.log = send('log'); console.info = send('info'); console.debug = send('log');
    console.warn = send('warn'); console.error = send('error'); console.table = send('log');
    // Garaşylýan taýmerler gutaranda programma tamamlandy diýip hasaplanýar
    const st = setTimeout, ct = clearTimeout, si = setInterval, ci = clearInterval, pending = new Set();
    // Kiçijik garaşmak: tutulmadyk Promise ýalňyşlyklary (unhandledrejection) hem gelip ýetişer ýaly
    const check = () => st(() => { if (!pending.size) postMessage({ t: 'idle' }); }, 30);
    self.setTimeout = (f, ms, ...a) => {
      const id = st(() => { pending.delete(id); try { if (typeof f === 'function') f(...a); } finally { check(); } }, ms);
      pending.add(id);
      return id;
    };
    self.clearTimeout = id => { pending.delete(id); ct(id); check(); };
    self.setInterval = (f, ms, ...a) => { const id = si(f, ms, ...a); pending.add(id); return id; };
    self.clearInterval = id => { pending.delete(id); ci(id); check(); };
    self.__check = check;
    self.addEventListener('unhandledrejection', e => {
      postMessage({ t: 'err', text: 'Uncaught (in promise) ' + fmt(e.reason, 0, true) });
    });
  }
  const PRELUDE = fmt.toString() + '\n(' + prelude.toString() + ')();';
  const PRELUDE_LINES = PRELUDE.split('\n').length;

  // ---------- DOM rejimi: kod sahypanyň (iframe) içinde işleýär ----------
  // iframe sandbox="allow-scripts" (allow-same-origin ýok): sahypa programmanyň maglumatlaryna (localStorage) ýetip bilmeýär.
  // Konsol we ýalňyşlyklar parent.postMessage arkaly redaktora iberilýär.
  function domPrelude() {
    const post = m => parent.postMessage(Object.assign({ __jsow: 1 }, m), '*');
    const send = lvl => (...a) => post({ t: 'log', lvl, text: a.map(x => fmt(x, 0, true)).join(' ') });
    console.log = send('log'); console.info = send('info'); console.debug = send('log');
    console.warn = send('warn'); console.error = send('error'); console.table = send('log');
    window.addEventListener('error', e => post({ t: 'err', text: String(e.message || 'Error').replace(/^Uncaught /, ''), line: e.lineno }));
    window.addEventListener('unhandledrejection', e => post({ t: 'err', text: 'Uncaught (in promise) ' + fmt(e.reason, 0, true) }));
    /* Çäksiz sikle garşy: sikl işläp durka taýmer işlemeýär, şonuň üçin t0 köne galýar */
    let t0 = performance.now();
    setInterval(() => { t0 = performance.now(); }, 200);
    self.__g = () => {
      if (performance.now() - t0 > 3000) { t0 = performance.now(); throw new Error('LOOP_GUARD'); }
    };
  }
  const DOM_PRELUDE = '<script>' + fmt.toString() + ';(' + domPrelude.toString() + ')();<\/script>';

  // Sikilleriň ({ ... } bedeni bolan for / while / do) başyna __g() barlagyny goşmak.
  // Setirler goşulmaýar — ýalňyşlygyň setir belgisi üýtgemeýär.
  function addLoopGuards(code) {
    const toks = tokenize(code);
    const next = i => { while (i < toks.length && (/^\s+$/.test(toks[i][1]) || toks[i][0] === 'com')) i++; return i; };
    const marks = new Set();
    for (let i = 0; i < toks.length; i++) {
      const [cls, t] = toks[i];
      if (cls !== 'ctl') continue;
      if (t === 'do') {
        const j = next(i + 1);
        if (toks[j] && toks[j][1] === '{') marks.add(j);
      } else if (t === 'for' || t === 'while') {
        let j = next(i + 1);
        if (!toks[j] || toks[j][1] !== '(') continue;
        let depth = 0;
        for (; j < toks.length; j++) {
          if (toks[j][1] === '(') depth++;
          else if (toks[j][1] === ')' && --depth === 0) break;
        }
        const k = next(j + 1);
        if (toks[k] && toks[k][1] === '{') marks.add(k);
      }
    }
    return toks.map(([, t], i) => marks.has(i) ? t + ' __g();' : t).join('');
  }

  // Redaktordaky sahypa: index.html faýly bar bolsa şol, ýogsam şu başlangyç sahypa ulanylýar
  const DEFAULT_PAGE = `<h1 id="title">Salam, DOM!</h1>
<p id="info">Bu sahypany JavaScript bilen üýtgediň.</p>
<button id="btn">Bas</button>
<ul id="list"></ul>`;
  const PAGE_STYLE = '<style>body{font-family:system-ui,sans-serif;margin:12px;color:#111;background:#fff}button{padding:6px 14px;cursor:pointer}</style>';

  // DOM rejimi üçin iframe-iň srcdoc-y we ulanyjynyň kodunyň başlaýan setiri
  function buildPage(name, code, files) {
    const safe = s => s.replace(/<\/script/gi, '<\\/script');
    if (/\.html?$/i.test(name)) {
      // HTML faýl: içindäki <script> bloklaryna sikl barlagy goşulýar; setirler üýtgemeýär
      const html = code.replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>)/gi, (m, a, js, b) => /\bsrc=/i.test(a) ? m : a + addLoopGuards(js) + b);
      return { html: DOM_PRELUDE + PAGE_STYLE + html, offset: (DOM_PRELUDE + PAGE_STYLE).split('\n').length - 1 };
    }
    const pageFile = files.find(f => /^index\.html?$/i.test(f.name));
    const page = pageFile ? pageFile.content.replace(/<script\b[\s\S]*?<\/script>/gi, '') : DEFAULT_PAGE;
    const head = DOM_PRELUDE + PAGE_STYLE + page + '\n<script>\n';
    return { html: head + safe(addLoopGuards(code)) + '\n<\/script>', offset: head.split('\n').length - 1 };
  }

  // ---------- Awtomatik maslahatlar (IntelliSense we snippetler) ----------
  // Snippet: $0 — kursoryň durjak ýeri
  const SNIPPETS = [
    ['log', 'console.log($0);', 'console.log(...)'],
    ['clg', 'console.log($0);', 'console.log(...)'],
    ['for', 'for (let i = 0; i < $0; i++) {\n  \n}', 'for sikli'],
    ['forof', 'for (const item of $0) {\n  \n}', 'for...of sikli'],
    ['forin', 'for (const key in $0) {\n  \n}', 'for...in sikli'],
    ['while', 'while ($0) {\n  \n}', 'while sikli'],
    ['dowhile', 'do {\n  $0\n} while ();', 'do...while sikli'],
    ['if', 'if ($0) {\n  \n}', 'if şerti'],
    ['ifelse', 'if ($0) {\n  \n} else {\n  \n}', 'if...else şerti'],
    ['switch', 'switch ($0) {\n  case 1:\n    break;\n  default:\n    break;\n}', 'switch'],
    ['function', 'function name($0) {\n  \n}', 'Funksiýa yglan etmek'],
    ['arrow', 'const name = ($0) => {\n  \n};', 'Ok-funksiýa'],
    ['class', 'class Name {\n  constructor($0) {\n    \n  }\n}', 'Klass'],
    ['try', 'try {\n  $0\n} catch (e) {\n  console.error(e);\n}', 'try...catch'],
    ['timeout', 'setTimeout(() => {\n  $0\n}, 1000);', 'setTimeout'],
    ['interval', 'const id = setInterval(() => {\n  $0\n}, 1000);', 'setInterval'],
    ['promise', 'new Promise((resolve, reject) => {\n  $0\n});', 'Promise döretmek'],
    ['async', 'async function name() {\n  $0\n}', 'async funksiýa'],
    ['map', 'map((item) => $0)', '.map(...) callback', true],
    ['filter', 'filter((item) => $0)', '.filter(...) callback', true],
    ['reduce', 'reduce((acc, item) => $0, 0)', '.reduce(...) callback', true],
    ['forEach', 'forEach((item) => {\n  $0\n});', '.forEach(...) callback', true]
  ].map(([label, body, detail, dot]) => ({ label, insert: body, detail, kind: 'snip', dot: !!dot }));

  const KW_LIST = [...CONTROL, ...KEYWORDS].map(k => ({ label: k, insert: k, kind: 'kw' }));
  const GLOBALS = [...BUILTINS, 'parseInt', 'parseFloat', 'isNaN', 'setTimeout', 'setInterval', 'clearTimeout',
    'clearInterval', 'structuredClone', 'queueMicrotask']
    .map(k => ({ label: k, insert: /^[a-z]/.test(k) && !['console', 'globalThis'].includes(k) ? k + '($0)' : k, kind: /^[A-Z]/.test(k) ? 'cls' : 'fn' }));

  // Nokatdan soňky agzalar: belli obýektler we umumy (massiw, setir, san, Promise) usullar
  const m = (names, kind = 'fn') => names.split(' ').map(n => ({ label: n, insert: kind === 'fn' ? n + '($0)' : n, kind }));
  const MEMBERS = {
    console: m('log info warn error table clear'),
    Math: [...m('round floor ceil abs max min pow sqrt random trunc sign'), ...m('PI E', 'prop')],
    JSON: m('stringify parse'),
    Object: m('keys values entries assign freeze seal create fromEntries getPrototypeOf'),
    Array: m('isArray from of'),
    Number: [...m('isInteger isNaN parseInt parseFloat'), ...m('MAX_SAFE_INTEGER MIN_SAFE_INTEGER EPSILON', 'prop')],
    String: m('fromCharCode'),
    Promise: m('resolve reject all race allSettled any')
  };
  const COMMON = [
    ...m('length size', 'prop'),
    ...m('push pop shift unshift splice slice concat join reverse sort map filter reduce forEach find findIndex some every includes indexOf lastIndexOf flat at fill keys values entries'),
    ...m('toUpperCase toLowerCase trim trimStart trimEnd split replace replaceAll startsWith endsWith padStart padEnd repeat charAt charCodeAt substring'),
    ...m('toFixed toString then catch finally get set has add delete clear')
  ];
  const KIND_ICON = { snip: '⬚', kw: '🔑', fn: 'ƒ', prop: '◇', cls: '🅒', var: '𝑥' };

  // VS Code ýaly "bulanyk" gözleg: harplar tertip boýunça gabat gelse ýeterlik (cns → console, fn → function).
  // Gaýtarýar: { score, hits } (score kiçi bolsa has gowy) ýa-da gabat gelmese null.
  function fuzzy(label, q) {
    if (!q) return { score: 5, hits: [] };
    const l = label.toLowerCase(), ql = q.toLowerCase();
    const range = (a, n) => Array.from({ length: n }, (_, i) => a + i);
    if (l.startsWith(ql)) return { score: 0, hits: range(0, ql.length) };
    const at = l.indexOf(ql);
    if (at >= 0) return { score: 2, hits: range(at, ql.length) };
    let pos = 0, gaps = 0;
    const hits = [];
    for (const ch of ql) {
      const k = l.indexOf(ch, pos);
      if (k < 0) return null;
      if (hits.length) gaps += k - pos;
      hits.push(k);
      pos = k + 1;
    }
    return { score: (hits[0] === 0 ? 1 : 3) + Math.min(gaps, 20) / 25, hits };
  }

  const DEFAULT_CODE = `// JavaScript — kod redaktory
// Kody ýazyň we ▶ Işlet düwmesine (ýa-da Ctrl+Enter) basyň.

function salam(at) {
  return \`Salam, \${at}!\`;
}

console.log(salam("dünýä"));

const sanlar = [1, 2, 3, 4, 5];
const jem = sanlar.reduce((a, b) => a + b, 0);
console.log("Jemi:", jem);
console.log("Jübütler:", sanlar.filter(n => n % 2 === 0));
`;

  const EXAMPLES = [
    { name: 'salam.js', title: '👋 Salam, dünýä', desc: 'console.log, üýtgeýänler, şablon setir', code:
`const at = "Talyp";
const yyl = 2026;

console.log("Salam, dünýä!");
console.log(\`Salam, \${at}! Häzir \${yyl}-nji ýyl.\`);
console.log(typeof at, typeof yyl);
` },
    { name: 'sikller.js', title: '🔁 Sikller', desc: 'for, while, for...of, break', code:
`for (let i = 1; i <= 5; i++) {
  console.log(i, "*", i, "=", i * i);
}

const miweler = ["alma", "üzüm", "garpyz"];
for (const m of miweler) {
  console.log("Miwe:", m);
}

let n = 0;
while (true) {
  n++;
  if (n === 3) break;
}
console.log("n =", n);
` },
    { name: 'funksiyalar.js', title: '🧩 Funksiýalar we closure', desc: 'ok-funksiýalar, adaty bahalar, closure', code:
`const kwadrat = x => x * x;
console.log(kwadrat(7));

function salam(at = "dost") {
  return "Salam, " + at;
}
console.log(salam(), salam("Aýna"));

function sanaýjy() {
  let c = 0;
  return () => ++c;
}
const next = sanaýjy();
next(); next();
console.log("Sanaýjy:", next());
` },
    { name: 'massiwler.js', title: '📋 Massiw usullary', desc: 'map, filter, reduce, sort, find', code:
`const bahalar = [72, 95, 58, 88, 100, 64];

console.log("Iki essesi:", bahalar.map(b => b * 2));
console.log("80-den ýokary:", bahalar.filter(b => b > 80));
console.log("Ortaça:", bahalar.reduce((a, b) => a + b, 0) / bahalar.length);
console.log("Tertiplenen:", [...bahalar].sort((a, b) => a - b));
console.log("Ilkinji 90+:", bahalar.find(b => b >= 90));
` },
    { name: 'obyektler.js', title: '🗃 Obýektler we JSON', desc: 'häsiýetler, destrukturlaşdyrma, JSON', code:
`const talyp = {
  at: "Merdan",
  yas: 21,
  bahalar: [5, 4, 5],
  ortaca() {
    return this.bahalar.reduce((a, b) => a + b) / this.bahalar.length;
  }
};

const { at, yas } = talyp;
console.log(at, yas);
console.log("Ortaça baha:", talyp.ortaca().toFixed(2));
console.log(Object.keys(talyp));
console.log(JSON.stringify({ at, yas }));
` },
    { name: 'klasslar.js', title: '🧱 Klasslar', desc: 'class, extends, super, static', code:
`class Haywan {
  constructor(at) {
    this.at = at;
  }
  ses() {
    return "...";
  }
  tanyşdyr() {
    return \`\${this.at}: \${this.ses()}\`;
  }
}

class It extends Haywan {
  ses() {
    return "Haw-haw!";
  }
}

const it = new It("Bars");
console.log(it.tanyşdyr());
console.log(it instanceof Haywan);
` },
    { name: 'asinhron.js', title: '⏳ Asinhron kod', desc: 'setTimeout, Promise, async/await', code:
`const garash = ms => new Promise(r => setTimeout(r, ms));

console.log("1. Başlandy");
setTimeout(() => console.log("4. setTimeout"), 0);
Promise.resolve().then(() => console.log("3. Promise"));
console.log("2. Sinhron kod gutardy");

(async () => {
  await garash(500);
  console.log("5. 0.5 sekuntdan soň (async/await)");
})();
` },
    { name: 'dom.js', title: '🌐 DOM: sahypany üýtgetmek', desc: 'querySelector, addEventListener, createElement (DOM rejimi)', dom: true, code:
`// DOM rejiminde işleýär: aşakdaky "SAHYPA" penjiresine serediň
const title = document.querySelector("#title");
const btn = document.querySelector("#btn");
const list = document.querySelector("#list");

title.textContent = "Meniň ilkinji DOM sahypam";
title.style.color = "seagreen";

let sany = 0;
btn.addEventListener("click", () => {
  sany++;
  const li = document.createElement("li");
  li.textContent = sany + "-nji basyş";
  list.appendChild(li);
  console.log("Basyldy:", sany);
});

console.log(document.querySelectorAll("h1, p, button"));
` },
    { name: 'index.html', title: '📄 HTML sahypa', desc: 'Doly HTML sahypa: forma, input, wakalar (DOM rejimi)', dom: true, code:
`<h2>Salamlaşmak</h2>
<input id="at" placeholder="Adyňyz">
<button id="ok">Salam aýt</button>
<p id="netije"></p>

<script>
const at = document.getElementById("at");
document.getElementById("ok").addEventListener("click", () => {
  const text = at.value.trim() || "dost";
  document.getElementById("netije").textContent = "Salam, " + text + "!";
  console.log("Salamlaşdyk:", text);
});
</script>
` },
    { name: 'yalnyshlyklar.js', title: '🐞 Ýalňyşlyklar', desc: 'try/catch, throw, ýalňyşlyk setiri', code:
`function bolmek(a, b) {
  if (b === 0) throw new RangeError("Nola bölüp bolmaýar");
  return a / b;
}

try {
  console.log(bolmek(10, 2));
  console.log(bolmek(1, 0));
} catch (e) {
  console.error("Tutuldy:", e.name, "-", e.message);
}

console.warn("Indiki setir ýalňyşlyk döreder:");
null.haysydyr;
` }
  ];

  // ---------- Kod meýdany (gaýtadan ulanylýan komponent) ----------
  // Redaktorda we "Mysal işlemek" bölüminde ulanylýar. Setir belgileri, reňkler, maslahatlar,
  // awtomatik ýapmak/içeri süýşürmek we klawiatura gysga ýollary şu ýerde.
  // opts: onChange(value), onRun(), onSave(), onPos(line, col, selLen)
  function createCodeArea(scroller, opts = {}) {
    const U = App.util;
    const LH = 21;   // setiriň beýikligi (CSS bilen deň)
    scroller.innerHTML = `
      <div class="ide-inner">
        <div class="ide-gutter"></div>
        <div class="ide-code">
          <div class="ide-hl" aria-hidden="true"></div>
          <textarea class="ide-input" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off" aria-label="Kod"></textarea>
          <div class="ide-suggest" role="listbox" hidden></div>
        </div>
      </div>`;
    const ta = scroller.querySelector('.ide-input');
    const hl = scroller.querySelector('.ide-hl');
    const gutter = scroller.querySelector('.ide-gutter');
    const sugBox = scroller.querySelector('.ide-suggest');
    let errorLine = 0;

    function curLine() { return ta.value.slice(0, ta.selectionStart).split('\n').length; }

    function paint() {
      const lines = highlightLines(ta.value, U.esc);
      const cur = curLine();
      hl.innerHTML = lines.map((l, i) => `<div class="ide-line${i + 1 === cur ? ' cur' : ''}">${l}</div>`).join('');
      gutter.innerHTML = lines.map((_, i) => `<div class="${i + 1 === cur ? 'cur' : ''}${i + 1 === errorLine ? ' err' : ''}">${i + 1}</div>`).join('');
      lastCur = cur;
      updatePos();
    }

    // Diňe kursor süýşende: häzirki setiriň bellegini täzelemek
    let lastCur = 0;
    function updatePos() {
      const before = ta.value.slice(0, ta.selectionStart).split('\n');
      const line = before.length, col = before[before.length - 1].length + 1;
      if (opts.onPos) opts.onPos(line, col, ta.selectionEnd - ta.selectionStart);
      if (line !== lastCur) {
        [hl, gutter].forEach(box => {
          const old = box.children[lastCur - 1], now = box.children[line - 1];
          if (old) old.classList.remove('cur');
          if (now) now.classList.add('cur');
        });
        lastCur = line;
      }
      if (document.activeElement === ta) ensureVisible(line, col);
    }

    // Kursory görünýän meýdanda saklamak
    let charW = 0;
    function measure() {
      if (charW) return;
      const probe = document.createElement('span');
      probe.textContent = 'M'.repeat(20);
      hl.appendChild(probe);
      charW = probe.getBoundingClientRect().width / 20 || 8;
      probe.remove();
    }
    function ensureVisible(line, col) {
      measure();
      const top = (line - 1) * LH, bottom = top + LH + 20;
      if (top < scroller.scrollTop) scroller.scrollTop = top;
      else if (bottom > scroller.scrollTop + scroller.clientHeight) scroller.scrollTop = bottom - scroller.clientHeight;
      const x = col * charW + gutter.offsetWidth + 16;
      if (x > scroller.scrollLeft + scroller.clientWidth - 20) scroller.scrollLeft = x - scroller.clientWidth + 40;
      else if (x - gutter.offsetWidth - 40 < scroller.scrollLeft) scroller.scrollLeft = Math.max(0, x - gutter.offsetWidth - 40);
    }

    // ---------- Awtomatik maslahatlar ----------
    const sug = { open: false, items: [], index: 0 };
    let suppress = false;

    function wordBefore() {
      const v = ta.value, a = ta.selectionStart;
      const w = v.slice(0, a).match(/[\w$À-￿]*$/)[0];
      const start = a - w.length;
      const dot = v[start - 1] === '.';
      const obj = dot ? (v.slice(0, start - 1).match(/[\w$]+$/) || [''])[0] : '';
      return { w, start, dot, obj };
    }

    // Kursor setiriň ýa-da teswiriň içinde bolsa maslahat görkezilmeýär
    function inStringOrComment() {
      const v = ta.value, a = ta.selectionStart;
      const line = v.slice(v.lastIndexOf('\n', a - 1) + 1, a);
      if (line.includes('//')) return true;
      return ['"', "'", '`'].some(q => (line.split(q).length - 1) % 2 === 1);
    }

    function closeSug() { sug.open = false; sugBox.hidden = true; }

    function suggest(manual) {
      const { w, start, dot, obj } = wordBefore();
      if ((!dot && !w && !manual) || inStringOrComment()) return closeSug();
      let pool;
      if (dot) {
        pool = MEMBERS[obj] ? MEMBERS[obj] : [...COMMON, ...SNIPPETS.filter(x => x.dot)];
      } else {
        const words = new Set(ta.value.match(/[A-Za-z_$À-￿][\w$À-￿]*/g) || []);
        words.delete(w);
        const ids = [...words].filter(x => x.length > 1 && !CONTROL.has(x) && !KEYWORDS.has(x) && !BUILTINS.has(x))
          .map(x => ({ label: x, insert: x, kind: 'var' }));
        pool = [...ids, ...SNIPPETS.filter(x => !x.dot), ...KW_LIST, ...GLOBALS];
      }
      const order = { var: 0, snip: 1, fn: 2, prop: 2, kw: 3, cls: 4 }, seen = new Set();
      sug.items = pool
        .map(it => { const f = fuzzy(it.label, w); return f && [f.score, { ...it, hits: f.hits }]; })
        .filter(x => x && !(x[1].label === w && x[1].kind !== 'snip'))
        .sort((x, y) => x[0] - y[0] || order[x[1].kind] - order[y[1].kind] || x[1].label.length - y[1].label.length)
        .map(x => x[1])
        .filter(it => { const k = it.kind + it.label; if (seen.has(k)) return false; seen.add(k); return true; })
        .slice(0, 12);
      if (!sug.items.length) return closeSug();
      sug.index = 0;
      sug.open = true;
      renderSug(start);
    }

    function renderSug(start) {
      sugBox.innerHTML = sug.items.map((it, i) => {
        // Gabat gelen harplar galyň görkezilýär
        const label = [...it.label].map((ch, k) => it.hits.includes(k) ? `<b>${U.esc(ch)}</b>` : U.esc(ch)).join('');
        return `<div class="sg-item ${i === sug.index ? 'on' : ''}" data-i="${i}" role="option">
          <span class="sg-ic k-${it.kind}">${KIND_ICON[it.kind]}</span>
          <span class="sg-label">${label}</span>
          <span class="sg-detail">${U.esc(it.detail || { var: 'üýtgeýän', kw: 'açar söz', fn: 'funksiýa', prop: 'häsiýet', cls: 'obýekt' }[it.kind] || '')}</span></div>`;
      }).join('');
      sugBox.hidden = false;
      if (start !== undefined) {
        measure();
        const v = ta.value;
        const lineIdx = v.slice(0, start).split('\n').length - 1;
        const col = start - (v.lastIndexOf('\n', start - 1) + 1);
        let top = (lineIdx + 1) * LH + 10;
        if (top + sugBox.offsetHeight > scroller.scrollTop + scroller.clientHeight && lineIdx * LH + 10 - sugBox.offsetHeight > 0) {
          top = lineIdx * LH + 10 - sugBox.offsetHeight;
        }
        sugBox.style.top = top + 'px';
        sugBox.style.left = (6 + col * charW) + 'px';
      }
      const on = sugBox.querySelector('.on');
      if (on) on.scrollIntoView({ block: 'nearest' });
    }

    function accept(it) {
      const { start } = wordBefore();
      const v = ta.value, a = ta.selectionStart;
      const lineStart = v.lastIndexOf('\n', start - 1) + 1;
      const indent = v.slice(lineStart).match(/^[ \t]*/)[0];
      let text = it.insert;
      if (v[a] === '(' && text.endsWith('($0)')) text = text.slice(0, -4) + '$0';   // ýaý eýýäm bar
      text = text.replace(/\n/g, '\n' + indent);
      let caret = text.indexOf('$0');
      text = text.replace('$0', '');
      if (caret < 0) caret = text.length;
      closeSug();
      suppress = true;
      replace(start, a, text, start + caret);
      suppress = false;
    }

    sugBox.addEventListener('mousedown', e => {
      e.preventDefault();
      const item = e.target.closest('.sg-item');
      if (item) accept(sug.items[+item.dataset.i]);
    });
    ta.addEventListener('blur', () => setTimeout(closeSug, 100));
    ta.addEventListener('click', closeSug);

    ta.addEventListener('input', e => {
      errorLine = 0;
      paint();
      if (!suppress) {
        if (e.inputType === 'insertText') suggest();
        else if (sug.open && /^delete/.test(e.inputType || '')) suggest();
        else closeSug();
      }
      if (opts.onChange) opts.onChange(ta.value);
    });
    ['keyup', 'click', 'select'].forEach(ev => ta.addEventListener(ev, updatePos));
    function onSel() { if (document.activeElement === ta) updatePos(); }
    document.addEventListener('selectionchange', onSel);
    // Redaktoryň boş ýerine basylanda kursory koda geçirmek
    scroller.addEventListener('mousedown', e => { if (e.target === scroller) { e.preventDefault(); ta.focus(); } });

    // Teksti çalyşmak (Ctrl+Z bilen yza gaýtaryp bolar ýaly execCommand ulanylýar)
    function replace(start, end, text, selStart, selEnd = selStart) {
      ta.setSelectionRange(start, end);
      if (text) document.execCommand('insertText', false, text);
      else if (start !== end) document.execCommand('delete');
      ta.setSelectionRange(selStart, selEnd);
      updatePos();
    }

    // Saýlanan setirleriň aralygy
    function lineRange() {
      const v = ta.value;
      const start = v.lastIndexOf('\n', ta.selectionStart - 1) + 1;
      let endSel = ta.selectionEnd;
      if (endSel > ta.selectionStart && v[endSel - 1] === '\n') endSel--;
      let end = v.indexOf('\n', endSel);
      if (end === -1) end = v.length;
      return { start, end, text: v.slice(start, end) };
    }

    const PAIRS = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' };

    ta.addEventListener('keydown', e => {
      const v = ta.value, a = ta.selectionStart, b = ta.selectionEnd;
      const before = v[a - 1], after = v[a];
      const ctrl = e.ctrlKey || e.metaKey;

      // Maslahat sanawy açyk bolsa: ↑ ↓ — saýlamak, Enter / Tab — goýmak, Esc — ýapmak
      if (sug.open) {
        const n = sug.items.length;
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          sug.index = (sug.index + (e.key === 'ArrowDown' ? 1 : n - 1)) % n;
          renderSug();
          return;
        }
        if ((e.key === 'Enter' && !ctrl) || e.key === 'Tab') { e.preventDefault(); accept(sug.items[sug.index]); return; }
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeSug(); return; }
        if (['ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(e.key)) closeSug();
      }
      if (ctrl && e.key === ' ') { e.preventDefault(); suggest(true); return; }

      if ((ctrl && e.key === 'Enter') || e.key === 'F5') { e.preventDefault(); if (opts.onRun) opts.onRun(); return; }
      if (ctrl && e.key.toLowerCase() === 's') { e.preventDefault(); if (opts.onSave) opts.onSave(); return; }

      // Tab / Shift+Tab
      if (e.key === 'Tab') {
        e.preventDefault();
        const multi = v.slice(a, b).includes('\n');
        if (!multi && !e.shiftKey) { replace(a, b, '  ', a + 2); return; }
        const r = lineRange();
        const lines = r.text.split('\n');
        const changed = lines.map(l => e.shiftKey ? l.replace(/^ {1,2}/, '') : '  ' + l).join('\n');
        const firstShift = e.shiftKey ? -(lines[0].length - lines[0].replace(/^ {1,2}/, '').length) : 2;
        replace(r.start, r.end, changed, multi ? r.start : Math.max(r.start, a + firstShift), multi ? r.start + changed.length : Math.max(r.start, a + firstShift));
        return;
      }

      // Ctrl+/ — teswir
      if (ctrl && e.key === '/') {
        e.preventDefault();
        const r = lineRange();
        const lines = r.text.split('\n');
        const allCommented = lines.filter(l => l.trim()).every(l => /^\s*\/\//.test(l));
        const changed = lines.map(l => {
          if (!l.trim()) return l;
          return allCommented ? l.replace(/^(\s*)\/\/ ?/, '$1') : l.replace(/^(\s*)/, '$1// ');
        }).join('\n');
        replace(r.start, r.end, changed, r.start, r.start + changed.length);
        return;
      }

      // Ctrl+D — setiri göçürmek
      if (ctrl && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        const r = lineRange();
        replace(r.end, r.end, '\n' + r.text, a + r.text.length + 1, b + r.text.length + 1);
        return;
      }

      // Alt+↑ / Alt+↓ — setiri süýşürmek
      if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();
        const r = lineRange();
        if (e.key === 'ArrowUp' && r.start > 0) {
          const ps = v.lastIndexOf('\n', r.start - 2) + 1;
          const prevLine = v.slice(ps, r.start - 1);
          const shift = prevLine.length + 1;
          replace(ps, r.end, r.text + '\n' + prevLine, a - shift, b - shift);
        } else if (e.key === 'ArrowDown' && r.end < v.length) {
          let ne = v.indexOf('\n', r.end + 1);
          if (ne === -1) ne = v.length;
          const nextLine = v.slice(r.end + 1, ne);
          const shift = nextLine.length + 1;
          replace(r.start, ne, nextLine + '\n' + r.text, a + shift, b + shift);
        }
        return;
      }

      // Enter — awtomatik içeri süýşürmek
      if (e.key === 'Enter' && !ctrl) {
        e.preventDefault();
        const lineStart = v.lastIndexOf('\n', a - 1) + 1;
        const indent = v.slice(lineStart, a).match(/^\s*/)[0];
        const opens = before && '{[('.includes(before);
        if (opens && after === PAIRS[before]) {
          const ins = '\n' + indent + '  ' + '\n' + indent;
          replace(a, b, ins, a + indent.length + 3);
        } else {
          const ins = '\n' + indent + (opens ? '  ' : '');
          replace(a, b, ins, a + ins.length);
        }
        return;
      }

      // Backspace — boş jübüti bilelikde pozmak
      if (e.key === 'Backspace' && a === b && before && PAIRS[before] === after) {
        e.preventDefault();
        replace(a - 1, a + 1, '', a - 1);
        return;
      }

      // Ýapýan belgä basylanda, eýýäm bar bolsa üstünden geçmek
      if (a === b && (')]}'.includes(e.key) || `"'\``.includes(e.key)) && after === e.key) {
        e.preventDefault();
        ta.setSelectionRange(a + 1, a + 1);
        updatePos();
        return;
      }

      // Ýaýlary we dyrnaklary awtomatik ýapmak
      if (PAIRS[e.key] && !ctrl && !e.altKey) {
        const quote = `"'\``.includes(e.key);
        if (a !== b) {
          e.preventDefault();
          const sel = v.slice(a, b);
          replace(a, b, e.key + sel + PAIRS[e.key], a + 1, b + 1);
          return;
        }
        if (quote && before && /[\w$À-￿]/.test(before)) return;   // apostrof: ýapmaýarys
        if (after && /[\w$À-￿]/.test(after)) return;
        e.preventDefault();
        replace(a, b, e.key + PAIRS[e.key], a + 1);
      }
    });

    return {
      ta,
      get value() { return ta.value; },
      setValue(v) {
        ta.value = v;
        errorLine = 0;
        paint();
        ta.setSelectionRange(0, 0);
        scroller.scrollTop = 0;
        scroller.scrollLeft = 0;
      },
      setErrorLine(n) { errorLine = n; paint(); },
      focus() { ta.focus(); },
      destroy() { document.removeEventListener('selectionchange', onSel); }
    };
  }
  App.codeArea = createCodeArea;

  // Kod işletmek üçin Worker-iň başyna goşulýan kod we onuň setir sany (beýleki bölümlerde hem ulanylýar)
  App.codeRunner = { PRELUDE, PRELUDE_LINES };

  App.views.editor = {
    render(el) {
      const U = App.util, st = App.store, s = st.state, ed = s.editor;

      // Ilkinji gezek: başlangyç faýl
      if (!Array.isArray(ed.files) || !ed.files.length) {
        ed.files = [{ name: 'main.js', content: U.noSemi(DEFAULT_CODE) }];
        ed.tabs = ['main.js'];
        ed.active = 'main.js';
        st.save();
      }
      ed.tabs = (ed.tabs || []).filter(n => ed.files.some(f => f.name === n));
      if (!ed.files.some(f => f.name === ed.active)) ed.active = ed.files[0].name;
      if (!ed.tabs.includes(ed.active)) ed.tabs.push(ed.active);

      let side = 'files';
      let worker = null, timers = [], logCount = 0, runStart = 0, errorLine = 0;
      const file = () => ed.files.find(f => f.name === ed.active);
      const ico = n => /\.html?$/i.test(n) ? '<span class="js-ico html-ico">&lt;&gt;</span>' : '<span class="js-ico">JS</span>';

      el.innerHTML = `
        <div class="ide">
          <nav class="ide-activity">
            <button data-side="files" title="Faýllar (Explorer)">📄</button>
            <button data-side="examples" title="Mysallar">📚</button>
            <button data-side="keys" title="Klawiatura gysga ýollary">⌨️</button>
          </nav>
          <aside class="ide-side" id="ideSide"></aside>
          <section class="ide-main">
            <div class="ide-tabs" id="ideTabs"></div>
            <div class="ide-toolbar">
              <span class="ide-crumb" id="ideCrumb"></span>
              <span class="grow"></span>
              <button class="ide-dom" id="domBtn" aria-pressed="false" title="DOM rejimi: kod HTML sahypanyň içinde işleýär (document, düwmeler, wakalar)">🌐 DOM</button>
              <button class="ide-run" id="runBtn" title="Işlet (Ctrl+Enter)">▶ Işlet</button>
              <button class="ide-stop" id="stopBtn" title="Togtat" hidden>⏹ Togtat</button>
            </div>
            <div class="ide-editor" id="ideScroll"></div>
            <div class="ide-panel">
              <div class="ide-panel-head">
                <span class="ide-panel-tab">KONSOL</span>
                <span class="ide-panel-tab ide-page-tab">SAHYPA (DOM)</span>
                <span class="grow"></span>
                <button id="clearOut" title="Konsoly arassala" aria-label="Konsoly arassala">🗑</button>
              </div>
              <div class="ide-panel-body">
                <div class="ide-out" id="ideOut" role="log" aria-live="polite" aria-label="Konsol"><div class="out-line out-hint">Kody işletmek üçin ▶ Işlet ýa-da Ctrl+Enter basyň.</div></div>
                <div class="ide-page" id="idePage"><div class="ide-page-hint">Kody ▶ Işlet bilen işlediň — sahypa şu ýerde görüner.</div></div>
              </div>
            </div>
            <footer class="ide-status">
              <span id="stState">⚡ JavaScript</span>
              <span class="grow"></span>
              <span id="stPos">Ln 1, Col 1</span>
              <span>Boşluk: 2</span>
              <span>UTF-8</span>
              <span>JavaScript</span>
            </footer>
          </section>
        </div>`;

      const out = el.querySelector('#ideOut');
      let saveTimer = null;
      const area = createCodeArea(el.querySelector('#ideScroll'), {
        onChange: v => {
          file().content = v;
          errorLine = 0;
          clearTimeout(saveTimer);
          saveTimer = setTimeout(() => st.save(), 400);
        },
        onRun: () => run(),
        onSave: () => { st.save(); U.toast(`💾 ${ed.active} saklandy`); },
        onPos: (line, col, sel) => {
          el.querySelector('#stPos').textContent = `Ln ${line}, Col ${col}` + (sel > 0 ? ` (${sel} saýlandy)` : '');
        }
      });
      const ta = area.ta;

      // Faýly redaktora ýüklemek
      function load() {
        area.setValue(file().content);
        errorLine = 0;
        area.focus();
      }

      // ---------- Gapdal panel ----------
      function renderSide() {
        el.querySelectorAll('[data-side]').forEach(b => b.classList.toggle('active', b.dataset.side === side));
        const box = el.querySelector('#ideSide');
        if (side === 'files') {
          box.innerHTML = `
            <div class="side-head">EXPLORER <button id="newFile" title="Täze faýl">＋</button></div>
            <div class="side-sec">▾ JAVASCRIPT</div>
            ${ed.files.map(f => `<div class="file-item ${f.name === ed.active ? 'active' : ''}" data-file="${U.esc(f.name)}" title="Iki gezek basyp adyny üýtgediň">
              ${ico(f.name)}<span class="file-name">${U.esc(f.name)}</span>
              <button class="file-del" data-del="${U.esc(f.name)}" title="Pozmak">✕</button></div>`).join('')}
            <div class="side-note">Faýllar awtomatik saklanýar.</div>`;
          box.querySelector('#newFile').addEventListener('click', newFile);
          box.querySelectorAll('.file-item').forEach(it => {
            it.addEventListener('click', e => { if (!e.target.closest('.file-del')) open(it.dataset.file); });
            it.addEventListener('dblclick', () => rename(it.dataset.file));
          });
          box.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => remove(b.dataset.del)));
        } else if (side === 'examples') {
          box.innerHTML = `<div class="side-head">MYSALLAR</div>
            ${EXAMPLES.map((x, i) => `<div class="ex-item" data-ex="${i}" role="button" tabindex="0"><b>${x.title}</b><span>${U.esc(x.desc)}</span></div>`).join('')}
            <div class="side-note">Mysal täze faýl hökmünde açylýar.</div>`;
          box.querySelectorAll('[data-ex]').forEach(it => it.addEventListener('click', () => {
            const x = EXAMPLES[+it.dataset.ex];
            const name = uniqueName(x.name);
            ed.files.push({ name, content: U.noSemi(x.code) });
            if (x.dom) setDom(true);
            open(name);
            side = 'files';
            renderSide();
          }));
        } else {
          const keys = [['Ctrl+Space', 'Maslahatlary görkezmek'], ['↑ ↓ / Enter / Tab', 'Maslahaty saýlamak we goýmak'],
            ['log, for, if, arrow...', 'Snippet: ýazyp, Enter basyň'], ['Ctrl+Enter / F5', 'Kody işletmek'], ['Ctrl+S', 'Saklamak'], ['Tab / Shift+Tab', 'Içeri / daşary süýşürmek'],
            ['Ctrl+/', 'Teswir goýmak / aýyrmak'], ['Ctrl+D', 'Setiri göçürmek'], ['Alt+↑ / Alt+↓', 'Setiri ýokary / aşak süýşürmek'],
            ['Ctrl+Z / Ctrl+Y', 'Yza / öňe gaýtarmak']];
          box.innerHTML = `<div class="side-head">GYSGA ÝOLLAR</div>
            ${keys.map(([k, d]) => `<div class="key-row"><kbd>${k}</kbd><span>${d}</span></div>`).join('')}`;
        }
      }

      function uniqueName(base) {
        if (!ed.files.some(f => f.name === base)) return base;
        const [stem, ext] = base.includes('.') ? [base.slice(0, base.lastIndexOf('.')), base.slice(base.lastIndexOf('.'))] : [base, ''];
        let i = 2;
        while (ed.files.some(f => f.name === `${stem}-${i}${ext}`)) i++;
        return `${stem}-${i}${ext}`;
      }

      function validName(name) {
        name = (name || '').trim();
        if (!name) return null;
        if (!/\.\w+$/.test(name)) name += '.js';
        if (/[\\/:*?"<>|]/.test(name)) { U.toast('Faýlyň adynda \\ / : * ? " < > | belgileri bolup bilmez'); return null; }
        return name;
      }

      async function newFile() {
        const name = validName(await U.prompt('📄 Täze faýlyň ady:', uniqueName('taze.js'), { okText: 'Döret' }));
        if (!name) return;
        if (ed.files.some(f => f.name === name)) return U.toast('Şeýle atly faýl eýýäm bar');
        ed.files.push({ name, content: '' });
        open(name);
      }

      async function rename(oldName) {
        const name = validName(await U.prompt('✏️ Faýlyň täze ady:', oldName, { okText: 'Üýtget' }));
        if (!name || name === oldName) return;
        if (ed.files.some(f => f.name === name)) return U.toast('Şeýle atly faýl eýýäm bar');
        ed.files.find(f => f.name === oldName).name = name;
        ed.tabs = ed.tabs.map(t => t === oldName ? name : t);
        if (ed.active === oldName) ed.active = name;
        st.save();
        refreshChrome();
      }

      async function remove(name) {
        if (ed.files.length === 1) return U.toast('Iň soňky faýly pozup bolmaýar');
        if (!(await U.confirm(`"${name}" faýly pozular.`, { title: '🗑 Faýly pozmak', okText: 'Poz', danger: true }))) return;
        ed.files = ed.files.filter(f => f.name !== name);
        closeTab(name);
      }

      // ---------- Goýmalar ----------
      function renderTabs() {
        el.querySelector('#ideTabs').innerHTML = ed.tabs.map(n => `
          <div class="ide-tab ${n === ed.active ? 'active' : ''}" data-tab="${U.esc(n)}">
            ${ico(n)}${U.esc(n)}<button class="tab-x" data-close="${U.esc(n)}" title="Ýap">✕</button></div>`).join('');
        el.querySelectorAll('.ide-tab').forEach(t => {
          t.addEventListener('click', e => { if (!e.target.closest('.tab-x')) open(t.dataset.tab); });
          t.addEventListener('auxclick', e => { if (e.button === 1) closeTab(t.dataset.tab); });
        });
        el.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => closeTab(b.dataset.close)));
        el.querySelector('#ideCrumb').innerHTML = `📁 javascript <span class="muted">›</span> ${ico(ed.active)} ${U.esc(ed.active)}`;
      }

      function closeTab(name) {
        const i = ed.tabs.indexOf(name);
        ed.tabs = ed.tabs.filter(t => t !== name);
        if (!ed.tabs.length) ed.tabs = [ed.files[0].name];
        if (ed.active === name || !ed.files.some(f => f.name === ed.active)) {
          ed.active = ed.tabs[Math.max(0, Math.min(i, ed.tabs.length - 1))];
          load();
        }
        st.save();
        refreshChrome();
      }

      function open(name) {
        if (!ed.tabs.includes(name)) ed.tabs.push(name);
        ed.active = name;
        st.save();
        load();
        refreshChrome();
      }

      function refreshChrome() { renderTabs(); renderSide(); refreshDom(); }

      // ---------- Kody işletmek ----------
      function print(lvl, text) {
        if (logCount === 1000) {
          const d = document.createElement('div');
          d.className = 'out-line out-warn';
          d.textContent = '⚠ Çykyş gaty köp — galan setirler görkezilmeýär.';
          out.appendChild(d);
        }
        logCount++;
        if (logCount > 1000) return;
        const d = document.createElement('div');
        d.className = 'out-line out-' + lvl;
        d.textContent = ({ warn: '⚠ ', error: '✖ ', info: 'ℹ ' }[lvl] || '') + text;
        out.appendChild(d);
        out.scrollTop = out.scrollHeight;
      }

      function setRunning(on) {
        el.querySelector('#runBtn').hidden = on;
        el.querySelector('#stopBtn').hidden = !on;
        el.querySelector('#stState').textContent = on ? '⏳ Işleýär...' : '⚡ JavaScript';
      }

      // ---------- DOM rejimi ----------
      // Açyk bolsa kod Worker-de däl-de, aşakdaky "SAHYPA" penjiresindäki iframe-de işleýär.
      // .html faýllar hemişe DOM rejiminde işleýär.
      let frame = null, frameOffset = 0;
      const domOn = () => !!ed.dom || /\.html?$/i.test(ed.active);
      function setDom(on) {
        ed.dom = on;
        st.save();
        refreshDom();
      }
      function refreshDom() {
        const on = domOn();
        el.querySelector('.ide').classList.toggle('dom', on);
        const b = el.querySelector('#domBtn');
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', String(on));
      }
      function onFrameMsg(e) {
        if (!frame || e.source !== frame.contentWindow || !e.data || !e.data.__jsow) return;
        const m = e.data;
        if (m.t === 'log') print(m.lvl, m.text);
        else if (m.t === 'err') {
          if (/LOOP_GUARD/.test(m.text)) return print('error', '⛔ Sikl 3 sekuntdan köp işledi (çäksiz sikl bolmagy mümkin) we togtadyldy.');
          const line = m.line ? m.line - frameOffset : 0;
          errorLine = line > 0 && line <= ta.value.split('\n').length ? line : 0;
          print('error', m.text + (errorLine ? `   (${ed.active}: ${errorLine}-nji setir)` : ''));
          area.setErrorLine(errorLine);
        }
      }
      window.addEventListener('message', onFrameMsg);
      function runDom() {
        const page = el.querySelector('#idePage');
        const { html, offset } = buildPage(ed.active, ta.value, ed.files);
        frameOffset = offset;
        page.innerHTML = '';
        frame = document.createElement('iframe');
        frame.setAttribute('sandbox', 'allow-scripts allow-modals');
        frame.setAttribute('title', 'Sahypa (DOM)');
        frame.srcdoc = html;
        page.appendChild(frame);
        print('sys', `🌐 ${ed.active} sahypada işledilýär — wakalar (click, input ...) "SAHYPA" penjiresinde işleýär.`);
        el.querySelector('#runBtn').hidden = true;
        el.querySelector('#stopBtn').hidden = false;
        el.querySelector('#stState').textContent = '🌐 Sahypa işleýär';
      }
      function stopDom(user) {
        if (!frame) return;
        frame.remove();
        frame = null;
        el.querySelector('#idePage').innerHTML = '<div class="ide-page-hint">Sahypa togtadyldy.</div>';
        if (user) print('sys', '— Sahypa ulanyjy tarapyndan togtadyldy —');
        setRunning(false);
      }

      function stop(reason) {
        stopDom(reason === 'user');
        timers.forEach(clearTimeout);
        timers = [];
        if (!worker) return;
        worker.terminate();
        worker = null;
        const ms = Math.round(performance.now() - runStart);
        const msg = {
          done: `— Programma tamamlandy (${ms} ms) —`,
          error: '— Programma ýalňyşlyk bilen togtady —',
          user: '— Programma ulanyjy tarapyndan togtadyldy —',
          loop: '⛔ Programma 5 sekuntdan köp işledi (çäksiz sikl bolmagy mümkin) we togtadyldy.',
          long: '⏹ Programma 15 sekuntdan soň togtadyldy.'
        }[reason];
        if (msg) print(reason === 'done' ? 'sys' : reason === 'loop' ? 'error' : 'sys', msg);
        setRunning(false);
        if (reason === 'error') area.setErrorLine(errorLine);
      }

      function run() {
        stop();
        file().content = ta.value;
        st.save();
        out.innerHTML = '';
        logCount = 0;
        errorLine = 0;
        if (domOn()) return runDom();
        print('sys', `▶ ${ed.active} işledilýär...`);
        const src = PRELUDE + '\n' + ta.value + '\n;postMessage({ t: "done" }); self.__check();';
        const url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
        let syncDone = false;
        runStart = performance.now();
        setRunning(true);
        try {
          worker = new Worker(url);
        } catch (e) {
          print('error', 'Kody işledip bolmady: ' + e.message);
          setRunning(false);
          return;
        }
        worker.onmessage = e => {
          const m = e.data;
          if (m.t === 'log') print(m.lvl, m.text);
          else if (m.t === 'err') { print('error', m.text); stop('error'); }
          else if (m.t === 'done') syncDone = true;
          else if (m.t === 'idle' && syncDone) stop('done');
        };
        worker.onerror = e => {
          e.preventDefault();
          const line = e.lineno - PRELUDE_LINES;
          const text = String(e.message || 'Ýalňyşlyk').replace(/^Uncaught /, '');
          const lines = ta.value.split('\n').length;
          if (line > 0 && line <= lines) errorLine = line;
          print('error', text + (errorLine ? `   (${ed.active}: ${errorLine}-nji setir)` : ''));
          if (/\b(document|window|alert|HTMLElement)\b is not defined/.test(text)) {
            print('info', 'DOM (document, düwmeler, wakalar) bilen işlemek üçin ýokardaky 🌐 DOM düwmesini açyň.');
          }
          stop('error');
        };
        timers.push(setTimeout(() => { if (!syncDone) stop('loop'); }, 5000));
        timers.push(setTimeout(() => stop('long'), 15000));
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }

      el.querySelector('#runBtn').addEventListener('click', run);
      el.querySelector('#stopBtn').addEventListener('click', () => stop('user'));
      el.querySelector('#domBtn').addEventListener('click', () => {
        if (/\.html?$/i.test(ed.active)) return U.toast('HTML faýllar hemişe DOM rejiminde işleýär');
        stop();
        setDom(!ed.dom);
      });
      el.querySelector('#clearOut').addEventListener('click', () => { out.innerHTML = ''; logCount = 0; });
      el.querySelectorAll('[data-side]').forEach(b => b.addEventListener('click', () => { side = b.dataset.side; renderSide(); }));

      App.onLeave(() => {
        stop();
        window.removeEventListener('message', onFrameMsg);
        clearTimeout(saveTimer);
        file().content = ta.value;
        st.save();
        area.destroy();
      });

      refreshChrome();
      load();
    }
  };
})();
