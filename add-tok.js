// Acrescenta frases ao arquivo de tokens de um nível. Uso: node add-tok.js n5 lote.txt
// lote.txt: uma frase por linha: <frase em japonês>TAB<palavra/leitura/significado; palavra/leitura/significado; ...>
// Leitura omitida = a própria palavra (partículas, kana); significado omitido = herdar de FW ou de words.js.
// Não use ";" nem "/" dentro de um significado. Depois rode: node valtok.js
const fs = require("fs"), path = require("path");
const [nivel, lote] = process.argv.slice(2);
if (!nivel || !lote) { console.log("uso: node add-tok.js n5 lote.txt"); process.exit(1); }
const dest = path.join(__dirname, "data", `sent-tokens-${nivel}.js`);
global.SENTTOK = {};
if (fs.existsSync(dest)) new Function(fs.readFileSync(dest, "utf8"))();
let novos = 0, trocados = 0;
for (const linha of fs.readFileSync(lote, "utf8").split(/\r?\n/)) {
  if (!linha.trim() || linha.startsWith("#")) continue;
  const [jp, resto] = linha.split("\t");
  if (!resto) { console.log("linha sem tokens: " + linha); process.exit(1); }
  const toks = resto.split(";").map(x => x.trim()).filter(Boolean).map(x => { const [a, b = "", c = ""] = x.split("/").map(y => y.trim()); return [a, b === a ? "" : b, c]; });
  const arr = toks.map(([a, b, c]) => c ? [a, b, c] : b ? [a, b] : [a]);
  if (jp in global.SENTTOK) trocados++; else novos++;
  global.SENTTOK[jp] = arr;
}
const q = s => JSON.stringify(s);
const corpo = Object.entries(global.SENTTOK).map(([k, v]) => q(k) + ":[" + v.map(t => "[" + t.map(q).join(",") + "]").join(",") + "]").join(",\n");
fs.writeFileSync(dest, `// Frases divididas em palavras (${nivel.toUpperCase()}): SENTTOK[frase] = [[palavra, leitura, significado], ...].\n// Leitura omitida = a palavra; significado omitido = vem de FW (data/fw.js) ou de data/words.js. Gerado por add-tok.js; valide com node valtok.js.\nObject.assign(globalThis.SENTTOK = globalThis.SENTTOK || {}, {\n${corpo}\n});\n`);
console.log(`${novos} novas, ${trocados} substituídas, total ${Object.keys(global.SENTTOK).length} em ${path.relative(__dirname, dest)}`);
