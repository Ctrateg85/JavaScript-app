// Ensiklopediýa: "JavaScript: başlangyçdan ýokary derejä çenli" kitaby
//
// Bloklar:
//   ['h', 'Sözbaşy']    ['p', 'Abzas (`kod` bölekleri goldanýar)']
//   ['code', 'kod']     ['list', ['...', '...']]   ['tip', 'Maslahat']

(function () {
  const H = t => ['h', t];
  const P = t => ['p', t];
  const CODE = t => ['code', t];
  const LIST = a => ['list', a];
  const TIP = t => ['tip', t];

  window.BOOK = {
    title: 'JavaScript: başlangyçdan ýokary derejä çenli',
    author: 'JavaScript',
    chapters: [
      {
        id: 'ch1', icon: '📦', title: '1. Giriş we üýtgeýänler',
        blocks: [
          P('JavaScript (gysgaça JS) — internet sahypalaryny janlandyrmak üçin döredilen programmirleme dili. 1995-nji ýylda Brendan Eýh tarapyndan 10 günde döredilipdir. Häzir JS diňe brauzerde däl, Node.js arkaly serwerde, mobil we desktop programmalarda hem ulanylýar.'),
          H('Ilkinji programma'),
          P('Konsola maglumat çykarmak üçin `console.log()` ulanylýar. Brauzerde F12 basyp, "Console" bölümini açyp, kody şol ýerde synap bilersiňiz.'),
          CODE('console.log("Salam, dünýä!");\nconsole.log(2 + 3); // 5'),
          H('Teswirler'),
          P('Teswirler programma tarapyndan ýerine ýetirilmeýär, olar kody düşündirmek üçin ýazylýar.'),
          CODE('// Bir setirli teswir\n/* Köp setirli\n   teswir */'),
          H('Üýtgeýänler'),
          P('Üýtgeýän — maglumaty saklamak üçin atlandyrylan "guty". JS-de üç açar söz bar: `let`, `const` we `var`.'),
          LIST([
            '`let` — bahasy soňra üýtgäp bilýän üýtgeýän.',
            '`const` — bahasy üýtgemeýän (hemişelik) üýtgeýän.',
            '`var` — köne usul, häzir ulanmak maslahat berilmeýär.'
          ]),
          CODE('let yas = 20;\nyas = 21;          // bolýar\n\nconst pi = 3.14;\n// pi = 3;        // TypeError!'),
          H('Atlandyrmak düzgünleri'),
          LIST([
            'At harp, `_` ýa-da `$` bilen başlamaly, san bilen başlap bilmez.',
            'Açar sözleri (`let`, `if`, `class` ...) at hökmünde ulanyp bolmaýar.',
            'JS uly-kiçi harplary tapawutlandyrýar: `ady` we `Ady` — dürli üýtgeýänler.',
            'Adatça camelCase ulanylýar: `ulanyjyAdy`, `jemiBaha`.'
          ]),
          TIP('Kada hökmünde hemişe `const` ulanyň, diňe bahany üýtgetmeli bolanyňyzda `let` saýlaň.')
        ]
      },
      {
        id: 'ch2', icon: '🔤', title: '2. Maglumat görnüşleri',
        blocks: [
          P('JS-de 7 primitiw görnüş we bir salgylanma görnüşi (object) bar.'),
          LIST([
            '`number` — sanlar: `42`, `3.14`, `-7`, `NaN`, `Infinity`',
            '`string` — setirler: `"salam"`, `\'JS\'`',
            '`boolean` — `true` ýa-da `false`',
            '`undefined` — baha berilmedik',
            '`null` — bilkastlaýyn boş baha',
            '`bigint` — örän uly bitin sanlar: `123n`',
            '`symbol` — gaýtalanmaýan identifikator',
            '`object` — obýektler, massiwler, funksiýalar'
          ]),
          H('typeof operatory'),
          CODE('typeof 42        // "number"\ntypeof "salam"   // "string"\ntypeof true      // "boolean"\ntypeof undefined // "undefined"\ntypeof null      // "object"  (taryhy ýalňyşlyk!)\ntypeof {}        // "object"'),
          H('Görnüşleri öwürmek'),
          P('JS käwagt görnüşleri awtomatik öwürýär. Bu ýagdaý köplenç garaşylmadyk netijelere getirýär.'),
          CODE('"5" + 3   // "53" — + setir bilen birleşdirýär\n"5" - 3   // 2    — - sana öwürýär\n"5" * "2" // 10\n\nNumber("12")    // 12\nNumber("salam") // NaN\nString(99)      // "99"\nBoolean(0)      // false'),
          H('True we False'),
          P('Şertlerde her baha `true` ýa-da `false` hökmünde kabul edilýär. Diňe şu bahalar False: `false`, `0`, `""`, `null`, `undefined`, `NaN`. Beýleki ähli bahalar (şol sanda `"0"` we `[]`) True.')
        ]
      },
      {
        id: 'ch3', icon: '➗', title: '3. Operatorlar',
        blocks: [
          H('Arifmetik operatorlar'),
          CODE('10 + 3   // 13\n10 - 3   // 7\n10 * 3   // 30\n10 / 3   // 3.333...\n10 % 3   // 1  (galyndy)\n2 ** 3   // 8  (dereje)'),
          P('Gysga ýazgylar: `x += 5` (x = x + 5), `x++` (1 artdyrmak), `x--` (1 azaltmak).'),
          H('Deňeşdirme operatorlary'),
          LIST([
            '`==` — görnüşi öwrüp deňeşdirýär: `5 == "5"` → true',
            '`===` — berk deňeşdirme: `5 === "5"` → false',
            '`!=`, `!==` — deň däl',
            '`>`, `<`, `>=`, `<=` — uly, kiçi'
          ]),
          TIP('Hemişe `===` we `!==` ulanyň — bu garaşylmadyk ýalňyşlyklardan goraýar.'),
          H('Logiki operatorlar'),
          CODE('true && false  // false (WE)\ntrue || false  // true  (ÝA-DA)\n!true          // false (INKÄR)\n\n0 || "adaty"   // "adaty" — ilkinji True baha\nnull ?? "boş"  // "boş"   — diňe null/undefined üçin')
        ]
      },
      {
        id: 'ch4', icon: '🔀', title: '4. Şertler',
        blocks: [
          H('if / else'),
          P('`if` operatory şert dogry bolanda kod bölegini ýerine ýetirýär.'),
          CODE('const baha = 85;\n\nif (baha >= 90) {\n  console.log("Bäş");\n} else if (baha >= 70) {\n  console.log("Dört");\n} else {\n  console.log("Gowşak");\n}'),
          H('switch'),
          P('Bir üýtgeýäni köp bahalar bilen deňeşdirmeli bolanda `switch` amatly. Ol berk deňeşdirme (`===`) ulanýar.'),
          CODE('const gun = 3;\n\nswitch (gun) {\n  case 1:\n    console.log("Duşenbe");\n    break;\n  case 2:\n    console.log("Sişenbe");\n    break;\n  case 3:\n    console.log("Çarşenbe");\n    break;\n  default:\n    console.log("Başga gün");\n}'),
          TIP('`break` ýazylmasa, ýerine ýetiriş indiki `case`-e geçýär (fall-through). Käwagt bu bilkastlaýyn ulanylýar.'),
          H('Üçlük operator'),
          P('Gysga şertler üçin: `şert ? a : b`.'),
          CODE('const yas = 20;\nconst status = yas >= 18 ? "Uly" : "Kiçi";')
        ]
      },
      {
        id: 'ch5', icon: '🔁', title: '5. Sikller',
        blocks: [
          P('Sikller bir kod bölegini birnäçe gezek gaýtalamak üçin ulanylýar.'),
          H('for'),
          CODE('for (let i = 0; i < 5; i++) {\n  console.log(i); // 0 1 2 3 4\n}'),
          P('Ýaýyň içinde üç bölek bar: başlangyç (`let i = 0`), şert (`i < 5`) we ädim (`i++`).'),
          H('while we do...while'),
          CODE('let i = 0;\nwhile (i < 3) {\n  i++;\n}\n\nlet j = 10;\ndo {\n  j++;          // iň bolmanda bir gezek işleýär\n} while (j < 5);'),
          H('break we continue'),
          LIST([
            '`break` — sikli doly togtadýar.',
            '`continue` — häzirki gaýtalamany geçip, indikisine geçýär.'
          ]),
          H('for...of we for...in'),
          CODE('for (const x of [10, 20, 30]) console.log(x);   // bahalar\nfor (const k in { a: 1, b: 2 }) console.log(k);  // açarlar'),
          TIP('Çäksiz siklden ägä boluň: şertiň haçan-da bolsa `false` boljakdygyna göz ýetiriň.')
        ]
      },
      {
        id: 'ch6', icon: '🧩', title: '6. Funksiýalar',
        blocks: [
          P('Funksiýa — at berlen we gaýtadan ulanyp bolýan kod bölegi.'),
          H('Yglan etmek'),
          CODE('function gos(a, b) {\n  return a + b;\n}\n\nconsole.log(gos(2, 3)); // 5'),
          P('`a` we `b` — parametrler, `2` we `3` — argumentler. `return` netijäni gaýtarýar; ol ýok bolsa funksiýa `undefined` gaýtarýar.'),
          H('Adaty bahalar'),
          CODE('function salam(at = "dost") {\n  return "Salam, " + at;\n}\nsalam(); // "Salam, dost"'),
          H('Ok-funksiýalar (arrow functions)'),
          CODE('const kwadrat = x => x * x;\nconst gos = (a, b) => a + b;\nconst obyekt = () => ({ a: 1 }); // obýekt üçin ýaý gerek'),
          H('Görnüş meýdany (scope)'),
          P('`let` we `const` bilen yglan edilen üýtgeýänler diňe öz bloklarynyň `{ }` içinde elýeterli.'),
          H('Closure'),
          P('Içki funksiýa daşky funksiýanyň üýtgeýänlerini ýatda saklaýar — hatda daşky funksiýa işini gutarandan soň hem.'),
          CODE('function sanaýjy() {\n  let c = 0;\n  return () => ++c;\n}\nconst artdyr = sanaýjy();\nartdyr(); // 1\nartdyr(); // 2'),
          H('Rekursiýa'),
          CODE('function faktorial(n) {\n  return n <= 1 ? 1 : n * faktorial(n - 1);\n}\nfaktorial(5); // 120')
        ]
      },
      {
        id: 'ch7', icon: '📋', title: '7. Massiwler',
        blocks: [
          P('Massiw — tertipli elementleriň sanawy. Indeksler 0-dan başlaýar.'),
          CODE('const miweler = ["alma", "üzüm", "garpyz"];\nmiweler[0];      // "alma"\nmiweler.length;  // 3'),
          H('Element goşmak we aýyrmak'),
          LIST([
            '`push(x)` — ahyryna goşýar, `pop()` — ahyrdakyny aýyrýar',
            '`unshift(x)` — başyna goşýar, `shift()` — başdakyny aýyrýar',
            '`splice(i, n)` — i indeksden n elementi aýyrýar'
          ]),
          H('Ýokary tertipli usullar'),
          CODE('const s = [1, 2, 3, 4];\n\ns.map(x => x * 2);            // [2, 4, 6, 8]\ns.filter(x => x % 2 === 0);   // [2, 4]\ns.reduce((a, x) => a + x, 0); // 10\ns.find(x => x > 2);           // 3\ns.some(x => x > 3);           // true\ns.every(x => x > 0);          // true'),
          H('Beýleki peýdaly usullar'),
          CODE('[1, 2, 3].includes(2);  // true\n["a", "b"].indexOf("b"); // 1\n[1, 2, 3].join("-");    // "1-2-3"\n[1, 2, 3, 4].slice(1, 3); // [2, 3]\n[3, 1, 2].sort();        // [1, 2, 3]'),
          TIP('`map`, `filter`, `slice` täze massiw gaýtarýar; `push`, `pop`, `sort`, `splice` bolsa asyl massiwi üýtgedýär.')
        ]
      },
      {
        id: 'ch8', icon: '🗃', title: '8. Obýektler',
        blocks: [
          P('Obýekt — "açar: baha" jübütleriniň ýygyndysy.'),
          CODE('const talyp = {\n  at: "Maral",\n  yas: 20,\n  salamla() {\n    return "Salam, men " + this.at;\n  }\n};\n\ntalyp.at;          // "Maral"\ntalyp["yas"];      // 20\ntalyp.salamla();   // "Salam, men Maral"'),
          H('Häsiýetler bilen işlemek'),
          CODE('talyp.kurs = 3;        // goşmak\ndelete talyp.yas;      // aýyrmak\n"at" in talyp;         // true\nObject.keys(talyp);    // açarlar\nObject.values(talyp);  // bahalar'),
          H('Destrukturlaşdyrma'),
          CODE('const { at, kurs = 1 } = talyp;\nconst [birinji, ikinji] = [10, 20];'),
          H('Salgylanma boýunça göçürmek'),
          P('Obýekt başga üýtgeýäne berlende göçürilmeýär — iki üýtgeýän hem şol bir obýekte salgylanýar. Göçürmek üçin spread ulanyň: `const kopiya = { ...asyl }`.')
        ]
      },
      {
        id: 'ch9', icon: '🔡', title: '9. Setirler',
        blocks: [
          P('Setirler bir dyrnak, goşa dyrnak ýa-da yzky dyrnak (`) bilen ýazylýar.'),
          H('Şablon setirler'),
          CODE('const at = "Aýna";\nconst yas = 20;\nconsole.log(`${at} ${yas} ýaşynda`);'),
          H('Esasy usullar'),
          CODE('"Salam".length;            // 5\n"js".toUpperCase();        // "JS"\n"  salam ".trim();         // "salam"\n"a,b,c".split(",");        // ["a", "b", "c"]\n"JavaScript".includes("S"); // true\n"Türkmen".slice(0, 3);     // "Tür"\n"abc".replace("b", "X");   // "aXc"\n"ha".repeat(3);            // "hahaha"'),
          TIP('Setirler üýtgemeýär (immutable): her usul täze setir gaýtarýar, asyl setir şol durşuna galýar.')
        ]
      },
      {
        id: 'ch10', icon: '🖱', title: '10. DOM we wakalar',
        blocks: [
          P('DOM (Document Object Model) — brauzeriň HTML sahypany agaç görnüşli obýektler hökmünde görkezmegi. JS arkaly bu agajy okap we üýtgedip bolýar.'),
          H('Elementleri tapmak'),
          CODE('document.getElementById("baslyk");\ndocument.querySelector(".kart");     // ilkinji\ndocument.querySelectorAll("li");     // ählisi'),
          H('Elementi üýtgetmek'),
          CODE('const el = document.querySelector("h1");\nel.textContent = "Täze sözbaşy";\nel.style.color = "green";\nel.classList.add("aktiw");\nel.classList.toggle("gizlin");'),
          H('Element döretmek'),
          CODE('const li = document.createElement("li");\nli.textContent = "Täze element";\ndocument.querySelector("ul").appendChild(li);'),
          H('Wakalar (events)'),
          CODE('const btn = document.querySelector("button");\nbtn.addEventListener("click", (event) => {\n  console.log("Basyldy!");\n});\n\nform.addEventListener("submit", (e) => {\n  e.preventDefault(); // sahypa täzelenmesin\n});'),
          P('Köp ulanylýan wakalar: `click`, `input`, `change`, `submit`, `keydown`, `mouseover`, `load`.')
        ]
      },
      {
        id: 'ch11', icon: '⏳', title: '11. Asinhron JavaScript',
        blocks: [
          P('JS bir akymly dil, ýöne "event loop" mehanizmi arkaly uzak dowam edýän işlere (tor soraglary, taýmerler) garaşyp, programmany doňdurmaýar.'),
          H('Taýmerler'),
          CODE('setTimeout(() => console.log("1 sekuntdan soň"), 1000);\nconst id = setInterval(() => console.log("her sekunt"), 1000);\nclearInterval(id);'),
          H('Promise'),
          P('Promise — geljekde taýýar boljak netije. Onuň üç ýagdaýy bar: pending (garaşylýar), fulfilled (ýerine ýetdi), rejected (ret edildi).'),
          CODE('const p = new Promise((resolve, reject) => {\n  setTimeout(() => resolve("Taýýar!"), 500);\n});\n\np.then(netije => console.log(netije))\n .catch(ýalňyşlyk => console.error(ýalňyşlyk));'),
          H('async / await'),
          CODE('async function maglumatAl() {\n  try {\n    const jogap = await fetch("https://api.example.com/data");\n    const data = await jogap.json();\n    console.log(data);\n  } catch (e) {\n    console.error("Ýalňyşlyk:", e);\n  }\n}'),
          TIP('async funksiýa hemişe Promise gaýtarýar.')
        ]
      },
      {
        id: 'ch12', icon: '🧱', title: '12. Klasslar we ES6+',
        blocks: [
          H('Klasslar'),
          CODE('class Haýwan {\n  constructor(at) {\n    this.at = at;\n  }\n  ses() {\n    return `${this.at} ses çykarýar`;\n  }\n}\n\nclass It extends Haýwan {\n  ses() {\n    return `${this.at} üýrýär`;\n  }\n}\n\nconst bars = new It("Bars");\nbars.ses(); // "Bars üýrýär"'),
          H('Spread we rest'),
          CODE('const a = [1, 2];\nconst b = [...a, 3];          // spread\nfunction jem(...sanlar) {      // rest\n  return sanlar.reduce((x, y) => x + y, 0);\n}'),
          H('Optional chaining we Set / Map'),
          CODE('user?.adres?.şäher;            // ýalňyşlyksyz\nnew Set([1, 1, 2]).size;       // 2\nconst m = new Map([["a", 1]]);\nm.get("a");                    // 1'),
          H('Ýalňyşlyklary dolandyrmak'),
          CODE('try {\n  throw new Error("Bir zat nädogry");\n} catch (e) {\n  console.log(e.message);\n} finally {\n  console.log("Hemişe işleýär");\n}'),
          H('Modullar'),
          CODE('// matematika.js\nexport function gos(a, b) { return a + b; }\n\n// main.js\nimport { gos } from "./matematika.js";')
        ]
      }
    ]
  };

  // Goşmaça kitaplar (PDF). Faýly "books" bukjasyna goýup, şu ýere ýazyň:
  // { title: 'Kitabyň ady', author: 'Awtor', file: 'books/kitap.pdf' }
  window.EXTRA_BOOKS = [];
})();
