// Mysal işlemek: kod ýazyp meseleleri çözmek, awtomatik testler bilen barlamak
//
//  * #/practice — meseleleriň sanawy (bölümler we kynlyk boýunça)
//  * #/practice/<id> — meseläniň şerti, kod meýdany we testler
//  * Kod Web Worker-de işleýär; her test aýratyn barlanýar, netijeler çuňňur deňeşdirilýär.
//    Ilkinji 2 test açyk (mysal), galanlary "goşmaça barlag" (bahalary görkezilmeýär) — jogaplary kodda göni ýazyp bolmaz ýaly.
//  * Ähli testler geçse, mesele çözüldi diýip bellenýär we ilkinji gezek XP berilýär.
//  * Her şowsuz barlag üçin −1 XP (0-dan aşak däl). Çözgüdi görmek −30 XP (öňünden duýduryş bilen);
//    çözgüdi görlen mesele üçin soňra XP berilmeýär.
//  * Funksiýanyň şablony (ady we parametrleri) redaktorda taýýar goýulýar: ulanyjy diňe içini ýazýar.
//    Göçürip goýmak (Ctrl+C / Ctrl+V) rugsat berilýär.
//  * Çözülen kod barlanýar: gaýtalanýan setirler we bloklar, iki gezek yglan edilen funksiýalar,
//    nusga çözgüt ýa-da başga meseläniň kody bilen birmeňzeşlik (özboluşlylyk).
//    Bu ýalňyşlyk hasaplanmaýar, ýöne indiki meselä geçmezden öň duýduryş berilýär.
window.App = window.App || {};
App.views = App.views || {};

App.PRACTICE_RULES = { FAIL_XP: 1, SOLUTION_XP: 30, VISIBLE_TESTS: 2 };

// Kodyň gurluşyny deňeşdirende saklanýan açar sözler (galan atlar "I" bilen çalşylýar)
App.PRACTICE_KEYWORDS = new Set(['function', 'return', 'const', 'let', 'var', 'if', 'else', 'for', 'of', 'in', 'while', 'do',
  'switch', 'case', 'default', 'break', 'continue', 'new', 'typeof', 'true', 'false', 'null', 'undefined']);

App.views.practice = {
  render(el, params) {
    const U = App.util, st = App.store, s = st.state, RULES = App.PRACTICE_RULES;
    const SECTIONS = window.PROBLEM_SECTIONS;
    const LEVEL_ORDER = { 'Aňsat': 0, 'Orta': 1, 'Kyn': 2 };
    const secIndex = id => SECTIONS.findIndex(x => x.id === id);
    // Meseleler: bölüm → kynlyk → belgisi boýunça tertipde
    const P = [...window.PROBLEMS].sort((a, b) => secIndex(a.topic) - secIndex(b.topic)
      || LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level] || parseInt(a.id.slice(1), 10) - parseInt(b.id.slice(1), 10));
    const LEVEL_CLS = { 'Aňsat': 'easy', 'Orta': 'mid', 'Kyn': 'hard' };
    const inline = t => U.esc(t).replace(/`([^`]+)`/g, '<code>$1</code>');
    const call = (p, args) => `${p.fn}(${args.map(a => JSON.stringify(a)).join(', ')})`;

    // Parametrleriň mysal çagyryşda alýan bahalary: [{ name, value }]
    // "a, b", 'at = "dost"', "...sanlar" görnüşli parametrler goldanýar.
    function paramValues(p, args) {
      return p.params.split(',').map(x => x.trim()).filter(Boolean).map((raw, i) => {
        if (raw.startsWith('...')) return { name: raw.slice(3), value: JSON.stringify(args.slice(i)) };
        const [name, def] = raw.split('=').map(x => x.trim());
        return { name, value: i < args.length ? JSON.stringify(args[i]) : `${def} (adaty baha)` };
      });
    }

    // Taýýar şablon: parametrleriň nireden baha alýandygy teswirde görkezilýär
    function makeStarter(p) {
      const [args, exp] = p.tests[0];
      const vals = paramValues(p, args);
      const w = Math.max(...vals.map(v => v.name.length), 1);
      return `function ${p.fn}(${p.params}) {\n`
        + `  // 📌 Parametrler bahany barlagdan alýar. Mysal: ${call(p, args)}\n`
        + vals.map(v => `  //    ${v.name.padEnd(w)} = ${v.value}\n`).join('')
        + `  //    garaşylýan netije → ${JSON.stringify(exp)}\n`
        + `  // Kodyňyzy şu ýere ýazyň (netijäni return bilen gaýtaryň):\n  \n}\n`;
    }

    const prob = P.find(p => p.id === params[0]);
    if (prob) return solve(prob);
    return list();

    // ---------- Sanaw ----------
    function list() {
      const solved = P.filter(p => s.practice.solved[p.id]);
      const xp = solved.reduce((a, p) => a + p.xp, 0);
      const filter = s.ui.practiceFilter || 'all';
      el.innerHTML = `
        <h1>🧪 Mysal işlemek</h1>
        <div class="card row between wrap">
          <div>
            <b>Meseläni saýlaň, taýýar funksiýanyň içini ýazyp çözüň.</b>
            <div class="muted small">Kodyňyz mysallar we goşmaça barlaglar bilen barlanýar. Ähli testler geçse — mesele çözüldi we XP berilýär.
              Şowsuz barlag: −${RULES.FAIL_XP} XP, çözgüdi görmek: −${RULES.SOLUTION_XP} XP.</div>
          </div>
          <div class="row gap">
            <span class="pill ok">✅ ${solved.length} / ${P.length} çözüldi</span>
            <span class="pill">⭐ ${xp} XP</span>
          </div>
        </div>
        <div class="bar"><div style="width:${Math.round((solved.length / P.length) * 100)}%"></div></div>
        <div class="seg mt" id="lvlFilter">
          ${[['all', 'Hemmesi'], ['Aňsat', '🟢 Aňsat'], ['Orta', '🟡 Orta'], ['Kyn', '🔴 Kyn']].map(([v, l]) =>
            `<button type="button" data-val="${v}" class="${filter === v ? 'on' : ''}">${l}</button>`).join('')}
        </div>
        <div class="mt">
          ${SECTIONS.map(sec => {
            const all = P.filter(p => p.topic === sec.id);
            const shown = all.filter(p => filter === 'all' || p.level === filter);
            const done = all.filter(p => s.practice.solved[p.id]).length;
            const open = (s.ui.practiceOpen || {})[sec.id] !== false;
            return `<details class="fold" data-sec="${U.esc(sec.id)}" ${open ? 'open' : ''}>
              <summary>${sec.icon} ${U.esc(sec.id)}
                <span class="muted small sec-desc">${U.esc(sec.desc)}</span>
                <span class="pill ${done === all.length ? 'ok' : ''}">${done} / ${all.length}</span><span class="chev">▼</span></summary>
              <div class="fold-body">
                <div class="bar small-bar sec-bar"><div style="width:${Math.round((done / all.length) * 100)}%"></div></div>
                <div class="prob-grid mt">
                ${shown.length ? shown.map(p => `
                  <a class="prob-card ${s.practice.solved[p.id] ? 'solved' : ''}" href="#/practice/${p.id}">
                    <div class="row between">
                      <span class="lvl ${LEVEL_CLS[p.level]}">${p.level}</span>
                      <span class="muted small">${s.practice.solved[p.id] ? '✅ Çözüldi' : s.practice.bought[p.id] ? '📖 Çözgüt görlen' : `+${p.xp} XP`}${(s.practice.penalty || {})[p.id] ? ` <span class="neg">−${s.practice.penalty[p.id]}</span>` : ''}</span>
                    </div>
                    <h3>${U.esc(p.title)}</h3>
                    <div class="muted small"><code>${U.esc(p.fn)}(${U.esc(p.params)})</code></div>
                  </a>`).join('') : '<div class="muted small">Bu kynlykda mesele ýok.</div>'}
                </div>
              </div>
            </details>`;
          }).join('')}
        </div>`;
      el.querySelectorAll('#lvlFilter button').forEach(b => b.addEventListener('click', () => {
        s.ui.practiceFilter = b.dataset.val;
        st.save();
        App.render();
      }));
      // Bölümleriň açyk/ýapyk ýagdaýyny ýatda saklamak
      el.querySelectorAll('details[data-sec]').forEach(d => d.addEventListener('toggle', () => {
        s.ui.practiceOpen = { ...(s.ui.practiceOpen || {}), [d.dataset.sec]: d.open };
        st.save();
      }));
    }

    // ---------- Kody seljermek: birmeňzeşlik we gaýtalanma ----------
    // Teswirleri we artykmaç boşluklary aýyrmak (deňeşdirmek üçin)
    // ';' hem aýrylýar: çözgüt ekranda ';'-syz görkezilýär, ulanyjy islendik görnüşde ýazyp biler
    function normalize(code) {
      return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '').replace(/;/g, ' ').replace(/\s+/g, ' ').trim();
    }

    // Atlary we bahalary bir görnüşe getirmek: diňe kodyň gurluşy galýar (atlary üýtgedilen göçürmäni tapmak üçin)
    function structure(code) {
      return normalize(code)
        .replace(/(["'`])(?:\\.|(?!\1).)*\1/g, 'S')
        .replace(/\b\d+(\.\d+)?\b/g, 'N')
        .replace(/[A-Za-z_$À-￿][\w$À-￿]*/g, w => App.PRACTICE_KEYWORDS.has(w) ? w : 'I');
    }

    function analyze(p, code) {
      const warnings = [];
      const norm = normalize(code);
      // Özboluşlylyk: nusga çözgüt ýa-da başga meseläniň kody bilen deňeşdirmek.
      // Gysga çözgütlerde (meselem, return a + b) dogry jogap hökman meňzeş bolýar — olar barlanmaýar.
      const longSolution = normalize(p.solution).length > 80;
      if (longSolution && norm === normalize(p.solution)) {
        warnings.push('Kodyňyz nusga çözgüt bilen birmeňzeş. Öz pikiriňiz bilen başgaça ýazmaga synanyşyň — şeýdip has gowy öwrenersiňiz.');
      } else if (longSolution && structure(code) === structure(p.solution)) {
        warnings.push('Kodyňyz nusga çözgüde gaty meňzeş — diňe atlary ýa-da bahalary üýtgedilen ýaly. Öz çözgüdiňizi ýazmaga synanyşyň.');
      }
      for (const other of window.PROBLEMS) {
        const oc = other.id !== p.id && s.practice.code[other.id];
        if (oc && norm.length > 40 && normalize(oc) === norm) {
          warnings.push(`Bu kod "${U.esc(other.title)}" meselesindäki kodyňyz bilen birmeňzeş. Her meseläni aýratyn çözüň.`);
          break;
        }
      }
      // Şol bir funksiýa birnäçe gezek yglan edilen bolsa
      const decl = [...code.matchAll(/(?:function\s+([\w$]+)|(?:const|let|var)\s+([\w$]+)\s*=\s*(?:\([^)]*\)|[\w$]+)\s*=>)/g)].map(m => m[1] || m[2]);
      for (const [name, n] of decl.reduce((m, x) => m.set(x, (m.get(x) || 0) + 1), new Map())) {
        if (n > 1) warnings.push(`<code>${U.esc(name)}</code> funksiýasy ${n} gezek yglan edilen — diňe birini goýuň.`);
      }
      // Gaýtalanýan bloklar: yzygiderli 2 we ondan köp setir kodda ýene gaýtalanýar (göçürilip goýlan ýaly)
      const rows = code.split('\n').map(l => l.trim()).filter(l => l && !/^[{}()[\];,\s]+$/.test(l) && !l.startsWith('//'));
      for (let size = Math.min(6, Math.floor(rows.length / 2)); size >= 2; size--) {
        const seen = new Map();
        let found = null;
        for (let i = 0; i + size <= rows.length && !found; i++) {
          const key = rows.slice(i, i + size).join('\n');
          if (seen.has(key) && i >= seen.get(key) + size) found = rows.slice(i, i + size);
          else if (!seen.has(key)) seen.set(key, i);
        }
        if (found) {
          warnings.push(`${size} setirlik blok kodda iki gezek gaýtalanýar (ilkinji setiri: <code>${U.esc(found[0])}</code>). Gaýtalanýan bölegi funksiýa ýa-da sikl edip ýazyň.`);
          break;
        }
      }
      // Gysga we diňe ýaýlardan ybarat setirler hasaba alynmaýar
      const lines = code.split('\n').map(l => l.trim())
        .filter(l => l.length > 3 && !/^[{}()[\];,\s]+$/.test(l) && !l.startsWith('//'));
      const count = (arr) => arr.reduce((m, x) => m.set(x, (m.get(x) || 0) + 1), new Map());
      for (const [line, n] of count(lines)) {
        if (n >= 3) warnings.push(`<code>${U.esc(line)}</code> setiri ${n} gezek gaýtalanýar. Gaýtalanýan kod üçin sikl ýa-da kömekçi funksiýa ulanyň.`);
      }
      // Diňe sanlary/setirleri bilen tapawutlanýan meňzeş setirler (meselem, uzyn if zynjyry)
      const shape = l => l.replace(/(["'`])(?:\\.|(?!\1).)*\1/g, 'S').replace(/\b\d+(\.\d+)?\b/g, 'N');
      for (const [pattern, n] of count(lines.map(shape))) {
        if (n >= 5 && !warnings.some(w => w.includes('gaýtalanýar'))) {
          const sample = lines.find(l => shape(l) === pattern);
          warnings.push(`Biri-birine meňzeş ${n} setir bar (meselem: <code>${U.esc(sample)}</code>). Bahalary massiwde ýa-da obýektde saklap, sikl bilen işlemek has gysga we düşnükli bolar.`);
        }
      }
      return warnings;
    }

    // ---------- Meseläni çözmek ----------
    function solve(p) {
      const idx = P.indexOf(p);
      const prev = P[idx - 1], next = P[idx + 1];
      const secList = P.filter(x => x.topic === p.topic);
      const freeSolution = () => !!(s.practice.solved[p.id] || s.practice.bought[p.id]);
      let warnings = [];   // soňky üstünlikli barlagdaky duýduryşlar

      el.innerHTML = `
        <div class="row between wrap">
          <a class="link" href="#/practice">◀ Ähli meseleler</a>
          <div class="row gap">
            ${prev ? `<a class="btn" href="#/practice/${prev.id}">◀ Öňki</a>` : ''}
            ${next ? `<a class="btn" href="#/practice/${next.id}" data-next>Indiki ▶</a>` : ''}
          </div>
        </div>
        <div class="solve">
          <div class="card solve-task">
            <div class="row gap">
              <span class="lvl ${LEVEL_CLS[p.level]}">${p.level}</span>
              <span class="prob-xp" id="probXp" title="Bu mesele üçin XP: baýrak we jerimeler"></span>
              ${s.practice.solved[p.id] ? '<span class="pill ok">✅ Çözüldi</span>' : ''}
              ${s.practice.bought[p.id] && !s.practice.solved[p.id] ? '<span class="pill warn">📖 Çözgüt görlen — XP berilmez</span>' : ''}
            </div>
            <h2>${U.esc(p.title)}</h2>
            <div class="muted small">${SECTIONS[secIndex(p.topic)].icon} ${U.esc(p.topic)} · ${secList.indexOf(p) + 1} / ${secList.length}</div>
            <p>${inline(p.desc)}</p>
            <div class="fn-need">✍️ Funksiýa: <code>${U.esc(p.fn)}(${U.esc(p.params)})</code>
              <div class="muted small">Funksiýanyň şablony redaktorda taýýar — diňe içini dolduryň. Funksiýanyň adyny üýtgetmäň.</div></div>
            <div class="section-title">Mysallar</div>
            ${p.tests.slice(0, RULES.VISIBLE_TESTS).map(([args, exp]) =>
              `<pre class="code">${U.esc(call(p, args))}  →  ${U.esc(JSON.stringify(exp))}</pre>`).join('')}
            <div class="param-box">
              <b>📌 Üýtgeýänler (parametrler) nireden baha alýar?</b>
              <p class="small">Funksiýany özüňiz çagyrmaly däl we parametrlere baha bermeli däl. <b>▶ Barla</b> basanyňyzda barlag funksiýany
                çagyrýar we bahalary parametrlere şeýle berýär:</p>
              <table class="param-table">
                <tr><th>Çagyryş</th>${paramValues(p, p.tests[0][0]).map(v => `<th><code>${U.esc(v.name)}</code></th>`).join('')}<th>Netije</th></tr>
                ${p.tests.slice(0, RULES.VISIBLE_TESTS).map(([args, exp]) => `<tr>
                  <td><code>${U.esc(call(p, args))}</code></td>
                  ${paramValues(p, args).map(v => `<td class="pv">${U.esc(v.value)}</td>`).join('')}
                  <td class="pr">${U.esc(JSON.stringify(exp))}</td></tr>`).join('')}
              </table>
              <p class="muted small">Siziň işiňiz: şu bahalary ulanyp netijäni hasaplamak we <code>return</code> bilen gaýtarmak.</p>
            </div>
            <div class="hidden-info">
              🔒 Mundan başga-da <b>${p.tests.length - RULES.VISIBLE_TESTS}</b> sany goşmaça barlag bar.
              <button class="link small" id="hiddenWhat">Bu näme?</button>
              <div id="hiddenExplain" class="small" hidden>
                <b>Goşmaça barlag</b> — bahalary size görkezilmeýän barlag. <b>▶ Barla</b> basylanda kodyňyz diňe ýokardaky mysallar bilen däl,
                başga bahalar bilen hem barlanýar. Şeýdip kodyňyzyň <b>islendik bahada</b> dogry işleýändigi anyklanýar.
                <br>Meselem, <code>if (a === 2) return 5;</code> ýaly diňe mysala laýyk ýazylan kod goşmaça barlagdan geçmez.
                <br>Netijede goşmaça barlagyň geçendigini (✅) ýa-da geçmändigini (❌) görersiňiz, ýöne onuň bahalaryny görmersiňiz.
              </div>
            </div>
            <div class="row gap wrap mt">
              <button class="btn" id="hintBtn">💡 Maslahat</button>
              <button class="btn" id="solBtn">📖 Çözgüt${freeSolution() ? '' : ` (−${RULES.SOLUTION_XP} XP)`}</button>
            </div>
            <div class="tip" id="hintBox" hidden>💡 ${inline(U.noSemi(p.hint))}</div>
            <div class="sol-warn" id="solWarn" hidden>
              <b>⚠ Üns beriň!</b>
              <p>Çözgüdi görmek üçin <b>${RULES.SOLUTION_XP} XP aýrylar</b> (häzir sizde <b>${s.xp} XP</b>).
                Çözgüdi görenden soň bu mesele çözülse-de XP berilmez.</p>
              <p class="muted small">Ilki 💡 maslahaty okap, ýene bir gezek synanyşmagy maslahat berýäris.</p>
              <div class="row gap">
                <button class="btn" id="solCancel">Ýatyr</button>
                <button class="btn danger" id="solBuy">−${RULES.SOLUTION_XP} XP bilen görkez</button>
              </div>
            </div>
            <pre class="code" id="solBox" hidden>${U.esc(U.noSemi(p.solution))}</pre>
          </div>
          <div class="solve-work">
            <div class="solve-bar">
              <span class="js-ico">JS</span> ${U.esc(p.fn)}.js
              <span class="grow"></span>
              <button class="btn small-btn" id="resetBtn" title="Başlangyç şablona gaýtarmak">↺ Başlangyç</button>
              <button class="btn primary small-btn" id="checkBtn" title="Ctrl+Enter">▶ Barla</button>
            </div>
            <div class="ide-editor solve-editor" id="solveEditor"></div>
            <div class="solve-results" id="results">
              <div class="muted small">Kody ýazyp, <b>▶ Barla</b> (ýa-da Ctrl+Enter) basyň. ${p.tests.length} test barlanar.
                Şowsuz barlag üçin −${RULES.FAIL_XP} XP.</div>
            </div>
          </div>
        </div>
        <div class="modal-back" id="warnModal" hidden>
          <div class="modal card">
            <h3>⚠ Indiki meselä geçmezden öň</h3>
            <p class="muted small">Mesele çözüldi hasaplandy, ýöne kodyňyzda şu ýagdaýlar bar:</p>
            <ul id="warnList"></ul>
            <div class="row gap wrap">
              <button class="btn" id="warnFix">✏️ Kody gowulandyr</button>
              <button class="btn primary" id="warnGo">Dowam et ▶</button>
            </div>
          </div>
        </div>`;

      let saveTimer = null;
      const area = App.codeArea(el.querySelector('#solveEditor'), {
        onChange: v => {
          s.practice.code[p.id] = v;
          warnings = [];   // kod üýtgände öňki duýduryşlar köne bolýar
          clearTimeout(saveTimer);
          saveTimer = setTimeout(() => st.save(), 400);
        },
        onRun: () => check(),
        onSave: () => { st.save(); U.toast('💾 Kod saklandy'); }
      });
      // ---------- Meseläniň XP görkezijisi: baýrak we jerimeler ----------
      if (!s.practice.penalty) s.practice.penalty = {};
      const xpBox = el.querySelector('#probXp');
      function renderXp() {
        const pen = s.practice.penalty[p.id] || 0;
        const got = s.practice.solved[p.id] && !s.practice.bought[p.id];
        // Diňe tekst bölegi täzelenýär — "+N / −N" belgisi pozulmaýar
        let txt = xpBox.querySelector('.px-text');
        if (!txt) { txt = document.createElement('span'); txt.className = 'px-text'; xpBox.prepend(txt); }
        txt.innerHTML = `<b class="${got ? 'pos' : ''}">${got ? '✅' : '🏆'} +${p.xp} XP</b>`
          + (pen ? ` <span class="neg">· jerime −${pen} XP</span>` : '');
      }
      // XP üýtgeşmesini görkezmek we jerimäni ýatda saklamak
      function xpChange(delta) {
        if (delta < 0) s.practice.penalty[p.id] = (s.practice.penalty[p.id] || 0) - delta;
        renderXp();
        U.popDelta(xpBox, delta, ' XP');
        App.updateHeader();
      }
      renderXp();

      // Funksiýanyň şablony taýýar goýulýar: ulanyjy diňe içini doldurýar
      const saved = s.practice.code[p.id];
      const starter = makeStarter(p);
      area.setValue(saved && saved.trim() && saved !== p.starter ? saved : starter);

      // ---------- Maslahat we çözgüt ----------
      el.querySelector('#hintBtn').addEventListener('click', () => { el.querySelector('#hintBox').hidden = false; });
      el.querySelector('#hiddenWhat').addEventListener('click', () => {
        const box = el.querySelector('#hiddenExplain');
        box.hidden = !box.hidden;
      });
      el.querySelector('#solBtn').addEventListener('click', () => {
        if (freeSolution()) { el.querySelector('#solBox').hidden = false; return; }
        el.querySelector('#solWarn').hidden = false;
      });
      el.querySelector('#solCancel').addEventListener('click', () => { el.querySelector('#solWarn').hidden = true; });
      el.querySelector('#solBuy').addEventListener('click', () => {
        const lost = st.removeXp(RULES.SOLUTION_XP);
        s.practice.bought[p.id] = App.clock.now();
        st.save();
        xpChange(-lost);
        el.querySelector('#solWarn').hidden = true;
        el.querySelector('#solBox').hidden = false;
        el.querySelector('#solBtn').textContent = '📖 Çözgüt';
        U.sfx('bad');
        U.toast(`📖 Çözgüt açyldy: −${lost} XP`);
      });

      el.querySelector('#resetBtn').addEventListener('click', async () => {
        if (!(await U.confirm('Ýazan kodyňyz pozulyp, başlangyç şablon goýlar.', { title: '↺ Başlangyç şablon', okText: 'Gaýtar', danger: true }))) return;
        area.setValue(starter);
        delete s.practice.code[p.id];
        warnings = [];
        st.save();
      });
      el.querySelector('#checkBtn').addEventListener('click', check);

      // ---------- Indiki meselä geçmezden öň duýduryş ----------
      const modal = el.querySelector('#warnModal');
      function onNextClick(e) {
        const link = e.target.closest('a[data-next]');
        if (!link || !warnings.length) return;
        e.preventDefault();
        el.querySelector('#warnList').innerHTML = warnings.map(w => `<li>${w}</li>`).join('');
        modal.hidden = false;
      }
      el.addEventListener('click', onNextClick);
      el.querySelector('#warnFix').addEventListener('click', () => { modal.hidden = true; area.focus(); });
      el.querySelector('#warnGo').addEventListener('click', () => {
        warnings = [];
        modal.hidden = true;
        location.hash = '#/practice/' + next.id;
      });

      // ---------- Barlag ----------
      let worker = null, timer = null;
      function stopWorker() {
        clearTimeout(timer);
        if (worker) { worker.terminate(); worker = null; }
      }

      // Şowsuz barlag: −1 XP we ýalňyşlyk statistikasy
      function penalty() {
        const lost = st.removeXp(RULES.FAIL_XP);
        st.recordPracticeFail(p.topic, p.title);
        st.save();
        xpChange(-lost);
        return lost ? ` <span class="xp-loss">−${lost} XP</span>` : ' <span class="muted small">(XP 0)</span>';
      }

      function check() {
        stopWorker();
        const code = area.value;
        s.practice.code[p.id] = code;
        st.save();
        const box = el.querySelector('#results');
        box.innerHTML = '<div class="muted small">⏳ Barlanýar...</div>';
        const logs = [];
        const harness = `
;(function () {
  const __tests = ${JSON.stringify(p.tests)};
  const __eq = (a, b) => {
    if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) < 1e-9 || (Number.isNaN(a) && Number.isNaN(b));
    if (Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((x, i) => __eq(x, b[i]));
    if (a && b && typeof a === 'object' && typeof b === 'object') {
      const ka = Object.keys(a), kb = Object.keys(b);
      return ka.length === kb.length && ka.every(k => __eq(a[k], b[k]));
    }
    return a === b;
  };
  const __show = v => v === undefined ? 'undefined' : typeof v === 'number' || typeof v === 'bigint' ? String(v) : JSON.stringify(v);
  if (typeof ${p.fn} !== 'function') { postMessage({ t: 'nofn' }); return; }
  const res = __tests.map(([args, exp]) => {
    try {
      const got = ${p.fn}(...JSON.parse(JSON.stringify(args)));
      return { ok: __eq(got, exp), got: __show(got) };
    } catch (e) {
      return { ok: false, err: e.name + ': ' + e.message };
    }
  });
  postMessage({ t: 'results', res });
})();`;
        const src = App.codeRunner.PRELUDE + '\n' + code + '\n' + harness;
        const url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
        try {
          worker = new Worker(url);
        } catch (e) {
          box.innerHTML = `<div class="test-err">Kody işledip bolmady: ${U.esc(e.message)}</div>`;
          return;
        }
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        worker.onmessage = e => {
          const m = e.data;
          if (m.t === 'log') logs.push(m);
          else if (m.t === 'nofn') { stopWorker(); showError(`<code>${U.esc(p.fn)}</code> atly funksiýa tapylmady. Şertde görkezilen at bilen funksiýa ýazyň: <code>${U.esc(p.fn)}(${U.esc(p.params)})</code>`); }
          else if (m.t === 'results') { stopWorker(); showResults(m.res); }
        };
        worker.onerror = e => {
          e.preventDefault();
          const line = e.lineno - App.codeRunner.PRELUDE_LINES;
          const lines = code.split('\n').length;
          const ok = line > 0 && line <= lines;
          if (ok) area.setErrorLine(line);
          stopWorker();
          showError(U.esc(String(e.message || 'Ýalňyşlyk').replace(/^Uncaught /, '')) + (ok ? ` <span class="muted">(${line}-nji setir)</span>` : ''));
        };
        // Çäksiz sikl ýa-da gaty haýal çözgüt
        timer = setTimeout(() => {
          stopWorker();
          showError('⛔ Kod 3 sekuntdan köp işledi (çäksiz sikl ýa-da gaty haýal çözgüt bolmagy mümkin) we togtadyldy.');
        }, 3000);

        function logsHtml() {
          if (!logs.length) return '';
          return `<div class="section-title">Konsol</div><div class="test-logs">${logs.slice(0, 50).map(l =>
            `<div class="out-line out-${l.lvl}">${U.esc(l.text)}</div>`).join('')}</div>`;
        }

        function showError(html) {
          warnings = [];
          U.sfx('bad');
          box.innerHTML = `<div class="test-err">✖ ${html}${penalty()}</div>${logsHtml()}`;
        }

        function showResults(res) {
          const passed = res.filter(r => r.ok).length;
          const all = passed === res.length;
          let reward = '', loss = '';
          if (all) {
            if (!s.practice.solved[p.id]) {
              s.practice.solved[p.id] = App.clock.now();
              if (s.practice.bought[p.id]) {
                reward = ' · <span class="muted small">çözgüt görlendigi üçin XP berilmedi</span>';
              } else {
                st.addXp(p.xp);
                reward = ` · <b>+${p.xp} XP</b>`;
                xpChange(p.xp);
              }
              renderXp();
              App.updateHeader();
            }
            el.querySelector('#solBtn').textContent = '📖 Çözgüt';
            warnings = analyze(p, code);
            U.sfx('win');
          } else {
            warnings = [];
            loss = penalty();
            U.sfx('bad');
          }
          st.save();
          box.innerHTML = `
            <div class="test-sum ${all ? 'ok' : 'bad'}">${all ? '🎉 Ähli testler geçdi! Mesele çözüldi' : `❌ ${passed} / ${res.length} test geçdi`}${reward}${loss}
              ${all && next ? ` <a class="btn primary small-btn" href="#/practice/${next.id}" data-next>Indiki mesele ▶</a>` : ''}</div>
            ${warnings.length ? `<div class="code-warn"><b>⚠ Kody gowulandyryp bolar:</b><ul>${warnings.map(w => `<li>${w}</li>`).join('')}</ul></div>` : ''}
            ${res.map((r, i) => {
              const [args, exp] = p.tests[i];
              const hidden = i >= RULES.VISIBLE_TESTS;
              const err = r.err ? U.esc(r.err) : hidden ? 'nädogry netije' : `siziňki: <code>${U.esc(r.got)}</code>`;
              return `<div class="test-row ${r.ok ? 'ok' : 'bad'}">
                <span class="test-ic">${r.ok ? '✅' : '❌'}</span>
                ${hidden ? `<span title="Bahalary görkezilmeýän goşmaça barlag">🔒 Goşmaça barlag #${i + 1}</span>`
                  : `<code>${U.esc(call(p, args))}</code>
                     <span class="muted">→ garaşylýan: <code>${U.esc(JSON.stringify(exp))}</code></span>`}
                ${r.ok ? '' : `<span class="neg">${err}</span>`}
              </div>`;
            }).join('')}
            ${logsHtml()}`;
        }
      }

      App.onLeave(() => {
        el.removeEventListener('click', onNextClick);
        stopWorker();
        clearTimeout(saveTimer);
        s.practice.code[p.id] = area.value;
        st.save();
        area.destroy();
      });
      area.focus();
    }
  }
};
