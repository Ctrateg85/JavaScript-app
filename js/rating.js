// Hepdelik liga (reýting) ulgamy
//
// Her hepde (duşenbe 00:00 — ýekşenbe 23:59) ulanyjy 14 personaž bilen bir topara düşýär.
// Personažlaryň XP-si wagta görä kesgitli (deterministik) tötänlik bilen hasaplanýar:
// hepdäniň her sagadynda personaž "sapak geçip" biler, şonda XP gazanýar.
// Hepdäniň ahyrynda ilkinji 3 orun indiki liga geçýär, soňky 3 orun aşak düşýär.
window.App = window.App || {};

App.rating = (function () {
  const U = App.util;
  const R = App.RULES;
  const HOUR = 3600000;
  const WEEK_HOURS = 168;

  // Günüň wagtyna görä işjeňlik (gijesine az, gündizine köp)
  function hourWeight(hourOfDay) {
    if (hourOfDay < 7) return 0.2;
    if (hourOfDay < 9) return 0.7;
    if (hourOfDay >= 22) return 0.5;
    return 1;
  }

  function newSeed() {
    return Math.floor(Math.random() * 1e9);
  }

  function pickBots(seed) {
    const rnd = U.rng(seed);
    const count = R.LEAGUE_GROUP_SIZE - 1;
    return U.shuffle(window.PERSONAS, rnd).slice(0, count).map(p => ({
      personaId: p.id,
      // her hepde personažyň işjeňligi biraz üýtgeýär
      mul: +(0.6 + rnd() * 0.8).toFixed(2)
    }));
  }

  function newGroup(state, weekStart) {
    const seed = newSeed();
    state.league.weekStart = weekStart;
    state.league.seed = seed;
    state.league.bots = pickBots(seed);
  }

  // Personažyň hepdäniň ilkinji `hours` sagadyndaky XP-si.
  //  * Personaž okan sagadynda 15–65 XP gazanýar (R.LEAGUE_BOT_HOUR_XP).
  //  * Bir günde gazanýan XP-si 700-den geçmeýär (R.LEAGUE_BOT_DAY_MAX) — çäge ýetse, şol gün başga gazanmaýar.
  //  * Jemi XP soňunda ×1.2 edilýär (R.LEAGUE_BOT_XP_MUL): öňki bahanyň üstüne 0.2 bölegi goşulýar.
  //  * Okamak ähtimallygy personažyň işjeňligine, günüň wagtyna we liga bagly (gijelerine az, ýokary ligalarda köp).
  //  * Okamadyk sagatlarynda käwagt az mukdarda XP ýitirýär (jerime), XP 0-dan aşak düşmeýär.
  function botXp(league, bot, hours) {
    const p = window.PERSONAS.find(x => x.id === bot.personaId);
    if (!p) return 0;
    const factor = window.LEAGUES[league.index].factor;
    const [minGain, maxGain] = R.LEAGUE_BOT_HOUR_XP;
    let xp = 0, dayGain = 0;
    for (let h = 0; h < hours; h++) {
      if (h % 24 === 0) dayGain = 0;   // täze gün — gündelik çäk täzelenýär
      const rnd = U.rng(U.hash(league.seed, bot.personaId, h));
      // XP diňe her LEAGUE_BOT_EVERY_H sagatda bir gezek gazanylýar: 0, 2.5, 5, 7.5 ... sagatlaryň düşýän sagady
      const every = R.LEAGUE_BOT_EVERY_H;
      const slot = Math.ceil(h / every) * every < h + 1;   // [h, h+1) aralygyna 2.5-iň kratnysy düşýärmi?
      const chance = Math.min(0.9, (0.15 + p.activity * bot.mul * 2.5) * hourWeight(h % 24) * Math.sqrt(factor));
      if (slot && rnd() < chance) {
        // Gazanç hemişe 100–200 aralykda; günüň galan çägi 100-den az bolsa, şol gün başga gazanmaýar
        const left = R.LEAGUE_BOT_DAY_MAX - dayGain;
        if (left >= minGain) {
          const top = Math.min(maxGain, left);
          const gain = minGain + Math.floor(rnd() * (top - minGain + 1));
          dayGain += gain;
          xp += gain;
        }
      } else if (rnd() < 0.12) {
        xp = Math.max(0, xp - (10 + Math.floor(rnd() * 31)));   // 10–40 XP jerime
      }
    }
    return Math.round(xp * R.LEAGUE_BOT_XP_MUL);
  }

  function elapsedHours(league, final) {
    if (final) return WEEK_HOURS;
    return Math.max(0, Math.min(WEEK_HOURS, Math.floor((App.clock.now() - league.weekStart) / HOUR)));
  }

  // Toparyň orunlar boýunça tertiplenen sanawy
  function standings(state, final = false) {
    const L = state.league;
    const hours = elapsedHours(L, final);
    const rows = L.bots.map(b => {
      const p = window.PERSONAS.find(x => x.id === b.personaId) || { name: '?', avatar: '❔', city: '' };
      const xp = botXp(L, b, hours);
      // Soňky sagatdaky üýtgeşme (reýting tablisasynda ▲ / ▼ görnüşinde görkezilýär)
      const delta = hours > 0 ? xp - botXp(L, b, hours - 1) : 0;
      return { id: b.personaId, name: p.name, avatar: p.avatar, city: p.city, xp, delta, isUser: false };
    });
    rows.push({ id: 'me', name: state.user.name || 'Sen', avatar: App.avatarHtml(state.user), city: '', xp: state.weeklyXp, delta: null, isUser: true });
    // Deň XP bolanda ulanyjy ýokarda durýar
    rows.sort((a, b) => b.xp - a.xp || (b.isUser ? 1 : 0) - (a.isUser ? 1 : 0));
    rows.forEach((r, i) => { r.rank = i + 1; r.zone = zoneFor(L.index, r.rank); });
    return rows;
  }

  function zoneFor(leagueIndex, rank) {
    const last = window.LEAGUES.length - 1;
    if (rank <= R.LEAGUE_PROMOTE && leagueIndex < last) return 'promote';
    if (rank > R.LEAGUE_GROUP_SIZE - R.LEAGUE_DEMOTE && leagueIndex > 0) return 'demote';
    return 'stay';
  }

  // Hepde çalşyp-çalşmandygyny barlaýar we netijeleri hasaplaýar
  function ensureWeek(state) {
    const cur = U.weekStart();
    if (!state.league) {
      state.league = { index: 0, weekStart: cur, seed: 0, bots: [], history: [] };
      newGroup(state, cur);
      return;
    }
    const L = state.league;
    if (L.weekStart >= cur) return;

    // 1) Saklanan hepdäni jemlemek
    const rows = standings(state, true);
    const me = rows.find(r => r.isUser);
    const from = L.index;
    if (me.zone === 'promote') L.index++;
    if (me.zone === 'demote') L.index--;
    L.history.unshift({ weekStart: L.weekStart, league: from, rank: me.rank, xp: me.xp, result: me.zone });
    const lg = window.LEAGUES[L.index];
    const msg = {
      promote: `🎉 Gutlaýarys! Geçen hepde ${me.rank}-nji orny eýeläp, ýokary liga geçdiňiz: ${lg.icon} ${lg.name}.`,
      demote: `😔 Geçen hepde ${me.rank}-nji orunda galyp, aşaky liga düşdüňiz: ${lg.icon} ${lg.name}.`,
      stay: `Geçen hepde ${me.rank}-nji orny eýelediňiz. Ligaňyz üýtgemedi: ${lg.icon} ${lg.name}.`
    }[me.zone];
    App.store.pushNotice(msg);

    // 2) Ulanyjy birnäçe hepde girmedik bolsa — her geçen hepde 0 XP bilen (soňky orun)
    let w = U.nextWeekStart(L.weekStart);
    let skipped = 0;
    while (w < cur) {
      const from2 = L.index;
      if (L.index > 0) L.index--;
      L.history.unshift({ weekStart: w, league: from2, rank: R.LEAGUE_GROUP_SIZE, xp: 0, result: from2 > 0 ? 'demote' : 'stay' });
      w = U.nextWeekStart(w);
      skipped++;
    }
    if (skipped) {
      const lg2 = window.LEAGUES[L.index];
      App.store.pushNotice(`Siz ${skipped} hepde gatnaşmadyňyz. Häzirki ligaňyz: ${lg2.icon} ${lg2.name}.`);
    }
    L.history = L.history.slice(0, 20);

    // 3) Täze hepde — täze topar
    state.weeklyXp = 0;
    newGroup(state, cur);
  }

  function timeLeft(state) {
    return U.nextWeekStart(state.league.weekStart) - App.clock.now();
  }

  return { ensureWeek, standings, timeLeft, zoneFor };
})();
