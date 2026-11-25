# Gera as imagens de compartilhamento img/og-*.jpg (1200x630, JPEG) a partir das prévias img/prev-*.webp
# e do ícone (a imagem padrão, og-ayumi.jpg). WebP não aparece de forma confiável no WhatsApp e em outras redes.
# Uso (na pasta do projeto): python3 tools/gen-og.py     Precisa de Pillow.
import glob, os
from PIL import Image, ImageDraw
BG = (29, 39, 66)   # #1d2742, o theme-color do site
def card(img, h):
    c = Image.new("RGB", (1200, 630), BG)
    w = round(img.width * h / img.height)
    im = img.convert("RGB").resize((w, h), Image.LANCZOS)
    x, y = (1200 - w) // 2, (630 - h) // 2
    m = Image.new("L", im.size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, w - 1, h - 1), 18, fill=255)
    c.paste(im, (x, y), m)
    return c
for f in sorted(glob.glob("img/prev-*.webp")):
    name = os.path.basename(f)[5:-5]
    card(Image.open(f), 540).save(f"img/og-{name}.jpg", quality=88, optimize=True)
ic = Image.open("icons/icon-512.png").convert("RGBA")
base = Image.new("RGBA", ic.size, BG + (255,)); base.alpha_composite(ic)
card(base, 460).save("img/og-ayumi.jpg", quality=88, optimize=True)
print(len(glob.glob("img/og-*.jpg")), "imagens")
