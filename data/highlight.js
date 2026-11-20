// Destaque da palavra estudada na frase de exemplo. API: KDHL.find(jp, chave) -> [[ini, fim], ...] | null; KDHL.fill(el, jp, spans).
// Só devolve um trecho quando acha com segurança (uma única posição válida); senão null e a frase fica sem destaque.
const KDHL = (() => {
  const ROW = { u: "うくぐすつぬぶむる", a: "わかがさたなばまら", i: "いきぎしちにびみり", e: "えけげせてねべめれ", o: "おこごそとのぼもろ" };
  const row = (c, r) => ROW[r][ROW.u.indexOf(c)];
  const KAN = /[\u4e00-\u9faf々]/, KANA = /^[\u3040-\u30ffー]+$/;
  const IE = /[いきしちにひみりぎじぢびぴえけせてねへめれげぜでべぺ]る$/;
  const GODAN_RU = new Set(["帰る|かえる", "走る|はしる", "切る|きる", "入る|はいる", "知る|しる", "要る|いる", "減る|へる", "参る|まいる", "握る|にぎる", "蹴る|ける", "喋る|しゃべる", "散る|ちる", "滑る|すべる", "限る|かぎる", "照る|てる", "湿る|しめる"]);
  const TE = { う: "って|った", つ: "って|った", る: "って|った", む: "んで|んだ", ぶ: "んで|んだ", ぬ: "んで|んだ", く: "いて|いた", ぐ: "いで|いだ", す: "して|した" };
  // continuações depois de ます/ない/て etc. (cadeias curtas)
  const AFTER_TE = ["", "いる", "い", "います", "いた", "いて", "いない", "いません", "いました", "しまう", "しまった", "おく", "おいた", "みる", "みた", "みて", "くる", "いく", "ある", "あります"];
  const POL = ["ます", "ません", "ました", "ませんでした", "ましょう", "まして", "たい", "たく", "たかった", "たくない", "ながら", "そう", "すぎ", "すぎる", "すぎた"];
  const NEG = ["ない", "なかった", "なくて", "なければ", "ないで", "ず"];
  const TA = ["た", "たら", "たり", "て", "ても"];

  // Lista de terminações possíveis depois do radical, conforme o tipo.
  function tails(kind, last, j) {
    const t = new Set();
    const add = a => a.forEach(x => t.add(x));
    if (kind === "ichi") {
      add(["る", "に", "れば", "よう", "ろ", "られる", "られ", "られない", "られます", "られた", "させる", "させ", "させた", "れる"]);
      add(POL); add(NEG); add(TA); add(AFTER_TE.map(x => "て" + x)); add(AFTER_TE.map(x => "た" + x).filter(x => x === "た"));
    } else if (kind === "godan") {
      const [te, ta] = ((/行く$|いく$/.test(j) && last === "く") ? "って|った" : TE[last]).split("|");
      add([last, row(last, "e") + "ば", row(last, "e"), row(last, "e") + "る", row(last, "e") + "ます", row(last, "e") + "ない", row(last, "e") + "た", row(last, "e") + "て", row(last, "o") + "う", row(last, "o") + "う"]);
      add(NEG.map(x => row(last, "a") + x)); add([row(last, "a") + "れる", row(last, "a") + "れ", row(last, "a") + "せる", row(last, "a") + "れた", row(last, "a") + "れます"]);
      add(POL.map(x => row(last, "i") + x)); add([row(last, "i"), row(last, "i") + "に", row(last, "i") + "なさい"]);
      add(AFTER_TE.map(x => te + x)); add([ta, ta.slice(0, -1) + "たら", ta + "ら", ta + "り", ta + "ことがある"].filter(x => x.length));
      t.add(ta + "ら"); t.add(ta + "り");
    } else if (kind === "suru") {
      add(["する", "し", "します", "しません", "しました", "しませんでした", "しましょう", "しない", "しなかった", "しなくて", "しなければ", "して", "した", "したら", "したり", "している", "していた", "しています", "していない", "したい", "しよう", "すれば", "される", "された", "させる", "できる", "でき", "できます", "できません", "できた", "できない", "しながら", "しすぎ"]);
    } else if (kind === "iadj") {
      add(["い", "く", "くて", "くない", "くなかった", "くなる", "くなった", "くなく", "かった", "かったら", "くありません", "くありませんでした", "さ", "そう", "ければ", "かろう", "くなりたい", "すぎる", "すぎ", "すぎた"]);
    }
    return [...t].filter(x => x.length).sort((a, b) => b.length - a.length);
  }

  function kindOf(j, k) {
    if (j === "する" && k === "する") return { kind: "suru", stem: "", bare: true };
    if (j.length < 2 && !KAN.test(j)) return null;
    if (/する$/.test(j) && j.length > 2 && /する$/.test(k)) return { kind: "suru", stem: j.slice(0, -2) };
    if (/来る$/.test(j) && /くる$/.test(k)) return { kind: "ichi", stem: j.slice(0, -1) };
    const last = j.slice(-1);
    if (last === "い" && /い$/.test(k)) {
      // い-adjetivo (também pega substantivos em い como きれい: nesses o match exato vem antes)
      if (j.length >= 2) return { kind: "iadj", stem: j.slice(0, -1) };
    }
    if (ROW.u.includes(last) && !KAN.test(last)) {
      if (last === "る" && IE.test(k) && !GODAN_RU.has(j + "|" + k)) return { kind: "ichi", stem: j.slice(0, -1) };
      return { kind: "godan", stem: j.slice(0, -1), last };
    }
    return null;
  }

  const strict = str => str.length < 2;           // 1 kanji: exige borda limpa dos dois lados; 2+ aceita kanji colado (毎晩音楽)
  function search(jp, j, k, counter) {
    const spans = new Map();
    const edge = (str, i) => {
      const a = jp[i - 1] || "", b = jp[i + str.length] || "";
      return counter || !(strict(str) && ((KAN.test(str[0]) && KAN.test(a)) || (KAN.test(str.slice(-1)) && KAN.test(b))));
    };
    const info = kindOf(j, k);
    if (info && info.bare) {                      // する sozinho: só depois de を (…をします)
      for (const t of tails("suru").filter(x => x.length > 1)) { let i = jp.indexOf("を" + t); while (i >= 0) { spans.set(i + 1, [i + 1, i + 1 + t.length]); i = jp.indexOf("を" + t, i + 1); } }
      const all = [...spans.values()].sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]));
      return all.length === 1 ? all : (all.length && all.every(x => x[0] === all[0][0]) ? [all[0]] : []);
    }
    if (info && info.stem) {
      const tl = tails(info.kind, info.last, j);
      let i = jp.indexOf(info.stem);
      while (i >= 0) {
        {
          const rest = jp.slice(i + info.stem.length), t = tl.find(x => rest.startsWith(x));
          if (t) { const e = i + info.stem.length + t.length; spans.set(i + ":" + e, [i, e]); }
        }
        i = jp.indexOf(info.stem, i + 1);
      }
    }
    if (!spans.size && info && info.kind === "suru" && info.stem) { let i = jp.indexOf(info.stem); while (i >= 0) { spans.set(i + ":" + (i + info.stem.length), [i, i + info.stem.length]); i = jp.indexOf(info.stem, i + 1); } }
    if (!spans.size) { let i = jp.indexOf(j); while (i >= 0) { if (edge(j, i)) spans.set(i + ":" + (i + j.length), [i, i + j.length]); i = jp.indexOf(j, i + 1); } }
    if (!spans.size && /[きさ]い$/.test(j) && /^(大|小)/.test(j)) { const t = j.slice(0, -1) + "な"; const i = jp.indexOf(t); if (i >= 0) spans.set(i + ":" + (i + t.length), [i, i + t.length]); }
    return [...spans.values()];
  }

  function find(jp, key) {
    let [j, k] = String(key).split("|");
    const counter = j.startsWith("〜");
    j = j.replace(/^〜/, ""); k = (k || "").replace(/^〜/, "");
    if (!j) return null;
    const cands = [[j, k]];
    if (KAN.test(j) && k !== j) cands.push([k, k]);                            // frase escrita só em kana (やめます)
    if (KANA.test(k) && /[\u3041-\u3096]/.test(k)) cands.push([k.replace(/[\u3041-\u3096]/g, ch => String.fromCharCode(ch.charCodeAt(0) + 0x60)), ""]);   // ヘビ, カエル
    if (/^[おご][\u4e00-\u9faf]/.test(j)) cands.push([j.slice(1), k.slice(1)]);   // お酒 -> 酒
    for (const [jj, kk] of cands) {
      const all = search(jp, jj, kk, counter);
      if (!all.length) continue;
      if (all.length > 1 && !counter && (jj.length < 2 || (KANA.test(jj) && jj.length < 3))) return null;   // palavra curta em várias posições: ambíguo
      all.sort((a, b) => a[0] - b[0]);
      return counter ? [all[0]] : all;
    }
    return null;
  }

  function fill(el, jp, spans) {
    el.textContent = "";
    if (!spans || !spans.length) { el.textContent = jp; return; }
    let p = 0;
    for (const [a, b] of spans) {
      if (a < p) continue;
      const m = document.createElement("mark"); m.className = "hl"; m.textContent = jp.slice(a, b);
      el.append(jp.slice(p, a), m); p = b;
    }
    el.append(jp.slice(p));
  }
  return { find, fill };
})();
