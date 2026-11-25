# Gera os metadados de SEO das páginas (título, description, canonical, Open Graph, Twitter Card, robots)
# e o sitemap.xml. É idempotente: o bloco entre <!-- seo:início --> e <!-- seo:fim --> é reescrito a cada execução.
# Uso (na pasta do projeto): python3 tools/gen-seo.py   e depois   node valseo.js
# Para mudar um texto, edite a tabela PAGES abaixo e rode de novo. Se o site mudar de endereço, mude só BASE.
import html, re, sys
sys.stdout.reconfigure(encoding="utf-8")

BASE = "https://fxbertin.github.io/ayumi/"   # termina com /
SITE = "Ayumi"
DEFAULT_IMG = "ayumi"                          # img/og-ayumi.jpg (1200x630, feita por tools/gen-og.py)

# arquivo: (título completo, description, imagem OG ou None = padrão, indexar?)
PAGES = {
 "index.html": ("Ayumi 歩み – aprender japonês em português, passo a passo",
   "Aprenda japonês em português, passo a passo: gramática do hiragana ao avançado, mais de 2.300 palavras com áudio, kanji, leitura e jogos. Direto no navegador.", None, True),
 "grammar.html": ("Gramática japonesa em português: do hiragana ao avançado – Ayumi",
   "Gramática japonesa em português, em ordem: hiragana, katakana, partículas e frases, com explicações, exemplos e provas por nível.", None, True),
 "vocabulario.html": ("Vocabulário de japonês por tema, com frases e áudio – Ayumi",
   "Mais de 2.300 palavras de japonês organizadas por tema, com leitura em kana, romaji, tradução, frase de exemplo e áudio.", None, True),
 "grammar-prova.html": ("Prova de gramática japonesa: quiz por nível – Ayumi",
   "Quiz de gramática japonesa em português, com perguntas de múltipla escolha nos níveis básico, intermediário e avançado.", None, True),
 "conjugacao.html": ("Treino de conjugação de verbos japoneses – Ayumi",
   "Treine a conjugação dos verbos japoneses (ichidan, godan e irregulares): veja o verbo na forma de dicionário e conjugue na forma pedida.", None, True),
 "conjugacao-adjetivos.html": ("Treino de conjugação de adjetivos japoneses – Ayumi",
   "Treine a conjugação dos adjetivos japoneses: veja o adjetivo na forma de dicionário e conjugue na forma pedida, com correção na hora.", None, True),
 "lacuna.html": ("Lacuna em frases: treine palavras e partículas do japonês – Ayumi",
   "Complete frases em japonês com a palavra ou a partícula que falta. A tradução ajuda, e você responde escolhendo ou digitando.", None, True),
 "ditado.html": ("Ditado de japonês: treine a escuta com palavras e frases – Ayumi",
   "Ouça palavras e frases em japonês e responda escolhendo a opção certa ou digitando o que ouviu. Treino de escuta direto no navegador.", None, True),
 "contadores.html": ("Contadores em japonês: escolha o contador certo – Ayumi",
   "Veja o objeto e escolha o contador japonês certo, como 本, 枚 e 台, em quatro níveis, do N5 ao N2.", None, True),
 "kanji.html": ("Kanji: treine as leituras por nível JLPT – Ayumi",
   "Treine as leituras dos kanji por nível JLPT, com kun e on, palavras de exemplo, modo de estudo e jogo com pontuação.", None, True),
 "leitura.html": ("Leitura em japonês: histórias e diálogos com furigana – Ayumi",
   "Histórias e diálogos curtos em japonês com furigana, tradução frase a frase, áudio e perguntas de compreensão.", None, True),
 "velocidade.html": ("Velocidade: quiz de vocabulário japonês em 60 segundos – Ayumi",
   "Responda o máximo de palavras japonesas em 60 segundos. Sequências de acertos valem mais pontos. Japonês para português e o contrário.", "velocidade", True),
 "kana-no-ame.html": ("Kana no Ame: jogo de formar palavras em japonês com kana – Ayumi",
   "Os kana caem como chuva: forme palavras em japonês na horizontal ou na vertical antes que o quadro encha. Treina hiragana, katakana e vocabulário.", "kana-no-ame", True),
 "space-kana.html": ("Space Kana: jogo para aprender hiragana e katakana – Ayumi",
   "Digite o romaji para destruir os kana invasores antes que cheguem à base. Um jogo para reconhecer hiragana e katakana rapidamente.", "space-kana", True),
 "kotonoha.html": ("言の葉 Kotonoha: jogo de palavras com kana – Ayumi",
   "Ligue kana vizinhos num tabuleiro para formar palavras em japonês. Três dificuldades, modo 落ち葉 com chuva de letras e dicas.", "kotonoha", True),
 "karada.html": ("Karada Meguri 体めぐり: partes do corpo em japonês – Ayumi",
   "Aprenda o nome das partes do corpo em japonês tocando no desenho: corpo, rosto e órgãos, com furigana e três modos de jogo.", "karada", True),
 "kurashi.html": ("Kurashi Meguri 暮らしめぐり: vocabulário da casa em japonês – Ayumi",
   "Passeie por uma casa ilustrada e aprenda em japonês os cômodos, móveis, utensílios de cozinha e objetos do dia a dia.", "kurashi", True),
 "densetsu.html": ("Densetsu Meguri 伝説めぐり: vocabulário de fantasia em japonês – Ayumi",
   "Explore um mapa de lenda e aprenda em japonês palavras de natureza, castelo, magia, heróis e monstros tocando no desenho.", "densetsu", True),
 "numeros.html": ("Números em japonês: escreva e leia de 0 a 99999 – Ayumi",
   "Treine os números em japonês de 0 a 99999: escreva o número, leia o kanji ou ouça e digite os algarismos, com áudio.", "numeros", True),
 "relogio.html": ("Horas em japonês: treino do relógio – Ayumi",
   "Veja o relógio e escreva a hora em japonês, das horas cheias aos minutos, com as leituras especiais e níveis de dificuldade.", "relogio", True),
 "taxi.html": ("Takushii no Bouken: aprenda a seguir instruções em japonês – Ayumi",
   "Leia as instruções em japonês, desvie das ruas fechadas e leve o táxi ao destino, em quatro níveis de dificuldade.", "taxi", True),
 "taxi-a.html": ("Takushii no Bouken, modo A: aprenda a dar instruções em japonês – Ayumi",
   "Dê as instruções em japonês: monte a frase com as peças e veja o táxi seguir até o destino, em três níveis de mapa.", "taxi", True),
 "vozes.html": ("Como instalar uma voz japonesa para o áudio funcionar – Ayumi",
   "Sem voz japonesa no aparelho, o botão de áudio fica mudo. Veja como instalar uma voz japonesa no Windows, Android, iPhone e Mac.", None, True),
 "progresso.html": ("Meu progresso – Ayumi",
   "Seu histórico, recordes e backup do progresso no Ayumi, guardados só neste navegador.", None, False),
}

def esc(s): return html.escape(s, quote=True)
def url(f): return BASE if f == "index.html" else BASE + f

def block(f, title, desc, img, index):
    L = [f'<meta name="description" content="{esc(desc)}">']
    if not index:
        L.append('<meta name="robots" content="noindex">')
    else:
        im = BASE + "img/og-" + (img or DEFAULT_IMG) + ".jpg"
        L += [f'<link rel="canonical" href="{url(f)}">',
              '<meta property="og:type" content="website">',
              f'<meta property="og:site_name" content="{SITE}">',
              '<meta property="og:locale" content="pt_BR">',
              f'<meta property="og:title" content="{esc(title)}">',
              f'<meta property="og:description" content="{esc(desc)}">',
              f'<meta property="og:url" content="{url(f)}">',
              f'<meta property="og:image" content="{im}">',
              '<meta property="og:image:width" content="1200">',
              '<meta property="og:image:height" content="630">',
              '<meta name="twitter:card" content="summary_large_image">',
              f'<meta name="twitter:title" content="{esc(title)}">',
              f'<meta name="twitter:description" content="{esc(desc)}">',
              f'<meta name="twitter:image" content="{im}">']
    return "<!-- seo:início -->\n" + "\n".join(L) + "\n<!-- seo:fim -->\n"

for f, (title, desc, img, index) in PAGES.items():
    s = open(f, encoding="utf-8").read()
    s = re.sub(r"<!-- seo:início -->.*?<!-- seo:fim -->\n", "", s, flags=re.S)
    s, n = re.subn(r"<title>.*?</title>\n", lambda m: f"<title>{html.escape(title, quote=False)}</title>\n" + block(f, title, desc, img, index), s, count=1, flags=re.S)
    assert n == 1, f
    open(f, "w", encoding="utf-8").write(s)

urls = [url(f) for f, p in PAGES.items() if p[3]]
open("sitemap.xml", "w", encoding="utf-8").write(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + "".join(f"  <url><loc>{u}</loc></url>\n" for u in urls) + "</urlset>\n")
print(len(PAGES), "páginas;", len(urls), "no sitemap")
