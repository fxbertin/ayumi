// Explicação por toque nas frases de exemplo (vocabulário). API: KDFW.wrap(el, jp, spans, w), KDFW.close(), KDFW.scan(jp, spans).
// Depois de KDHL.fill, deixa tocáveis: a palavra-alvo (mark.hl) e ~40 partículas/auxiliares conhecidos.
// Se existir SENTTOK[frase] (data/sent-tokens-*.js), os limites vêm dos tokens [palavra, leitura, significado]; senão vale a varredura abaixo.
// Regra de ouro: na dúvida, NÃO vira tocável (perder um toque é melhor do que mostrar um balão errado).
// Cada item: pt = rótulo curto, u = explicação, r = leitura quando difere da escrita, g/g2 = ids de data/grammar.js,
// st = versão para início de frase (só "でも" e "では").
const KDFW = (() => {
  const KAN = /[\u4e00-\u9faf々0-9０-９]/, KATA = /[\u30a0-\u30ffー]/, HIRA = /[\u3040-\u309f]/;
  const FW = {
    "は": { r: "wa", pt: "partícula de tópico", u: "Marca o assunto da frase: “quanto a…”. Aqui se lê wa, não ha.", g: "wa-mo-ka" },
    "が": { pt: "partícula de sujeito", u: "Marca o sujeito, sobretudo quando é novidade ou foco. Também vem com 好き, わかる e ある.", g: "ga" },
    "を": { r: "o", pt: "objeto direto", u: "Marca o que recebe a ação do verbo: パンを食べる = comer pão. Aqui se lê o.", g: "wo" },
    "に": { pt: "tempo, destino, alvo", u: "Marca o momento (3時に), o destino (駅に行く), onde algo está (いる/ある) e quem recebe a ação.", g: "ni-de" },
    "で": { pt: "lugar da ação, meio", u: "Marca onde a ação acontece (駅で会う) e o meio ou instrumento (バスで行く).", g: "ni-de" },
    "と": { pt: "e / com / citação", u: "Liga substantivos (A と B = A e B), indica companhia (友達と = com um amigo) e fecha citações (と言う, と思う).", g: "he-to", g2: "to-omou" },
    "も": { pt: "também", u: "“Também”: 私も = eu também. Com negativo, 何も… = nada e だれも… = ninguém.", g: "wa-mo-ka" },
    "の": { pt: "de / nominalizador", u: "Entre substantivos, liga posse ou relação (私の本 = meu livro). Depois de verbo ou adjetivo, vira substantivo (読むのが好き = gosto de ler).", g: "no", g2: "koto-no" },
    "か": { pt: "pergunta / ou", u: "No fim da frase faz pergunta. Entre palavras, “ou”. Com 何, だれ, どこ vira “algum”: 何か = alguma coisa.", g: "wa-mo-ka" },
    "へ": { r: "e", pt: "direção", u: "Marca a direção do movimento (学校へ行く). Aqui se lê e. Parecido com に.", g: "he-to" },
    "や": { pt: "e (lista parcial)", u: "Lista exemplos sem esgotar: りんごやバナナ = maçã, banana e outras coisas." },
    "よ": { pt: "ênfase", u: "No fim da frase, dá ênfase ou avisa algo que a pessoa talvez não saiba." },
    "ね": { pt: "busca de concordância", u: "No fim da frase pede confirmação: “não é?”, “né?”." },
    "から": { pt: "desde / porque", u: "Depois de substantivo, “a partir de” (9時から). Depois de uma frase, “porque” (寒いから). Depois de て, “depois de” (食べてから = depois de comer).", g: "kara-made" },
    "まで": { pt: "até", u: "“Até”: marca o limite no tempo ou no espaço (5時まで).", g: "kara-made" },
    "ので": { pt: "porque", u: "“Porque / como”: dá o motivo de modo mais suave e objetivo que から.", g: "node-noni" },
    "のに": { pt: "apesar de", u: "“Embora / apesar de”: o resultado contraria o esperado, muitas vezes com surpresa ou queixa.", g: "node-noni" },
    "けど": { pt: "mas / embora", u: "“Mas / embora”: versão casual de が e けれども.", g: "node-noni" },
    "だけど": { pt: "mas (casual)", u: "“Mas / porém”, no início de uma frase ou depois de です/だ.", g: "node-noni" },
    "でも": { pt: "até / mesmo", u: "Depois de um substantivo: “até / mesmo / ou algo assim” (子どもでも = até uma criança; お茶でも = um chá ou algo assim). Com 誰, 何, どこ: “qualquer” (誰でも = qualquer um). Também pode ser で (lugar) + も (também): ここでも = também aqui.", g: "dake-shika",
      st: { pt: "mas / porém", u: "No início da frase liga com a anterior: “mas, porém”.", g: "dake-shika" } },
    "しか": { pt: "só (com negativo)", u: "Sempre com verbo negativo: “só / nada além de” (一つしかない = só tem um).", g: "dake-shika" },
    "だけ": { pt: "só / apenas", u: "“Apenas”: 水だけ = só água.", g: "dake-shika" },
    "より": { pt: "do que", u: "Marca o termo da comparação: AはBより大きい = A é maior que B.", g: "hikaku" },
    "ながら": { pt: "enquanto", u: "Depois da raiz do verbo: duas ações ao mesmo tempo (歩きながら話す = falar andando).", g: "nagara-tari" },
    "ても": { pt: "mesmo que", u: "Depois de て: “mesmo que / ainda que”. Em ～てもいい, “pode…”.", g: "temo-ii" },
    "です": { pt: "é (educado)", u: "Verbo de ligação educado: “é / são / está” (学生です = sou estudante). Também fecha frases com adjetivo.", g: "desu" },
    "でした": { pt: "era / foi (educado)", u: "Passado de です: “era / foi”.", g: "desu" },
    "でしょう": { pt: "provavelmente", u: "“Deve ser / provavelmente”. Com entonação ascendente, “não é?”." },
    "ですか": { pt: "é…? (pergunta)", u: "です + か: pergunta educada.", g: "desu" },
    "ではありません": { pt: "não é (educado)", u: "Negativo de です. Na fala se ouve mais じゃありません.", g: "desu" },
    "じゃありません": { pt: "não é (educado)", u: "Negativo de です, na fala. Na escrita, ではありません.", g: "desu" },
    "ます": { pt: "forma educada", u: "Terminação educada do verbo, presente ou futuro: 食べます = como / comerei.", g: "masu" },
    "ました": { pt: "passado educado", u: "Passado educado: 食べました = comi.", g: "masu" },
    "ません": { pt: "negativo educado", u: "Negativo educado: 食べません = não como.", g: "masu" },
    "ませんでした": { pt: "passado negativo educado", u: "Passado negativo educado: 食べませんでした = não comi.", g: "masu" },
    "ますか": { pt: "pergunta educada", u: "ます + か: pergunta educada (食べますか = você come?).", g: "masu" },
    "ましょう": { pt: "vamos…", u: "“Vamos…!”: convite ou sugestão (行きましょう = vamos).", g: "mashou" },
    "ませんか": { pt: "que tal…?", u: "Convite educado: “não quer…?” (行きませんか).", g: "mashou" },
    "ください": { pt: "por favor", u: "Depois de て, pedido educado (見てください = olhe, por favor). Com を, “me dê” (水をください).", g: "te-kudasai" },
    "では": { pt: "e então… / de + は", u: "Depois de substantivo é で + は (lugar ou meio com contraste). Na base de ではありません.",
      st: { pt: "então / bem", u: "No início da frase: “então…, bem…” (では、始めます = então, vamos começar)." } },
    "こんにちは": { r: "konnichiwa", pt: "olá / boa tarde", u: "Cumprimento do dia. O は final se lê wa." },
    "こんばんは": { r: "konbanwa", pt: "boa noite", u: "Cumprimento ao encontrar alguém à noite. O は final se lê wa." }
  };
  const TOKS = Object.keys(FW).concat("じゃありません").filter((x, i, a) => a.indexOf(x) === i).sort((a, b) => b.length - a.length);
  // Palavras em kana que COMEÇAM com um desses trechos não são partícula: a varredura pula a palavra inteira
  // (só vale quando o caractere anterior é hiragana ou início). Lista montada pela auditoria das frases.
  const SB = ["とても", "ときどき", "とき", "ところ", "とう", "とり", "とめ", "とか", "とな", "もの", "もら", "もう", "もし", "もち", "でき", "のぼ", "のり", "はさみ", "はいて", "はっ"];
  // Terminações que, junto da partícula, formam outra palavra (ごはん, 子ども, この, こと…): o caractere não vale.
  const LB = ["ごは", "おは", "こと", "あと", "まと", "もと", "おも", "つも", "ふも", "子ども", "こども", "とても", "この", "その", "あの", "どの", "きの"];
  const CLAUSE = "、。？?！!「」\n ";
  const END = new Set(["", "。", "、", "？", "?", "！", "!", "」", "…", " "]);
  const VEND = /[うくぐすつぬぶむるいたんだな]/;   // fim plausível de verbo/adjetivo/な (antes de ので/のに)
  const FOCUSABLE = ".fw, mark.hl[role=button]";
  const ONE = new Set(["は", "が", "を", "に", "で", "と", "も", "の", "か", "へ", "や", "よ", "ね"]);

  function ok(tk, t, i) {
    const p = t[i - 1] || "", n = t[i + tk.length] || "";
    const start = i === 0 || CLAUSE.includes(p);
    const pk = KAN.test(p) || KATA.test(p);
    if (tk === "でも" || tk === "では") return true;          // início ou meio: o balão escolhe
    if (tk === "こんにちは" || tk === "こんばんは") return true;
    if (start) return false;                                        // nada mais começa cláusula
    if (tk === "ので" || tk === "のに") return !pk ? VEND.test(p) : false;
    if (tk === "ます" || tk === "です" || tk === "でした" || tk === "でしょう") return true;
    if (tk === "ました" || tk === "ません" || tk === "ませんでした" || tk === "ましょう" || tk === "ませんか" || tk === "ますか" || tk === "ですか" || tk === "ください" || tk === "ではありません" || tk === "じゃありません") return true;
    if (tk === "しか") return !/^(しか|しく|した|しら|しめ|しお|しこ|しき)/.test(t.slice(i, i + 3)) || p === "" ;
    if (tk === "から") return !/^からだ|^からい|^からす|^からあ/.test(t.slice(i, i + 3));
    if (tk === "ても") return p !== "と" && t[i + 2] !== "ら";
    if (tk === "ながら") return true;
    if (tk.length > 1) return true;
    // partículas de 1 caractere
    if (tk === "を") return true;
    if (LB.some(w => w.endsWith(tk) && t.slice(i - w.length + 1, i + 1) === w)) return false;
    if (tk === "ね" || tk === "よ") return END.has(n) || n === "ね" || n === "よ";
    if (tk === "か") return END.has(n) || /^(どうか|もしれ)/.test(t.slice(i + 1, i + 4)) || (pk && /[何誰]/.test(p));
    if (pk) return !(tk === "と" && n === "っ") && !(tk === "が" && /[るりらっれろ]/.test(n)) && !(tk === "も" && n === "る");
    if (!HIRA.test(p)) return false;
    if (tk === "と" && p === "っ") return false;
    if (tk === "や" && !(KAN.test(n) || KATA.test(n))) return false;
    return true;
  }

  function scan(jp, spans) {
    const out = [], sp = (spans || []).slice().sort((a, b) => a[0] - b[0]);
    let i = 0;
    while (i < jp.length) {
      const hit = sp.find(s => i >= s[0] && i < s[1]);
      if (hit) { i = hit[1]; continue; }
      const pr = jp[i - 1] || "";
      if (!KAN.test(pr) && !KATA.test(pr)) { const sb = SB.find(w => jp.startsWith(w, i)); if (sb) { i += sb.length; continue; } }
      let took = false;
      for (const tk of TOKS) {
        if (!jp.startsWith(tk, i)) continue;
        const e = i + tk.length;
        if (sp.some(s => s[0] < e && s[1] > i)) continue;
        if (!ok(tk, jp, i)) continue;
        out.push([i, e, tk]); i = e; took = true; break;
      }
      if (!took) i++;
    }
    return out;
  }

  // Forma em que a palavra-alvo aparece (só quando difere da forma de dicionário).
  const FORMS = [
    [/ませんでした$/, "masu", "passado negativo educado (～ませんでした)"], [/ました$/, "masu", "passado educado (～ました)"],
    [/ません$/, "masu", "negativa educada (～ません)"], [/ましょう$/, "mashou", "de convite (～ましょう)"], [/ます$/, "masu", "educada (～ます), presente ou futuro"],
    [/たかった$/, "tai", "passado de querer (～たかった)"], [/たくない$|たくなかった$/, "tai", "negativa de querer (～たくない)"], [/たい$|たく$/, "tai", "de querer (～たい)"],
    [/なかった$/, "nai", "passado negativo (～なかった)"], [/ない$|なくて$|なければ$/, "nai", "negativa (～ない)"],
    [/ていた$|ていました$/, "te-iru", "passado de ～ている"], [/ている$|ています$|ていません$|ていない$/, "te-iru", "～ている (ação em curso ou estado)"],
    [/[てで]$/, "te", "～て"], [/[たっだ]$|った$|んだ$/, "ta", "passado (～た)"]
  ];
  function formOf(m, w) {
    if (m === w[0] || m === w[1]) return null;
    const adj = /い$/.test(w[1]) && /(く|かっ|くな)/.test(m.slice(w[0].length - 1));
    if (adj) return ["adj-i", "de adjetivo い"];
    for (const [re, g, lb] of FORMS) if (re.test(m)) return [g, lb];
    return null;
  }

  // ---- frases divididas em palavras (data/sent-tokens-*.js) ----
  const hira = x => x.replace(/[\u30a1-\u30f6]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
  const PUNCT = "、。？?！!「」『』…・,. \u3000";
  let WIDX = null;
  function widx() {
    if (WIDX) return WIDX; WIDX = {};
    if (typeof CATEGORIES !== "undefined") for (const c of CATEGORIES) for (const w of c.words) { const k = w[0] + "|" + hira(w[1]); if (!(k in WIDX)) WIDX[k] = w[3]; }
    return WIDX;
  }
  // Devolve [ini, fim, palavra] (função gramatical, sem significado próprio) ou [ini, fim, palavra, leitura, significado]; null se não bater.
  function fromTokens(jp, T, spans) {
    const out = []; let p = 0;
    for (const t of T) {
      const s = t[0]; while (p < jp.length && PUNCT.includes(jp[p])) p++;
      if (!jp.startsWith(s, p)) return null;
      const e = p + s.length, m = t[2] || "";
      if (!(spans || []).some(x => x[0] < e && x[1] > p)) out.push(!m && FW[s] ? [p, e, s] : [p, e, s, t[1] || s, m]);
      p = e;
    }
    return out;
  }

  // ---- DOM ----
  let tip = null, cur = null;
  const mk = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  function getTip() {
    if (tip) return tip;
    tip = mk("div", "fw-tip"); tip.id = "kd-tip"; tip.hidden = true; tip.setAttribute("role", "status"); tip.setAttribute("aria-live", "polite");
    return tip;
  }
  function close(refocus) {
    if (cur) { cur.setAttribute("aria-expanded", "false"); cur.removeAttribute("aria-describedby"); if (refocus && cur.isConnected) cur.focus(); }
    cur = null;
    if (tip) { tip.hidden = true; tip.replaceChildren(); }
  }
  function link(id, label) {
    const a = mk("a", "fw-g", label || "Ver na gramática →"); a.href = "grammar.html#t-" + id; return a;
  }
  function open(el, host) {
    const box = host.closest("#ex") || host.parentNode;
    if (cur === el) { close(true); return; }
    close();
    const t = getTip(), w = host._kdw;
    let head, sub, body, g = [];
    if (el.tagName === "MARK") {
      const m = el.textContent, f = formOf(m, w);
      head = w[0]; sub = `${typeof pitch === "function" ? pitch(w) : w[1]} · ${w[2]}`; body = w[3];
      if (f) { body += ` — forma usada: ${f[1]}.`; g = [f[0]]; }
    } else if (el.dataset.k === "t") {
      const r = el.dataset.r; head = el.dataset.t; sub = r !== head ? r : "";
      body = el.dataset.m || widx()[head + "|" + hira(r)] || "(sem tradução)";
    } else {
      const it = FW[el.dataset.t], atStart = el.dataset.s === "1", v = (atStart && it.st) || it;
      head = el.dataset.t; sub = it.r ? it.r + " · " + v.pt : v.pt; body = v.u;
      if (!(atStart && it.st && !it.st.g && !it.st.u)) g = [v.g || (atStart && it.st ? null : it.g), (atStart && it.st) ? null : it.g2].filter(Boolean);
    }
    const x = mk("button", "fw-x", "✕"); x.type = "button"; x.setAttribute("aria-label", "Fechar explicação"); x.onclick = () => close(true);
    const h = mk("div", "fw-h"); const b = mk("b", null, head); b.lang = "ja"; h.append(b, mk("span", null, sub));
    t.replaceChildren(x, h, mk("div", "fw-b", body));
    if (g.length) { const l = mk("div", "fw-l"); g.forEach((id, n) => l.append(link(id, n ? "Ver também →" : "Ver na gramática →"))); t.append(l); }
    t.hidden = false; box.append(t);
    cur = el; el.setAttribute("aria-expanded", "true"); el.setAttribute("aria-describedby", "kd-tip");
  }
  function arm(e) { e.setAttribute("role", "button"); e.tabIndex = -1; e.setAttribute("aria-expanded", "false"); }

  function wrap(el, jp, spans, w) {
    el._kdw = w;
    el.querySelectorAll("mark.hl").forEach(arm);
    const T = typeof SENTTOK !== "undefined" ? SENTTOK[jp] : null;
    const toks = (T && fromTokens(jp, T, spans)) || scan(jp, spans);
    const first = () => { const l = el.querySelectorAll(FOCUSABLE); l.forEach((x, i) => x.tabIndex = i ? -1 : 0); };
    if (!toks.length) { first(); return; }
    let pos = 0;
    for (const node of [...el.childNodes]) {
      const len = node.textContent.length, a = pos, b = pos + len; pos = b;
      if (node.nodeType !== 3) continue;
      const mine = toks.filter(x => x[0] >= a && x[1] <= b);
      if (!mine.length) continue;
      const frag = document.createDocumentFragment(); let p = a;
      for (const [s, e, tk, r, m] of mine) {
        if (s > p) frag.append(jp.slice(p, s));
        const sp = mk("span", r === undefined ? "fw" : "fw tk", tk); sp.dataset.t = tk;
        if (r !== undefined) { sp.dataset.k = "t"; sp.dataset.r = r; sp.dataset.m = m; }
        else if (s === 0 || CLAUSE.includes(jp[s - 1])) sp.dataset.s = "1";
        arm(sp); frag.append(sp); p = e;
      }
      if (p < b) frag.append(jp.slice(p, b));
      node.replaceWith(frag);
    }
    first();
  }

  if (typeof document !== "undefined") {
    const target = e => { const f = e.target.closest && e.target.closest(".fw, mark.hl"); return f && f.closest(".sw-exj, #ex-jp") && f.closest(".sw-exj, #ex-jp")._kdw ? f : null; };
    document.addEventListener("click", e => {
      const f = target(e);
      if (f) { e.preventDefault(); open(f, f.closest(".sw-exj, #ex-jp")); return; }
      if (cur && !(tip && tip.contains(e.target))) close();
    });
    const hostOf = f => f.closest(".sw-exj, #ex-jp");
    document.addEventListener("focusin", e => {
      const f = target(e); if (f) hostOf(f).querySelectorAll(FOCUSABLE).forEach(x => x.tabIndex = x === f ? 0 : -1);
    });
    document.addEventListener("keydown", e => {
      if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && target(e)) {
        const f = target(e), l = [...hostOf(f).querySelectorAll(FOCUSABLE)], n = l[l.indexOf(f) + (e.key === "ArrowRight" ? 1 : -1)];
        if (n) { e.preventDefault(); n.focus(); } return;
      }
      if (e.key === "Escape" && cur) { close(true); return; }
      if ((e.key === "Enter" || e.key === " ") && target(e)) { e.preventDefault(); target(e).click(); }
    });
  }
  return { wrap, close, scan, FW };
})();
if (typeof module !== "undefined") module.exports = KDFW;
