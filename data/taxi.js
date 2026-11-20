// Jogo do táxi (Intermediário): mapas, ruas fechadas e instruções de várias etapas. Funciona no navegador (TAXI) e em node.
(function(){
var C=5,R=4,DX=[0,1,0,-1],DY=[-1,0,1,0]; // 0=N 1=E 2=S 3=W (y cresce para baixo)
var LM=[["びょういん","hospital","hospital","{病院|びょういん}","病院"],["えき","station","estação","{駅|えき}","駅"],["ぎんこう","bank","banco","{銀行|ぎんこう}","銀行"],["こうえん","park","parque","{公園|こうえん}","公園"],["コンビニ","store","loja de conveniência","コンビニ","コンビニ"],["ゆうびんきょく","post","correio","{郵便局|ゆうびんきょく}","郵便局"],["がっこう","school","escola","{学校|がっこう}","学校"],["デパート","mall","loja de departamentos","デパート","デパート"]];
var ORDA=["","[一|ひと]つ[目|め]","[二|ふた]つ[目|め]","[三|みっ]つ[目|め]"];
var LMA={hospital:"{病院|びょういん}",station:"{駅|えき}",bank:"{銀|ぎん}[行|こう]",park:"{公園|こうえん}",store:"コンビニ",post:"{郵便局|ゆうびんきょく}",school:"[学|がっ][校|こう]",mall:"デパート"};
var ORD=["","{一つ目|ひとつめ}","{二つ目|ふたつめ}","{三つ目|みっつめ}"];
// facil: 1 curva, 1 rua fechada; medio: 2 curvas, até 2; dificil: 3 a 4 curvas, até 3. Tipos: A=n-ésima esquina, B=depois de passar por um lugar, C=passar direto pela próxima, D=fim da rua
var LV={facil:{turns:[1,1],types:"A",nb:1},medio:{turns:[2,2],types:"ABCD",nb:2},dificil:{turns:[3,4],types:"ABCD",nb:3},avancado:{turns:[4,5],types:"ABCD",nb:4}};
function plain(t){return t.replace(/\{([^|}]+)\|([^}]+)\}/g,"$2").replace(/\[([^|\]]+)\|([^\]]+)\]/g,"$2")} // {k|r}: kanji com furigana; [k|r]: kanji do N5, mostrado sem furigana (a leitura r vale só para o áudio e para os testes)
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function shuf(a,r){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function inG(x,y){return x>=0&&y>=0&&x<C&&y<R}
function corner(b,q){return q[0]>=b[0]&&q[0]<=b[0]+1&&q[1]>=b[1]&&q[1]<=b[1]+1}
function borders(b,p,n){return corner(b,p)&&corner(b,n)}
function mk(x,y,d){return(2*x+DX[d])+","+(2*y+DY[d])} // meio (coordenada dobrada) do trecho que sai do cruzamento (x,y) no rumo d
function bfs(src,bm){var W=2*C-1,H=2*R-1,dist={},q=[src];dist[src[0]+","+src[1]]=0;
  for(var i=0;i<q.length;i++){var p=q[i],dd=dist[p[0]+","+p[1]];for(var d=0;d<4;d++){var x=p[0]+DX[d],y=p[1]+DY[d];if(x<0||y<0||x>=W||y>=H||(x%2&&y%2))continue;var k=x+","+y;if(dist[k]!==undefined||bm[k])continue;dist[k]=dd+1;q.push([x,y])}}return dist}
function isMid(k){var a=k.split(",");return(a[0]%2)+(a[1]%2)===1}
function plan(r,marks,lv){
  var cfg=LV[lv],k=cfg.turns[0]+Math.floor(r()*(cfg.turns[1]-cfg.turns[0]+1));
  var cur=[Math.floor(r()*C),Math.floor(r()*R)],d=Math.floor(r()*4),start={x:cur[0],y:cur[1],d:d};
  var pts=[[2*cur[0],2*cur[1]]],steps=[],forced={},used={},usedLm={};
  function ahead(){var l=[],x=cur[0],y=cur[1],end="map";
    for(;;){var nx=x+DX[d],ny=y+DY[d];if(!inG(nx,ny))break;var m=mk(x,y,d);if(forced[m]){end="forced";break}if(used[m]){end="used";break}l.push([nx,ny]);x=nx;y=ny}
    return{l:l,end:end}}
  function free(x,y,d2){return inG(x+DX[d2],y+DY[d2])&&!forced[mk(x,y,d2)]&&!used[mk(x,y,d2)]}
  for(var s=0;s<k;s++){
    var a=ahead(),l=a.l,types=shuf(cfg.types.split(""),r),done=false;
    for(var ti=0;ti<types.length&&!done;ti++){
      var ty=types[ti],n=0,lm=null,f=null,i,j;
      if(ty==="A"&&l.length)n=1+Math.floor(r()*Math.min(3,l.length));
      else if(ty==="B"){var c=[];for(i=0;i<l.length;i++){var p=i?l[i-1]:cur;for(j=0;j<marks.length;j++)if(!usedLm[marks[j].id]&&borders([marks[j].x,marks[j].y],p,l[i]))c.push([i+1,marks[j]])}
        if(c.length){var q=c[Math.floor(r()*c.length)];n=q[0];lm=q[1]}}
      else if(ty==="C"&&l.length>=2)n=2;
      else if(ty==="D"&&l.length){var cd=[];for(j=1;j<=l.length;j++)if(j<l.length||a.end!=="used")cd.push(j);
        if(cd.length){n=cd[Math.floor(r()*cd.length)];if(n<l.length)f=mk(l[n-1][0],l[n-1][1],d)}}
      if(!n)continue;
      var node=l[n-1],t=r()<.5?1:3,d2=(d+t)%4;
      if(!free(node[0],node[1],d2)||(f&&mk(node[0],node[1],d2)===f)){t=4-t;d2=(d+t)%4;if(!free(node[0],node[1],d2))continue}
      for(i=0;i<n;i++){var pp=i?l[i-1]:cur;used[mk(pp[0],pp[1],d)]=1}
      if(f)forced[f]=1;if(lm)usedLm[lm.id]=1;
      steps.push({ty:ty,n:n,t:t,lm:lm});cur=node;d=d2;pts.push([2*cur[0],2*cur[1]]);done=true}
    if(!done)return null}
  var a2=ahead(),l2=a2.l,cs=[];
  for(var i2=0;i2<l2.length;i2++){var p2=i2?l2[i2-1]:cur,h=marks.filter(function(m){return borders([m.x,m.y],p2,l2[i2])});
    if(h.length!==1||usedLm[h[0].id])continue;var first=true;
    for(var j2=0;j2<i2;j2++)if(borders([h[0].x,h[0].y],j2?l2[j2-1]:cur,l2[j2]))first=false;
    if(first)cs.push([i2,h[0]])}
  if(!cs.length)return null;
  var pk=cs[Math.floor(r()*cs.length)],ix=pk[0],pa=ix?l2[ix-1]:cur,na=l2[ix];
  for(var u=0;u<=ix;u++){var pu=u?l2[u-1]:cur;used[mk(pu[0],pu[1],d)]=1}
  var stop=[pa[0]+na[0],pa[1]+na[1]];pts.push(stop);
  return{start:start,steps:steps,pts:pts,forced:forced,used:used,target:pk[1],stop:stop}}
function dirJ(t){return t===1?"{右|みぎ}":"{左|ひだり}"}
function dirP(t){return t===1?"direita":"esquerda"}
function make(seed,lv){
  lv=LV[lv]?lv:"facil";var cap=LV[lv].nb;
  for(var tries=0;tries<800;tries++){
    var r=rng(seed+tries*7919),bl=[];
    for(var by=0;by<R-1;by++)for(var bx=0;bx<C-1;bx++)bl.push([bx,by]);
    bl=shuf(bl,r);var ls=shuf(LM,r),marks=[];
    for(var i=0;i<6;i++)marks.push({x:bl[i][0],y:bl[i][1],ja:ls[i][0],id:ls[i][1],pt:ls[i][2],jr:ls[i][3],kj:ls[i][4]});
    var P=plan(r,marks,lv);if(!P)continue;
    var bm={},kk,src=P.pts[0],sk=P.stop[0]+","+P.stop[1];for(kk in P.forced)bm[kk]=1;
    var d0=bfs(src,{}),D0=d0[sk],ds=bfs(P.stop,{}),ok=true;
    function cands(da,db,blk){var c=[];for(var k in da)if(isMid(k)&&db[k]!==undefined&&da[k]+db[k]===D0&&!P.used[k]&&!blk[k])c.push(k);return c}
    if(lv==="facil"){var c1=cands(d0,ds,bm);if(!c1.length)continue;bm[c1[Math.floor(r()*c1.length)]]=1}
    else{for(var g=0;g<8;g++){var dd=bfs(src,bm);if(dd[sk]>D0)break;
        var c2=cands(dd,bfs(P.stop,bm),bm);if(!c2.length){ok=false;break}bm[c2[Math.floor(r()*c2.length)]]=1;if(Object.keys(bm).length>cap){ok=false;break}}
      if(!ok||bfs(src,bm)[sk]<=D0)continue}
    var keys=Object.keys(bm);if(keys.length<1||keys.length>cap)continue;if(lv==="avancado"&&keys.length<2)continue;
    var blocks=keys.map(function(k){var a=k.split(",").map(Number);return a[0]%2?[(a[0]-1)/2,a[1]/2,(a[0]+1)/2,a[1]/2]:[a[0]/2,(a[1]-1)/2,a[0]/2,(a[1]+1)/2]});
    var ja=[],pt=[],S=P.steps;
    S.forEach(function(st,ix){var pre=ix?"それから、":"",ppt=ix?"Depois, ":"",dj=dirJ(st.t),dp=dirP(st.t);
      if(st.ty==="A"){ja.push(pre+"まっすぐ {行|い}って、"+ORD[st.n]+"の {角|かど}を "+dj+"に {曲|ま}がってください。");pt.push(ppt+"siga em frente e, na "+st.n+"ª esquina (contando a partir de onde o táxi está), vire à "+dp+".")}
      else if(st.ty==="B"){ja.push(pre+"まっすぐ {行|い}って、"+st.lm.jr+"を {過|す}ぎたら、"+dj+"に {曲|ま}がってください。");pt.push(ppt+"siga em frente, passe por "+st.lm.pt+" e vire à "+dp+" na primeira esquina depois dele.")}
      else if(st.ty==="C"){ja.push(pre+"{次|つぎ}の {交差点|こうさてん}は まっすぐ {行|い}って、その {次|つぎ}を "+dj+"に {曲|ま}がってください。");pt.push(ppt+"passe direto pela próxima esquina e vire à "+dp+" na seguinte.")}
      else{ja.push(pre+"{突|つ}き{当|あ}たりまで まっすぐ {行|い}って、"+dj+"に {曲|ま}がってください。");pt.push(ppt+"siga em frente até onde a rua acaba (borda do mapa ou rua fechada) e vire à "+dp+".")}});
    var pf=S.length?"それから、":"";
    ja.push(pf+"まっすぐ {行|い}って、"+P.target.jr+"の {前|まえ}で {止|と}めてください。");
    pt.push("Depois, siga em frente até parar no meio da quadra, diante de: "+P.target.pt+".");
    if(lv==="avancado")ja=S.map(function(st,ix){return sayAv(st,ix)}).concat([sayAv({ty:"Z",lm:P.target},S.length)]);
    pt[0]=pt[0].charAt(0).toUpperCase()+pt[0].slice(1);
    return{seed:seed+tries*7919,level:lv,C:C,R:R,marks:marks,start:P.start,sentences:ja,text:plain(ja.join(" ")),pt:pt,target:P.target,route:P.pts,stop:P.stop,blocks:blocks,solution:S.concat([{ty:"Z",n:0,t:0,lm:P.target}])}}
  throw new Error("sem mapa para a semente "+seed+" ("+lv+")")}

// Uma etapa {ty:"A"|"B"|"C"|"D"|"Z",n,t(1 direita,3 esquerda,0 ainda sem direção),lm} em japonês (com furigana) e português; ix = posição da etapa (0 = primeira).
// Avançado: pedido formal (〜ていただけますか), sem espaços entre as palavras, furigana só nos kanji fora do N5.
function sayAv(st,ix){var pre=ix?"その[後|あと]、":"",dj=st.t?(st.t===1?"[右|みぎ]":"[左|ひだり]"):"□",go="まっすぐ{進|すす}んで、",req="に{曲|ま}がっていただけますか。";
  if(st.ty==="A")return pre+go+ORDA[st.n]+"の{角|かど}を"+dj+req;
  if(st.ty==="B")return pre+go+LMA[st.lm.id]+"を{通|とお}り{過|す}ぎてから、{最初|さいしょ}の{角|かど}を"+dj+req;
  if(st.ty==="C")return pre+"{次|つぎ}の{交差点|こうさてん}は{通|とお}り{過|す}ぎて、その{次|つぎ}の{交差点|こうさてん}を"+dj+req;
  if(st.ty==="D")return pre+"{突|つ}き{当|あ}たりまで{進|すす}んで、"+dj+req;
  return pre+go+LMA[st.lm.id]+"の[前|まえ]で{止|と}めていただけますか。"}
function say(st,ix,lv){var pre=ix?"それから、":"",ppt=ix?"Depois, ":"",dj=st.t?dirJ(st.t):"□",dp=st.t?dirP(st.t):"…",ja,pt;
  if(st.ty==="A"){ja=pre+"まっすぐ {行|い}って、"+ORD[st.n]+"の {角|かど}を "+dj+"に {曲|ま}がってください。";pt=ppt+"siga em frente e, na "+st.n+"ª esquina (contando a partir de onde o táxi está), vire à "+dp+"."}
  else if(st.ty==="B"){ja=pre+"まっすぐ {行|い}って、"+st.lm.jr+"を {過|す}ぎたら、"+dj+"に {曲|ま}がってください。";pt=ppt+"siga em frente, passe por "+st.lm.pt+" e vire à "+dp+" na primeira esquina depois dele."}
  else if(st.ty==="C"){ja=pre+"{次|つぎ}の {交差点|こうさてん}は まっすぐ {行|い}って、その {次|つぎ}を "+dj+"に {曲|ま}がってください。";pt=ppt+"passe direto pela próxima esquina e vire à "+dp+" na seguinte."}
  else if(st.ty==="D"){ja=pre+"{突|つ}き{当|あ}たりまで まっすぐ {行|い}って、"+dj+"に {曲|ま}がってください。";pt=ppt+"siga em frente até onde a rua acaba (borda do mapa ou rua fechada) e vire à "+dp+"."}
  else{ja=pre+"まっすぐ {行|い}って、"+st.lm.jr+"の {前|まえ}で {止|と}めてください。";pt="Depois, siga em frente até parar no meio da quadra, diante de: "+st.lm.pt+"."}
  if(!ix)pt=pt.charAt(0).toUpperCase()+pt.slice(1);if(lv==="avancado")ja=sayAv(st,ix);return{ja:ja,pt:pt}}
// Executa as etapas no mapa m. Devolve {status,at,path:[[px,py,rumo],...],end}. status: ok | wrong (parou diante de outro lugar) | unfinished | edge | closed | noplace | noend.
function run(m,steps){var bm={},W=2*(C-1),H=2*(R-1);m.blocks.forEach(function(b){bm[(b[0]+b[2])+","+(b[1]+b[3])]=1});
  var px=2*m.start.x,py=2*m.start.y,d=m.start.d,path=[[px,py,d]],res={status:"ok",at:-1,stopped:false},last=null,i,j,g;
  function node(){return px%2===0&&py%2===0}
  function half(){var nx=px+DX[d],ny=py+DY[d];if(nx<0||ny<0||nx>W||ny>H)return"edge";if(node()&&bm[nx+","+ny])return"closed";px=nx;py=ny;path.push([px,py,d]);return null}
  function can(){var nx=px+DX[d],ny=py+DY[d];return nx>=0&&ny>=0&&nx<=W&&ny<=H&&!bm[nx+","+ny]}
  function edge(){return half()||half()}
  function turn(t){d=(d+t)%4;path.push([px,py,d])}
  for(i=0;i<steps.length;i++){var st=steps[i],ty=st.ty,e=null,lm=st.lm;last=st;
    if(ty==="A"){for(j=0;j<2*st.n&&!e;j++)e=half();if(!e)turn(st.t)}
    else if(ty==="C"){for(j=0;j<4&&!e;j++)e=half();if(!e)turn(st.t)}
    else if(ty==="B"){var f=false;for(g=0;g<C+R&&!e&&!f;g++){var a=[px/2,py/2];e=edge();if(!e&&borders([lm.x,lm.y],a,[px/2,py/2]))f=true}if(!e&&!f)e="noplace";if(!e)turn(st.t)}
    else if(ty==="D"){var n=0;while(!e&&can()){e=edge();if(!e)n++}if(!e&&!n)e="noend";if(!e)turn(st.t)}
    else{var f2=false;for(g=0;g<2*(C+R)&&!e&&!f2;g++){e=half();if(!e&&!node()){var p=[(px-DX[d])/2,(py-DY[d])/2],q=[(px+DX[d])/2,(py+DY[d])/2];if(borders([lm.x,lm.y],p,q))f2=true}}
      if(!e&&!f2)e="noplace";if(!e){res.stopped=true;break}}
    if(e){res.status=e;res.at=i;break}}
  if(res.status==="ok")res.status=!res.stopped?"unfinished":(last.lm.id===m.target.id?"ok":"wrong");
  res.path=path;res.end=[px,py];return res}
var T={sayAv:sayAv,say:say,run:run,C:C,R:R,DX:DX,DY:DY,make:make,plain:plain,borders:borders,inG:inG,LM:LM,ORD:ORD,LV:LV,bfs:bfs,isMid:isMid};
if(typeof module!=="undefined")module.exports=T;else window.TAXI=T;
})();
