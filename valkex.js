const fs=require('fs');
const K=new Function(fs.readFileSync('data/kanji.js','utf8')+';return KANJI')();
const W=new Function(fs.readFileSync('data/words.js','utf8')+';return CATEGORIES')();
const X=new Function(fs.readFileSync('data/kanji-ex.js','utf8')+';return KANJI_EX')();
const toH=s=>s.replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-96));
const base=r=>r.replace(/\(.*?\)/g,'');
const pt={};W.forEach(c=>c.words.forEach(w=>{pt[w[0]+'|'+w[1]]=w[3]}));
const VOICE={か:'が',き:'ぎ',く:'ぐ',け:'げ',こ:'ご',さ:'ざ',し:'じ',す:'ず',せ:'ぜ',そ:'ぞ',た:'だ',ち:'ぢ',つ:'づ',て:'で',と:'ど',は:'ばぱ',ひ:'びぴ',ふ:'ぶぷ',へ:'べぺ',ほ:'ぼぽ'};
function variants(r){const s=new Set([r]);const f=r[0];if(VOICE[f])[...VOICE[f]].forEach(v=>s.add(v+r.slice(1)));
  [...s].forEach(v=>{if(/[つちくき]$/.test(v))s.add(v.slice(0,-1)+'っ')});return [...s]}
let bad=0;const err=(...a)=>{bad++;console.log('ERRO',...a)};
const kmap=Object.fromEntries(K.map(k=>[k[0],k]));
let nread=0,done=0,missing=[];
Object.keys(X).forEach(k=>{
  if(!kmap[k]){err('kanji fora do kanji.js',k);return}
  const e=kmap[k];const rs=[...e[2].map(r=>[toH(base(r)),'kun']),...e[3].map(r=>[toH(base(r)),'on'])];
  const used=new Set();
  X[k].forEach(row=>{
    const [r,t,w,ka,p,raro]=row;
    if(row.length<5||row.length>6||(row.length===6&&raro!==true))err(k,'campos',row);
    if(!rs.some(x=>x[0]===r&&x[1]===t))err(k,'leitura inexistente no kanji.js',r,t);
    if(!w.includes(k))err(k,'palavra sem o kanji',w);
    if(!/^[ぁ-んー]+$/.test(ka))err(k,'kana inválido',ka);
    if(!variants(r).some(v=>ka.includes(v)))err(k,'kana não contém a leitura',r,w,ka);
    if(used.has(w+'|'+ka))err(k,'palavra repetida no mesmo kanji',w);used.add(w+'|'+ka);
    if(!p)err(k,'sem português',w);
    if(pt[w+'|'+ka]&&pt[w+'|'+ka]!==p)err(k,'português difere do words.js',w,p,pt[w+'|'+ka]);
  });
  rs.forEach(([r,t])=>{nread++;if(X[k].some(x=>x[0]===r&&x[1]===t))done++;else{err(k,'leitura sem exemplo',r,t)}});
});
K.forEach(k=>{if(!X[k[0]])missing.push(k[0])});
console.log('kanji com exemplo',Object.keys(X).length,'de',K.length,'| leituras cobertas',done,'de',nread,'nos kanji feitos | faltam:',missing.length,'kanji','| erros',bad);
