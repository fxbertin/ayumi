// Desenho esquemático do corpo para o jogo Karada Meguri (karada.html).
// Cada zona liga uma palavra de data/words.js (chave "japonês|kana") a um trecho do desenho.
// Cenas: f = corpo de frente, b = corpo de costas, r = rosto, o = órgãos (posições aproximadas).
// Todas as cenas usam o mesmo quadro 400x600. Zonas desenhadas depois ficam por cima (e recebem o toque primeiro).
// "up" = a zona é parte de outra (tocar na parte conta como acerto para o todo).
const BODY = (() => {
  const n = v => Math.round(v * 100) / 100;
  const E = (cx, cy, rx, ry) => ({ t: "E", a: [cx, cy, rx, ry], bb: [cx - rx, cy - ry, cx + rx, cy + ry] });
  const R = (x, y, w, h, r = 0) => ({ t: "R", a: [x, y, w, h, Math.min(r, w / 2, h / 2)], bb: [x, y, x + w, y + h] });
  const P = (d, bb) => ({ t: "P", d, bb });
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
  const Z = [], D = [];
  // z(chave, cena, cor, formas, {sym, up, eo}): zona clicável. dec(cena, camada, cor, formas, {sym, line}): enfeite sem toque.
  const z = (k, s, c, shapes, o = {}) => Z.push({ k, s, c, ...build(shapes, o.sym), up: o.up || null, eo: !!o.eo });
  const dec = (s, pos, c, shapes, o = {}) => D.push({ s, pos, c, ...build(shapes, o.sym), line: !!o.line });

  // ---------- Corpo de frente ----------
  z("首|くび", "f", "fk", [R(185, 116, 30, 30, 6)]);
  z("頭|あたま", "f", "fk", [E(200, 75, 38, 46)]);
  z("胸|むね", "f", "fk", [R(148, 144, 104, 78, 18)]);
  z("お腹|おなか", "f", "fk", [R(152, 220, 96, 74, 14)]);
  z("へそ|へそ", "f", "dk", [E(200, 262, 6, 6)], { up: "お腹|おなか" });
  z("腕|うで", "f", "fk", [R(106, 150, 28, 158, 14)], { sym: true });
  z("太もも|ふともも", "f", "fk", [R(150, 330, 46, 112, 20)], { sym: true });
  z("膝|ひざ", "f", "fk", [E(173, 448, 22, 17)], { sym: true });
  z("すね|すね", "f", "fk", [R(156, 462, 34, 72, 14)], { sym: true });
  z("足|あし", "f", "fk", [E(172, 556, 22, 15)], { sym: true });
  z("足首|あしくび", "f", "fk", [R(158, 528, 28, 18, 7)], { sym: true });
  z("つま先|つまさき", "f", "dk", [R(150, 564, 44, 15, 7)], { sym: true, up: "足|あし" });
  z("肘|ひじ", "f", "dk", [E(120, 233, 15, 13)], { sym: true, up: "腕|うで" });
  z("手首|てくび", "f", "dk", [R(106, 292, 28, 16, 6)], { sym: true, up: "腕|うで" });
  z("手|て", "f", "fk", [E(120, 328, 15, 22)], { sym: true });
  z("指|ゆび", "f", "dk", [R(106, 344, 6, 34, 3), R(113, 346, 6, 36, 3), R(120, 346, 6, 36, 3), R(127, 344, 6, 32, 3)], { sym: true, up: "手|て" });
  z("親指|おやゆび", "f", "dk", [E(139, 326, 5, 13)], { sym: true, up: "手|て" });
  z("肩|かた", "f", "dk", [E(139, 158, 18, 16)], { sym: true });
  dec("f", "o", "hr", [P("M162 70C160 40 180 26 200 26C220 26 240 40 238 70C228 54 214 50 200 50C186 50 172 54 162 70Z", [160, 26, 240, 70])]);
  dec("f", "o", "eb", [E(188, 78, 3, 4), E(212, 78, 3, 4)]);
  dec("f", "o", "lp", [E(200, 98, 8, 3)]);
  dec("f", "o", "sh", [R(146, 290, 108, 52, 16)]);

  // ---------- Corpo de costas (as partes da frente ficam só como desenho) ----------
  z("背中|せなか", "b", "fk", [R(148, 144, 104, 102, 18)]);
  z("腰|こし", "b", "dk", [R(152, 248, 96, 44, 12)]);
  z("ふくらはぎ|ふくらはぎ", "b", "dk", [E(173, 494, 17, 26)], { sym: true });
  z("かかと|かかと", "b", "dk", [E(172, 563, 14, 9)], { sym: true });
  dec("b", "o", "hr", [E(200, 75, 38, 46)]);
  dec("b", "o", "sh", [R(146, 290, 108, 52, 16)]);

  // ---------- Rosto ----------
  z("髪|かみ", "r", "hr", [E(200, 262, 152, 162)]);
  z("耳|みみ", "r", "fk", [E(60, 332, 15, 32)], { sym: true });
  z("顔|かお", "r", "fk", [E(200, 322, 128, 168)]);
  z("額|ひたい", "r", "fk2", [E(200, 208, 82, 38)], { up: "顔|かお" });
  z("眉毛|まゆげ", "r", "eb", [R(112, 254, 64, 12, 6)], { sym: true, up: "顔|かお" });
  z("目|め", "r", "wh", [E(146, 300, 27, 15)], { sym: true, up: "顔|かお" });
  z("まつげ|まつげ", "r", "eb", [P("M119 300C125 278 167 278 173 300C165 289 127 289 119 300Z", [119, 283, 173, 300]), P("M227 300C233 278 275 278 281 300C273 289 235 289 227 300Z", [227, 283, 281, 300])], { up: "目|め" });
  z("鼻|はな", "r", "dk", [E(200, 356, 20, 34)], { up: "顔|かお" });
  z("頬|ほお", "r", "cheek", [E(124, 386, 38, 30)], { sym: true, up: "顔|かお" });
  z("口|くち", "r", "mt", [E(200, 430, 62, 32)], { up: "顔|かお" });
  z("唇|くちびる", "r", "lp", [E(200, 430, 62, 32), E(200, 430, 46, 19)], { up: "口|くち", eo: true });
  z("歯|は", "r", "tt", [R(168, 419, 64, 11, 4)], { up: "口|くち" });
  z("舌|した", "r", "tg", [E(200, 441, 24, 8)], { up: "口|くち" });
  z("顎|あご", "r", "dk", [E(200, 477, 48, 15)], { up: "顔|かお" });
  dec("r", "o", "dkp", [E(146, 301, 10, 11), E(254, 301, 10, 11)]);
  dec("r", "o", "dkp", [E(192, 366, 3.5, 2.5), E(208, 366, 3.5, 2.5)]);

  // ---------- Órgãos (esquemático) ----------
  dec("o", "u", "sil", [E(200, 95, 62, 74), R(180, 160, 40, 40, 8), R(92, 192, 216, 300, 40), R(100, 470, 200, 92, 30), R(46, 204, 40, 170, 20)], { sym: false });
  dec("o", "u", "sil", [R(314, 204, 40, 170, 20)]);
  z("腎臓|じんぞう", "o", "o-kid", [E(120, 420, 12, 24)], { sym: true });
  z("腸|ちょう", "o", "o-int", [R(146, 432, 108, 92, 26)]);
  z("膀胱|ぼうこう", "o", "o-bla", [E(200, 541, 22, 16)]);
  z("肝臓|かんぞう", "o", "o-liv", [P("M122 345C150 330 200 336 232 352C228 378 200 392 160 388C135 384 122 370 122 345Z", [122, 330, 232, 392])]);
  z("胃|い", "o", "o-sto", [P("M222 350C262 344 282 362 276 392C270 420 238 428 226 410C238 404 246 392 238 382C228 374 218 368 222 350Z", [218, 344, 282, 428])]);
  z("肺|はい", "o", "o-lun", [E(158, 275, 38, 66)], { sym: true });
  z("心臓|しんぞう", "o", "o-hea", [P("M212 326C194 312 192 292 202 288C208 286 212 289 212 294C212 289 216 286 222 288C232 292 230 312 212 326Z", [192, 286, 232, 326])]);
  z("脳|のう", "o", "o-bra", [E(200, 86, 46, 40)]);
  dec("o", "o", "ln", [P("M160 448H240Q252 448 252 462Q252 476 240 476H160Q148 476 148 490Q148 504 160 504H240", [148, 448, 252, 504])], { line: true });
  dec("o", "o", "ln", [P("M200 50C195 70 205 100 200 124", [195, 50, 205, 124])], { line: true });

  const VISTAS = { corpo: ["f", "b"], rosto: ["r"], orgaos: ["o"] };
  const GROUP = { f: "corpo", b: "corpo", r: "rosto", o: "orgaos" };
  // Zonas pedidas na vista e fora do desenho: 汗, 骨, 喉 e 爪 continuam só no vocabulário.
  const EXCLUIDAS = ["汗|あせ", "骨|ほね", "喉|のど", "爪|つめ"];
  return { ZONES: Z, DECOR: D, VISTAS, GROUP, EXCLUIDAS, FULL: [0, 0, 400, 600], HEAD: [150, 0, 100, 150], TORSO: [100, 100, 200, 300] };
})();
if (typeof module !== "undefined") module.exports = BODY;
