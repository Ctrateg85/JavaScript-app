// Ensiklopediýa: her bap üçin düşündiriş bölümleri (3-nji bölek)
//   📘 Ýönekeý dil bilen — temany gündelik durmuşdan meňzetmeler bilen düşündirmek
//   🔍 Ädimme-ädim mysal — kodyň her ädiminde näme bolýandygy
//   📝 Ýatda saklaň — esasy düşünjeleriň jemi
//   ❓ Özüňizi barlaň — jogaplary bilen soraglar
// Bu faýl book.js, book-extra.js we book-extra-2.js-den soň ýüklenýär.

(function () {
  const H = t => ['h', t];
  const P = t => ['p', t];
  const CODE = t => ['code', t];
  const LIST = a => ['list', a];
  const TIP = t => ['tip', t];
  const extend = (id, blocks) => window.BOOK.chapters.find(c => c.id === id).blocks.push(...blocks);

  // Dört bölümi bir gezekde goşmak üçin kömekçi
  const explain = (id, { simple, steps, stepsCode, remember, quiz }) => extend(id, [
    H('📘 Ýönekeý dil bilen'),
    ...simple.map(P),
    H('🔍 Ädimme-ädim mysal'),
    CODE(stepsCode),
    ...steps.map(P),
    H('📝 Ýatda saklaň'),
    LIST(remember),
    H('❓ Özüňizi barlaň'),
    LIST(quiz.map(([q, a]) => `${q} — **Jogap:** ${a}`)),
    TIP('Soraglara jogap bermezden öň, kody özüňiz redaktorda (`</>`) işledip görüň.')
  ]);

  explain('ch1', {
    simple: [
      'Üýtgeýäni üstünde ady ýazylan **guty** hökmünde göz öňüne getiriň. `let yas = 20` — "yas" atly guty döredip, içine 20 goýduk. Soňra gutynyň içindäkini çalşyp bileris: `yas = 21`.',
      '`const` — gulply guty: bir gezek goýlan zady başga zat bilen çalşyp bolmaýar. Ýöne guty içinde başga guty (obýekt) bar bolsa, şol içki gutynyň mazmuny üýtgäp biler.'
    ],
    stepsCode: 'let a = 5;      // 1) a = 5\nlet b = a;      // 2) b üýtgeýjä a üýtgeýjiniň bahasy göçürilýär: b = 5\na = a + 3;      // 3) a = 8, b üýtgemeýär\nconsole.log(a, b); // 4) 8 5',
    steps: [
      '1-nji setirde kompýuter ýatda `a` üçin ýer bölüp, oňa 5 ýazýar. 2-nji setirde `b` üçin aýratyn ýer bölünýär we oňa 5 göçürilýär — `a` bilen `b` indi baglanyşyksyz.',
      '3-nji setirde ilki sag tarap hasaplanýar (`5 + 3 = 8`), soň netije `a`-ga ýazylýar. `b` öňküsi ýaly 5. Şonuň üçin konsola `8 5` çykýar.'
    ],
    remember: [
      '`const` — esasy saýlaw, `let` — bahasy üýtgejek bolsa, `var` — ulanmaň.',
      'Baha bermek (`=`) sagdan çepe işleýär: ilki sag tarap hasaplanýar.',
      'Üýtgeýäniň ady onuň mazmunyny aňlatmaly: `x` däl-de, `talypSany`.',
      'JS uly-kiçi harplary tapawutlandyrýar.'
    ],
    quiz: [
      ['`const x = 1; x = 2;` näme bolar?', '`TypeError` — const-a täze baha berip bolmaýar.'],
      ['`let 2at = "Aý";` dogrumy?', 'Ýok, at san bilen başlap bilmeýär.'],
      ['`let a = 1; let b = a; a = 10;` soň `b` näçe?', '1 — b üýtgeýjä diňe şol wagtky baha göçürildi.']
    ]
  });

  explain('ch2', {
    simple: [
      'Maglumat görnüşi — bahanyň **näme zatdygyny** aýdýar: san, tekst, hawa/ýok ýa-da topar. Edil dükanda gaplaryň görnüşi ýaly: süýt çüýşede, un halta — her biri bilen başgaça işleýärler.',
      'JS "çeýe" dil: görnüşleri özi öwürmäge synanyşýar. Bu käwagt amatly, käwagt bolsa `"5" + 3 = "53"` ýaly geň netijelere getirýär.'
    ],
    stepsCode: 'const giriş = "12";        // ulanyjy tekst girizdi\nconst san = Number(giriş); // 12 (number)\nconsole.log(giriş + 1);    // "121" — setir birleşdi\nconsole.log(san + 1);      // 13   — sanlar goşuldy\nconsole.log(typeof giriş, typeof san); // "string" "number"',
    steps: [
      'Formadan ýa-da `prompt`-dan gelen baha hemişe **setir**. Ony `+` bilen goşsaňyz, JS goşmagyň ýerine setirleri birleşdirýär.',
      '`Number()` bilen sana öwürenimizden soň hasaplamalar dogry işleýär. `typeof` her bahanyň görnüşini görkezýär.'
    ],
    remember: [
      '7 primitiw görnüş: string, number, bigint, boolean, undefined, null, symbol.',
      '`+` setir bilen birleşdirýär, `-`, `*`, `/` bolsa sana öwürýär.',
      'False bahalar: `false`, `0`, `""`, `null`, `undefined`, `NaN`.',
      'Girizilen bahany hasaplamazdan öň `Number()` bilen öwrüň.'
    ],
    quiz: [
      ['`typeof null` näme gaýtarýar?', '`"object"` — taryhy ýalňyşlyk.'],
      ['`Boolean("0")` näme?', '`true` — boş däl setir True.'],
      ['`"7" * "2"` näme?', '`14` — * setirleri sana öwürýär.']
    ]
  });

  explain('ch3', {
    simple: [
      'Operatorlar — matematika sapagyndaky belgiler ýaly, ýöne käbir täzeleri hem bar: `%` (galyndy), `===` (berk deňlik), `&&` (we), `||` (ýa-da).',
      '`&&` we `||` diňe `true` / `false` däl, eýsem bahanyň özüni gaýtarýar. `||` "ilkinji gowy bahany al", `&&` bolsa "ilkinji erbet bahada dur" diýip pikir ediň.'
    ],
    stepsCode: 'const bal = 17;\nconst bitin = Math.floor(bal / 5); // 1) 17 / 5 = 3.4 → 3\nconst galan = bal % 5;             // 2) 17 - 5·3 = 2\nconst ady = "" || "Myhman";        // 3) "" False → "Myhman"\nconsole.log(bitin, galan, ady);    // 3 2 "Myhman"',
    steps: [
      '1) `/` drob netije berýär, `Math.floor` ony aşak tegelekleýär. 2) `%` bölmekden galan bölegi berýär — 17-de 5 üç gezek bar, 2 galýar.',
      '3) `||` çep tarapy barlaýar: boş setir False, şonuň üçin sag tarap — "Myhman" gaýtarylýar.'
    ],
    remember: [
      'Hemişe `===` we `!==` ulanyň.',
      '`%` — jübüt/täk barlamak (`n % 2`), sifr almak (`n % 10`) üçin peýdaly.',
      '`a++` öňki bahany, `++a` täze bahany gaýtarýar.',
      '`??` diňe `null` / `undefined`, `||` bolsa islendik False üçin işleýär.'
    ],
    quiz: [
      ['`10 % 4` näçe?', '2'],
      ['`0 ?? 5` we `0 || 5` näme?', '0 we 5.'],
      ['`2 + 3 * 2` näçe?', '8 — köpeltmek ilki ýerine ýetirilýär.']
    ]
  });

  explain('ch4', {
    simple: [
      'Şert — ýol çatrygy ýaly: "eger ýagyş ýagsa — sumka alarys, ýogsam — almarys". Programma hem şert dogry bolsa bir ýol bilen, ýalňyş bolsa başga ýol bilen gidýär.',
      '`else if` zynjyrynda kompýuter şertleri ýokardan aşak barlaýar we **ilkinji dogry** şertde durýar — galanlaryna seretmeýär.'
    ],
    stepsCode: 'const t = 25;\nif (t < 0) {             // 1) 25 < 0 ? ýok\n  console.log("Aýaz");\n} else if (t < 20) {     // 2) 25 < 20 ? ýok\n  console.log("Salkyn");\n} else if (t < 30) {     // 3) 25 < 30 ? hawa → şu ýere girýär\n  console.log("Ýyly");\n} else {                 // 4) barlanmaýar\n  console.log("Yssy");\n}',
    steps: [
      'Kompýuter 1-nji we 2-nji şertleri barlap, olaryň ýalňyşdygyny görýär. 3-nji şert dogry — "Ýyly" çykýar.',
      '4-nji `else` bölegi hiç barlanmaýar, sebäbi öňki şertleriň biri eýýäm ýerine ýetirildi.'
    ],
    remember: [
      'Şertler tertibi möhüm: has takyk (dar) şertleri ýokarda ýazyň.',
      '`=` — baha bermek, `===` — deňeşdirmek. Şertde hemişe `===`.',
      '`switch`-de `break` unutmaň.',
      'Gysga şert üçin üçlük operator: `şert ? a : b`.'
    ],
    quiz: [
      ['`if ("")` içi ýerine ýetirilermi?', 'Ýok, boş setir False.'],
      ['`switch` haýsy deňeşdirmäni ulanýar?', '`===` (berk).'],
      ['`x > 5 ? "A" : "B"`, x = 5 bolsa?', '"B" — 5 > 5 ýalňyş.']
    ]
  });

  explain('ch5', {
    simple: [
      'Sikl — "şu işi N gezek gaýtala" diýen buýruk. Meselem, 30 talybyň her biriniň bahasyny barlamak üçin 30 setir ýazmagyň ýerine bir sikl ýazýarys.',
      '`for` sikline sanaýjyly sagat ýaly serediň: başlangyç (`i = 0`), haçana çenli (`i < 3`) we her gezek näçe ädim (`i++`).'
    ],
    stepsCode: 'let jem = 0;\nfor (let i = 1; i <= 3; i++) {\n  jem += i;\n}\n// i=1: jem = 0 + 1 = 1\n// i=2: jem = 1 + 2 = 3\n// i=3: jem = 3 + 3 = 6\n// i=4: 4 <= 3 ýalňyş → sikl gutarýar\nconsole.log(jem); // 6',
    steps: [
      'Her aýlawdan öň şert (`i <= 3`) barlanýar. Dogry bolsa beden ýerine ýetirilýär, soň `i++`.',
      '`i` 4 bolanda şert ýalňyş bolýar we programma siklden soňky setire geçýär.'
    ],
    remember: [
      '`for` — näçe gezekdigi belli bolanda; `while` — şert boýunça.',
      '`for...of` — massiwiň bahalary, `for...in` — obýektiň açarlary.',
      '`break` — sikli togtatmak, `continue` — häzirki aýlawy geçmek.',
      'Şert hiç haçan ýalňyş bolmasa — çäksiz sikl!'
    ],
    quiz: [
      ['`for (let i = 0; i < 5; i += 2)` näçe gezek aýlanýar?', '3 gezek (0, 2, 4).'],
      ['`do...while` bedeni şert ýalňyş bolsa-da işleýärmi?', 'Hawa, iň bolmanda bir gezek.'],
      ['Massiwiň bahalaryny aýlanmak üçin haýsy sikl has gowy?', '`for...of`.']
    ]
  });

  explain('ch6', {
    simple: [
      'Funksiýa — **resept** ýaly: oňa önümler (argumentler) berýärsiňiz, ol taýýar nahar (netije) gaýtarýar. Bir gezek ýazylan resepti istän wagtyňyz ulanyp bilersiňiz.',
      '`return` — taýýar nahary stola goýmak. `return` ýazylmasa, funksiýa işlese-de, hiç zat gaýtarmaýar (`undefined`).'
    ],
    stepsCode: 'function meýdan(ini, uzyn) {   // 1) resept: iki parametr\n  const s = ini * uzyn;        // 3) 4 * 5 = 20\n  return s;                    // 4) 20 gaýtarylýar\n}\nconst netije = meýdan(4, 5);  // 2) çagyryş: ini = 4, uzyn = 5\nconsole.log(netije);           // 5) 20',
    steps: [
      '2-nji ädimde funksiýa çagyrylýar: `4` `ini`-ä, `5` `uzyn`-a berilýär. Funksiýanyň içi ýerine ýetirilip, `return` bilen 20 gaýtarylýar.',
      'Gaýtarylan baha `netije` üýtgeýänine ýazylýar. Funksiýanyň içindäki `s` daşarda elýeterli däl — ol diňe funksiýanyň öz meýdanynda ýaşaýar.'
    ],
    remember: [
      'Parametr — funksiýa yglan edilende, argument — çagyrylanda.',
      '`return` bolmasa netije `undefined`.',
      'Ok-funksiýa: `const f = x => x * 2;`.',
      'Funksiýanyň içindäki `let` / `const` daşarda görünmeýär.'
    ],
    quiz: [
      ['`function f() {} f()` näme gaýtarýar?', '`undefined`.'],
      ['`const k = x => { x * x }` näme gaýtarýar?', '`undefined` — figuraly ýaýda return gerek.'],
      ['Funksiýa özüni çagyrsa, oňa näme diýilýär?', 'Rekursiýa.']
    ]
  });

  explain('ch7', {
    simple: [
      'Massiw — belgili ýerleri bolan **tekje** ýaly: her ýeriň belgisi (indeks) 0-dan başlaýar. `kitaplar[0]` — birinji tekjedäki kitap.',
      '`map` her kitaba bir zat edýär (meselem, gaplaýar) we täze tekje berýär; `filter` diňe gerek kitaplary saýlaýar; `reduce` bolsa ählisini bir zada (meselem, jemi bahasyna) jemleýär.'
    ],
    stepsCode: 'const bahalar = [3, 5, 4, 2];\nconst gowular = bahalar.filter(b => b >= 4); // 1) [5, 4]\nconst iki = gowular.map(b => b * 2);           // 2) [10, 8]\nconst jem = iki.reduce((a, b) => a + b, 0);    // 3) 0+10=10, 10+8=18\nconsole.log(jem); // 18',
    steps: [
      '1) `filter` her bahany barlap, diňe şerte laýyklaryny saklaýar. 2) `map` her elementi 2-ä köpeldýär.',
      '3) `reduce` `a` (jemleýji) bilen işleýär: başda 0, soň her elementi goşýar. Asyl `bahalar` massiwi üýtgemedi.'
    ],
    remember: [
      'Indeks 0-dan başlaýar, soňky indeks `length - 1`.',
      '`push`, `pop`, `sort`, `splice` asyl massiwi üýtgedýär.',
      '`map`, `filter`, `slice` täze massiw gaýtarýar.',
      'Sanlary tertiplemek: `sort((a, b) => a - b)`.'
    ],
    quiz: [
      ['`[1, 2, 3].map(x => x + 1)` näme?', '`[2, 3, 4]`.'],
      ['`[5, 1, 10].sort()` näme?', '`[1, 10, 5]` — setir hökmünde tertipleýär.'],
      ['`[].reduce((a, b) => a + b, 0)` näme?', '0 — başlangyç baha.']
    ]
  });

  explain('ch8', {
    simple: [
      'Obýekt — **şahsy kartoçka** ýaly: "at: Aý", "ýaş: 20", "şäher: Mary". Her maglumatyň öz ady (açar) bar, şonuň üçin tertibi ýatda saklamaly däl.',
      'Obýekt başga üýtgeýäne berlende **göçürilmeýär** — iki üýtgeýän şol bir kartoçka görkezýär. Birinde üýtgetseňiz, beýlekisinde hem üýtgeýär.'
    ],
    stepsCode: 'const talyp = { at: "Aý", bahalar: [5, 4] };\nconst göçürme = { ...talyp };     // 1) täze obýekt\ngöçürme.at = "Maral";             // 2) talyp.at üýtgemeýär\ngöçürme.bahalar.push(3);          // 3) içki massiw umumy!\nconsole.log(talyp.at, talyp.bahalar); // "Aý" [5, 4, 3]',
    steps: [
      '1) Spread täze obýekt döredýär, ýöne içki massiwi göçürmeýär — diňe oňa salgylanmany göçürýär.',
      '2) `at` primitiw, şonuň üçin aýry. 3) `bahalar` iki obýektde hem şol bir massiw, şonuň üçin `talyp.bahalar` hem üýtgedi. Doly göçürme üçin `structuredClone`.'
    ],
    remember: [
      '`obj.at` ýa-da `obj["at"]` — häsiýete ýüzlenmek.',
      'Obýektler salgylanma boýunça göçürilýär.',
      '`Object.keys / values / entries` — obýekti aýlanmak üçin.',
      '`?.` — ýok bolup biljek häsiýete howpsuz ýüzlenmek.'
    ],
    quiz: [
      ['`const o = { a: 1 }; o.b` näme?', '`undefined`.'],
      ['`{ a: 1 } === { a: 1 }` näme?', '`false` — iki aýry obýekt.'],
      ['Usulda `this` nämäni aňladýar?', 'Usuly çagyran obýekti.']
    ]
  });

  explain('ch9', {
    simple: [
      'Setir — harplaryň **monjuk** ýaly hatary. Her harpyň öz belgisi bar (0-dan başlap), ýöne monjugy üýtgedip bolmaýar: täze görnüş gerek bolsa, täze monjuk düzülýär.',
      'Şonuň üçin `toUpperCase`, `replace`, `slice` ýaly usullaryň hemmesi **täze setir** gaýtarýar, asyl setir şol durşuna galýar.'
    ],
    stepsCode: 'const s = "  salam Dünýä  ";\nconst a = s.trim();           // 1) "salam Dünýä"\nconst b = a.toLowerCase();    // 2) "salam dünýä"\nconst c = b.split(" ");       // 3) ["salam", "dünýä"]\nconst d = c.join("-");        // 4) "salam-dünýä"\nconsole.log(d, s.length);     // "salam-dünýä" 15',
    steps: [
      'Her ädim öňki netijäni alyp, täze setir döredýär. Iň soňunda `s.length` öňküsi ýaly 15 — asyl setir üýtgemedi.',
      '`split` setiri massiwe, `join` bolsa massiwi yzyna setire öwürýär — bu jübüt setirleri özgertmekde gaty köp ulanylýar.'
    ],
    remember: [
      'Setirler üýtgemeýär (immutable).',
      'Indeks 0-dan başlaýar, `s.at(-1)` — soňky harp.',
      'Şablon setir yzky dyrnak bilen ýazylýar: `Salam, ${at}` — `${}` içine baha goýulýar.',
      'Deňeşdirmezden öň uly-kiçi harpy deňläň: `toLowerCase()`.'
    ],
    quiz: [
      ['`"JS".length` näçe?', '2'],
      ['`"abc".slice(1)` näme?', '`"bc"`.'],
      ['`"a-b".split("-")` näme?', '`["a", "b"]`.']
    ]
  });

  explain('ch10', {
    simple: [
      'DOM — sahypanyň **maşgala agajy**: `<body>` — ata, içindäki `<div>`-ler — çagalar. JS bu agaçdaky islendik "agzany" tapyp, onuň tekstini, reňkini ýa-da ýerini üýtgedip bilýär.',
      'Waka (event) — "bir zat boldy" diýen habar: düwmä basyldy, harp ýazyldy, sahypa ýüklendi. `addEventListener` bilen şeýle habarlara "diňleýji" goýýarys.'
    ],
    stepsCode: '// <button id="btn">Bas</button> <span id="san">0</span>\nconst btn = document.querySelector("#btn"); // 1) düwmäni tapmak\nconst san = document.querySelector("#san");\nlet c = 0;\nbtn.addEventListener("click", () => {        // 2) diňleýji\n  c++;                                       // 3) her basylanda\n  san.textContent = c;                       // 4) sahypany täzelemek\n});',
    steps: [
      '1) `querySelector` CSS saýlaýjysy bilen elementi tapýar. 2) Diňleýji goşulýar, ýöne funksiýa entek işlemeýär.',
      '3–4) Ulanyjy her gezek basanda funksiýa çagyrylýar: sanaýjy artýar we täze baha sahypada görkezilýär.'
    ],
    remember: [
      '`querySelector` — ilkinji, `querySelectorAll` — ähli elementler.',
      '`textContent` — howpsuz tekst, `innerHTML` — HTML (seresap boluň).',
      '`classList.add / remove / toggle` — stil üçin klasslar.',
      '`e.preventDefault()` — brauzeriň adaty hereketini ýatyrmak.'
    ],
    quiz: [
      ['Input-a her harp ýazylanda haýsy waka bolýar?', '`input`.'],
      ['Forma iberilende sahypa täzelenmesin diýsek?', '`e.preventDefault()`.'],
      ['`el.classList.toggle("a")` näme edýär?', 'Klass bar bolsa aýyrýar, ýok bolsa goşýar.']
    ]
  });

  explain('ch11', {
    simple: [
      'Asinhronlyk — **kafede sargyt** ýaly: siz kofe sargyt edýärsiňiz (soragy iberýärsiňiz), garaşyp durman oturyp kitap okaýarsyňyz (beýleki kod işleýär), kofe taýýar bolanda sizi çagyrýarlar (Promise ýerine ýetýär).',
      '`await` — "kofe taýýar bolýança şu ýerde garaşaýyn" diýmek, ýöne diňe şu funksiýanyň içinde: programmanyň galan bölegi doňmaýar.'
    ],
    stepsCode: 'console.log("1. Sargyt");\nsetTimeout(() => console.log("3. Kofe taýýar"), 1000);\nconsole.log("2. Kitap okaýaryn");\n\n// Netije tertibi:\n// 1. Sargyt\n// 2. Kitap okaýaryn\n// 3. Kofe taýýar  (1 sekuntdan soň)',
    steps: [
      '`setTimeout` funksiýany "soňa" goýýar we programma derrew indiki setire geçýär. Şonuň üçin 2-nji setir 3-nji setirden öň çykýar.',
      'Hatda wagt 0 bolsa-da (`setTimeout(f, 0)`), funksiýa häzirki kod gutarandan soň işleýär.'
    ],
    remember: [
      'JS bir akymly, ýöne garaşmaýar — asinhron işler soňra ýerine ýetirilýär.',
      'Promise: pending → fulfilled ýa-da rejected.',
      '`await` diňe `async` funksiýanyň içinde.',
      'Ýalňyşlyklar: `.catch()` ýa-da `try...catch`.'
    ],
    quiz: [
      ['`async` funksiýa näme gaýtarýar?', 'Hemişe Promise.'],
      ['`Promise.resolve().then(f)` we `setTimeout(g, 0)` — haýsysy ilki?', '`f` (mikrowezipe).'],
      ['Iki garaşsyz soragy bir wagtda ýerine ýetirmek üçin?', '`Promise.all([...])`.']
    ]
  });

  explain('ch12', {
    simple: [
      'Klass — **çyzgy** (proýekt), obýekt bolsa şol çyzgy boýunça gurlan jaý. Bir çyzgydan köp jaý gurup bolýar, her jaýyň öz reňki, öz eýesi bolýar.',
      '`extends` — täze çyzgy köne çyzgynyň ähli zadyny alýar we üstüne öz aýratynlyklaryny goşýar (meselem, "jaý" → "garažly jaý").'
    ],
    stepsCode: 'class Ulag {\n  constructor(at) { this.at = at; }        // 2) täze obýekt üçin\n  hereket() { return `${this.at} ýöreýär`; }\n}\nclass Uçar extends Ulag {\n  hereket() { return `${this.at} uçýar`; } // 4) täzeden kesgitlenen\n}\nconst u = new Uçar("Boing");               // 1) new → constructor\nconsole.log(u.hereket());                  // 3) "Boing uçýar"',
    steps: [
      '1–2) `new Uçar("Boing")` täze obýekt döredip, ata klasyň `constructor`-yny çagyrýar (Uçar-da öz constructor ýok): `this.at = "Boing"`.',
      '3–4) `hereket` çagyrylanda JS ilki `Uçar`-da gözleýär we tapýar — ata klasdaky usul ulanylmaýar (override).'
    ],
    remember: [
      '`new` — klasdan obýekt döretmek.',
      '`extends` — miras, `super()` — ata klasyň constructor-y.',
      '`#meýdan` — hususy, `static` — klasyň özüne degişli.',
      'Spread `...` ýaýradýar, rest `...` ýygnaýar.'
    ],
    quiz: [
      ['Miras alýan klasda `this`-den öň näme çagyrylmaly?', '`super()`.'],
      ['`new Set([1, 1, 2]).size` näçe?', '2'],
      ['`static` usul nähili çagyrylýar?', 'Klasyň özünden: `Klass.usul()`.']
    ]
  });

  explain('ch13', {
    simple: [
      'Regulýar aňlatma — tekstde gözlemek üçin **trafaret** (nusga). "Üç sifr, soň defis, soň dört sifr" ýaly düşündirişi gysga belgiler bilen ýazýarys: `\\d{3}-\\d{4}`.',
      'Ilkibaşda kyn görünýär, ýöne her belgini aýratyn okasaňyz aňsat: `\\d` — sifr, `+` — bir ýa-da köp, `^` — başy, `$` — soňy.'
    ],
    stepsCode: 'const nusga = /^(\\d{2})\\.(\\d{2})\\.(\\d{4})$/;\nconst m = "10.11.2026".match(nusga);\n// ^          — setiriň başy\n// (\\d{2})    — 2 sifr → m[1] = "10"\n// \\.         — nokat (\\ bilen, sebäbi . — islendik simwol)\n// (\\d{4})$   — 4 sifr we setiriň soňy → m[3] = "2026"\nconsole.log(m[1], m[2], m[3]); // 10 11 2026',
    steps: [
      'Ýaý `( )` gabat gelen bölegi "toparlaýar" — olar `m[1]`, `m[2]` ... görnüşinde alynýar. `m[0]` — doly gabat gelen tekst.',
      'Nokat ýörite belgi bolany üçin, hakyky nokady gözlemek üçin `\\.` ýazylýar.'
    ],
    remember: [
      '`test` — bar/ýok, `match` — tapylany almak, `replace` — çalyşmak.',
      '`g` — ähli gabat gelmeler, `i` — uly-kiçi harpa garamazdan.',
      'Ýörite belgiler (`. * + ? ( ) [ ]`) üçin `\\` ulanyň.',
      'Kyn nusgany böleklere bölüp synaň.'
    ],
    quiz: [
      ['`/^\\d+$/.test("12a")` näme?', '`false` — "a" sifr däl.'],
      ['`"a1b2".replace(/\\d/g, "")` näme?', '`"ab"`.'],
      ['`\\s` nämäni aňladýar?', 'Boşluk (probel, tab, täze setir).']
    ]
  });

  explain('ch14', {
    simple: [
      'JSON — maglumatlary **poçta bukjasyna** salmak ýaly: obýekti tekste öwrüp (`stringify`), saklap ýa-da iberip, soň yzyna açyp (`parse`) ulanýarys.',
      'Brauzeriň `localStorage`-y diňe tekst saklaýar, şonuň üçin obýekti saklamazdan öň JSON-a öwürmeli.'
    ],
    stepsCode: 'const user = { at: "Aý", xp: 120 };\nconst tekst = JSON.stringify(user);       // 1) \'{"at":"Aý","xp":120}\'\nlocalStorage.setItem("user", tekst);      // 2) saklamak\nconst okalan = localStorage.getItem("user"); // 3) tekst görnüşinde\nconst obj = JSON.parse(okalan);           // 4) yzyna obýekt\nconsole.log(obj.xp + 10);                  // 130',
    steps: [
      '1–2) Obýekt tekste öwrülip saklanýar. 3) Okalan baha — setir, `okalan.xp` işlemez.',
      '4) `JSON.parse` setiri yzyna obýekte öwürýär, indi `obj.xp` san hökmünde ulanylýar.'
    ],
    remember: [
      'JSON-da açarlar goşa dyrnakda.',
      'Funksiýalar we `undefined` JSON-a geçmeýär.',
      '`JSON.parse`-y `try...catch` içinde ulanyň.',
      'Bu programma ähli ösüşiňizi JSON görnüşinde saklaýar.'
    ],
    quiz: [
      ['`JSON.stringify({ a: 1 })` näme?', '`\'{"a":1}\'`.'],
      ['`localStorage` haýsy görnüşde saklaýar?', 'Diňe setir.'],
      ['`JSON.parse("{a:1}")` näme bolar?', '`SyntaxError` — açar dyrnaksyz.']
    ]
  });

  explain('ch15', {
    simple: [
      'Debugging — **detektiw işi**: ýalňyşlygyň yzy (habar, setir belgisi) bar, siz subutnamalary (`console.log`) ýygnap, "jenaýatçyny" (ýalňyş setiri) tapýarsyňyz.',
      'Esasy düzgün: çaklamaň — barlaň. "Meniň pikirimçe bu üýtgeýän 5" diýmegiň ýerine ony konsola çykaryň.'
    ],
    stepsCode: 'function ortaça(sanlar) {\n  let jem = 0;\n  for (let i = 0; i <= sanlar.length; i++) {   // ← ýalňyşlyk!\n    jem += sanlar[i];\n  }\n  return jem / sanlar.length;\n}\nconsole.log(ortaça([2, 4])); // NaN — näme üçin?\n\n// Barlag: siklde console.log("i =", i, sanlar[i]);\n// i = 0 2, i = 1 4, i = 2 undefined  ← tapyldy: <= bolmaly däl, < bolmaly',
    steps: [
      'Netije `NaN` — bu bir ýerde san däl bahanyň goşulandygyny aňladýar. Siklde `console.log` bilen her ädimi çykaranymyzda, `i = 2`-de `undefined` görünýär.',
      '`sanlar[2]` ýok, sebäbi soňky indeks 1. Şert `i <= length` däl-de, `i < length` bolmaly. Düzedenimizden soň netije 3.'
    ],
    remember: [
      'Ýalňyşlyk habaryny we setir belgisini ünsli okaň.',
      '`NaN` — köplenç `undefined` bilen hasaplamanyň alamaty.',
      'Bir gezekde diňe bir zady üýtgediň.',
      'Kiçi mysal bilen gaýtalap boljak ýagdaýy tapyň.'
    ],
    quiz: [
      ['`undefined + 1` näme?', '`NaN`.'],
      ['`x is not defined` haýsy ýalňyşlyk?', '`ReferenceError`.'],
      ['Kody belli bir setirde togtatmak üçin näme ýazylýar?', '`debugger;`']
    ]
  });

  explain('ch16', {
    simple: [
      'Algoritm — **tagam resepti** ýa-da ýol görkezmesi ýaly: anyk ädimleriň yzygiderligi. Bir meseläni çözmegiň köp ýoly bolup biler — käbiri çalt, käbiri haýal.',
      'Mysal: sözlükden söz gözlemek. Her sahypany yzygiderli açmak — çyzykly gözleg (haýal). Ortasyndan açyp, "öňdemi ýa-da yzdamy?" diýip ýarpa bölmek — ikilik gözleg (çalt).'
    ],
    stepsCode: '// Ikilik gözleg: [2, 5, 8, 12, 16, 23] içinde 16\n// 1) lo=0, hi=5, mid=2 → 8  < 16 → saga: lo=3\n// 2) lo=3, hi=5, mid=4 → 16 = 16 → tapyldy, indeks 4\n// Çyzykly gözleg 5 ädim, ikilik gözleg bolsa 2 ädim etdi.',
    steps: [
      'Her ädimde ikilik gözleg galan aralygy iki esse kiçeldýär. 1 000 000 elementli massiwde iň köp ~20 ädim gerek, çyzykly gözlegde bolsa 1 000 000-a çenli.',
      'Ýöne ikilik gözleg diňe **tertiplenen** massiwde işleýär — algoritm saýlanyňyzda şeýle şertlere üns beriň.'
    ],
    remember: [
      'Ilki dogry, soň çalt.',
      'O(n) — bir sikl, O(n²) — içki sikller, O(log n) — ýarpa bölmek.',
      'Map / Set — "barmy?" soragyny çalt jogaplaýar.',
      'Kiçi mysallary el bilen çözüp görüň.'
    ],
    quiz: [
      ['Ikilik gözleg üçin massiw nähili bolmaly?', 'Tertiplenen.'],
      ['Içki iki sikliň çylşyrymlylygy?', 'Adatça O(n²).'],
      ['Stekde haýsy element ilki çykýar?', 'Iň soňky goşulan.']
    ]
  });

  explain('ch17', {
    simple: [
      'Gowy kod — **tertipli otag** ýaly: her zat öz ýerinde, atlary düşnükli, gaýtalanýan zat ýok. Şeýle otagda zady tapmak (ýalňyşlygy tapmak) aňsat.',
      'Kody kompýuter üçin däl, **adam** üçin ýazýarys: kompýuter islendik kody düşünýär, ýöne bir aýdan soň siz ýa-da toparyňyz ony okap bilmeli.'
    ],
    stepsCode: '// Öň (düşnüksiz, gaýtalanýan)\nfunction f(a) {\n  if (a[0] > 50) console.log("geçdi"); else console.log("geçmedi");\n  if (a[1] > 50) console.log("geçdi"); else console.log("geçmedi");\n}\n\n// Soň (düşnükli, gaýtalanmaýan)\nconst GEÇIŞ_BALY = 50;\nfunction netijeleriGörkez(ballar) {\n  for (const bal of ballar) {\n    console.log(bal > GEÇIŞ_BALY ? "geçdi" : "geçmedi");\n  }\n}',
    steps: [
      'Birinji wersiýada at (`f`, `a`) hiç zat aýtmaýar, 50 sany "jadyly" we setir gaýtalanýar — üçünji talyp goşulsa, ýene bir setir ýazmaly.',
      'Ikinji wersiýada atlar düşnükli, konstanta bir ýerde, sikl islendik sanly talyp üçin işleýär.'
    ],
    remember: [
      'Manyly atlar, gysga funksiýalar.',
      'Gaýtalanma ýok (DRY).',
      'Jadyly sanlaryň ýerine konstantalar.',
      'Ilki işleýän kod, soň ony arassalamak (refactoring).'
    ],
    quiz: [
      ['DRY näme aňladýar?', '"Don\'t Repeat Yourself" — gaýtalamaň.'],
      ['`const d = 7` ýa-da `const HEPDEDÄKI_GÜNLER = 7` — haýsy gowy?', 'Ikinjisi — manysy düşnükli.'],
      ['Teswir nämäni düşündirmeli?', '"Näme üçin" şeýle edilendigini.']
    ]
  });

  explain('ch18', {
    simple: [
      'Ýalňyşlyklar — öwrenmegiň adaty bölegi. Tejribeli programmistler hem ýalňyşýar, ýöne olar **ýygy duşýan** ýalňyşlyklary tanaýarlar we çalt tapýarlar.',
      'Bu bapdaky ýalňyşlyklaryň köpüsiniň sebäbi üç zat: görnüşleriň awtomatik öwrülmegi, salgylanma boýunça göçürmek we asinhron koda sinhron ýaly garamak.'
    ],
    stepsCode: '// Ýalňyş: ulanyjynyň girizen iki sanyny goşmak\nconst a = "5", b = "3";      // formadan gelen bahalar — setir!\nconsole.log(a + b);          // "53" ← ýalňyş\n\n// Düzediş\nconsole.log(Number(a) + Number(b)); // 8\n\n// Ýalňyş: massiwiň soňky elementi\nconst s = [1, 2, 3];\nconsole.log(s[s.length]);     // undefined ← indeks 3 ýok\nconsole.log(s[s.length - 1]); // 3',
    steps: [
      'Birinji mysalda iki bahanyň setirdigini bilmesek, `+` olary birleşdirýär. Hasaplamazdan öň görnüşi barlaň (`typeof`).',
      'Ikinji mysalda indeksleriň 0-dan başlaýandygyny unutduk. Soňky element hemişe `length - 1` ýa-da `at(-1)`.'
    ],
    remember: [
      'Formadan gelen bahalar — setir.',
      'Soňky indeks — `length - 1`.',
      '`=` däl, `===`.',
      'Profiliňizdäki "🩺 Ýalňyşlyklar we maslahatlar" bölümi öz ýalňyşlyklaryňyzy görkezýär.'
    ],
    quiz: [
      ['`"2" + 2` näme?', '`"22"`.'],
      ['`[10, 9, 1].sort()` näme üçin nädogry?', 'Sanlary setir hökmünde tertipleýär: `[1, 10, 9]`.'],
      ['`x = 10` şertde näme üçin howply?', 'Ol deňeşdirmeýär, baha berýär we hemişe True.']
    ]
  });
})();
