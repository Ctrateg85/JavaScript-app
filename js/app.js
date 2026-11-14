// Programmanyň başlangyjy: marşrutlaşdyrma (routing) we ýokarky panel
window.App = window.App || {};

(function () {
  const U = App.util;
  let cleanup = null;
  let prevStats = null;   // ýokarky paneldäki soňky görkezilen bahalar (XP, jan, yzygiderlik)

  // Häzirki sahypa ýapylanda işlemeli funksiýa (taýmerleri togtatmak üçin)
  App.onLeave = function (fn) { cleanup = fn; };

  App.render = function () {
    if (cleanup) { try { cleanup(); } catch (e) { /* */ } cleanup = null; }
    App.store.refresh();

    const view = document.getElementById('view');
    const parts = (location.hash.replace(/^#\/?/, '') || 'home').split('/');
    let name = parts[0];
    const params = parts.slice(1).map(decodeURIComponent);

    if (!App.store.state.user.name) name = 'onboarding';
    if (!App.views[name]) name = 'home';

    document.body.dataset.view = name;
    document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === name));
    document.getElementById('profileBtn').classList.toggle('active', name === 'profile');
    document.getElementById('editorBtn').classList.toggle('active', name === 'editor');
    document.querySelectorAll('[data-corner]').forEach(a => a.classList.toggle('active', a.dataset.corner === name));
    App.toggleCorner(false);
    view.innerHTML = '';
    App.views[name].render(view, params);
    App.updateHeader();
    window.scrollTo(0, 0);
    App.a11y.pageChanged();
  };

  App.updateHeader = function () {
    const s = App.store.state;
    App.store.regenHearts();
    const lg = window.LEAGUES[s.league.index];
    const heartTitle = s.hearts < App.RULES.HEARTS_MAX
      ? `Indiki jan: ${U.fmtDuration(App.store.nextHeartIn())}` : 'Janlar doly';
    const box = document.getElementById('topStats');
    // Panel bir gezek döredilýär, soň diňe bahalar täzelenýär (görkezilýän "+N" belgileri pozulmaz ýaly)
    if (!box.querySelector('[data-k]')) {
      box.innerHTML = `
        <span class="stat" data-k="streak" title="Gündelik yzygiderlik">🔥 <span class="v"></span></span>
        <span class="stat" data-k="xp" title="Jemi XP">⭐ <span class="v"></span></span>
        <span class="stat" data-k="hearts">❤️ <span class="v"></span></span>
        <span class="stat" data-k="league"></span>`;
    }
    box.querySelector('[data-k="streak"] .v').textContent = s.streak;
    box.querySelector('[data-k="xp"] .v').textContent = s.xp;
    box.querySelector('[data-k="hearts"] .v').textContent = s.hearts;
    box.querySelector('[data-k="hearts"]').title = heartTitle;
    const lgEl = box.querySelector('[data-k="league"]');
    lgEl.textContent = lg.icon;
    lgEl.title = lg.name;
    // Ekran okaýjy üçin: ikonka we san ýerine doly ýazgy
    box.querySelector('[data-k="streak"]').setAttribute('aria-label', `Yzygiderlik: ${s.streak} gün`);
    box.querySelector('[data-k="xp"]').setAttribute('aria-label', `XP: ${s.xp}`);
    box.querySelector('[data-k="hearts"]').setAttribute('aria-label', `Janlar: ${s.hearts} / ${App.RULES.HEARTS_MAX}`);
    lgEl.setAttribute('aria-label', `Liga: ${lg.name}`);
    box.querySelectorAll('.stat').forEach(x => x.setAttribute('role', 'img'));
    // Öňki bahalar bilen deňeşdirip, üýtgeşmäni (+N / −N) görkezmek
    const now = { streak: s.streak, xp: s.xp, hearts: s.hearts };
    if (prevStats) {
      Object.keys(now).forEach(k => U.popDelta(box.querySelector(`[data-k="${k}"]`), now[k] - prevStats[k]));
    }
    prevStats = now;
    const pb = document.getElementById('profileBtn');
    pb.innerHTML = App.avatarHtml(s.user);
    App.fitHeader();
    pb.title = `Profil: ${s.user.name}`;
    pb.setAttribute('aria-label', pb.title);
  };

  // Dereje ýokarlananda gutlag penjiresi: täze dereje we berlen baýraklar.
  // gained: [{ level, rewards: [{ icon, text, xp }], xp }] (store.js → addXp)
  App.showLevelUp = function (gained) {
    const R = App.RULES, s = App.store.state;
    const info = App.levelInfo(s.xp);
    const last = gained[gained.length - 1];
    const total = gained.reduce((a, g) => a + g.xp, 0);
    const every = R.LEVEL_MILESTONE_EVERY;
    const nextBig = Math.ceil((info.level + 1) / every) * every;
    const back = document.createElement('div');
    back.className = 'modal-back';
    back.innerHTML = `
      <div class="modal card lvl-modal" role="dialog" aria-modal="true">
        <div class="lvl-burst">🎉</div>
        <div class="muted small">Gutlaýarys!</div>
        <div class="lvl-num">${last.level}</div>
        <h2>Siz ${last.level}-nji derejä ýetdiňiz!</h2>
        <div class="pill">${U.esc(App.levelInfo(App.xpForLevel(last.level)).title)}</div>
        <div class="lvl-rewards">
          ${gained.map(g => g.rewards.map(r => `<div class="lvl-reward ${r.xp > R.LEVEL_UP_XP ? 'big' : ''}">
            <span class="lvl-r-icon">${r.icon}</span>
            <span class="grow">${U.esc(r.text)} <span class="muted small">· ${g.level}-nji dereje</span></span>
            <b class="pos">+${r.xp} XP</b></div>`).join('')).join('')}
        </div>
        <div class="lvl-total">Jemi baýrak: <b class="pos">+${total} XP</b></div>
        <div class="bar mt"><div style="width:${info.pct}%"></div></div>
        <div class="muted small">${info.level}-nji dereje · indiki derejä çenli ${info.next - s.xp} XP ·
          🏆 uly baýrak ${nextBig}-nji derejede (+${R.LEVEL_UP_XP + R.LEVEL_MILESTONE_XP} XP)</div>
        <div class="row gap mt" style="justify-content:center">
          <button class="btn" data-act="levels">🎖 Derejeler</button>
          <button class="btn primary" data-act="ok">Dowam et</button>
        </div>
      </div>`;
    document.body.appendChild(back);
    const close = () => {
      back.remove();
      document.removeEventListener('keydown', onKey, true);
    };
    // Penjire açykka Enter / Esc beýleki sahypalara (sapak, duel) geçmez ýaly tutulýar
    const onKey = e => {
      if (e.key === 'Escape' || e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); close(); }
    };
    document.addEventListener('keydown', onKey, true);
    back.addEventListener('click', e => {
      const act = e.target.closest('[data-act]');
      if (e.target === back || (act && act.dataset.act === 'ok')) close();
      if (act && act.dataset.act === 'levels') {
        close();
        s.ui.levelsOpen = true;
        App.store.save();
        if (location.hash === '#/profile') App.render();
        else location.hash = '#/profile';
        setTimeout(() => { const d = document.querySelector('details[data-fold="levelsOpen"]'); if (d) d.scrollIntoView({ behavior: 'smooth' }); }, 50);
      }
    });
    back.querySelector('[data-act="ok"]').focus();
  };

  // Ýokarky panel penjirä sygar ýaly: iň giň görnüşden başlap, menýu sygýança basgançakly gysgaldylýar.
  // Ekran ulaltmasy (Windows 125 % / 150 %), şrift ölçegi we dil (rus ýazgylary uzyn) awtomatik hasaba alynýar.
  App.fitHeader = function () {
    const bar = document.querySelector('.topbar'), nav = bar && bar.querySelector('.nav');
    if (!bar) return;
    const fits = () => nav.scrollWidth <= nav.clientWidth + 1 && bar.scrollWidth <= bar.clientWidth + 1;
    for (let level = 0; level <= 4; level++) {
      bar.classList.remove('fit-1', 'fit-2', 'fit-3', 'fit-4');
      for (let k = 1; k <= level; k++) bar.classList.add('fit-' + k);
      if (fits()) break;
    }
  };

  // Aşaky çep burçdaky menýuny açmak / ýapmak
  App.toggleCorner = function (open) {
    const panel = document.getElementById('cornerPanel');
    const btn = document.getElementById('cornerBtn');
    const show = open === undefined ? panel.hidden : open;
    panel.hidden = !show;
    btn.classList.toggle('open', show);
    btn.setAttribute('aria-expanded', String(show));
    btn.textContent = show ? '✕' : '☰';
  };

  window.addEventListener('hashchange', App.render);
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('cornerBtn').addEventListener('click', e => { e.stopPropagation(); App.toggleCorner(); });
    document.getElementById('cornerPanel').addEventListener('click', e => { if (e.target.closest('a')) App.toggleCorner(false); });
    // Menýudan daşaryk basylanda ýa-da Esc basylanda ýapylýar
    document.addEventListener('click', e => { if (!e.target.closest('#cornerMenu')) App.toggleCorner(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') App.toggleCorner(false); });
    App.store.load();
    // Dil (terjime) we elýeterlilik: sahypa çyzylmazdan öň işe girizilýär, soňky ähli üýtgeşmeleri özleri yzarlaýar
    App.i18n.init(App.store.state.settings.lang);
    App.a11y.init();
    App.render();
    // Internet wagty: tapawut ep-esli üýtgese (meselem, kompýuteriň sagady nädogry bolsa), janlar we liga täzeden hasaplanýar.
    // Sahypa täzeden çyzylmaýar — sapak ýa-da duel kesilmez ýaly.
    App.clock.start(() => { App.store.refresh(); App.updateHeader(); });
    // Penjiräniň ölçegi üýtgände (kiçeltmek, ulaltmak, başga monitor) ýokarky panel täzeden sazlanýar
    window.addEventListener('resize', App.fitHeader);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(App.fitHeader);
    // Janlaryň dikelişini we beýleki wagt maglumatlaryny her minutda täzelemek
    setInterval(App.updateHeader, 30000);
  });
})();
