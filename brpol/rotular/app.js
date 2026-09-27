/* BRPOL · Rotulagem (docs/13 §6). Sem dependências externas.
 *
 * O arquivo dos posts (data/rotulagem/posts_v1.bin, passo 11) é decifrado aqui, no navegador, e nunca é enviado.
 * O backend (apps_script.gs) só vê o código da pessoa, o número do post e os rótulos.
 * Categorias: codebook.js, gerado de config/codebook_v1.json. Guia: guia.md, cópia de docs/14-guia-codificacao.md.
 */
'use strict';

const CB = window.CODEBOOK;
const API = new URLSearchParams(location.search).get('api') || window.BRPOL_ROTULAR_API || '';
const MAGICO = new TextEncoder().encode('BRROT1');
const LS = { arquivo: 'brpol-rotular-arquivo', chave: 'brpol-rotular-chave', codigo: 'brpol-rotular-codigo' };
const LISTAS = ['funcao', 'incivilidade', 'intolerancia', 'temas'];
const TAREFAS = ['codificavel', 'sentimento', 'funcao', 'incivilidade', 'intolerancia', 'alvos', 'temas'];
const MAX_COMENTARIO = 300;
const ATALHOS = {  // tecla -> [tarefa, código]
  '1': ['sentimento', 'negativo'], '2': ['sentimento', 'neutro'], '3': ['sentimento', 'positivo'],
  a: ['funcao', 'aclamacao'], t: ['funcao', 'ataque'], d: ['funcao', 'defesa'],
  '7': ['confianca', '1'], '8': ['confianca', '2'], '9': ['confianca', '3'],
};
const TECLA = {};  // [tarefa|código] -> tecla, para mostrar nos botões
for (const [k, [t, c]] of Object.entries(ATALHOS)) TECLA[t + '|' + c] = k.toUpperCase();
TECLA['precisa_midia|1'] = 'M';
// seções do guia (docs/14, "## N. Título") -> seção do formulário
const SECAO_DO_NUMERO = { 1: 'codificavel', 2: 'sentimento', 3: 'funcao', 4: 'incivilidade', 5: 'intolerancia', 6: 'alvos',
                          7: 'temas', 8: 'extras' };
const SECAO_DO_TITULO = [[/^Como funciona/, 'como'], [/^Regras gerais/, 'regras'], [/^Exemplos/, 'exemplos'],
                         [/^Atalhos/, 'atalhos'], [/^Emendas/, 'emendas']];

const $ = s => document.querySelector(s);
const el = (tag, attrs = {}, ...filhos) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v !== false && v !== undefined && v !== null) e.setAttribute(k, v === true ? '' : v);
  }
  for (const f of filhos.flat()) if (f !== null && f !== undefined && f !== false) e.append(f);
  return e;
};
const ler = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const gravar = (k, v) => { try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) { /* sem armazenamento */ } };
const b64 = {
  de: buf => { let s = ''; const b = new Uint8Array(buf); for (let i = 0; i < b.length; i += 8192) s += String.fromCharCode(...b.subarray(i, i + 8192)); return btoa(s); },
  para: str => Uint8Array.from(atob(str), c => c.charCodeAt(0)),
};
const hex = bytes => [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
const rotuloDe = (tarefa, codigo) => {
  const d = CB.tarefas[tarefa];
  const o = d && d.opcoes.find(x => x[0] === codigo);
  return o ? o[1] : codigo;
};

// ------------------------------------------------------------------------------------------------ estado
const S = {
  posts: null,        // Map número -> post
  eu: null,           // {codigo, nome, papel}
  fase: null,
  modo: 'codificar',  // ou 'adjudicar'
  atual: null,        // {numero, fase, codificacoes?, divergentes?, inicio}
  r: null,            // respostas do post atual
  anterior: null,     // {numero, fase, r} do último salvo, para corrigir
  corrigindo: false,
  enviando: false,
  guia: {},           // seção -> {titulo, md}
};

function vazio() {
  return { codificavel: 'sim', sentimento: null, funcao: new Set(), incivilidade: new Set(), intolerancia: new Set(),
           alvos: new Map(), temas: new Set(), precisa_midia: false, confianca: null, comentario: '' };
}
function copiar(r) {
  return { ...r, funcao: new Set(r.funcao), incivilidade: new Set(r.incivilidade), intolerancia: new Set(r.intolerancia),
           alvos: new Map(r.alvos), temas: new Set(r.temas) };
}

/** Respostas -> formato da planilha: listas "a|b" na ordem do codebook; alvos "alvo:postura". */
function serializar(r) {
  const nao = r.codificavel !== 'sim';
  const lista = t => nao ? '' : CB.tarefas[t].opcoes.map(o => o[0]).filter(c => r[t].has(c)).join('|');
  const saida = { codificavel: r.codificavel, sentimento: nao ? 'neutro' : (r.sentimento || '') };
  for (const t of LISTAS) saida[t] = lista(t);
  saida.alvos = nao ? '' : CB.tarefas.alvos.opcoes.map(o => o[0]).filter(c => r.alvos.has(c)).map(c => c + ':' + r.alvos.get(c)).join('|');
  return saida;
}
function desserializar(s) {
  const r = vazio();
  r.codificavel = s.codificavel || 'sim';
  r.sentimento = s.sentimento || null;
  for (const t of LISTAS) r[t] = new Set(String(s[t] || '').split('|').filter(Boolean));
  r.alvos = new Map(String(s.alvos || '').split('|').filter(Boolean).map(x => x.split(':')));
  return r;
}

// ------------------------------------------------------------------------------------------------ cifra
function lerBlob(buf) {
  buf = new Uint8Array(buf);
  if (buf.length < 40 || MAGICO.some((b, i) => buf[i] !== b)) throw new Error('este não é o arquivo dos posts (posts_v1.bin)');
  return { iter: new DataView(buf.buffer).getUint32(6), sal: buf.slice(10, 26), iv: buf.slice(26, 38), cifra: buf.slice(38) };
}
async function derivar(senha, blob) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(senha.normalize('NFC')), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: blob.sal, iterations: blob.iter, hash: 'SHA-256' },
    base, { name: 'AES-GCM', length: 256 }, true, ['decrypt']);
}
async function decifrar(blob, chave) {
  const plano = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: blob.iv, additionalData: MAGICO }, chave, blob.cifra);
  const fluxo = new Blob([plano]).stream().pipeThrough(new DecompressionStream('gzip'));
  return JSON.parse(await new Response(fluxo).text());
}

// ------------------------------------------------------------------------------------------------ backend
async function api(acao, dados = {}) {
  if (!API) throw new Error('a página ainda não tem o endereço do backend (config.js)');
  let r;
  try {
    r = await fetch(API, { method: 'POST', body: JSON.stringify({ acao, codigo: S.eu ? S.eu.codigo : dados.codigo, ...dados }),
                           headers: { 'Content-Type': 'text/plain;charset=utf-8' }, redirect: 'follow' });
  } catch (e) {
    throw new Error('sem conexão com a planilha; tente de novo');
  }
  const j = await r.json().catch(() => ({ ok: false, erro: 'resposta inválida do backend' }));
  if (!j.ok) throw new Error(j.erro || 'erro no backend');
  return j;
}

// ------------------------------------------------------------------------------------------------ entrada
async function iniciar() {
  aplicarGuia();
  const guardado = ler(LS.arquivo);
  if (guardado) mostrarGuardado(true);
  const cod = ler(LS.codigo);
  if (cod) $('#codigo').value = cod;
  $('#trocar-arquivo').addEventListener('click', () => { gravar(LS.arquivo, null); gravar(LS.chave, null); mostrarGuardado(false); });
  $('#form-entrada').addEventListener('submit', entrar);
  const q = new URLSearchParams(location.search);
  if (q.get('arquivo') && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) {  // teste local: arquivo servido pelo servidor de teste
    const r = await fetch(q.get('arquivo'));
    if (r.ok) { S.bytes = new Uint8Array(await r.arrayBuffer()); mostrarGuardado(true, 'Arquivo de teste carregado.'); }
  }
  // chave lembrada: entra sem senha
  if (guardado && ler(LS.chave) && cod) {
    try {
      const { k, sal } = JSON.parse(ler(LS.chave));
      const blob = lerBlob(b64.para(guardado));
      if (sal === hex(blob.sal)) {
        const chave = await crypto.subtle.importKey('raw', b64.para(k), 'AES-GCM', false, ['decrypt']);
        await abrir(await decifrar(blob, chave), cod);
        return;
      }
    } catch (e) { gravar(LS.chave, null); }
  }
  (cod ? $('#senha') : $('#codigo')).focus();
}

function mostrarGuardado(sim, texto) {
  $('#bloco-arquivo').hidden = sim;
  $('#arquivo-guardado').hidden = !sim;
  if (texto) $('#arquivo-guardado-texto').textContent = texto;
}

async function entrar(ev) {
  ev.preventDefault();
  const erro = $('#erro-entrada'), botao = $('#entrar');
  erro.textContent = '';
  const codigo = $('#codigo').value.trim(), senha = $('#senha').value;
  if (!codigo) { erro.textContent = 'Digite o seu código.'; return; }
  botao.disabled = true; botao.textContent = 'Abrindo…';
  try {
    let bytes = S.bytes;
    const arq = $('#arquivo').files[0];
    if (arq) bytes = new Uint8Array(await arq.arrayBuffer());
    if (!bytes && ler(LS.arquivo)) bytes = b64.para(ler(LS.arquivo));
    if (!bytes) throw new Error('Escolha o arquivo dos posts.');
    const blob = lerBlob(bytes);
    let dados;
    try { dados = await decifrar(blob, await derivar(senha, blob)); } catch (e) {
      if (e instanceof DOMException) throw new Error('Senha errada para este arquivo.');
      throw e;
    }
    if ($('#lembrar').checked) {
      gravar(LS.arquivo, b64.de(bytes));
      const chave = await derivar(senha, blob);
      gravar(LS.chave, JSON.stringify({ k: b64.de(await crypto.subtle.exportKey('raw', chave)), sal: hex(blob.sal) }));
    }
    await abrir(dados, codigo);
  } catch (e) {
    erro.textContent = e.message;
  } finally {
    botao.disabled = false; botao.textContent = 'Entrar';
  }
}

async function abrir(dados, codigo) {
  S.posts = new Map(dados.posts.map(p => [p.n, p]));
  const eu = await api('entrar', { codigo });
  S.eu = { codigo, nome: eu.nome, papel: eu.papel };
  S.fase = eu.fase;
  gravar(LS.codigo, codigo);
  $('#entrada').hidden = true;
  $('#app').hidden = false;
  $('#botao-adjudicar').hidden = S.eu.papel !== 'adjudicador';
  montarFormulario();
  ligarTeclado();
  $('#botao-guia').addEventListener('click', () => alternarGuia());  // escolha gravada
  $('#popover-fechar').addEventListener('click', fecharAjuda);
  $('#botao-sair').addEventListener('click', sair);
  $('#botao-adjudicar').addEventListener('click', () => trocarModo('adjudicar'));
  $('#botao-codificar').addEventListener('click', () => trocarModo('codificar'));
  $('#corrigir').addEventListener('click', corrigirAnterior);
  $('#rotulos').addEventListener('submit', ev => { ev.preventDefault(); salvar(); });
  alternarGuia(ler('brpol-rotular-guia') === '1', false);
  await proximo();
}

function sair() {
  gravar(LS.chave, null);
  location.reload();
}

function trocarModo(modo) {
  S.modo = modo;
  $('#botao-adjudicar').hidden = modo === 'adjudicar' || S.eu.papel !== 'adjudicador';
  $('#botao-codificar').hidden = modo === 'codificar';
  S.anterior = null;
  proximo();
}

// ------------------------------------------------------------------------------------------------ fluxo
async function proximo() {
  S.corrigindo = false;
  $('#aviso').hidden = true;
  try {
    const p = await api('proximo', { modo: S.modo });
    atualizarProgresso();
    if (p.fim) return mostrarFim(p.fim);
    const post = S.posts.get(p.numero);
    if (!post) throw new Error(`o post ${p.numero} não está no seu arquivo: confira se é o arquivo mais recente`);
    S.atual = { numero: p.numero, fase: p.fase, codificacoes: p.codificacoes, divergentes: p.divergentes || [], inicio: Date.now() };
    S.r = vazio();
    if (p.fase === 'adjudicacao') preencherConcordancias(p);
    mostrarPost(post);
  } catch (e) {
    mostrarFim('erro', e.message);
  }
}

function mostrarFim(motivo, detalhe) {
  $('#post').hidden = true; $('#rotulos').hidden = true; $('#comparacao').hidden = true;
  const textos = {
    calibracao_completa: ['Calibração concluída', 'Você codificou todos os posts de calibração. O sorteio começa depois da reunião sobre as divergências.'],
    sem_posts: ['Não há mais posts para você agora', 'Todos os posts já têm duas codificações ou estão com outra pessoa. Volte mais tarde: reservas vencidas voltam ao sorteio.'],
    sem_divergencias: ['Nada para adjudicar agora', 'Não há pares divergentes esperando. Volte quando mais pares estiverem completos.'],
    erro: ['Algo deu errado', detalhe || ''],
  };
  const [t, d] = textos[motivo] || ['Fim', ''];
  const fim = $('#fim');
  fim.hidden = false;
  fim.replaceChildren(el('strong', {}, t), el('span', {}, d), el('div', { style: 'margin-top:14px' },
    el('button', { class: 'secundario', type: 'button', onclick: proximo }, 'Tentar de novo')));
  $('#corrigir').hidden = true;
}

function mostrarPost(post) {
  $('#fim').hidden = true; $('#post').hidden = false; $('#rotulos').hidden = false;
  const faseTexto = { calibracao: 'Calibração', sorteio: 'Codificação', adjudicacao: 'Adjudicação' }[S.atual.fase];
  $('#selo-fase').textContent = faseTexto;
  $('#post-meta').replaceChildren(
    el('strong', {}, post.autor || '—'), el('span', {}, post.cargo), el('span', {}, post.formato), el('span', {}, post.data),
    el('span', { class: 'numero num' }, `nº ${post.n}`));
  $('#post-texto').textContent = post.texto;
  $('#post-texto').scrollTop = 0;
  mostrarComparacao();
  $('#comentario').value = S.r.comentario;
  desenhar();
  $('#corrigir').hidden = !S.anterior || S.corrigindo;
  window.scrollTo({ top: 0 });
}

function preencherConcordancias(p) {
  const cods = p.codificacoes.map(desserializar);
  const base = cods[0];
  for (const t of TAREFAS) {
    if (p.divergentes.includes(t)) continue;
    if (t === 'codificavel' || t === 'sentimento') S.r[t] = base[t];
    else if (t === 'alvos') S.r.alvos = new Map(base.alvos);
    else S.r[t] = new Set(base[t]);
  }
  if (p.divergentes.includes('codificavel')) S.r.codificavel = null;
  if (p.divergentes.includes('sentimento')) S.r.sentimento = null;
}

function mostrarComparacao() {
  const a = S.atual, caixa = $('#comparacao');
  caixa.hidden = a.fase !== 'adjudicacao';
  if (caixa.hidden) return;
  const cods = a.codificacoes.map(desserializar);
  const texto = (r, t) => {
    if (t === 'codificavel' || t === 'sentimento') return r[t] ? rotuloDe(t, r[t]) : '—';
    if (t === 'alvos') {
      const postura = c => (CB.tarefas.alvos.posturas.find(x => x[0] === c) || [c, c])[1].toLowerCase();
      return [...r.alvos].map(([k, v]) => `${rotuloDe('alvos', k)}: ${postura(v)}`).join('; ') || '—';
    }
    return [...r[t]].map(c => rotuloDe(t, c)).join(', ') || '—';
  };
  const tabela = el('table', {}, el('thead', {}, el('tr', {}, el('th', {}, ''), cods.map((_, i) => el('th', {}, `Codificação ${i + 1}`)))),
    el('tbody', {}, TAREFAS.map(t =>
    el('tr', { class: a.divergentes.includes(t) ? 'diverge' : '' }, el('th', {}, CB.tarefas[t].rotulo),
      cods.map(r => el('td', {}, texto(r, t)))))));
  $('#comparacao-tabela').replaceChildren(tabela);
}

async function salvar() {
  if (S.enviando || !S.atual) return;
  const erro = validar();
  $('#erro-form').textContent = erro || '';
  if (erro) return;
  S.enviando = true;
  const botao = $('#salvar');
  botao.disabled = true;
  try {
    const seg = Math.round((Date.now() - S.atual.inicio) / 1000);
    await api('salvar', { numero: S.atual.numero, fase: S.atual.fase, rotulos: serializar(S.r),
                          precisa_midia: S.r.precisa_midia, confianca: S.r.confianca || '',
                          comentario: $('#comentario').value.slice(0, MAX_COMENTARIO), segundos: seg });
    S.anterior = { numero: S.atual.numero, fase: S.atual.fase, r: copiar({ ...S.r, comentario: $('#comentario').value }),
                   codificacoes: S.atual.codificacoes, divergentes: S.atual.divergentes, segundos: seg };
    await proximo();
  } catch (e) {
    $('#erro-form').textContent = e.message;
  } finally {
    S.enviando = false; botao.disabled = false;
  }
}

function corrigirAnterior() {
  const a = S.anterior;
  if (!a) return;
  S.corrigindo = true;
  // o tempo da correção soma ao da primeira vez
  S.atual = { numero: a.numero, fase: a.fase, codificacoes: a.codificacoes, divergentes: a.divergentes || [],
              inicio: Date.now() - a.segundos * 1000 };
  S.r = copiar(a.r);
  mostrarPost(S.posts.get(a.numero));
  const aviso = $('#aviso');
  aviso.hidden = false;
  aviso.textContent = 'Corrigindo o post anterior. Ao salvar, a resposta nova substitui a antiga e você volta ao post em que estava.';
}

function validar() {
  const r = S.r;
  document.querySelectorAll('.grupo.invalido').forEach(g => g.classList.remove('invalido'));
  const marcar = t => { const g = document.querySelector(`.grupo[data-tarefa="${t}"]`); if (g) g.classList.add('invalido'); };
  if (!r.codificavel) { marcar('codificavel'); return 'Diga se o post é codificável.'; }
  if (r.codificavel === 'sim' && !r.sentimento) { marcar('sentimento'); return 'Falta o sentimento (teclas 1, 2 e 3).'; }
  const semPostura = [...r.alvos].filter(([, p]) => !p).map(([a]) => rotuloDe('alvos', a));
  if (r.codificavel === 'sim' && semPostura.length) { marcar('alvos'); return `Escolha a postura: ${semPostura.join(', ')}.`; }
  if (S.atual.fase !== 'adjudicacao' && !r.confianca) { $('#extras').classList.add('invalido'); return 'Falta a confiança (teclas 7, 8 e 9).'; }
  return '';
}

async function atualizarProgresso() {
  try {
    const p = await api('progresso');
    S.fase = p.fase;
    const partes = [];
    if (p.fase === 'calibracao') partes.push(`Calibração: você fez ${p.calibracao.meus} de ${p.calibracao.total}`);
    else partes.push(`Você: ${p.sorteio.meus} posts`, `Equipe: ${p.sorteio.codificacoes} de ${p.sorteio.meta} codificações`);
    if (S.eu.papel === 'adjudicador') partes.push(`Pares completos: ${p.sorteio.pares} · divergentes: ${p.sorteio.divergentes} · adjudicados: ${p.adjudicados}`);
    $('#progresso').textContent = `${S.eu.nome} · ` + partes.join(' · ');
  } catch (e) { /* o progresso é só informativo */ }
}

// ------------------------------------------------------------------------------------------------ formulário
function botao(tarefa, codigo, rotulo, extra = {}) {
  const tecla = TECLA[tarefa + '|' + codigo];
  return el('button', { type: 'button', class: 'opcao', 'data-tarefa': tarefa, 'data-codigo': codigo, 'aria-pressed': 'false', ...extra,
                        onclick: () => marcar(tarefa, codigo) }, rotulo, tecla ? el('kbd', {}, tecla) : null);
}

/** Título da seção com o botão (?) que abre o trecho do guia. */
function titulo(secao, texto, dica) {
  return el('h3', {}, texto, dica ? el('span', { class: 'dica' }, dica) : null,
    el('button', { type: 'button', class: 'ajuda', 'aria-label': `Guia: ${texto}`, title: 'O que o guia diz sobre esta parte',
                   onclick: ev => abrirAjuda(secao, ev.currentTarget) }, '?'));
}

function montarFormulario() {
  const dicas = {
    codificavel: '', sentimento: 'o tom predominante', funcao: 'nenhuma, uma ou mais',
    incivilidade: 'só o que o autor diz', intolerancia: 'ataca grupos ou direitos',
    alvos: 'marque só os citados; os outros contam como não citados', temas: 'campanha e pedido de voto não são tema',
  };
  for (const g of document.querySelectorAll('.grupo[data-tarefa]')) {
    const t = g.dataset.tarefa;
    if (t === 'extras') continue;
    const d = CB.tarefas[t];
    let corpo;
    if (d.tipo === 'alvos') {
      corpo = el('div', { class: 'alvos' },
        el('div', { class: 'opcoes' }, d.opcoes.map(([c, rot]) => botao('alvo', c, rot))),
        el('div', { class: 'alvos-marcados', id: 'alvos-marcados' }));
    } else {
      corpo = el('div', { class: 'opcoes' }, d.opcoes.map(([c, rot]) =>
        botao(t, c, rot, t === 'sentimento' ? { 'data-tom': c } : {})));
    }
    g.replaceChildren(el('div', { class: 'controles' }, titulo(t, d.rotulo, dicas[t]), corpo),
                      el('div', { class: 'guia-secao', 'data-secao': t }));
  }
  const ex = CB.so_humanos;
  $('#extras').replaceChildren(el('div', { class: 'controles' },
    titulo('extras', 'Para a equipe', 'não vai para o modelo'),
    el('div', { class: 'linha-extra' }, botao('precisa_midia', '1', ex.precisa_midia)),
    el('div', { class: 'linha-extra' }, el('span', {}, 'Confiança:'),
      el('div', { class: 'opcoes' }, ex.confianca.map(([c, rot]) => botao('confianca', c, rot)))),
    el('textarea', { id: 'comentario', maxlength: MAX_COMENTARIO, placeholder: 'Comentário (opcional). Não copie o texto do post aqui.',
                     oninput: ev => { S.r.comentario = ev.target.value; $('#contador').textContent = `${ev.target.value.length}/${MAX_COMENTARIO}`; } }),
    el('div', { class: 'contador', id: 'contador' }, `0/${MAX_COMENTARIO}`)),
    el('div', { class: 'guia-secao', 'data-secao': 'extras' }));
  preencherGuias();
}

function marcar(tarefa, codigo) {
  if (!S.r) return;
  const r = S.r;
  if (tarefa === 'codificavel' || tarefa === 'sentimento') r[tarefa] = codigo;
  else if (tarefa === 'confianca') r.confianca = codigo;
  else if (tarefa === 'precisa_midia') r.precisa_midia = !r.precisa_midia;
  else if (tarefa === 'alvo') {
    r.alvos.has(codigo) ? r.alvos.delete(codigo) : r.alvos.set(codigo, null);  // citado; a postura vem em seguida
  } else if (tarefa === 'postura') {
    const [alvo, postura] = codigo.split(':');
    r.alvos.set(alvo, postura);
  } else if (tarefa === 'tirar-alvo') {
    r.alvos.delete(codigo);
  } else {
    r[tarefa].has(codigo) ? r[tarefa].delete(codigo) : r[tarefa].add(codigo);
  }
  $('#erro-form').textContent = '';
  desenhar();
}

function desenhar() {
  const r = S.r, nao = r.codificavel !== 'sim' && r.codificavel !== null;
  desenharAlvos();
  for (const b of document.querySelectorAll('#rotulos .opcao')) {
    const t = b.dataset.tarefa, c = b.dataset.codigo;
    let on;
    if (t === 'codificavel' || t === 'sentimento') on = r[t] === c;
    else if (t === 'confianca') on = r.confianca === c;
    else if (t === 'precisa_midia') on = r.precisa_midia;
    else if (t === 'alvo') on = r.alvos.has(c);
    else if (t === 'postura') { const [a, p] = c.split(':'); on = r.alvos.get(a) === p; }
    else if (t === 'tirar-alvo') continue;
    else on = r[t].has(c);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
  for (const g of document.querySelectorAll('.grupo[data-tarefa]')) {
    const t = g.dataset.tarefa;
    g.classList.toggle('desligado', nao && t !== 'codificavel' && t !== 'extras');
    g.classList.toggle('divergente', !!(S.atual && S.atual.fase === 'adjudicacao' && S.atual.divergentes.includes(t)));
    g.classList.remove('invalido');
  }
  $('#extras').classList.remove('invalido');
  const com = $('#comentario');
  if (com) $('#contador').textContent = `${com.value.length}/${MAX_COMENTARIO}`;
}

/** Uma linha por alvo marcado, com as três posturas; sem alvo, uma nota curta. */
function desenharAlvos() {
  const caixa = $('#alvos-marcados');
  if (!caixa) return;
  const d = CB.tarefas.alvos, r = S.r;
  if (!r.alvos.size) {
    caixa.replaceChildren(el('p', { class: 'nenhum' }, 'Nenhum alvo marcado: clique no nome de quem o post cita.'));
    return;
  }
  caixa.replaceChildren(...d.opcoes.filter(([c]) => r.alvos.has(c)).map(([c, rot]) =>
    el('div', { class: 'alvo-linha' + (r.alvos.get(c) ? '' : ' sem-postura') },
      el('span', { class: 'nome' }, rot),
      el('div', { class: 'opcoes' }, d.posturas.map(([p, prot]) => botao('postura', c + ':' + p, prot, { 'data-postura': p }))),
      el('button', { type: 'button', class: 'tirar', 'aria-label': `Tirar ${rot}`, title: 'Tirar este alvo',
                     onclick: () => marcar('tirar-alvo', c) }, '×'))));
}

function ligarTeclado() {
  document.addEventListener('keydown', ev => {
    if ($('#app').hidden || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    const alvo = ev.target;
    const digitando = alvo.tagName === 'TEXTAREA' || (alvo.tagName === 'INPUT' && alvo.type !== 'checkbox');
    if (digitando) return;
    const k = ev.key.toLowerCase();
    if (k === 'escape') { fecharAjuda(); return; }
    if (k === 'enter') { ev.preventDefault(); salvar(); return; }
    if (k === 'g') { alternarGuia(); return; }  // escolha gravada
    if (k === 'm') { marcar('precisa_midia', '1'); return; }
    if (ATALHOS[k]) { const [t, c] = ATALHOS[k]; if (!(t !== 'confianca' && S.r && S.r.codificavel !== 'sim')) marcar(t, c); }
  });
}

// ------------------------------------------------------------------------------------------------ guia
/** Liga ou desliga o guia pareado (cada seção com o seu trecho ao lado); só a escolha da pessoa fica gravada. */
function alternarGuia(mostrar, escolha = true) {
  const palco = $('#palco');
  const on = mostrar === undefined ? !palco.classList.contains('com-guia') : mostrar;
  palco.classList.toggle('com-guia', on);
  $('#botao-guia').setAttribute('aria-pressed', on ? 'true' : 'false');
  fecharAjuda();
  if (escolha) gravar('brpol-rotular-guia', on ? '1' : '0');
}

async function aplicarGuia() {
  try {
    const r = await fetch('guia.md', { cache: 'no-cache' });
    const md = await r.text();
    for (const parte of md.split(/^## /m).slice(1)) {
      const [cab, ...resto] = parte.split('\n');
      const num = cab.match(/^(\d+)\.\s*(.*)/);
      const chave = num ? SECAO_DO_NUMERO[num[1]] : (SECAO_DO_TITULO.find(([rx]) => rx.test(cab)) || [])[1];
      if (chave) S.guia[chave] = { titulo: num ? num[2] : cab.trim(), md: resto.join('\n').trim() };
    }
  } catch (e) {
    S.guia = {};
  }
  preencherGuias();
}

/** Coloca cada trecho do guia no seu lugar: ao lado das seções, no topo (regras e emendas) e no fim (exemplos, atalhos). */
function preencherGuias() {
  const bloco = (chave, nivel = 'h2') => S.guia[chave]
    ? el('div', { class: 'guia-parte' }, el(nivel, {}, S.guia[chave].titulo), markdown(S.guia[chave].md)) : null;
  const como = $('#como-funciona');
  if (como) como.replaceChildren(S.guia.como ? markdown(S.guia.como.md) : 'O guia não carregou.');
  if (!$('#guia-topo')) return;
  $('#guia-topo').replaceChildren(...[bloco('regras'), bloco('emendas')].filter(Boolean));
  $('#guia-fim').replaceChildren(...[bloco('exemplos'), bloco('atalhos')].filter(Boolean));
  for (const caixa of document.querySelectorAll('.guia-secao')) {
    const g = S.guia[caixa.dataset.secao];
    caixa.replaceChildren(g ? markdown(g.md) : '');
  }
}

/** Janelinha com o trecho do guia de uma seção, junto do botão (?) que a abriu. */
function abrirAjuda(secao, botaoAjuda) {
  const pop = $('#popover');
  if (!pop.hidden && pop.dataset.secao === secao) return fecharAjuda();
  const g = S.guia[secao];
  pop.dataset.secao = secao;
  $('#popover-titulo').textContent = g ? g.titulo : 'Guia';
  $('#popover-corpo').replaceChildren(g ? markdown(g.md) : 'O guia não carregou.');
  pop.hidden = false;
  if (window.innerWidth < 700) { pop.style.left = pop.style.top = ''; return; }  // no celular, folha no rodapé (CSS)
  const b = botaoAjuda.getBoundingClientRect(), largura = pop.offsetWidth;
  pop.style.left = `${Math.max(8, Math.min(b.right - largura, window.innerWidth - largura - 8)) + window.scrollX}px`;
  pop.style.top = `${b.bottom + 6 + window.scrollY}px`;
  $('#popover-fechar').focus({ preventScroll: true });
}

function fecharAjuda() {
  const pop = $('#popover');
  if (pop && !pop.hidden) { pop.hidden = true; delete pop.dataset.secao; }
}

document.addEventListener('click', ev => {
  const pop = $('#popover');
  if (!pop.hidden && !pop.contains(ev.target) && !ev.target.closest('.ajuda')) fecharAjuda();
});

/** Markdown mínimo do guia: títulos, parágrafos, listas, tabelas, citações, negrito, itálico e código. */
function markdown(md) {
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inline = s => esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  const linhas = md.split('\n'), html = [];
  let i = 0;
  while (i < linhas.length) {
    const l = linhas[i];
    if (!l.trim()) { i++; continue; }
    const h = l.match(/^(#{1,3}) (.*)/);
    if (h) { html.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); i++; continue; }
    if (l.startsWith('|')) {
      const rows = [];
      while (i < linhas.length && linhas[i].startsWith('|')) rows.push(linhas[i++]);
      const cel = r => r.replace(/^\||\|$/g, '').split('|').map(c => inline(c.trim()));
      const [cab, , ...corpo] = rows;
      html.push('<table><thead><tr>' + cel(cab).map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>' +
        corpo.map(r => '<tr>' + cel(r).map(c => `<td>${c}</td>`).join('') + '</tr>').join('') + '</tbody></table>');
      continue;
    }
    if (l.startsWith('>')) {
      const partes = [];
      while (i < linhas.length && linhas[i].startsWith('>')) partes.push(linhas[i++].replace(/^>\s?/, ''));
      html.push(`<blockquote>${inline(partes.join(' '))}</blockquote>`);
      continue;
    }
    const item = /^(\s*)(-|\d+\.) (.*)/;
    if (item.test(l)) {
      const ordenada = /^\s*\d+\./.test(l), itens = [];
      while (i < linhas.length && linhas[i].trim()) {
        const m = linhas[i].match(item);
        if (m && m[1].length < 2) itens.push(m[3]);
        else if (itens.length) itens[itens.length - 1] += ' ' + linhas[i].trim().replace(/^- /, '— ');
        i++;
      }
      const tag = ordenada ? 'ol' : 'ul';
      html.push(`<${tag}>` + itens.map(x => `<li>${inline(x)}</li>`).join('') + `</${tag}>`);
      continue;
    }
    const par = [];
    while (i < linhas.length && linhas[i].trim() && !/^(#|\||>|\s*(-|\d+\.) )/.test(linhas[i])) par.push(linhas[i++]);
    html.push(`<p>${inline(par.join(' '))}</p>`);
  }
  const div = document.createElement('div');
  div.innerHTML = html.join('\n');
  return div;
}

iniciar();
