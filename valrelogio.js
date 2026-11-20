// node valrelogio.js [-t]   (-t imprime as tabelas de leitura: horas, minutos e casos difíceis)
const R = require("./data/relogio.js");
const N = require("./data/numeros-ja.js");
let erros = 0;
const err = m => { erros++; if (erros <= 40) console.log("ERRO", m); };

// 1) tabelas aprovadas: HORAS (1 a 12) e MINUTOS (0 a 20, mais 30, 40, 50): [n, leitura canônica, variantes aceitas]
const HORAS = ["いちじ", "にじ", "さんじ", "よじ", "ごじ", "ろくじ", "しちじ", "はちじ", "くじ", "じゅうじ", "じゅういちじ", "じゅうにじ"];
const MIN = {
  0: ["", ["ちょうど"]], 1: ["いっぷん"], 2: ["にふん"], 3: ["さんぷん"], 4: ["よんぷん"], 5: ["ごふん"], 6: ["ろっぷん"],
  7: ["ななふん", ["しちふん"]], 8: ["はっぷん", ["はちふん"]], 9: ["きゅうふん"], 10: ["じゅっぷん", ["じっぷん"]],
  11: ["じゅういっぷん"], 12: ["じゅうにふん"], 13: ["じゅうさんぷん"], 14: ["じゅうよんぷん"], 15: ["じゅうごふん"],
  16: ["じゅうろっぷん"], 17: ["じゅうななふん", ["じゅうしちふん"]], 18: ["じゅうはっぷん", ["じゅうはちふん"]], 19: ["じゅうきゅうふん"],
  20: ["にじゅっぷん", ["にじっぷん"]], 30: ["さんじゅっぷん", ["さんじっぷん"]], 40: ["よんじゅっぷん", ["よんじっぷん"]], 50: ["ごじゅっぷん", ["ごじっぷん"]],
};
if (process.argv.includes("-t")) {
  HORAS.forEach((r, i) => console.log(String(i + 1).padStart(2) + "時", r));
  for (const m in MIN) console.log(String(m).padStart(2) + "分", (MIN[m][0] || "(só a hora)") + (MIN[m][1] ? "  | também: " + MIN[m][1].join(", ") : ""));
}
HORAS.forEach((r, i) => { if (R.hourReading(i + 1) !== r) err(`hourReading(${i + 1}) = ${R.hourReading(i + 1)}, esperado ${r}`); });
for (const m in MIN) {
  const v = R.minuteVariants(+m), [canon, alts] = MIN[m];
  if (v[0] !== canon) err(`minuteVariants(${m})[0] = ${v[0]}, esperado ${canon}`);
  (alts || []).forEach(a => { if (+m === 0) return; if (!v.includes(a)) err(`variante faltando: ${m}分 ${a}`); });
}
// compostos 21 a 59: dezena + unidade, conferido por expressão regular
for (let m = 21; m <= 59; m++) {
  if (m % 10 === 0) continue;
  const re = /^(にじゅう|さんじゅう|よんじゅう|ごじゅう)(いっぷん|にふん|さんぷん|よんぷん|ごふん|ろっぷん|ななふん|はっぷん|きゅうふん)$/;
  if (!re.test(R.minuteVariants(m)[0])) err(`composto ${m}: ${R.minuteVariants(m)[0]}`);
}

// 2) leituras PROIBIDAS (nunca podem passar) e variantes aceitas, em horários completos
const T = (h, m) => ({ h, m });
const NO = [
  [T(4, 0), ["しじ", "よんじ"]], [T(7, 0), ["ななじ"]], [T(9, 0), ["きゅうじ"]], [T(3, 3), ["さんじさんふん"]], [T(3, 1), ["さんじいちふん", "さんじいっふん"]],
  [T(3, 6), ["さんじろくふん", "さんじろくぷん"]], [T(3, 4), ["さんじしふん", "さんじよんふん"]], [T(3, 8), ["さんじはちぷん"]], [T(3, 10), ["さんじじゅうふん"]],
  [T(3, 30), ["さんじさんじゅうふん"]], [T(3, 0), ["さんじぷん", "さんじ0ふん"]], [T(3, 15), ["さんじじゅうごぷん", "さんじいちじゅうごふん"]], [T(12, 0), ["じゅうにんじ"]],
];
for (const [t, rs] of NO) for (const r of rs) if (R.readings(t).has(r)) err(`leitura proibida aceita: ${t.h}:${t.m} ${r}`);
const OKS = [
  [T(3, 0), ["さんじ", "さんじちょうど"]], [T(3, 30), ["さんじはん", "さんじさんじゅっぷん", "さんじさんじっぷん"]], [T(7, 7), ["しちじななふん", "しちじしちふん"]],
  [T(10, 18), ["じゅうじじゅうはっぷん", "じゅうじじゅうはちふん"]], [T(12, 20), ["じゅうにじにじゅっぷん", "じゅうにじにじっぷん"]],
];
for (const [t, rs] of OKS) for (const r of rs) if (!R.readings(t).has(r)) err(`variante aceita faltando: ${t.h}:${t.m} ${r}`);
if (R.reading(T(3, 30)) !== "さんじはん") err("30 min: canônica deve ser はん");
if (R.kanji(T(3, 30)) !== "三時半" || R.kanji(T(3, 0)) !== "三時" || R.kanji(T(12, 5)) !== "十二時五分") err("kanji básico");
if (R.kanji(T(15, 20), { ampm: true }) !== "午後三時二十分" || R.reading(T(9, 45), { ampm: true }) !== "ごぜんくじよんじゅうごふん") err("午前/午後");

// 3) ida e volta nos 720 horários (níveis 1 a 4) e nos 22 x 12 do nível 5, em cada forma de resposta
const KA = { "い": "i", "ち": "chi", "に": "ni", "さ": "sa", "よ": "yo", "ご": "go", "ろ": "ro", "く": "ku", "な": "na", "し": "shi", "は": "ha", "ふ": "fu", "ぷ": "pu", "き": "ki", "じ": "ji", "せ": "se", "ぜ": "ze", "お": "o", "ひ": "hi", "う": "u", "ど": "do", "ぱ": "pa", "ぴ": "pi", "ぽ": "po", "つ": "tsu", "あ": "a", "え": "e", "る": "ru", "ん": "N", "ゅ": "XU", "ょ": "XO", "ゃ": "XA" };
function romaji(k) { // hiragana -> romaji de teste (n' antes de vogal/y; っ dobra a consoante)
  let o = "", dbl = false;
  for (let i = 0; i < k.length; i++) {
    const c = k[i], nx = k[i + 1];
    if (c === "っ") { dbl = true; continue; }
    let r;
    if (nx && "ゅょゃ".includes(nx)) { const base = { "じ": "j", "き": "ky", "ち": "ch" }[c]; r = base + { "ゅ": "u", "ょ": "o", "ゃ": "a" }[nx]; i++; }
    else r = KA[c];
    if (r === undefined) throw new Error("sem romaji para " + c);
    if (r === "N") { const f = k[i + 1]; r = f && /[あいうえおやゆよ]/.test(f) ? "n'" : "n"; }
    if (dbl) { r = r[0] + r; dbl = false; }
    o += r;
  }
  return o;
}
let total = 0;
for (let level = 1; level <= 5; level++) {
  const o = { ampm: level === 5 };
  const lista = R.all(level);
  const esperado = [12, 36, 144, 720, 264][level - 1];
  if (lista.length !== esperado) err(`nível ${level}: ${lista.length} horários, esperado ${esperado}`);
  for (const t of lista) {
    total++;
    const forms = [R.reading(t, o), R.kanji(t, o), R.digits(t, o), romaji(R.reading(t, o)), R.reading(t, o).toUpperCase === undefined ? "" : romaji(R.reading(t, o)).toUpperCase(), " " + R.kanji(t, o).split("").join(" ") + " "];
    for (const f of forms) { if (!f) continue; const r = R.check(t, f, o); if (!r.ok) err(`n${level} ${t.h}:${t.m} "${f}" recusado (${r.why})`); }
    // todas as leituras aceitas passam (com 午前/午後 no nível 5)
    for (const v of R.readings(t)) { const f = (o.ampm ? (t.h >= 12 ? "ごご" : "ごぜん") : "") + v; if (!R.check(t, f, o).ok) err(`n${level} ${t.h}:${t.m} variante "${f}" recusada`); }
    // horários vizinhos errados nunca passam
    const vizinhos = [{ h: t.h, m: (t.m + 5) % 60 }, { h: t.h === 12 ? 1 : (t.h % 12) + 1, m: t.m }].filter(v => v.h !== 12 || level !== 5);
    for (const v of vizinhos) { if (v.h === t.h && v.m === t.m) continue; if (level === 5 && v.h > 12 !== t.h > 12) continue; const f = R.reading(v, o); if (f !== R.reading(t, o) && R.check(t, f, o).ok) err(`n${level} ${t.h}:${t.m} aceitou o horário errado ${v.h}:${v.m}`); }
    // as formas de erro conhecidas são recusadas, e explain devolve UMA linha
    const e = R.explain(t, "xxxx", o);
    if (!e || /\n/.test(e)) err(`explain vazio ou com quebra: ${t.h}:${t.m}`);
  }
}
// 24 h (nível 5): recusado por padrão e aceito só com accept24
{ const t = T(15, 30), o = { ampm: true };
  if (R.check(t, "じゅうごじはん", o).ok || R.check(t, "15時30分", o).ok) err("24 h deveria ser recusada por padrão");
  if (!R.check(t, "じゅうごじはん", { ampm: true, accept24: true }).ok || !R.check(t, "15時30分", { ampm: true, accept24: true }).ok) err("24 h deveria passar com accept24");
  if (R.hourReading(17) !== "じゅうしちじ" || R.hourReading(14) !== "じゅうよじ" || R.hourReading(19) !== "じゅうくじ" || R.hourReading(20) !== "にじゅうじ") err("hourReading 13 a 23");
}
// nos níveis 1 a 4 午前/午後 é recusado; no 5 sem 午前/午後 também
if (R.check(T(3, 0), "午後三時").why !== "ampm_extra" || R.check(T(15, 0), "さんじ", { ampm: true }).why !== "ampm" || R.check(T(15, 0), "ごぜんさんじ", { ampm: true }).why !== "ampm_errado") err("ampm: motivos");
if (R.check(T(3, 15), "3:15").why !== "algarismos" || R.check(T(3, 15), "").why !== "vazio" || R.check(T(3, 15), "三時0分").ok) err("formatos recusados");
if (!R.check(T(3, 0), "三時ちょうど").ok || R.check(T(3, 15), "三時ちょうど").ok || !R.check(T(3, 30), "三時三十分").ok || !R.check(T(3, 30), "３時半").ok) err("ちょうど / 半 / algarismos largos");

// 4) a regra do erro (UMA linha, a certa para cada erro)
const EX = [
  [T(4, 0), "しじ", /よじ/], [T(7, 0), "ななじ", /しちじ/], [T(9, 0), "きゅうじ", /くじ/], [T(3, 3), "さんじさんふん", /ぷ/], [T(3, 1), "さんじいちふん", /いっぷん/],
  [T(3, 6), "さんじろくふん", /ろっぷん/], [T(3, 8), "さんじはちふん", null], [T(3, 10), "さんじじゅうふん", /じゅっぷん/], [T(3, 30), "さんじさんじゅうふん", /はん/],
  [T(3, 0), "さんじぷん", /ちょうど/], [T(3, 14), "さんじじゅうしぷん", /よん/], [T(3, 25), "さんじにふん", /にじゅう/],
];
for (const [t, r, re] of EX) { const e = R.explain(t, r); if (re && !re.test(e)) err(`explain(${t.h}:${t.m}, ${r}) = ${e}`); }

// 5) ponteiros: o das horas anda com os minutos e os dois ficam coerentes nos 720 horários
for (let h = 1; h <= 12; h++) for (let m = 0; m < 60; m++) {
  const a = R.angles({ h, m });
  if (a.minute !== m * 6) err(`ângulo dos minutos ${h}:${m}`);
  if (Math.abs(a.hour - (((h % 12) * 30) + m * 0.5)) > 1e-9) err(`ângulo das horas ${h}:${m} = ${a.hour}`);
  if (Math.floor(a.hour / 30) !== h % 12) err(`ponteiro das horas fora do setor ${h}:${m}`);
  if (Math.abs(((a.hour * 12) % 360) - a.minute) > 1e-6) err(`ponteiros incoerentes ${h}:${m}`);
}
const a330 = R.angles(T(3, 30)); if (a330.hour !== 105 || a330.minute !== 180) err("3:30 deve dar 105° e 180° (entre o 3 e o 4)");
const a1200 = R.angles(T(12, 0)); if (a1200.hour !== 0 || a1200.minute !== 0) err("12:00 deve dar 0° e 0°");

// 6) sorteio: sem repetir, dentro do nível, regras de cada nível, muitas rodadas
for (let level = 1; level <= 5; level++) {
  const ok = new Set(R.all(level).map(t => t.h * 100 + t.m));
  for (let i = 0; i < 300; i++) {
    const s = R.sample(level, 10), ks = s.map(t => t.h * 100 + t.m);
    if (s.length !== (level === 1 ? 10 : 10) || new Set(ks).size !== s.length) err(`sample nível ${level}: tamanho ou repetição`);
    if (!ks.every(k => ok.has(k))) err(`sample nível ${level}: fora do nível`);
    if (level === 1 && ![4, 7, 9].every(h => s.some(t => t.h === h))) err("nível 1 sem 4, 7 e 9");
    if (level === 5 && (s.filter(t => t.h < 12).length !== 5 || s.filter(t => t.h > 12).length !== 5)) err("nível 5 sem 5 manhãs e 5 tardes");
  }
}
if (!R.LEVELS.every((l, i) => l.id === i + 1) || R.LEVELS.length !== 5) err("LEVELS");
// digitação ao vivo (mesma lógica do 数を書こう): n' antes de vogal ou y, MAIÚSCULAS
if (R.toKana("sanji juugofun", true) !== "さんじじゅうごふん" || R.toKana("SANJI HAN", true) !== "さんじはん" || R.toKana("yonpun", true) !== "よんぷん" || R.toKana("san'ji", true) !== "さんじ") err("toKana");

console.log(`horários testados ${total} (níveis 1 a 5: 12 + 36 + 144 + 720 + 264) | horas ${HORAS.length} | minutos 0-59 | casos de explain ${EX.length} | erros ${erros}`);
process.exitCode = erros ? 1 : 0;
