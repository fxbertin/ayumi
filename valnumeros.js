// node valnumeros.js [-t]   (-t imprime a tabela de casos difíceis)
const N = require("./data/numeros-ja.js");
let erros = 0;
const err = m => { erros++; if (erros <= 40) console.log("ERRO", m); };

// 1) tabela de casos difíceis: [n, kanji, leitura canônica]
const HARD = [
  [0, "零", "れい"], [1, "一", "いち"], [4, "四", "よん"], [7, "七", "なな"], [9, "九", "きゅう"], [10, "十", "じゅう"],
  [11, "十一", "じゅういち"], [14, "十四", "じゅうよん"], [17, "十七", "じゅうなな"], [19, "十九", "じゅうきゅう"],
  [20, "二十", "にじゅう"], [24, "二十四", "にじゅうよん"], [40, "四十", "よんじゅう"], [70, "七十", "ななじゅう"], [90, "九十", "きゅうじゅう"],
  [99, "九十九", "きゅうじゅうきゅう"], [100, "百", "ひゃく"], [101, "百一", "ひゃくいち"], [110, "百十", "ひゃくじゅう"],
  [200, "二百", "にひゃく"], [300, "三百", "さんびゃく"], [400, "四百", "よんひゃく"], [500, "五百", "ごひゃく"], [600, "六百", "ろっぴゃく"],
  [700, "七百", "ななひゃく"], [800, "八百", "はっぴゃく"], [900, "九百", "きゅうひゃく"], [350, "三百五十", "さんびゃくごじゅう"],
  [999, "九百九十九", "きゅうひゃくきゅうじゅうきゅう"],
  [1000, "千", "せん"], [1001, "千一", "せんいち"], [1100, "千百", "せんひゃく"], [2000, "二千", "にせん"], [3000, "三千", "さんぜん"],
  [3300, "三千三百", "さんぜんさんびゃく"], [4000, "四千", "よんせん"], [5000, "五千", "ごせん"], [6000, "六千", "ろくせん"], [7000, "七千", "ななせん"],
  [8000, "八千", "はっせん"], [8800, "八千八百", "はっせんはっぴゃく"], [9000, "九千", "きゅうせん"], [9999, "九千九百九十九", "きゅうせんきゅうひゃくきゅうじゅうきゅう"],
  [10000, "一万", "いちまん"], [10100, "一万百", "いちまんひゃく"], [11111, "一万千百十一", "いちまんせんひゃくじゅういち"], [12345, "一万二千三百四十五", "いちまんにせんさんびゃくよんじゅうご"],
  [13300, "一万三千三百", "いちまんさんぜんさんびゃく"], [20000, "二万", "にまん"], [30000, "三万", "さんまん"], [30300, "三万三百", "さんまんさんびゃく"],
  [36000, "三万六千", "さんまんろくせん"], [40000, "四万", "よんまん"], [50000, "五万", "ごまん"], [60000, "六万", "ろくまん"], [70000, "七万", "ななまん"],
  [80000, "八万", "はちまん"], [88888, "八万八千八百八十八", "はちまんはっせんはっぴゃくはちじゅうはち"], [90000, "九万", "きゅうまん"],
  [99999, "九万九千九百九十九", "きゅうまんきゅうせんきゅうひゃくきゅうじゅうきゅう"],
];
if (process.argv.includes("-t")) HARD.forEach(([n, k, r]) => console.log(String(n).padStart(5), k.padEnd(10, "　"), r));
for (const [n, k, r] of HARD) {
  if (N.kanji(n) !== k) err(`kanji(${n}) = ${N.kanji(n)}, esperado ${k}`);
  if (N.reading(n) !== r) err(`reading(${n}) = ${N.reading(n)}, esperado ${r}`);
}

// 2) variantes aceitas (todas devem estar em readings) e leituras PROIBIDAS (nunca podem estar)
const OK = { 0: ["ぜろ"], 4: ["し"], 7: ["しち"], 9: ["く"], 14: ["じゅうし"], 17: ["じゅうしち"], 19: ["じゅうく"], 27: ["にじゅうしち"], 70: ["しちじゅう"], 1000: ["いっせん"], 1100: ["いっせんひゃく"] };
for (const n in OK) for (const r of OK[n]) if (!N.readings(+n).has(r)) err(`variante aceita faltando: ${n} ${r}`);
const NO = { 100: ["いちひゃく", "いっぴゃく"], 300: ["さんひゃく"], 600: ["ろくひゃく", "ろっひゃく"], 800: ["はちひゃく", "はっひゃく"], 3000: ["さんせん"], 8000: ["はちせん"], 1000: ["いちせん"],
  10000: ["まん", "じゅうまん"], 15: ["いちじゅうご"], 24: ["にじゅうし"], 40: ["しじゅう"], 90: ["くじゅう"], 900: ["くひゃく"], 4000: ["しせん"], 7000: ["しちせん"] };
for (const n in NO) for (const r of NO[n]) if (N.readings(+n).has(r)) err(`leitura PROIBIDA aceita: ${n} ${r}`);

// 3) todos os inteiros de 0 a 99999
const FORB = /いちひゃく|いっぴゃく|いっひゃく|さんひゃく|ろくひゃく|ろっひゃく|はちひゃく|はっひゃく|さんせん|はちせん|いちせん|いちじゅう|しじゅう|しせん|しまん|(?<![ろゃ])く(?:じゅう|ひゃく|せん|まん)/;
const seen = new Map(); let total = 0, variantes = 0;
for (let n = 0; n <= N.MAX; n++) {
  const k = N.kanji(n), r = N.reading(n), rs = N.readings(n);
  if (N.parse(k) !== n) err(`ida e volta kanji ${n} ${k} -> ${N.parse(k)}`);
  if (N.parse(String(n)) !== n) err(`parse algarismos ${n}`);
  if (!rs.has(r)) err(`canônica fora do conjunto ${n}`);
  if (!/^[ぁ-ゖー]+$/.test(r)) err(`leitura não é hiragana ${n} ${r}`);
  if (n >= 10000 && !/^(いち|に|さん|よん|ご|ろく|なな|はち|きゅう)まん/.test(r)) err(`万 sem número ${n} ${r}`);
  if (n >= 100 && n < 200 && /^いち/.test(r)) err(`100 a 199 começa com いち ${n}`);
  if (/^[一二三四五六七八九]/.test(k) && k.length > 1 && /^一[百十]/.test(k)) err(`一百/一十 em ${n} ${k}`);
  const p = N.parts(n); if (p.map(x => x.k).join("") !== k || p.map(x => x.r).join("") !== r || p.reduce((s, x) => s + x.v, 0) !== n) err(`parts ${n}`);
  for (const x of rs) {
    total++;
    if (FORB.test(x)) err(`proibida ${n} ${x}`);
    if (seen.has(x) && seen.get(x) !== n) err(`leitura repetida em dois números: ${x} (${seen.get(x)} e ${n})`);
    seen.set(x, n);
  }
  variantes += rs.size - 1;
  if (!N.checkJa(n, k).ok || !N.checkJa(n, r).ok || !N.checkDigits(n, String(n)).ok) err(`check ${n}`);
  if (N.checkJa(n, String(n)).ok) err(`algarismos não podem valer como resposta em japonês ${n}`);
}

// 4) romaji -> hiragana e respostas digitadas
const RO = { sanbyaku: "さんびゃく", roppyaku: "ろっぴゃく", happyaku: "はっぴゃく", sanzen: "さんぜん", hassen: "はっせん", ichiman: "いちまん", juugo: "じゅうご",
  hyaku: "ひゃく", kyuujuu: "きゅうじゅう", yonhyaku: "よんひゃく", nanajuu: "ななじゅう", gomanrokusen: "ごまんろくせん", rei: "れい", zero: "ぜろ" };
for (const k in RO) if (N.toKana(k, true) !== RO[k]) err(`toKana ${k} -> ${N.toKana(k, true)}`);
const C = [
  [350, "sanbyakugojuu", true], [350, "SANBYAKUGOJUU", true], [350, "さんびゃく ごじゅう", true], [350, "三百五十", true], [350, "3百50", false], [350, "350", false],
  [300, "sanhyaku", false], [300, "三百", true], [600, "ろくひゃく", false], [4, "shi", true], [4, "yon", true], [24, "nijuushi", false],
  [100, "一百", false], [100, "百", true], [10000, "万", false], [10000, "一万", true], [12000, "いちまんにせん", true], [12000, "1万2千", true], [7, "ななじゅう", false],
  [0, "ゼロ", true], [0, "零", true], [0, "〇", true], [35, "三十五", true], [35, "さんじゅうご", true], [35, "sanjuugo", true], [35, "sanjuugoo", false],
];
for (const [n, raw, ok] of C) if (N.checkJa(n, raw).ok !== ok) err(`checkJa(${n}, ${raw}) = ${!ok}, esperado ${ok}`);
const CD = [[350, "350", true], [350, " 350 ", true], [350, "３５０", true], [350, "1,000", false], [1000, "1,000", true], [350, "0350", false], [350, "三百五十", false], [350, "35", false]];
for (const [n, raw, ok] of CD) if (N.checkDigits(n, raw).ok !== ok) err(`checkDigits(${n}, ${raw}) esperado ${ok}`);
const PARSE = { "三万五千": 35000, "3千5百": 3500, "九万九千九百九十九": 99999, "一千": 1000, "二千三": 2003, "百": 100, "万": null, "十万": null, "一百": null, "一十": null, "100000": null, "三百50": null, "": null, "abc": null, "九十九": 99 };
for (const k in PARSE) if (N.parse(k) !== PARSE[k]) err(`parse("${k}") = ${N.parse(k)}, esperado ${PARSE[k]}`);

// 4b) digitação ao vivo (el falso): minúsculas e MAIÚSCULAS, nn antes de vogal e n' antes de y
{
  const el = { value: "", hs: [], addEventListener(t, f) { this.hs.push(f); }, get selectionStart() { return this.value.length; } };
  N.liveKana(el, null);
  const typeIt = str => { el.value = ""; for (const ch of str) { el.value += ch; el.hs.forEach(h => h({ isComposing: false })); } return el.value; };
  const LIVE = { nanamannanasen: "ななまんななせn", NANAMANNANASEN: "ななまんななせn", "Nimannanasen": "にまんななせn", "sen'yon": "せんよn", "SEN'YON": "せんよn",
    sanbyakugojuu: "さんびゃくごじゅう", SANBYAKUGOJUU: "さんびゃくごじゅう", hachimannyon: "はちまんにょn", roppyaku: "ろっぴゃく", ROPPYAKU: "ろっぴゃく" };
  for (const k in LIVE) { const v = typeIt(k); if (v !== LIVE[k]) err(`liveKana("${k}") = ${v}, esperado ${LIVE[k]}`); }
}

// 5) a regra certa para o erro típico
const EX = [[300, "さんひゃく", /びゃく/], [600, "ろくひゃく", /ろっぴゃく/], [800, "はちひゃく", /はっぴゃく/], [3000, "さんせん", /ぜん/], [8000, "はっせん".replace("はっ", "はち"), /はっせん/],
  [10000, "まん", /いち/], [100, "いちひゃく", /sem いち/], [15, "いちじゅうご", /じゅうご/], [7, "しち", /なな/].slice(0, 0)].filter(x => x.length === 3);
for (const [n, u, re] of EX) if (!re.test(N.explain(n, u))) err(`explain(${n}, ${u}) = ${N.explain(n, u)}`);

// 6) sorteio das rodadas
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
for (const lv of N.LEVELS) for (let i = 0; i < 300; i++) {
  const r = N.sample(lv.id, 10, rnd);
  if (r.length !== 10) { err(`rodada do nível ${lv.id} com ${r.length} números`); break; }
  if (new Set(r).size !== r.length) err(`repetidos no nível ${lv.id}`);
  if (r.some(v => v < lv.min || v > lv.max)) err(`fora da faixa no nível ${lv.id}: ${r}`);
  if (lv.id === 6 && new Set(r.map(v => String(v).length)).size < 4) err(`nível Tudo sem variedade: ${r}`);
}

console.log(`inteiros 0-${N.MAX} | leituras aceitas ${total} (variantes ${variantes}) | casos difíceis ${HARD.length} | erros ${erros}`);
process.exit(erros ? 1 : 0);
