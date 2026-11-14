// Reýting: hepdelik liga tablisasy we ballaryň düzgünleri
window.App = window.App || {};
App.views = App.views || {};

App.views.rating = {
  render(el) {
    const U = App.util, R = App.RULES, s = App.store.state;
    const L = s.league;
    const rows = App.rating.standings(s);
    const lg = window.LEAGUES[L.index];
    const zoneLabel = { promote: '⬆ Ýokary geçiş zolagy', demote: '⬇ Aşak düşüş zolagy' };

    const leagues = window.LEAGUES.map((l, i) =>
      `<div class="league-step ${i === L.index ? 'active' : i < L.index ? 'passed' : ''}" style="--c:${l.color}">
        <div class="league-icon">${l.icon}</div><div class="small">${l.name}</div></div>`).join('');

    // Zolaklaryň arasyna bölüji setir goýýarys
    let lastZone = null;
    const table = rows.map(r => {
      let sep = '';
      if (r.zone !== lastZone && zoneLabel[r.zone]) sep = `<tr class="zone-sep ${r.zone}"><td colspan="4">${zoneLabel[r.zone]}</td></tr>`;
      else if (r.zone !== lastZone && lastZone) sep = '<tr class="zone-sep stay"><td colspan="4"></td></tr>';
      lastZone = r.zone;
      return `${sep}<tr class="${r.isUser ? 'me' : ''} ${r.zone}">
        <td class="rank">${r.rank <= 3 ? ['🥇', '🥈', '🥉'][r.rank - 1] : r.rank}</td>
        <td><span class="av">${r.avatar}</span> ${U.esc(r.name)} ${r.isUser ? '<span class="pill">Siz</span>' : ''}
          ${r.city ? `<span class="muted small">· ${U.esc(r.city)}</span>` : ''}</td>
        <td class="num">${r.xp} XP${r.delta ? ` <span class="delta ${r.delta > 0 ? 'pos' : 'neg'}" title="Soňky sagatda">${r.delta > 0 ? '▲' : '▼'}${Math.abs(r.delta)}</span>` : ''}</td>
        <td class="small muted">${r.zone === 'promote' ? '⬆' : r.zone === 'demote' ? '⬇' : ''}</td>
      </tr>`;
    }).join('');

    const history = L.history.length ? L.history.map(h => {
      const hl = window.LEAGUES[h.league];
      const res = { promote: '⬆ Ýokary geçdi', demote: '⬇ Aşak düşdi', stay: '— Galdy' }[h.result];
      return `<tr><td>${U.fmtDate(h.weekStart)}</td><td>${hl.icon} ${hl.name}</td><td>${h.rank}</td><td>${h.xp} XP</td><td>${res}</td></tr>`;
    }).join('') : '<tr><td colspan="5" class="muted">Entek tamamlanan hepde ýok.</td></tr>';

    el.innerHTML = `
      <h1>🏆 Reýting</h1>
      <div class="leagues">${leagues}</div>
      <div class="two-col wide-left">
        <div class="card">
          <div class="row between wrap">
            <h2>${lg.icon} ${lg.name}</h2>
            <div class="muted">⏳ Hepdäniň gutarmagyna: <b>${U.fmtDuration(App.rating.timeLeft(s))}</b></div>
          </div>
          <p class="muted small">Ilkinji ${R.LEAGUE_PROMOTE} orun indiki liga geçýär, soňky ${R.LEAGUE_DEMOTE} orun aşaky liga düşýär.
            Reýting her duşenbe 00:00-da täzelenýär we täze topar düzülýär.</p>
          <table class="rating-table">${table}</table>
        </div>
        <div>
          <div class="card">
            <h3>📐 Ballar nähili hasaplanýar?</h3>
            <table class="rules">
              ${window.LEAGUES.map((l, i) => `<tr class="${i === L.index ? 'me' : ''}"><td>Derejäni tamamlamak · ${l.icon} ${l.name}</td><td>+${l.xp[0]}…${l.xp[1]} XP</td></tr>`).join('')}
              <tr><td colspan="2" class="muted small">Aralykdaky XP ilkinji synanyşykda dogry jogap berlen soraglaryň paýyna görä berilýär.</td></tr>
              <tr><td>Ýalňyşsyz tamamlamak (bonus)</td><td>+${R.XP_PERFECT_BONUS} XP</td></tr>
              <tr><td>Günüň ilkinji sapagy</td><td>+yzygiderlik güni (iň köp ${R.STREAK_BONUS_MAX})</td></tr>
              <tr><td>Tamamlanan derejäni gaýtadan geçmek</td><td>×${R.REPLAY_FACTOR}</td></tr>
              <tr><td>Duelde ýeňiş</td><td>+${R.DUEL_WIN_XP} XP</td></tr>
              <tr><td>Duelde deňme-deň</td><td>+${R.DUEL_DRAW_XP} XP</td></tr>
              <tr><td>Duelde utulyş (gatnaşygy üçin)</td><td>+${R.DUEL_LOSS_XP} XP</td></tr>
            </table>
            <p class="muted small">Ligadaky orun diňe şu hepde gazanylan XP boýunça kesgitlenýär.
              Beýleki gatnaşyjylar her <b>${R.LEAGUE_BOT_EVERY_H} sagatdan</b> bir gezek okap, <b>${R.LEAGUE_BOT_HOUR_XP[0]}–${R.LEAGUE_BOT_HOUR_XP[1]} XP</b> gazanyp bilýärler,
              ýöne bir günde <b>${R.LEAGUE_BOT_DAY_MAX} XP</b>-den köp gazanyp bilmeýärler. Käwagt jerime alyp, az mukdarda XP ýitirýärler
              (▲ / ▼ — soňky sagatdaky üýtgeşme). Gijelerine olar az, gündizine köp işjeň bolýarlar.</p>
          </div>
          <div class="card">
            <h3>📜 Geçen hepdeler</h3>
            <table class="history-table">
              <tr><th>Hepde</th><th>Liga</th><th>Orun</th><th>XP</th><th>Netije</th></tr>
              ${history}
            </table>
          </div>
        </div>
      </div>`;

    // Personažlaryň XP-si wagt geçdigiçe artýar — sahypany her minutda täzeläp durýarys
    const t = setInterval(() => App.render(), 60000);
    App.onLeave(() => clearInterval(t));
  }
};
