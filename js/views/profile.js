// Profil: ulanyjynyň ähli maglumatlary we häsiýetnamalary
window.App = window.App || {};
App.views = App.views || {};

// Ýalňyşlyklar boýunça maslahatlar: her sapak bölümi üçin nämä üns bermeli we haýsy mesele bölümi degişli
App.MISTAKE_TIPS = {
  units: {
    u1: { tip: '`let` we `const` tapawudyna, üýtgeýänleriň atlandyrylyş düzgünlerine we `+` bilen setir birleşdirilişine üns beriň.', section: 'Operatorlar' },
    u2: { tip: '`typeof` netijelerini, `null` / `undefined` tapawudyny, `NaN`-y we görnüşleriň awtomatik öwrülişini (`"5" + 3`) gaýtalaň.', section: 'Operatorlar' },
    u3: { tip: '`==` bilen `===` tapawudy, `++` prefiks/postfiks, `&&` / `||` gysga utgaşdyrma we operatorlaryň ýerine ýetiriliş tertibi.', section: 'Operatorlar' },
    u4: { tip: 'False bahalary (`0`, `""`, `null`, `undefined`, `NaN`), `switch`-de `break`-iň roluny we üçlük operatory gaýtalaň.', section: 'Şertler' },
    u5: { tip: 'Sikliň haçan togtaýandygyny (şerti), `break` / `continue` we `for...of` / `for...in` tapawudyny yzarlaň. Kody kagyzda ädimme-ädim ýerine ýetirip görüň.', section: 'Sikller' },
    u6: { tip: 'Funksiýanyň näme gaýtarýandygyna (`return`), adaty bahalara, ok-funksiýalara, scope we closure düşünjelerine üns beriň.', section: 'Funksiýalar' },
    u7: { tip: 'Haýsy usullaryň asyl massiwi üýtgedýändigini (`push`, `sort`, `splice`) we haýsylarynyň täze massiw gaýtarýandygyny (`map`, `filter`, `slice`) ýatda saklaň.', section: 'Massiwler' },
    u8: { tip: 'Obýektleriň salgylanma boýunça göçürilişini, `this`-i, destrukturlaşdyrmany we `Object.keys / values / entries` usullaryny gaýtalaň.', section: 'Obýektler' },
    u9: { tip: 'Setirleriň üýtgemeýändigini, indeksleriň 0-dan başlaýandygyny we `slice`, `indexOf`, `split` netijelerini barlaň.', section: 'Setirler' },
    u10: { tip: '`querySelector` we `querySelectorAll` tapawudyny, wakalary (`click`, `input`, `submit`) we `textContent` / `innerHTML` tapawudyny gaýtalaň.', section: null },
    u11: { tip: 'Event loop tertibini ýatda saklaň: sinhron kod → Promise (mikrowezipe) → `setTimeout`. `async` funksiýa hemişe Promise gaýtarýar.', section: null },
    u12: { tip: '`class`, `extends`, `super`, `static` we ýalňyşlyk görnüşlerini (`TypeError`, `ReferenceError` ...) gaýtalaň.', section: 'Obýektler' }
  },
  sections: {
    'Operatorlar': { chapter: 'ch3', tip: 'Amallaryň tertibine, bitin bölmek üçin `Math.floor`-a we tegeleklemä üns beriň.' },
    'Şertler': { chapter: 'ch4', tip: 'Şertleri uly bahadan kiçä tertipläň, serhet bahalaryny (`>=` ýa-da `>`) barlaň.' },
    'Sikller': { chapter: 'ch5', tip: 'Sikliň başlangyç bahasyny, şertini we ädimini barlaň — köplenç ýalňyşlyk serhetde (`<` ýa-da `<=`) bolýar.' },
    'Funksiýalar': { chapter: 'ch6', tip: 'Funksiýa hemişe `return` bilen netije gaýtarmaly. Rekursiýada esasy (togtaýyş) ýagdaýy unutmaň.' },
    'Setirler': { chapter: 'ch9', tip: 'Boş setir, bir harply setir ýaly aýratyn ýagdaýlary barlaň; uly-kiçi harplara üns beriň.' },
    'Massiwler': { chapter: 'ch7', tip: 'Boş massiw ýagdaýyny barlaň. Asyl massiwi üýtgetmeli däl bolsa, göçürmesi bilen işläň (`[...arr]`).' },
    'Obýektler': { chapter: 'ch8', tip: 'Açarlaryň barlygyny `in` bilen barlaň, içki obýektlere `?.` bilen howpsuz ýüzleniň.' },
    'Algoritmler': { chapter: 'ch16', tip: 'Ilki algoritmi sözler bilen ýazyň, soň kody. Kiçi mysal bilen ädimme-ädim barlaň.' }
  }
};

App.views.profile = {
  render(el) {
    const U = App.util, R = App.RULES, st = App.store, s = st.state;
    const info = App.levelInfo(s.xp);
    const lg = window.LEAGUES[s.league.index];
    const all = App.allLevels();
    const done = all.filter(l => s.progress[l.id]).length;
    const stars = Object.values(s.progress).reduce((a, p) => a + p.stars, 0);
    const accuracy = s.stats.answered ? Math.round((s.stats.correct / s.stats.answered) * 100) : 0;
    const duels = s.duel.wins + s.duel.losses + s.duel.draws;
    const winRate = duels ? Math.round((s.duel.wins / duels) * 100) : 0;
    const myRank = App.rating.standings(s).find(r => r.isUser).rank;
    const gotCount = App.ACHIEVEMENTS.filter(a => s.achievements[a.id]).length;

    // Soňky 7 günüň XP-si
    const days = [];
    const dayNames = ['Ýb', 'Db', 'Sb', 'Çb', 'Pb', 'An', 'Şb'];
    for (let i = 6; i >= 0; i--) {
      const d = App.clock.date(); d.setDate(d.getDate() - i);
      days.push({ label: dayNames[d.getDay()], xp: s.daily[U.dayKey(d)] || 0 });
    }
    const maxXp = Math.max(10, ...days.map(d => d.xp));

    // Bölümler boýunça ösüş
    const unitRows = window.LESSONS.map(u => {
      const d = u.levels.filter(l => s.progress[l.id]).length;
      const pct = Math.round((d / u.levels.length) * 100);
      return `<div class="unit-row"><span>${u.icon} ${U.esc(u.title)}</span>
        <div class="bar small-bar"><div style="width:${pct}%"></div></div><span class="muted">${d}/${u.levels.length}</span></div>`;
    }).join('');

    // ---------- Ýalňyşlyklar we maslahatlar ----------
    const T = App.MISTAKE_TIPS, mist = s.mistakes;
    const inl = t => U.esc(t).replace(/`([^`]+)`/g, '<code>$1</code>');
    const totalAns = Object.values(mist.units).reduce((a, u) => a + u.answered, 0);
    const totalWrong = Object.values(mist.units).reduce((a, u) => a + u.wrong, 0);
    const practiceFails = Object.values(mist.sections).reduce((a, n) => a + n, 0);
    // Diňe iň az MISTAKE_MIN gezek gaýtalanan ýalňyşlyklar görkezilýär
    const MIN = App.MISTAKE_MIN;
    const repeated = Object.values(mist.byQ || {}).filter(x => x.count >= MIN).sort((a, b) => b.count - a.count).slice(0, 8);
    const coming = Object.values(mist.byQ || {}).filter(x => x.count < MIN).length;
    const weakUnits = Object.entries(mist.units)
      .filter(([, u]) => u.wrong >= MIN)
      .map(([id, u]) => ({ unit: window.LESSONS.find(x => x.id === id), ...u, rate: u.wrong / u.answered }))
      .filter(x => x.unit)
      .sort((a, b) => b.wrong - a.wrong || b.rate - a.rate)
      .slice(0, 3);
    const weakSections = Object.entries(mist.sections).filter(([, n]) => n >= MIN).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const shownCount = repeated.length + weakUnits.length + weakSections.length;
    const chapterOf = id => window.BOOK.chapters.find(c => c.id === id);
    // Gaýtalamak üçin: bölümdäki iň az ýyldyzly tamamlanan dereje, ýogsam ilkinji açyk dereje
    const repeatLevel = unit => {
      const done = unit.levels.filter(l => s.progress[l.id]).sort((a, b) => s.progress[a.id].stars - s.progress[b.id].stars);
      return done[0] || unit.levels.find(l => st.isUnlocked(l.id)) || unit.levels[0];
    };
    const advice = totalAns < 10 ? 'Maslahat bermek üçin maglumat az. Sapaklary we duelleri dowam ediň — programma ýalňyşlyklaryňyzy seljerip, şu ýerde maslahat berer.'
      : accuracy >= 90 ? '👏 Gaty gowy! Takyklygyňyz ýokary. Has kyn meselelere we Fable 5.1 bilen duele geçiň.'
      : accuracy >= 70 ? '👍 Gowy netije. Aşakdaky temalary gaýtalasaňyz, takyklygyňyz has-da ýokarlanar.'
      : '📚 Ýalňyşlyklar köp. Sapaklary howlukman geçiň, her ýalňyş jogapdan soň düşündirişi okaň we degişli baby ensiklopediýadan gaýtalaň.';
    const whereIcon = { lesson: '📚 Sapak', duel: '⚔️ Duel', practice: '🧪 Mesele' };
    const mistakesHtml = `
      <details class="fold" data-fold="mistakesOpen" ${s.ui.mistakesOpen !== false ? 'open' : ''}>
        <summary>🩺 Ýalňyşlyklar we maslahatlar <span class="pill ${shownCount ? 'bad' : ''}">${shownCount}</span><span class="chev">▼</span></summary>
        <div class="fold-body">
          <div class="mk-stats">
            <div><b>${totalAns}</b><span>jogap (sapak + duel)</span></div>
            <div><b class="neg">${totalWrong}</b><span>ýalňyş jogap</span></div>
            <div><b>${totalAns ? Math.round(((totalAns - totalWrong) / totalAns) * 100) : 0}%</b><span>dogrulyk</span></div>
            <div><b class="neg">${practiceFails}</b><span>şowsuz mesele barlagy</span></div>
          </div>
          <div class="mk-advice">${advice}</div>

          ${weakUnits.length ? `<div class="section-title">Iň köp ýalňyşýan temalaryňyz</div>
          <div class="mk-grid">${weakUnits.map(w => {
            const tips = T.units[w.unit.id] || {};
            const ch = chapterOf(w.unit.chapter);
            const lvl = repeatLevel(w.unit);
            return `<div class="mk-card">
              <div class="row between"><b>${w.unit.icon} ${U.esc(w.unit.title)}</b><span class="neg small">${w.wrong} ýalňyş / ${w.answered}</span></div>
              <div class="bar small-bar mk-bar"><div style="width:${Math.round(w.rate * 100)}%"></div></div>
              <p class="small">${inl(tips.tip || '')}</p>
              <div class="mk-links">
                ${ch ? `<a href="#/encyclopedia/${ch.id}">📖 Okaň: ${U.esc(ch.title)}</a>` : ''}
                <a href="#/lesson/${lvl.id}">🔁 Gaýtalaň: ${U.esc(lvl.title)}</a>
                ${tips.section ? `<a href="#/practice">🧪 Mesele işläň: ${U.esc(tips.section)}</a>` : ''}
              </div>
            </div>`;
          }).join('')}</div>` : ''}

          ${weakSections.length ? `<div class="section-title">Mesele işlände kynçylyk çekýän bölümleriňiz</div>
          <div class="mk-grid">${weakSections.map(([sec, n]) => {
            const tip = T.sections[sec] || {};
            const ch = tip.chapter && chapterOf(tip.chapter);
            return `<div class="mk-card">
              <div class="row between"><b>🧪 ${U.esc(sec)}</b><span class="neg small">${n} şowsuz barlag</span></div>
              <p class="small">${inl(tip.tip || '')}</p>
              <div class="mk-links">${ch ? `<a href="#/encyclopedia/${ch.id}">📖 Okaň: ${U.esc(ch.title)}</a>` : ''}</div>
            </div>`;
          }).join('')}</div>` : ''}

          ${repeated.length ? `<div class="section-title">Gaýtalanýan ýalňyşlyklar (${MIN} gezekden köp)</div>
          <div class="mk-recent">${repeated.map(r => {
            const unit = r.unit && window.LESSONS.find(x => x.id === r.unit);
            return `<div class="mk-row">
              <span class="mk-count" title="Näçe gezek ýalňyşdyňyz">×${r.count}</span>
              <span class="pill">${whereIcon[r.where] || '•'}</span>
              <div class="grow">
                <div>${U.esc(r.q)}${r.code ? ` <code>${U.esc(U.noSemi(r.code).split('\n')[0])}${r.code.includes('\n') ? ' …' : ''}</code>` : ''}</div>
                <div class="muted small">${unit ? `${unit.icon} ${U.esc(unit.title)}` : r.section ? `🧪 ${U.esc(r.section)}` : ''}
                  ${r.answer ? ` · dogry jogap: <code>${U.esc(U.noSemi(r.answer))}</code>` : ''} · soňky gezek: ${U.fmtDate(r.last)}</div>
              </div>
            </div>`;
          }).join('')}</div>` : ''}

          ${!shownCount ? `<p class="muted small">Ýalňyşlyk bu ýerde diňe iň az <b>${MIN} gezek</b> gaýtalanandan soň görünýär.
            ${coming ? `Häzir ${coming} ýalňyşlyk yzarlanýar, ýöne olaryň hiç biri entek ${MIN} gezek gaýtalanmady. 👍` : 'Entek ýalňyşlyk ýazga alynmady.'}</p>` : ''}
        </div>
      </details>`;

    // ---------- Derejeler: häzirki dereje, baýraklar we derejeler ýoly ----------
    const every = R.LEVEL_MILESTONE_EVERY;
    const nextBig = Math.ceil((info.level + 1) / every) * every;
    const titleOf = n => App.levelInfo(App.xpForLevel(n)).title;
    const rewardXp = n => App.levelRewards(n).reduce((a, r) => a + r.xp, 0);
    const pathFrom = Math.max(2, info.level - 3);
    const pathRows = [];
    for (let n = pathFrom; n <= info.level + 6; n++) {
      const reached = n <= info.level, isNext = n === info.level + 1, big = n % every === 0;
      pathRows.push(`<tr class="${reached ? 'lv-done' : isNext ? 'lv-next' : 'lv-lock'} ${big ? 'lv-big' : ''}">
        <td><b>${n}</b></td>
        <td>${U.esc(titleOf(n))}</td>
        <td>${App.xpForLevel(n)} XP</td>
        <td class="pos">+${rewardXp(n)} XP${big ? ' 🏆' : ''}</td>
        <td>${reached ? '✅ Ýetildi' : isNext ? `🔓 ${App.xpForLevel(n) - s.xp} XP galdy` : '🔒'}</td></tr>`);
    }
    const rewardedXp = s.levelHistory.reduce((a, h) => a + h.xp, 0);
    const levelsHtml = `
      <details class="fold" data-fold="levelsOpen" ${s.ui.levelsOpen ? 'open' : ''}>
        <summary>🎖 Derejeler <span class="pill">${info.level}</span><span class="chev">▼</span></summary>
        <div class="fold-body">
          <div class="lv-head">
            <div class="lv-badge"><span>${info.level}</span><small>dereje</small></div>
            <div class="grow">
              <b>${U.esc(info.title)}</b>
              <div class="bar mt"><div style="width:${info.pct}%"></div></div>
              <div class="muted small">${s.xp - info.cur} / ${info.next - info.cur} XP · ${info.level + 1}-nji derejä çenli ${info.next - s.xp} XP</div>
              <div class="muted small">🏆 Indiki uly baýrak: <b>${nextBig}-nji dereje</b> (+${rewardXp(nextBig)} XP)</div>
            </div>
          </div>
          <div class="lv-rules">
            <div><span>⬆️</span><b class="pos">+${R.LEVEL_UP_XP} XP</b><span class="muted small">her täze dereje üçin</span></div>
            <div><span>🏆</span><b class="pos">+${R.LEVEL_MILESTONE_XP} XP</b><span class="muted small">goşmaça, her ${every}-nji derejede (${every}, ${every * 2}, ${every * 3} ...)</span></div>
            <div><span>🎁</span><b>${rewardedXp} XP</b><span class="muted small">şu wagta çenli alnan baýraklar</span></div>
          </div>
          <div class="section-title">Derejeler ýoly</div>
          <table class="history-table lv-table">
            <tr><th>Dereje</th><th>At</th><th>Gerek jemi XP</th><th>Baýrak</th><th>Ýagdaý</th></tr>
            ${pathRows.join('')}
          </table>
          <div class="section-title">Alnan baýraklar</div>
          ${s.levelHistory.length ? `<div class="mk-recent">${s.levelHistory.slice(0, 10).map(h => `<div class="mk-row">
              <span class="mk-count">${h.level}</span>
              <div class="grow">${h.level}-nji dereje${h.level % every === 0 ? ' 🏆' : ''}<div class="muted small">${U.fmtDate(h.at)}</div></div>
              <b class="pos">+${h.xp} XP</b></div>`).join('')}</div>`
            : '<p class="muted small">Entek baýrak alynmady — indiki derejä ýetseňiz, şu ýerde görüner.</p>'}
        </div>
      </details>`;

    const tile = (icon, value, label) => `<div class="tile"><div class="tile-icon">${icon}</div><div class="tile-val">${value}</div><div class="tile-label">${label}</div></div>`;

    el.innerHTML = `
      <div class="profile-head card">
        <div class="avatar-wrap">
          <div class="avatar-big">${App.avatarHtml(s.user)}</div>
          <button class="photo-btn" id="photoBtn" title="Surat ýükle">📷</button>
          <input type="file" id="photoFile" accept="image/*" hidden>
          ${s.user.photo ? '<button class="link small" id="photoDel">Suraty aýyr</button>' : ''}
        </div>
        <div class="grow">
          <h1>${U.esc(s.user.name)}</h1>
          <div class="muted">${info.level}-nji dereje · ${info.title} · ${lg.icon} ${lg.name}</div>
          <div class="muted small">Agza bolan senesi: ${U.fmtDate(s.user.createdAt)}</div>
          <div class="bar mt"><div style="width:${info.pct}%"></div></div>
          <div class="muted small">${s.xp} XP · indiki derejä çenli ${info.next - s.xp} XP</div>
        </div>
        <button class="btn" id="editBtn">✏️ Üýtget</button>
      </div>

      <div id="editBox" class="card" hidden>
        <h3>Profili üýtgetmek</h3>
        <label>Adyňyz <input id="nameInp" maxlength="20" value="${U.esc(s.user.name)}"></label>
        <label>Awatar</label>
        ${s.user.photo ? '<p class="muted small">Ýüklenen surat bar, şonuň üçin emoji ýerine surat görkezilýär. Emoji ulanmak üçin suraty aýyryň.</p>' : ''}
        ${App.avatarPicker(s.user.avatar)}
        <button class="btn primary mt" id="saveBtn">Ýatda sakla</button>
      </div>

      ${levelsHtml}

      <details class="fold" data-fold="gameOpen" ${s.ui.gameOpen ? 'open' : ''}>
        <summary>🎮 XP, janlar we reýting <span class="chev">▼</span></summary>
        <div class="fold-body"><div class="game-grid">
          <div class="game-card">
            <div class="gc-head">⭐ XP</div>
            <div class="gc-big">${s.xp}</div>
            <div class="muted small">Jemi XP · ${info.level}-nji dereje</div>
            <div class="bar mt"><div style="width:${info.pct}%"></div></div>
            <div class="muted small">Indiki derejä çenli ${info.next - s.xp} XP</div>
            <div class="gc-row"><span>📅 Şu hepde</span><b>${s.weeklyXp} XP</b></div>
          </div>
          <div class="game-card">
            <div class="gc-head">❤️ Janlar</div>
            <div class="gc-big">${s.hearts}<span class="muted"> / ${R.HEARTS_MAX}</span></div>
            <div class="bar mt hearts-bar"><div style="width:${Math.round((s.hearts / R.HEARTS_MAX) * 100)}%"></div></div>
            <div class="gc-row"><span>⏱ Dikeliş tizligi</span><b>${R.HEART_REGEN_MIN} minutda 1 jan</b></div>
            <div class="gc-row"><span>⏳ Indiki jan</span><b id="nextHeart">—</b></div>
            <div class="gc-row"><span>💖 Doly bolmagyna</span><b id="fullHearts">—</b></div>
          </div>
          <div class="game-card">
            <div class="gc-head">${lg.icon} Liga reýtingi</div>
            <div class="gc-big">${myRank}-nji</div>
            <div class="muted small">${lg.name} · ${R.LEAGUE_GROUP_SIZE} gatnaşyjydan</div>
            <div class="gc-row"><span>⏳ Hepdäniň gutarmagyna</span><b>${U.fmtDuration(App.rating.timeLeft(s))}</b></div>
            <a class="btn full mt" href="#/rating">🏆 Reýtinge geç</a>
          </div>
          <div class="game-card">
            <div class="gc-head">⚔️ Duel reýtingi</div>
            <div class="gc-big">${s.duel.rating}</div>
            <div class="muted small">${App.duelRank(s.duel.rating).icon} ${App.duelRank(s.duel.rating).title}</div>
            <div class="gc-row"><span>🏆 Ýeňiş</span><b class="pos">${s.duel.wins}</b></div>
            <div class="gc-row"><span>🤝 Deňme-deň</span><b>${s.duel.draws}</b></div>
            <div class="gc-row"><span>❌ Utulyş</span><b class="neg">${s.duel.losses}</b></div>
            <div class="gc-row"><span>📈 Ýeňiş göterimi</span><b>${winRate}%</b></div>
          </div>
        </div></div>
      </details>

      <details class="fold" data-fold="statsOpen" ${s.ui.statsOpen ? 'open' : ''}>
        <summary>📊 Häsiýetnamalar <span class="pill" id="statCount"></span><span class="chev">▼</span></summary>
        <div class="fold-body"><div class="tiles">
        ${tile('🔥', s.streak, 'Yzygiderlik (gün)')}
        ${tile('🏅', s.bestStreak, 'Iň uzyn yzygiderlik')}
        ${tile('📚', `${done}/${all.length}`, 'Tamamlanan derejeler')}
        ${tile('🌟', `${stars}/${all.length * 3}`, 'Ýyldyzlar')}
        ${tile('🎯', accuracy + '%', 'Takyklyk')}
        ${tile('✅', `${s.stats.correct}/${s.stats.answered}`, 'Dogry / jemi jogap')}
        ${tile('💯', s.stats.perfectLessons, 'Ýalňyşsyz sapaklar')}
        ${tile('⏱️', U.fmtSeconds(s.stats.timeSpentSec), 'Öwrenmäge sarp edilen wagt')}
        </div></div>
      </details>

      ${mistakesHtml}

      <div class="two-col">
        <div class="card">
          <h3>Soňky 7 günüň işjeňligi</h3>
          <div class="chart">
            ${days.map(d => `<div class="chart-col"><div class="chart-val">${d.xp}</div>
              <div class="chart-bar" style="height:${Math.round((d.xp / maxXp) * 100)}%"></div>
              <div class="chart-label">${d.label}</div></div>`).join('')}
          </div>
        </div>
        <div class="card">
          <h3>Bölümler boýunça ösüş</h3>
          ${unitRows}
        </div>
      </div>

      <details class="fold" data-fold="badgesOpen" ${s.ui.badgesOpen ? 'open' : ''}>
        <summary>🏅 Nyşanlar <span class="pill">${gotCount}/${App.ACHIEVEMENTS.length}</span><span class="chev">▼</span></summary>
        <div class="fold-body"><div class="badges">
          ${App.ACHIEVEMENTS.map(a => {
            const got = s.achievements[a.id];
            return `<div class="badge ${got ? 'got' : ''}" title="${U.esc(a.desc)}">
              <div class="badge-icon">${got ? a.icon : '🔒'}</div>
              <div><b>${a.title}</b><div class="muted small">${a.desc}${got ? ' · ' + U.fmtDate(got) : ''}</div></div></div>`;
          }).join('')}
        </div></div>
      </details>

      <div class="card danger-zone">
        <h3>Howply zona</h3>
        <p class="muted">Ähli ösüşi, XP-ni we reýtingi pozýar. Bu hereketi yzyna gaýtaryp bolmaýar.</p>
        <button class="btn danger" id="resetBtn">Ösüşi doly pozmak</button>
      </div>`;

    // Janlaryň dikelişini her sekuntda täzelemek
    const mmss = ms => `${Math.floor(ms / 60000)}:${U.pad(Math.floor((ms % 60000) / 1000))}`;
    const shownHearts = s.hearts;
    function tickHearts() {
      st.regenHearts();
      if (s.hearts !== shownHearts) { st.save(); return App.render(); }
      const left = st.nextHeartIn();
      const missing = R.HEARTS_MAX - s.hearts;
      el.querySelector('#nextHeart').textContent = missing > 0 ? mmss(left) : 'Janlar doly';
      el.querySelector('#fullHearts').textContent = missing > 0
        ? U.fmtDuration(left + (missing - 1) * R.HEART_REGEN_MIN * 60000 + 59999) : '✔';
    }
    tickHearts();
    const heartTimer = setInterval(tickHearts, 1000);
    App.onLeave(() => clearInterval(heartTimer));

    // Häsiýetnamalaryň sany (tile goşulsa awtomatik üýtgeýär)
    el.querySelector('#statCount').textContent = el.querySelectorAll('details[data-fold="statsOpen"] .tile').length;

    // Açylyp-ýapylýan bölekleriň ýagdaýyny ýatda saklamak
    el.querySelectorAll('details[data-fold]').forEach(d => d.addEventListener('toggle', () => {
      s.ui[d.dataset.fold] = d.open;
      st.save();
    }));

    // Profil suraty: ýüklemek we aýyrmak
    const photoFile = el.querySelector('#photoFile');
    el.querySelector('#photoBtn').addEventListener('click', () => photoFile.click());
    photoFile.addEventListener('change', async () => {
      try {
        s.user.photo = await App.readPhoto(photoFile.files[0]);
        st.save();
        U.toast('Surat ýüklendi');
        App.render();
      } catch (e) {
        U.toast(e.message);
      }
    });
    const del = el.querySelector('#photoDel');
    if (del) del.addEventListener('click', () => {
      s.user.photo = null;
      st.save();
      App.render();
    });

    let avatar = s.user.avatar;
    el.querySelector('#editBtn').addEventListener('click', () => {
      const box = el.querySelector('#editBox');
      box.hidden = !box.hidden;
    });
    App.bindAvatarPicker(el.querySelector('#editBox'), a => { avatar = a; });
    el.querySelector('#saveBtn').addEventListener('click', () => {
      const name = el.querySelector('#nameInp').value.trim();
      if (!name) return U.toast('Ady boş goýup bolmaýar');
      s.user.name = name;
      s.user.avatar = avatar;
      st.save();
      U.toast('Profil ýatda saklandy');
      App.render();
    });
    el.querySelector('#resetBtn').addEventListener('click', async () => {
      if (await U.confirm('Ähli XP, derejeler, reýting we nyşanlar pozular. Bu hereketi yzyna gaýtaryp bolmaýar.', { title: '⚠ Ähli ösüşi pozmak?', okText: 'Hawa, poz', danger: true })) {
        st.reset();
        location.hash = '#/home';
        App.render();
      }
    });
  }
};
