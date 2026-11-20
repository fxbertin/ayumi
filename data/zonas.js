// Motor compartilhado dos jogos de "zonas" (desenho esquemático em SVG + palavras de data/words.js).
// Usado por kurashi.html (Kurashi Meguri). O karada.html NÃO usa este arquivo: tem a sua própria cópia do código.
// Um jogo novo precisa só de: uma página com <main id="app">, um arquivo de dados (como data/casa.js) e
// Zonas.mount(document.getElementById("app"), { prefix, data, aria, text }).
//
// DADOS (objeto D):
//   ZONES   [{k:"japonês|kana", s:cena, c:cor, d, bb, up, eo, o}]  zonas clicáveis (use builder().z)
//   DECOR   [{s, c, d, bb, line, eo, o}]                            enfeites sem toque (use builder().dec)
//   Zonas e enfeites são desenhados na ordem de criação (campo o): o que vem depois fica por cima e recebe o toque primeiro.
//   SCENES  {id:{tag, parent, box}}  cena raiz não tem parent; cena filha tem parent e box [x,y,w,h] (mesma proporção do quadro)
//           = trecho da cena pai que é "aproximado" para chegar à filha (e o contrário ao voltar).
//   ORDER   [ids das cenas]          ordem de passeio das perguntas
//   VISTAS  {id:{name, scenes:[...], quota:{cena:n}}}  VORDER: ordem dos botões
//   GROUP   {cena: grupo}            alternativas de resposta vêm do mesmo grupo
//   ALIAS   {"chave":["chave2",...]} outras palavras aceitas no modo Digitar
//   FALLBACK, FRAME [W,H] (400x600), MAX (10 por rodada), MIN (zonas mínimas por vista), EXCLUIDAS, NEED
const Zonas = (() => {
  const KANJI = /[\u4e00-\u9faf]/;
  // ---------- formas ----------
  const n = v => Math.round(v * 100) / 100;
  const E = (cx, cy, rx, ry) => ({ t: "E", a: [cx, cy, rx, ry], bb: [cx - rx, cy - ry, cx + rx, cy + ry] });
  const R = (x, y, w, h, r = 0) => ({ t: "R", a: [x, y, w, h, Math.min(r, w / 2, h / 2)], bb: [x, y, x + w, y + h] });
  const P = (d, bb) => ({ t: "P", d, bb });
  const G = pts => P("M" + pts.map(p => p[0] + " " + p[1]).join("L") + "z",
    [Math.min(...pts.map(p => p[0])), Math.min(...pts.map(p => p[1])), Math.max(...pts.map(p => p[0])), Math.max(...pts.map(p => p[1]))]);
  const mir = s => s.t === "E" ? E(400 - s.a[0], s.a[1], s.a[2], s.a[3])
    : s.t === "R" ? R(400 - s.a[0] - s.a[2], s.a[1], s.a[2], s.a[3], s.a[4]) : s;
  const dOf = s => {
    if (s.t === "P") return s.d;
    if (s.t === "E") { const [cx, cy, rx, ry] = s.a; return `M${n(cx - rx)} ${n(cy)}a${rx} ${ry} 0 1 0 ${n(2 * rx)} 0a${rx} ${ry} 0 1 0 ${n(-2 * rx)} 0z`; }
    const [x, y, w, h, r] = s.a;
    if (!r) return `M${x} ${y}h${w}v${h}h${-w}z`;
    return `M${n(x + r)} ${y}h${n(w - 2 * r)}a${r} ${r} 0 0 1 ${r} ${r}v${n(h - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${r}h${n(-(w - 2 * r))}a${r} ${r} 0 0 1 ${-r} ${-r}v${n(-(h - 2 * r))}a${r} ${r} 0 0 1 ${r} ${-r}z`;
  };
  const build = (shapes, sym) => {
    const all = sym ? shapes.flatMap(s => [s, mir(s)]) : shapes;
    const bb = all.reduce((m, s) => [Math.min(m[0], s.bb[0]), Math.min(m[1], s.bb[1]), Math.max(m[2], s.bb[2]), Math.max(m[3], s.bb[3])], [1e9, 1e9, -1e9, -1e9]);
    return { d: all.map(dOf).join(""), bb };
  };
  // z(chave, cena, cor, formas, {sym, up, eo}) = zona clicável; dec(cena, cor, formas, {sym, line, eo}) = enfeite sem toque
  function builder() {
    let o = 0; const Z = [], D = [];
    const z = (k, s, c, shapes, opt = {}) => Z.push({ k, s, c, ...build(shapes, opt.sym), up: opt.up || null, eo: !!opt.eo, o: o++ });
    const dec = (s, c, shapes, opt = {}) => D.push({ s, c, ...build(shapes, opt.sym), line: !!opt.line, eo: !!opt.eo, o: o++ });
    return { Z, D, z, dec };
  }

  // ---------- romaji → hiragana ----------
  const R2K = (() => {
    const T = { a: "あ", i: "い", u: "う", e: "え", o: "お" };
    const rows = { k: "かきくけこ", s: "さしすせそ", t: "たちつてと", n: "なにぬねの", h: "はひふへほ", m: "まみむめも", r: "らりるれろ", g: "がぎぐげご", z: "ざじずぜぞ", d: "だぢづでど", b: "ばびぶべぼ", p: "ぱぴぷぺぽ" };
    for (const c in rows) [..."aiueo"].forEach((v, i) => T[c + v] = rows[c][i]);
    Object.assign(T, { ya: "や", yu: "ゆ", yo: "よ", wa: "わ", wo: "を", shi: "し", chi: "ち", tsu: "つ", fu: "ふ", ji: "じ", si: "し", ti: "ち", tu: "つ", hu: "ふ", zi: "じ",
      sha: "しゃ", shu: "しゅ", sho: "しょ", cha: "ちゃ", chu: "ちゅ", cho: "ちょ", ja: "じゃ", ju: "じゅ", jo: "じょ",
      sya: "しゃ", syu: "しゅ", syo: "しょ", tya: "ちゃ", tyu: "ちゅ", tyo: "ちょ", zya: "じゃ", zyu: "じゅ", zyo: "じょ", jya: "じゃ", jyu: "じゅ", jyo: "じょ" });
    for (const c of "kgnhmrbp") { const r = rows[c]; T[c + "ya"] = r[1] + "ゃ"; T[c + "yu"] = r[1] + "ゅ"; T[c + "yo"] = r[1] + "ょ"; }
    return s => {
      let out = "", i = 0;
      while (i < s.length) {
        const c = s[i], nx = s[i + 1];
        if (c === "n") {
          const vy = ch => !!ch && "aiueoy".includes(ch);
          if (nx === "n") { out += "ん"; i += vy(s[i + 2]) ? 1 : 2; continue; }
          if (!vy(nx)) { out += "ん"; i++; continue; }
        }
        if (c !== "n" && !"aiueo".includes(c) && nx === c) { out += "っ"; i++; continue; }
        if (c === "t" && s.startsWith("tch", i)) { out += "っ"; i++; continue; }
        let hit = false;
        for (const L of [3, 2, 1]) { const t = T[s.substr(i, L)]; if (t && s.substr(i, L).length === L) { out += t; i += L; hit = true; break; } }
        if (!hit) return null;
      }
      return out;
    };
  })();
  const toHira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
  // a resposta digitada bate com a palavra w? (kanji, hiragana, katakana ou romaji)
  function matchWord(w, raw) {
    const n = raw.trim().toLowerCase().replace(/[\s'’\-・.]/g, "");
    if (!n) return false;
    if (n === w.kj || toHira(n) === w.kana) return true;
    const k = R2K(n);
    return (k !== null && k === w.kana) || n === w.ro.replace(/[\s'’\-]/g, "");
  }
  // palavra com furigana só sobre o kanji (okurigana fica de fora)
  function wordEl(w, furi) {
    const s = document.createElement("span"); s.lang = "ja"; s.className = "wd";
    if (!furi || w.kj === w.kana || !KANJI.test(w.kj)) { s.textContent = w.kj; return s; }
    const kj = w.kj, ka = w.kana;
    let a = 0; while (a < kj.length - 1 && kj[a] === ka[a] && !KANJI.test(kj[a])) a++;
    let b = 0; while (b < kj.length - a - 1 && kj[kj.length - 1 - b] === ka[ka.length - 1 - b] && !KANJI.test(kj[kj.length - 1 - b])) b++;
    const r = document.createElement("ruby"), t = document.createElement("rt");
    r.append(kj.slice(a, kj.length - b)); t.textContent = ka.slice(a, ka.length - b); r.append(t);
    s.append(kj.slice(0, a), r, kj.slice(kj.length - b));
    return s;
  }

  // ---------- validador (node) ----------
  function validate(D, C, S) {
    const errs = [], err = (...a) => errs.push(a.join(" "));
    const [W, H] = D.FRAME || [400, 600], MAX = D.MAX || 10;
    const WM = new Map();
    C.forEach(c => c.words.forEach(w => { const k = w[0] + "|" + w[1]; if (!WM.has(k)) WM.set(k, w); }));
    const hasS = new Set(S.flatMap(s => s[3]));
    const byKey = new Map();
    const inFrame = (o, what) => { if (!(o.bb[0] >= 0 && o.bb[1] >= 0 && o.bb[2] <= W && o.bb[3] <= H)) err(what, "fora do quadro", W + "x" + H, JSON.stringify(o.bb)); };
    for (const z of D.ZONES) {
      if (byKey.has(z.k)) err("zona repetida", z.k); byKey.set(z.k, z);
      const w = WM.get(z.k);
      if (!w) { err("palavra fora do words.js", z.k); continue; }
      if (!/^[ぁ-んー]+$/.test(w[1])) err("leitura não é hiragana", z.k);
      if (!hasS.has(z.k)) err("palavra sem frase de exemplo", z.k);
      if (!D.SCENES[z.s]) err("cena inválida", z.k, z.s);
      if (!(typeof z.d === "string" && /^M[-\d. ]/.test(z.d) && /[zZ]$/.test(z.d))) err("caminho suspeito", z.k);
      inFrame(z, "zona " + z.k);
      if ((z.bb[2] - z.bb[0]) < 10 || (z.bb[3] - z.bb[1]) < 8) err("zona pequena demais para tocar", z.k, JSON.stringify(z.bb));
    }
    for (const z of D.ZONES) {
      if (z.up) { const p = byKey.get(z.up); if (!p) err("pai inexistente", z.k, z.up); else if (p.s !== z.s) err("pai em outra cena", z.k, z.up); }
      let c = 0, p = z.up; while (p && c < 10) { p = (byKey.get(p) || {}).up; c++; } if (c >= 10) err("ciclo em 'up'", z.k);
    }
    D.DECOR.forEach((d, i) => { if (!D.SCENES[d.s]) err("enfeite em cena inválida", i, d.s); inFrame(d, "enfeite " + i); });
    // cenas: árvore de zoom
    const fr = W / H;
    for (const [id, s] of Object.entries(D.SCENES)) {
      if (!s.tag) err("cena sem etiqueta", id);
      if (!D.ORDER.includes(id)) err("cena fora de ORDER", id);
      if (s.parent) {
        if (!D.SCENES[s.parent]) err("pai de cena inexistente", id, s.parent);
        if (!s.box || s.box.length !== 4) err("cena filha sem box", id);
        else {
          if (Math.abs(s.box[2] / s.box[3] - fr) > 0.01) err("box com proporção diferente do quadro", id, s.box);
          if (s.box[2] < W / 4) err("box pequeno demais (zoom excessivo)", id);
        }
        let c = 0, p = s.parent; while (p && c < 10) { p = (D.SCENES[p] || {}).parent; c++; } if (c >= 10) err("ciclo nas cenas", id);
      }
    }
    D.ORDER.forEach(id => { if (!D.SCENES[id]) err("ORDER com cena inexistente", id); });
    // vistas
    for (const [v, vs] of Object.entries(D.VISTAS)) {
      const sc = vs.quota ? Object.keys(vs.quota) : vs.scenes;
      sc.forEach(x => { if (!D.SCENES[x]) err("vista com cena inexistente", v, x); });
      const cnt = D.ZONES.filter(z => (vs.scenes || sc).includes(z.s)).length;
      if (cnt < (D.MIN || 8)) err("poucas zonas na vista", v, cnt);
      if (vs.quota) { const tot = Object.values(vs.quota).reduce((a, b) => a + b, 0); if (tot > MAX) err("cota da vista passa do máximo da rodada", v, tot);
        Object.entries(vs.quota).forEach(([s, q]) => { if (D.ZONES.filter(z => z.s === s).length < q) err("cota maior que as zonas da cena", v, s); }); }
    }
    D.VORDER.forEach(v => { if (!D.VISTAS[v]) err("VORDER com vista inexistente", v); });
    // grupos: leituras e significados sem repetição, alternativas suficientes
    const groups = {};
    D.ZONES.forEach(z => (groups[D.GROUP[z.s] || z.s] = groups[D.GROUP[z.s] || z.s] || []).push(z));
    const anc = z => { const o = []; let p = z.up; while (p) { o.push(p); p = (byKey.get(p) || {}).up; } return o; };
    const related = (a, b) => a === b || anc(a).includes(b.k) || anc(b).includes(a.k);
    const FB = D.FALLBACK || [];
    for (const [g, zs] of Object.entries(groups)) {
      const kana = new Map(), pt = new Map();
      zs.forEach(z => {
        const w = WM.get(z.k); if (!w) return;
        if (kana.has(w[1])) err("leitura repetida no grupo", g, w[1], z.k, kana.get(w[1])); kana.set(w[1], z.k);
        if (pt.has(w[3])) err("significado repetido no grupo", g, w[3], z.k, pt.get(w[3])); pt.set(w[3], z.k);
        const alias2 = (a, b) => ((D.ALIAS || {})[a.k] || []).includes(b.k);
        const cand = zs.filter(x => WM.get(x.k) && !related(x, z) && !alias2(z, x) && !alias2(x, z) && WM.get(x.k)[1] !== w[1] && WM.get(x.k)[3] !== w[3]);
        if (cand.length < 3 && !FB.includes(z.k)) err("poucas alternativas no grupo", z.k, cand.length);
      });
    }
    // aliases (outras palavras aceitas ao digitar)
    for (const [k, list] of Object.entries(D.ALIAS || {})) {
      if (!byKey.has(k)) err("alias de zona inexistente", k);
      list.forEach(a => { const w = WM.get(a); if (!w) err("alias fora do words.js", a); else if (!/^[ぁ-んー]+$/.test(w[1])) err("alias sem hiragana", a); });
    }
    // cobertura pedida e exclusões
    (D.EXCLUIDAS || []).forEach(k => { if (!WM.has(k)) err("exclusão inexistente no words.js", k); if (byKey.has(k)) err("exclusão que também tem zona", k); });
    (D.NEED || []).forEach(k => { if (!byKey.has(k) && !(D.EXCLUIDAS || []).includes(k)) err("palavra pedida sem zona nem exclusão", k); });
    return { errs, groups: Object.fromEntries(Object.entries(groups).map(([g, zs]) => [g, zs.length])), zonas: D.ZONES.length, enfeites: D.DECOR.length };
  }

  // ---------- jogo (navegador) ----------
  const TEMPLATE = (W, H, aria, T) => `
  <section id="menu">
    <div class="setrow">
      <span id="l-vista">Onde passear:</span>
      <div class="seg" role="group" aria-labelledby="l-vista" id="vistas"></div>
    </div>
    <div class="setrow">
      <span id="l-modo">Como jogar:</span>
      <div class="seg" role="group" aria-labelledby="l-modo">
        <button type="button" data-modo="escolher">Escolher</button>
        <button type="button" data-modo="digitar">Digitar</button>
        <button type="button" data-modo="tocar">${T.tocarBtn}</button>
      </div>
    </div>
    <div class="setrow">
      <label><input type="checkbox" id="furi" checked> Mostrar furigana</label>
      <button id="go" type="button" class="primary">Começar</button>
    </div>
    <p id="rec" class="rec"></p>
  </section>
  <section id="game" hidden>
    <div class="top"><span id="prog"></span><span id="score" class="stamp"></span></div>
    <div class="kgrid">
      <div>
        <div id="stagebox">
          <svg id="stage" viewBox="0 0 ${W} ${H}" role="img" aria-label="${aria}"></svg>
          <div id="tag" class="tag" aria-live="polite"></div>
        </div>
      </div>
      <div id="panel">
        <p id="ask" class="ask"></p>
        <div id="opts" class="opts" hidden></div>
        <div id="typed" hidden>
          <input id="ans" type="text" lang="ja" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="hiragana ou romaji" aria-label="Sua resposta">
          <button id="send" type="button" class="primary">Responder</button>
        </div>
        <div id="tapbox" hidden>
          <div id="tapword" class="tapword"></div>
          <div class="row">
            <button id="tapspeak" type="button" class="ghost" aria-label="Ouvir a palavra">🔊</button>
            <button id="tiphint" type="button" class="ghost">Ver o significado (sem ponto)</button>
          </div>
        </div>
        <div id="fb" class="fb" aria-live="polite"></div>
        <div class="row">
          <button id="next" type="button" class="primary" hidden>Próxima</button>
          <button id="quit" type="button" class="ghost">Sair da rodada</button>
        </div>
      </div>
    </div>
  </section>
  <section id="result" hidden>
    <h2 id="final"></h2>
    <p id="best"></p>
    <div id="review"></div>
    <div class="row">
      <button id="again" type="button" class="primary">Jogar de novo</button>
      <button id="home" type="button" class="ghost">Voltar ao menu</button>
    </div>
  </section>`;

  function mount(root, cfg) {
    const D = cfg.data, [W, H] = D.FRAME || [400, 600], MAX = D.MAX || 10, PX = cfg.prefix;
    const T = Object.assign({ unit: "item", tocarBtn: "Tocar no desenho", ask1: "O que está piscando?", ask2: "Como se diz isto? Digite em hiragana ou romaji (kanji também vale).", ask3: "Toque no desenho do que esta palavra nomeia.", tagFallback: "" }, cfg.text);
    root.innerHTML = TEMPLATE(W, H, cfg.aria || "Desenho esquemático", T);
    const $ = s => root.querySelector(s);
    const ls = { get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
    const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const RM = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
    const NS = "http://www.w3.org/2000/svg";
    const FULL = [0, 0, W, H];

    // dados
    const WORDS = new Map();
    (cfg.categories || CATEGORIES).forEach(c => c.words.forEach(([kj, kana, ro, pt]) => { const k = kj + "|" + kana; if (!WORDS.has(k)) WORDS.set(k, { k, kj, kana, ro, pt }); }));
    const ZONES = D.ZONES.map((z, i) => ({ ...z, i, w: WORDS.get(z.k), g: D.GROUP[z.s] || z.s }));
    const BYKEY = new Map(ZONES.map(z => [z.k, z]));
    const ALIAS = new Map(Object.entries(D.ALIAS || {}).map(([k, l]) => [k, l.map(a => WORDS.get(a)).filter(Boolean)]));
    const ancestors = z => { const o = []; let p = z.up; while (p) { o.push(p); p = BYKEY.get(p).up; } return o; };
    const related = (a, b) => a === b || ancestors(a).includes(b.k) || ancestors(b).includes(a.k);
    const qCount = v => { const vs = D.VISTAS[v]; return vs.quota ? Math.min(MAX, Object.values(vs.quota).reduce((a, b) => a + b, 0)) : Math.min(MAX, ZONES.filter(z => vs.scenes.includes(z.s)).length); };

    // botões das vistas
    D.VORDER.forEach(v => { const b = document.createElement("button"); b.type = "button"; b.dataset.vista = v; b.textContent = D.VISTAS[v].name; $("#vistas").append(b); });

    // desenho
    const stage = $("#stage"), box = $("#stagebox");
    const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.append(e); return e; };
    const SC = {};
    for (const s of D.ORDER) {
      const g = mk("g", { class: "scene", style: "display:none" }, stage), vis = mk("g", {}, g), ov = mk("g", {}, g), hits = mk("g", {}, g);
      SC[s] = { g, ov, hits, hp: [] };
      const items = D.DECOR.filter(d => d.s === s).concat(ZONES.filter(z => z.s === s)).sort((a, b) => a.o - b.o);
      items.forEach(it => mk("path", { d: it.d, class: "v c-" + it.c, ...(it.eo ? { "fill-rule": "evenodd" } : {}) }, vis));
      const mine = ZONES.filter(z => z.s === s);
      mine.forEach((z, k) => {
        const h = mk("path", { d: z.d, class: "h", tabindex: -1, role: "button", "aria-label": `${T.unit[0].toUpperCase() + T.unit.slice(1)} ${k + 1} de ${mine.length}`, ...(z.eo ? { "fill-rule": "evenodd" } : {}) }, hits);
        h.onclick = () => onTap(z);
        h.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onTap(z); } };
        SC[s].hp.push(h);
      });
    }
    const clearOv = () => D.ORDER.forEach(s => SC[s].ov.replaceChildren());
    const putOv = (z, cls) => mk("path", { d: z.d, class: "pl " + (cls || ""), ...(z.eo ? { "fill-rule": "evenodd" } : {}) }, SC[z.s].ov);
    const boxT = b => { const k = W / b[2]; return `matrix(${k} 0 0 ${k} ${-b[0] * k} ${-b[1] * k})`; };
    function tweenZoom(g, from, to, ms) {
      return new Promise(res => {
        if (RM()) { g.setAttribute("transform", boxT(to)); return res(); }
        const t0 = performance.now();
        const f = t => { let p = Math.min(1, Math.max(0, (t - t0) / ms)); p = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          g.setAttribute("transform", boxT(from.map((v, i) => v + (to[i] - v) * p))); p < 1 ? requestAnimationFrame(f) : res(); };
        requestAnimationFrame(f);
      });
    }
    async function swap(a, b) {
      const ga = SC[a].g, gb = SC[b].g;
      if (RM()) { ga.style.display = "none"; gb.style.display = ""; return; }
      gb.style.opacity = 0; gb.style.display = ""; gb.getBoundingClientRect();
      ga.style.transition = gb.style.transition = "opacity .18s";
      ga.style.opacity = 0; gb.style.opacity = 1; await sleep(190);
      ga.style.display = "none"; ga.style.opacity = ""; gb.style.opacity = ""; ga.style.transition = gb.style.transition = "";
    }
    function setTapMode(on) {
      stage.classList.toggle("tap", on);
      D.ORDER.forEach(s => SC[s].hp.forEach(h => h.setAttribute("tabindex", on && s === S.scene ? 0 : -1)));
    }
    const setTag = s => { $("#tag").textContent = D.SCENES[s].tag; };
    function showOnly(s) {
      D.ORDER.forEach(x => { SC[x].g.style.display = x === s ? "" : "none"; SC[x].g.style.opacity = ""; SC[x].g.removeAttribute("transform"); });
      S.scene = s; setTag(s);
    }
    const chain = s => { const a = [s]; while (D.SCENES[a[a.length - 1]].parent) a.push(D.SCENES[a[a.length - 1]].parent); return a; };
    async function goScene(t) {
      const cur = S.scene;
      if (cur === t) return;
      if (!cur) return showOnly(t);
      setTapMode(false);
      const ca = chain(cur), ct = chain(t), lca = ca.find(x => ct.includes(x));
      if (!lca) { await swap(cur, t); S.scene = t; setTag(t); return; }
      while (S.scene !== lca) {                               // sai de um cômodo: volta ao pai (afasta o zoom)
        const c = S.scene, p = D.SCENES[c].parent, b = D.SCENES[c].box;
        SC[p].g.setAttribute("transform", boxT(b));
        await swap(c, p); S.scene = p;
        await tweenZoom(SC[p].g, b, FULL, 380); SC[p].g.removeAttribute("transform");
      }
      for (const c of ct.slice(0, ct.indexOf(lca)).reverse()) { // entra num cômodo: aproxima o zoom no trecho do pai
        const p = S.scene, b = D.SCENES[c].box;
        await tweenZoom(SC[p].g, FULL, b, 380);
        await swap(p, c); SC[p].g.removeAttribute("transform"); S.scene = c;
      }
      setTag(t);
    }

    // estado e rodada
    const S = { vista: D.VORDER[0], modo: "escolher", furi: true, scene: null, qs: [], qi: 0, right: 0, wrong: [], locked: true, answered: false, hinted: false };
    function makeRound() {
      const vs = D.VISTAS[S.vista]; let pick;
      if (vs.quota) pick = Object.keys(vs.quota).flatMap(sc => shuffle(ZONES.filter(z => z.s === sc)).slice(0, vs.quota[sc]));
      else pick = shuffle(ZONES.filter(z => vs.scenes.includes(z.s))).slice(0, qCount(S.vista));
      return pick.slice(0, MAX).sort((a, b) => D.ORDER.indexOf(a.s) - D.ORDER.indexOf(b.s)).map(z => ({ z }));
    }
    function distractors(z) {       // alternativas do mesmo grupo; se faltarem, completa com os outros grupos
      const al = (a, b) => (ALIAS.get(a.k) || []).some(w => w.k === b.k);
      const ok = x => !related(x, z) && !al(z, x) && !al(x, z) && x.w.kana !== z.w.kana && x.w.pt !== z.w.pt;
      const same = shuffle(ZONES.filter(x => x.g === z.g && ok(x)));
      if (same.length >= 3) return same.slice(0, 3);
      return same.concat(shuffle(ZONES.filter(x => x.g !== z.g && ok(x)))).slice(0, 3);
    }
    const setPanel = m => { $("#opts").hidden = m !== "escolher"; $("#typed").hidden = m !== "digitar"; $("#tapbox").hidden = m !== "tocar"; };
    function hud() { $("#prog").textContent = `${T.unit[0].toUpperCase() + T.unit.slice(1)} ${S.qi + 1} de ${S.qs.length}`; $("#score").textContent = `${S.right} acerto${S.right === 1 ? "" : "s"}`; }
    function speakBtn(w) {
      const b = document.createElement("button"); b.type = "button"; b.className = "ghost"; b.textContent = "🔊"; b.setAttribute("aria-label", "Ouvir " + w.kana);
      b.onclick = () => AyumiTTS.speak(w.kana); return b;
    }
    const hasTTS = () => typeof AyumiTTS !== "undefined" && AyumiTTS.supported();

    async function showQ() {
      S.locked = true; S.answered = false; S.hinted = false;
      const q = S.qs[S.qi];
      clearOv(); hud(); $("#fb").textContent = ""; $("#fb").className = "fb"; $("#next").hidden = true;
      setPanel(S.modo); $("#ask").textContent = "";
      await goScene(q.z.s);
      if (S.modo === "escolher") {
        $("#ask").textContent = T.ask1;
        const opts = shuffle([q.z, ...distractors(q.z)]), bx = $("#opts"); bx.replaceChildren();
        opts.forEach(o => {
          const b = document.createElement("button"); b.type = "button"; b.className = "opt"; b.dataset.k = o.k;
          b.append(wordEl(o.w, S.furi)); b.onclick = () => onPick(o, b); bx.append(b);
        });
        putOv(q.z);
      } else if (S.modo === "digitar") {
        $("#ask").textContent = T.ask2;
        const a = $("#ans"); a.value = ""; a.disabled = false; $("#send").disabled = false; putOv(q.z); a.focus({ preventScroll: true });
      } else {
        $("#ask").textContent = T.ask3;
        $("#tapword").replaceChildren(wordEl(q.z.w, S.furi));
        $("#tapspeak").hidden = !hasTTS(); $("#tiphint").disabled = false; $("#tiphint").textContent = "Ver o significado (sem ponto)";
        setTapMode(true);
      }
      S.locked = false;
    }
    function feedback(ok, z, extra) {
      const f = $("#fb"); f.className = "fb " + (ok ? "ok" : "bad"); f.replaceChildren();
      const lead = document.createElement("b"); lead.textContent = ok ? (extra || "Certo!") : "Era:"; f.append(lead, " ");
      f.append(wordEl(z.w, true), ` (${z.w.kana}) · ${z.w.pt}`);
      if (hasTTS()) f.append(speakBtn(z.w));
    }
    function conclude(ok, z, o = {}) {
      S.answered = true; S.locked = true; setTapMode(false);
      if (ok && o.point !== false) S.right++; else S.wrong.push(z);
      hud(); feedback(ok, z, o.note);
      const last = S.qi === S.qs.length - 1, nb = $("#next"); nb.textContent = last ? "Ver resultado" : "Próxima"; nb.hidden = false; nb.focus({ preventScroll: true });
    }
    function onPick(o, btn) {
      if (S.locked) return; const z = S.qs[S.qi].z, ok = o === z;
      [...$("#opts").children].forEach(b => { b.disabled = true; if (b.dataset.k === z.k) b.classList.add("ok"); else if (b === btn) b.classList.add("bad"); });
      clearOv(); putOv(z, "ok"); conclude(ok, z);
    }
    function onSend() {
      if (S.locked) return; const z = S.qs[S.qi].z, raw = $("#ans").value;
      if (!raw.trim()) return;
      let ok = matchWord(z.w, raw), note;
      if (!ok) { const al = (ALIAS.get(z.k) || []).find(w => matchWord(w, raw)); if (al) { ok = true; note = `Certo! (${al.kj} também vale)`; } }
      $("#ans").disabled = true; $("#send").disabled = true; clearOv(); putOv(z, ok ? "ok" : "bad"); conclude(ok, z, { note });
    }
    function onTap(t) {
      if (S.locked || S.modo !== "tocar") return; const z = S.qs[S.qi].z;
      const ok = t === z || ancestors(t).includes(z.k);
      clearOv(); putOv(z, "ok"); if (!ok && t.s === z.s) putOv(t, "bad");
      conclude(ok, z, ok && S.hinted ? { point: false, note: "Certo, mas com dica (sem ponto)." } : {});
    }
    function next() { if (!S.answered) return; if (S.qi >= S.qs.length - 1) return finish(); S.qi++; showQ(); }
    const show = id => ["menu", "game", "result"].forEach(x => $("#" + x).hidden = x !== id);
    function start() {
      Object.assign(S, { qs: makeRound(), qi: 0, right: 0, wrong: [] });
      $("#game").dataset.modo = S.modo;
      ls.set(`kd-${PX}-vista`, S.vista); ls.set(`kd-${PX}-modo`, S.modo); ls.set(`kd-${PX}-furi`, S.furi);
      show("game"); showQ();
    }
    function finish() {
      clearOv(); setTapMode(false); show("result");
      const n = S.qs.length, key = `best:${PX}-${S.vista}`, prev = ls.get(key) || 0, vn = D.VISTAS[S.vista].name.toLowerCase();
      $("#final").textContent = `${S.right} acerto${S.right === 1 ? "" : "s"} em ${n} (${vn})`;
      if (S.right > prev) { ls.set(key, S.right); $("#best").textContent = prev ? `Novo recorde! (antes: ${prev})` : "Primeiro resultado salvo como recorde."; }
      else $("#best").textContent = `Recorde: ${prev} de ${n}`;
      const rv = $("#review"); rv.replaceChildren();
      if (S.wrong.length) {
        const h = document.createElement("h2"); h.textContent = "Para revisar"; rv.append(h);
        S.wrong.forEach(z => {
          const row = document.createElement("div"); row.className = "rev";
          const a = document.createElement("span"); a.append(wordEl(z.w, true), ` (${z.w.kana})`);
          const b = document.createElement("span"); b.lang = "pt"; b.textContent = z.w.pt; if (hasTTS()) b.append(speakBtn(z.w));
          row.append(a, b); rv.append(row);
        });
      }
    }
    function menu() { show("menu"); recLine(); }
    function recLine() {
      const b = ls.get(`best:${PX}-${S.vista}`);
      $("#rec").textContent = b ? `Recorde (${D.VISTAS[S.vista].name.toLowerCase()}): ${b} de ${qCount(S.vista)}` : "";
    }
    const setSeg = (attr, val) => root.querySelectorAll(`[data-${attr}]`).forEach(b => b.setAttribute("aria-pressed", b.dataset[attr] === val));

    // ligações
    const sv = ls.get(`kd-${PX}-vista`), sm = ls.get(`kd-${PX}-modo`);
    if (D.VISTAS[sv]) S.vista = sv; if (["escolher", "digitar", "tocar"].includes(sm)) S.modo = sm;
    S.furi = ls.get(`kd-${PX}-furi`) !== false; $("#furi").checked = S.furi;
    setSeg("vista", S.vista); setSeg("modo", S.modo); recLine();
    root.querySelectorAll("[data-vista]").forEach(b => b.onclick = () => { S.vista = b.dataset.vista; setSeg("vista", S.vista); recLine(); });
    root.querySelectorAll("[data-modo]").forEach(b => b.onclick = () => { S.modo = b.dataset.modo; setSeg("modo", S.modo); });
    $("#furi").onchange = e => { S.furi = e.target.checked; };
    $("#go").onclick = start; $("#again").onclick = start; $("#home").onclick = menu;
    $("#quit").onclick = () => { clearOv(); setTapMode(false); menu(); };
    $("#next").onclick = next; $("#send").onclick = onSend;
    $("#tapspeak").onclick = () => AyumiTTS.speak(S.qs[S.qi].z.w.kana);
    $("#tiphint").onclick = () => { S.hinted = true; $("#tiphint").disabled = true; $("#tiphint").textContent = S.qs[S.qi].z.w.pt; };
    $("#ans").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); S.answered ? next() : onSend(); } });
    addEventListener("keydown", e => {
      if ($("#game").hidden) return;
      if (S.modo === "escolher" && !S.answered && /^[1-4]$/.test(e.key)) { const b = $("#opts").children[+e.key - 1]; if (b) b.click(); }
      else if (S.answered && e.key === "Enter" && document.activeElement !== $("#next")) next();
    });
    return { S, ZONES, showQ, start };
  }

  return { shapes: { E, R, P, G, mir, build }, builder, R2K, toHira, matchWord, wordEl, validate, mount };
})();
if (typeof module !== "undefined") module.exports = Zonas;
