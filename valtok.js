// Valida data/sent-tokens-*.js e lista as próximas frases sem tokens.
//   node valtok.js              valida tudo (deve terminar com "erros 0")
//   node valtok.js --next 80    mostra as próximas 80 frases do N5 sem tokens (ou --nivel N4 / N3)
// Formato: SENTTOK["frase"] = [[palavra, leitura, significado], ...]; leitura vazia = a própria palavra;
// significado vazio só vale para função gramatical (FW em data/fw.js) ou palavra que está em data/words.js.
const fs = require("fs"), path = require("path");
const ld = (f, n) => new Function(fs.readFileSync(path.join(__dirname, f), "utf8") + ";return " + n)();
const S = ld("data/sentences.js", "SENTENCES"), C = ld("data/words.js", "CATEGORIES"), KDHL = ld("data/highlight.js", "KDHL");
const KDFW = require("./data/fw.js");
global.SENTTOK = {};
const files = fs.readdirSync(path.join(__dirname, "data")).filter(f => /^sent-tokens-.*\.js$/.test(f)).sort();
for (const f of files) new Function(fs.readFileSync(path.join(__dirname, "data", f), "utf8"))();
const T = global.SENTTOK;
const hira = x => x.replace(/[\u30a1-\u30f6]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
const PUN = /[、。？?！!「」『』…・,. \u3000]/;
const strip = x => x.replace(new RegExp(PUN.source, "g"), "");
const widx = new Set(); for (const c of C) for (const w of c.words) widx.add(w[0] + "|" + hira(w[1]));
const bySent = new Map(S.map(s => [s[0], s]));
const arg = n => { const i = process.argv.indexOf(n); return i < 0 ? null : process.argv[i + 1]; };

function order(group) {
  const bykey = {}; S.forEach((s, i) => { for (const k of s[3] || []) (bykey[k] = bykey[k] || []).push(i); });
  const seen = new Set(), out = [];
  for (const c of C.filter(c => c.group === group)) for (const w of c.words) for (const i of bykey[w[0] + "|" + w[1]] || []) if (!seen.has(i)) { seen.add(i); out.push(i); }
  return out;
}
if (process.argv.includes("--next")) {
  const lv = (arg("--nivel") || "N5").toUpperCase(), n = +arg("--next") || 80;
  const lista = order("JLPT " + lv).filter(i => !T[S[i][0]]).slice(0, n);
  console.log(`# ${lv}: ${lista.length} frases sem tokens (japonês | kana | português | palavras)`);
  for (const i of lista) console.log(S[i].slice(0, 3).join(" | ") + " | " + (S[i][3] || []).join(","));
  process.exit(0);
}

let erros = 0, avisos = 0, tokens = 0;
const err = m => { erros++; console.log("ERRO  " + m); }, warn = m => { avisos++; console.log("aviso " + m); };
for (const [jp, list] of Object.entries(T)) {
  const s = bySent.get(jp);
  if (!s) { err(`frase fora de sentences.js: ${jp}`); continue; }
  if (!Array.isArray(list) || !list.length) { err(`sem tokens: ${jp}`); continue; }
  const surf = list.map(t => t[0]).join(""), rd = list.map(t => t[1] || t[0]).join("");
  if (surf !== strip(jp)) err(`palavras não reproduzem a frase: ${jp}\n      tokens: ${surf}`);
  if (hira(strip(rd)) !== hira(strip(s[1]))) err(`leituras não batem com o kana: ${jp}\n      tokens: ${rd}\n      kana:   ${strip(s[1])}`);
  let pos = 0; const rg = [];
  for (const t of list) {
    tokens++;
    if (typeof t[0] !== "string" || !t[0]) { err(`token vazio em ${jp}`); continue; }
    const r = t[1] || t[0], m = t[2] || "";
    while (pos < jp.length && PUN.test(jp[pos])) pos++;
    rg.push([pos, pos + t[0].length, t[0]]); pos += t[0].length;
    if (!m && !KDFW.FW[t[0]] && !widx.has(t[0] + "|" + hira(r))) err(`"${t[0]}" (${r}) sem significado e fora de words.js/FW: ${jp}`);
    if (m.length > 45) warn(`significado longo (${m.length}): "${t[0]}" em ${jp}`);
    if (/[;]/.test(m)) warn(`";" no significado de "${t[0]}"`);
  }
  for (const k of s[3] || []) {
    for (const [a, b] of KDHL.find(jp, k) || []) for (const [ta, tb, tt] of rg)
      if (ta < b && tb > a && (ta < a || tb > b) && /[\u4e00-\u9faf0-9]/.test(tt.slice(0, Math.max(0, a - ta)) + tt.slice(Math.max(0, b - ta)))) warn(`token "${tt}" cruza a marca de ${k.split("|")[0]} em ${jp}`);
  }
}
const cob = {}; for (const lv of ["N5", "N4", "N3"]) { const o = order("JLPT " + lv); cob[lv] = `${o.filter(i => T[S[i][0]]).length}/${o.length}`; }
console.log(`arquivos ${files.length}, frases ${Object.keys(T).length}, tokens ${tokens}, cobertura ${JSON.stringify(cob)}`);
console.log(`avisos ${avisos}, erros ${erros}`);
process.exit(erros ? 1 : 0);
