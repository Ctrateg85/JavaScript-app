// Sapaklar: bölümler -> derejeler -> soraglar
//
// Sorag görnüşleri:
//   choice — birnäçe jogapdan birini saýlamak (answer — dogry jogabyň indeksi)
//   input  — jogaby klawiatura bilen ýazmak (answers — kabul edilýän jogaplar)
// Jogap wariantlary ekranda garyşdyrylyp görkezilýär.

(function () {
  // Gysga ýazmak üçin kömekçiler
  const C = (q, code, options, answer, explain) => ({ type: 'choice', q, code, options, answer, explain });
  const I = (q, code, answers, explain) => ({ type: 'input', q, code, answers, explain });
  const OUT = 'Bu kod konsola näme çykarar?';
  const TF = ['true', 'false'];

  window.LESSONS = [
    {
      id: 'u1', title: 'Giriş we üýtgeýänler', icon: '📦', chapter: 'ch1',
      desc: 'JavaScript bilen tanyşlyk, console.log, let, const',
      levels: [
        { id: 'u1l1', title: 'JavaScript bilen tanyşlyk', questions: [
          C('JavaScript esasan nirede işleýär?', '', ['Diňe serwerde', 'Brauzerde we serwerde (Node.js)', 'Diňe Windows-da', 'Diňe mobil telefonlarda'], 1, 'JavaScript brauzerlerde, Node.js arkaly bolsa serwerde hem işleýär.'),
          C('Konsola maglumat çykarmak üçin haýsy buýruk ulanylýar?', '', ['print()', 'console.log()', 'echo', 'System.out.println()'], 1, 'console.log() konsola maglumat çykarýar.'),
          C(OUT, `console.log("Salam");`, ['Salam', '"Salam"', 'console.log', 'Ýalňyşlyk'], 0, 'Setir dyrnaksyz çykarylýar: Salam'),
          C('Bir setirli teswir nähili ýazylýar?', '', ['<!-- teswir -->', '# teswir', '// teswir', '** teswir'], 2, 'JS-de bir setirli teswir // bilen başlaýar, köp setirli bolsa /* ... */.'),
          I(OUT, `console.log(2 + 3);`, ['5'], 'Sanlar goşulýar: 2 + 3 = 5.')
        ] },
        { id: 'u1l2', title: 'let we const', questions: [
          C('Bahasy üýtgemeýän üýtgeýän näme bilen yglan edilýär?', '', ['let', 'var', 'const', 'static'], 2, 'const bilen yglan edilen üýtgeýäne täze baha berip bolmaýar.'),
          C(OUT, `let a = 5;\na = 10;\nconsole.log(a);`, ['5', '10', 'Ýalňyşlyk', 'undefined'], 1, 'let üýtgeýäniň bahasyny üýtgedip bolýar.'),
          C('Bu kod ýerine ýetirilende näme bolar?', `const b = 3;\nb = 4;`, ['b 4 bolar', 'TypeError ýalňyşlygy', 'b 3 galar, ýalňyşlyksyz', 'undefined'], 1, 'const üýtgeýäne täzeden baha bermek TypeError döredýär.'),
          C('Haýsy üýtgeýän ady dogry?', '', ['2name', 'my-name', 'myName', 'let'], 2, 'At san bilen başlap bilmeýär, "-" belgisini saklap bilmeýär we açar söz bolup bilmeýär.'),
          I(OUT, `let x = 7;\nlet y = x;\nx = 1;\nconsole.log(y);`, ['7'], 'y üýtgeýjä x üýtgeýjiniň şol wagtky bahasy (7) göçürildi. x üýtgeýjiniň soň üýtgemegi y üýtgeýjä täsir etmeýär.')
        ] },
        { id: 'u1l3', title: 'Üýtgeýänler bilen amallar', questions: [
          C('Häzirki zaman JS-de haýsy açar sözi ulanmak maslahat berilmeýär?', '', ['let', 'const', 'var', 'Hemmesi deň'], 2, 'var köne açar söz; onuň görnüş meýdany (scope) bilen baglanyşykly kynçylyklary bar.'),
          C(OUT, `let n;\nconsole.log(n);`, ['0', 'null', 'undefined', 'Ýalňyşlyk'], 2, 'Baha berilmedik üýtgeýäniň bahasy undefined.'),
          C(OUT, `let s = "JS";\ns = s + "!";\nconsole.log(s);`, ['JS', 'JS!', '!JS', 'Ýalňyşlyk'], 1, 'Setirler + bilen birleşdirilýär.'),
          C('JavaScript uly we kiçi harplary tapawutlandyrýarmy? (myVar we myvar)', '', ['Hawa, olar dürli üýtgeýänler', 'Ýok, olar birmeňzeş'], 0, 'JS harplaryň ululygyna duýgur (case-sensitive).'),
          I(OUT, `let a = 2;\na = a * 3;\nconsole.log(a);`, ['6'], 'a = 2 * 3 = 6.')
        ] }
      ]
    },
    {
      id: 'u2', title: 'Maglumat görnüşleri', icon: '🔤', chapter: 'ch2',
      desc: 'number, string, boolean, null, undefined, typeof',
      levels: [
        { id: 'u2l1', title: 'Esasy görnüşler', questions: [
          C(OUT, `console.log(typeof 42);`, ['number', 'string', 'integer', 'float'], 0, 'JS-de ähli sanlar number görnüşinde.'),
          C(OUT, `console.log(typeof "42");`, ['number', 'string', 'text', 'char'], 1, 'Dyrnakdaky baha setir (string).'),
          C('Haýsy biri primitiw görnüş däl?', '', ['string', 'boolean', 'object', 'undefined'], 2, 'object — salgylanma (reference) görnüşi.'),
          I(OUT, `console.log(typeof true);`, ['boolean'], 'true we false — boolean bahalary.'),
          C('Boolean görnüşiniň näçe bahasy bar?', '', ['1', '2', '3', 'Çäksiz'], 1, 'Diňe iki: true we false.')
        ] },
        { id: 'u2l2', title: 'null we undefined', questions: [
          C(OUT, `console.log(typeof undefined);`, ['null', 'undefined', 'object', 'string'], 1, 'typeof undefined → "undefined".'),
          C(OUT, `console.log(typeof null);`, ['null', 'undefined', 'object', 'number'], 2, 'Bu JS-iň taryhy ýalňyşlygy: typeof null → "object".'),
          C('null nämäni aňladýar?', '', ['Bahanyň bilkastlaýyn boşdugyny', 'Üýtgeýäniň yglan edilmändigini', 'Nol sanyny', 'Ýalňyşlygy'], 0, 'null — programmistiň bilkastlaýyn goýan "boş" bahasy.'),
          C(OUT, `console.log(null == undefined);`, TF, 0, '== bilen null we undefined deň hasaplanýar.'),
          I(OUT, `console.log(null === undefined);`, ['false'], '=== görnüşi hem deňeşdirýär, olaryň görnüşleri dürli.')
        ] },
        { id: 'u2l3', title: 'Görnüşleri öwürmek', questions: [
          C(OUT, `console.log("5" + 3);`, ['8', '53', 'Ýalňyşlyk', 'NaN'], 1, '+ operatory setir bilen işlände birleşdirýär: "53".'),
          C(OUT, `console.log("5" - 3);`, ['2', '53', 'NaN', '"2"'], 0, '- operatory setiri sana öwürýär: 5 - 3 = 2.'),
          I(OUT, `console.log(Number("12"));`, ['12'], 'Number() setiri sana öwürýär.'),
          C(OUT, `console.log(Number("salam"));`, ['0', 'undefined', 'NaN', 'null'], 2, 'Sana öwrülip bilmeýän setir NaN (Not a Number) berýär.'),
          C(OUT, `console.log(Boolean(0));`, TF, 1, '0 — "False" baha, şonuň üçin false.')
        ] }
      ]
    },
    {
      id: 'u3', title: 'Operatorlar', icon: '➗', chapter: 'ch3',
      desc: 'Arifmetik, deňeşdirme we logiki operatorlar',
      levels: [
        { id: 'u3l1', title: 'Arifmetik operatorlar', questions: [
          C(OUT, `console.log(10 % 3);`, ['3', '1', '0', '3.33'], 1, '% — bölmekden galyndy: 10 = 3·3 + 1.'),
          I(OUT, `console.log(2 ** 3);`, ['8'], '** — derejä götermek: 2³ = 8.'),
          C(OUT, `let i = 5;\ni++;\nconsole.log(i);`, ['5', '6', '4', 'Ýalňyşlyk'], 1, '++ bahany 1 artdyrýar.'),
          I(OUT, `let x = 10;\nx += 5;\nconsole.log(x);`, ['15'], 'x += 5 — bu x = x + 5 diýmek.'),
          C(OUT, `console.log(7 / 2);`, ['3', '3.5', '4', '3,5'], 1, 'JS-de bölmek droblaýyn netije berýär: 3.5.')
        ] },
        { id: 'u3l2', title: 'Deňeşdirme', questions: [
          C(OUT, `console.log(5 == "5");`, TF, 0, '== görnüşleri öwrüp deňeşdirýär.'),
          C(OUT, `console.log(5 === "5");`, TF, 1, '=== görnüşi hem deňeşdirýär: number ≠ string.'),
          C('!== operatory näme barlaýar?', '', ['Baha ýa-da görnüş boýunça deň däldigini', 'Diňe bahanyň deň däldigini', 'Bahanyň uludygyny', 'Bu ýalňyşlyk operatory'], 0, '!== — berk deň däl.'),
          C(OUT, `console.log(3 > 2 > 1);`, ['true', 'false', 'Ýalňyşlyk'], 1, '3 > 2 → true, soň true > 1 → 1 > 1 → false.'),
          I(OUT, `console.log("b" > "a");`, ['true'], 'Setirler harp tertibi boýunça deňeşdirilýär.')
        ] },
        { id: 'u3l3', title: 'Logiki operatorlar', questions: [
          C(OUT, `console.log(true && false);`, TF, 1, '&& (WE) — ikisi hem true bolsa true.'),
          C(OUT, `console.log(true || false);`, TF, 0, '|| (ÝA-DA) — biri true bolsa true.'),
          I(OUT, `console.log(!true);`, ['false'], '! — inkär: !true → false.'),
          C(OUT, `console.log(0 || "default");`, ['0', 'default', 'true', 'undefined'], 1, '|| ilkinji "True" bahany gaýtarýar.'),
          C(OUT, `console.log(null ?? "boş");`, ['null', 'boş', 'undefined', 'false'], 1, '?? çep tarap null ýa-da undefined bolsa sag tarapy gaýtarýar.')
        ] }
      ]
    },
    {
      id: 'u4', title: 'Şertler', icon: '🔀', chapter: 'ch4',
      desc: 'if / else, switch, üçlük operator',
      levels: [
        { id: 'u4l1', title: 'if / else', questions: [
          C(OUT, `let a = 10;\nif (a > 5) {\n  console.log("Uly");\n} else {\n  console.log("Kiçi");\n}`, ['Uly', 'Kiçi', 'Hiç zat', 'Ýalňyşlyk'], 0, '10 > 5 dogry, şonuň üçin if bloky işleýär.'),
          C('else if näme üçin gerek?', '', ['Birnäçe şerti yzygiderli barlamak üçin', 'Sikl döretmek üçin', 'Funksiýa yglan etmek üçin', 'Ýalňyşlygy tutmak üçin'], 0, 'else if goşmaça şert barlaýar.'),
          I(OUT, `let t = 0;\nif (t) {\n  console.log("A");\n} else {\n  console.log("B");\n}`, ['B'], '0 — False baha, şonuň üçin else işleýär.'),
          C('Haýsy baha "False" DÄL?', '', ['0', '"" (boş setir)', '"0"', 'null'], 2, '"0" — boş däl setir, şonuň üçin True.'),
          C(OUT, `let x = 15;\nif (x > 20) console.log("A");\nelse if (x > 10) console.log("B");\nelse console.log("C");`, ['A', 'B', 'C', 'B we C'], 1, 'Ilkinji dogry şert x > 10.')
        ] },
        { id: 'u4l2', title: 'switch', questions: [
          C(OUT, `let d = 2;\nswitch (d) {\n  case 1: console.log("Duşenbe"); break;\n  case 2: console.log("Sişenbe"); break;\n  default: console.log("Başga");\n}`, ['Duşenbe', 'Sişenbe', 'Başga', 'Hiç zat'], 1, 'd === 2, şonuň üçin case 2 işleýär.'),
          C('switch-de break ýazylmasa näme bolýar?', '', ['Indiki case-ler hem ýerine ýetirilýär', 'Ýalňyşlyk çykýar', 'Programma durýar', 'Hiç zat üýtgemeýär'], 0, 'break bolmasa ýerine ýetiriş indiki case-e "akyp" geçýär (fall-through).'),
          C(OUT, `let k = 1;\nswitch (k) {\n  case 1: console.log("A");\n  case 2: console.log("B"); break;\n  case 3: console.log("C");\n}`, ['Diňe A', 'A we B', 'A, B we C', 'Diňe B'], 1, 'case 1-de break ýok, şonuň üçin case 2 hem işleýär.'),
          C('switch haýsy deňeşdirmäni ulanýar?', '', ['==', '===', '=', '>='], 1, 'switch berk deňeşdirme (===) ulanýar.'),
          C('default bölümi haçan ýerine ýetirilýär?', '', ['Hiç bir case gabat gelmese', 'Hemişe birinji', 'Diňe break bolsa', 'Hiç haçan'], 0, 'default — beýleki ähli ýagdaýlar üçin.')
        ] },
        { id: 'u4l3', title: 'Üçlük operator', questions: [
          I(OUT, `let age = 20;\nlet r = age >= 18 ? "Uly" : "Kiçi";\nconsole.log(r);`, ['Uly'], '20 >= 18 dogry, şonuň üçin "Uly".'),
          C('Üçlük (ternary) operatoryň sintaksisi haýsy?', '', ['şert ? a : b', 'şert : a ? b', 'if şert then a else b', 'şert ?? a : b'], 0, 'şert ? dogry_bolsa : ýalňyş_bolsa'),
          C(OUT, `let n = 7;\nconsole.log(n % 2 === 0 ? "jübüt" : "täk");`, ['jübüt', 'täk', 'true', 'Ýalňyşlyk'], 1, '7 % 2 = 1, şonuň üçin "täk".'),
          I(OUT, `let s = "";\nconsole.log(s ? "dolý" : "boş");`, ['boş'], 'Boş setir False.'),
          C(OUT, `let p = 50;\nlet b = p > 90 ? "A" : p > 60 ? "B" : "C";\nconsole.log(b);`, ['A', 'B', 'C', 'Ýalňyşlyk'], 2, '50 > 90 we 50 > 60 ýalňyş, şonuň üçin "C".')
        ] }
      ]
    },
    {
      id: 'u5', title: 'Sikller', icon: '🔁', chapter: 'ch5',
      desc: 'for, while, do...while, break, continue',
      levels: [
        { id: 'u5l1', title: 'for sikli', questions: [
          C(OUT, `for (let i = 0; i < 3; i++) {\n  console.log(i);\n}`, ['0 1 2', '1 2 3', '0 1 2 3', '1 2'], 0, 'i 0-dan başlaýar we 3-den kiçi bolýança dowam edýär.'),
          I(OUT, `let s = 0;\nfor (let i = 1; i <= 4; i++) {\n  s += i;\n}\nconsole.log(s);`, ['10'], '1 + 2 + 3 + 4 = 10.'),
          C('for siklinde ýaýyň içinde näçe bölek bar?', '', ['1', '2', '3', '4'], 2, 'Başlangyç; şert; ädim.'),
          C('Bu sikl näçe gezek console.log çagyrar?', `for (let i = 10; i > 0; i -= 3) console.log(i);`, ['3', '4', '10', 'Çäksiz'], 1, 'i: 10, 7, 4, 1 — dört gezek.'),
          I(OUT, `let c = 0;\nfor (let i = 0; i < 5; i++) c++;\nconsole.log(c);`, ['5'], 'Sikl 5 gezek işleýär.')
        ] },
        { id: 'u5l2', title: 'while we do...while', questions: [
          I(OUT, `let i = 0;\nwhile (i < 3) {\n  i++;\n}\nconsole.log(i);`, ['3'], 'i 3 bolanda şert ýalňyş bolýar.'),
          C('do...while-yň while-dan tapawudy näme?', '', ['Iň bolmanda bir gezek ýerine ýetirilýär', 'Has çalt işleýär', 'Şert gerek däl', 'Tapawudy ýok'], 0, 'do...while-da şert bedenden soň barlanýar.'),
          C(OUT, `let i = 5;\nwhile (i < 3) {\n  console.log(i);\n  i++;\n}`, ['5', 'Hiç zat', '3 4', 'Çäksiz sikl'], 1, 'Şert ilkibaşdan ýalňyş, sikl işlemeýär.'),
          C('Şerti hemişe true bolan sikle näme diýilýär?', '', ['Çäksiz sikl', 'Içki sikl', 'Rekursiýa', 'Massiw'], 0, 'Çäksiz sikl programmany "doňdurýar".'),
          C(OUT, `let i = 0;\ndo {\n  i += 2;\n} while (i < 5);\nconsole.log(i);`, ['4', '5', '6', '2'], 2, 'i: 2, 4, 6 — 6 < 5 ýalňyş.')
        ] },
        { id: 'u5l3', title: 'break, continue, for...of', questions: [
          C(OUT, `for (let i = 0; i < 10; i++) {\n  if (i === 3) break;\n  console.log(i);\n}`, ['0 1 2', '0 1 2 3', '3', '0-dan 9-a çenli'], 0, 'break sikli doly togtadýar.'),
          C(OUT, `for (let i = 0; i < 5; i++) {\n  if (i === 2) continue;\n  console.log(i);\n}`, ['0 1 3 4', '0 1', '2', '0 1 2 3 4'], 0, 'continue diňe i === 2 gaýtalamasyny geçýär.'),
          C('continue näme edýär?', '', ['Häzirki gaýtalamany geçip, indikisine geçýär', 'Sikli doly togtadýar', 'Programmany togtadýar', 'Funksiýadan çykýar'], 0, ''),
          I(OUT, `let s = 0;\nfor (let i = 1; i <= 5; i++) {\n  if (i % 2 === 0) continue;\n  s += i;\n}\nconsole.log(s);`, ['9'], 'Diňe täk sanlar: 1 + 3 + 5 = 9.'),
          C(OUT, `const a = [1, 2, 3];\nfor (const x of a) console.log(x * 2);`, ['1 2 3', '2 4 6', '0 1 2', 'Ýalňyşlyk'], 1, 'for...of massiwiň bahalaryny aýlanýar.')
        ] }
      ]
    },
    {
      id: 'u6', title: 'Funksiýalar', icon: '🧩', chapter: 'ch6',
      desc: 'Funksiýa yglan etmek, ok-funksiýalar, scope, closure',
      levels: [
        { id: 'u6l1', title: 'Funksiýa esaslary', questions: [
          I(OUT, `function salam(at) {\n  return "Salam, " + at;\n}\nconsole.log(salam("Aý"));`, ['Salam, Aý'], 'Funksiýa "Salam, " + "Aý" gaýtarýar.'),
          C('return ýazylmadyk funksiýa näme gaýtarýar?', '', ['0', 'null', 'undefined', 'Ýalňyşlyk'], 2, 'Gaýtarylýan baha bolmasa — undefined.'),
          I(OUT, `function gos(a, b) {\n  return a + b;\n}\nconsole.log(gos(2, 3));`, ['5'], ''),
          C('Funksiýa yglan edilende ýaýyň içindäki atlara näme diýilýär?', '', ['Parametrler', 'Argumentler', 'Usullar', 'Obýektler'], 0, 'Yglan edilende — parametrler, çagyrylanda berilýän bahalar — argumentler.'),
          C(OUT, `function f(a, b = 10) {\n  return a + b;\n}\nconsole.log(f(5));`, ['5', '15', 'NaN', 'undefined'], 1, 'b berilmedi, şonuň üçin adaty bahasy 10 ulanylýar.')
        ] },
        { id: 'u6l2', title: 'Ok-funksiýalar', questions: [
          I(OUT, `const kw = x => x * x;\nconsole.log(kw(4));`, ['16'], '4 * 4 = 16.'),
          C('Haýsy ýazgy dogry ok-funksiýa (arrow function)?', '', ['const f = (a, b) => a + b;', 'const f = (a, b) -> a + b;', 'function => (a, b) a + b;', 'const f => (a, b) { a + b };'], 0, ''),
          C(OUT, `const f = () => { 5 };\nconsole.log(f());`, ['5', 'undefined', 'null', 'Ýalňyşlyk'], 1, 'Figuraly ýaýly bedende return ýazylmasa, hiç zat gaýtarylmaýar.'),
          I(OUT, `const ob = () => ({ a: 1 });\nconsole.log(ob().a);`, ['1'], 'Obýekti gaýtarmak üçin ony ýaýa salmaly.'),
          C(OUT, `const add = (a) => (b) => a + b;\nconsole.log(add(2)(3));`, ['5', '23', 'Ýalňyşlyk', 'undefined'], 0, 'add(2) täze funksiýa gaýtarýar, ol 3 bilen çagyrylýar.')
        ] },
        { id: 'u6l3', title: 'Scope we closure', questions: [
          I(OUT, `let x = 1;\nfunction f() {\n  let x = 2;\n  return x;\n}\nf();\nconsole.log(x);`, ['1'], 'Funksiýanyň içindäki x — başga üýtgeýän.'),
          C(OUT, `{\n  let a = 5;\n}\nconsole.log(a);`, ['5', 'undefined', 'ReferenceError', 'null'], 2, 'let blok görnüş meýdanyna eýe, blokdan daşarda elýeterli däl.'),
          C('Closure (ýapyk funksiýa) näme?', '', ['Daşky funksiýanyň üýtgeýänlerini ýatda saklaýan içki funksiýa', 'Ady bolmadyk funksiýa', 'Özüni çagyrýan funksiýa', 'Ýalňyşlyk çykarýan funksiýa'], 0, ''),
          I(OUT, `function counter() {\n  let c = 0;\n  return () => ++c;\n}\nconst inc = counter();\ninc();\nconsole.log(inc());`, ['2'], 'c üýtgeýäni çagyryşlaryň arasynda saklanýar.'),
          C(OUT, `function fact(n) {\n  return n <= 1 ? 1 : n * fact(n - 1);\n}\nconsole.log(fact(4));`, ['4', '10', '24', 'Ýalňyşlyk'], 2, 'Rekursiýa: 4 · 3 · 2 · 1 = 24.')
        ] }
      ]
    },
    {
      id: 'u7', title: 'Massiwler', icon: '📋', chapter: 'ch7',
      desc: 'Massiw döretmek, push/pop, map, filter, reduce',
      levels: [
        { id: 'u7l1', title: 'Massiw esaslary', questions: [
          I(OUT, `const a = [10, 20, 30];\nconsole.log(a[1]);`, ['20'], 'Indeksler 0-dan başlaýar.'),
          I(OUT, `const a = [1, 2, 3];\nconsole.log(a.length);`, ['3'], ''),
          C('Massiwiň ahyryna element goşmak üçin haýsy usul?', '', ['push()', 'pop()', 'shift()', 'unshift()'], 0, 'push — ahyryna goşýar, unshift — başyna.'),
          C(OUT, `const a = [1, 2, 3];\na.pop();\nconsole.log(a);`, ['[1, 2]', '[2, 3]', '[1, 2, 3]', '3'], 0, 'pop soňky elementi aýyrýar.'),
          C(OUT, `const a = ["a", "b"];\nconsole.log(a[5]);`, ['b', 'null', 'undefined', 'Ýalňyşlyk'], 2, 'Ýok indeks undefined berýär.')
        ] },
        { id: 'u7l2', title: 'map, filter, reduce', questions: [
          C(OUT, `const r = [1, 2, 3].map(x => x * 10);\nconsole.log(r);`, ['[10, 20, 30]', '[1, 2, 3]', '60', '[11, 12, 13]'], 0, 'map her elementi özgerdýär.'),
          C(OUT, `const r = [1, 2, 3, 4].filter(x => x > 2);\nconsole.log(r);`, ['[3, 4]', '[1, 2]', '[true, true]', '2'], 0, 'filter şerte laýyk elementleri saýlaýar.'),
          I(OUT, `const s = [1, 2, 3].reduce((acc, x) => acc + x, 0);\nconsole.log(s);`, ['6'], 'reduce massiwi bir baha jemleýär.'),
          C('map() usuly näme gaýtarýar?', '', ['Täze massiw', 'Üýtgedilen asyl massiwi', 'Bir san', 'undefined'], 0, 'map asyl massiwi üýtgetmeýär.'),
          I(OUT, `console.log([5, 8, 12].find(x => x > 6));`, ['8'], 'find şerte laýyk ILKINJI elementi gaýtarýar.')
        ] },
        { id: 'u7l3', title: 'Beýleki usullar', questions: [
          I(OUT, `console.log([1, 2, 3].includes(2));`, ['true'], ''),
          I(OUT, `console.log(["a", "b", "c"].indexOf("c"));`, ['2'], ''),
          C(OUT, `console.log([1, 2, 3].join("-"));`, ['1-2-3', '[1-2-3]', '123', '1,2,3'], 0, 'join elementleri setire birleşdirýär.'),
          C(OUT, `const a = [3, 1, 2];\na.sort();\nconsole.log(a);`, ['[1, 2, 3]', '[3, 2, 1]', '[3, 1, 2]', 'Ýalňyşlyk'], 0, 'sort asyl massiwi tertipleýär.'),
          C(OUT, `const a = [1, 2, 3, 4];\nconsole.log(a.slice(1, 3));`, ['[2, 3]', '[1, 2, 3]', '[2, 3, 4]', '[1, 2]'], 0, 'slice(1, 3) — 1-nji indeksden 3-e çenli (3 girmeýär).')
        ] }
      ]
    },
    {
      id: 'u8', title: 'Obýektler', icon: '🗃', chapter: 'ch8',
      desc: 'Häsiýetler, usullar, this, destrukturlaşdyrma',
      levels: [
        { id: 'u8l1', title: 'Obýekt esaslary', questions: [
          I(OUT, `const u = { at: "Merdan", yas: 21 };\nconsole.log(u.at);`, ['Merdan'], ''),
          C(OUT, `const u = { at: "Maral" };\nconsole.log(u["at"]);`, ['at', 'Maral', 'undefined', 'Ýalňyşlyk'], 1, 'Kwadrat ýaý bilen hem häsiýete ýüzlenip bolýar.'),
          I(OUT, `const o = {};\no.x = 5;\nconsole.log(o.x);`, ['5'], 'Obýekte islendik wagt täze häsiýet goşup bolýar.'),
          C(OUT, `const o = { a: 1 };\nconsole.log(o.b);`, ['null', 'undefined', '0', 'Ýalňyşlyk'], 1, 'Ýok häsiýet undefined berýär.'),
          C(OUT, `const o = { a: 1, b: 2 };\ndelete o.a;\nconsole.log(Object.keys(o));`, ['["b"]', '["a", "b"]', '[]', '["a"]'], 0, 'delete häsiýeti aýyrýar.')
        ] },
        { id: 'u8l2', title: 'Usullar we this', questions: [
          I(OUT, `const it = {\n  at: "Bars",\n  ses() { return this.at + " üýrýär"; }\n};\nconsole.log(it.ses());`, ['Bars üýrýär'], 'this — usuly çagyrýan obýekt.'),
          C('Obýektiň içindäki funksiýa näme diýilýär?', '', ['Usul (method)', 'Häsiýet', 'Klass', 'Modul'], 0, ''),
          C(OUT, `const o = { a: 1, b: 2 };\nfor (const k in o) console.log(k);`, ['a b', '1 2', 'a:1 b:2', 'Hiç zat'], 0, 'for...in açarlary aýlanýar.'),
          C(OUT, `console.log(Object.values({ x: 3, y: 4 }));`, ['[3, 4]', '["x", "y"]', '7', '{3, 4}'], 0, ''),
          I(OUT, `const o = { a: 1 };\nconsole.log("a" in o);`, ['true'], 'in operatory häsiýetiň barlygyny barlaýar.')
        ] },
        { id: 'u8l3', title: 'Destrukturlaşdyrma', questions: [
          I(OUT, `const { a, b } = { a: 1, b: 2 };\nconsole.log(a + b);`, ['3'], ''),
          I(OUT, `const [x, y] = [10, 20];\nconsole.log(y);`, ['20'], ''),
          C(OUT, `const o1 = { a: 1 };\nconst o2 = o1;\no2.a = 5;\nconsole.log(o1.a);`, ['1', '5', 'undefined', 'Ýalňyşlyk'], 1, 'Obýektler salgylanma boýunça göçürilýär — o1 we o2 bir obýekt.'),
          C(OUT, `const o = { ...{ a: 1 }, b: 2 };\nconsole.log(o);`, ['{ a: 1, b: 2 }', '{ b: 2 }', '{ a: 1 }', 'Ýalňyşlyk'], 0, 'Spread (...) häsiýetleri göçürýär.'),
          I(OUT, `const { at = "Näbelli" } = {};\nconsole.log(at);`, ['Näbelli'], 'Häsiýet ýok bolsa, adaty baha ulanylýar.')
        ] }
      ]
    },
    {
      id: 'u9', title: 'Setirler', icon: '🔡', chapter: 'ch9',
      desc: 'Setir usullary, şablon setirler',
      levels: [
        { id: 'u9l1', title: 'Setir esaslary', questions: [
          I(OUT, `console.log("Salam".length);`, ['5'], ''),
          I(OUT, `console.log("js".toUpperCase());`, ['JS'], ''),
          C(OUT, 'const at = "Aýna";\nconsole.log(`Salam, ${at}!`);', ['Salam, Aýna!', 'Salam, ${at}!', 'Salam, at!', 'Ýalňyşlyk'], 0, 'Şablon setirde ${...} bahany goýýar.'),
          I(OUT, `console.log("Salam"[0]);`, ['S'], ''),
          C('Şablon setirler haýsy belgi bilen ýazylýar?', '', ['` (yzky dyrnak)', "' (bir dyrnak)", '" (goşa dyrnak)', '# belgisi'], 0, '')
        ] },
        { id: 'u9l2', title: 'Setir usullary', questions: [
          C(OUT, `console.log("a,b,c".split(","));`, ['["a", "b", "c"]', '"abc"', '["a,b,c"]', '3'], 0, 'split setiri massiwe bölýär.'),
          C(OUT, `console.log("  salam  ".trim());`, ['salam', '  salam', 'salam  ', '  salam  '], 0, 'trim iki tarapdaky boşluklary aýyrýar.'),
          I(OUT, `console.log("JavaScript".includes("Script"));`, ['true'], ''),
          I(OUT, `console.log("Türkmen".slice(0, 3));`, ['Tür'], ''),
          I(OUT, `console.log("ha".repeat(3));`, ['hahaha'], '')
        ] },
        { id: 'u9l3', title: 'Setirler bilen işlemek', questions: [
          I(OUT, `console.log("abc".replace("b", "X"));`, ['aXc'], ''),
          I(OUT, `console.log("Salam".indexOf("l"));`, ['2'], ''),
          I(OUT, `console.log("abc".split("").reverse().join(""));`, ['cba'], 'Setiri tersine öwürmegiň meşhur usuly.'),
          C('Setirler JS-de üýtgäp bilýärmi (mutable)?', '', ['Ýok, setirler üýtgemeýär (immutable)', 'Hawa, islendik harpy üýtgedip bolýar'], 0, 'Setir usullary hemişe TÄZE setir gaýtarýar.'),
          C(OUT, `console.log("5" * "2");`, ['10', '52', 'NaN', 'Ýalňyşlyk'], 0, '* operatory setirleri sana öwürýär.')
        ] }
      ]
    },
    {
      id: 'u10', title: 'DOM we wakalar', icon: '🖱', chapter: 'ch10',
      desc: 'Sahypa elementleri bilen işlemek',
      levels: [
        { id: 'u10l1', title: 'DOM esaslary', questions: [
          C('DOM näme?', '', ['Sahypanyň obýekt modeli — HTML-iň agaç görnüşli şekili', 'Maglumat bazasy', 'CSS kitaphanasy', 'Serwer programmasy'], 0, 'DOM — Document Object Model.'),
          C('id boýunça elementi tapmak üçin haýsy usul?', '', ['document.getElementById()', 'document.findId()', 'window.id()', 'document.querySelectorAll()'], 0, ''),
          C('document.querySelector(".btn") näme gaýtarýar?', '', ['btn klasly ilkinji elementi', 'Ähli btn klasly elementleri', 'id-si btn bolan elementi', 'Hiç zat'], 0, 'Ählisini almak üçin querySelectorAll.'),
          C('Elementiň tekstini üýtgetmek üçin haýsy häsiýet ulanylýar?', '', ['textContent', 'value()', 'innerStyle', 'nodeName'], 0, ''),
          C('Täze element döretmek üçin haýsy usul?', '', ['document.createElement()', 'document.newElement()', 'document.add()', 'new Element()'], 0, '')
        ] },
        { id: 'u10l2', title: 'Wakalar', questions: [
          I('Düwmä basylanda işleýän wakanyň (event) ady näme?', '', ['click'], ''),
          C('Bu kod haçan "Basyldy" çykarar?', `btn.addEventListener("click", () => {\n  console.log("Basyldy");\n});`, ['Düwmä her basylanda', 'Sahypa açylanda bir gezek', 'Hiç haçan', 'Diňe ilkinji basylanda'], 0, ''),
          C('event.preventDefault() näme edýär?', '', ['Brauzeriň adaty hereketini ýatyrýar', 'Wakany pozýar', 'Sahypany täzeleýär', 'Elementi gizleýär'], 0, 'Meselem, formanyň iberilmegini saklaýar.'),
          C('Input meýdanynyň bahasyny almak üçin haýsy häsiýet?', '', ['value', 'text', 'content', 'data'], 0, ''),
          C('Waka diňleýjini aýyrmak üçin haýsy usul?', '', ['removeEventListener()', 'deleteEvent()', 'off()', 'stopListener()'], 0, '')
        ] },
        { id: 'u10l3', title: 'Stil we klasslar', questions: [
          C('Elemente klass goşmak üçin haýsy dogry?', '', ["el.classList.add('aktiw')", "el.class = 'aktiw'", "el.addClass('aktiw')", "el.style.class('aktiw')"], 0, ''),
          C("classList.toggle('x') näme edýär?", '', ['Klass bar bolsa aýyrýar, ýok bolsa goşýar', 'Hemişe goşýar', 'Hemişe aýyrýar', 'Klassy barlaýar'], 0, ''),
          C('Elementiň fon reňkini JS bilen üýtgetmek:', '', ["el.style.backgroundColor = 'red'", "el.style.background-color = 'red'", "el.css('bg', 'red')", "el.color = 'red'"], 0, 'JS-de CSS häsiýetleri camelCase bilen ýazylýar.'),
          C('Elementi sahypadan aýyrmak:', '', ['el.remove()', 'el.delete()', 'el.hide()', 'document.drop(el)'], 0, ''),
          C('Täze elementi başga elementiň içine goşmak:', '', ['parent.appendChild(child)', 'parent.push(child)', 'child.insert(parent)', 'parent.add(child)'], 0, '')
        ] }
      ]
    },
    {
      id: 'u11', title: 'Asinhron JavaScript', icon: '⏳', chapter: 'ch11',
      desc: 'setTimeout, Promise, async / await',
      levels: [
        { id: 'u11l1', title: 'Taýmerler we callback', questions: [
          C(OUT, `console.log("A");\nsetTimeout(() => console.log("B"), 0);\nconsole.log("C");`, ['A B C', 'A C B', 'B A C', 'C A B'], 1, 'setTimeout-yň funksiýasy häzirki kod gutarandan soň işleýär.'),
          C('setTimeout(f, 1000) näme edýär?', '', ['f funksiýany 1 sekuntdan soň bir gezek çagyrýar', 'f funksiýany her sekuntda çagyrýar', 'f funksiýany 1000 gezek çagyrýar', 'Programmany 1 sekunt togtadýar'], 0, ''),
          C('Callback näme?', '', ['Başga funksiýa argument hökmünde berilýän funksiýa', 'Ýalňyşlyk görnüşi', 'Sikl görnüşi', 'Üýtgeýän'], 0, ''),
          C('setInterval-y togtatmak üçin haýsy funksiýa?', '', ['clearInterval()', 'stopInterval()', 'clearTimeout()', 'break'], 0, ''),
          C('JavaScript näçe akymly (thread) dil?', '', ['Bir akymly', 'Iki akymly', 'Köp akymly', 'Akymsyz'], 0, 'JS bir akymly, asinhronlyk "event loop" arkaly üpjün edilýär.')
        ] },
        { id: 'u11l2', title: 'Promise', questions: [
          C('Promise-iň näçe ýagdaýy bar?', '', ['2', '3', '4', '5'], 1, 'pending (garaşylýar), fulfilled (ýerine ýetdi), rejected (ret edildi).'),
          I(OUT, `Promise.resolve(5).then(x => console.log(x * 2));`, ['10'], ''),
          C('Promise ýalňyşlygyny tutmak üçin haýsy usul?', '', ['.catch()', '.error()', '.fail()', '.then()'], 0, ''),
          C(OUT, `console.log(1);\nPromise.resolve().then(() => console.log(2));\nconsole.log(3);`, ['1 2 3', '1 3 2', '2 1 3', '3 2 1'], 1, '.then içindäki kod sinhron kod gutarandan soň işleýär.'),
          C('Promise.all([...]) haçan ýerine ýetirilýär?', '', ['Ähli promise-ler üstünlikli tamamlananda', 'Ilkinji tamamlananda', 'Hiç haçan', 'Diňe biri ýalňyş bolanda'], 0, '')
        ] },
        { id: 'u11l3', title: 'async / await', questions: [
          C('await açar sözi nirede ulanylyp bilner?', '', ['async funksiýanyň içinde (ýa-da modulyň ýokary derejesinde)', 'Islendik ýerde', 'Diňe siklde', 'Diňe if-de'], 0, ''),
          I(OUT, `async function f() {\n  return 7;\n}\nf().then(console.log);`, ['7'], ''),
          C('async funksiýa hemişe näme gaýtarýar?', '', ['Promise', 'Setir', 'undefined', 'Massiw'], 0, ''),
          C('async/await-de ýalňyşlyk nähili tutulýar?', '', ['try...catch bilen', 'if...else bilen', 'switch bilen', 'Tutup bolmaýar'], 0, ''),
          C('fetch() funksiýasy näme üçin ulanylýar?', '', ['Tor arkaly maglumat soramak (HTTP)', 'Faýl pozmak', 'Sikl döretmek', 'Elementi tapmak'], 0, '')
        ] }
      ]
    },
    {
      id: 'u12', title: 'Klasslar we ES6+', icon: '🧱', chapter: 'ch12',
      desc: 'class, extends, spread, rest, Set, Map, ýalňyşlyklar',
      levels: [
        { id: 'u12l1', title: 'Klasslar', questions: [
          I(OUT, `class Ulag {\n  constructor(at) { this.at = at; }\n}\nconst u = new Ulag("Awtobus");\nconsole.log(u.at);`, ['Awtobus'], ''),
          C('Klasdan obýekt döretmek üçin haýsy açar söz?', '', ['new', 'create', 'make', 'class'], 0, ''),
          C('Miras almak üçin haýsy açar söz?', '', ['extends', 'inherits', 'implements', 'super'], 0, ''),
          C('Ata klasyň konstruktoryny çagyrmak üçin näme ýazylýar?', '', ['super()', 'parent()', 'this()', 'base()'], 0, ''),
          I(OUT, `class A {\n  static salam() { return "Salam"; }\n}\nconsole.log(A.salam());`, ['Salam'], 'static usul klasyň özünden çagyrylýar.')
        ] },
        { id: 'u12l2', title: 'ES6+ mümkinçilikleri', questions: [
          I(OUT, `const a = [1, 2];\nconst b = [...a, 3];\nconsole.log(b.length);`, ['3'], ''),
          I(OUT, `function jem(...s) {\n  return s.length;\n}\nconsole.log(jem(1, 2, 3, 4));`, ['4'], 'Rest parametri (...s) ähli argumentleri massiwe ýygnaýar.'),
          C(OUT, `const o = { a: { b: null } };\nconsole.log(o.a?.b?.c);`, ['undefined', 'null', 'Ýalňyşlyk', 'c'], 0, '?. null-a duşanda ýalňyşlyk bermän undefined gaýtarýar.'),
          C('Modulda bir zady eksport etmek üçin haýsy açar söz?', '', ['export', 'module', 'require', 'public'], 0, ''),
          I(OUT, `const s = new Set([1, 1, 2, 3, 3]);\nconsole.log(s.size);`, ['3'], 'Set diňe gaýtalanmaýan bahalary saklaýar.')
        ] },
        { id: 'u12l3', title: 'Ýalňyşlyklar we Map', questions: [
          C('Ýalňyşlygy özüň döretmek (zyňmak) üçin näme ýazylýar?', '', ["throw new Error('...')", 'raise Error', 'error()', 'catch()'], 0, ''),
          I(OUT, `try {\n  null.x;\n} catch (e) {\n  console.log("Tutuldy");\n}`, ['Tutuldy'], 'null-yň häsiýetini okamak TypeError döredýär.'),
          C('finally bloky haçan ýerine ýetirilýär?', '', ['Hemişe, ýalňyşlyk bolsa-da bolmasa-da', 'Diňe ýalňyşlyk bolanda', 'Diňe ýalňyşlyk bolmasa', 'Hiç haçan'], 0, ''),
          I(OUT, `const m = new Map();\nm.set("a", 1);\nconsole.log(m.get("a"));`, ['1'], ''),
          I(OUT, `console.log([1, [2, [3]]].flat(Infinity).length);`, ['3'], 'flat(Infinity) ähli içki massiwleri tekizleýär.')
        ] }
      ]
    }
  ];
})();
