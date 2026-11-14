// Baş sahypa: bölümler we derejeler (ýol görnüşinde)
window.App = window.App || {};
App.views = App.views || {};

App.views.home = {
  render(el) {
    const U = App.util;
    const s = App.store.state;
    const st = App.store;
    const cur = st.currentLevel();
    const info = App.levelInfo(s.xp);
    const lg = window.LEAGUES[s.league.index];
    const myRank = App.rating.standings(s).find(r => r.isUser).rank;
    const allCount = App.allLevels().length;
    const doneCount = Object.keys(s.progress).length;

    const notices = s.notices.map((n, i) =>
      `<div class="notice">${U.esc(n.text)} <button class="link" data-close="${i}">✕</button></div>`).join('');

    const units = window.LESSONS.map((unit, ui) => {
      const done = unit.levels.filter(l => s.progress[l.id]).length;
      const levels = unit.levels.map((lvl, li) => {
        const p = s.progress[lvl.id];
        const unlocked = st.isUnlocked(lvl.id);
        const isCur = cur && cur.id === lvl.id;
        const cls = p ? 'done' : isCur ? 'current' : unlocked ? 'open' : 'locked';
        const stars = p ? '⭐'.repeat(p.stars) + '☆'.repeat(3 - p.stars) : '';
        const icon = p ? '✔' : unlocked ? '▶' : '🔒';
        const offset = ['0', '40px', '80px', '40px'][li % 4];
        return `
          <div class="level-node ${cls}" style="margin-left:${offset}">
            <button class="level-btn" data-level="${lvl.id}" ${unlocked ? '' : 'disabled'} title="${U.esc(lvl.title)}">${icon}</button>
            <div class="level-meta">
              <div class="level-title">${li + 1}. ${U.esc(lvl.title)}</div>
              <div class="level-stars">${stars || (unlocked ? `${lvl.questions.length} sorag` : 'Ýapyk')}</div>
            </div>
          </div>`;
      }).join('');
      return `
        <section class="unit">
          <div class="unit-head">
            <div>
              <div class="unit-num">${ui + 1}-nji bölüm</div>
              <h2>${unit.icon} ${U.esc(unit.title)}</h2>
              <div class="muted">${U.esc(unit.desc)}</div>
            </div>
            <div class="unit-side">
              <div class="pill">${done}/${unit.levels.length}</div>
              <a class="link" href="#/encyclopedia/${unit.chapter}">📖 Okamak</a>
            </div>
          </div>
          <div class="path">${levels}</div>
        </section>`;
    }).join('');

    el.innerHTML = `
      ${notices}
      <div class="home-grid">
        <div class="units">${units}</div>
        <aside class="side">
          <div class="card">
            <div class="row"><span class="big-emoji">${App.avatarHtml(s.user)}</span>
              <div><b>${U.esc(s.user.name)}</b><div class="muted">${info.level}-nji dereje · ${info.title}</div></div></div>
            <div class="bar"><div style="width:${info.pct}%"></div></div>
            <div class="muted small">${s.xp - info.cur} / ${info.next - info.cur} XP indiki derejä çenli</div>
          </div>
          <div class="card">
            <h3>Dowam et</h3>
            ${cur ? `<p>${U.esc(cur.unit.title)}<br><b>${U.esc(cur.title)}</b></p>
              <button class="btn primary full" data-level="${cur.id}">Sapaga başla ▶</button>`
              : '<p>🎓 Ähli derejeler tamamlandy! Duelde güýjüňizi synap görüň.</p>'}
            <div class="muted small mt">Jemi: ${doneCount} / ${allCount} dereje</div>
          </div>
          <div class="card clickable" data-go="#/rating">
            <h3>${lg.icon} ${lg.name}</h3>
            <p>Siz <b>${myRank}-nji</b> orunda · şu hepde <b>${s.weeklyXp} XP</b></p>
            <div class="muted small">Hepdäniň gutarmagyna: ${U.fmtDuration(App.rating.timeLeft(s))}</div>
          </div>
          <div class="card clickable" data-go="#/duel">
            <h3>⚔️ 1×1 Duel</h3>
            <p>Bot bilen bäsleşiň. Duel reýtingiňiz: <b>${s.duel.rating}</b></p>
          </div>
        </aside>
      </div>`;

    el.querySelectorAll('[data-level]').forEach(b => b.addEventListener('click', () => {
      location.hash = '#/lesson/' + b.dataset.level;
    }));
    el.querySelectorAll('[data-go]').forEach(c => c.addEventListener('click', () => { location.hash = c.dataset.go; }));
    el.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => {
      s.notices.splice(+b.dataset.close, 1);
      st.save();
      App.render();
    }));
  }
};
