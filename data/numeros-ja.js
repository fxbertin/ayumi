/* Números em japonês, 0 a 99.999 (módulo compartilhado: jogo 数を書こう; o relógio reaproveita as leituras).
   Global NumerosJa e module.exports no node. Sem dependência de DOM (só liveKana usa um <input>).
   API:
     kanji(n)            -> "三百五十"
     reading(n)          -> leitura canônica em hiragana ("さんびゃくごじゅう")
     readings(n)         -> Set com todas as leituras aceitas (inclui a canônica)
     parts(n)            -> [{k:"三百", v:300, r:"さんびゃく"}, ...] (decomposição para revisão)
     parse(str)          -> inteiro ou null (kanji, algarismos ou misto como 3千5百)
     checkJa(n, raw)     -> {ok, why}  resposta digitada em japonês (kana, romaji já convertido ou kanji)
     checkDigits(n, raw) -> {ok, why}  resposta digitada em algarismos
     explain(n, raw)     -> UMA linha com a regra mais útil para o erro
     toKana(s, final), liveKana(el, prev)  romaji -> hiragana ao vivo (mesma lógica da página de conjugação)
     LEVELS, sample(level, count, rnd)     níveis e sorteio da rodada */
(function (root) {
  "use strict";
  const U = ["", "いち", "に", "さん", "よん", "ご", "ろく", "なな", "はち", "きゅう"];
  const K = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  const HY = ["", "ひゃく", "にひゃく", "さんびゃく", "よんひゃく", "ごひゃく", "ろっぴゃく", "ななひゃく", "はっぴゃく", "きゅうひゃく"];
  const SN = ["", "せん", "にせん", "さんぜん", "よんせん", "ごせん", "ろくせん", "ななせん", "はっせん", "きゅうせん"];
  const MAX = 99999;

  function check(n) { if (!Number.isInteger(n) || n < 0 || n > MAX) throw new RangeError("fora do escopo (0 a 99999): " + n); }

  // segmentos: cada um {k, v, r (canônica), alts [leituras aceitas, a primeira é a canônica]}
  function segs(n) {
    check(n);
    if (n === 0) return [{ k: "零", v: 0, r: "れい", alts: ["れい", "ぜろ"] }];
    const m = Math.floor(n / 10000), th = Math.floor(n / 1000) % 10, h = Math.floor(n / 100) % 10, te = Math.floor(n / 10) % 10, o = n % 10;
    const out = [];
    if (m) out.push({ k: K[m] + "万", v: m * 10000, r: U[m] + "まん", alts: [U[m] + "まん"] });
    if (th) out.push({ k: th === 1 ? "千" : K[th] + "千", v: th * 1000, r: SN[th], alts: th === 1 ? ["せん", "いっせん"] : [SN[th]] });
    if (h) out.push({ k: h === 1 ? "百" : K[h] + "百", v: h * 100, r: HY[h], alts: [HY[h]] });
    if (te) out.push({ k: te === 1 ? "十" : K[te] + "十", v: te * 10, r: te === 1 ? "じゅう" : U[te] + "じゅう", alts: te === 7 ? ["ななじゅう", "しちじゅう"] : [te === 1 ? "じゅう" : U[te] + "じゅう"] });
    if (o) {
      const alts = [U[o]];
      const alone = !m && !th && !h && !te;
      if (o === 4 && (alone || te === 1)) alts.push("し");
      if (o === 7) alts.push("しち");
      if (o === 9) alts.push("く");
      out.push({ k: K[o], v: o, r: U[o], alts });
    }
    return out;
  }
  const kanji = n => segs(n).map(s => s.k).join("");
  const reading = n => segs(n).map(s => s.r).join("");
  const parts = n => segs(n).map(s => ({ k: s.k, v: s.v, r: s.r }));
  function readings(n) {
    let acc = [""];
    for (const s of segs(n)) { const nx = []; for (const a of acc) for (const t of s.alts) nx.push(a + t); acc = nx; }
    return new Set(acc);
  }

  // ---------- kanji / algarismos -> inteiro ----------
  const FW = c => String.fromCharCode(c.charCodeAt(0) - 0xfee0);
  const clean = s => String(s).replace(/[０-９]/g, FW).replace(/[\s　,，]/g, "");
  const KV = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
  const dig = c => (c in KV ? KV[c] : /^[1-9]$/.test(c) ? +c : 0);
  const D = "[一二三四五六七八九1-9]";
  const GRP = new RegExp("^(?:(" + D + "?)千)?(?:(" + D + "?)百)?(?:(" + D + "?)十)?(" + D + "?)$");
  function parseGroup(s) { // 1 a 9999 em kanji (com algarismos arábicos opcionais como coeficiente)
    const m = GRP.exec(s); if (!m || !s) return null;
    const hasTh = s.includes("千"), hasH = s.includes("百"), hasTe = s.includes("十");
    // 百 e 十 sem coeficiente = 1; "一百" e "一十" não valem (千 aceita "一千")
    const cf = (g, has, allowOne) => { if (!has) return 0; if (!g) return 1; const v = dig(g); return v === 1 && !allowOne ? null : v; };
    const a = cf(m[1], hasTh, true), b = cf(m[2], hasH, false), c = cf(m[3], hasTe, false);
    if (a === null || b === null || c === null) return null;
    const o = m[4] ? dig(m[4]) : 0;
    return a * 1000 + b * 100 + c * 10 + o;
  }
  function parse(raw) {
    const s = clean(raw); if (!s) return null;
    if (/^[0-9]+$/.test(s)) { if (s.length > 1 && s[0] === "0") return null; const v = +s; return v <= MAX ? v : null; }
    if (s === "零" || s === "〇") return 0;
    let v = 0, rest = s;
    const i = s.indexOf("万");
    if (i >= 0) {
      const head = s.slice(0, i); // só 1 a 9 explícito (um 万 sem número, como 万 ou 十万, não vale aqui)
      if (!new RegExp("^" + D + "$").test(head)) return null;
      v = dig(head) * 10000; rest = s.slice(i + 1);
      if (!rest) return v;
    }
    const g = parseGroup(rest);
    return g === null ? null : v + g;
  }

  // ---------- romaji -> hiragana ao vivo (igual a data/conj.js, para não carregar a conjugação inteira) ----------
  const T = {};
  "a あ i い u う e え o お ka か ki き ku く ke け ko こ sa さ shi し si し su す se せ so そ ta た chi ち ti ち tsu つ tu つ te て to と na な ni に nu ぬ ne ね no の ha は hi ひ fu ふ hu ふ he へ ho ほ ma ま mi み mu む me め mo も ya や yu ゆ yo よ ra ら ri り ru る re れ ro ろ wa わ wo を ga が gi ぎ gu ぐ ge げ go ご za ざ ji じ zi じ zu ず ze ぜ zo ぞ da だ di ぢ du づ de で do ど ba ば bi び bu ぶ be べ bo ぼ pa ぱ pi ぴ pu ぷ pe ぺ po ぽ"
    .split(" ").forEach((x, i, a) => { if (i % 2 === 0) T[x] = a[i + 1]; });
  { const sm = { a: "ゃ", u: "ゅ", o: "ょ" }, cb = { ky: "き", gy: "ぎ", sh: "し", sy: "し", ch: "ち", ty: "ち", cy: "ち", ny: "に", hy: "ひ", my: "み", ry: "り", by: "び", py: "ぴ", j: "じ", jy: "じ", zy: "じ" };
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
  function liveKana(el, prev) {
    el.addEventListener("input", e => {
      const conv = v => { v = v.toLowerCase(); const m = /nny?$|ny$/.exec(v); return m ? toKana(v.slice(0, m.index), false) + m[0] : toKana(v, false); };
      if (!e.isComposing && el.selectionStart === el.value.length) { const k = conv(el.value); if (k !== el.value) el.value = k; }
      if (prev) { const k = toKana(el.value, false); prev.textContent = k !== el.value ? k : ""; }
    });
  }
  const hira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));

  // ---------- conferência das respostas ----------
  const HAS_KJ = /[一二三四五六七八九十百千万零〇]/;
  function checkJa(n, raw) {
    const t = clean(raw).replace(/[・\-]/g, "");
    if (!t) return { ok: false, why: "vazio" };
    if (/^[0-9]+$/.test(t)) return { ok: false, why: "algarismos" }; // digitar o próprio número não vale como resposta
    if (HAS_KJ.test(t) && !/[ぁ-ゖァ-ヶa-zA-Z]/.test(t)) { const p = parse(t); return p === n ? { ok: true } : { ok: false, why: p === null ? "formato" : "outro" }; }
    const k = hira(/[a-zA-Z']/.test(t) ? toKana(t, true) : t);
    if (!/^[ぁ-ゖー]+$/.test(k)) return { ok: false, why: "formato" };
    return readings(n).has(k) ? { ok: true } : { ok: false, why: "leitura" };
  }
  function checkDigits(n, raw) {
    const t = clean(raw);
    if (!t) return { ok: false, why: "vazio" };
    if (!/^[0-9]+$/.test(t)) return { ok: false, why: "formato" };
    return +t === n && (t === "0" || t[0] !== "0") ? { ok: true } : { ok: false, why: "outro" };
  }

  // ---------- a regra do erro (UMA linha) ----------
  const RULES = [
    { id: "man1", has: d => d.m === 1, bad: u => /^まん/.test(u.k) || /^万/.test(u.r), txt: "10000 é いちまん (一万): com 万 o いち é obrigatório; só 百 e 千 dispensam o いち em 100 e 1000." },
    { id: "t3", has: d => d.th === 3, bad: u => /さんせん/.test(u.k), txt: "3000 é さんぜん: depois de さん, せん vira ぜん." },
    { id: "t8", has: d => d.th === 8, bad: u => /はちせん/.test(u.k), txt: "8000 é はっせん: はち encurta para はっ antes de せん." },
    { id: "t1", has: d => d.th === 1, bad: u => /いちせん|一千(?!$)/.test(u.k + "|" + u.r), txt: "1000 é せん (ou いっせん), não いちせん." },
    { id: "h3", has: d => d.h === 3, bad: u => /さんひゃく/.test(u.k), txt: "300 é さんびゃく: depois de さん, ひゃく vira びゃく." },
    { id: "h6", has: d => d.h === 6, bad: u => /ろくひゃく|ろっひゃく|ろくぴゃく/.test(u.k), txt: "600 é ろっぴゃく: ろく encurta para ろっ e ひゃく vira ぴゃく." },
    { id: "h8", has: d => d.h === 8, bad: u => /はちひゃく|はっひゃく|はちぴゃく|はちびゃく/.test(u.k), txt: "800 é はっぴゃく: はち encurta para はっ e ひゃく vira ぴゃく." },
    { id: "h1", has: d => d.h === 1, bad: u => /いちひゃく|いっぴゃく|いっひゃく/.test(u.k) || /一百/.test(u.r), txt: "100 é só ひゃく (百), sem いち na frente." },
    { id: "te1", has: d => d.te === 1, bad: u => /いちじゅう/.test(u.k) || /一十/.test(u.r), txt: "De 10 a 19 não se diz いち: 15 é じゅうご (十五), não いちじゅうご." },
    { id: "d7", has: d => d.digits.includes(7), bad: u => /しち/.test(u.k), txt: "7 é なな; しち só vale sozinho, no 17, 27… (nas unidades) e no 70." },
    { id: "d4", has: d => d.digits.includes(4), bad: u => /し(?!ち)/.test(u.k), txt: "4 é よん; aqui só aceito し sozinho (4) e no 14 (じゅうし)." },
    { id: "d9", has: d => d.digits.includes(9), bad: u => /く(じゅう|ひゃく|せん|まん)/.test(u.k), txt: "9 é きゅう antes de じゅう, ひゃく, せん e まん (90 é きゅうじゅう); く só nas unidades (9, 19, 29…)." },
    { id: "z", has: d => d.n === 0, bad: () => false, txt: "0 é れい (ぜろ também)." },
  ];
  function explain(n, raw) {
    const d = { n, m: Math.floor(n / 10000), th: Math.floor(n / 1000) % 10, h: Math.floor(n / 100) % 10, te: Math.floor(n / 10) % 10 };
    d.digits = String(n).split("").map(Number);
    const t = clean(raw || "").replace(/[・\-]/g, "");
    const k = /[a-zA-Z']/.test(t) ? hira(toKana(t, true)) : hira(t);
    const u = { k, r: t };
    const app = RULES.filter(r => r.has(d));
    const hit = app.find(r => r.bad(u)) || app[0];
    return hit ? hit.txt : "Monte da esquerda para a direita: 万 (10000), 千 (1000), 百 (100), 十 (10) e depois a unidade.";
  }

  // ---------- níveis e sorteio ----------
  const LEVELS = [
    { id: 1, name: "0 a 10", min: 0, max: 10 },
    { id: 2, name: "11 a 99", min: 11, max: 99 },
    { id: 3, name: "100 a 999", min: 100, max: 999 },
    { id: 4, name: "1000 a 9999", min: 1000, max: 9999 },
    { id: 5, name: "10000 a 99999", min: 10000, max: 99999 },
    { id: 6, name: "Tudo", min: 0, max: MAX },
  ];
  function sample(level, count, rnd) {
    rnd = rnd || Math.random; count = count || 10;
    const pickIn = (lv, c, seen) => {
      const out = [], span = lv.max - lv.min + 1;
      const redondos = []; // 300, 8000, 10000… (as exceções aparecem mais)
      if (lv.min >= 100) for (let a = 1; a <= 9; a++) { const v = a * Math.pow(10, String(lv.min).length - 1); if (v >= lv.min && v <= lv.max) redondos.push(v); }
      const rq = Math.min(redondos.length ? 2 : 0, c);
      let guard = 0;
      while (out.length < rq && guard++ < 200) { const v = redondos[Math.floor(rnd() * redondos.length)]; if (!seen.has(v)) { seen.add(v); out.push(v); } }
      guard = 0;
      while (out.length < Math.min(c, span) && guard++ < 5000) { const v = lv.min + Math.floor(rnd() * span); if (!seen.has(v)) { seen.add(v); out.push(v); } }
      return out;
    };
    let res = [];
    if (level === 6) { const seen = new Set(); for (const lv of LEVELS.slice(0, 5)) res = res.concat(pickIn(lv, Math.round(count / 5), seen)); }
    else res = pickIn(LEVELS.find(l => l.id === level), count, new Set());
    for (let i = res.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [res[i], res[j]] = [res[j], res[i]]; }
    return res;
  }

  const api = { MAX, kanji, reading, readings, parts, parse, checkJa, checkDigits, explain, toKana, liveKana, LEVELS, sample, RULES };
  root.NumerosJa = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
