// Ensiklopediýa: goşmaça maglumatlar
//  * 1–12-nji baplara täze bölümler goşulýar
//  * 13–18-nji täze baplar
// Bloklaryň görnüşi book.js faýlyndaky ýaly.

(function () {
  const H = t => ['h', t];
  const P = t => ['p', t];
  const CODE = t => ['code', t];
  const LIST = a => ['list', a];
  const TIP = t => ['tip', t];
  const extend = (id, blocks) => window.BOOK.chapters.find(c => c.id === id).blocks.push(...blocks);

  // ---------- 1. Giriş we üýtgeýänler ----------
  extend('ch1', [
    H('JavaScript nirede işleýär?'),
    LIST([
      '**Brauzerde** — sahypalary interaktiw edýär (düwmeler, formalar, animasiýalar).',
      '**Serwerde** — Node.js arkaly web serwerler, API-ler ýazylýar.',
      '**Mobil we desktop** — React Native, Electron ýaly gurallar bilen.',
      '**Oýunlar we grafika** — Canvas, WebGL arkaly.'
    ]),
    H('Kody nirede ýazmaly?'),
    P('Bu programmanyň `</>` düwmesi bilen açylýan kod redaktorynda kody ýazyp, `▶ Işlet` bilen derrew synap bilersiňiz. Uly taslamalar üçin VS Code ýaly redaktorlar ulanylýar.'),
    H('var-yň kynçylyklary'),
    P('`var` blok bilen çäklenmeýär we yglan edilmezden öň hem elýeterli (hoisting) — bu köp ýalňyşlyga sebäp bolýar.'),
    CODE('if (true) {\n  var a = 1;\n  let b = 2;\n}\nconsole.log(a); // 1  — var blokdan "çykýar"\nconsole.log(b); // ReferenceError'),
    TIP('Häzirki zaman kodunda `var` ulanmaň: diňe `const` we `let`.')
  ]);

  // ---------- 2. Maglumat görnüşleri ----------
  extend('ch2', [
    H('Sanlar bilen işlemek'),
    CODE('Math.round(4.6);   // 5\nMath.floor(4.6);   // 4\nMath.ceil(4.1);    // 5\nMath.max(3, 9, 2); // 9\nMath.random();     // 0 bilen 1 aralygynda\n(3.14159).toFixed(2); // "3.14" (setir!)'),
    P('Drob sanlar ikilik ulgamda takyk saklanmaýar, şonuň üçin `0.1 + 0.2` netijesi `0.30000000000000004`. Pul ýaly takyk hasaplarda bitin sanlar (meselem, teňňe) bilen işläň.'),
    H('Setirden sana öwürmek'),
    CODE('Number("42");      // 42\nNumber("42px");    // NaN — bütin setir san bolmaly\nparseInt("42px");  // 42  — başyndaky sany okaýar\nparseFloat("3.5kg"); // 3.5\n+"7";              // 7   — unar plýus'),
    H('null we undefined'),
    LIST([
      '`undefined` — baha heniz berilmedik (JS özi goýýar).',
      '`null` — programmist bilkastlaýyn "boş" goýdy.',
      '`null == undefined` → `true`, ýöne `null === undefined` → `false`.'
    ]),
    TIP('Bahanyň sandygyny barlamak üçin `Number.isNaN(x)` ulanyň — `x === NaN` hemişe `false`.')
  ]);

  // ---------- 3. Operatorlar ----------
  extend('ch3', [
    H('Prefiks we postfiks'),
    CODE('let a = 5;\nlet b = a++; // b = 5, a = 6  (ilki gaýtarýar, soň artdyrýar)\nlet c = ++a; // c = 7, a = 7  (ilki artdyrýar)'),
    H('Operatorlaryň tertibi'),
    P('Köpeltmek we bölmek goşmakdan öň ýerine ýetirilýär, `**` sagdan çepe hasaplanýar, `&&` bolsa `||`-dan öň. Şübheli ýerde ýaý `( )` ulanyň.'),
    CODE('2 + 3 * 4      // 14\n(2 + 3) * 4    // 20\n2 ** 3 ** 2    // 512 = 2 ** 9\ntrue || false && false // true'),
    H('Baha bermegiň gysga ýazgylary'),
    CODE('x += 5;   x -= 2;   x *= 3;   x /= 2;   x %= 4;\nx ??= 10; // x null ýa-da undefined bolsa\nx ||= 1;  // x False bolsa\nx &&= 2;  // x True bolsa'),
    TIP('`0 || 10` → 10, ýöne `0 ?? 10` → 0. Nol we boş setir dogry baha bolup bilýän ýerlerde `??` ulanyň.')
  ]);

  // ---------- 4. Şertler ----------
  extend('ch4', [
    H('Şertleri birleşdirmek'),
    CODE('if (yas >= 18 && yas < 60) { /* işçi ýaş */ }\nif (gun === "Şenbe" || gun === "Ýekşenbe") { /* dynç güni */ }\nif (!(baha > 50)) { /* 50 ýa-da ondan az */ }'),
    TIP('`1 <= n <= 10` JS-de nädogry işleýär! Dogrusy: `n >= 1 && n <= 10`.'),
    H('Ir çykmak (guard clause)'),
    P('Içki `if`-leriň köp derejesi kody kyn okalýan edýär. Ýerine nädogry ýagdaýlary başda barlap, funksiýadan çykyň.'),
    CODE('function bölmek(a, b) {\n  if (b === 0) return null;   // ir çykmak\n  if (typeof a !== "number") return null;\n  return a / b;\n}'),
    H('switch ýerine obýekt'),
    CODE('const gunler = { 1: "Duşenbe", 2: "Sişenbe", 3: "Çarşenbe" };\nconst at = gunler[gun] || "Näbelli";')
  ]);

  // ---------- 5. Sikller ----------
  extend('ch5', [
    H('Içki sikller'),
    CODE('for (let i = 1; i <= 3; i++) {\n  for (let j = 1; j <= 3; j++) {\n    console.log(i, "×", j, "=", i * j);\n  }\n}'),
    H('Belgili break we continue'),
    CODE('dasky: for (let i = 0; i < 3; i++) {\n  for (let j = 0; j < 3; j++) {\n    if (j === 1) continue dasky; // daşky sikliň indiki ädimine\n    if (i === 2) break dasky;    // iki sikli hem togtatmak\n  }\n}'),
    H('Sikl bilen ýygy meseleler'),
    CODE('// Jem\nlet jem = 0;\nfor (const x of sanlar) jem += x;\n\n// Iň uly\nlet uly = sanlar[0];\nfor (const x of sanlar) if (x > uly) uly = x;\n\n// Sanamak\nlet jubut = 0;\nfor (const x of sanlar) if (x % 2 === 0) jubut++;'),
    TIP('Sikl ýazanyňyzda üç zady barlaň: başlangyç baha, şert we ädim. Ýalňyşlyk köplenç serhetde bolýar (`<` ýa-da `<=`).')
  ]);

  // ---------- 6. Funksiýalar ----------
  extend('ch6', [
    H('Funksiýa aňlatmasy we hoisting'),
    CODE('salam();               // işleýär — yglan galdyrylýar\nfunction salam() {}\n\nhosh();                // ReferenceError\nconst hosh = () => {};'),
    H('Rest parametri'),
    CODE('function jem(...sanlar) {\n  return sanlar.reduce((a, b) => a + b, 0);\n}\njem(1, 2, 3, 4); // 10'),
    H('Ýokary tertipli funksiýalar'),
    P('Funksiýany argument hökmünde alýan ýa-da funksiýa gaýtarýan funksiýa — ýokary tertipli funksiýa. `map`, `filter`, `reduce` şolardan.'),
    CODE('const kopeldiji = n => x => x * n;\nconst uc = kopeldiji(3);\nuc(5); // 15'),
    H('call, apply, bind'),
    CODE('function tanyş(şäher) { return this.at + ", " + şäher; }\nconst u = { at: "Aý" };\ntanyş.call(u, "Mary");     // "Aý, Mary"\ntanyş.apply(u, ["Mary"]);  // şol bir zat, argumentler massiwde\nconst t = tanyş.bind(u);    // this berkidilen täze funksiýa'),
    TIP('Bir funksiýa — bir iş. Funksiýa 20–30 setirden uzyn bolsa, ony kiçi böleklere bölmegi oýlanyň.')
  ]);

  // ---------- 7. Massiwler ----------
  extend('ch7', [
    H('Sanlary dogry tertiplemek'),
    P('`sort()` adaty ýagdaýda elementleri setir hökmünde deňeşdirýär, şonuň üçin `[10, 9, 1].sort()` → `[1, 10, 9]`. Sanlar üçin deňeşdiriji funksiýa beriň.'),
    CODE('[10, 9, 1].sort((a, b) => a - b); // [1, 9, 10] — ösýän\n[10, 9, 1].sort((a, b) => b - a); // [10, 9, 1] — kemelýän'),
    H('Köp ölçegli massiwler'),
    CODE('const m = [[1, 2], [3, 4]];\nm[1][0];        // 3\nm.flat();       // [1, 2, 3, 4]\nm.map(r => r[0]); // [1, 3] — birinji sütün'),
    H('Peýdaly döredijiler'),
    CODE('Array.from("abc");                  // ["a", "b", "c"]\nArray.from({ length: 3 }, (_, i) => i); // [0, 1, 2]\nnew Array(3).fill(0);               // [0, 0, 0]\n[1, 2, 3].at(-1);                   // 3\n[...new Set([1, 1, 2])];            // [1, 2]'),
    H('Destrukturlaşdyrma we spread'),
    CODE('const [ilki, , üçünji, ...galan] = [1, 2, 3, 4, 5];\nlet a = 1, b = 2;\n[a, b] = [b, a];          // çalyşmak\nconst kopiya = [...asyl]; // ýüzleý göçürme')
  ]);

  // ---------- 8. Obýektler ----------
  extend('ch8', [
    H('Obýekt bilen sikl'),
    CODE('const bahalar = { Aý: 5, Merdan: 4 };\nfor (const [at, baha] of Object.entries(bahalar)) {\n  console.log(at, baha);\n}\nObject.fromEntries([["a", 1]]); // { a: 1 }'),
    H('Getter we setter'),
    CODE('const user = {\n  at: "Aý", fam: "Ataýewa",\n  get doly() { return this.at + " " + this.fam; },\n  set doly(v) { [this.at, this.fam] = v.split(" "); }\n};\nuser.doly;              // "Aý Ataýewa"\nuser.doly = "Maral Ýazmyradowa";'),
    H('Ýüzleý we çuňňur göçürme'),
    P('Spread (`{ ...obj }`) diňe ýokarky derejäni göçürýär — içki obýektler umumy galýar. Doly göçürme üçin `structuredClone(obj)` ulanyň.'),
    CODE('const a = { p: { x: 1 } };\nconst b = { ...a };\nb.p.x = 5;          // a.p.x hem 5 boldy!\nconst c = structuredClone(a); // doly aýry göçürme'),
    H('Howpsuz ýüzlenme'),
    CODE('user?.adres?.şäher        // ýok bolsa undefined, ýalňyşlyk ýok\nuser.adres?.şäher ?? "Näbelli"\nObject.freeze(sazlama);   // üýtgedip bolmaýan obýekt')
  ]);

  // ---------- 9. Setirler ----------
  extend('ch9', [
    H('Gözleg usullary'),
    CODE('"JavaScript".startsWith("Java"); // true\n"index.html".endsWith(".html");    // true\n"banan".indexOf("a");             // 1\n"banan".lastIndexOf("a");         // 3\n"salam".includes("lam");          // true'),
    H('Harplar we kodlar'),
    CODE('"Salam".charAt(0);        // "S"\n"Salam".at(-1);           // "m"\n"A".charCodeAt(0);        // 65\nString.fromCharCode(66);  // "B"'),
    H('Doldurmak we arassalamak'),
    CODE('"7".padStart(3, "0");   // "007"\n"ab".padEnd(5, "*");    // "ab***"\n"  x  ".trimStart();     // "x  "\n"a-b-c".replaceAll("-", ""); // "abc"'),
    H('Setirleri deňeşdirmek'),
    P('Setirler harp kody boýunça deňeşdirilýär: uly harplar kiçi harplardan "kiçi" (`"Z" < "a"`). Elipbiý tertibi üçin `a.localeCompare(b)` ulanyň.')
  ]);

  // ---------- 10. DOM we wakalar ----------
  extend('ch10', [
    H('Atributlar we data-*'),
    CODE('link.getAttribute("href");\nlink.setAttribute("target", "_blank");\n// <div data-id="7">\ndiv.dataset.id; // "7"'),
    H('Wakalaryň ýaýramagy we delegirlemek'),
    P('Waka içki elementden daşky elementlere ýaýraýar (bubbling). Şonuň üçin köp elementiň ýerine olaryň atasyna bir diňleýji goşup bolýar.'),
    CODE('list.addEventListener("click", e => {\n  const li = e.target.closest("li");\n  if (li) console.log("Saýlandy:", li.textContent);\n});'),
    H('Maglumaty brauzerde saklamak'),
    CODE('localStorage.setItem("at", "Aý");\nlocalStorage.getItem("at");      // "Aý"\nlocalStorage.setItem("user", JSON.stringify({ at: "Aý" }));\nJSON.parse(localStorage.getItem("user"));'),
    TIP('Ulanyjynyň ýazan tekstini `innerHTML` bilen däl, `textContent` bilen goýuň — bu XSS hüjümlerinden goraýar.')
  ]);

  // ---------- 11. Asinhron JavaScript ----------
  extend('ch11', [
    H('Event loop: ýerine ýetiriş tertibi'),
    LIST([
      '1) Ähli sinhron kod.',
      '2) Mikrowezipeler: `Promise.then`, `await`-dan soňky kod.',
      '3) Makrowezipeler: `setTimeout`, `setInterval`, wakalar.'
    ]),
    CODE('console.log("A");\nsetTimeout(() => console.log("B"), 0);\nPromise.resolve().then(() => console.log("C"));\nconsole.log("D");\n// A, D, C, B'),
    H('Birnäçe Promise bilen işlemek'),
    CODE('await Promise.all([a(), b()]);        // ählisi; biri ýalňyş bolsa — ýalňyşlyk\nawait Promise.allSettled([a(), b()]); // ählisiniň ýagdaýy\nawait Promise.race([a(), b()]);       // ilkinji tamamlanany\nawait Promise.any([a(), b()]);        // ilkinji üstünlikli'),
    TIP('Biri-birine bagly bolmadyk soraglary `await a(); await b();` däl-de, `await Promise.all([a(), b()])` bilen bir wagtda ýerine ýetiriň.')
  ]);

  // ---------- 12. Klasslar we ES6+ ----------
  extend('ch12', [
    H('Hususy meýdanlar we static'),
    CODE('class Hasap {\n  #balans = 0;            // diňe klasyň içinde\n  static sany = 0;        // klasyň özüne degişli\n  constructor() { Hasap.sany++; }\n  goş(n) { this.#balans += n; }\n  get balans() { return this.#balans; }\n}'),
    H('Generatorlar'),
    CODE('function* sanaw(n) {\n  for (let i = 1; i <= n; i++) yield i;\n}\n[...sanaw(3)]; // [1, 2, 3]'),
    H('Öz ýalňyşlyk görnüşiň'),
    CODE('class BahaÝalňyşlygy extends Error {\n  constructor(msg) {\n    super(msg);\n    this.name = "BahaÝalňyşlygy";\n  }\n}\nthrow new BahaÝalňyşlygy("Baha 0-dan kiçi bolup bilmez");')
  ]);

  // ---------- Täze baplar ----------
  window.BOOK.chapters.push(
    {
      id: 'ch13', icon: '🔎', title: '13. Regulýar aňlatmalar',
      blocks: [
        P('Regulýar aňlatma (RegExp) — setirde nusga gözlemek üçin ulanylýan dil. Ol `/nusga/baýdaklar` görnüşinde ýazylýar.'),
        H('Esasy belgiler'),
        LIST([
          '`\\d` — sifr, `\\w` — harp/sifr/`_`, `\\s` — boşluk',
          '`.` — islendik bir simwol, `^` — başy, `$` — soňy',
          '`+` — 1 ýa-da köp, `*` — 0 ýa-da köp, `?` — 0 ýa-da 1, `{2,4}` — 2-den 4-e çenli',
          '`[abc]` — a, b ýa-da c; `[^abc]` — olardan başga'
        ]),
        H('Usullar'),
        CODE('/\\d+/.test("abc123");              // true\n"a1b22".match(/\\d+/g);             // ["1", "22"]\n"a-b-c".replace(/-/g, "+");         // "a+b+c"\n"2026-11-10".split(/-/);           // ["2026", "11", "10"]'),
        H('Mysal: e-poçtany barlamak'),
        CODE('const dogrumy = s => /^[\\w.-]+@[\\w-]+\\.[a-z]{2,}$/i.test(s);\ndogrumy("aý@mail.com"); // true\ndogrumy("aý@");         // false'),
        TIP('`g` baýdagy ähli gabat gelmeleri, `i` bolsa uly-kiçi harpa garamazdan gözleýär.')
      ]
    },
    {
      id: 'ch14', icon: '💾', title: '14. JSON we maglumat saklamak',
      blocks: [
        P('JSON (JavaScript Object Notation) — maglumatlary tekst görnüşinde saklamak we ibermek üçin iň meşhur format. Ol JS obýektlerine meňzeýär, ýöne açarlar hökman goşa dyrnakda ýazylýar.'),
        CODE('{\n  "at": "Aý",\n  "yas": 20,\n  "bahalar": [5, 4, 5],\n  "talyp": true\n}'),
        H('Öwürmek'),
        CODE('const text = JSON.stringify({ at: "Aý", yas: 20 });\n// \'{"at":"Aý","yas":20}\'\nconst obj = JSON.parse(text);\nobj.at; // "Aý"\n\nJSON.stringify(obj, null, 2); // owadan (içerik bilen) görnüş'),
        H('JSON-da bolup bilmeýän zatlar'),
        LIST(['Funksiýalar', '`undefined` (häsiýet taşlanýar)', '`NaN`, `Infinity` (`null` bolýar)', 'Teswirler']),
        H('Bu programmada'),
        P('JavaScript ähli ösüşiňizi (XP, derejeler, reýting) brauzeriň `localStorage`-ynda JSON görnüşinde saklaýar. Sazlamalar → "Ösüşi göçürip almak" düwmesi şol JSON-y faýl edip berýär.'),
        TIP('`JSON.parse` nädogry tekstde ýalňyşlyk zyňýar — ony `try...catch` içinde ulanyň.')
      ]
    },
    {
      id: 'ch15', icon: '🐞', title: '15. Ýalňyşlyklary tapmak (debugging)',
      blocks: [
        P('Ýalňyşlyk tapmak — programmistiň iň köp wagtyny alýan iş. Esasy düzgün: çaklamaň, barlaň.'),
        H('Ýalňyşlyk habaryny okamak'),
        LIST([
          '`ReferenceError: x is not defined` — üýtgeýän yglan edilmedik ýa-da ady ýalňyş ýazylan.',
          '`TypeError: Cannot read properties of undefined` — `undefined`-iň häsiýetine ýüzlenýärsiňiz.',
          '`TypeError: x is not a function` — funksiýa däl zady çagyrýarsyňyz.',
          '`SyntaxError` — kod nädogry ýazylan (ýaý, dyrnak, nokatly otur).',
          '`RangeError` — baha rugsat berlen aralykdan daşarda (meselem, çäksiz rekursiýa).'
        ]),
        H('console bilen barlamak'),
        CODE('console.log("x =", x);\nconsole.table([{ at: "A", bal: 5 }]);\nconsole.error("Bu ýere gelmeli däldi!");'),
        H('Ädimme-ädim usul'),
        LIST([
          '1) Ýalňyşlygy gaýtalap bolýan iň kiçi mysaly tapyň.',
          '2) Setir belgisine serediň (redaktor ony gyzyl belleýär).',
          '3) Ýalňyşlykdan öňki bahalary `console.log` bilen çykaryň.',
          '4) Bir gezekde diňe bir zady üýtgediň we täzeden barlaň.'
        ]),
        TIP('"Rezin ördek" usuly: kodyňyzy setirme-setir biri-birine (ýa-da oýnawaç ördege) düşündiriň — köplenç ýalňyşlygy şol wagt görersiňiz.')
      ]
    },
    {
      id: 'ch16', icon: '🧠', title: '16. Algoritmler esaslary',
      blocks: [
        P('Algoritm — meseläni çözmek üçin takyk ädimleriň yzygiderligi. Gowy algoritm diňe dogry däl, eýsem çalt hem bolmaly.'),
        H('Çylşyrymlylyk (Big O)'),
        LIST([
          '`O(1)` — hemişelik: `arr[0]`',
          '`O(log n)` — ikilik gözleg',
          '`O(n)` — bir sikl: jemi tapmak',
          '`O(n log n)` — gowy tertipleme (`sort`)',
          '`O(n²)` — içki sikller: köpürjikli tertipleme'
        ]),
        H('Çyzykly we ikilik gözleg'),
        CODE('// O(n): her elementi barlaýar\nconst gozle = (a, x) => a.indexOf(x);\n\n// O(log n): tertiplenen massiwde aralygy ýarpa bölýär\nfunction ikilik(a, x) {\n  let lo = 0, hi = a.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (a[mid] === x) return mid;\n    a[mid] < x ? lo = mid + 1 : hi = mid - 1;\n  }\n  return -1;\n}'),
        H('Rekursiýa we ýatda saklamak (memoizasiýa)'),
        CODE('const ýat = {};\nfunction fib(n) {\n  if (n < 2) return n;\n  if (ýat[n]) return ýat[n];\n  return ýat[n] = fib(n - 1) + fib(n - 2);\n}\nfib(50); // derrew'),
        H('Ýygy usullar'),
        LIST([
          '**Iki görkeziji** — tertiplenen massiwleri birleşdirmek, palindrom.',
          '**Süýşýän penjire** — yzygiderli bölekler bilen meseleler.',
          '**Map / Set** — "öň duşupmydy?" soragyny O(1)-de jogaplamak.',
          '**Stek** — ýaýlaryň deňagramlylygy, yza gaýtarmak.'
        ]),
        TIP('Ilki ýönekeý, dogry çözgüt ýazyň. Soň gerek bolsa çaltlandyryň.')
      ]
    },
    {
      id: 'ch17', icon: '✨', title: '17. Gowy kod ýazmak endikleri',
      blocks: [
        H('Düşnükli atlar'),
        CODE('// Erbet\nconst d = 86400;\nfunction f(a) { return a * d; }\n\n// Gowy\nconst SEKUNT_GUNDE = 86400;\nfunction gunlerdenSekunda(gunler) { return gunler * SEKUNT_GUNDE; }'),
        H('Gaýtalamaň (DRY)'),
        P('Şol bir kod birnäçe ýerde gaýtalansa, ony funksiýa, sikl ýa-da maglumat gurluşy (massiw, obýekt) bilen çalşyň. "Mysal işlemek" bölümi hem gaýtalanýan kod barada duýduryş berýär.'),
        CODE('// Gaýtalanma\nif (n === 1) return "Duşenbe";\nif (n === 2) return "Sişenbe";\nif (n === 3) return "Çarşenbe";\n\n// Gowusy\nconst gunler = ["Duşenbe", "Sişenbe", "Çarşenbe"];\nreturn gunler[n - 1];'),
        H('Beýleki maslahatlar'),
        LIST([
          'Bir funksiýa — bir iş.',
          'Jadyly sanlaryň ýerine at berlen konstantalar.',
          'Içki `if`-leriň ýerine ir çykmak (guard clause).',
          'Teswir "näme" däl-de, "näme üçin" diýen soraga jogap bersin.',
          'Kody yzygiderli formatlaň: içerik, boşluklar, nokatly otur.'
        ]),
        TIP('Kod bir gezek ýazylýar, ýöne köp gezek okalýar. Ony okajak adam üçin ýazyň.')
      ]
    },
    {
      id: 'ch18', icon: '⚠️', title: '18. Ýygy goýberilýän ýalňyşlyklar',
      blocks: [
        P('Bu bapda başlangyç programmistleriň iň köp goýberýän ýalňyşlyklary we olaryň düzedilişi jemlenen. Profiliňizdäki "🩺 Ýalňyşlyklar we maslahatlar" bölümi hem siziň öz ýalňyşlyklaryňyzy görkezýär.'),
        H('1. = we === garyşdyrmak'),
        CODE('if (x = 10) { }   // baha berýär, hemişe true!\nif (x === 10) { } // dogrusy'),
        H('2. Setir bilen sany goşmak'),
        CODE('"5" + 3          // "53"\nNumber("5") + 3  // 8'),
        H('3. Massiwiň serhedi'),
        CODE('const a = [1, 2, 3];\na[3];               // undefined — soňky indeks 2\nfor (let i = 0; i <= a.length; i++) {} // <= — artykmaç ädim!'),
        H('4. Obýekti göçürdim öýtmek'),
        CODE('const b = a;   // göçürme däl, şol bir obýekt!\nconst c = { ...a }; // täze obýekt'),
        H('5. return-y unutmak'),
        CODE('const kw = x => { x * x };   // undefined gaýtarýar\nconst kw2 = x => x * x;       // dogrusy'),
        H('6. sort bilen sanlar'),
        CODE('[10, 9, 1].sort()               // [1, 10, 9]\n[10, 9, 1].sort((a, b) => a - b) // [1, 9, 10]'),
        H('7. Asinhron kody sinhron öýtmek'),
        CODE('let data;\nfetch(url).then(r => r.json()).then(d => data = d);\nconsole.log(data); // undefined — heniz gelmedi!\n\nconst data2 = await (await fetch(url)).json(); // dogrusy (async içinde)'),
        TIP('Ýalňyşlykdan gorkmaň — her ýalňyşlyk täze bir zady öwredýär. Esasy zat, onuň sebäbine düşünmek.')
      ]
    }
  );
})();
