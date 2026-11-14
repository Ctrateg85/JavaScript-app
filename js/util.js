// Umumy kömekçi funksiýalar
window.App = window.App || {};

App.util = {
  // HTML-e howpsuz goýmak üçin
  esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  },

  // Setirden san hash (FNV-1a) — kesgitli tötänlik üçin
  hash(...parts) {
    const s = parts.join('|');
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  },

  // Kesgitli tötänleýin san generatory (mulberry32)
  rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  },

  shuffle(arr, rnd = Math.random) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  pad(n) { return String(n).padStart(2, '0'); },

  // Ýerli senäniň açary: "2026-11-10"
  dayKey(d = App.clock.date()) {
    const x = new Date(d);
    return `${x.getFullYear()}-${App.util.pad(x.getMonth() + 1)}-${App.util.pad(x.getDate())}`;
  },

  yesterdayKey() {
    const d = App.clock.date();
    d.setDate(d.getDate() - 1);
    return App.util.dayKey(d);
  },

  // Hepdäniň başy — duşenbe 00:00 (ýerli wagt)
  weekStart(d = App.clock.date()) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    const day = (x.getDay() + 6) % 7; // duşenbe = 0
    x.setDate(x.getDate() - day);
    return x.getTime();
  },

  nextWeekStart(ws) {
    const d = new Date(ws);
    d.setDate(d.getDate() + 7);
    return d.getTime();
  },

  fmtDate(ts) {
    const d = new Date(ts);
    return `${App.util.pad(d.getDate())}.${App.util.pad(d.getMonth() + 1)}.${d.getFullYear()}`;
  },

  fmtDuration(ms) {
    if (ms <= 0) return '0 min';
    const min = Math.floor(ms / 60000);
    const d = Math.floor(min / 1440), h = Math.floor((min % 1440) / 60), m = min % 60;
    const parts = [];
    if (d) parts.push(d + ' gün');
    if (h) parts.push(h + ' sag');
    if (!d && (m || !h)) parts.push(m + ' min');
    return parts.join(' ');
  },

  fmtSeconds(sec) {
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
    return h ? `${h} sag ${m} min` : `${m} min`;
  },

  // Jogaby deňeşdirmek üçin arassalamak
  normalize(s) {
    return String(s).trim().replace(/\s+/g, ' ').replace(/;$/, '').replace(/"/g, "'");
  },

  // Ulanyja görkezilýän kod mysallaryndan setiriň ahyryndaky ';' belgilerini aýyrmak (Standard stili).
  //  * setirleriň, şablonlaryň, teswirleriň we regulýar aňlatmalaryň içine degmeýär;
  //  * for (...;...;...) ýaýynyň içindäki we bir setirdäki birnäçe buýrugy bölýän ';' galýar;
  //  * indiki setir ( [ ` + - / bilen başlasa (ASI duzagy), ';' şol setiriň başyna geçirilýär.
  noSemi(src) {
    src = String(src);
    if (!src.includes(';')) return src;
    const n = src.length, semis = [], brace = [];
    const REGEX_PREV = '(,=:[!&|?{};+-*%<>~^';
    const REGEX_WORDS = ['return', 'typeof', 'case', 'do', 'else', 'in', 'of', 'void', 'throw', 'new', 'delete', 'yield', 'await'];
    let state = 'code', paren = 0, prev = null, word = '';
    for (let i = 0; i < n; i++) {
      const c = src[i], nx = src[i + 1];
      if (state === 'code') {
        if (c === '/' && nx === '/') { state = 'line'; i++; continue; }
        if (c === '/' && nx === '*') { state = 'block'; i++; continue; }
        if (c === "'") state = 'sq';
        else if (c === '"') state = 'dq';
        else if (c === '`') state = 'tpl';
        else if (c === '/' && (prev === null || REGEX_PREV.includes(prev) || REGEX_WORDS.includes(word))) state = 'regex';
        else if (c === '{') { brace.push(['{', paren]); paren = 0; }
        else if (c === '}') {
          const top = brace.pop();
          if (top) paren = top[1];
          if (top && top[0] === 'tpl') { state = 'tpl'; continue; }
        }
        else if (c === '(') paren++;
        else if (c === ')') paren = Math.max(0, paren - 1);
        else if (c === ';' && paren === 0) semis.push(i);
        if (/\s/.test(c)) continue;
        if (/[\w$]/.test(c)) {
          let j = i;
          while (j < n && /[\w$]/.test(src[j])) j++;
          word = src.slice(i, j); prev = src[j - 1]; i = j - 1;
        } else if (state === 'code') { prev = c; word = ''; }
        continue;
      }
      if (state === 'line') { if (c === '\n') state = 'code'; continue; }
      if (state === 'block') { if (c === '*' && nx === '/') { state = 'code'; i++; } continue; }
      if (state === 'sq' || state === 'dq') {
        if (c === '\\') { i++; continue; }
        if ((state === 'sq' && c === "'") || (state === 'dq' && c === '"')) { state = 'code'; prev = c; word = ''; }
        continue;
      }
      if (state === 'tpl') {
        if (c === '\\') { i++; continue; }
        if (c === '`') { state = 'code'; prev = '`'; word = ''; continue; }
        if (c === '$' && nx === '{') { brace.push(['tpl', paren]); paren = 0; state = 'code'; prev = '{'; word = ''; i++; }
        continue;
      }
      if (state === 'regex') {
        if (c === '\\') { i++; continue; }
        if (c === '[') state = 'rclass';
        else if (c === '/') { state = 'code'; prev = 'x'; word = ''; while (i + 1 < n && /[a-z]/i.test(src[i + 1])) i++; }
        continue;
      }
      if (state === 'rclass') {
        if (c === '\\') { i++; continue; }
        if (c === ']') state = 'regex';
      }
    }
    // Indiki manyly simwol (boşluklary we teswirleri geçip)
    const nextCode = from => {
      let i = from;
      while (i < n) {
        if (/\s/.test(src[i])) { i++; continue; }
        if (src.startsWith('//', i)) { const j = src.indexOf('\n', i); i = j < 0 ? n : j + 1; continue; }
        if (src.startsWith('/*', i)) { const j = src.indexOf('*/', i + 2); i = j < 0 ? n : j + 2; continue; }
        return i;
      }
      return -1;
    };
    const remove = new Set(), prefix = new Set();
    for (const idx of semis) {
      let j = idx + 1;
      while (j < n && (src[j] === ' ' || src[j] === '\t')) j++;
      if (j < n && src[j] !== '\n' && src[j] !== '\r' && !src.startsWith('//', j)) continue;   // setiriň ortasyndaky ';' galýar
      remove.add(idx);
      const k = nextCode(idx + 1);
      if (k >= 0 && '([`+-/'.includes(src[k]) && !src.startsWith('//', k)) prefix.add(k);
    }
    let out = '';
    for (let i = 0; i < n; i++) {
      if (prefix.has(i)) out += ';';
      if (!remove.has(i)) out += src[i];
    }
    // Aýrylan ';' bilen // teswiriň arasynda artykmaç boşluk galmaz ýaly
    return out.replace(/[ \t]+(?=\n|$)/g, '');
  },

  // ---------- Reňkler ----------
  hexToRgb(hex) {
    let h = String(hex).trim().replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h.slice(0, 6), 16);
    return Number.isNaN(n) ? null : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  },

  rgbToHex(rgb) {
    return '#' + rgb.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  },

  // Iki reňki garyşdyrmak: t = 0 → a, t = 1 → b
  mixColor(a, b, t) {
    const x = App.util.hexToRgb(a), y = App.util.hexToRgb(b);
    if (!x || !y) return a;
    return App.util.rgbToHex(x.map((v, i) => v + (y[i] - v) * t));
  },

  // Iki reňkiň kontrast gatnaşygy (WCAG formulasy): 1 — birmeňzeş, 21 — gara/ak
  contrast(a, b) {
    const lum = hex => {
      const c = App.util.hexToRgb(hex) || [0, 0, 0];
      const [r, g, bl] = c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
      return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
    };
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
  },

  // Reňk açyk bolsa true (onuň üstündäki tekst gara bolmaly)
  isLight(hex) {
    const c = App.util.hexToRgb(hex);
    return c ? (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) > 150 : false;
  },

  // Gysga ses effektleri (Web Audio API). type: 'ok' | 'bad' | 'win' | 'tick'
  sfx(type) {
    const st = App.store && App.store.state;
    if (!st || !st.settings.sound) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      App.util._audio = App.util._audio || new Ctx();
      const ctx = App.util._audio, now = ctx.currentTime;
      const notes = { ok: [660, 880], bad: [300, 200], win: [523, 659, 784, 1047], tick: [1000] }[type] || [440];
      notes.forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type === 'bad' ? 'sawtooth' : 'sine';
        o.frequency.value = f;
        const t = now + i * 0.1;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(type === 'tick' ? 0.05 : 0.12, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
        o.connect(g).connect(ctx.destination);
        o.start(t);
        o.stop(t + 0.2);
      });
    } catch (e) { /* ses çalyp bolmady */ }
  },

  // Elementiň üstünde ýokary galyp ýiten "+10" / "−1" belgisini görkezmek
  popDelta(target, delta, suffix = '') {
    if (!target || !delta) return;
    const pop = document.createElement('span');
    pop.className = 'delta-pop ' + (delta > 0 ? 'up' : 'down');
    pop.textContent = (delta > 0 ? '+' : '−') + Math.abs(delta) + suffix;
    target.classList.add('has-pop', delta > 0 ? 'flash-up' : 'flash-down');
    target.appendChild(pop);
    setTimeout(() => {
      pop.remove();
      target.classList.remove('flash-up', 'flash-down');
    }, 1800);
  },

  // Programmanyň öz tassyklama / girizme penjiresi (brauzeriň confirm / prompt ýerine).
  // Promise gaýtarýar: confirm → true/false, prompt → girizilen tekst ýa-da null.
  dialog({ title = 'Tassyklaň', text = '', input = null, okText = 'Bolýar', cancelText = 'Ýatyr', danger = false } = {}) {
    return new Promise(resolve => {
      const back = document.createElement('div');
      back.className = 'modal-back';
      back.innerHTML = `
        <div class="modal card" role="dialog" aria-modal="true">
          <h3>${App.util.esc(title)}</h3>
          ${text ? `<p>${App.util.esc(text)}</p>` : ''}
          ${input !== null ? `<input class="dlg-input" value="${App.util.esc(input)}">` : ''}
          <div class="row gap mt" style="justify-content:flex-end">
            <button class="btn" data-act="no">${App.util.esc(cancelText)}</button>
            <button class="btn ${danger ? 'danger' : 'primary'}" data-act="ok">${App.util.esc(okText)}</button>
          </div>
        </div>`;
      document.body.appendChild(back);
      const inp = back.querySelector('.dlg-input');
      const close = ok => {
        back.remove();
        document.removeEventListener('keydown', onKey, true);
        resolve(input !== null ? (ok ? inp.value : null) : ok);
      };
      const onKey = e => {
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(false); }
        if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); close(true); }
      };
      document.addEventListener('keydown', onKey, true);
      back.addEventListener('click', e => {
        if (e.target === back) close(false);
        const act = e.target.closest('[data-act]');
        if (act) close(act.dataset.act === 'ok');
      });
      (inp || back.querySelector('[data-act="ok"]')).focus();
      if (inp) inp.select();
    });
  },
  confirm(text, opts = {}) { return App.util.dialog({ text, ...opts }); },
  prompt(text, value = '', opts = {}) { return App.util.dialog({ title: text, input: value, ...opts }); },

  toast(msg) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add('show'), 10);
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 3000);
  }
};
