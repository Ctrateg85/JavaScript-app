// 1×1 Duel: ulanyjy bot bilen bir wagtda şol bir soraglara jogap berýär
//
// Düzgünler:
//  * 7 tapgyr. Güýçli botlar bilen her tapgyryň başynda oýlanmak wagty bar (personas.js → readSec:
//    Opus 5.5 — 1 s, Fable 5.1 — 2 s, beýlekilerde ýok); bu wagtda hiç kim jogap berip bilmeýär,
//    soň jogap bermek üçin 15 sekunt.
//  * Jogap üçin aýratyn düwme ýok: bot jogap berýänçä saýlawy üýtgedip bolýar, bot jogap beren pursady
//    (ýa-da wagt gutaranda) soňky saýlaw kabul edilýär.
//  * Dogry jogap: 10 bal + çaltlyk bonusy (galan sekunt / 3, ýokary tegelekläp; iň köp 5).
//  * Ýalňyş jogap ýa-da wagt gutarsa: 0 bal.
//  * Soraglar ulanyjynyň geçen derejelerinden alynýar; güýçli botlar has kyn (soňky) derejelerden sorag berýär.
//  * Reýting 0-dan başlaýar. Ýeňiş: Haiku 5.5 +10…15, Sonnet 5.5 +14…18, Opus 5.5 +18…23, Fable 5.1 +23…27;
//    utulyş: Haiku 5.5 −5…10, Sonnet 5.5 −7…11, Opus 5.5 −9…14, Fable 5.1 −11…13; deňme-deň 0. XP hem berilýär.
//  * Duelden ortasynda çykylsa, utulyş hasaplanýar.
window.App = window.App || {};
App.views = App.views || {};

App.views.duel = {
  render(el) {
    const U = App.util, R = App.RULES, st = App.store, s = st.state;
    const myAv = App.avatarHtml(s.user);

    // ---------- Lobbi ----------
    function lobby() {
      const d = s.duel;
      const hist = d.history.length ? d.history.slice(0, 10).map(h => {
        const res = { win: '🏆 Ýeňiş', loss: '❌ Utulyş', draw: '🤝 Deňme-deň' }[h.result];
        return `<tr><td>${U.fmtDate(h.at)}</td><td>${h.botAvatar} ${U.esc(h.botName)}</td><td>${h.my} : ${h.bot}</td><td>${res}</td>
          <td class="${h.delta >= 0 ? 'pos' : 'neg'}">${h.delta >= 0 ? '+' : ''}${h.delta}</td></tr>`;
      }).join('') : '<tr><td colspan="5" class="muted">Şu hepde entek duel geçirilmedi.</td></tr>';

      const rank = App.duelRank(d.rating);
      el.innerHTML = `
        <h1>⚔️ 1×1 Duel</h1>
        <div class="card">
          <div class="row between wrap">
            <div class="row gap"><span class="big-emoji">${myAv}</span>
              <div><b>${U.esc(s.user.name)}</b><div class="muted">Duel reýtingi: <b>${d.rating}</b> · ${rank.icon} <b>${rank.title}</b></div></div></div>
            <div class="muted">🏆 ${d.wins} · 🤝 ${d.draws} · ❌ ${d.losses}</div>
          </div>
          <div class="bar mt"><div style="width:${rank.pct}%"></div></div>
          <div class="muted small">${rank.next ? `${rank.next.icon} ${rank.next.title} derejesine çenli ${rank.next.min - d.rating} reýting` : 'Iň ýokary dereje!'}</div>
          <div class="rank-steps">${App.DUEL_RANKS.map((r, i) => {
            const nxt = App.DUEL_RANKS[i + 1];
            return `<span class="rank-step ${r.title === rank.title ? 'on' : ''}">${r.icon} ${r.title}<small>${r.min}${nxt ? '–' + (nxt.min - 1) : '+'}</small></span>`;
          }).join('')}</div>
        </div>
        <p class="muted">Garşydaşyňyzy saýlaň. ${R.DUEL_ROUNDS} sorag, her soraga jogap üçin ${R.DUEL_ROUND_SEC} sekunt.
          Güýçli botlar bilen her soragyň başynda oýlanmak wagty bar (bu wagtda siz hem, bot hem jogap berip bilmeýär):
          ${window.DUEL_BOTS.filter(b => b.readSec).map(b => `${U.esc(b.name)} — ${b.readSec} s`).join(', ')}.
          Dogry jogap — ${R.DUEL_BASE_POINTS} bal we çalt jogap üçin 5 bala çenli bonus.</p>
        <div class="card soft small">📚 Soraglar geçen sapaklaryňyzdan alynýar: <b>${U.esc(poolInfo().text)}</b>.
          Güýçli botlar şolaryň has kyn (soňky) derejelerinden sorag berýär.</div>
        <div class="bot-grid">
          ${window.DUEL_BOTS.map(b => `<div class="card bot-card">
              <div class="bot-avatar">${b.avatar}</div>
              <h3>${U.esc(b.name)}</h3>
              <div class="pill">${b.level}</div>
              <p class="muted small">${U.esc(b.desc)}</p>
              <div class="small">Soraglar: <b>${b.qLabel}</b></div>
              <div class="small">Oýlanmak wagty: <b>${b.readSec ? b.readSec + ' s' : 'ýok'}</b></div>
              <div class="small">Ýeňseňiz: <b class="pos">+${b.win[0]}…${b.win[1]}</b> · Utulsaňyz: <b class="neg">−${b.loss[0]}…${b.loss[1]}</b></div>
              <button class="btn primary full mt" data-bot="${b.id}">Ýaryşa başla</button>
            </div>`).join('')}
        </div>
        <details class="fold" data-fold="duelHistOpen" ${s.ui.duelHistOpen ? 'open' : ''}>
          <summary>📜 Soňky duellar <span class="muted small">(şu hepde)</span> <span class="pill">${d.history.length}</span><span class="chev">▼</span></summary>
          <div class="fold-body">
            <table class="history-table"><tr><th>Sene</th><th>Garşydaş</th><th>Hasap</th><th>Netije</th><th>Reýting</th></tr>${hist}</table>
            <p class="muted small mt">🗓 Bu sanawda diňe şu hepdäniň duellary görkezilýär — taryh her duşenbe 00:00-da arassalanýar
              (ýeňiş/utulyş sanlary we reýting saklanýar).<br>Duel reýtingi 0-dan başlaýar. Ýeňiş üçin botuň güýjüne görä
              ${window.DUEL_BOTS.map(b => `${U.esc(b.name)} +${b.win[0]}…${b.win[1]}`).join(', ')}; utulyş üçin
              ${window.DUEL_BOTS.map(b => `${U.esc(b.name)} −${b.loss[0]}…${b.loss[1]}`).join(', ')};
              deňme-deň ${R.DUEL_DRAW_RATING}. Reýting 0-dan aşak düşmeýär.</p>
          </div>
        </details>`;
      el.querySelector('details[data-fold]').addEventListener('toggle', e => {
        s.ui.duelHistOpen = e.target.open;
        st.save();
      });
      el.querySelectorAll('[data-bot]').forEach(b => b.addEventListener('click', () => start(window.DUEL_BOTS.find(x => x.id === b.dataset.bot))));
    }

    // Duel üçin derejeler: geçilen we häzirki açyk derejeler.
    // Soraglar az bolsa (meselem, ilkinji sapakda), indiki derejeler bilen doldurylýar.
    function poolLevels() {
      const all = App.allLevels();
      const levels = all.filter(l => st.isUnlocked(l.id));
      const choices = () => levels.reduce((a, l) => a + l.questions.filter(q => q.type === 'choice').length, 0);
      // Her bota aýratyn kynlyk zolagy ýetik bolar ýaly, iň az 4 × 7 sorag
      for (const l of all) {
        if (choices() >= R.DUEL_ROUNDS * 4) break;
        if (!levels.includes(l)) levels.push(l);
      }
      return levels.sort((a, b) => a.order - b.order);
    }

    function poolInfo() {
      const levels = poolLevels();
      const units = [...new Set(levels.map(l => l.unitIndex + 1))];
      const text = units.length === 1 ? `${units[0]}-nji bölüm` : `${units[0]}–${units[units.length - 1]}-nji bölümler`;
      return { levels, text: `${text}, ${levels.length} dereje` };
    }

    // Soragyň kynlygy (0 — iň aňsat, 1 — iň kyn):
    //   bölümdäki derejesi (1–10), bölümiň özi (1–12), koduň bardygy we uzynlygy
    function difficulty(q, l) {
      const lines = q.code ? q.code.split('\n').length : 0;
      return 0.45 * (l.levelIndex / 9) + 0.2 * (l.unitIndex / 11) + (q.code ? 0.15 : 0) + 0.2 * Math.min(1, lines / 8);
    }
    App.duelDifficulty = difficulty;

    // Kynlygy 4 nokat bilen görkezmek: ●○○○ aňsat … ●●●● iň kyn
    function diffDots(d) {
      const n = 1 + Math.min(3, Math.floor((d || 0) * 4));
      const names = ['Aňsat', 'Orta', 'Kyn', 'Iň kyn'];
      return `<span class="diff-dots d${n}" title="Soragyň kynlygy">${'●'.repeat(n)}${'○'.repeat(4 - n)} ${names[n - 1]}</span>`;
    }

    // Botyň kynlygyna görä soraglar: soraglar kynlygy boýunça tertiplenýär we botyň "questions" zolagyndan saýlanýar
    function buildQuestions(bot) {
      const pool = poolLevels()
        .flatMap(l => l.questions.filter(q => q.type === 'choice').map(q => ({ ...q, unitId: l.unit.id, diff: difficulty(q, l) })))
        .sort((a, b) => a.diff - b.diff);
      const n = pool.length;
      const end = Math.max(R.DUEL_ROUNDS, Math.ceil(n * bot.questions[1]));
      const begin = Math.min(Math.floor(n * bot.questions[0]), Math.max(0, end - R.DUEL_ROUNDS));
      return U.shuffle(pool.slice(begin, end)).slice(0, R.DUEL_ROUNDS).map(q => {
        const order = U.shuffle(q.options.map((_, k) => k));
        return { ...q, options: order.map(k => q.options[k]), answer: order.indexOf(q.answer) };
      });
    }

    // ---------- Ýaryş ----------
    let timer = null;
    let match = null;

    function start(bot) {
      match = { bot, questions: buildQuestions(bot), round: 0, my: 0, botScore: 0, finished: false, log: [] };
      // Duel başlandy: programma ýapylsa, indiki açylanda utulyş hasaplanar (store.js → applyAbandonedDuel)
      s.duel.active = { botId: bot.id, at: App.clock.now() };
      st.save();
      countdown(3);
    }

    function countdown(n) {
      el.innerHTML = `<div class="card narrow center"><div class="vs">
          <div><div class="big-emoji">${myAv}</div><b>${U.esc(s.user.name)}</b><div class="muted">${s.duel.rating}</div></div>
          <div class="vs-text">VS</div>
          <div><div class="big-emoji">${match.bot.avatar}</div><b>${U.esc(match.bot.name)}</b><div class="muted">${match.bot.level}</div></div>
        </div><div class="huge">${n}</div></div>`;
      timer = setTimeout(() => n > 1 ? countdown(n - 1) : round(), 800);
    }

    // Tapgyrlaryň netijesi nokatlar görnüşinde: ✓ — dogry, ✗ — ýalňyş
    function dotsHtml(side) {
      return `<div class="dots">${match.questions.map((_, i) => {
        const r = match.log[i];
        if (!r) return `<span class="dot ${i === match.round ? 'now' : ''}"></span>`;
        return r[side].ok ? '<span class="dot ok">✓</span>' : '<span class="dot bad">✗</span>';
      }).join('')}</div>`;
    }

    // Ýaryşyjynyň kartoçkasy (sahypanyň aşagynda): ady, jemi bal, tapgyrlar we häzirki ýagdaýy
    function playerBox(id, side, avatar, name, score) {
      return `<div class="player-box wait" id="${id}">
        <span class="pb-av">${avatar}</span>
        <div class="pb-main">
          <div class="pb-name">${U.esc(name)}</div>
          <div class="pb-text">Pikirlenýär...</div>
          <div class="pb-dots" data-side="${side}">${dotsHtml(side)}</div>
        </div>
        <div class="pb-right"><span class="pb-pts"></span><b class="pb-total">${score}</b><span class="muted small">bal</span></div>
      </div>`;
    }

    // Oýnuňyň tapgyrdaky netijesini görkezmek
    function setBox(id, cls, text, pts) {
      const box = el.querySelector('#' + id);
      box.className = 'player-box ' + cls;
      box.querySelector('.pb-text').innerHTML = text;
      box.querySelector('.pb-pts').textContent = pts === null ? '' : (pts > 0 ? '+' + pts : '0');
    }

    function round() {
      const q = match.questions[match.round];
      const bot = match.bot;
      const startedAt = Date.now();
      const read = (bot.readSec || 0) * 1000;           // botuň oýlanmak (okamak) wagty: jogap bermek gadagan
      const limit = read + R.DUEL_ROUND_SEC * 1000;
      let open = false;
      // Botyň meýilnamasy: haçan we näme jogap berjekdigi (okamak wagtyndan soň)
      const botTime = read + (bot.minSec + Math.random() * (bot.maxSec - bot.minSec)) * 1000;
      // Botyň takyklygy soragyň kynlygyna bagly: aňsat soragda +15 %, iň kyn soragda −15 %
      const botAcc = Math.min(0.98, Math.max(0.2, bot.accuracy + 0.15 - 0.3 * (q.diff || 0)));
      const botCorrect = Math.random() < botAcc;
      const wrongs = q.options.map((_, i) => i).filter(i => i !== q.answer);
      const botChoice = botCorrect ? q.answer : wrongs[Math.floor(Math.random() * wrongs.length)];
      let me = null, botDone = false;

      el.innerHTML = `
        <div class="duel">
          <div class="row between muted"><span id="phase" class="phase-read">📖 Oýlanyň: ${bot.readSec} s</span><span>${diffDots(q.diff)} · Sorag ${match.round + 1} / ${match.questions.length}</span></div>
          <div class="bar timer reading"><div id="timeBar" style="width:0%"></div></div>
          <h2 class="q-text">${U.esc(q.q)}</h2>
          ${q.code ? `<pre class="code">${U.esc(U.noSemi(q.code))}</pre>` : ''}
          <div class="options locked">${q.options.map((o, i) =>
            `<button class="option" data-i="${i}" disabled><span class="key">${i + 1}</span><span>${U.esc(U.noSemi(o))}</span><span class="marks"></span></button>`).join('')}</div>
          <div class="duel-confirm" id="confirmWrap">
            <span class="muted small" id="confirmHint">Wariant saýlaň — ${U.esc(bot.name)} jogap berýänçä saýlawy üýtgedip bilersiňiz.</span>
          </div>
          <div class="round-verdict" id="verdict" hidden></div>
          <div class="duel-next" id="nextWrap" hidden><button class="btn primary" id="nextBtn"></button></div>
          <div class="duel-status">
            ${playerBox('meBox', 'me', myAv, s.user.name, match.my)}
            ${playerBox('botBox', 'bot', bot.avatar, bot.name, match.botScore)}
          </div>
        </div>`;

      // Wagt okamak döwründen soň hasaplanýar
      const points = t => R.DUEL_BASE_POINTS + Math.min(5, Math.ceil((R.DUEL_ROUND_SEC - (t - read) / 1000) / 3));
      const secAfterRead = t => ((t - read) / 1000).toFixed(1) + ' s';

      // Wariant basylanda saýlanýar. Bot jogap berýänçä saýlawy üýtgedip bolýar;
      // bot jogap beren pursady (ýa-da wagt gutaranda) soňky saýlaw awtomatik kabul edilýär.
      // Bot eýýäm jogap beren bolsa, basylan wariant derrew kabul edilýär.
      // Çaltlyk bonusy soňky saýlawyň wagtyna görä hasaplanýar.
      let pick = null, pickT = 0;
      function choose(i) {
        if (me || !open) return;
        pick = i;
        pickT = Date.now() - startedAt;
        el.querySelectorAll('.option').forEach(b => b.classList.toggle('selected', +b.dataset.i === i));
        if (botDone) { answer(); return; }
        el.querySelector('#confirmHint').textContent = `Saýlandy: ${i + 1}-nji wariant. ${bot.name} jogap berýänçä başga wariante basyp üýtgedip bilersiňiz.`;
        setBox('meBox', 'wait', `Saýlady · ${secAfterRead(pickT)} <span class="muted small">(üýtgedip bolýar)</span>`, null);
      }

      // Saýlanan jogaby kabul etmek
      function answer() {
        if (me || pick === null) return;
        const t = Math.min(pickT, limit);
        me = { i: pick, t, ok: pick === q.answer };
        el.querySelectorAll('.option').forEach(b => { b.disabled = true; });
        el.querySelector('#confirmWrap').hidden = true;
        // Netije bot hem jogap berenden soň açylýar
        setBox('meBox', 'wait', `Jogap berdi · ${secAfterRead(t)}`, null);
      }
      el.querySelectorAll('.option').forEach(b => b.addEventListener('click', () => choose(+b.dataset.i)));
      keyHandler = e => {
        if (/^[1-9]$/.test(e.key) && +e.key <= q.options.length) choose(+e.key - 1);
      };
      setBox('meBox', 'wait', 'Soragy okaýar...', null);
      setBox('botBox', 'wait', 'Soragy okaýar...', null);

      // Jogap bermek döwrüni açmak: wariantlar açylýar, taýmer başlaýar
      function openRound(silent) {
        open = true;
        el.querySelector('#timeBar').parentElement.classList.remove('reading');
        el.querySelector('.options').classList.remove('locked');
        el.querySelectorAll('.option').forEach(b => { b.disabled = false; });
        el.querySelector('#phase').className = 'phase-go';
        el.querySelector('#phase').textContent = '✍️ Jogap beriň!';
        setBox('meBox', 'wait', 'Pikirlenýär...', null);
        setBox('botBox', 'wait', 'Pikirlenýär...', null);
        if (!silent) U.sfx('tick');
      }
      // Oýlanmak wagty ýok bolsa (Haiku, Sonnet) — derrew jogap berip bolýar
      if (!read) openRound(true);

      timer = setInterval(() => {
        const t = Date.now() - startedAt;
        const bar = el.querySelector('#timeBar');
        if (!open) {
          // Oýlanmak wagty: zolak dolýar, wariantlar ýapyk
          bar.style.width = Math.min(100, (t / read) * 100) + '%';
          el.querySelector('#phase').textContent = `📖 Oýlanyň: ${Math.max(1, Math.ceil((read - t) / 1000))} s`;
          if (t >= read) openRound();
          return;
        }
        bar.style.width = Math.max(0, 100 - ((t - read) / (limit - read)) * 100) + '%';
        if (!botDone && t >= botTime) {
          botDone = true;
          setBox('botBox', 'wait', `Jogap berdi · ${secAfterRead(botTime)}`, null);
          // Bot jogap berdi: ulanyjynyň saýlawy berkidilýär
          if (pick !== null) answer();
          else el.querySelector('#confirmHint').textContent = `${bot.name} jogap berdi — indi basan wariantyňyz derrew kabul ediler.`;
        }
        if (t >= limit && pick !== null) answer();   // wagt gutardy: saýlanan wariant kabul edilýär
        if ((me && botDone) || t >= limit) {
          clearInterval(timer);
          el.querySelector('#confirmWrap').hidden = true;
          reveal();
        }
      }, 100);

      function reveal() {
        keyHandler = null;
        const myOk = !!(me && me.ok), botOk = botDone && botCorrect;
        const myPts = myOk ? points(me.t) : 0;
        const botPts = botOk ? points(botTime) : 0;
        match.my += myPts;
        match.botScore += botPts;
        st.recordAnswer(q.unitId, myOk, { where: 'duel', q: q.q, code: q.code, answer: q.options[q.answer] });
        match.log.push({
          q, me: { ok: myOk, pts: myPts, choice: me ? me.i : null, t: me ? me.t : null },
          bot: { ok: botOk, pts: botPts, choice: botDone ? botChoice : null, t: botDone ? botTime : null }
        });

        // Wariantlarda kimiň näme saýlandygyny bellemek
        el.querySelectorAll('.option').forEach(b => {
          const i = +b.dataset.i;
          b.disabled = true;
          b.classList.remove('selected');
          if (i === q.answer) b.classList.add('correct');
          else if ((me && i === me.i) || (botDone && i === botChoice)) b.classList.add('wrong');
          const marks = [];
          if (me && i === me.i) marks.push(`<span class="mark ${myOk ? 'ok' : 'bad'}">${myAv} Siz</span>`);
          if (botDone && i === botChoice) marks.push(`<span class="mark ${botOk ? 'ok' : 'bad'}">${bot.avatar} ${U.esc(bot.name)}</span>`);
          b.querySelector('.marks').innerHTML = marks.join('');
        });

        setBox('meBox', myOk ? 'ok' : 'bad',
          !me ? '⏰ Wagt gutardy — jogap bermediňiz'
            : myOk ? `✅ Dogry jogap · ${secAfterRead(me.t)}` : `❌ Ýalňyş: «${U.esc(U.noSemi(q.options[me.i]))}»`, myPts);
        setBox('botBox', botOk ? 'ok' : 'bad',
          !botDone ? '⏰ Wagt gutardy — jogap bermedi'
            : botOk ? `✅ Dogry jogap · ${secAfterRead(botTime)}` : `❌ Ýalňyş: «${U.esc(U.noSemi(q.options[botChoice]))}»`, botPts);

        const verdict = el.querySelector('#verdict');
        verdict.hidden = false;
        verdict.innerHTML = myPts > botPts ? '<span class="pos">Bu tapgyry siz utduňyz!</span>'
          : myPts < botPts ? `<span class="neg">Bu tapgyry ${U.esc(bot.name)} utdy</span>`
          : myOk ? 'Ikiňiz hem dogry jogap berdiňiz — deň bal' : '<span class="muted">Hiç kim bal almady</span>';

        el.querySelector('#meBox .pb-total').textContent = match.my;
        el.querySelector('#botBox .pb-total').textContent = match.botScore;
        el.querySelectorAll('.pb-dots').forEach(d => { d.innerHTML = dotsHtml(d.dataset.side); });
        U.sfx(myOk ? 'ok' : 'bad');

        match.round++;
        const last = match.round >= match.questions.length;
        const go = () => {
          clearTimeout(timer);
          keyHandler = null;
          last ? finish(false) : round();
        };
        const nextBtn = el.querySelector('#nextBtn');
        nextBtn.textContent = last ? 'Netijäni gör ▶' : 'Indiki sorag ▶';
        el.querySelector('#nextWrap').hidden = false;
        nextBtn.addEventListener('click', go);
        keyHandler = e => { if (e.key === 'Enter') { e.preventDefault(); go(); } };
        if (s.settings.duelAutoNext) timer = setTimeout(go, 4000);
      }
    }

    function finish(abandoned) {
      if (match.finished) return;
      match.finished = true;
      delete s.duel.active;
      const bot = match.bot;
      const result = abandoned ? 'loss' : match.my > match.botScore ? 'win' : match.my < match.botScore ? 'loss' : 'draw';
      // Reýting 0-dan aşak düşmeýär
      const pick = ([lo, hi]) => lo + Math.floor(Math.random() * (hi - lo + 1));
      const change = { win: pick(bot.win), draw: R.DUEL_DRAW_RATING, loss: -pick(bot.loss) }[result];
      const delta = Math.max(-s.duel.rating, change);
      const xp = { win: R.DUEL_WIN_XP, draw: R.DUEL_DRAW_XP, loss: R.DUEL_LOSS_XP }[result];
      s.duel.rating += delta;
      s.duel[{ win: 'wins', draw: 'draws', loss: 'losses' }[result]]++;
      s.duel.history.unshift({ at: App.clock.now(), botId: bot.id, botName: bot.name, botAvatar: bot.avatar, my: match.my, bot: match.botScore, result, delta });
      s.duel.history = s.duel.history.slice(0, 30);
      st.addXp(abandoned ? 0 : xp);
      App.updateHeader();
      if (abandoned) { U.toast('Duel taşlandy — utulyş hasaplandy'); return; }

      const title = { win: '🏆 Siz ýeňdiňiz!', draw: '🤝 Deňme-deň!', loss: '😔 Siz utuldyňyz' }[result];
      U.sfx(result === 'win' ? 'win' : result === 'loss' ? 'bad' : 'ok');
      const correctCount = side => match.log.filter(r => r[side].ok).length;
      const cell = (r, side) => {
        const x = r[side];
        if (x.choice === null) return '<span class="pill bad">⏰ Jogap ýok</span>';
        return x.ok ? `<span class="pill ok">✅ +${x.pts}</span>`
          : `<span class="pill bad">❌ 0</span><div class="muted small">${U.esc(U.noSemi(r.q.options[x.choice]))}</div>`;
      };
      el.innerHTML = `
        <div class="card duel center">
          <h1>${title}</h1>
          <div class="vs">
            <div><div class="big-emoji">${myAv}</div><div class="huge">${match.my}</div>
              <div class="muted small">${correctCount('me')} / ${match.log.length} dogry</div></div>
            <div class="vs-text">:</div>
            <div><div class="big-emoji">${bot.avatar}</div><div class="huge">${match.botScore}</div>
              <div class="muted small">${correctCount('bot')} / ${match.log.length} dogry</div></div>
          </div>
          <p>Duel reýtingi: <b>${s.duel.rating}</b> (<span class="${delta >= 0 ? 'pos' : 'neg'}">${delta >= 0 ? '+' : ''}${delta}</span>) · <b>+${xp} XP</b></p>
          <div class="row center gap">
            <button class="btn" id="toLobby">Lobbi</button>
            <button class="btn primary" id="rematch">Täzeden oýna</button>
          </div>
          <h3 class="mt">📋 Soraglar boýunça netije</h3>
          <table class="recap">
            <tr><th>#</th><th>Sorag</th><th>Dogry jogap</th><th>${myAv} Siz</th><th>${bot.avatar} ${U.esc(bot.name)}</th></tr>
            ${match.log.map((r, i) => `<tr>
              <td>${i + 1}</td>
              <td class="q">${U.esc(r.q.q)}${r.q.code ? `<div class="muted small"><code>${U.esc(U.noSemi(r.q.code).split('\n')[0])}${r.q.code.includes('\n') ? ' …' : ''}</code></div>` : ''}</td>
              <td><code>${U.esc(U.noSemi(r.q.options[r.q.answer]))}</code></td>
              <td>${cell(r, 'me')}</td>
              <td>${cell(r, 'bot')}</td></tr>`).join('')}
          </table>
        </div>`;
      el.querySelector('#toLobby').addEventListener('click', lobby);
      el.querySelector('#rematch').addEventListener('click', () => start(bot));
    }

    let keyHandler = null;
    const onKey = e => { if (keyHandler) keyHandler(e); };
    document.addEventListener('keydown', onKey);
    App.onLeave(() => {
      clearTimeout(timer);
      clearInterval(timer);
      document.removeEventListener('keydown', onKey);
      if (match && !match.finished) finish(true);
    });

    lobby();
  }
};
