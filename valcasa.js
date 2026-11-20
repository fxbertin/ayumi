// Valida o jogo Kurashi Meguri: data/casa.js (motor data/zonas.js) contra data/words.js e data/sentences.js.
// Uso: node valcasa.js   (sai com código 1 se houver erro)
const fs = require("fs");
const C = new Function(fs.readFileSync("data/words.js", "utf8") + ";return CATEGORIES")();
const S = new Function(fs.readFileSync("data/sentences.js", "utf8") + ";return SENTENCES")();
const Zonas = require("./data/zonas.js"), D = require("./data/casa.js");
const r = Zonas.validate(D, C, S);
r.errs.forEach(e => console.log("ERRO", e));
console.log("zonas", r.zonas, "| grupos", JSON.stringify(r.groups), "| enfeites", r.enfeites, "| erros", r.errs.length);
process.exit(r.errs.length ? 1 : 0);
