// Validador do nível Avançado do táxi: formato formal, sem espaços, furigana só nos kanji fora do N5 (lista de data/kanji.js),
// simulação do texto (leitura em kana) em meias quadras, ruas fechadas, número de curvas e de bloqueios.
// Uso: node valtaxi-av.js [N mapas]   (padrão 2000)
const fs=require("fs"),T=require("./data/taxi.js"),N=+process.argv[2]||2000;
const KANJI=new Function(fs.readFileSync(__dirname+"/data/kanji.js","utf8")+";return KANJI")();
const N5=new Set(KANJI.filter(k=>k[1]==="N5").map(k=>k[0]));
const KJ=/[\u3400-\u9fff]/g;
let err=0;const fail=m=>{if(err++<12)console.log("ERRO",m)};
const P="^(そのあと、)?",D="(みぎ|ひだり)にまがっていただけますか。$";
const RE={A:new RegExp(P+"まっすぐすすんで、(ひとつめ|ふたつめ|みっつめ)のかどを"+D),B:new RegExp(P+"まっすぐすすんで、(.+)をとおりすぎてから、さいしょのかどを"+D),
  C:new RegExp(P+"つぎのこうさてんはとおりすぎて、そのつぎのこうさてんを"+D),Dd:new RegExp(P+"つきあたりまですすんで、"+D),Z:new RegExp(P+"まっすぐすすんで、(.+)のまえでとめていただけますか。$")};
const ORD={ひとつめ:1,ふたつめ:2,みっつめ:3},W=2*(T.C-1),H=2*(T.R-1),st={n5sem:0,furi:0,blocos:{},frases:{}};
for(let s=1;s<=N;s++){
  let m;try{m=T.make(s,"avancado")}catch(e){fail(s+" "+e.message);continue}
  const id="avancado "+s,raw=m.sentences;
  if(m.pt.length!==raw.length)fail(id+" traducoes");
  // 1) forma da escrita
  raw.forEach(x=>{
    if(/[ \u3000]/.test(x))fail(id+" espaco na frase: "+x);
    if(!/。$/.test(x))fail(id+" sem ponto final");
    const comRuby=[...x.matchAll(/\{([^|}]+)\|([^}]+)\}/g)],semRuby=[...x.matchAll(/\[([^|\]]+)\|([^\]]+)\]/g)];
    comRuby.forEach(g=>{(g[1].match(KJ)||[]).forEach(k=>{if(N5.has(k))fail(id+" kanji N5 com furigana: "+k+" em "+x);st.furi++})
      if(!(g[1].match(KJ)||[]).length)fail(id+" furigana sem kanji: "+g[0])});
    semRuby.forEach(g=>{const ks=g[1].match(KJ)||[];if(!ks.length)fail(id+" colchete sem kanji: "+g[0]);ks.forEach(k=>{if(!N5.has(k))fail(id+" kanji fora do N5 sem furigana: "+k+" em "+x);st.n5sem++})});
    const resto=x.replace(/\{[^}]*\}/g,"").replace(/\[[^\]]*\]/g,"");if(KJ.test(resto)){KJ.lastIndex=0;fail(id+" kanji solto: "+x)}KJ.lastIndex=0;
    if(/[A-Za-z0-9]/.test(x))fail(id+" latim/numero: "+x)});
  const pl=raw.map(T.plain);if(pl.some(x=>KJ.test(x)||/[A-Za-z0-9 ]/.test(x)))fail(id+" leitura nao e so kana sem espacos");KJ.lastIndex=0;
  if(m.text!==pl.join(" "))fail(id+" texto");
  // 2) tamanho e bloqueios
  if(raw.length<5||raw.length>6)fail(id+" n de frases "+raw.length);
  const bm={};m.blocks.forEach(b=>{bm[(b[0]+b[2])+","+(b[1]+b[3])]=1});const nb=m.blocks.length;
  if(nb<2||nb>4)fail(id+" n de bloqueios "+nb);st.blocos[nb]=(st.blocos[nb]||0)+1;
  // 3) simulação do texto
  let px=2*m.start.x,py=2*m.start.y,d=m.start.d,ok=true;
  const nodeP=()=>px%2===0&&py%2===0;
  const half=()=>{const nx=px+T.DX[d],ny=py+T.DY[d];if(nx<0||ny<0||nx>W||ny>H){ok=false;return}if(nodeP()&&bm[nx+","+ny]){ok=false;fail(id+" cruza bloqueio");return}px=nx;py=ny};
  const can=()=>{const nx=px+T.DX[d],ny=py+T.DY[d];return nx>=0&&ny>=0&&nx<=W&&ny<=H&&!bm[nx+","+ny]};
  const edge=()=>{half();if(ok)half()};
  const turn=w=>{d=(d+(w==="みぎ"?1:3))%4};
  const lmOf=k=>{const a=m.marks.filter(x=>x.ja===k);if(a.length!==1){fail(id+" lugar nao unico "+k);ok=false;return null}return a[0]};
  const nodes=()=>[px/2,py/2];let stopped=false;
  pl.forEach((t,i)=>{if(!ok)return;let mt,ty;
    for(const k of ["A","B","C","Dd","Z"])if((mt=t.match(RE[k]))){ty=k;break}
    if(!ty){fail(id+" formato: "+t);ok=false;return}
    if((ty==="Z")!==(i===pl.length-1)){fail(id+" Z fora do fim");ok=false;return}
    if(!!mt[1]!==(i>0)){fail(id+" prefixo");ok=false;return}
    st.frases[ty]=(st.frases[ty]||0)+1;
    const dir=ty==="Z"?null:mt[mt.length-1];
    if(dir&&(dir==="みぎ")!==raw[i].includes("[右|みぎ]"))fail(id+" kanji da direcao");
    if(ty==="A"){for(let j=0;j<2*ORD[mt[2]]&&ok;j++)half();turn(dir)}
    else if(ty==="B"){const L=lmOf(mt[2]);if(!L)return;let f=false;
      for(let g=0;g<6&&ok&&!f;g++){const a=nodes();edge();if(ok&&T.borders([L.x,L.y],a,nodes()))f=true}
      if(!f){if(ok)fail(id+" nao passa pelo lugar");ok=false;return}turn(dir)}
    else if(ty==="C"){for(let j=0;j<4&&ok;j++)half();turn(dir)}
    else if(ty==="Dd"){let n=0;while(ok&&can()){edge();n++}if(!n)fail(id+" ja estava no fim da rua");turn(dir)}
    else{const L=lmOf(mt[2]);if(!L)return;let f=false;
      for(let g=0;g<8&&ok&&!f;g++){half();if(!ok)break;if(!nodeP()){const p=[(px-T.DX[d])/2,(py-T.DY[d])/2],n=[(px+T.DX[d])/2,(py+T.DY[d])/2];if(T.borders([L.x,L.y],p,n))f=true}}
      if(!f){if(ok)fail(id+" nao acha o lugar");ok=false;return}stopped=true}});
  if(!ok)continue;
  if(!stopped||px!==m.stop[0]||py!==m.stop[1]){fail(id+" parada difere "+[px,py]+" "+m.stop);continue}
  // 4) os bloqueios importam e o destino é alcançável
  const sk=m.stop[0]+","+m.stop[1],src=[2*m.start.x,2*m.start.y],d0=T.bfs(src,{}),db=T.bfs(src,bm);
  if(db[sk]===undefined)fail(id+" destino inalcancavel");else if(db[sk]<=d0[sk])fail(id+" caminho curto sem bloqueio continua livre");
  // 5) modo A: o gerador de frases com nível confere
  m.solution.forEach((x,i)=>{if(T.say(x,i,"avancado").ja!==raw[i])fail(id+" say avancado etapa "+i)})}
console.log(err?`${err} erros`:`OK: ${N} mapas no Avançado: frases formais sem espaços, furigana só fora do N5 (${st.furi} kanji com furigana, ${st.n5sem} do N5 sem), o texto leva ao ponto certo, 2 a 4 ruas fechadas que importam`);
console.log(JSON.stringify({blocos:st.blocos,frases:st.frases}));process.exit(err?1:0);
