// Motor do jogo 言の葉 (Kotonoha): dicionário em trie, busca de palavras no tabuleiro, gravidade,
// gerador de tabuleiros com solução garantida, reembaralhar, reagrupar e chuva de kana (modo 落ち葉). Sem DOM: roda no navegador (global KOTO) e no node.
(function (root) {
"use strict";
const MAXLEN = 6;
const LEVELS = {
  facil:   { n: 5, mode: 8, label: "Fácil", rain: 4, loose: 1 },
  medio:   { n: 6, mode: 8, label: "Médio", rain: 6, loose: 2 },
  dificil: { n: 6, mode: 4, label: "Difícil", rain: 6, loose: 2 }
};
const LEVEL_ORDER = ["facil", "medio", "dificil"];
const DIRS8 = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
const DIRS4 = [[-1,0],[0,-1],[0,1],[1,0]];
const dirs = mode => (mode === 4 ? DIRS4 : DIRS8);
const SMALL = "ゃゅょぁぃぅぇぉゎ";

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle(a, rnd) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}

// Divide a leitura em "peças": cada peça é uma casa do tabuleiro (きゃ é uma peça só; っ e ー são peças próprias).
function tokenize(kana) {
  const out = [];
  for (const ch of kana) {
    const last = out[out.length - 1];
    if (SMALL.includes(ch) && last && last !== "っ" && last !== "ー") out[out.length - 1] = last + ch;
    else out.push(ch);
  }
  return out;
}

// Monta o dicionário a partir de CATEGORIES (data/words.js): trie por peça, lista por tamanho.
function buildDict(cats) {
  const rootNode = {}, byLen = {}, seen = new Map();
  for (const c of cats) for (const w of c.words) {
    const jp = w[0], kana = w[1], pt = w[3];
    if (!/^[ぁ-んー]+$/.test(kana)) continue;
    const u = tokenize(kana);
    if (u.length < 2 || u.length > MAXLEN) continue;
    const key = u.join("");
    let e = seen.get(key);
    if (!e) {
      e = { key, units: u, entries: [] };
      seen.set(key, e);
      (byLen[u.length] = byLen[u.length] || []).push(e);
      let n = rootNode;
      for (const x of u) n = n[x] || (n[x] = {});
      n.$ = e;
    }
    if (!e.entries.some(x => x.jp === jp)) e.entries.push({ jp, kana, pt });
  }
  return { root: rootNode, byLen, seen, size: seen.size };
}
function lookup(dict, units) {
  let n = dict.root;
  for (const x of units) { n = n[x]; if (!n) return null; }
  return n.$ || null;
}

const clone = g => g.map(r => r.slice());
// Remove as casas do caminho e aplica a gravidade (as casas de cima caem). Não altera o original.
function drop(grid, path) {
  const N = grid.length, g = clone(grid);
  for (const [r, c] of path) g[r][c] = null;
  for (let c = 0; c < N; c++) {
    let w = N - 1;
    for (let r = N - 1; r >= 0; r--) if (g[r][c]) { if (w !== r) { g[w][c] = g[r][c]; g[r][c] = null; } w--; }
  }
  return g;
}
function count(grid) { let n = 0; for (const r of grid) for (const c of r) if (c) n++; return n; }
const adjacent = (a, b, mode) => {
  const dr = Math.abs(a[0] - b[0]), dc = Math.abs(a[1] - b[1]);
  return mode === 4 ? dr + dc === 1 : (dr <= 1 && dc <= 1 && dr + dc > 0);
};

// Procura uma palavra possível no tabuleiro (DFS guiada pela trie). Devolve {path, entry} ou null.
// Com all=true devolve a lista de todas (path, entry).
function findWord(grid, dict, min, mode, rnd, all) {
  const N = grid.length, D = dirs(mode), res = [];
  const used = Array.from({ length: N }, () => new Array(N).fill(false));
  const starts = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (grid[r][c]) starts.push([r, c]);
  if (rnd) shuffle(starts, rnd);
  let hit = null;
  function dfs(r, c, node, path) {
    const nx = node[grid[r][c].u];
    if (!nx) return false;
    used[r][c] = true; path.push([r, c]);
    if (path.length >= min && nx.$) {
      const item = { path: path.slice(), entry: nx.$ };
      if (all) res.push(item); else { hit = item; return true; }
    }
    if (path.length < MAXLEN) {
      for (const [dr, dc] of D) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= N || nc >= N || !grid[nr][nc] || used[nr][nc]) continue;
        if (dfs(nr, nc, nx, path) && !all) return true;
      }
    }
    used[r][c] = false; path.pop();
    return false;
  }
  for (const [r, c] of starts) { if (dfs(r, c, dict.root, []) && !all) return hit; }
  return all ? res : null;
}

// Caminho aleatório sem repetir casa, de tamanho L, a partir de start (backtracking). null se não houver.
function randomPath(g, start, L, mode, rnd) {
  const N = g.length, D = dirs(mode);
  const used = Array.from({ length: N }, () => new Array(N).fill(false));
  const path = [];
  function go(r, c) {
    used[r][c] = true; path.push([r, c]);
    if (path.length === L) return true;
    const ds = shuffle(D.slice(), rnd);
    for (const [dr, dc] of ds) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= N || nc >= N || !g[nr][nc] || used[nr][nc]) continue;
      if (go(nr, nc)) return true;
    }
    used[r][c] = false; path.pop();
    return false;
  }
  return go(start[0], start[1]) ? path : null;
}

// rem casas podem ser divididas em palavras de min a MAXLEN casas?
function partitionable(rem, min) {
  if (rem === 0) return true;
  for (let k = 1; k * min <= rem; k++) if (rem <= MAXLEN * k) return true;
  return false;
}
// Toda região conexa do que sobrou tem de poder virar palavras.
function compsOk(g, mode, min) {
  const N = g.length, D = dirs(mode), seen = Array.from({ length: N }, () => new Array(N).fill(false));
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    if (!g[r][c] || seen[r][c]) continue;
    let size = 0; const st = [[r, c]]; seen[r][c] = true;
    while (st.length) {
      const [y, x] = st.pop(); size++;
      for (const [dr, dc] of D) {
        const ny = y + dr, nx = x + dc;
        if (ny < 0 || nx < 0 || ny >= N || nx >= N || !g[ny][nx] || seen[ny][nx]) continue;
        seen[ny][nx] = true; st.push([ny, nx]);
      }
    }
    if (!partitionable(size, min)) return false;
  }
  return true;
}
const WEIGHT = { 2: 1, 3: 2, 4: 3, 5: 2, 6: 1 };
function pickLen(Ls, rnd) {
  let tot = 0; for (const L of Ls) tot += WEIGHT[L] || 1;
  let x = rnd() * tot;
  for (const L of Ls) { x -= WEIGHT[L] || 1; if (x < 0) return L; }
  return Ls[Ls.length - 1];
}

// Planeja uma sequência de remoções que limpa o tabuleiro todo (só formas, sem letras ainda).
function planShapes(N, mode, min, rnd) {
  for (let attempt = 0; attempt < 400; attempt++) {
    let g = Array.from({ length: N }, (_, r) => Array.from({ length: N }, (_, c) => ({ id: r * N + c })));
    const steps = []; let rem = N * N, ok = true;
    while (rem > 0 && ok) {
      const Ls = [];
      for (let L = min; L <= Math.min(MAXLEN, rem); L++) if (partitionable(rem - L, min)) Ls.push(L);
      if (!Ls.length) { ok = false; break; }
      let found = false;
      for (let t = 0; t < 40 && !found; t++) {
        const L = pickLen(Ls, rnd);
        const cells = [];
        for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (g[r][c]) cells.push([r, c]);
        const start = cells[Math.floor(rnd() * cells.length)];
        const path = randomPath(g, start, L, mode, rnd);
        if (!path) continue;
        const g2 = drop(g, path);
        if (!compsOk(g2, mode, min)) continue;
        steps.push({ L, path, ids: path.map(([r, c]) => g[r][c].id) });
        g = g2; rem -= L; found = true;
      }
      if (!found) ok = false;
    }
    if (ok) return steps;
  }
  return null;
}

// Gera um tabuleiro com solução garantida. Mesma semente + nível + mínimo = mesmo tabuleiro.
function generate(dict, level, min, seed) {
  const lv = LEVELS[level] || LEVELS.facil, N = lv.n, mode = lv.mode;
  const rnd = mulberry32((seed >>> 0) * 7919 + LEVEL_ORDER.indexOf(level) * 104729 + min * 1299709);
  for (let tries = 0; tries < 60; tries++) {
    const steps = planShapes(N, mode, min, rnd);
    if (!steps) continue;
    const used = new Set(), letters = new Array(N * N);
    let ok = true;
    const plan = [];
    for (const s of steps) {
      const pool = (dict.byLen[s.L] || []).filter(e => !used.has(e.key));
      if (!pool.length) { ok = false; break; }
      const e = pool[Math.floor(rnd() * pool.length)];
      used.add(e.key);
      s.ids.forEach((id, i) => { letters[id] = e.units[i]; });
      plan.push({ path: s.path, key: e.key });
    }
    if (!ok) continue;
    const grid = Array.from({ length: N }, (_, r) => Array.from({ length: N }, (_, c) => ({ id: r * N + c, u: letters[r * N + c] })));
    return { level, n: N, mode, min, seed, grid, plan };
  }
  throw new Error("não consegui gerar o tabuleiro " + level + " min " + min + " semente " + seed);
}

// Confere que o plano do tabuleiro limpa tudo, respeitando vizinhança, trie e gravidade. Devolve "" se OK.
function verify(game, dict) {
  let g = clone(game.grid);
  for (let i = 0; i < game.plan.length; i++) {
    const p = game.plan[i].path;
    if (p.length < game.min || p.length > MAXLEN) return "passo " + i + ": tamanho " + p.length;
    const seenKey = new Set(p.map(([r, c]) => r + "," + c));
    if (seenKey.size !== p.length) return "passo " + i + ": casa repetida";
    for (let k = 0; k < p.length; k++) {
      const [r, c] = p[k];
      if (!g[r] || !g[r][c]) return "passo " + i + ": casa vazia " + r + "," + c;
      if (k && !adjacent(p[k - 1], p[k], game.mode)) return "passo " + i + ": casas não vizinhas";
    }
    const e = lookup(dict, p.map(([r, c]) => g[r][c].u));
    if (!e) return "passo " + i + ": não é palavra";
    if (e.key !== game.plan[i].key) return "passo " + i + ": palavra diferente da planejada";
    g = drop(g, p);
  }
  return count(g) === 0 ? "" : "sobraram " + count(g) + " casas";
}

// ---------- formato compacto (reagrupar) ----------
// Casas sem nenhuma vizinha (no modo 4 ou 8). Devolve a lista de [r, c].
function isolated(grid, mode) {
  const N = grid.length, D = dirs(mode), out = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    if (!grid[r][c]) continue;
    let has = false;
    for (const [dr, dc] of D) { const y = r + dr, x = c + dc; if (y >= 0 && x >= 0 && y < N && x < N && grid[y][x]) { has = true; break; } }
    if (!has) out.push([r, c]);
  }
  return out;
}
const emptyGrid = N => Array.from({ length: N }, () => new Array(N).fill(null));
// Casas que sobraram, da esquerda para a direita e, em cada coluna, de baixo para cima.
function tilesOf(grid) {
  const N = grid.length, t = [];
  for (let c = 0; c < N; c++) for (let r = N - 1; r >= 0; r--) if (grid[r][c]) t.push({ r, c, id: grid[r][c].id, u: grid[r][c].u });
  return t;
}
// Larguras possíveis (nº de colunas) para M casas: da mais quadrada para a mais achatada.
function candidateWidths(M, N) {
  const lo = Math.max(2, Math.ceil(M / N)), hi = Math.min(N, M), ws = [];
  for (let w = lo; w <= hi; w++) ws.push(w);
  const s = Math.sqrt(M);
  return ws.sort((a, b) => Math.abs(a - s) - Math.abs(b - s) || a - b);
}
// Posições de M casas em w colunas contíguas, centralizadas, alturas com diferença de no máximo 1
// (as colunas mais altas ficam no meio) e encostadas embaixo. Ordem: esquerda→direita, de baixo para cima.
function shapeCells(M, N, w) {
  const h = Math.floor(M / w), e = M % w, heights = new Array(w).fill(h);
  const order = Array.from({ length: w }, (_, i) => i).sort((a, b) => Math.abs(a - (w - 1) / 2) - Math.abs(b - (w - 1) / 2) || a - b);
  for (let k = 0; k < e; k++) heights[order[k]]++;
  const off = Math.floor((N - w) / 2), cells = [];
  for (let i = 0; i < w; i++) for (let k = 0; k < heights[i]; k++) cells.push([N - 1 - k, off + i]);
  return cells;
}
// Só desliza as casas (mesmas letras e ids) para o formato compacto; entre as larguras possíveis, escolhe a
// que deixa mais palavras formáveis (empate: a mais quadrada). Determinístico.
function regroup(grid, dict, min, mode) {
  const N = grid.length, tiles = tilesOf(grid), M = tiles.length;
  if (M < 2) return clone(grid);
  let best = null, bestScore = -1;
  for (const w of candidateWidths(M, N)) {
    const cells = shapeCells(M, N, w), g = emptyGrid(N);
    tiles.forEach((t, i) => { g[cells[i][0]][cells[i][1]] = { id: t.id, u: t.u }; });
    const sc = findWord(g, dict, min, mode, null, true).length;
    if (sc > bestScore) { best = g; bestScore = sc; }
  }
  return best;
}

// Divide o conjunto de peças em palavras do dicionário (cada uma com min a MAXLEN peças, sem repetir leitura).
function pieceIndex(dict) {
  if (dict._pi) return dict._pi;
  const m = new Map();
  for (const e of dict.seen.values()) for (const u of new Set(e.units)) { if (!m.has(u)) m.set(u, []); m.get(u).push(e); }
  return (dict._pi = m);
}
function partition(cnt0, M, dict, min, rnd, budget) {
  const idx = pieceIndex(dict), cnt = new Map(cnt0), used = new Set(), out = [];
  let nodes = 0;
  const fits = e => {
    const need = new Map();
    for (const u of e.units) { const n = (need.get(u) || 0) + 1; if (n > (cnt.get(u) || 0)) return false; need.set(u, n); }
    return true;
  };
  function go(rem) {
    if (rem === 0) return true;
    if (++nodes > budget || !partitionable(rem, min)) return false;
    let bestList = null;
    for (const [p, n] of cnt) {
      if (n <= 0) continue;
      const list = [];
      for (const e of idx.get(p) || []) {
        const L = e.units.length;
        if (L < min || L > rem || used.has(e.key) || !fits(e)) continue;
        list.push(e);
        if (bestList && list.length >= bestList.length) break;
      }
      if (!list.length) return false;
      if (!bestList || list.length < bestList.length) bestList = list;
    }
    shuffle(bestList, rnd);
    for (let i = 0; i < Math.min(bestList.length, 30); i++) {
      const e = bestList[i];
      e.units.forEach(u => cnt.set(u, cnt.get(u) - 1)); used.add(e.key); out.push(e);
      if (go(rem - e.units.length)) return true;
      e.units.forEach(u => cnt.set(u, cnt.get(u) + 1)); used.delete(e.key); out.pop();
      if (nodes > budget) return false;
    }
    return false;
  }
  return go(M) ? out.slice() : null;
}
// Cada região conexa do que sobrou tem de ter um tamanho que seja soma de alguns dos comprimentos restantes.
function compsFit(g, mode, lens) {
  const sums = new Set([0]);
  for (const L of lens) for (const s of [...sums]) sums.add(s + L);
  const N = g.length, D = dirs(mode), seen = emptyGrid(N);
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    if (!g[r][c] || seen[r][c]) continue;
    let size = 0; const st = [[r, c]]; seen[r][c] = true;
    while (st.length) {
      const [y, x] = st.pop(); size++;
      for (const [dr, dc] of D) {
        const ny = y + dr, nx = x + dc;
        if (ny < 0 || nx < 0 || ny >= N || nx >= N || !g[ny][nx] || seen[ny][nx]) continue;
        seen[ny][nx] = true; st.push([ny, nx]);
      }
    }
    if (!sums.has(size)) return false;
  }
  return true;
}
// Planeja (só formas) uma sequência de remoções com exatamente estes comprimentos que limpa o formato.
function planLengths(shape, mode, min, lens, rnd) {
  for (let attempt = 0; attempt < 120; attempt++) {
    let g = clone(shape), left = lens.slice(), ok = true;
    const steps = [];
    while (left.length && ok) {
      const opts = shuffle([...new Set(left)], rnd);
      let found = false;
      for (const L of opts) {
        const rest = left.slice(); rest.splice(rest.indexOf(L), 1);
        for (let t = 0; t < 25 && !found; t++) {
          const cells = [];
          for (let r = 0; r < g.length; r++) for (let c = 0; c < g.length; c++) if (g[r][c]) cells.push([r, c]);
          const path = randomPath(g, cells[Math.floor(rnd() * cells.length)], L, mode, rnd);
          if (!path) continue;
          const g2 = drop(g, path);
          if (!compsFit(g2, mode, rest)) continue;
          steps.push({ L, path, ids: path.map(([r, c]) => g[r][c].id) });
          g = g2; left = rest; found = true;
        }
        if (found) break;
      }
      if (!found) ok = false;
    }
    if (ok) return steps;
  }
  return null;
}

// Reembaralha: reagrupa as casas que sobraram num formato compacto (sem casas soltas) e troca as letras de lugar.
// Primeiro tenta dividir as letras em palavras do dicionário e montar um tabuleiro que dá para limpar por inteiro
// (devolve o grid com .exact = true e .plan = [{path,key}]); se não houver divisão exata, garante ao menos uma
// palavra possível (.exact = false). Os ids são mantidos (as casas deslizam). null se nenhuma palavra puder ser formada.
function reshuffle(grid, dict, min, mode, rnd) {
  const N = grid.length, tiles = tilesOf(grid), M = tiles.length;
  if (M < Math.max(2, min)) return null;
  const cnt = new Map();
  tiles.forEach(t => cnt.set(t.u, (cnt.get(t.u) || 0) + 1));
  const sig = g => g.map(r => r.map(x => (x ? x.u : ".")).join("|")).join("/");
  const before = sig(grid), widths = candidateWidths(M, N);
  const build = (cells, letterAt) => {
    const g = emptyGrid(N);
    tiles.forEach((t, i) => { const [r, c] = cells[i]; g[r][c] = { id: t.id, u: letterAt(r, c) }; });
    return g;
  };
  const shapeOf = cells => { const sg = emptyGrid(N); cells.forEach(([r, c]) => { sg[r][c] = { id: r * N + c }; }); return sg; };
  // 1) divisão exata + plano de limpeza
  for (let a = 0; a < 8; a++) {
    const words = partition(cnt, M, dict, min, rnd, 500);
    if (!words) continue;
    const lens = words.map(e => e.units.length);
    for (const w of widths.slice(0, 3)) {
      const cells = shapeCells(M, N, w);
      const steps = planLengths(shapeOf(cells), mode, min, lens, rnd);
      if (!steps) continue;
      const pool = shuffle(words.slice(), rnd), letters = new Array(N * N), plan = [];
      for (const s of steps) {
        const e = pool.splice(pool.findIndex(x => x.units.length === s.L), 1)[0];
        s.ids.forEach((id, k) => { letters[id] = e.units[k]; });
        plan.push({ path: s.path, key: e.key });
      }
      const out = build(cells, (r, c) => letters[r * N + c]);
      if (sig(out) === before) continue;
      out.plan = plan; out.exact = true;
      return out;
    }
  }
  // 2) sem divisão exata: pelo menos uma palavra possível, já no formato compacto
  const cand = [];
  for (let L = min; L <= Math.min(MAXLEN, M); L++) for (const e of (dict.byLen[L] || [])) {
    const need = new Map();
    let ok = true;
    for (const u of e.units) { const n = (need.get(u) || 0) + 1; need.set(u, n); if (n > (cnt.get(u) || 0)) { ok = false; break; } }
    if (ok) cand.push(e);
  }
  if (!cand.length) return null;
  shuffle(cand, rnd);
  for (let i = 0; i < Math.min(cand.length, 300); i++) {
    const e = cand[i];
    for (const w of widths.slice(0, 3)) {
      const cells = shapeCells(M, N, w), sg = shapeOf(cells);
      for (let t = 0; t < 6; t++) {
        const p = randomPath(sg, cells[Math.floor(rnd() * M)], e.units.length, mode, rnd);
        if (!p) continue;
        const rest = tiles.map(x => x.u);
        for (const u of e.units) rest.splice(rest.indexOf(u), 1);
        shuffle(rest, rnd);
        const letters = new Array(N * N), taken = new Set();
        p.forEach(([r, c], k) => { letters[r * N + c] = e.units[k]; taken.add(r * N + c); });
        let k = 0;
        for (const [r, c] of cells) if (!taken.has(r * N + c)) letters[r * N + c] = rest[k++];
        const out = build(cells, (r, c) => letters[r * N + c]);
        if (sig(out) === before) continue;
        out.plan = null; out.exact = false;
        return out;
      }
    }
  }
  return null;
}

// ---------- modo 落ち葉 (Ochiba): chuva de kana ----------
// Tabuleiro inicial parcial: um tabuleiro de solução garantida do qual já foram "jogados" os primeiros passos do plano,
// até sobrar cerca de fill (60%) das casas. O que sobra continua limpável pelo plano restante.
function generatePartial(dict, level, min, seed, fill) {
  const g0 = generate(dict, level, min, seed), N = g0.n, target = Math.round(N * N * (fill || 0.6));
  let g = clone(g0.grid), i = 0;
  while (i < g0.plan.length - 1 && count(g) > target) { g = drop(g, g0.plan[i].path); i++; }
  return { level, n: N, mode: g0.mode, min, seed, grid: g, plan: g0.plan.slice(i), nextId: N * N, partial: true };
}
const colHeights = g => g.map((_, c) => { let h = 0; for (let r = 0; r < g.length; r++) if (g[r][c]) h++; return h; });
// A palavra (units) forma um caminho só com casas novas (ids em newIds)?
function pathNew(g, newIds, units, mode) {
  const N = g.length, D = dirs(mode), used = emptyGrid(N);
  function go(r, c, k) {
    if (g[r][c].u !== units[k]) return false;
    if (k === units.length - 1) return true;
    used[r][c] = true;
    for (const [dr, dc] of D) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= N || nc >= N || !g[nr][nc] || used[nr][nc] || !newIds.has(g[nr][nc].id)) continue;
      if (go(nr, nc, k + 1)) { used[r][c] = false; return true; }
    }
    used[r][c] = false;
    return false;
  }
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (g[r][c] && newIds.has(g[r][c].id) && go(r, c, 0)) return true;
  return false;
}
// Quantas palavras e de que tamanho: count peças = 1 ou 2 palavras (min a 5 peças; 6 só se não houver outro jeito) + até looseMax soltas.
function composeRain(count, min, looseMax, rnd) {
  for (const l of shuffle(Array.from({ length: looseMax + 1 }, (_, i) => i), rnd)) {
    const rem = count - l;
    if (rem < min) continue;
    const opts = [];
    if (rem <= 5) opts.push([rem]);
    for (let a = min; a <= 5; a++) { const b = rem - a; if (b >= a && b <= 5) opts.push([a, b]); }
    if (!opts.length && rem <= MAXLEN) opts.push([rem]);
    if (opts.length) return { loose: l, lens: opts[Math.floor(rnd() * opts.length)] };
  }
  return { loose: count, lens: [] };
}
// Uma tentativa de assentar as peças. Cada palavra vai empilhada numa coluna ou dividida em duas colunas vizinhas
// (e o caminho da palavra é conferido de verdade); as soltas caem em colunas sorteadas. null se não deu.
function tryRain(grid, words, nLoose, dict, mode, rnd, nextId) {
  const N = grid.length, st = { g: clone(grid), h: colHeights(grid), added: [], id: nextId };
  const put = (s, c, units) => { for (const u of units) { const r = N - 1 - s.h[c]; s.g[r][c] = { id: s.id, u }; s.added.push({ id: s.id, r, c, u }); s.id++; s.h[c]++; } };
  const copy = s => ({ g: clone(s.g), h: s.h.slice(), added: s.added.slice(), id: s.id });
  const orient = (u, rev) => (rev ? u.slice().reverse() : u);
  for (const e of words) {
    const L = e.units.length; let done = false;
    for (let t = 0; t < 50 && !done; t++) {
      const s = copy(st), before = s.added.length;
      const split = rnd() < 0.4 ? 0 : 1 + Math.floor(rnd() * (L - 1));
      if (!split) {
        const cols = []; for (let c = 0; c < N; c++) if (N - s.h[c] >= L) cols.push(c);
        if (!cols.length) continue;
        put(s, cols[Math.floor(rnd() * cols.length)], orient(e.units, rnd() < 0.5));
      } else {
        const c = Math.floor(rnd() * (N - 1));
        if (N - s.h[c] < split || N - s.h[c + 1] < L - split) continue;
        put(s, c, orient(e.units.slice(0, split), rnd() < 0.5));
        put(s, c + 1, orient(e.units.slice(split), rnd() < 0.5));
      }
      const ids = new Set(s.added.slice(before).map(x => x.id));
      if (!pathNew(s.g, ids, e.units, mode)) continue;
      Object.assign(st, s); done = true;
    }
    if (!done) return null;
  }
  const all = Array.from(dict.seen.values());
  for (let i = 0; i < nLoose; i++) {
    const cols = []; for (let c = 0; c < N; c++) if (st.h[c] < N) cols.push(c);
    if (!cols.length) return null;
    const e = all[Math.floor(rnd() * all.length)];
    put(st, cols[Math.floor(rnd() * cols.length)], [e.units[Math.floor(rnd() * e.units.length)]]);
  }
  return st;
}
// Faz cair uma chuva de count peças. Devolve { grid, added:[{id,r,c,u}], fits, nextId, words:[leituras], guaranteed }.
// fits=false (grid igual) quando não há casas livres para todas as peças: o quadro encheu.
function rain(grid, dict, min, mode, rnd, nextId, pieces, looseMax) {
  const N = grid.length;
  if (pieces > N * N - count(grid)) return { grid, added: [], fits: false, nextId, words: [], guaranteed: false };
  const lm = looseMax == null ? (pieces <= 4 ? 1 : 2) : looseMax;
  for (let a = 0; a < 60; a++) {
    const plan = composeRain(pieces, min, lm, rnd), words = [], keys = new Set();
    for (const L of plan.lens) {
      const pool = (dict.byLen[L] || []).filter(e => !keys.has(e.key));
      if (!pool.length) break;
      const e = pool[Math.floor(rnd() * pool.length)]; keys.add(e.key); words.push(e);
    }
    if (words.length !== plan.lens.length) continue;
    const st = tryRain(grid, words, plan.loose, dict, mode, rnd, nextId);
    if (st) return { grid: st.g, added: st.added, fits: true, nextId: st.id, words: words.map(e => e.key), guaranteed: true };
  }
  // sem arranjo conferido: as peças de uma palavra caem em colunas sorteadas (de preferência a mesma ou a vizinha)
  // e fica o primeiro arranjo em que o quadro tem alguma palavra possível (até 300 sorteios); sem garantia da chuva em si
  const all = Array.from(dict.seen.values());
  let best = null;
  for (let t = 0; t < 300; t++) {
    const st = { g: clone(grid), h: colHeights(grid), added: [], id: nextId };
    const plan = composeRain(pieces, min, lm, rnd), units = [];
    for (const L of plan.lens) {
      const pool = dict.byLen[L] || [];
      if (pool.length) units.push(...pool[Math.floor(rnd() * pool.length)].units);
    }
    while (units.length < pieces) { const e = all[Math.floor(rnd() * all.length)]; units.push(e.units[Math.floor(rnd() * e.units.length)]); }
    let c = -1;
    for (const u of units.slice(0, pieces)) {
      const open = []; for (let k = 0; k < N; k++) if (st.h[k] < N) open.push(k);
      if (!(c >= 0 && st.h[c] < N && rnd() < 0.65)) c = open[Math.floor(rnd() * open.length)];
      const r = N - 1 - st.h[c];
      st.g[r][c] = { id: st.id, u }; st.added.push({ id: st.id, r, c, u }); st.id++; st.h[c]++;
    }
    best = best || st;
    if (findWord(st.g, dict, min, mode, null)) { best = st; break; }
  }
  return { grid: best.g, added: best.added, fits: true, nextId: best.id, words: [], guaranteed: false };
}

function inBank(units) { return units.join(""); }

const KOTO = { MAXLEN, LEVELS, LEVEL_ORDER, mulberry32, shuffle, tokenize, buildDict, lookup, drop, count, adjacent,
  findWord, randomPath, partitionable, compsOk, generate, verify, reshuffle, regroup, isolated, generatePartial, rain, candidateWidths, shapeCells, inBank, dirs };
if (typeof module !== "undefined" && module.exports) module.exports = KOTO;
else root.KOTO = KOTO;
})(typeof window !== "undefined" ? window : this);
