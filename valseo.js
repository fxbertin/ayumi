// Confere o SEO do site: título e description únicos, canonical e Open Graph coerentes, imagens de compartilhamento
// (JPEG 1200x630) e sitemap.xml. Uso: node valseo.js   (esperado: "erros 0")
const fs = require("fs");
const BASE = "https://fxbertin.github.io/ayumi/";
const pages = fs.readdirSync(".").filter(f => f.endsWith(".html")).sort();
let erros = 0; const err = m => { erros++; console.log("ERRO", m); };
const titles = new Map(), descs = new Map(), canon = [];
const meta = (s, re) => { const m = s.match(re); return m ? m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#x27;/g, "'") : null; };
function jpegSize(f) { // lê SOF do JPEG
  const b = fs.readFileSync(f); if (b[0] !== 0xff || b[1] !== 0xd8) return null;
  let i = 2; while (i < b.length) { if (b[i] !== 0xff) { i++; continue; } const t = b[i + 1];
    if (t >= 0xc0 && t <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(t)) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    i += 2 + b.readUInt16BE(i + 2); } return null; }
for (const f of pages) {
  const s = fs.readFileSync(f, "utf8");
  const title = meta(s, /<title>(.*?)<\/title>/s), desc = meta(s, /<meta name="description" content="(.*?)">/);
  const noindex = /<meta name="robots" content="noindex">/.test(s);
  if (!title) { err(f + ": sem <title>"); continue; }
  if (title.length < 20 || title.length > 75) err(`${f}: título com ${title.length} caracteres`);
  if (titles.has(title)) err(`${f}: título repetido (${titles.get(title)})`); titles.set(title, f);
  if (!desc) { err(f + ": sem description"); continue; }
  if (desc.length < 70 || desc.length > 175) err(`${f}: description com ${desc.length} caracteres`);
  if (descs.has(desc)) err(`${f}: description repetida (${descs.get(desc)})`); descs.set(desc, f);
  if ((s.match(/<!-- seo:início -->/g) || []).length !== 1) err(f + ": bloco seo ausente ou duplicado");
  if (noindex) { if (/rel="canonical"|og:image/.test(s)) err(f + ": noindex com canonical/og"); continue; }
  const url = f === "index.html" ? BASE : BASE + f; canon.push(url);
  if (meta(s, /<link rel="canonical" href="(.*?)">/) !== url) err(f + ": canonical errado");
  if (meta(s, /<meta property="og:url" content="(.*?)">/) !== url) err(f + ": og:url errado");
  if (meta(s, /<meta property="og:title" content="(.*?)">/) !== title) err(f + ": og:title diferente do título");
  if (meta(s, /<meta property="og:description" content="(.*?)">/) !== desc) err(f + ": og:description diferente");
  if (meta(s, /<meta name="twitter:title" content="(.*?)">/) !== title || meta(s, /<meta name="twitter:description" content="(.*?)">/) !== desc) err(f + ": twitter título/descrição");
  const im = meta(s, /<meta property="og:image" content="(.*?)">/), tw = meta(s, /<meta name="twitter:image" content="(.*?)">/);
  if (!im || im !== tw || !im.startsWith(BASE + "img/og-") || !im.endsWith(".jpg")) { err(f + ": og:image inválida"); continue; }
  const path = im.slice(BASE.length);
  if (!fs.existsSync(path)) err(f + ": falta " + path);
  else { const d = jpegSize(path); if (!d || d[0] !== 1200 || d[1] !== 630) err(`${path}: não é JPEG 1200x630 (${d})`); }
}
const sm = fs.readFileSync("sitemap.xml", "utf8"), locs = [...sm.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
canon.forEach(u => { if (!locs.includes(u)) err("fora do sitemap: " + u); });
locs.forEach(u => { if (!canon.includes(u)) err("no sitemap mas sem página indexável: " + u); });
if (new Set(locs).size !== locs.length) err("URL repetida no sitemap");
const idx = fs.readFileSync("index.html", "utf8");
if (/1\.900/.test(idx)) err("index.html ainda diz 1.900 palavras");
if (!/<main>\s*<p class="sub">O <b>Ayumi<\/b>/.test(idx)) err("index.html sem o parágrafo de apresentação");
const words = fs.readFileSync("data/words.js", "utf8"); const C = new Function(words + ";return CATEGORIES")();
const total = C.reduce((a, c) => a + c.words.length, 0);
if (total < 2300) err("words.js tem menos de 2.300 palavras (" + total + "), mas o site diz 'mais de 2.300'");
console.log(`páginas ${pages.length} | indexáveis ${canon.length} | sitemap ${locs.length} | palavras ${total} | erros ${erros}`);
process.exit(erros ? 1 : 0);
