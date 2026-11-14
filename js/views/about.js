// Programma hakda: awtor, maksat, mümkinçilikler we tehnologiýalar
window.App = window.App || {};
App.views = App.views || {};

App.APP_INFO = {
  name: 'JavaScript',
  version: '2.0.0',
  year: 2026,
  author: 'Meredow Serdar',
  supervisor: 'Nurgeldiýew Oraz',   // diplom işiniň ýolbaşçysy
  topic: 'Ýokary bilimi barlaýan test programmasy'
};

App.views.about = {
  render(el) {
    const R = App.RULES, I = App.APP_INFO;
    const levels = App.allLevels();
    const questions = levels.reduce((a, l) => a + l.questions.length, 0);
    const initials = I.author.split(' ').map(w => w[0]).join('');

    el.innerHTML = `
      <div class="about">
        <h1>ℹ️ Programma hakda</h1>

        <div class="card author-card">
          <div class="author-av">${initials}</div>
          <div class="grow">
            <div class="unit-num">Programmanyň eýesi we işläp düzüji</div>
            <h2>${I.author}</h2>
            <div class="muted">Diplom işi · ${I.year}</div>
            <div class="muted">Diplom işiniň ýolbaşçysy: <b>${I.supervisor}</b></div>
          </div>
        </div>

        <div class="card">
          <table class="kv">
            <tr><td>Programmanyň ady</td><td><b>${I.name}</b></td></tr>
            <tr><td>Diplom işiniň mowzugy</td><td>${I.topic}</td></tr>
            <tr><td>Awtor</td><td>${I.author}</td></tr>
            <tr><td>Diplom işiniň ýolbaşçysy</td><td>${I.supervisor}</td></tr>
            <tr><td>Wersiýa</td><td>${I.version} · ${I.year}</td></tr>
            <tr><td>Programma görnüşi</td><td>JavaScript öwrediji we bilim barlaýjy test ulgamy</td></tr>
          </table>
        </div>

        <div class="section-title">Sanlarda</div>
        <div class="stat-grid">
          <div class="stat-box"><b>${window.LESSONS.length}</b><span>bölüm</span></div>
          <div class="stat-box"><b>${levels.length}</b><span>dereje</span></div>
          <div class="stat-box"><b>${questions}</b><span>sorag</span></div>
          <div class="stat-box"><b>${window.BOOK.chapters.length}</b><span>kitap baby</span></div>
          <div class="stat-box"><b>${window.LEAGUES.length}</b><span>liga</span></div>
          <div class="stat-box"><b>${window.DUEL_BOTS.length}</b><span>duel boty</span></div>
        </div>

        <div class="section-title">Maksady</div>
        <div class="card">
          <p><b>${I.name}</b> — ýokary bilimi barlaýan, JavaScript programmirleme dilini öwredýän we synaýan test programmasy.</p>
          <p>Talyplara JavaScript-i esaslardan başlap ýokary derejä çenli ädimme-ädim öwretmek, bilimlerini
            derejeli testler arkaly barlamak we bäsleşik (reýting, duel) arkaly öwrenmäge höwes döretmek.</p>
        </div>

        <div class="section-title">Mümkinçilikler</div>
        <div class="card">
          <ul>
            <li>📚 <b>${window.LESSONS.length} bölüm, ${levels.length} dereje, ${questions} sorag.</b> Derejeler yzygiderli açylýar.</li>
            <li>❤️ Jan ulgamy: ${R.HEARTS_MAX} jan, ýalňyş jogapda 1 jan aýrylýar, her ${R.HEART_REGEN_MIN} minutda 1 jan dikelýär.</li>
            <li>👤 Profil: dereje, XP, yzygiderlik, takyklyk, nyşanlar we işjeňlik grafigi.</li>
            <li>🏆 Hepdelik reýting: ${window.LEAGUES.length} liga, ${R.LEAGUE_GROUP_SIZE} gatnaşyjyly toparlar, ýokary geçmek we aşak düşmek.</li>
            <li>⚔️ 1×1 Duel: dürli derejedäki botlar bilen wagta garşy bäsleşik, güýçli botlar bilen oýlanmak wagty (Opus 5.5 — 1 s, Fable 5.1 — 2 s), ýeňiş üçin botuň güýjüne görä +10…27, utulyş üçin −5…14 reýting, reýting derejeleri (${App.DUEL_RANKS.map(r => r.title).join(' → ')}).</li>
            <li>📖 Ensiklopediýa: ${window.BOOK.chapters.length} bapdan ybarat JavaScript kitaby we gözleg.</li>
            <li>⚙️ Sazlamalar: tema, şrift, ses, ösüşi eksport/import etmek.</li>
          </ul>
        </div>

        <div class="section-title">Ulanylan tehnologiýalar</div>
        <div class="card">
          <p>HTML5, CSS3, JavaScript (ES6+). Programma serwersiz işleýär, maglumatlar <code>localStorage</code>-da saklanýar.</p>
        </div>

        <p class="muted small center">© ${I.year} ${I.author}. Ähli hukuklar goralan.</p>
      </div>`;
  }
};
