// Goşmaça derejeler: 5–8-nji bölümler (her bölümde 4–10-njy derejeler)

(function () {
  const C = (q, code, options, answer, explain) => ({ type: 'choice', q, code, options, answer, explain });
  const I = (q, code, answers, explain) => ({ type: 'input', q, code, answers, explain });
  const OUT = 'Bu kod konsola näme çykarar?';
  const TF = ['true', 'false'];
  const add = (unitId, levels) => window.LESSONS.find(u => u.id === unitId).levels.push(...levels);

  // ---------- 5. Sikller ----------
  add('u5', [
    { id: 'u5l4', title: 'Içki sikller', questions: [
      I('Bu kod näçe gezek console.log çagyrar?', `for (let i = 0; i < 3; i++) {\n  for (let j = 0; j < 4; j++) {\n    console.log(i, j);\n  }\n}`, ['12'], '3 · 4 = 12.'),
      I(OUT, `let s = 0;\nfor (let i = 1; i <= 2; i++)\n  for (let j = 1; j <= 3; j++)\n    s += j;\nconsole.log(s);`, ['12'], 'Içki sikl 1 + 2 + 3 = 6, iki gezek: 12.'),
      C(OUT, `let r = "";\nfor (let i = 1; i <= 3; i++) {\n  r += "*".repeat(i) + " ";\n}\nconsole.log(r.trim());`, ['* ** ***', '***', '* * *', '*** ** *'], 0, ''),
      I(OUT, `let c = 0;\nfor (let i = 0; i < 3; i++)\n  for (let j = i; j < 3; j++) c++;\nconsole.log(c);`, ['6'], 'i = 0: 3, i = 1: 2, i = 2: 1 — jemi 6.'),
      C('Içki siklde break näme edýär?', '', ['Diňe içki sikli togtadýar', 'Iki sikli hem togtadýar', 'Programmany togtadýar', 'Hiç zat'], 0, '')
    ] },
    { id: 'u5l5', title: 'for...in', questions: [
      C(OUT, `const o = { x: 1, y: 2 };\nfor (const k in o) console.log(k + "=" + o[k]);`, ['x=1 y=2', 'x y', '1 2', 'Ýalňyşlyk'], 0, ''),
      C(OUT, `const a = ["a", "b"];\nfor (const i in a) console.log(i);`, ['0 1', 'a b', '1 2', 'Hiç zat'], 0, 'for...in massiwde indeksleri berýär.'),
      C('Massiwiň bahalaryny aýlanmak üçin haýsy has gowy?', '', ['for...of', 'for...in', 'switch', 'if'], 0, ''),
      I(OUT, `const o = { a: 1, b: 2, c: 3 };\nlet s = 0;\nfor (const k in o) s += o[k];\nconsole.log(s);`, ['6'], ''),
      I(OUT, `let n = 0;\nfor (const k in { p: 1, q: 2, r: 3, t: 4 }) n++;\nconsole.log(n);`, ['4'], '')
    ] },
    { id: 'u5l6', title: 'Sikl we massiw', questions: [
      I(OUT, `const a = [4, 9, 2, 7];\nlet m = a[0];\nfor (const x of a) if (x > m) m = x;\nconsole.log(m);`, ['9'], 'Iň uly elementi tapmak.'),
      I(OUT, `const a = [1, 2, 3, 4, 5, 6];\nlet c = 0;\nfor (const x of a) if (x % 2 === 0) c++;\nconsole.log(c);`, ['3'], ''),
      C(OUT, `const a = [1, 2, 3];\nconst b = [];\nfor (let i = a.length - 1; i >= 0; i--) b.push(a[i]);\nconsole.log(b);`, ['[3, 2, 1]', '[1, 2, 3]', '[3]', '[]'], 0, ''),
      I(OUT, `const a = [10, 20, 30];\nlet s = 0;\nfor (let i = 0; i < a.length; i++) s += a[i];\nconsole.log(s / a.length);`, ['20'], 'Ortaça baha.'),
      C(OUT, `const a = ["x", "y"];\na.forEach((v, i) => console.log(i + v));`, ['0x 1y', 'x0 y1', '0 1', 'x y'], 0, 'forEach her element üçin (baha, indeks) berýär.')
    ] },
    { id: 'u5l7', title: 'Sikl we setir', questions: [
      I(OUT, `let c = 0;\nfor (const ch of "salam") if (ch === "a") c++;\nconsole.log(c);`, ['2'], ''),
      I(OUT, `let r = "";\nfor (const ch of "abc") r = ch + r;\nconsole.log(r);`, ['cba'], ''),
      C(OUT, `const s = "JS";\nfor (let i = 0; i < s.length; i++) console.log(s[i]);`, ['J S', 'JS', '0 1', 'Ýalňyşlyk'], 0, ''),
      I(OUT, `let r = "";\nfor (let i = 0; i < 3; i++) r += i;\nconsole.log(r);`, ['012'], 'Setire san goşulanda birleşdirilýär.'),
      I(OUT, `let n = 0;\nfor (const ch of "a1b2c3") if (ch >= "0" && ch <= "9") n++;\nconsole.log(n);`, ['3'], 'Sifrleri sanamak.')
    ] },
    { id: 'u5l8', title: 'Belgili break we continue', questions: [
      C(OUT, `outer: for (let i = 0; i < 3; i++) {\n  for (let j = 0; j < 3; j++) {\n    if (j === 1) continue outer;\n    console.log(i, j);\n  }\n}`, ['0 0, 1 0, 2 0', '0 0, 0 1', '0 0', 'Hiç zat'], 0, 'continue outer daşky sikliň indiki ädimine geçýär.'),
      C(OUT, `outer: for (let i = 0; i < 3; i++) {\n  for (let j = 0; j < 3; j++) {\n    if (i === 1) break outer;\n    console.log(i, j);\n  }\n}`, ['0 0, 0 1, 0 2', '0 0', '0 0, 1 0, 2 0', 'Hiç zat'], 0, 'break outer iki sikli hem togtadýar.'),
      C('Haýsy sikl çäksiz bolar?', '', ['for (let i = 0; i < 5; i--) {}', 'for (let i = 0; i < 5; i++) {}', 'for (let i = 5; i > 0; i--) {}', 'for (let i = 0; i < 0; i++) {}'], 0, 'i kemelýär we hemişe 5-den kiçi bolup galýar.'),
      I(OUT, `let i = 0;\nwhile (true) {\n  i++;\n  if (i === 4) break;\n}\nconsole.log(i);`, ['4'], 'while (true) break bilen togtadylýar.'),
      I(OUT, `let s = 0;\nfor (let i = 0; i < 10; i++) {\n  if (i > 4) break;\n  s += i;\n}\nconsole.log(s);`, ['10'], '0 + 1 + 2 + 3 + 4 = 10.')
    ] },
    { id: 'u5l9', title: 'Sikl bilen algoritmler', questions: [
      I(OUT, `let f = 1;\nfor (let i = 2; i <= 5; i++) f *= i;\nconsole.log(f);`, ['120'], '5! = 120.'),
      I(OUT, `let a = 0, b = 1;\nfor (let i = 0; i < 6; i++) [a, b] = [b, a + b];\nconsole.log(a);`, ['8'], 'Fibonaççi: 0 1 1 2 3 5 8.'),
      I(OUT, `let n = 1234, s = 0;\nwhile (n > 0) {\n  s += n % 10;\n  n = Math.floor(n / 10);\n}\nconsole.log(s);`, ['10'], 'Sifrleriň jemi: 1 + 2 + 3 + 4.'),
      C(OUT, `const n = 7;\nlet prime = n > 1;\nfor (let i = 2; i < n; i++) if (n % i === 0) prime = false;\nconsole.log(prime);`, TF, 0, '7 — ýönekeý san.'),
      I(OUT, `let c = 0;\nfor (let i = 1; i <= 20; i++) if (i % 3 === 0) c++;\nconsole.log(c);`, ['6'], '3, 6, 9, 12, 15, 18.')
    ] },
    { id: 'u5l10', title: 'Gaýtalama: 5-nji bölüm', questions: [
      C(OUT, `for (var i = 0; i < 3; i++) {}\nconsole.log(i);`, ['3', '2', 'ReferenceError', 'undefined'], 0, 'var blok bilen çäklenmeýär.'),
      C(OUT, `for (let i = 0; i < 3; i++) {}\nconsole.log(i);`, ['ReferenceError', '3', '2', 'undefined'], 0, 'let siklden daşarda elýeterli däl.'),
      I(OUT, `let i = 10;\ndo {\n  i++;\n} while (i < 5);\nconsole.log(i);`, ['11'], 'do...while bir gezek hökman işleýär.'),
      I(OUT, `let r = 0;\nfor (let i = 0; i < 5; i += 2) r += i;\nconsole.log(r);`, ['6'], '0 + 2 + 4.'),
      C(OUT, `const a = [1, 2, 3];\nfor (const x of a) {\n  if (x === 2) continue;\n  console.log(x);\n}`, ['1 3', '1 2 3', '1', '2'], 0, '')
    ] }
  ]);

  // ---------- 6. Funksiýalar ----------
  add('u6', [
    { id: 'u6l4', title: 'Funksiýa aňlatmalary we hoisting', questions: [
      C(OUT, `console.log(f());\nfunction f() { return "ok"; }`, ['ok', 'ReferenceError', 'undefined', 'TypeError'], 0, 'Funksiýa yglanlary ýokary galdyrylýar (hoisting).'),
      C(OUT, `console.log(g());\nconst g = () => "ok";`, ['ReferenceError', 'ok', 'undefined', 'TypeError'], 0, 'const bilen yglan edilen funksiýany yglan edilmezden öň ulanyp bolmaýar.'),
      C(OUT, `console.log(typeof h);\nvar h = function () {};`, ['undefined', 'function', 'ReferenceError', 'object'], 0, 'var galdyrylýar, ýöne bahasy şol wagt undefined.'),
      I(OUT, `const kw = function (x) { return x * x; };\nconsole.log(kw(5));`, ['25'], 'Funksiýa aňlatmasy (function expression).'),
      C('JS-de funksiýa näme?', '', ['Birinji derejeli obýekt: üýtgeýäne berlip, argument hökmünde geçirilip bilner', 'Diňe buýruk', 'Primitiw baha', 'Setir'], 0, '')
    ] },
    { id: 'u6l5', title: 'Parametrler', questions: [
      C(OUT, `function f(a, b) {\n  return b;\n}\nconsole.log(f(1));`, ['undefined', '1', 'null', 'Ýalňyşlyk'], 0, 'Berilmedik parametr undefined.'),
      I(OUT, `function f(a, b = a * 2) {\n  return a + b;\n}\nconsole.log(f(3));`, ['9'], 'Adaty baha öňki parametri ulanyp bilýär.'),
      I(OUT, `function f(a, ...r) {\n  return r.length;\n}\nconsole.log(f(1, 2, 3));`, ['2'], ''),
      I(OUT, `function f() {\n  return arguments.length;\n}\nconsole.log(f(5, 6, 7));`, ['3'], 'arguments — adaty funksiýalarda ähli argumentler.'),
      C(OUT, `function f(x) {\n  x = 10;\n}\nlet a = 1;\nf(a);\nconsole.log(a);`, ['1', '10', 'undefined', 'Ýalňyşlyk'], 0, 'Primitiwler baha boýunça geçirilýär.')
    ] },
    { id: 'u6l6', title: 'Ýokary tertipli funksiýalar', questions: [
      I(OUT, `function iki(f) { return f(f(2)); }\nconsole.log(iki(x => x + 3));`, ['8'], 'f(2) = 5, f(5) = 8.'),
      I(OUT, `const kopelt = n => x => x * n;\nconst uc = kopelt(3);\nconsole.log(uc(7));`, ['21'], ''),
      C('Ýokary tertipli funksiýa näme?', '', ['Funksiýany argument hökmünde alýan ýa-da funksiýa gaýtarýan funksiýa', 'Iň uly funksiýa', 'Rekursiw funksiýa', 'Klasyň usuly'], 0, ''),
      C(OUT, `const r = [1, 2, 3].map(String);\nconsole.log(r);`, ['["1", "2", "3"]', '[1, 2, 3]', '"123"', 'Ýalňyşlyk'], 0, 'String funksiýasy argument hökmünde berilýär.'),
      I(OUT, `const birles = (f, g) => x => g(f(x));\nconst h = birles(x => x + 1, x => x * 10);\nconsole.log(h(2));`, ['30'], '(2 + 1) · 10 = 30.')
    ] },
    { id: 'u6l7', title: 'Rekursiýa', questions: [
      I(OUT, `function s(n) {\n  return n === 0 ? 0 : n + s(n - 1);\n}\nconsole.log(s(4));`, ['10'], ''),
      I(OUT, `function p(b, e) {\n  return e === 0 ? 1 : b * p(b, e - 1);\n}\nconsole.log(p(2, 5));`, ['32'], ''),
      C('Rekursiw funksiýada hökman näme bolmaly?', '', ['Esasy (togtaýyş) ýagdaý', 'Sikl', 'Global üýtgeýän', 'return-siz şert'], 0, 'Bolmasa çäksiz rekursiýa: "Maximum call stack size exceeded".'),
      I(OUT, `function fib(n) {\n  return n < 2 ? n : fib(n - 1) + fib(n - 2);\n}\nconsole.log(fib(7));`, ['13'], '0 1 1 2 3 5 8 13.'),
      I(OUT, `function c(n) {\n  return n < 10 ? 1 : 1 + c(Math.floor(n / 10));\n}\nconsole.log(c(98765));`, ['5'], 'Sanyň sifr sany.')
    ] },
    { id: 'u6l8', title: 'IIFE we callback', questions: [
      I(OUT, `(function () {\n  console.log("IIFE");\n})();`, ['IIFE'], 'Derrew çagyrylýan funksiýa.'),
      I(OUT, `const r = ((a, b) => a * b)(4, 5);\nconsole.log(r);`, ['20'], ''),
      I(OUT, `function hasapla(a, b, cb) {\n  return cb(a, b);\n}\nconsole.log(hasapla(9, 3, (x, y) => x - y));`, ['6'], ''),
      C('IIFE näme üçin ulanylýar?', '', ['Aýratyn görnüş meýdany döretmek we global üýtgeýänleri hapalamazlyk üçin', 'Sikl üçin', 'Klass döretmek üçin', 'Ýalňyşlygy tutmak üçin'], 0, ''),
      C(OUT, `[3, 1, 2].forEach(function (x) {\n  if (x === 1) return;\n  console.log(x);\n});`, ['3 2', '3', '3 1 2', 'Hiç zat'], 0, 'forEach-daky return diňe şol çagyryşy gutarýar.')
    ] },
    { id: 'u6l9', title: 'this, call, apply, bind', questions: [
      I(OUT, `const o = {\n  n: 5,\n  f() { return this.n; }\n};\nconsole.log(o.f());`, ['5'], ''),
      C(OUT, `const o = {\n  n: 5,\n  f: () => this.n\n};\nconsole.log(o.f());`, ['undefined', '5', 'null', 'Ýalňyşlyk'], 0, 'Ok-funksiýanyň öz this-i ýok, ol daşky this-i ulanýar.'),
      I(OUT, `function salam() { return "Salam, " + this.at; }\nconst f = salam.bind({ at: "Aý" });\nconsole.log(f());`, ['Salam, Aý'], 'bind this-i berkidilen täze funksiýa döredýär.'),
      I(OUT, `function jem(a, b) { return this.k + a + b; }\nconsole.log(jem.call({ k: 1 }, 2, 3));`, ['6'], 'call this-i we argumentleri berýär.'),
      I(OUT, `function jem(a, b) { return this.k * (a + b); }\nconsole.log(jem.apply({ k: 2 }, [3, 4]));`, ['14'], 'apply argumentleri massiw görnüşinde alýar.')
    ] },
    { id: 'u6l10', title: 'Gaýtalama: 6-njy bölüm', questions: [
      I(OUT, `function f() {\n  let n = 0;\n  return { inc: () => ++n, get: () => n };\n}\nconst c = f();\nc.inc(); c.inc(); c.inc();\nconsole.log(c.get());`, ['3'], 'Closure ýapyk ýagdaýy saklaýar.'),
      C(OUT, `const f = (a, b) => a + b;\nconsole.log(f.length);`, ['2', '0', 'undefined', '1'], 0, 'Funksiýanyň length-i — parametrleriň sany.'),
      C(OUT, `function f() { return; 5; }\nconsole.log(f());`, ['undefined', '5', 'null', 'Ýalňyşlyk'], 0, 'return-dan soňky kod ýerine ýetirilmeýär.'),
      I(OUT, `let x = 10;\nfunction f() { return x; }\nx = 20;\nconsole.log(f());`, ['20'], 'Funksiýa üýtgeýäniň häzirki bahasyny okaýar.'),
      C(OUT, `const fns = [];\nfor (let i = 0; i < 3; i++) fns.push(() => i);\nconsole.log(fns[1]());`, ['1', '3', '0', 'undefined'], 0, 'let her ädimde täze baglanyşyk döredýär.')
    ] }
  ]);

  // ---------- 7. Massiwler ----------
  add('u7', [
    { id: 'u7l4', title: 'Goşmak we aýyrmak', questions: [
      C(OUT, `const a = [1, 2, 3];\na.shift();\nconsole.log(a);`, ['[2, 3]', '[1, 2]', '[1, 2, 3]', '1'], 0, 'shift ilkinji elementi aýyrýar.'),
      C(OUT, `const a = [2, 3];\na.unshift(1);\nconsole.log(a);`, ['[1, 2, 3]', '[2, 3, 1]', '3', '[1]'], 0, ''),
      C(OUT, `const a = [1, 2, 3, 4];\na.splice(1, 2);\nconsole.log(a);`, ['[1, 4]', '[2, 3]', '[1, 2]', '[3, 4]'], 0, 'splice(1, 2): 1-nji indeksden başlap 2 element aýyrýar.'),
      C(OUT, `const a = [1, 4];\na.splice(1, 0, 2, 3);\nconsole.log(a);`, ['[1, 2, 3, 4]', '[1, 4, 2, 3]', '[2, 3]', '[1, 4]'], 0, 'splice elementleri goşmak üçin hem ulanylýar.'),
      I(OUT, `const a = [5, 6];\nconsole.log(a.push(7));`, ['3'], 'push täze uzynlygy gaýtarýar.')
    ] },
    { id: 'u7l5', title: 'Gözleg usullary', questions: [
      I(OUT, `console.log([5, 8, 12].findIndex(x => x > 6));`, ['1'], ''),
      C(OUT, `console.log([1, 2, 3].some(x => x > 2));`, TF, 0, 'some — iň bolmanda biri şerte laýyk bolsa true.'),
      C(OUT, `console.log([1, 2, 3].every(x => x > 2));`, TF, 1, 'every — ählisi laýyk bolsa true.'),
      C(OUT, `console.log([1, 2, 3].find(x => x > 5));`, ['undefined', '-1', 'null', '[]'], 0, ''),
      I(OUT, `console.log([1, 2, 3, 2].lastIndexOf(2));`, ['3'], '')
    ] },
    { id: 'u7l6', title: 'sort we reverse', questions: [
      C(OUT, `const a = [10, 9, 1];\na.sort();\nconsole.log(a);`, ['[1, 10, 9]', '[1, 9, 10]', '[10, 9, 1]', '[9, 10, 1]'], 0, 'sort adaty ýagdaýda setir hökmünde tertipleýär: "10" < "9".'),
      C(OUT, `const a = [10, 9, 1];\na.sort((x, y) => x - y);\nconsole.log(a);`, ['[1, 9, 10]', '[1, 10, 9]', '[10, 9, 1]', '[9, 1, 10]'], 0, 'San boýunça tertiplemek üçin deňeşdiriji funksiýa gerek.'),
      C(OUT, `const a = [1, 2, 3];\na.reverse();\nconsole.log(a);`, ['[3, 2, 1]', '[1, 2, 3]', '[3]', 'Ýalňyşlyk'], 0, ''),
      C(OUT, `const a = [3, 1, 2];\nconst b = [...a].sort();\nconsole.log(a);`, ['[3, 1, 2]', '[1, 2, 3]', '[]', 'Ýalňyşlyk'], 0, 'Göçürme tertiplendi, asyl massiw üýtgemedi.'),
      C(OUT, `const a = [5, 1, 4];\na.sort((x, y) => y - x);\nconsole.log(a[0]);`, ['5', '1', '4', 'undefined'], 0, 'y - x — kemelýän tertip.')
    ] },
    { id: 'u7l7', title: 'Köp ölçegli massiwler', questions: [
      I(OUT, `const m = [[1, 2], [3, 4]];\nconsole.log(m[1][0]);`, ['3'], ''),
      I(OUT, `const m = [[1, 2, 3], [4, 5, 6]];\nconsole.log(m.length);`, ['2'], ''),
      I(OUT, `const m = [[1, 2], [3, 4]];\nlet s = 0;\nfor (const row of m) for (const x of row) s += x;\nconsole.log(s);`, ['10'], ''),
      C(OUT, `console.log([[1, 2], [3]].flat());`, ['[1, 2, 3]', '[[1, 2], [3]]', '[1, [2, 3]]', '3'], 0, ''),
      I(OUT, `const m = [[1, 2], [3, 4]];\nconsole.log(m.map(r => r[1]).join(","));`, ['2,4'], 'Her setiriň ikinji elementi.')
    ] },
    { id: 'u7l8', title: 'Spread we destrukturlaşdyrma', questions: [
      I(OUT, `const [a, , c] = [1, 2, 3];\nconsole.log(c);`, ['3'], 'Elementi geçmek üçin boş ýer goýulýar.'),
      C(OUT, `const [first, ...rest] = [1, 2, 3];\nconsole.log(rest);`, ['[2, 3]', '[1]', '2', '[1, 2, 3]'], 0, ''),
      C(OUT, `let a = 1, b = 2;\n[a, b] = [b, a];\nconsole.log(a, b);`, ['2 1', '1 2', '2 2', 'Ýalňyşlyk'], 0, 'Bahalary çalyşmagyň gysga usuly.'),
      I(OUT, `console.log(Math.max(...[3, 7, 2]));`, ['7'], 'Spread massiwi aýry argumentlere bölýär.'),
      C(OUT, `const a = [1, 2];\nconst b = a;\nconst c = [...a];\nb.push(3);\nconsole.log(c.length);`, ['2', '3', '1', 'undefined'], 0, 'c — aýry göçürme, b bolsa şol bir massiw.')
    ] },
    { id: 'u7l9', title: 'Array.from, fill, at, concat', questions: [
      C(OUT, `console.log(Array.from("abc"));`, ['["a", "b", "c"]', '["abc"]', '"abc"', '3'], 0, ''),
      C(OUT, `console.log(new Array(3).fill(0));`, ['[0, 0, 0]', '[3]', '[0]', '[]'], 0, ''),
      C(OUT, `console.log(Array.from({ length: 3 }, (_, i) => i * 2));`, ['[0, 2, 4]', '[2, 4, 6]', '[0, 1, 2]', '[]'], 0, ''),
      C(OUT, `console.log([1, 2, 3].at(-1));`, ['3', '1', 'undefined', '-1'], 0, 'at(-1) — soňky element.'),
      C(OUT, `console.log([1, 2].concat([3], 4));`, ['[1, 2, 3, 4]', '[1, 2, [3], 4]', '[[1, 2], [3], 4]', '"1234"'], 0, '')
    ] },
    { id: 'u7l10', title: 'Gaýtalama: 7-nji bölüm', questions: [
      I(OUT, `const r = [1, 2, 3, 4]\n  .filter(x => x % 2 === 0)\n  .map(x => x * x)\n  .reduce((a, x) => a + x, 0);\nconsole.log(r);`, ['20'], '2² + 4² = 4 + 16 = 20.'),
      C(OUT, `const a = [1, 2, 3];\na.length = 1;\nconsole.log(a);`, ['[1]', '[1, 2, 3]', '[]', 'Ýalňyşlyk'], 0, 'length kiçeldilse massiw gysgalýar.'),
      C(OUT, `console.log([1, 2, 3] == [1, 2, 3]);`, TF, 1, 'Massiwler salgylanma boýunça deňeşdirilýär.'),
      I(OUT, `const a = ["b", "a", "c"];\nconsole.log(a.sort().join(""));`, ['abc'], ''),
      C(OUT, `const c = ["a", "b", "a"].reduce((o, x) => {\n  o[x] = (o[x] || 0) + 1;\n  return o;\n}, {});\nconsole.log(c.a);`, ['2', '1', '3', 'undefined'], 0, 'reduce bilen sanamak.')
    ] }
  ]);

  // ---------- 8. Obýektler ----------
  add('u8', [
    { id: 'u8l4', title: 'Object usullary', questions: [
      C(OUT, `console.log(Object.keys({ a: 1, b: 2 }));`, ['["a", "b"]', '[1, 2]', '2', '{a, b}'], 0, ''),
      C(OUT, `console.log(Object.entries({ x: 1 }));`, ['[["x", 1]]', '["x", 1]', '{x: 1}', '[1]'], 0, ''),
      C(OUT, `const o = Object.assign({}, { a: 1 }, { b: 2 });\nconsole.log(o);`, ['{ a: 1, b: 2 }', '{ a: 1 }', '{ b: 2 }', '{}'], 0, ''),
      I(OUT, `console.log(Object.keys({ a: 1, b: 2, c: 3 }).length);`, ['3'], 'Obýektiň häsiýet sany.'),
      C(OUT, `const o = Object.fromEntries([["a", 1], ["b", 2]]);\nconsole.log(o.b);`, ['2', '1', 'undefined', '["b", 2]'], 0, '')
    ] },
    { id: 'u8l5', title: 'Obýektleri göçürmek', questions: [
      C(OUT, `const a = { x: 1 };\nconst b = { ...a };\nb.x = 2;\nconsole.log(a.x);`, ['1', '2', 'undefined', 'Ýalňyşlyk'], 0, 'Spread täze obýekt döredýär.'),
      C(OUT, `const a = { p: { x: 1 } };\nconst b = { ...a };\nb.p.x = 5;\nconsole.log(a.p.x);`, ['5', '1', 'undefined', 'Ýalňyşlyk'], 0, 'Spread ýüzleý (shallow) göçürýär: içki obýekt umumy galýar.'),
      C(OUT, `const a = { p: { x: 1 } };\nconst b = structuredClone(a);\nb.p.x = 5;\nconsole.log(a.p.x);`, ['1', '5', 'undefined', 'Ýalňyşlyk'], 0, 'structuredClone çuňňur (deep) göçürme döredýär.'),
      C(OUT, `console.log({ a: 1 } === { a: 1 });`, TF, 1, 'Iki aýry obýekt — dürli salgylanmalar.'),
      C(OUT, `const o = { a: 1, a: 2 };\nconsole.log(o.a);`, ['2', '1', '[1, 2]', 'Ýalňyşlyk'], 0, 'Gaýtalanýan açarda soňky baha galýar.')
    ] },
    { id: 'u8l6', title: 'Getter we setter', questions: [
      I(OUT, `const u = {\n  at: "Aý", fam: "Ataýewa",\n  get doly() { return this.at + " " + this.fam; }\n};\nconsole.log(u.doly);`, ['Aý Ataýewa'], 'get — häsiýet ýaly okalýan usul.'),
      I(OUT, `const t = {\n  _c: 0,\n  set c(v) { this._c = v < 0 ? 0 : v; },\n  get c() { return this._c; }\n};\nt.c = -5;\nconsole.log(t.c);`, ['0'], 'set bahany barlap biler.'),
      C('Getter nähili çagyrylýar? (u.doly ýa-da u.doly())', '', ['Häsiýet ýaly: u.doly', 'Funksiýa ýaly: u.doly()', 'Diňe new bilen', 'Getter çagyrylmaýar'], 0, ''),
      C(OUT, `const o = { get x() { return 1; } };\no.x = 5;\nconsole.log(o.x);`, ['1', '5', 'undefined', 'Ýalňyşlyk'], 0, 'Setter ýok bolsa, baha berlişi äsgerilmeýär (berk tertipde ýalňyşlyk).'),
      C('Bu koddan soň haýsy dogry?', `const k = "reng";\nconst o = { [k]: "gök" };`, ['o.reng === "gök"', 'o.k === "gök"', 'o["k"] === "gök"', 'Ýalňyşlyk'], 0, '[k] — hasaplanýan häsiýet ady.')
    ] },
    { id: 'u8l7', title: 'JSON', questions: [
      C(OUT, `console.log(JSON.stringify({ a: 1, b: "x" }));`, ['{"a":1,"b":"x"}', "{a:1,b:'x'}", '{ a: 1, b: "x" }', '[object Object]'], 0, ''),
      I(OUT, `const o = JSON.parse('{"n": 5}');\nconsole.log(o.n + 1);`, ['6'], 'JSON.parse setiri obýekte öwürýär.'),
      C('JSON-da haýsy baha bolup bilmez?', '', ['function', 'string', 'number', 'null'], 0, 'JSON diňe maglumat saklaýar, funksiýalary däl.'),
      C(OUT, `console.log(JSON.stringify({ a: undefined, b: 1 }));`, ['{"b":1}', '{"a":undefined,"b":1}', '{"a":null,"b":1}', 'Ýalňyşlyk'], 0, 'undefined häsiýetler taşlanýar.'),
      C(OUT, `console.log(JSON.stringify([1, "a", true]));`, ['[1,"a",true]', '[1, a, true]', "['1','a','true']", '1,a,true'], 0, '')
    ] },
    { id: 'u8l8', title: '?. we gysga häsiýetler', questions: [
      C(OUT, `const u = { adres: { seher: "Mary" } };\nconsole.log(u.adres?.seher);`, ['Mary', 'undefined', 'Ýalňyşlyk', 'null'], 0, ''),
      C(OUT, `const u = {};\nconsole.log(u.adres?.seher);`, ['undefined', 'TypeError', 'null', '""'], 0, ''),
      C(OUT, `const u = {};\nconsole.log(u.adres.seher);`, ['TypeError', 'undefined', 'null', '""'], 0, 'undefined-iň häsiýetini okamak ýalňyşlyk döredýär.'),
      C(OUT, `const o = { f: null };\nconsole.log(o.f?.());`, ['undefined', 'TypeError', 'null', 'f'], 0, '?.() funksiýa ýok bolsa ony çagyrmaýar.'),
      I(OUT, `const at = "x", baha = 5;\nconst o = { at, baha };\nconsole.log(o.at + o.baha);`, ['x5'], 'Gysga ýazgy: { at } — bu { at: at } diýmek.')
    ] },
    { id: 'u8l9', title: 'freeze, seal we prototip', questions: [
      C(OUT, `const o = Object.freeze({ a: 1 });\no.a = 2;\nconsole.log(o.a);`, ['1', '2', 'undefined', 'null'], 0, 'freeze obýekti üýtgedip bolmaýan edýär.'),
      C(OUT, `const o = { a: 1 };\nconsole.log(o.hasOwnProperty("a"), o.hasOwnProperty("toString"));`, ['true false', 'true true', 'false false', 'false true'], 0, 'toString prototipden gelýär.'),
      I(OUT, `const ata = { salam() { return "Salam!"; } };\nconst ogul = Object.create(ata);\nconsole.log(ogul.salam());`, ['Salam!'], 'Object.create berlen prototipli obýekt döredýär.'),
      C('Obýektiň prototipini almak üçin haýsy usul?', '', ['Object.getPrototypeOf(o)', 'o.prototype()', 'Object.parent(o)', 'o.super'], 0, ''),
      C(OUT, `const o = { a: 1 };\nObject.seal(o);\no.b = 2;\no.a = 5;\nconsole.log(o.a, o.b);`, ['5 undefined', '1 2', '5 2', '1 undefined'], 0, 'seal: täze häsiýet goşup bolmaýar, bar bolanlary üýtgedip bolýar.')
    ] },
    { id: 'u8l10', title: 'Gaýtalama: 8-nji bölüm', questions: [
      I(OUT, `const { a, ...beyleki } = { a: 1, b: 2, c: 3 };\nconsole.log(Object.keys(beyleki).length);`, ['2'], ''),
      I(OUT, `const t = [\n  { at: "A", bal: 70 },\n  { at: "B", bal: 90 }\n];\nconsole.log(t.find(x => x.bal > 80).at);`, ['B'], ''),
      C(OUT, `const o = { n: 1 };\nfunction f(x) { x.n = 99; }\nf(o);\nconsole.log(o.n);`, ['99', '1', 'undefined', 'Ýalňyşlyk'], 0, 'Obýektler salgylanma boýunça geçirilýär.'),
      I(OUT, `const o = { a: { b: { c: 42 } } };\nconst { a: { b: { c } } } = o;\nconsole.log(c);`, ['42'], 'Içki destrukturlaşdyrma.'),
      C(OUT, `const o = { x: 1 };\nconst k = "x";\nconsole.log(o.k, o[k]);`, ['undefined 1', '1 1', '1 undefined', 'Ýalňyşlyk'], 0, 'o.k — "k" atly häsiýet, o[k] — üýtgeýäniň bahasy boýunça.')
    ] }
  ]);
})();
