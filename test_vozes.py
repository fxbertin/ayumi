import subprocess,time,sys
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding='utf-8')
PORT=8771
srv=subprocess.Popen(["python3","-m","http.server",str(PORT)],cwd="/home/claude",stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
time.sleep(1.2)
BASE=f"http://localhost:{PORT}/ayumi/"
INIT="""(function(){
 window.SpeechSynthesisUtterance=class{constructor(t){this.text=t;this.rate=1;this.pitch=1;this.lang='';this.voice=null}};
 window.__calls=[];window.__voices=%s;
 const fake={getVoices(){return window.__voices},speak(u){window.__calls.push(u.text);setTimeout(()=>u.onend&&u.onend({}),5)},cancel(){},addEventListener(){},removeEventListener(){}};
 Object.defineProperty(window,'speechSynthesis',{value:fake,configurable:true});
})();"""
NOJA='[{name:"Alex",lang:"en-US",localService:true}]'
JA='[{name:"Kyoko",lang:"ja-JP",localService:true}]'
bad=0
def check(n,c,i=""):
    global bad
    print("OK  " if c else "ERRO",n,i if not c else ""); bad+= (not c)
with sync_playwright() as p:
    b=p.chromium.launch()
    def page(v,w=1000,h=800):
        ctx=b.new_context(viewport={"width":w,"height":h}); pg=ctx.new_page(); errs=[]
        pg.on("pageerror",lambda e:errs.append(str(e))); pg.add_init_script(INIT%v); return pg,errs
    # aviso único: sem ja
    pg,e=page(NOJA); pg.goto(BASE+"vocabulario.html"); pg.wait_for_timeout(1500)
    check("vocabulario sem ja: aviso com link",pg.locator("div[role=status] a[href='vozes.html']").count()==1)
    pg.locator("div[role=status] a").click(); pg.wait_for_url("**/vozes.html"); check("link abre vozes.html",pg.url.endswith("vozes.html"))
    pg.wait_for_timeout(1300); check("vozes.html sem aviso duplicado",pg.locator("div[role=status]:not(#vstatus)").count()==0)
    check("status: sem voz",("Ainda não há voz" in pg.inner_text("#vstatus")),pg.inner_text("#vstatus"))
    pg.click("#vtest"); pg.wait_for_timeout(300); check("teste sem voz diz que falta",("Ainda não há voz" in pg.inner_text("#vstatus")),pg.inner_text("#vstatus"))
    check("vozes sem erro",not e,e)
    # com ja
    pg,e=page(JA); pg.goto(BASE+"vocabulario.html"); pg.wait_for_timeout(1500)
    check("vocabulario com ja: sem aviso",pg.locator("div[role=status]").count()==0)
    pg.goto(BASE+"vozes.html"); pg.wait_for_timeout(1300)
    check("status: tem voz",("já tem uma voz japonesa (Kyoko)" in pg.inner_text("#vstatus")),pg.inner_text("#vstatus"))
    pg.click("#vtest"); pg.wait_for_timeout(300)
    check("testar fala こんにちは",pg.evaluate("window.__calls")==["こんにちは"],pg.evaluate("window.__calls"))
    # sem síntese
    ctx=b.new_context(); pg=ctx.new_page(); er=[]; pg.on("pageerror",lambda x:er.append(str(x)))
    pg.add_init_script("Object.defineProperty(window,'speechSynthesis',{value:undefined,configurable:true})")
    pg.goto(BASE+"vozes.html"); pg.wait_for_timeout(500)
    check("sem síntese: mensagem e botão desligado",("não tem síntese" in pg.inner_text("#vstatus")) and pg.is_disabled("#vtest") and not er,(pg.inner_text("#vstatus"),er))
    # páginas: onnovoice com link (sem ja)
    for name,sel,act in [("ditado.html","#feedback",None),("numeros.html","#feedback",None),("relogio.html","#feedback",None)]:
        pass
    pg,e=page(NOJA); pg.goto(BASE+"index.html"); pg.wait_for_timeout(300)
    pg.evaluate("localStorage.setItem('kd-voice-note','1')")
    pg.goto(BASE+"taxi.html"); pg.wait_for_timeout(400)
    pg.evaluate("document.body.insertAdjacentHTML('beforeend','<p id=t1></p>')")
    # chama diretamente as funções de cada página
    for url,call,sel in [("ditado.html","AyumiTTS.speak('x',{onnovoice:()=>AyumiTTS.voiceHelp($('#feedback'))})","#feedback"),
                         ("numeros.html","say(5)","#feedback"),("relogio.html","say({h:3,m:15})","#feedback"),
                         ("taxi.html","document.querySelector('#listen').click()","#msg"),("taxi-a.html",None,"#msg")]:
        pg.goto(BASE+url); pg.wait_for_timeout(400)
        if url=="taxi-a.html":
            pass
            check("taxi-a: onnovoice usa voiceHelp (estático)","AyumiTTS.voiceHelp($(\"#msg\"))" in open("/home/claude/ayumi/taxi-a.html",encoding="utf-8").read()); continue
        elif url=="taxi.html":
            try: pg.evaluate("(()=>{var b=document.querySelector('#listen');b&&b.click()})()")
            except Exception as ex: pass
        else:
            try: pg.evaluate(call)
            except Exception as ex: print("  (chamada)",url,str(ex)[:80])
        pg.wait_for_timeout(500)
        n=pg.locator(sel+" a[href='vozes.html']").count()
        check(url+" mostra o link",n==1,(n,pg.inner_text(sel)[:80] if pg.locator(sel).count() else "sem elemento"))
    # celular
    pg,e=page(NOJA,390,780); pg.goto(BASE+"vozes.html"); pg.wait_for_timeout(1300)
    sw=pg.evaluate("document.documentElement.scrollWidth"); check("celular 390: sem rolagem lateral",sw<=390,sw)
    pg.goto(BASE+"index.html"); pg.wait_for_timeout(1500); check("index celular sem rolagem lateral",pg.evaluate("document.documentElement.scrollWidth")<=390)
    pg.screenshot(path="/tmp/vozes_m.png",full_page=True)
    pg2,e2=page(NOJA,390,780); pg2.goto(BASE+"vozes.html"); pg2.wait_for_timeout(1300); pg2.screenshot(path="/tmp/vozes_page.png",full_page=True)
    b.close()
srv.terminate(); print("RESULTADO:", "tudo OK" if not bad else f"{bad} erro(s)")
