// Sazlamalar: görnüş, sapaklar, duel we maglumatlar
window.App = window.App || {};
App.views = App.views || {};

App.views.settings = {
  render(el) {
    const U = App.util, st = App.store, s = st.state, set = s.settings;

    const toggle = (key, title, desc) => `
      <div class="set-row">
        <div class="set-label"><b>${title}</b><span>${desc}</span></div>
        <label class="switch"><input type="checkbox" data-key="${key}" ${set[key] ? 'checked' : ''}><span class="slider"></span></label>
      </div>`;

    const choice = (key, title, desc, opts) => `
      <div class="set-row">
        <div class="set-label"><b>${title}</b><span>${desc}</span></div>
        <div class="seg" data-key="${key}">${opts.map(([v, label]) =>
          `<button type="button" data-val="${v}" class="${set[key] === v ? 'on' : ''}">${label}</button>`).join('')}</div>
      </div>`;

    // Internet wagtynyň ýagdaýy (js/clock.js)
    function clockText() {
      const c = App.clock, sec = Math.round(c.offset / 1000);
      if (c.online) return `🌐 Internet wagty (${c.source}) · kompýuteriň sagady bilen tapawut: ${sec} s`;
      return c.syncedAt ? `📴 Internet ýok — soňky belli wagt tapawudy ulanylýar (${sec} s)` : '📴 Internet ýok — kompýuteriň sagady ulanylýar';
    }

    el.innerHTML = `
      <div class="settings">
        <h1>⚙️ Sazlamalar</h1>

        <div class="section-title">Görnüş</div>
        <div class="card">
          <div class="set-row">
            <div class="set-label"><b>🌍 Dil / Язык / Language</b>
              <span>Programmanyň dili. Sapaklaryň soraglary, ensiklopediýanyň mazmuny we meseleleriň şertleri türkmen dilinde galýar.</span></div>
            ${App.i18n.picker()}
          </div>
          ${choice('theme', 'Tema', 'Programmanyň reňk gamasy', [['dark', '🌙 Gara-ýaşyl'], ['neon', '💜 Neon'], ['sunset', '🌅 Gün ýaşmasy'], ['ocean', '🌊 Okean'], ['gray', '🩶 Çal']])}
          <div class="set-row set-col">
            <div class="set-label"><b>🎨 Öz reňkleriňiz</b>
              <span>Temanyň islendik reňkini öz reňkiňiz bilen çalyşyň. Üýtgeşme derrew görünýär. "Adaty" — temanyň öz reňkine gaýtarýar.</span></div>
            <div class="color-grid" id="colorGrid"></div>
            <button class="btn" id="resetColors">↺ Ähli reňkleri temanyňka gaýtarmak</button>
          </div>
          ${choice('font', 'Şriftiň ölçegi', 'Ähli tekstleriň ululygy', [['small', 'Kiçi'], ['medium', 'Orta'], ['large', 'Uly']])}
          ${toggle('anim', 'Animasiýalar', 'Düwmeleriň we geçişleriň hereketleri')}
        </div>

        <div class="section-title">Sapaklar</div>
        <div class="card">
          ${toggle('sound', 'Ses effektleri', 'Dogry we ýalňyş jogapda gysga ses')}
          ${toggle('explain', 'Düşündirişler', 'Jogapdan soň sorag boýunça düşündirişi görkezmek')}
        </div>

        <div class="section-title">1×1 Duel</div>
        <div class="card">
          ${toggle('duelAutoNext', 'Indiki soraga özbaşdak geçmek', 'Öçürilse, her tapgyrdan soň netijäni näçe isleseňiz görüp, düwme bilen geçýärsiňiz')}
        </div>

        <div class="section-title">Wagt</div>
        <div class="card">
          <div class="set-row">
            <div class="set-label"><b>🕒 Janlar, yzygiderlik we hepdelik liga internetdäki takyk wagta bagly</b>
              <span id="clockState">${clockText()}</span></div>
            <button class="btn" id="clockSync">🔄 Barla (sinhronlaşdyr)</button>
          </div>
        </div>

        <div class="section-title">Maglumatlar</div>
        <div class="card">
          <div class="set-row">
            <div class="set-label"><b>Ösüşi göçürip almak</b><span>Ähli maglumatlary (XP, derejeler, reýting, kod faýllary we ýüklenen kitaplar) bir JSON faýlynda saklamak</span></div>
            <button class="btn" id="exportBtn">⬇ Eksport</button>
          </div>
          <div class="set-row">
            <div class="set-label"><b>Ösüşi dikeltmek</b><span>Öň saklanan JSON faýly ýüklemek (häzirki ösüşiň ýerine ýazylýar)</span></div>
            <button class="btn" id="importBtn">⬆ Import</button>
            <input type="file" id="importFile" accept=".json,application/json" hidden>
          </div>
          <div class="set-row">
            <div class="set-label"><b>Sazlamalary adaty ýagdaýa getirmek</b><span>Diňe sazlamalar üýtgeýär, ösüş saklanýar</span></div>
            <button class="btn" id="defaultsBtn">↺ Adaty</button>
          </div>
        </div>
        <p class="muted small">Ösüşi doly pozmak üçin: Profil → Howply zona.</p>
      </div>`;

    App.i18n.bindPicker(el);
    el.querySelector('#clockSync').addEventListener('click', async () => {
      const ok = await App.clock.sync();
      el.querySelector('#clockState').textContent = clockText();
      U.toast(ok ? 'Wagt sinhronlaşdyryldy' : 'Internet wagtyny alyp bolmady');
      if (ok) { st.refresh(); App.updateHeader(); }
    });

    function changed() {
      st.save();
      st.applySettings();
      renderColors();
    }

    // ---------- Öz reňkler ----------
    const COLORS = [
      ['primary', 'Esasy reňk', 'Düwmeler, saýlanan ýerler, zolaklar', '--primary'],
      ['icon', 'Ikonkalar', '</>, ☰, 📷 düwmeleri, sapak tegelekleri', '--icon'],
      ['accent', 'Goşmaça reňk', 'Duel taýmeri, duýduryşlar', '--accent'],
      ['bg', 'Fon', 'Sahypanyň fony', '--bg'],
      ['card', 'Kartoçkalar', 'Kartoçkalar, paneller, menýular', '--card'],
      ['text', 'Tekst', 'Esasy tekstiň reňki', '--text'],
      ['code', 'Kod fony', 'Kod redaktory we kod bölekleri', '--ide-bg']
    ];
    if (!set.colors) set.colors = {};

    // CSS üýtgeýäniniň häzirki bahasyny #rrggbb görnüşinde almak
    function currentHex(cssVar) {
      const probe = document.createElement('span');
      probe.style.color = `var(${cssVar})`;
      document.body.appendChild(probe);
      const m = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g) || [0, 0, 0];
      probe.remove();
      return U.rgbToHex(m.slice(0, 3).map(Number));
    }

    // Tekst bilen fonyň/kartoçkanyň kontrastyny barlamak (WCAG: adaty tekst üçin iň az 4.5:1)
    function checkContrast() {
      const box = el.querySelector('#contrastWarn');
      if (!box) return;
      const text = currentHex('--text');
      const pairs = [['fon', currentHex('--bg')], ['kartoçkalar', currentHex('--card')]]
        .map(([name, bg]) => [name, U.contrast(text, bg)])
        .filter(([, r]) => r < 4.5);
      box.hidden = !pairs.length;
      box.innerHTML = pairs.length ? `⚠ Tekst bilen ${pairs.map(([n, r]) => `${n} (${r.toFixed(1)}:1)`).join(', ')} arasynda kontrast az —
        tekst kyn okalyp biler. Iň az 4.5:1 bolmagy maslahat berilýär.` : '';
    }

    function renderColors() {
      const grid = el.querySelector('#colorGrid');
      if (!grid) return;
      grid.innerHTML = COLORS.map(([key, label, desc, cssVar]) => `
        <div class="color-item ${set.colors[key] ? 'custom' : ''}">
          <input type="color" data-color="${key}" value="${set.colors[key] || currentHex(cssVar)}" title="${U.esc(label)}">
          <div class="grow"><b>${U.esc(label)}</b><span>${U.esc(desc)}</span></div>
          ${set.colors[key] ? `<button class="link small" data-clear="${key}">Adaty</button>` : ''}
        </div>`).join('') + '<div class="contrast-warn" id="contrastWarn" hidden></div>';
      checkContrast();
      grid.querySelectorAll('input[data-color]').forEach(inp => {
        // Saýlanýan wagty derrew görkezmek, saýlap bolanda ýatda saklamak
        inp.addEventListener('input', () => { set.colors[inp.dataset.color] = inp.value; st.applyColors(); checkContrast(); });
        inp.addEventListener('change', () => { set.colors[inp.dataset.color] = inp.value; changed(); });
      });
      grid.querySelectorAll('[data-clear]').forEach(b => b.addEventListener('click', () => {
        delete set.colors[b.dataset.clear];
        changed();
      }));
    }
    renderColors();
    el.querySelector('#resetColors').addEventListener('click', () => {
      set.colors = {};
      changed();
      U.toast('Reňkler temanyň öz reňklerine gaýtaryldy');
    });

    el.querySelectorAll('input[data-key]').forEach(inp => inp.addEventListener('change', () => {
      set[inp.dataset.key] = inp.checked;
      changed();
      if (inp.dataset.key === 'sound' && inp.checked) U.sfx('ok');
    }));

    el.querySelectorAll('.seg[data-key]').forEach(seg => seg.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      set[seg.dataset.key] = b.dataset.val;
      seg.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
      changed();
    })));

    el.querySelector('#exportBtn').addEventListener('click', async () => {
      const blob = new Blob([await st.exportJson()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `js-owren-${U.dayKey()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      U.toast('Ösüş faýla saklandy');
    });

    const file = el.querySelector('#importFile');
    el.querySelector('#importBtn').addEventListener('click', () => file.click());
    file.addEventListener('change', async () => {
      const f = file.files[0];
      if (!f) return;
      if (!(await U.confirm('Häzirki ösüş faýldaky maglumatlar bilen çalşylar. Dowam etmelimi?', { title: '⬆ Ösüşi dikeltmek', okText: 'Dowam et' }))) return;
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const books = await st.importJson(reader.result);
          U.toast('Ösüş dikeldildi' + (books ? ` · ${books} kitap goşuldy` : ''));
          App.render();
        } catch (e) {
          U.toast('Faýly okap bolmady: nädogry format');
        }
      };
      reader.readAsText(f);
    });

    el.querySelector('#defaultsBtn').addEventListener('click', () => {
      Object.assign(set, { theme: 'dark', font: 'medium', anim: true, sound: true, explain: true, duelAutoNext: true, colors: {} });
      changed();
      App.render();
    });
  }
};
