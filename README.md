# Ayumi 歩み

Japonês passo a passo (歩み, *ayumi*), para falantes de português: gramática em três níveis, vocabulário por categoria, quizzes, kanji, leitura e mini games.
HTML + CSS + JavaScript puro, sem build. Funciona direto no GitHub Pages.

Para testar localmente, basta abrir o `index.html` (página inicial, com cards que levam a cada atividade) no navegador. O quiz de vocabulário fica em `vocabulario.html`.

## App instalável (PWA) e uso offline
O site é um PWA: `manifest.json`, `sw.js` (service worker), `pwa.js` e os ícones em `icons/` (gerados por `python3 tools/gen-icons.py`; o símbolo é o 歩). Precisa de HTTPS (o GitHub Pages já tem) e de caminhos **relativos** (já são). No Chrome/Android aparece o botão "Instalar como app" na página inicial; no iPhone/iPad, Compartilhar → Adicionar à Tela de Início.
- O `sw.js` guarda os arquivos para funcionar offline e atualiza a cópia em segundo plano a cada visita (a atualização do site aparece na visita seguinte).
- **Ao adicionar ou remover arquivos do site**, atualize a lista `CORE` e aumente `VERSION` (`kd-v2`, `kd-v3`...) em `sw.js`.
- O progresso fica no localStorage do navegador. No iPhone, o app instalado na tela inicial tem armazenamento separado do Safari.
- O áudio usa a voz japonesa do próprio aparelho (`speechSynthesis`); `pwa.js` avisa uma vez se o aparelho não tiver voz japonesa.

## Página inicial e prévias dos jogos
O `index.html` é a página inicial (cards). As imagens de prévia dos mini games ficam em `img/` e são geradas por `python3 tools/gen-previews.py http://localhost:PORTA/ayumi/` (com o site servido; precisa de Playwright e Pillow). Ao criar uma página nova, adicione um card no `index.html` e o arquivo na lista `CORE` do `sw.js` (e aumente o `VERSION`).

## Adicionar palavras ou categorias
Edite `data/words.js`. Cada palavra é `[japonês, kana, romaji, português]`:

```js
{ id:"n5-adjetivos", group:"JLPT N5", name:"Adjetivos", words:[
  ["大きい","おおきい","ookii","grande"],
  ["小さい","ちいさい","chiisai","pequeno"],
  // ...mínimo de 4 palavras
]}
```
O menu agrupa por `group` automaticamente. O recorde de cada categoria fica salvo no navegador (localStorage).

## Frases de exemplo
Depois de cada resposta, o jogo mostra uma frase de `data/sentences.js` (japonês, leitura em kana, tradução e botão de áudio). Cada frase é `[japonês, kana, português, [palavras]]`, e a lista final aponta as palavras de `data/words.js` (no formato `"japonês|kana"`) que a frase ilustra. A mesma frase pode servir a várias palavras, e se uma palavra tiver mais de uma frase o jogo sorteia uma. Palavras sem frase simplesmente não mostram o bloco.

```js
["机の上に本があります。","つくえのうえにほんがあります。","Há um livro em cima da mesa.",["机|つくえ","上|うえ","本|ほん"]],
```

## Lote 8 de vocabulário (2026-11-20)

+59 palavras e +59 frases: corpo (8, categoria nova `corpo-extra`, fora de `corpo` porque o Karada Meguri confere toda palavra dessa categoria), frutos (8, em `frutas`), conversa do dia a dia (6, em `expressoes`), verbos básicos (6: ある, 居る, なる, くれる, やる, しまう; a categoria `verbos-curtos` deixou de existir, ver a reorganização abaixo) e duas categorias novas além da de corpo, `flores-arvores` (15) e `interjeicoes` (16: あの, えっと, さあ, ふーん…). Totais: 104 categorias, 2318 palavras, 2025 frases. O dicionário do Kotonoha cresce sozinho (ある passou a valer).

`data/conj.js` tem a lista `NO_CONJ`: verbos que ficam fora da prática de conjugação (ある, porque o negativo é ない; くれる, que não tem potencial nem passiva naturais). Para tirar outro verbo da prática, acrescente a chave "japonês|kana" a essa lista.

## Reorganização das categorias de vocabulário (2026-11-21)
Totais: 95 categorias, 2323 palavras, 2030 frases. Mudanças: `numeros` virou "Números" (JLPT N5, 25 palavras: 一 a 十, 零, 百, 千, 万, 半分 e a contagem nativa 一つ a 十 (とお), com 六つ a 十 novas) e `n5-contadores` virou "Contadores" (46); 円 foi para `dinheiro`. Fusões: `n4-restaurante` e `comidas-japonesas` em `comida`; `casa-partes` e `casa-japonesa` em `casa-moveis`; `escola-provas` em `escola`; `trabalho-carreira` em `escritorio`; `relacoes-sentimentos` em `emocoes`; `viagem-passeio` em `viagem` (grupo Cotidiano). `verbos-curtos` foi distribuída: ある, 居る, なる em `n5-verbos`; くれる, やる, しまう em `n4-verbos`; os outros 8 em `n3-verbos`. `corpo` não mudou. O progresso e os recordes antigos que usam ids removidos não foram migrados (a aplicação está em teste); `kana-drop.html` e `velocidade.html` guardam a categoria escolhida em chaves novas (`kd-kanadrop-cat2`, `kd-vel-scope2`), porque as antigas eram índices.

## Treino de conjugação
`conjugacao.html` pede uma forma de um verbo (ます, ません, ました, て, た, ない, たい, potencial, volitiva, ば, passiva). O motor em `data/conj.js` gera as respostas a partir do grupo do verbo (ichidan, godan, する, 来る), detectado pelo kana; os godan que parecem ichidan (帰る, 入る, 切る, 知る, 走る, 要る, 減る) ficam na lista `GODAN_RU`. Os verbos vêm das categorias cujo id contém `verbos`, mais algumas palavras listadas em `EXTRA` dentro da página. Dois modos: digitar (romaji vira kana ao vivo; também aceita kana e kanji) e escolher (as alternativas erradas são erros típicos de conjugação).

`data/conj-lista.js` guarda a seleção de verbos (categorias com "verbos" no id, mais seis verbos de outras categorias) e de adjetivos (categorias com "adjetivos" no id) que `conjugacao.html`, `conjugacao-adjetivos.html` e `kana-drop.html` compartilham. Para um verbo ou adjetivo novo entrar nas três páginas, basta pô-lo numa categoria com esse id (ou em `VERB_EXTRA`).

## Kana Drop com conjugações
Em `kana-drop.html`, a opção "Incluir conjugações de verbos e adjetivos" faz as formas conjugadas (2 a 6 peças) também formarem palavra; a lista de palavras mostra a forma e o significado do verbo ou adjetivo. É possível escolher quais formas entram. As formas conjugadas não gravam em "stats", porque uma mesma forma pode vir de mais de um verbo (かった = 買う ou 勝つ).

## Kotonoha (言の葉)
Jogo de palavras em `kotonoha.html`. Um tabuleiro de kana (fácil 5×5 e médio 6×6 com 8 vizinhos; difícil 6×6 com 4 vizinhos); o jogador liga casas vizinhas (arrastando ou tocando) para formar uma palavra da lista do Ayumi, as casas somem e as de cima caem. Pontos = casas² por palavra, +50 por limpar o quadro, dica −5, reembaralhar −10 (até 3 por partida) e reagrupar −3. O tamanho mínimo da palavra é configurável (2, 3 ou 4 kana; padrão 2).

- `data/kotonoha-engine.js` (global `KOTO`, também `module.exports` no node) é o motor, sem DOM: dicionário em trie a partir de `data/words.js` (leituras de 2 a 6 peças; きゃ, しょ etc. são uma peça só; っ e ー são peças próprias), busca de palavras, gravidade, gerador, reembaralhar e reagrupar.
- O gerador não sorteia kana: planeja uma sequência de remoções que limpa o quadro todo, depois põe palavras da lista nesses caminhos. Mesma semente + nível + mínimo = mesmo tabuleiro. "Limpar tudo" só é garantido seguindo as palavras planejadas (listadas na tela de resultado, em "Palavras escondidas"); outras escolhas podem deixar casas sem saída.
- Reembaralhar reagrupa as casas que sobraram num formato compacto (colunas contíguas, centralizadas, encostadas embaixo; nenhuma casa fica sem vizinha, nos modos 4 e 8) e troca as letras de lugar: primeiro tenta dividir as letras em palavras do dicionário e montar um tabuleiro que dá para limpar por inteiro (`.exact`), senão garante ao menos uma palavra possível; se as letras restantes não formam nenhuma palavra, a partida termina. Reagrupar (−3) só desliza as casas para esse formato, sem trocar letras, e fica ativo só quando há casa solta (`KOTO.isolated`); a página avisa "casas soltas" no status.
- Validador: `node valkotonoha.js [N]` (padrão 150 tabuleiros por nível e mínimo; confere que cada plano limpa o quadro, o determinismo e partidas aleatórias com reembaralhar e reagrupar, e formatos aleatórios sem casa solta, além do modo chuva: tabuleiros parciais limpáveis, chuvas com ids únicos, gravidade e palavra possível, e partidas longas até o quadro encher).
- localStorage: recordes `best:kotonoha-facil|medio|dificil`, `best:kotonoha-ochiba-facil|medio|dificil` (modo chuva) e `best:kotonoha-lista-facil|medio|dificil` (Clássico com a lista de palavras ligada) e preferências `kd-kotonoha-level`, `kd-kotonoha-min`, `kd-kotonoha-modo` (`classico`|`ochiba`), `kd-kotonoha-lista` (booleano), `kd-kotonoha-seed` (entram no backup e, os recordes, no "Zerar progresso"). Não grava em `stats` nem `miss`.
- Modo 落ち葉 (Ochiba): `generatePartial` gera o tabuleiro inicial parcial (~60% das casas) jogando os primeiros passos do plano de um tabuleiro de solução garantida, então o que sobra continua limpável. `rain(grid, dict, min, mode, rnd, nextId, pieces, looseMax)` faz cair `LEVELS[nível].rain` peças (4 no fácil, 6 nos outros) a cada minuto: 1 ou 2 palavras do dicionário (empilhadas numa coluna ou divididas em duas colunas vizinhas, com o caminho conferido) mais até `loose` peças soltas. Devolve `{grid, added, fits, nextId, words, guaranteed}`; `fits=false` quando não há casas livres para todas as peças (fim da partida: "o quadro encheu"). Na página: barra e relógio da próxima chuva, aviso quando as casas livres são menos ou iguais à chuva, pausa (esconde as letras; pausa sozinha com a aba oculta), quadro limpo = +50 e chuva imediata, e "sem palavras" não encerra. `kotonoha.html?chuva=5` encurta o intervalo para 5 s (só para testar).
- Lista das palavras para caçar: caixa "Mostrar as palavras para caçar" no menu (só no Clássico; no 落ち葉 fica desativada). Liga, para a partida inteira, o bloco `#huntbox` abaixo dos botões com as palavras do plano do tabuleiro (as que limpam o quadro todo, nesta ordem, de 5 a 13 palavras conforme o nível e o mínimo de kana), com ✓ nas achadas e esmaecidas ("não dá mais") as que perderam alguma casa para outra palavra (`huntIds` simula as quedas do plano e guarda os ids das casas de cada palavra). Tem recorde próprio (`best:kotonoha-lista-<nível>`, nome no `BEST` do progresso.html) e o fim da partida cita "com a lista de palavras". Ao reembaralhar, a lista é refeita com o novo plano (`reshuffle` devolve `.plan` quando há divisão exata) e as palavras já achadas ficam com ✓; sem plano novo, ou ao reagrupar, entram até 6 palavras possíveis agora (`huntFallback`, as mais longas primeiro). `S.hunt` é mantido em todo jogo Clássico, então a seção "Palavras escondidas" do fim também reflete o plano atual.
- Fim e saída da partida: dois `<dialog>` no próprio `kotonoha.html` (`#enddlg` no fim, `#quitdlg` no botão Sair), com `showModal()`. O de fim mostra título, pontos, recorde e o resumo, com os botões Novo tabuleiro (foco inicial), Repetir este tabuleiro e Menu; Esc fecha e deixa a seção `#result` por baixo (mesmos textos, listas de palavras e botões), com o foco no título. O de sair tem Continuar (foco inicial e resposta do Esc) e Terminar; no 落ち葉 a chuva fica pausada enquanto ele está aberto e volta se for Continuar. Sem `showModal` (navegador antigo), cai no `confirm()` e só na seção de resultado. O menu não rola mais para o lado no celular (rótulos com seletor quebram a linha).

## Karada Meguri (体めぐり)
Jogo das partes do corpo em `karada.html`: um desenho esquemático (SVG, boneco articulado sem gênero marcado) com 44 zonas, ligadas a palavras de `data/words.js` (categorias "Corpo humano" e "Órgãos e mais partes do corpo").
- Vistas: **Corpo** (de frente e de costas), **Rosto**, **Órgãos** (8 principais, em posições aproximadas) e **Tudo** (4 do corpo, 3 do rosto, 3 dos órgãos). A rodada tem até 10 partes (8 nos órgãos), em ordem de passeio: frente, costas, rosto, órgãos.
- Modos: **Escolher** (a parte pisca, 4 opções só em japonês, com furigana opcional; o significado e o 🔊 aparecem depois de responder), **Digitar** (aceita hiragana, katakana, romaji e o kanji; o romaji é convertido por `R2K` no próprio `karada.html`) e **Tocar na parte** (aparece a palavra e a pessoa toca no desenho; as zonas também funcionam pelo teclado, e há "Ver o significado", que tira o ponto).
- A câmera acompanha a pergunta: o corpo vira de costas, aproxima do rosto ou do tronco (zoom por `transform` da cena, `prefers-reduced-motion` troca por corte seco).
- `data/body.js` (global `BODY`, também `module.exports` no node) guarda o desenho: `ZONES` (`k` = chave "japonês|kana", `s` = cena `f|b|r|o`, `c` = cor, `d` = caminho SVG, `up` = a zona é parte de outra, `eo` = anel com furo) e `DECOR` (enfeites sem toque). Zonas desenhadas depois ficam por cima e recebem o toque primeiro; tocar numa parte vale como acerto para o todo (`up`), por exemplo 唇 conta para 口 e 顔. As alternativas do modo Escolher nunca incluem partes relacionadas à resposta (tudo → 顔 completa com palavras do corpo).
- Para incluir uma parte: a palavra precisa existir em `data/words.js` e ter frase em `data/sentences.js`; depois acrescente uma linha `z(...)` em `data/body.js` (as formas `E` elipse, `R` retângulo, `P` caminho absoluto; `sym: true` espelha) e rode `node valcorpo.js`. 汗, 骨, 喉 e 爪 ficam só no vocabulário (`EXCLUIDAS`).
- Validador: `node valcorpo.js` (zonas × `words.js` e `sentences.js`, leituras e significados sem repetição por vista, alternativas suficientes, cadeia `up`, tamanho mínimo das zonas, cobertura das categorias de corpo).
- localStorage: recordes `best:corpo-corpo|rosto|orgaos|tudo` (acertos na rodada) e preferências `kd-corpo-vista`, `kd-corpo-modo` (`escolher`|`digitar`|`tocar`) e `kd-corpo-furi`. O jogo não grava em `stats` nem `miss`.

## Kurashi Meguri (暮らしめぐり) e o motor de zonas
Jogo da casa e dos objetos do dia a dia em `kurashi.html`: desenhos esquemáticos (SVG) com 87 zonas ligadas a palavras de `data/words.js`, em 8 cenas.
- Cenas: **Casa** (corte de dois andares + jardim), **Sala**, **Quarto**, **Casa japonesa** (和室), **Cozinha**, **Mesa posta** (vista de cima, abre com zoom a partir da cozinha), **Banheiro e limpeza** e **Objetos** (mesa vista de cima). Sala, quarto, casa japonesa, cozinha e banheiro abrem com zoom a partir do trecho correspondente do corte da casa; Objetos só abre pelo menu.
- Vistas: **Casa** (17), **Móveis** (27: sala, quarto e casa japonesa), **Cozinha** (19, com a mesa posta), **Banheiro** (12), **Objetos** (12) e **Tudo** (2 da casa, 1 da sala, 1 do quarto, 1 da casa japonesa, 2 da cozinha, 2 do banheiro e 1 dos objetos). A rodada tem até 10 itens, em ordem de passeio.
- Modos, furigana, "Ver o significado (sem ponto)", teclado e acessibilidade iguais aos do Karada Meguri. Ao **digitar**, o mesmo lugar ou objeto com outro nome também vale (`ALIAS` em `data/casa.js`): リビング, キッチン, お風呂, ドア, ポスト, 湯船, 携帯電話, e 机 e テーブル valem um pelo outro. Nas alternativas do modo Escolher, as duas formas nunca aparecem juntas.
- **Motor compartilhado `data/zonas.js`** (global `Zonas`, também `module.exports` no node): formas (`E`, `R`, `P`, `G` polígono, `mir`), `builder()` (`z` zona clicável, `dec` enfeite), `R2K`/`matchWord`/`wordEl`, `validate(D, CATEGORIES, SENTENCES)` e `mount(raiz, {prefix, data, aria, text})`, que monta a interface inteira (menu, jogo, resultado). Estilo base em `data/zonas.css`. O `karada.html` **não usa** o motor: continua com a sua própria cópia do código, para não ser alterado. Um jogo novo precisa de uma página com `<main id="app">`, um arquivo de dados (como `data/casa.js`) e um `Zonas.mount(...)`.
- Dados (`data/casa.js`, global `CASA`): `ZONES` e `DECOR` (desenhados na ordem de criação: o que vem depois fica por cima e recebe o toque primeiro), `SCENES` (cena filha tem `parent` e `box` [x,y,w,h] com a proporção do quadro, o trecho da cena pai que é aproximado), `ORDER`, `VISTAS` (com `scenes` ou `quota` por cena), `VORDER`, `GROUP` (as alternativas vêm do mesmo grupo), `ALIAS`, `FRAME` (400x600) e `MAX`. `up` marca a zona como parte de outra (tocar na parte vale para o todo, por exemplo 引き出し conta para 箪笥 e 窓 para 寝室). Cores dos desenhos são classes `c-*` em `kurashi.html`.
- Para incluir um item: a palavra precisa existir em `data/words.js` e ter frase em `data/sentences.js`; depois acrescente uma linha `z(...)` em `data/casa.js` e rode `node valcasa.js`.
- Validador: `node valcasa.js` (zonas × `words.js` e `sentences.js`, leituras e significados sem repetição por grupo, alternativas suficientes, cadeia `up`, tamanho mínimo e quadro, árvore de cenas e `box`, vistas e cotas, aliases).
- localStorage: recordes `best:kurashi-casa|moveis|cozinha|banheiro|objetos|tudo` (acertos na rodada) e preferências `kd-kurashi-vista`, `kd-kurashi-modo` (`escolher`|`digitar`|`tocar`) e `kd-kurashi-furi`. Não grava em `stats` nem `miss`.
- A prévia do card é gerada por `tools/gen-previews.py ... kurashi`.

## 数を書こう (Kazu o kakou, jogo dos números)
`numeros.html` + `data/numeros-ja.js` (módulo compartilhado, global `NumerosJa` e `module.exports`) + `valnumeros.js`. Números de 0 a 99.999.
- Modos: **Escrever** (aparece o número em algarismos; digite em japonês: romaji vira hiragana ao vivo, como na conjugação, e kana e kanji também valem, inclusive misto como 3千5百), **Ler kanji** (digite os algarismos) e **Ouvir** (AyumiTTS; o modo some se o navegador não fala). Faixas: 0 a 10, 11 a 99, 100 a 999, 1000 a 9999, 10000 a 99999 e Tudo (2 de cada faixa). Rodada de 10 números sem repetir (nas faixas de 100 para cima, 2 são números redondos como 300, 8000 ou 10000, onde ficam as exceções).
- "Ver a leitura (sem ponto)" mostra a leitura e a pergunta não pontua. Ao errar, o jogo mostra o kanji, a leitura, a decomposição (三千 + 五百…) e UMA linha com a regra (300 é さんびゃく, 600 ろっぴゃく, 800 はっぴゃく, 3000 さんぜん, 8000 はっせん, 一万 com いち obrigatório, 100 sem いち…). Fim de rodada com "Para revisar" e 🔊.
- Leituras: canônica de `NumerosJa.reading(n)`; aceitas também ぜろ (0), し (4 e 14), しち (dígito 7 e 70), く (dígito 9 das unidades), いっせん (1000). Recusadas de propósito: いちひゃく, さんひゃく, ろくひゃく, さんせん, はちせん, まん sem número, しじゅう, くじゅう, にじゅうし.
- localStorage: recordes `best:numeros-<modo>-<faixa>` (modo `ja`|`num`|`ouvir`, faixa 1 a 6; acertos em 10) e preferências `kd-numeros-modo`, `kd-numeros-nivel` (1 a 6) e `kd-numeros-furi`. Não grava em `stats` nem `miss`.
- `node valnumeros.js` confere os 100.000 inteiros (ida e volta kanji ↔ inteiro, 60 casos difíceis, leituras proibidas, colisões entre números, respostas digitadas, regras e sorteio); `-t` imprime a tabela.


## 時計の練習 (Tokei no renshuu, jogo do relógio)
`relogio.html` + `data/relogio.js` (global `Relogio` e `module.exports`; usa `NumerosJa` para kanji, parse e a digitação romaji→hiragana) + `valrelogio.js`. Aparece um relógio e a pessoa escreve que horas são em japonês.
- Níveis: 1 em ponto (1 a 12 h, o 4, o 7 e o 9 sempre entram), 2 quartos e meia (:15, :30, :45), 3 de 5 em 5 minutos, 4 qualquer minuto (os 720 horários) e 5 com 午前/午後 e relógio digital de 24 h (de 5 em 5 minutos, 5 de manhã e 5 de tarde por rodada; sem as 12 h e as 0 h, que têm duas formas de ler). Rodada de 10 horários sem repetir.
- O relógio de ponteiros é um SVG desenhado por código (números 1 a 12 em algarismos arábicos, 60 marcas, ponteiro das horas curto e grosso que anda com os minutos; o `aria-label` não revela a hora). Os números ficam por cima dos ponteiros, com contorno da cor do fundo.
- Respostas aceitas: kana, romaji (minúsculas ou MAIÚSCULAS; ん antes de vogal ou y exige n'), kanji e algarismos com as unidades (三時十五分, 3時15分); 半 (はん) vale para :30 e 〜ちょうど para a hora cheia. Só os números (3:15) não valem e não gastam a pergunta. Nos níveis 1 a 4, 午前/午後 é recusado; no 5, é obrigatório. A forma de 24 h (十五時) é recusada por padrão no nível 5 (`accept24` em `Relogio.check` a aceita).
- Leituras: 時 よじ (4), しちじ (7), くじ (9); 分 いっぷん, にふん, さんぷん, よんぷん, ごふん, ろっぷん, ななふん (しちふん), はっぷん (はちふん), きゅうふん, じゅっぷん (じっぷん) e os compostos (じゅういっぷん…). Ao errar, mostra a leitura certa e UMA linha com a regra (4時 é よじ, 3分 é さんぷん…). "Ver as horas (sem ponto)" mostra o horário digital (níveis 1 a 4). Fim de rodada com "Para revisar" e 🔊 (AyumiTTS).
- localStorage: recordes `best:relogio-<nível>` (1 a 5; acertos em 10) e preferências `kd-relogio-nivel` (1 a 5) e `kd-relogio-furi` (leitura sobre o kanji nas respostas). Não grava em `stats` nem `miss`.
- `node valrelogio.js` confere as tabelas de horas e minutos, as leituras proibidas, a ida e volta (kana, kanji, 3時15分, romaji e MAIÚSCULAS) nos 720 horários e nos 264 do nível 5, os ângulos dos ponteiros e o sorteio. A prévia do card é gerada por `tools/gen-previews.py ... relogio`.
## Áudio
Usa a Web Speech API (`speechSynthesis`, `lang = ja-JP`). A voz vem do navegador/sistema; se não houver voz japonesa instalada, os botões de áudio ficam ocultos ou usam uma voz padrão.

### Vozes japonesas (`vozes.html`)
Página com o passo a passo para instalar uma voz japonesa no Android, iPhone/iPad, Windows e Mac, mais o botão "Testar a voz" (`AyumiTTS.hasJa()` e `AyumiTTS.speak`). Os passos foram conferidos nas páginas de ajuda do Google, da Apple e da Microsoft em 2026-11-20; o Linux ficou de fora por não ter sido confirmado. O texto e o link ficam em um só lugar, `tts.js`: `AyumiTTS.voiceHelp(el)` escreve "Nenhuma voz japonesa neste aparelho. Como instalar uma voz japonesa" (com o link `AyumiTTS.voiceHelpUrl`, relativo) e é usado pelo aviso único (`noVoiceNotice`, chave `kd-voice-note`, fora do backup) e pelo `onnovoice` de app.js, ditado, numeros, relogio, taxi e taxi-a. Há um link discreto no rodapé de `index.html` e de `progresso.html`.

## Backup do progresso

Em `progresso.html`, “Exportar progresso” baixa um `.json` (app, version, exportedAt, data) com `stats`, `miss`, `best:*` e todas as chaves `kd-*` (menos `kd-voice-note`). “Importar progresso” valida o arquivo, mostra um resumo e, ao confirmar, SUBSTITUI tudo o que está salvo no aparelho (não há mesclagem).
