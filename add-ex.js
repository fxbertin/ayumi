const fs=require('fs');
const W=new Function(fs.readFileSync('data/words.js','utf8')+';return CATEGORIES')();
const pt={};W.forEach(c=>c.words.forEach(w=>{pt[w[0]+'|'+w[1]]=w[3]}));
const F='data/kanji-ex.js';let s=fs.readFileSync(F,'utf8');
const X=new Function(s+';return KANJI_EX')();
const rows=require(require('path').resolve(process.argv[2]));
const by={};let bad=0;
rows.forEach(([k,r,t,w,ka,p,raro])=>{const pp=p||pt[w+'|'+ka];if(!pp){console.log('SEM PORTUGUÊS',w,ka);bad++}
  if(X[k])return console.log('ERRO kanji já tem exemplos',k)||bad++;
  const row=[r,t,w,ka,pp||''];if(raro)row.push(true);(by[k]=by[k]||[]).push(row)});
if(bad){console.log('nada gravado');process.exit(1)}
const lines=Object.keys(by).map(k=>' '+JSON.stringify(k)+': ['+by[k].map(x=>JSON.stringify(x)).join(', ')+']');
if(!s.endsWith('\n};\n'))throw new Error('fim inesperado de kanji-ex.js');
s=s.slice(0,-'\n};\n'.length)+',\n'+lines.join(',\n')+'\n};\n';
fs.writeFileSync(F,s);console.log('kanji com exemplos adicionados',lines.length,'linhas',rows.length);
