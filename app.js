const $ = s => document.querySelector(s);
const store = {
  get(k){ try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k,v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const bestKey = (id, n) => "best:" + id + (n === 10 ? "" : ":" + n);
let ROUNDS = [10, 20, 50].includes(store.get("rounds")) ? store.get("rounds") : 10;
const MORA = /[^ゃゅょぁぃぅぇぉャュョァィゥェォ][ゃゅょぁぃぅぇぉャュョァィゥェォ]?/g;
function pitch(w){
  const a = ACCENT[w[0]], m = w[1].match(MORA);
  if (a === undefined || !m) return w[1];
  return a === 0 ? w[1] + "→" : m.slice(0, a).join("") + "↓" + m.slice(a).join("");
}
const SENT = {};
if (typeof SENTENCES !== "undefined") for (const s of SENTENCES) for (const k of s[3]) (SENT[k] = SENT[k] || []).push(s);
const shuffle = a => { a = [...a]; for (let i = a.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; };
const show = id => { KDFW.close(); ["menu","game","study","feed","result"].forEach(s => $("#"+s).hidden = s !== id); };

const S = { mode: store.get("mode") === "play" ? "play" : "study", cat:null, dir: store.get("dir") || "jp2pt", reading: store.get("reading") !== false, auto: store.get("auto") === true,
            q:[], i:0, score:0, wrong:[], locked:false, correct:0 };

function setDir(d){
  S.dir = d; store.set("dir", d);
  $("#d-jp2pt").setAttribute("aria-pressed", d === "jp2pt");
  $("#d-pt2jp").setAttribute("aria-pressed", d === "pt2jp");
}

function setRounds(n){
  ROUNDS = n; store.set("rounds", n); $("#nq").textContent = n;
  for (const b of $("#rounds").children) b.setAttribute("aria-pressed", +b.dataset.n === n);
}

function setMode(m){
  S.mode = m; store.set("mode", m);
  $("#m-play").setAttribute("aria-pressed", m === "play");
  $("#m-study").setAttribute("aria-pressed", m === "study");
}

function sentRows(w){
  const out = [];
  for (const s of SENT[w[0] + "|" + w[1]] || []) {
    const e = document.createElement("div"); e.className = "sw-ex";
    const t = document.createElement("div");
    const j = document.createElement("div"); j.lang = "ja"; j.className = "sw-exj"; const sp = KDHL.find(s[0], w[0] + "|" + w[1]); KDHL.fill(j, s[0], sp); KDFW.wrap(j, s[0], sp, w);
    const k = document.createElement("div"); k.lang = "ja"; k.className = "sw-exk"; k.textContent = s[1]; k.hidden = !S.reading;
    const p = document.createElement("div"); p.textContent = s[2];
    t.append(j, k, p); e.append(t);
    if (TTS) { const b = document.createElement("button"); b.type = "button"; b.className = "ghost"; b.textContent = "🔊"; b.setAttribute("aria-label", "Ouvir frase"); b.onclick = () => speak(s[0]); e.append(b); }
    out.push(e);
  }
  return out;
}

function wordRow(w, tag, noEx, onStar){
  const r = document.createElement("div"); r.className = "sw";
  const ja = document.createElement("span"); ja.className = "sw-ja"; ja.lang = "ja"; ja.textContent = w[0];
  const rd = document.createElement("span"); rd.className = "sw-rd"; rd.lang = "ja"; rd.textContent = `${pitch(w)}  ${w[2]}`;
  const pt = document.createElement("span"); pt.className = "sw-pt"; pt.textContent = w[3];
  r.append(ja, rd, pt);
  if (TTS) { const b = document.createElement("button"); b.type = "button"; b.className = "ghost"; b.textContent = "🔊"; b.setAttribute("aria-label", "Ouvir " + w[1]); b.onclick = () => speak(w[1]); r.append(b); }
  r.append(starBtn(w, onStar ? on => onStar(on, r) : null));
  if (!noEx) r.append(...sentRows(w));
  if (tag) { const c = document.createElement("span"); c.className = "sw-cat"; c.textContent = tag; r.insertBefore(c, r.children[3] || null); }
  return r;
}

function study(cat){
  S.cat = cat;
  $("#study-title").textContent = `${cat.group}: ${cat.name}`;
  $("#study-feed").hidden = !!cat.srs;
  const list = $("#study-list"); list.replaceChildren();
  const refresh = () => {
    const n = cat.words.length;
    $("#study-count").textContent = `${n} palavra${n === 1 ? "" : "s"}`;
    $("#study-play").disabled = !n;
    if (cat.deck && !n) { const p = document.createElement("p"); p.className = "sw-info"; p.textContent = "Seu deck está vazio. Toque em ☆ ao lado de uma palavra para guardá-la aqui."; list.append(p); }
  };
  // No deck, tocar em ★ tira a palavra da lista na hora.
  const onStar = cat.deck ? (on, r) => { if (!on) { r.remove(); cat.words = deckWords(); refresh(); } } : null;
  list.append(...cat.words.map(w => wordRow(w, null, false, onStar)));
  refresh();
  show("study"); window.scrollTo(0, 0);
}

// Categoria virtual com todas as palavras de um nível JLPT (sem repetir "japonês|kana").
function levelCat(g){
  const seen = new Set(), words = [];
  for (const c of CATEGORIES) if (c.group === g) for (const w of c.words) { const k = w[0] + "|" + w[1]; if (!seen.has(k)) { seen.add(k); words.push(w); } }
  return { id: "lvl-" + g.slice(-2).toLowerCase(), group: g, name: "Todos os tópicos", words, all: true };
}

// Rolagem infinita: mostra cartões de palavras sem parar; ao acabar, recomeça (embaralhando ou não).
let FEED = null;
function feedPool(scope){
  if (scope === "deck") return deckWords();
  const seen = new Set(), out = [];
  for (const c of CATEGORIES) if (scope === "all" || scope === "g:" + c.group || scope === "c:" + c.id)
    for (const w of c.words) { const k = w[0] + "|" + w[1]; if (!seen.has(k)) { seen.add(k); out.push(w); } }
  return out;
}
function feedInit(){
  const sel = $("#feed-scope"), add = (p, v, t) => { const o = document.createElement("option"); o.value = v; o.textContent = t; p.append(o); };
  add(sel, "all", "Todas as palavras");
  add(sel, "deck", "Meu deck");
  const groups = [...new Set(CATEGORIES.map(c => c.group))];
  const og = document.createElement("optgroup"); og.label = "Por grupo";
  for (const g of groups) add(og, "g:" + g, g);
  sel.append(og);
  for (const g of groups) {
    const o = document.createElement("optgroup"); o.label = g;
    for (const c of CATEGORIES.filter(c => c.group === g)) add(o, "c:" + c.id, c.name);
    sel.append(o);
  }
  const cfg = store.get("feed") || {};
  sel.value = cfg.scope || "all";
  if (sel.value !== (cfg.scope || "all")) sel.value = "all";
  $("#feed-shuffle").checked = cfg.shuffle !== false;
}
function feedCard(w){
  const r = wordRow(w, null, true); r.classList.add("sw-card");
  if (SENT[w[0] + "|" + w[1]]) {
    const t = document.createElement("button"); t.type = "button"; t.className = "ghost sw-more"; t.textContent = "Frases ▾";
    let open = null;
    t.onclick = () => { if (open) { open.forEach(x => x.remove()); open = null; t.textContent = "Frases ▾"; } else { open = sentRows(w); r.append(...open); t.textContent = "Frases ▴"; } };
    r.append(t);
  }
  return r;
}
function feedMore(n){
  const list = $("#feed-list");
  for (let k = 0; k < n; k++) {
    if (FEED.i >= FEED.order.length) {
      FEED.order = FEED.cfg.shuffle ? shuffle(FEED.pool) : FEED.pool.slice(); FEED.i = 0; FEED.round++;
      $("#feed-info").textContent = `Rodada ${FEED.round} · ${FEED.pool.length} palavras`;
      if (FEED.round > 1) { const d = document.createElement("div"); d.className = "feed-sep"; d.textContent = `Rodada ${FEED.round}`; list.append(d); }
    }
    list.append(feedCard(FEED.order[FEED.i++]));
  }
  if (list.children.length > 120) {   // mantém a página leve, sem mexer na posição da rolagem
    const keep = list.children[40], before = keep.getBoundingClientRect().top;
    for (let k = 0; k < 40; k++) list.children[0].remove();
    window.scrollBy(0, keep.getBoundingClientRect().top - before);
  }
}
function feedStart(){
  const cfg = { scope: $("#feed-scope").value, shuffle: $("#feed-shuffle").checked };
  store.set("feed", cfg);
  if (FEED && FEED.io) FEED.io.disconnect();
  FEED = { pool: feedPool(cfg.scope), cfg, order: [], i: 0, round: 0, io: null };
  $("#feed-list").replaceChildren();
  show("feed"); window.scrollTo(0, 0);
  if (!FEED.pool.length) return;
  feedMore(15);
  if ("IntersectionObserver" in window) {
    const end = $("#feed-end");
    FEED.io = new IntersectionObserver(es => { if (es[0].isIntersecting) { feedMore(10); FEED.io.unobserve(end); FEED.io.observe(end); } }, { rootMargin: "800px" });
    FEED.io.observe(end);
  }
}

// Busca: kana (hiragana ou katakana), romaji, japonês ou português (sem acento / maiúsculas).
const norm = t => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize("NFC").toLowerCase().trim();   // NFC de volta: sem isso べ, ぎ… (dakuten) ficavam decompostos e a busca em kana não achava nada
const hira = t => t.replace(/[\u30a1-\u30f6]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
let INDEX = null;
function search(q){
  const box = $("#results"), qq = norm(q);
  $("#groups").hidden = !!qq; box.hidden = !qq; box.replaceChildren();
  if (!qq) return;
  INDEX = INDEX || CATEGORIES.flatMap(c => c.words.map(w => ({ w, tag: `${c.group}: ${c.name}`, h: [w[0], hira(w[1]), norm(w[2]), norm(w[3])] })));
  const qh = hira(qq), hits = [];
  for (const e of INDEX) {
    let best = 9;
    e.h.forEach((f, i) => { const t = i === 1 ? qh : qq; const p = f.indexOf(t); if (p >= 0) best = Math.min(best, f === t ? 0 : p === 0 ? 1 : 2); });
    if (best < 9) hits.push([best, e]);
  }
  hits.sort((a, b) => a[0] - b[0]);
  const info = document.createElement("p"); info.className = "sw-info";
  info.textContent = hits.length ? `${hits.length} resultado(s)` + (hits.length > 60 ? " (mostrando 60)" : "") : "Nada encontrado.";
  box.append(info, ...hits.slice(0, 60).map(([, e]) => wordRow(e.w, e.tag)));
}

// Grupos abertos no menu (padrão: só o JLPT N5).
const openGroups = () => store.get("open") || ["JLPT N5"];

function renderMenu(){
  updateErr(); updateDeck(); updateSrs();
  const box = $("#groups"); box.replaceChildren();
  const groups = [...new Set(CATEGORIES.map(c => c.group))];
  const jl = g => g.startsWith("JLPT");
  groups.sort((a, b) => jl(a) && jl(b) ? b.localeCompare(a) : jl(b) - jl(a));
  for (const g of groups) {
    const det = document.createElement("details"); det.className = "grp";
    det.open = openGroups().includes(g);
    const sum = document.createElement("summary");
    const all = CATEGORIES.filter(c => c.group === g);
    sum.textContent = `${g} · ${all.length} tópicos, ${all.reduce((n, c) => n + c.words.length, 0)} palavras`;
    det.append(sum);
    det.ontoggle = () => { const o = openGroups().filter(x => x !== g); if (det.open) o.push(g); store.set("open", o); };
    const grid = document.createElement("div"); grid.className = "cats";
    for (const c of (jl(g) ? [levelCat(g)] : []).concat(CATEGORIES.filter(c => c.group === g))) {
      const b = document.createElement("button"); b.className = "cat" + (c.all ? " all" : ""); b.type = "button";
      const best = store.get(bestKey(c.id, ROUNDS));
      b.innerHTML = "<b></b><small></small>";
      b.firstChild.textContent = c.name;
      b.lastChild.textContent = `${c.words.length} palavras` + (best != null ? `, melhor: ${best}/${Math.min(ROUNDS, c.words.length)}` : "");
      b.onclick = () => S.mode === "study" ? study(c) : start(c);
      grid.append(b);
    }
    det.append(grid); box.append(det);
  }
  show("menu");
}

// Palavras erradas: "japonês|kana" -> pontos de erro (erro +2, acerto -1, máx. 5). Quanto mais pontos, mais chance de cair no quiz.
const missMap = () => store.get("miss") || {};
const wkey = w => w[0] + "|" + w[1];
function pick(words, n){
  const m = missMap();
  return words.map(w => [Math.pow(Math.random(), 1 / (1 + 3 * (m[wkey(w)] || 0))), w]).sort((a, b) => b[0] - a[0]).slice(0, n).map(x => x[1]);
}
// Regra comum das atividades: grava em "stats" (categoria e nível reais da palavra, mesmo no modo "erros" ou por nível).
let WINFO = null;
function recordStat(w, ok){
  if (!WINFO) { WINFO = new Map(); for (const c of CATEGORIES) for (const x of c.words) { const k = wkey(x); if (!WINFO.has(k)) WINFO.set(k, c); } }
  const k = wkey(w), c = WINFO.get(k); if (!c) return;
  const d = new Date(), pad = n => String(n).padStart(2, "0"), st = store.get("stats") || [];
  st.push({ data: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, atividade: "quiz", nivel: c.group, categoria: c.id, chave: k, acertou: ok });
  store.set("stats", st.slice(-5000));
}
function missWords(){
  const m = missMap(), by = new Map();
  for (const c of CATEGORIES) for (const w of c.words) by.set(wkey(w), w);
  return Object.keys(m).filter(k => by.has(k)).map(k => by.get(k));
}
function updateErr(){
  const n = missWords().length;
  $("#err-open").hidden = $("#err-clear").hidden = !n;
  $("#err-open").textContent = `Revisar meus erros (${n})`;
}
// Meu deck: palavras que a pessoa guarda ("japonês|kana" em "kd-deck"). Adicionar e remover usam o mesmo botão ☆/★.
const DECK_KEY = "kd-deck";
function deckGet(){ const d = store.get(DECK_KEY); return Array.isArray(d) ? d.filter(k => typeof k === "string") : []; }
function deckToggle(w){
  const k = wkey(w), d = deckGet(), i = d.indexOf(k);
  if (i >= 0) d.splice(i, 1); else d.push(k);
  store.set(DECK_KEY, d); updateDeck();
  return i < 0;
}
function deckWords(){   // ignora palavras que não existem mais no dicionário
  const by = new Map();
  for (const c of CATEGORIES) for (const w of c.words) by.set(wkey(w), w);
  return deckGet().filter(k => by.has(k)).map(k => by.get(k));
}
function deckCat(){ return { id: "deck", group: "Meu deck", name: "palavras guardadas", words: deckWords(), pool: CATEGORIES.flatMap(c => c.words), errors: true, deck: true }; }   // errors: sem recorde, como "Meus erros"
function updateDeck(){
  const n = deckWords().length;
  $("#deck-open").hidden = $("#deck-clear").hidden = !n;
  $("#deck-open").textContent = `Meu deck (${n})`;
}
function starBtn(w, cb){
  const b = document.createElement("button"); b.type = "button"; b.className = "ghost sw-star";
  b.setAttribute("aria-label", "Meu deck: " + w[0]);
  const set = on => { b.textContent = on ? "★" : "☆"; b.setAttribute("aria-pressed", on); b.title = on ? "Remover do meu deck" : "Guardar no meu deck"; b.classList.toggle("on", on); };
  set(deckGet().includes(wkey(w)));
  b.onclick = () => { const on = deckToggle(w); set(on); if (cb) cb(on); };
  return b;
}
// Repetição espaçada: "kd-srs" -> { "japonês|kana": { b: caixa 1–5, d: vencimento "AAAA-MM-DD", h: últimos 8 { d: data, a: acertou, r: "j" (japonês→português) ou "p" (português→japonês) } } }.
// A palavra entra ao ser ERRADA no quiz; acerto só sobe a caixa se a palavra estava vencida; erro cai duas caixas (mín. 1) e vence amanhã.
// Reconhecimento (japonês→português) sobe só até a caixa 3; as caixas 4 e 5 exigem acerto em português→japonês. Datas locais, como o "stats".
const SRS_KEY = "kd-srs", SRS_DAYS = [0, 1, 3, 7, 14, 30], SRS_HIST = 8, SRS_SEED_DIA = 15;
function dayStr(off){
  const d = new Date(); d.setDate(d.getDate() + (off || 0));
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function srsLoad(){   // na primeira vez (sem "kd-srs"), semeia a partir de "miss": caixa 1, no máximo 15 por dia, as mais erradas primeiro
  let sr = store.get(SRS_KEY);
  if (sr && typeof sr === "object" && !Array.isArray(sr)) return sr;
  sr = {};
  const m = missMap(), have = new Set();
  for (const c of CATEGORIES) for (const w of c.words) have.add(wkey(w));
  Object.keys(m).filter(k => have.has(k)).sort((a, b) => m[b] - m[a]).forEach((k, i) => { sr[k] = { b: 1, d: dayStr(Math.floor(i / SRS_SEED_DIA)), h: [] }; });
  store.set(SRS_KEY, sr);
  return sr;
}
function srsRecord(w, ok, sr){
  const k = wkey(w), today = dayStr(), dir = S.dir === "pt2jp" ? "p" : "j";
  let e = sr[k];
  if (!e) { if (ok) return; e = sr[k] = { b: 1, d: today, h: [] }; }
  e.h = [...(e.h || []), { d: today, a: ok, r: dir }].slice(-SRS_HIST);
  if (!ok) { e.b = Math.max(1, e.b - 2); e.d = dayStr(1); }
  else if (e.d <= today) { if (e.b < (dir === "p" ? 5 : 3)) e.b++; e.d = dayStr(SRS_DAYS[e.b]); }
  store.set(SRS_KEY, sr);
}
function srsDue(){   // palavras vencidas (hoje ou antes), as mais atrasadas primeiro; ignora palavras que não existem mais
  const sr = srsLoad(), today = dayStr(), by = new Map();
  for (const c of CATEGORIES) for (const w of c.words) by.set(wkey(w), w);
  return Object.keys(sr).filter(k => by.has(k) && sr[k].d <= today).sort((a, b) => sr[a].d < sr[b].d ? -1 : sr[a].d > sr[b].d ? 1 : sr[a].b - sr[b].b).map(k => by.get(k));
}
function srsCat(){ return { id: "srs", group: "Revisão", name: "Revisar hoje", words: srsDue(), pool: CATEGORIES.flatMap(c => c.words), errors: true, srs: true }; }   // errors: sem recorde
function updateSrs(){
  const n = srsDue().length;
  $("#srs-open").hidden = !n;
  $("#srs-open").textContent = `Revisar hoje (${n})`;
}
function startErrors(){
  const words = missWords();
  if (words.length) start({ id: "erros", group: "Revisão", name: "Meus erros", words, pool: CATEGORIES.flatMap(c => c.words), errors: true });
}

function start(cat){
  if (cat.deck) { cat = deckCat(); if (!cat.words.length) return renderMenu(); }   // o deck pode ter mudado desde a última vez
  if (cat.srs) { cat = srsCat(); if (!cat.words.length) return renderMenu(); }   // as vencidas mudam com os dias
  S.cat = cat; S.n = ROUNDS;
  const words = shuffle(cat.srs ? cat.words.slice(0, ROUNDS) : pick(cat.words, ROUNDS));
  S.q = words.map(w => {
    const others = shuffle((cat.pool || cat.words).filter(x => x !== w && x[3] !== w[3])).slice(0, 3);
    return { w, opts: shuffle([w, ...others]) };
  });
  S.i = 0; S.score = 0; S.wrong = [];
  show("game"); render();
}

function render(){
  const { w, opts } = S.q[S.i];
  const jp = S.dir === "jp2pt";
  S.locked = false; S.correct = opts.indexOf(w);
  $("#stamp").textContent = `${S.i+1}/${S.q.length}`;
  $("#score").textContent = `Acertos: ${S.score}`;
  const big = $("#big"); big.textContent = jp ? w[0] : w[3]; big.lang = jp ? "ja" : "pt-BR";
  const hint = $("#hint");
  hint.textContent = jp && S.reading ? `${pitch(w)}  ${w[2]}` : "";
  const box = $("#opts"); box.replaceChildren();
  opts.forEach((o, n) => {
    const b = document.createElement("button"); b.type = "button"; b.className = "opt";
    const main = document.createElement("span");
    main.textContent = jp ? o[3] : o[0];
    b.append(main);
    if (!jp) {
      main.lang = "ja";
      if (o[1] !== o[0]) { const s = document.createElement("small"); s.textContent = pitch(o); b.append(s); }
    }
    b.onclick = () => answer(n);
    box.append(b);
  });
  $("#feedback").textContent = "";
  KDFW.close(); $("#ex").hidden = true; S.sent = null;
  $("#next").hidden = true;
  $("#speak").hidden = !TTS || !jp;
  if (S.auto && jp) speak(w[1]);
}

function answer(n){
  if (S.locked) return;
  S.locked = true;
  const { w } = S.q[S.i];
  const btns = [...$("#opts").children];
  btns[S.correct].classList.add("ok");
  const sr = srsLoad(), m = missMap(), k = wkey(w);   // srsLoad antes de mexer em "miss": a primeira semeadura usa a lista de erros de antes desta resposta
  if (n === S.correct) { S.score++; if (m[k] && --m[k] <= 0) delete m[k]; }
  else { btns[n].classList.add("bad"); S.wrong.push(w); m[k] = Math.min(5, (m[k] || 0) + 2); }
  store.set("miss", m);
  recordStat(w, n === S.correct);
  srsRecord(w, n === S.correct, sr);
  $("#score").textContent = `Acertos: ${S.score}`;
  $("#feedback").textContent = `${w[0]} (${pitch(w)}, ${w[2]}) = ${w[3]}`;
  $("#feedback").append(starBtn(w));
  showExample(w);
  $("#next").textContent = S.i === S.q.length-1 ? "Ver resultado" : "Próxima";
  $("#next").hidden = false;
  $("#speak").hidden = !TTS;
  if (S.auto && S.dir === "pt2jp") speak(w[1]);
}

function showExample(w){
  const list = SENT[w[0] + "|" + w[1]];
  if (!list) return;
  const s = S.sent = list[Math.floor(Math.random() * list.length)];
  const sp = KDHL.find(s[0], w[0] + "|" + w[1]);
  KDHL.fill($("#ex-jp"), s[0], sp);
  KDFW.wrap($("#ex-jp"), s[0], sp, w);
  $("#ex-kana").textContent = s[1];
  $("#ex-kana").hidden = !S.reading;
  $("#ex-pt").textContent = s[2];
  $("#ex-speak").hidden = !TTS;
  $("#ex").hidden = false;
}

function next(){
  if (!S.locked) return;
  if (++S.i < S.q.length) render(); else finish();
}

function finish(){
  const total = S.q.length;
  $("#final").textContent = `${S.score} de ${total} acertos em ${S.cat.group}: ${S.cat.name}`;
  const key = bestKey(S.cat.id, S.n), prev = store.get(key);
  if (S.cat.srs) { const rest = srsDue().length; $("#best").textContent = rest ? `Ainda ${rest === 1 ? "resta 1 palavra" : "restam " + rest + " palavras"} para revisar hoje.` : "Nada mais para revisar hoje."; }
  else if (S.cat.errors) $("#best").textContent = "";
  else if (prev == null || S.score > prev) { store.set(key, S.score); $("#best").textContent = prev == null ? "Primeira pontuação salva." : "Novo recorde!"; }
  else $("#best").textContent = `Seu recorde: ${prev}/${total}`;
  const rv = $("#review"); rv.replaceChildren();
  if (S.wrong.length) {
    const h = document.createElement("h2"); h.textContent = "Para revisar"; rv.append(h);
    for (const w of S.wrong) {
      const r = document.createElement("div"); r.className = "rev";
      const l = document.createElement("div");
      const a = document.createElement("span"); a.lang = "ja"; a.textContent = `${w[0]}  ${pitch(w)}  ${w[2]}`;
      const b = document.createElement("span"); b.textContent = w[3];
      l.append(a, starBtn(w)); r.append(l, b); rv.append(r);
    }
  }
  show("result");
}

// Áudio: Web Speech API (speechSynthesis), voz japonesa do próprio navegador/sistema
const TTS = AyumiTTS.supported();
function speak(text){
  AyumiTTS.speak(text, { rate: 0.85, onnovoice: () => AyumiTTS.voiceHelp($("#feedback")) });
}
if (!TTS) $("#autowrap").hidden = true;
$("#speak").onclick = () => speak(S.q[S.i].w[1]);
$("#ex-speak").onclick = () => { if (S.sent) speak(S.sent[0]); };
$("#auto").checked = S.auto;
$("#auto").onchange = e => { S.auto = e.target.checked; store.set("auto", S.auto); };
for (const b of $("#rounds").children) b.onclick = () => { setRounds(+b.dataset.n); renderMenu(); };
$("#q").oninput = e => search(e.target.value);
$("#feed-open").onclick = feedStart;
$("#srs-open").onclick = () => S.mode === "study" ? study(srsCat()) : start(srsCat());
$("#err-open").onclick = startErrors;
$("#deck-open").onclick = () => S.mode === "study" ? study(deckCat()) : start(deckCat());
$("#deck-clear").onclick = () => { if (confirm("Esvaziar o deck? As palavras continuam no vocabulário, só saem do seu deck.")) { store.set(DECK_KEY, []); updateDeck(); } };
$("#err-clear").onclick = () => { if (confirm("Limpar a lista de palavras erradas?")) { store.set("miss", {}); updateErr(); } };
$("#feed-scope").onchange = $("#feed-shuffle").onchange = feedStart;
$("#feed-back").onclick = () => { if (FEED && FEED.io) FEED.io.disconnect(); renderMenu(); };
$("#study-feed").onclick = () => { $("#feed-scope").value = S.cat.deck ? "deck" : S.cat.all ? "g:" + S.cat.group : "c:" + S.cat.id; feedStart(); };
$("#m-play").onclick = () => setMode("play");
$("#m-study").onclick = () => setMode("study");
$("#study-back").onclick = renderMenu;
$("#study-menu").onclick = renderMenu;
$("#study-play").onclick = () => start(S.cat);
$("#d-jp2pt").onclick = () => setDir("jp2pt");
$("#d-pt2jp").onclick = () => setDir("pt2jp");
$("#reading").checked = S.reading;
$("#reading").onchange = e => { S.reading = e.target.checked; store.set("reading", S.reading); if (S.sent) $("#ex-kana").hidden = !S.reading; };
$("#next").onclick = next;
$("#quit").onclick = renderMenu;
$("#home").onclick = renderMenu;
$("#again").onclick = () => start(S.cat);

document.addEventListener("keydown", e => {
  if ($("#game").hidden) return;
  if (e.target.closest && e.target.closest(".sw-star")) return;   // Enter/teclas no botão ★ não respondem nem avançam o quiz
  if (e.key >= "1" && e.key <= "4") { const b = $("#opts").children[+e.key-1]; if (b) answer(+e.key-1); }
  else if (e.key === "Enter" && S.locked) { e.preventDefault(); next(); }
});

setDir(S.dir); setMode(S.mode); setRounds(ROUNDS); feedInit();
renderMenu();
