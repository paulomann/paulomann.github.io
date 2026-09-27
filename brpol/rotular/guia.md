# Guia do codificador (rotulagem humana, primeira onda)

> Versão 1, 26/09/2026. Vale para quem codifica e para o modelo: o prompt `config/prompts/professor_v1.md` usa as
> mesmas categorias e definições, e os códigos estão em `config/codebook_v1.json`. Depois da calibração, mudanças só por
> emenda datada no fim deste guia. Os exemplos são inventados: nenhum post real aparece aqui.

## Como funciona

- **O que você recebe:** um arquivo cifrado com 500 posts de candidatos e partidos no Instagram (campanha de 2026), a
  senha dele e um código pessoal. Abra a página de rotulagem, escolha o arquivo, digite a senha e o seu código. O
  arquivo é aberto no seu navegador e nunca sai dele; para a planilha vão só o número do post e os seus códigos.
- **Calibração:** primeiro, todos codificam os mesmos 20 posts. Depois há uma reunião sobre as divergências, e este guia
  ganha as emendas que saírem dela. Só então começa o sorteio.
- **Sorteio:** a página entrega um post por vez. Cada post é codificado por duas pessoas, sem que uma veja a resposta da
  outra. Quem trabalha mais rápido faz mais posts. Você nunca recebe o mesmo post duas vezes.
- **Adjudicação:** quando as duas codificações divergem, um terceiro codificador vê as duas e decide só os itens
  divergentes.
- **Tempo:** de 1 a 2 minutos por post. Faça pausas; a página guarda cada post assim que você salva.
- **Na tela:** o post fica parado ao lado (ou no topo, no celular) enquanto você rola as seções. Cada seção tem um
  botão **?** com a parte deste guia que explica ela; o botão **Guia**, no topo, põe cada trecho ao lado da sua seção.

## Regras gerais

1. **Codifique só o texto.** Você vê a legenda, o nome do autor, o cargo, o formato (vídeo, foto, carrossel) e a data,
   que é o mesmo que o modelo recebe. Não use o que você sabe sobre o autor para preencher o que o texto não diz.
2. **Na dúvida, fique com o mais conservador:** sentimento neutro, nenhuma função, nenhum elemento marcado, alvo fora.
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

Uma, mais de uma ou nenhuma (teoria funcional do discurso de campanha, Benoit):

- **Aclamação:** exalta o próprio candidato, partido ou aliados: obras, propostas, trajetória, apoios.
- **Ataque:** critica um adversário, partido, governo ou grupo político: ações, propostas ou caráter.
- **Defesa:** responde a uma crítica ou acusação feita contra o autor ou seus aliados.

Agenda pura, pedido de voto sem conteúdo ("vote 1234"), felicitação de data comemorativa e post de serviço ficam sem
função. Um post pode aclamar e atacar ao mesmo tempo ("enquanto eles prometiam, nós entregamos 40 escolas").

## 4. Incivilidade

Marque cada elemento que aparece no texto do autor (Coe, Kenski e Rains, 2014):

- **Xingamento:** ofensa direta a uma pessoa ou grupo: ladrão, vagabundo, canalha, idiota, genocida, e "comunista" ou
  "fascista" usados como insulto.
- **Vulgaridade:** palavrão ou linguagem chula, mesmo abreviada ou com asteriscos (p*rra, vtnc).
- **Ataque à pessoa:** ataca a pessoa em vez da ideia ou da ação: aparência, inteligência, família, vida privada,
  saúde, inclusive por apelido depreciativo.
- **Acusação de mentira:** acusa alguém de mentir ou de enganar de propósito ("mentiroso", "mais uma fake news do
  governo"). Discordar de um número não basta: tem de haver acusação de má-fé.
- **Termo pejorativo para a fala:** desqualifica a fala ou a ideia de alguém com termo pejorativo ("discurso de
  lunático", "papo de doido", "blá-blá-blá", "mimimi").

Crítica dura a políticas ou ações não é incivilidade: "o governo errou ao cortar verba da saúde" não marca nada.

## 5. Intolerância

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

## 6. Alvos e postura

Clique no nome de cada alvo citado ou claramente referido no texto e escolha a postura do autor. Os alvos que você não
marcar contam como não citados: a maioria dos posts cita nenhum ou um só.

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
| Outro político, partido ou governo | Qualquer outro citado pelo nome (PT e PL como partidos, prefeitos, deputados). Vários outros: marque uma vez, com a postura dominante |

- Referência indireta conta quando não há dúvida ("o descondenado", "o ex-presidente inelegível"). Na dúvida, fique de
  fora.
- O próprio autor não é alvo: se Flávio Bolsonaro fala de si mesmo, não marque Flávio.

## 7. Temas

Só os temas que o post de fato discute; menção de passagem não conta. **Campanha, eleição, pedido de voto e política em
geral não são tema:** agenda, carreata ou agradecimento genérico ficam sem tema.

| Tema | Inclui |
|---|---|
| Religião | Fé, igrejas, cultos, liberdade religiosa |
| Família | Família, maternidade, infância |
| Costumes | Aborto, drogas, gênero, pauta moral |
| Segurança pública | Polícia, crime, facções, armas, sistema prisional |
| Economia e empreendedorismo | Inflação, juros, impostos, custo de vida, comércio, indústria |
| Trabalho e emprego | Emprego, salário, escala 6x1, sindicatos, aplicativos |
| Saúde | SUS, hospitais, médicos, vacinas, remédios |
| Educação | Escolas, professores, universidades, creches |
| Direitos, justiça e previdência | Aposentadoria, assistência social, pessoas com deficiência, mulheres, igualdade racial |
| Agronegócio | Agricultura, pecuária, produtores rurais, safra |
| Meio ambiente | Clima, desmatamento, queimadas, povos indígenas e suas terras |
| Infraestrutura e serviços urbanos | Obras, asfalto, estradas, pontes, transporte e mobilidade, saneamento, água, habitação, iluminação, energia |
| Cultura e esporte | Música, festas populares, arte, esporte, turismo |
| Política externa | Outros países, comércio exterior, guerras, tarifas |
| Corrupção e instituições | Corrupção, CPIs, STF como instituição, anistia, 8 de janeiro, defesa da democracia |

## 8. Mídia, confiança e comentário (só para humanos)

- **Precisaria ver a imagem ou o vídeo para entender:** marque quando o texto remete a algo que só a mídia mostra
  ("olha o que ele disse 👇"). Codifique mesmo assim, só pelo texto.
- **Confiança:** alta, média ou baixa, sobre a sua codificação deste post como um todo.
- **Comentário:** livre. Use para dúvidas sobre o guia; elas alimentam as emendas.

## Exemplos inventados

1. *"Hoje entregamos a reforma da UBS do Jardim das Flores! Saúde de verdade se faz com trabalho. 💙 #Vote4455"*:
   sentimento positivo; função aclamação; temas saúde; sem alvos nem incivilidade.
2. *"Enquanto o governo federal aumenta imposto, a família paga a conta no mercado. Chega!"*: negativo; ataque; alvo
   Lula e governo federal, desfavorável; temas economia (família aqui é passagem, não tema).
3. *"Esse vagabundo do prefeito sumiu com o dinheiro da merenda. Mentiroso!"*: negativo; ataque; incivilidade
   xingamento e acusação de mentira; alvo outro político, desfavorável; temas educação e corrupção.
4. *"Me acusam de faltar às sessões. Estive em 98% delas, e a ata está no link da bio."*: neutro (informa, sem
   indignação); função defesa; sem alvos (quem acusa não é nomeado).
5. *"Nordestino que vota no PT é tudo analfabeto."*: negativo; ataque; intolerância estereótipo; incivilidade
   xingamento; alvo outro político, partido ou governo (o PT como partido), desfavorável.
6. *"Se o resultado não for o nosso, é fraude. Eles não podem voltar."*: negativo; ataque; intolerância deslegitima
   adversário; sem alvo nomeado.
7. *"Agenda de hoje: 9h carreata em Itabuna, 15h reunião com lideranças. Bora!"*: positivo; sem função; sem temas.
8. *"🙏🙏🔥 #13 #Juntos"*: codificável só emoji, hashtag ou menção.

## Atalhos de teclado

| Tecla | Ação |
|---|---|
| 1, 2, 3 | Sentimento negativo, neutro, positivo |
| A, T, D | Liga e desliga aclamação, ataque, defesa |
| 7, 8, 9 | Confiança baixa, média, alta |
| M | Precisaria ver a mídia |
| Enter | Salvar e ir para o próximo (fora do campo de comentário) |
| G | Mostrar ou esconder o guia ao lado das seções |
| Esc | Fechar a janelinha de ajuda (?) |

## Emendas

Nenhuma ainda. Cada emenda tem data, o item que muda e o motivo, e vale a partir da data para humanos e para o modelo.
