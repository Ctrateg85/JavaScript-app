// Ensiklopediýa: her bap üçin goşmaça maglumatlar (2-nji bölek)
// Bloklaryň görnüşi book.js faýlyndaky ýaly. Bu faýl book.js we book-extra.js-den soň ýüklenýär.

(function () {
  const H = t => ['h', t];
  const P = t => ['p', t];
  const CODE = t => ['code', t];
  const LIST = a => ['list', a];
  const TIP = t => ['tip', t];
  const extend = (id, blocks) => window.BOOK.chapters.find(c => c.id === id).blocks.push(...blocks);

  // ---------- 1. Giriş we üýtgeýänler ----------
  extend('ch1', [
    H('JavaScript we ECMAScript'),
    P('JavaScript-iň resmi standarty **ECMAScript** (ES) diýlip atlandyrylýar. 2009-njy ýyldaky ES5 we 2015-nji ýyldaky ES6 (ES2015) iň möhüm wersiýalar. ES6-dan bäri her ýyl täze wersiýa çykýar: `let` / `const`, ok-funksiýalar, klasslar, `async` / `await` ýaly mümkinçilikler şeýle peýda boldy.'),
    H('Kod nähili ýerine ýetirilýär?'),
    P('Kod ýokardan aşak, setirme-setir ýerine ýetirilýär. Her buýruk adatça `;` bilen gutarýar. Nokatly otur ýazylmasa, JS ony awtomatik goýýar (ASI), ýöne käbir ýagdaýlarda bu garaşylmadyk netije berýär:'),
    CODE('function al() {\n  return      // ← ASI şu ýere ";" goýýar!\n  {\n    baha: 1\n  };\n}\nal(); // undefined\n\n// Dogrusy: açylýan ýaý return bilen bir setirde bolmaly\nfunction al2() {\n  return {\n    baha: 1\n  };\n}'),
    H('const we obýektler'),
    P('`const` üýtgeýäniň özüne täze baha berilmegini gadagan edýär, ýöne onuň içindäki obýekti ýa-da massiwi üýtgedip bolýar.'),
    CODE('const user = { at: "Aý" };\nuser.at = "Maral";   // bolýar — obýektiň içi üýtgeýär\n// user = {};        // TypeError — täze baha bermek gadagan\n\nconst sanlar = [1, 2];\nsanlar.push(3);      // bolýar: [1, 2, 3]'),
    H('Berk tertip ("use strict")'),
    P('Faýlyň ýa-da funksiýanyň başynda `"use strict";` ýazylsa, JS has berk düzgünler bilen işleýär: yglan edilmedik üýtgeýäne baha bermek ýalňyşlyk döredýär, käbir howply amallar gadagan edilýär. Modullarda we klasslarda berk tertip awtomatik açyk.'),
    CODE('"use strict";\nsany = 5; // ReferenceError: sany is not defined\n         // (berk tertipsiz global üýtgeýän döreýärdi)'),
    TIP('Bir setirde bir üýtgeýän yglan ediň we oňa manyly at beriň: `let x, y, z;` däl-de, `let ini = 0;`, `let beýiklik = 0;`.')
  ]);

  // ---------- 2. Maglumat görnüşleri ----------
  extend('ch2', [
    H('Baha we salgylanma boýunça göçürmek'),
    P('Primitiw bahalar (san, setir, boolean ...) göçürilende täze nusga döreýär. Obýektler (massiwler, funksiýalar hem) bolsa salgylanma boýunça göçürilýär — iki üýtgeýän şol bir obýekte görkezýär.'),
    CODE('let a = 5;\nlet b = a;\nb = 10;\nconsole.log(a); // 5 — üýtgemedi\n\nconst x = { n: 5 };\nconst y = x;\ny.n = 10;\nconsole.log(x.n); // 10 — şol bir obýekt!'),
    H('Sanlaryň ýazylyş görnüşleri'),
    CODE('1_000_000   // 1000000 — okalmagy aňsat bolar ýaly\n1e3         // 1000 (ylmy ýazgy)\n2.5e-3      // 0.0025\n0xff        // 255 (16-lyk)\n0b101       // 5   (ikilik)\n0o17        // 15  (8-lik)'),
    H('Howpsuz bitin sanlar we BigInt'),
    P('`number` görnüşi `Number.MAX_SAFE_INTEGER` (9 007 199 254 740 991) çenli bitin sanlary takyk saklaýar. Has uly bitin sanlar üçin `BigInt` ulanylýar.'),
    CODE('9007199254740992 === 9007199254740993; // true (!) — takyklyk ýitýär\n9007199254740992n + 1n;                 // 9007199254740993n\ntypeof 10n;                             // "bigint"\n// 10n + 1;  // TypeError — BigInt bilen number garyşdyryp bolmaýar'),
    H('Görnüşi takyk barlamak'),
    CODE('Array.isArray([1, 2]);     // true  (typeof [] — "object")\nNumber.isInteger(5.0);     // true\nNumber.isInteger(5.5);     // false\nNumber.isFinite(1 / 0);    // false\nvalue === null;            // null-y barlamak üçin\nnew Date() instanceof Date; // true'),
    H('Symbol'),
    P('`Symbol` — hemişe gaýtalanmaýan baha. Ol köplenç obýektiň gizlin ýa-da çaknyşmaýan açarlary üçin ulanylýar.'),
    CODE('const id = Symbol("id");\nconst user = { [id]: 123, at: "Aý" };\nObject.keys(user); // ["at"] — symbol açarlar görünmeýär'),
    TIP('`typeof null === "object"` — JS-iň taryhy ýalňyşlygy. `null`-y barlamak üçin hemişe `x === null` ulanyň.')
  ]);

  // ---------- 3. Operatorlar ----------
  extend('ch3', [
    H('Deňeşdirmäniň geň ýagdaýlary'),
    CODE('NaN === NaN        // false — NaN hiç zada deň däl\nnull == 0          // false\nnull >= 0          // true  (!)\nundefined == null  // true\n[] == false        // true  ([] → "" → 0)\n"10" > "9"         // false (setirler harp-harp deňeşdirilýär)\n10 > "9"           // true  (setir sana öwrülýär)'),
    TIP('Bu geň netijeleriň köpüsi `==` we görnüşleriň awtomatik öwrülmegi bilen bagly. `===` ulanyň we sanlary deňeşdirmezden öň `Number()` bilen öwrüň.'),
    H('Unar operatorlar'),
    CODE('+"42"      // 42      — sana öwürmek\n-"5"       // -5\n!0         // true    — inkär\n!!"salam"  // true    — boolean-a öwürmek\ntypeof 5   // "number"\nvoid 0     // undefined'),
    H('in, delete we instanceof'),
    CODE('const o = { a: 1 };\n"a" in o;          // true — häsiýet barmy?\ndelete o.a;        // häsiýeti aýyrmak\n"a" in o;          // false\n[] instanceof Array; // true — klasyň nusgasymy?'),
    H('Bölmek bilen bagly peýdaly amallar'),
    CODE('Math.floor(17 / 5)  // 3   — bitin bölmek\n17 % 5              // 2   — galyndy\n-7 % 3              // -1  — alamat bölünýäniňki ýaly\n((-7 % 3) + 3) % 3  // 2   — matematiki galyndy\nMath.trunc(-3.7)    // -3  — drob bölegini taşlamak'),
    H('Zynjyrlanan ýüzlenme (?.) we çagyryş'),
    CODE('user?.profil?.at        // häsiýet ýok bolsa undefined\nuser.salam?.()          // usul bar bolsa çagyr\nmassiw?.[0]             // massiw bar bolsa ilkinji element')
  ]);

  // ---------- 4. Şertler ----------
  extend('ch4', [
    H('Şertde True / False'),
    P('`if (x)` ýazylanda `x` boolean-a öwrülýär. Bu gysga, ýöne `0` ýa-da boş setir dogry baha bolup bilýän ýerlerde howply.'),
    CODE('const san = 0;\nif (san) { }              // ýerine ýetirilmeýär — 0 False!\nif (san !== undefined) { } // has takyk barlag\n\nconst at = "";\nif (!at) console.log("At girizilmedi");'),
    H('Şertleri ýönekeýleşdirmek'),
    P('De Morganyň kanunlary: `!(a && b)` = `!a || !b` we `!(a || b)` = `!a && !b`. Inkärleri azaltmak kody okalýan edýär.'),
    CODE('// Kyn okalýar\nif (!(yas >= 18 && rugsat)) { ... }\n// Has düşnükli\nif (yas < 18 || !rugsat) { ... }\n\n// Gereksiz if\nif (x > 5) return true; else return false;\n// Gysga\nreturn x > 5;'),
    H('switch (true) usuly'),
    CODE('function baha(bal) {\n  switch (true) {\n    case bal >= 90: return "A";\n    case bal >= 75: return "B";\n    case bal >= 60: return "C";\n    default: return "F";\n  }\n}'),
    H('Gysga utgaşdyrma bilen şertler'),
    CODE('isLoggedIn && showMenu();        // şert dogry bolsa çagyr\nconst at = user.at || "Myhman";  // adaty baha\nconst limit = config.limit ?? 10; // diňe null/undefined bolsa 10'),
    H('Içki üçlük operatordan gaça duruň'),
    CODE('// Okamak kyn\nconst t = a > b ? (a > c ? a : c) : (b > c ? b : c);\n// Has düşnükli\nconst t2 = Math.max(a, b, c);'),
    TIP('Şert 3–4 şahadan köp bolsa, `switch`, obýekt ýa-da massiw bilen çalşyp bolýarmy — oýlanyň.')
  ]);

  // ---------- 5. Sikller ----------
  extend('ch5', [
    H('Sikl ýa-da massiw usuly?'),
    P('Massiwler bilen işlände köplenç sikl ýerine usullar has gysga: `forEach` — her element üçin iş, `map` — özgertmek, `filter` — saýlamak, `reduce` — jemlemek.'),
    CODE('const bahalar = [3, 5, 4];\n\n// Sikl bilen\nlet jem = 0;\nfor (const b of bahalar) jem += b;\n\n// reduce bilen\nconst jem2 = bahalar.reduce((a, b) => a + b, 0);'),
    TIP('`forEach`-i `break` bilen togtadyp bolmaýar. Ir togtamaly bolsa `for...of`, `some` ýa-da `find` ulanyň.'),
    H('for...of bilen dürli ýygyndylar'),
    CODE('for (const harp of "JS") console.log(harp);          // J, S\nfor (const [i, x] of ["a", "b"].entries()) console.log(i, x);\nfor (const [k, v] of new Map([["a", 1]])) console.log(k, v);\nfor (const x of new Set([1, 2, 2])) console.log(x);   // 1, 2'),
    H('do...while ulanylyşy'),
    P('`do...while` iň bolmanda bir gezek ýerine ýetirilmeli işler üçin amatly — meselem, dogry baha alýança gaýtadan soramak.'),
    CODE('let zar;\ndo {\n  zar = Math.floor(Math.random() * 6) + 1;\n  console.log("Zar:", zar);\n} while (zar !== 6);'),
    H('Sikli ädimme-ädim yzarlamak'),
    P('Sikl nädogry işlese, her ädimde üýtgeýänleriň bahasyny tablisa edip ýazyň:'),
    CODE('// for (let i = 1; i <= 3; i++) s += i;\n// i | şert  | s\n// 1 | true  | 1\n// 2 | true  | 3\n// 3 | true  | 6\n// 4 | false | — sikl gutardy'),
    H('Siklde massiwi üýtgetmek'),
    CODE('const a = [1, 2, 3, 4];\n// Nädogry: aýyranyňda indeksler süýşýär\nfor (let i = 0; i < a.length; i++) if (a[i] % 2 === 0) a.splice(i, 1);\n\n// Dogry: filter bilen täze massiw\nconst tak = a.filter(x => x % 2 !== 0);')
  ]);

  // ---------- 6. Funksiýalar ----------
  extend('ch6', [
    H('Funksiýa hem baha'),
    P('JS-de funksiýa adaty baha ýaly: ony üýtgeýände, massiwde, obýektde saklap, argument hökmünde berip we gaýtaryp bolýar.'),
    CODE('const amallar = {\n  gos: (a, b) => a + b,\n  ayyr: (a, b) => a - b\n};\namallar.gos(2, 3);        // 5\namallar["ayyr"](9, 4);    // 5'),
    H('Callback funksiýalar'),
    CODE('function gaýtala(n, iş) {\n  for (let i = 0; i < n; i++) iş(i);\n}\ngaýtala(3, i => console.log("Ädim", i));'),
    H('Saf funksiýalar we ýan täsirler'),
    P('**Saf funksiýa** — şol bir argumentlerde hemişe şol bir netijäni gaýtarýar we daşarky zady üýtgetmeýär. Olary barlamak we düşünmek aňsat.'),
    CODE('// Saf\nconst goş = (a, b) => a + b;\n\n// Saf däl: daşarky üýtgeýäni üýtgedýär\nlet jem = 0;\nfunction goşJeme(x) { jem += x; }'),
    H('Currying'),
    P('Birnäçe argumentli funksiýany her gezek bir argument alýan funksiýalar zynjyryna öwürmek:'),
    CODE('const goş = a => b => c => a + b + c;\ngoş(1)(2)(3); // 6\n\nconst salamla = salam => at => `${salam}, ${at}!`;\nconst gunAydyn = salamla("Gün aýdyň");\ngunAydyn("Aý"); // "Gün aýdyň, Aý!"'),
    H('Parametrleriň köp bolmagyndan gaça durmak'),
    CODE('// Kyn: tertibi ýatda saklamaly\nhasapDöret("Aý", 20, true, "Mary", null);\n\n// Gowy: obýekt parametri we destrukturlaşdyrma\nfunction hasapDöret({ at, yas, admin = false, şäher = "Aşgabat" }) { /* ... */ }\nhasapDöret({ at: "Aý", yas: 20, şäher: "Mary" });'),
    TIP('Rekursiýanyň çuňlugy çäkli (~10 000 çagyryş). Gaty uly n üçin sikl ulanyň.')
  ]);

  // ---------- 7. Massiwler ----------
  extend('ch7', [
    H('reduce bilen dürli meseleler'),
    CODE('const s = [4, 9, 2, 7];\ns.reduce((m, x) => Math.max(m, x));            // 9 — iň uly\ns.reduce((o, x) => (o[x % 2 ? "täk" : "jübüt"]++, o), { täk: 0, jübüt: 0 });\n// { täk: 2, jübüt: 2 }\n["a", "b"].reduce((o, x, i) => ({ ...o, [x]: i }), {}); // { a: 0, b: 1 }'),
    H('flatMap, findLast we some / every'),
    CODE('["a b", "c"].flatMap(s => s.split(" ")); // ["a", "b", "c"]\n[1, 5, 3, 8].findLast(x => x > 2);       // 8\n[1, 5, 3, 8].findLastIndex(x => x < 4);  // 2\n[2, 4].every(x => x % 2 === 0);          // true'),
    H('Asyl massiwi üýtgetmeýän täze usullar'),
    P('ES2023-de asyl massiwi üýtgetmän, täze massiw gaýtarýan usullar goşuldy:'),
    CODE('const a = [3, 1, 2];\na.toSorted();      // [1, 2, 3], a üýtgemedi\na.toReversed();    // [2, 1, 3]\na.with(0, 9);      // [9, 1, 2]\na.toSpliced(1, 1); // [3, 2]'),
    H('Massiwleri deňeşdirmek'),
    CODE('[1, 2] === [1, 2];                                   // false — dürli obýektler\nJSON.stringify([1, 2]) === JSON.stringify([1, 2]);  // true — ýönekeý ýagdaýlar üçin\nconst den = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);'),
    H('includes we indexOf tapawudy'),
    CODE('[NaN].includes(NaN);  // true\n[NaN].indexOf(NaN);   // -1 — indexOf NaN-y tapmaýar'),
    TIP('Uly massiwde ýygy-ýygydan "barmy?" diýip soralýan bolsa, ony `Set`-e öwrüň: `set.has(x)` massiwdäki gözlegden has çalt.')
  ]);

  // ---------- 8. Obýektler ----------
  extend('ch8', [
    H('this nämä salgylanýar?'),
    LIST([
      'Usul hökmünde çagyrylanda (`obj.f()`) — `obj`.',
      'Adaty funksiýa hökmünde (`f()`) — berk tertipde `undefined`.',
      'Ok-funksiýada — daşky gurşawdaky `this` (öz `this`-i ýok).',
      '`new` bilen — täze döredilen obýekt.'
    ]),
    CODE('const sanaýjy = {\n  n: 0,\n  başla() {\n    setInterval(() => this.n++, 1000); // ok-funksiýa: this = sanaýjy\n  }\n};'),
    H('Prototip zynjyry'),
    P('Her obýektiň prototipi bar. Häsiýet obýektiň özünde tapylmasa, JS ony prototipde, soň prototipiň prototipinde gözleýär. Massiwleriň `map`, `filter` usullary hem `Array.prototype`-dan gelýär.'),
    CODE('const haýwan = { dem() { return "dem alýar"; } };\nconst it = Object.create(haýwan);\nit.dem();                         // "dem alýar" — prototipden\nObject.getPrototypeOf(it) === haýwan; // true'),
    H('Usullary zynjyrlamak'),
    CODE('const hasap = {\n  baha: 0,\n  goş(x) { this.baha += x; return this; },\n  köpelt(x) { this.baha *= x; return this; }\n};\nhasap.goş(2).köpelt(5).goş(1).baha; // 11'),
    H('Map ýa-da obýekt?'),
    LIST([
      '`Map` — açar islendik görnüşde (obýekt, san); tertibi saklaýar; `size` bar; ýygy goşmak/aýyrmak üçin çalt.',
      'Obýekt — açarlar setir ýa-da symbol; JSON bilen göni işleýär; sazlamalar we ýazgylar üçin amatly.'
    ]),
    CODE('const ziýaratlar = new Map();\nconst user = { at: "Aý" };\nziýaratlar.set(user, 3);   // obýekt açar hökmünde\nziýaratlar.get(user);      // 3'),
    TIP('Obýektiň häsiýetlerini aýlanmak üçin `Object.entries(obj)` + `for...of` iň düşnükli usul.')
  ]);

  // ---------- 9. Setirler ----------
  extend('ch9', [
    H('Ýörite belgiler (escape)'),
    CODE('"Birinji setir\\nIkinji setir"  // \\n — täze setir\n"Ady:\\tAý"                    // \\t — tab\n"Ol: \\"Salam\\" diýdi"          // goşa dyrnak\n"C:\\\\Users"                   // \\\\ — ters çyzyk'),
    H('Köp setirli tekst'),
    CODE('const hat = `Hormatly talyp,\nsiz synagdan geçdiňiz.\nBaha: ${5}`;'),
    H('Unicode we emoji'),
    P('Käbir simwollar (emoji) iki kod birliginden ybarat, şonuň üçin `length` garaşylmadyk netije berip biler. Simwollary dogry sanamak üçin spread ulanyň.'),
    CODE('"😀".length;          // 2\n[..."😀"].length;     // 1\n[..."salam😀"].reverse().join(""); // "😀malas"'),
    H('Sanlary we seneleri formatlamak'),
    CODE('(1234567.891).toLocaleString("ru-RU"); // "1 234 567,891"\n(0.256).toLocaleString("en", { style: "percent" }); // "26%"\nnew Date(2026, 10, 10).toLocaleDateString("ru-RU"); // "10.11.2026"\nString(7).padStart(2, "0");             // "07"'),
    H('split we join bilen özgertmeler'),
    CODE('"salam dünýä".split(" ").map(s => s[0].toUpperCase() + s.slice(1)).join(" ");\n// "Salam Dünýä"\n"a-b-c".split("-").reverse().join("-"); // "c-b-a"\n"Salam".split("").sort().join("");      // "Saalm"'),
    TIP('Setirleri uly-kiçi harpa garamazdan deňeşdirmek üçin ikisini hem `toLowerCase()` ediň.')
  ]);

  // ---------- 10. DOM we wakalar ----------
  extend('ch10', [
    H('DOM agajy boýunça hereket'),
    CODE('el.parentElement;          // ata element\nel.children;               // çaga elementler\nel.firstElementChild;      // ilkinji çaga\nel.nextElementSibling;     // indiki goňşy\nel.closest(".kart");       // iň ýakyn ata .kart'),
    H('Köp elementi çalt goşmak'),
    CODE('const fr = document.createDocumentFragment();\nfor (const at of ["Aý", "Maral", "Merdan"]) {\n  const li = document.createElement("li");\n  li.textContent = at;\n  fr.appendChild(li);\n}\nlist.appendChild(fr); // DOM diňe bir gezek üýtgeýär'),
    H('Klawiatura wakalary'),
    CODE('document.addEventListener("keydown", e => {\n  if (e.key === "Enter") console.log("Enter basyldy");\n  if (e.ctrlKey && e.key === "s") {\n    e.preventDefault(); // brauzeriň "Sakla" penjiresini ýatyrmak\n    console.log("Saklanýar...");\n  }\n});'),
    H('Animasiýa: requestAnimationFrame'),
    CODE('let x = 0;\nfunction ädim() {\n  x += 2;\n  box.style.transform = `translateX(${x}px)`;\n  if (x < 300) requestAnimationFrame(ädim);\n}\nrequestAnimationFrame(ädim);'),
    H('Elementiň stilini okamak'),
    CODE('el.style.color;                  // diňe inline stil\ngetComputedStyle(el).color;      // ulanylýan hakyky stil\nel.getBoundingClientRect();       // ölçegi we ýerleşişi'),
    TIP('Stili JS-de göni üýtgetmegiň ýerine klass goşup-aýyryň (`classList.toggle`), stilleri CSS-de saklaň.')
  ]);

  // ---------- 11. Asinhron JavaScript ----------
  extend('ch11', [
    H('Callback dowzahy'),
    P('Öň asinhron işler içki callback-ler bilen ýazylýardy — kod "piramida" görnüşine gelip, okalmasy kynlaşýardy. Promise we `async/await` bu meseläni çözýär.'),
    CODE('// Callback dowzahy\nal(1, a => {\n  al(2, b => {\n    al(3, c => console.log(a, b, c));\n  });\n});\n\n// async/await bilen\nconst a = await al(1);\nconst b = await al(2);\nconst c = await al(3);'),
    H('Taýmeri Promise-e öwürmek'),
    CODE('const garaş = ms => new Promise(resolve => setTimeout(resolve, ms));\n\nasync function sanaw() {\n  for (let i = 3; i > 0; i--) {\n    console.log(i);\n    await garaş(1000);\n  }\n  console.log("Başla!");\n}'),
    H('fetch jikme-jik'),
    CODE('const jogap = await fetch("/api/talyplar", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ at: "Aý" })\n});\nif (!jogap.ok) throw new Error("HTTP " + jogap.status);\nconst data = await jogap.json();'),
    H('Yzygiderli ýa-da parallel?'),
    CODE('// Yzygiderli: 3 sekunt (her biri 1 s)\nfor (const id of [1, 2, 3]) await al(id);\n\n// Parallel: ~1 sekunt\nawait Promise.all([1, 2, 3].map(id => al(id)));'),
    H('Soragy wagt çägi bilen ýatyrmak'),
    CODE('const ctrl = new AbortController();\nsetTimeout(() => ctrl.abort(), 5000); // 5 sekuntdan soň ýatyr\ntry {\n  await fetch(url, { signal: ctrl.signal });\n} catch (e) {\n  if (e.name === "AbortError") console.log("Wagt gutardy");\n}'),
    TIP('`forEach` içinde `await` garaşmaýar! Yzygiderli asinhron iş üçin `for...of` ulanyň.')
  ]);

  // ---------- 12. Klasslar we ES6+ ----------
  extend('ch12', [
    H('Modullar jikme-jik'),
    CODE('// matematika.js\nexport const PI = 3.14;\nexport function goş(a, b) { return a + b; }\nexport default function köpelt(a, b) { return a * b; }\n\n// main.js\nimport köpelt, { PI, goş as jemle } from "./matematika.js";\nimport * as M from "./matematika.js";\nconst { goş } = await import("./matematika.js"); // dinamik import'),
    H('Destrukturlaşdyrmanyň goşmaça mümkinçilikleri'),
    CODE('const { at: ady, yas = 18, ...galany } = { at: "Aý", şäher: "Mary" };\n// ady = "Aý", yas = 18, galany = { şäher: "Mary" }\n\nfunction görkez({ at, bahalar: [ilki] = [] }) {\n  return `${at}: ${ilki}`;\n}'),
    H('Iteratorlar'),
    P('`for...of` bilen aýlanyp bolýan islendik obýektiň `[Symbol.iterator]` usuly bar. Ony özüňiz hem ýazyp bilersiňiz:'),
    CODE('const aralyk = {\n  bas: 1, son: 3,\n  *[Symbol.iterator]() {\n    for (let i = this.bas; i <= this.son; i++) yield i;\n  }\n};\n[...aralyk]; // [1, 2, 3]'),
    H('WeakMap we WeakSet'),
    P('`WeakMap` açar hökmünde diňe obýekt alýar we obýekt başga ýerde ulanylmasa, ony ýatdan awtomatik aýyrýar. Obýektlere goşmaça maglumat baglamak üçin amatly.'),
    CODE('const gizlin = new WeakMap();\nclass Ulanyjy {\n  constructor(parol) { gizlin.set(this, parol); }\n  barla(p) { return gizlin.get(this) === p; }\n}'),
    H('Miras ýa-da düzüm?'),
    P('Çuň miras zynjyrlary kody çylşyrymlaşdyrýar. Köplenç "-dyr" (it haýwandyr) gatnaşygy üçin miras, "-y bar" (maşynyň motory bar) gatnaşygy üçin düzüm (composition) ulanmak gowy.'),
    TIP('Klasslar JS-de prototipleriň üstündäki amatly ýazgy — içinde şol bir prototip mehanizmi işleýär.')
  ]);

  // ---------- 13. Regulýar aňlatmalar ----------
  extend('ch13', [
    H('Toparlar we atly toparlar'),
    CODE('const m = "2026-11-10".match(/(\\d{4})-(\\d{2})-(\\d{2})/);\nm[1]; // "2026"\n\nconst { groups } = "2026-11-10".match(/(?<yyl>\\d{4})-(?<ay>\\d{2})-(?<gun>\\d{2})/);\ngroups.ay; // "11"'),
    H('replace bilen toparlary ulanmak'),
    CODE('"2026-11-10".replace(/(\\d+)-(\\d+)-(\\d+)/, "$3.$2.$1"); // "10.11.2026"\n"salam dünýä".replace(/\\b\\w/g, h => h.toUpperCase());   // "Salam Dünýä"'),
    H('Ähli gabat gelmeleri aýlanmak'),
    CODE('const text = "a1 b22 c333";\nfor (const m of text.matchAll(/([a-z])(\\d+)/g)) {\n  console.log(m[1], m[2]); // a 1, b 22, c 333\n}'),
    H('Öňünden barlamak (lookahead)'),
    P('`(?=...)` — yzynda şeýle zat bolmaly, `(?!...)` — bolmaly däl. Paroluň güýjüni barlamak üçin amatly:'),
    CODE('const güýçli = /^(?=.*\\d)(?=.*[A-Z]).{8,}$/;\ngüýçli.test("salam123");   // false — uly harp ýok\ngüýçli.test("Salam1234");  // true'),
    H('Ýygy ulanylýan nusgalar'),
    LIST([
      'Diňe sifr: `/^\\d+$/`',
      'Telefon (+993 XX XXXXXX): `/^\\+993 \\d{2} \\d{6}$/`',
      'Sene (GG.AA.ÝÝÝÝ): `/^\\d{2}\\.\\d{2}\\.\\d{4}$/`',
      'Artykmaç boşluklar: `s.replace(/\\s+/g, " ")`'
    ]),
    TIP('Regulýar aňlatma çylşyrymlaşsa, ony böleklere bölüp, her bölegini aýratyn synap görüň.')
  ]);

  // ---------- 14. JSON we maglumat saklamak ----------
  extend('ch14', [
    H('stringify-iň goşmaça parametrleri'),
    CODE('const u = { at: "Aý", parol: "123", yas: 20 };\nJSON.stringify(u, ["at", "yas"]);          // diňe saýlanan açarlar\nJSON.stringify(u, (k, v) => k === "parol" ? undefined : v); // paroly taşlamak\nJSON.stringify(u, null, 2);                  // 2 boşluk içerik bilen'),
    H('Seneleri saklamak'),
    P('`Date` JSON-da setire öwrülýär we `parse` edilende setir bolup galýar. Ony yzyna senä öwürmek üçin "reviver" funksiýasy ulanylýar:'),
    CODE('const text = JSON.stringify({ wagt: new Date() });\nconst obj = JSON.parse(text, (k, v) => k === "wagt" ? new Date(v) : v);\nobj.wagt instanceof Date; // true'),
    H('localStorage we sessionStorage'),
    LIST([
      '`localStorage` — brauzer ýapylsa-da saklanýar.',
      '`sessionStorage` — diňe şu tab açyk wagty saklanýar.',
      'Ikisi hem diňe setir saklaýar we takmynan 5 MB çäkli.',
      'Her sahypanyň (domeniň) öz aýratyn ammary bar.'
    ]),
    H('Howpsuz okamak we wersiýalar'),
    CODE('function ýükle() {\n  try {\n    const d = JSON.parse(localStorage.getItem("ýagdaý")) || {};\n    return { wersiýa: 1, xp: 0, ...d }; // täze meýdanlar üçin adaty bahalar\n  } catch {\n    return { wersiýa: 1, xp: 0 };       // zaýalanan maglumat\n  }\n}'),
    TIP('Parollary we gizlin maglumatlary `localStorage`-da saklamaň — sahypadaky islendik skript olary okap biler.')
  ]);

  // ---------- 15. Ýalňyşlyklary tapmak ----------
  extend('ch15', [
    H('Brauzeriň DevTools gurallary'),
    LIST([
      '**F12** — DevTools-y açmak.',
      '**Console** — ýalňyşlyklar we `console.log` netijeleri.',
      '**Sources** — kody ädimme-ädim ýerine ýetirmek (breakpoint).',
      '**Network** — tor soraglary we jogaplary.',
      '**Elements** — DOM we CSS.'
    ]),
    H('debugger buýrugy'),
    P('Koda `debugger;` ýazylsa, DevTools açyk wagty programma şol ýerde durýar we üýtgeýänleriň bahasyny görüp, ädimme-ädim dowam edip bolýar.'),
    CODE('function hasapla(sanlar) {\n  let jem = 0;\n  for (const s of sanlar) {\n    debugger; // her ädimde dur\n    jem += s;\n  }\n  return jem;\n}'),
    H('console-yň peýdaly usullary'),
    CODE('console.group("Ulanyjy");\nconsole.log("at: Aý");\nconsole.groupEnd();\n\nconsole.time("sikl");\nfor (let i = 0; i < 1e6; i++);\nconsole.timeEnd("sikl");    // sikl: 3.2 ms\n\nconsole.assert(1 + 1 === 3, "Hasap ýalňyş!");\nconsole.count("çagyryş");   // çagyryş: 1, 2, ...'),
    H('Stack trace okamak'),
    CODE('TypeError: Cannot read properties of undefined (reading \'at\')\n    at görkez (app.js:12:20)    ← ýalňyşlyk şu ýerde\n    at başla (app.js:30:5)      ← görkez() şu ýerden çagyryldy\n    at app.js:40:1'),
    H('Öz kiçijik testleriňiz'),
    CODE('function test(at, netije, garaşylýan) {\n  const ok = JSON.stringify(netije) === JSON.stringify(garaşylýan);\n  console.log(ok ? "✅" : "❌", at, ok ? "" : `(${netije} ≠ ${garaşylýan})`);\n}\ntest("goş", goş(2, 3), 5);\ntest("boş massiw", jem([]), 0);'),
    TIP('"Mysal işlemek" bölümi hem şeýle testler bilen işleýär: kodyňyz mysallar we goşmaça barlaglar bilen barlanýar.')
  ]);

  // ---------- 16. Algoritmler esaslary ----------
  extend('ch16', [
    H('Saýlap tertiplemek (selection sort)'),
    CODE('function saýlap(a) {\n  a = [...a];\n  for (let i = 0; i < a.length; i++) {\n    let min = i;\n    for (let j = i + 1; j < a.length; j++) if (a[j] < a[min]) min = j;\n    [a[i], a[min]] = [a[min], a[i]];\n  }\n  return a;\n} // O(n²)'),
    H('Birleşdirip tertiplemek (merge sort)'),
    CODE('function birleşdirip(a) {\n  if (a.length < 2) return a;\n  const orta = a.length >> 1;\n  const çep = birleşdirip(a.slice(0, orta));\n  const sag = birleşdirip(a.slice(orta));\n  const r = [];\n  while (çep.length && sag.length) r.push(çep[0] <= sag[0] ? çep.shift() : sag.shift());\n  return r.concat(çep, sag);\n} // O(n log n)'),
    H('Esasy maglumat gurluşlary'),
    LIST([
      '**Stek** (soňky giren — ilki çykýar): `push` / `pop`.',
      '**Nobat** (ilki giren — ilki çykýar): `push` / `shift`.',
      '**Set** — gaýtalanmaýan bahalar, `has` O(1).',
      '**Map** — açar → baha, gözleg O(1).',
      '**Agaç we graf** — ierarhiýa we baglanyşyklar (meselem, DOM agajy).'
    ]),
    H('Doly barlag we açgöz algoritm'),
    P('**Doly barlag** (brute force) ähli mümkinçilikleri barlaýar — ýönekeý, ýöne haýal. **Açgöz** (greedy) algoritm her ädimde häzirki iň gowy saýlawy edýär — çalt, ýöne hemişe iň gowy netijäni bermeýär.'),
    CODE('// Açgöz: iň az teňňe bilen pul gaýtarmak (1, 5, 10, 25)\nfunction teňňeler(n) {\n  const r = [];\n  for (const t of [25, 10, 5, 1]) while (n >= t) { r.push(t); n -= t; }\n  return r;\n}\nteňňeler(41); // [25, 10, 5, 1]'),
    H('Meseläni çözmegiň ädimleri'),
    LIST([
      '1) Şerte düşüniň: girişler we çykyşlar näme?',
      '2) Kiçi mysallary el bilen çözüň.',
      '3) Aýratyn ýagdaýlary ýazyň: boş massiw, 0, bir element.',
      '4) Ilki ýönekeý çözgüt, soň kämilleşdirmek.',
      '5) Testler bilen barlaň.'
    ])
  ]);

  // ---------- 17. Gowy kod ýazmak endikleri ----------
  extend('ch17', [
    H('Üýtgemeýänlik (immutability)'),
    P('Bar bolan maglumaty üýtgetmegiň ýerine täze nusga döretmek ýalňyşlyklary azaldýar — maglumaty kimiň üýtgedendigini gözlemeli bolmaýar.'),
    CODE('// Üýtgedýär\nuser.yas = 21;\nsanaw.push(täze);\n\n// Täze nusga\nconst täzeUser = { ...user, yas: 21 };\nconst täzeSanaw = [...sanaw, täze];'),
    H('Ýalňyşlyklary dolandyrmak'),
    CODE('function bölmek(a, b) {\n  if (b === 0) throw new RangeError("Nola bölüp bolmaýar");\n  return a / b;\n}\n\ntry {\n  görkez(bölmek(x, y));\n} catch (e) {\n  ulanyja("Hasaplap bolmady: " + e.message);\n}'),
    H('Gurallar'),
    LIST([
      '**Prettier** — kody awtomatik formatlaýar (boşluklar, dyrnaklar).',
      '**ESLint** — mümkin bolan ýalňyşlyklary we erbet endikleri görkezýär.',
      '**Git** — kodyň wersiýalaryny saklaýar, üýtgeşmeleri yzyna gaýtaryp bolýar.',
      '**TypeScript** — JS-e görnüş barlagyny goşýar.'
    ]),
    H('Faýllary we kody tertiplemek'),
    LIST([
      'Bir faýl — bir wezipe (meselem, `store.js` — ýagdaý, `util.js` — kömekçiler).',
      'Baglanyşykly funksiýalary bile saklaň.',
      'Konstantalary we sazlamalary bir ýerde jemläň (bu programmada `App.RULES`).',
      'Global üýtgeýänlerden gaça duruň — modullar ýa-da bir umumy obýekt ulanyň.'
    ]),
    TIP('Kod ýazyp bolanyňyzdan soň ony bir gezek "başga adamyň gözi bilen" okaň: atlar düşnüklimi, gaýtalanma barmy?')
  ]);

  // ---------- 18. Ýygy goýberilýän ýalňyşlyklar ----------
  extend('ch18', [
    H('8. this-i ýitirmek'),
    CODE('const t = { at: "Aý", salam() { return this.at; } };\nconst f = t.salam;\nf();                     // undefined — this ýitdi\nconst g = t.salam.bind(t);\ng();                     // "Aý"'),
    H('9. Drob sanlary deňeşdirmek'),
    CODE('0.1 + 0.2 === 0.3;                          // false\nMath.abs(0.1 + 0.2 - 0.3) < Number.EPSILON; // true'),
    H('10. Massiwi for...in bilen aýlanmak'),
    CODE('for (const i in ["a", "b"]) console.log(typeof i); // "string" — indeksler setir!\nfor (const x of ["a", "b"]) console.log(x);        // dogrusy: bahalar'),
    H('11. NaN-y === bilen barlamak'),
    CODE('const x = Number("abc");\nx === NaN;          // false — hemişe!\nNumber.isNaN(x);    // true'),
    H('12. Nädogry JSON-y tutmazlyk'),
    CODE('JSON.parse("{at: \'Aý\'}");   // SyntaxError — açarlar goşa dyrnakda bolmaly\ntry {\n  JSON.parse(text);\n} catch {\n  console.log("Nädogry JSON");\n}'),
    H('13. Asyl maglumaty bilmän üýtgetmek'),
    CODE('function tertiple(a) { return a.sort(); } // asyl massiwi üýtgedýär!\nfunction tertiple2(a) { return [...a].sort(); } // göçürmesini tertipleýär'),
    H('14. Global üýtgeýänler'),
    CODE('function sana() {\n  count = 0; // let ýok — global üýtgeýän döreýär (berk tertipde ýalňyşlyk)\n}'),
    TIP('Ýalňyşlyk tapanyňyzda onuň sebäbini ýazyp goýuň — şol bir ýalňyşlygy ikinji gezek goýbermezsiňiz.')
  ]);
})();
