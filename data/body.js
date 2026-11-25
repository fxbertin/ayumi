// Desenho esquemático do corpo para o jogo Karada Meguri (karada.html), no motor data/zonas.js.
// Cenas: f = corpo de frente (raiz), b = costas (verso de f: o desenho GIRA), r = rosto (com o pescoço e a 喉), o = órgãos e m = mão (palma e unhas), todas com zoom a partir de f.
// Todas as cenas usam o quadro 400x600. Zonas e enfeites são desenhados na ordem em que aparecem aqui:
// o que vem depois fica por cima (e recebe o toque primeiro). "up" = a zona é parte de outra (tocar na parte vale para o todo).
const BODY = (() => {
  const Z = typeof Zonas !== "undefined" ? Zonas : require("./zonas.js");
  const { E, R, P } = Z.shapes;
  const { z, dec, Z: ZONES, D: DECOR } = Z.builder();
  const copies = [];                                   // zonas da frente, para desenhá-las por baixo nas costas
  const zf = (...a) => { copies.push(a); return z(...a); };
  const HEAD = [150, 0, 100, 150], TORSO = [100, 100, 200, 300], MAO = [60, 250, 120, 180];   // trechos aproximados (proporção 2:3)

  // ---------- Corpo de frente ----------
  zf("首|くび", "f", "fk", [R(185, 116, 30, 30, 6)]);
  zf("頭|あたま", "f", "fk", [E(200, 75, 38, 46)]);
  zf("胸|むね", "f", "fk", [R(148, 144, 104, 78, 18)]);
  zf("お腹|おなか", "f", "fk", [R(152, 220, 96, 74, 14)]);
  zf("へそ|へそ", "f", "dk", [E(200, 262, 6, 6)], { up: "お腹|おなか" });
  zf("腕|うで", "f", "fk", [R(106, 150, 28, 158, 14)], { sym: true });
  zf("太もも|ふともも", "f", "fk", [R(150, 330, 46, 112, 20)], { sym: true });
  zf("膝|ひざ", "f", "fk", [E(173, 448, 22, 17)], { sym: true });
  zf("すね|すね", "f", "fk", [R(156, 462, 34, 72, 14)], { sym: true });
  zf("足|あし", "f", "fk", [E(172, 556, 22, 15)], { sym: true });
  zf("足首|あしくび", "f", "fk", [R(158, 528, 28, 18, 7)], { sym: true });
  zf("つま先|つまさき", "f", "dk", [R(150, 564, 44, 15, 7)], { sym: true, up: "足|あし" });
  zf("肘|ひじ", "f", "dk", [E(120, 233, 15, 13)], { sym: true, up: "腕|うで" });
  zf("手首|てくび", "f", "dk", [R(106, 292, 28, 16, 6)], { sym: true, up: "腕|うで" });
  zf("手|て", "f", "fk", [E(120, 328, 15, 22)], { sym: true });
  zf("指|ゆび", "f", "dk", [R(106, 344, 6, 34, 3), R(113, 346, 6, 36, 3), R(120, 346, 6, 36, 3), R(127, 344, 6, 32, 3)], { sym: true, up: "手|て" });
  zf("親指|おやゆび", "f", "dk", [E(139, 326, 5, 13)], { sym: true, up: "手|て" });
  zf("肩|かた", "f", "dk", [E(139, 158, 18, 16)], { sym: true });
  zf("脇|わき", "f", "dk", [E(141, 192, 8, 15)], { sym: true });
  dec("f", "hr", [P("M162 70C160 40 180 26 200 26C220 26 240 40 238 70C228 54 214 50 200 50C186 50 172 54 162 70Z", [160, 26, 240, 70])]);
  dec("f", "eb", [E(188, 78, 3, 4), E(212, 78, 3, 4)]);
  dec("f", "lp", [E(200, 98, 8, 3)]);
  dec("f", "sh", [R(146, 290, 108, 52, 16)]);

  // ---------- Corpo de costas (as partes da frente ficam só como desenho) ----------
  // a frente aparece por baixo nas costas (braços, pernas, mãos, cabeça...), menos o que fica na frente do tronco
  const SEM_COSTAS = ["胸|むね", "お腹|おなか", "へそ|へそ", "脇|わき"];
  copies.filter(a => !SEM_COSTAS.includes(a[0])).forEach(([k, s, c, sh, o = {}]) => dec("b", c, sh, { sym: o.sym }));
  z("背中|せなか", "b", "fk", [R(148, 144, 104, 102, 18)]);
  z("腰|こし", "b", "dk", [R(152, 248, 96, 44, 12)]);
  z("ふくらはぎ|ふくらはぎ", "b", "dk", [E(173, 494, 17, 26)], { sym: true });
  z("かかと|かかと", "b", "dk", [E(172, 563, 14, 9)], { sym: true });
  dec("b", "hr", [E(200, 75, 38, 46)]);
  dec("b", "sh", [R(146, 290, 108, 52, 16)]);
  z("お尻|おしり", "b", "fk2", [E(174, 318, 25, 26)], { sym: true });

  // ---------- Rosto ----------
  dec("r", "dk", [R(150, 440, 100, 160)]);                       // pescoço (por baixo do rosto)
  dec("r", "fk", [P("M70 600V592Q70 574 92 572H308Q330 574 330 592V600Z", [70, 572, 330, 600])]);                         // topo do peito
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
  z("喉|のど", "r", "fk2", [E(200, 532, 28, 30)]);
  dec("r", "ln", [P("M186 530Q200 540 214 530", [186, 530, 214, 540])], { line: true });
  dec("r", "dkp", [E(146, 301, 10, 11), E(254, 301, 10, 11)]);
  dec("r", "dkp", [E(192, 366, 3.5, 2.5), E(208, 366, 3.5, 2.5)]);

  // ---------- Órgãos (esquemático) ----------
  dec("o", "sil", [E(200, 95, 62, 74), R(180, 160, 40, 40, 8), R(92, 192, 216, 300, 40), R(100, 470, 200, 92, 30), R(46, 204, 40, 170, 20)], { sym: false });
  dec("o", "sil", [R(314, 204, 40, 170, 20)]);
  z("腎臓|じんぞう", "o", "o-kid", [E(120, 420, 12, 24)], { sym: true });
  z("腸|ちょう", "o", "o-int", [R(146, 432, 108, 92, 26)]);
  z("膀胱|ぼうこう", "o", "o-bla", [E(200, 541, 22, 16)]);
  z("肝臓|かんぞう", "o", "o-liv", [P("M122 345C150 330 200 336 232 352C228 378 200 392 160 388C135 384 122 370 122 345Z", [122, 330, 232, 392])]);
  z("胃|い", "o", "o-sto", [P("M222 350C262 344 282 362 276 392C270 420 238 428 226 410C238 404 246 392 238 382C228 374 218 368 222 350Z", [218, 344, 282, 428])]);
  z("肺|はい", "o", "o-lun", [E(158, 275, 38, 66)], { sym: true });
  z("心臓|しんぞう", "o", "o-hea", [P("M212 326C194 312 192 292 202 288C208 286 212 289 212 294C212 289 216 286 222 288C232 292 230 312 212 326Z", [192, 286, 232, 326])]);
  z("脳|のう", "o", "o-bra", [E(200, 86, 46, 40)]);
  dec("o", "ln", [P("M160 448H240Q252 448 252 462Q252 476 240 476H160Q148 476 148 490Q148 504 160 504H240", [148, 448, 252, 504])], { line: true });
  dec("o", "ln", [P("M200 50C195 70 205 100 200 124", [195, 50, 205, 124])], { line: true });

  // ---------- Mão (zoom a partir da mão da frente): palma à esquerda, costas da mão com as unhas à direita ----------
  const dedos = [[62, 205], [87, 165], [112, 150], [137, 170]];     // [x, topo] do mindinho ao indicador (mão esquerda, vista da palma)
  const flip = x => 400 - x;
  const polegar = m => { const X = x => (m ? flip(x) : x); return P(`M${X(150)} 386C${X(172)} 376 ${X(188)} 346 ${X(194)} 308C${X(197)} 288 ${X(176)} 274 ${X(166)} 294C${X(158)} 312 ${X(148)} 326 ${X(138)} 338Z`, [Math.min(X(138), X(197)), 274, Math.max(X(138), X(197)), 386]); };
  const dedosR = m => dedos.map(([x, top]) => R(m ? flip(x + 22) : x, top, 22, 300 - top, 11));
  // palma (esquerda)
  dec("m", "fk", dedosR(false).concat([polegar(false)]));
  dec("m", "dk", [R(76, 390, 68, 100, 14)]);
  z("手のひら|てのひら", "m", "fk", [R(60, 270, 100, 130, 28)]);
  dec("m", "ln", [P("M68 318C92 332 122 332 154 312", [68, 312, 154, 332])], { line: true });
  dec("m", "ln", [P("M70 348C100 356 126 354 154 340", [70, 340, 154, 356])], { line: true });
  // costas da mão (direita), com as unhas
  dec("m", "fk2", dedosR(true).concat([polegar(true)]));
  dec("m", "dk", [R(flip(144), 390, 68, 100, 14)]);
  dec("m", "fk2", [R(flip(160), 270, 100, 130, 28)]);
  z("爪|つめ", "m", "nl", dedos.map(([x, top]) => R(flip(x + 22) + 3, top + 6, 16, 24, 7)).concat([E(flip(180), 296, 8, 11)]));

  const SCENES = {
    f: { tag: "Corpo · de frente" },
    b: { tag: "Corpo · de costas", flip: "f" },
    r: { tag: "Rosto", parent: "f", box: HEAD },
    o: { tag: "Órgãos · posições aproximadas", parent: "f", box: TORSO },
    m: { tag: "Mão · palma e costas da mão", parent: "f", box: MAO },
  };
  const VISTAS = {
    corpo: { name: "Corpo", scenes: ["f", "b", "m"] },
    rosto: { name: "Rosto", scenes: ["r"] },
    orgaos: { name: "Órgãos", scenes: ["o"] },
    tudo: { name: "Tudo", label: "tudo misturado", quota: { corpo: 4, rosto: 3, orgaos: 3 } },   // cota por GRUPO
  };
  return {
    ZONES, DECOR, SCENES, VISTAS,
    ORDER: ["f", "b", "m", "r", "o"], VORDER: ["corpo", "rosto", "orgaos", "tudo"],
    GROUP: { f: "corpo", b: "corpo", m: "corpo", r: "rosto", o: "orgaos" },
    ALIAS: {},
    PREFER: ["corpo"],                                 // 顔 contém quase tudo do rosto: as alternativas que faltam vêm do corpo
    FALLBACK: ["顔|かお"],
    // Palavras da categoria "corpo" que ficam só no vocabulário (abstratas ou sem desenho simples).
    EXCLUIDAS: ["汗|あせ", "骨|ほね", "肌|はだ", "皮膚|ひふ", "筋肉|きんにく", "息|いき", "拳|こぶし", "声|こえ"],
    NEED: [],                                          // valkarada.js preenche com as categorias de corpo
    FRAME: [400, 600], MAX: 10, MIN: 8,
  };
})();
if (typeof module !== "undefined") module.exports = BODY;
