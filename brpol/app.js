/* BRPOL 2026 — painel. Sem dependências: os dados chegam cifrados (dados.bin) e são abertos no navegador.
   Textos em textos.js (português e inglês); aqui só há chaves. */
'use strict';
(() => {

// ---------------------------------------------------------------- utilidades
const $ = (sel, raiz = document) => raiz.querySelector(sel);
function h(tag, attrs = {}, ...filhos) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'text') el.textContent = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const f of filhos.flat()) if (f != null) el.append(f);
  return el;
}
const NS = 'http://www.w3.org/2000/svg';
function s(tag, attrs = {}, texto) {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) el.setAttribute(k, v);
  if (texto != null) el.textContent = texto;
  return el;
}
function armazenar(chave, valor) { try { valor == null ? localStorage.removeItem(chave) : localStorage.setItem(chave, valor); } catch (e) { /* sem armazenamento */ } }
function ler(chave) { try { return localStorage.getItem(chave); } catch (e) { return null; } }
const mediana = xs => {
  const v = xs.filter(x => x != null).sort((a, b) => a - b);
  if (!v.length) return null;
  const m = v.length >> 1;
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
};
const soma = xs => xs.reduce((a, b) => a + (b || 0), 0);
function faixas(bools) {
  const out = []; let i0 = -1;
  bools.forEach((b, i) => {
    if (b && i0 < 0) i0 = i;
    if (!b && i0 >= 0) { out.push({ i0, i1: i - 1 }); i0 = -1; }
  });
  if (i0 >= 0) out.push({ i0, i1: bools.length - 1 });
  return out;
}

// ---------------------------------------------------------------- idioma
const TEXTOS = window.BRPOL_TEXTOS;
const LINGUAS = ['pt', 'en'];
let LANG = 'pt';
/** Texto da chave no idioma atual; cai no português e, por fim, em `padrao` ou na própria chave. */
function t(chave, vars, padrao) {
  const bruto = TEXTOS[LANG][chave] ?? TEXTOS.pt[chave] ?? padrao ?? chave;
  return vars ? bruto.replace(/\{(\w+)\}/g, (_, n) => vars[n] ?? '') : bruto;
}
const tem = chave => chave in TEXTOS[LANG] || chave in TEXTOS.pt;
function linguaInicial() {
  const url = new URLSearchParams(location.search).get('lang');
  if (LINGUAS.includes(url)) return url;
  const salva = ler('brpol-lingua');
  if (LINGUAS.includes(salva)) return salva;
  return (navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

// números e datas no formato de cada idioma
let nf, nf1, ncp;
function criarFormatos() {
  const loc = LANG === 'en' ? 'en-GB' : 'pt-BR';
  nf = new Intl.NumberFormat(loc);
  nf1 = new Intl.NumberFormat(loc, { maximumFractionDigits: 1 });
  ncp = new Intl.NumberFormat(loc, { notation: 'compact', maximumFractionDigits: 1 });
}
const fmt = {
  int: v => v == null ? '—' : nf.format(Math.round(v)),
  dec: v => v == null ? '—' : nf1.format(v),
  cp: v => v == null ? '—' : (Math.abs(v) < 1000 ? nf.format(Math.round(v)) : ncp.format(v)),
  pct: v => v == null ? '—' : nf1.format(v * 100) + '%',
  reais: v => v == null ? '—' : 'R$ ' + (Math.abs(v) < 1000 ? nf.format(Math.round(v)) : ncp.format(v)),
};
const MESES_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** '2026-08-15' -> '15/08' ou '15 Aug' */
const dm = iso => LANG === 'en' ? `${+iso.slice(8, 10)} ${MESES_EN[+iso.slice(5, 7) - 1]}` : `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
function rotSemana(ini, fim) {
  if (LANG === 'en' && ini.slice(5, 7) === fim.slice(5, 7)) return `${+ini.slice(8, 10)}–${dm(fim)}`;
  return `${dm(ini)}–${dm(fim)}`;
}
function fimSemana(ini) {
  const achada = D.meta.semanas.find(s => s.inicio === ini);
  if (achada) return achada.fim;
  if (ini === '2026-08-15') return '2026-08-22';
  const d = new Date(`${ini}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 6);
  return d.toISOString().slice(0, 10);
}
const faixaDatas = (a, b) => LANG === 'en' ? rotSemana(a, b) : t('intervalo', { a: dm(a), b: dm(b) });
const semanaRot = ini => ini === 'todas' ? t('todas_semanas') : rotSemana(ini, fimSemana(ini));
const semanaCurta = ini => dm(ini);
function dataHora(txt) {  // '2026-09-24 21:46'
  const [d, hora] = txt.split(' ');
  return LANG === 'en' ? `${dm(d)} ${d.slice(0, 4)}, ${hora}` : `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)} ${hora}`;
}

// vocabulário: rótulos vêm dos textos
const CORES = {
  lula: 'var(--c-lula)', pl: 'var(--c-pl)', outra_presidencial: 'var(--c-outra)', sem_presidencial: 'var(--c-sem)',
  partido: 'var(--c-outros)', veiculo: 'var(--c-outros)', sem_casamento: 'var(--c-outros)', sem_campo: 'var(--c-outros)',
};
const segRot = sg => t(`seg.${sg}`);
const segCurto = sg => t(`seg.${sg}.curto`);
const CAMPOS = ['lula', 'pl', 'outra_presidencial', 'sem_presidencial'];
const SEGMENTOS = [...CAMPOS, 'partido', 'veiculo'];
const CARGOS = ['todos', 'presidente', 'governador', 'senador', 'dep_federal', 'dep_estadual'];
const METRICAS = ['curtidas', 'comentarios', 'views'];
const FORMATOS = ['video', 'foto', 'carrossel', 'story'];
const GRUPOS = ['todos', 'candidato', 'partido', 'veiculo_nacional', 'veiculo_regional'];
const cargoRot = c => t(`cargo.${c}`, null, c);
const opcoes = (lista, pref) => lista.map(k => [k, t(`${pref}.${k}`)]);
const rotuloDe = (pref, chave, reserva) => tem(`${pref}.${chave}`) ? t(`${pref}.${chave}`) : (reserva ?? chave);

let D = null;  // dados abertos

// ---------------------------------------------------------------- cifra
const MAGICO = new TextEncoder().encode('BRPOL1');
const CHAVE_LS = 'brpol-chave-v1';
const b64 = {
  de: buf => btoa(String.fromCharCode(...new Uint8Array(buf))),
  para: str => Uint8Array.from(atob(str), c => c.charCodeAt(0)),
};
const hex = bytes => [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');

async function baixarBlob() {
  const r = await fetch('dados.bin', { cache: 'no-cache' });
  if (!r.ok) throw new Error(t('erro.sem_arquivo'));
  const buf = new Uint8Array(await r.arrayBuffer());
  if (buf.length < 40 || MAGICO.some((b, i) => buf[i] !== b)) throw new Error(t('erro.invalido'));
  return {
    iter: new DataView(buf.buffer).getUint32(6),
    sal: buf.slice(10, 26), iv: buf.slice(26, 38), cifra: buf.slice(38),
  };
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

async function iniciar() {
  LANG = linguaInicial();
  criarFormatos();
  traduzirFixos();
  for (const b of document.querySelectorAll('[data-lingua]')) b.addEventListener('click', () => trocarLingua(LANG === 'pt' ? 'en' : 'pt'));
  aplicarTema(ler('brpol-tema') || 'auto');
  if (new URLSearchParams(location.search).has('dev')) {  // pré-visualização local, sem cifra
    const r = await fetch('dados.json', { cache: 'no-cache' });
    if (r.ok) return abrirPainel(await r.json());
  }
  const form = $('#form-senha'), erro = $('#erro'), botao = $('#abrir');
  let blob;
  try { blob = await baixarBlob(); } catch (e) { erro.textContent = e.message; botao.disabled = true; return; }
  const guardada = ler(CHAVE_LS);
  if (guardada) {
    try {
      const { k, sal } = JSON.parse(guardada);
      if (sal === hex(blob.sal)) {
        const chave = await crypto.subtle.importKey('raw', b64.para(k), 'AES-GCM', false, ['decrypt']);
        return abrirPainel(await decifrar(blob, chave));
      }
    } catch (e) { armazenar(CHAVE_LS, null); }
  }
  $('#senha').focus();
  form.addEventListener('submit', async ev => {
    ev.preventDefault();
    erro.textContent = ''; botao.disabled = true; botao.textContent = t('bloqueio.abrindo');
    try {
      const chave = await derivar($('#senha').value, blob);
      const dados = await decifrar(blob, chave);
      if ($('#lembrar').checked) {
        armazenar(CHAVE_LS, JSON.stringify({ k: b64.de(await crypto.subtle.exportKey('raw', chave)), sal: hex(blob.sal) }));
      }
      abrirPainel(dados);
    } catch (e) {
      erro.textContent = e instanceof DOMException ? t('erro.senha') : t('erro.abrir', { msg: e.message });
      botao.disabled = false; botao.textContent = t('bloqueio.abrir');
    }
  });
}

/** Textos fixos do HTML (data-t), botões de idioma, tema e sair, e o atributo lang. */
function traduzirFixos() {
  document.documentElement.lang = LANG === 'en' ? 'en' : 'pt-BR';
  for (const el of document.querySelectorAll('[data-t]')) el.textContent = t(el.dataset.t);
  for (const b of document.querySelectorAll('[data-lingua]')) { b.textContent = t('lingua.outra'); b.title = t('lingua.dica'); }
  const sair = $('#sair');
  if (sair) { sair.textContent = t('sair'); sair.title = t('sair.dica'); }
  aplicarTema(ler('brpol-tema') || 'auto');
}
function trocarLingua(l) {
  LANG = l;
  armazenar('brpol-lingua', l);
  criarFormatos();
  traduzirFixos();
  if (D) montarApp();
}

// ---------------------------------------------------------------- tema
function aplicarTema(tema) {
  if (tema === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', tema);
  const b = $('#tema');
  if (b) { b.textContent = t(`tema.${tema}`); b.title = t('tema.dica'); }
  armazenar('brpol-tema', tema);
}

// ---------------------------------------------------------------- dica (tooltip)
const dica = $('#dica');
function mostrarDica(pos, titulo, linhas = [], extra) {
  dica.replaceChildren();
  if (titulo) dica.append(h('div', { class: 'tit', text: titulo }));
  for (const l of linhas) {
    const esq = h('span', { class: 'esq' });
    if (l.cor) esq.append(h('span', { class: 'chave-linha', style: `background:${l.cor}` }));
    esq.append(document.createTextNode(l.rot));
    dica.append(h('div', { class: 'lin' }, esq, h('strong', { text: l.val })));
  }
  if (extra) dica.append(h('div', { class: 'extra', text: extra }));
  dica.hidden = false;
  const r = dica.getBoundingClientRect();
  let x = pos.x + 14, y = pos.y;
  if (x + r.width > innerWidth - 8) x = pos.x - r.width - 14;
  if (y + r.height > innerHeight - 8) y = innerHeight - r.height - 8;
  dica.style.left = `${Math.max(8, x)}px`;
  dica.style.top = `${Math.max(8, y)}px`;
}
function esconderDica() { dica.hidden = true; }
function comDica(el, f) {
  el.addEventListener('pointermove', ev => { const d = f(); mostrarDica({ x: ev.clientX, y: ev.clientY }, d.titulo, d.linhas, d.extra); });
  el.addEventListener('pointerleave', esconderDica);
}

// ---------------------------------------------------------------- redesenho responsivo
const desenhos = new WeakMap();
const observados = new Set();
const observador = new ResizeObserver(entradas => {
  for (const e of entradas) {
    const d = desenhos.get(e.target);
    const w = Math.round(e.contentRect.width);
    if (d && w > 0 && Math.abs(w - d.w) > 1) { d.w = w; e.target.replaceChildren(); d.fn(e.target, w); }
  }
});
function observar(el, fn) { desenhos.set(el, { fn, w: 0 }); observador.observe(el); observados.add(el); }
function largarTodos() { for (const el of observados) observador.unobserve(el); observados.clear(); }

// ---------------------------------------------------------------- blocos
function cartao(pai, { titulo, legenda } = {}) {
  const c = h('section', { class: 'cartao' });
  if (titulo) c.append(h('h2', { text: titulo }));
  if (legenda) c.append(h('p', { class: 'legenda-fig', text: legenda }));
  pai.append(c);
  return c;
}
function legendaEl(itens, tipo = 'linha') {
  return h('div', { class: 'legenda' }, itens.map(i =>
    h('span', {}, h('span', { class: tipo === 'linha' ? 'chave-linha' : 'chave-ponto', style: `background:${i.cor}` }), i.rot)));
}
function tabelaEl(cols, linhas) {
  return h('div', { class: 'tabela-envolve' }, h('table', { class: 'dados' },
    h('thead', {}, h('tr', {}, cols.map(c => h('th', { class: c.n ? 'n' : null, text: c.rot })))),
    h('tbody', {}, linhas.map(l => h('tr', {}, l.map((v, i) => h('td', { class: cols[i].n ? 'n' : null, text: v })))))));
}
/** Cartão com gráfico, legenda opcional, nota e botão de tabela (a versão acessível de todo gráfico). */
function grafico(pai, { titulo, legenda, itens, tipoLegenda, nota, desenhar, tabela }) {
  const c = cartao(pai, { titulo, legenda });
  if (itens && itens.length > 1) c.append(legendaEl(itens, tipoLegenda));
  const fig = h('div', { class: 'fig' });
  c.append(fig);
  if (nota || tabela) {
    const rod = h('div', { class: 'rodape-fig' }, h('span', { class: 'nota', text: nota || '' }));
    if (tabela) {
      let aberta = null;
      const b = h('button', { class: 'ver-tabela', type: 'button', text: t('ver_tabela') });
      b.addEventListener('click', () => {
        if (aberta) { aberta.remove(); aberta = null; b.textContent = t('ver_tabela'); return; }
        const tb = tabela();
        aberta = h('div', { class: 'tabela-fig' }, tabelaEl(tb.cols, tb.linhas));
        c.append(aberta); b.textContent = t('ocultar_tabela');
      });
      rod.append(b);
    }
    c.append(rod);
  }
  observar(fig, desenhar);
  return c;
}
function kpis(pai, itens) {
  pai.append(h('div', { class: 'kpis' }, itens.map(k =>
    h('div', { class: 'kpi' }, h('div', { class: 'rot', text: k.rot }), h('div', { class: 'val', text: k.val }),
      k.det ? h('div', { class: 'det', text: k.det }) : null))));
}
function aviso(pai, texto) { pai.append(h('div', { class: 'aviso', role: 'note', text: texto })); }
function seletor(rotulo, ops, valor, aoMudar) {
  const sel = h('select', {}, ops.map(([v, r]) => h('option', { value: v, text: r })));
  sel.value = valor;
  sel.addEventListener('change', () => aoMudar(sel.value));
  return h('label', {}, rotulo, sel);
}

// ---------------------------------------------------------------- escalas
function marcas(max, n = 4) {
  if (!(max > 0)) return [0, 1];
  const bruto = max / n, p = Math.pow(10, Math.floor(Math.log10(bruto))), f = bruto / p;
  const passo = (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  const topo = Math.ceil(max / passo - 1e-9) * passo;
  const out = [];
  for (let v = 0; v <= topo + passo / 2; v += passo) out.push(+v.toFixed(10));
  return out;
}

// ---------------------------------------------------------------- linhas
/** o: {x, xFmt, xDica, series:[{rot, curto, cor, v}], yFmt, dicaFmt, altura, bandas, marcos, pontos, extra} */
function linhas(el, w, o) {
  const H = o.altura || 240, n = o.x.length;
  const fim = o.rotFim !== false && o.series.length <= 4 && w >= 560;
  const m = { t: 20, r: fim ? 112 : 14, b: 26, l: 48 };
  const iw = Math.max(40, w - m.l - m.r), ih = H - m.t - m.b;
  let max = 0;
  for (const se of o.series) for (const v of se.v) if (v != null && v > max) max = v;
  const tk = marcas(max), ymax = tk[tk.length - 1];
  const X = i => m.l + (n === 1 ? iw / 2 : i * iw / (n - 1));
  const Y = v => m.t + ih - (v / ymax) * ih;
  const passo = n > 1 ? iw / (n - 1) : iw;
  const svg = s('svg', { width: w, height: H, viewBox: `0 0 ${w} ${H}`, role: 'img', 'aria-label': o.aria || '' });

  let ultimaBanda = -Infinity;
  for (const b of o.bandas || []) {
    const x0 = Math.max(m.l, X(b.i0) - passo / 2), x1 = Math.min(m.l + iw, X(b.i1) + passo / 2);
    svg.append(s('rect', { x: x0, y: m.t, width: Math.max(1, x1 - x0), height: ih, style: `fill:var(${b.tipo === 'sem' ? '--band-sem' : '--band-prov'})` }));
    const larg = (b.rot || '').length * 5.6, cx = (x0 + x1) / 2;
    if (b.rot && x1 - x0 > 30 && cx - larg / 2 > ultimaBanda + 6) {
      svg.append(s('text', { x: cx, y: m.t - 6, 'text-anchor': 'middle', class: 'rot-banda' }, b.rot));
      ultimaBanda = cx + larg / 2;
    }
  }
  for (const tk_ of tk) {
    svg.append(s('line', { x1: m.l, x2: m.l + iw, y1: Y(tk_), y2: Y(tk_), class: tk_ === 0 ? 'eixo' : 'grade-linha' }));
    svg.append(s('text', { x: m.l - 6, y: Y(tk_) + 4, 'text-anchor': 'end', class: 'num' }, (o.yFmt || fmt.cp)(tk_)));
  }
  const nt = Math.max(2, Math.min(n, Math.floor(iw / 64)));
  const passoX = Math.max(1, Math.ceil((n - 1) / (nt - 1)));
  const idx = [];
  for (let i = 0; i < n; i += passoX) idx.push(i);
  if (idx.at(-1) !== n - 1) { if (n - 1 - idx.at(-1) < passoX * 0.6) idx.pop(); idx.push(n - 1); }
  for (const i of idx) {
    const ancora = n > 2 && i === 0 ? 'start' : n > 2 && i === n - 1 ? 'end' : 'middle';
    svg.append(s('text', { x: X(i), y: H - 8, 'text-anchor': ancora }, (o.xFmt || String)(o.x[i])));
  }
  for (const mk of o.marcos || []) {
    if (mk.i < 0 || mk.i >= n) continue;
    svg.append(s('line', { x1: X(mk.i), x2: X(mk.i), y1: m.t, y2: m.t + ih, class: 'marco' }));
    svg.append(s('text', { x: X(mk.i) + 4, y: m.t + 11 }, mk.rot));
  }
  for (const se of o.series) {
    let d = '', aberto = false;
    se.v.forEach((v, i) => {
      if (v == null) { aberto = false; return; }
      d += `${aberto ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`; aberto = true;
    });
    svg.append(s('path', { d, fill: 'none', style: `stroke:${se.cor}`, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
    se.v.forEach((v, i) => {
      if (v == null) return;
      const isolado = se.v[i - 1] == null && se.v[i + 1] == null;
      if (isolado || o.pontos) svg.append(s('circle', { cx: X(i), cy: Y(v), r: 4, style: `fill:${se.cor};stroke:var(--surface)`, 'stroke-width': 2 }));
    });
  }
  if (fim) {
    const fins = o.series.map(se => {
      let i = se.v.length - 1;
      while (i >= 0 && se.v[i] == null) i--;
      return i < 0 ? null : { se, i, y: Y(se.v[i]) };
    }).filter(Boolean).sort((a, b) => a.y - b.y);
    if (!fins.some((f, k) => k > 0 && f.y - fins[k - 1].y < 14)) {
      for (const f of fins) {
        if (!o.pontos) svg.append(s('circle', { cx: X(f.i), cy: f.y, r: 4, style: `fill:${f.se.cor};stroke:var(--surface)`, 'stroke-width': 2 }));
        svg.append(s('text', { x: m.l + iw + 10, y: f.y + 4, class: 'rot-fim' }, f.se.curto || f.se.rot));
      }
    }
  }
  const cruz = s('line', { y1: m.t, y2: m.t + ih, class: 'cruz', visibility: 'hidden' });
  svg.append(cruz);
  const pts = o.series.map(se => {
    const c = s('circle', { r: 4.5, style: `fill:${se.cor};stroke:var(--surface)`, 'stroke-width': 2, visibility: 'hidden' });
    svg.append(c); return c;
  });
  const alvo = s('rect', { x: m.l - passo / 2, y: m.t, width: iw + passo, height: ih, class: 'alvo', tabindex: 0, 'aria-label': t('setas') });
  svg.append(alvo);
  let atual = -1;
  const ir = i => {
    atual = i;
    const x = X(i);
    cruz.setAttribute('x1', x); cruz.setAttribute('x2', x); cruz.setAttribute('visibility', 'visible');
    o.series.forEach((se, k) => {
      const v = se.v[i];
      if (v == null) { pts[k].setAttribute('visibility', 'hidden'); return; }
      pts[k].setAttribute('cx', x); pts[k].setAttribute('cy', Y(v)); pts[k].setAttribute('visibility', 'visible');
    });
    const lin = o.series.map(se => ({ cor: se.cor, rot: se.rot, val: se.v[i] == null ? '—' : (o.dicaFmt || o.yFmt || fmt.int)(se.v[i]), ord: se.v[i] ?? -1 }))
      .sort((a, b) => b.ord - a.ord);
    const r = svg.getBoundingClientRect();
    mostrarDica({ x: r.left + x, y: r.top + m.t }, (o.xDica || o.xFmt || String)(o.x[i]), lin, o.extra ? o.extra(i) : null);
  };
  alvo.addEventListener('pointermove', ev => {
    const r = svg.getBoundingClientRect();
    ir(Math.max(0, Math.min(n - 1, Math.round((ev.clientX - r.left - m.l) / (n > 1 ? passo : 1)))));
  });
  const sair = () => { cruz.setAttribute('visibility', 'hidden'); pts.forEach(p => p.setAttribute('visibility', 'hidden')); esconderDica(); };
  alvo.addEventListener('pointerleave', sair);
  alvo.addEventListener('blur', sair);
  alvo.addEventListener('focus', () => ir(atual < 0 ? n - 1 : atual));
  alvo.addEventListener('keydown', ev => {
    if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
    ev.preventDefault();
    ir(Math.max(0, Math.min(n - 1, (atual < 0 ? n - 1 : atual) + (ev.key === 'ArrowRight' ? 1 : -1))));
  });
  el.append(svg);
}

// ---------------------------------------------------------------- barras horizontais
/** o: {linhas:[{rot, sub, v, lo, hi, iqr, ref, cor, chave, grupo, rotVal, dica}], fmt, faixa, rotFaixa, max, reserva} */
function barras(el, w, o) {
  const f = o.fmt || fmt.int;
  const max = o.max ?? Math.max(1e-9, ...o.linhas.map(r => Math.max(o.faixa ? r.hi || 0 : r.v || 0, r.iqr && r.iqr[1] != null ? r.iqr[1] : 0, r.ref || 0)));
  const pct = v => Math.max(0, Math.min(100, (v || 0) / max * 100));
  const reserva = o.reserva ?? (o.faixa ? 118 : 70);
  const g = h('div', { class: 'barras' });
  let grupo = null;
  for (const r of o.linhas) {
    if (r.grupo && r.grupo !== grupo) { grupo = r.grupo; g.append(h('div', { class: 'grupo', text: grupo })); }
    const rot = h('div', { class: 'rot' });
    if (r.chave) rot.append(h('span', { class: 'chave-ponto', style: `background:${r.cor}` }));
    rot.append(h('span', { class: 't', text: r.rot, title: r.rot }));
    if (r.sub) rot.append(h('small', { text: r.sub }));
    const area = h('div', { class: 'area', style: `width:calc(100% - ${reserva}px)` });
    const cor = r.cor || 'var(--c-dado)';
    let ponta = 0, texto;
    if (o.faixa) {
      const temFaixa = (r.hi || 0) > (r.lo || 0);
      area.append(h('div', { class: 'barra', style: `width:${pct(r.lo)}%;background:${cor};${temFaixa ? 'border-radius:0' : ''}` }));
      if (temFaixa) area.append(h('div', { class: 'faixa', style: `left:${pct(r.lo)}%;width:${pct(r.hi) - pct(r.lo)}%;background:${cor}` }));
      ponta = pct(r.hi || r.lo);
      texto = o.rotFaixa ? o.rotFaixa(r) : t('intervalo', { a: f(r.lo), b: f(r.hi) });
    } else if (r.v == null) {
      texto = '—';
    } else {
      area.append(h('div', { class: 'barra', style: `width:${pct(r.v)}%;background:${cor}` }));
      ponta = pct(r.v);
      texto = r.rotVal ?? f(r.v);
    }
    if (r.iqr && r.iqr[0] != null && r.iqr[1] != null) {
      area.append(h('div', { class: 'iqr', style: `left:${pct(r.iqr[0])}%;width:${pct(r.iqr[1]) - pct(r.iqr[0])}%` }));
      ponta = Math.max(ponta, pct(r.iqr[1]));
    }
    if (r.ref != null) area.append(h('div', { class: 'ref', style: `left:calc(${pct(r.ref)}% - 1px)` }));
    area.append(h('span', { class: 'val', style: `left:calc(${ponta}% + 6px)`, text: texto }));
    const tr = h('div', { class: 'trilho' }, area);
    const linha = h('div', { class: 'linha-alvo' }, rot, tr);
    if (r.dica) comDica(linha, () => r.dica);
    g.append(linha);
  }
  el.append(g);
}

// ---------------------------------------------------------------- mapa de calor
/** o: {linhas:[{id, rot}], colunas:[{id, rot, cor}], valor(l, c), fmt, dica(l, c)} — rampa de uma cor (violeta). */
function calor(el, w, o) {
  const f = o.fmt || fmt.pct;
  let max = 0;
  for (const l of o.linhas) for (const c of o.colunas) { const v = o.valor(l, c); if (v != null && v > max) max = v; }
  const cab = h('tr', {}, h('th', {}), o.colunas.map(c => h('th', {},
    c.cor ? h('span', { class: 'chave-ponto', style: `background:${c.cor};margin-right:4px;vertical-align:middle` }) : null, c.rot)));
  const corpo = o.linhas.map(l => h('tr', {}, h('th', { text: l.rot }), o.colunas.map(c => {
    const v = o.valor(l, c);
    const tt = v == null ? 0 : v / (max || 1);
    const td = h('td', {
      class: tt > 0.55 ? 'forte' : null, text: f(v),
      style: v == null ? 'background:var(--surface-2)' : `background:color-mix(in oklab, var(--c-dado) ${Math.round(6 + 84 * tt)}%, var(--surface))`,
    });
    if (o.dica) comDica(td, () => o.dica(l, c));
    return td;
  })));
  el.append(h('div', { class: 'tabela-envolve' }, h('table', { class: 'calor' }, h('thead', {}, cab), h('tbody', {}, corpo))));
  el.append(h('div', { class: 'escala' }, h('span', { text: f(0) }),
    h('span', { class: 'rampa', style: 'background:linear-gradient(90deg, color-mix(in oklab, var(--c-dado) 6%, var(--surface)), color-mix(in oklab, var(--c-dado) 90%, var(--surface)))' }),
    h('span', { text: f(max) })));
}

// ---------------------------------------------------------------- colunas e minigráfico
function caminhoColuna(x, y, bw, bh, r = 4) {
  r = Math.min(r, bh, bw / 2);
  return `M${x},${y + bh}V${y + r}Q${x},${y} ${x + r},${y}H${x + bw - r}Q${x + bw},${y} ${x + bw},${y + r}V${y + bh}Z`;
}
/** o: {rot:[], v:[], altura, fmt, rotDica, serie} */
function colunas(el, w, o) {
  const H = o.altura || 150, n = o.v.length, m = { t: 18, r: 8, b: 24, l: 8 };
  const iw = w - m.l - m.r, ih = H - m.t - m.b, faixa = iw / n, bw = Math.min(24, faixa * 0.6);
  const max = Math.max(1, ...o.v.filter(v => v != null));
  const svg = s('svg', { width: w, height: H, viewBox: `0 0 ${w} ${H}` });
  svg.append(s('line', { x1: m.l, x2: m.l + iw, y1: m.t + ih, y2: m.t + ih, class: 'eixo' }));
  const imax = o.v.indexOf(Math.max(...o.v.filter(v => v != null)));
  o.v.forEach((v, i) => {
    const x = m.l + i * faixa + (faixa - bw) / 2;
    if (v) {
      const bh = v / max * ih;
      svg.append(s('path', { d: caminhoColuna(x, m.t + ih - bh, bw, bh), style: 'fill:var(--c-dado)' }));
      if (i === imax || i === n - 1) svg.append(s('text', { x: x + bw / 2, y: m.t + ih - bh - 5, 'text-anchor': 'middle', class: 'rot-fim' }, (o.fmt || fmt.int)(v)));
    }
    svg.append(s('text', { x: x + bw / 2, y: H - 7, 'text-anchor': 'middle' }, o.rot[i]));
    const alvo = s('rect', { x: m.l + i * faixa, y: m.t, width: faixa, height: ih, fill: 'transparent' });
    comDica(alvo, () => ({ titulo: o.rotDica ? o.rotDica(i) : o.rot[i], linhas: [{ rot: o.serie || t('posts'), val: (o.fmt || fmt.int)(v) }] }));
    svg.append(alvo);
  });
  el.append(svg);
}
function mini(valores) {
  const w = 64, H = 20, n = valores.length, faixa = w / n, bw = Math.max(2, faixa - 2);
  const max = Math.max(1, ...valores);
  const svg = s('svg', { width: w, height: H, viewBox: `0 0 ${w} ${H}`, 'aria-hidden': 'true' });
  valores.forEach((v, i) => {
    const bh = v ? Math.max(1, v / max * (H - 2)) : 0;
    if (bh) svg.append(s('path', { d: caminhoColuna(i * faixa + 1, H - bh, bw, bh, 1.5), style: 'fill:var(--c-dado)' }));
  });
  return svg;
}

// ================================================================ ABAS
const ABAS = [
  ['geral', abaGeral], ['perfis', abaPerfis], ['engajamento', abaEngajamento], ['temas', abaTemas],
  ['conversa', abaConversa], ['anuncios', abaAnuncios], ['metodo', abaMetodo],
];
let montadas = {};
function mostrarAba(id) {
  if (!ABAS.some(a => a[0] === id)) id = 'geral';
  for (const b of document.querySelectorAll('nav.abas button')) b.setAttribute('aria-selected', String(b.dataset.aba === id));
  for (const [k, painel] of Object.entries(montadas)) painel.hidden = k !== id;
  if (!montadas[id]) {
    const painel = h('div', { role: 'tabpanel' });
    $('#conteudo').append(painel);
    montadas[id] = painel;
    ABAS.find(a => a[0] === id)[1](painel);
  }
  esconderDica();
  if (location.hash !== `#${id}`) history.replaceState(null, '', `#${id}`);
}

function abrirPainel(dados) {
  D = dados;
  D.contasObj = D.contas.linhas.map(l => Object.fromEntries(D.contas.colunas.map((c, i) => [c, l[i]])));
  $('#bloqueio').remove();
  $('#app').hidden = false;
  $('#tema').addEventListener('click', () => {
    const atual = ler('brpol-tema') || 'auto';
    aplicarTema({ auto: 'dark', dark: 'light', light: 'auto' }[atual]);
  });
  $('#sair').addEventListener('click', () => { armazenar(CHAVE_LS, null); location.reload(); });
  addEventListener('hashchange', () => mostrarAba(location.hash.slice(1)));
  montarApp();
}
/** (Re)constrói cabeçalho, abas e a aba atual; usado na abertura e na troca de idioma. */
function montarApp() {
  const aba = location.hash.slice(1) || 'geral';
  largarTodos();
  esconderDica();
  $('#conteudo').replaceChildren();
  montadas = {};
  const M = D.meta;
  $('#sub').textContent = t('sub', { data: dataHora(M.gerado_em), de: dm(M.dados_de), ate: `${dm(M.dados_ate)} ${M.dados_ate.slice(0, 4)}`, fase: t(`fase.${M.fase}`, null, M.fase) });
  const nav = $('#abas');
  nav.replaceChildren();
  for (const [id] of ABAS) {
    const b = h('button', { type: 'button', role: 'tab', 'data-aba': id, text: t(`aba.${id}`) });
    b.addEventListener('click', () => mostrarAba(id));
    nav.append(b);
  }
  mostrarAba(aba);
}

// ---------------------------------------------------------------- visão geral
function abaGeral(p) {
  const M = D.meta, S = D.serie;
  const idx = iso => S.dias.indexOf(iso);
  const g = M.por_grupo;
  kpis(p, [
    { rot: t('geral.k_posts'), val: fmt.int(M.posts), det: t('geral.k_posts_det') },
    { rot: t('contas'), val: fmt.int(M.contas), det: t('geral.k_contas_det', { c: fmt.int(g.candidato), p: fmt.int(g.partido || 0), v: fmt.int((g.veiculo_nacional || 0) + (g.veiculo_regional || 0)) }) },
    { rot: t('geral.k_dias'), val: fmt.int(S.dias.length - S.sem_coleta.length), det: t('geral.k_dias_det', { n: S.dias.length, de: dm(S.dias[0]), ate: dm(S.dias.at(-1)) }) },
    { rot: t('geral.k_semanas'), val: fmt.int(M.semanas.length), det: M.semanas.map(sm => rotSemana(sm.inicio, sm.fim)).join(' · ') },
  ]);
  const semColeta = faixas(S.dias.map(d => S.sem_coleta.includes(d)));
  const prov = faixas(S.provisorio);
  if (semColeta.length || prov.length) {
    const partes = [];
    if (semColeta.length) partes.push(t('geral.aviso_sem', { faixas: semColeta.map(f => faixaDatas(S.dias[f.i0], S.dias[f.i1])).join(t('e')) }));
    if (prov.length) partes.push(t('geral.aviso_prov', { d: dm(S.dias[prov[0].i0]) }));
    aviso(p, partes.join(' '));
  }
  const bandas = [...semColeta.map(f => ({ ...f, tipo: 'sem', rot: t('banda.sem') })), ...prov.map(f => ({ ...f, tipo: 'prov', rot: t('banda.prov') }))];
  const marcos = [['2026-08-16', 'propaganda'], ['2026-08-28', 'hgpe'], ['2026-10-04', 'turno1'], ['2026-10-25', 'turno2']]
    .map(([d, k]) => ({ i: idx(d), rot: t(`marco.${k}`) }));
  const series = CAMPOS.map(c => ({ rot: segRot(c), curto: segCurto(c), cor: CORES[c], v: S.segmentos[c] }));
  grafico(p, {
    titulo: t('geral.g1'), legenda: t('geral.g1_leg'), itens: series, nota: t('geral.g1_nota'),
    desenhar: (el, w) => linhas(el, w, { x: S.dias, xFmt: dm, series, bandas, marcos, altura: 280 }),
    tabela: () => ({ cols: [{ rot: t('dia') }, ...series.map(se => ({ rot: se.curto, n: true }))], linhas: S.dias.map((d, i) => [dm(d), ...series.map(se => fmt.int(se.v[i]))]) }),
  });
  const duas = h('div', { class: 'grade duas', style: 'margin-top:16px' });
  p.append(duas);
  const veic = S.segmentos.veiculo;
  grafico(duas, {
    titulo: t('geral.g2'), legenda: t('geral.g2_leg'),
    desenhar: (el, w) => linhas(el, w, { x: S.dias, xFmt: dm, series: [{ rot: segCurto('veiculo'), cor: 'var(--c-dado)', v: veic }], bandas, altura: 200, rotFim: false }),
    tabela: () => ({ cols: [{ rot: t('dia') }, { rot: t('posts'), n: true }], linhas: S.dias.map((d, i) => [dm(d), fmt.int(veic[i])]) }),
  });
  grafico(duas, {
    titulo: t('geral.g3'), legenda: t('geral.g3_leg'),
    desenhar: (el, w) => linhas(el, w, { x: S.dias, xFmt: dm, series: [{ rot: t('geral.ativas'), cor: 'var(--c-dado)', v: S.contas_ativas }], bandas, altura: 200, rotFim: false }),
    tabela: () => ({ cols: [{ rot: t('dia') }, { rot: t('contas'), n: true }], linhas: S.dias.map((d, i) => [dm(d), fmt.int(S.contas_ativas[i])]) }),
  });
  const c = cartao(p, { titulo: t('geral.semanas'), legenda: t('geral.semanas_leg') });
  c.style.marginTop = '16px';
  c.append(tabelaEl([{ rot: t('semana') }, { rot: t('geral.fonte') }, { rot: t('posts'), n: true }, { rot: t('contas'), n: true }],
    M.semanas.map(sm => [rotSemana(sm.inicio, sm.fim), t(`fonte.${sm.fonte}`, null, sm.fonte), fmt.int(sm.posts), fmt.int(sm.contas)])));
}

// ---------------------------------------------------------------- perfis
function abaPerfis(p) {
  const todas = D.contasObj;
  const temas = D.temas.temas;
  const temaRot = tm => rotuloDe('tema', tm.chave, tm.rotulo);
  const est = { q: '', grupo: 'todos', cargo: 'todos', uf: 'todas', seg: 'todos', ordem: 'posts', limite: 50 };
  const ufs = [...new Set(todas.map(c => c.uf).filter(Boolean))].sort();
  const grupo1 = g => t(`grupo1.${g}`, null, '');
  const filtros = h('div', { class: 'filtros' });
  const busca = h('input', { type: 'search', placeholder: t('perfis.busca_ph'), 'aria-label': t('perfis.busca_aria') });
  busca.addEventListener('input', () => { est.q = busca.value.trim().toLowerCase(); est.limite = 50; desenhar(); });
  filtros.append(h('label', {}, t('perfis.busca'), busca),
    seletor(t('perfis.tipo'), opcoes(GRUPOS, 'grupo'), est.grupo, v => { est.grupo = v; est.limite = 50; desenhar(); }),
    seletor(t('cargo'), opcoes(CARGOS, 'cargo'), est.cargo, v => { est.cargo = v; est.limite = 50; desenhar(); }),
    seletor(t('uf'), [['todas', t('todas')], ...ufs.map(u => [u, u])], est.uf, v => { est.uf = v; est.limite = 50; desenhar(); }),
    seletor(t('campo'), [['todos', t('todos')], ...CAMPOS.map(c => [c, segRot(c)])], est.seg, v => { est.seg = v; est.limite = 50; desenhar(); }),
    seletor(t('perfis.ordenar'), [['posts', t('posts')], ['med_curtidas', t('perfis.ord_curtidas')], ['med_comentarios', t('perfis.ord_comentarios')], ['med_views', t('perfis.ord_views')], ['nome', t('perfis.nome')]], est.ordem, v => { est.ordem = v; desenhar(); }));
  p.append(filtros);
  const ficha = h('div', { id: 'ficha' });
  p.append(ficha);
  const c = cartao(p, { titulo: t('perfis.card'), legenda: t('perfis.card_leg') });
  const alvo = h('div');
  c.append(alvo);

  const cols = [{ rot: t('perfis.col_conta') }, { rot: t('perfis.col_cargo') }, { rot: t('partido') }, { rot: t('campo') }, { rot: t('posts'), n: true, k: 'posts' },
    { rot: t('perfis.col_semana') }, { rot: t('metrica.curtidas'), n: true, k: 'med_curtidas' }, { rot: t('metrica.comentarios'), n: true, k: 'med_comentarios' }, { rot: t('metrica.views'), n: true, k: 'med_views' }];
  function filtrar() {
    let r = todas.filter(c => (est.grupo === 'todos' || c.grupo === est.grupo) && (est.cargo === 'todos' || c.cargo === est.cargo) &&
      (est.uf === 'todas' || c.uf === est.uf) && (est.seg === 'todos' || c.seg === est.seg) &&
      (!est.q || c.usuario.toLowerCase().includes(est.q) || (c.nome || '').toLowerCase().includes(est.q)));
    const k = est.ordem;
    const loc = LANG === 'en' ? 'en' : 'pt-BR';
    r = r.slice().sort(k === 'nome' ? (a, b) => (a.nome || a.usuario).localeCompare(b.nome || b.usuario, loc) : (a, b) => (b[k] ?? -1) - (a[k] ?? -1));
    return r;
  }
  function desenhar() {
    const r = filtrar();
    const corpo = h('tbody', {}, r.slice(0, est.limite).map(conta => {
      const tr = h('tr', { class: 'clicavel', tabindex: 0 },
        h('td', {}, h('div', { class: 'conta-nome', text: conta.nome || conta.usuario }), h('div', { class: 'conta-user', text: '@' + conta.usuario })),
        h('td', { text: [conta.cargo ? cargoRot(conta.cargo) : grupo1(conta.grupo), conta.uf].filter(Boolean).join(' · ') }),
        h('td', { text: conta.partido || '—' }),
        h('td', {}, CAMPOS.includes(conta.seg) ? h('span', { style: 'display:inline-flex;gap:6px;align-items:center' }, h('span', { class: 'chave-ponto', style: `background:${CORES[conta.seg]}` }), segCurto(conta.seg)) : '—'),
        h('td', { class: 'n', text: fmt.int(conta.posts) }),
        h('td', {}, mini(conta.por_semana)),
        h('td', { class: 'n', text: fmt.int(conta.med_curtidas) }),
        h('td', { class: 'n', text: fmt.int(conta.med_comentarios) }),
        h('td', { class: 'n', text: fmt.cp(conta.med_views) }));
      const abrir = () => { mostrarFicha(conta); for (const x of corpo.children) x.classList.toggle('ativo', x === tr); };
      tr.addEventListener('click', abrir);
      tr.addEventListener('keydown', ev => { if (ev.key === 'Enter') abrir(); });
      return tr;
    }));
    const tab = h('div', { class: 'tabela-envolve' }, h('table', { class: 'dados' },
      h('thead', {}, h('tr', {}, cols.map(col => {
        const th = h('th', { class: [col.n ? 'n' : '', col.k ? 'ord' : ''].join(' ').trim() || null, text: col.rot + (est.ordem === col.k ? ' ↓' : '') });
        if (col.k) th.addEventListener('click', () => { est.ordem = col.k; desenhar(); });
        return th;
      }))), corpo));
    const mais = h('div', { class: 'mais' }, h('span', { text: t('perfis.contagem', { n: fmt.int(Math.min(est.limite, r.length)), total: fmt.int(r.length) }) }));
    if (r.length > est.limite) {
      const b = h('button', { type: 'button', text: t('perfis.mais') });
      b.addEventListener('click', () => { est.limite += 50; desenhar(); });
      mais.append(b);
    }
    alvo.replaceChildren(tab, mais);
  }

  function pares(conta) {
    return todas.filter(o => o !== conta && o.grupo === conta.grupo && (conta.grupo !== 'candidato' || (o.cargo === conta.cargo && o.seg === conta.seg)));
  }
  function mostrarFicha(conta) {
    const pr = pares(conta);
    const descPares = conta.grupo === 'candidato'
      ? `${conta.cargo ? cargoRot(conta.cargo) : t('perfis.mesmo_cargo')}, ${CAMPOS.includes(conta.seg) ? segCurto(conta.seg) : t('perfis.mesmo_campo')}`
      : t(`grupo.${conta.grupo}`);
    const comp = k => {
      const mp = mediana(pr.map(o => o[k]));
      if (mp == null) return null;
      if (conta[k] == null) return t('perfis.pares', { v: fmt.cp(mp) });
      return t('perfis.pares_x', { v: fmt.cp(mp), x: nf1.format(conta[k] / mp) });
    };
    ficha.replaceChildren();
    const c = cartao(ficha, {});
    c.classList.add('ficha');
    c.style.marginBottom = '16px';
    const fechar = h('button', { class: 'fechar', type: 'button', text: t('perfis.fechar') });
    fechar.addEventListener('click', () => { ficha.replaceChildren(); for (const x of document.querySelectorAll('tr.ativo')) x.classList.remove('ativo'); });
    const meta = h('div', { class: 'meta' });
    if (CAMPOS.includes(conta.seg)) meta.append(h('span', { class: 'chave-ponto', style: `background:${CORES[conta.seg]}` }), segRot(conta.seg), ' · ');
    meta.append([conta.cargo ? cargoRot(conta.cargo) : grupo1(conta.grupo), conta.uf, conta.partido,
      conta.lado7 && rotuloDe('lado', conta.lado7), conta.genero && rotuloDe('tse', conta.genero).toLowerCase()].filter(Boolean).join(' · '));
    c.append(h('div', { class: 'ficha-cab' },
      h('div', {}, h('h2', { text: conta.nome || conta.usuario }),
        h('div', { class: 'meta' }, h('a', { href: `https://www.instagram.com/${encodeURIComponent(conta.usuario)}/`, target: '_blank', rel: 'noopener noreferrer', text: '@' + conta.usuario })), meta),
      fechar));
    kpis(c, [
      { rot: t('posts'), val: fmt.int(conta.posts), det: t('perfis.dias_post', { n: fmt.int(conta.dias_ativos) }) },
      { rot: t('perfis.ord_curtidas'), val: fmt.int(conta.med_curtidas), det: comp('med_curtidas') },
      { rot: t('perfis.ord_comentarios'), val: fmt.int(conta.med_comentarios), det: comp('med_comentarios') },
      { rot: t('perfis.ord_views'), val: fmt.cp(conta.med_views), det: comp('med_views') },
    ]);
    c.append(h('div', { class: 'nota', text: t('perfis.pares_nota', { n: fmt.int(pr.length), desc: descPares }) }));
    const duas = h('div', { class: 'grade duas', style: 'margin-top:12px' });
    c.append(duas);
    const bloco1 = h('div'), bloco2 = h('div');
    duas.append(bloco1, bloco2);
    bloco1.append(h('div', { class: 'subtitulo', text: t('perfis.por_semana') }));
    const f1 = h('div', { class: 'fig' }); bloco1.append(f1);
    observar(f1, (el, w) => colunas(el, w, { rot: D.meta.semanas.map(sm => semanaCurta(sm.inicio)), v: conta.por_semana, rotDica: i => t('semana_de', { s: rotSemana(D.meta.semanas[i].inicio, D.meta.semanas[i].fim) }) }));
    bloco2.append(h('div', { class: 'subtitulo', text: t('perfis.formatos') }));
    const f2 = h('div', { class: 'fig' }); bloco2.append(f2);
    observar(f2, (el, w) => barras(el, w, {
      fmt: fmt.pct, max: 1,
      linhas: FORMATOS.map(k => { const rot = t(`formato.${k}`); return { rot, v: conta[k] / conta.posts, dica: { titulo: rot, linhas: [{ rot: t('posts'), val: fmt.int(conta[k]) }, { rot: t('parcela'), val: fmt.pct(conta[k] / conta.posts) }] } }; }),
    }));
    if (conta.temas) {
      c.append(h('div', { class: 'subtitulo', text: t('perfis.temas') }));
      const f3 = h('div', { class: 'fig' }); c.append(f3);
      const refs = temas.map((_, i) => mediana(pr.filter(o => o.temas).map(o => o.temas[i])));
      observar(f3, (el, w) => barras(el, w, {
        fmt: fmt.pct,
        linhas: temas.map((tm, i) => ({ rot: temaRot(tm), v: conta.temas[i], ref: refs[i], dica: { titulo: temaRot(tm), linhas: [{ rot: t('perfis.esta'), val: fmt.pct(conta.temas[i]) }, { rot: t('perfis.med_pares'), val: fmt.pct(refs[i]) }] } })),
      }));
      c.append(h('div', { class: 'nota', text: t('perfis.temas_nota') }));
    }
    if (conta.hashtags.length) {
      c.append(h('div', { class: 'subtitulo', text: t('perfis.hashtags') }));
      c.append(h('div', { class: 'chips' }, conta.hashtags.map(([tg, n]) => h('span', { class: 'chip', text: `#${tg} · ${fmt.int(n)}` }))));
    }
    ficha.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  desenhar();
}

// ---------------------------------------------------------------- engajamento
function abaEngajamento(p) {
  const E = D.engajamento;
  const semanasBase = D.meta.semanas.filter(sm => sm.fonte !== 'provisoria');
  const est = { m: 'curtidas', cargo: 'todos', semana: semanasBase.at(-1)?.inicio };
  const filtros = h('div', { class: 'filtros' });
  filtros.append(
    seletor(t('eng.metrica'), opcoes(METRICAS, 'metrica'), est.m, v => { est.m = v; desenhar(); }),
    seletor(t('cargo'), opcoes(CARGOS, 'cargo'), est.cargo, v => { est.cargo = v; desenhar(); }),
    seletor(t('eng.semana'), semanasBase.map(sm => [sm.inicio, rotSemana(sm.inicio, sm.fim)]), est.semana, v => { est.semana = v; desenhar(); }));
  p.append(filtros);
  aviso(p, t('eng.aviso'));
  const alvo = h('div');
  p.append(alvo);

  function desenhar() {
    alvo.replaceChildren();
    const m = est.m, mr = t(`metrica.${m}`).toLowerCase();
    const cargoMin = cargoRot(est.cargo).toLowerCase();
    const segs = CAMPOS;  // partidos e veículos têm outra escala (contas nacionais): ficam na tabela
    const segsTabela = est.cargo === 'todos' ? SEGMENTOS : CAMPOS;
    const linhaSeg = (r, seg) => ({
      rot: segRot(seg), cor: CORES[seg], chave: true, v: r ? r[`med_${m}`] : null,
      iqr: r && r[`p25_${m}`] != null ? [r[`p25_${m}`], r[`p75_${m}`]] : null,
      dica: r ? {
        titulo: segRot(seg), linhas: [{ rot: t('mediana'), val: fmt.int(r[`med_${m}`]) }, { rot: t('eng.quartis'), val: t('intervalo', { a: fmt.int(r[`p25_${m}`]), b: fmt.int(r[`p75_${m}`]) }) },
          { rot: t('posts'), val: fmt.int(r[`n_${m}`]) }], extra: t('eng.idade', { d: nf1.format(r.idade_med / 24) }),
      } : { titulo: segRot(seg), linhas: [], extra: t('menos10') },
    });
    const daSemana = E.por_semana.filter(r => r.semana === est.semana && r.cargo_g === est.cargo);
    grafico(alvo, {
      titulo: t('eng.g1', { m: mr, s: semanaRot(est.semana) }),
      legenda: t('eng.g1_leg', { cargo: cargoMin }), nota: t('eng.g1_nota'),
      desenhar: (el, w) => barras(el, w, { linhas: segs.map(seg => linhaSeg(daSemana.find(r => r.seg === seg), seg)) }),
      tabela: () => ({
        cols: [{ rot: t('semana') }, { rot: t('eng.segmento') }, { rot: t('posts'), n: true }, { rot: t('mediana'), n: true }, { rot: t('eng.q1'), n: true }, { rot: t('eng.q3'), n: true }, { rot: t('eng.idade_col'), n: true }],
        linhas: E.por_semana.filter(r => r.cargo_g === est.cargo && segsTabela.includes(r.seg)).map(r => [semanaRot(r.semana), segRot(r.seg), fmt.int(r[`n_${m}`]), fmt.int(r[`med_${m}`]), fmt.int(r[`p25_${m}`]), fmt.int(r[`p75_${m}`]), fmt.dec(r.idade_med / 24)]),
      }),
    });
    const duas = h('div', { class: 'grade duas', style: 'margin-top:16px' });
    alvo.append(duas);
    const formatos = FORMATOS.filter(f => f !== 'story');
    grafico(duas, {
      titulo: t('eng.g2', { m: mr }), legenda: t('eng.g2_leg', { cargo: cargoMin }), nota: t('eng.g2_nota'),
      desenhar: (el, w) => barras(el, w, {
        linhas: formatos.flatMap(f => segs.map(seg => {
          const frot = t(`formato.${f}`);
          const r = E.por_formato.find(x => x.formato === f && x.cargo_g === est.cargo && x.seg === seg);
          return { grupo: frot, rot: segCurto(seg), cor: CORES[seg], chave: true, v: r ? r[`med_${m}`] : null, dica: { titulo: `${frot} · ${segRot(seg)}`, linhas: [{ rot: t('mediana'), val: fmt.int(r?.[`med_${m}`]) }, { rot: t('posts'), val: fmt.int(r?.[`n_${m}`]) }] } };
        })),
      }),
      tabela: () => ({
        cols: [{ rot: t('eng.formato') }, { rot: t('eng.segmento') }, { rot: t('posts'), n: true }, { rot: t('mediana'), n: true }],
        linhas: E.por_formato.filter(r => r.cargo_g === est.cargo && segsTabela.includes(r.seg) && r.formato !== 'story').map(r => [t(`formato.${r.formato}`), segRot(r.seg), fmt.int(r[`n_${m}`]), fmt.int(r[`med_${m}`])]),
      }),
    });
    const faixasIdade = ['0–2 h', '2–4 h', '4–8 h', '8–12 h', '12–24 h'];
    const serieHoras = CAMPOS.map(c => ({ rot: segRot(c), curto: segCurto(c), cor: CORES[c], v: faixasIdade.map(f => E.primeiras_horas.find(r => r.faixa === f && r.seg === c)?.[`med_${m}`] ?? null) }));
    const semViews = serieHoras.every(se => se.v.every(v => v == null));
    grafico(duas, {
      titulo: t('eng.g3', { m: mr }), legenda: t('eng.g3_leg'),
      itens: semViews ? null : serieHoras, nota: semViews ? t('eng.g3_sem_views') : null,
      desenhar: (el, w) => semViews ? el.append(h('p', { class: 'nota', text: t('eng.g3_vazio') })) :
        linhas(el, w, { x: faixasIdade, series: serieHoras, pontos: true, altura: 240, rotFim: false }),
      tabela: semViews ? null : () => ({ cols: [{ rot: t('eng.idade_curta') }, ...serieHoras.map(se => ({ rot: se.curto, n: true }))], linhas: faixasIdade.map((f, i) => [f, ...serieHoras.map(se => fmt.int(se.v[i]))]) }),
    });
    const horas = [...Array(24).keys()];
    const serieHora = CAMPOS.map(c => {
      const tot = soma(E.horas.filter(r => r.seg === c).map(r => r.n));
      return { rot: segRot(c), curto: segCurto(c), cor: CORES[c], v: horas.map(hh => (E.horas.find(r => r.seg === c && r.hora_brt === hh)?.n || 0) / (tot || 1)) };
    });
    const c2 = h('div', { style: 'margin-top:16px' });
    alvo.append(c2);
    grafico(c2, {
      titulo: t('eng.g4'), legenda: t('eng.g4_leg'), itens: serieHora,
      desenhar: (el, w) => linhas(el, w, { x: horas, xFmt: v => `${v}h`, series: serieHora, yFmt: v => fmt.pct(v), altura: 220 }),
      tabela: () => ({ cols: [{ rot: t('eng.hora') }, ...serieHora.map(se => ({ rot: se.curto, n: true }))], linhas: horas.map(hh => [`${hh}h`, ...serieHora.map(se => fmt.pct(se.v[hh]))]) }),
    });
  }
  desenhar();
}

// ---------------------------------------------------------------- temas e menções
function abaTemas(p) {
  const T = D.temas;
  const temaRot = tm => rotuloDe('tema', tm.chave, tm.rotulo);
  const alvoRot = a => rotuloDe('alvo', a.chave, a.rotulo);
  const semanas = [['todas', t('todas_semanas')], ...D.meta.semanas.map(sm => [sm.inicio, rotSemana(sm.inicio, sm.fim)])];
  const est = { semana: 'todas', alvo: 'lula', seg: 'lula' };
  const filtros = h('div', { class: 'filtros' });
  filtros.append(
    seletor(t('semana'), semanas, est.semana, v => { est.semana = v; desenhar(); }),
    seletor(t('temas.alvo'), T.alvos.map(a => [a.chave, alvoRot(a)]), est.alvo, v => { est.alvo = v; desenhar(); }),
    seletor(t('temas.hashtags_de'), SEGMENTOS.map(sg => [sg, segRot(sg)]), est.seg, v => { est.seg = v; desenhar(); }));
  p.append(filtros);
  aviso(p, t('temas.aviso'));
  const alvo = h('div');
  p.append(alvo);
  const colunasSeg = SEGMENTOS.map(sg => ({ id: sg, rot: segCurto(sg), cor: CAMPOS.includes(sg) ? CORES[sg] : null }));
  const reg = (sem, sg) => T.contagens.find(r => r.semana === sem && r.seg === sg);

  function desenhar() {
    alvo.replaceChildren();
    const duas = h('div', { class: 'grade duas' });
    alvo.append(duas);
    const mapa = (titulo, legenda, lista, pref, rotular) => grafico(duas, {
      titulo, legenda,
      desenhar: (el, w) => calor(el, w, {
        linhas: lista.map(x => ({ id: x.chave, rot: rotular(x) })), colunas: colunasSeg,
        valor: (l, c) => { const r = reg(est.semana, c.id); return r && r.total ? r[`${pref}_${l.id}`] / r.total : null; },
        dica: (l, c) => { const r = reg(est.semana, c.id); return { titulo: `${l.rot} · ${segRot(c.id)}`, linhas: [{ rot: t('temas.citam'), val: fmt.int(r?.[`${pref}_${l.id}`]) }, { rot: t('temas.no_seg'), val: fmt.int(r?.total) }] }; },
      }),
      tabela: () => ({ cols: [{ rot: '' }, ...colunasSeg.map(c => ({ rot: c.rot, n: true }))], linhas: lista.map(x => [rotular(x), ...colunasSeg.map(c => { const r = reg(est.semana, c.id); return r ? fmt.pct(r[`${pref}_${x.chave}`] / r.total) : '—'; })]) }),
    });
    mapa(t('temas.mapa_temas', { s: semanaRot(est.semana) }), t('temas.mapa_temas_leg'), T.temas, 'tema', temaRot);
    mapa(t('temas.mapa_alvos', { s: semanaRot(est.semana) }), t('temas.mapa_alvos_leg'), T.alvos, 'alvo', alvoRot);

    const nomeAlvo = alvoRot(T.alvos.find(a => a.chave === est.alvo));
    const sems = D.meta.semanas;
    const serie = [...CAMPOS, 'veiculo'].map(sg => ({
      rot: segRot(sg), curto: segCurto(sg), cor: CORES[sg],
      v: sems.map(sm => { const r = reg(sm.inicio, sg); return r && r.total ? r[`alvo_${est.alvo}`] / r.total : null; }),
    })).filter(se => se.v.some(v => v != null));
    const dois = h('div', { class: 'grade duas', style: 'margin-top:16px' });
    alvo.append(dois);
    grafico(dois, {
      titulo: t('temas.linha', { a: nomeAlvo }), legenda: t('temas.linha_leg'),
      itens: serie.slice(0, 4), nota: t('temas.linha_nota'),
      desenhar: (el, w) => linhas(el, w, { x: sems.map(sm => sm.inicio), xFmt: semanaCurta, xDica: ini => t('semana_de', { s: semanaRot(ini) }), series: serie, yFmt: v => fmt.pct(v), pontos: true, altura: 240, rotFim: false }),
      tabela: () => ({ cols: [{ rot: t('semana') }, ...serie.map(se => ({ rot: se.curto, n: true }))], linhas: sems.map((sm, i) => [rotSemana(sm.inicio, sm.fim), ...serie.map(se => fmt.pct(se.v[i]))]) }),
    });
    const tags = D.hashtags.filter(r => r.semana === est.semana && r.seg === est.seg);
    grafico(dois, {
      titulo: t('temas.tags', { seg: segRot(est.seg) }), legenda: t('temas.tags_leg', { s: semanaRot(est.semana) }),
      desenhar: (el, w) => tags.length ? barras(el, w, { linhas: tags.map(tg => ({ rot: '#' + tg.hashtag, v: tg.n, dica: { titulo: '#' + tg.hashtag, linhas: [{ rot: t('posts'), val: fmt.int(tg.n) }] } })) })
        : el.append(h('p', { class: 'nota', text: t('temas.tags_vazio') })),
      tabela: () => ({ cols: [{ rot: 'Hashtag' }, { rot: t('posts'), n: true }], linhas: tags.map(tg => ['#' + tg.hashtag, fmt.int(tg.n)]) }),
    });
  }
  desenhar();
}

// ---------------------------------------------------------------- conversa pública
function abaConversa(p) {
  const C = D.conversa;
  if (!C) { aviso(p, t('conv.vazio')); return; }
  const tot = soma(C.semanas.map(sm => sm.posts));
  kpis(p, [
    { rot: t('conv.k_posts'), val: fmt.int(tot), det: t('conv.k_posts_det') },
    { rot: t('geral.k_semanas'), val: fmt.int(C.semanas.length), det: C.semanas.map(sm => semanaRot(sm.semana)).join(' · ') },
    { rot: t('conv.k_contas'), val: fmt.cp(mediana(C.semanas.map(sm => sm.contas))), det: t('conv.k_contas_det') },
  ]);
  aviso(p, t('conv.aviso'));
  const x = C.dias;
  grafico(p, {
    titulo: t('conv.g1'), legenda: t('conv.g1_leg'),
    desenhar: (el, w) => linhas(el, w, { x, xFmt: dm, series: [{ rot: t('posts'), cor: 'var(--c-dado)', v: C.total }], altura: 220, rotFim: false }),
    tabela: () => ({ cols: [{ rot: t('dia') }, { rot: t('posts'), n: true }], linhas: x.map((d, i) => [dm(d), fmt.int(C.total[i])]) }),
  });
  p.append(h('div', { class: 'secao-titulo', text: t('conv.por_consulta') }));
  const grade = h('div', { class: 'grade duas' });
  p.append(grade);
  for (const q of C.consultas) {
    const v = C.por_consulta[q.chave];
    if (!v) continue;
    grafico(grade, {
      titulo: `${q.chave} · ${rotuloDe('consulta', q.chave, q.rotulo)}`,
      desenhar: (el, w) => linhas(el, w, { x, xFmt: dm, series: [{ rot: q.chave, cor: 'var(--c-dado)', v }], altura: 170, rotFim: false }),
      tabela: () => ({ cols: [{ rot: t('dia') }, { rot: t('posts'), n: true }], linhas: x.map((d, i) => [dm(d), fmt.int(v[i])]) }),
    });
  }
  const semanas = C.semanas.map(sm => [sm.semana, semanaRot(sm.semana)]);
  const est = { semana: semanas.at(-1)[0] };
  const filtros = h('div', { class: 'filtros', style: 'margin-top:24px' });
  filtros.append(seletor(t('semana'), semanas, est.semana, v => { est.semana = v; desenhar(); }));
  p.append(filtros);
  const alvo = h('div', { class: 'grade duas' });
  p.append(alvo);
  function desenhar() {
    alvo.replaceChildren();
    const termos = C.termos.filter(r => r.semana === est.semana);
    grafico(alvo, {
      titulo: t('conv.termos'), legenda: t('conv.termos_leg'),
      desenhar: (el, w) => barras(el, w, { linhas: termos.map(tm => ({ rot: tm.termo, v: tm.n, dica: { titulo: tm.termo, linhas: [{ rot: t('posts'), val: fmt.int(tm.n) }] } })) }),
      tabela: () => ({ cols: [{ rot: t('conv.termo') }, { rot: t('posts'), n: true }], linhas: termos.map(tm => [tm.termo, fmt.int(tm.n)]) }),
    });
    const tags = C.hashtags.filter(r => r.semana === est.semana);
    grafico(alvo, {
      titulo: t('conv.tags'), legenda: t('conv.tags_leg'),
      desenhar: (el, w) => barras(el, w, { linhas: tags.map(tg => ({ rot: '#' + tg.hashtag, v: tg.n, dica: { titulo: '#' + tg.hashtag, linhas: [{ rot: t('posts'), val: fmt.int(tg.n) }] } })) }),
      tabela: () => ({ cols: [{ rot: 'Hashtag' }, { rot: t('posts'), n: true }], linhas: tags.map(tg => ['#' + tg.hashtag, fmt.int(tg.n)]) }),
    });
  }
  desenhar();
}

// ---------------------------------------------------------------- anúncios
function abaAnuncios(p) {
  const A = D.anuncios;
  if (!A) { aviso(p, t('ads.vazio')); return; }
  const T = A.total;
  const baixado = A.baixado_em ? dm(`${A.baixado_em.slice(0, 4)}-${A.baixado_em.slice(4, 6)}-${A.baixado_em.slice(6, 8)}`) : '';
  const faixaReais = (a, b) => t('intervalo', { a: fmt.reais(a), b: fmt.cp(b) });
  kpis(p, [
    { rot: t('ads.anuncios'), val: fmt.int(T.n), det: t('ads.paginas', { n: fmt.int(T.paginas) }) },
    { rot: t('ads.gasto'), val: faixaReais(T.gasto_min, T.gasto_max), det: t('ads.gasto_det') },
    { rot: t('ads.impressoes'), val: t('intervalo', { a: fmt.cp(T.imp_min), b: fmt.cp(T.imp_max) }), det: T.imp_sem_teto ? t('ads.imp_sem_teto', { n: fmt.int(T.imp_sem_teto) }) : t('ads.imp_det') },
    { rot: t('ads.citam'), val: fmt.pct(T.cita_lula / T.n), det: t('ads.citam_det') },
    { rot: t('ads.casados'), val: fmt.pct(A.casados / T.n), det: t('ads.casados_det') },
  ]);
  aviso(p, t('ads.aviso', { b: A.busca, d: baixado, ini: dm('2026-08-16') }));
  const segs = [...CAMPOS, 'sem_casamento'];
  const duas = h('div', { class: 'grade duas' });
  p.append(duas);
  const faixaDica = (rot, r) => ({ titulo: rot, linhas: [{ rot: t('ads.anuncios'), val: fmt.int(r.n) }, { rot: t('ads.gasto_curto'), val: t('intervalo', { a: fmt.reais(r.gasto_min), b: fmt.reais(r.gasto_max) }) }, { rot: t('ads.impressoes'), val: t('intervalo', { a: fmt.cp(r.imp_min), b: fmt.cp(r.imp_max) }) }, { rot: t('ads.citam_lula'), val: fmt.pct(r.cita_lula / r.n) }] });
  const porSeg = segs.map(sg => A.por_seg.find(r => r.seg === sg)).filter(Boolean);
  grafico(duas, {
    titulo: t('ads.g1'), legenda: t('ads.g1_leg'),
    desenhar: (el, w) => barras(el, w, {
      faixa: true, fmt: fmt.reais, rotFaixa: r => faixaReais(r.lo, r.hi),
      linhas: porSeg.map(r => ({ rot: segRot(r.seg), cor: CORES[r.seg], chave: true, lo: r.gasto_min, hi: r.gasto_max, dica: faixaDica(segRot(r.seg), r) })),
    }),
    tabela: () => ({ cols: [{ rot: t('campo') }, { rot: t('ads.anuncios'), n: true }, { rot: t('ads.paginas_col'), n: true }, { rot: t('ads.gasto_min'), n: true }, { rot: t('ads.gasto_max'), n: true }, { rot: t('ads.citam_lula'), n: true }],
      linhas: A.por_seg.map(r => [segRot(r.seg), fmt.int(r.n), fmt.int(r.paginas), fmt.reais(r.gasto_min), fmt.reais(r.gasto_max), fmt.pct(r.cita_lula / r.n)]) }),
  });
  grafico(duas, {
    titulo: t('ads.g2'), legenda: t('ads.g2_leg'),
    desenhar: (el, w) => barras(el, w, {
      fmt: fmt.pct, max: 1,
      linhas: porSeg.map(r => ({ rot: segRot(r.seg), cor: CORES[r.seg], chave: true, v: r.cita_lula / r.n, sub: t('ads.n_anuncios', { n: fmt.int(r.n) }), dica: faixaDica(segRot(r.seg), r) })),
    }),
  });
  const dias = [...new Set(A.por_dia.map(r => r.ad_delivery_start_time))].sort();
  const serieDia = CAMPOS.map(c => ({ rot: segRot(c), curto: segCurto(c), cor: CORES[c], v: dias.map(d => A.por_dia.find(r => r.ad_delivery_start_time === d && r.seg === c)?.n || 0) }));
  const c1 = h('div', { style: 'margin-top:16px' });
  p.append(c1);
  grafico(c1, {
    titulo: t('ads.g3'), legenda: t('ads.g3_leg'), itens: serieDia,
    desenhar: (el, w) => linhas(el, w, { x: dias, xFmt: dm, series: serieDia, altura: 240 }),
    tabela: () => ({ cols: [{ rot: t('dia') }, ...serieDia.map(se => ({ rot: se.curto, n: true }))], linhas: dias.map((d, i) => [dm(d), ...serieDia.map(se => fmt.int(se.v[i]))]) }),
  });
  const dois = h('div', { class: 'grade duas', style: 'margin-top:16px' });
  p.append(dois);
  grafico(dois, {
    titulo: t('ads.g4'),
    desenhar: (el, w) => barras(el, w, {
      faixa: true, fmt: fmt.reais, rotFaixa: r => faixaReais(r.lo, r.hi),
      linhas: A.por_cargo.slice().sort((a, b) => b.gasto_max - a.gasto_max).map(r => ({ rot: cargoRot(r.cargo_g), lo: r.gasto_min, hi: r.gasto_max, dica: faixaDica(cargoRot(r.cargo_g), r) })),
    }),
    tabela: () => ({ cols: [{ rot: t('cargo') }, { rot: t('ads.anuncios'), n: true }, { rot: t('ads.gasto_min'), n: true }, { rot: t('ads.gasto_max'), n: true }], linhas: A.por_cargo.map(r => [cargoRot(r.cargo_g), fmt.int(r.n), fmt.reais(r.gasto_min), fmt.reais(r.gasto_max)]) }),
  });
  grafico(dois, {
    titulo: t('ads.g5'),
    desenhar: (el, w) => barras(el, w, { linhas: A.plataformas.map(r => { const rot = rotuloDe('plataforma', r.plataformas); return { rot, v: r.n, dica: { titulo: rot, linhas: [{ rot: t('ads.anuncios'), val: fmt.int(r.n) }] } }; }) }),
  });

  const ct = cartao(p, { titulo: t('ads.top'), legenda: t('ads.top_leg') });
  ct.style.marginTop = '16px';
  ct.append(tabelaEl([{ rot: t('ads.pagina') }, { rot: t('perfis.col_cargo') }, { rot: t('partido') }, { rot: t('campo') }, { rot: t('ads.anuncios'), n: true }, { rot: t('ads.gasto_curto'), n: true }, { rot: t('ads.impressoes'), n: true }, { rot: t('ads.citam_lula'), n: true }],
    A.top_paginas.map(r => [r.page_name, [r.cargo ? cargoRot(r.cargo) : '', r.uf].filter(Boolean).join(' · '), r.partido || '—', r.seg ? segCurto(r.seg) : '—', fmt.int(r.n), faixaReais(r.gasto_min, r.gasto_max), t('intervalo', { a: fmt.cp(r.imp_min), b: fmt.cp(r.imp_max) }), fmt.pct(r.cita_lula / r.n)])));

  const est = { seg: 'todos' };
  const filtros = h('div', { class: 'filtros', style: 'margin-top:24px' });
  filtros.append(seletor(t('ads.publico_de'), [['todos', t('ads.todos')], ...segs.map(sg => [sg, segRot(sg)])], est.seg, v => { est.seg = v; desenharPublico(); }));
  p.append(filtros);
  const alvo = h('div', { class: 'grade duas' });
  p.append(alvo);
  function desenharPublico() {
    alvo.replaceChildren();
    const demo = A.demografia.filter(r => r.seg === est.seg);
    const idades = [...new Set(demo.map(r => r.idade))].filter(i => i !== 'Unknown').sort();
    const generos = ['female', 'male', 'unknown'].map(g => [g, t(`publico.${g}`)]);
    grafico(alvo, {
      titulo: t('ads.g6'), legenda: t('ads.g6_leg'),
      desenhar: (el, w) => calor(el, w, {
        linhas: idades.map(i => ({ id: i, rot: i })), colunas: generos.map(([id, rot]) => ({ id, rot })),
        valor: (l, c) => demo.find(r => r.idade === l.id && r.genero === c.id)?.parcela ?? null,
        dica: (l, c) => ({ titulo: `${l.rot} · ${c.rot}`, linhas: [{ rot: t('ads.impressoes'), val: fmt.pct(demo.find(r => r.idade === l.id && r.genero === c.id)?.parcela) }] }),
      }),
      tabela: () => ({ cols: [{ rot: t('eng.idade_curta') }, ...generos.map(([, rot]) => ({ rot, n: true }))], linhas: idades.map(i => [i, ...generos.map(([g]) => fmt.pct(demo.find(r => r.idade === i && r.genero === g)?.parcela))]) }),
    });
    const reg = A.regioes.filter(r => r.seg === est.seg).sort((a, b) => b.parcela - a.parcela);
    const ufRot = uf => rotuloDe('regiao', uf);
    grafico(alvo, {
      titulo: t('ads.g7'), legenda: t('ads.g7_leg'),
      desenhar: (el, w) => barras(el, w, { fmt: fmt.pct, linhas: reg.map(r => ({ rot: ufRot(r.uf), v: r.parcela, dica: { titulo: ufRot(r.uf), linhas: [{ rot: t('ads.impressoes'), val: fmt.pct(r.parcela) }] } })) }),
      tabela: () => ({ cols: [{ rot: t('uf') }, { rot: t('ads.impressoes'), n: true }], linhas: reg.map(r => [ufRot(r.uf), fmt.pct(r.parcela)]) }),
    });
  }
  desenharPublico();
}

// ---------------------------------------------------------------- cobertura e método
function abaMetodo(p) {
  const C = D.cobertura;
  const rot = g => rotuloDe('tse', g, g.charAt(0) + g.slice(1).toLowerCase());
  const bloco = (pai, titulo, legenda, lista) => grafico(pai, {
    titulo, legenda, nota: t('met.nota'),
    desenhar: (el, w) => barras(el, w, {
      fmt: fmt.pct, max: 1,
      linhas: lista.filter(r => r.registrados >= 10).map(r => ({
        rot: rot(r.grupo), v: r.no_censo / r.registrados, ref: r.com_instagram / r.registrados, sub: fmt.int(r.registrados),
        dica: { titulo: rot(r.grupo), linhas: [{ rot: t('met.registradas'), val: fmt.int(r.registrados) }, { rot: t('met.declarado'), val: fmt.int(r.com_instagram) }, { rot: t('met.no_censo'), val: fmt.int(r.no_censo) }] },
      })),
    }),
    tabela: () => ({ cols: [{ rot: t('met.grupo') }, { rot: t('met.registradas'), n: true }, { rot: t('met.declarado'), n: true }, { rot: t('met.no_censo'), n: true }],
      linhas: lista.map(r => [rot(r.grupo), fmt.int(r.registrados), fmt.int(r.com_instagram), fmt.int(r.no_censo)]) }),
  });
  const tot = { registrados: soma(C.cargo.map(r => r.registrados)), no_censo: soma(C.cargo.map(r => r.no_censo)) };
  kpis(p, [
    { rot: t('met.k_reg'), val: fmt.int(tot.registrados), det: t('met.k_reg_det') },
    { rot: t('met.k_censo'), val: fmt.int(tot.no_censo), det: t('met.k_censo_det', { p: fmt.pct(tot.no_censo / tot.registrados) }) },
  ]);
  bloco(p, t('met.cargo'), t('met.cargo_leg'), C.cargo);
  const g2 = h('div', { class: 'grade duas', style: 'margin-top:16px' });
  p.append(g2);
  bloco(g2, t('met.genero'), t('met.genero_leg'), C.genero);
  bloco(g2, t('met.raca'), t('met.raca_leg'), C.raca);

  const tx = h('div', { class: 'cartao texto', style: 'margin-top:16px' });
  p.append(tx);
  for (const [tit, corpo] of TEXTOS[LANG].metodo || TEXTOS.pt.metodo) {
    tx.append(h('h3', { text: tit }));
    tx.append(Array.isArray(corpo) ? h('ul', {}, corpo.map(i => h('li', { text: i }))) : h('p', { text: corpo }));
  }
}

iniciar().catch(e => { const erro = $('#erro'); if (erro) erro.textContent = t('erro.iniciar', { msg: e.message }); });
})();
