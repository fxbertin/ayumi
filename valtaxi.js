// Validador do jogo do táxi: lê o TEXTO (leitura em kana) de todas as etapas, simula em meias quadras e confere as ruas fechadas.
// Uso: node valtaxi.js [N por nível]   (padrão 1000)
const T=require("./data/taxi.js");const N=+process.argv[2]||1000;
const KJ=/[\u3400-\u9fff]/,ORD={ひとつめ:1,ふたつめ:2,みっつめ:3},CAP={facil:1,medio:2,dificil:3};
let err=0;const fail=m=>{if(err++<12)console.log("ERRO",m)};
const P="^(それから、)?",D="(みぎ|ひだり)に まがってください。$";
const RE={A:new RegExp(P+"まっすぐ いって、(ひとつめ|ふたつめ|みっつめ)の かどを "+D),B:new RegExp(P+"まっすぐ いって、(.+)を すぎたら、"+D),
  C:new RegExp(P+"つぎの こうさてんは まっすぐ いって、その つぎを "+D),Dd:new RegExp(P+"つきあたりまで まっすぐ いって、"+D),Z:new RegExp(P+"まっすぐ いって、(.+)の まえで とめてください。$")};
const W=2*(T.C-1),H=2*(T.R-1),st={};
for(const lv of Object.keys(CAP))for(let s=1;s<=N;s++){
  let m;try{m=T.make(s,lv)}catch(e){fail(lv+s+" "+e.message);continue}
  const id=lv+" "+s,raw=m.sentences;
  if(m.pt.length!==raw.length)fail(id+" traducoes");
  if(raw.some(x=>KJ.test(x.replace(/\{[^|}]+\|[^}]+\}/g,""))))fail(id+" kanji sem furigana");
  const pl=raw.map(T.plain);if(pl.some(x=>KJ.test(x)||/[A-Za-z0-9]/.test(x)))fail(id+" leitura nao e so kana");
  if(m.text!==pl.join(" "))fail(id+" texto");
  const exp={facil:[2,2],medio:[3,3],dificil:[4,5]}[lv];if(raw.length<exp[0]||raw.length>exp[1])fail(id+" n de frases "+raw.length);
  const bm={};m.blocks.forEach(b=>{bm[(b[0]+b[2])+","+(b[1]+b[3])]=1});
  const nb=m.blocks.length;if(nb<1||nb>CAP[lv])fail(id+" n de bloqueios "+nb);
  let px=2*m.start.x,py=2*m.start.y,d=m.start.d,ok=true;
  const nodeP=()=>px%2===0&&py%2===0;
  const half=()=>{const nx=px+T.DX[d],ny=py+T.DY[d];if(nx<0||ny<0||nx>W||ny>H){ok=false;return}if(nodeP()&&bm[nx+","+ny]){ok=false;fail(id+" cruza bloqueio");return}px=nx;py=ny};
  const can=()=>{const nx=px+T.DX[d],ny=py+T.DY[d];return nx>=0&&ny>=0&&nx<=W&&ny<=H&&!bm[nx+","+ny]};
  const edge=()=>{half();if(ok)half()};
  const turn=w=>{d=(d+(w==="みぎ"?1:3))%4};
  const lmOf=k=>{const a=m.marks.filter(x=>x.ja===k);if(a.length!==1){fail(id+" lugar nao unico "+k);ok=false;return null}return a[0]};
  const nodes=()=>[px/2,py/2];
  let stopped=false;
  pl.forEach((t,i)=>{if(!ok)return;let mt,ty;
    for(const k of ["A","B","C","Dd","Z"])if((mt=t.match(RE[k]))){ty=k;break}
    if(!ty){fail(id+" formato: "+t);ok=false;return}
    if((ty==="Z")!==(i===pl.length-1)){fail(id+" Z fora do fim");ok=false;return}
    if(!!mt[1]!==(i>0)){fail(id+" prefixo");ok=false;return}
    st[lv+ty]=(st[lv+ty]||0)+1;
    const dir=ty==="Z"?null:mt[mt.length-1];
    if(dir&&(dir==="みぎ")!==raw[i].includes("{右|みぎ}"))fail(id+" kanji da direcao");
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
  // as ruas fechadas importam
  const sk=m.stop[0]+","+m.stop[1],src=[2*m.start.x,2*m.start.y],d0=T.bfs(src,{}),ds=T.bfs(m.stop,{}),db=T.bfs(src,bm),D0=d0[sk];
  if(db[sk]===undefined)fail(id+" destino inalcancavel");
  else if(lv==="facil"){if(!Object.keys(bm).some(k=>ds[k]!==undefined&&d0[k]+ds[k]===D0))fail(id+" bloqueio nao corta caminho curto")}
  else if(db[sk]<=D0)fail(id+" caminho curto sem bloqueio continua livre");
  st[lv+"_blocos"]=(st[lv+"_blocos"]||0)+nb}

// MODO A: say() e run() (usados em taxi-a.html) conferidos contra o gerador e contra a simulação independente acima, mais testes aleatórios de invariantes.
{let nA=0,nF=0;const rnd=(()=>{let a=12345;return()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}})();
  const pick=a=>a[Math.floor(rnd()*a.length)];
  for(const lv of Object.keys(CAP))for(let s=1;s<=N;s++){const m=T.make(s,lv),id="A "+lv+" "+s;nA++;
    if(!m.solution||m.solution.length!==m.sentences.length){fail(id+" solution");continue}
    m.solution.forEach((st,i)=>{const r=T.say(st,i);if(r.ja!==m.sentences[i]||r.pt!==m.pt[i])fail(id+" say difere na etapa "+i)});
    const r=T.run(m,m.solution);if(r.status!=="ok"||r.end[0]!==m.stop[0]||r.end[1]!==m.stop[1])fail(id+" run da solucao: "+r.status+" "+r.end);
    if(T.run(m,m.solution.slice(0,-1)).status!=="unfinished")fail(id+" sem a parada deveria ficar unfinished");
    const bm={};m.blocks.forEach(b=>{bm[(b[0]+b[2])+","+(b[1]+b[3])]=1});
    for(let f=0;f<20;f++){nF++;const k=1+Math.floor(rnd()*5),steps=[];
      for(let i=0;i<k;i++){const ty=pick(["A","B","C","D","Z"]);steps.push({ty,n:1+Math.floor(rnd()*3),t:pick([1,3]),lm:pick(m.marks)});if(ty==="Z")break}
      const q=T.run(m,steps);let prev=q.path[0];
      if(prev[0]!==2*m.start.x||prev[1]!==2*m.start.y)fail(id+" caminho nao comeca no inicio");
      for(const p of q.path.slice(1)){const dd=Math.abs(p[0]-prev[0])+Math.abs(p[1]-prev[1]);
        if(dd>1)fail(id+" pulo no caminho");
        if(dd===1){if(p[0]<0||p[1]<0||p[0]>W||p[1]>H)fail(id+" saiu do mapa");
          const a=prev[0]%2===0&&prev[1]%2===0?prev:null;if(a&&bm[p[0]+","+p[1]])fail(id+" entrou em rua fechada")}
        else if(p[2]===prev[2])fail(id+" ponto repetido sem virar");
        prev=p}
      if(!["ok","wrong","unfinished","edge","closed","noplace","noend"].includes(q.status))fail(id+" status "+q.status)}}
  console.log("Modo A: "+nA+" mapas (say e run conferem com o gerador) e "+nF+" sequencias aleatorias sem violar invariantes");}
console.log(err?`${err} erros`:`OK: ${N} mapas por nivel (${3*N} no total): o texto leva ao ponto certo, nunca cruza bloqueio, os bloqueios importam, kanji sempre com furigana`);
console.log(JSON.stringify(st));process.exit(err?1:0);
