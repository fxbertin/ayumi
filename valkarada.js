// Valida o jogo Karada Meguri: data/body.js (motor data/zonas.js) contra data/words.js e data/sentences.js.
// Uso: node valkarada.js   (sai com código 1 se houver erro)
const fs = require("fs");
const C = new Function(fs.readFileSync("data/words.js", "utf8") + ";return CATEGORIES")();
const S = new Function(fs.readFileSync("data/sentences.js", "utf8") + ";return SENTENCES")();
const Zonas = require("./data/zonas.js"), D = require("./data/body.js");
// toda palavra da categoria "corpo" precisa de zona ou de exclusão declarada
D.NEED = C.find(c => c.id === "corpo").words.map(w => w[0] + "|" + w[1]);
const r = Zonas.validate(D, C, S);
r.errs.forEach(e => console.log("ERRO", e));
const g = r.groups;
console.log("zonas", r.zonas, "| corpo", g.corpo, "rosto", g.rosto, "órgãos", g.orgaos, "| enfeites", r.enfeites, "| erros", r.errs.length);
process.exit(r.errs.length ? 1 : 0);
