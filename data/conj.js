// Motor de conjugação do Ayumi (sem dependências). Usado por conjugacao.html.
const ROWS = { u:"うくぐすつぬぶむる", a:"わかがさたなばまら", i:"いきぎしちにびみり", e:"えけげせてねべめれ", o:"おこごそとのぼもろ" };
const rowOf = (ch, r) => ROWS[r][ROWS.u.indexOf(ch)];

const FORMS = [
  { id:"masu",    lvl:5, name:"ます (educada)" },
  { id:"masen",   lvl:5, name:"ません (negativa educada)" },
  { id:"mashita", lvl:5, name:"ました (passado educado)" },
  { id:"te",      lvl:5, name:"forma て" },
  { id:"ta",      lvl:5, name:"forma た (passado)" },
  { id:"nai",     lvl:5, name:"ない (negativa)" },
  { id:"tai",     lvl:5, name:"たい (querer)" },
  { id:"pot",     lvl:4, name:"potencial (poder)" },
  { id:"vol",     lvl:4, name:"volitiva (vamos / vou)" },
  { id:"ba",      lvl:4, name:"condicional ば (se)" },
  { id:"pass",    lvl:4, name:"passiva" },
];

// Verbos que terminam como ichidan (…iru/…eru) mas são godan.
const GODAN_RU = new Set(["帰る|かえる","走る|はしる","切る|きる","入る|はいる","知る|しる","要る|いる","減る|へる"]);
const IE = /[いきしちにひみりぎじぢびぴえけせてねへめれげぜでべぺ]る$/;

// w = [japonês, kana, romaji, português]; devolve null se não for um verbo conjugável.
function makeVerb(w) {
  const [j, k] = w; let cls;
  if (/来る$/.test(j) && /くる$/.test(k)) cls = "kuru";   // inclui compostos: 連れて来る
  else if (/する$/.test(k) && /する$/.test(j)) cls = "suru";
  else if (!ROWS.u.includes(k.slice(-1))) return null;
  else if (k.endsWith("る") && IE.test(k) && !GODAN_RU.has(j + "|" + k)) cls = "ichidan";
  else cls = "godan";
  return { j, k, pt: w[3], cls };
}

const SUF  = { masu:"ます", masen:"ません", mashita:"ました", nai:"ない", tai:"たい", pot:"る", vol:"う", ba:"ば", pass:"れる" };
const RM   = { masu:"i", masen:"i", mashita:"i", nai:"a", tai:"i", pot:"e", vol:"o", ba:"e", pass:"a" };
const ISUF = { masu:"ます", masen:"ません", mashita:"ました", te:"て", ta:"た", nai:"ない", tai:"たい", vol:"よう", ba:"れば", pass:"られる", pot:"られる" };
const TE = { う:["って","った"], つ:["って","った"], る:["って","った"], む:["んで","んだ"], ぶ:["んで","んだ"], ぬ:["んで","んだ"], く:["いて","いた"], ぐ:["いで","いだ"], す:["して","した"] };
const TE_POOL = { te:["って","んで","いて","いで","して"], ta:["った","んだ","いた","いだ","した"] };

// Respostas aceitas: lista de [kanji, kana].
function conj(v, f) {
  const { j, k, cls } = v, L = k.slice(-1);
  if (cls === "kuru") {
    const m = { masu:["き","ます"], masen:["き","ません"], mashita:["き","ました"], te:["き","て"], ta:["き","た"], tai:["き","たい"],
      nai:["こ","ない"], pot:["こ","られる"], vol:["こ","よう"], ba:["く","れば"], pass:["こ","られる"] }[f];
    const pj = j.slice(0, -2), pk = k.slice(0, -2);
    return [[pj + "来" + m[1], pk + m[0] + m[1]]];
  }
  if (cls === "suru") {
    const J = j.slice(0, -2), K = k.slice(0, -2);
    if (f === "pot") return [[J + "できる", K + "できる"]];
    const m = { masu:["し","ます"], masen:["し","ません"], mashita:["し","ました"], te:["し","て"], ta:["し","た"], tai:["し","たい"],
      nai:["し","ない"], vol:["し","よう"], ba:["す","れば"], pass:["さ","れる"] }[f];
    return [[J + m[0] + m[1], K + m[0] + m[1]]];
  }
  const J = j.slice(0, -1), K = k.slice(0, -1);
  if (cls === "ichidan") return (f === "pot" ? ["られる", "れる"] : [ISUF[f]]).map(s => [J + s, K + s]);
  if (f === "te" || f === "ta") {
    const e = (/行く$/.test(j) && /いく$/.test(k) ? TE["う"] : TE[L])[f === "te" ? 0 : 1];
    return [[J + e, K + e]];
  }
  const s = rowOf(L, RM[f]) + SUF[f];
  return [[J + s, K + s]];
}

// Alternativas erradas típicas (lista de [kanji, kana]), sem repetir nenhuma resposta aceita.
function wrongs(v, f, n = 3) {
  const ok = new Set(conj(v, f).map(p => p[1])), c = [];
  const add = (J, K) => { if (!ok.has(K) && !c.some(p => p[1] === K)) c.push([J, K]); };
  const { j, k, cls } = v, L = k.slice(-1);
  if (cls === "godan" || cls === "ichidan") {
    const J = j.slice(0, -1), K = k.slice(0, -1);
    if (f === "te" || f === "ta") TE_POOL[f].forEach(e => add(J + e, K + e));
    else for (const r of "aieo") {
      const ch = cls === "godan" ? rowOf(L, r) : rowOf("る", r), s = ch + SUF[f];
      add(J + s, K + s);
    }
  } else {
    const stems = cls === "suru" ? ["し", "さ", "す", "せ"] : ["き", "こ", "く", "け"];
    const J = cls === "suru" ? j.slice(0, -2) : j.slice(0, -2) + "来", K = k.slice(0, -2);
    for (const s of stems) add(J + (cls === "suru" ? s : "") + ISUF[f], K + s + ISUF[f]);
  }
  c.sort(() => Math.random() - .5);
  const out = c.slice(0, n);
  for (const g of FORMS) {
    if (out.length >= n) break;
    if (g.id === f) continue;
    const p = conj(v, g.id)[0];
    if (!ok.has(p[1]) && !out.some(q => q[1] === p[1])) out.push(p);
  }
  return out;
}

// Romaji → hiragana (a digitação do usuário). Kana e kanji passam sem alteração.
const T = {};
"a あ i い u う e え o お ka か ki き ku く ke け ko こ sa さ shi し si し su す se せ so そ ta た chi ち ti ち tsu つ tu つ te て to と na な ni に nu ぬ ne ね no の ha は hi ひ fu ふ hu ふ he へ ho ほ ma ま mi み mu む me め mo も ya や yu ゆ yo よ ra ら ri り ru る re れ ro ろ wa わ wo を ga が gi ぎ gu ぐ ge げ go ご za ざ ji じ zi じ zu ず ze ぜ zo ぞ da だ di ぢ du づ de で do ど ba ば bi び bu ぶ be べ bo ぼ pa ぱ pi ぴ pu ぷ pe ぺ po ぽ"
  .split(" ").forEach((x, i, a) => { if (i % 2 === 0) T[x] = a[i + 1]; });
{ const sm = { a:"ゃ", u:"ゅ", o:"ょ" }, cb = { ky:"き", gy:"ぎ", sh:"し", sy:"し", ch:"ち", ty:"ち", cy:"ち", ny:"に", hy:"ひ", my:"み", ry:"り", by:"び", py:"ぴ", j:"じ", jy:"じ", zy:"じ" };
  for (const c in cb) for (const v in sm) T[c + v] = cb[c] + sm[v]; }

function toKana(s, final) {
  s = s.toLowerCase().replace(/\s+/g, ""); let o = "", i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === s[i + 1] && /[bcdfghjkmpqrstvwxyz]/.test(c)) { o += "っ"; i++; continue; }
    let hit = false;
    for (let n = 3; n >= 1 && !hit; n--) { const t = T[s.substr(i, n)]; if (t) { o += t; i += n; hit = true; } }
    if (hit) continue;
    if (c === "n") {
      if (i + 1 >= s.length) { o += final ? "ん" : "n"; i++; }
      else if (s[i + 1] === "'") { o += "ん"; i += 2; }
      else if (s[i + 1] === "n") { o += "ん"; i += /[aiueoy]/.test(s[i + 2] || "") ? 1 : 2; }
      else { o += "ん"; i++; }
      continue;
    }
    o += c; i++;
  }
  return o;
}
const hira = s => s.replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
// Digitação ao vivo: o romaji do campo vira kana enquanto a pessoa digita (a parte ainda incompleta, como "k" ou "sh", fica em romaji).
// Só converte com o cursor no fim e fora de composição (IME); onde não converte, a linha de prévia (prev) continua mostrando o kana.
function liveKana(el, prev) {
  el.addEventListener("input", e => {
    // "nn", "nny" e "ny" no fim ficam como estão até a próxima tecla (konna -> こんな, konni -> こんに, shinnyuu -> しんにゅう); ao conferir, o "nn" final vira ん.
    const conv = v => { const m = /nny?$|ny$/.exec(v); return m ? toKana(v.slice(0, m.index), false) + m[0] : toKana(v, false); };
    if (!e.isComposing && el.selectionStart === el.value.length) { const k = conv(el.value); if (k !== el.value) el.value = k; }
    if (prev) { const k = toKana(el.value, false); prev.textContent = k !== el.value ? k : ""; }
  });
}
