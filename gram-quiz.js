/* Motor da prova de gramática: funções puras, sem DOM (testável em node).
   No navegador vira o global KDQuiz; no node, module.exports. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.KDQuiz = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  var QUIZ_N = 20;     // perguntas por prova (pode ser 15)
  var MIN_BANK = 50;   // mínimo de perguntas no banco para o nível ter prova

  function shuffle(a, rnd) {
    var r = a.slice(), i, j, t;
    rnd = rnd || Math.random;
    for (i = r.length - 1; i > 0; i--) { j = Math.floor(rnd() * (i + 1)); t = r[i]; r[i] = r[j]; r[j] = t; }
    return r;
  }

  // lista de ids vistos, do mais antigo ao mais recente: só ids que ainda existem, sem repetição
  function cleanSeen(seen, bank) {
    var ok = {}, out = [];
    bank.forEach(function (q) { ok[q.id] = true; });
    (Array.isArray(seen) ? seen : []).forEach(function (id) {
      if (!ok[id]) return;
      var k = out.indexOf(id);
      if (k >= 0) out.splice(k, 1);
      out.push(id);
    });
    return out;
  }

  // 1) ao menos 1 pergunta por tópico (se n >= nº de tópicos); 2) completa com as não vistas;
  // 3) se acabarem, completa com as vistas há mais tempo; ciclo completo => reinicia.
  function pickQuestions(bank, topicIds, seen, n, rnd) {
    rnd = rnd || Math.random;
    n = Math.max(0, Math.min(n, bank.length));
    var s = cleanSeen(seen, bank);
    if (s.length >= bank.length) s = [];              // todas já vistas: novo ciclo
    var pos = {}; s.forEach(function (id, i) { pos[id] = i; });
    var isNew = function (q) { return pos[q.id] === undefined; };
    var picked = [], used = {};
    function take(q) { picked.push(q); used[q.id] = true; }

    var topics = [];
    (topicIds || []).forEach(function (tid) {
      var qs = bank.filter(function (q) { return q.topic === tid; });
      if (qs.length) topics.push({ qs: qs });
    });
    topics = shuffle(topics, rnd);
    topics.forEach(function (t) {
      t.key = t.qs.some(isNew) ? -1 : Math.min.apply(null, t.qs.map(function (q) { return pos[q.id]; }));
    });
    topics.sort(function (a, b) { return a.key - b.key; });   // tópicos com perguntas novas primeiro; depois os vistos há mais tempo
    // n >= nº de tópicos: todos os tópicos entram (1 pergunta cada). Senão, só os que ainda têm perguntas novas,
    // para nunca repetir uma pergunta enquanto sobram não vistas.
    var cover = n >= topics.length ? topics.length : Math.min(n, topics.filter(function (t) { return t.key === -1; }).length);
    topics.slice(0, cover).forEach(function (t) {
      var fresh = t.qs.filter(isNew);
      take(fresh.length
        ? fresh[Math.floor(rnd() * fresh.length)]
        : t.qs.slice().sort(function (a, b) { return pos[a.id] - pos[b.id]; })[0]);
    });

    if (picked.length < n) {
      var rest = bank.filter(function (q) { return !used[q.id]; });
      var fresh2 = shuffle(rest.filter(isNew), rnd);
      var old = rest.filter(function (q) { return !isNew(q); }).sort(function (a, b) { return pos[a.id] - pos[b.id]; });
      fresh2.concat(old).slice(0, n - picked.length).forEach(take);
    }
    return { picked: shuffle(picked, rnd), seen: s };
  }

  // embaralha as opções e recalcula qual é a correta
  function shuffleQuestion(q, rnd) {
    var idx = shuffle(q.opts.map(function (_, i) { return i; }), rnd);
    return { id: q.id, topic: q.topic, kind: q.kind, q: q.q, why: q.why,
      opts: idx.map(function (i) { return q.opts[i]; }), ans: idx.indexOf(q.ans) };
  }

  // monta a prova: perguntas em ordem aleatória + a lista "seen" já atualizada (a mais recente no fim)
  function buildExam(bank, topicIds, seen, n, rnd) {
    rnd = rnd || Math.random;
    var r = pickQuestions(bank, topicIds, seen, n, rnd);
    var ids = {}; r.picked.forEach(function (q) { ids[q.id] = true; });
    return {
      items: r.picked.map(function (q) { return shuffleQuestion(q, rnd); }),
      seen: r.seen.filter(function (id) { return !ids[id]; }).concat(r.picked.map(function (q) { return q.id; }))
    };
  }

  function available(bank) { return Array.isArray(bank) && bank.length >= MIN_BANK; }
  function percent(right, total) { return total ? Math.round(right / total * 100) : 0; }

  return { QUIZ_N: QUIZ_N, MIN_BANK: MIN_BANK, shuffle: shuffle, cleanSeen: cleanSeen,
    pickQuestions: pickQuestions, shuffleQuestion: shuffleQuestion, buildExam: buildExam,
    available: available, percent: percent };
});
