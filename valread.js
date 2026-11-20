const R=require('./data/reading.js');
const G=new Function(require('fs').readFileSync('data/grammar.js','utf8')+';return GRAMMAR')();
const topics=new Set();G.forEach(g=>g.topics.forEach(t=>topics.add(t.id)));
const WL=new Set([...'日一国人年大十二本中長出三時行見月分後前生五間上東四今金九入学高円子外八六下来気小七山話女北午百書先名川千水半男西電校語土木聞食車何南万毎白天母火右読友左休父雨']);
const KANJI=/[\u4e00-\u9fff々]/;
let err=0;const bad=(id,m)=>{err++;console.log('ERRO',id,m)};
const ids=new Set();
function strip(s){return s.replace(/\{([^|}]+)\|([^}]+)\}/g,'')}
function checkJa(id,d,s,where,pure){
  if(typeof s!=='string'){bad(id,where+' nao string');return}
  const opens=(s.match(/\{/g)||[]).length,closes=(s.match(/\}/g)||[]).length;
  if(opens!==closes)bad(id,where+' chaves desbalanceadas: '+s);
  if((s.match(/\*\*/g)||[]).length%2)bad(id,where+' ** impar');
  for(const m of s.matchAll(/\{([^|}]*)\|([^}]*)\}/g)){
    if(!/^[\u4e00-\u9fff々]+$/.test(m[1]))bad(id,where+' base do ruby deve ser so kanji: '+m[0]);
    if(!/^[ぁ-んー]+$/.test(m[2]))bad(id,where+' leitura deve ser hiragana: '+m[0]);
  }
  const rest=strip(s);
  for(const ch of rest){ if(KANJI.test(ch)){
    if(d===1)bad(id,where+' kanji em texto nivel 1: '+ch+' em '+s);
    else if(d===2)bad(id,where+' kanji sem furigana (nivel 2): '+ch+' em '+s);
    else if(!WL.has(ch))bad(id,where+' kanji fora da lista sem furigana (nivel 3): '+ch+' em '+s);
  }}
  if(pure && /[A-Za-z]{2,}/.test(rest.replace(/\*\*/g,'')))bad(id,where+' possivel romaji: '+s);
  if(d<=2 && /[。、」！？]\S/.test(rest.replace(/[」。]$/,'')) ){}
}
R.forEach(t=>{
  const id=t.id;
  if(ids.has(id))bad(id,'id duplicado');ids.add(id);
  if(!['historia','dialogo'].includes(t.kind))bad(id,'kind');
  if(![1,2,3].includes(t.difficulty))bad(id,'difficulty');
  const d=t.difficulty;
  checkJa(id,d,t.title,'title',true);
  if(!t.titlePt)bad(id,'titlePt');
  if(!Array.isArray(t.body)||!t.body.length)bad(id,'body');
  if(!Array.isArray(t.tr)||t.tr.length!==t.body.length)bad(id,'tr tamanho diferente de body: '+(t.tr&&t.tr.length)+' vs '+t.body.length);
  else t.body.forEach((b,i)=>{
    const n=R.splitSentences(t.kind==='dialogo'?b[1]:b).length, tr=t.tr[i];
    if(!Array.isArray(tr)||tr.length!==n)bad(id,'item '+i+': '+n+' frase(s) no japones, traducao tem '+(Array.isArray(tr)?tr.length:'formato invalido'));
    else tr.forEach((x,j)=>{if(typeof x!=='string'||!x.trim())bad(id,'traducao vazia em '+i+'.'+j)});
  });
  if(t.kind==='dialogo'){
    if(!t.speakers||t.speakers.length<2)bad(id,'speakers');
    else t.speakers.forEach((s,i)=>{checkJa(id,d,s.name,'speaker'+i,true);if(!s.pt)bad(id,'speaker pt')});
    t.body.forEach((b,i)=>{ if(!Array.isArray(b)||b.length!==2||!(b[0] in (t.speakers||[])))bad(id,'fala '+i+' invalida'); else checkJa(id,d,b[1],'fala'+i,true)});
  }else{
    t.body.forEach((p,i)=>checkJa(id,d,p,'par'+i,true));
    if(t.speakers)bad(id,'historia nao deve ter speakers');
  }
  if(!t.q||t.q.length<5||t.q.length>6)bad(id,'perguntas: '+(t.q&&t.q.length));
  const kinds=new Set();const pos=[0,0,0,0];
  (t.q||[]).forEach((q,i)=>{
    kinds.add(q.k);
    checkJa(id,d,q.q,'q'+i);
    if(!Array.isArray(q.opts)||q.opts.length!==4)bad(id,'q'+i+' opts != 4');
    else{ if(new Set(q.opts).size!==4)bad(id,'q'+i+' opts repetidas'); q.opts.forEach((o,j)=>checkJa(id,d,o,'q'+i+'o'+j)); }
    if(!Number.isInteger(q.ans)||q.ans<0||q.ans>3)bad(id,'q'+i+' ans'); else pos[q.ans]++;
    if(!q.why)bad(id,'q'+i+' why'); else checkJa(id,d,q.why,'q'+i+'why');
  });
  ['compreensao','detalhe','vocabulario','inferencia'].forEach(k=>{if(!kinds.has(k))bad(id,'falta tipo de pergunta '+k)});
  (t.words||[]).forEach((w,i)=>{if(!Array.isArray(w)||w.length!==3||w.some(x=>typeof x!=='string'||!x))bad(id,'word '+i)});
  if(!t.words||t.words.length<5)bad(id,'poucas palavras');
  (t.topics||[]).forEach(x=>{if(!topics.has(x))bad(id,'topico inexistente '+x)});
  console.log(id,t.kind,'d'+d,'itens',t.body.length,'perguntas',t.q.length,'ans',pos.join(','));
});
console.log(err?('FALHOU: '+err+' erro(s)'):'OK: estrutura e furigana validos');
process.exit(err?1:0);
