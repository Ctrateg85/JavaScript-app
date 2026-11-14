// Sapak (dereje) geçmek
//
// Düzgünler:
//  * Ýalňyş jogap üçin 1 jan (❤️) aýrylýar we sorag sapagyň ahyrynda gaýtadan berilýär.
//  * Janlar gutarsa sapak şowsuz tamamlanýar, XP berilmeýär.
//  * Ähli soraglara dogry jogap berlende dereje tamamlanýar we indiki dereje açylýar.
window.App = window.App || {};
App.views = App.views || {};

App.views.lesson = {
  render(el, params) {
    const U = App.util, R = App.RULES, st = App.store, s = st.state;
    const lvl = App.findLevel(params[0]);

    if (!lvl || !st.isUnlocked(lvl.id)) {
      el.innerHTML = `<div class="card narrow center"><h2>🔒 Bu dereje entek ýapyk</h2>
        <p>Öňki derejeleri tamamlaň.</p><a class="btn" href="#/home">Yza</a></div>`;
      return;
    }
    if (s.hearts <= 0) {
      el.innerHTML = noHeartsHtml();
      return;
    }

    // Soraglary taýýarlamak: jogap wariantlaryny garyşdyrýarys
    const queue = lvl.questions.map((q, i) => {
      if (q.type !== 'choice') return { ...q, idx: i, retry: false };
      const order = U.shuffle(q.options.map((_, k) => k));
      return { ...q, idx: i, retry: false, options: order.map(k => q.options[k]), answer: order.indexOf(q.answer) };
    });
    const total = queue.length;
    const wrongOnce = new Set();
    let solved = 0, mistakes = 0, current = null, selected = null, phase = 'answer';
    const startedAt = Date.now();

    function noHeartsHtml() {
      return `<div class="card narrow center">
        <div class="huge">💔</div>
        <h2>Janlaryňyz gutardy</h2>
        <p>Indiki jan ${U.fmtDuration(st.nextHeartIn())} soň dikeler. Şu wagt ensiklopediýany okap bilersiňiz.</p>
        <div class="row center gap">
          <a class="btn" href="#/home">Baş sahypa</a>
          <a class="btn primary" href="#/encyclopedia/${lvl.unit.chapter}">📖 Okamak</a>
        </div></div>`;
    }

    function showQuestion() {
      current = queue.shift();
      selected = null;
      phase = 'answer';
      const pct = Math.round((solved / total) * 100);
      el.innerHTML = `
        <div class="lesson">
          <div class="lesson-top">
            <button class="btn ghost" id="quit" title="Çykmak">✕</button>
            <div class="bar grow"><div style="width:${pct}%"></div></div>
            <span class="stat">❤️ ${s.hearts}</span>
          </div>
          <div class="muted small">${U.esc(lvl.unit.title)} · ${U.esc(lvl.title)}
            ${current.retry ? '<span class="pill warn">Gaýtalama</span>' : ''}</div>
          <h2 class="q-text">${U.esc(current.q)}</h2>
          ${current.code ? `<pre class="code">${U.esc(U.noSemi(current.code))}</pre>` : ''}
          <div id="answerArea">${answerHtml(current)}</div>
          <div class="feedback" id="feedback" hidden></div>
          <div class="lesson-bottom">
            <button class="btn primary big" id="checkBtn" disabled>Barla</button>
          </div>
        </div>`;

      el.querySelector('#quit').addEventListener('click', async () => {
        if (await U.confirm('Netije saklanmaz.', { title: 'Sapakdan çykmak isleýärsiňizmi?', okText: 'Çyk', danger: true })) location.hash = '#/home';
      });
      if (current.type === 'choice') {
        el.querySelectorAll('.option').forEach(b => b.addEventListener('click', () => pick(+b.dataset.i)));
      } else {
        const inp = el.querySelector('#answerInput');
        inp.addEventListener('input', () => { el.querySelector('#checkBtn').disabled = !inp.value.trim(); });
        inp.focus();
      }
      el.querySelector('#checkBtn').addEventListener('click', onButton);
    }

    function answerHtml(q) {
      if (q.type === 'choice') {
        return `<div class="options">${q.options.map((o, i) =>
          `<button class="option" data-i="${i}"><span class="key">${i + 1}</span><span>${U.esc(U.noSemi(o))}</span></button>`).join('')}</div>`;
      }
      return `<input id="answerInput" class="answer-input" autocomplete="off" spellcheck="false" placeholder="Jogabyňyzy ýazyň...">`;
    }

    function pick(i) {
      if (phase !== 'answer') return;
      selected = i;
      el.querySelectorAll('.option').forEach(b => b.classList.toggle('selected', +b.dataset.i === i));
      el.querySelector('#checkBtn').disabled = false;
    }

    function isCorrect() {
      if (current.type === 'choice') return selected === current.answer;
      const strip = v => U.normalize(v).replace(/^'(.*)'$/, '$1');
      const given = strip(el.querySelector('#answerInput').value);
      return current.answers.some(a => strip(a) === given);
    }

    function correctText() {
      return current.type === 'choice' ? current.options[current.answer] : current.answers[0];
    }

    function onButton() {
      if (phase === 'answer') check(); else next();
    }

    function check() {
      if (current.type === 'choice' && selected === null) return;
      if (current.type === 'input' && !el.querySelector('#answerInput').value.trim()) return;
      phase = 'feedback';
      const ok = isCorrect();
      s.stats.answered++;
      st.recordAnswer(lvl.unit.id, ok, { where: 'lesson', q: current.q, code: current.code, answer: correctText() });
      const fb = el.querySelector('#feedback');
      const explain = s.settings.explain && current.explain ? `<div>${U.esc(current.explain)}</div>` : '';

      if (ok) {
        s.stats.correct++;
        solved++;
        U.sfx('ok');
        fb.className = 'feedback ok';
        fb.innerHTML = `<b>✅ Dogry!</b>${explain}`;
      } else {
        mistakes++;
        wrongOnce.add(current.idx);
        st.loseHeart();
        U.sfx('bad');
        queue.push({ ...current, retry: true });
        fb.className = 'feedback bad';
        fb.innerHTML = `<b>❌ Ýalňyş.</b> Dogry jogap: <code>${U.esc(U.noSemi(correctText()))}</code>${explain}`;
      }
      fb.hidden = false;

      if (current.type === 'choice') {
        el.querySelectorAll('.option').forEach(b => {
          const i = +b.dataset.i;
          b.disabled = true;
          if (i === current.answer) b.classList.add('correct');
          else if (i === selected) b.classList.add('wrong');
        });
      } else {
        el.querySelector('#answerInput').disabled = true;
      }
      el.querySelector('.lesson-top .bar div').style.width = Math.round((solved / total) * 100) + '%';
      el.querySelector('.lesson-top .stat').textContent = `❤️ ${s.hearts}`;
      const btn = el.querySelector('#checkBtn');
      btn.textContent = 'Dowam et';
      btn.disabled = false;
      btn.focus();
      App.updateHeader();
      st.save();
    }

    function next() {
      if (s.hearts <= 0) return fail();
      if (queue.length === 0) return finish();
      showQuestion();
    }

    function spentSec() { return Math.round((Date.now() - startedAt) / 1000); }

    function fail() {
      s.stats.timeSpentSec += spentSec();
      st.save();
      el.innerHTML = noHeartsHtml();
    }

    function finish() {
      const prev = s.progress[lvl.id];
      const replay = !!prev;
      const perfect = mistakes === 0;
      const firstTry = total - wrongOnce.size;

      // XP hasaplamak
      // Liga aralygyndan: ilkinji synanyşykdaky dogry jogaplaryň paýyna görä
      const lg = window.LEAGUES[s.league.index];
      const [lo, hi] = lg.xp;
      const parts = [];
      parts.push([`Dereje tamamlandy (${lg.icon} ${lo}–${hi} XP, ilkinji synanyşykda ${firstTry}/${total} dogry)`,
        lo + Math.round((hi - lo) * firstTry / total)]);
      if (perfect) parts.push(['Ýalňyşsyz bonus', R.XP_PERFECT_BONUS]);
      let xp = parts.reduce((a, p) => a + p[1], 0);
      if (replay) {
        // Gaýtalama: XP ýarym; şol bir dereje üçin günde REPLAY_DAILY gezekden soň XP berilmeýär
        const allowed = st.replayAllowed(lvl.id);
        const reduced = allowed ? Math.round(xp * R.REPLAY_FACTOR) : 0;
        parts.push([allowed ? `Gaýtadan geçmek (×${R.REPLAY_FACTOR})` : `Gaýtalamanyň gündelik çägi (${R.REPLAY_DAILY} gezek) doldy`, reduced - xp]);
        xp = reduced;
        st.countReplay(lvl.id);
      }
      const streakBonus = st.streakBonusIfFirstToday();
      if (streakBonus) { parts.push(['Günüň ilkinji sapagy (yzygiderlik bonusy)', streakBonus]); xp += streakBonus; }

      const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
      s.progress[lvl.id] = {
        stars: Math.max(stars, prev ? prev.stars : 0),
        bestMistakes: Math.min(mistakes, prev ? prev.bestMistakes : Infinity),
        completedAt: prev ? prev.completedAt : App.clock.now(),
        plays: (prev ? prev.plays : 0) + 1
      };
      s.stats.lessonsDone++;
      if (perfect) s.stats.perfectLessons++;
      s.stats.timeSpentSec += spentSec();
      let heartMsg = '';
      if (replay && perfect && s.hearts < R.HEARTS_MAX) { st.gainHeart(1); heartMsg = '<p>❤️ Ýalňyşsyz gaýtalama üçin +1 jan!</p>'; }
      st.addXp(xp);
      App.updateHeader();
      U.sfx('win');

      const all = App.allLevels();
      const nextLvl = all[all.findIndex(l => l.id === lvl.id) + 1];
      el.innerHTML = `
        <div class="card narrow center">
          <div class="huge">${perfect ? '🏆' : '🎉'}</div>
          <h2>Dereje tamamlandy!</h2>
          <div class="stars-big">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
          <p class="muted">${U.esc(lvl.title)} · ýalňyşlyk: ${mistakes} · wagt: ${U.fmtSeconds(spentSec())}</p>
          <table class="xp-table">
            ${parts.map(p => `<tr><td>${p[0]}</td><td>${p[1] >= 0 ? '+' : ''}${p[1]} XP</td></tr>`).join('')}
            <tr class="total"><td>Jemi</td><td>+${xp} XP</td></tr>
          </table>
          ${heartMsg}
          <div class="row center gap mt">
            <a class="btn" href="#/home">Baş sahypa</a>
            <button class="btn" id="again">Gaýtadan</button>
            ${nextLvl ? `<a class="btn primary" href="#/lesson/${nextLvl.id}">Indiki dereje ▶</a>` : ''}
          </div>
        </div>`;
      el.querySelector('#again').addEventListener('click', () => App.render());
    }

    // Klawiatura: 1-4 — wariant saýlamak, Enter — barlamak / dowam etmek
    function onKey(e) {
      const btn = el.querySelector('#checkBtn');
      if (!btn) return;
      if (e.key === 'Enter' && !btn.disabled) { e.preventDefault(); onButton(); }
      if (current && current.type === 'choice' && phase === 'answer' && /^[1-9]$/.test(e.key)) {
        const i = +e.key - 1;
        if (i < current.options.length) pick(i);
      }
    }
    document.addEventListener('keydown', onKey);
    App.onLeave(() => document.removeEventListener('keydown', onKey));

    showQuestion();
  }
};
