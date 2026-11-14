// Programmany nädip ulanmaly: ulanyjy gollanmasy (aşaky çep burçdaky ☰ menýuda)
//
// Gollanma uzyn tekst bolany üçin terjime sözlügine (i18n-dict.js) däl-de, şu ýerde üç dilde ýazylýar.
// Saýlanan dil App.i18n.lang boýunça alynýar; konteýner data-noi18n — awtomatik terjime oňa degmeýär.
window.App = window.App || {};
App.views = App.views || {};

App.GUIDE = {
  tk: {
    title: '📘 Programmany nädip ulanmaly',
    intro: 'Bu gollanma programmanyň ähli bölümlerini gysgaça düşündirýär. Bölümiň adyna basyp açyň.',
    sections: [
      ['🚀 Başlamak', [
        'Ilkinji gezek açylanda adyňyzy ýazyň, awatar saýlaň we <b>Başla</b> düwmesine basyň. Diliň ýokarsyndan Türkmençe / Русский / English saýlap bilersiňiz.',
        'Ýokarky menýu: <b>Sapaklar</b>, <b>Reýting</b>, <b>1×1 Duel</b>, <b>Ensiklopediýa</b>, <b>Mysal işlemek</b>, <b>Lokal</b>. Sag ýokarda: <b>&lt;/&gt;</b> — kod redaktory, awatar — profil.',
        'Ýokarky panelde: 🔥 yzygiderlik (gün), ⭐ jemi XP, ❤️ janlar, liganyň nyşany. Üýtgeşmeler +N / −N görnüşinde görkezilýär.',
        'Aşaky çep burçdaky <b>☰</b> düwmesi: Sazlamalar, Programma hakda we şu gollanma.']],
      ['📚 Sapaklar', [
        '12 bölüm, her bölümde 10 dereje, her derejede 5 sorag. Derejeler tertip boýunça açylýar: indiki dereje öňküsini tamamlanyňyzdan soň açylýar.',
        'Wariant saýlaň ýa-da jogaby ýazyň we <b>Barla</b> basyň. Ýalňyş jogapda 1 jan aýrylýar, sorag sapagyň ahyrynda gaýtadan berilýär.',
        'Janlar: 15 jan, her 10 minutda 1 jan dikelýär. Janlar gutarsa, dikelýänçä ensiklopediýany okap bilersiňiz.',
        'Derejäni tamamlanyňyzda XP berilýär (ligaňyza we ilkinji synanyşykdaky dogry jogaplara görä), ýalňyşsyz bolsa +5 bonus we ⭐⭐⭐.']],
      ['👤 Profil we derejeler', [
        'Profilde: derejäňiz, XP, janlar, reýting, häsiýetnamalar, 7 günlük grafik, nyşanlar. Bölekleriň adyna basyp açyp-ýapyp bolýar.',
        '📷 düwmesi bilen profil suratyny ýükläp bilersiňiz, <b>✏️ Üýtget</b> — ady we awatary üýtgetmek.',
        '<b>🎖 Derejeler</b>: her täze dereje üçin +50 XP, her 5-nji derejede goşmaça +100 XP. Dereje ýokarlananda gutlag penjiresi çykýar.',
        '<b>🩺 Ýalňyşlyklar we maslahatlar</b>: şol bir ýalňyşlyk 5 gezek gaýtalansa, şu ýerde görünýär we okamaly bap, gaýtalamaly sapak teklip edilýär.']],
      ['🏆 Reýting (hepdelik liga)', [
        '5 liga: Öwreniji → Frontend → FullStack → Haker → Kraker. Her hepde 15 gatnaşyjyly topara düşýärsiňiz.',
        'Orun diňe şu hepde gazanan XP-ňize bagly. Ilkinji 3 orun ýokary liga geçýär, soňky 3 orun aşak düşýär.',
        'Hepde her duşenbe 00:00-da täzelenýär. Wagt internetdäki takyk wagta bagly.']],
      ['⚔️ 1×1 Duel', [
        '4 bot: Haiku 5.5 (aňsat) → Sonnet 5.5 → Opus 5.5 → Fable 5.1 (iň kyn). Soraglar geçen sapaklaryňyzdan alynýar.',
        '7 sorag, her soraga 15 sekunt. Güýçli botlar bilen soragyň başynda oýlanmak wagty bar.',
        'Wariant saýlaň — bot jogap berýänçä saýlawy üýtgedip bilersiňiz, bot jogap beren pursady saýlawyňyz kabul edilýär.',
        'Dogry jogap: 10 bal + çalt jogap üçin 5 bala çenli bonus. Ýeňiş duel reýtingini ýokarlandyrýar. Duelden çykylsa — utulyş.']],
      ['📖 Ensiklopediýa', [
        '18 bapdan ybarat JavaScript kitaby: düşündirişler, mysallar, "Ýatda saklaň" we "Özüňizi barlaň".',
        'Çepdäki gözleg meýdany bilen bap tapyp bilersiňiz. Her bapyň ahyrynda degişli sapaga geçmek düwmesi bar.',
        '<b>📤 Kitap ýükle</b>: öz PDF ýa-da tekst kitaplaryňyzy goşup, programmanyň içinde okap bilersiňiz.']],
      ['🧪 Mysal işlemek', [
        '104 mesele, 8 bölüm. Funksiýanyň şablony taýýar — diňe içini ýazyň we <b>▶ Barla</b> (Ctrl+Enter) basyň.',
        'Kod mysallar we goşmaça barlaglar bilen barlanýar. Ähli testler geçse — mesele çözüldi we XP berilýär (aňsat 10, orta 20, kyn 35).',
        'Şowsuz barlag −1 XP. <b>💡 Maslahat</b> mugt, <b>📖 Çözgüt</b> −30 XP (soňra bu mesele üçin XP berilmeýär).']],
      ['⌨️ Kod redaktory', [
        'Sag ýokardaky <b>&lt;/&gt;</b> düwmesi. Faýllar döredip, kod ýazyp, <b>▶ Işlet</b> (Ctrl+Enter ýa-da F5) bilen işledip bilersiňiz; netije KONSOL-da görünýär.',
        'Maslahatlar awtomatik çykýar (cns → console, fn → function). Ctrl+Space — maslahatlary görkezmek, Ctrl+/ — teswir, Ctrl+D — setiri göçürmek.',
        '<b>🌐 DOM</b> düwmesi: kod HTML sahypanyň içinde işleýär — document, düwmeler, wakalar. Sahypa "SAHYPA (DOM)" penjiresinde görünýär.',
        '📚 Mysallar panelinde taýýar mysallar bar. Faýllar awtomatik saklanýar.']],
      ['🌐 Lokal (ýerli tor)', [
        'Diňe <b>JavaScript.exe</b> programmasynda işleýär. Kompýuterler şol bir Wi-Fi ýa-da ýerli tora birikdirilen bolmaly.',
        'Bir oýunçy <b>Otag döret</b> basýar. Beýlekiler otagy "Tapylan otaglar" sanawynda görýär ýa-da IP salgy bilen goşulýar.',
        'Otagy döreden <b>▶ Başla</b> basýar. Hemmeler şol bir soraglara wagta garşy jogap berýär; ahyrynda orunlar tablisasy.',
        'Ilkinji gezek Windows Firewall rugsat soraýar — <b>Rugsat ber</b> basyň.']],
      ['⚙️ Sazlamalar', [
        'Dil, tema (5 tema we öz reňkleriňiz), şriftiň ölçegi, animasiýalar, ses, düşündirişler, duelde özbaşdak geçiş.',
        '<b>⬇ Eksport</b> — ähli ösüşi JSON faýla saklamak; <b>⬆ Import</b> — başga kompýuterde dikeltmek.',
        'Wagt bölüminde internet wagtynyň ýagdaýy görünýär.']],
      ['❓ Köp berilýän soraglar', [
        '<b>Ösüşim nirede saklanýar?</b> — Şu kompýuterde. Başga kompýutere geçirmek üçin Sazlamalar → Eksport / Import.',
        '<b>Janlarym gutardy, näme etmeli?</b> — Her 10 minutda 1 jan dikelýär. Tamamlanan derejäni ýalňyşsyz gaýtalasaňyz, +1 jan.',
        '<b>Lokal bölümde otag görünmeýär?</b> — Iki kompýuteriň şol bir tordadygyny we Firewall rugsadyny barlaň, ýa-da IP salgy bilen goşulyň.',
        '<b>Ekran okaýjy bilen ulanyp bolýarmy?</b> — Hawa: Tab bilen ähli düwmelere geçip bolýar, netijeler we habarlar okalýar.']]
    ]
  },
  ru: {
    title: '📘 Как пользоваться программой',
    intro: 'Это руководство кратко описывает все разделы программы. Нажмите на название раздела, чтобы открыть его.',
    sections: [
      ['🚀 Начало работы', [
        'При первом запуске введите имя, выберите аватар и нажмите <b>Начать</b>. Сверху можно выбрать язык: Türkmençe / Русский / English.',
        'Верхнее меню: <b>Уроки</b>, <b>Рейтинг</b>, <b>Дуэль 1×1</b>, <b>Энциклопедия</b>, <b>Практика</b>, <b>Локальная сеть</b>. Справа вверху: <b>&lt;/&gt;</b> — редактор кода, аватар — профиль.',
        'На верхней панели: 🔥 серия (дней), ⭐ всего XP, ❤️ жизни, значок лиги. Изменения показываются как +N / −N.',
        'Кнопка <b>☰</b> в левом нижнем углу: Настройки, О программе и это руководство.']],
      ['📚 Уроки', [
        '12 разделов, в каждом 10 уровней по 5 вопросов. Уровни открываются по порядку: следующий открывается после прохождения предыдущего.',
        'Выберите вариант или введите ответ и нажмите <b>Проверить</b>. За ошибку снимается 1 жизнь, вопрос повторяется в конце урока.',
        'Жизни: 15, каждые 10 минут восстанавливается одна. Если жизни закончились, пока можно читать энциклопедию.',
        'За пройденный уровень начисляются XP (по лиге и числу верных ответов с первой попытки), без ошибок — бонус +5 и ⭐⭐⭐.']],
      ['👤 Профиль и уровни', [
        'В профиле: уровень, XP, жизни, рейтинг, характеристики, график за 7 дней, значки. Блоки открываются и закрываются нажатием на заголовок.',
        'Кнопка 📷 — загрузить фото профиля, <b>✏️ Изменить</b> — сменить имя и аватар.',
        '<b>🎖 Уровни</b>: +50 XP за каждый новый уровень и ещё +100 XP на каждом 5-м. При повышении появляется окно с поздравлением.',
        '<b>🩺 Ошибки и советы</b>: если одна и та же ошибка повторилась 5 раз, она появится здесь вместе с советом, что прочитать и повторить.']],
      ['🏆 Рейтинг (недельная лига)', [
        '5 лиг: Ученик → Frontend → FullStack → Хакер → Крэкер. Каждую неделю вы попадаете в группу из 15 участников.',
        'Место зависит только от XP, набранных на этой неделе. Первые 3 места поднимаются в лигу выше, последние 3 — опускаются.',
        'Неделя обновляется каждый понедельник в 00:00. Время берётся из интернета.']],
      ['⚔️ Дуэль 1×1', [
        '4 бота: Haiku 5.5 (лёгкий) → Sonnet 5.5 → Opus 5.5 → Fable 5.1 (самый сложный). Вопросы из пройденных уроков.',
        '7 вопросов, по 15 секунд на каждый. С сильными ботами в начале вопроса есть время на раздумье.',
        'Выберите вариант — пока бот не ответил, выбор можно менять; в момент ответа бота ваш выбор принимается.',
        'Верный ответ: 10 баллов + до 5 баллов за скорость. Победа повышает рейтинг дуэлей. Выход из дуэли — поражение.']],
      ['📖 Энциклопедия', [
        'Книга по JavaScript из 18 глав: объяснения, примеры, «Запомните» и «Проверьте себя». Текст книги — на туркменском языке.',
        'Поле поиска слева помогает найти главу. В конце каждой главы есть кнопка перехода к уроку.',
        '<b>📤 Загрузить книгу</b>: добавьте свои PDF или текстовые книги и читайте их в программе.']],
      ['🧪 Практика', [
        '104 задачи в 8 разделах. Шаблон функции готов — допишите тело и нажмите <b>▶ Проверить</b> (Ctrl+Enter).',
        'Код проверяется на примерах и дополнительных тестах. Если все тесты пройдены — задача решена и начисляются XP (лёгкая 10, средняя 20, сложная 35).',
        'Неудачная проверка −1 XP. <b>💡 Подсказка</b> бесплатна, <b>📖 Решение</b> стоит −30 XP (после этого XP за задачу не даются).']],
      ['⌨️ Редактор кода', [
        'Кнопка <b>&lt;/&gt;</b> справа вверху. Создавайте файлы, пишите код и запускайте кнопкой <b>▶ Запустить</b> (Ctrl+Enter или F5); результат — в КОНСОЛИ.',
        'Подсказки появляются автоматически (cns → console, fn → function). Ctrl+Space — подсказки, Ctrl+/ — комментарий, Ctrl+D — дублировать строку.',
        'Кнопка <b>🌐 DOM</b>: код выполняется внутри HTML-страницы — document, кнопки, события. Страница видна в окне «СТРАНИЦА (DOM)».',
        'На панели 📚 Примеры есть готовые примеры. Файлы сохраняются автоматически.']],
      ['🌐 Локальная сеть', [
        'Работает только в программе <b>JavaScript.exe</b>. Компьютеры должны быть в одной сети Wi-Fi или локальной сети.',
        'Один игрок нажимает <b>Создать комнату</b>. Остальные видят её в списке «Найденные комнаты» или подключаются по IP-адресу.',
        'Создатель нажимает <b>▶ Начать</b>. Все отвечают на одни и те же вопросы на время; в конце — таблица мест.',
        'В первый раз брандмауэр Windows запросит разрешение — нажмите <b>Разрешить доступ</b>.']],
      ['⚙️ Настройки', [
        'Язык, тема (5 тем и свои цвета), размер шрифта, анимации, звук, объяснения, автопереход в дуэли.',
        '<b>⬇ Экспорт</b> — сохранить весь прогресс в JSON-файл; <b>⬆ Импорт</b> — восстановить на другом компьютере.',
        'В разделе «Время» показано состояние интернет-времени.']],
      ['❓ Частые вопросы', [
        '<b>Где хранится прогресс?</b> — На этом компьютере. Чтобы перенести: Настройки → Экспорт / Импорт.',
        '<b>Закончились жизни, что делать?</b> — Каждые 10 минут восстанавливается одна. За повтор пройденного уровня без ошибок +1 жизнь.',
        '<b>В локальной сети не видно комнату?</b> — Проверьте, что компьютеры в одной сети и брандмауэр разрешён, или подключитесь по IP.',
        '<b>Можно ли пользоваться с программой чтения экрана?</b> — Да: все кнопки доступны по Tab, результаты и сообщения озвучиваются.']]
    ]
  },
  en: {
    title: '📘 How to use the app',
    intro: 'This guide briefly describes every part of the app. Click a section title to open it.',
    sections: [
      ['🚀 Getting started', [
        'On first launch, type your name, choose an avatar and press <b>Start</b>. You can pick the language at the top: Türkmençe / Русский / English.',
        'Top menu: <b>Lessons</b>, <b>Rating</b>, <b>1×1 Duel</b>, <b>Encyclopedia</b>, <b>Practice</b>, <b>Local</b>. Top right: <b>&lt;/&gt;</b> — code editor, your avatar — profile.',
        'The top bar shows 🔥 streak (days), ⭐ total XP, ❤️ hearts and your league icon. Changes appear as +N / −N.',
        'The <b>☰</b> button in the bottom-left corner opens Settings, About and this guide.']],
      ['📚 Lessons', [
        '12 units, each with 10 levels of 5 questions. Levels unlock in order: the next one opens after you finish the previous one.',
        'Pick an option or type the answer and press <b>Check</b>. A wrong answer costs 1 heart and the question comes back at the end of the lesson.',
        'Hearts: 15, one is restored every 10 minutes. If you run out, you can read the encyclopedia meanwhile.',
        'Finishing a level gives XP (based on your league and first-try correct answers); a perfect run gives +5 bonus and ⭐⭐⭐.']],
      ['👤 Profile and levels', [
        'The profile shows your level, XP, hearts, rating, statistics, a 7-day chart and badges. Click a block title to open or close it.',
        'The 📷 button uploads a profile photo, <b>✏️ Edit</b> changes your name and avatar.',
        '<b>🎖 Levels</b>: +50 XP for every new level and an extra +100 XP at every 5th level. A congratulation window appears when you level up.',
        '<b>🩺 Mistakes and tips</b>: once the same mistake repeats 5 times it appears here, with a chapter to read and a lesson to review.']],
      ['🏆 Rating (weekly league)', [
        '5 leagues: Novice → Frontend → FullStack → Hacker → Cracker. Every week you join a group of 15 participants.',
        'Your place depends only on XP earned this week. The top 3 move up a league, the bottom 3 move down.',
        'The week resets every Monday at 00:00. Time is taken from the internet.']],
      ['⚔️ 1×1 Duel', [
        '4 bots: Haiku 5.5 (easy) → Sonnet 5.5 → Opus 5.5 → Fable 5.1 (hardest). Questions come from the lessons you have passed.',
        '7 questions, 15 seconds each. Strong bots give thinking time at the start of each question.',
        'Pick an option — you can change it until the bot answers; your choice is accepted at that moment.',
        'A correct answer gives 10 points + up to 5 for speed. Wins raise your duel rating. Leaving a duel counts as a loss.']],
      ['📖 Encyclopedia', [
        'An 18-chapter JavaScript book with explanations, examples, "Remember" and "Test yourself" parts. The book text is in Turkmen.',
        'Use the search box on the left to find a chapter. Each chapter ends with a button to the related lesson.',
        '<b>📤 Upload a book</b>: add your own PDF or text books and read them inside the app.']],
      ['🧪 Practice', [
        '104 problems in 8 sections. The function template is ready — fill in the body and press <b>▶ Check</b> (Ctrl+Enter).',
        'Your code is checked with examples and extra tests. If all pass, the problem is solved and XP is awarded (easy 10, medium 20, hard 35).',
        'A failed check costs −1 XP. <b>💡 Hint</b> is free, <b>📖 Solution</b> costs −30 XP (after that the problem gives no XP).']],
      ['⌨️ Code editor', [
        'The <b>&lt;/&gt;</b> button at the top right. Create files, write code and run it with <b>▶ Run</b> (Ctrl+Enter or F5); output appears in the CONSOLE.',
        'Suggestions appear automatically (cns → console, fn → function). Ctrl+Space — suggestions, Ctrl+/ — comment, Ctrl+D — duplicate line.',
        'The <b>🌐 DOM</b> button runs code inside an HTML page — document, buttons, events. The page appears in the "PAGE (DOM)" panel.',
        'The 📚 Examples panel has ready-made examples. Files are saved automatically.']],
      ['🌐 Local network', [
        'Works only in the <b>JavaScript.exe</b> app. The computers must be on the same Wi-Fi or local network.',
        'One player presses <b>Create a room</b>. Others see it under "Rooms found" or join by IP address.',
        'The creator presses <b>▶ Start</b>. Everyone answers the same questions against the clock; a ranking table appears at the end.',
        'The first time, Windows Firewall asks for permission — press <b>Allow access</b>.']],
      ['⚙️ Settings', [
        'Language, theme (5 themes and your own colours), font size, animations, sound, explanations, auto-advance in duels.',
        '<b>⬇ Export</b> saves all progress to a JSON file; <b>⬆ Import</b> restores it on another computer.',
        'The Time section shows the internet-time status.']],
      ['❓ FAQ', [
        '<b>Where is my progress stored?</b> — On this computer. To move it: Settings → Export / Import.',
        '<b>I ran out of hearts — what now?</b> — One heart is restored every 10 minutes. Replaying a completed level without mistakes gives +1 heart.',
        '<b>I cannot see a room in Local?</b> — Make sure both computers are on the same network and the firewall is allowed, or join by IP.',
        '<b>Can I use it with a screen reader?</b> — Yes: every button is reachable with Tab, results and messages are announced.']]
    ]
  }
};

App.views.guide = {
  render(el) {
    const G = App.GUIDE[App.i18n.lang] || App.GUIDE.tk;
    const s = App.store.state;
    const open = s.ui.guideOpen || 0;   // soňky açylan bölüm
    el.innerHTML = `
      <div class="guide" data-noi18n lang="${App.i18n.lang}">
        <h1>${G.title}</h1>
        <p class="muted">${G.intro}</p>
        ${G.sections.map(([title, items], i) => `
          <details class="fold" data-i="${i}" ${i === open ? 'open' : ''}>
            <summary>${title}<span class="chev">▼</span></summary>
            <div class="fold-body"><ul class="guide-list">${items.map(x => `<li>${x}</li>`).join('')}</ul></div>
          </details>`).join('')}
      </div>`;
    el.querySelectorAll('details[data-i]').forEach(d => d.addEventListener('toggle', () => {
      if (d.open) { s.ui.guideOpen = +d.dataset.i; App.store.save(); }
    }));
  }
};
