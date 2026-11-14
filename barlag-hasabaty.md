# JS Öwren — programmanyň barlag hasabaty

Sene: 11.11.2026 · Awtor: Meredow Serdar · Barlan: Claude (Opus 5.5)

Bu hasabatda programmanyň **gowy edilen** taraplary, **düzetmeli** zatlary we **kemçilikleri** jemlenen.

> **Täzelenme (11.11.2026):** hasabatdaky düzetmeli zatlaryň köpüsi düzedildi — aşakdaky
> "7. Düzedilen zatlar" bölümine serediň. Programmany `.exe` görnüşine ýygnamak üçin
> `main.py` we `build.bat` taýýar, ýöne `.exe` entek ýasalmady.

---

## 1. Umumy maglumat

| Görkeziji | Baha |
|---|---|
| Kod faýllary (`js/`, `js/views/`) | 16 faýl, ~3 840 setir |
| Maglumat faýllary (`js/data/`) | 11 faýl, ~2 870 setir |
| Stiller (`css/style.css`) | ~810 setir |
| Jemi ölçeg | ~490 KB (serwersiz, internetsiz işleýär) |
| Sapaklar | 12 bölüm × 10 dereje = 120 dereje, **600 sorag** (409 saýlamaly, 191 ýazmaly) |
| Mesele işlemek | 8 bölüm × 13 = **104 mesele**, her biri awtomatik testler bilen |
| Ensiklopediýa | **18 bap**, ~700 blok, her bapda düşündiriş, mysal, jem we özüňi barla |
| Bölümler | Sapaklar, Profil, Reýting, 1×1 Duel, Ensiklopediýa, Mysal işlemek, Kod redaktory, Sazlamalar, Programma hakda |

### Awtomatik barlagyň netijesi (11.11.2026)

- Ähli 12 sahypa (baş sahypa, profil, reýting, duel, ensiklopediýa, meseleler, redaktor, sazlamalar, programma hakda, sapaklar) **ýalňyşlyksyz** açylýar.
- 600 soragyň arasynda gaýtalanýan sorag ýok.
- Sapaklardaky 449 kod mysaly işledilip, berlen jogaplar bilen deňeşdirildi — hemmesi dogry.
- 104 meseläniň nusga çözgüdi öz testlerinden geçýär, başlangyç şablon geçmeýär.
- Ulanyjynyň ýagdaýy `localStorage`-da ~2 KB (täze ulanyjy) — çäkden (5 MB) gaty uzak.

---

## 2. Gowy edilen zatlar ✅

### Gurluş we tehnologiýa
- **Serwersiz we internetsiz işleýär**: diňe `index.html` açmak ýeterlik. `.exe` görnüşine geçirmek aňsat (pywebview).
- **Kod tertipli bölünen**: maglumatlar (`data/`), umumy kömekçiler (`util.js`), ýagdaý (`store.js`), her sahypa aýratyn faýlda (`views/`).
- **Ähli san bahalary bir ýerde** (`App.RULES`): XP, janlar, duel, liga sazlamalaryny bir setiri üýtgedip sazlap bolýar.
- **Köne maglumatlar bilen gabat gelýär**: täze meýdanlar goşulanda köne ýagdaý awtomatik birleşdirilýär (meselem, duel reýtingi 1000 → 0 ulgamyna geçirildi).
- **Teswirler we ähli tekstler türkmen dilinde**: kod düşnükli we diplom goragynda düşündirmek aňsat.

### Howpsuzlyk
- Ulanyjynyň ýazan kody **aýratyn Web Worker-de** işleýär: sahypa we maglumatlar bilen baglanyşygy ýok.
- Çäksiz sikl **5 sekuntda** (meselelerde 3 sekuntda) togtadylýar — programma doňmaýar.
- Ulanyjynyň girizýän ähli tekstleri (at, faýl ady, kitap ady) HTML-e goýulmazdan öň **arassalanýar** (`U.esc`) — XSS hüjümlerinden goralýar.

### Okuw usulyýeti
- **Derejeli ösüş**: Duolingo ýaly yzygiderli açylýan derejeler, janlar, ýyldyzlar, yzygiderlik bonusy.
- **Ýalňyş jogap gaýtadan berilýär** we düşündiriş görkezilýär.
- **Mesele işlemek**: açyk we goşmaça barlaglar, maslahat, tölegli çözgüt (−30 XP), şowsuz barlag üçin jerime (−1 XP).
- **Kodyň hilini barlamak**: gaýtalanýan setirler, gaýtalanýan bloklar, iki gezek yglan edilen funksiýa, nusga çözgüdi göçürmek (atlary üýtgedilen hem) ýüze çykarylýar.
- **Ýalňyşlyklaryň seljermesi**: 5 gezek gaýtalanan ýalňyşlyklar profilde görkezilýär we okamaly bap, gaýtalamaly sapak teklip edilýär.
- **Parametrleriň nireden baha alýandygy** mysallarda aýdyň görkezilýär.

### Bäsleşik we höwes döretmek
- **Hepdelik liga**: 5 liga (Öwreniji → Kraker), kesgitli tötänlik bilen (seed) modellenýän bäsdeşler, ýokary/aşak geçmek.
- **1×1 Duel**: 4 dürli bot (Haiku, Sonnet, Opus, Fable), soraglaryň kynlygy hasaplanýar we her bot öz kynlyk zolagyndan sorag berýär, reýting derejeleri.
- **14 nyşan** (achievement), XP / jan / yzygiderlik üýtgände ýokarky menýuda görkezilýän "+N / −N" belgiler.

### Ulanyjy tejribesi
- **VS Code görnüşli redaktor**: reňkli ýazgy, IntelliSense (bulanyk gözleg: `cns` → `console`), snippetler, gysga ýollar, faýllar, konsol.
- **5 tema** we **öz reňkleriňi saýlamak** (7 reňk), şrift ölçegi, animasiýalary öçürmek, ses.
- **Ösüşi eksport/import** etmek (JSON faýl).
- **Kitap ýüklemek** (PDF, TXT) we programmanyň içinde okamak (IndexedDB).
- Kiçi ekranlara uýgunlaşýar (responsive).

---

## 3. Düzetmeli zatlar 🔧

Möhümligi boýunça tertiplenen.

### 3.1. Ýokary möhüm

1. **17 meselede goşmaça barlag ýok.**
   `p34, p37, p59, p68, p71, p74, p75, p77, p82, p83, p84, p86, p87, p88, p89, p91, p103` meselelerinde diňe 2 test bar — ikisi hem açyk görkezilýär. Şonuň üçin:
   - "Ýene **0** sany goşmaça barlag bar" diýen geň ýazgy çykýar;
   - jogaby göni ýazyp (`if (a === 2) return 5`) aldap bolýar.
   **Düzediş:** her meselä iň az 1–2 goşmaça barlag goşmak.

2. **Dereje ýokarlananda habar ýok.**
   Ulanyjy täze derejä (meselem, 2 → 3) geçende hiç hili habar ýa-da baýramçylyk görkezilmeýär — diňe profilde san üýtgeýär.
   **Düzediş:** XP goşulanda derejäni deňeşdirip, "🎉 Täze dereje!" habaryny görkezmek.

3. **`.exe`-ä geçende maglumatlar geçmez.**
   `localStorage` we IndexedDB brauzere we salga (`file://...`) baglanyşykly. `.exe` (pywebview) başga salga bilen açylanda ulanyjynyň ösüşi we ýüklän kitaplary görünmez.
   **Düzediş:** `.exe` taýýarlananda maglumatlary sabit ýerde saklamak (pywebview `private_mode=False`, `storage_path`) we ulanyja "Ösüşi göçürip almak" maslahatyny bermek.

4. **Eksport faýlyna kitaplar girmeýär.**
   "Ösüşi göçürip almak" diňe `localStorage`-y saklaýar; IndexedDB-däki kitaplar we redaktoryň faýllaryndan başga zat bolsa ýitip biler.
   **Düzediş:** eksporta kitaplary (ýa-da olaryň sanawyny) goşmak.

### 3.2. Orta möhüm

5. **Dueli programmany ýapyp taşlamak.**
   Duelden başga sahypa geçilse utulyş hasaplanýar, ýöne programma (tab) ýapylsa hiç zat ýazylmaýar — utuljak duelden şeýdip "gaçyp" bolýar.
   **Düzediş:** başlanan dueli `localStorage`-da bellemek we indiki açylanda utulyş hasaplamak.

6. **XP-ni gaýtalamalar bilen "ýygnap" bolýar.**
   Tamamlanan derejäni gaýtadan geçmek ×0.5 XP berýär, ýöne sany çäklendirilmedik. Ligada ýeňmek üçin bir aňsat derejäni köp gezek gaýtalap bolýar.
   **Düzediş:** gündelik gaýtalama XP-sine çäk goýmak (meselem, şol bir dereje üçin günde 3 gezek).

7. **Wagt kompýuteriň sagadyna bagly.**
   Janlaryň dikelişi, liga hepdesi we yzygiderlik ulgam sagadyna bagly — sagady üýtgedip aldap bolýar. Serwersiz programma üçin kadaly ýagdaý, ýöne kemçilik hökmünde bellemeli.

8. **Brauzeriň standart penjireleri.**
   Käbir ýerlerde (`confirm`, `prompt` — 8 ýerde: faýl döretmek/pozmak, kitap pozmak, sapakdan çykmak we ş.m.) brauzeriň ýönekeý penjireleri ulanylýar, beýleki ýerlerde bolsa programmanyň öz owadan penjiresi bar. Bitewi görnüş üçin olary hem programmanyň öz penjiresi bilen çalyşmak gowy.

9. **252 soragda düşündiriş ýok** (600-den).
   Ýalňyş jogapdan soň diňe dogry jogap görkezilýär, "näme üçin" diýen düşündiriş ýok.
   **Düzediş:** galan soraglara gysga düşündiriş goşmak.

### 3.3. Pes möhüm

10. Profildäki "Häsiýetnamalar" bölüminiň ýanyndaky san (**8**) koda göni ýazylan — tile goşulsa üýtgemez.
11. Mesele jerimeleri (−1 XP) hepdelik XP-den aýrylýar, ýöne "Soňky 7 günüň işjeňligi" grafiginde görünmeýär.
12. Öz reňkleriňi saýlanyňda **kontrast barlagy ýok**: meselem, tekst bilen fon şol bir reňk saýlansa, tekst okalmaz.

---

## 4. Kemçilikler we çäklendirmeler ⚠️

Bular ýalňyşlyk däl, häzirki gurluşyň çäkleri.

- **Hakyky ulanyjylar ýok**: reýtingdäki bäsdeşler we duel garşydaşlary botlar. "Lokal" (tor arkaly ýaryşmak) bölümi soňa galdyryldy.
- **Redaktorda DOM ýok**: kod Web Worker-de işleýär, şonuň üçin `document`, düwmeler, sahypa elementleri bilen işläp bolmaýar. 10-njy bölüm (DOM we wakalar) diňe nazary soraglar bilen öwredilýär.
- **Redaktor diňe bir faýly işledýär**: faýllaryň arasynda `import` / `export` ýok.
- **Botlaryň dogry jogap bermek ähtimallygy soragyň kynlygyna bagly däl**: Fable 5.1 aňsat soragda hem, kyn soragda hem 92% dogry jogap berýär.
- **Awtomatik testler taslamada ýok**: barlaglar ösüş wagtynda wagtlaýyn faýllar bilen geçirildi, ýöne taslamanyň içinde gaýtadan işledip boljak test faýly saklanmady.
- **Diňe türkmen dilinde**: interfeýsi başga dile geçirip bolmaýar.
- **Ähli kod global `App` obýektinde**: modullar (`import`) ulanylmaýar. Kiçi taslama üçin kadaly, ýöne ulalsa dolandyrmak kynlaşar.
- **Elýeterlilik (accessibility)**: köp ýerde diňe emoji we reňk bilen many berilýär (meselem, ✅ / ❌, ýaşyl / gyzyl); ekran okaýjy programmalar üçin goşmaça ýazgylar (aria) az.
- **Käbir funksiýalar hakyky wagtda el bilen barlanmaly**: redaktordaky asinhron kod (`setTimeout`) we çäksiz sikli togtatmak awtomatik barlagda doly synalyp bilinmedi.

---

## 5. Teklip edilýän indiki ädimler

1. 17 meselä goşmaça barlag goşmak (3.1-nji bendiň 1-nji punkty).
2. Dereje ýokarlananda habar görkezmek.
3. Programmany `.exe` görnüşine geçirmek we maglumatlaryň saklanýan ýerini berkitmek.
4. Galan 252 soraga düşündiriş ýazmak.
5. Dueliň taşlanmagyny we XP ýygnamagy çäklendirmek.
6. Diplom goragy üçin: ekran suratlary, ulanyjy gollanmasy we arhitektura çyzgysy (bölümler we maglumat akymy) taýýarlamak.

---

## 7. Düzedilen zatlar ✔ (11.11.2026)

| № | Näme düzedildi | Barlag |
|---|---|---|
| 1 | 17 meselä 1–2 goşmaça barlag goşuldy — indi her meselede iň az 1 goşmaça barlag bar | nusga çözgütler täze testlerden geçýär |
| 2 | Dereje ýokarlananda "🎉 Gutlaýarys! Siz N-nji derejä ýetdiňiz" habary we ses | ✔ |
| 3 | `.exe` üçin maglumatlaryň saklanyşy: `main.py` programmany hemişe şol bir salgyda (`127.0.0.1:47821`) açýar, maglumatlar `%APPDATA%\JSOwren`-de | `main.py` taýýar (`.exe` entek ýasalmady) |
| 4 | Eksport faýlyna ýüklenen kitaplar hem goşulýar, import olary dikeldýär | ✔ eksport → pozmak → import |
| 5 | Programma duel wagty ýapylsa, indiki açylanda utulyş hasaplanýar we habar berilýär | ✔ |
| 6 | Şol bir derejäni gaýtalamak üçin XP günde iň köp 3 gezek berilýär (`App.RULES.REPLAY_DAILY`) | ✔ |
| 8 | Brauzeriň `confirm` / `prompt` penjireleri programmanyň öz bitewi penjiresi bilen çalşyldy (8 ýerde) | ✔ |
| 9 | 252 soraga düşündiriş ýazyldy — indi 600 soragyň hemmesinde düşündiriş bar (`js/data/explanations.js`) | ✔ |
| 10 | Profildäki häsiýetnamalaryň sany awtomatik hasaplanýar | ✔ |
| 11 | Mesele jerimeleri "Soňky 7 günüň işjeňligi" grafiginde hem hasaba alynýar | ✔ |
| 12 | Öz reňkleri saýlananda tekst bilen fonyň kontrasty barlanýar (4.5:1-den az bolsa duýduryş) | ✔ |
| — | Botyň dogry jogap bermek ähtimallygy soragyň kynlygyna bagly (aňsat soragda +15 %, kyn soragda −15 %) | ✔ |
| — | Taslama içinde awtomatik testler: `tests/test.html` (7 test toplumy) — brauzerde açmak ýeterlik | ✔ ähli 7 toplum geçýär |

**Düzedilmedik (gurluşyň çäkleri):** global `App` obýekti — 4-nji bölümdäki ýaly.
**Lokal bölümi goşuldy (12.11.2026):** ýerli tor arkaly hakyky adamlar bilen ýaryş (`lan.py`, `js/views/lan.js`) —
serwer API-si (host hukuklary, tokenler, wagt, ballar), UDP arkaly otag tapmak we interfeýs (host + oýunçy, 5 sorag) synag edildi.

### Täzelenme (12.11.2026) — 4-nji bölümdäki çäklendirmeleriň dördüsi aýryldy

| Näme düzedildi | Barlag |
|---|---|
| **Wagt internet sagadyna baglandy** (`js/clock.js`): janlar, yzygiderlik, liga, duel taryhy — `App.clock.now()`. `.exe`-de `main.py` wagty NTP-den alýar (`/api/time`), brauzerde — wagt hyzmatlaryndan; internet ýok bolsa soňky belli tapawut; wagt yza gitmeýär | ✔ NTP: kompýuteriň sagady ~8 s öňde tapyldy we düzedildi |
| **Redaktorda DOM**: 🌐 DOM rejimi — kod goragly `iframe`-de (sandbox) işleýär, `document`, wakalar, `index.html` / `.html` faýllar; çäksiz sikl 3 s-dan soň togtadylýar | ✔ querySelector, NodeList, ýalňyşlygyň setiri, çäksiz sikl |
| **Rus we iňlis dilleri** (`js/i18n.js`, `js/i18n-dict.js`): interfeýsiň ähli ýazgylary; mazmun (soraglar, ensiklopediýa, meseleleriň şertleri) türkmen dilinde galýar | ✔ ähli sahypalar we wagtlaýyn habarlar (duel, sapak, mesele, penjireler) iki dilde barlandy; `tests/test.html` — 8-nji toplum |
| **Elýeterlilik (ARIA)** (`js/a11y.js`): progressbar, aria-label, aria-pressed, aria-live, dialog + fokus, "Esasy mazmuna geç", fokus görnüşi, reduced motion | ✔ |

---

## 6. Barlagyň usuly

- Programma Microsoft Edge-iň headless (penjiresiz) tertibinde açylyp, ähli sahypalar awtomatik geçildi.
- Sapaklaryň, meseleleriň we ensiklopediýanyň kod mysallary işledilip, netijeleri berlen jogaplar bilen deňeşdirildi.
- Kod el bilen gözden geçirildi: howpsuzlyk (HTML arassalamak, Worker), maglumatlary saklamak, wagt bilen bagly düzgünler, ulanyjy tejribesi.
- Duel, reýting we mesele düzgünleri (XP, jerime, kynlyk) ölçeg arkaly barlandy.
