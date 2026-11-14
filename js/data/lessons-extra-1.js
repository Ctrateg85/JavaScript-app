// Goşmaça derejeler: 1–4-nji bölümler (her bölümde 4–10-njy derejeler)
// Sorag görnüşleri lessons.js faýlyndaky ýaly: C — saýlamaly, I — ýazmaly.

(function () {
  const C = (q, code, options, answer, explain) => ({ type: 'choice', q, code, options, answer, explain });
  const I = (q, code, answers, explain) => ({ type: 'input', q, code, answers, explain });
  const OUT = 'Bu kod konsola näme çykarar?';
  const TF = ['true', 'false'];
  const add = (unitId, levels) => window.LESSONS.find(u => u.id === unitId).levels.push(...levels);

  // ---------- 1. Giriş we üýtgeýänler ----------
  add('u1', [
    { id: 'u1l4', title: 'Üýtgeýänleriň atlary', questions: [
      C('Haýsy at JS-de dogry üýtgeýän ady?', '', ['$baha', '1baha', 'baha-1', 'my var'], 0, 'At harp, _ ýa-da $ bilen başlap bilýär.'),
      C('Haýsy ýazgy camelCase görnüşinde?', '', ['ulanyjyAdy', 'ulanyjy_ady', 'UlanyjyAdy', 'ulanyjy-ady'], 0, 'camelCase: ilkinji söz kiçi, beýlekiler uly harp bilen başlaýar.'),
      C('Haýsy söz üýtgeýän ady bolup BILMEZ?', '', ['class', 'klass', '_class', 'Class1'], 0, 'class — JS-iň açar sözi.'),
      C('Üýtgemeýän sazlamalar (konstantalar) köplenç nähili atlandyrylýar?', '', ['MAX_SIZE', 'maxsize', 'max-size', 'Max size'], 0, 'Konstantalar üçin UPPER_SNAKE_CASE ulanylýar.'),
      I(OUT, `let _x = 3, $y = 4;\nconsole.log(_x + $y);`, ['7'], '_ we $ atlarda ulanylyp bilner.')
    ] },
    { id: 'u1l5', title: 'Sanlar bilen hasaplamalar', questions: [
      I(OUT, `let a = 10, b = 4;\nconsole.log(a - b * 2);`, ['2'], 'Ilki köpeltmek: 4 * 2 = 8, soň 10 - 8 = 2.'),
      I(OUT, `console.log((2 + 3) * 4);`, ['20'], 'Ýaý içi ilki hasaplanýar.'),
      C(OUT, `let x = 5;\nlet y = x / 2;\nconsole.log(y);`, ['2', '2.5', '3', '2,5'], 1, 'Bölmek droblaýyn netije berýär.'),
      I(OUT, `const r = 3;\nconsole.log(r * r);`, ['9'], ''),
      C(OUT, `console.log(10 / 0);`, ['0', 'Infinity', 'NaN', 'Ýalňyşlyk'], 1, 'JS-de nola bölmek Infinity berýär.')
    ] },
    { id: 'u1l6', title: 'Setirleri birleşdirmek', questions: [
      I(OUT, `let at = "Aý";\nconsole.log("Salam, " + at);`, ['Salam, Aý'], ''),
      C(OUT, `console.log("1" + 2 + 3);`, ['6', '123', '15', '33'], 1, 'Setirden başlansa, galanlary hem setir hökmünde birleşdirilýär.'),
      C(OUT, `console.log(1 + 2 + "3");`, ['33', '123', '6', '15'], 0, 'Ilki 1 + 2 = 3, soň 3 + "3" = "33".'),
      I(OUT, 'const a = 2, b = 5;\nconsole.log(`${a} + ${b} = ${a + b}`);', ['2 + 5 = 7'], 'Şablon setirde ${} içindäki aňlatma hasaplanýar.'),
      C('Iki setiri birleşdirmegiň dogry usuly haýsy?', '', ['"a" + "b"', '"a" . "b"', '"a" & "b"', '"a" , "b"'], 0, '')
    ] },
    { id: 'u1l7', title: 'console usullary', questions: [
      C('Konsola ýalňyşlyk habaryny çykarmak üçin haýsy usul?', '', ['console.error()', 'console.red()', 'console.fail()', 'console.bad()'], 0, ''),
      C('Duýduryş habaryny çykarmak üçin haýsy usul?', '', ['console.warn()', 'console.alert()', 'console.notice()', 'console.yellow()'], 0, ''),
      C('Massiwi ýa-da obýekti tablisa görnüşinde çykarmak üçin?', '', ['console.table()', 'console.grid()', 'console.list()', 'console.view()'], 0, ''),
      C(OUT, `console.log("a", "b", 1);`, ['a b 1', 'ab1', '"a" "b" 1', 'a,b,1'], 0, 'Birnäçe argument boşluk bilen bölünip çykarylýar.'),
      C('Konsoly arassalamak üçin haýsy usul?', '', ['console.clear()', 'console.reset()', 'console.delete()', 'console.empty()'], 0, '')
    ] },
    { id: 'u1l8', title: 'Kod ýazmagyň düzgünleri', questions: [
      C('Köp setirli teswir nähili ýazylýar?', '', ['/* ... */', '// ... //', '<!-- ... -->', '## ... ##'], 0, ''),
      C('JS-de nokatly otur (;) hökmanymy?', '', ['Köplenç hökman däl, JS ony awtomatik goýýar, ýöne ýazmak maslahat berilýär', 'Hemişe hökman, bolmasa ýalňyşlyk', 'Hiç haçan ulanylmaýar', 'Diňe funksiýalarda'], 0, 'ASI (Automatic Semicolon Insertion) mehanizmi bar.'),
      C('Teswirler programma ýerine ýetirilende näme bolýar?', '', ['Olar äsgerilmeýär', 'Konsola çykarylýar', 'Ýalňyşlyk döredýär', 'Programmany haýalladýar'], 0, ''),
      C('"use strict" näme edýär?', '', ['Berk tertibi açýar: käbir nädogry amallar ýalňyşlyk döredýär', 'Kody çaltlandyrýar', 'Teswirleri pozýar', 'Üýtgeýänleri gizleýär'], 0, ''),
      C('Kod bloky haýsy belgiler bilen çäklenýär?', '', ['{ }', '( )', '[ ]', '< >'], 0, '')
    ] },
    { id: 'u1l9', title: 'Baha bermek operatorlary', questions: [
      I(OUT, `let a = 10;\na -= 3;\nconsole.log(a);`, ['7'], ''),
      I(OUT, `let a = 4;\na *= 5;\nconsole.log(a);`, ['20'], ''),
      I(OUT, `let a = 20;\na /= 4;\nconsole.log(a);`, ['5'], ''),
      I(OUT, `let a = 17;\na %= 5;\nconsole.log(a);`, ['2'], '17 = 5·3 + 2.'),
      C(OUT, `let s = "JS";\ns += 2;\nconsole.log(s);`, ['JS2', '4', 'NaN', 'Ýalňyşlyk'], 0, 'Setire san goşulsa birleşdirilýär.')
    ] },
    { id: 'u1l10', title: 'Gaýtalama: 1-nji bölüm', questions: [
      I(OUT, `let a = 3;\nlet b = a;\nb = b + 2;\nconsole.log(a + b);`, ['8'], 'a = 3, b = 5.'),
      C(OUT, `const x = 5;\nconsole.log(x * 2);`, ['10', 'TypeError', '52', 'undefined'], 0, 'const bahany okap bolýar, diňe täzeden baha berip bolmaýar.'),
      C('Haýsy yglan etmede üýtgeýäne derrew baha bermek hökman?', '', ['const', 'let', 'var', 'Hiç birinde'], 0, 'const x; — SyntaxError.'),
      C(OUT, `let a = "5";\nlet b = 5;\nconsole.log(a + b);`, ['10', '55', 'NaN', '"10"'], 1, ''),
      I(OUT, `let x = 2;\nx = x + x * x;\nconsole.log(x);`, ['6'], '2 + 2·2 = 6.')
    ] }
  ]);

  // ---------- 2. Maglumat görnüşleri ----------
  add('u2', [
    { id: 'u2l4', title: 'Sanlaryň aýratynlyklary', questions: [
      C(OUT, `console.log(0.1 + 0.2 === 0.3);`, TF, 1, 'Drob sanlar ikilik ulgamda takyk saklanmaýar: 0.1 + 0.2 = 0.30000000000000004.'),
      C(OUT, `console.log(typeof Infinity);`, ['number', 'infinity', 'undefined', 'object'], 0, ''),
      C(OUT, `console.log(-10 / 0);`, ['-Infinity', 'Infinity', 'NaN', '0'], 0, ''),
      I(OUT, `console.log((3.14159).toFixed(2));`, ['3.14'], 'toFixed(n) sany n onluk belgä çenli tegelekleýär.'),
      I(OUT, `console.log(Math.round(4.5));`, ['5'], '')
    ] },
    { id: 'u2l5', title: 'NaN', questions: [
      C(OUT, `console.log(typeof NaN);`, ['number', 'NaN', 'undefined', 'object'], 0, 'Geň görünse-de, NaN number görnüşine degişli.'),
      C(OUT, `console.log(NaN === NaN);`, TF, 1, 'NaN hiç zada, hatda özüne-de deň däl.'),
      C(OUT, `console.log(Number.isNaN(NaN));`, TF, 0, ''),
      C(OUT, `console.log(10 * "a");`, ['NaN', '10a', '0', 'Ýalňyşlyk'], 0, ''),
      C(OUT, `console.log(NaN + 5);`, ['NaN', '5', '0', 'undefined'], 0, 'NaN bilen islendik arifmetik amal NaN berýär.')
    ] },
    { id: 'u2l6', title: 'parseInt we parseFloat', questions: [
      I(OUT, `console.log(parseInt("42px"));`, ['42'], 'parseInt setiriň başyndaky sany okaýar.'),
      I(OUT, `console.log(parseFloat("3.75 kg"));`, ['3.75'], ''),
      C(OUT, `console.log(parseInt("abc"));`, ['NaN', '0', 'undefined', 'abc'], 0, ''),
      I(OUT, `console.log(parseInt("12.9"));`, ['12'], 'parseInt drob bölegini taşlaýar.'),
      C(OUT, `console.log(Number("42px"));`, ['42', 'NaN', '0', '"42"'], 1, 'Number() bütin setiriň san bolmagyny talap edýär.')
    ] },
    { id: 'u2l7', title: 'True we False', questions: [
      C('Haýsy baha False?', '', ['"" (boş setir)', '"false"', '[]', '{}'], 0, 'Boş setir False, beýlekiler True.'),
      C(OUT, `console.log(Boolean([]));`, TF, 0, 'Boş massiw hem True!'),
      C(OUT, `console.log(Boolean("0"));`, TF, 0, ''),
      C(OUT, `console.log(!!null);`, TF, 1, '!! bahany boolean-a öwürýär.'),
      C('JS-de näçe False baha bar? (false, 0, -0, 0n, "", null, undefined, NaN)', '', ['8', '3', '5', '2'], 0, '')
    ] },
    { id: 'u2l8', title: 'Setire öwürmek', questions: [
      C(OUT, `console.log(String(123) + 1);`, ['1231', '124', 'NaN', '123'], 0, ''),
      I(OUT, `console.log((255).toString(16));`, ['ff'], 'toString(16) sany 16-lyk ulgama öwürýär.'),
      I(OUT, `console.log((5).toString(2));`, ['101'], '5 ikilik ulgamda 101.'),
      C(OUT, `console.log(String(null));`, ['null', '""', 'undefined', 'Ýalňyşlyk'], 0, ''),
      C(OUT, `console.log(typeof (42 + ""));`, ['string', 'number', 'undefined', 'object'], 0, 'San + boş setir — sany setire öwürmegiň gysga usuly.')
    ] },
    { id: 'u2l9', title: 'BigInt we Symbol', questions: [
      C(OUT, `console.log(typeof 10n);`, ['bigint', 'number', 'string', 'object'], 0, 'n goşulmasy BigInt döredýär.'),
      I(OUT, `console.log(2n ** 3n);`, ['8n', '8'], 'console.log BigInt-i 8n görnüşinde çykarýar.'),
      C(OUT, `console.log(typeof Symbol("id"));`, ['symbol', 'string', 'object', 'id'], 0, ''),
      C(OUT, `console.log(Symbol("a") === Symbol("a"));`, TF, 1, 'Her Symbol gaýtalanmaýar.'),
      C('JS-de näçe primitiw görnüş bar?', '', ['7', '5', '6', '8'], 0, 'string, number, bigint, boolean, undefined, null, symbol.')
    ] },
    { id: 'u2l10', title: 'Gaýtalama: 2-nji bölüm', questions: [
      C(OUT, `console.log(typeof []);`, ['object', 'array', 'list', 'undefined'], 0, 'Massiwler hem obýekt. Barlamak üçin Array.isArray() ulanylýar.'),
      C(OUT, `console.log(typeof function () {});`, ['function', 'object', 'undefined', 'method'], 0, ''),
      C(OUT, `console.log(true + true);`, ['2', 'truetrue', 'true', 'NaN'], 0, 'true sana öwrülende 1.'),
      C(OUT, `console.log("3" * "4");`, ['12', '34', 'NaN', '"12"'], 0, ''),
      C(OUT, `console.log(null + 1);`, ['1', 'null1', 'NaN', '0'], 0, 'null sana öwrülende 0.')
    ] }
  ]);

  // ---------- 3. Operatorlar ----------
  add('u3', [
    { id: 'u3l4', title: 'Inkrement we dekrement', questions: [
      I(OUT, `let a = 5;\nlet b = a++;\nconsole.log(b);`, ['5'], 'Postfiks ++ öňki bahany gaýtarýar, soň artdyrýar.'),
      I(OUT, `let a = 5;\nlet b = ++a;\nconsole.log(b);`, ['6'], 'Prefiks ++ ilki artdyrýar.'),
      I(OUT, `let a = 3;\na--;\nconsole.log(a);`, ['2'], ''),
      C(OUT, `let i = 1;\nconsole.log(i++ + ++i);`, ['4', '3', '5', '2'], 0, 'i++ → 1 (i = 2), ++i → 3: 1 + 3 = 4.'),
      C(OUT, `let x = 10;\nlet y = x--;\nconsole.log(x, y);`, ['9 10', '10 9', '9 9', '10 10'], 0, '')
    ] },
    { id: 'u3l5', title: 'Operatorlaryň tertibi', questions: [
      I(OUT, `console.log(2 + 3 * 4);`, ['14'], ''),
      I(OUT, `console.log(2 ** 3 ** 2);`, ['512'], '** sagdan çepe hasaplanýar: 3 ** 2 = 9, 2 ** 9 = 512.'),
      C(OUT, `console.log(10 - 4 - 3);`, ['3', '9', '-3', '11'], 0, 'Çepden saga: (10 - 4) - 3.'),
      C(OUT, `console.log(true || false && false);`, TF, 0, '&& ileri tutulýar: false && false = false, soň true || false = true.'),
      I(OUT, `console.log(20 / 5 * 2);`, ['8'], 'Çepden saga: 20 / 5 = 4, 4 * 2 = 8.')
    ] },
    { id: 'u3l6', title: 'Gysga utgaşdyrma', questions: [
      C(OUT, `console.log("" || "boş däl");`, ['boş däl', '""', 'true', 'false'], 0, ''),
      C(OUT, `console.log(1 && 2 && 3);`, ['3', '1', 'true', '6'], 0, '&& ähli bahalar True bolsa soňkusyny gaýtarýar.'),
      C(OUT, `console.log(1 && 0 && 3);`, ['0', '1', '3', 'false'], 0, '&& ilkinji False bahany gaýtarýar.'),
      C(OUT, `console.log(undefined || null || 0);`, ['0', 'undefined', 'null', 'false'], 0, 'True baha ýok bolsa, || soňky bahany gaýtarýar.'),
      C(OUT, `let s = 0;\ntrue && (s = 5);\nconsole.log(s);`, ['5', '0', 'true', 'Ýalňyşlyk'], 0, 'Çep tarap True bolany üçin sag tarap ýerine ýetirilýär.')
    ] },
    { id: 'u3l7', title: '?? we ??= operatorlary', questions: [
      C(OUT, `console.log(0 ?? 10);`, ['0', '10', 'null', 'undefined'], 0, '?? diňe null we undefined üçin işleýär, 0 olaryň hiç biri däl.'),
      C(OUT, `console.log(0 || 10);`, ['10', '0', 'true', 'undefined'], 0, '|| islendik False bahany geçýär.'),
      C(OUT, `console.log(undefined ?? "a" ?? "b");`, ['a', 'b', 'undefined', 'null'], 0, ''),
      I(OUT, `let a = null;\na ??= 7;\nconsole.log(a);`, ['7'], '??= diňe null/undefined bolsa baha berýär.'),
      I(OUT, `let b = 3;\nb ||= 9;\nconsole.log(b);`, ['3'], 'b True, şonuň üçin üýtgemeýär.')
    ] },
    { id: 'u3l8', title: 'typeof we instanceof', questions: [
      C(OUT, `console.log([] instanceof Array);`, TF, 0, ''),
      C(OUT, `console.log(typeof typeof 1);`, ['string', 'number', 'typeof', 'undefined'], 0, 'typeof 1 → "number", typeof "number" → "string".'),
      C(OUT, `console.log(Array.isArray({}));`, TF, 1, ''),
      C(OUT, `console.log(typeof yokUytgeyan);`, ['undefined', 'ReferenceError', 'null', 'object'], 0, 'typeof yglan edilmedik üýtgeýän üçin ýalňyşlyk bermeýär.'),
      C(OUT, `console.log(new Date() instanceof Object);`, TF, 0, 'Ähli obýektler Object-den miras alýar.')
    ] },
    { id: 'u3l9', title: 'Unar operatorlar', questions: [
      C(OUT, `console.log(+"7" + 1);`, ['8', '71', 'NaN', '"8"'], 0, 'Unar + setiri sana öwürýär.'),
      I(OUT, `console.log(-"3");`, ['-3'], ''),
      C(OUT, `console.log(+true);`, ['1', 'true', 'NaN', '0'], 0, ''),
      C(OUT, `console.log(+"");`, ['0', 'NaN', '""', 'undefined'], 0, 'Boş setir sana öwrülende 0.'),
      C(OUT, `console.log(!"salam");`, TF, 1, 'Boş däl setir True, ! bilen false bolýar.')
    ] },
    { id: 'u3l10', title: 'Gaýtalama: 3-nji bölüm', questions: [
      I(OUT, `console.log(15 % 4 + 2 ** 2);`, ['7'], '3 + 4 = 7.'),
      C(OUT, `console.log("10" == 10 && "10" !== 10);`, TF, 0, ''),
      C(OUT, `console.log(null == 0);`, TF, 1, 'null == diňe undefined bilen deň.'),
      C(OUT, `let a = 5;\nconsole.log(a > 3 ? a * 2 : a);`, ['10', '5', 'true', '3'], 0, ''),
      C(OUT, `console.log([] == false);`, TF, 0, '[] → "" → 0, false → 0. Şonuň üçin === ulanmak gowy.')
    ] }
  ]);

  // ---------- 4. Şertler ----------
  add('u4', [
    { id: 'u4l4', title: 'Içki şertler', questions: [
      C(OUT, `let a = 7;\nif (a > 5) {\n  if (a > 10) console.log("A");\n  else console.log("B");\n} else {\n  console.log("C");\n}`, ['B', 'A', 'C', 'Hiç zat'], 0, ''),
      C(OUT, `let x = 0;\nif (x) {\n  console.log("bar");\n} else if (x === 0) {\n  console.log("nol");\n}`, ['nol', 'bar', 'Hiç zat', 'undefined'], 0, ''),
      I(OUT, `let b = 85;\nlet g;\nif (b >= 90) g = "A";\nelse if (b >= 80) g = "B";\nelse g = "C";\nconsole.log(g);`, ['B'], ''),
      C(OUT, `let n = -3;\nif (n > 0) console.log("+");\nelse if (n < 0) console.log("-");\nelse console.log("0");`, ['-', '+', '0', 'Hiç zat'], 0, ''),
      C('Haýsy ýagdaýda else bloky ýerine ýetirilýär?', '', ['if-iň şerti False bolanda', 'Hemişe', 'if-iň şerti True bolanda', 'Hiç haçan'], 0, '')
    ] },
    { id: 'u4l5', title: 'Logiki şertler', questions: [
      C(OUT, `let y = 20;\nif (y >= 18 && y < 60) console.log("işçi ýaş");\nelse console.log("başga");`, ['işçi ýaş', 'başga', 'Hiç zat', 'Ýalňyşlyk'], 0, ''),
      C(OUT, `let gun = "Şenbe";\nif (gun === "Şenbe" || gun === "Ýekşenbe") console.log("dynç");\nelse console.log("iş");`, ['dynç', 'iş', 'Şenbe', 'Hiç zat'], 0, ''),
      C(OUT, `let a = 5;\nif (!(a > 10)) console.log("kiçi");\nelse console.log("uly");`, ['kiçi', 'uly', 'true', 'Hiç zat'], 0, ''),
      C('n sanyň 1 bilen 10 aralygyndadygyny (ikisi hem girýär) haýsy şert barlaýar?', '', ['n >= 1 && n <= 10', '1 <= n <= 10', 'n >= 1 || n <= 10', 'n > 1 && n < 10'], 0, '1 <= n <= 10 JS-de nädogry işleýär.'),
      I(OUT, `let p = true, q = false;\nif (p && !q) console.log("ok");\nelse console.log("no");`, ['ok'], '')
    ] },
    { id: 'u4l6', title: 'switch: çylşyrymly ýagdaýlar', questions: [
      C(OUT, `let m = 4;\nswitch (m) {\n  case 3:\n  case 4:\n  case 5: console.log("Ýaz"); break;\n  default: console.log("Başga");\n}`, ['Ýaz', 'Başga', 'Hiç zat', 'Ýaz Başga'], 0, 'Birnäçe case bir bloky paýlaşyp bilýär.'),
      C(OUT, `let x = "1";\nswitch (x) {\n  case 1: console.log("san"); break;\n  default: console.log("setir");\n}`, ['setir', 'san', 'Hiç zat', 'Ýalňyşlyk'], 0, 'switch === ulanýar: "1" !== 1.'),
      C(OUT, `let b = 75;\nswitch (true) {\n  case b >= 90: console.log("A"); break;\n  case b >= 70: console.log("B"); break;\n  default: console.log("C");\n}`, ['B', 'A', 'C', 'Hiç zat'], 0, 'switch (true) — şertleri case-de ýazmagyň usuly.'),
      C(OUT, `switch (3) {\n  default: console.log("D");\n  case 1: console.log("1");\n}`, ['D 1', 'D', '1', 'Hiç zat'], 0, 'default-da break ýok, şonuň üçin indiki case-e geçýär.'),
      C('switch-de default bölümi hökmanymy?', '', ['Ýok, islege görä', 'Hawa, hemişe', 'Diňe sanlar bilen', 'Diňe setirler bilen'], 0, '')
    ] },
    { id: 'u4l7', title: 'Şertlerde True barlag', questions: [
      C(OUT, `let ady = "";\nif (ady) console.log("Salam, " + ady);\nelse console.log("Ady ýok");`, ['Ady ýok', 'Salam, ', 'Hiç zat', 'Ýalňyşlyk'], 0, ''),
      C(OUT, `let a = [];\nif (a) console.log("bar");\nelse console.log("ýok");`, ['bar', 'ýok', 'Hiç zat', 'Ýalňyşlyk'], 0, 'Boş massiw True.'),
      C(OUT, `let a = [];\nif (a.length) console.log("bar");\nelse console.log("boş");`, ['boş', 'bar', 'Hiç zat', 'Ýalňyşlyk'], 0, 'a.length = 0 — False.'),
      C(OUT, `let n = NaN;\nconsole.log(n ? "A" : "B");`, ['B', 'A', 'NaN', 'Ýalňyşlyk'], 0, 'NaN — False.'),
      C(OUT, `let o = {};\nconsole.log(o.x ? "bar" : "ýok");`, ['ýok', 'bar', 'undefined', 'Ýalňyşlyk'], 0, '')
    ] },
    { id: 'u4l8', title: 'Gysga ýazgylar', questions: [
      C(OUT, `let ok = true;\nok && console.log("Işledi");`, ['Işledi', 'true', 'Hiç zat', 'Ýalňyşlyk'], 0, '&& gysga if hökmünde ulanylyp bilner.'),
      I(OUT, `let a;\nconst b = a ?? "adaty";\nconsole.log(b);`, ['adaty'], ''),
      C(OUT, `const yas = 16;\nconst rugsat = yas >= 18;\nconsole.log(rugsat);`, TF, 1, 'Deňeşdirmäniň netijesi göni boolean.'),
      I(OUT, `const n = 9;\nconsole.log(n % 2 ? "täk" : "jübüt");`, ['täk'], '9 % 2 = 1 — True.'),
      C('Haýsy ýazgy if (x) { y = 1; } else { y = 2; } bilen deň?', '', ['y = x ? 1 : 2;', 'y = x ?? 1 : 2;', 'y = x : 1 ? 2;', 'y = if x 1 else 2;'], 0, '')
    ] },
    { id: 'u4l9', title: 'Amaly meseleler', questions: [
      C('Ýylyň kabise ýyldygyny haýsy şert dogry barlaýar?', '', ['(y % 4 === 0 && y % 100 !== 0) || y % 400 === 0', 'y % 4 === 0', 'y % 100 === 0', 'y % 400 !== 0'], 0, ''),
      I(OUT, `const a = 8, b = 13;\nconst uly = a > b ? a : b;\nconsole.log(uly);`, ['13'], ''),
      C(OUT, `let t = 25;\nlet h;\nif (t < 0) h = "aýaz";\nelse if (t < 20) h = "salkyn";\nelse h = "ýyly";\nconsole.log(h);`, ['ýyly', 'salkyn', 'aýaz', 'undefined'], 0, ''),
      I(OUT, `const n = -7;\nconst abs = n < 0 ? -n : n;\nconsole.log(abs);`, ['7'], 'Sanyň moduly.'),
      C(OUT, `const s = 0;\nconsole.log(s > 0 ? "+" : s < 0 ? "-" : "0");`, ['0', '+', '-', 'Ýalňyşlyk'], 0, '')
    ] },
    { id: 'u4l10', title: 'Gaýtalama: 4-nji bölüm', questions: [
      C(OUT, `let x = 5;\nif (x = 10) console.log(x);`, ['10', '5', 'Hiç zat', 'Ýalňyşlyk'], 0, '= baha berýär (deňeşdirmeýär), netije 10 — True. Bu ýygy duşýan ýalňyşlyk!'),
      C(OUT, `const v = "5";\nif (v === 5) console.log("A");\nelse if (v == 5) console.log("B");`, ['B', 'A', 'Hiç zat', 'A B'], 0, ''),
      C(OUT, `let a = 0;\nswitch (a) {\n  case false: console.log("F"); break;\n  case 0: console.log("N"); break;\n}`, ['N', 'F', 'Hiç zat', 'F N'], 0, '0 !== false, şonuň üçin case 0 işleýär.'),
      I(OUT, `const n = 15;\nlet r = "";\nif (n % 3 === 0) r += "Fizz";\nif (n % 5 === 0) r += "Buzz";\nconsole.log(r);`, ['FizzBuzz'], ''),
      C(OUT, `const a = null;\nconsole.log(a ? "A" : a === null ? "N" : "U");`, ['N', 'A', 'U', 'null'], 0, '')
    ] }
  ]);
})();
