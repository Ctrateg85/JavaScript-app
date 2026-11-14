# JavaScript — öwrediji we test programmasy

Diplom işiniň mowzugy: **Ýokary bilimi barlaýan test programmasy.**
Awtor: **Meredow Serdar**, 2026. Diplom işiniň ýolbaşçysy: **Nurgeldiýew Oraz**.

## Işletmek

`index.html` faýlyny brauzerde (Chrome, Edge, Firefox) açmak ýeterlik. Serwer ýa-da gurnama gerek däl.
Ähli maglumatlar brauzeriň `localStorage`-ynda saklanýar.

## Bukjanyň gurluşy

```
Diplom is/
├── index.html              — esasy sahypa
├── css/style.css           — stiller
├── books/                  — goşmaça PDF kitaplar üçin
└── js/
    ├── data/
    │   ├── lessons.js      — bölümler, derejeler we soraglar (1–3-nji derejeler)
    │   ├── lessons-extra-1.js — 1–4-nji bölümleriň 4–10-njy derejeleri
    │   ├── lessons-extra-2.js — 5–8-nji bölümleriň 4–10-njy derejeleri
    │   ├── lessons-extra-3.js — 9–12-nji bölümleriň 4–10-njy derejeleri
    │   ├── book.js         — ensiklopediýa kitaby (+ goşmaça PDF sanawy)
    │   └── personas.js     — ligalar, reýting personažlary, duel botlary
    ├── clock.js            — internet (dünýä) wagty: App.clock.now()
    ├── util.js             — kömekçi funksiýalar
    ├── i18n.js             — köp dilli interfeýs (türkmen, rus, iňlis)
    ├── i18n-dict.js        — terjime sözlügi
    ├── a11y.js             — elýeterlilik: ekran okaýjy üçin ARIA ýazgylary
    ├── store.js            — ýagdaý, ballaryň düzgünleri (App.RULES), nyşanlar
    ├── rating.js           — hepdelik liga ulgamy
    ├── app.js              — marşrutlaşdyrma we ýokarky panel
    └── views/              — her bölümiň sahypasy
        ├── onboarding.js, home.js, lesson.js, profile.js,
        └── rating.js, duel.js, encyclopedia.js, about.js, settings.js
```

## Bölümler

| Bölüm | Mazmuny |
|---|---|
| **Sapaklar** | 12 bölüm × 10 dereje × 5 sorag = 600 sorag. Derejeler yzygiderli açylýar. Sorag görnüşleri: jogap saýlamak we jogaby ýazmak. |
| **Profil** (sag ýokarky burç) | "🎖 Derejeler" bölümi: häzirki dereje, indiki derejä çenli XP, baýrak düzgünleri, derejeler ýoly (gerek XP, baýrak, ýagdaý) we alnan baýraklaryň taryhy. Aýratyn "XP, janlar we reýting" bölümi (janlaryň dikeliş wagty bilen), häsiýetnamalar, 7 günlük grafik, bölümler boýunça ösüş, nyşanlar, profili üýtgetmek. Bölümler açylyp-ýapylýar. Profil suratyny ýüklemek (📷). "🩺 Ýalňyşlyklar we maslahatlar": diňe iň az 5 gezek gaýtalanan ýalňyşlyklar görkezilýär — gowşak temalar, okamaly bap, gaýtalamaly sapak, gaýtalanýan ýalňyşlyklar (×N). |
| **Kod redaktory** (`</>`, profiliň ýanynda) | VS Code görnüşli: faýllar, goýmalar, setir belgileri, sintaksis reňkleri, awtomatik maslahatlar (IntelliSense, bulanyk gözleg: `cns` → `console`, `fn` → `function`) we snippetler, mysallar, kody işletmek we konsol. **🌐 DOM rejimi:** kod aýratyn goragly sahypada (`iframe sandbox`) işleýär — `document`, `querySelector`, düwmeler, wakalar (`click`, `input`) bilen işläp bolýar, sahypa "SAHYPA (DOM)" penjiresinde görünýär. `.html` faýllar hemişe DOM rejiminde işleýär; `index.html` faýly bar bolsa, `.js` faýllar şol sahypada işleýär. Çäksiz sikl 3 sekuntdan soň togtadylýar. |
| **Reýting** | 5 liga (🥉 Öwreniji → 🥈 Frontend → 🥇 FullStack → 💎 Haker → 👑 Kraker), 15 gatnaşyjyly hepdelik toparlar. |
| **1×1 Duel** | 4 derejedäki bot bilen wagta garşy ýaryş, geçen sapaklardan soraglar, her soragyň kynlygy hasaplanýar (bölümdäki derejesi, bölüm, kodyň uzynlygy) we her bot öz kynlyk zolagyndan sorag berýär (●○○○ … ●●●●), oýlanmak wagty (Opus 5.5 — 1 s, Fable 5.1 — 2 s, Haiku/Sonnet — ýok), reýting derejeleri. Jogap üçin aýratyn düwme ýok: bot jogap berýänçä saýlawy üýtgedip bolýar, bot jogap beren pursady (ýa-da wagt gutaranda) soňky saýlaw awtomatik kabul edilýär; bot eýýäm jogap beren bolsa, basylan wariant derrew kabul edilýär. Her tapgyrdan soň kimiň dogry/ýalňyş jogap berendigi görkezilýär, ahyrynda soraglar boýunça jemleýji tablisa. "Soňky duellar" taryhy her duşenbe 00:00-da arassalanýar (ýeňiş/utulyş sanlary we reýting saklanýar). |
| **Ensiklopediýa** | 18 bapdan ybarat kitap (12 esasy bap + regulýar aňlatmalar, JSON, debugging, algoritmler, gowy kod endikleri, ýygy ýalňyşlyklar), gözleg, sapaklara baglanyşyk. Goşmaça maglumatlar `js/data/book-extra.js`, `book-extra-2.js` we `book-extra-3.js` faýllarynda (jemi ~700 blok). Her bapda düşündiriş bölümleri: 📘 Ýönekeý dil bilen, 🔍 Ädimme-ädim mysal, 📝 Ýatda saklaň, ❓ Özüňizi barlaň. "Goşmaça kitaplar": 📤 Kitap ýükle (PDF, TXT ...) — kitaplar brauzeriň IndexedDB bazasynda saklanýar we programmanyň içinde okalýar (`js/books.js`). |
| **🧪 Mysal işlemek** | 104 mesele, 8 bölüm × 13 (Operatorlar, Şertler, Sikller, Funksiýalar, Setirler, Massiwler, Obýektler, Algoritmler), her bölümde aňsat/orta/kyn: şert, kod meýdany (redaktoryň mümkinçilikleri bilen), awtomatik testler, maslahat, çözgüt. Funksiýanyň şablony taýýar goýulýar — ulanyjy diňe içini ýazýar, göçürip goýmak rugsat; 2 test açyk, galanlary goşmaça barlaglar (goşmaça barlag — bahalary görkezilmeýän goşmaça barlag: kodyň islendik bahada dogry işleýändigini barlaýar); şowsuz barlag −1 XP (0-dan aşak däl); çözgüdi görmek −30 XP (duýduryş bilen, soňra bu mesele üçin XP berilmeýär); gaýtalanýan setirler/bloklar, iki gezek yglan edilen funksiýa, nusga çözgüt (atlary üýtgedilen hem) ýa-da başga meseläniň kody bilen birmeňzeşlik üçin indiki meselä geçmezden öň duýduryş. Çözülen mesele üçin XP: aňsat 10, orta 20, kyn 35. Meseleler `js/data/problems.js` we `js/data/problems-2.js` faýllarynda. |
| **🌐 Lokal** | Şol bir Wi-Fi / ýerli tordaky adamlar bilen ýaryş (2–8 oýunçy). "Otag döret" — soraglar geçen sapaklardan alynýar (5–15 sorag, 10–30 s). Otaglar ýerli torda awtomatik tapylýar (UDP yglan, 47823 port); tapylmasa IP salgy bilen goşulyp bolýar. Wagt we ballar otagy döredijiniň kompýuterinde hasaplanýar: dogry jogap 10 bal + çaltlyk bonusy (iň köp 5). Ahyrynda: 1-nji orun +15 XP, beýlekiler +5 XP. **Diňe JavaScript.exe (ýa-da `py main.py`) bilen işleýär** — serwer bölegi `lan.py` (47822 port). Ilkinji gezek Windows Firewall rugsat soraýar. |
| **☰ Menýu** (aşaky çep burç) | Açylyp-ýapylýan menýu: Sazlamalar, Programmany nädip ulanmaly we Programma hakda. |
| **📘 Programmany nädip ulanmaly** | Ulanyjy gollanmasy (11 bölüm: başlamak, sapaklar, profil, reýting, duel, ensiklopediýa, mesele, redaktor, lokal, sazlamalar, köp berilýän soraglar) — türkmen, rus we iňlis dillerinde (`js/views/guide.js`). |
| **Sazlamalar** | 🌍 Dil (Türkmençe / Русский / English), 🕒 internet wagtynyň ýagdaýy, tema (gara-ýaşyl / neon / gün ýaşmasy / okean / çal), öz reňkleriň (esasy reňk, ikonkalar, goşmaça reňk, fon, kartoçkalar, tekst, kod fony), şriftiň ölçegi, animasiýalar, ses, düşündirişler, duelde özbaşdak geçiş, ösüşi eksport/import etmek. |
| **Programma hakda** | Aşakdaky (footer) salgyda: awtor, mowzuk, wersiýa, sanlar, mümkinçilikler. |

## Wagt, diller we elýeterlilik

**Internet wagty** (`js/clock.js`): janlaryň dikelişi, yzygiderlik, hepdelik liga we duel taryhy kompýuteriň sagadyna däl-de,
internetdäki takyk wagta bagly. Programma açylanda we her 30 minutda wagt alynýar: `.exe` görnüşinde `main.py` ony NTP
serwerlerinden (`time.google.com`, `pool.ntp.org`, `time.windows.com`) alýar (`/api/time`), brauzerde — wagt hyzmatlaryndan
(worldtimeapi.org, timeapi.io). Internet ýok bolsa, soňky belli tapawut ulanylýar; wagt hiç haçan yza gitmeýär (sagady yza
süýşürip aldap bolmaýar). Senäniň çäkleri (gün, hepde) ulanyjynyň ýerli sagat guşagyna görä.

**Diller** (`js/i18n.js`, `js/i18n-dict.js`): Türkmençe, Русский, English — Sazlamalarda ýa-da ilkinji sahypada saýlanýar.
Interfeýsiň ähli ýazgylary (menýular, düwmeler, habarlar, penjireler, düzgünler) terjime edilýär. Sapaklaryň soraglary,
düşündirişler, ensiklopediýanyň mazmuny, meseleleriň atlary we şertleri türkmen dilinde galýar.
Täze ýazgy goşulanda: `i18n-dict.js` faýlyna `'türkmençe': ['русский', 'English']` setirini goşmak ýeterlik
(sanlar — `#`, wagt — `⌚`, bot ady — `§`, islendik tekst — `*`).

**Elýeterlilik** (`js/a11y.js`): ekran okaýjy programmalar (NVDA, JAWS, Narrator) üçin ARIA ýazgylary — ösüş zolaklary
(`role="progressbar"`), ikonkaly düwmeleriň atlary, saýlanan wariantlar (`aria-pressed`), jogabyň netijesi we habarlar
(`aria-live`), penjireler (`role="dialog"`, Tab bilen içinde aýlanmak), sahypa çalşanda sözbaşy okalýar, "Esasy mazmuna geç"
düwmesi (Tab), görünýän klawiatura fokusy, ulgamda "hereketi azalt" saýlanan bolsa animasiýalar öçýär.

## Ballaryň hasaplanyşy

Ähli san bahalary `js/store.js` faýlyndaky `App.RULES` obýektinde.

**Sapak (dereje):**
- Derejäni tamamlamak: liga boýunça aralykdan, ilkinji synanyşykda dogry jogaplaryň paýyna görä:
  🥉 Öwreniji **25–35**, 🥈 Frontend **20–30**, 🥇 FullStack **17–26**, 💎 Haker **14–22**, 👑 Kraker **11–18 XP**
- Ýalňyşsyz tamamlamak: **+5 XP** bonus
- Günüň ilkinji sapagy: **+yzygiderlik güni** (iň köp +7)
- Tamamlanan derejäni gaýtadan geçmek: XP **×0.5**. Ýalňyşsyz geçilse, +1 jan berilýär.
- Ýyldyzlar: 0 ýalňyş — ⭐⭐⭐, 1–2 ýalňyş — ⭐⭐, köp ýalňyş — ⭐

**Janlar:** 15 jan. Her ýalňyş jogap üçin 1 jan aýrylýar we şol sorag sapagyň ahyrynda gaýtadan berilýär.
Janlar gutarsa sapak şowsuz tamamlanýar. Her 10 minutda 1 jan dikelýär.

**Ulanyjy derejesi:** her geçiş üçin gerek XP: 1→2 — **150**, 2→3 — **250**, 3→4 — **350**, 4→5 — **450**, 5→6 — **550**,
soňra her dereje öňkiden 100 XP köp (650, 750, ...). Jemi: `XP(n) = 150·(n−1) + 50·(n−1)·(n−2)` —
2 — 150, 3 — 400, 4 — 750, 5 — 1200, 6 — 1750, 7 — 2400, 8 — 3150, ...

**Dereje baýraklary:** her täze dereje üçin **+50 XP**, her 5-nji derejede (5, 10, 15, ...) goşmaça **+100 XP**
(jemi +150). Dereje ýokarlananda ekranda gutlag penjiresi çykýar we berlen baýraklar görkezilýär.
Her dereje üçin baýrak diňe bir gezek berilýär (`App.RULES.LEVEL_UP_XP`, `LEVEL_MILESTONE_EVERY`, `LEVEL_MILESTONE_XP`).
Baýrak ulgamyndan öň ýetilen derejeler üçin baýrak berilmeýär.

**Hepdelik liga:**
- Orun diňe şu hepde gazanylan XP boýunça kesgitlenýär.
- Ilkinji 3 orun ýokary liga geçýär, soňky 3 orun aşak düşýär.
- Hepde duşenbe 00:00-da çalşylýar, XP nola deňlenýär we täze topar düzülýär.
- Personažlaryň XP-si kesgitli tötänlik bilen modellenýär we her sagat üýtgeýär: personaž her **2.5 sagatdan** bir gezek okap, **15–65 XP** gazanyp bilýär,
  ýöne bir günde **700 XP**-den köp gazanyp bilmeýär. Okamak ähtimallygy işjeňligine, günüň wagtyna we liga bagly;
  okamadyk sagatlarynda käwagt 10–40 XP jerime alýar. Hasaplanan hepdelik XP-niň üstüne onuň 0.2 bölegi goşulýar
  (**×1.2**, `App.RULES.LEAGUE_BOT_XP_MUL`), şonuň üçin günlük çäk hakykatda ~840 XP bolýar. Tablisada soňky sagatdaky üýtgeşme ▲ / ▼ bilen görkezilýär.

**1×1 Duel:**
- 7 sorag, her soraga jogap üçin 15 sekunt. Güýçli botlar bilen soragyň başynda oýlanmak wagty bar (adam hem, bot hem jogap berip bilmeýär): Opus 5.5 — 1 s, Fable 5.1 — 2 s; Haiku 5.5 we Sonnet 5.5 bilen ýok.
- Soraglar ulanyjynyň geçen (we häzirki) derejelerinden alynýar. Derejeler tertip boýunça kynlaşýar:
  Haiku 5.5 — ilkinji 60 %, Sonnet 5.5 — 20–80 %, Opus 5.5 — soňky 60 %, Fable 5.1 — soňky 40 %.
- Dogry jogap: 10 bal + çaltlyk bonusy `⌈galan_sekunt / 3⌉` (iň köp 5), wagt okamak döwründen soň hasaplanýar.
- Duel reýtingi 0-dan başlaýar. Ýeňiş: Haiku 5.5 **+10…15**, Sonnet 5.5 **+14…18**, Opus 5.5 **+18…23**, Fable 5.1 **+23…27**;
  utulyş: Haiku 5.5 **−5…10**, Sonnet 5.5 **−7…11**, Opus 5.5 **−9…14**, Fable 5.1 **−11…13**; deňme-deň **0** (0-dan aşak düşmeýär).
- Reýting derejeleri: 0–199 🌱 Öwreniji programmist, 200–499 💻 FullStack, 500–799 🕶️ Haker, 800+ 💀 Kraker.
- XP: ýeňiş +15, deňme-deň +5, utulyş +2. Duelden ortasynda çykylsa, utulyş hasaplanýar.

## Mazmun goşmak

- **Täze sorag:** `js/data/lessons.js` faýlynda degişli derejä `C(...)` (saýlamaly) ýa-da `I(...)` (ýazmaly) goşuň.
- **Täze mesele:** `js/data/problems.js` faýlynda `P(...)` goşuň: id, kynlyk, tema, at, funksiýanyň ady, parametrler, şert, testler `[[argumentler], netije]`, maslahat, çözgüt.
- **Täze bap:** `js/data/book.js` faýlynda `chapters` sanawyna goşuň.
- **PDF kitap:** faýly `books/` bukjasyna goýuň we `window.EXTRA_BOOKS` sanawyna ýazyň.
