// Lokal bölüm: şol bir Wi-Fi / ýerli tordaky adamlar bilen ýaryş (serwer bölegi: lan.py)
//
//  * Diňe JavaScript.exe (ýa-da py main.py) arkaly açylanda işleýär: oýun serweri 47822 portda.
//  * "Otag döret" — bu kompýuter host bolýar, soraglar geçen sapaklaryňyzdan alynýar.
//  * Tapylan otaglar UDP yglanlary arkaly awtomatik görünýär; tapylmasa IP salgy bilen goşulyp bolýar.
//  * Wagt we ballar host-yň serwerinde hasaplanýar: dogry jogap 10 bal + çaltlyk bonusy (iň köp 5).
//  * Oýunyň ahyrynda: 1-nji orun +15 XP, beýlekiler +5 XP.
window.App = window.App || {};
App.views = App.views || {};

App.views.lan = {
  render(el) {
    const U = App.util, st = App.store, s = st.state;
    const PORT = 47822, LOCAL = `http://127.0.0.1:${PORT}`;
    const myAv = U.esc(s.user.avatar);
    let conn = null;          // { base, pid, token, host, id }
    let timers = [];
    let shownKey = '';        // häzir görkezilýän ekran (status|tapgyr) — her soragda DOM-y täzeden çyzmazlyk üçin
    let fails = 0, last = null, picked = null;

    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    const every = (fn, ms) => timers.push(setInterval(fn, ms));
    function clearTimers() { timers.forEach(t => { clearTimeout(t); clearInterval(t); }); timers = []; }

    async function api(base, path, body) {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 3000);
      try {
        const res = await fetch(base + path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctrl.signal }
          : { cache: 'no-store', signal: ctrl.signal });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || res.status);
        return json;
      } finally { clearTimeout(t); }
    }
    const auth = () => ({ pid: conn.pid, token: conn.token });

    // ---------- Başlangyç: serwer barmy? ----------
    async function boot() {
      el.innerHTML = '<h1>🌐 Lokal</h1><div class="card muted">⏳ Ýerli tor barlanýar...</div>';
      try {
        await api(LOCAL, '/lan/hosts');
        lobby();
      } catch (e) {
        el.innerHTML = `
          <h1>🌐 Lokal</h1>
          <div class="card">
            <h3>Lokal bölüm diňe JavaScript.exe programmasynda işleýär</h3>
            <p class="muted">Ýerli tor arkaly ýaryşmak üçin programmanyň öz serweri gerek. Ony <b>JavaScript.exe</b> faýly
              (ýa-da <code>py main.py</code>) bilen açyň. Brauzerde göni açylan <code>index.html</code> ýerli tora birigip bilmeýär.</p>
            <button class="btn" id="retry">🔄 Gaýtadan barla</button>
          </div>`;
        el.querySelector('#retry').addEventListener('click', boot);
      }
    }

    // ---------- Lobbi: otag döretmek we tapylan otaglar ----------
    function lobby() {
      clearTimers();
      conn = null; shownKey = '';
      el.innerHTML = `
        <h1>🌐 Lokal</h1>
        <p class="muted">Şol bir Wi-Fi ýa-da ýerli tora birikdirilen kompýuterlerdäki dostlaryňyz bilen ýaryşyň.
          Hemmeler şol bir soraglara wagta garşy jogap berýär.</p>
        <div class="two-col">
          <div class="card">
            <h3>➕ Otag döret</h3>
            <label>Otagyň ady <input id="roomTitle" maxlength="40" value="${U.esc(s.user.name)} — otag"></label>
            <label>Soraglaryň sany
              <select id="roomCount"><option>5</option><option selected>7</option><option>10</option><option>15</option></select></label>
            <label>Her soraga wagt (sekunt)
              <select id="roomSec"><option>10</option><option selected>15</option><option>20</option><option>30</option></select></label>
            <button class="btn primary full mt" id="createBtn">Otag döret</button>
            <p class="muted small">Soraglar siziň geçen sapaklaryňyzdan alynýar.</p>
          </div>
          <div class="card">
            <h3>📡 Tapylan otaglar</h3>
            <div id="hostList" class="lan-hosts"><div class="muted small">⏳ Gözlenýär...</div></div>
            <div class="section-title">IP salgy bilen goşulmak</div>
            <div class="row gap"><input id="ipInp" placeholder="Meselem: 192.168.1.5" class="grow">
              <button class="btn" id="ipBtn">Goşul</button></div>
            <p class="muted small" id="myIp"></p>
          </div>
        </div>
        <p class="muted small">ℹ️ Ilkinji gezek Windows "Brandmauer" (Firewall) penjiresi çykyp biler — ýerli tor üçin rugsat beriň.</p>`;
      el.querySelector('#createBtn').addEventListener('click', createRoom);
      el.querySelector('#ipBtn').addEventListener('click', () => {
        const ip = el.querySelector('#ipInp').value.trim().replace(/^https?:\/\//, '').replace(/[:/].*$/, '');
        if (!/^[\w.-]+$/.test(ip)) return U.toast('Nädogry IP salgy');
        join(ip);
      });
      el.querySelector('#ipInp').addEventListener('keydown', e => { if (e.key === 'Enter') el.querySelector('#ipBtn').click(); });
      refreshHosts();
      every(refreshHosts, 2000);
    }

    async function refreshHosts() {
      const box = el.querySelector('#hostList');
      if (!box) return;
      try {
        const r = await api(LOCAL, '/lan/hosts');
        const ip = el.querySelector('#myIp');
        if (ip) ip.textContent = r.myIps.length ? `Siziň IP salgyňyz: ${r.myIps.join(', ')}` : 'Ýerli tor tapylmady';
        const list = r.hosts.filter(h => !r.myIps.includes(h.ip));
        box.innerHTML = list.length ? list.map(h => `
          <div class="lan-host">
            <div class="grow"><b>${U.esc(h.title)}</b><div class="muted small">${U.esc(h.ip)} · 👥 ${h.players} ·
              ${h.status === 'lobby' ? 'garaşylýar' : 'oýun dowam edýär'}</div></div>
            <button class="btn primary" data-ip="${U.esc(h.ip)}" ${h.status === 'lobby' ? '' : 'disabled'}>Goşul</button>
          </div>`).join('') : '<div class="muted small">Entek otag tapylmady. Dostuňyz otag döretse, şu ýerde görüner.</div>';
        box.querySelectorAll('[data-ip]').forEach(b => b.addEventListener('click', () => join(b.dataset.ip)));
      } catch (e) { /* indiki gezek */ }
    }

    // Soraglar: geçen (açyk) derejelerden; az bolsa indiki derejeler bilen doldurylýar
    function buildQuestions(n) {
      const all = App.allLevels();
      const levels = all.filter(l => st.isUnlocked(l.id));
      const pool = () => levels.flatMap(l => l.questions.filter(q => q.type === 'choice'));
      for (const l of all) { if (pool().length >= n * 2) break; if (!levels.includes(l)) levels.push(l); }
      return U.shuffle(pool()).slice(0, n).map(q => {
        const order = U.shuffle(q.options.map((_, k) => k));
        return { q: q.q, code: q.code ? U.noSemi(q.code) : '', options: order.map(k => U.noSemi(q.options[k])), answer: order.indexOf(q.answer) };
      });
    }

    async function createRoom() {
      const body = {
        title: el.querySelector('#roomTitle').value.trim(), roundSec: +el.querySelector('#roomSec').value,
        questions: buildQuestions(+el.querySelector('#roomCount').value), name: s.user.name, avatar: s.user.avatar
      };
      try {
        const r = await api(LOCAL, '/lan/host', body);
        conn = { base: LOCAL, pid: r.pid, token: r.token, host: true, id: r.id };
        startPolling();
      } catch (e) { U.toast('Otag döredip bolmady: ' + e.message); }
    }

    async function join(ip) {
      const base = `http://${ip}:${PORT}`;
      try {
        const r = await api(base, '/lan/join', { name: s.user.name, avatar: s.user.avatar });
        conn = { base, pid: r.pid, token: r.token, host: false, id: r.id };
        startPolling();
      } catch (e) { U.toast('Goşulyp bolmady: ' + e.message); }
    }

    async function leave() {
      if (!conn) return lobby();
      const c = conn;
      conn = null;
      try { await api(c.base, c.host ? '/lan/close' : '/lan/leave', { pid: c.pid, token: c.token }); } catch (e) { /* */ }
      lobby();
    }

    // ---------- Oýun: ýagdaýy her 0.4 s almak ----------
    function startPolling() {
      clearTimers();
      shownKey = ''; fails = 0; picked = null;
      poll();
      every(poll, 400);
      every(tickTimer, 100);
    }

    async function poll() {
      if (!conn) return;
      try {
        const q = `?pid=${encodeURIComponent(conn.pid)}&token=${encodeURIComponent(conn.token)}`;
        last = await api(conn.base, '/lan/state' + q);
        last.receivedAt = performance.now();
        fails = 0;
        show(last);
      } catch (e) {
        if (++fails >= 6 || /ýapyldy|tapylmady/.test(e.message)) {
          conn = null;
          U.toast('Otag bilen baglanyşyk kesildi');
          lobby();
        }
      }
    }

    function show(g) {
      const key = g.status + '|' + g.round;
      if (key !== shownKey) {
        shownKey = key;
        if (g.status === 'playing') picked = g.myChoice;
        ({ lobby: roomScreen, playing: questionScreen, reveal: questionScreen, finished: finishScreen })[g.status](g);
      }
      updateLive(g);
    }

    const playersHtml = g => `<div class="lan-players">${g.players.filter(p => !p.left).map(p => `
      <div class="lan-player ${p.pid === g.me ? 'me' : ''}" data-pid="${U.esc(p.pid)}">
        <span class="pb-av">${U.esc(p.avatar)}</span>
        <span class="grow">${U.esc(p.name)}${p.host ? ' 👑' : ''}${p.pid === g.me ? ' <span class="muted small">(siz)</span>' : ''}</span>
        <span class="lan-mark"></span><b class="lan-score">${p.score}</b></div>`).join('')}</div>`;

    function roomScreen(g) {
      el.innerHTML = `
        <h1>🌐 ${U.esc(g.title)}</h1>
        <div class="card">
          <div class="row between wrap"><b>Oýunçylar (<span id="pCount">${g.players.filter(p => !p.left).length}</span>)</b>
            <span class="muted small">${g.total} sorag · her soraga ${g.roundSec} s</span></div>
          <div id="players">${playersHtml(g)}</div>
          <p class="muted small" id="waitHint">${conn.host ? 'Dostlaryňyz goşulandan soň "Başla" düwmesine basyň (iň az 2 oýunçy).' : 'Otagy döreden oýunçynyň başlamagyna garaşylýar...'}</p>
          <div class="row gap mt">
            ${conn.host ? '<button class="btn primary" id="startBtn">▶ Başla</button>' : ''}
            <button class="btn" id="leaveBtn">${conn.host ? 'Otagy ýap' : 'Çyk'}</button>
          </div>
        </div>`;
      el.querySelector('#leaveBtn').addEventListener('click', leave);
      const sb = el.querySelector('#startBtn');
      if (sb) sb.addEventListener('click', async () => {
        try { await api(conn.base, '/lan/start', auth()); poll(); } catch (e) { U.toast(e.message === 'Iň az 2 oýunçy gerek' ? 'Iň az 2 oýunçy gerek' : e.message); }
      });
    }

    function questionScreen(g) {
      const q = g.question;
      el.innerHTML = `
        <div class="duel">
          <div class="row between muted"><span id="phase">${g.status === 'playing' ? '✍️ Jogap beriň!' : '📊 Tapgyryň netijesi'}</span>
            <span>Sorag ${g.round + 1} / ${g.total}</span></div>
          <div class="bar timer"><div id="timeBar" style="width:100%"></div></div>
          <h2 class="q-text">${U.esc(q.q)}</h2>
          ${q.code ? `<pre class="code">${U.esc(q.code)}</pre>` : ''}
          <div class="options">${q.options.map((o, i) =>
            `<button class="option" data-i="${i}"><span class="key">${i + 1}</span><span>${U.esc(o)}</span><span class="marks"></span></button>`).join('')}</div>
          <div class="round-verdict" id="verdict"></div>
          <div id="players">${playersHtml(g)}</div>
          <div class="row mt"><button class="btn ghost" id="leaveBtn">${conn.host ? 'Otagy ýap' : 'Çyk'}</button></div>
        </div>`;
      el.querySelector('#leaveBtn').addEventListener('click', async () => {
        if (await U.confirm('Oýundan çykmak isleýärsiňizmi?', { title: '🌐 Lokal', okText: 'Çyk', danger: true })) leave();
      });
      el.querySelectorAll('.option').forEach(b => b.addEventListener('click', () => answer(+b.dataset.i)));
      keyHandler = e => { if (/^[1-9]$/.test(e.key) && +e.key <= q.options.length) answer(+e.key - 1); };
    }

    async function answer(i) {
      if (!last || last.status !== 'playing' || picked !== null) return;
      picked = i;
      markOptions(last);
      try { await api(conn.base, '/lan/answer', { ...auth(), round: last.round, choice: i }); poll(); } catch (e) { picked = null; markOptions(last); }
    }

    function markOptions(g) {
      el.querySelectorAll('.option').forEach(b => {
        const i = +b.dataset.i;
        b.classList.toggle('selected', g.status === 'playing' && i === picked);
        b.disabled = g.status !== 'playing' || picked !== null;
        if (g.status === 'reveal') {
          b.classList.toggle('correct', i === g.answer);
          b.classList.toggle('wrong', i !== g.answer && i === picked);
          // Kimiň haýsy wariant saýlandygy
          const who = g.players.filter(p => !p.left && g.result[p.pid] && g.result[p.pid].choice === i);
          b.querySelector('.marks').innerHTML = who.map(p => `<span class="mark ${i === g.answer ? 'ok' : 'bad'}">${U.esc(p.avatar)} ${U.esc(p.name)}</span>`).join('');
        }
      });
    }

    // Her soragda: oýunçylaryň ballary, kimiň jogap berendigi, tapgyryň netijesi
    function updateLive(g) {
      if (g.status === 'finished') return;
      const box = el.querySelector('#players');
      if (box) {
        const ids = g.players.filter(p => !p.left).map(p => p.pid).join();
        if (box.dataset.ids !== ids) { box.innerHTML = playersHtml(g); box.dataset.ids = ids; }
        g.players.forEach(p => {
          const row = box.querySelector(`[data-pid="${CSS.escape(p.pid)}"]`);
          if (!row) return;
          row.querySelector('.lan-score').textContent = p.score;
          const mark = row.querySelector('.lan-mark');
          if (g.status === 'playing') mark.textContent = p.answered ? '✔ jogap berdi' : '… pikirlenýär';
          else if (g.status === 'reveal') {
            const r = g.result[p.pid];
            mark.innerHTML = !r || r.choice === null ? '<span class="neg">⏰ jogap ýok</span>'
              : r.ok ? `<span class="pos">✅ +${r.pts}</span>` : '<span class="neg">❌ ýalňyş</span>';
          } else mark.textContent = '';
        });
        const pc = el.querySelector('#pCount');
        if (pc) pc.textContent = g.players.filter(p => !p.left).length;
      }
      if (g.status === 'playing' || g.status === 'reveal') {
        markOptions(g);
        const v = el.querySelector('#verdict');
        if (v) v.innerHTML = g.status === 'reveal' ? (g.result[g.me] && g.result[g.me].ok ? `<span class="pos">✅ Dogry! +${g.result[g.me].pts} bal</span>`
          : '<span class="neg">Dogry jogap ýaşyl bilen bellendi</span>') : picked !== null ? '<span class="muted">Jogabyňyz kabul edildi — beýlekilere garaşylýar...</span>' : '';
      }
    }

    // Taýmer zolagy: serwerden alnan galan wagt + soňky jogapdan bäri geçen wagt
    function tickTimer() {
      const bar = el.querySelector('#timeBar');
      if (!bar || !last) return;
      if (last.status !== 'playing') { bar.style.width = '0%'; return; }
      const left = Math.max(0, last.remainingMs - (performance.now() - last.receivedAt));
      bar.style.width = (left / (last.roundSec * 1000)) * 100 + '%';
    }

    function finishScreen(g) {
      keyHandler = null;
      const active = g.players.filter(p => !p.left);
      const ranked = [...active].sort((a, b) => b.score - a.score);
      const top = ranked[0] ? ranked[0].score : 0;
      const winners = ranked.filter(p => p.score === top);
      const me = active.find(p => p.pid === g.me);
      const iWon = me && winners.length === 1 && winners[0].pid === g.me;
      // XP bir otag üçin diňe bir gezek berilýär
      const xp = iWon ? 15 : 5;
      if (s.lanAwarded !== g.id) {
        s.lanAwarded = g.id;
        st.addXp(xp);
        App.updateHeader();
        U.sfx(iWon ? 'win' : 'ok');
      }
      const medal = i => ['🥇', '🥈', '🥉'][i] || `${i + 1}.`;
      el.innerHTML = `
        <div class="card duel center">
          <h1>${iWon ? '🏆 Siz ýeňdiňiz!' : winners.length > 1 && winners.some(p => p.pid === g.me) ? '🤝 Deňme-deň!' : '🏁 Oýun tamamlandy'}</h1>
          <table class="recap">
            <tr><th>Orun</th><th>Oýunçy</th><th>Dogry</th><th>Bal</th></tr>
            ${ranked.map((p, i) => `<tr class="${p.pid === g.me ? 'me' : ''}"><td>${medal(i)}</td><td>${U.esc(p.avatar)} ${U.esc(p.name)}</td>
              <td>${g.results.filter(r => r[p.pid] && r[p.pid].ok).length} / ${g.total}</td><td><b>${p.score}</b></td></tr>`).join('')}
          </table>
          <p class="mt"><b>+${xp} XP</b></p>
          <div class="row center gap"><button class="btn primary" id="backBtn">Lokal menýu</button></div>
        </div>`;
      el.querySelector('#backBtn').addEventListener('click', leave);
    }

    let keyHandler = null;
    const onKey = e => { if (keyHandler) keyHandler(e); };
    document.addEventListener('keydown', onKey);
    App.onLeave(() => {
      clearTimers();
      document.removeEventListener('keydown', onKey);
      // Başga sahypa geçilse: host otagy ýapýar, oýunçy otagdan çykýar
      if (conn) { const c = conn; conn = null; api(c.base, c.host ? '/lan/close' : '/lan/leave', { pid: c.pid, token: c.token }).catch(() => {}); }
    });

    boot();
  }
};
