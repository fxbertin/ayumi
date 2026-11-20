/* 時計の練習 · Tokei no renshuu: horas em japonês (módulo do jogo relogio.html).
   Global Relogio e module.exports no node. Depende de data/numeros-ja.js (NumerosJa: kanji, parse, toKana, liveKana).
   Um horário é {h, m}: nos níveis 1 a 4, h de 1 a 12; no nível 5 (午前/午後), h de 1 a 23 sem o 12 (13 = 午後1時).
   API:
     hourReading(h)           -> "さんじ" (h de 1 a 23: 4 よじ, 7 しちじ, 9 くじ)
     minuteVariants(m)        -> leituras aceitas dos minutos ("" para 0); a primeira é a canônica
     readings(t, opts)        -> Set com todas as leituras aceitas em hiragana (sem 午前/午後; opts.ampm só afeta check)
     reading(t, opts)         -> leitura canônica ("さんじはん"); com opts.ampm leva ごぜん/ごご na frente
     kanji(t, opts)           -> "三時十五分", "三時半", "三時" (com opts.ampm: "午後三時十五分")
     digits(t, opts)          -> "3時15分"
     digital(t, opts)         -> "3:15" (níveis 1 a 4) ou "15:15" (opts.ampm, 24 h)
     parts(t, opts)           -> [{k:"三時", r:"さんじ"}, {k:"十五分", r:"じゅうごふん"}] (revisão)
     angles(t)                -> {hour, minute} em graus (0 = 12, sentido horário); o ponteiro das horas anda com os minutos
     check(t, raw, opts)      -> {ok, why}  why: vazio, algarismos, formato, leitura, outro, ampm, ampm_errado, ampm_extra
     explain(t, raw, opts)    -> UMA linha com a regra mais útil para o erro
     LEVELS, sample(nível, n, rnd), all(nível)  níveis, sorteio da rodada (sem repetir) e todos os horários do nível
     opts: {ampm:true} no nível 5; {accept24:true} (só com ampm) aceita também a forma de 24 h (十五時 = じゅうごじ) */
(function (root) {
  "use strict";
  const N = root.NumerosJa || (typeof require !== "undefined" ? require("./numeros-ja.js") : null);
  if (!N) throw new Error("carregue data/numeros-ja.js antes de data/relogio.js");

  const HU = ["", "いち", "に", "さん", "よ", "ご", "ろく", "しち", "はち", "く"];
  const TENS = ["", "じゅう", "にじゅう", "さんじゅう", "よんじゅう", "ごじゅう"];
  const MU = [null, ["いっぷん"], ["にふん"], ["さんぷん"], ["よんぷん"], ["ごふん"], ["ろっぷん"], ["ななふん", "しちふん"], ["はっぷん", "はちふん"], ["きゅうふん"]];

  function hourReading(h) {
    if (!Number.isInteger(h) || h < 1 || h > 23) throw new RangeError("hora fora do escopo (1 a 23): " + h);
    if (h < 10) return HU[h] + "じ";
    const u = h % 10;
    return (h < 20 ? "じゅう" : "にじゅう") + (u ? HU[u] : "") + "じ";
  }
  function minuteVariants(m) {
    if (!Number.isInteger(m) || m < 0 || m > 59) throw new RangeError("minuto fora do escopo (0 a 59): " + m);
    if (m === 0) return [""];
    const t = Math.floor(m / 10), u = m % 10;
    if (u === 0) return [TENS[t].replace(/う$/, "") + "っぷん", TENS[t].replace(/じゅう$/, "じ") + "っぷん"];
    return MU[u].map(x => TENS[t] + x);
  }
  const clock12 = t => (t.h % 12 === 0 ? 12 : t.h % 12);
  const pmOf = t => t.h >= 12;
  function checkT(t) {
    if (!t || !Number.isInteger(t.h) || !Number.isInteger(t.m) || t.h < 1 || t.h > 23 || t.m < 0 || t.m > 59) throw new RangeError("horário inválido");
  }
  const AMPM = t => (pmOf(t) ? "ごご" : "ごぜん");

  function readings(t) {
    checkT(t);
    const H = hourReading(clock12(t)), out = new Set();
    for (const v of minuteVariants(t.m)) out.add(H + v);
    if (t.m === 0) out.add(H + "ちょうど");
    if (t.m === 30) out.add(H + "はん");
    return out;
  }
  function reading(t, o) {
    checkT(t); o = o || {};
    const H = hourReading(clock12(t));
    const body = t.m === 0 ? H : t.m === 30 ? H + "はん" : H + minuteVariants(t.m)[0];
    return (o.ampm ? AMPM(t) : "") + body;
  }
  function kanji(t, o) {
    checkT(t); o = o || {};
    return (o.ampm ? (pmOf(t) ? "午後" : "午前") : "") + N.kanji(clock12(t)) + "時" + (t.m === 0 ? "" : t.m === 30 ? "半" : N.kanji(t.m) + "分");
  }
  function digits(t, o) {
    checkT(t); o = o || {};
    return (o.ampm ? (pmOf(t) ? "午後" : "午前") : "") + clock12(t) + "時" + (t.m === 0 ? "" : t.m === 30 ? "半" : t.m + "分");
  }
  function digital(t, o) {
    checkT(t); o = o || {};
    const mm = String(t.m).padStart(2, "0");
    return o.ampm ? String(t.h).padStart(2, "0") + ":" + mm : clock12(t) + ":" + mm;
  }
  function parts(t, o) {
    checkT(t); o = o || {};
    const ps = [];
    if (o.ampm) ps.push({ k: pmOf(t) ? "午後" : "午前", r: AMPM(t) });
    ps.push({ k: N.kanji(clock12(t)) + "時", r: hourReading(clock12(t)) });
    if (t.m === 30) ps.push({ k: "半", r: "はん" });
    else if (t.m > 0) ps.push({ k: N.kanji(t.m) + "分", r: minuteVariants(t.m)[0] });
    return ps;
  }
  function angles(t) {
    checkT(t);
    return { hour: (((t.h % 12) * 60 + t.m) / 2) % 360, minute: t.m * 6 };
  }

  // ---------- conferência das respostas ----------
  const hira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
  function clean(raw) {
    return String(raw == null ? "" : raw).replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
      .replace(/[\s\u3000・\-]+/g, "").replace(/：/g, ":");
  }
  const NUM = "[0-9一二三四五六七八九十百千零〇]+";
  const STRUCT = new RegExp("^(午前|午後|ごぜん|ごご)?(" + NUM + ")時(?:(" + NUM + ")分|(半)|(?:ちょうど|丁度))?$");
  const num = x => (/^[0-9]{1,2}$/.test(x) ? +x : N.parse(x));

  function kanaOf(raw) { // texto -> hiragana (ou null se não for só kana/romaji)
    let s = clean(raw).replace(/午前/g, "ごぜん").replace(/午後/g, "ごご");
    const k = hira(/[a-zA-Z']/.test(s) ? N.toKana(s, true) : s);
    return /^[ぁ-ゖー]+$/.test(k) ? k : null;
  }

  function check(t, raw, o) {
    checkT(t); o = o || {};
    const s = clean(raw);
    if (!s) return { ok: false, why: "vazio" };
    if (/^[0-9:]+$/.test(s)) return { ok: false, why: "algarismos" };
    const hv24 = o.accept24 && o.ampm;
    if (/時/.test(s)) { // algarismos e/ou kanji com as unidades
      const m = STRUCT.exec(s);
      if (!m) return { ok: false, why: "formato" };
      const hv = num(m[2]);
      let mv = 0;
      if (m[3] !== undefined) { mv = num(m[3]); if (mv === null || mv < 1 || mv > 59) return { ok: false, why: "formato" }; }
      else if (m[4]) mv = 30;
      if (hv === null) return { ok: false, why: "formato" };
      const ap = m[1] ? (/午後|ごご/.test(m[1]) ? "pm" : "am") : null;
      if (o.ampm) {
        if (!ap) { return hv24 && hv === t.h && mv === t.m ? { ok: true } : { ok: false, why: "ampm" }; }
        if ((ap === "pm") !== pmOf(t)) return { ok: false, why: "ampm_errado" };
        return hv === clock12(t) && mv === t.m ? { ok: true } : { ok: false, why: "outro" };
      }
      if (ap) return { ok: false, why: "ampm_extra" };
      return hv === clock12(t) && mv === t.m ? { ok: true } : { ok: false, why: "outro" };
    }
    const k = kanaOf(raw);
    if (k === null) return { ok: false, why: "formato" };
    const ap = /^(ごぜん|ごご)/.exec(k);
    let body = k;
    if (o.ampm) {
      if (!ap) return hv24 && bodyOk24(t, k) ? { ok: true } : { ok: false, why: "ampm" };
      if ((ap[1] === "ごご") !== pmOf(t)) return { ok: false, why: "ampm_errado" };
      body = k.slice(ap[1].length);
    } else if (ap) return { ok: false, why: "ampm_extra" };
    return readings(t).has(body) ? { ok: true } : { ok: false, why: "leitura" };
  }
  function bodyOk24(t, k) { // forma de 24 h em kana: hora (1 a 23) + minutos aceitos
    const H = hourReading(t.h);
    for (const v of minuteVariants(t.m)) if (k === H + v) return true;
    return (t.m === 0 && k === H + "ちょうど") || (t.m === 30 && k === H + "はん");
  }

  // ---------- a regra do erro (UMA linha) ----------
  const WHY = {
    algarismos: "Escreva a leitura em japonês (kana, romaji ou 3時15分); só os números não valem.",
    formato: "Escreva tudo em kana (さんじじゅうごふん), tudo em kanji (三時十五分) ou 3時15分.",
    outro: "Confira os ponteiros: o curto marca a hora (時), o longo os minutos (分); cada número do mostrador vale 5 minutos.",
    ampm: "Neste nível diga 午前 (ごぜん) ou 午後 (ごご) antes da hora: 15:00 é 午後3時 (ごごさんじ).",
    ampm_errado: "午前 (ごぜん) vai da meia-noite ao meio-dia; 午後 (ごご) do meio-dia à meia-noite: 09:00 é 午前, 15:00 é 午後.",
    ampm_extra: "Neste nível o relógio de ponteiros não diz se é manhã ou tarde: responda só com a hora (さんじ…).",
  };
  const UNIT_RULE = {
    1: "o いち encurta para いっ e ふん vira ぷん (いっぷん).",
    2: "にふん: depois de に o ふ não muda.",
    3: "さんぷん: depois de ん o ふ vira ぷ.",
    4: "よんぷん: depois de ん o ふ vira ぷ (e o 4 é よん).",
    5: "ごふん: depois de ご o ふ não muda.",
    6: "ろっぷん: ろく encurta para ろっ e ふん vira ぷん.",
    7: "ななふん (しちふん também).",
    8: "はっぷん: はち encurta para はっ e ふん vira ぷん (はちふん também).",
    9: "きゅうふん (não く).",
    0: "じゅっぷん: じゅう encurta para じゅっ e ふん vira ぷん (じっぷん também).",
  };
  function explain(t, raw, o) {
    checkT(t); o = o || {};
    const h = clock12(t), H = hourReading(h), m = t.m;
    const s = clean(raw);
    if (!s) return WHY.formato;
    const why = check(t, raw, o).why;
    if (why && why !== "leitura") return WHY[why] || WHY.formato;
    let k = kanaOf(raw) || "";
    k = k.replace(/^(ごぜん|ごご)/, "");
    if (!k.startsWith(H)) { // a hora está errada
      if (h === 4) return "4時 é よじ (nem しじ, nem よんじ).";
      if (h === 7) return "7時 é しちじ, não ななじ.";
      if (h === 9) return "9時 é くじ, não きゅうじ.";
      return h + "時 é " + H + ".";
    }
    const rest = k.slice(H.length), t10 = Math.floor(m / 10), u = m % 10;
    const lead = m < 10 ? m + "分 é " : m + "分 (" + minuteVariants(m)[0] + "): ";
    if (m === 0) return "Em ponto é só a hora: " + H + " (ou " + H + "ちょうど).";
    if (m >= 10 && !rest.startsWith(TENS[t10]) && !(u === 0 && rest.startsWith(TENS[t10].replace(/じゅう$/, "じ")))) {
      return m + "分 começa com " + TENS[t10] + ": 十 じゅう, 二十 にじゅう, 三十 さんじゅう, 四十 よんじゅう, 五十 ごじゅう.";
    }
    if (m === 30) return "30分 é さんじゅっぷん (さんじっぷん também) ou, mais natural, はん: " + H + "はん (" + N.kanji(h) + "時半).";
    return lead + UNIT_RULE[u];
  }

  // ---------- níveis e sorteio ----------
  const LEVELS = [
    { id: 1, name: "Em ponto", ampm: false },
    { id: 2, name: "Quartos e meia (:15, :30, :45)", ampm: false },
    { id: 3, name: "De 5 em 5 minutos", ampm: false },
    { id: 4, name: "Qualquer minuto", ampm: false },
    { id: 5, name: "午前/午後 e relógio digital", ampm: true },
  ];
  function all(level) {
    const out = [];
    if (level === 5) { for (let h = 1; h <= 23; h++) if (h !== 12) for (let m = 0; m < 60; m += 5) out.push({ h, m }); return out; }
    const ms = level === 1 ? [0] : level === 2 ? [15, 30, 45] : level === 3 ? [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] : Array.from({ length: 60 }, (_, i) => i);
    for (let h = 1; h <= 12; h++) for (const m of ms) out.push({ h, m });
    return out;
  }
  function sample(level, count, rnd) {
    rnd = rnd || Math.random; count = count || 10;
    const pool = all(level), pick = [], seen = new Set(), key = t => t.h * 100 + t.m;
    const take = t => { if (!seen.has(key(t))) { seen.add(key(t)); pick.push(t); } };
    const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    if (level === 1) [4, 7, 9].forEach(h => take({ h, m: 0 })); // as exceções (よじ, しちじ, くじ) sempre entram
    if (level === 5) { // metade manhã, metade tarde
      const am = shuffle(pool.filter(t => t.h < 12)), pm = shuffle(pool.filter(t => t.h > 12));
      for (let i = 0; pick.length < count && i < pool.length; i++) { if (i < am.length && pick.length < count) take(am[i]); if (i < pm.length && pick.length < count) take(pm[i]); }
      return shuffle(pick).slice(0, count);
    }
    for (const t of shuffle(pool.slice())) { if (pick.length >= Math.min(count, pool.length)) break; take(t); }
    return shuffle(pick).slice(0, count);
  }

  const api = { hourReading, minuteVariants, readings, reading, kanji, digits, digital, parts, angles, check, explain, LEVELS, all, sample, toKana: N.toKana, liveKana: N.liveKana };
  root.Relogio = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
