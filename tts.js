/* Ayumi: áudio compartilhado (Web Speech API, ja-JP).
   Todas as páginas que falam usam AyumiTTS; nenhuma chama speechSynthesis.speak direto.
   API:
     AyumiTTS.supported()            há síntese de voz neste navegador?
     AyumiTTS.voices()               vozes japonesas, locais primeiro (funcionam offline)
     AyumiTTS.pick()                 a melhor voz japonesa (ou null)
     AyumiTTS.hasJa()                existe alguma voz japonesa?
     AyumiTTS.speak(texto, opts)     opts: rate (0.9), pitch, voice, onend, onerror, onnovoice
     AyumiTTS.speakList(itens, opts) fala em sequência; itens = [{text, ...}];
                                     opts: rate, voiceFor(item)->{voice,pitch}|voice, onItem(item,i), onDone()
     AyumiTTS.cancel()               para tudo
     AyumiTTS.onVoices(fn)           chama fn quando a lista de vozes muda
   Em node (testes) exporta o mesmo objeto via module.exports. */
(function (root) {
  "use strict";
  var DEFAULT_RATE = 0.9;
  var ss = null;
  try { ss = root.speechSynthesis || null; } catch (e) { ss = null; }
  var hasUtt = typeof root.SpeechSynthesisUtterance !== "undefined";
  var token = 0;                 // cada fala nova invalida callbacks da anterior
  var loaded = false;            // já vimos uma lista de vozes não vazia (ou esgotamos a espera)
  var listeners = [];
  var cache = null;

  function supported() { return !!(ss && hasUtt); }

  function isJa(v) { return /^ja/i.test(String(v && v.lang).replace("_", "-")); }

  function rawVoices() {
    try { return (ss && ss.getVoices && ss.getVoices()) || []; } catch (e) { return []; }
  }

  // locais primeiro; dentro de cada grupo, ja-JP antes de outras variantes e ordem estável pelo nome
  function voices() {
    if (cache) return cache;
    var list = rawVoices().filter(isJa).map(function (v, i) { return { v: v, i: i }; });
    list.sort(function (a, b) {
      var la = a.v.localService ? 0 : 1, lb = b.v.localService ? 0 : 1;
      if (la !== lb) return la - lb;
      var ja = /^ja[-_]jp$/i.test(a.v.lang) ? 0 : 1, jb = /^ja[-_]jp$/i.test(b.v.lang) ? 0 : 1;
      if (ja !== jb) return ja - jb;
      var na = String(a.v.name), nb = String(b.v.name);
      if (na !== nb) return na < nb ? -1 : 1;
      return a.i - b.i;
    });
    var out = list.map(function (x) { return x.v; });
    if (rawVoices().length) cache = out;   // lista vazia não é guardada: pode encher depois
    return out;
  }

  function pick() { var v = voices(); return v.length ? v[0] : null; }
  function hasJa() { return voices().length > 0; }

  function changed() {
    cache = null;
    if (rawVoices().length) loaded = true;
    listeners.slice().forEach(function (fn) { try { fn(); } catch (e) {} });
  }
  function onVoices(fn) { if (typeof fn === "function") listeners.push(fn); }

  if (ss) {
    try {
      if (ss.addEventListener) ss.addEventListener("voiceschanged", changed);
      else ss.onvoiceschanged = changed;
      rawVoices();   // alguns navegadores só começam a carregar a lista depois da 1ª chamada
    } catch (e) {}
  }

  function cancel() {
    token++;
    if (ss) { try { ss.cancel(); } catch (e) {} }
  }

  // espera (até ~1,5 s) a lista de vozes quando ela ainda está vazia no início
  function whenReady(cb) {
    if (rawVoices().length || loaded) { loaded = true; return cb(); }
    var waited = 0, done = false;
    function go() { if (done) return; done = true; loaded = true; cb(); }
    onVoices(function () { if (rawVoices().length) go(); });
    (function tick() {
      if (done) return;
      if (rawVoices().length) return go();
      waited += 150;
      if (waited >= 1500) return go();
      setTimeout(tick, 150);
    })();
  }

  function speak(text, opts) {
    opts = opts || {};
    if (!supported() || !text) return null;
    var my = ++token;
    try { ss.cancel(); } catch (e) {}
    function fire(fn) { if (my === token && typeof fn === "function") { try { fn(); } catch (e) {} } }
    whenReady(function () {
      if (my !== token) return;   // outra fala (ou cancel) chegou enquanto esperava
      var u;
      try { u = new root.SpeechSynthesisUtterance(String(text)); } catch (e) { return fire(opts.onerror); }
      u.lang = "ja-JP";
      u.rate = typeof opts.rate === "number" ? opts.rate : DEFAULT_RATE;
      if (typeof opts.pitch === "number") u.pitch = opts.pitch;
      var v = opts.voice || pick();
      if (v) { try { u.voice = v; if (v.lang) u.lang = v.lang; } catch (e) {} }
      else if (rawVoices().length) fire(opts.onnovoice);   // há vozes, mas nenhuma japonesa
      u.onend = function () { fire(opts.onend); };
      u.onerror = function () { fire(opts.onerror); };
      // pequeno atraso depois do cancel(): sem ele o Chrome às vezes engole o começo da fala
      setTimeout(function () {
        if (my !== token) return;
        try { ss.speak(u); } catch (e) { fire(opts.onerror); }
      }, 60);
    });
    return my;
  }

  function speakList(items, opts) {
    opts = opts || {};
    cancel();
    var my = token, i = 0;
    function next() {
      if (my !== token) return;
      if (i >= items.length) { if (opts.onDone) opts.onDone(); return; }
      var it = items[i], idx = i++;
      if (opts.onItem) opts.onItem(it, idx);
      var vf = opts.voiceFor ? opts.voiceFor(it) : null;
      var o = { rate: opts.rate };
      if (vf && vf.voice !== undefined) { o.voice = vf.voice || undefined; o.pitch = vf.pitch; }
      else if (vf) o.voice = vf;
      o.onend = next; o.onerror = next;
      speak(it.text, o);
      my = token;   // speak() abriu um novo token: a fila acompanha
    }
    next();
  }

  // Aviso único quando o aparelho tem vozes, mas nenhuma é japonesa (o áudio ficaria mudo)
  function noVoiceNotice() {
    try {
      if (!supported() || localStorage.getItem("kd-voice-note")) return;
      var tries = 0;
      var check = function () {
        var all = rawVoices();
        if (hasJa()) return;
        if (all.length === 0 && ++tries < 6) return setTimeout(check, 600);
        if (all.length === 0) return;   // sem como saber: não avisa
        var n = document.createElement("div");
        n.setAttribute("role", "status");
        n.style.cssText = "margin:12px 0;padding:10px 12px;border:1.5px solid var(--line);border-radius:8px;background:var(--card);font-size:.92rem";
        n.textContent = "Este aparelho não tem uma voz japonesa instalada, então o áudio pode ficar mudo. Instale uma nas configurações de voz (texto para fala) do sistema. ";
        var b = document.createElement("button"); b.type = "button"; b.className = "ghost"; b.textContent = "Entendi";
        b.onclick = function () { try { localStorage.setItem("kd-voice-note", "1"); } catch (e) {} n.remove(); };
        n.appendChild(b); (document.querySelector("main") || document.body).prepend(n);
      };
      onVoices(function () { tries = 99; check(); });
      setTimeout(check, 800);
    } catch (e) {}
  }

  var api = { supported: supported, voices: voices, pick: pick, hasJa: hasJa, speak: speak,
              speakList: speakList, cancel: cancel, onVoices: onVoices, noVoiceNotice: noVoiceNotice, DEFAULT_RATE: DEFAULT_RATE };
  root.AyumiTTS = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;

  if (root.document && root.addEventListener) {
    root.addEventListener("pagehide", cancel);
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", noVoiceNotice);
    else noVoiceNotice();
  }
})(typeof window !== "undefined" ? window : globalThis);
