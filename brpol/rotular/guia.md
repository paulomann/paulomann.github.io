# Guia do codificador (rotulagem humana, primeira onda)

> Versão 2, 27/09/2026, revista em 28/09 antes da calibração (incivilidade fiel a Coe et al., 2014; função
> "informação"; outros pelo nome ou pelo cargo). A versão 1, de 26/09, fica no histórico do git. Vale para quem codifica e para o modelo: o
> prompt `config/prompts/professor_v2.md` usa as mesmas categorias e definições, e os códigos estão em
> `config/codebook_v2.json`. O que mudou e por quê está no docs/17. Depois da calibração, mudanças só por emenda datada
> no fim deste guia. Os exemplos são inventados: nenhum post real aparece aqui.

## Como funciona

- **O que você recebe:** um arquivo cifrado com 500 posts de candidatos e partidos no Instagram (campanha de 2026), a
  senha dele e um código pessoal. Abra a página de rotulagem, escolha o arquivo, digite a senha e o seu código. O
  arquivo é aberto no seu navegador e nunca sai dele; para a planilha vão só o número do post e os seus códigos.
- **Calibração:** primeiro, todos codificam os mesmos 20 posts. Depois de salvar cada um, a página mostra a resposta do
  gabarito (feito pela coordenação) ao lado da sua, com as diferenças marcadas e, às vezes, uma nota. A sua resposta
  fica gravada como está: não dá para corrigi-la depois de ver o gabarito. Use as diferenças para reler as seções do
  guia; é o seu treino.
- **Sorteio:** depois da calibração, a página entrega um post por vez, sorteado entre os que ainda não foram
  codificados. Em geral cada post é codificado por uma pessoa só; alguns, sorteados, recebem uma segunda codificação
  independente, para medir a concordância. Você nunca recebe o mesmo post duas vezes. Codifique quantos puder: cada post
  conta.
- **Adjudicação:** quando um post tem duas codificações que divergem, um adjudicador vê as duas e decide só os itens
  divergentes.
- **Tempo:** de 1 a 2 minutos por post. Faça pausas; a página guarda cada post assim que você salva.
- **Na tela:** o post fica parado ao lado (ou no topo, no celular) enquanto você rola as seções. Cada seção tem um
  botão **?** com a parte deste guia que explica ela; o botão **Guia**, no topo, põe cada trecho ao lado da sua seção.

## Regras gerais

1. **Codifique só o texto.** Você vê a legenda, o nome do autor, o cargo, o formato (vídeo, foto, carrossel) e a data,
   que é o mesmo que o modelo recebe. Não use o que você sabe sobre o autor para preencher o que o texto não diz.
2. **Na dúvida, fique com o mais conservador:** sentimento neutro, função informação, nenhum elemento marcado, alvo
   fora, tema nenhum, apelo religioso não.
   Marque a confiança baixa e explique no comentário.
3. **Hashtags, menções e emojis contam como texto do autor.** #ForaLula é um alvo com postura desfavorável; 🤡 ao lado
   do nome de alguém pode ser ataque à pessoa.
4. **Fala citada não é do autor.** Se o post reproduz um insulto para criticá-lo ("fui chamado de ladrão por quem
   responde a cinco processos"), o insulto citado não conta; conta o que o autor diz.
5. **Ironia conta pelo sentido.** "Que beleza de governo, hein" em tom de deboche é negativo e é ataque.

## 1. Codificável

- **Sim:** há texto em português com conteúdo que dá para interpretar.
- **Outra língua:** o texto está em outra língua (um trecho em inglês num post em português ainda é "sim").
- **Só emoji, hashtag ou menção:** não há frase, só emojis, hashtags soltas ou @menções.
- **Sem conteúdo interpretável:** o texto é curto demais para qualquer leitura ("📍", "Vem!", "Hoje").

Se não for "sim", o resto fica em branco: a página desliga os outros campos.

## 2. Sentimento

O tom predominante do texto, não a sua opinião sobre o autor.

- **Positivo:** celebração, gratidão, esperança, orgulho, convite animado, agradecimento a apoiadores.
- **Negativo:** denúncia, indignação, medo, lamento, crítica, ataque. Luto e condolências também.
- **Neutro:** agenda, horário de live, número de urna sem emoção, texto misto sem predominância.

## 3. Função

Uma ou mais. As três primeiras vêm da teoria funcional do discurso de campanha (Benoit); as três últimas, dos estudos
de posts de candidatos em redes (Stromer-Galley et al., 2021).

- **Aclamação:** promove o autor, o partido ou aliados **com um argumento**: obras e realizações, qualidades,
  trajetória, propostas, apoios recebidos, liderança em pesquisa. Agradecer, informar agenda ou pedir voto sem dizer
  nada sobre o candidato **não** é aclamação.
- **Ataque:** critica um adversário, partido, governo ou grupo político: ações, propostas ou caráter.
- **Defesa:** responde a uma crítica ou acusação feita contra o autor ou seus aliados.
- **Chamada à ação:** dá uma instrução ao leitor: votar (inclusive só "vote 1234"), ir a um ato, carreata ou reunião,
  assistir a uma live, compartilhar, seguir, comentar, doar, participar. "Vem com a gente!" conta.
- **Cerimonial:** agradece, homenageia, felicita, lembra data comemorativa, presta condolências, abençoa ou brinca, sem
  argumento sobre o candidato.
- **Informação:** só informa, sem argumento sobre o candidato e sem instrução ao leitor: agenda ("hoje, 9h, reunião em
  Itabuna"), horário de live, local, serviço, aviso. Vale sozinha: marcar outra função a desmarca, e vice-versa.

Todo post codificável tem ao menos uma função; se nenhuma das cinco primeiras se aplica, é informação. Um post pode
ter várias: "Vote 1234, o deputado que trouxe a UBS do bairro" é aclamação e chamada à ação; "enquanto eles prometiam,
nós entregamos 40 escolas" é aclamação e ataque.

## 4. Foco

Só aparece quando você marca aclamação, ataque ou defesa. Marque um ou os dois:

- **Imagem:** o argumento é sobre a pessoa: caráter, valores, competência em geral, trajetória, família, popularidade,
  apoios, desempenho em pesquisa.
- **Proposta:** o argumento é sobre política pública: uma proposta, uma obra, uma lei, uma ação de governo, uma posição
  sobre um tema.

"Trouxe R$ 2 milhões para a saúde de Feira" é proposta. "Homem honesto, ficha limpa, de família" é imagem.

## 5. Incivilidade

Marque cada elemento que aparece no texto do autor. São os cinco de Coe, Kenski e Rains (2014), com as definições
deles:

- **Xingamento:** palavras depreciativas dirigidas a uma pessoa ou grupo: ladrão, vagabundo, canalha, idiota, genocida;
  "comunista" ou "fascista" usados como insulto; zombar da aparência, da inteligência, da família ou da saúde de
  alguém; apelido depreciativo.
- **Desqualificação:** palavras depreciativas dirigidas a uma ideia, proposta, política, lei ou comportamento:
  "proposta ridícula", "plano criminoso", "essa reforma é uma vergonha", "que palhaçada essa CPI".
- **Acusação de mentira:** afirma ou insinua que uma ideia, proposta ou fala é desonesta, feita para enganar
  ("mentiroso", "mais uma fake news do governo", "promessa para enganar o povo"). Discordar de um número não basta:
  tem de haver acusação de má-fé.
- **Vulgaridade:** palavrão ou linguagem chula, mesmo abreviada ou com asteriscos (p*rra, vtnc).
- **Pejorativo sobre a fala:** desqualifica o modo como alguém fala ou se comunica: "blá-blá-blá", "mimimi",
  "chororô", "gritaria", "lenga-lenga".

Crítica dura a políticas ou ações não é incivilidade: "o governo errou ao cortar verba da saúde" não marca nada. A
desqualificação pede uma palavra depreciativa ("ridícula", "criminosa", "uma vergonha"), não só discordância.

## 6. Intolerância

Um construto diferente da incivilidade (Rossini, 2022): um texto educado pode ser intolerante, e um grosseiro pode não
ser. Marque cada elemento que aparece:

- **Estereótipo depreciativo de grupo:** generaliza de forma depreciativa mulheres, negros, indígenas, nordestinos,
  pessoas LGBT, evangélicos, religiões de matriz africana, pobres, imigrantes, inclusive preconceito regional.
- **Negação de direitos:** defende retirar ou negar direitos de um grupo (votar, casar, se manifestar, cultuar, ser
  atendido pelo serviço público).
- **Ameaça:** ameaça ou incita violência contra pessoa ou grupo, inclusive velada ("vai ter troco", "sabemos onde você
  mora"), ou faz apologia de violência policial contra grupos.
- **Deslegitima adversário:** nega a adversários a condição de participantes legítimos da democracia: chamá-los de
  inimigos da pátria, pedir que sejam banidos, presos sem processo ou impedidos de concorrer, ou atacar a legitimidade
  da eleição ("se perdermos, é fraude").

## 7. Alvos e postura

Clique no nome de cada alvo desta lista citado ou claramente referido no texto e escolha a postura do autor. Os alvos
que você não marcar contam como não citados: a maioria dos posts cita nenhum ou um só.

- **Favorável:** elogia, apoia, pede voto. **Desfavorável:** critica, ataca, denuncia. **Neutra:** só menciona, informa
  ou agradece de modo protocolar.

| Alvo | Inclui |
|---|---|
| Lula e governo federal | Lula, "o presidente", o governo Lula, o PT como governo federal, ministros falando pelo governo |
| Flávio Bolsonaro | Flávio Bolsonaro (candidato); citar só ele não marca Jair |
| Jair Bolsonaro e bolsonarismo | Jair Bolsonaro, a família Bolsonaro, o bolsonarismo |
| Ronaldo Caiado, Romeu Zema, Pablo Marçal, Renan Santos, Augusto Cury | Os próprios |
| STF e seus ministros | O Supremo Tribunal Federal, Alexandre de Moraes ou outro ministro |
| Governo do estado do autor | O governo do estado ou o governador atual do estado do autor |

- Referência indireta conta quando não há dúvida ("o descondenado", "o ex-presidente inelegível"). Na dúvida, fique de
  fora.
- O próprio autor não é alvo: se Flávio Bolsonaro fala de si mesmo, não marque Flávio.

## 8. Outros políticos, partidos ou governos

Para **qualquer outro** político, partido ou governo citado (prefeitos, deputados, senadores, candidatos, "PT" e "PL"
como partidos, "a prefeitura de Salvador"), escreva como aparece no texto: o nome ou, se não houver nome, o cargo ("o
prefeito", "a vereadora", "o ministro da Saúde"). Escolha a postura do autor, uma por nome ou cargo. **Você não precisa saber se é aliado ou adversário do autor:** isso é calculado depois, com os
dados do TSE (partido e coligação de cada um). Quem já está na lista do §7 não entra aqui.

## 9. Tema principal

Escolha **um** tema: aquele de que o post principalmente trata. Os temas de política pública são os 21 grandes temas do
Comparative Agendas Project, na versão do manual brasileiro, usados em estudos de agenda no Brasil e em outros países.
Se o post fala de dois temas, escolha o que ocupa mais o texto.

| Tema | Inclui |
|---|---|
| 01 Macroeconomia | Inflação, juros, impostos, dívida, orçamento, custo de vida, crescimento |
| 02 Direitos civis, políticos, liberdades e minorias | Igualdade racial e de gênero, direitos LGBT, pessoas com deficiência, liberdade religiosa e de expressão, aborto, direitos políticos e voto |
| 03 Saúde | SUS, hospitais, postos, médicos, vacinas, remédios, saúde mental |
| 04 Agricultura, pecuária e pesca | Agronegócio, produtores rurais, safra, crédito rural, pesca |
| 05 Trabalho, emprego e previdência | Emprego, salário, escala 6x1, sindicatos, aplicativos, aposentadoria |
| 06 Educação | Escolas, creches, professores, universidades, ensino técnico |
| 07 Meio ambiente | Clima, desmatamento, queimadas, poluição, saneamento, água, lixo |
| 08 Energia | Conta de luz, petróleo, combustíveis, energia renovável |
| 09 Imigração e refugiados | Migrantes, refugiados, fronteiras |
| 10 Transportes | Estradas, asfalto, pontes, ônibus, metrô, mobilidade |
| 12 Judiciário, justiça, crimes e violência | Segurança pública, polícia, facções, armas, presídios, drogas como crime, violência contra a mulher, tribunais |
| 13 Políticas sociais | Bolsa Família, assistência social, fome, programas para crianças, famílias e idosos |
| 14 Habitação, infraestrutura e reforma agrária | Moradia, obras urbanas, urbanização, reforma agrária |
| 15 Sistema bancário e comércio interno | Empreendedorismo, pequenas empresas, comércio, crédito, consumidor |
| 16 Defesa e forças armadas | Exército, Marinha, Aeronáutica, militares, guerra |
| 17 Ciência, tecnologia e comunicações | Internet, redes sociais, inteligência artificial, pesquisa científica |
| 18 Comércio exterior | Exportações, importações, tarifas, tarifaço |
| 19 Relações internacionais e política externa | Outros países, guerras, diplomacia |
| 20 Governo e administração pública | Corrupção no governo, gestão pública, relação entre os Poderes, regras eleitorais, anistia, 8 de janeiro, defesa da democracia |
| 21 Território e recursos naturais | Terras indígenas, demarcação, mineração, recursos hídricos |
| 23 Cultura, esporte e lazer | Música, festas populares, arte, esporte, turismo |

Sem tema de política pública:

- **Campanha:** a corrida eleitoral em si: pesquisas, apoios e alianças, agenda, comícios, carreatas, debates, pedido de
  voto sem tema.
- **Pessoal:** vida pessoal e trajetória do autor: família, fé pessoal, aniversário, bastidores, história de vida.
- **Nenhum:** nenhum dos anteriores (felicitação de data, texto sem assunto).

## 10. Apelo religioso ou moral

**Sim** se o texto invoca Deus, fé, igreja, oração, Bíblia ou valores morais e de família como razão ou identidade
("Deus acima de todos", "em defesa da família", "que Deus abençoe nosso estado", versículo bíblico); **não** se não.
Vale mesmo quando o tema principal é outro: religião e costumes atravessam vários temas nesta eleição.

## 11. Mídia, confiança e comentário (só para humanos)

- **Precisaria ver a imagem ou o vídeo para entender:** marque quando o texto remete a algo que só a mídia mostra
  ("olha o que ele disse 👇"). Codifique mesmo assim, só pelo texto.
- **Confiança:** alta, média ou baixa, sobre a sua codificação deste post como um todo.
- **Comentário:** livre. Use para dúvidas sobre o guia; elas alimentam as emendas.

## Exemplos inventados

1. *"Hoje entregamos a reforma da UBS do Jardim das Flores! Saúde de verdade se faz com trabalho. 💙 #Vote4455"*:
   positivo; aclamação e chamada à ação; foco proposta; tema 03 saúde; apelo religioso não.
2. *"Enquanto o governo federal aumenta imposto, a família paga a conta no mercado. Chega!"*: negativo; ataque; foco
   proposta; alvo Lula e governo federal, desfavorável; tema 01 macroeconomia; apelo religioso não ("família" aqui é
   quem paga a conta, não valor moral).
3. *"Esse vagabundo do prefeito sumiu com o dinheiro da merenda. Mentiroso!"*: negativo; ataque; foco proposta e imagem;
   incivilidade xingamento e acusação de mentira; outros: "prefeito", desfavorável; tema 20 governo (corrupção).
4. *"Me acusam de faltar às sessões. Estive em 98% delas, e a ata está no link da bio."*: neutro; defesa; foco imagem;
   sem alvos; tema campanha.
5. *"Nordestino que vota no PT é tudo analfabeto."*: negativo; ataque; foco imagem; intolerância estereótipo;
   incivilidade xingamento; outros: "PT", desfavorável; tema campanha.
6. *"Se o resultado não for o nosso, é fraude. Eles não podem voltar."*: negativo; ataque; foco imagem; intolerância
   deslegitima adversário; sem alvo nomeado; tema 20 governo (regras eleitorais).
7. *"Agenda de hoje: 9h carreata em Itabuna, 15h reunião com lideranças. Bora!"*: positivo; chamada à ação; tema
   campanha. Sem o "Bora!", seria neutro e informação.
8. *"Obrigado, Feira de Santana! Deus abençoe cada um de vocês 🙏"*: positivo; cerimonial; tema nenhum; apelo religioso
   sim.
9. *"Ao lado do prefeito Bruno Reis, que faz um trabalho incrível por Salvador!"*: positivo; aclamação; foco imagem;
   outros: "Bruno Reis", favorável; tema campanha.
10. *"🙏🙏🔥 #13 #Juntos"*: codificável só emoji, hashtag ou menção.
11. *"Essa reforma tributária é uma vergonha. Mais uma promessa para enganar o povo."*: negativo; ataque; foco
    proposta; incivilidade desqualificação e acusação de mentira; sem alvo nomeado; tema 01 macroeconomia.
12. *"Hoje, 19h, live no meu perfil com o professor Carlos."*: neutro; informação; outros: "professor Carlos", neutra;
    tema campanha.

## Atalhos de teclado

| Tecla | Ação |
|---|---|
| 1, 2, 3 | Sentimento negativo, neutro, positivo |
| A, T, D | Liga e desliga aclamação, ataque, defesa |
| C, H, F | Liga e desliga chamada à ação, cerimonial (homenagem), informação |
| I, P | Liga e desliga foco em imagem, em proposta |
| R, N | Apelo religioso ou moral: sim, não |
| 7, 8, 9 | Confiança baixa, média, alta |
| M | Precisaria ver a mídia |
| Enter | Salvar e ir para o próximo (no campo de nomes, Enter acrescenta o nome; no comentário, não salva) |
| G | Mostrar ou esconder o guia ao lado das seções |
| Esc | Fechar a janelinha de ajuda (?) |

## Emendas

Nenhuma ainda. Cada emenda tem data, o item que muda e o motivo, e vale a partir da data para humanos e para o modelo.
