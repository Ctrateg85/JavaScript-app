// Programmanyň ýagdaýy (state), ballaryň düzgünleri we saklamak
window.App = window.App || {};

// Ballaryň hasaplanyş düzgünleri — ähli san bahalary şu ýerde
App.RULES = {
  // Derejäni tamamlamak üçin XP ligaňa bagly: personas.js → LEAGUES[].xp [iň az, iň köp].
  // Ilkinji synanyşykda dogry jogaplaryň paýyna görä şol aralykdan berilýär.
  XP_PERFECT_BONUS: 5,    // ýalňyşsyz tamamlanan dereje üçin
  REPLAY_FACTOR: 0.5,     // tamamlanan derejäni gaýtadan geçende XP koeffisiýenti
  REPLAY_DAILY: 3,        // şol bir derejäni gaýtalamak üçin günde iň köp näçe gezek XP berilýär
  STREAK_BONUS_MAX: 7,    // günüň ilkinji sapagy üçin yzygiderlik bonusy (iň köp)
  LEVEL_UP_XP: 50,        // her täze ulanyjy derejesi üçin baýrak
  LEVEL_MILESTONE_EVERY: 5,   // her 5-nji derejede (5, 10, 15 ...) goşmaça baýrak
  LEVEL_MILESTONE_XP: 100,
  HEARTS_MAX: 15,
  HEART_REGEN_MIN: 10,    // 1 jan näçe minutda dikelýär
  DUEL_WIN_XP: 15,
  DUEL_DRAW_XP: 5,
  DUEL_LOSS_XP: 2,
  // Duelde ýeňiş / utulyş üçin reýting botuň güýjüne bagly: personas.js → DUEL_BOTS[].win / .loss
  DUEL_DRAW_RATING: 0,    // deňme-deň
  DUEL_START_RATING: 0,
  DUEL_ROUNDS: 7,
  DUEL_ROUND_SEC: 15,     // okamak wagtyndan soň jogap bermek üçin wagt
  DUEL_BASE_POINTS: 10,
  LEAGUE_GROUP_SIZE: 15,
  LEAGUE_BOT_HOUR_XP: [15, 65],     // reýtingdäki personaž okan sagadynda näçe XP gazanýar
  LEAGUE_BOT_DAY_MAX: 700,          // personažyň bir günde gazanyp biljek iň köp XP-si
  LEAGUE_BOT_EVERY_H: 2.5,          // personaž näçe sagatdan bir gezek XP gazanyp bilýär
  LEAGUE_BOT_XP_MUL: 1.2,           // personažyň hepdelik XP-si: hasaplanan XP + onuň 0.2 bölegi (×1.2)
  LEAGUE_PROMOTE: 3,
  LEAGUE_DEMOTE: 3
};

// Ýalňyşlyk "Ýalňyşlyklar we maslahatlar" bölüminde görünmegi üçin iň az näçe gezek gaýtalanmaly
App.MISTAKE_MIN = 5;

// Ulanyjynyň öz reňkleri üçin üýtgedilýän CSS üýtgeýänleri
App.COLOR_VARS = ['--primary', '--primary-dark', '--primary-light', '--on-primary', '--ok-bg', '--ok-text', '--icon',
  '--accent', '--accent-dark', '--bg', '--bg-2', '--card', '--card-2', '--hover', '--border', '--text', '--muted',
  '--ide-bg', '--code-bg', '--ide-side', '--ide-tabs', '--ide-tab', '--ide-cur'];

// Duel reýtingine görä at (dereje)
App.DUEL_RANKS = [
  { min: 0,   icon: '🌱', title: 'Öwreniji programmist' },
  { min: 200, icon: '💻', title: 'FullStack' },
  { min: 500, icon: '🕶️', title: 'Haker' },
  { min: 800, icon: '💀', title: 'Kraker' }
];
App.duelRank = function (rating) {
  const ranks = App.DUEL_RANKS;
  const i = ranks.reduce((acc, r, k) => rating >= r.min ? k : acc, 0);
  const next = ranks[i + 1];
  return { ...ranks[i], next, pct: next ? Math.round(((rating - ranks[i].min) / (next.min - ranks[i].min)) * 100) : 100 };
};

// n-nji derejä ýetmek üçin gerek bolan jemi XP.
// Her geçiş: 1→2 — 150 XP, 2→3 — 250, 3→4 — 350, 4→5 — 450, 5→6 — 550 (köne bahalaryň iki essesi),
// soňra hem her dereje öňkiden 100 XP köp talap edýär: 650, 750, ...
// Jemi: 150 (2-nji), 400, 750, 1200, 1750, 2400, 3150, ...
App.xpForLevel = function (n) {
  return 150 * (n - 1) + 50 * (n - 1) * (n - 2);
};

// Ulanyjy derejesi umumy XP-den
App.levelInfo = function (xp) {
  let level = 1;
  while (xp >= App.xpForLevel(level + 1)) level++;
  const cur = App.xpForLevel(level);
  const next = App.xpForLevel(level + 1);
  const titles = ['Täze başlaýan', 'Öwrenýän', 'Höwesjeň', 'Bilermen', 'Tejribeli', 'Hünärmen', 'Ussat', 'Akademik'];
  const title = titles[Math.min(titles.length - 1, Math.floor((level - 1) / 2))];
  return { level, cur, next, title, pct: Math.floor(((xp - cur) / (next - cur)) * 100) };
};

// n-nji derejä ýetilende berilýän baýraklar: [{ icon, text, xp }]
App.levelRewards = function (n) {
  const R = App.RULES;
  const list = [{ icon: '⬆️', text: 'Täze dereje', xp: R.LEVEL_UP_XP }];
  if (n % R.LEVEL_MILESTONE_EVERY === 0) list.push({ icon: '🏆', text: `Her ${R.LEVEL_MILESTONE_EVERY}-nji dereje üçin goşmaça`, xp: R.LEVEL_MILESTONE_XP });
  return list;
};

// Ähli derejeleri tekiz sanaw görnüşinde almak
App.allLevels = function () {
  const out = [];
  window.LESSONS.forEach((unit, ui) => unit.levels.forEach((lvl, li) => {
    out.push({ ...lvl, unit, unitIndex: ui, levelIndex: li, order: out.length });
  }));
  return out;
};

App.findLevel = function (id) {
  return App.allLevels().find(l => l.id === id);
};

// Gazanylýan nyşanlar (achievements)
App.ACHIEVEMENTS = [
  { id: 'first', icon: '🌱', title: 'Ilkinji ädim', desc: 'Ilkinji derejäni tamamla', test: s => s.stats.lessonsDone >= 1 },
  { id: 'unit', icon: '📦', title: 'Bölüm tamam', desc: 'Bir bölümiň ähli derejelerini tamamla', test: s => window.LESSONS.some(u => u.levels.every(l => s.progress[l.id])) },
  { id: 'perfect', icon: '💯', title: 'Kämil', desc: 'Derejäni ýalňyşsyz tamamla', test: s => s.stats.perfectLessons >= 1 },
  { id: 'perfect10', icon: '🎯', title: 'Mergen', desc: '10 derejäni ýalňyşsyz tamamla', test: s => s.stats.perfectLessons >= 10 },
  { id: 'streak3', icon: '🔥', title: '3 gün', desc: '3 gün yzygiderli öwren', test: s => s.bestStreak >= 3 },
  { id: 'streak7', icon: '🌋', title: 'Hepde', desc: '7 gün yzygiderli öwren', test: s => s.bestStreak >= 7 },
  { id: 'xp500', icon: '⭐', title: '500 XP', desc: 'Jemi 500 XP ýygna', test: s => s.xp >= 500 },
  { id: 'xp2000', icon: '🌟', title: '2000 XP', desc: 'Jemi 2000 XP ýygna', test: s => s.xp >= 2000 },
  { id: 'duel1', icon: '⚔️', title: 'Ilkinji ýeňiş', desc: 'Duelde boty ýeň', test: s => s.duel.wins >= 1 },
  { id: 'duelMaster', icon: '🤖', title: 'Ussady ýeňdi', desc: 'Iň güýçli boty ýeň', test: s => s.duel.history.some(h => h.botId === 'expert' && h.result === 'win') },
  { id: 'gold', icon: '🥇', title: 'FullStack', desc: 'FullStack ligasyna çyk', test: s => s.league && s.league.index >= 2 },
  { id: 'solver', icon: '🧪', title: 'Çözüji', desc: 'Ilkinji meseläni kod ýazyp çöz', test: s => Object.keys(s.practice.solved).length >= 1 },
  { id: 'solver10', icon: '🧑‍💻', title: 'Programmist', desc: '10 meseläni çöz', test: s => Object.keys(s.practice.solved).length >= 10 },
  { id: 'all', icon: '🎓', title: 'Uçurym', desc: 'Ähli derejeleri tamamla', test: s => App.allLevels().every(l => s.progress[l.id]) }
];

(function () {
  const KEY = 'jsOwren_state_v1';
  const R = App.RULES;
  const U = App.util;

  function defaults() {
    return {
      version: 1,
      user: { name: '', avatar: '🦊', photo: null, createdAt: App.clock.now() },
      xp: 0,
      weeklyXp: 0,
      hearts: R.HEARTS_MAX,
      heartsUpdatedAt: App.clock.now(),
      streak: 0,
      bestStreak: 0,
      lastActiveDay: null,
      progress: {},   // derejeId -> { stars, bestMistakes, completedAt, plays }
      stats: { answered: 0, correct: 0, lessonsDone: 0, perfectLessons: 0, timeSpentSec: 0 },
      daily: {},      // gün -> XP
      duel: { rating: R.DUEL_START_RATING, wins: 0, losses: 0, draws: 0, history: [], v2: true },
      league: null,
      achievements: {},
      book: { lastChapter: null },
      notices: [],
      // Ulanyjy derejeleri üçin baýraklar: iň soňky baýrak berlen dereje we baýraklaryň taryhy
      levelRewarded: 1,
      levelHistory: [],   // [{ level, xp, at }]
      settings: {
        lang: 'tk',           // interfeýsiň dili: 'tk' | 'ru' | 'en' (js/i18n.js)
        theme: 'dark',       // 'dark' — gara-ýaşyl, 'neon' — neon, 'sunset' — gün ýaşmasy, 'ocean' — okean, 'gray' — çal
        font: 'medium',       // 'small' | 'medium' | 'large'
        anim: true,           // animasiýalar
        sound: true,          // ses effektleri
        explain: true,        // jogapdan soň düşündirişi görkezmek
        duelAutoNext: true,   // duelde indiki soraga özbaşdak geçmek
        colors: {}            // ulanyjynyň öz reňkleri (temanyň üstünden): primary, icon, accent, bg, card, text, code
      },
      ui: { gameOpen: true, statsOpen: true, badgesOpen: true, duelHistOpen: true },   // profildäki açylyp-ýapylýan bölekler
      // Mysal işlemek: çözülen meseleler (id → wagt), her meseläniň kody,
      // çözgüdi XP bilen satyn alnan meseleler (id → wagt)
      practice: { solved: {}, code: {}, bought: {}, penalty: {} },   // penalty: id → jemi aýrylan XP
      // Ýalňyşlyklaryň statistikasy (profildäki maslahatlar üçin):
      //   units: bölüm id → { answered, wrong } (sapaklar we duel),
      //   sections: mesele bölümi → şowsuz barlaglaryň sany, recent: soňky ýalňyşlyklar,
      //   byQ: şol bir ýalňyşlyk (sorag ýa-da mesele) → näçe gezek goýberilendigi
      mistakes: { units: {}, sections: {}, recent: [], byQ: {} },
      // Kod redaktory: faýllar we açyk goýmalar
      editor: { files: null, active: null, tabs: [] }
    };
  }

  App.store = {
    state: null,

    load() {
      let s = null;
      try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
      const d = defaults();
      if (s && typeof s === 'object') {
        // Baýrak ulgamyndan öň ýetilen derejeler üçin baýrak berilmeýär
        if (s.levelRewarded === undefined) s.levelRewarded = App.levelInfo(s.xp || 0).level;
        // Täze meýdanlar goşulsa-da köne ýagdaý işlär ýaly birleşdirýäris
        // Köne duel reýtingi 1000-den başlaýardy, täze ulgamda 0-dan: gazanylan tapawut saklanýar
        if (s.duel && !s.duel.v2) s.duel = { ...s.duel, rating: Math.max(0, (s.duel.rating || 1000) - 1000), v2: true };
        s = { ...d, ...s, user: { ...d.user, ...s.user }, stats: { ...d.stats, ...s.stats }, duel: { ...d.duel, ...s.duel }, book: { ...d.book, ...s.book },
          settings: { ...d.settings, ...s.settings, colors: { ...((s.settings || {}).colors || {}) } }, ui: { ...d.ui, ...s.ui }, editor: { ...d.editor, ...s.editor },
          practice: { ...d.practice, ...s.practice }, mistakes: { ...d.mistakes, ...s.mistakes } };
      } else {
        s = d;
      }
      this.state = s;
      this.applySettings();
      this.applyAbandonedDuel();
      this.refresh();
    },

    // Görnüş sazlamalaryny sahypa ulanmak (tema, şrift, animasiýa)
    applySettings() {
      const set = this.state.settings, root = document.documentElement;
      if (set.theme === 'light') set.theme = 'gray';   // köne "ýagty" tema "çal" bilen çalşyldy
      root.dataset.theme = set.theme;
      root.dataset.font = set.font;
      root.dataset.anim = set.anim ? 'on' : 'off';
      this.applyColors();
      if (App.fitHeader) App.fitHeader();   // şrift üýtgände ýokarky panel täzeden sygdyrylýar
    },

    // Ulanyjynyň öz reňkleri: CSS üýtgeýänleri sahypanyň köküne goýulýar (temadaky reňkleriň ýerine).
    // Esasy reňkden goşmaça äheňler (has garaňky, has açyk, fon) awtomatik hasaplanýar.
    applyColors() {
      const U = App.util, root = document.documentElement, c = this.state.settings.colors || {};
      App.COLOR_VARS.forEach(v => root.style.removeProperty(v));
      delete root.dataset.customBg;
      const set = (k, v) => root.style.setProperty(k, v);
      const rgba = (hex, a) => { const x = U.hexToRgb(hex); return `rgba(${x[0]}, ${x[1]}, ${x[2]}, ${a})`; };
      const text = c.text || getComputedStyle(root).getPropertyValue('--text').trim() || '#ececec';
      const dark = !U.isLight(c.bg || getComputedStyle(root).getPropertyValue('--bg').trim() || '#121212');
      if (c.primary) {
        set('--primary', c.primary);
        set('--primary-dark', U.mixColor(c.primary, '#000000', 0.25));
        set('--primary-light', U.mixColor(c.primary, '#ffffff', 0.25));
        set('--on-primary', U.isLight(c.primary) ? '#0a0a0a' : '#ffffff');
        set('--ok-bg', rgba(c.primary, 0.15));
        set('--ok-text', U.mixColor(c.primary, dark ? '#ffffff' : '#000000', 0.3));
      }
      if (c.icon) set('--icon', c.icon);
      if (c.accent) {
        set('--accent', c.accent);
        set('--accent-dark', U.mixColor(c.accent, '#000000', 0.3));
      }
      if (c.bg) {
        set('--bg', c.bg);
        set('--bg-2', U.mixColor(c.bg, dark ? '#000000' : '#ffffff', 0.35));
        root.dataset.customBg = '1';
      }
      if (c.card) {
        set('--card', c.card);
        set('--card-2', U.mixColor(c.card, text, 0.05));
        set('--hover', U.mixColor(c.card, text, 0.1));
        set('--border', U.mixColor(c.card, text, 0.16));
      }
      if (c.text) {
        set('--text', c.text);
        set('--muted', U.mixColor(c.text, c.bg || (dark ? '#121212' : '#ffffff'), 0.4));
      }
      if (c.code) {
        set('--ide-bg', c.code);
        set('--code-bg', c.code);
        set('--ide-side', U.mixColor(c.code, '#ffffff', 0.04));
        set('--ide-tabs', U.mixColor(c.code, '#ffffff', 0.04));
        set('--ide-tab', U.mixColor(c.code, '#ffffff', 0.08));
        set('--ide-cur', U.mixColor(c.code, '#ffffff', 0.05));
      }
    },

    // Ösüşi JSON faýl görnüşinde göçürip almak we yzyna ýüklemek
    // Eksport: ýagdaý + ýüklenen kitaplar (__books: data URL görnüşinde), bir JSON faýlynda
    async exportJson() {
      const data = { ...this.state };
      try {
        const books = await App.books.all();
        data.__books = await Promise.all(books.map(b => new Promise(res => {
          const r = new FileReader();
          r.onload = () => res({ name: b.name, type: b.type, added: b.added, data: r.result });
          r.onerror = () => res(null);
          r.readAsDataURL(b.blob);
        }))).then(list => list.filter(Boolean));
      } catch (e) { /* kitaplary okap bolmady — diňe ýagdaý saklanýar */ }
      return JSON.stringify(data);
    },

    // Import: ýagdaýy dikeltmek; faýlda kitaplar bar bolsa, olary hem kitaphana goşmak.
    // Gaýtarýar: dikeldilen kitaplaryň sany.
    async importJson(text) {
      const s = JSON.parse(text);
      if (!s || typeof s !== 'object' || !s.user || typeof s.xp !== 'number') throw new Error('Nädogry faýl');
      const books = Array.isArray(s.__books) ? s.__books : [];
      delete s.__books;
      localStorage.setItem(KEY, JSON.stringify(s));
      this.load();
      let restored = 0;
      const have = new Set((await App.books.all().catch(() => [])).map(b => b.name + '|' + b.added));
      for (const b of books) {
        if (have.has(b.name + '|' + b.added)) continue;
        const blob = await (await fetch(b.data)).blob();
        await App.books.add(new File([blob], b.name, { type: b.type }));
        restored++;
      }
      return restored;
    },

    // Wagt bilen baglanyşykly ýagdaýlary täzelemek (janlar, yzygiderlik, hepdelik liga)
    refresh() {
      this.regenHearts();
      this.checkStreakBreak();
      this.checkDuelHistoryWeek();
      App.rating.ensureWeek(this.state);
      this.save();
    },

    save() {
      try { localStorage.setItem(KEY, JSON.stringify(this.state)); } catch (e) { /* saklap bolmady */ }
      App.clock.save();
    },

    reset() {
      try { localStorage.removeItem(KEY); } catch (e) { /* */ }
      const settings = this.state ? this.state.settings : null;
      this.state = defaults();
      if (settings) this.state.settings = settings;   // sazlamalar pozulmaýar
      App.rating.ensureWeek(this.state);
      this.save();
    },

    // Programma duel wagty ýapylan bolsa: duel utulyş hökmünde hasaplanýar
    applyAbandonedDuel() {
      const d = this.state.duel, a = d.active;
      if (!a) return;
      delete d.active;
      const bot = (window.DUEL_BOTS || []).find(b => b.id === a.botId);
      if (!bot) return;
      const loss = bot.loss[0] + Math.floor(Math.random() * (bot.loss[1] - bot.loss[0] + 1));
      const delta = -Math.min(loss, d.rating);
      d.rating += delta;
      d.losses++;
      d.history.unshift({ at: a.at, botId: bot.id, botName: bot.name, botAvatar: bot.avatar, my: 0, bot: 0, result: 'loss', delta });
      this.pushNotice(`⚔️ ${bot.name} bilen duel tamamlanman galdy (programma ýapyldy) — utulyş hasaplandy: ${delta} reýting.`);
    },

    // "Soňky duellar" taryhy her hepde (duşenbe 00:00) arassalanýar.
    // Ýeňiş/utulyş sanlary we reýting saklanýar. historyWeek ýok bolsa (köne ýagdaý) taryh şu wagt arassalanýar.
    checkDuelHistoryWeek() {
      const d = this.state.duel, ws = U.weekStart();
      if (d.historyWeek !== ws) {
        d.history = [];
        d.historyWeek = ws;
      }
    },

    // ---------- Janlar ----------
    regenHearts() {
      const s = this.state, now = App.clock.now(), per = R.HEART_REGEN_MIN * 60000;
      if (s.hearts >= R.HEARTS_MAX) { s.hearts = R.HEARTS_MAX; s.heartsUpdatedAt = now; return; }
      // Kompýuteriň sagady öňe süýşürilen wagty ýazylan bahalar (internet wagty bilen düzedilenden soň) geljekde galmaz ýaly
      if (s.heartsUpdatedAt > now) s.heartsUpdatedAt = now;
      const n =Math.floor((now - s.heartsUpdatedAt) / per);
      if (n > 0) {
        s.hearts = Math.min(R.HEARTS_MAX, s.hearts + n);
        s.heartsUpdatedAt = s.hearts >= R.HEARTS_MAX ? now : s.heartsUpdatedAt + n * per;
      }
    },

    nextHeartIn() {
      const s = this.state;
      if (s.hearts >= R.HEARTS_MAX) return 0;
      return s.heartsUpdatedAt + R.HEART_REGEN_MIN * 60000 - App.clock.now();
    },

    loseHeart() {
      this.regenHearts();
      const s = this.state;
      if (s.hearts >= R.HEARTS_MAX) s.heartsUpdatedAt = App.clock.now();
      s.hearts = Math.max(0, s.hearts - 1);
      this.save();
    },

    gainHeart(n = 1) {
      const s = this.state;
      s.hearts = Math.min(R.HEARTS_MAX, s.hearts + n);
      if (s.hearts >= R.HEARTS_MAX) s.heartsUpdatedAt = App.clock.now();
      this.save();
    },

    // ---------- XP we yzygiderlik ----------
    isFirstActivityToday() {
      return this.state.lastActiveDay !== U.dayKey();
    },

    // Şu gün ilkinji gezek iş edilende berilýän bonus
    streakBonusIfFirstToday() {
      if (!this.isFirstActivityToday()) return 0;
      const s = this.state;
      const nextStreak = s.lastActiveDay === U.yesterdayKey() ? s.streak + 1 : 1;
      return Math.min(nextStreak, R.STREAK_BONUS_MAX);
    },

    addXp(amount) {
      const s = this.state, today = U.dayKey();
      const give = n => {
        s.xp += n;
        s.weeklyXp += n;
        s.daily[today] = (s.daily[today] || 0) + n;
      };
      give(amount);
      // Täze derejeler üçin baýraklar. Baýrak XP-si hem täze derejä çykaryp biler, şonuň üçin sikl.
      // Her dereje üçin baýrak diňe bir gezek berilýär (XP aýrylyp, gaýtadan gazanylsa-da).
      const gained = [];
      while (App.levelInfo(s.xp).level > s.levelRewarded) {
        const level = ++s.levelRewarded;
        const rewards = App.levelRewards(level);
        const xp = rewards.reduce((a, r) => a + r.xp, 0);
        give(xp);
        gained.push({ level, rewards, xp });
        s.levelHistory.unshift({ level, xp, at: App.clock.now() });
      }
      s.levelHistory = s.levelHistory.slice(0, 50);
      this.touchStreak();
      this.checkAchievements();
      this.save();
      // Dereje ýokarlananda gutlag penjiresi
      if (gained.length) {
        U.sfx('win');
        App.showLevelUp(gained);
      }
    },

    // XP aýyrmak (jerime): XP 0-dan aşak düşmeýär. Aýrylan hakyky mukdary gaýtarýar.
    // Gündelik işjeňlik grafigi üçin şu günüň XP-sinden hem aýrylýar.
    removeXp(amount) {
      const s = this.state, today = U.dayKey();
      const real = Math.min(amount, s.xp);
      s.xp -= real;
      s.weeklyXp = Math.max(0, s.weeklyXp - amount);
      s.daily[today] = Math.max(0, (s.daily[today] || 0) - real);
      this.save();
      return real;
    },

    // Tamamlanan derejäni gaýtalamak üçin XP: şol bir dereje üçin günde iň köp REPLAY_DAILY gezek
    replayAllowed(levelId) {
      const r = this.state.replays || (this.state.replays = {});
      const today = U.dayKey();
      if (r.day !== today) { r.day = today; r.count = {}; }
      return (r.count[levelId] || 0) < App.RULES.REPLAY_DAILY;
    },
    countReplay(levelId) {
      const r = this.state.replays;
      r.count[levelId] = (r.count[levelId] || 0) + 1;
    },

    // Jogaby ýazga almak: bölüm boýunça statistika we soňky ýalňyşlyklar
    recordAnswer(unitId, ok, info) {
      const m = this.state.mistakes;
      const u = m.units[unitId] || (m.units[unitId] = { answered: 0, wrong: 0 });
      u.answered++;
      if (!ok) {
        u.wrong++;
        m.recent.unshift({ at: App.clock.now(), unit: unitId, ...info });
        m.recent = m.recent.slice(0, 20);
        this.countMistake('q:' + info.q + '|' + (info.code || ''), { unit: unitId, ...info });
      }
    },

    recordPracticeFail(section, title) {
      const m = this.state.mistakes;
      m.sections[section] = (m.sections[section] || 0) + 1;
      m.recent.unshift({ at: App.clock.now(), where: 'practice', section, q: title });
      m.recent = m.recent.slice(0, 20);
      this.countMistake('p:' + title, { where: 'practice', section, q: title });
    },

    // Şol bir ýalňyşlygyň näçe gezek gaýtalanandygyny sanamak
    countMistake(key, info) {
      const m = this.state.mistakes;
      if (!m.byQ) m.byQ = {};
      const e = m.byQ[key] || (m.byQ[key] = { ...info, count: 0 });
      e.count++;
      e.last = App.clock.now();
      e.where = info.where;
      // Ýazgylar köpelse, iň az gaýtalananlaryny aýyrýarys
      const keys = Object.keys(m.byQ);
      if (keys.length > 300) {
        keys.sort((a, b) => m.byQ[a].count - m.byQ[b].count || m.byQ[a].last - m.byQ[b].last)
          .slice(0, keys.length - 300).forEach(k => delete m.byQ[k]);
      }
    },

    touchStreak() {
      const s = this.state, today = U.dayKey();
      if (s.lastActiveDay === today) return;
      s.streak = s.lastActiveDay === U.yesterdayKey() ? s.streak + 1 : 1;
      s.bestStreak = Math.max(s.bestStreak, s.streak);
      s.lastActiveDay = today;
    },

    checkStreakBreak() {
      const s = this.state;
      if (s.lastActiveDay && s.lastActiveDay !== U.dayKey() && s.lastActiveDay !== U.yesterdayKey()) {
        s.streak = 0;
      }
    },

    // ---------- Derejeler ----------
    isUnlocked(levelId) {
      const all = App.allLevels();
      const i = all.findIndex(l => l.id === levelId);
      if (i <= 0) return i === 0;
      return !!this.state.progress[all[i - 1].id];
    },

    currentLevel() {
      return App.allLevels().find(l => !this.state.progress[l.id]) || null;
    },

    // ---------- Nyşanlar ----------
    checkAchievements() {
      const s = this.state;
      App.ACHIEVEMENTS.forEach(a => {
        if (!s.achievements[a.id] && a.test(s)) {
          s.achievements[a.id] = App.clock.now();
          U.toast(`${a.icon} Täze nyşan: ${a.title}`);
        }
      });
    },

    pushNotice(text) {
      this.state.notices.push({ text, at: App.clock.now() });
    }
  };
})();
