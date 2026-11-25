// Gramática do Ayumi.
// Estrutura: grupos > tópicos. Texto simples; **x** vira negrito (ou destaque nos exemplos);
// {漢字|かんじ} vira furigana (ruby) nos exemplos.
// Tópico: { id, title, summary, use:[], form:[], tables:[{title,head,rows,text?}] (text:true = tabela de texto corrido, com quebra de linha), charts:[{title,script:"hira"|"kata",cols,rows:[["hira|kata|romaji" ou "",...]]}],
//           ex:[[japonês, kana ("" se já está só em kana), português, nota?]], care:[], practice:[[rótulo, página]] }
const GRAMMAR = [
{ id: "basico", name: "Básico", level: "~N5", topics: [

{ id: "hiragana", title: "Hiragana (ひらがな)",
  summary: "As 46 letras básicas: cada uma é uma sílaba.",
  use: [
    "O **hiragana** é o primeiro alfabeto que você precisa aprender. Ele tem 46 letras, e cada uma é uma **sílaba** (か = ka), e não uma letra solta como em português.",
    "É com ele que se escrevem palavras japonesas sem kanji e toda a gramática: as partículas (は, を, の…) e as terminações dos verbos.",
    "Toque em qualquer letra da tabela para ouvir o som."
  ],
  form: [
    "A tabela se lê por **linhas** (a consoante) e **colunas** (a vogal). A coluna あ é sempre “a”, a coluna い é sempre “i”, e assim por diante: か ka, さ sa, た ta…",
    "**Vogais** (あ い う え お): curtas e firmes, sem virar ditongo. O お é “o” e não “ou”. O う é mais fechado, sem arredondar muito os lábios.",
    "**Linha か**: soa como “ca, qui, cu, que, co”. **Linha さ**: sa, **shi** (como o “xi” de “xícara”), su, se, so.",
    "**Linha た**: ta, **chi** (como o “tchi” de “tchau”), **tsu** (como o “ts” de “pizza” + u), te, to.",
    "**Linha は**: o h é soprado, parecido com o “r” de “rato” em várias regiões do Brasil. O ふ (fu) fica entre o “f” e o “h”.",
    "**Linha ら**: o r é uma batida rápida da língua, como o “r” de “caro”. Às vezes parece um “l” suave.",
    "**や ゆ よ** soam “ia, iu, io”. **わ** soa “ua”. **を** soa “o” e só aparece como partícula. **ん** é um “n” nasal."
  ],
  charts: [
    { title: "Tabela básica do hiragana (toque para ouvir)", script: "hira", cols: 5, rows: [
      ["あ|ア|a","い|イ|i","う|ウ|u","え|エ|e","お|オ|o"],
      ["か|カ|ka","き|キ|ki","く|ク|ku","け|ケ|ke","こ|コ|ko"],
      ["さ|サ|sa","し|シ|shi","す|ス|su","せ|セ|se","そ|ソ|so"],
      ["た|タ|ta","ち|チ|chi","つ|ツ|tsu","て|テ|te","と|ト|to"],
      ["な|ナ|na","に|ニ|ni","ぬ|ヌ|nu","ね|ネ|ne","の|ノ|no"],
      ["は|ハ|ha","ひ|ヒ|hi","ふ|フ|fu","へ|ヘ|he","ほ|ホ|ho"],
      ["ま|マ|ma","み|ミ|mi","む|ム|mu","め|メ|me","も|モ|mo"],
      ["や|ヤ|ya","","ゆ|ユ|yu","","よ|ヨ|yo"],
      ["ら|ラ|ra","り|リ|ri","る|ル|ru","れ|レ|re","ろ|ロ|ro"],
      ["わ|ワ|wa","","","","を|ヲ|o"],
      ["ん|ン|n","","","",""]
    ] }
  ],
  ex: [
    ["あめ", "", "chuva", "Duas sílabas: あ (a) + め (me)."],
    ["いえ", "", "casa", "い (i) + え (e)."],
    ["うみ", "", "mar", "う (u) + み (mi)."],
    ["ねこ", "", "gato", "ね (ne) + こ (ko)."],
    ["さくら", "", "flor de cerejeira", "Três sílabas: さ (sa) + く (ku) + ら (ra)."]
  ],
  care: [
    "Algumas letras se parecem muito: **ぬ/め**, **ね/れ/わ**, **さ/ち** e **は/ほ**. O Space Kana treina justamente essas confusões.",
    "**は**, **へ** e **を** mudam de som quando são partículas: は → wa, へ → e, を → o. Isso aparece nos tópicos de partículas.",
    "O romaji escreve alguns sons de um jeito diferente da posição na tabela: し = shi, ち = chi, つ = tsu, ふ = fu.",
    "Aprenda uma linha por vez (あ行, depois か行…) e revise antes de seguir. Não precisa decorar tudo de uma vez."
  ],
  practice: [["Kana no Ame", "kana-no-ame.html"], ["Space Kana", "space-kana.html"]]
},

{ id: "katakana", title: "Katakana (カタカナ)",
  summary: "Os mesmos sons do hiragana, usados em palavras estrangeiras.",
  use: [
    "O **katakana** tem os mesmos 46 sons do hiragana, só que com letras mais retas e angulosas. か e カ são dois jeitos de escrever “ka”.",
    "Ele escreve palavras que vieram de outras línguas (コーヒー, テレビ), nomes de pessoas e lugares estrangeiros (ブラジル) e onomatopeias. Também serve para dar ênfase, parecido com o itálico.",
    "Toque em qualquer letra da tabela para ouvir o som."
  ],
  form: [
    "Os sons e a organização da tabela são os mesmos do hiragana. Quem sabe か já sabe o som de カ.",
    "Um sinal novo: o traço **ー** alonga a vogal anterior (コーヒー). Ele só existe no katakana.",
    "Para sons de palavras estrangeiras existem combinações extras, como **ティ** (ti) e **ファ** (fa). Você vai vendo essas aos poucos."
  ],
  charts: [
    { title: "Tabela básica do katakana (toque para ouvir)", script: "kata", cols: 5, rows: [
      ["あ|ア|a","い|イ|i","う|ウ|u","え|エ|e","お|オ|o"],
      ["か|カ|ka","き|キ|ki","く|ク|ku","け|ケ|ke","こ|コ|ko"],
      ["さ|サ|sa","し|シ|shi","す|ス|su","せ|セ|se","そ|ソ|so"],
      ["た|タ|ta","ち|チ|chi","つ|ツ|tsu","て|テ|te","と|ト|to"],
      ["な|ナ|na","に|ニ|ni","ぬ|ヌ|nu","ね|ネ|ne","の|ノ|no"],
      ["は|ハ|ha","ひ|ヒ|hi","ふ|フ|fu","へ|ヘ|he","ほ|ホ|ho"],
      ["ま|マ|ma","み|ミ|mi","む|ム|mu","め|メ|me","も|モ|mo"],
      ["や|ヤ|ya","","ゆ|ユ|yu","","よ|ヨ|yo"],
      ["ら|ラ|ra","り|リ|ri","る|ル|ru","れ|レ|re","ろ|ロ|ro"],
      ["わ|ワ|wa","","","","を|ヲ|o"],
      ["ん|ン|n","","","",""]
    ] }
  ],
  ex: [
    ["ホテル", "", "hotel", "ho-te-ru. Parece com “hotel”, mas o japonês soa em sílabas."],
    ["タクシー", "", "táxi", "ta-ku-shii. O ー alonga o シ."],
    ["ブラジル", "", "Brasil", "bu-ra-ji-ru. Nomes de países estrangeiros vão em katakana."],
    ["コーヒー", "", "café", "ko-o-hii. Os dois ー alongam a vogal anterior."],
    ["パン", "", "pão", "Vem do português “pão”, trazido pelos portugueses há séculos."]
  ],
  care: [
    "Os pares mais confundidos são **シ/ツ** e **ソ/ン**. Em geral, os traços curtos do シ e do ン ficam mais deitados, e os do ツ e do ソ ficam mais em pé.",
    "Ler katakana costuma ser mais lento no começo, e isso é normal. Treinar com palavras que você já conhece (ホテル, タクシー) ajuda.",
    "Muitas palavras em katakana são adaptações de inglês, então o som muda: “beer” vira ビール (biiru)."
  ],
  practice: [["Kana no Ame", "kana-no-ame.html"], ["Space Kana", "space-kana.html"]]
},

{ id: "dakuten", title: "Dakuten e handakuten (゛ ゜)",
  summary: "Dois sinaizinhos que mudam o som de uma letra.",
  use: [
    "Dois sinais pequenos, escritos no canto da letra, criam sons novos sem precisar de letras novas: o **dakuten** (゛, dois tracinhos) e o **handakuten** (゜, um círculo).",
    "O dakuten troca um som “seco” por um som “vibrado”. Para sentir a diferença, ponha a mão na garganta: ao dizer “ssss” ela não vibra, e ao dizer “zzzz” vibra. É a mesma diferença entre か (k) e が (g).",
    "Toque em qualquer letra das tabelas para ouvir o som."
  ],
  form: [
    "**Dakuten**: k → g, s → z, t → d, h → b. Por exemplo: か → が (ka → ga), さ → ざ (sa → za), た → だ (ta → da), は → ば (ha → ba).",
    "**Handakuten**: h → p. Só a linha は aceita: は → ぱ (ha → pa).",
    "Como soam: **g** como em “gato”, **z** como em “zero”, **d** como em “dado”, **b** como em “bola”, **p** como em “pato”.",
    "Casos especiais: **じ** (ji) soa como o “dji” de “dia” no Brasil. **ぢ** e **づ** soam igual a じ e ず e quase não aparecem.",
    "No katakana vale o mesmo: カ → ガ, ハ → バ → パ."
  ],
  charts: [
    { title: "Hiragana com dakuten e handakuten", script: "hira", cols: 5, rows: [
      ["が|ガ|ga","ぎ|ギ|gi","ぐ|グ|gu","げ|ゲ|ge","ご|ゴ|go"],
      ["ざ|ザ|za","じ|ジ|ji","ず|ズ|zu","ぜ|ゼ|ze","ぞ|ゾ|zo"],
      ["だ|ダ|da","ぢ|ヂ|ji","づ|ヅ|zu","で|デ|de","ど|ド|do"],
      ["ば|バ|ba","び|ビ|bi","ぶ|ブ|bu","べ|ベ|be","ぼ|ボ|bo"],
      ["ぱ|パ|pa","ぴ|ピ|pi","ぷ|プ|pu","ぺ|ペ|pe","ぽ|ポ|po"]
    ] },
    { title: "Katakana com dakuten e handakuten", script: "kata", cols: 5, rows: [
      ["が|ガ|ga","ぎ|ギ|gi","ぐ|グ|gu","げ|ゲ|ge","ご|ゴ|go"],
      ["ざ|ザ|za","じ|ジ|ji","ず|ズ|zu","ぜ|ゼ|ze","ぞ|ゾ|zo"],
      ["だ|ダ|da","ぢ|ヂ|ji","づ|ヅ|zu","で|デ|de","ど|ド|do"],
      ["ば|バ|ba","び|ビ|bi","ぶ|ブ|bu","べ|ベ|be","ぼ|ボ|bo"],
      ["ぱ|パ|pa","ぴ|ピ|pi","ぷ|プ|pu","ぺ|ペ|pe","ぽ|ポ|po"]
    ] }
  ],
  ex: [
    ["**が**くせい", "", "estudante", "gakusei: o が soa “ga” como em “gato”."],
    ["み**ず**", "", "água", "mizu: o ず soa “zu”."],
    ["**で**んわ", "", "telefone", "denwa: o で soa “de” como em “dedo”."],
    ["か**ば**ん", "", "bolsa", "kaban: o ば soa “ba” como em “bala”."],
    ["えん**ぴ**つ", "", "lápis", "enpitsu: o ぴ soa “pi” como em “pico”."]
  ],
  care: [
    "Trocar um som muda a palavra: かき (kaki, caqui) e かぎ (kagi, chave) são palavras diferentes.",
    "Os dois tracinhos do dakuten ficam no canto superior direito da letra. Se você não vê os tracinhos, é a letra sem dakuten.",
    "**は** como partícula continua soando “wa”. O ば e o ぱ são letras à parte."
  ],
  practice: [["Kana no Ame", "kana-no-ame.html"], ["Space Kana", "space-kana.html"]]
},

{ id: "sons-especiais", title: "Sons combinados, っ e vogal longa",
  summary: "Três detalhes que mudam o ritmo e o significado da palavra.",
  use: [
    "Além das letras, o japonês tem três recursos para ajustar o som e o ritmo. São pequenos, mas mudam o significado da palavra.",
    "O japonês é contado em **batidas de tempo** (moras). Cada letra vale uma batida, e esses recursos mudam quantas batidas a palavra tem."
  ],
  form: [
    "**ゃ ゅ ょ pequenos**: uma letra terminada em i (き, し, ち, に, ひ, み, り, ぎ, じ, び, ぴ) + や, ゆ ou よ pequenos forma uma sílaba só. き + ゃ = **きゃ** (kya), し + ゅ = **しゅ** (shu), ち + ょ = **ちょ** (cho). Conta como **uma** batida.",
    "**っ pequeno**: uma pausa curtíssima que dobra a consoante seguinte, como se você “segurasse” o som antes dele: きって (kit-te). Vale uma batida.",
    "**Vogal longa**: segure a vogal pelo dobro do tempo. No hiragana, escreve-se a vogal de novo: おかあさん (mãe), おにいさん (irmão mais velho). O som de “ee” costuma ser escrito え + い (せんせい) e o de “oo”, お + う (ありがとう).",
    "No katakana, a vogal longa usa o traço **ー**: コーヒー. O **ん** também vale uma batida inteira: ほん (ho-n)."
  ],
  charts: [
    { title: "Sons combinados em hiragana (no katakana é igual: キャ, シュ, チョ…)", script: "hira", cols: 3, rows: [
      ["きゃ|キャ|kya","きゅ|キュ|kyu","きょ|キョ|kyo"],
      ["しゃ|シャ|sha","しゅ|シュ|shu","しょ|ショ|sho"],
      ["ちゃ|チャ|cha","ちゅ|チュ|chu","ちょ|チョ|cho"],
      ["にゃ|ニャ|nya","にゅ|ニュ|nyu","にょ|ニョ|nyo"],
      ["ひゃ|ヒャ|hya","ひゅ|ヒュ|hyu","ひょ|ヒョ|hyo"],
      ["みゃ|ミャ|mya","みゅ|ミュ|myu","みょ|ミョ|myo"],
      ["りゃ|リャ|rya","りゅ|リュ|ryu","りょ|リョ|ryo"],
      ["ぎゃ|ギャ|gya","ぎゅ|ギュ|gyu","ぎょ|ギョ|gyo"],
      ["じゃ|ジャ|ja","じゅ|ジュ|ju","じょ|ジョ|jo"],
      ["びゃ|ビャ|bya","びゅ|ビュ|byu","びょ|ビョ|byo"],
      ["ぴゃ|ピャ|pya","ぴゅ|ピュ|pyu","ぴょ|ピョ|pyo"]
    ] }
  ],
  ex: [
    ["**きょ**う", "", "hoje", "kyō: きょ é uma sílaba só, e o う alonga o “o”."],
    ["**しゃ**しん", "", "foto", "sha-shin: しゃ é uma sílaba só."],
    ["き**っ**て と きて", "", "selo e venha", "kitte (com pausa) e kite. Só o っ separa as duas palavras."],
    ["お**ばあ**さん と おばさん", "", "avó e tia", "obaasan (vogal longa) e obasan. Alongar a vogal muda a palavra."],
    ["コ**ー**ヒ**ー**", "", "café", "koohii: cada ー alonga a vogal de antes."],
    ["ち**ょっ**と", "", "um pouco", "chotto: ちょ (uma sílaba) + っ (pausa) + と."]
  ],
  care: [
    "Os pequenos (ゃ ゅ ょ っ) são escritos **menores** e rente à linha: ゆ ≠ ゅ, つ ≠ っ. Se a letra aparece grande, é outra letra.",
    "A vogal longa é a maior fonte de confusão para quem fala português: おばさん e おばあさん, ゆき (neve) e ゆうき (coragem). Ouvir bastante ajuda.",
    "O ん ocupa uma batida inteira, então ほん soa “ho-n”, e não só “ho”."
  ],
  practice: [["Kana no Ame", "kana-no-ame.html"], ["Space Kana", "space-kana.html"]]
},

{ id: "escrita", title: "Como o japonês é escrito",
  summary: "Kanji, hiragana e katakana juntos na mesma frase.",
  use: [
    "Uma frase japonesa mistura três tipos de escrita, e cada um tem um papel.",
    "**Kanji** (漢字): caracteres de origem chinesa que carregam significado. Escrevem a ideia principal de substantivos, verbos e adjetivos: 水 (água), 食 (comer).",
    "**Hiragana**: partículas, terminações de verbos e adjetivos, e palavras sem kanji.",
    "**Katakana**: palavras estrangeiras e nomes de fora do Japão."
  ],
  form: [
    "Uma frase costuma ter kanji nas palavras de conteúdo, hiragana na gramática e katakana nas palavras estrangeiras.",
    "**Okurigana**: o hiragana que acompanha um kanji. Em 飲む, o kanji 飲 traz o sentido e む é a terminação.",
    "**Furigana** (ふりがな): kana pequeno escrito em cima do kanji para mostrar como ler. Aparece em livros infantis, mangás e materiais de estudo.",
    "**Pontuação**: 。 (ponto final), 、 (vírgula) e 「 」 (aspas). ？ e ！ existem, mas o ponto de interrogação é opcional nas frases com か.",
    "Não há espaço entre as palavras. A mistura de kanji e kana é o que mostra onde cada palavra começa e termina.",
    "Dica de leitura: os hiragana no meio da frase costumam ser partículas ou terminações, e os kanji e katakana marcam as palavras de conteúdo."
  ],
  ex: [
    ["{私|わたし}は{学校|がっこう}に{行|い}きます。", "", "Eu vou à escola.", "Os kana pequenos em cima dos kanji são o furigana. 行 + きます: きます é o okurigana do verbo."],
    ["**私**はコーヒーを**飲**みます。", "わたしはコーヒーをのみます。", "Eu tomo café.", "Kanji: 私 e 飲. Katakana: コーヒー. O resto (は, を, み, ます) é hiragana."],
    ["**パン**を食べます。", "パンをたべます。", "Como pão.", "パン é katakana e veio do português “pão”."],
    ["今日は**、**雨です**。**", "きょうは、あめです。", "Hoje é dia de chuva.", "、 marca uma pausa e 。 encerra a frase."]
  ],
  care: [
    "Muitos kanji têm mais de uma leitura. Por isso o site mostra o kana junto: aprenda a palavra inteira, e não só o caractere.",
    "Para começar, saber ler hiragana e katakana basta. Os kanji entram aos poucos, junto com as palavras.",
    "Livros para iniciantes escritos só em hiragana costumam pôr espaços entre as palavras, como nos exemplos dos próximos tópicos. No japonês normal esses espaços não existem."
  ],
  practice: [["Kanji", "kanji.html"], ["Quiz de vocabulário", "vocabulario.html"]]
},

{ id: "desu", title: "です e じゃありません",
  summary: "Fecha a frase de forma educada e liga duas ideias: A é B.",
  use: [
    "**です** é uma palavrinha que fecha a frase e faz duas coisas ao mesmo tempo: **liga** duas ideias (A é B) e deixa a frase **educada**.",
    "Por isso o です não é simplesmente o verbo “ser”. Muitas vezes ele equivale a “ser” em português, mas ele também aparece depois de adjetivos, só para dar educação, e às vezes em frases onde nós nem usaríamos um verbo.",
    "Ele não muda com a pessoa: serve para eu, você, ele, nós e eles."
  ],
  form: [
    "N = substantivo (o nome de uma coisa, pessoa ou lugar).",
    "Afirmativo: **N です** (がくせいです = sou/é estudante).",
    "Negativo: **N じゃありません**. A forma mais formal é **ではありません**.",
    "Passado: **N でした**.",
    "Passado negativo: **N じゃありませんでした**.",
    "Depois de **adjetivo**: **A です** (あついです = está quente). O adjetivo já carrega o sentido de “ser/estar”, e o です só acrescenta educação.",
    "Na fala, o u do です quase some e soa “dess”.",
    "Entre amigos usa-se だ no lugar de です. Por enquanto, treine o です."
  ],
  ex: [
    ["わたしは がくせい**です**。", "", "Eu sou estudante.", "Uso básico: A は B です."],
    ["きょうは あつい**です**。", "", "Hoje está quente.", "あつい (quente) é adjetivo. Aqui o です só dá educação, sem “ser” à parte."],
    ["わたしは コーヒー**です**。", "", "Eu quero café. (ao fazer um pedido)", "Em um café, o contexto faz o です significar “eu fico com café”. Ele não é sempre “ser”."],
    ["わたしは がくせい**じゃありません**。", "", "Eu não sou estudante.", ""],
    ["きのうは あめ**でした**。", "", "Ontem foi dia de chuva.", ""],
    ["ここは がっこう**じゃありませんでした**。", "", "Aqui não era uma escola.", "Passado negativo: じゃありませんでした, tudo junto."]
  ],
  care: [
    "O **です** vem no fim da frase, depois do substantivo. Em português dizemos “sou estudante”, e no japonês é “estudante sou”.",
    "O sujeito pode sumir. **がくせいです** sozinho já quer dizer “sou/é estudante”, conforme o contexto.",
    "O negativo tem duas partes: **じゃ** (ou では) + **ありません**. Decore como um bloco só.",
    "O です só aparece com substantivos e adjetivos. Para ações (comer, ir, estudar) existe outra forma, a forma **ます**, que virá em um tópico mais adiante."
  ],
  practice: []
},

{ id: "wa-mo-ka", title: "は, も e か",
  summary: "O tema da frase, o “também” e a pergunta.",
  use: [
    "**Partículas** são palavrinhas curtas que vêm **depois** de uma palavra e mostram o papel dela na frase. Elas fazem o trabalho que as preposições (de, em, para) e a ordem das palavras fazem em português.",
    "**は** marca o **tema**, aquilo sobre o que você vai falar: “quanto a X…”. Quando é partícula, lê-se **wa** (e não ha).",
    "**も** quer dizer “também” e ocupa o lugar do は.",
    "**か** no fim da frase transforma em pergunta. Na escrita não precisa de ponto de interrogação."
  ],
  form: [
    "**Tema は comentário**: きょうは にちようびです (hoje é domingo).",
    "**Tema も comentário**: troca-se は por も. やまださんも がくせいです.",
    "**Frase か**: de です para です**か**. A voz sobe no fim.",
    "Palavras de pergunta: **なん** (o quê), **だれ** (quem), **どこ** (onde). Elas ficam no lugar da resposta: なまえは **なん**ですか。",
    "Respostas: **はい** (sim) e **いいえ** (não)."
  ],
  ex: [
    ["きょう**は** にちようびです。", "", "Hoje é domingo.", "は marca “hoje” como o tema. Lê-se wa."],
    ["わたしは がくせいです。 やまださん**も** がくせいです。", "", "Eu sou estudante. Yamada-san também é estudante.", "も substitui は quando o comentário vale para os dois."],
    ["わたし**も** がくせいじゃありません。", "", "Eu também não sou estudante.", "も combina com o negativo e quer dizer “também não”."],
    ["ここは がっこう**ですか**。", "", "Aqui é uma escola?", "O か no fim cria a pergunta."],
    ["いいえ、がっこうじゃありません。 びょういんです。", "", "Não, não é uma escola. É um hospital.", "Resposta negativa: いいえ + じゃありません."],
    ["なまえは **なん**ですか。", "", "Qual é o seu nome? (literalmente: “o nome é o quê?”)", "なん ocupa o lugar da informação que se quer saber."]
  ],
  care: [
    "**は** não é artigo (o, a) nem é igual ao sujeito do português. Ele só avisa qual é o assunto. Mais adiante você vai ver o **が**, que marca o sujeito de outro jeito.",
    "Para uma pessoa conhecida, os japoneses evitam **あなた** (“você”) e usam o nome com **さん**: やまださんは…",
    "Use **も** só quando a frase anterior disser algo parecido sobre outro assunto."
  ],
  practice: [["Lacuna (modo Partículas)", "lacuna.html"]]
},

{ id: "no", title: "A partícula の",
  summary: "Liga dois substantivos: posse, assunto e origem.",
  use: [
    "**A の B** liga dois substantivos e quer dizer “B de A”. O の mostra a quem B pertence ou de que B é.",
    "Em português usamos “de”, “do”, “da” e “meu”. No japonês, o の cobre todos esses casos."
  ],
  form: [
    "**A の B**: primeiro vem quem possui (ou o tipo), depois a coisa. わたしの ほん (meu livro), にほんごの ほん (livro de japonês), ブラジルの コーヒー (café do Brasil).",
    "Dá para encadear: わたしの いもうとの かばん (a bolsa da minha irmã mais nova).",
    "Sem o B, **A の** vira “o de A”: わたしの (o meu)."
  ],
  ex: [
    ["**わたしの** ほんです。", "", "É o meu livro.", "A posse: わたしの = meu."],
    ["わたしの いもうと**の** かばんです。", "", "É a bolsa da minha irmã mais nova.", "Dois の em cadeia: minha → irmã → bolsa."],
    ["にほんご**の** ほんです。", "", "É um livro de japonês.", "O の também diz o assunto: livro de quê?"],
    ["ブラジル**の** コーヒーです。", "", "É café do Brasil.", "A origem."],
    ["だれ**の** かばんですか。", "", "De quem é a bolsa?", "だれ + の = de quem."],
    ["わたし**の**です。", "", "É meu.", "Sem o substantivo, の sozinho quer dizer “o meu”."]
  ],
  care: [
    "A ordem é o **contrário do português**: primeiro vem quem possui ou o tipo, depois a coisa. “Livro de japonês” é にほんごの ほん, e não ほんの にほんご.",
    "の não é は: o は fala do tema da frase, e o の só liga substantivos.",
    "O の nunca começa a frase: ele sempre vem depois de um substantivo."
  ],
  practice: [["Lacuna (modo Partículas)", "lacuna.html"]]
},

{ id: "familia", title: "Família: a minha e a dos outros",
  summary: "Palavras diferentes para a minha família e para a família dos outros, e como chamar cada parente em casa.",
  use: [
    "No japonês, a palavra para um parente muda conforme **de quem** você fala. Para a **sua própria família**, ao conversar com gente de fora, usam-se as palavras **humildes**: {母|はは} (mãe), {父|ちち} (pai). Para a **família da outra pessoa**, usam-se as palavras **respeitosas**, com **お～さん**: おかあさん, おとうさん.",
    "É uma forma de respeito: o seu lado fica mais simples, e o lado do outro, mais elevado. Em português “minha mãe” e “sua mãe” usam a mesma palavra, e por isso o assunto parece complicado no começo.",
    "Este tópico é de consulta e curiosidade: volte a ele quando precisar."
  ],
  form: [
    "**Três situações**: (1) falando da **sua** família com alguém de fora: はは, ちち. (2) falando da família **do outro**: おかあさん, おとうさん. (3) **chamando** um parente dentro de casa: também おかあさん, おとうさん (ou ママ, パパ).",
    "**Mais velhos e mais novos têm palavras diferentes**: {兄|あに} e {姉|あね} (mais velhos), {弟|おとうと} e {妹|いもうと} (mais novos). Não existe um “irmão” genérico: ao dizer “meu irmão”, você escolhe entre あに e おとうと.",
    "**Irmãos mais novos** não são chamados de おとうと nem de いもうと em casa: usa-se o **nome** (たろう, たろうくん, はなこ). Já os mais velhos recebem o título: おにいさん, おねえさん (ou おにいちゃん, おねえちゃん, mais carinhoso).",
    "**Em grupo**: {家族|かぞく} (família), {両親|りょうしん} (pai e mãe, os pais), {兄弟|きょうだい} (irmãos, e também “irmãos e irmãs”), {姉妹|しまい} (irmãs)."
  ],
  tables: [
    { title: "Mesmo parente, três jeitos de dizer",
      head: ["Parente", "Minha família", "Família dos outros", "Chamando em casa"],
      rows: [
        ["pai", "{父|ちち}", "お{父|とう}さん", "おとうさん (パパ)"],
        ["mãe", "{母|はは}", "お{母|かあ}さん", "おかあさん (ママ)"],
        ["irmão mais velho", "{兄|あに}", "お{兄|にい}さん", "おにいさん, おにいちゃん"],
        ["irmã mais velha", "{姉|あね}", "お{姉|ねえ}さん", "おねえさん, おねえちゃん"],
        ["irmão mais novo", "{弟|おとうと}", "{弟|おとうと}さん", "pelo nome"],
        ["irmã mais nova", "{妹|いもうと}", "{妹|いもうと}さん", "pelo nome"],
        ["avô", "{祖父|そふ}", "おじいさん", "おじいちゃん"],
        ["avó", "{祖母|そぼ}", "おばあさん", "おばあちゃん"],
        ["filho", "{息子|むすこ}", "{息子|むすこ}さん", "pelo nome"],
        ["filha", "{娘|むすめ}", "{娘|むすめ}さん, お{嬢|じょう}さん", "pelo nome"],
        ["família", "{家族|かぞく}", "ご{家族|かぞく}", "—"]
      ] }
  ],
  ex: [
    ["わたしの **はは**は せんせいです。", "", "Minha mãe é professora.", "Minha própria mãe, falando com alguém de fora: はは."],
    ["やまださんの **おかあさん**は せんせいです。", "", "A mãe do Yamada é professora.", "Mãe de outra pessoa: おかあさん."],
    ["**あに**は かいしゃいんです。", "", "Meu irmão mais velho é funcionário de empresa.", "あに: irmão mais velho, o meu."],
    ["**おにいさん**は なんさいですか。", "", "Quantos anos tem o seu irmão mais velho?", "Irmão mais velho do outro: おにいさん."],
    ["**おかあさん**、ごはんは まだですか。", "", "Mãe, a comida ainda não está pronta?", "Chamando a própria mãe em casa: おかあさん."],
    ["**あに**と **いもうと**が います。", "", "Tenho um irmão mais velho e uma irmã mais nova.", "Sempre se diz se é mais velho ou mais novo."],
    ["**おとうさん**は おげんきですか。", "", "O seu pai está bem?", "Perguntando pelo pai do outro."],
    ["**ちち**と **はは**は ブラジルに すんで います。", "", "Meus pais moram no Brasil.", "Pais, ao falar com gente de fora: ちち e はは."]
  ],
  care: [
    "Falando com gente de fora, não use **お～さん** para a sua família: ✗ おかあさんは せんせいです (para dizer que a SUA mãe é professora); ✓ はは.",
    "Em casa é o contrário: você **chama** sua mãe de おかあさん, e não de はは. As palavras humildes servem para **falar dela** com os outros, não para **chamá-la**.",
    "Na boca de outra pessoa, a sua はは vira おかあさん: cada um usa a palavra humilde para o próprio lado e a respeitosa para o lado dos outros.",
    "**おにいさん** e **おねえさん** também servem para chamar, com simpatia, um rapaz ou uma moça jovem que não é da família (em lojas, por exemplo)."
  ],
  practice: [["Vocabulário (categoria Família)", "vocabulario.html"]]
},

{ id: "kosoado", title: "これ, それ, あれ (este, esse, aquele)",
  summary: "As palavras para apontar: perto de mim, perto de você, longe de nós.",
  use: [
    "O japonês usa três distâncias para apontar coisas: **perto de quem fala** (こ), **perto de quem ouve** (そ) e **longe dos dois** (あ). Uma quarta série, **ど**, serve para perguntar “qual?”.",
    "Boa notícia: funciona quase como “este / esse / aquele” em português. こ = este, そ = esse, あ = aquele."
  ],
  form: [
    "**Coisa, sozinha**: これ (isto), それ (isso), あれ (aquilo), どれ (qual?).",
    "**Antes de um substantivo**: この (este…), その (esse…), あの (aquele…), どの (qual…?). Exemplo: この ほん = este livro.",
    "**Lugar**: ここ (aqui), そこ (aí), あそこ (ali), どこ (onde?)."
  ],
  ex: [
    ["**これ**は ほんです。", "", "Isto é um livro.", "これ está sozinho, sem substantivo depois."],
    ["**それ**は なんですか。", "", "O que é isso? (perto de você)", "それ aponta para algo perto de quem ouve."],
    ["**あれ**は がっこうです。", "", "Aquilo é uma escola.", "あれ: longe de nós dois."],
    ["**この** かばんは わたしのです。", "", "Esta bolsa é minha.", "この vem antes do substantivo (かばん)."],
    ["トイレは **あそこ**です。", "", "O banheiro é ali.", "あそこ: um lugar longe de nós."],
    ["トイレは **どこ**ですか。", "", "Onde fica o banheiro?", "どこ pergunta o lugar."]
  ],
  care: [
    "**これ, それ, あれ** nunca vêm junto de um substantivo. Diga この ほん (este livro), e não これ ほん.",
    "O **そ** é o que fica perto de **quem ouve**. Se a outra pessoa segura um objeto e você pergunta sobre ele, o japonês usa それ.",
    "Para lembrar: tudo que começa com **こ** é “perto de mim”, **そ** é “perto de você”, **あ** é “longe” e **ど** é pergunta."
  ],
  practice: []
},

{ id: "adj-i", title: "Adjetivos い",
  summary: "Adjetivos que terminam em い e mudam de forma sozinhos.",
  use: [
    "Muitos adjetivos japoneses terminam em **い**: たかい (caro/alto), おおきい (grande), あつい (quente). São os **adjetivos い**.",
    "Eles se conjugam **sozinhos**: o próprio adjetivo muda para o negativo e para o passado. O です só acrescenta educação."
  ],
  form: [
    "**Antes de um substantivo**: adjetivo + substantivo, sem partícula: たかい ほん (livro caro).",
    "**No fim da frase, educado**: adjetivo + です: たかいです (é caro).",
    "**Negativo**: troque い por **くない**: たかくない → たかくないです (não é caro).",
    "**Passado**: troque い por **かった**: たかかった → たかかったです (era caro).",
    "**Passado negativo**: troque い por **くなかった**: たかくなかったです (não era caro).",
    "O **いい** (bom) é irregular: usa a base **よ**. よくない (não é bom), よかった (era bom)."
  ],
  ex: [
    ["この ほんは **たかい**です。", "", "Este livro é caro.", ""],
    ["**あつい** コーヒー", "", "café quente", "Antes de um substantivo não há です nem partícula."],
    ["きょうは あつ**くない**です。", "", "Hoje não está quente.", "あつい → あつくない."],
    ["きのうは あつ**かった**です。", "", "Ontem estava quente.", "あつい → あつかった."],
    ["きのうは あつ**くなかった**です。", "", "Ontem não estava quente.", ""],
    ["この ほんは **よくない**です。", "", "Este livro não é bom.", "いい é irregular: よくない, e não いくない."]
  ],
  care: [
    "O passado e o negativo estão **no adjetivo**, e o です não conjuga. Diga たかかったです, e não たかいでした.",
    "Entre amigos, o です some: たかい, たかくない, たかかった.",
    "Pegadinha: **きれい** (bonito/limpo) e **ゆうめい** (famoso) terminam em い, mas são adjetivos **な**. Eles estão no próximo tópico."
  ],
  practice: [["Conjugação de adjetivos", "conjugacao-adjetivos.html"]]
},

{ id: "adj-na", title: "Adjetivos な",
  summary: "Adjetivos que ganham な antes do substantivo.",
  use: [
    "O segundo grupo de adjetivos não termina em い e usa **な** antes do substantivo: きれいな はな (flor bonita), しずかな まち (cidade tranquila). São os **adjetivos な**.",
    "Eles se comportam como um **substantivo + です**: a conjugação é igual à que você já viu em です."
  ],
  form: [
    "**Antes de um substantivo**: adjetivo + **な** + substantivo: しずかな へや (quarto silencioso).",
    "**No fim da frase**: adjetivo + です: しずかです (é silencioso).",
    "**Negativo**: しずか**じゃありません**. **Passado**: しずか**でした**. **Passado negativo**: しずか**じゃありませんでした**."
  ],
  ex: [
    ["**しずかな** まちです。", "", "É uma cidade tranquila.", ""],
    ["この へやは **きれい**です。", "", "Este quarto é bonito (limpo).", "きれい quer dizer “bonito” e também “limpo”."],
    ["**きれいな** はなです。", "", "É uma flor bonita.", "Antes de substantivo: きれい + な."],
    ["ここは **しずか**じゃありません。", "", "Aqui não é tranquilo.", "Negativo igual ao do substantivo."],
    ["きのうは **ひま**でした。", "", "Ontem eu estava livre (sem compromisso).", "Passado: でした."],
    ["**ゆうめいな** ひとです。", "", "É uma pessoa famosa.", "ゆうめい termina em い, mas é adjetivo な."]
  ],
  care: [
    "O **な** só aparece **antes de um substantivo**. No fim da frase ele some: しずかです, e não しずかなです.",
    "Pegadinhas que terminam em い e são な: **きれい**, **ゆうめい**. Quando aprender uma palavra nova, confira o grupo dela no dicionário (い ou な).",
    "Se a palavra tem de ser “conjugada” como um substantivo (じゃありません, でした), ela é um adjetivo な."
  ],
  practice: [["Conjugação de adjetivos", "conjugacao-adjetivos.html"]]
},

{ id: "masu", title: "Forma ます",
  summary: "A forma educada dos verbos.",
  use: [
    "Em japonês, o verbo fica no **fim da frase** e tem uma forma educada, terminada em **ます**. É a forma que você usa com desconhecidos, no trabalho e na maioria das situações.",
    "O ます não muda com a pessoa: たべます serve para eu, você, ele, nós e eles. Ele indica **presente ou futuro**, e não existe uma forma separada para o futuro.",
    "No dicionário, o verbo aparece na **forma do dicionário** (たべる, いく). A forma ます é feita a partir dela."
  ],
  form: [
    "**As quatro formas**: たべ**ます** (como/comerei), たべ**ません** (não como), たべ**ました** (comi), たべ**ませんでした** (não comi).",
    "**Verbos em る que perdem o る** (grupo 2): tire o る e acrescente ます. たべる → たべます, みる → みます.",
    "**Verbos do grupo 1**: troque a última sílaba pela da coluna い e acrescente ます. かう → かいます, いく → いきます, のむ → のみます, よむ → よみます.",
    "**Irregulares**: する → します (fazer), くる → きます (vir).",
    "Por enquanto, aprenda cada verbo já na forma ます e não se preocupe em separar os grupos."
  ],
  ex: [
    ["たべ**ます**。", "", "Eu como.", "A frase pode ser só o verbo: o sujeito aparece pelo contexto."],
    ["たべ**ません**。", "", "Eu não como.", "Negativo."],
    ["たべ**ました**。", "", "Eu comi.", "Passado."],
    ["たべ**ませんでした**。", "", "Eu não comi.", "Passado negativo."],
    ["あした いき**ます**。", "", "Eu vou amanhã.", "O ます também vale para o futuro."],
    ["べんきょう**します**。", "", "Eu estudo.", "する é irregular: べんきょう (estudo) + します."]
  ],
  care: [
    "O sujeito não aparece: たべます pode ser “como”, “come” ou “comemos”, conforme o contexto.",
    "**ません** é a negação dos verbos, e **じゃありません** é a negação do です. Não troque um pelo outro.",
    "Entre amigos, o japonês usa a forma do dicionário (たべる, いく) no lugar de ます."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"]]
},

{ id: "wo", title: "A partícula を",
  summary: "Marca o objeto: aquilo sobre o que a ação recai.",
  use: [
    "**を** marca o **objeto** do verbo: aquilo que é comido, bebido, visto, lido. Em “como pão”, o “pão” é o objeto.",
    "A frase japonesa fica assim: **objeto + を + verbo**. O verbo sempre fecha a frase."
  ],
  form: [
    "**[Objeto] を [verbo]**: パンを たべます (como pão).",
    "O を lê-se **o** (como a letra お) e só é usado como partícula.",
    "Numa mesma frase ele convive com outras partículas: tempo (に), lugar (で) e objeto (を). Você verá isso nos próximos tópicos."
  ],
  ex: [
    ["パン**を** たべます。", "", "Eu como pão.", ""],
    ["コーヒー**を** のみます。", "", "Eu tomo café.", ""],
    ["テレビ**を** みます。", "", "Eu assisto TV.", ""],
    ["ほん**を** よみます。", "", "Eu leio um livro.", ""],
    ["おんがく**を** ききます。", "", "Eu ouço música.", ""],
    ["パン**を** たべませんでした。", "", "Eu não comi pão.", "O を continua igual no negativo e no passado."]
  ],
  care: [
    "A ordem é **diferente do português**: o objeto vem **antes** do verbo (“pão を como”). O verbo fica sempre no fim.",
    "Os verbos de movimento (ir, vir, voltar) não usam を para o destino: usam **に** (próximo tópico).",
    "Nem todo objeto do português usa を. “Gosto de música”, por exemplo, usa outra partícula (が), que você verá mais adiante."
  ],
  practice: [["Lacuna (modo Partículas)", "lacuna.html"]]
},

{ id: "ni-de", title: "に e で",
  summary: "に para destino e tempo; で para o lugar da ação e o meio.",
  use: [
    "**に** marca um **ponto**: o destino de um movimento, o dia ou a hora em que algo acontece.",
    "**で** marca o **lugar onde a ação acontece** e também o **meio** usado (de ônibus, de trem)."
  ],
  form: [
    "**に (destino)**: がっこうに いきます (vou à escola).",
    "**に (tempo)**: にちようびに いきます (vou no domingo).",
    "**で (lugar da ação)**: がっこうで べんきょうします (estudo na escola).",
    "**で (meio)**: バスで いきます (vou de ônibus).",
    "Dica: se a ação **acontece** naquele lugar, use **で**. Se o lugar é o ponto de chegada, use **に**."
  ],
  ex: [
    ["がっこう**に** いきます。", "", "Vou à escola.", "に marca o destino."],
    ["にちようび**に** いきます。", "", "Vou no domingo.", "に também marca o dia. Com あした ou きょう não se usa に."],
    ["がっこう**で** べんきょうします。", "", "Estudo na escola.", "で: o lugar onde a ação acontece."],
    ["レストラン**で** ごはんを たべます。", "", "Eu como no restaurante.", "ごはん quer dizer arroz cozido e também refeição."],
    ["バス**で** いきます。", "", "Vou de ônibus.", "で também marca o meio de transporte."],
    ["にちようび**に** レストラン**で** ごはん**を** たべます。", "", "No domingo, eu como no restaurante.", "Tempo に, lugar で e objeto を juntos."]
  ],
  care: [
    "Os verbos **いきます, きます** e **かえります** (voltar) usam **に** para o destino, e não で. Diga がっこうに いきます, e não がっこうで いきます.",
    "Em português, “em” serve para os dois: “estudo **na** escola” (で) e “vou **à** escola” (に). Pergunte-se: o lugar é onde a ação acontece ou para onde vou?",
    "**へ** também marca destino: がっこうへ いきます. Escreve-se へ, mas lê-se “e”. É quase igual a に, que é mais comum."
  ],
  practice: [["Lacuna (modo Partículas)", "lacuna.html"]]
},

{ id: "aru-iru", title: "ある e いる",
  summary: "Existir e estar: ある para coisas, いる para pessoas e animais.",
  use: [
    "Para dizer que algo **existe** ou **está** em algum lugar, o japonês usa dois verbos: **ある** para coisas e plantas, e **いる** para pessoas e animais.",
    "Eles não são “ser”. O です liga A e B (A é B). O ある e o いる dizem que A **existe/está** em um lugar."
  ],
  form: [
    "**Coisa**: **lugar に coisa が あります**: へやに ほんが あります (há um livro no quarto).",
    "**Pessoa ou animal**: **lugar に pessoa が います**: へやに ねこが います (há um gato no quarto).",
    "**に** diz **onde** e **が** diz **o que existe**: o が marca a coisa nova que você está apresentando.",
    "Negativo: **ありません / いません**. Passado: **ありました / いました**.",
    "Perguntas: **なにが ありますか** (o que há?) e **だれが いますか** (quem está?)."
  ],
  ex: [
    ["へや**に** ほん**が** あります。", "", "Há um livro no quarto.", ""],
    ["へや**に** ねこ**が** います。", "", "Há um gato no quarto.", "います, porque é um animal."],
    ["つくえの うえ**に** ほん**が** あります。", "", "Há um livro em cima da mesa.", "うえ = em cima. O の liga つくえ e うえ: “cima da mesa”."],
    ["いえ**に** テレビ**が** ありません。", "", "Não há TV em casa.", ""],
    ["きょうしつ**に** だれ**が** いますか。", "", "Quem está na sala de aula?", ""],
    ["わたしは いもうと**が** います。", "", "Eu tenho uma irmã mais nova.", "Para falar de família, usa-se います."]
  ],
  care: [
    "**Pessoas e animais**: います. **Todo o resto** (coisas, plantas, árvores): あります.",
    "O lugar de ある e いる usa **に**, e não で. Diga へやに あります, e não へやで あります.",
    "O foco é a existência. Dizer “tenho um irmão mais velho” em japonês é “existe um irmão mais velho para mim”: わたしは あにが います."
  ],
  practice: [["Lacuna (modo Partículas)", "lacuna.html"]]
},

{ id: "aru-mais", title: "ある: ter, haver e muito mais",
  summary: "Os outros sentidos do ある: ter, haver (um evento), “um certo”, o negativo ない e a origem do ありがとう.",
  use: [
    "Você já viu o ある como “existir”. O japonês usa esse mesmo verbo para **ter** e para **haver**, porque pensa assim: se o tempo **existe** para mim, eu **tenho** tempo. Se uma prova **existe** amanhã, **tem** prova amanhã.",
    "Então o ある cobre quatro situações: **ter** (coisas, tempo, dinheiro, dúvidas), **haver um evento** (prova, reunião, festa), **“um certo”** (ある{日|ひ}, ある{人|ひと}) e o seu **negativo**, que não é “あらない”, e sim **ない**.",
    "No fim do tópico há uma curiosidade: o **ありがとう** (obrigado/a) vem do ある."
  ],
  form: [
    "**Ter**: **pessoa は coisa が あります**. {時間|じかん}が あります (tenho tempo), お{金|かね}が あります (tenho dinheiro), {質問|しつもん}が あります (tenho uma pergunta). A coisa que você tem leva **が**.",
    "**Haver um evento**: **lugar で evento が あります**. {教室|きょうしつ}で {会議|かいぎ}が あります (vai haver uma reunião na sala). Para eventos o lugar leva **で**, e não に.",
    "**Um certo**: **ある + substantivo**, sem が e sem に. ある{日|ひ} (um certo dia, “um dia”), ある{人|ひと} (uma certa pessoa). Aqui o ある é uma palavra fixa que só vem antes de substantivo, e não conjuga.",
    "**Negativo**: **ありません** (educado) e **ない** (curto). O passado é **ありませんでした** e **なかった**. Não existe “あらない” nem “あらなかった”: o negativo do ある é uma palavra à parte, o **ない**.",
    "**ある x あります**: **あります** é a forma educada e **ある** é a curta, usada com amigos e dentro de frases maiores (você verá a forma curta no tópico de fala informal).",
    "**Com pessoas, volte ao います**: “eu tenho um irmão mais velho” é **わたしは あにが います**, e não “あにが あります”. “Ter” coisas, tempo e dinheiro é ある. “Ter” gente (família, amigos) é いる, e o que se tem leva が. (A diferença entre ある e いる está no tópico anterior.)",
    "**ありがとう**: vem de **{有|あ}り{難|がた}い**, que junta ある com **がたい** (difícil). Quer dizer “difícil de existir”: o que é **raro** é **precioso**, e quem recebe algo precioso fica **grato**. O ありがとう de hoje é essa palavra com o som suavizado, e se escreve em kana."
  ],
  ex: [
    ["{時間|じかん}が あります。", "", "Tenho tempo.", "Literalmente: “existe tempo (para mim)”."],
    ["わたしは お{金|かね}が ありません。", "", "Não tenho dinheiro.", "ありません: o negativo educado do ある."],
    ["{質問|しつもん}が あります。", "", "Tenho uma pergunta.", "Dúvida, pergunta, ideia, plano: tudo isso “existe”, então é ある."],
    ["{明日|あした}、{試験|しけん}が あります。", "", "Amanhã tem prova.", "Evento marcado: ある, e não する."],
    ["{教室|きょうしつ}で {会議|かいぎ}が あります。", "", "Vai haver uma reunião na sala.", "Evento: lugar + **で**. Para coisas seria に."],
    ["ある{日|ひ}、{山|やま}へ {行|い}きました。", "", "Um dia, fui à montanha.", "ある{日|ひ} abre uma história sem dizer qual dia."],
    ["ある{人|ひと}が {来|き}ました。", "", "Veio uma certa pessoa.", "Quem fala sabe quem foi, mas não diz."],
    ["{今日|きょう}は {宿題|しゅくだい}が ない。", "", "Hoje não tem lição de casa.", "ない = a forma curta de ありません."],
    ["わたしは あにが います。", "", "Tenho um irmão mais velho.", "A conta que muita gente erra: “ter” irmão é **います**, e não あります."],
    ["ありがとう。", "", "Obrigado(a).", "有り難い: “difícil de existir”, logo raro e precioso."]
  ],
  care: [
    "**Pessoas e animais**: います, mesmo quando o português diz “tenho”. わたしは あにが います está certo, e あにが あります soa como se seu irmão fosse um objeto.",
    "O negativo é **ない** (ou ありません). **Nunca** あらない ou あらません.",
    "**Evento** pede **で** ({教室|きょうしつ}で {会議|かいぎ}が あります). **Existência** pede **に** (へやに ほんが あります).",
    "O **ある** de “um certo” **não** é o verbo: não leva が, não conjuga e só vem antes de substantivo. ある{日|ひ} é “um dia”, e não “há um dia”.",
    "Para “já fiz isso na vida” o ある aparece em outra estrutura: veja o tópico **～たことがある**."
  ],
  practice: [["Lacuna (modo Partículas)", "lacuna.html"], ["Kotonoha", "kotonoha.html"]]
},

{ id: "ga", title: "が",
  summary: "O が marca quem faz algo e a coisa de que você gosta, em que é bom ou que quer.",
  use: [
    "**が** marca o **sujeito** quando você quer apontar **quem** ou **o quê** faz algo, sobretudo se for uma informação nova. Com だれ (quem), a pergunta e a resposta usam が.",
    "Com alguns adjetivos de gosto e habilidade, a coisa em foco também leva **が**: すき (gostar), きらい (não gostar), じょうず (bom em), へた (ruim em) e ほしい (querer ter). Em português diríamos “gosto **de** café”; em japonês, é como “quanto ao café, há gosto”.",
    "Compare com **は**: は apresenta o **assunto** sobre o qual você vai falar; が destaca **quem** ou **o quê**."
  ],
  form: [
    "**Sujeito**: substantivo + が + verbo. あめが ふります (chove).",
    "**Gostar / não gostar**: pessoa は + coisa が すきです / きらいです.",
    "**Habilidade**: coisa が じょうずです / へたです.",
    "**Querer ter algo**: coisa が ほしいです.",
    "Com **だれ**, **なに** ou **どこ** no papel de sujeito, use が: だれが きますか。"
  ],
  ex: [
    ["だれ**が** きますか。", "", "Quem vem?", "Com だれ, o sujeito leva が."],
    ["たなかさん**が** きます。", "", "Tanaka-san vem.", "A resposta também usa が: a informação nova é quem vem."],
    ["わたしは コーヒー**が** すきです。", "", "Eu gosto de café.", "O café é a coisa marcada com が."],
    ["やさい**が** きらいです。", "", "Eu não gosto de verduras.", "きらい é forte, quase “detesto”. Para suavizar, diga すきじゃありません."],
    ["にほんご**が** じょうずです。", "", "Seu japonês é bom.", "Elogio a outra pessoa. Falando de si mesmo, o natural é a modéstia."],
    ["みず**が** ほしいです。", "", "Eu quero água.", "ほしい: querer ter algo."]
  ],
  care: [
    "Com **すき, きらい, じょうず** e **へた**, use **が**, e não を. Diga コーヒーが すきです, e não コーヒーを すきです.",
    "**は** e **が** mudam a ênfase: たなかさんは がくせいです fala **sobre** Tanaka-san; たなかさんが がくせいです quer dizer “é Tanaka-san quem é estudante”.",
    "Em perguntas com **だれ** ou **なに** como sujeito, o natural é が (だれが きますか), e não だれは."
  ],
  practice: [["Lacuna (modo Partículas)", "lacuna.html"]]
},

{ id: "he-to", title: "へ e と",
  summary: "へ para direção; と para “e” entre substantivos e para “com”.",
  use: [
    "**へ** marca a **direção** de um movimento: para onde você vai, vem ou volta. Escreve-se へ, mas, como partícula, lê-se **え**. Na prática, funciona como o に de destino.",
    "**と** tem dois usos: liga substantivos (“pão **e** ovo”) e marca a pessoa que faz algo **com** você (“vou **com** a família”)."
  ],
  form: [
    "**へ (direção)**: lugar + へ + いきます / きます / かえります. にほんへ いきます.",
    "**と (e)**: substantivo + と + substantivo. パンと たまご. Liga só substantivos, não verbos nem adjetivos.",
    "**と (com)**: pessoa + と + verbo. ともだちと いきます.",
    "O と de “e” lista **tudo** o que há: パンと たまご quer dizer “pão e ovo, e mais nada”."
  ],
  ex: [
    ["にほん**へ** いきます。", "", "Vou ao Japão.", "へ marca a direção e se lê “e”."],
    ["うち**へ** かえります。", "", "Volto para casa.", ""],
    ["ともだち**と** いきます。", "", "Vou com um(a) amigo(a).", "と marca com quem."],
    ["パン**と** たまご**を** たべます。", "", "Como pão e ovo.", "と liga os dois substantivos; を marca o objeto do verbo."],
    ["たなかさん**と** やまださん**が** きます。", "", "Tanaka-san e Yamada-san vêm.", ""],
    ["かぞく**と** にほん**へ** いきます。", "", "Vou ao Japão com a família.", "Os dois usos juntos: と (com) e へ (direção)."]
  ],
  care: [
    "**へ ou に?** Para destino, os dois servem: がっこうへ いきます e がっこうに いきます. Para **tempo**, só に: にちようびに, nunca にちようびへ.",
    "O **と** de “e” liga só substantivos. Para ligar ações (“como e bebo”), o japonês usa a forma て (tópico “Forma て”).",
    "Ao ler, lembre: a partícula へ soa “e”, mas dentro de uma palavra (como へや, quarto) continua “he”."
  ],
  practice: [["Lacuna (modo Partículas)", "lacuna.html"]]
},

{ id: "kara-made", title: "から e まで",
  summary: "から marca o ponto de partida, まで o ponto final, e から também dá o motivo.",
  use: [
    "**から** marca o **ponto de partida**, no tempo ou no espaço: “a partir de”, “de”. **まで** marca o **ponto final**: “até”.",
    "Os dois costumam vir juntos: **くじから ごじまで** (das nove às cinco).",
    "Depois de uma frase, **から** dá o **motivo**: “porque”, “como”. Em português o “porque” vem antes do motivo; em japonês, **から** vem **depois** dele."
  ],
  form: [
    "**Tempo**: hora ou dia + から / まで. あしたから (a partir de amanhã), ごじまで (até as cinco).",
    "**Lugar**: lugar + から / まで. とうきょうから おおさかまで (de Tóquio até Osaka).",
    "**Motivo**: frase com です ou ます + から. O motivo vem primeiro, depois o resultado: あついですから、みずを のみます."
  ],
  ex: [
    ["くじ**から** ごじ**まで** はたらきます。", "", "Trabalho das nove às cinco.", "くじ: nove horas; ごじ: cinco horas."],
    ["とうきょう**から** おおさか**まで** でんしゃで いきます。", "", "Vou de trem de Tóquio até Osaka.", ""],
    ["あした**から** べんきょうします。", "", "Vou estudar a partir de amanhã.", "あした não leva に, mas から sim."],
    ["にちようび**まで** やすみです。", "", "Estou de folga até domingo.", ""],
    ["あついです**から**、みずを のみます。", "", "Como está calor, tomo água.", "O motivo vem primeiro e termina em から."],
    ["にほんごが すきです**から**、まいにち べんきょうします。", "", "Como gosto de japonês, estudo todo dia.", ""]
  ],
  care: [
    "**まで** indica até onde algo **continua**. Para um momento exato, use に: ごじまで はたらきます (trabalho até as cinco), ごじに かえります (volto às cinco).",
    "No motivo, o **から** vem no fim do **motivo**, e não no começo do resultado: あついですから、みずを のみます.",
    "**から** também quer dizer “de” (origem): ブラジルから きました (vim do Brasil)."
  ],
  practice: [["Contadores e números", "contadores.html"], ["Lacuna (modo Partículas)", "lacuna.html"]]
},

{ id: "tai", title: "～たい",
  summary: "Como dizer o que você quer fazer.",
  use: [
    "**～たい**, acrescentado ao verbo, quer dizer “**querer** fazer”: たべたい (quero comer), いきたい (quero ir).",
    "Ele se comporta como um **adjetivo い**: たべたいです (educado), たべたくないです (não quero), たべたかったです (eu queria)."
  ],
  form: [
    "**Como formar**: pegue a forma ます, tire o **ます** e acrescente **たい**. たべます → たべ**たい**, いきます → いき**たい**, のみます → のみ**たい**, します → し**たい**.",
    "**Educado**: たいです. **Negativo**: たくないです. **Passado**: たかったです. **Passado negativo**: たくなかったです.",
    "O **objeto** aceita を ou が: みずを のみたいです / みずが のみたいです.",
    "**Pergunta**: acrescente か. なにを たべたいですか。"
  ],
  ex: [
    ["ラーメン**を** たべ**たい**です。", "", "Quero comer ramen.", ""],
    ["にほん**へ** いき**たい**です。", "", "Quero ir ao Japão.", ""],
    ["たべ**たく**ないです。", "", "Não quero comer.", "たい vira たく no negativo, como todo adjetivo い."],
    ["コーヒー**を** のみ**たい**ですか。", "", "Você quer tomar um café?", ""],
    ["きのう いき**たかった**です。", "", "Eu queria ir ontem.", "Passado: たい → たかった."],
    ["なつやすみ**に** なに**を** し**たい**ですか。", "", "O que você quer fazer nas férias de verão?", ""]
  ],
  care: [
    "Tire o **ます** antes de acrescentar: たべます**たい** está errado; o certo é たべ**たい**.",
    "O negativo segue o adjetivo い: たべ**たくない**, e não たべたいじゃありません.",
    "**～たい** é para o **seu** desejo (ou para perguntar o do outro). Para contar o que uma terceira pessoa quer, a forma muda (por exemplo ～たがっています); por ora, use ～たい só para você.",
    "Para querer uma **coisa** (um substantivo), use ほしい: みずが ほしいです."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"]]
},

{ id: "mashou", title: "～ましょう e ～ませんか",
  summary: "Como sugerir e convidar: vamos fazer? quer fazer?",
  use: [
    "**～ましょう** é o “**vamos**…”: uma sugestão ou um convite para fazer algo junto. Troque o ます do verbo por ましょう.",
    "**～ませんか** é um convite mais **suave**, em forma de pergunta negativa: “não quer…?”, “que tal…?”. Costuma ser a escolha de quem convida.",
    "**～ましょうか** é uma pergunta: “**vamos**…?” ou uma oferta: “quer que eu…?”."
  ],
  form: [
    "**Vamos**: たべ**ます** → たべ**ましょう**.",
    "**Convite**: たべ**ます** → たべ**ませんか**.",
    "**Vamos…? / Quer que eu…?**: たべ**ましょうか**.",
    "**Aceitar**: ええ、いきましょう (sim, vamos) ou いいですね (que bom)."
  ],
  ex: [
    ["いっしょに たべ**ましょう**。", "", "Vamos comer juntos.", ""],
    ["いっしょに いき**ませんか**。", "", "Quer ir junto?", "Parece uma negação, mas é um convite educado."],
    ["ひるごはんを たべ**ませんか**。", "", "Quer almoçar?", ""],
    ["うちへ かえり**ましょう**。", "", "Vamos para casa.", ""],
    ["コーヒーを のみ**ましょうか**。", "", "Vamos tomar um café?", "Também poderia ser uma oferta: “quer que eu faça um café?”, conforme o contexto."],
    ["ええ、いき**ましょう**。", "", "Sim, vamos.", "Resposta a um convite como いっしょに いきませんか。"]
  ],
  care: [
    "**ませんか** parece negativo, mas é um convite. Na resposta, ええ、いきましょう ou いいですね aceitam; um いいえ seria uma recusa.",
    "**ましょう** vale para fazer **junto** (quem fala participa). Para pedir que o outro faça algo, use ～てください.",
    "Entre amigos, o japonês usa formas curtas (たべよう no lugar de たべましょう)."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"]]
},

{ id: "te", title: "Forma て",
  summary: "A forma て liga ações e é a base de muitos padrões.",
  use: [
    "A **forma て** é uma forma do verbo que **não fecha a frase sozinha**: ela liga uma ação à seguinte (“acordo **e** tomo café”) e serve de base para padrões como ～てください e ～ている.",
    "Ela não marca presente nem passado: quem marca é o **último verbo** da frase.",
    "Sozinha, no fim da frase, a forma て vira um **pedido informal**, entre amigos e família: まって (espere), のんで (beba), たべて (coma). É o ～てください sem o ください. Cumpre o papel do “espere!” e do “beba!” do português, mas de modo suave: o imperativo seco do japonês (まて) é outra forma, brusca, que fica para mais adiante."
  ],
  form: [
    "**Verbos em る do grupo 2**: tire o る e acrescente て. たべる → たべて, みる → みて, おきる → おきて.",
    "**Irregulares**: する → して, くる → きて.",
    "**Grupo 1** (os demais), conforme a última sílaba: **う, つ, る → って** (かう → かって, まつ → まって, のる → のって); **む, ぶ → んで** (のむ → のんで, あそぶ → あそんで); **く → いて** (かく → かいて); **ぐ → いで** (およぐ → およいで); **す → して** (はなす → はなして).",
    "**Exceção**: いく → いって (e não いいて).",
    "Verbos em る podem ser do grupo 1 ou do 2: かえる → かえって (grupo 1), たべる → たべて (grupo 2). Aprenda cada verbo junto com a forma て; o treino de conjugação ajuda."
  ],
  ex: [
    ["あさ おき**て**、コーヒーを のみます。", "", "De manhã acordo e tomo café.", "おきる (grupo 2): tira o る."],
    ["ごはんを たべ**て**、ねます。", "", "Como e vou dormir.", "Só o último verbo (ねます) marca o tempo."],
    ["ともだちに あっ**て**、えいがを みます。", "", "Encontro um(a) amigo(a) e depois vejo um filme.", "あう → あって (う → って)."],
    ["ほんを よん**で**、ノートを かきます。", "", "Leio um livro e escrevo no caderno.", "よむ → よんで (む → んで)."],
    ["でんしゃに のっ**て**、かいしゃへ いきます。", "", "Pego o trem e vou à empresa.", "のる → のって (grupo 1)."],
    ["ちょっと まっ**て**。", "", "Espere um pouco.", "A forma て sozinha é um pedido informal, entre amigos e família."]
  ],
  care: [
    "Só o **último verbo** indica o tempo: たべて、ねました (comi e dormi). Não ponha ました no primeiro.",
    "**いく** é exceção: いって, e não いいて.",
    "A forma て liga **verbos**. Para ligar substantivos, use と (パンと たまご).",
    "O **て sozinho** (まって, のんで) só serve com quem você tem intimidade. Com desconhecidos, clientes ou superiores, acrescente **ください**: まって ください.",
    "Aprenda cada verbo já com a forma て, em vez de decorar só a regra: assim você erra menos com os verbos em る."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"]]
},

{ id: "te-kudasai", title: "～てください",
  summary: "Como pedir, com educação, que alguém faça algo.",
  use: [
    "**～てください** (verbo na forma て + ください) é um **pedido educado**: “faça…, por favor”. Serve para pedir favores e dar instruções simples.",
    "Para pedir uma **coisa**, use substantivo + を + **ください**: みずを ください (água, por favor)."
  ],
  form: [
    "**Pedir uma coisa**: coisa + を + ください. みずを ください.",
    "**Pedir uma ação**: verbo na forma て + ください. まって ください.",
    "Para pedir que alguém **não** faça algo, existe outra forma (ないでください), que entra no Intermediário."
  ],
  ex: [
    ["みず**を ください**。", "", "Água, por favor.", "Substantivo + を + ください: pede uma coisa."],
    ["ここに き**て ください**。", "", "Venha aqui, por favor.", "くる → きて."],
    ["ゆっくり はなし**て ください**。", "", "Fale devagar, por favor.", "ゆっくり: devagar."],
    ["もう いちど いっ**て ください**。", "", "Diga mais uma vez, por favor.", "いう → いって."],
    ["ここで まっ**て ください**。", "", "Espere aqui, por favor.", "まつ → まって."],
    ["ちょっと み**て ください**。", "", "Olhe um instante, por favor.", ""]
  ],
  care: [
    "O **ください** sozinho pede uma **coisa**; para pedir uma **ação**, o verbo precisa estar na forma て: たべて ください, e não たべます ください.",
    "É um pedido, não uma ordem seca. Entre amigos, o japonês tira o ください e usa só a forma て (まって).",
    "Para pedir algo a quem merece mais respeito, existem formas ainda mais educadas (keigo, no Avançado)."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"]]
},

{ id: "te-iru", title: "～ている",
  summary: "Ação em andamento e estado que continua: estou fazendo, moro, sou casado(a).",
  use: [
    "**～ている** (verbo na forma て + いる) indica uma **ação em andamento**, como o “estar + -ndo” do português: たべて います (estou comendo).",
    "Com alguns verbos, mostra um **estado que continua** depois de uma mudança: すんで います (moro: mudei e continuo lá), けっこんして います (sou casado(a))."
  ],
  form: [
    "**Forma**: forma て + います. たべて います, すんで います.",
    "**Negativo**: ていません. **Passado**: ていました (eu estava…). **Pergunta**: ていますか.",
    "O います aqui é o mesmo verbo de ある e いる, mas só ajuda a dar a ideia de “estar fazendo”."
  ],
  ex: [
    ["いま ごはんを たべ**て います**。", "", "Agora estou comendo.", "Ação em andamento."],
    ["いま あめが ふっ**て います**。", "", "Agora está chovendo.", "ふる → ふって."],
    ["とうきょうに すん**で います**。", "", "Eu moro em Tóquio.", "Em japonês, “moro” é “estou morando”."],
    ["けっこんし**て います**。", "", "Sou casado(a).", "Estado que continua."],
    ["その ひとを しっ**て いますか**。", "", "Você conhece essa pessoa?", "しる → しって."],
    ["いいえ、しりません。", "", "Não, não conheço.", "O negativo de しっています é しりません."]
  ],
  care: [
    "Com **すむ**, diga **すんで います** para “moro”. すみます soa como “vou morar”.",
    "**しっています** quer dizer “sei / conheço”, mas o negativo é **しりません**, e não しっていません.",
    "**たべます** é o que você come (hábito ou futuro); **たべて います** é o que você está comendo agora. O português usa “como” para os dois."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"]]
},

{ id: "perguntas", title: "Perguntas: いつ, なに, どう",
  summary: "As palavras para perguntar quando, o quê, quem, como e por quê.",
  use: [
    "Em japonês, a pergunta mantém a **ordem da frase** e termina em **か**. Troque a parte que você quer saber por uma **palavra interrogativa** e acrescente か no fim.",
    "A palavra interrogativa fica **no lugar da resposta**: あした いきます → いつ いきますか。"
  ],
  form: [
    "**いつ** (quando): いつ いきますか。",
    "**なに / なん** (o quê): なにを たべますか。 Antes de です e の, aparece **なん**: なんですか。",
    "**だれ** (quem): だれが きますか。",
    "**どう** (como é / como está): にほんは どうですか。",
    "**どうして** (por quê): どうして べんきょうしますか。 A resposta termina em **から**."
  ],
  ex: [
    ["**いつ** いきますか。", "", "Quando você vai?", ""],
    ["**なに**を たべますか。", "", "O que você come?", "なに + を, porque é o objeto do verbo."],
    ["**だれ**が きますか。", "", "Quem vem?", ""],
    ["にほんは **どう**ですか。", "", "Como é o Japão?", "どうですか pergunta a opinião ou o estado: “e então, como é?”."],
    ["**どうして** にほんごを べんきょうしますか。", "", "Por que você estuda japonês?", ""],
    ["にほんが すきです**から**。", "", "Porque gosto do Japão.", "A resposta a どうして termina em から."]
  ],
  care: [
    "A palavra interrogativa não leva **は** como sujeito: use が (だれが きますか), e não だれは.",
    "**なに** ou **なん**? A diferença é só de som: なんですか, mas なにを たべますか.",
    "**どう** pergunta “como é?” (estado ou opinião). Não é “como se faz”.",
    "**どうして** (por quê) pede resposta com **から**: ... から。"
  ],
  practice: [["Lacuna (modo Partículas)", "lacuna.html"]]
}

] },
{ id: "intermediario", name: "Intermediário", level: "~N4-N3", topics: [
{ id: "ichidan-godan", title: "Verbos: ichidan e godan",
  summary: "Os dois grupos de verbos e como descobrir a qual grupo um verbo pertence.",
  use: [
    "Todo verbo japonês pertence a um de **dois grupos regulares** ou é um dos **dois irregulares**. Saber o grupo diz como o verbo muda nas formas ます, ない, て, た e em muitos outros padrões.",
    "**Ichidan** (grupo 2, “verbos る”): terminam sempre em る e só perdem o る antes da terminação: {食|た}べる → {食|た}べます. O nome quer dizer “um degrau”: o verbo praticamente não muda.",
    "**Godan** (grupo 1, “verbos u”): a última sílaba muda entre as cinco linhas あ, い, う, え e お (daí “cinco degraus”): {書|か}く → {書|か}きます, {書|か}かない, {書|か}けば, {書|か}こう.",
    "**Irregulares**: só dois, する (fazer) e {来|く}る (vir). Os verbos formados com する, como {勉強|べんきょう}する, seguem a regra de する."
  ],
  form: [
    "**Como reconhecer**: se o verbo **não termina em る**, ele é **godan**: {書|か}く, {読|よ}む, {話|はな}す, {買|か}う…",
    "Se termina em る, olhe a sílaba **antes** do る. Com **い ou え** (み, き, べ, め…), quase sempre é **ichidan**: {見|み}る, {起|お}きる, {食|た}べる, {寝|ね}る. Com **あ, う ou お** (ま, ふ, の…), é **godan**: {乗|の}る, ある.",
    "**Exceções**: alguns verbos parecem ichidan, mas são godan: {帰|かえ}る (voltar), {入|はい}る (entrar), {知|し}る (saber, conhecer), {走|はし}る (correr), {切|き}る (cortar), {減|へ}る (diminuir).",
    "**Ichidan**: tire o る e acrescente a terminação: {食|た}べる → {食|た}べ + ない.",
    "**Godan**: troque a última sílaba. **ます** usa a linha **い**; **ない** usa a linha **あ** (o う vira わ); **potencial** e **ば** usam a linha **え**; **volitiva** usa a linha **お**.",
    "**て e た no godan** seguem uma regra de som por final: **う, つ, る → って / った**; **む, ぶ, ぬ → んで / んだ**; **く → いて / いた**; **ぐ → いで / いだ**; **す → して / した**. Exceção: {行|い}く → {行|い}って / {行|い}った."
  ],
  tables: [
    { title: "Godan: o que muda em cada final (consulte quando encontrar um godan novo)",
      head: ["Final", "Dicionário", "ます", "ない", "て", "た", "Potencial", "ば", "Volitiva"],
      rows: [
        ["う", "{買|か}**う**", "{買|か}**い**ます", "{買|か}**わ**ない", "{買|か}**っ**て", "{買|か}**っ**た", "{買|か}**え**る", "{買|か}**え**ば", "{買|か}**お**う"],
        ["く", "{書|か}**く**", "{書|か}**き**ます", "{書|か}**か**ない", "{書|か}**い**て", "{書|か}**い**た", "{書|か}**け**る", "{書|か}**け**ば", "{書|か}**こ**う"],
        ["ぐ", "{泳|およ}**ぐ**", "{泳|およ}**ぎ**ます", "{泳|およ}**が**ない", "{泳|およ}**い**で", "{泳|およ}**い**だ", "{泳|およ}**げ**る", "{泳|およ}**げ**ば", "{泳|およ}**ご**う"],
        ["す", "{話|はな}**す**", "{話|はな}**し**ます", "{話|はな}**さ**ない", "{話|はな}**し**て", "{話|はな}**し**た", "{話|はな}**せ**る", "{話|はな}**せ**ば", "{話|はな}**そ**う"],
        ["つ", "{待|ま}**つ**", "{待|ま}**ち**ます", "{待|ま}**た**ない", "{待|ま}**っ**て", "{待|ま}**っ**た", "{待|ま}**て**る", "{待|ま}**て**ば", "{待|ま}**と**う"],
        ["ぬ", "{死|し}**ぬ**", "{死|し}**に**ます", "{死|し}**な**ない", "{死|し}**ん**で", "{死|し}**ん**だ", "{死|し}**ね**る", "{死|し}**ね**ば", "{死|し}**の**う"],
        ["ぶ", "{遊|あそ}**ぶ**", "{遊|あそ}**び**ます", "{遊|あそ}**ば**ない", "{遊|あそ}**ん**で", "{遊|あそ}**ん**だ", "{遊|あそ}**べ**る", "{遊|あそ}**べ**ば", "{遊|あそ}**ぼ**う"],
        ["む", "{読|よ}**む**", "{読|よ}**み**ます", "{読|よ}**ま**ない", "{読|よ}**ん**で", "{読|よ}**ん**だ", "{読|よ}**め**る", "{読|よ}**め**ば", "{読|よ}**も**う"],
        ["る", "{乗|の}**る**", "{乗|の}**り**ます", "{乗|の}**ら**ない", "{乗|の}**っ**て", "{乗|の}**っ**た", "{乗|の}**れ**る", "{乗|の}**れ**ば", "{乗|の}**ろ**う"]
      ] },
    { title: "Ichidan e irregulares, para comparar",
      head: ["Tipo", "Dicionário", "ます", "ない", "て", "た", "Potencial", "ば", "Volitiva"],
      rows: [
        ["Ichidan", "{食|た}べ**る**", "{食|た}べ**ます**", "{食|た}べ**ない**", "{食|た}べ**て**", "{食|た}べ**た**", "{食|た}べ**られる**", "{食|た}べ**れば**", "{食|た}べ**よう**"],
        ["Ichidan", "{見|み}**る**", "{見|み}**ます**", "{見|み}**ない**", "{見|み}**て**", "{見|み}**た**", "{見|み}**られる**", "{見|み}**れば**", "{見|み}**よう**"],
        ["する", "する", "**し**ます", "**し**ない", "**し**て", "**し**た", "**でき**る", "**す**れば", "**し**よう"],
        ["くる", "{来|く}る", "{来|き}ます", "{来|こ}ない", "{来|き}て", "{来|き}た", "{来|こ}られる", "{来|く}れば", "{来|こ}よう"]
      ] }
  ],
  ex: [
    ["{朝|あさ}ごはんを {食|た}べます。", "", "Eu tomo o café da manhã.", "{食|た}べる é ichidan: tira o る e acrescenta ます."],
    ["{本|ほん}を {読|よ}みます。", "", "Eu leio um livro.", "{読|よ}む é godan: む → み + ます."],
    ["{駅|えき}で {電車|でんしゃ}を {待|ま}ちます。", "", "Espero o trem na estação.", "{待|ま}つ é godan: つ → ち + ます."],
    ["{家|いえ}に {帰|かえ}ります。", "", "Volto para casa.", "Parece ichidan (tem え antes do る), mas {帰|かえ}る é godan."],
    ["{名前|なまえ}を {変|か}えます。", "", "Mudo o nome.", "{変|か}える (mudar) é ichidan; {帰|かえ}る (voltar) é godan, mesmo com a mesma leitura."],
    ["まいにち {日本語|にほんご}を {勉強|べんきょう}します。", "", "Estudo japonês todo dia.", "Verbos com する seguem a regra de する."]
  ],
  care: [
    "Não decida o grupo só pelo る: {食|た}べる (ichidan) e {乗|の}る (godan) terminam igual. Olhe a sílaba antes do る e aprenda as exceções.",
    "Ao aprender um verbo novo, guarde também a forma ます ou て: ela revela o grupo. Aprenda o verbo junto com o kanji, porque {帰|かえ}る (godan) e {変|か}える (ichidan) se leem igual.",
    "No godan em **う**, o う vira **わ** na forma ない: {買|か}わない, e não {買|か}あない.",
    "**ある** é godan, mas o negativo é ない, e não あらない.",
    "Só existe um verbo godan terminado em **ぬ**: {死|し}ぬ. O {行|い}く é exceção na tabela: o て e o た dele são いって e いった."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"]]
},

{ id: "jidoushi-tadoushi", title: "Verbos transitivos e intransitivos",
  summary: "Pares como {開|あ}ける e {開|あ}く: quem faz a ação (を) e o que acontece sozinho (が).",
  use: [
    "Muitos verbos japoneses vêm em **pares**: um diz que **alguém faz** algo (**transitivo**, {他動詞|たどうし}) e o outro diz que algo **acontece sozinho** (**intransitivo**, {自動詞|じどうし}). Em português costumamos usar um verbo só: “abrir” serve para “eu abro a porta” e para “a porta abre”.",
    "A diferença decide a **partícula**. O transitivo leva **を** na coisa afetada: ドアを {開|あ}ける. O intransitivo leva **が** no que muda: ドアが {開|あ}く.",
    "Saber o par ajuda a escolher entre を e が, e também a entender frases com ～ている e ～てある."
  ],
  form: [
    "**Transitivo** (alguém faz): **quem faz が + coisa を + verbo**. {私|わたし}が ドアを {開|あ}けます。 (Eu abro a porta.) Muitas vezes quem faz fica subentendido: ドアを {開|あ}けます。",
    "**Intransitivo** (acontece sozinho, sem falar de quem causou): **coisa が + verbo**. ドアが {開|あ}きます。 (A porta abre.)",
    "**Aprenda em pares**: o verbo do par que termina em **～ける, ～める, ～す** costuma ser o transitivo; o que termina em **～く, ～まる, ～れる** costuma ser o intransitivo. São **tendências**, não regra: confira a tabela.",
    "**Estado resultante**: o intransitivo com **～ている** mostra o resultado que continua: ドアが {開|あ}いて います (a porta está aberta). O transitivo com **～てある** mostra que alguém deixou assim de propósito: ドアが {開|あ}けて あります (a porta foi aberta e está assim)."
  ],
  tables: [
    { title: "Pares comuns (intransitivo が ↔ transitivo を)",
      head: ["Intransitivo (が)", "Transitivo (を)", "Significado"],
      rows: [
        ["{開|あ}く", "{開|あ}ける", "abrir (a porta abre / eu abro a porta)"],
        ["{閉|し}まる", "{閉|し}める", "fechar"],
        ["つく", "つける", "ligar (a luz acende / eu acendo a luz)"],
        ["{消|き}える", "{消|け}す", "apagar (a luz apaga / eu apago a luz)"],
        ["{始|はじ}まる", "{始|はじ}める", "começar"],
        ["{止|と}まる", "{止|と}める", "parar (o carro para / eu paro o carro)"],
        ["{続|つづ}く", "{続|つづ}ける", "continuar"],
        ["{集|あつ}まる", "{集|あつ}める", "juntar-se / juntar"],
        ["{決|き}まる", "{決|き}める", "ficar decidido / decidir"],
        ["{変|か}わる", "{変|か}える", "mudar (por si / alguém muda algo)"],
        ["{落|お}ちる", "{落|お}とす", "cair / derrubar"],
        ["{壊|こわ}れる", "{壊|こわ}す", "quebrar (estragar) / quebrar algo"],
        ["{割|わ}れる", "{割|わ}る", "partir-se / partir"],
        ["{入|はい}る", "{入|い}れる", "entrar / pôr dentro"],
        ["{出|で}る", "{出|だ}す", "sair / tirar, pôr para fora"],
        ["{起|お}きる", "{起|お}こす", "acordar, levantar / acordar alguém"],
        ["{冷|ひ}える", "{冷|ひ}やす", "esfriar / esfriar algo"],
        ["{沸|わ}く", "{沸|わ}かす", "ferver (a água ferve) / ferver algo"],
        ["{動|うご}く", "{動|うご}かす", "mover-se / mover algo"],
        ["{増|ふ}える", "{増|ふ}やす", "aumentar / aumentar algo"]
      ] }
  ],
  ex: [
    ["ドアを {開|あ}けます。", "", "Eu abro a porta.", "Transitivo: alguém faz, e a coisa leva を."],
    ["ドアが {開|あ}きます。", "", "A porta abre.", "Intransitivo: a porta se abre, e vem com が."],
    ["{電気|でんき}を {消|け}して ください。", "", "Apague a luz, por favor.", "{消|け}す é transitivo: を."],
    ["{電気|でんき}が {消|き}えました。", "", "A luz apagou.", "{消|き}える é intransitivo: が. O kanji 消 lê け ou き."],
    ["{子供|こども}が コップを {落|お}としました。", "", "A criança derrubou o copo.", "{落|お}とす: transitivo, com を."],
    ["コップが {落|お}ちました。", "", "O copo caiu.", "{落|お}ちる: intransitivo, com が."],
    ["{窓|まど}が {開|あ}いて います。", "", "A janela está aberta.", "Intransitivo + ～ている: o resultado que continua."],
    ["{窓|まど}が {開|あ}けて あります。", "", "A janela foi deixada aberta.", "Transitivo + ～てある: alguém abriu de propósito e ficou assim."],
    ["{会議|かいぎ}が {九時|くじ}に {始|はじ}まります。", "", "A reunião começa às nove.", "{始|はじ}まる: intransitivo. A reunião “começa sozinha”."],
    ["{先生|せんせい}が {授業|じゅぎょう}を {始|はじ}めます。", "", "O professor começa a aula.", "{始|はじ}める: transitivo. Alguém inicia a aula."]
  ],
  care: [
    "Não troque as partículas: ✗ ドアを {開|あ}きます; ✓ ドアが {開|あ}きます ou ドアを {開|あ}けます. O intransitivo **nunca** leva を na coisa que muda.",
    "Aprenda **o par junto** quando encontrar um verbo novo: {壊|こわ}れる (quebrar sozinho) e {壊|こわ}す (quebrar algo), {直|なお}る (ser consertado) e {直|なお}す (consertar).",
    "Nem todo verbo tem par: {行|い}く, {来|く}る, {泣|な}く e {笑|わら}う, por exemplo, só têm uma forma.",
    "Verbos de **movimento** são intransitivos, mas o を marca **por onde** se passa ou **de onde** se sai: {道|みち}を {歩|ある}く, {橋|はし}を {渡|わた}る, {家|いえ}を {出|で}る, {電車|でんしゃ}を {降|お}りる. Esse を não marca o objeto da ação.",
    "A tabela mostra o que é mais comum, e os padrões de terminação têm exceções (por exemplo, {入|はい}る ↔ {入|い}れる). Na dúvida, o par certo é o do dicionário."
  ],
  practice: [["Vocabulário (categoria Verbos)", "vocabulario.html"]]
},

{ id: "ta", title: "Forma た (passado informal)",
  summary: "O passado sem ます: como falar com amigos e base de vários padrões.",
  use: [
    "A **forma た** é o passado da forma curta (informal). É o par de ました: たべました (educado) → たべた (informal).",
    "Entre amigos e família, e dentro de frases mais longas, o japonês usa essa forma. Ela também é a base de padrões como ～たことがある."
  ],
  form: [
    "**Ichidan**: tire o る e acrescente た. {食|た}べる → {食|た}べた, {見|み}る → {見|み}た.",
    "**Godan**: igual à forma て, trocando て por た e で por だ: {買|か}う → {買|か}った, {書|か}く → {書|か}いた, {読|よ}む → {読|よ}んだ, {泳|およ}ぐ → {泳|およ}いだ, {話|はな}す → {話|はな}した. Consulte a tabela do tópico “Verbos: ichidan e godan”.",
    "**Irregulares**: する → した, {来|く}る → {来|き}た. **Exceção**: {行|い}く → {行|い}った.",
    "**Negativo no passado**: tire o い de ない e ponha かった: {食|た}べない → {食|た}べ**なかった** (não comi).",
    "**Adjetivos e substantivos**: adjetivo い → **かった** ({暑|あつ}い → {暑|あつ}かった); adjetivo な e substantivo → **だった** (しずかだった, {学生|がくせい}だった)."
  ],
  ex: [
    ["{昨日|きのう} {映画|えいが}を {見|み}た。", "", "Ontem assisti a um filme.", "{見|み}る (ichidan): tira o る + た."],
    ["{朝|あさ}ごはんを {食|た}べなかった。", "", "Não tomei o café da manhã.", "Negativo no passado: ない → なかった."],
    ["{友達|ともだち}に {会|あ}った。", "", "Encontrei um(a) amigo(a).", "{会|あ}う → {会|あ}った (う → った)."],
    ["{本|ほん}を {読|よ}んだ。", "", "Li um livro.", "{読|よ}む → {読|よ}んだ (む → んだ)."],
    ["{昨日|きのう}は {暑|あつ}かった。", "", "Ontem estava quente.", "Adjetivo い: い → かった."],
    ["{昨日|きのう}は {日曜日|にちようび}だった。", "", "Ontem era domingo.", "Substantivo: だ → だった."]
  ],
  care: [
    "A forma た é informal. Com desconhecidos, superiores e clientes, continue usando ました.",
    "A regra de som do た é a mesma do て: se você erra uma, erra a outra. Confira o godan na tabela.",
    "{行|い}く é exceção: {行|い}った, e não {行|い}いた.",
    "O negativo no passado não é ないた: o certo é **なかった**."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"], ["Treino de conjugação (adjetivos)", "conjugacao-adjetivos.html"]]
},

{ id: "nai", title: "Forma ない (negativo informal)",
  summary: "O negativo sem ません: para falar com amigos e montar vários padrões.",
  use: [
    "A **forma ない** é o negativo da forma curta: たべません (educado) → たべない (informal).",
    "Ela é a base de vários padrões deste nível, como ～ないでください e ～なければならない."
  ],
  form: [
    "**Ichidan**: tire o る e acrescente ない. {食|た}べる → {食|た}べない, {見|み}る → {見|み}ない.",
    "**Godan**: troque a última sílaba pela da **linha あ** e acrescente ない. {書|か}く → {書|か}かない, {読|よ}む → {読|よ}まない, {乗|の}る → {乗|の}らない, {話|はな}す → {話|はな}さない.",
    "**Godan em う**: o う vira **わ**, e não あ. {買|か}う → {買|か}わない, {会|あ}う → {会|あ}わない.",
    "**Irregulares**: する → しない, {来|く}る → {来|こ}ない. **ある** → ない.",
    "**Passado**: ない → なかった ({食|た}べなかった). O ない conjuga como um adjetivo い: {食|た}べなくて, {食|た}べなければ."
  ],
  ex: [
    ["{今日|きょう}は {学校|がっこう}へ {行|い}かない。", "", "Hoje não vou à escola.", "{行|い}く → {行|い}かない (く → か)."],
    ["わたしは お{酒|さけ}を {飲|の}まない。", "", "Eu não bebo (álcool).", "{飲|の}む → {飲|の}まない (む → ま)."],
    ["{友達|ともだち}に {会|あ}わない。", "", "Não vou encontrar o(a) amigo(a).", "{会|あ}う → {会|あ}わない (う → わ)."],
    ["{明日|あした}は {来|こ}ない。", "", "Amanhã não venho.", "{来|く}る → {来|こ}ない (irregular)."],
    ["{家|いえ}に テレビが ない。", "", "Não há TV em casa.", "O negativo de ある é ない."],
    ["しゅくだいを しなかった。", "", "Não fiz a lição.", "しない → しなかった (ない → なかった)."]
  ],
  care: [
    "No godan em う, o う vira **わ**: {買|か}わない, e não {買|か}あない.",
    "O negativo de **ある** é só **ない** (あらない não existe).",
    "O **ない** é adjetivo い: o passado é なかった e a forma て é なくて.",
    "Em frases educadas, continue usando ません. A forma ない é para amigos, textos e padrões gramaticais."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"]]
},

{ id: "fala-informal", title: "Fala informal (forma curta)",
  summary: "Como o japonês fala com amigos: a forma curta de verbos, adjetivos e substantivos.",
  use: [
    "Até aqui você usou a **forma educada** (です, ます). Entre amigos, familiares e colegas próximos, e em textos como diários, usa-se a **forma curta**, também chamada de forma informal ou comum.",
    "A forma curta também aparece **dentro de frases maiores**, por exemplo antes de と{思|おも}う (eu acho que…). Só o verbo final fica em ます ou です."
  ],
  form: [
    "**Verbo**: forma do dicionário (たべる), ない, た e なかった.",
    "**Adjetivo い**: já está curto. O です some, o negativo é くない e o passado é かった.",
    "**Adjetivo な e substantivo**: o です vira **だ**, e o じゃありません vira **じゃない**.",
    "**Perguntas**: tire o か e suba a voz. O だ some: {学生|がくせい}？ ({学生|がくせい}だ → {学生|がくせい}？).",
    "**Na fala**, as partículas は, が e を costumam sumir: ごはん、{食|た}べる？ (Vai comer?)."
  ],
  tables: [
    { title: "Forma educada",
      head: ["", "Presente (+)", "Presente (–)", "Passado (+)", "Passado (–)"],
      rows: [
        ["Verbo", "たべ**ます**", "たべ**ません**", "たべ**ました**", "たべ**ませんでした**"],
        ["Adjetivo い", "{暑|あつ}い**です**", "{暑|あつ}**くないです**", "{暑|あつ}**かったです**", "{暑|あつ}**くなかったです**"],
        ["Adjetivo な", "しずか**です**", "しずか**じゃありません**", "しずか**でした**", "しずか**じゃありませんでした**"],
        ["Substantivo", "{学生|がくせい}**です**", "{学生|がくせい}**じゃありません**", "{学生|がくせい}**でした**", "{学生|がくせい}**じゃありませんでした**"]
      ] },
    { title: "Forma curta",
      head: ["", "Presente (+)", "Presente (–)", "Passado (+)", "Passado (–)"],
      rows: [
        ["Verbo", "たべ**る**", "たべ**ない**", "たべ**た**", "たべ**なかった**"],
        ["Adjetivo い", "{暑|あつ}**い**", "{暑|あつ}**くない**", "{暑|あつ}**かった**", "{暑|あつ}**くなかった**"],
        ["Adjetivo な", "しずか**だ**", "しずか**じゃない**", "しずか**だった**", "しずか**じゃなかった**"],
        ["Substantivo", "{学生|がくせい}**だ**", "{学生|がくせい}**じゃない**", "{学生|がくせい}**だった**", "{学生|がくせい}**じゃなかった**"]
      ] }
  ],
  ex: [
    ["{今日|きょう}は {暑|あつ}い。", "", "Hoje está quente.", "Adjetivo い: sem です."],
    ["{一緒|いっしょ}に {行|い}く？", "", "Vamos juntos?", "Forma do dicionário + voz subindo."],
    ["これは {本|ほん}だ。", "", "Isto é um livro.", "だ no lugar de です."],
    ["{映画|えいが}は {好|す}きじゃない。", "", "Não gosto de filmes.", "じゃありません → じゃない."],
    ["{昨日|きのう}は {休|やす}みだった。", "", "Ontem era folga.", "でした → だった."],
    ["ごはん、{食|た}べた？", "", "Já comeu?", "Na fala, a partícula some e a voz sobe no fim."]
  ],
  care: [
    "A forma curta soa **íntima**. Com desconhecidos, superiores e clientes, use a forma educada: a curta, fora de hora, pode parecer grosseira.",
    "O **だ** só aparece com substantivo e adjetivo な, e some em perguntas curtas. Com adjetivo い, a frase comum não tem だ: {暑|あつ}い.",
    "Dentro de frases longas (como ～と{思|おも}います), a forma curta é usada mesmo em textos educados."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"], ["Treino de conjugação (adjetivos)", "conjugacao-adjetivos.html"]]
},

{ id: "hesitacoes-expressoes", title: "Hesitações e expressões do dia a dia (あの, えっと, ごめん…)",
  summary: "As palavrinhas que abrem, enchem e suavizam a fala, e as frases feitas do dia a dia, cada uma com o seu nível de formalidade.",
  use: [
    "Quem fala japonês de verdade usa muitas palavrinhas sem tradução exata. Elas servem para **começar a falar**, **ganhar tempo para pensar**, **reagir** ao que a outra pessoa disse e **suavizar** o tom.",
    "Elas quase não mudam o sentido da frase, mas mudam o **clima**. Um あのう educado e um やばい de gíria dizem coisas bem diferentes sobre quem fala. Por isso cada uma vem aqui com o seu **nível de formalidade**.",
    "Para entender a base de “educado x informal”, veja antes o tópico **Fala informal**."
  ],
  form: [
    "Em geral vêm **no começo da frase**, seguidas de vírgula (、): あの、すみません。 / えっと、{今日|きょう}は…",
    "**Alongar a vogal** deixa a palavra mais hesitante e cuidadosa: あの → **あのう**, えっと → **ええと**, うん → **うーん**.",
    "**ええ x うん** (sim): **ええ** é educado e **うん** é informal, para amigos e família. Com superiores, use **はい**.",
    "**ごめん x ごめんなさい x すみません** (desculpa): **ごめん** só entre íntimos, **ごめんなさい** é mais educado, e **すみません** também serve para chamar a atenção (“com licença”).",
    "**よろしく** vem de “trate-me bem”: informal. Educado: **よろしく お{願|ねが}いします**. Usa-se ao se apresentar e ao pedir algo.",
    "**お{疲|つか}れ{様|さま}** é uma frase de trabalho: **お{疲|つか}れ{様|さま}です** entre colegas durante o dia, e **お{疲|つか}れ{様|さま}でした** ao fim do trabalho. Entre colegas próximos encurta para **お{疲|つか}れ**.",
    "**やばい** começou como “perigoso, ruim”, e hoje também diz “demais, incrível”. Quem decide é o contexto e o tom."
  ],
  tables: [
    { text: true, title: "Hesitar, reagir e guiar a conversa",
      head: ["Palavra", "Sentido", "Registro"],
      rows: [
        ["あの / あのう", "ahn… (começar a falar, chamar a atenção, pedir licença)", "neutro; あのう é mais educado e hesitante"],
        ["えっと / ええと", "é…, deixa eu ver (ganhar tempo)", "neutro; ええと é um pouco mais cuidadoso"],
        ["うーん", "hum… (pensando ou em dúvida)", "informal"],
        ["さあ", "sei lá; ou “vamos!”", "neutro e informal"],
        ["まあ", "bem, até que… (suaviza)", "neutro"],
        ["ええ / うん", "sim", "ええ educado, うん informal"],
        ["へえ", "nossa!, é mesmo?", "informal"],
        ["ふーん", "hum, ah, é? (sem muito interesse)", "informal"],
        ["そうか", "ah, é? entendi", "informal (educado: そうですか)"],
        ["ああ", "ah!, ah, entendi", "neutro"],
        ["ほら", "olha!, viu?", "informal"],
        ["さて", "bem, então (mudar de assunto, começar algo)", "neutro"],
        ["ねえ", "ei! (chamar a atenção)", "informal"],
        ["よし", "certo!, vamos lá!", "informal"]
      ] },
    { text: true, title: "Frases feitas do dia a dia",
      head: ["Expressão", "Sentido", "Registro"],
      rows: [
        ["ごめん", "desculpa", "informal"],
        ["よろしく", "conto com você; prazer", "informal (educado: よろしく お{願|ねが}いします)"],
        ["お{疲|つか}れ{様|さま}", "bom trabalho; obrigado pelo esforço", "trabalho; educado com です / でした"],
        ["どういたしまして", "de nada", "educado"],
        ["いいね", "legal!, boa!", "informal"],
        ["やばい", "nossa!; que perigo; que demais", "gíria, informal"]
      ] }
  ],
  ex: [
    ["あの、すみません。{駅|えき}は どこですか。", "", "Ahn, com licença. Onde fica a estação?", "あの abre a conversa com um desconhecido."],
    ["えっと、{今日|きょう}は {何曜日|なんようび}ですか。", "", "Hmm, que dia da semana é hoje?", "えっと dá tempo para pensar."],
    ["さあ、どうでしょう。", "", "Hmm, quem sabe?", "さあ = “não sei”. Em “さあ、{行|い}きましょう” quer dizer “vamos lá!”."],
    ["まあ、{悪|わる}くないですね。", "", "Bem, até que não está mal.", "まあ tira a força da frase: “nem tanto, mas…”."],
    ["ええ、そうです。", "", "Sim, é isso mesmo.", "ええ é educado. Entre amigos: うん、そう。"],
    ["ふーん、そうなんですか。", "", "Hum, é mesmo?", "Com tom baixo, pode soar sem interesse."],
    ["ごめん、{忘|わす}れちゃった。", "", "Desculpa, esqueci.", "ごめん só com íntimos. Educado: ごめんなさい."],
    ["{今日|きょう}も お{疲|つか}れ{様|さま}でした。", "", "Obrigado(a) pelo trabalho de hoje também.", "Fala-se ao fim do dia de trabalho."],
    ["やばい、もう {八時|はちじ}だ。", "", "Nossa, já são oito horas!", "やばい aqui é “que apuro”. Gíria."],
    ["「ありがとう。」「どういたしまして。」", "", "“Obrigado(a).” “De nada.”", "どういたしまして é a resposta educada ao ありがとう."]
  ],
  care: [
    "**ふーん** e **そうか** soam bem entre amigos, mas com **superiores, clientes e desconhecidos** podem parecer frios ou até arrogantes. Use **そうですか** ou **なるほど**.",
    "**うん, ごめん, いいね, やばい, よし** são **informais**. Com quem merece respeito, troque por **はい, ごめんなさい / すみません, いいですね** e uma palavra mais neutra no lugar de やばい.",
    "**やばい** muda de sentido com o tom: pode ser um problema (やばい、{遅刻|ちこく}だ) ou um elogio. Na dúvida, não use no trabalho nem com quem você acabou de conhecer.",
    "Hesitar é natural na **fala**, mas em e-mails, cartas e textos formais evite あの, えっと e うーん.",
    "Não confunda o **あの** de hesitação com o **あの** de “aquele”: あの{人|ひと} é “aquela pessoa”, e あの、すみません é “ahn, com licença”."
  ],
  practice: [["Kotonoha (palavras novas)", "kotonoha.html"], ["Vocabulário (hesitações e expressões)", "vocabulario.html"]]
},

{ id: "naide-kudasai", title: "～ないでください",
  summary: "Como pedir, com educação, que alguém não faça algo.",
  use: [
    "**～ないでください** é o pedido educado para **não** fazer algo: “por favor, não…”. É o oposto de ～てください.",
    "Serve para pedidos do dia a dia e para avisos."
  ],
  form: [
    "**Forma ない + でください**: {走|はし}らない → {走|はし}らない**でください** (não corra, por favor).",
    "**Irregulares**: しない**でください**, {来|こ}ない**でください**.",
    "**Entre amigos**, o ください some: {行|い}かないで (não vá)."
  ],
  ex: [
    ["ここで {走|はし}らないでください。", "", "Não corra aqui, por favor.", "{走|はし}る → {走|はし}らない."],
    ["{忘|わす}れないでください。", "", "Não se esqueça, por favor.", "{忘|わす}れる (ichidan) → {忘|わす}れない."],
    ["ここに {入|はい}らないでください。", "", "Não entre aqui, por favor.", "{入|はい}る é godan: {入|はい}らない."],
    ["{心配|しんぱい}しないでください。", "", "Não se preocupe, por favor.", "する → しない."],
    ["{遅|おく}れないでください。", "", "Não se atrase, por favor.", "{遅|おく}れる é ichidan."],
    ["ここで たばこを すわないでください。", "", "Não fume aqui, por favor.", "すう → すわない (う → わ)."]
  ],
  care: [
    "É **でください**, e não てください: たべなくてください está errado. O certo é たべないでください.",
    "É um pedido educado, mas direto. Para proibições em regras e placas, o japonês usa ～てはいけません (próximo tópico).",
    "Para pedir que alguém **faça** algo, use ～てください."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"]]
},

{ id: "temo-ii", title: "～てもいい e ～てはいけません",
  summary: "Como pedir licença, dar permissão e proibir.",
  use: [
    "**～てもいい** (forma て + もいい) quer dizer “pode ~” ou “não tem problema se ~”: dá ou pede **permissão**. Em pergunta, ～てもいいですか é “posso ~?”.",
    "**～てはいけません** (forma て + はいけません) quer dizer “não pode ~”: **proíbe**."
  ],
  form: [
    "**Pedir licença**: forma て + もいいですか. ここに {座|すわ}ってもいいですか (posso me sentar aqui?).",
    "**Permitir**: ええ、どうぞ (claro, fique à vontade) ou はい、いいですよ (sim, pode).",
    "**Recusar com jeito**: すみません、ちょっと… ou dar o motivo.",
    "**Proibir**: forma て + はいけません. ここで {食|た}べてはいけません (não pode comer aqui)."
  ],
  ex: [
    ["ここに {座|すわ}ってもいいですか。", "", "Posso me sentar aqui?", ""],
    ["この {本|ほん}を {借|か}りてもいいですか。", "", "Posso pegar este livro emprestado?", "{借|か}りる é ichidan."],
    ["ええ、どうぞ。", "", "Claro, fique à vontade.", "Resposta a um pedido de licença."],
    ["{窓|まど}を {開|あ}けてもいいですか。", "", "Posso abrir a janela?", ""],
    ["ここで たばこを すってはいけません。", "", "Não é permitido fumar aqui.", "すう → すって."],
    ["ここで {食|た}べてはいけません。", "", "Não é permitido comer aqui.", ""]
  ],
  care: [
    "Recusar com um **いいえ、いけません** direto soa seco. É mais comum dizer すみません、ちょっと… ou explicar o motivo.",
    "**～てはいけません** é proibição forte, de regras e placas. Para pedir a alguém que não faça algo, prefira ～ないでください.",
    "Não confunda com ～てください, que pede que a pessoa **faça** algo."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"]]
},

{ id: "nakereba", title: "～なければならない e ～なくてもいい",
  summary: "Como dizer que é preciso fazer algo e que não é preciso.",
  use: [
    "**～なければならない** quer dizer “é preciso ~” ou “tenho que ~”: expressa **obrigação**. A forma educada é ～なければなりません.",
    "**～なくてもいい** quer dizer “não precisa ~”: expressa que **não há obrigação**."
  ],
  form: [
    "**Obrigação**: forma ない, tire o い e acrescente ければなりません. {食|た}べない → {食|た}べ**なければなりません** (preciso comer).",
    "**Não precisa**: forma ない, tire o い e acrescente くてもいいです. {食|た}べない → {食|た}べ**なくてもいいです** (não precisa comer).",
    "Os dois vêm da forma ない, que se conjuga como adjetivo い: なければ (se não), なくて (não… e)."
  ],
  ex: [
    ["まいにち くすりを {飲|の}まなければなりません。", "", "Tenho que tomar remédio todo dia.", ""],
    ["{明日|あした}は {早|はや}く {起|お}きなければなりません。", "", "Amanhã preciso acordar cedo.", ""],
    ["しゅくだいを しなければなりません。", "", "Preciso fazer a lição.", ""],
    ["{明日|あした}は {学校|がっこう}へ {行|い}かなくてもいいです。", "", "Amanhã não preciso ir à escola.", ""],
    ["{急|いそ}がなくてもいいですよ。", "", "Não precisa se apressar.", ""],
    ["{今日|きょう}は かさを {持|も}たなくてもいいです。", "", "Hoje não precisa levar guarda-chuva.", "{持|も}つ → {持|も}たない."]
  ],
  care: [
    "A forma tem dois negativos (ない + ならない), e por isso o sentido final é **afirmativo**: “tenho que”.",
    "**～なくてもいい** é “não precisa”; ～てはいけません é “não pode”. Os dois sentidos são bem diferentes.",
    "Para pedir que alguém faça algo, não use ～なければならない: use ～てください."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"]]
},

{ id: "koto-ga-aru", title: "～たことがある",
  summary: "Como falar de experiências: já fiz e nunca fiz.",
  use: [
    "**～たことがある** (forma た + ことがある) quer dizer “**já** fiz ~”: uma **experiência** de vida. O こと é “fato, experiência”.",
    "O negativo é **～たことがない** (“nunca fiz ~”). A pergunta é ～たことがありますか."
  ],
  form: [
    "**Forma た + ことがある**: {食|た}べた → {食|た}べたことがある (já comi).",
    "**Educado**: ことがあります / ことがありません.",
    "**Responder**: はい、あります (sim, já) / いいえ、ありません (não, nunca)."
  ],
  ex: [
    ["{日本|にほん}へ {行|い}ったことがあります。", "", "Já fui ao Japão.", "{行|い}く → {行|い}った."],
    ["{寿司|すし}を {食|た}べたことがありますか。", "", "Você já comeu sushi?", ""],
    ["はい、あります。", "", "Sim, já.", ""],
    ["いいえ、ありません。", "", "Não, nunca.", ""],
    ["{富士山|ふじさん}に {登|のぼ}ったことがありません。", "", "Nunca subi o Monte Fuji.", "{登|のぼ}る → {登|のぼ}った."],
    ["{外国|がいこく}で {働|はたら}いたことがあります。", "", "Já trabalhei no exterior.", "{働|はたら}く → {働|はたら}いた."]
  ],
  care: [
    "Use a forma **た**, e não ます: {食|た}べます ことがある está errado. O certo é {食|た}べたことがある.",
    "**Não é o mesmo que o passado simples**: {日本|にほん}へ {行|い}きました diz que você foi (num momento determinado). {日本|にほん}へ {行|い}ったことがあります diz que você tem essa experiência, sem dizer quando.",
    "Com a forma do dicionário o sentido muda: {食|た}べることがある quer dizer “às vezes como”."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"]]
},

{ id: "to-omou", title: "～と{思|おも}う e ～と{言|い}う",
  summary: "Como dar sua opinião e citar o que alguém disse.",
  use: [
    "**～と{思|おも}う** quer dizer “acho que ~” ou “penso que ~”. Antes do と, usa-se a **forma curta**.",
    "**～と{言|い}う** quer dizer “dizer que ~”: cita o que alguém falou.",
    "Nos dois, o **と** funciona como aspas: marca aquilo que se pensa ou se diz."
  ],
  form: [
    "**Verbo ou adjetivo い (forma curta) + と{思|おも}います**: {雨|あめ}が {降|ふ}ると{思|おも}います (acho que vai chover).",
    "**Substantivo e adjetivo な**: a forma curta tem **だ**: {学生|がくせい}だと{思|おも}います (acho que é estudante).",
    "**Negativo**: ないと{思|おも}います (acho que não). **Passado**: たと{思|おも}います.",
    "**Citar**: {先生|せんせい}は 「テストです」と{言|い}いました (o(a) professor(a) disse: “é prova”).",
    "**Pedir opinião**: どう{思|おも}いますか (o que você acha?)."
  ],
  ex: [
    ["{明日|あした}は {雨|あめ}が {降|ふ}ると {思|おも}います。", "", "Acho que vai chover amanhã.", "{降|ふ}る: forma curta antes do と."],
    ["この {本|ほん}は {面白|おもしろ}いと {思|おも}います。", "", "Acho este livro interessante.", ""],
    ["{田中|たなか}さんは {学生|がくせい}だと {思|おも}います。", "", "Acho que Tanaka-san é estudante.", "Substantivo: o だ fica antes do と."],
    ["{日本語|にほんご}は {難|むずか}しくないと {思|おも}います。", "", "Acho que o japonês não é difícil.", ""],
    ["{先生|せんせい}は 「{明日|あした}は テストです」と {言|い}いました。", "", "O(A) professor(a) disse: “Amanhã tem prova”.", ""],
    ["これは {日本語|にほんご}で {何|なん}と {言|い}いますか。", "", "Como se diz isto em japonês?", "Literalmente: “em japonês, diz-se o quê?”"]
  ],
  care: [
    "Antes do と, use a **forma curta**: {雨|あめ}が {降|ふ}ります と{思|おも}います está errado. O certo é {雨|あめ}が {降|ふ}ると{思|おも}います.",
    "Com substantivo ou adjetivo な, o **だ** fica antes do と: {学生|がくせい}だと{思|おも}います.",
    "O と{思|おも}う suaviza a frase: os japoneses o usam muito para não afirmar com tanta certeza.",
    "O **と** aqui não é o と de “e” nem o de “com”: ele só introduz o que se pensa ou se diz."
  ],
  practice: [["Lacuna (modo Partículas)", "lacuna.html"]]
},

{ id: "mae-ato-toki", title: "～まえに, ～てから, ～たあとで, ～とき",
  summary: "Como dizer antes, depois e quando: a ordem das ações no tempo.",
  use: [
    "**～まえに** quer dizer “antes de ~”. O verbo de antes fica na **forma do dicionário**, mesmo que a frase esteja no passado.",
    "**～てから** (forma て + から) e **～たあとで** (forma た + あとで) querem dizer “depois de ~”: uma ação vem depois da outra.",
    "**～とき** quer dizer “quando ~”: liga a situação ao momento em que ela acontece."
  ],
  form: [
    "**Antes**: verbo (dicionário) + まえに: {寝|ね}るまえに、はを みがきます (escovo os dentes antes de dormir). Com substantivo: **の** + まえに: {食事|しょくじ}のまえに.",
    "**Depois**: verbo て + から ({食|た}べてから) ou verbo た + あとで ({食|た}べたあとで). Com substantivo: {仕事|しごと}のあとで.",
    "**Quando**: forma curta + とき: {日本|にほん}へ {行|い}くとき (quando vou ao Japão), {日本|にほん}へ {行|い}ったとき (quando fui).",
    "**Antes de とき**: substantivo + の ({子供|こども}のとき), adjetivo な + な (ひまなとき), adjetivo い direto ({忙|いそが}しいとき)."
  ],
  ex: [
    ["{寝|ね}るまえに、はを みがきます。", "", "Escovo os dentes antes de dormir.", "Antes de まえに, o verbo fica na forma do dicionário."],
    ["{食|た}べてから、{薬|くすり}を {飲|の}みます。", "", "Tomo o remédio depois de comer.", ""],
    ["{仕事|しごと}のあとで、{友達|ともだち}に {会|あ}います。", "", "Encontro um(a) amigo(a) depois do trabalho.", "Substantivo + の + あとで."],
    ["ひまなとき、{映画|えいが}を {見|み}ます。", "", "Quando estou livre, assisto a filmes.", "Adjetivo な + な + とき."],
    ["{日本|にほん}へ {行|い}ったとき、{寿司|すし}を {食|た}べました。", "", "Quando fui ao Japão, comi sushi.", "Com a forma た, a ação já aconteceu."],
    ["{子供|こども}のとき、{東京|とうきょう}に {住|す}んでいました。", "", "Quando eu era criança, morava em Tóquio.", "Substantivo + の + とき."]
  ],
  care: [
    "Antes de **まえに**, use sempre a forma do dicionário: {寝|ね}るまえに, e não {寝|ね}たまえに.",
    "**とき** com a forma do dicionário fala de algo que ainda vai acontecer ({日本|にほん}へ {行|い}くとき, “quando for ao Japão”); com a forma た, de algo já feito ({日本|にほん}へ {行|い}ったとき, “quando fui”).",
    "Antes de とき, o substantivo leva **の** e o adjetivo な leva **な**: {子供|こども}のとき, ひまなとき.",
    "**～てから** e **～たあとで** parecem iguais; o てから dá mais ênfase à ordem (primeiro uma coisa, depois a outra)."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"]]
},

{ id: "nagara-tari", title: "～ながら e ～たり～たりする",
  summary: "Fazer duas coisas ao mesmo tempo e listar ações como exemplos.",
  use: [
    "**～ながら** liga duas ações feitas **ao mesmo tempo pela mesma pessoa**: “fazendo X, faço Y”. A ação principal vem no fim.",
    "**～たり～たりする** lista **exemplos** de ações, sem dizer todas: “faço isto, faço aquilo, entre outras coisas”."
  ],
  form: [
    "**ながら**: tire o ます do verbo e acrescente ながら. {音楽|おんがく}を {聞|き}きながら、{勉強|べんきょう}します (estudo ouvindo música).",
    "**たり～たり**: forma た + り, repetida, e termina com する. {本|ほん}を {読|よ}んだり、テレビを {見|み}たりします (leio, assisto à TV, etc.).",
    "O **する** do final recebe o tempo: します (presente) ou しました (passado)."
  ],
  ex: [
    ["{音楽|おんがく}を {聞|き}きながら、{勉強|べんきょう}します。", "", "Estudo ouvindo música.", "A ação principal é {勉強|べんきょう}します."],
    ["{歩|ある}きながら {電話|でんわ}を しないでください。", "", "Não fale ao telefone enquanto anda, por favor.", ""],
    ["コーヒーを {飲|の}みながら、{新聞|しんぶん}を {読|よ}みます。", "", "Leio o jornal tomando café.", ""],
    ["{休|やす}みの {日|ひ}は、{本|ほん}を {読|よ}んだり、{映画|えいが}を {見|み}たりします。", "", "Nos dias de folga, leio, assisto a filmes, etc.", ""],
    ["{日曜日|にちようび}は、{買|か}い{物|もの}を したり、{友達|ともだち}に {会|あ}ったり しました。", "", "No domingo fiz compras, encontrei amigos, etc.", "O tempo vai no する final: しました."],
    ["{週末|しゅうまつ}は {泳|およ}いだり、{走|はし}ったり します。", "", "No fim de semana nado, corro, etc.", ""]
  ],
  care: [
    "No **ながら**, as duas ações são da **mesma pessoa**. Para pessoas diferentes, não se usa ながら.",
    "A ação principal fica **depois** do ながら: {音楽|おんがく}を {聞|き}きながら {勉強|べんきょう}します (o foco é estudar).",
    "No **たり～たり**, o たり se repete e o **する** do final carrega o tempo. Ele lista exemplos, não tudo.",
    "Para listar ações em sequência (primeiro uma, depois outra), use a forma て, e não o たり."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"]]
},

{ id: "hikaku", title: "Comparações: より, のほうが, いちばん",
  summary: "Como comparar duas coisas e dizer qual é a mais ~.",
  use: [
    "**A は B より ~** quer dizer “A é mais ~ do que B”. O **より** marca o termo de comparação.",
    "**A のほうが ~** quer dizer “A é mais ~”, com foco em A. Para perguntar, usa-se **A と B と、どちらが ~ですか** (entre A e B, qual é mais ~?).",
    "**いちばん** quer dizer “o mais ~”: o superlativo. Para dizer “entre…”, usa-se **～の{中|なか}で**."
  ],
  form: [
    "**A は B より adjetivo**: {電車|でんしゃ}は バスより {速|はや}いです (o trem é mais rápido que o ônibus).",
    "**A のほうが adjetivo**: {電車|でんしゃ}のほうが {速|はや}いです.",
    "**Pergunta com duas opções**: {電車|でんしゃ}と バスと、どちらが {速|はや}いですか。",
    "**Superlativo**: いちばん + adjetivo. {日本|にほん}で {富士山|ふじさん}が いちばん {高|たか}いです (no Japão, o Monte Fuji é o mais alto).",
    "**Pergunta com três ou mais**: ～の{中|なか}で、なにが いちばん すきですか (entre ~, de qual você mais gosta?)."
  ],
  ex: [
    ["{電車|でんしゃ}は バスより {速|はや}いです。", "", "O trem é mais rápido que o ônibus.", ""],
    ["{今日|きょう}は {昨日|きのう}より {暑|あつ}いです。", "", "Hoje está mais quente que ontem.", ""],
    ["{電車|でんしゃ}と バスと、どちらが {速|はや}いですか。", "", "Entre o trem e o ônibus, qual é mais rápido?", ""],
    ["{電車|でんしゃ}のほうが {速|はや}いです。", "", "O trem é mais rápido.", "Resposta à pergunta acima."],
    ["{日本|にほん}で {富士山|ふじさん}が いちばん {高|たか}いです。", "", "No Japão, o Monte Fuji é o mais alto.", ""],
    ["くだもののなかで、なにが いちばん すきですか。", "", "De todas as frutas, qual você mais gosta?", "Com すき, a coisa leva が."]
  ],
  care: [
    "O **より** vem depois do termo comparado (o que tem **menos**): バスより quer dizer “do que o ônibus”. Em português, o “do que” vem antes do termo.",
    "O adjetivo **não muda** para comparar: {速|はや}い serve para “rápido” e “mais rápido”. A comparação vem do より ou do ほう.",
    "**どちら** compara **duas** coisas. Para três ou mais, use **なに / だれ / どこ + が いちばん**.",
    "Com **いちばん**, a coisa comparada leva **が**: {富士山|ふじさん}が いちばん {高|たか}いです."
  ],
  practice: [["Treino de conjugação (adjetivos)", "conjugacao-adjetivos.html"], ["Lacuna (modo Partículas)", "lacuna.html"]]
},

{ id: "joken", title: "Condicionais: と, たら, ば, なら",
  summary: "As quatro formas de dizer “se” e “quando”, e quando usar cada uma.",
  use: [
    "O japonês tem quatro formas de condição, com sentidos próximos: **と** (resultado natural, quase automático), **たら** (a mais versátil: “se / depois que”), **ば** (condição geral) e **なら** (“se é o caso de…”).",
    "Para começar, **たら** serve para quase tudo e é a mais natural na fala."
  ],
  form: [
    "**～と**: forma curta + と. {押|お}すと、ドアが {開|あ}きます (se apertar, a porta abre). O resultado é natural ou habitual.",
    "**～たら**: forma た + ら. {雨|あめ}が {降|ふ}ったら、{行|い}きません (se chover, não vou). Aceita pedidos e vontade no resultado.",
    "**～ば**: troque a última sílaba pela da linha え e acrescente ば (ichidan: る → れば). {行|い}けば, {見|み}れば. **Adjetivo い**: い → ければ ({安|やす}ければ). **Negativo**: なければ.",
    "**～なら**: forma curta + なら (substantivo e adjetivo な, sem だ). {京都|きょうと}へ {行|い}くなら、{電車|でんしゃ}が {便利|べんり}です (se vai a Kyoto, o trem é prático)."
  ],
  ex: [
    ["このボタンを {押|お}すと、ドアが {開|あ}きます。", "", "Se você apertar este botão, a porta abre.", "と: resultado natural."],
    ["{雨|あめ}が {降|ふ}ったら、{行|い}きません。", "", "Se chover, não vou.", ""],
    ["{時間|じかん}が あったら、{電話|でんわ}してください。", "", "Se tiver tempo, me ligue.", "たら aceita um pedido no final."],
    ["{安|やす}ければ、{買|か}います。", "", "Se for barato, eu compro.", "Adjetivo い: い → ければ."],
    ["{京都|きょうと}へ {行|い}くなら、{電車|でんしゃ}が {便利|べんり}です。", "", "Se vai a Kyoto, o trem é prático.", "なら: responde ao que a outra pessoa disse."],
    ["{十時|じゅうじ}に なったら、{寝|ね}ます。", "", "Quando der dez horas, vou dormir.", ""]
  ],
  care: [
    "O resultado de **と** não pode ser pedido, convite nem vontade: {時間|じかん}が あると {電話|でんわ}してください está errado. Use たら.",
    "Na dúvida, escolha **たら**: serve para quase todas as situações.",
    "**なら** retoma o que o outro disse (“se é isso, então…”). Substantivo e adjetivo な ficam sem だ: {学生|がくせい}なら.",
    "A forma **ば** segue a tabela do tópico “Verbos: ichidan e godan” (coluna ば)."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"]]
},

{ id: "potencial", title: "Potencial (poder fazer)",
  summary: "Como dizer o que você consegue ou pode fazer.",
  use: [
    "A **forma potencial** quer dizer “conseguir ~ / poder ~”. Há duas maneiras: **～ことができる** (mais formal) e a **forma potencial do verbo** (mais comum na fala).",
    "Com a forma potencial, o objeto costuma levar **が**: {日本語|にほんご}が {話|はな}せます."
  ],
  form: [
    "**～ことができる**: forma do dicionário + ことができる. {泳|およ}ぐことが できます (consigo nadar).",
    "**Ichidan**: tire o る e acrescente **られる**: {食|た}べる → {食|た}べられる.",
    "**Godan**: troque a última sílaba pela da linha **え** e acrescente る: {書|か}く → {書|か}ける, {読|よ}む → {読|よ}める. Consulte a coluna “Potencial” da tabela.",
    "**Irregulares**: する → できる, {来|く}る → {来|こ}られる.",
    "A forma potencial **conjuga como um verbo ichidan**: {書|か}けます, {書|か}けない, {書|か}けた."
  ],
  ex: [
    ["わたしは {泳|およ}ぐことが できます。", "", "Eu consigo nadar.", "ことができる com a forma do dicionário."],
    ["{日本語|にほんご}が {話|はな}せます。", "", "Eu consigo falar japonês.", "{話|はな}す → {話|はな}せる (す → せ)."],
    ["{漢字|かんじ}が {読|よ}めますか。", "", "Você consegue ler kanji?", "{読|よ}む → {読|よ}める (む → め)."],
    ["さかなは {食|た}べられません。", "", "Não consigo comer peixe.", "Ichidan: る → られる."],
    ["{明日|あした}は {来|こ}られません。", "", "Amanhã não consigo vir.", "{来|く}る → {来|こ}られる."],
    ["ここで {写真|しゃしん}が {撮|と}れますか。", "", "Dá para tirar foto aqui?", ""]
  ],
  care: [
    "Com a forma potencial, o objeto leva **が** em vez de を: {日本語|にほんご}が {話|はな}せます.",
    "No ichidan, o る vira **られる**. Na fala, muita gente diz {食|た}べれる, mas em provas e na escrita use {食|た}べられる.",
    "Para ver e ouvir, existem verbos próprios: {見|み}える (dá para ver) e {聞|き}こえる (dá para ouvir).",
    "**ことができる** serve para qualquer verbo e soa mais formal; a forma potencial é mais curta e comum."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"]]
},

{ id: "tsumori", title: "～つもり e ～（よ）うと{思|おも}う",
  summary: "Como falar de planos e intenções.",
  use: [
    "**～つもり** (forma do dicionário + つもりだ) quer dizer “pretendo ~”: um plano já decidido.",
    "**～（よ）うと{思|おも}う** (forma volitiva + と{思|おも}う) quer dizer “estou pensando em ~”: uma intenção mais leve, que pode mudar.",
    "Para dizer que você **não** pretende, use **ないつもり** ou つもりは ありません."
  ],
  form: [
    "**つもり**: forma do dicionário + つもりです. {来年|らいねん}、{日本|にほん}へ {行|い}くつもりです.",
    "**Forma volitiva**: ichidan: tire o る e ponha **よう** ({食|た}べる → {食|た}べよう). Godan: linha **お** + う ({行|い}く → {行|い}こう, {読|よ}む → {読|よ}もう). する → しよう, {来|く}る → {来|こ}よう.",
    "**～ようと{思|おも}う**: {今日|きょう}は {早|はや}く {寝|ね}ようと {思|おも}います.",
    "**Negativo**: {行|い}かないつもりです (pretendo não ir). Mais firme: {行|い}くつもりは ありません."
  ],
  ex: [
    ["{来年|らいねん}、{日本|にほん}へ {行|い}くつもりです。", "", "Pretendo ir ao Japão ano que vem.", ""],
    ["{夏休|なつやす}みは、{国|くに}へ {帰|かえ}るつもりです。", "", "Nas férias de verão, pretendo voltar para o meu país.", ""],
    ["たばこは もう すわないつもりです。", "", "Pretendo não fumar mais.", "Negativo: ないつもり."],
    ["{今日|きょう}は {早|はや}く {寝|ね}ようと {思|おも}います。", "", "Estou pensando em dormir cedo hoje.", "{寝|ね}る → {寝|ね}よう."],
    ["{週末|しゅうまつ}は {友達|ともだち}に {会|あ}おうと {思|おも}っています。", "", "No fim de semana estou pensando em encontrar um(a) amigo(a).", "{会|あ}う → {会|あ}おう. Para planos em andamento, é comum {思|おも}っています."],
    ["だれと {行|い}くつもりですか。", "", "Com quem você pretende ir?", ""]
  ],
  care: [
    "**つもり** é para um plano **decidido**. **～ようと{思|おも}う** é uma ideia que ainda pode mudar.",
    "Só use com ações que **você** decide: não diga {雨|あめ}が {降|ふ}るつもりです.",
    "Para dizer com firmeza que não vai, use ～つもりは ありません: {行|い}くつもりは ありません (não tenho a menor intenção de ir).",
    "A forma volitiva sozinha, entre amigos, é o “vamos” informal: {行|い}こう (vamos)."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"]]
},

{ id: "temiru", title: "～てみる, ～てしまう, ～ておく",
  summary: "Três usos da forma て + verbo: tentar, concluir (ou lamentar) e deixar preparado.",
  use: [
    "**～てみる** quer dizer “tentar ~, experimentar ~”: fazer algo para ver como é.",
    "**～てしまう** quer dizer “fazer ~ até o fim” (conclusão) e também “acabar fazendo ~ sem querer” (arrependimento).",
    "**～ておく** quer dizer “fazer ~ de antemão” ou “deixar ~ feito”: preparação."
  ],
  form: [
    "**Forma て + みる / しまう / おく**. O segundo verbo é que é conjugado: {食|た}べてみます, {食|た}べてみました.",
    "**てしまう** no passado: ～てしまいました (acabei fazendo / já fiz). Na fala informal: ちゃう / ちゃった ({食|た}べちゃった = acabei comendo).",
    "**ておく** + ください: {開|あ}けておいてください (deixe aberto, por favor)."
  ],
  ex: [
    ["この {料理|りょうり}を {食|た}べてみます。", "", "Vou experimentar este prato.", ""],
    ["{日本語|にほんご}で {話|はな}してみました。", "", "Tentei falar em japonês.", ""],
    ["{宿題|しゅくだい}を {全部|ぜんぶ} してしまいました。", "", "Fiz a lição inteira.", "てしまう: conclusão."],
    ["{財布|さいふ}を {忘|わす}れてしまいました。", "", "Acabei esquecendo a carteira.", "てしまう: arrependimento."],
    ["{旅行|りょこう}の まえに、ホテルを {予約|よやく}しておきます。", "", "Antes da viagem, deixo o hotel reservado.", "ておく: preparação."],
    ["{窓|まど}を {開|あ}けておいてください。", "", "Deixe a janela aberta, por favor.", ""]
  ],
  care: [
    "**てしまう** pode ser conclusão (terminei tudo) ou arrependimento (acabei fazendo sem querer). O contexto mostra qual.",
    "No **てみる**, o みる perde o sentido de “ver”: ele vira “tentar”. Costuma ser escrito em hiragana.",
    "O verbo principal fica na forma て e **não muda**; só o verbo auxiliar (みる, しまう, おく) recebe o tempo.",
    "**ておく** não é o mesmo que ～ている: ておく é preparar, e ～ている é ação em andamento ou estado."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"]]
},

{ id: "sugiru", title: "～すぎる e ～やすい / ～にくい",
  summary: "Excesso e facilidade: demais, fácil de fazer, difícil de fazer.",
  use: [
    "**～すぎる** quer dizer “~ demais”: um excesso. Funciona com verbos e adjetivos.",
    "**～やすい** quer dizer “fácil de ~” e **～にくい**, “difícil de ~”: mostram como é fazer algo com aquela coisa."
  ],
  form: [
    "**Verbo**: tire o ます e acrescente すぎる / やすい / にくい. {食|た}べます → {食|た}べすぎる (comer demais); {書|か}きます → {書|か}きやすい (fácil de escrever); {読|よ}みます → {読|よ}みにくい (difícil de ler).",
    "**Adjetivo い**: tire o い. {高|たか}い → {高|たか}すぎる (caro demais). **Adjetivo な**: sem mudança: しずかすぎる.",
    "**Conjugação**: すぎる é ichidan (すぎます, すぎた, すぎない); やすい e にくい conjugam como adjetivos い (やすかった, にくくない)."
  ],
  ex: [
    ["{昨日|きのう}は {食|た}べすぎました。", "", "Ontem comi demais.", ""],
    ["この かばんは {高|たか}すぎます。", "", "Esta bolsa é cara demais.", "Adjetivo い: tira o い."],
    ["ここは しずかすぎます。", "", "Aqui é quieto demais.", "Adjetivo な: direto."],
    ["この ペンは {書|か}きやすいです。", "", "Esta caneta é fácil de escrever.", ""],
    ["この {漢字|かんじ}は {読|よ}みにくいです。", "", "Este kanji é difícil de ler.", ""],
    ["この {本|ほん}は {読|よ}みやすいです。", "", "Este livro é fácil de ler.", ""]
  ],
  care: [
    "Tire o **ます** do verbo (e o い do adjetivo い) antes de すぎる: {食|た}べますすぎる está errado. O certo é {食|た}べすぎる.",
    "Não confunda com {安|やす}い (barato): o やすい de “fácil de ~” é um sufixo, vem colado ao verbo e se escreve em hiragana.",
    "**すぎる** costuma ter sentido **negativo**: passou do ponto. {食|た}べすぎ é comer mais do que devia.",
    "O **いい** usa a base **よ**: よすぎる (bom demais)."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"], ["Treino de conjugação (adjetivos)", "conjugacao-adjetivos.html"]]
},

{ id: "rentai", title: "Verbo antes de substantivo",
  summary: "Como descrever um substantivo com uma frase: “o livro que comprei”.",
  use: [
    "Em japonês, a descrição vem **antes** do substantivo: uma frase inteira funciona como um adjetivo. Não existe “que” (pronome relativo): basta pôr a **forma curta** antes do substantivo.",
    "Serve para dizer “o livro **que comprei**”, “a cidade **onde moro**”, “a pessoa **que encontrei**”."
  ],
  form: [
    "**Forma curta + substantivo**: {昨日|きのう} {買|か}った {本|ほん} (o livro que comprei ontem). Presente: {毎日|まいにち} {読|よ}む {本|ほん}. Negativo: {読|よ}まない {本|ほん}.",
    "**Sujeito dentro da descrição**: leva **が** (e não は): {私|わたし}が {買|か}った {本|ほん} (o livro que eu comprei).",
    "**Adjetivos** seguem a mesma ideia: {大|おお}きい {家|いえ} (casa grande), しずかな {町|まち} (cidade tranquila).",
    "A frase pode ser longa: {友達|ともだち}が {住|す}んで いる {町|まち} (a cidade onde meu amigo mora)."
  ],
  ex: [
    ["{昨日|きのう} {買|か}った {本|ほん}は おもしろいです。", "", "O livro que comprei ontem é interessante.", ""],
    ["{私|わたし}が {住|す}んで いる {町|まち}は {静|しず}かです。", "", "A cidade onde moro é tranquila.", "O sujeito {私|わたし} leva が."],
    ["これは {母|はは}が {作|つく}った ケーキです。", "", "Este é o bolo que minha mãe fez.", ""],
    ["{駅|えき}に ある {店|みせ}で {昼|ひる}ごはんを {食|た}べました。", "", "Almocei numa loja que fica na estação.", ""],
    ["{昨日|きのう} {会|あ}った {人|ひと}は {先生|せんせい}でした。", "", "A pessoa que encontrei ontem era professor(a).", ""],
    ["{私|わたし}が {行|い}きたい {国|くに}は {日本|にほん}です。", "", "O país aonde quero ir é o Japão.", "{行|い}きたい (たい) também entra na descrição."]
  ],
  care: [
    "A descrição vem **antes**: {買|か}った {本|ほん}, e não {本|ほん} {買|か}った.",
    "Dentro da descrição, use a **forma curta**: {買|か}いました {本|ほん} está errado. O certo é {買|か}った {本|ほん}.",
    "O sujeito da descrição costuma levar **が**, e não は: {私|わたし}が {買|か}った {本|ほん}.",
    "Não existe palavra para “que”: a própria forma curta faz esse papel."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"]]
},

{ id: "node-noni", title: "～ので, ～のに, ～けど",
  summary: "Como dar o motivo e o contraste: porque, embora, mas.",
  use: [
    "**～ので** quer dizer “porque ~ / por isso”: o motivo, de forma objetiva e educada.",
    "**～のに** quer dizer “embora ~ / apesar de ~”: algo contrário ao esperado, com surpresa ou queixa.",
    "**～けど** e **～が** querem dizer “mas ~”: contraste simples. けど é mais casual e が, mais formal."
  ],
  form: [
    "**ので**: forma curta + ので. {熱|ねつ}が あるので、{休|やす}みます (como estou com febre, descanso).",
    "**のに**: forma curta + のに. たくさん {食|た}べたのに、おなかが すいて います (embora tenha comido bastante, estou com fome).",
    "**けど / が**: forma curta ou educada + けど / が. {高|たか}いですが、{買|か}います (é caro, mas compro).",
    "**Substantivo e adjetivo な** antes de ので e のに: **な**. {休|やす}みなので (porque é folga), {日曜日|にちようび}なのに (embora seja domingo)."
  ],
  ex: [
    ["{熱|ねつ}が あるので、{今日|きょう}は {休|やす}みます。", "", "Como estou com febre, hoje vou descansar.", ""],
    ["{雨|あめ}が {降|ふ}って いるので、{行|い}きません。", "", "Como está chovendo, não vou.", ""],
    ["{静|しず}かなので、{勉強|べんきょう}しやすいです。", "", "Como é tranquilo, é fácil estudar.", "Adjetivo な: な + ので."],
    ["{日曜日|にちようび}なのに、{仕事|しごと}です。", "", "Embora seja domingo, tenho trabalho.", "Substantivo: な + のに."],
    ["たくさん {食|た}べたのに、まだ おなかが すいて います。", "", "Embora tenha comido bastante, ainda estou com fome.", ""],
    ["{高|たか}いですが、{買|か}います。", "", "É caro, mas vou comprar.", ""]
  ],
  care: [
    "Antes de **ので** e **のに**, o substantivo e o adjetivo な ganham **な**: {休|やす}みなので, しずかなのに. Não existe だので nem だのに.",
    "**ので** soa mais suave e objetivo; é a escolha para dar explicações a quem merece respeito.",
    "**のに** mostra surpresa ou queixa. Para um contraste neutro, use けど ou が.",
    "A frase pode terminar em **けど** e deixar o resto no ar. É comum ao hesitar para pedir ou recusar."
  ],
  practice: [["Treino de conjugação (adjetivos)", "conjugacao-adjetivos.html"]]
},

{ id: "tame-you", title: "～ために e ～ように",
  summary: "Como dizer a finalidade: para, a fim de, para que.",
  use: [
    "**～ために** quer dizer “para ~ / a fim de ~”: a finalidade de uma ação **que você controla**. Os dois lados da frase têm o **mesmo sujeito**.",
    "**～ように** quer dizer “para que ~ / de modo a ~”: a finalidade de algo que **não depende só da sua vontade** (poder fazer, não esquecer, mudança) ou com **sujeitos diferentes**."
  ],
  form: [
    "**ために**: verbo (dicionário) + ために. {日本語|にほんご}を {勉強|べんきょう}する ために、{日本|にほん}へ {行|い}きます (vou ao Japão para estudar japonês). Com substantivo: **の + ために** ({家族|かぞく}の ために).",
    "**ように**: verbo (dicionário ou ない) + ように. {忘|わす}れない ように、メモを とります (anoto para não esquecer).",
    "**Potencial + ように**: {日本語|にほんご}が {話|はな}せる ように、{毎日|まいにち} {練習|れんしゅう}します (pratico todo dia para conseguir falar japonês)."
  ],
  ex: [
    ["{日本語|にほんご}を {勉強|べんきょう}する ために、{日本|にほん}へ {行|い}きます。", "", "Vou ao Japão para estudar japonês.", "Mesmo sujeito: ために."],
    ["{家族|かぞく}の ために、{働|はたら}いて います。", "", "Trabalho pela minha família.", "Substantivo: の + ために."],
    ["{家|いえ}を {買|か}う ために、おかねを ためて います。", "", "Estou juntando dinheiro para comprar uma casa.", ""],
    ["{忘|わす}れない ように、メモを とります。", "", "Anoto para não esquecer.", "Com ない: ように."],
    ["{日本語|にほんご}が {話|はな}せる ように、{毎日|まいにち} {練習|れんしゅう}して います。", "", "Pratico todo dia para conseguir falar japonês.", "Potencial: ように."],
    ["みんなが {読|よ}める ように、{大|おお}きく {書|か}きます。", "", "Escrevo grande para que todos possam ler.", "Sujeitos diferentes: ように."]
  ],
  care: [
    "**ために** pede **o mesmo sujeito** e uma ação que você controla. Com potencial ou ない, prefira **ように**.",
    "Com substantivo, use **の + ために**: {家族|かぞく}の ために, e não {家族|かぞく}ために.",
    "O **ために** também aparece, em textos formais, com o sentido de “por causa de”. Aqui você aprende o sentido de finalidade.",
    "Antes de **ように**, o verbo fica na forma do dicionário ou na forma ない, e não em ます."
  ],
  practice: [["Treino de conjugação (verbos)", "conjugacao.html"]]
},

{ id: "ageru", title: "あげる, もらう, くれる",
  summary: "Os verbos de dar e receber, e como o ponto de vista escolhe o verbo.",
  use: [
    "O japonês tem três verbos para dar e receber, e a escolha depende de **quem é o ponto de vista** da frase.",
    "**あげる**: dar a outra pessoa (você → outro, ou outro → outro). **くれる**: dar **para mim** (ou para o meu grupo). **もらう**: receber."
  ],
  form: [
    "**あげる**: quem dá は + destinatário に + coisa を + あげる. {私|わたし}は {友達|ともだち}に プレゼントを あげました.",
    "**くれる**: quem dá は + {私|わたし}に + coisa を + くれる. {友達|ともだち}は {私|わたし}に プレゼントを くれました.",
    "**もらう**: quem recebe は + quem dá に (ou から) + coisa を + もらう. {私|わたし}は {友達|ともだち}に プレゼントを もらいました.",
    "**Com a forma て**: ～てあげる (fazer algo por alguém), ～てくれる (alguém faz algo por mim), ～てもらう (alguém faz algo por mim, a meu pedido ou com minha gratidão).",
    "Para quem merece mais respeito, existem formas próprias (keigo): さしあげる, くださる, いただく."
  ],
  ex: [
    ["{私|わたし}は {友達|ともだち}に プレゼントを あげました。", "", "Dei um presente a um(a) amigo(a).", ""],
    ["{友達|ともだち}は {私|わたし}に プレゼントを くれました。", "", "Um(a) amigo(a) me deu um presente.", "くれる: o destinatário sou eu."],
    ["{私|わたし}は {友達|ともだち}に プレゼントを もらいました。", "", "Recebi um presente de um(a) amigo(a).", "A pessoa que dá leva に."],
    ["{母|はは}は {私|わたし}に {時計|とけい}を くれました。", "", "Minha mãe me deu um relógio.", ""],
    ["{友達|ともだち}に {本|ほん}を {貸|か}して あげました。", "", "Emprestei um livro a um(a) amigo(a).", "～てあげる: fiz algo por alguém."],
    ["{先生|せんせい}に {日本語|にほんご}を {教|おし}えて もらいました。", "", "O(A) professor(a) me ensinou japonês.", "～てもらう: alguém fez algo por mim."]
  ],
  care: [
    "**くれる** é sempre “para mim” (ou para o meu grupo). Para dar a outra pessoa, use あげる.",
    "No **あげる**, o destinatário leva **に**. No **もらう**, quem dá leva **に** ou **から**.",
    "Falando com ou sobre alguém que merece respeito, ～てあげる pode soar como um favor condescendente. Nesses casos existem formas mais educadas.",
    "Dar e receber são o mesmo fato visto por lados opostos: {友達|ともだち}が くれた = {私|わたし}は {友達|ともだち}に もらった."
  ],
  practice: [["Lacuna (modo Partículas)", "lacuna.html"]]
},

{ id: "souda", title: "～そうだ, ～ようだ, ～らしい",
  summary: "Como falar de aparência e de boatos: parece que, dizem que.",
  use: [
    "**～そうだ (aparência)**: “parece ~, tem cara de ~”. Baseado no que você **vê**.",
    "**～そうだ (ouvi dizer)**: “dizem que ~”. Baseado no que você **ouviu** de alguém ou da TV.",
    "**～ようだ / ～みたいだ**: “parece que ~”, uma impressão baseada em evidências. **～らしい**: “pelo visto ~, dizem que ~”."
  ],
  form: [
    "**Aparência**: verbo, tire o ます ({降|ふ}りそうだ); adjetivo い, tire o い (おいしそうだ); adjetivo な, direto (しずかそうだ).",
    "**Exceções**: いい → **よさそう**, ない → **なさそう**.",
    "**Ouvi dizer**: forma curta + そうだ. {明日|あした}は {雨|あめ}が {降|ふ}る そうです.",
    "**ようだ**: forma curta + ようだ (substantivo + の, adjetivo な + な). **らしい**: forma curta + らしい (substantivo e adjetivo な, sem だ)."
  ],
  ex: [
    ["この ケーキは おいしそうです。", "", "Este bolo parece gostoso.", "Aparência: おいしい → おいしそう."],
    ["{雨|あめ}が {降|ふ}りそうです。", "", "Parece que vai chover.", "Aparência: {降|ふ}ります → {降|ふ}りそう."],
    ["ニュースに よると、{明日|あした}は {雨|あめ}が {降|ふ}る そうです。", "", "Segundo o noticiário, dizem que vai chover amanhã.", "Ouvi dizer: forma curta + そうだ."],
    ["{誰|だれ}も いない ようです。", "", "Parece que não tem ninguém.", "ようだ: impressão com base no que se percebe."],
    ["{田中|たなか}さんは {病気|びょうき}らしいです。", "", "Pelo visto, Tanaka-san está doente.", ""],
    ["この {問題|もんだい}は {難|むずか}しそうです。", "", "Este problema parece difícil.", ""]
  ],
  care: [
    "O **そうだ** de aparência vem do verbo sem ます ou do adjetivo sem い. O **そうだ** de “dizem que” vem da forma curta. A forma antes do そう muda o sentido.",
    "**よさそう** e **なさそう** são as formas de いい e ない (e não いそう nem ないそう).",
    "O **そうだ** de aparência fala de uma impressão **visual**; não use para algo que você já experimentou.",
    "**らしい** e **ようだ** são próximos: らしい vem de algo que se ouviu ou deduziu; ようだ, do que você percebeu."
  ],
  practice: [["Treino de conjugação (adjetivos)", "conjugacao-adjetivos.html"]]
},

{ id: "dake-shika", title: "も, でも, しか, だけ, ばかり",
  summary: "Partículas de limite e ênfase: só, apenas, nada além de, qualquer.",
  use: [
    "**だけ** quer dizer “só, apenas”: limita a uma coisa ou quantidade.",
    "**しか** quer dizer “nada além de”: sempre com verbo **negativo**, e mostra que é pouco.",
    "**ばかり** quer dizer “só, quase só”: repetição ou predominância.",
    "**でも** quer dizer “~ ou algo assim”: sugestão suave. Com palavras interrogativas, vira “qualquer ~”.",
    "**も** com palavra interrogativa e verbo negativo quer dizer “nenhum / ninguém / nada”; com um número, mostra que a quantidade é grande."
  ],
  form: [
    "**だけ**: {水|みず}だけ {飲|の}みました (só bebi água). **しか**: {水|みず}しか {飲|の}みませんでした (não bebi nada além de água).",
    "**ばかり**: {肉|にく}ばかり {食|た}べます (só como carne, ou quase).",
    "**でも**: {お茶|おちゃ}でも {飲|の}みませんか (que tal um chá ou algo assim?). **Interrogativa + でも**: だれでも (qualquer pessoa), いつでも (a qualquer hora).",
    "**Interrogativa + も + negativo**: だれも いません (não há ninguém), なにも {食|た}べません (não como nada). **Número + も**: {三時間|さんじかん}も {待|ま}ちました (esperei três horas inteiras)."
  ],
  ex: [
    ["{水|みず}だけ {飲|の}みました。", "", "Só bebi água.", ""],
    ["{水|みず}しか {飲|の}みませんでした。", "", "Não bebi nada além de água.", "しか + negativo."],
    ["{肉|にく}ばかり {食|た}べて います。", "", "Só como carne (quase só carne).", ""],
    ["{お茶|おちゃ}でも {飲|の}みませんか。", "", "Que tal um chá ou algo assim?", ""],
    ["{教室|きょうしつ}には だれも いません。", "", "Não há ninguém na sala de aula.", "だれも + negativo."],
    ["{三時間|さんじかん}も {待|ま}ちました。", "", "Esperei três horas inteiras.", "Número + も: quantidade grande."]
  ],
  care: [
    "**しか** exige o verbo no **negativo**: {水|みず}しか {飲|の}みました está errado.",
    "**だけ** é neutro; **しか** mostra que a pessoa acha pouco.",
    "**ばかり** não é limite exato: indica repetição ou predominância (“quase só”).",
    "Com **だれ / なに / いつ**: **も + negativo** quer dizer “nenhum(a)”, e **でも + afirmativo** quer dizer “qualquer”. だれも いません e だれでも いいです têm sentidos opostos."
  ],
  practice: [["Lacuna (modo Partículas)", "lacuna.html"]]
},

{ id: "adv-naru", title: "Adjetivos como advérbio e ～ほうがいい",
  summary: "Como transformar adjetivos em advérbios, falar de mudança e dar conselhos.",
  use: [
    "**Advérbio**: adjetivo い → **く**; adjetivo な → **に**. {早|はや}く {起|お}きます (acordo cedo), しずかに {話|はな}します (falo baixinho).",
    "**～くなる / ～になる** quer dizer “ficar ~, tornar-se ~”: uma mudança de estado.",
    "**～ほうがいい** quer dizer “é melhor ~”: um conselho."
  ],
  form: [
    "**Adjetivo い**: {早|はや}い → {早|はや}く. **Adjetivo な**: しずか → しずかに. **Exceção**: いい → **よく**.",
    "**Mudança**: {寒|さむ}く なる (esfriar), きれいに なる (ficar bonito), **substantivo + に なる** ({医者|いしゃ}に なる, virar médico).",
    "**ほうがいい**: forma **た** + ほうがいい ({休|やす}んだ ほうが いい); forma **ない** + ほうがいい ({行|い}かない ほうが いい)."
  ],
  ex: [
    ["{朝|あさ} {早|はや}く {起|お}きます。", "", "Acordo cedo de manhã.", "Adjetivo い: い → く."],
    ["ここでは しずかに {話|はな}してください。", "", "Fale baixinho aqui, por favor.", "Adjetivo な: に."],
    ["{最近|さいきん}、{寒|さむ}く なりました。", "", "Ultimamente esfriou.", "～くなる: mudança."],
    ["{日本語|にほんご}が {上手|じょうず}に なりたいです。", "", "Quero ficar bom em japonês.", ""],
    ["{医者|いしゃ}に なりたいです。", "", "Quero ser médico(a).", "Substantivo + に なる."],
    ["{薬|くすり}を {飲|の}んだ ほうが いいですよ。", "", "É melhor tomar o remédio.", "Forma た + ほうがいい."]
  ],
  care: [
    "O **いい** vira **よく**: よく なりました (melhorou).",
    "No **ほうがいい**, use a forma **た** para “é melhor fazer” e a forma **ない** para “é melhor não fazer”.",
    "Não confunda **に** (adjetivo な: しずかに) com **く** (adjetivo い: {早|はや}く).",
    "O **ほうがいい** é um conselho: com superiores, pode soar como ordem."
  ],
  practice: [["Treino de conjugação (adjetivos)", "conjugacao-adjetivos.html"]]
},

{ id: "koto-no", title: "こと e の: transformar verbo em substantivo",
  summary: "Como transformar um verbo em substantivo: o ato de ~.",
  use: [
    "**～こと** e **～の** transformam uma frase em **substantivo**: “o ato de ~”, “o fato de ~”. {泳|およ}ぐこと (nadar, o ato de nadar).",
    "Servem para dizer do que você gosta, em que é bom ou qual é o seu hobby.",
    "**こと** é mais formal e aparece em expressões fixas (～ことができる, ～たことがある, {趣味|しゅみ}は ～こと). **の** é mais comum no dia a dia."
  ],
  form: [
    "**Verbo (forma curta) + こと / の**: {本|ほん}を {読|よ}む こと.",
    "**Gostar, ser bom em**: ～のが すき / じょうず / へた. {料理|りょうり}を する のが {好|す}きです.",
    "**Hobby**: {私|わたし}の {趣味|しゅみ}は {映画|えいが}を {見|み}る ことです.",
    "**Percepção** (ver, ouvir): ～のを {見|み}る / {聞|き}く. {子供|こども}が {歌|うた}って いる のを {聞|き}きました."
  ],
  ex: [
    ["{料理|りょうり}を する のが {好|す}きです。", "", "Gosto de cozinhar.", ""],
    ["{私|わたし}の {趣味|しゅみ}は {映画|えいが}を {見|み}る ことです。", "", "Meu hobby é assistir a filmes.", ""],
    ["{田中|たなか}さんは {泳|およ}ぐ のが {上手|じょうず}です。", "", "Tanaka-san nada bem.", ""],
    ["{早|はや}く {起|お}きる のは {大変|たいへん}です。", "", "Acordar cedo é trabalhoso.", "のは: o ato de acordar cedo é o tema."],
    ["{子供|こども}が {歌|うた}って いる のを {聞|き}きました。", "", "Ouvi a criança cantando.", ""],
    ["{毎日|まいにち} {日本語|にほんご}を {勉強|べんきょう}する ことが {大切|たいせつ}です。", "", "É importante estudar japonês todo dia.", ""]
  ],
  care: [
    "Com **ことができる** e **たことがある**, use sempre **こと**. Com すき, じょうず, みる e きく, o **の** é o mais natural.",
    "Antes de **こと** e **の**, o verbo fica na **forma curta**: {泳|およ}ぎますのが está errado.",
    "O **の** aqui não é o の de posse: ele faz o papel de “o ato de”.",
    "O **こと** também é “coisa, assunto”: {大切|たいせつ}な こと (uma coisa importante)."
  ],
  practice: [["Lacuna (modo Partículas)", "lacuna.html"]]
},

{ id: "setsuzoku", title: "Conjunções: そして, でも, だから",
  summary: "As palavras que ligam uma frase à outra: e, mas, por isso, além disso.",
  use: [
    "As conjunções ficam **no início da frase** e ligam essa frase à anterior.",
    "Elas ligam **frases inteiras**. Para ligar substantivos, use と; para ligar verbos na mesma frase, a forma て."
  ],
  form: [
    "**そして**: “e, e depois”, soma ideias. **それから**: “e depois”, sequência no tempo. **それに**: “além disso”.",
    "**でも**: “mas”. **しかし**: “porém”, mais formal.",
    "**だから**: “por isso”. **ですから**: mais educado. **それで**: “então, por isso”, resultado natural.",
    "**ところで**: “a propósito”, muda de assunto. **じゃあ**: “então”, para concluir ou começar."
  ],
  ex: [
    ["{朝|あさ}ごはんを {食|た}べました。そして、{学校|がっこう}へ {行|い}きました。", "", "Tomei café da manhã. E depois fui à escola.", ""],
    ["{映画|えいが}を {見|み}ました。それから、ごはんを {食|た}べました。", "", "Vi um filme. Depois, comi.", ""],
    ["{日本語|にほんご}は {難|むずか}しいです。でも、おもしろいです。", "", "O japonês é difícil. Mas é interessante.", ""],
    ["{今日|きょう}は {雨|あめ}です。だから、{出|で}かけません。", "", "Hoje está chovendo. Por isso, não vou sair.", ""],
    ["この {店|みせ}は {安|やす}いです。それに、おいしいです。", "", "Este lugar é barato. Além disso, é gostoso.", ""],
    ["ところで、{明日|あした}は {何時|なんじ}に {会|あ}いますか。", "", "A propósito, a que horas nos encontramos amanhã?", ""]
  ],
  care: [
    "**そして** soma ideias; **それから** mostra ordem no tempo. Para ligar verbos dentro da mesma frase, use a forma て.",
    "**でも** no início da frase é “mas”. Ele também é uma partícula (“ou algo assim”, “qualquer”): o contexto mostra qual é.",
    "**だから** é direto e pode soar seco; **ですから** é mais educado.",
    "As conjunções ligam **frases**: para ligar substantivos, use と."
  ],
  practice: [["Lacuna (modo Partículas)", "lacuna.html"]]
}
] },
{ id: "avancado", name: "Avançado", level: "~N2-N1", topics: [
{ id: "passivo", title: "Passivo: ～れる, ～られる",
  summary: "Como dizer que algo é feito a você ou a outra pessoa: ser elogiado, ser pisado, ser pintado por alguém.",
  use: [
    "**Passivo direto**: o sujeito recebe a ação de alguém. Quem faz a ação vem marcado com **に**: 先生に ほめられました (fui elogiado(a) pelo(a) professor(a)).",
    "**Passivo de incômodo**: a ação de outra pessoa (ou da natureza) atinge você e causa desconforto. Em português quase sempre ganha outra forma: {雨|あめ}に {降|ふ}られました quer dizer “fui pego(a) pela chuva”. Esse passivo existe até com verbos sem objeto, como {降|ふ}る (chover) e {泣|な}く (chorar): o sentido é “aconteceu e eu sofri com isso”.",
    "**Passivo de posse**: alguém age sobre algo seu (corpo, objeto, comida) e você é o sujeito. O objeto continua com **を**: {足|あし}を {踏|ふ}まれました (pisaram no meu pé).",
    "**Passivo de coisas**: quando quem age não importa, o assunto é a própria coisa: この 本は {多|おお}くの 人に 読まれて います (este livro é lido por muita gente). Para obras, invenções e criadores, o agente costuma vir com **によって**."
  ],
  form: [
    "**Verbos godan**: troque a última sílaba pela do **あ** e acrescente **れる**: 書く → 書かれる. Atenção ao **う**: vira **わ** ({買|か}う → {買|か}われる), e não あ.",
    "**Verbos ichidan**: tire **る** e acrescente **られる**: 食べる → 食べられる; 見る → 見られる.",
    "**Irregulares**: する → **される**; くる → **こられる** ({来|こ}られる).",
    "O passivo se conjuga como um verbo ichidan: 書かれる → 書かれない, 書かれた, 書かれて.",
    "**Quem faz a ação**: **に** na maioria dos casos; **によって** para obras e fatos formais ({描|えが}かれました, {発明|はつめい}されました); com verbos de comunicação ({言|い}われる, {頼|たの}まれる), **から** também é aceito."
  ],
  tables: [{ title: "Como formar o passivo", head: ["Grupo", "Regra", "Dicionário", "Passivo"], rows: [
    ["Godan (う)", "う → われる", "{買|か}う", "{買|か}われる"],
    ["Godan (く)", "く → かれる", "書く", "書かれる"],
    ["Godan (ぐ)", "ぐ → がれる", "{泳|およ}ぐ", "{泳|およ}がれる"],
    ["Godan (す)", "す → される", "話す", "話される"],
    ["Godan (つ)", "つ → たれる", "{待|ま}つ", "{待|ま}たれる"],
    ["Godan (ぶ)", "ぶ → ばれる", "{呼|よ}ぶ", "{呼|よ}ばれる"],
    ["Godan (む)", "む → まれる", "読む", "読まれる"],
    ["Godan (る)", "る → られる (ら + れる)", "{作|つく}る", "{作|つく}られる"],
    ["Ichidan", "る → られる", "食べる", "食べられる"],
    ["Irregular", "する → される", "する", "される"],
    ["Irregular", "くる → こられる", "{来|く}る", "{来|こ}られる"]
  ]}],
  ex: [
    ["先生に **ほめられ**ました。", "", "Fui elogiado(a) pelo(a) professor(a).", "Passivo direto: quem elogia leva に."],
    ["{私|わたし}の ケーキを {妹|いもうと}に **食べられ**ました。", "", "Minha irmã comeu o meu bolo (e eu fiquei chateado(a)).", "Passivo de posse e de incômodo."],
    ["電車で {足|あし}を **{踏|ふ}まれ**ました。", "", "Pisaram no meu pé no trem.", "O objeto (足を) continua na frase."],
    ["雨に **{降|ふ}られ**て、ぬれました。", "", "Fui pego(a) pela chuva e me molhei.", "Passivo de incômodo com verbo sem objeto."],
    ["この {絵|え}は {有名|ゆうめい}な {画家|がか}によって **{描|えが}かれ**ました。", "", "Este quadro foi pintado por um(a) pintor(a) famoso(a).", "によって para o criador de uma obra."],
    ["この 本は {多|おお}くの 人に **読まれ**て います。", "", "Este livro é lido por muita gente.", "Passivo de coisas: o foco é o livro."]
  ],
  care: [
    "O passivo de **incômodo** não tem equivalente direto em português. Se a frase soa estranha na tradução literal, talvez o sentido seja “eu **sofri** com isso”.",
    "Quem age leva **に** (não existe “por” fixo): para criadores de obras, use **によって**.",
    "**られる** é a mesma forma do passivo, do potencial e do honorífico (食べられる pode ser “é comido”, “consegue comer” ou “o(a) senhor(a) come”). O contexto mostra qual é.",
    "Não esqueça o **わ** nos verbos em う: {買|か}う → {買|か}われる; e くる vira **こられる**, não きられる.",
    "Os verbos godan em る ({作|つく}る, {取|と}る) formam o passivo com **ら + れる**; o resultado parece o do ichidan, mas a regra é outra."
  ],
  practice: [["Treino de conjugação (passiva)", "conjugacao.html"]]
},

{ id: "causativo", title: "Causativo: ～せる, ～させる",
  summary: "Como dizer que alguém faz outra pessoa fazer algo, ou a deixa fazer: obrigar, permitir e causar emoções.",
  use: [
    "**Obrigar**: A は B に ～させる quer dizer “A faz B fazer ~”: {母|はは}は {子|こ}どもに {野菜|やさい}を 食べさせました (a mãe fez a criança comer legumes).",
    "**Permitir**: a mesma forma também quer dizer “deixar”. O contexto (e palavras como {自由|じゆう}に, {好|す}きな) mostra que é permissão.",
    "**Pedir permissão**: ～**させて ください** quer dizer “deixe-me ~”: {説明|せつめい}させて ください. É a forma educada de se oferecer ou de pedir licença.",
    "**Causar emoção ou reação**: com verbos de sentimento, o causativo quer dizer “fazer alguém sentir ou reagir”: みんなを {笑|わら}わせる (fazer todo mundo rir), {親|おや}を {心配|しんぱい}させる (preocupar os pais)."
  ],
  form: [
    "**Verbos godan**: troque a última sílaba pela do **あ** e acrescente **せる**: 書く → 書かせる. O **う** vira **わ**: {買|か}う → {買|か}わせる.",
    "**Verbos ichidan**: tire **る** e acrescente **させる**: 食べる → 食べさせる; 見る → 見させる.",
    "**Irregulares**: する → **させる**; くる → **こさせる** ({来|こ}させる).",
    "O resultado se conjuga como ichidan: 食べさせる → 食べさせない, 食べさせた, 食べさせて.",
    "**Partículas**: com verbo transitivo (que já tem を), quem recebe a ordem leva **に**: {子|こ}どもに {野菜|やさい}を 食べさせる. Com verbo intransitivo, **を** soa como obrigar ({子|こ}どもを 行かせる) e **に** soa como deixar ou pedir ({子|こ}どもに 行かせる). Com verbos de emoção, só **を**: {親|おや}を {心配|しんぱい}させる."
  ],
  tables: [{ title: "Como formar o causativo", head: ["Grupo", "Regra", "Dicionário", "Causativo"], rows: [
    ["Godan (う)", "う → わせる", "{買|か}う", "{買|か}わせる"],
    ["Godan (く)", "く → かせる", "書く", "書かせる"],
    ["Godan (ぐ)", "ぐ → がせる", "{泳|およ}ぐ", "{泳|およ}がせる"],
    ["Godan (す)", "す → させる", "話す", "話させる"],
    ["Godan (つ)", "つ → たせる", "{待|ま}つ", "{待|ま}たせる"],
    ["Godan (ぶ)", "ぶ → ばせる", "{呼|よ}ぶ", "{呼|よ}ばせる"],
    ["Godan (む)", "む → ませる", "読む", "読ませる"],
    ["Godan (る)", "る → らせる", "{作|つく}る", "{作|つく}らせる"],
    ["Ichidan", "る → させる", "食べる", "食べさせる"],
    ["Irregular", "する → させる", "する", "させる"],
    ["Irregular", "くる → こさせる", "{来|く}る", "{来|こ}させる"]
  ]}],
  ex: [
    ["{母|はは}は {子|こ}どもに {野菜|やさい}を **食べさせ**ました。", "", "A mãe fez a criança comer legumes.", "Verbo transitivo: quem recebe a ordem leva に."],
    ["友だちを **{待|ま}たせ**て しまいました。", "", "Acabei fazendo meu(minha) amigo(a) esperar.", "Com を, a pessoa é só quem sofre a ação."],
    ["先生は {学生|がくせい}に {自由|じゆう}に {作文|さくぶん}を **書かせ**ました。", "", "O(a) professor(a) deixou os alunos escreverem a redação livremente.", "Aqui o causativo é de permissão."],
    ["{田中|たなか}さんは みんなを **{笑|わら}わせ**ました。", "", "Tanaka-san fez todo mundo rir.", "Causativo de reação."],
    ["子どもの ころ、よく {親|おや}を **{心配|しんぱい}させ**ました。", "", "Quando eu era criança, preocupava muito os meus pais.", "Verbo de emoção: を."],
    ["{私|わたし}に {説明|せつめい}**させ**て ください。", "", "Deixe-me explicar.", "～させて ください: pedido educado."]
  ],
  care: [
    "O causativo serve para **obrigar** e para **deixar**: a forma é a mesma. Para deixar claro que é permissão, use ～**させて あげる**: {子|こ}どもに ゲームを させて あげる.",
    "Com pessoas acima de você, o causativo de obrigar soa mal. Para pedir um favor, use ～て もらう / ～て いただく.",
    "Não confunda ～**させて ください** (“deixe-me ~”, eu faço) com ～**して ください** (“faça ~”, você faz).",
    "O **くる** vira **こさせる**, não きさせる.",
    "Quem é obrigado a fazer leva **に** (ou **を**), nunca は: o sujeito da frase é quem manda ou deixa."
  ],
  practice: []
},

{ id: "causativo-passivo", title: "Causativo-passivo: ～させられる",
  summary: "Como dizer que você foi obrigado(a) a fazer algo contra a vontade: ser forçado a comer, a ouvir, a beber.",
  use: [
    "**Ser obrigado(a) a ~**: o sujeito foi forçado por alguém a fazer algo, e **não queria**: {私|わたし}は {母|はは}に {野菜|やさい}を 食べさせられました (minha mãe me obrigou a comer legumes).",
    "**Sentimento**: a frase carrega desconforto, cansaço ou protesto de quem fala. Sem esse sentimento, o japonês usaria o causativo comum.",
    "**Quem manda** vem com **に**; **o que foi obrigado a fazer** vem com **を** ({残業|ざんぎょう}を させられた)."
  ],
  form: [
    "**Causativo + passivo**: forme o causativo (書かせる) e passe para o passivo (書かせられる). 食べさせる → 食べさせられる.",
    "**Forma curta dos godan**: ～**される** em lugar de ～せられる (書かせられる → 書かされる; {飲|の}ませられる → {飲|の}まされる). Não vale para verbos em **す**: 話させられる.",
    "**Irregulares**: する → **させられる**; くる → **こさせられる** ({来|こ}させられる).",
    "Conjuga-se como ichidan: 食べさせられる → 食べさせられない, 食べさせられた, 食べさせられて."
  ],
  tables: [{ title: "Forma longa e forma curta", head: ["Dicionário", "Longa", "Curta"], rows: [
    ["書く", "書かせられる", "書かされる"],
    ["{飲|の}む", "{飲|の}ませられる", "{飲|の}まされる"],
    ["{立|た}つ", "{立|た}たせられる", "{立|た}たされる"],
    ["話す", "話させられる", "(sem forma curta)"],
    ["食べる", "食べさせられる", "(sem forma curta)"],
    ["する", "させられる", "(sem forma curta)"],
    ["{来|く}る", "{来|こ}させられる", "(sem forma curta)"]
  ]}],
  ex: [
    ["{私|わたし}は {母|はは}に {野菜|やさい}を **食べさせられ**ました。", "", "Minha mãe me obrigou a comer legumes.", "Obrigado(a) por alguém, contra a vontade."],
    ["{昨日|きのう}は {残業|ざんぎょう}を **させられ**ました。", "", "Ontem fui obrigado(a) a fazer hora extra.", "Forma de する: させられる."],
    ["子どもの ころ、毎日 ピアノを **{練習|れんしゅう}させられ**ました。", "", "Quando criança, eu era obrigado(a) a praticar piano todo dia.", ""],
    ["{飲|の}み{会|かい}で {無理|むり}やり お{酒|さけ}を **{飲|の}まされ**ました。", "", "Na festa de bebidas, fui forçado(a) a beber.", "Forma curta dos godan: ～される."],
    ["先生に {廊下|ろうか}に **{立|た}たされ**ました。", "", "O(a) professor(a) me fez ficar de pé no corredor.", "Castigo clássico de escola."],
    ["{長|なが}い 話を **聞かされ**ました。", "", "Fui obrigado(a) a ouvir uma história longa.", "聞く → 聞かされる."]
  ],
  care: [
    "Se a pessoa **quer** fazer a ação, não use causativo-passivo: ele sempre mostra que foi contra a vontade. Para “me deixaram fazer”, veja ～**させて もらう** (kenjougo, mais adiante).",
    "Os godan em **す** não têm forma curta: 話させられる, e não 話さされる.",
    "O **sujeito** é quem foi obrigado(a); quem manda leva **に**. Não troque os dois.",
    "Em português o sentido vem de “me obrigaram a ~”, “tive que ~”. Procure a ideia de **desconforto** quando for traduzir.",
    "Longo demais? Use a forma curta ～される nos verbos godan; ela é a mais comum na fala."
  ],
  practice: []
},

{ id: "you-ni-suru", title: "～ように する, ～ように なる",
  summary: "Como falar de mudança gradual e de esforço: passar a conseguir, procurar fazer, estar programado para.",
  use: [
    "**～ように なる**: “passar a ~, chegar a ~”. Mostra uma **mudança**, em geral gradual: antes não era assim, agora é. 日本語が 話せる ように なりました.",
    "**～ように する**: “procurar ~, fazer questão de ~”. Mostra um **esforço** consciente sobre o que você faz ou evita: 毎日 {野菜|やさい}を 食べる ように して います.",
    "**～ように なって いる**: “foi feito para ~, funciona de modo que ~”. Descreve o funcionamento de uma máquina, regra ou sistema.",
    "**～ように {言|い}う / {頼|たの}む**: “dizer ou pedir para (alguém) ~”. Transmite uma ordem ou pedido de modo indireto: {医者|いしゃ}に お{酒|さけ}を {飲|の}まない ように {言|い}われました."
  ],
  form: [
    "**Verbo na forma de dicionário (ou ない) + ように なる / する**: 話せる ように なる; {遅刻|ちこく}しない ように する.",
    "Para falar de capacidade, o verbo antes de ように costuma estar no **potencial**: 話せる, 読める, {泳|およ}げる.",
    "**Tempos**: ように なりました (a mudança aconteceu), ように なって います (estado atual), ように して います (esforço mantido), ように します (decisão de procurar fazer).",
    "**Mudança negativa**: ～**なく なる** quer dizer “deixar de ~”: {目|め}が {悪|わる}く なって、{字|じ}が 読めなく なりました (a vista piorou e deixei de conseguir ler as letras)."
  ],
  tables: [{ title: "Quatro usos de ように", head: ["Forma", "Ideia", "Exemplo"], rows: [
    ["～ように なる", "passar a ~ (mudança)", "{泳|およ}げる ように なる"],
    ["～ように する", "procurar ~ (esforço)", "{早|はや}く {寝|ね}る ように する"],
    ["～ように なって いる", "foi feito para ~ (sistema)", "{自動|じどう}で {開|あ}く ように なって いる"],
    ["～ように {言|い}う", "dizer para ~ (pedido indireto)", "{遅|おく}れない ように {言|い}う"]
  ]}],
  ex: [
    ["日本語が {話|はな}せる **ように なりました**。", "", "Passei a conseguir falar japonês.", "Potencial + ように なる."],
    ["毎日 {野菜|やさい}を 食べる **ように して います**。", "", "Procuro comer legumes todo dia.", "Esforço mantido."],
    ["{遅刻|ちこく}しない **ように します**。", "", "Vou me esforçar para não chegar atrasado(a).", "Esforço, não garantia."],
    ["{最近|さいきん}、{朝|あさ} {早|はや}く {起|お}きる **ように なりました**。", "", "Ultimamente passei a acordar cedo.", "Mudança de hábito."],
    ["この ドアは {自動|じどう}で {開|あ}く **ように なって います**。", "", "Esta porta foi feita para abrir automaticamente.", "Funcionamento de um sistema."],
    ["{医者|いしゃ}に お{酒|さけ}を {飲|の}まない **ように** {言|い}われました。", "", "O(a) médico(a) me disse para não beber.", "Pedido indireto."]
  ],
  care: [
    "**ように する** é esforço; **ことに する** é decisão. “Procuro não fumar” é タバコを {吸|す}わない ように します; “decidi parar” é タバコを やめる ことに しました.",
    "**ように なる** descreve uma mudança que se estabelece com o tempo. Para uma mudança de estado simples, use ～く / ～に なる.",
    "Com o potencial, ように なる é o jeito natural de dizer “passei a conseguir ~”: {泳|およ}げる ように なりました. Sem ように, o potencial fala de um fato pontual.",
    "Não confunda com o **ように** de objetivo (“para que ~”): {忘|わす}れない ように メモします (anoto para não esquecer).",
    "**ように なって いる** não fala de mudança no tempo: fala de como algo é projetado ou estabelecido."
  ],
  practice: []
},

{ id: "koto-ni-suru", title: "～ことに する, ～ことに なる",
  summary: "Como dizer que você decidiu algo ou que ficou decidido: decisões próprias, decisões de fora e regras.",
  use: [
    "**～ことに する**: “decidir ~”. A decisão é **sua**, por vontade própria: {来年|らいねん}、日本へ {留学|りゅうがく}する ことに しました.",
    "**～ことに して いる**: “ter como regra ou hábito ~”. Uma decisão pessoal que você mantém: {夜|よる}は コーヒーを {飲|の}まない ことに して います.",
    "**～ことに なる**: “ficar decidido que ~”. O resultado vem de fora (empresa, regra, circunstâncias) ou é apresentado assim: {来月|らいげつ}、{大阪|おおさか}へ {転勤|てんきん}する ことに なりました.",
    "**～ことに なって いる**: “está estabelecido que ~, é regra ~”: {制服|せいふく}を {着|き}る ことに なって います."
  ],
  form: [
    "**Verbo na forma de dicionário (ou ない) + ことに する / なる**.",
    "**Tempos**: ことに しました (decidi), ことに なりました (ficou decidido), ことに して います (regra pessoal), ことに なって います (regra estabelecida).",
    "**Negativo**: o ない vem antes: {食|た}べない ことに する (decidir não comer). Já ことに しない quer dizer “não decidir”.",
    "**Tom modesto**: ことに なりました também é usado por quem decidiu por conta própria mas quer soar discreto, como em avisos de casamento ou de mudança de emprego."
  ],
  tables: [{ title: "Quem decide?", head: ["Forma", "Quem decide", "Exemplo"], rows: [
    ["～ことに する", "eu (decisão própria)", "{行|い}く ことに する"],
    ["～ことに して いる", "eu (regra pessoal)", "{行|い}かない ことに して いる"],
    ["～ことに なる", "outros ou circunstâncias", "{行|い}く ことに なる"],
    ["～ことに なって いる", "regra estabelecida", "{行|い}く ことに なって いる"]
  ]}],
  ex: [
    ["{来年|らいねん}、日本へ {留学|りゅうがく}する **ことに しました**。", "", "Decidi estudar no Japão no ano que vem.", "Decisão própria."],
    ["{今日|きょう}から 毎日 {運動|うんどう}する **ことに しました**。", "", "Decidi que, a partir de hoje, vou me exercitar todo dia.", ""],
    ["{来月|らいげつ}、{大阪|おおさか}へ {転勤|てんきん}する **ことに なりました**。", "", "Ficou decidido que serei transferido(a) para Osaka no mês que vem.", "Decisão vinda da empresa."],
    ["{夜|よる}は コーヒーを {飲|の}まない **ことに して います**。", "", "Tenho como regra não tomar café à noite.", "Regra pessoal."],
    ["この 学校では、{制服|せいふく}を {着|き}る **ことに なって います**。", "", "Nesta escola, está estabelecido que se usa uniforme.", "Regra de um lugar."],
    ["{結婚|けっこん}する **ことに なりました**。", "", "Vamos nos casar.", "Aviso discreto, sem dizer “nós decidimos”."]
  ],
  care: [
    "**する** = você decide; **なる** = “ficou decidido” (por outros ou pelas circunstâncias). A escolha mostra a sua relação com a decisão.",
    "Para enfatizar uma decisão sua, use ことに しました; ことに なりました soa mais discreto e menos firme.",
    "Não confunda com **つもり**: ～つもりです diz “pretendo”; ～ことに しました diz “decidi”.",
    "**ことに する** é decisão; **ように する** é esforço (veja o tópico anterior).",
    "**ことに なって いる** descreve uma regra que existe agora, não um acontecimento: serve para regras de escola, de trabalho ou de um lugar."
  ],
  practice: []
},

{ id: "to-ii", title: "～といい, ～ばいい, ～たらいい",
  summary: "Como dar conselhos, expressar esperança e lamentar: seria bom ~, tomara que ~, devia ter ~.",
  use: [
    "**～ば いい / ～たら いい**: dar um **conselho** ou perguntar o que fazer: “é só ~, bastaria ~”. これは どう すれば いいですか (o que devo fazer com isto?).",
    "**～と いい**: **esperança**: “tomara que ~, seria bom se ~”, sobre algo que não depende de você: {明日|あした}は {晴|は}れると いいですね.",
    "**～ば よかった**: **arrependimento**: “devia ter ~”: もっと {勉強|べんきょう}すれば よかったです.",
    "**～ば いいのに**: “seria bom se ~ (mas não é assim)”, com tom de queixa ou desejo: ここに 友だちが いれば いいのに."
  ],
  form: [
    "**ば**: verbo → forma ば (書く → 書けば); adjetivo い → ～ければ (いい → よければ). Depois vem **いい**: 書けば いい.",
    "**たら**: forma た + ら (書いたら いい). **と**: forma de dicionário + と いい (書く と いい).",
    "**Pergunta de conselho**: どう すれば / どう したら いいですか (o que devo fazer?), どこで {買|か}えば いいですか (onde devo comprar?).",
    "**Passado**: いい vira よかった: ～ば よかった (devia ter ~). **Negativo**: ～なければ よかった (não devia ter ~): {言|い}わなければ よかった."
  ],
  ex: [
    ["{駅|えき}へは バスに {乗|の}れば **いいです**よ。", "", "Para ir até a estação, é só pegar o ônibus.", "Conselho."],
    ["すみません、これは どう すれば **いいですか**。", "", "Com licença, o que devo fazer com isto?", "Pergunta de conselho."],
    ["{風邪|かぜ}の ときは、ゆっくり 休んだら **いいです**よ。", "", "Quando estiver resfriado(a), é bom descansar bem.", "Conselho suave com たら."],
    ["{明日|あした}は {晴|は}れると **いいですね**。", "", "Tomara que amanhã faça sol.", "Esperança."],
    ["もっと {勉強|べんきょう}すれば **よかったです**。", "", "Eu devia ter estudado mais.", "Arrependimento."],
    ["{雨|あめ}が {降|ふ}らなければ **いいですね**。", "", "Tomara que não chova.", "Esperança com forma negativa."]
  ],
  care: [
    "Dar conselho com **ば いい** a alguém de posição superior pode soar como “é só fazer assim”, direto demais. Entre amigos e em perguntas (どう すれば いいですか) é natural.",
    "**と いい** é o mais natural para **esperança**; com ば e たら o foco é em **o que fazer**.",
    "Não confunda ～ば いい (“é só ~”) com ～ほうが いい (“é melhor ~”), que compara duas opções.",
    "**ば よかった** é lamento sobre o passado: o fato já não pode ser mudado. Para esperança no futuro, use **と いい**.",
    "Com ば e たら, a oração antes pode ser negativa: ～なければ いい quer dizer “seria bom se não ~”."
  ],
  practice: []
},

{ id: "ba-hodo", title: "～ば ～ほど",
  summary: "Como dizer “quanto mais ~, mais ~”: duas coisas que crescem ou diminuem juntas.",
  use: [
    "**A ば A ほど B**: “quanto mais A, mais B”. A mesma palavra (verbo ou adjetivo) aparece duas vezes: primeiro na forma **ば** e depois na forma de dicionário antes de **ほど**.",
    "O B mostra o que cresce ou diminui junto: {好|す}きに なります, {上手|じょうず}に なります, {分|わ}からなく なります.",
    "Com adjetivos, serve para dizer o que é ideal: {安|やす}ければ {安|やす}いほど いいです (quanto mais barato, melhor)."
  ],
  form: [
    "**Verbo**: forma ば + forma de dicionário + ほど: 読めば 読むほど.",
    "**Adjetivo い**: ～ければ + ～い + ほど: {高|たか}ければ {高|たか}いほど.",
    "**Adjetivo な**: ～なら + ～な + ほど: {静|しず}かなら {静|しず}かなほど.",
    "O adjetivo **いい** vira **よければ いいほど**."
  ],
  tables: [{ title: "Como formar", head: ["Tipo", "Primeira parte", "Segunda parte", "Exemplo"], rows: [
    ["Verbo", "forma ば", "dicionário + ほど", "{勉強|べんきょう}すれば する ほど"],
    ["Adjetivo い", "～ければ", "～い + ほど", "{安|やす}ければ {安|やす}い ほど"],
    ["Adjetivo な", "～なら", "～な + ほど", "{静|しず}かなら {静|しず}かな ほど"],
    ["いい", "よければ", "いい + ほど", "よければ いい ほど"]
  ]}],
  ex: [
    ["日本語は {勉強|べんきょう}**すれば する ほど**、おもしろく なります。", "", "Quanto mais se estuda japonês, mais interessante fica.", ""],
    ["{安|やす}**ければ** {安|やす}**い ほど** いいです。", "", "Quanto mais barato, melhor.", "Adjetivo い."],
    ["{練習|れんしゅう}**すれば する ほど**、うまく なります。", "", "Quanto mais se treina, melhor se fica.", ""],
    ["{考|かんが}**えれば** {考|かんが}**える ほど**、分からなく なりました。", "", "Quanto mais penso, menos entendo.", ""],
    ["この {町|まち}は、{住|す}**めば** {住|す}**む ほど** {好|す}きに なります。", "", "Quanto mais você mora nesta cidade, mais gosta dela.", ""],
    ["{部屋|へや}は {静|しず}**かなら** {静|しず}**かな ほど** いいです。", "", "Quanto mais silencioso o quarto, melhor.", "Adjetivo な: なら."]
  ],
  care: [
    "A palavra se repete **duas vezes**: não basta dizer ば ほど uma vez.",
    "Com adjetivo な, a primeira parte é **なら** ({静|しず}かなら), e não ば nem ければ.",
    "A segunda parte costuma vir com **なります** (mudança) ou **いいです** (avaliação); evite verbos de ação pontual.",
    "Não confunda com ほど de comparação (“tanto quanto”): aqui o ほど marca a proporção entre as duas partes."
  ],
  practice: []
},

{ id: "wake", title: "～わけだ, ～わけではない",
  summary: "Como explicar uma conclusão natural, negar só em parte e dizer o que não é possível ou o que não se pode fazer.",
  use: [
    "**～わけだ**: “então é por isso que ~, é natural que ~”. Você entende o motivo de algo depois de saber de um fato: é uma conclusão lógica.",
    "**～わけでは ない**: “não é que ~”. **Negação parcial**: você corrige uma ideia que poderia ser tirada da situação. Costuma vir com いつも, {全部|ぜんぶ}, {必|かなら}ず.",
    "**～わけが ない**: “não tem como ~, é impossível ~”: negação forte, baseada em raciocínio ou convicção.",
    "**～わけには いかない**: “não posso ~ (por dever ou circunstâncias)”. Fala de uma restrição da situação, não de incapacidade."
  ],
  form: [
    "**Forma curta + わけだ**. Verbo e adjetivo い: direto ({疲|つか}れた わけだ); adjetivo な: **な** + わけだ ({上手|じょうず}な わけだ); substantivo: **な** + わけだ.",
    "**Negativo parcial**: ～わけでは ありません (formal), ～わけじゃ ない (informal): {嫌|きら}いな わけでは ありません.",
    "**わけが ない** e **わけには いかない**: verbo na forma de dicionário (ou ない) + わけが ない / わけには いかない. 行かない わけには いかない quer dizer “não posso deixar de ir”."
  ],
  tables: [{ title: "Quatro formas com わけ", head: ["Forma", "Ideia", "Exemplo"], rows: [
    ["～わけだ", "por isso é que ~", "{疲|つか}れた わけだ"],
    ["～わけでは ない", "não é que ~", "{嫌|きら}いな わけでは ない"],
    ["～わけが ない", "é impossível ~", "{行|い}ける わけが ない"],
    ["～わけには いかない", "não posso ~", "{行|い}かない わけには いかない"]
  ]}],
  ex: [
    ["{田中|たなか}さんは 日本に 十年 {住|す}んで いました。日本語が {上手|じょうず}な **わけ**ですね。", "", "Tanaka-san morou dez anos no Japão. Então é por isso que fala tão bem.", "Conclusão a partir de um fato."],
    ["三時間も {歩|ある}いたんですか。{疲|つか}れた **わけ**ですね。", "", "Andou três horas? Então é por isso que está cansado(a).", ""],
    ["日本語が {嫌|きら}いな **わけでは ありません**。時間が ないだけです。", "", "Não é que eu não goste de japonês; só não tenho tempo.", "Negação parcial."],
    ["高い {店|みせ}が いつも おいしい **わけでは ありません**。", "", "Nem sempre os restaurantes caros são gostosos.", "Com いつも, nega só em parte."],
    ["{子|こ}どもが ひとりで そんな {遠|とお}い ところへ 行ける **わけが ありません**。", "", "Não tem como uma criança ir sozinha a um lugar tão distante.", "Impossibilidade por raciocínio."],
    ["{明日|あした}は {大事|だいじ}な {試験|しけん}ですから、{今夜|こんや}は {遊|あそ}ぶ **わけには いきません**。", "", "Amanhã tenho uma prova importante, então não posso me divertir esta noite.", "Restrição da situação."]
  ],
  care: [
    "**わけだ** é conclusão a partir de algo que você **acabou de saber**. Ele diz “agora entendo por que”, e não “o motivo é ~”. Para uma suposição nova, use ようだ ou らしい.",
    "**わけでは ない** não nega tudo: é “não é que ~”, por isso vem com いつも, {全部|ぜんぶ}, {必|かなら}ず. Para negar de vez, use a negação simples.",
    "**わけが ない** vem de raciocínio: “como seria possível?”. Para dizer apenas que algo não vai acontecer, use o ない simples.",
    "**わけには いかない** não é falta de capacidade (para isso, ～ない ou できない), e sim de **obrigação ou situação**.",
    "**はずが ない** e **わけが ない** são parecidos; veja o próximo tópico."
  ],
  practice: []
},

{ id: "hazu", title: "～はずだ, ～はずがない",
  summary: "Como dizer o que deve ser verdade com base em razão e o que não pode ser: deve ser, é de se esperar, não pode ser, era para ser.",
  use: [
    "**～はずだ**: “deve ser ~, é de se esperar que ~”. Você tem uma **razão** (informação, horário, lógica) que sustenta a conclusão.",
    "**～はずが ない / ～はずは ない**: “não pode ser que ~, é impossível ~”. A mesma ideia, negada com força.",
    "**～はずだった**: “era para ~, devia ter ~ (mas não aconteceu)”. Fala de uma expectativa que não se realizou.",
    "**～はずでは なかった**: “não era para ser assim”. Mostra surpresa ou desapontamento."
  ],
  form: [
    "**Forma curta + はずだ**. Verbo e adjetivo い: direto (来る はずだ, 高い はずだ). Adjetivo な: **な** + はず ({上手|じょうず}な はず). Substantivo: **の** + はず (日本人の はず).",
    "**Negativo**: ～ない はずだ (“deve não ~”, ou seja, o esperado é que não aconteça) é diferente de ～はずが ない (“não pode ser”).",
    "**Passado**: はずだった (a expectativa era antes) ou verbo no passado: 来た はずだ (deve ter vindo).",
    "**Polido**: はずです / はずが ありません / はずでした."
  ],
  tables: [{ title: "Quatro formas com はず", head: ["Forma", "Ideia", "Exemplo"], rows: [
    ["～はずだ", "deve ser ~", "来る はずです"],
    ["～ない はずだ", "deve não ~", "来ない はずです"],
    ["～はずが ない", "não pode ser ~", "来る はずが ありません"],
    ["～はずだった", "era para ~ (mas não foi)", "来る はずでした"]
  ]}],
  ex: [
    ["{田中|たなか}さんは もう {家|いえ}に {着|つ}いて いる **はずです**。", "", "Tanaka-san já deve ter chegado em casa.", "Dedução com base."],
    ["{会議|かいぎ}は 三時に {始|はじ}まる **はずです**。", "", "A reunião deve começar às três.", "Horário combinado."],
    ["この {店|みせ}は {有名|ゆうめい}ですから、おいしい **はずです**。", "", "Este restaurante é famoso, então deve ser gostoso.", ""],
    ["{山田|やまだ}さんは 日本人ですから、日本語が {上手|じょうず}な **はず**です。", "", "Yamada-san é japonês(a), então deve falar bem japonês.", "Adjetivo な: な + はず."],
    ["あの 人が {嘘|うそ}を つく **はずが ありません**。", "", "Aquela pessoa não teria como estar mentindo.", "Impossibilidade por convicção."],
    ["今日は 友だちと {会|あ}う **はずでした**が、雨で やめました。", "", "Eu ia me encontrar com um(a) amigo(a) hoje, mas cancelamos por causa da chuva.", "Expectativa que não se realizou."]
  ],
  care: [
    "**はず** é dedução com base em algo: não use para o que você **viu** nem para a sua **vontade**. “Eu vou” é ～ます ou つもり, e não はず.",
    "Não confunda com a obrigação “deve” de ～べき ou ～なければ ならない: **はず** quer dizer “deve ser (provável)”.",
    "**～はずが ない** e **～わけが ない** são quase iguais: はずが ない se apoia em dedução; わけが ない soa mais enfático.",
    "**～はずだった** pede um contraste (“mas ~”): sem ele, o ouvinte fica esperando a continuação.",
    "**～ない はずだ** não é “não pode ser”: é “o esperado é que não ~”."
  ],
  practice: []
},
{
  "id": "kamoshirenai",
  "title": "～かも しれない",
  "summary": "Como dizer que algo é possível, mas não é certo: talvez, pode ser que, é possível que.",
  "use": [
    "**～かも しれない**: “talvez ~, pode ser que ~”. Você acha que é possível, mas **não tem certeza**. A chance pode ser pequena ou grande.",
    "**～かも しれません**: versão educada. Entre amigos, o final costuma cair e fica só **～かも**.",
    "Para falar do passado, ponha o verbo no passado antes: {行|い}った かも しれない (talvez tenha ido).",
    "Como resposta curta: そう かも しれません (pode ser que sim)."
  ],
  "form": [
    "**Forma curta + かも しれない**. Verbo e adjetivo い entram direto: {降|ふ}る かも しれない, {高|たか}い かも しれない.",
    "Adjetivo な e substantivo entram **sem な e sem だ**: {便利|べんり} かも しれない, {雨|あめ} かも しれない.",
    "Negativo e passado seguem a forma curta: {来|こ}ない かも しれない (talvez não venha), {来|き}た かも しれない (talvez tenha vindo).",
    "Níveis de polidez: かも しれません (educado), かも しれない (neutro), かも (informal)."
  ],
  "tables": [
    {
      "title": "Como juntar com かも しれない",
      "head": [
        "Tipo",
        "Forma",
        "Sentido"
      ],
      "rows": [
        [
          "Verbo",
          "{行|い}く かも しれない",
          "talvez vá"
        ],
        [
          "Verbo, passado",
          "{行|い}った かも しれない",
          "talvez tenha ido"
        ],
        [
          "Adjetivo い",
          "{高|たか}い かも しれない",
          "talvez seja caro"
        ],
        [
          "Adjetivo な",
          "{便利|べんり} かも しれない",
          "talvez seja prático (sem な)"
        ],
        [
          "Substantivo",
          "{雨|あめ} かも しれない",
          "talvez seja chuva (sem だ)"
        ]
      ]
    }
  ],
  "ex": [
    [
      "{明日|あした}は {雨|あめ}が {降|ふ}る **かも しれません**。",
      "",
      "Amanhã talvez chova.",
      ""
    ],
    [
      "この {店|みせ}は {高|たか}い **かも しれません**。",
      "",
      "Este restaurante talvez seja caro.",
      "Adjetivo い: direto."
    ],
    [
      "{田中|たなか}さんは もう {帰|かえ}った **かも しれません**。",
      "",
      "Tanaka-san talvez já tenha ido embora.",
      "Passado."
    ],
    [
      "あの {人|ひと}は {先生|せんせい} **かも しれません**。",
      "",
      "Aquela pessoa talvez seja professor(a).",
      "Substantivo: sem だ."
    ],
    [
      "{道|みち}が {混|こ}んで いるので、{少|すこ}し {遅|おく}れる **かも**。",
      "",
      "A rua está congestionada, então talvez eu me atrase um pouco.",
      "Informal: sem しれない."
    ],
    [
      "{山田|やまだ}さんは {来|こ}ない **かも しれません**。",
      "",
      "Yamada-san talvez não venha.",
      "Negativo."
    ]
  ],
  "care": [
    "**かも しれない** só diz que é **possível**, sem certeza. Para “deve ser” com base em algo, use ～はずだ; para “com certeza”, use ～に ちがいない (próximo tópico).",
    "Não ponha **だ** depois de substantivo ou adjetivo な: ✗ {雨|あめ}だ かも しれない → ✓ {雨|あめ} かも しれない.",
    "Em português, “talvez” vem antes do verbo; em japonês, **かも しれない** vem no **fim** da frase.",
    "A possibilidade pode ser pequena: **かも しれない** não quer dizer “50%”, e sim “quem sabe”."
  ],
  "practice": []
},
{
  "id": "ni-chigainai",
  "title": "～に ちがいない",
  "summary": "Como dizer que você está quase certo de algo: sem dúvida, com certeza, só pode ser.",
  "use": [
    "**～に ちがいない**: “com certeza ~, não há dúvida de que ~”. Você tem uma **convicção forte**, baseada em indícios ou em intuição.",
    "**～に ちがいありません**: versão educada, comum na fala formal e em textos.",
    "Para falar do passado, ponha o verbo no passado: {忘|わす}れた に ちがいない (com certeza esqueceu).",
    "É mais forte que **かも しれない**. Parecido com **はずだ**, mas aqui a conclusão é **sua**, e o はず fala de uma expectativa com razão lógica."
  ],
  "form": [
    "**Forma curta + に ちがいない**. Verbo e adjetivo い entram direto: {来|く}る に ちがいない, {高|たか}い に ちがいない.",
    "Adjetivo な e substantivo entram **sem な e sem だ**, como em かも しれない: {本物|ほんもの}に ちがいない.",
    "Negativo e passado seguem a forma curta: {来|こ}ない に ちがいない, {来|き}た に ちがいない.",
    "Polido: ちがいありません (no passado, ちがいありませんでした)."
  ],
  "tables": [
    {
      "title": "Do menos ao mais certo",
      "head": [
        "Forma",
        "Sentido",
        "Exemplo"
      ],
      "rows": [
        [
          "～かも しれない",
          "talvez",
          "{雨|あめ}が {降|ふ}る かも しれない"
        ],
        [
          "～はずだ",
          "deve ser (há uma razão)",
          "{雨|あめ}が {降|ふ}る はずだ"
        ],
        [
          "～に ちがいない",
          "com certeza (convicção)",
          "{雨|あめ}が {降|ふ}る に ちがいない"
        ]
      ]
    }
  ],
  "ex": [
    [
      "{電気|でんき}が ついて いるから、{家|いえ}に {誰|だれ}か いる **に ちがいない**。",
      "",
      "A luz está acesa, então com certeza tem alguém em casa.",
      ""
    ],
    [
      "{山田|やまだ}さんは {試験|しけん}に {合格|ごうかく}した **に ちがいありません**。",
      "",
      "Yamada-san com certeza passou na prova.",
      "Polido."
    ],
    [
      "こんなに {安|やす}いなら、{偽物|にせもの}**に ちがいない**。",
      "",
      "Se é tão barato assim, com certeza é falsificado.",
      "Substantivo: sem だ."
    ],
    [
      "あの {店|みせ}は いつも {人|ひと}が {多|おお}いから、おいしい **に ちがいない**。",
      "",
      "Aquele restaurante vive cheio, então com certeza é gostoso.",
      "Adjetivo い: direto."
    ],
    [
      "{犯人|はんにん}は {近|ちか}くに いる **に ちがいない**。",
      "",
      "O(A) culpado(a) com certeza está por perto.",
      ""
    ],
    [
      "{鍵|かぎ}が ない。{家|いえ}に {忘|わす}れた **に ちがいない**。",
      "",
      "Estou sem a chave. Com certeza esqueci em casa.",
      "Passado."
    ]
  ],
  "care": [
    "**に ちがいない** é uma conclusão **sua** a partir de indícios: não use para o que você viu com os próprios olhos.",
    "Como **かも しれない**, não leva だ nem な: ✗ {本物|ほんもの}だ に ちがいない → ✓ {本物|ほんもの}に ちがいない.",
    "Não serve para vontade ou plano: “com certeza eu vou” não se diz com **に ちがいない**.",
    "Não confunda com **～はずだ**: はず se apoia em algo objetivo (horário, regra, lógica); **に ちがいない** mostra uma convicção pessoal, muitas vezes por intuição."
  ],
  "practice": []
},
{
  "id": "seide-okagede",
  "title": "～せいで, ～おかげで",
  "summary": "Como dizer a causa de algo ruim (por culpa de) e a causa de algo bom (graças a).",
  "use": [
    "**～せいで**: “por culpa de ~, por causa de ~”. A causa de um resultado **ruim**, com ideia de culpa ou reclamação.",
    "**～おかげで**: “graças a ~”. A causa de um resultado **bom**, com gratidão.",
    "**～せいか**: “talvez por causa de ~”. Você não tem certeza da causa.",
    "No fim da frase: **～の せいです** (é culpa de ~) e **～の おかげです** (é graças a ~)."
  ],
  "form": [
    "**Verbo e adjetivo い na forma curta + せいで / おかげで**: {雨|あめ}が {降|ふ}った せいで, {忙|いそが}しい せいで.",
    "**Adjetivo な + な**: {不便|ふべん}な せいで. **Substantivo + の**: {雨|あめ}の せいで, あなたの おかげで.",
    "**せい** e **おかげ** são substantivos, por isso ligam como um substantivo (な ou の).",
    "Polido: ～せいです, ～おかげです."
  ],
  "tables": [
    {
      "title": "Três formas",
      "head": [
        "Forma",
        "Ideia",
        "Exemplo"
      ],
      "rows": [
        [
          "～せいで",
          "por culpa de (ruim)",
          "{雨|あめ}の せいで {遅|おく}れた"
        ],
        [
          "～おかげで",
          "graças a (bom)",
          "{先生|せんせい}の おかげで {合格|ごうかく}した"
        ],
        [
          "～せいか",
          "talvez por causa de",
          "{疲|つか}れた せいか、{眠|ねむ}い"
        ]
      ]
    }
  ],
  "ex": [
    [
      "{電車|でんしゃ}が {遅|おく}れた **せいで**、{会議|かいぎ}に {遅|おく}れました。",
      "",
      "Por culpa do atraso do trem, cheguei atrasado(a) à reunião.",
      ""
    ],
    [
      "{夜|よる} {遅|おそ}くまで {起|お}きて いた **せいで**、{朝|あさ} {起|お}きられませんでした。",
      "",
      "Por ter ficado acordado(a) até tarde, não consegui acordar de manhã.",
      ""
    ],
    [
      "{先生|せんせい}の **おかげで**、{日本語|にほんご}が {好|す}きに なりました。",
      "",
      "Graças ao(à) professor(a), passei a gostar de japonês.",
      "Substantivo + の."
    ],
    [
      "みんなが {手伝|てつだ}って くれた **おかげで**、{早|はや}く {終|お}わりました。",
      "",
      "Graças à ajuda de todo mundo, terminamos cedo.",
      ""
    ],
    [
      "{忙|いそが}しい **せいか**、{最近|さいきん} よく {眠|ねむ}れません。",
      "",
      "Talvez por estar ocupado(a), ando dormindo mal.",
      "Causa incerta."
    ],
    [
      "あなたの **おかげです**。ありがとう ございました。",
      "",
      "É graças a você. Muito obrigado(a).",
      "No fim da frase."
    ]
  ],
  "care": [
    "**せいで** é para resultado ruim e **おかげで** para resultado bom. Trocar um pelo outro muda o sentido: ✗ {雨|あめ}の おかげで {遅|おく}れた soa estranho ou irônico.",
    "O resultado é um fato **real** (passado ou atual): não combine com pedido, ordem ou vontade.",
    "**おかげで** pode ser sarcástico, no tom da voz: あなたの おかげで {失敗|しっぱい}した (graças a você, deu errado). Use com cuidado.",
    "Não confunda com **～ので / ～から**, que dão uma causa neutra. **せいで** e **おかげで** já trazem um julgamento (culpa ou gratidão).",
    "Substantivo liga com **の**: ✗ {雨|あめ} せいで → ✓ {雨|あめ}の せいで."
  ],
  "practice": []
},
{
  "id": "nagaramo-tsutsu",
  "title": "～ながらも, ～つつ",
  "summary": "Como contrastar duas ideias da mesma pessoa ou coisa: embora, apesar de, mesmo sendo; e o uso de ～つつ.",
  "use": [
    "**～ながらも**: “embora ~, apesar de ~, mesmo ~ndo”. Liga duas ideias que **parecem se contradizer**, no mesmo sujeito. O ～ながら de “fazer duas coisas ao mesmo tempo” não leva も.",
    "**～つつも**: o mesmo sentido de ながらも, mais formal e escrito.",
    "**～つつ** sozinho, em texto escrito, também pode ser “ao mesmo tempo que ~”, como ～ながら.",
    "**～つつ ある**: “estar ~ndo”, um processo em andamento. É típico de notícias: {増|ふ}え つつ ある (está aumentando)."
  ],
  "form": [
    "**Verbo**: forma ます sem ます + ながらも / つつも ({知|し}りながらも, {思|おも}いつつも).",
    "**Adjetivo い**: forma de dicionário + ながらも ({狭|せま}いながらも). **Adjetivo な** e **substantivo**: sem な/だ + ながらも ({不便|ふべん}ながらも, {子|こ}どもながらも).",
    "**つつ** só combina com a forma ます sem ます do verbo.",
    "O sujeito das duas partes é o mesmo."
  ],
  "tables": [
    {
      "title": "Como formar",
      "head": [
        "Tipo",
        "Forma",
        "Exemplo"
      ],
      "rows": [
        [
          "Verbo",
          "ます sem ます + ながらも",
          "{知|し}りながらも"
        ],
        [
          "Verbo (formal)",
          "ます sem ます + つつも",
          "{思|おも}いつつも"
        ],
        [
          "Adjetivo い",
          "dicionário + ながらも",
          "{狭|せま}いながらも"
        ],
        [
          "Adjetivo な",
          "sem な + ながらも",
          "{不便|ふべん}ながらも"
        ],
        [
          "Substantivo",
          "substantivo + ながらも",
          "{子|こ}どもながらも"
        ]
      ]
    }
  ],
  "ex": [
    [
      "{悪|わる}いと {知|し}り**ながらも**、{嘘|うそ}を つきました。",
      "",
      "Embora soubesse que era errado, menti.",
      ""
    ],
    [
      "この {部屋|へや}は {狭|せま}い**ながらも**、{住|す}みやすいです。",
      "",
      "Embora seja pequeno, este quarto é confortável de morar.",
      "Adjetivo い."
    ],
    [
      "{体|からだ}に {悪|わる}いと {思|おも}い**つつも**、つい {食|た}べすぎます。",
      "",
      "Embora ache que faz mal à saúde, acabo comendo demais.",
      ""
    ],
    [
      "{田中|たなか}さんは {若|わか}い**ながらも**、{経験|けいけん}が {豊富|ほうふ}です。",
      "",
      "Tanaka-san, embora jovem, tem muita experiência.",
      ""
    ],
    [
      "{小|ちい}さな {会社|かいしゃ}**ながらも**、{世界|せかい}に {製品|せいひん}を {売|う}って います。",
      "",
      "Embora seja uma empresa pequena, vende produtos para o mundo.",
      "Substantivo."
    ],
    [
      "{人口|じんこう}は {減|へ}り **つつ ある**。",
      "",
      "A população está diminuindo.",
      "Processo em andamento."
    ]
  ],
  "care": [
    "O sujeito das duas partes é o mesmo. Com sujeitos diferentes, use ～が, ～けれど ou ～のに.",
    "Não confunda **ながら** (ao mesmo tempo: {歩|ある}きながら {話|はな}す) com **ながらも** (embora). O も e o sentido da frase mostram o contraste.",
    "**ながらも** e **つつも** são mais formais que ～けど e ～のに. No dia a dia, prefira ～けど.",
    "Não use o passado antes de ながらも: o verbo fica na forma ます sem ます, sem ～た.",
    "A segunda parte costuma ser um resultado **inesperado**, contrário à primeira."
  ],
  "practice": []
},
{
  "id": "tokoro-bakari",
  "title": "～ところだ, ～たところだ, ～ばかりだ",
  "summary": "Como falar do momento exato de uma ação: prestes a, no meio de, acabou de.",
  "use": [
    "**Verbo no dicionário + ところだ**: “estar prestes a ~”. A ação vai começar agora.",
    "**Verbo ～て いる + ところだ**: “estar no meio de ~”. A ação está acontecendo neste instante.",
    "**Verbo ～た + ところだ**: “acabar de ~”. A ação terminou há instantes (poucos minutos).",
    "**Verbo ～た + ばかりだ**: “acabar de ~”. Mais livre no tempo: o falante **sente** que foi há pouco, mesmo que tenham passado dias ou meses."
  ],
  "form": [
    "**ところ** liga com a forma curta do verbo: dicionário, ～て いる ou ～た.",
    "**ところだ** marca o **ponto exato** da ação (antes, durante, depois). **ばかり** só serve para o “acabou de”.",
    "Polido: ところです, ばかりです.",
    "Com **ばかり**, também se liga a um substantivo: {買|か}った ばかりの {本|ほん} (o livro que acabei de comprar)."
  ],
  "tables": [
    {
      "title": "Quatro momentos",
      "head": [
        "Forma",
        "Momento",
        "Exemplo"
      ],
      "rows": [
        [
          "dicionário + ところだ",
          "prestes a",
          "{出|で}かける ところです"
        ],
        [
          "～て いる + ところだ",
          "no meio de",
          "{食|た}べて いる ところです"
        ],
        [
          "～た + ところだ",
          "acabou de (minutos)",
          "{着|つ}いた ところです"
        ],
        [
          "～た + ばかりだ",
          "acabou de (sensação)",
          "{来|き}た ばかりです"
        ]
      ]
    }
  ],
  "ex": [
    [
      "これから {家|いえ}を {出|で}る **ところです**。",
      "",
      "Estou prestes a sair de casa.",
      ""
    ],
    [
      "いま {晩|ばん}ごはんを {食|た}べて いる **ところです**。",
      "",
      "Agora estou no meio do jantar.",
      ""
    ],
    [
      "{駅|えき}に {着|つ}いた **ところです**。",
      "",
      "Acabei de chegar à estação.",
      "Poucos minutos."
    ],
    [
      "{日本|にほん}に {来|き}た **ばかりです**。まだ {慣|な}れて いません。",
      "",
      "Acabei de vir ao Japão. Ainda não me acostumei.",
      "Pode ser há semanas."
    ],
    [
      "{買|か}った **ばかりの** {時計|とけい}が {壊|こわ}れました。",
      "",
      "O relógio que eu tinha acabado de comprar quebrou.",
      "ばかり + の + substantivo."
    ],
    [
      "{会議|かいぎ}は いま {終|お}わった **ところです**。",
      "",
      "A reunião acabou agora há pouco.",
      ""
    ]
  ],
  "care": [
    "**ところだ** é um **ponto no tempo** (minutos). **ばかりだ** é uma **sensação** de “há pouco” e pode ser há um mês: {先月|せんげつ} {結婚|けっこん}した ばかりです.",
    "Com **～た ところだ**, o “acabou de” precisa ser mesmo recente. Para “ontem”, use o passado normal: ✗ {昨日|きのう} {着|つ}いた ところです.",
    "**～て いる ところだ** é só “neste exato momento”. Para hábito ou estado em geral, use ～て います.",
    "Em português usamos “acabei de” para os dois casos. Em japonês, instantes pedem **ところ** e “faz pouco tempo” pede **ばかり**."
  ],
  "practice": []
},
{
  "id": "temo-demo",
  "title": "～ても, ～でも (concessiva)",
  "summary": "Como dizer “mesmo que ~, mesmo se ~, por mais que ~”: algo acontece, mas o resultado não muda.",
  "use": [
    "**～ても / ～でも**: “mesmo que ~, mesmo se ~”. A condição acontece, mas o resultado **não muda**.",
    "**いくら ～ても**: “por mais que ~”. Reforça o esforço ou a quantidade: いくら {食|た}べても (por mais que eu coma).",
    "**たとえ ～ても**: “mesmo que (hipoteticamente) ~”: たとえ {雨|あめ}が {降|ふ}っても.",
    "**Palavra de pergunta + ても**: “não importa quem, o quê, onde ~”: {誰|だれ}が {来|き}ても, {何|なに}を {言|い}っても."
  ],
  "form": [
    "A forma é a mesma de **～ても いい** (já visto): verbo na forma て + も; adjetivo い: ～くても; adjetivo な e substantivo: ～でも.",
    "Negativo: ～なくても ({行|い}かなくても = mesmo que não vá).",
    "Com **いくら** e **たとえ** no começo, o sentido fica mais forte."
  ],
  "tables": [
    {
      "title": "Como formar",
      "head": [
        "Tipo",
        "Forma",
        "Sentido"
      ],
      "rows": [
        [
          "Verbo",
          "{行|い}っても, {食|た}べても",
          "mesmo que vá / coma"
        ],
        [
          "Verbo, negativo",
          "{行|い}かなくても",
          "mesmo que não vá"
        ],
        [
          "Adjetivo い",
          "{高|たか}くても",
          "mesmo que seja caro"
        ],
        [
          "Adjetivo な",
          "{便利|べんり}でも",
          "mesmo que seja prático"
        ],
        [
          "Substantivo",
          "{雨|あめ}でも",
          "mesmo que seja chuva"
        ]
      ]
    }
  ],
  "ex": [
    [
      "{雨|あめ}が {降|ふ}**っても**、{試合|しあい}は あります。",
      "",
      "Mesmo que chova, o jogo vai acontecer.",
      ""
    ],
    [
      "**いくら** {食|た}べ**ても**、{太|ふと}りません。",
      "",
      "Por mais que eu coma, não engordo.",
      ""
    ],
    [
      "**いくら** {高|たか}く**ても**、この かばんを {買|か}います。",
      "",
      "Por mais caro que seja, vou comprar esta bolsa.",
      "Adjetivo い."
    ],
    [
      "**たとえ** {一人|ひとり}**でも**、{私|わたし}は {行|い}きます。",
      "",
      "Mesmo que seja sozinho(a), eu vou.",
      "Substantivo."
    ],
    [
      "{何度|なんど} {読|よ}ん**でも**、この {言葉|ことば}の {意味|いみ}が {分|わ}かりません。",
      "",
      "Por mais que eu leia, não entendo o significado desta palavra.",
      ""
    ],
    [
      "{誰|だれ}が {来|き}**ても**、ドアを {開|あ}けないで ください。",
      "",
      "Quem quer que venha, não abra a porta.",
      "Palavra de pergunta."
    ]
  ],
  "care": [
    "O resultado **vai contra a expectativa**: “mesmo chovendo, eu vou” não é “se chover, eu não vou” (～たら / ～ば).",
    "**～ても いい** (“pode ~”) e **～ても** (“mesmo que”) têm a mesma forma: o final da frase decide o sentido.",
    "Para um fato **já real e passado** (“choveu, mas eu fui”), prefira ～けど, ～が ou ～のに. **～ても** fala do que pode ou poderia acontecer.",
    "Não confunda com outros **でも**: o “ou algo assim” de お{茶|ちゃ}でも どうですか e o “mas” no início da frase.",
    "**たとえ** e **いくら** costumam pedir ～ても no fim da oração."
  ],
  "practice": []
},
{
  "id": "toshite-nitsuite",
  "title": "～として, ～について, ～において, ～に{対|たい}して",
  "summary": "Quatro expressões que ligam um substantivo a um papel, a um assunto, a um lugar ou a um alvo.",
  "use": [
    "**～として**: “como, na qualidade de ~”. Mostra o papel ou a posição: {先生|せんせい}として (como professor(a)).",
    "**～について**: “sobre, a respeito de ~”. O assunto de que se fala, pensa ou escreve: {日本|にほん}の {歴史|れきし}について.",
    "**～において**: “em, no âmbito de ~”. Lugar ou área, mais formal que ～で: {会議|かいぎ}において.",
    "**～に{対|たい}して**: “para, diante de, em relação a ~” (o alvo de uma ação ou atitude). Também mostra **contraste**: “enquanto ~”."
  ],
  "form": [
    "**Substantivo + として / について / において / に{対|たい}して**. Não precisam de の.",
    "Para modificar outro substantivo, a forma muda: **～としての, ～についての, ～における, ～に{対|たい}する**. Exemplo: {日本|にほん}についての {本|ほん} (livro sobre o Japão).",
    "**について** e **として** são comuns na fala. **において** e **に{対|たい}して** soam mais formais ou escritos."
  ],
  "tables": [
    {
      "title": "Quatro expressões",
      "head": [
        "Forma",
        "Ideia",
        "Exemplo"
      ],
      "rows": [
        [
          "～として",
          "como (papel)",
          "{留学生|りゅうがくせい}として {来|き}ました"
        ],
        [
          "～について",
          "sobre (assunto)",
          "{環境|かんきょう}について {話|はな}します"
        ],
        [
          "～において",
          "em (lugar ou área, formal)",
          "{会議|かいぎ}において {決|き}まりました"
        ],
        [
          "～に{対|たい}して",
          "para, diante de, em contraste com",
          "お{客|きゃく}さんに{対|たい}して"
        ]
      ]
    }
  ],
  "ex": [
    [
      "{私|わたし}は {留学生|りゅうがくせい}**として** {日本|にほん}に {来|き}ました。",
      "",
      "Vim ao Japão como estudante de intercâmbio.",
      ""
    ],
    [
      "{日本|にほん}の {文化|ぶんか}**について** {調|しら}べて います。",
      "",
      "Estou pesquisando sobre a cultura japonesa.",
      ""
    ],
    [
      "この {問題|もんだい}**について**、どう {思|おも}いますか。",
      "",
      "O que você acha deste problema?",
      ""
    ],
    [
      "{試験|しけん}は {教室|きょうしつ}**において** おこなわれます。",
      "",
      "A prova será realizada na sala de aula.",
      "Formal."
    ],
    [
      "{先生|せんせい}は {学生|がくせい}**に{対|たい}して** とても {親切|しんせつ}です。",
      "",
      "O(A) professor(a) é muito gentil com os estudantes.",
      "Atitude diante de alguém."
    ],
    [
      "{兄|あに}は {勉強|べんきょう}が {好|す}きなの**に{対|たい}して**、{弟|おとうと}は スポーツが {好|す}きです。",
      "",
      "Enquanto meu irmão mais velho gosta de estudar, o mais novo gosta de esportes.",
      "Contraste."
    ]
  ],
  "care": [
    "**～として** é “papel ou posição”. Para “como” de comparação (“como um pássaro”), use ～ように ou ～みたいに.",
    "**～について** é só para **assunto**. Para o lugar de uma ação, use ～で (comum) ou ～において (formal).",
    "**に{対|たい}して** é mais forte que a partícula **に**: use quando há atitude, reação ou contraste, e não para qualquer destino.",
    "Para ligar a outro substantivo, troque a terminação: ✗ {日本|にほん}について {本|ほん} → ✓ {日本|にほん}についての {本|ほん}.",
    "No sentido de contraste, **に{対|たい}して** liga duas frases com sujeitos diferentes (“enquanto ~”)."
  ],
  "practice": []
},
{
  "id": "ni-yotte",
  "title": "～によって",
  "summary": "Os vários sentidos de ～によって: por meio de, depende de, causa e quem faz uma ação passiva.",
  "use": [
    "**Meio ou método**: “por meio de ~, através de ~”: {努力|どりょく}によって {成功|せいこう}する (ter sucesso por meio de esforço).",
    "**Depende de**: “conforme ~, varia segundo ~”: {人|ひと}によって {考|かんが}えが {違|ちが}う (a opinião varia conforme a pessoa).",
    "**Causa**: “por causa de ~”, em tom formal: {地震|じしん}によって {建物|たてもの}が {壊|こわ}れた.",
    "**Quem faz, no passivo**: “por ~”, em frases passivas formais, como autor de obra ou invento.",
    "**～によっては**: “em certos casos de ~, dependendo de ~”: {場合|ばあい}によっては."
  ],
  "form": [
    "**Substantivo + によって**.",
    "Para modificar um substantivo, use **～による**: {事故|じこ}による {遅|おく}れ (atraso causado por acidente).",
    "No sentido de “depende de”, o substantivo é algo que varia (pessoa, país, caso, hora): {国|くに}によって, {時|とき}によって.",
    "O sentido vem do contexto e do verbo que fecha a frase."
  ],
  "tables": [
    {
      "title": "Quatro sentidos",
      "head": [
        "Sentido",
        "Forma",
        "Exemplo"
      ],
      "rows": [
        [
          "Meio",
          "～によって",
          "{努力|どりょく}によって {成功|せいこう}した"
        ],
        [
          "Depende de",
          "～によって {違|ちが}う",
          "{人|ひと}によって {違|ちが}う"
        ],
        [
          "Causa",
          "～によって / ～による",
          "{雨|あめ}による {事故|じこ}"
        ],
        [
          "Quem faz (passivo)",
          "～によって ～される",
          "{建築家|けんちくか}によって {作|つく}られた"
        ]
      ]
    }
  ],
  "ex": [
    [
      "{国|くに}**によって** {習慣|しゅうかん}が {違|ちが}います。",
      "",
      "Os costumes variam de país para país.",
      "Depende de."
    ],
    [
      "{人|ひと}**によって** {好|す}きな {食|た}べ{物|もの}は {違|ちが}います。",
      "",
      "A comida preferida varia conforme a pessoa.",
      ""
    ],
    [
      "{大雨|おおあめ}**によって**、{電車|でんしゃ}が {止|と}まりました。",
      "",
      "Por causa da chuva forte, o trem parou.",
      "Causa."
    ],
    [
      "{努力|どりょく}**によって**、{試験|しけん}に {合格|ごうかく}しました。",
      "",
      "Passei na prova por meio de esforço.",
      "Meio."
    ],
    [
      "この {橋|はし}は {有名|ゆうめい}な {建築家|けんちくか}**によって** {設計|せっけい}されました。",
      "",
      "Esta ponte foi projetada por um(a) arquiteto(a) famoso(a).",
      "Passivo formal."
    ],
    [
      "{場合|ばあい}**によっては**、{予定|よてい}を {変|か}える ことも あります。",
      "",
      "Dependendo do caso, às vezes mudamos o plano.",
      ""
    ]
  ],
  "care": [
    "Em português usamos “por” para tudo; em japonês o sentido vem do verbo: com **{違|ちが}う, {変|か}わる** é “depende de”; com um resultado é “por causa de”.",
    "Como quem faz no passivo, **によって** é para obras, invenções e fatos formais. Para pessoas comuns, use **に**: {先生|せんせい}に {叱|しか}られた (fui repreendido(a) pelo(a) professor(a)).",
    "Não serve para ferramenta concreta: ✗ ナイフによって {切|き}る → ✓ ナイフで {切|き}る.",
    "No sentido de causa, **によって** soa formal e é comum em notícias. Na conversa, use ～ので, ～から ou ～で.",
    "Para ligar a um substantivo, use **による**: ✗ {事故|じこ}によっての {遅|おく}れ → ✓ {事故|じこ}による {遅|おく}れ."
  ],
  "practice": []
},
{
  "id": "zaru-wo-enai",
  "title": "～ざるを{得|え}ない",
  "summary": "Como dizer que não há outra saída: não tem jeito, sou obrigado(a) a, não posso deixar de.",
  "use": [
    "**～ざるを{得|え}ない**: “não tem jeito senão ~, sou obrigado(a) a ~, não posso deixar de ~”. Você **não quer** fazer, mas as circunstâncias não deixam outra opção.",
    "É um estilo **formal e escrito**, mas aparece em reuniões e discursos. Na fala solta, use ～しか ない ou ～なければ ならない.",
    "O sentimento é de **resignação**: quem fala preferiria outra coisa."
  ],
  "form": [
    "**Forma ない sem ない + ざるを{得|え}ない**: {行|い}かない → {行|い}か**ざるを{得|え}ない**.",
    "Exceção: **する** vira **せざるを{得|え}ない** (não しざる).",
    "Verbos do grupo 2 perdem só o ない: {食|た}べない → {食|た}べざるを{得|え}ない.",
    "Polido: ～ざるを{得|え}ません. Passado: ～ざるを{得|え}ませんでした."
  ],
  "tables": [
    {
      "title": "Formando com ざるを得ない",
      "head": [
        "Verbo",
        "Forma ない",
        "～ざるを{得|え}ない"
      ],
      "rows": [
        [
          "{行|い}く",
          "{行|い}かない",
          "{行|い}かざるを{得|え}ない"
        ],
        [
          "{食|た}べる",
          "{食|た}べない",
          "{食|た}べざるを{得|え}ない"
        ],
        [
          "{待|ま}つ",
          "{待|ま}たない",
          "{待|ま}たざるを{得|え}ない"
        ],
        [
          "する",
          "しない",
          "せざるを{得|え}ない"
        ],
        [
          "{来|く}る",
          "{来|こ}ない",
          "{来|こ}ざるを{得|え}ない"
        ]
      ]
    }
  ],
  "ex": [
    [
      "{雨|あめ}が ひどいので、{試合|しあい}を {中止|ちゅうし}**せざるを{得|え}ません**。",
      "",
      "Como a chuva está forte, não temos outra opção senão cancelar o jogo.",
      "する → せざる."
    ],
    [
      "{上司|じょうし}の {命令|めいれい}ですから、{行|い}か**ざるを{得|え}ません**。",
      "",
      "É ordem do(a) chefe, então não tenho como deixar de ir.",
      ""
    ],
    [
      "{人|ひと}が {足|た}りないので、{残業|ざんぎょう}せ**ざるを{得|え}ない**。",
      "",
      "Falta gente, então não tem jeito: vamos ter que fazer hora extra.",
      ""
    ],
    [
      "{病気|びょうき}なので、{旅行|りょこう}を {諦|あきら}め**ざるを{得|え}ませんでした**。",
      "",
      "Como estou doente, não tive jeito senão desistir da viagem.",
      "Passado."
    ],
    [
      "{証拠|しょうこ}が あれば、{認|みと}め**ざるを{得|え}ない**。",
      "",
      "Com as provas, não tem como deixar de reconhecer.",
      ""
    ],
    [
      "{山田|やまだ}さんの {意見|いけん}は {正|ただ}しいと {言|い}わ**ざるを{得|え}ない**。",
      "",
      "Tenho que admitir que a opinião de Yamada-san está certa.",
      "Verbo com う: い → わ."
    ]
  ],
  "care": [
    "**ざる** é a forma antiga de ない: por isso só se liga à **forma ない sem ない**, e **する** vira **せざる**.",
    "Não é capacidade, é falta de escolha: ✗ {行|い}けない (não consigo ir) ≠ ✓ {行|い}かざるを{得|え}ない (tenho que ir, contra a vontade).",
    "Não use com algo que você **quer** fazer: a frase pede o sentimento de “queria evitar”.",
    "É uma forma fixa: não troque ざる por ない ({行|い}かないを{得|え}ない não existe).",
    "Soa duro no dia a dia: entre amigos se diz ～しか ない ou ～なきゃ."
  ],
  "practice": []
},
{
  "id": "zu-ni",
  "title": "～ずに",
  "summary": "Como dizer “sem fazer ~”: a forma ずに, mais formal que ～ないで.",
  "use": [
    "**～ずに**: “sem ~, sem fazer ~”. Mostra que uma ação foi feita **sem** outra: {朝|あさ}ごはんを {食|た}べずに {出|で}かけた.",
    "É o equivalente formal e escrito de **～ないで**.",
    "**～ずに すむ**: “conseguir evitar ~, não precisar ~”: {行|い}かずに すむ.",
    "**～ず** (sem に) liga frases em textos: {何|なに}も {言|い}わず {帰|かえ}った."
  ],
  "form": [
    "Mesma base do ～ざるを{得|え}ない: **forma ない sem ない + ずに**: {食|た}べない → {食|た}べずに.",
    "Exceção: **する → せずに** ({勉強|べんきょう}せずに).",
    "Verbos com う: o い vira **わ** ({言|い}わずに, {買|か}わずに).",
    "Verbos curtos: {見|み}ずに, {寝|ね}ずに, {来|こ}ずに."
  ],
  "tables": [
    {
      "title": "Formando com ずに",
      "head": [
        "Verbo",
        "Forma ない",
        "～ずに"
      ],
      "rows": [
        [
          "{飲|の}む",
          "{飲|の}まない",
          "{飲|の}まずに"
        ],
        [
          "{食|た}べる",
          "{食|た}べない",
          "{食|た}べずに"
        ],
        [
          "{言|い}う",
          "{言|い}わない",
          "{言|い}わずに"
        ],
        [
          "する",
          "しない",
          "せずに"
        ],
        [
          "{来|く}る",
          "{来|こ}ない",
          "{来|こ}ずに"
        ]
      ]
    }
  ],
  "ex": [
    [
      "{朝|あさ}ごはんを {食|た}べ**ずに**、{会社|かいしゃ}へ {行|い}きました。",
      "",
      "Fui para o trabalho sem tomar café da manhã.",
      ""
    ],
    [
      "{何|なに}も {言|い}わ**ずに**、{帰|かえ}りました。",
      "",
      "Voltou para casa sem dizer nada.",
      "い → わ."
    ],
    [
      "{辞書|じしょ}を {見|み}**ずに**、この {文|ぶん}を {読|よ}んで ください。",
      "",
      "Leia esta frase sem olhar o dicionário.",
      ""
    ],
    [
      "{電気|でんき}を {消|け}さ**ずに** {寝|ね}ました。",
      "",
      "Dormi sem apagar a luz.",
      ""
    ],
    [
      "{休|やす}ま**ずに** {働|はたら}いたので、{体|からだ}を こわしました。",
      "",
      "Como trabalhei sem descansar, minha saúde piorou.",
      ""
    ],
    [
      "{勉強|べんきょう}**せずに** {試験|しけん}に {合格|ごうかく}する ことは できません。",
      "",
      "Não dá para passar na prova sem estudar.",
      "する → せずに."
    ]
  ],
  "care": [
    "O sentido é quase igual a **～ないで**. **ずに** soa mais escrito e firme; no dia a dia, ～ないで é mais comum.",
    "**する → せずに** (não しずに) é a exceção que mais gera erro.",
    "As duas ações têm o **mesmo sujeito**.",
    "Não use **ずに** para pedir: ✗ {行|い}かずに ください. Para “não faça”, use ～ないで ください.",
    "**～ずに すむ** quer dizer “escapar de ~”: {行|い}かずに すんだ = não precisei ir."
  ],
  "practice": []
},
{
  "id": "te-kuru-iku",
  "title": "～てくる / ～ていく",
  "summary": "Verbo na forma て + くる ou いく: ir fazer algo e voltar, trazer ou levar, e mudanças que vêm acontecendo ou que vão continuar.",
  "use": [
    "**～てくる / ～ていく** dão ao verbo uma **direção**: **くる** (vir) aproxima de quem fala ou do momento atual; **いく** (ir) afasta de quem fala ou segue para o futuro.",
    "**Movimento e retorno**: **～てくる** = “ir fazer e voltar”: {買|か}って くる (ir comprar e voltar), {見|み}て くる (ir ver e voltar).",
    "**Trazer e levar**: {持|も}って くる (trazer), {持|も}って いく (levar).",
    "**Mudança no tempo**: **～てきた** = “vem acontecendo até agora” ({増|ふ}えて きた); **～ていく** = “vai continuar daqui para a frente” ({増|ふ}えて いく).",
    "**～てくる** também indica algo que **começa ou se torna perceptível**: {雨|あめ}が {降|ふ}って きた, {見|み}えて きた."
  ],
  "form": [
    "**Verbo (forma て) + くる / いく**: {買|か}って + くる → {買|か}って きます.",
    "**くる** e **いく** conjugam normalmente: きます / きた / きて / {来|こ}ない e {行|い}きます / {行|い}った / {行|い}って / {行|い}かない.",
    "Costuma-se escrever **くる / いく** em kana quando funcionam como auxiliares."
  ],
  "tables": [
    {
      "title": "てくる x ていく",
      "head": [
        "Uso",
        "～てくる",
        "～ていく"
      ],
      "rows": [
        [
          "Ir e voltar",
          "{買|か}って くる (ir comprar e voltar)",
          "{買|か}って いく (comprar no caminho e levar)"
        ],
        [
          "Trazer / levar",
          "{持|も}って くる (trazer)",
          "{持|も}って いく (levar)"
        ],
        [
          "Mudança no tempo",
          "{増|ふ}えて きた (vem aumentando até agora)",
          "{増|ふ}えて いく (vai aumentar daqui para a frente)"
        ],
        [
          "Processo",
          "{見|み}えて きた (passou a dar para ver)",
          "{消|き}えて いく (vai sumindo)"
        ]
      ]
    }
  ],
  "ex": [
    [
      "コンビニで {飲|の}み{物|もの}を {買|か}って**きます**。",
      "",
      "Vou ao mercadinho comprar uma bebida (e volto já).",
      "ir e voltar."
    ],
    [
      "この {荷物|にもつ}を {駅|えき}まで {持|も}って**いきます**。",
      "",
      "Vou levar esta bagagem até a estação.",
      ""
    ],
    [
      "だんだん {寒|さむ}く なって**きました**。",
      "",
      "Foi ficando cada vez mais frio.",
      "mudança até agora."
    ],
    [
      "{日本語|にほんご}の {勉強|べんきょう}を {続|つづ}けて**いきます**。",
      "",
      "Vou continuar estudando japonês daqui para a frente.",
      "futuro."
    ],
    [
      "{空|そら}が {暗|くら}く なって、{雨|あめ}が {降|ふ}って**きました**。",
      "",
      "O céu escureceu e começou a chover.",
      ""
    ],
    [
      "{日本|にほん}で {働|はたら}く {外国人|がいこくじん}は これから {増|ふ}えて**いく**でしょう。",
      "",
      "O número de estrangeiros que trabalham no Japão deve continuar aumentando.",
      ""
    ]
  ],
  "care": [
    "**{買|か}って くる** não é “comprar e vir para cá”, e sim **ir comprar e voltar**. Em português, use “ir comprar”, “dar uma passada”.",
    "**Trazer = {持|も}って くる; levar = {持|も}って いく.** Quem fala português costuma confundir as duas direções.",
    "Para mudança, **～てきた** olha para o **passado até agora** e **～ていく** olha para o **futuro**: {増|ふ}えて きた (vem aumentando) x {増|ふ}えて いく (vai aumentar).",
    "Não confunda com **～ている** (ação em andamento ou estado): {食|た}べて いる (está comendo) x {食|た}べて いく (come antes de ir)."
  ],
  "practice": [
    [
      "Conjugação de verbos",
      "conjugacao.html"
    ]
  ]
},
{
  "id": "beki",
  "title": "～べき",
  "summary": "Dizer o que alguém deve fazer por razão moral ou bom senso: ～べきだ, ～べきではない e ～べきだった (“devia ter feito”).",
  "use": [
    "**～べきだ**: “deve-se ~, é o certo a fazer”. É o **julgamento do falante** sobre o que é correto ou razoável.",
    "**～べきではない**: “não se deve ~”.",
    "**～べきだった**: “eu devia ter feito ~”, para lamentar ou criticar algo do passado.",
    "**Antes de substantivo**: {考|かんが}える**べき** {問題|もんだい} (um problema que se deve considerar)."
  ],
  "form": [
    "**Verbo (forma do dicionário) + べき**: {守|まも}る → {守|まも}るべきだ.",
    "**する → するべき** ou **すべき** (as duas existem; すべき é mais formal).",
    "**Negativo: ～べきではない** (não existe ✗ ～ないべき). **Passado: ～べきだった / ～べきではなかった**."
  ],
  "ex": [
    [
      "{約束|やくそく}は {守|まも}る**べき**です。",
      "",
      "As promessas devem ser cumpridas.",
      ""
    ],
    [
      "{電車|でんしゃ}の {中|なか}で {大|おお}きな {声|こえ}で {話|はな}す**べきではありません**。",
      "",
      "Não se deve falar alto dentro do trem.",
      "negativo."
    ],
    [
      "もっと {早|はや}く {病院|びょういん}へ {行|い}く**べきだった**。",
      "",
      "Eu devia ter ido ao hospital mais cedo.",
      "lamento."
    ],
    [
      "{学生|がくせい}は まず {勉強|べんきょう}する**べき**だと {思|おも}います。",
      "",
      "Acho que estudantes devem, antes de tudo, estudar.",
      "する → するべき / すべき."
    ],
    [
      "{困|こま}って いる {人|ひと}が いたら、{助|たす}ける**べき**です。",
      "",
      "Se alguém está em dificuldade, deve-se ajudar.",
      ""
    ],
    [
      "これは {私|わたし}たちが {考|かんが}える**べき** {問題|もんだい}です。",
      "",
      "Este é um problema que nós devemos considerar.",
      "antes de substantivo."
    ]
  ],
  "care": [
    "**～べき** é uma opinião **forte**. Dito a alguém de cargo mais alto, soa arrogante; nesses casos prefira “～ほうが いいと {思|おも}います”.",
    "Não existe o negativo ✗ {行|い}かないべき. Diga **{行|い}く べきではない**.",
    "**～べき** x **～なければならない**: べき vem de um julgamento moral ou de bom senso; ～なければならない é obrigação por regra ou necessidade.",
    "**～べきだった** mostra lamento sobre o passado e implica que a pessoa **não fez**: {言|い}う べきだった = eu devia ter dito (e não disse)."
  ],
  "practice": [
    [
      "Conjugação de verbos",
      "conjugacao.html"
    ]
  ]
},
{
  "id": "mono-koto-da",
  "title": "～ものだ / ～ことだ",
  "summary": "Duas terminações de opinião: ～ものだ diz como as coisas naturalmente são (ou lembra o passado); ～ことだ dá um conselho direto.",
  "use": [
    "**～ものだ** (verdade geral): “é natural que ~, a natureza das coisas é ~”: {人|ひと}は {間違|まちが}える ものだ.",
    "**～たものだ** (lembrança): “eu costumava ~, como eu fazia ~”, com saudade do passado.",
    "**～ものだ** (emoção): sentimento de admiração ou surpresa: {時間|じかん}が たつのは {早|はや}い ものですね.",
    "**～ものではない**: “não é coisa que se faça, não se deve ~”.",
    "**～ことだ** (conselho): “o melhor é ~, o jeito é ~”: {休|やす}む ことだ. Negativo: **～ない ことだ**."
  ],
  "form": [
    "**ものだ**: verbo ou adjetivo na forma curta + ものだ ({早|はや}い ものだ, {遊|あそ}んだ ものだ).",
    "**ことだ**: verbo na forma do dicionário ou ない + ことだ ({休|やす}む ことだ, {無理|むり}を しない ことだ).",
    "Na fala educada, だ vira です: ～ものです, ～ことです."
  ],
  "tables": [
    {
      "title": "Quando usar cada forma",
      "head": [
        "Forma",
        "Sentido",
        "Exemplo"
      ],
      "rows": [
        [
          "～ものだ",
          "como as coisas são, em geral",
          "{人|ひと}は {間違|まちが}える ものだ。"
        ],
        [
          "～た ものだ",
          "lembrança de um hábito do passado",
          "よく {遊|あそ}んだ ものだ。"
        ],
        [
          "～ものではない",
          "não se deve fazer",
          "{人|ひと}の {悪口|わるぐち}を {言|い}う ものではない。"
        ],
        [
          "～ことだ",
          "conselho direto: o melhor é fazer",
          "{毎日|まいにち} {練習|れんしゅう}する ことだ。"
        ],
        [
          "～ない ことだ",
          "conselho: o melhor é não fazer",
          "{無理|むり}を しない ことだ。"
        ]
      ]
    }
  ],
  "ex": [
    [
      "{人|ひと}は だれでも {間違|まちが}える**ものです**。",
      "",
      "Todo mundo erra, é natural.",
      "verdade geral."
    ],
    [
      "{子|こ}どもの ころ、よく この {川|かわ}で {泳|およ}いだ**ものです**。",
      "",
      "Quando criança, eu costumava nadar neste rio.",
      "lembrança."
    ],
    [
      "{時間|じかん}が たつのは {早|はや}い**ものですね**。",
      "",
      "Como o tempo passa rápido, não é?",
      "emoção."
    ],
    [
      "{人|ひと}の {悪口|わるぐち}を {言|い}う**ものではありません**。",
      "",
      "Não se fala mal dos outros.",
      ""
    ],
    [
      "{疲|つか}れた ときは、ゆっくり {休|やす}む**ことです**。",
      "",
      "Quando se está cansado, o melhor é descansar com calma.",
      "conselho."
    ],
    [
      "{日本語|にほんご}が {上手|じょうず}に なりたければ、{毎日|まいにち} {話|はな}す**ことです**。",
      "",
      "Se quer melhorar seu japonês, o jeito é falar todo dia.",
      ""
    ]
  ],
  "care": [
    "**～ものだ** fala de **tendências gerais**, não de um fato isolado. ✗ {昨日|きのう} {食|た}べた ものだ não serve para contar o que aconteceu ontem.",
    "Na lembrança, **～たものだ** indica **hábito repetido**, não um evento único: {泳|およ}いだ ものだ = “eu nadava (sempre)”.",
    "**～ことだ** é conselho direto, de quem fala para alguém igual ou mais novo. Para superiores, é melhor evitar.",
    "Não confunda **～ことだ** (conselho, depois de verbo na forma do dicionário ou ない) com **こと** comum, que transforma verbo em substantivo ({泳|およ}ぐ ことが できる)."
  ],
  "practice": []
},
{
  "id": "meirei-kinshi",
  "title": "Imperativo e proibição (～ろ, ～な)",
  "summary": "As formas diretas de ordem (まて, たべろ) e de proibição (いくな), e ～なさい, a ordem mais suave.",
  "use": [
    "**Imperativo** (ordem seca): “faça ~!”: {止|と}まれ! (pare!), {待|ま}て! (espere!). Usado em avisos, placas, esportes, gritos e entre pessoas muito próximas.",
    "**Proibição**: **verbo no dicionário + な**: {走|はし}るな! (não corra!), {触|さわ}るな! (não toque!).",
    "**～なさい**: ordem **mais suave**, de pais e professores: {手|て}を {洗|あら}いなさい (lave as mãos).",
    "**Incentivo**: がんばれ! (força!), {負|ま}けるな! (não perca!) são comuns entre amigos e em torcida."
  ],
  "form": [
    "**Grupo 1 (godan)**: o último som **u → e**: {待|ま}つ → {待|ま}て; {飲|の}む → {飲|の}め; {書|か}く → {書|か}け; {話|はな}す → {話|はな}せ.",
    "**Grupo 2 (ichidan)**: **る → ろ**: {食|た}べる → {食|た}べろ; {見|み}る → {見|み}ろ.",
    "**Irregulares**: する → **しろ**; {来|く}る → **{来|こ}い**.",
    "**Proibição**: forma do dicionário + **な** (する → するな, {来|く}る → {来|く}るな).",
    "**～なさい**: radical de ます + なさい ({食|た}べなさい, {早|はや}く {寝|ね}なさい)."
  ],
  "tables": [
    {
      "title": "Imperativo e proibição",
      "head": [
        "Dicionário",
        "Imperativo",
        "Proibição"
      ],
      "rows": [
        [
          "{待|ま}つ",
          "{待|ま}て",
          "{待|ま}つな"
        ],
        [
          "{飲|の}む",
          "{飲|の}め",
          "{飲|の}むな"
        ],
        [
          "{話|はな}す",
          "{話|はな}せ",
          "{話|はな}すな"
        ],
        [
          "{食|た}べる",
          "{食|た}べろ",
          "{食|た}べるな"
        ],
        [
          "{見|み}る",
          "{見|み}ろ",
          "{見|み}るな"
        ],
        [
          "する",
          "しろ",
          "するな"
        ],
        [
          "{来|く}る",
          "{来|こ}い",
          "{来|く}るな"
        ]
      ]
    }
  ],
  "ex": [
    [
      "{止|と}まれ！",
      "",
      "Pare!",
      "placa de trânsito."
    ],
    [
      "{走|はし}るな！",
      "",
      "Não corra!",
      "proibição."
    ],
    [
      "{早|はや}く {来|こ}い！",
      "",
      "Venha logo!",
      "来る → 来い."
    ],
    [
      "この {線|せん}より {中|なか}に {入|はい}るな。",
      "",
      "Não entre além desta linha.",
      "aviso."
    ],
    [
      "{負|ま}けるな！ がんばれ！",
      "",
      "Não perca! Vai com tudo!",
      "torcida."
    ],
    [
      "{手|て}を {洗|あら}い**なさい**。",
      "",
      "Lave as mãos.",
      "ordem suave de pais ou professores."
    ]
  ],
  "care": [
    "O imperativo seco é **brusco**. Com desconhecidos, superiores e clientes soa agressivo: use **～てください** ou **～ないで ください**.",
    "O **な** da proibição vem **depois do verbo no dicionário** e não se confunde com o **な** do adjetivo ({静|しず}かな {部屋|へや}) nem com o **な** final suave (そう だな).",
    "**～なさい** é de quem tem autoridade sobre a outra pessoa (pais, professores). Não use com seu chefe.",
    "O imperativo de **{来|く}る** é **{来|こ}い** (não ✗ きろ) e o de **する** é **しろ**."
  ],
  "practice": [
    [
      "Conjugação de verbos",
      "conjugacao.html"
    ]
  ]
},
{
  "id": "sasete-itadaku",
  "title": "～させていただく",
  "summary": "Forma humilde para dizer “eu faço, com a sua permissão” ou pedir licença para fazer algo: ～させていただきます e ～させていただけませんか.",
  "use": [
    "**～させていただく** é o **causativo na forma て + いただく**. Ideia: “receber o favor de ser **autorizado a fazer**”. É linguagem humilde ({謙譲語|けんじょうご}, veja o tópico de keigo).",
    "**Pedir permissão com muita educação**: {写真|しゃしん}を {撮|と}らせて いただけませんか (poderia me deixar tirar uma foto?).",
    "**Anunciar o que você vai fazer**, de forma humilde, em contexto de trabalho e eventos: {説明|せつめい}させて いただきます (vou explicar).",
    "**Dizer o que você fez com permissão**: {先生|せんせい}の {本|ほん}を {読|よ}ませて いただきました (li o livro do professor(a), com a sua licença)."
  ],
  "form": [
    "**Verbo no causativo (forma て) + いただく**: {休|やす}む → {休|やす}ま**せて** いただく.",
    "Para **pedir**: ～させて いただけませんか / ～させて いただけないでしょうか. Para **declarar**: ～させて いただきます.",
    "**Informal (entre pessoas próximas)**: ～させて もらう / ～させて ください."
  ],
  "tables": [
    {
      "title": "Formando ～させていただきます",
      "head": [
        "Dicionário",
        "Causativo (forma て)",
        "～いただきます"
      ],
      "rows": [
        [
          "{書|か}く",
          "{書|か}かせて",
          "{書|か}かせて いただきます"
        ],
        [
          "{休|やす}む",
          "{休|やす}ませて",
          "{休|やす}ませて いただきます"
        ],
        [
          "{食|た}べる",
          "{食|た}べさせて",
          "{食|た}べさせて いただきます"
        ],
        [
          "する",
          "させて",
          "させて いただきます"
        ],
        [
          "{来|く}る",
          "{来|こ}させて",
          "{来|こ}させて いただきます"
        ]
      ]
    }
  ],
  "ex": [
    [
      "{本日|ほんじつ}は {早|はや}く {帰|かえ}ら**せていただきます**。",
      "",
      "Hoje, com a sua licença, vou embora mais cedo.",
      ""
    ],
    [
      "ここで {写真|しゃしん}を {撮|と}ら**せていただけませんか**。",
      "",
      "Poderia me deixar tirar uma foto aqui?",
      "pedido."
    ],
    [
      "{私|わたし}から {説明|せつめい}**させていただきます**。",
      "",
      "Eu mesmo vou explicar.",
      "declaração humilde."
    ],
    [
      "この {機会|きかい}に、ひとこと {挨拶|あいさつ}**させていただきます**。",
      "",
      "Aproveito a ocasião para dizer algumas palavras.",
      ""
    ],
    [
      "{明日|あした}は {休|やす}ま**せていただきたい**のですが。",
      "",
      "Eu gostaria de pedir para faltar amanhã.",
      "pedido indireto."
    ],
    [
      "{先生|せんせい}の {本|ほん}を {読|よ}ま**せていただきました**。",
      "",
      "Tive a oportunidade de ler o livro do professor(a).",
      ""
    ]
  ],
  "care": [
    "Use quando há **permissão ou benefício do outro**. Dizer ✗ {名前|なまえ}は {田中|たなか}と {言|い}わせて いただきます (sem razão) soa estranho.",
    "É muito comum em negócios, mas o **excesso** é criticado: quando não há permissão em jogo, prefira ～します / ～いたします.",
    "**～て いただく** (receber o favor de alguém fazer) é diferente de **～させて いただく** (eu faço, com a sua permissão): {教|おし}えて いただく x {説明|せつめい}させて いただく.",
    "Cuidado com o verbo: **{見|み}させて** (causativo de {見|み}る, “deixar ver”) não é **{見|み}せて** (“mostrar”)."
  ],
  "practice": [
    [
      "Conjugação de verbos",
      "conjugacao.html"
    ]
  ]
},
{
  "id": "tomo-ni",
  "title": "～とともに / ～に{伴|ともな}って",
  "summary": "Expressões formais para “junto com” e “à medida que”: ～とともに e ～にともなって (～にともない), usadas quando duas coisas mudam juntas.",
  "use": [
    "**N + とともに**: “junto com N”: {家族|かぞく}とともに.",
    "**V / N + とともに**: “ao mesmo tempo que, à medida que” (duas mudanças acompanhadas): {年|とし}を {取|と}るとともに.",
    "**V1 + とともに V2**: duas qualidades ao mesmo tempo: {効果|こうか}が あるとともに {副作用|ふくさよう}も ある.",
    "**N + に{伴|ともな}って / に{伴|ともな}い**: “acompanhando a mudança de N”. A segunda parte é a consequência."
  ],
  "form": [
    "**とともに**: substantivo ou verbo na forma do dicionário + とともに ({発展|はってん}とともに, {増|ふ}えるとともに).",
    "**に{伴|ともな}って**: **substantivo (ou verbo + の)** + に{伴|ともな}って. **に{伴|ともな}い** é a versão mais escrita.",
    "Os dois são **formais**, comuns em jornais e textos."
  ],
  "tables": [
    {
      "title": "Estruturas",
      "head": [
        "Estrutura",
        "Sentido",
        "Exemplo"
      ],
      "rows": [
        [
          "N + とともに",
          "junto com N",
          "{家族|かぞく}とともに {旅行|りょこう}した。"
        ],
        [
          "V / N + とともに",
          "à medida que, ao mesmo tempo que",
          "{年|とし}を {取|と}るとともに、{体|からだ}が {弱|よわ}く なる。"
        ],
        [
          "N + に{伴|ともな}って / に{伴|ともな}い",
          "acompanhando a mudança de N",
          "{人口|じんこう}の {増加|ぞうか}に{伴|ともな}い、{家|いえ}が {足|た}りない。"
        ],
        [
          "V1 とともに V2",
          "duas qualidades ao mesmo tempo",
          "{効果|こうか}が あるとともに、{副作用|ふくさよう}も ある。"
        ]
      ]
    }
  ],
  "ex": [
    [
      "{家族|かぞく}**とともに** {旅行|りょこう}に {行|い}きました。",
      "",
      "Viajei junto com a família.",
      ""
    ],
    [
      "{年|とし}を {取|と}る**とともに**、{体|からだ}の {力|ちから}が {弱|よわ}く なります。",
      "",
      "Com o passar dos anos, a força do corpo diminui.",
      "mudança paralela."
    ],
    [
      "{技術|ぎじゅつ}の {進歩|しんぽ}**に{伴|ともな}って**、{生活|せいかつ}は {便利|べんり}に なりました。",
      "",
      "Com o progresso da tecnologia, a vida ficou mais prática.",
      ""
    ],
    [
      "{人口|じんこう}の {増加|ぞうか}**に{伴|ともな}い**、{住|す}む {所|ところ}が {足|た}りなく なって きました。",
      "",
      "Com o aumento da população, passou a faltar moradia.",
      "に伴い: mais escrito."
    ],
    [
      "この {薬|くすり}は {効果|こうか}が ある**とともに**、{副作用|ふくさよう}も あります。",
      "",
      "Este remédio tem efeito e, ao mesmo tempo, efeitos colaterais.",
      ""
    ],
    [
      "{経済|けいざい}の {発展|はってん}**に{伴|ともな}って**、{都市|とし}の {物価|ぶっか}も {上|あ}がりました。",
      "",
      "Com o desenvolvimento da economia, os preços da cidade também subiram.",
      ""
    ]
  ],
  "care": [
    "São expressões **escritas e formais**. Na conversa, use **と いっしょに** (junto com) ou **につれて** (à medida que).",
    "**～に{伴|ともな}って** exige uma **mudança em andamento** na primeira parte (aumento, desenvolvimento). Não serve para ações simples: ✗ {勉強|べんきょう}に{伴|ともな}って ごはんを {食|た}べた.",
    "**～につれて** é parecido e mais comum na fala, com foco em mudança **gradual**; **～に{伴|ともな}って** também aceita mudanças bruscas.",
    "Com **pessoas**, **とともに** é formal e soa duro; no dia a dia diga **{友|とも}だちと いっしょに**."
  ],
  "practice": []
},
{
  "id": "bakari-ka",
  "title": "～ばかりか / ～のみならず",
  "summary": "Como dizer “não só ~, mas também ~”, com a segunda parte ainda mais forte: ～ばかりか (mais usado) e ～のみならず (formal e escrito).",
  "use": [
    "**～ばかりか ～も**: “não só ~, como também ~”. O segundo fato é **mais forte ou mais surpreendente** que o primeiro.",
    "**～のみならず ～も**: o mesmo sentido, em tom **formal e escrito** (jornal, discurso, artigo).",
    "A segunda parte costuma trazer **も, さえ ou まで**: {忘|わす}れた ばかりか、{連絡|れんらく}さえ しなかった."
  ],
  "form": [
    "**Verbo / adjetivo い**: forma curta (inclusive passado e negativo) + ばかりか: {安|やす}い ばかりか, {降|ふ}った ばかりか.",
    "**Adjetivo な**: な + ばかりか ({上手|じょうず}な ばかりか). **Substantivo**: N + ばかりか, ou **N + である** (formal).",
    "**のみならず**: mesmos encaixes; com adjetivo な e substantivo costuma-se usar **である**."
  ],
  "tables": [
    {
      "title": "Três jeitos de dizer “não só... mas também”",
      "head": [
        "Forma",
        "Tom",
        "Exemplo"
      ],
      "rows": [
        [
          "～だけでなく",
          "neutro, do dia a dia",
          "{英語|えいご}だけでなく、{中国語|ちゅうごくご}も {話|はな}せる。"
        ],
        [
          "～ばかりか",
          "mais forte; fala e escrita",
          "{英語|えいご}ばかりか、{中国語|ちゅうごくご}も {話|はな}せる。"
        ],
        [
          "～のみならず",
          "formal, escrito",
          "{国内|こくない}のみならず、{海外|かいがい}でも {人気|にんき}だ。"
        ]
      ]
    }
  ],
  "ex": [
    [
      "{彼|かれ}は {英語|えいご}**ばかりか**、{中国語|ちゅうごくご}も {話|はな}せます。",
      "",
      "Ele fala não só inglês, como também chinês.",
      ""
    ],
    [
      "{田中|たなか}さんは {料理|りょうり}が {上手|じょうず}な**ばかりか**、{掃除|そうじ}も {得意|とくい}です。",
      "",
      "Tanaka-san não só cozinha bem, como também é ótimo(a) em limpar.",
      ""
    ],
    [
      "この {店|みせ}は {安|やす}い**ばかりか**、{味|あじ}も いいです。",
      "",
      "Este restaurante não só é barato, como a comida também é boa.",
      ""
    ],
    [
      "{昨日|きのう}は {雨|あめ}が {降|ふ}った**ばかりか**、{風|かぜ}も {強|つよ}かった。",
      "",
      "Ontem não só choveu, como também ventou forte.",
      "passado."
    ],
    [
      "{田中|たなか}さんは {約束|やくそく}を {忘|わす}れた**ばかりか**、{連絡|れんらく}さえ しませんでした。",
      "",
      "Tanaka-san não só esqueceu o compromisso, como nem avisou.",
      "さえ."
    ],
    [
      "この {映画|えいが}は {国内|こくない}**のみならず**、{海外|かいがい}でも {人気|にんき}が あります。",
      "",
      "Este filme tem sucesso não só no país, como também no exterior.",
      "formal."
    ]
  ],
  "care": [
    "Os dois fatos devem ir na **mesma direção** (os dois bons ou os dois ruins). Ligar algo bom a algo ruim não funciona.",
    "O segundo fato é **mais forte** que o primeiro. Se são do mesmo peso, use **～だけでなく**.",
    "A segunda parte descreve um fato. Não coloque **pedido, convite ou ordem** nela: ✗ ～ばかりか、{来|き}て ください.",
    "**～のみならず** é mais **formal**. Na conversa use ～だけでなく ou ～ばかりか."
  ],
  "practice": []
},
{
  "id": "keigo-teineigo",
  "title": "Keigo 1: {丁寧語|ていねいご}",
  "summary": "Primeiro dos três tipos de keigo (linguagem de respeito): a polidez com quem ouve, de です・ます a ございます e às palavras mais polidas.",
  "use": [
    "**Keigo** ({敬語|けいご}) é a linguagem de respeito e tem **3 tipos**: **{丁寧語|ていねいご}** (polidez com quem está ouvindo), **{尊敬語|そんけいご}** (eleva o outro) e **{謙譲語|けんじょうご}** (abaixa quem fala e o seu lado). Este é o primeiro; os dois próximos tópicos tratam dos outros.",
    "**{丁寧語|ていねいご}**: educação direta com **quem ouve**. Você já usa: **です / ます**.",
    "**Um degrau acima**: **ございます / でございます** e palavras mais polidas (**ただいま, のちほど, こちら, どなた, いかが**), muito usadas em atendimento, anúncios e cartas.",
    "**お / ご antes de palavras** deixa a fala mais elegante ({美化語|びかご}): お{茶|ちゃ}, お{水|みず}, ご{飯|はん}."
  ],
  "form": [
    "**ある → ございます**; **です → で ございます**: こちらが {受付|うけつけ}で ございます. Também em ありがとう ございます e おはよう ございます.",
    "**お + palavra japonesa** (お{茶|ちゃ}, お{花|はな}, お{金|かね}); **ご + palavra de origem chinesa** (ご{飯|はん}, ご{家族|かぞく}). É tendência, com exceções, como お{電話|でんわ}.",
    "Palavras de origem estrangeira quase nunca levam お: コーヒー, ジュース."
  ],
  "tables": [
    {
      "title": "Palavras do dia a dia x mais polidas",
      "head": [
        "Do dia a dia",
        "Mais polido",
        "Sentido"
      ],
      "rows": [
        [
          "あります",
          "ございます",
          "existir (coisa)"
        ],
        [
          "です",
          "で ございます",
          "ser"
        ],
        [
          "{今|いま}",
          "ただいま",
          "agora"
        ],
        [
          "あとで",
          "{後|のち}ほど",
          "mais tarde"
        ],
        [
          "ここ / そこ / あそこ",
          "こちら / そちら / あちら",
          "aqui / aí / lá"
        ],
        [
          "だれ",
          "どなた",
          "quem"
        ],
        [
          "どう",
          "いかが",
          "como"
        ],
        [
          "ちょっと",
          "{少々|しょうしょう}",
          "um pouco, um momento"
        ]
      ]
    }
  ],
  "ex": [
    [
      "こちらが {受付|うけつけ}**で ございます**。",
      "",
      "Esta é a recepção.",
      ""
    ],
    [
      "**ただいま** {席|せき}が **ございません**。",
      "",
      "No momento não há lugares disponíveis.",
      ""
    ],
    [
      "**{後|のち}ほど**、また {連絡|れんらく}します。",
      "",
      "Entro em contato de novo mais tarde.",
      ""
    ],
    [
      "{飲|の}み{物|もの}は **いかが**ですか。",
      "",
      "Aceita uma bebida?",
      ""
    ],
    [
      "**あいにく**、{本日|ほんじつ}は {満席|まんせき}**で ございます**。",
      "",
      "Infelizmente, hoje estamos lotados.",
      "あいにく = infelizmente."
    ],
    [
      "こちらが **お{水|みず}**です。",
      "",
      "Aqui está a água.",
      "お + palavra japonesa."
    ]
  ],
  "care": [
    "**ございます** é para **coisas** e para dizer “ser”. Para existência de **pessoas**, use **いらっしゃいます** (respeito) ou **おります** (humilde), nos próximos tópicos.",
    "Ser polido com quem ouve (**{丁寧語|ていねいご}**) não é o mesmo que **elevar a pessoa de quem se fala**; isso é o **{尊敬語|そんけいご}**.",
    "Não ponha **お** em tudo: ✗ おコーヒー soa estranho. Use com palavras consagradas (お{茶|ちゃ}, お{水|みず}, お{金|かね}).",
    "**Nunca** use o お / ご de respeito para as **suas** coisas: ✗ {私|わたし}の お{名前|なまえ}."
  ],
  "practice": []
},
{
  "id": "keigo-sonkeigo",
  "title": "Keigo 2: {尊敬語|そんけいご}",
  "summary": "Linguagem de respeito que eleva a ação de outra pessoa (cliente, chefe, professor): verbos especiais, o padrão お～になる e o pedido お～ください.",
  "use": [
    "**{尊敬語|そんけいご}** coloca **a pessoa de quem se fala** (cliente, chefe, professor(a), desconhecido) num nível mais alto, elevando a **ação ou o estado dela**.",
    "**Verbos especiais**: いらっしゃる (estar, ir, vir), おっしゃる (dizer), {召|め}し{上|あ}がる (comer, beber), ご{覧|らん}に なる (ver), なさる (fazer), くださる (dar), ご{存|ぞん}じ (saber).",
    "**Padrão regular**: **お + radical + に なる** ({読|よ}む → お{読|よ}みに なる) e **ご + substantivo + に なる** (ご{利用|りよう}に なる).",
    "**Pedido educado**: **お + radical + ください** (お{待|ま}ちください) e **ご + substantivo + ください** (ご{利用|りよう}ください).",
    "**～れる / ～られる**: mais simples, com a forma do passivo ({書|か}かれる, {来|こ}られる)."
  ],
  "form": [
    "**Verbo especial** primeiro: se existe, use-o (tabela).",
    "**お + radical de ます + に なる**: {待|ま}つ → お{待|ま}ちに なる. **ご + {漢語|かんご} + に なる**: {出席|しゅっせき} → ご{出席|しゅっせき}に なる.",
    "**Formas de ます irregulares**: いらっしゃいます, おっしゃいます, なさいます, くださいます (✗ いらっしゃります).",
    "**Coisas do outro**: お{名前|なまえ}, お{時間|じかん}, ご{住所|じゅうしょ}, お{忙|いそが}しい."
  ],
  "tables": [
    {
      "title": "Verbos especiais de respeito",
      "head": [
        "Neutro",
        "{尊敬語|そんけいご}",
        "Sentido"
      ],
      "rows": [
        [
          "いる / {行|い}く / {来|く}る",
          "いらっしゃる",
          "estar, ir, vir"
        ],
        [
          "{言|い}う",
          "おっしゃる",
          "dizer"
        ],
        [
          "{食|た}べる / {飲|の}む",
          "{召|め}し{上|あ}がる",
          "comer, beber"
        ],
        [
          "{見|み}る",
          "ご{覧|らん}に なる",
          "ver"
        ],
        [
          "する",
          "なさる",
          "fazer"
        ],
        [
          "くれる",
          "くださる",
          "dar (a mim)"
        ],
        [
          "{知|し}って いる",
          "ご{存|ぞん}じだ",
          "saber"
        ]
      ]
    },
    {
      "title": "Padrões regulares",
      "head": [
        "Padrão",
        "Exemplo",
        "Observação"
      ],
      "rows": [
        [
          "お + radical + に なる",
          "お{読|よ}みに なる",
          "verbos comuns"
        ],
        [
          "ご + substantivo + に なる",
          "ご{利用|りよう}に なる",
          "verbos com する"
        ],
        [
          "お / ご + ～ ください",
          "お{待|ま}ち ください",
          "pedido educado"
        ],
        [
          "～れる / ～られる",
          "{書|か}かれる, {来|こ}られる",
          "igual ao passivo; menos formal"
        ]
      ]
    }
  ],
  "ex": [
    [
      "{社長|しゃちょう}は もう {会社|かいしゃ}に **いらっしゃいます**か。",
      "",
      "O presidente já está na empresa?",
      ""
    ],
    [
      "{先生|せんせい}が そう **おっしゃいました**。",
      "",
      "O professor(a) disse isso.",
      "おっしゃいます, não ✗ おっしゃります."
    ],
    [
      "どうぞ、{温|あたた}かい うちに **{召|め}し{上|あ}がって** ください。",
      "",
      "Sirva-se, enquanto está quente.",
      ""
    ],
    [
      "{部長|ぶちょう}は この {資料|しりょう}を **ご{覧|らん}に なりました**か。",
      "",
      "O gerente já viu este documento?",
      ""
    ],
    [
      "{少々|しょうしょう} **お{待|ま}ちください**。",
      "",
      "Aguarde um momento, por favor.",
      ""
    ],
    [
      "{先生|せんせい}は {毎朝|まいあさ} {新聞|しんぶん}を **お{読|よ}みに なります**。",
      "",
      "O professor(a) lê o jornal toda manhã.",
      ""
    ]
  ],
  "care": [
    "Use **só para os outros** (cliente, chefe, professor(a)); **nunca para si**: ✗ {私|わたし}が いらっしゃいます.",
    "Se o verbo tem **forma especial**, use-a: ✗ お{言|い}いに なる → **おっしゃる**; ✗ お{見|み}に なる → **ご{覧|らん}に なる**.",
    "Não **empilhe** formas: ✗ おっしゃられる, ✗ お{召|め}し{上|あ}がりに なられる. Uma só marca de respeito basta.",
    "**{来|こ}られる** pode ser respeito, passivo ou potencial. Para deixar claro, prefira **いらっしゃる** ou **お{見|み}えに なる**.",
    "**さん** vira **{様|さま}** em contextos formais de atendimento: {田中|たなか}{様|さま}."
  ],
  "practice": []
},
{
  "id": "keigo-kenjougo",
  "title": "Keigo 3: {謙譲語|けんじょうご}",
  "summary": "Linguagem humilde: quem fala abaixa a si mesmo e o seu grupo para elevar o outro. Verbos especiais, o padrão お～する e ～ております.",
  "use": [
    "**{謙譲語|けんじょうご}** abaixa **você e o seu lado** (família, equipe, empresa) para elevar quem recebe a ação.",
    "**Verbos especiais**: いたす (fazer), まいる (ir, vir), {伺|うかが}う (visitar, perguntar), おる (estar), {申|もう}す (dizer), いただく (comer, beber, receber), {拝見|はいけん}する (ver), さしあげる (dar).",
    "**Padrão regular**: **お + radical + する / いたす** (お{持|も}ちします) e **ご + substantivo + する / いたす** (ご{案内|あんない}いたします).",
    "**～ております**: forma humilde de ～ている ({今|いま}、{駅|えき}に おります).",
    "**Dentro e fora do grupo**: com gente de fora, fale do seu lado **sem さん**: {社長|しゃちょう}の {田中|たなか}, {母|はは}, {父|ちち}. Ver também ～させて いただく."
  ],
  "form": [
    "**Verbo especial** primeiro (tabela). O resto segue o padrão **お～する**.",
    "**お + radical de ます + する**: {持|も}つ → お{持|も}ちします; {届|とど}ける → お{届|とど}けします.",
    "**ご + substantivo + する / いたす**: {連絡|れんらく} → ご{連絡|れんらく}いたします; {説明|せつめい} → ご{説明|せつめい}いたします.",
    "Formas de ます: いたします, まいります, おります, {申|もう}します."
  ],
  "tables": [
    {
      "title": "Verbos especiais humildes",
      "head": [
        "Neutro",
        "{謙譲語|けんじょうご}",
        "Exemplo"
      ],
      "rows": [
        [
          "する",
          "いたす",
          "{私|わたし}が いたします。"
        ],
        [
          "{行|い}く / {来|く}る",
          "まいる",
          "{明日|あした} まいります。"
        ],
        [
          "{行|い}く (visitar) / {聞|き}く (perguntar)",
          "{伺|うかが}う",
          "{先生|せんせい}の {家|いえ}に {伺|うかが}います。"
        ],
        [
          "いる",
          "おる",
          "{会社|かいしゃ}に おります。"
        ],
        [
          "{言|い}う",
          "{申|もう}す",
          "{山田|やまだ}と {申|もう}します。"
        ],
        [
          "{食|た}べる / {飲|の}む / もらう",
          "いただく",
          "いただきます。"
        ],
        [
          "{見|み}る",
          "{拝見|はいけん}する",
          "{拝見|はいけん}しました。"
        ],
        [
          "{会|あ}う",
          "お{目|め}に かかる",
          "お{目|め}に かかれて うれしいです。"
        ],
        [
          "あげる",
          "さしあげる",
          "{先生|せんせい}に {手紙|てがみ}を さしあげました。"
        ],
        [
          "{知|し}る",
          "{存|ぞん}じる",
          "{存|ぞん}じて おります。"
        ]
      ]
    }
  ],
  "ex": [
    [
      "{明日|あした}、{御社|おんしゃ}へ **{伺|うかが}います**。",
      "",
      "Amanhã vou visitar a sua empresa.",
      ""
    ],
    [
      "{私|わたし}は {山田|やまだ}と **{申|もう}します**。",
      "",
      "Meu nome é Yamada.",
      "自己紹介."
    ],
    [
      "{資料|しりょう}を **{拝見|はいけん}しました**。",
      "",
      "Examinei o material.",
      ""
    ],
    [
      "{荷物|にもつ}を **お{持|も}ちします**。",
      "",
      "Eu levo a sua bagagem.",
      ""
    ],
    [
      "{後|のち}ほど、{私|わたし}から ご{連絡|れんらく}**いたします**。",
      "",
      "Mais tarde eu mesmo entrarei em contato.",
      ""
    ],
    [
      "{今|いま}、{駅|えき}に **おります**。",
      "",
      "Estou agora na estação.",
      "おります = いる."
    ]
  ],
  "care": [
    "Abaixa-se **quem fala** (e o seu lado), **nunca o outro**: ✗ {先生|せんせい}が {申|もう}しました. Para o outro, use **おっしゃいました**.",
    "**おる, まいる, いたす, {申|もう}す** são **humildes**; não use para a pessoa a quem você dá respeito.",
    "A direção do favor muda a forma: **いただく** (eu recebo) x **くださる** ({先生|せんせい}me dá).",
    "**さしあげる** (e ～て さしあげる) pode soar **condescendente**: hoje se prefere **お{渡|わた}しする / お{届|とど}けする / お～する**.",
    "Com gente de fora, não use **さん** para o seu lado: ✗ {社長|しゃちょう}の {田中|たなか}さんは まいります; diga {社長|しゃちょう}の {田中|たなか}は まいります."
  ],
  "practice": []
}
] }
];
