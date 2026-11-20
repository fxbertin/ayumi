// Motor de conjugação de adjetivos do Ayumi (sem dependências). Usado por conjugacao-adjetivos.html.
// Nomes com prefixo A/adj para não colidir com data/conj.js (verbos).
const AFORMS = [
  { id:"pol",        lvl:5, name:"presente educado (です)" },
  { id:"polneg",     lvl:5, name:"negativa educada" },
  { id:"polpast",    lvl:5, name:"passado educado" },
  { id:"polpastneg", lvl:5, name:"passado negativo educado" },
  { id:"neg",        lvl:5, name:"negativa (plana)" },
  { id:"past",       lvl:5, name:"passado (plano)" },
  { id:"pastneg",    lvl:5, name:"passado negativo (plano)" },
  { id:"te",         lvl:5, name:"forma て" },
  { id:"adv",        lvl:5, name:"advérbio" },
  { id:"attr",       lvl:5, name:"antes de substantivo", only:"na" },
  { id:"sou",        lvl:4, name:"〜そう (parece)" },
  { id:"ba",         lvl:4, name:"condicional ば (se)" },
  { id:"tara",       lvl:4, name:"condicional たら" },
  { id:"sugi",       lvl:4, name:"〜すぎる (demais)" },
  { id:"naru",       lvl:4, name:"〜なる (ficar)" },
  { id:"sa",         lvl:4, name:"〜さ (substantivo)" },
];

// Terminam em い na leitura mas são adjetivos な.
const NA_I = new Set(["嫌い|きらい"]);
// Adjetivos な em que 〜そう / 〜すぎる e 〜さ soam naturais (lista curta, só o que é certo).
const NA_SOU = new Set(["静か","元気","暇","便利","簡単","親切","上手","下手","大変","丈夫","賑やか","複雑","真面目","熱心","派手","楽","素敵","立派"]);
const NA_SA  = new Set(["静か","便利","簡単","大切","親切","大変","複雑","真面目","丈夫","熱心","立派","大事","不便"]);

// w = [japonês, kana, romaji, português]; grp = "JLPT N5"...
function makeAdj(w, grp) {
  const [j, k] = w, key = j + "|" + k;
  const type = !NA_I.has(key) && j.endsWith("い") && k.endsWith("い") ? "i" : "na";
  return { j, k, pt: w[3], type, key, grp };
}

// A pergunta (adjetivo, forma) faz sentido?
function aok(a, f) {
  const F = AFORMS.find(x => x.id === f);
  if (F.only && F.only !== a.type) return false;
  if (f === "adv" && a.j === "色々") return false;
  if (f === "sou" || f === "sugi" || f === "sa") {
    if (a.j === "同じ") return false;
    if (a.type === "i") {
      if (!/N[345]/.test(a.grp)) return false;
      if (f === "sou" && a.k.endsWith("ない") && a.k !== "ない") return false; // つまらない etc.: ambíguo, omitido
    } else if (!(f === "sa" ? NA_SA : NA_SOU).has(a.j)) return false;
  }
  return true;
}

// Respostas aceitas: lista de [kanji, kana]. reg=true ignora a exceção do いい (usado nas alternativas erradas).
function aconj(a, f, reg) {
  const { j, k } = a;
  const P = (...s) => s.map(x => [j + x, k + x]);
  if (a.type === "na") {
    switch (f) {
      case "pol": return P("です");
      case "polneg": return P("じゃないです", "ではないです", "ではありません", "じゃありません");
      case "polpast": return P("でした");
      case "polpastneg": return P("じゃなかったです", "ではなかったです", "ではありませんでした", "じゃありませんでした");
      case "neg": return P("じゃない", "ではない");
      case "past": return P("だった");
      case "pastneg": return P("じゃなかった", "ではなかった");
      case "te": return P("で");
      case "adv": return P("に");
      case "attr": return j === "同じ" ? [[j, k]] : P("な");
      case "sou": return P("そう");
      case "ba": return P("なら", "ならば");
      case "tara": return P("だったら");
      case "sugi": return P("すぎる");
      case "naru": return P("になる");
      case "sa": return P("さ");
    }
  }
  // い-adjetivo: raiz = sem o い final; いい / かっこいい usam よ.
  const ii = !reg && /(^|こ)いい$/.test(k) && /いい$/.test(j) && (k === "いい" || k === "かっこいい");
  const J = ii ? j.slice(0, -2) + "よ" : j.slice(0, -1), K = ii ? k.slice(0, -2) + "よ" : k.slice(0, -1);
  const S = (...s) => s.map(x => [J + x, K + x]);
  switch (f) {
    case "pol": return P("です");
    case "polneg": return S("くないです", "くありません");
    case "polpast": return S("かったです");
    case "polpastneg": return S("くなかったです", "くありませんでした");
    case "neg": return S("くない");
    case "past": return S("かった");
    case "pastneg": return S("くなかった");
    case "te": return S("くて");
    case "adv": return S("く");
    case "sou": return S(ii || k === "ない" ? "さそう" : "そう");
    case "ba": return S("ければ");
    case "tara": return S("かったら");
    case "sugi": return S("すぎる");
    case "naru": return S("くなる");
    case "sa": return S("さ");
  }
  return [[j, k]];
}

// Alternativas erradas típicas, sem repetir nenhuma resposta aceita nem algo que também seria válido.
const A_PLAIN = ["neg", "past", "pastneg"], A_POLITE = ["pol", "polneg", "polpast", "polpastneg"];
function awrongs(a, f, n = 3) {
  const ok = new Set(aconj(a, f).map(p => p[1])), c = [];
  const add = p => { if (p && !ok.has(p[1]) && !c.some(q => q[1] === p[1])) c.push(p); };
  const { j, k } = a, st = a.type === "i" ? j.slice(0, -1) : j, stk = a.type === "i" ? k.slice(0, -1) : k;
  const sufs = (ss) => ss.forEach(x => add([x[0], x[1]]));
  if (f === "attr") [["い"], [""], ["の"], ["に"], ["な"]].forEach(x => add([j + x[0], k + x[0]]));
  else if (f === "pol") sufs(a.type === "i" ? [[st + "くです", stk + "くです"], [j + "だです", k + "だです"]] : [[j + "なです", k + "なです"], [j + "だです", k + "だです"]]);
  else {
    const first = [];
    // outra regra (い ↔ な), exceto onde o resultado também seria válido (高いなら)
    if (!(a.type === "i" && f === "ba")) {
      const other = a.type === "i" ? { ...a, type: "na" } : { ...a, type: "i", j: j + "い", k: k + "い" };
      first.push(aconj(other, f)[0]);
    }
    if (a.type === "i") {
      const suf = aconj(a, f)[0][1].slice(stk.length);           // sufixo da forma, mantendo o い da raiz
      first.push([j + suf, k + suf], aconj(a, f, true)[0]);       // 高いくない / exceção do いい ignorada
    }
    first.sort(() => Math.random() - .5).forEach(add);
  }
  const out = c.slice(0, n);
  const clash = g => (f === "ba" && g === "tara") || (f === "tara" && g === "ba") ||
    (A_PLAIN.includes(f) && A_POLITE.includes(g)) || (A_POLITE.includes(f) && A_PLAIN.includes(g)) ;
  for (const g of shuffleA(AFORMS)) {
    if (out.length >= n) break;
    if (g.id === f || !aok(a, g.id) || clash(g.id)) continue;
    const p = aconj(a, g.id)[0];
    if (!ok.has(p[1]) && !out.some(q => q[1] === p[1])) out.push(p);
  }
  return out;
}
function shuffleA(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
