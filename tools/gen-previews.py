# Gera as imagens de prévia dos mini games (img/prev-*.webp), usadas nos cards da página inicial.
# Uso: com o site servido (ex.: cd .. && python3 -m http.server 8767), rode
#   python3 tools/gen-previews.py http://localhost:8767/ayumi/
#   (opcional) nomes depois da URL geram só essas prévias, ex.: ... http://localhost:8767/ayumi/ karada
# Precisa de playwright (com Chromium) e Pillow. As capturas são do tema claro, em 480x300 (16:10), WebP.
import os, sys, random
from io import BytesIO
from playwright.sync_api import sync_playwright
from PIL import Image
base = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8767/ayumi/"
ONLY = sys.argv[2:]
want = lambda n: not ONLY or n in ONLY
random.seed(4)
def crop16x10(png, anchor):                      # anchor: "top", "center" ou "bottom"
    im = Image.open(BytesIO(png)).convert("RGB"); w, h = im.size; ch = min(h, round(w * 10 / 16))
    y = {"top": 0, "center": (h - ch) // 2, "bottom": h - ch}[anchor]
    return im.crop((0, y, w, y + ch)).resize((480, 300), Image.LANCZOS)
with sync_playwright() as p:
    b = p.chromium.launch(); out = {}
    def page():
        return b.new_context(viewport={"width": 520, "height": 700}, color_scheme="light", device_scale_factor=2).new_page()
    if want("kana-no-ame"):
        q = page(); q.goto(base + "kana-no-ame.html"); q.click("#go"); q.wait_for_timeout(300)
        for _ in range(16):
            for _ in range(random.randint(0, 4)): q.keyboard.press(random.choice(["ArrowLeft", "ArrowRight"]))
            q.keyboard.press(" "); q.wait_for_timeout(200)
        q.wait_for_timeout(500); out["kana-no-ame"] = crop16x10(q.locator("#board").screenshot(), "bottom")
    if want("space-kana"):
        q = page(); q.goto(base + "space-kana.html"); q.click("#go"); q.wait_for_timeout(3500)
        out["space-kana"] = crop16x10(q.locator("#cv").screenshot(), "top")
    if want("velocidade"):
        q = page(); q.goto(base + "velocidade.html"); q.click("#go"); q.wait_for_timeout(900)
        out["velocidade"] = crop16x10(q.screenshot(clip={"x": 0, "y": 125, "width": 520, "height": 340}), "top")
    if want("taxi"):
        q = page(); q.goto(base + "taxi.html"); q.wait_for_timeout(600)
        for _ in range(3): q.keyboard.press("ArrowUp"); q.wait_for_timeout(120)
        out["taxi"] = crop16x10(q.locator("#map").screenshot(), "center")
    if want("kotonoha"):
        q = page(); q.goto(base + "kotonoha.html"); q.wait_for_timeout(300)
        q.evaluate("localStorage.setItem('kd-kotonoha-seed','41')"); q.select_option("#lv", "facil"); q.select_option("#mn", "3"); q.click("#go"); q.wait_for_timeout(400)
        plan = q.evaluate("(()=>{const d=KOTO.buildDict(CATEGORIES);return KOTO.generate(d,'facil',3,42).plan})()")
        bx = q.locator("#board").bounding_box(); cs = q.evaluate("parseFloat(getComputedStyle(document.querySelector('#board')).getPropertyValue('--c'))"); st = cs + 4
        ps = [(bx["x"] + 9.5 + c * st + cs / 2, bx["y"] + 9.5 + r * st + cs / 2) for r, c in plan[0]["path"]]
        q.mouse.move(*ps[0]); q.mouse.down()
        for x, y in ps[1:]: q.mouse.move(x, y, steps=4)
        q.wait_for_timeout(250); H = bx["height"] + 16; q.mouse.move(*ps[-1])
        clip = {"x": max(0, bx["x"] + bx["width"] / 2 - H * .8), "y": max(0, bx["y"] - 8), "width": H * 1.6, "height": H}
        out["kotonoha"] = Image.open(BytesIO(q.screenshot(clip=clip))).convert("RGB").resize((480, 300), Image.LANCZOS); q.mouse.up()
    if want("karada"):
        q = b.new_context(viewport={"width": 760, "height": 800}, color_scheme="light", device_scale_factor=2).new_page()
        q.goto(base + "karada.html"); q.click("[data-vista=orgaos]"); q.click("#go")
        q.evaluate("(()=>{const K=KARADA;K.S.qs=[{z:K.ZONES.find(z=>z.k==='肺|はい')}];K.S.qi=0;return K.showQ()})()"); q.wait_for_timeout(500)
        g = q.locator(".kgrid").bounding_box()
        out["karada"] = crop16x10(q.screenshot(clip={"x": g["x"], "y": g["y"], "width": g["width"], "height": g["width"] * 10 / 16}), "top")
    if want("kurashi"):
        q = b.new_context(viewport={"width": 760, "height": 800}, color_scheme="light", device_scale_factor=2).new_page()
        q.goto(base + "kurashi.html"); q.click("[data-vista=casa]"); q.click("#go")
        q.evaluate("(()=>{const K=KURASHI;K.S.qs=[{z:K.ZONES.find(z=>z.k==='台所|だいどころ')}];K.S.qi=0;return K.showQ()})()"); q.wait_for_timeout(500)
        g = q.locator(".kgrid").bounding_box()
        out["kurashi"] = crop16x10(q.screenshot(clip={"x": g["x"], "y": g["y"], "width": g["width"], "height": g["width"] * 10 / 16}), "center")
    if want("densetsu"):
        q = b.new_context(viewport={"width": 760, "height": 800}, color_scheme="light", device_scale_factor=2).new_page()
        q.goto(base + "densetsu.html"); q.click("[data-vista=natureza]"); q.click("#go")
        q.evaluate("(()=>{const K=DENSETSU_GAME;K.S.qs=[{z:K.ZONES.find(z=>z.k==='火山|かざん')}];K.S.qi=0;return K.showQ()})()"); q.wait_for_timeout(500)
        g = q.locator(".kgrid").bounding_box()
        out["densetsu"] = crop16x10(q.screenshot(clip={"x": g["x"], "y": g["y"], "width": g["width"], "height": g["width"] * 10 / 16}), "top")
    if want("numeros"):
        q = page(); q.goto(base + "numeros.html"); q.click("[data-lv='5']"); q.click("#go")
        q.evaluate("(()=>{S.q=[35640];S.i=0;render()})()"); q.fill("#ja", "sanmango"); q.wait_for_timeout(300)
        g = q.locator("#game .card").bounding_box()
        out["numeros"] = crop16x10(q.screenshot(clip={"x": 0, "y": g["y"] - 14, "width": 520, "height": 340}), "top")
    if want("relogio"):
        q = page(); q.goto(base + "relogio.html"); q.click("[data-lv='3']"); q.click("#go")
        q.evaluate("(()=>{S.q=[{h:4,m:15}];S.i=0;render()})()"); q.fill("#ja", "yoji juugofun"); q.wait_for_timeout(300)
        g = q.locator("#game .card").bounding_box()
        out["relogio"] = crop16x10(q.screenshot(clip={"x": 0, "y": g["y"] - 14, "width": 520, "height": 340}), "top")
    b.close()
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.makedirs(ROOT + "/img", exist_ok=True)
for n, im in out.items(): im.save(f"{ROOT}/img/prev-{n}.webp", "WEBP", quality=72, method=6)
