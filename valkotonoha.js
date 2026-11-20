// Validador do jogo 言の葉 (Kotonoha). Uso: node valkotonoha.js [N por nível e mínimo]  (padrão 150)
const fs = require("fs");
const K = require("./data/kotonoha-engine.js");
const cats = new Function(fs.readFileSync("data/words.js", "utf8") + ";return CATEGORIES")();
const dict = K.buildDict(cats);
const N = parseInt(process.argv[2] || "150", 10);
let bad = 0;
const err = (...a) => { bad++; if (bad <= 30) console.log("ERRO", ...a); };

// 1) dicionário
const lens = {};
for (const e of dict.seen.values()) {
  lens[e.units.length] = (lens[e.units.length] || 0) + 1;
  if (e.units.length < 2 || e.units.length > K.MAXLEN) err("tamanho fora do limite", e.key);
  if (K.lookup(dict, e.units) !== e) err("trie não acha", e.key);
  if (!e.entries.length) err("sem significado", e.key);
  e.entries.forEach(x => { if (!x.jp || !x.kana || !x.pt) err("entrada incompleta", e.key); });
}
console.log("dicionário:", dict.size, "leituras (2 a 6 peças):", JSON.stringify(lens));
const units = new Set();
for (const e of dict.seen.values()) e.units.forEach(u => units.add(u));
const odd = [...units].filter(u => !/^([ぁ-んー][ゃゅょぁぃぅぇぉゎ]?)$/.test(u));
if (odd.length) err("peças estranhas", odd.join(" "));
console.log("peças diferentes:", units.size);

// 2) geração + solução garantida
const t0 = Date.now();
let boards = 0, solved = 0;
const rnd = K.mulberry32(99);
for (const lv of K.LEVEL_ORDER) for (const min of [2, 3, 4]) {
  let ms = 0, worst = 0;
  for (let s = 1; s <= N; s++) {
    const t = Date.now();
    let g;
    try { g = K.generate(dict, lv, min, s); } catch (e) { err(lv, min, s, e.message); continue; }
    const dt = Date.now() - t; ms += dt; worst = Math.max(worst, dt);
    boards++;
    const why = K.verify(g, dict);
    if (why) err(lv, "min", min, "semente", s, why); else solved++;
    if (!K.findWord(g.grid, dict, min, g.mode, null)) err(lv, min, s, "sem palavra no começo");
    // determinismo
    if (s <= 5) { const g2 = K.generate(dict, lv, min, s); if (JSON.stringify(g2.grid) !== JSON.stringify(g.grid)) err(lv, min, s, "não determinístico"); }
    // palavras do plano com mínimo respeitado e sem repetir leitura
    const keys = new Set(g.plan.map(p => p.key));
    if (keys.size !== g.plan.length) err(lv, min, s, "leitura repetida no plano");
    if (g.plan.some(p => p.path.length < min)) err(lv, min, s, "palavra menor que o mínimo");
    if (K.count(g.grid) !== g.n * g.n) err(lv, min, s, "tabuleiro não está cheio");
  }
  console.log(lv, "mín", min, ":", N, "tabuleiros, média", (ms / N).toFixed(1), "ms, pior", worst, "ms");
}
console.log("tabuleiros:", boards, "limpáveis pelo plano:", solved, "(" + (Date.now() - t0) + " ms)");


// helpers de formato
const gravOk = g => { for (let c = 0; c < g.length; c++) { let seen = false; for (let r = 0; r < g.length; r++) { if (g[r][c]) seen = true; else if (seen) return false; } } return true; };
const lettersOf = g => { const a = []; g.forEach(r => r.forEach(x => x && a.push(x.u))); return a.sort().join(""); };
const idsOf = g => { const a = []; g.forEach(r => r.forEach(x => x && a.push(x.id))); return a.sort((x, y) => x - y).join(","); };
function compactOk(g, M, what) {   // colunas contíguas, encostadas embaixo, alturas com diferença <= 1, centralizado
  const n = g.length, hs = [];
  for (let c = 0; c < n; c++) { let h = 0; for (let r = 0; r < n; r++) if (g[r][c]) h++; hs.push(h); }
  const cols = hs.map((h, c) => h ? c : -1).filter(c => c >= 0);
  if (!gravOk(g)) return what + ": gravidade";
  if (cols.length && cols[cols.length - 1] - cols[0] + 1 !== cols.length) return what + ": colunas não contíguas";
  const used = hs.filter(h => h);
  if (used.length && Math.max(...used) - Math.min(...used) > 1) return what + ": alturas desiguais";
  if (cols.length && cols[0] !== Math.floor((n - cols.length) / 2)) return what + ": não centralizado";
  return "";
}

// 2b) só formatos: formas irregulares aleatórias -> reagrupar -> nenhuma casa solta, nos dois modos
{
  let shapes = 0, iso0 = 0;
  for (const n of [5, 6]) for (const mode of [4, 8]) for (let i = 0; i < 400; i++) {
    const g = Array.from({ length: n }, () => new Array(n).fill(null));
    let id = 0;
    for (let c = 0; c < n; c++) { const h = Math.floor(rnd() * (n + 1) * (rnd() < .5 ? 1 : .5)); for (let k = 0; k < Math.min(h, n); k++) g[n - 1 - k][c] = { id: id++, u: "あ" }; }
    const M = K.count(g); if (M < 2) continue;
    shapes++; if (K.isolated(g, mode).length) iso0++;
    const ng = K.regroup(g, dict, 2, mode);
    if (K.count(ng) !== M) err("regroup mudou a contagem");
    if (idsOf(ng) !== idsOf(g)) err("regroup mudou os ids");
    if (K.isolated(ng, mode).length) err("regroup deixou casa solta", n, mode, M);
    const why = compactOk(ng, M, "regroup"); if (why) err(why, n, M);
    const ng2 = K.regroup(ng, dict, 2, mode); if (K.isolated(ng2, mode).length) err("regroup 2x deixou casa solta");
  }
  console.log("formatos aleatórios:", shapes, "(com casa solta antes:", iso0 + ") -> nenhuma solta depois, nos modos 4 e 8");
}

// 3) partidas simuladas: jogar palavras ao acaso, reembaralhar quando travar; invariantes do motor
let games = 0, cleared = 0, stuck = 0, shuffles = 0, shufNull = 0, exactN = 0, fallbackN = 0, regs = 0, isoSeen = 0;
for (const lv of K.LEVEL_ORDER) for (const min of [2, 3, 4]) for (let s = 1; s <= Math.min(N, 40); s++) {
  const g0 = K.generate(dict, lv, min, 1000 + s);
  let grid = g0.grid, left = 3, steps = 0, ok = true;
  games++;
  while (K.count(grid) > 0 && steps < 80) {
    steps++;
    const all = K.findWord(grid, dict, min, g0.mode, rnd, true);
    const one = K.findWord(grid, dict, min, g0.mode, rnd);
    if ((all.length > 0) !== (one !== null)) { err("findWord inconsistente", lv, min, s); ok = false; break; }
    if (!all.length) {
      if (left <= 0) { stuck++; break; }
      const before = K.count(grid);
      const ng = K.reshuffle(grid, dict, min, g0.mode, rnd);
      if (!ng) { shufNull++; stuck++; break; }
      left--; shuffles++;
      if (K.count(ng) !== before) { err("reembaralhar mudou a contagem"); ok = false; break; }
      if (idsOf(ng) !== idsOf(grid)) { err("reembaralhar mudou os ids"); ok = false; }
      if (lettersOf(ng) !== lettersOf(grid)) { err("reembaralhar mudou as letras"); ok = false; }
      if (K.isolated(ng, g0.mode).length) { err("reembaralhar deixou casa solta", lv, min, s, before); ok = false; }
      const why = compactOk(ng, before, "reembaralhar"); if (why) { err(why, lv, min, s); ok = false; }
      if (!K.findWord(ng, dict, min, g0.mode, null)) { err("reembaralhar sem palavra", lv, min, s); ok = false; }
      if (ng.exact) {
        exactN++;
        const why2 = K.verify({ grid: ng, plan: ng.plan, min, mode: g0.mode }, dict);
        if (why2) { err("plano do reembaralhar inválido:", why2); ok = false; }
      } else fallbackN++;
      grid = ng; continue;
    }
    if (K.isolated(grid, g0.mode).length) {
      isoSeen++;
      if (rnd() < .5) {
        const rg = K.regroup(grid, dict, min, g0.mode);
        regs++;
        if (K.count(rg) !== K.count(grid) || idsOf(rg) !== idsOf(grid)) { err("regroup mudou casas"); ok = false; break; }
        const ma = [], mb = [];
        grid.forEach(r => r.forEach(x => x && ma.push(x.id + x.u))); rg.forEach(r => r.forEach(x => x && mb.push(x.id + x.u)));
        if (ma.sort().join() !== mb.sort().join()) { err("regroup trocou letras"); ok = false; break; }
        if (K.count(rg) >= 2 && K.isolated(rg, g0.mode).length) { err("regroup deixou casa solta no jogo"); ok = false; break; }
        grid = rg; continue;
      }
    }
    const pick = all[Math.floor(rnd() * all.length)];
    // o caminho achado tem de ser válido
    for (let k = 1; k < pick.path.length; k++) if (!K.adjacent(pick.path[k - 1], pick.path[k], g0.mode)) { err("caminho com casas não vizinhas"); ok = false; }
    const before = K.count(grid);
    grid = K.drop(grid, pick.path);
    if (K.count(grid) !== before - pick.path.length) { err("drop errado"); ok = false; }
    for (let c = 0; c < g0.n; c++) { let seenNull = false; for (let r = 0; r < g0.n; r++) { if (!grid[r][c]) { if (r > 0 && grid[r - 1][c]) { err("gravidade falhou"); ok = false; } seenNull = true; } else if (seenNull) { /* célula abaixo de vazio: tudo bem só se vazio acima, conferido acima */ } } }
    if (!ok) break;
  }
  if (ok && K.count(grid) === 0) cleared++;
}
console.log("reembaralhar: exato (limpável por inteiro)", exactN, "| só 1 palavra", fallbackN, "| partidas com casa solta:", isoSeen, "| reagrupar testado:", regs);
console.log("partidas aleatórias:", games, "| limpas:", cleared, "| travadas:", stuck, "| reembaralhadas:", shuffles, "| sem reembaralhar possível:", shufNull);

// 4) modo 落ち葉 (chuva): tabuleiro parcial + chuvas + partidas longas até encher
{
  let parts = 0, rains = 0, forced = 0, noGuar = 0, ended = 0, maxSteps = 0, tooLong = 0, wordsAfter = 0, longest = 0;
  const rr = K.mulberry32(2026);
  for (const lv of K.LEVEL_ORDER) for (const min of [2, 3, 4]) {
    const LV = K.LEVELS[lv];
    for (let s = 1; s <= Math.min(N, 60); s++) {
      const g0 = K.generatePartial(dict, lv, min, 5000 + s);
      parts++;
      const tot = g0.n * g0.n, cnt0 = K.count(g0.grid);
      if (cnt0 < tot * .4 || cnt0 > tot * .75) err("parcial fora de 40%-75%", lv, min, s, cnt0 + "/" + tot);
      const why = K.verify({ grid: g0.grid, plan: g0.plan, min, mode: g0.mode }, dict);
      if (why) err("parcial não limpável", lv, min, s, why);
      if (!gravOk(g0.grid)) err("parcial sem gravidade");
      if (!K.findWord(g0.grid, dict, min, g0.mode, null)) err("parcial sem palavra", lv, min, s);
      // partida longa: 1 jogada do bot por chuva, até encher
      let grid = g0.grid, nid = g0.nextId, steps = 0, over = false;
      const ids = new Set(); grid.forEach(r => r.forEach(x => x && ids.add(x.id)));
      while (steps < 400) {
        steps++;
        const free = tot - K.count(grid);
        const r = K.rain(grid, dict, min, g0.mode, rr, nid, LV.rain, LV.loose);
        rains++;
        if (!r.fits) {
          if (free >= LV.rain) { err("chuva recusada com espaço", lv, min, s, free); }
          if (JSON.stringify(r.grid) !== JSON.stringify(grid)) err("chuva que não coube mexeu no quadro");
          over = true; ended++; break;
        }
        if (free < LV.rain) { err("chuva coube sem espaço", lv, min, s, free); break; }
        if (r.added.length !== LV.rain) err("chuva com quantidade errada", r.added.length, LV.rain);
        if (K.count(r.grid) !== K.count(grid) + LV.rain) err("chuva: contagem");
        for (const a of r.added) { if (ids.has(a.id)) err("id repetido na chuva", a.id); ids.add(a.id); if (a.id < nid) err("id menor que nextId"); if (!r.grid[a.r][a.c] || r.grid[a.r][a.c].id !== a.id || r.grid[a.r][a.c].u !== a.u) err("chuva: posição da casa nova"); }
        if (r.nextId !== nid + LV.rain) err("nextId errado");
        if (!gravOk(r.grid)) err("chuva sem gravidade", lv);
        for (let c = 0; c < g0.n; c++) { let h = 0; for (let y = 0; y < g0.n; y++) if (r.grid[y][c]) h++; if (h > g0.n) err("coluna estourou"); }
        if (!r.guaranteed) noGuar++;
        if (r.guaranteed && !K.findWord(r.grid, dict, min, g0.mode, null)) err("chuva garantida sem palavra", lv, min, s);
        if (K.findWord(r.grid, dict, min, g0.mode, null)) wordsAfter++;
        else if (tot - K.count(r.grid) > 0) err("chuva deixou o quadro sem palavra (havia casas livres)", lv, min, s);
        else forced++;   // quadro 100% cheio: as peças cabem só em lugares obrigatórios; o jogo segue (reembaralhar ou próxima chuva)
        grid = r.grid; nid = r.nextId;
        // o bot joga uma palavra
        const w = K.findWord(grid, dict, min, g0.mode, rr);
        if (w) grid = K.drop(grid, w.path);
      }
      maxSteps = Math.max(maxSteps, steps);
      if (!over) tooLong++;
    }
  }
  console.log("modo chuva:", parts, "tabuleiros parciais | chuvas:", rains, "| sem arranjo conferido:", noGuar, "| quadro cheio sem palavra (aceito):", forced, "| partidas que terminaram por encher:", ended, "| mais longa:", maxSteps, "chuvas | não terminaram:", tooLong);
  if (tooLong) console.log("(aviso) o bot, que joga 1 palavra por chuva, nem sempre enche o quadro; não é erro");
}

// 4b) estresse da chuva: tabuleiros bem cheios (55% a 95%) sorteados ao acaso, 1500 por nível e mínimo
{
  let tot = 0, guar = 0, play = 0, forced = 0;
  const sr = K.mulberry32(99), letters = [...dict.seen.values()];
  for (const lv of K.LEVEL_ORDER) for (const min of [2, 3, 4]) {
    const LV = K.LEVELS[lv], n = LV.n;
    for (let i = 0; i < 1500; i++) {
      const g = Array.from({ length: n }, () => new Array(n).fill(null)), hs = new Array(n).fill(0);
      let id = 0; const cap = Math.min(Math.round(n * n * (0.55 + 0.4 * sr())), n * n - LV.rain);
      for (let k = 0; k < cap; k++) { let c; do { c = Math.floor(sr() * n); } while (hs[c] >= n); const e = letters[Math.floor(sr() * letters.length)]; g[n - 1 - hs[c]][c] = { id: id++, u: e.units[Math.floor(sr() * e.units.length)] }; hs[c]++; }
      const r = K.rain(g, dict, min, LV.mode, sr, id, LV.rain, LV.loose);
      if (!r.fits) { err("estresse: chuva recusada com espaço"); continue; }
      tot++; if (r.guaranteed) guar++;
      if (K.findWord(r.grid, dict, min, LV.mode, null)) play++;
      else if (n * n - K.count(r.grid) > 0) err("estresse: sem palavra com casas livres", lv, min);
      else forced++;
    }
  }
  console.log("estresse da chuva:", tot, "chuvas em quadros cheios | com arranjo conferido:", guar, "| com palavra possível depois:", play, "| quadro 100% cheio sem palavra:", forced);
}

console.log("erros", bad);
process.exit(bad ? 1 : 0);
