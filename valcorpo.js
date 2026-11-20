// Valida o jogo Karada Meguri: data/body.js contra data/words.js e data/sentences.js.
// Uso: node valcorpo.js   (sai com código 1 se houver erro)
const fs = require("fs");
const C = new Function(fs.readFileSync("data/words.js", "utf8") + ";return CATEGORIES")();
const S = new Function(fs.readFileSync("data/sentences.js", "utf8") + ";return SENTENCES")();
const B = require("./data/body.js");
let bad = 0;
const err = (...a) => { bad++; console.log("ERRO", ...a); };

const W = new Map();
C.forEach(c => c.words.forEach(w => { const k = w[0] + "|" + w[1]; if (!W.has(k)) W.set(k, { cat: c.id, w }); }));
const withSentence = new Set(S.flatMap(s => s[3]));
const byKey = new Map();
const ok = (v, ...m) => { if (!v) err(...m); };

for (const z of B.ZONES) {
  if (byKey.has(z.k)) err("zona repetida", z.k); byKey.set(z.k, z);
  const e = W.get(z.k);
  if (!e) { err("palavra fora do words.js", z.k); continue; }
  ok(/^[ぁ-んー]+$/.test(e.w[1]), "leitura não é hiragana", z.k);
  ok(withSentence.has(z.k), "palavra sem frase de exemplo", z.k);
  ok(["f", "b", "r", "o"].includes(z.s), "cena inválida", z.k, z.s);
  ok(typeof z.d === "string" && /^M[-\d. ]/.test(z.d) && z.d.endsWith("z") || z.d.endsWith("Z"), "caminho suspeito", z.k);
  ok(z.bb[0] >= 0 && z.bb[1] >= 0 && z.bb[2] <= 400 && z.bb[3] <= 600, "zona fora do quadro 400x600", z.k, z.bb);
  ok((z.bb[2] - z.bb[0]) >= 10 && (z.bb[3] - z.bb[1]) >= 8, "zona pequena demais para tocar", z.k, z.bb);
  if (z.up) {
    const p = byKey.get(z.up) || B.ZONES.find(q => q.k === z.up);
    if (!p) err("pai inexistente", z.k, z.up); else ok(p.s === z.s, "pai em outra cena", z.k, z.up);
  }
}
// ciclos na cadeia de partes
for (const z of B.ZONES) { let n = 0, p = z.up; while (p && n < 10) { p = (byKey.get(p) || {}).up; n++; } ok(n < 10, "ciclo em 'up'", z.k); }

const FALLBACK = ["顔|かお"]; // completa as alternativas com palavras do corpo (ver distractors() em karada.html)
// grupos (vistas): leituras e significados únicos, e alternativas suficientes
const groups = {};
B.ZONES.forEach(z => (groups[B.GROUP[z.s]] = groups[B.GROUP[z.s]] || []).push(z));
const anc = z => { const o = []; let p = z.up; while (p) { o.push(p); p = (byKey.get(p) || {}).up; } return o; };
const related = (a, b) => a === b || anc(a).includes(b.k) || anc(b).includes(a.k);
for (const [g, zs] of Object.entries(groups)) {
  const kana = new Set(), pt = new Set();
  zs.forEach(z => {
    const [kj, ka, , p] = W.get(z.k).w;
    if (kana.has(ka)) err("leitura repetida no grupo", g, ka); kana.add(ka);
    if (pt.has(p)) err("significado repetido no grupo", g, p); pt.add(p);
    const cand = zs.filter(x => !related(x, z) && W.get(x.k).w[1] !== ka && W.get(x.k).w[3] !== p);
    if (cand.length < 3 && !FALLBACK.includes(z.k)) err("poucas alternativas no grupo", z.k, cand.length);
  });
}
const nOf = { corpo: 0, rosto: 0, orgaos: 0 };
B.ZONES.forEach(z => nOf[B.GROUP[z.s]]++);
ok(nOf.corpo >= 10 && nOf.rosto >= 10 && nOf.orgaos >= 8, "poucas zonas por vista", nOf);

// cobertura: tudo do lote 6 e da categoria "corpo" tem zona (menos as exclusões declaradas)
const need = [...C.find(c => c.id === "corpo").words, ...C.find(c => c.id === "corpo-orgaos").words].map(w => w[0] + "|" + w[1]);
need.forEach(k => { if (!byKey.has(k) && !B.EXCLUIDAS.includes(k)) err("palavra do corpo sem zona nem exclusão", k); });
B.EXCLUIDAS.forEach(k => { ok(W.has(k), "exclusão inexistente no words.js", k); ok(!byKey.has(k), "exclusão que também tem zona", k); });
["胸|むね", "髪|かみ"].forEach(k => ok(byKey.has(k), "zona esperada ausente", k));

// enfeites
B.DECOR.forEach(d => ok(d.d && d.bb[0] >= 0 && d.bb[2] <= 400 && d.bb[3] <= 600, "enfeite fora do quadro", d.s, d.c));

// a cena de costas só tem zonas próprias; a cena das zonas de costas não repete as da frente
const keysF = B.ZONES.filter(z => z.s === "f").map(z => z.k), keysB = B.ZONES.filter(z => z.s === "b").map(z => z.k);
keysB.forEach(k => ok(!keysF.includes(k), "zona nas duas cenas", k));

console.log("zonas", B.ZONES.length, "| corpo", nOf.corpo, "rosto", nOf.rosto, "órgãos", nOf.orgaos, "| enfeites", B.DECOR.length, "| erros", bad);
process.exit(bad ? 1 : 0);
