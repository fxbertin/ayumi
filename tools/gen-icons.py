# Gera os ícones da PWA em icons/. Uso: python3 tools/gen-icons.py  (precisa de Pillow e da fonte Noto Sans CJK JP)
# Símbolo atual: 歩 (de 歩み, "Ayumi"). Para trocar, mude GLYPH e rode de novo.
from PIL import Image, ImageDraw, ImageFont
GLYPH = "歩"
FONT = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"  # índice 0 = JP
NAVY, RED, PAPER = "#1d2742", "#c8372d", "#ffffff"

def make(size, glyph_ratio, rounded):
    S = size * 4  # supersampling
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if rounded: d.rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * 0.22), fill=NAVY)
    else: d.rectangle([0, 0, S, S], fill=NAVY)
    f = ImageFont.truetype(FONT, int(S * glyph_ratio), index=0)
    b = d.textbbox((0, 0), GLYPH, font=f)
    w, h = b[2] - b[0], b[3] - b[1]
    x, y = (S - w) / 2 - b[0], (S - h) / 2 - b[1] - S * 0.03
    d.text((x, y), GLYPH, font=f, fill=PAPER)
    bw, bh = S * glyph_ratio * 0.55, S * 0.035          # barra vermelha (selo) embaixo do símbolo
    cy = (S + h) / 2 + S * 0.035
    d.rounded_rectangle([(S - bw) / 2, cy, (S + bw) / 2, cy + bh], radius=bh / 2, fill=RED)
    return im.resize((size, size), Image.LANCZOS)

make(192, 0.62, True).save("icons/icon-192.png")
make(512, 0.62, True).save("icons/icon-512.png")
make(512, 0.46, False).save("icons/icon-maskable-512.png")   # área segura: o sistema recorta as bordas
make(180, 0.58, False).convert("RGB").save("icons/apple-touch-icon.png")
