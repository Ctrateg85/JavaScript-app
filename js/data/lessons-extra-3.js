// Goşmaça derejeler: 9–12-nji bölümler (her bölümde 4–10-njy derejeler)

(function () {
  const C = (q, code, options, answer, explain) => ({ type: 'choice', q, code, options, answer, explain });
  const I = (q, code, answers, explain) => ({ type: 'input', q, code, answers, explain });
  const OUT = 'Bu kod konsola näme çykarar?';
  const TF = ['true', 'false'];
  const add = (unitId, levels) => window.LESSONS.find(u => u.id === unitId).levels.push(...levels);

  // ---------- 9. Setirler ----------
  add('u9', [
    { id: 'u9l4', title: 'Setirde gözleg', questions: [
      C(OUT, `console.log("JavaScript".startsWith("Java"));`, TF, 0, ''),
      C(OUT, `console.log("index.html".endsWith(".js"));`, TF, 1, ''),
      I(OUT, `console.log("banan".lastIndexOf("a"));`, ['3'], 'b0 a1 n2 a3 n4.'),
      I(OUT, `console.log("salam".indexOf("z"));`, ['-1'], 'Tapylmasa -1 gaýtarylýar.'),
      C(OUT, `console.log("Salam".includes("salam"));`, TF, 1, 'Gözleg harplaryň ululygyna duýgur.')
    ] },
    { id: 'u9l5', title: 'Harplar bilen işlemek', questions: [
      I(OUT, `console.log("Salam".charAt(1));`, ['a'], ''),
      I(OUT, `console.log("A".charCodeAt(0));`, ['65'], ''),
      I(OUT, `console.log(String.fromCharCode(66));`, ['B'], ''),
      I(OUT, `console.log("Salam".at(-1));`, ['m'], ''),
      C(OUT, `console.log("abc"[5]);`, ['undefined', '""', 'null', 'Ýalňyşlyk'], 0, '')
    ] },
    { id: 'u9l6', title: 'padStart, padEnd, trim', questions: [
      I(OUT, `console.log("7".padStart(3, "0"));`, ['007'], ''),
      I(OUT, `console.log("ab".padEnd(5, "*"));`, ['ab***'], ''),
      C(OUT, `console.log("  x  ".trimStart().length);`, ['3', '5', '1', '2'], 0, 'Diňe başdaky boşluklar aýrylýar: "x  ".'),
      I(OUT, `console.log("abc".padStart(2, "0"));`, ['abc'], 'Setir eýýäm uzyn bolsa üýtgemeýär.'),
      I(OUT, `const s = 5;\nconsole.log(String(s).padStart(2, "0") + ":00");`, ['05:00'], '')
    ] },
    { id: 'u9l7', title: 'Regulýar aňlatmalar', questions: [
      C(OUT, `console.log(/\\d+/.test("abc123"));`, TF, 0, '\\d — sifr.'),
      I(OUT, `console.log("a-b-c".replace(/-/g, "+"));`, ['a+b+c'], 'g baýdagy ähli gabat gelmeleri çalyşýar.'),
      I(OUT, `console.log("a-b-c".replace("-", "+"));`, ['a+b-c'], 'Setir bilen diňe ilkinjisi çalşylýar.'),
      I(OUT, `console.log("a1b22c333".match(/\\d+/g).length);`, ['3'], '["1", "22", "333"].'),
      I(OUT, `console.log("a-b-c".replaceAll("-", ""));`, ['abc'], '')
    ] },
    { id: 'u9l8', title: 'Setirleri deňeşdirmek', questions: [
      C(OUT, `console.log("a" < "b");`, TF, 0, ''),
      C(OUT, `console.log("Z" < "a");`, TF, 0, 'Uly harplaryň kody kiçi harplaryňkydan kiçi: "Z" = 90, "a" = 97.'),
      C(OUT, `console.log("10" < "9");`, TF, 0, 'Setirler harp-harp deňeşdirilýär: "1" < "9".'),
      C(OUT, `console.log("Salam".toLowerCase() === "salam");`, TF, 0, ''),
      I(OUT, `console.log("a".localeCompare("b"));`, ['-1'], 'Birinji setir öň gelse otrisatel san gaýtarylýar.')
    ] },
    { id: 'u9l9', title: 'Setirler: amaly meseleler', questions: [
      C(OUT, `const s = "kazak";\nconsole.log(s === s.split("").reverse().join(""));`, TF, 0, 'Palindrom — iki tarapdan birmeňzeş okalýan söz.'),
      I(OUT, `const s = "programma";\nlet c = 0;\nfor (const ch of s) if ("aeiou".includes(ch)) c++;\nconsole.log(c);`, ['3'], 'Çekimli harplar: o, a, a.'),
      I(OUT, `const s = "salam";\nconsole.log(s[0].toUpperCase() + s.slice(1));`, ['Salam'], ''),
      I(OUT, `console.log("men js öwrenýärin".split(" ").length);`, ['3'], 'Sözleri sanamak.'),
      I(OUT, `console.log("a,b,,c".split(",").filter(Boolean).join(""));`, ['abc'], 'filter(Boolean) boş setirleri aýyrýar.')
    ] },
    { id: 'u9l10', title: 'Gaýtalama: 9-njy bölüm', questions: [
      I(OUT, 'const a = 3, b = 4;\nconsole.log(`${a} * ${b} = ${a * b}`);', ['3 * 4 = 12'], ''),
      C(OUT, `const s = "abc";\ns[0] = "X";\nconsole.log(s);`, ['abc', 'Xbc', 'Ýalňyşlyk', 'X'], 0, 'Setirler üýtgemeýär (immutable).'),
      I(OUT, `console.log("Salam dünýä".split(" ")[1]);`, ['dünýä'], ''),
      I(OUT, `console.log("abcdef".substring(2, 4));`, ['cd'], ''),
      C(OUT, `console.log("5" + 5 - 5);`, ['50', '5', '55', 'NaN'], 0, '"5" + 5 = "55", "55" - 5 = 50.')
    ] }
  ]);

  // ---------- 10. DOM we wakalar ----------
  add('u10', [
    { id: 'u10l4', title: 'Elementleri tapmak', questions: [
      C('document.querySelectorAll("li") näme gaýtarýar?', '', ['NodeList — ähli li elementleri', 'Ilkinji li elementi', 'Setir', 'Hiç zat'], 0, ''),
      C('el.closest(".card") näme edýär?', '', ['el-den ýokaryk gidip, .card klasly iň ýakyn elementi tapýar', 'Içindäki .card-y tapýar', 'Goňşy elementi tapýar', 'Elementi ýapýar'], 0, ''),
      C('Elementiň çaga elementlerini almak üçin haýsy häsiýet?', '', ['children', 'kids', 'nodes()', 'items'], 0, ''),
      C('Elementiň ata elementini almak üçin haýsy häsiýet?', '', ['parentElement', 'father', 'upper', 'topElement'], 0, ''),
      C('querySelector("#menu") nämäni tapýar?', '', ['id-si "menu" bolan elementi', 'menu klasly elementi', '<menu> tegini', 'Hiç zady'], 0, '# — id, . — klass.')
    ] },
    { id: 'u10l5', title: 'Atributlar', questions: [
      C('Atributyň bahasyny okamak üçin?', '', ['el.getAttribute("href")', 'el.attr("href")', 'el.readAttribute("href")', 'el.attribute.href()'], 0, ''),
      C('Atribut goýmak üçin?', '', ['el.setAttribute("title", "Salam")', 'el.putAttribute("title", "Salam")', 'el.attr = "title"', 'el.addAttribute("title")'], 0, ''),
      C('<div data-id="7"> elementiň data-id bahasyny almak:', '', ['el.dataset.id', 'el.data.id', 'el.dataId()', 'el.id.data'], 0, 'data-* atributlary dataset arkaly elýeterli.'),
      C('Atributy aýyrmak üçin?', '', ['el.removeAttribute("disabled")', 'el.deleteAttribute("disabled")', 'el.disabled.remove()', 'el.attr("disabled", null)'], 0, ''),
      C('Elementde atributyň bardygyny barlamak:', '', ['el.hasAttribute("hidden")', 'el.isAttribute("hidden")', 'el.attribute("hidden")', 'el.checkAttribute("hidden")'], 0, '')
    ] },
    { id: 'u10l6', title: 'innerHTML we howpsuzlyk', questions: [
      C('el.innerHTML = "<b>Salam</b>" näme edýär?', '', ['Içine galyň "Salam" HTML-i goýýar', '"<b>Salam</b>" tekstini görkezýär', 'Ýalňyşlyk', 'Elementi pozýar'], 0, ''),
      C('el.textContent = "<b>Salam</b>" näme görkezýär?', '', ['"<b>Salam</b>" teksti hökmünde', 'Galyň Salam', 'Hiç zat', 'Ýalňyşlyk'], 0, 'textContent HTML-i tekst hökmünde goýýar.'),
      C('Ulanyjynyň ýazan tekstini sahypa goýmak üçin haýsy has howpsuz?', '', ['textContent', 'innerHTML', 'outerHTML', 'document.write'], 0, 'innerHTML XSS hüjümine ýol açyp biler.'),
      C('XSS näme?', '', ['Sahypa zyýanly skript goýmak hüjümi', 'CSS kitaphanasy', 'Maglumat bazasy', 'JS-iň wersiýasy'], 0, ''),
      C('el.insertAdjacentHTML("beforeend", html) HTML-i nirä goşýar?', '', ['Elementiň içine, iň ahyryna', 'Elementden öň', 'Elementden soň', 'Elementiň ornuna'], 0, '')
    ] },
    { id: 'u10l7', title: 'Waka obýekti', questions: [
      C('event.target näme?', '', ['Wakany döreden element (meselem, basylan element)', 'Diňleýji goşulan element', 'window', 'Wakanyň ady'], 0, ''),
      C('Klawiatura wakasynda basylan düwmäni bilmek üçin?', '', ['event.key', 'event.button', 'event.char()', 'event.press'], 0, ''),
      C('Klawiatura düwmesi basylanda haýsy waka bolýar?', '', ['keydown', 'click', 'press', 'type'], 0, ''),
      C('Syçanyň koordinatalary haýsy häsiýetlerde?', '', ['event.clientX, event.clientY', 'event.x(), event.y()', 'event.mouse', 'event.pos'], 0, ''),
      C('event.currentTarget näme?', '', ['Diňleýjisi işleýän element', 'Hemişe document', 'Basylan iň içki element', 'Öňki element'], 0, '')
    ] },
    { id: 'u10l8', title: 'Wakalaryň ýaýramagy', questions: [
      C('Wakanyň ýaýramagy (bubbling) näme?', '', ['Waka içki elementden daşky elementlere çenli ýokaryk geçýär', 'Waka diňe bir elementde bolýar', 'Waka aşak geçýär', 'Waka gaýtalanýar'], 0, ''),
      C('Wakanyň ýokaryk ýaýramagyny togtatmak:', '', ['event.stopPropagation()', 'event.preventDefault()', 'event.stop()', 'event.cancel()'], 0, ''),
      C('Wakany delegirlemek (delegation) näme?', '', ['Diňleýjini köp çaga elementiň ýerine ata elemente goşmak', 'Wakany başga sahypa ibermek', 'Wakany pozmak', 'Wakany gaýtalamak'], 0, ''),
      C('Bu kod haýsy elemente basylanda işleýär?', `ul.addEventListener("click", e => {\n  if (e.target.matches("li")) console.log(e.target.textContent);\n});`, ['ul içindäki islendik li-e', 'Diňe ul-yň özüne', 'Diňe ilkinji li-e', 'Hiç haçan'], 0, ''),
      C('addEventListener-iň { once: true } opsiýasy näme edýär?', '', ['Diňleýji bir gezek işläp, soň awtomatik aýrylýar', 'Waka hiç haçan işlemeýär', 'Waka iki gezek işleýär', 'Ýalňyşlyk'], 0, '')
    ] },
    { id: 'u10l9', title: 'Formalar', questions: [
      C('Forma iberilende haýsy waka bolýar?', '', ['submit', 'send', 'post', 'upload'], 0, ''),
      C('Input-a her harp ýazylanda haýsy waka bolýar?', '', ['input', 'change', 'submit', 'focus'], 0, 'change — diňe meýdandan çykylanda.'),
      C('Checkbox-yň belgilenendigini bilmek:', '', ['el.checked', 'el.value', 'el.selected()', 'el.isOn'], 0, ''),
      C(OUT, `// <input id="n" value="5">\nconst v = document.getElementById("n").value;\nconsole.log(typeof v);`, ['string', 'number', 'undefined', 'object'], 0, 'value hemişe setir gaýtarýar.'),
      C('Input meýdanyna kursory goýmak üçin?', '', ['el.focus()', 'el.select()', 'el.cursor()', 'el.active()'], 0, '')
    ] },
    { id: 'u10l10', title: 'Brauzer API we gaýtalama', questions: [
      C('localStorage-a maglumat ýazmak:', '', ['localStorage.setItem("k", "v")', 'localStorage.write("k", "v")', 'localStorage.save("k", "v")', 'storage.put("k", "v")'], 0, ''),
      C('localStorage haýsy görnüşde maglumat saklaýar?', '', ['Diňe setirler', 'Islendik obýekt', 'Diňe sanlar', 'Funksiýalar'], 0, 'Obýekti saklamak üçin JSON.stringify ulanylýar.'),
      C('localStorage-daky maglumat brauzer ýapylanda näme bolýar?', '', ['Saklanýar', 'Pozulýar', 'Serwere iberilýär', 'Şifrlenýär'], 0, 'sessionStorage bolsa tab ýapylanda pozulýar.'),
      C('requestAnimationFrame näme üçin ulanylýar?', '', ['Animasiýa üçin funksiýany indiki ekran täzelenmesinde çagyrmak', 'Surat ýüklemek', 'Wideo görkezmek', 'Sahypany täzelemek'], 0, ''),
      C('DOMContentLoaded wakasy haçan bolýar?', '', ['HTML doly okalyp, DOM taýýar bolanda', 'Ähli suratlar ýüklenende', 'Sahypa ýapylanda', 'Düwmä basylanda'], 0, '')
    ] }
  ]);

  // ---------- 11. Asinhron JavaScript ----------
  add('u11', [
    { id: 'u11l4', title: 'Event loop', questions: [
      C(OUT, `setTimeout(() => console.log("T"), 0);\nPromise.resolve().then(() => console.log("P"));\nconsole.log("S");`, ['S P T', 'S T P', 'T P S', 'P S T'], 0, 'Ilki sinhron kod, soň mikrowezipeler (Promise), soň makrowezipeler (setTimeout).'),
      C('Promise.then-iň callback-i haýsy nobata düşýär?', '', ['Mikrowezipe (microtask)', 'Makrowezipe (macrotask)', 'Derrew ýerine ýetirilýär', 'Hiç haýsy'], 0, ''),
      C(OUT, `console.log(1);\nsetTimeout(() => console.log(2), 100);\nsetTimeout(() => console.log(3), 0);\nconsole.log(4);`, ['1 4 3 2', '1 2 3 4', '1 4 2 3', '4 1 3 2'], 0, ''),
      C('Çagyryş steki (call stack) näme?', '', ['Häzir ýerine ýetirilýän funksiýalaryň sanawy', 'Maglumat bazasy', 'Massiw usuly', 'Tor soragy'], 0, ''),
      C(OUT, `queueMicrotask(() => console.log("M"));\nconsole.log("S");`, ['S M', 'M S', 'S', 'M'], 0, '')
    ] },
    { id: 'u11l5', title: 'Promise zynjyrlary', questions: [
      I(OUT, `Promise.resolve(2)\n  .then(x => x * 3)\n  .then(x => console.log(x + 1));`, ['7'], ''),
      C(OUT, `Promise.reject("ýalňyş")\n  .then(() => console.log("A"))\n  .catch(e => console.log("B:" + e));`, ['B:ýalňyş', 'A', 'A B:ýalňyş', 'Hiç zat'], 0, 'reject bolanda then geçilýär, catch işleýär.'),
      C(OUT, `Promise.resolve(1)\n  .finally(() => console.log("F"))\n  .then(x => console.log(x));`, ['F 1', '1 F', 'F', '1'], 0, 'finally bahany üýtgetmän geçirýär.'),
      I(OUT, `new Promise(res => res(10))\n  .then(x => { throw x + 1; })\n  .catch(e => console.log(e));`, ['11'], 'then içinde zyňylan ýalňyşlyk catch-e düşýär.'),
      C('new Promise((resolve, reject) => ...) — resolve näme edýär?', '', ['Promise-i üstünlikli tamamlaýar', 'Ýalňyşlyk döredýär', 'Promise-i pozýar', 'Taýmer goýýar'], 0, '')
    ] },
    { id: 'u11l6', title: 'Promise.all, race, any', questions: [
      C(OUT, `Promise.all([1, Promise.resolve(2), 3])\n  .then(r => console.log(r));`, ['[1, 2, 3]', '6', '1', '3'], 0, ''),
      C('Promise.all-daky promise-leriň biri reject bolsa näme bolýar?', '', ['Netije derrew reject bolýar', 'Beýlekilere garaşyp, netije berýär', 'Ýalňyşlyk äsgerilmeýär', 'Programma durýar'], 0, ''),
      C('Promise.race näme gaýtarýar?', '', ['Ilkinji tamamlanan promise-iň netijesini', 'Ähli netijeleri', 'Iň soňky netijäni', 'Hiç zat'], 0, ''),
      C('Promise.allSettled näme gaýtarýar?', '', ['Ähli promise-leriň ýagdaýyny (fulfilled/rejected), ýalňyşlyk bolsa-da', 'Diňe üstünliklileri', 'Ilkinji ýalňyşlygy', 'Ilkinji üstünlikli netijäni'], 0, ''),
      C(OUT, `Promise.any([Promise.reject(1), Promise.resolve(2)])\n  .then(x => console.log(x));`, ['2', '1', '[1, 2]', 'Ýalňyşlyk'], 0, 'any — ilkinji üstünlikli netije.')
    ] },
    { id: 'u11l7', title: 'async / await jikme-jik', questions: [
      C(OUT, `async function f() {\n  console.log(1);\n  await null;\n  console.log(2);\n}\nf();\nconsole.log(3);`, ['1 3 2', '1 2 3', '3 1 2', '1 3'], 0, 'await-den soňky kod mikrowezipe hökmünde dowam edýär.'),
      I(OUT, `async function f() {\n  const x = await Promise.resolve(4);\n  return x * 2;\n}\nf().then(console.log);`, ['8'], ''),
      C(OUT, `async function f() { return 1; }\nconsole.log(f() instanceof Promise);`, TF, 0, ''),
      C('Iki garaşsyz soragy parallel ýerine ýetirmek üçin haýsy has çalt?', '', ['await Promise.all([a(), b()])', 'await a(); await b();', 'await a(b())', 'a().then(b)'], 0, ''),
      C('Ok-funksiýany asinhron etmek:', '', ['const f = async () => {...}', 'const f = () async => {...}', 'async const f = () => {...}', 'const f = await () => {...}'], 0, '')
    ] },
    { id: 'u11l8', title: 'Asinhron ýalňyşlyklar', questions: [
      C(OUT, `async function f() {\n  try {\n    await Promise.reject("X");\n  } catch (e) {\n    console.log("Tutuldy " + e);\n  }\n}\nf();`, ['Tutuldy X', 'X', 'Hiç zat', 'Ýalňyşlyk'], 0, ''),
      C(OUT, `async function f() { throw new Error("B"); }\nf().catch(e => console.log(e.message));`, ['B', 'Error', 'undefined', 'Hiç zat'], 0, 'async funksiýada zyňylan ýalňyşlyk reject bolan Promise-e öwrülýär.'),
      C('Tutulmadyk Promise ýalňyşlygyna näme diýilýär?', '', ['Unhandled promise rejection', 'Syntax error', 'Stack overflow', 'Timeout'], 0, ''),
      C(OUT, `const p = new Promise((_, rej) => rej("Z"));\np.catch(e => e + "!").then(v => console.log(v));`, ['Z!', 'Z', 'undefined', 'Hiç zat'], 0, 'catch-iň gaýtaran bahasy zynjyrda dowam edýär.'),
      C('try...catch setTimeout içindäki ýalňyşlygy tutup bilermi?', `try {\n  setTimeout(() => { throw new Error(); }, 0);\n} catch (e) {}`, ['Ýok, callback soňra, try gutarandan soň işleýär', 'Hawa, hemişe', 'Diňe berk tertipde', 'Diňe Node.js-de'], 0, '')
    ] },
    { id: 'u11l9', title: 'fetch we JSON', questions: [
      C('fetch() näme gaýtarýar?', '', ['Response bilen çözülýän Promise', 'Göni JSON', 'Setir', 'undefined'], 0, ''),
      C('Jogapdan JSON almak üçin:', '', ['await response.json()', 'response.JSON', 'JSON(response)', 'response.parse()'], 0, ''),
      C('response.ok näme aňladýar?', '', ['HTTP status 200–299 aralygynda', 'Jogap boş däl', 'JSON dogry', 'Internet bar'], 0, ''),
      C('Serwere maglumat ibermek üçin fetch-de haýsy opsiýalar ulanylýar?', '', ['method: "POST" we body', 'send: true', 'post()', 'upload: data'], 0, ''),
      C('404 status kody näme aňladýar?', '', ['Tapylmady (Not Found)', 'Üstünlikli', 'Serwer ýalňyşlygy', 'Rugsat ýok'], 0, '')
    ] },
    { id: 'u11l10', title: 'Gaýtalama: 11-nji bölüm', questions: [
      C(OUT, `console.log("A");\nsetTimeout(() => console.log("B"));\n(async () => {\n  console.log("C");\n  await 0;\n  console.log("D");\n})();\nconsole.log("E");`, ['A C E D B', 'A C D E B', 'A E C D B', 'A B C D E'], 0, ''),
      I(OUT, `const wait = ms => new Promise(r => setTimeout(r, ms));\n(async () => {\n  await wait(10);\n  console.log("taýýar");\n})();`, ['taýýar'], ''),
      C(OUT, `Promise.resolve(1)\n  .then(x => x + 1)\n  .then(x => Promise.resolve(x * 10))\n  .then(console.log);`, ['20', '11', '2', 'Promise'], 0, 'then içinde gaýtarylan Promise-e garaşylýar.'),
      C('Promise fulfilled bolandan soň onuň ýagdaýy üýtgäp bilermi?', '', ['Ýok, Promise diňe bir gezek çözülýär', 'Hawa, rejected bolup biler', 'Hawa, pending-e gaýdyp biler', 'Diňe finally bilen'], 0, ''),
      C(OUT, `async function f() { return 5; }\nconsole.log(f());`, ['Promise { 5 }', '5', 'undefined', 'Ýalňyşlyk'], 0, 'async funksiýa hemişe Promise gaýtarýar.')
    ] }
  ]);

  // ---------- 12. Klasslar we ES6+ ----------
  add('u12', [
    { id: 'u12l4', title: 'Miras we super', questions: [
      I(OUT, `class Haywan {\n  ses() { return "..."; }\n}\nclass It extends Haywan {\n  ses() { return "Haw!"; }\n}\nconsole.log(new It().ses());`, ['Haw!'], 'Usuly täzeden kesgitlemek (override).'),
      I(OUT, `class A {\n  constructor(x) { this.x = x; }\n}\nclass B extends A {\n  constructor(x, y) {\n    super(x);\n    this.y = y;\n  }\n}\nconst b = new B(1, 2);\nconsole.log(b.x + b.y);`, ['3'], ''),
      I(OUT, `class A {\n  at() { return "A"; }\n}\nclass B extends A {\n  at() { return super.at() + "B"; }\n}\nconsole.log(new B().at());`, ['AB'], 'super.usul() ata klasyň usulyny çagyrýar.'),
      C(OUT, `class A {}\nclass B extends A {}\nconsole.log(new B() instanceof A);`, TF, 0, ''),
      C('Miras alýan klasyň konstruktorynda this-den öň näme çagyrylmaly?', '', ['super()', 'this()', 'parent()', 'Hiç zat'], 0, 'Bolmasa ReferenceError döreýär.')
    ] },
    { id: 'u12l5', title: 'Hususy meýdanlar we static', questions: [
      C(OUT, `class H {\n  #b = 100;\n  get b() { return this.#b; }\n}\nconst h = new H();\nconsole.log(h.b);`, ['100', 'undefined', 'Ýalňyşlyk', '#b'], 0, '# — hususy (private) meýdan.'),
      C('Klasdan daşarda h.#b okalsa näme bolar?', '', ['SyntaxError', 'undefined', '100', 'null'], 0, 'Hususy meýdanlar diňe klasyň içinde elýeterli.'),
      I(OUT, `class Sanaw {\n  static n = 0;\n  constructor() { Sanaw.n++; }\n}\nnew Sanaw(); new Sanaw();\nconsole.log(Sanaw.n);`, ['2'], 'static meýdan klasyň özüne degişli.'),
      I(OUT, `class T {\n  constructor(w) { this.w = w; }\n  set g(v) { this.w = v * 2; }\n}\nconst t = new T(1);\nt.g = 5;\nconsole.log(t.w);`, ['10'], ''),
      I(OUT, `class P {\n  constructor(n) { this.n = n; }\n  toString() { return "P" + this.n; }\n}\nconsole.log(String(new P(7)));`, ['P7'], 'toString obýekt setire öwrülende çagyrylýar.')
    ] },
    { id: 'u12l6', title: 'Modullar', questions: [
      C('Adaty (default) eksport nähili ýazylýar?', '', ['export default function f() {}', 'export function default f() {}', 'default export f', 'module.default = f'], 0, ''),
      C('Atlandyrylan eksporty import etmek:', '', ['import { f } from "./m.js";', 'import f from { "./m.js" };', 'require { f } "./m.js"', 'include f from "./m.js"'], 0, ''),
      C('Default eksporty import etmek:', '', ['import f from "./m.js";', 'import { default } from "./m.js";', 'import * f from "./m.js";', 'import f() from "./m.js";'], 0, ''),
      C('Ähli eksportlary bir obýekt hökmünde import etmek:', '', ['import * as m from "./m.js";', 'import all from "./m.js";', 'import { * } from "./m.js";', 'import m.* from "./m.js";'], 0, ''),
      C('Brauzerde modul ulanmak üçin script tegine näme goşulýar?', '', ['type="module"', 'module="true"', 'lang="es6"', 'defer="module"'], 0, '')
    ] },
    { id: 'u12l7', title: 'Set we Map jikme-jik', questions: [
      C(OUT, `const s = new Set([1, 2]);\ns.add(2);\ns.add(3);\nconsole.log([...s]);`, ['[1, 2, 3]', '[1, 2, 2, 3]', '[3]', '3'], 0, ''),
      C(OUT, `const s = new Set(["a"]);\nconsole.log(s.has("a"), s.has("b"));`, ['true false', 'true true', 'false false', 'a undefined'], 0, ''),
      I(OUT, `console.log([...new Set("salam")].join(""));`, ['salm'], 'Gaýtalanýan harplar aýrylýar.'),
      I(OUT, `const m = new Map([["a", 1], ["b", 2]]);\nconsole.log(m.size);`, ['2'], ''),
      C('Map-iň adaty obýektden esasy artykmaçlygy näme?', '', ['Açar islendik görnüşde bolup bilýär (obýekt, san...)', 'Has az ýer tutýar', 'JSON-a göni öwrülýär', 'Hiç hili tapawut ýok'], 0, '')
    ] },
    { id: 'u12l8', title: 'Generatorlar we iteratorlar', questions: [
      C(OUT, `function* g() {\n  yield 1;\n  yield 2;\n}\nconsole.log([...g()]);`, ['[1, 2]', '[1]', '2', 'Ýalňyşlyk'], 0, ''),
      C(OUT, `function* g() { yield "a"; }\nconst it = g();\nconsole.log(it.next());`, ['{ value: "a", done: false }', 'a', '{ value: "a", done: true }', 'undefined'], 0, ''),
      C(OUT, `function* g() { yield 1; }\nconst it = g();\nit.next();\nconsole.log(it.next().done);`, TF, 0, ''),
      I(OUT, `function* sana(n) {\n  for (let i = 1; i <= n; i++) yield i;\n}\nlet s = 0;\nfor (const x of sana(4)) s += x;\nconsole.log(s);`, ['10'], 'Generatory for...of bilen aýlanyp bolýar.'),
      C('Obýekti for...of bilen aýlanyp bolar ýaly haýsy usul gerek?', '', ['[Symbol.iterator]', 'forEach', 'toString', 'valueOf'], 0, '')
    ] },
    { id: 'u12l9', title: 'Ýalňyşlyk görnüşleri', questions: [
      C(OUT, `try {\n  x = y + 1;\n} catch (e) {\n  console.log(e.name);\n}`, ['ReferenceError', 'TypeError', 'SyntaxError', 'RangeError'], 0, 'y yglan edilmedik.'),
      C(OUT, `try {\n  null.f();\n} catch (e) {\n  console.log(e.name);\n}`, ['TypeError', 'ReferenceError', 'SyntaxError', 'NullError'], 0, ''),
      C(OUT, `try {\n  new Array(-1);\n} catch (e) {\n  console.log(e.name);\n}`, ['RangeError', 'TypeError', 'ArrayError', 'ReferenceError'], 0, ''),
      I(OUT, `class MenYalnys extends Error {\n  constructor(m) {\n    super(m);\n    this.name = "MenYalnys";\n  }\n}\ntry {\n  throw new MenYalnys("!");\n} catch (e) {\n  console.log(e.name);\n}`, ['MenYalnys'], 'Öz ýalňyşlyk görnüşiňi döretmek.'),
      C(OUT, `function f() {\n  try {\n    return "try";\n  } finally {\n    console.log("finally");\n  }\n}\nconsole.log(f());`, ['finally try', 'try finally', 'try', 'finally'], 0, 'finally return-dan öň ýerine ýetirilýär.')
    ] },
    { id: 'u12l10', title: 'Jemleýji synag', questions: [
      C(OUT, `const o = { a: [1, 2, 3] };\nconst { a: [, ikinji] } = o;\nconsole.log(ikinji);`, ['2', '1', '[1, 2, 3]', 'undefined'], 0, ''),
      I(OUT, `const sum = (...n) => n.reduce((a, b) => a + b, 0);\nconsole.log(sum(...[1, 2], 3));`, ['6'], ''),
      C(OUT, `class K {\n  static create() { return new K(); }\n  hi() { return "hi"; }\n}\nconsole.log(K.create().hi());`, ['hi', 'undefined', 'Ýalňyşlyk', 'K'], 0, ''),
      C(OUT, `const m = new Map();\nconst k = {};\nm.set(k, "obýekt");\nconsole.log(m.get({}));`, ['undefined', 'obýekt', 'null', 'Ýalňyşlyk'], 0, '{} — täze obýekt, k bilen deň däl.'),
      I(OUT, `console.log([1, 2, 3].map(x => x ** 2).filter(x => x > 1).length);`, ['2'], '[1, 4, 9] → [4, 9].')
    ] }
  ]);
})();
