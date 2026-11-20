import json, subprocess, time, sys
from playwright.sync_api import sync_playwright
PORT=8765
srv=subprocess.Popen(["python3","-m","http.server",str(PORT)],cwd="/home/claude",stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
time.sleep(1)
BASE=f"http://localhost:{PORT}/ayumi/"
INIT="""
(function(){
  window.SpeechSynthesisUtterance=class{constructor(t){this.text=t;this.rate=1;this.pitch=1;this.lang='';this.voice=null}};
  window.__calls=[]; window.__cancels=0; window.__voices=%s; window.__l={};
  const fake={
    getVoices(){return window.__voices},
    speak(u){window.__calls.push({text:u.text,rate:u.rate,pitch:u.pitch,voice:u.voice&&u.voice.name,lang:u.lang}); setTimeout(()=>u.onend&&u.onend({}),5)},
    cancel(){window.__cancels++},
    addEventListener(t,f){(window.__l[t]=window.__l[t]||[]).push(f)},
    removeEventListener(){}
  };
  Object.defineProperty(window,'speechSynthesis',{value:fake,configurable:true});
  window.__fire=()=>(window.__l.voiceschanged||[]).forEach(f=>f({}));
})();
"""
V=lambda *a:json.dumps([{"name":n,"lang":l,"localService":loc} for n,l,loc in a])
ok=True
def check(name,cond,info=""):
    global ok
    print(("OK  " if cond else "FAIL"),name,info)
    if not cond: ok=False
with sync_playwright() as p:
    b=p.chromium.launch()
    def page(voices,errs=None):
        ctx=b.new_context(); pg=ctx.new_page()
        pg.add_init_script(INIT%voices)
        if errs is not None:
            pg.on("pageerror",lambda e:errs.append(str(e)))
            pg.on("console",lambda m:errs.append(m.text) if m.type=="error" else None)
        return pg
    # ---- motor
    pg=page(V(("Google 日本語","ja-JP",False),("Kyoko","ja-JP",True),("Alex","en-US",True)))
    pg.goto(BASE+"grammar.html"); pg.wait_for_timeout(300)
    check("supported",pg.evaluate("AyumiTTS.supported()"))
    check("local primeiro",pg.evaluate("AyumiTTS.pick().name")=="Kyoko",pg.evaluate("AyumiTTS.voices().map(v=>v.name)"))
    pg.evaluate("window.__calls.length=0;AyumiTTS.speak('こんにちは')"); pg.wait_for_timeout(200)
    c=pg.evaluate("window.__calls"); check("speak usa voz local, ja-JP, 0.9",len(c)==1 and c[0]["voice"]=="Kyoko" and c[0]["rate"]==0.9 and c[0]["lang"]=="ja-JP",c)
    pg.evaluate("window.__calls.length=0;AyumiTTS.speak('a',{rate:.85});AyumiTTS.speak('b',{rate:.85})"); pg.wait_for_timeout(250)
    c=pg.evaluate("window.__calls"); check("a segunda fala cancela a primeira",[x["text"] for x in c]==["b"] and c[0]["rate"]==.85,c)
    pg.evaluate("window.__calls.length=0;AyumiTTS.speak('x');AyumiTTS.cancel()"); pg.wait_for_timeout(250)
    check("cancel antes de tocar",pg.evaluate("window.__calls.length")==0)
    # speakList
    pg.evaluate("window.__calls.length=0;window.__done=0;window.__items=[];AyumiTTS.speakList([{text:'1'},{text:'2'},{text:'3'}],{onItem:(it,i)=>window.__items.push(i),onDone:()=>window.__done=1,voiceFor:it=>({voice:null,pitch:it.text=='2'?1.3:1})})"); pg.wait_for_timeout(600)
    c=pg.evaluate("window.__calls"); check("speakList em ordem + onDone",[x["text"] for x in c]==["1","2","3"] and pg.evaluate("window.__done")==1 and c[1]["pitch"]==1.3,c)
    # ---- lista vazia que enche depois
    pg=page("[]"); pg.goto(BASE+"grammar.html"); pg.wait_for_timeout(300)
    pg.evaluate("AyumiTTS.speak('espera')"); pg.wait_for_timeout(300)
    check("lista vazia: espera antes de falar",pg.evaluate("window.__calls.length")==0)
    pg.evaluate("window.__voices=[{name:'Kyoko',lang:'ja-JP',localService:true}];window.__fire()"); pg.wait_for_timeout(300)
    c=pg.evaluate("window.__calls"); check("lista enche: fala com a voz",len(c)==1 and c[0]["voice"]=="Kyoko",c)
    pg=page("[]"); pg.goto(BASE+"grammar.html"); pg.wait_for_timeout(300)
    pg.evaluate("AyumiTTS.speak('x')"); pg.wait_for_timeout(1900)
    check("lista segue vazia: fala após o limite",pg.evaluate("window.__calls.length")==1)
    # ---- só voz não japonesa
    pg=page(V(("Alex","en-US",True))); pg.goto(BASE+"grammar.html"); pg.wait_for_timeout(300)
    pg.evaluate("window.__nv=0;AyumiTTS.speak('x',{onnovoice:()=>window.__nv++})"); pg.wait_for_timeout(250)
    check("só voz en: onnovoice e speak sem voz",pg.evaluate("window.__nv")==1 and pg.evaluate("window.__calls[0].voice")is None)
    pg.wait_for_timeout(1200); check("aviso de sem voz japonesa aparece",pg.locator("[role=status]").count()>=1)
    # ---- sem speechSynthesis
    ctx=b.new_context(); pg=ctx.new_page(); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.add_init_script("Object.defineProperty(window,'speechSynthesis',{value:undefined,configurable:true});")
    for h in ["grammar","vocabulario","taxi","leitura","kanji","contadores"]:
        pg.goto(BASE+h+".html"); pg.wait_for_timeout(300)
    check("sem síntese: páginas abrem sem erro",not errs,errs)
    # ---- páginas
    VO=V(("Kyoko","ja-JP",True))
    def run(h,steps,sel,minc=1,pre=None):
        errs=[]; pg=page(VO,errs); pg.goto(BASE+h+".html"); pg.wait_for_timeout(400)
        try:
            for s in steps: s(pg)
            pg.evaluate("s=>document.querySelector(s).click()",sel); pg.wait_for_timeout(400)
        except Exception as e: errs.append("teste: "+str(e)[:120])
        n=pg.evaluate("window.__calls.length")
        check(f"{h}: 🔊 fala",n>=minc and not errs,(n,errs[:2]))
        return pg
    click=lambda s:(lambda pg:pg.locator(s).first.click())
    run("vocabulario",[click("#m-play"),click(".cat")],"#speak")
    run("conjugacao",[click("#start"),lambda pg:pg.fill("#ans","x"),click("#check")],"#speak")
    run("conjugacao-adjetivos",[click("#start"),lambda pg:pg.fill("#ans","x"),click("#check")],"#speak")
    run("contadores",[click("#start"),click(".opt")],"#speak")
    run("ditado",[click("#go")],"#play")
    run("lacuna",[click("#go"),click(".opt")],"#hear")
    run("taxi",[],"#listen")
    pg=run("grammar",[lambda pg:pg.evaluate("document.querySelectorAll('details').forEach(d=>d.open=true)")],"[data-say]")
    # taxi-a: monta solução e ouve
    errs=[]; pg=page(VO,errs); pg.goto(BASE+"taxi-a.html"); pg.wait_for_timeout(400)
    pg.locator("#solbtn, #peek, button:has-text('Ver uma solução')").first.click(); pg.wait_for_timeout(300)
    pg.locator("#listen").click(); pg.wait_for_timeout(400)
    check("taxi-a: 🔊 fala",pg.evaluate("window.__calls.length")>=1 and pg.evaluate("window.__calls[0].rate")==.85 and not errs,errs[:2])
    # leitura
    errs=[]; pg=page(V(("Kyoko","ja-JP",True),("Otoya","ja-JP",True)),errs); pg.goto(BASE+"leitura.html#r02"); pg.wait_for_timeout(500)
    pg.locator("#playall").click(); pg.wait_for_timeout(1500)
    c=pg.evaluate("window.__calls"); vs={x["voice"] for x in c}
    check("leitura: Ouvir tudo em sequência, 2 vozes no diálogo",len(c)>=10 and len(vs)==2 and not errs,(len(c),vs,errs[:2]))
    pg.evaluate("window.__calls.length=0"); pg.locator("#playall").click(); pg.wait_for_timeout(60); pg.locator("#playall").click(); pg.wait_for_timeout(300)
    n=pg.evaluate("window.__calls.length"); pg.wait_for_timeout(300)
    check("leitura: Parar interrompe a fila",pg.evaluate("window.__calls.length")==n and n<4,n)
    # kanji
    errs=[]; pg=page(VO,errs); pg.goto(BASE+"kanji.html"); pg.wait_for_timeout(500)
    check("kanji: abre sem erro",not errs,errs[:2])
    b.close()
srv.terminate()
print("RESULTADO:", "tudo OK" if ok else "HÁ FALHAS")
