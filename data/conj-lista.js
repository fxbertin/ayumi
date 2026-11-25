// Listas de verbos e adjetivos conjugáveis do Ayumi. Compartilhadas por conjugacao.html,
// conjugacao-adjetivos.html e kana-no-ame.html, para as três usarem exatamente a mesma seleção.
// Carregue depois de data/words.js e de data/conj.js (buildVerbs) ou data/conj-adj.js (buildAdjs).

// Verbos que vivem em categorias sem "verbos" no id, e o nível de cada um.
const VERB_EXTRA = new Set(["笑う|わらう", "泣く|なく", "勝つ|かつ", "負ける|まける", "治る|なおる", "驚く|おどろく", "流行る|はやる", "乗り過ごす|のりすごす", "見送る|みおくる", "出迎える|でむかえる", "照れる|てれる", "励ます|はげます", "許す|ゆるす", "甘える|あまえる", "見守る|みまもる", "炒める|いためる", "煮る|にる", "揚げる|あげる", "茹でる|ゆでる", "蒸す|むす", "刻む|きざむ", "溶かす|とかす", "冷ます|さます", "剥く|むく", "注ぐ|そそぐ", "漬ける|つける", "炊く|たく"]);
const VERB_EXTRA_LV = { "笑う|わらう": "JLPT N5", "泣く|なく": "JLPT N5", "勝つ|かつ": "JLPT N5", "負ける|まける": "JLPT N5", "治る|なおる": "JLPT N4", "驚く|おどろく": "JLPT N3+" };
const lvOf = grp => grp.includes("N5") ? "JLPT N5" : grp.includes("N4") ? "JLPT N4" : "JLPT N3+";

// Verbos: todas as categorias com "verbos" no id + VERB_EXTRA. Cada item: makeVerb() + cat, grp, lv.
function buildVerbs() {
  const out = [], seen = new Set();
  for (const c of CATEGORIES) for (const w of c.words) {
    const key = w[0] + "|" + w[1];
    if (seen.has(key) || !(/verbos/.test(c.id) || VERB_EXTRA.has(key))) continue;
    const v = makeVerb(w); if (!v) continue;
    seen.add(key);
    v.cat = c.id; v.grp = c.group; v.lv = VERB_EXTRA.has(key) ? (VERB_EXTRA_LV[key] || "JLPT N3+") : lvOf(c.group);
    out.push(v);
  }
  return out;
}

// Adjetivos: todas as categorias com "adjetivos" no id (い e な juntos; "n3-adjna" fica de fora). Cada item: makeAdj() + cat, lv.
function buildAdjs() {
  const out = [], seen = new Set();
  for (const c of CATEGORIES) if (/adjetivos/.test(c.id)) for (const w of c.words) {
    const key = w[0] + "|" + w[1]; if (seen.has(key)) continue; seen.add(key);
    const a = makeAdj(w, c.group); a.cat = c.id; a.lv = lvOf(c.group);
    out.push(a);
  }
  return out;
}
