/* BRPOL 2026 — painel. Sem dependências: os dados chegam cifrados (dados.bin) e são abertos no navegador. */
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
const nf = new Intl.NumberFormat('pt-BR');
const nf1 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
const ncp = new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 });
const fmt = {
  int: v => v == null ? '—' : nf.format(Math.round(v)),
  dec: v => v == null ? '—' : nf1.format(v),
  cp: v => v == null ? '—' : (Math.abs(v) < 1000 ? nf.format(Math.round(v)) : ncp.format(v)),
  pct: v => v == null ? '—' : nf1.format(v * 100) + '%',
  reais: v => v == null ? '—' : 'R$ ' + (Math.abs(v) < 1000 ? nf.format(Math.round(v)) : ncp.format(v)),
};
const dm = iso => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
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
function armazenar(chave, valor) { try { valor == null ? localStorage.removeItem(chave) : localStorage.setItem(chave, valor); } catch (e) { /* sem armazenamento */ } }
function ler(chave) { try { return localStorage.getItem(chave); } catch (e) { return null; } }

// ---------------------------------------------------------------- vocabulário
const SEG = {
  lula: { rot: 'Coligação de Lula', curto: 'Lula', cor: 'var(--c-lula)' },
  pl: { rot: 'Coligação do PL', curto: 'PL', cor: 'var(--c-pl)' },
  outra_presidencial: { rot: 'Outras candidaturas presidenciais', curto: 'Outras presid.', cor: 'var(--c-outra)' },
  sem_presidencial: { rot: 'Partidos sem candidato a presidente', curto: 'Sem presid.', cor: 'var(--c-sem)' },
  partido: { rot: 'Contas de partidos', curto: 'Partidos', cor: 'var(--c-outros)' },
  veiculo: { rot: 'Veículos de notícia', curto: 'Veículos', cor: 'var(--c-outros)' },
  sem_casamento: { rot: 'Sem casamento com o TSE', curto: 'Sem casamento', cor: 'var(--c-outros)' },
  sem_campo: { rot: 'Candidatos sem campo', curto: 'Sem campo', cor: 'var(--c-outros)' },
};
const CAMPOS = ['lula', 'pl', 'outra_presidencial', 'sem_presidencial'];
const SEGMENTOS = [...CAMPOS, 'partido', 'veiculo'];
const CARGOS = [['todos', 'Todos os cargos'], ['presidente', 'Presidente'], ['governador', 'Governador'],
  ['senador', 'Senador'], ['dep_federal', 'Deputado federal'], ['dep_estadual', 'Deputado estadual ou distrital']];
const CARGO_ROT = Object.fromEntries(CARGOS);
const METRICAS = [['curtidas', 'Curtidas'], ['comentarios', 'Comentários'], ['views', 'Visualizações']];
const METRICA_ROT = Object.fromEntries(METRICAS);
const FORMATOS = [['video', 'Vídeo'], ['foto', 'Foto'], ['carrossel', 'Carrossel'], ['story', 'Story']];
const FORMATO_ROT = Object.fromEntries(FORMATOS);
const GRUPOS = [['todos', 'Todos'], ['candidato', 'Candidatos'], ['partido', 'Partidos'],
  ['veiculo_nacional', 'Veículos nacionais'], ['veiculo_regional', 'Veículos regionais']];
const GRUPO_ROT = Object.fromEntries(GRUPOS);
const GRUPO_UM = { candidato: 'Candidato', partido: 'Partido', veiculo_nacional: 'Veículo nacional', veiculo_regional: 'Veículo regional' };

let D = null;          // dados abertos
let semanaRot = {};    // início da semana -> rótulo

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
  if (!r.ok) throw new Error('Arquivo de dados não encontrado.');
  const buf = new Uint8Array(await r.arrayBuffer());
  if (buf.length < 40 || MAGICO.some((b, i) => buf[i] !== b)) throw new Error('Arquivo de dados inválido.');
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
    erro.textContent = ''; botao.disabled = true; botao.textContent = 'Abrindo…';
    try {
      const chave = await derivar($('#senha').value, blob);
      const dados = await decifrar(blob, chave);
      if ($('#lembrar').checked) {
        armazenar(CHAVE_LS, JSON.stringify({ k: b64.de(await crypto.subtle.exportKey('raw', chave)), sal: hex(blob.sal) }));
      }
      abrirPainel(dados);
    } catch (e) {
      erro.textContent = e instanceof DOMException ? 'Senha incorreta.' : `Não foi possível abrir os dados (${e.message}).`;
      botao.disabled = false; botao.textContent = 'Abrir';
    }
  });
}

// ---------------------------------------------------------------- tema
function aplicarTema(t) {
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
  const b = $('#tema');
  if (b) b.textContent = { auto: 'Tema: automático', dark: 'Tema: escuro', light: 'Tema: claro' }[t];
  armazenar('brpol-tema', t);
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
const observador = new ResizeObserver(entradas => {
  for (const e of entradas) {
    const d = desenhos.get(e.target);
    const w = Math.round(e.contentRect.width);
    if (d && w > 0 && Math.abs(w - d.w) > 1) { d.w = w; e.target.replaceChildren(); d.fn(e.target, w); }
  }
});
function observar(el, fn) { desenhos.set(el, { fn, w: 0 }); observador.observe(el); }

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
      const b = h('button', { class: 'ver-tabela', type: 'button', text: 'Ver tabela' });
      b.addEventListener('click', () => {
        if (aberta) { aberta.remove(); aberta = null; b.textContent = 'Ver tabela'; return; }
        const t = tabela();
        aberta = h('div', { class: 'tabela-fig' }, tabelaEl(t.cols, t.linhas));
        c.append(aberta); b.textContent = 'Ocultar tabela';
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
function seletor(rotulo, opcoes, valor, aoMudar) {
  const sel = h('select', {}, opcoes.map(([v, r]) => h('option', { value: v, text: r })));
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
  for (const t of tk) {
    svg.append(s('line', { x1: m.l, x2: m.l + iw, y1: Y(t), y2: Y(t), class: t === 0 ? 'eixo' : 'grade-linha' }));
    svg.append(s('text', { x: m.l - 6, y: Y(t) + 4, 'text-anchor': 'end', class: 'num' }, (o.yFmt || fmt.cp)(t)));
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
  const alvo = s('rect', { x: m.l - passo / 2, y: m.t, width: iw + passo, height: ih, class: 'alvo', tabindex: 0, 'aria-label': 'Use as setas para percorrer os valores' });
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
      texto = o.rotFaixa ? o.rotFaixa(r) : `${f(r.lo)}–${f(r.hi)}`;
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
    const t = v == null ? 0 : v / (max || 1);
    const td = h('td', {
      class: t > 0.55 ? 'forte' : null, text: f(v),
      style: v == null ? 'background:var(--surface-2)' : `background:color-mix(in oklab, var(--c-dado) ${Math.round(6 + 84 * t)}%, var(--surface))`,
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
/** o: {rot:[], v:[], altura, fmt, rotDica} */
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
      const p = s('path', { d: caminhoColuna(x, m.t + ih - bh, bw, bh), style: 'fill:var(--c-dado)' });
      svg.append(p);
      if (i === imax || i === n - 1) svg.append(s('text', { x: x + bw / 2, y: m.t + ih - bh - 5, 'text-anchor': 'middle', class: 'rot-fim' }, (o.fmt || fmt.int)(v)));
    }
    svg.append(s('text', { x: x + bw / 2, y: H - 7, 'text-anchor': 'middle' }, o.rot[i]));
    const alvo = s('rect', { x: m.l + i * faixa, y: m.t, width: faixa, height: ih, fill: 'transparent' });
    comDica(alvo, () => ({ titulo: o.rotDica ? o.rotDica(i) : o.rot[i], linhas: [{ rot: o.serie || 'Posts', val: (o.fmt || fmt.int)(v) }] }));
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
  ['geral', 'Visão geral', abaGeral],
  ['perfis', 'Perfis', abaPerfis],
  ['engajamento', 'Engajamento', abaEngajamento],
  ['temas', 'Temas e menções', abaTemas],
  ['conversa', 'Conversa pública', abaConversa],
  ['anuncios', 'Anúncios', abaAnuncios],
  ['metodo', 'Cobertura e método', abaMetodo],
];
const montadas = {};
function mostrarAba(id) {
  if (!ABAS.some(a => a[0] === id)) id = 'geral';
  for (const b of document.querySelectorAll('nav.abas button')) b.setAttribute('aria-selected', String(b.dataset.aba === id));
  for (const [k, painel] of Object.entries(montadas)) painel.hidden = k !== id;
  if (!montadas[id]) {
    const painel = h('div', { role: 'tabpanel' });
    $('#conteudo').append(painel);
    montadas[id] = painel;
    ABAS.find(a => a[0] === id)[2](painel);
  }
  esconderDica();
  if (location.hash !== `#${id}`) history.replaceState(null, '', `#${id}`);
}

function abrirPainel(dados) {
  D = dados;
  D.contasObj = D.contas.linhas.map(l => Object.fromEntries(D.contas.colunas.map((c, i) => [c, l[i]])));
  for (const sem of D.meta.semanas) semanaRot[sem.inicio] = sem.rotulo;
  semanaRot.todas = 'Todas as semanas';
  $('#bloqueio').remove();
  $('#app').hidden = false;
  $('#sub').textContent = `Atualizado em ${D.meta.gerado_em.replace(/^(\d{4})-(\d\d)-(\d\d)/, '$3/$2/$1')} · posts de ${dm(D.meta.dados_de)} a ${dm(D.meta.dados_ate)} de 2026 · fase ${D.meta.fase}`;
  const nav = $('#abas');
  for (const [id, rot] of ABAS) {
    const b = h('button', { type: 'button', role: 'tab', 'data-aba': id, text: rot });
    b.addEventListener('click', () => mostrarAba(id));
    nav.append(b);
  }
  $('#tema').addEventListener('click', () => {
    const atual = ler('brpol-tema') || 'auto';
    aplicarTema({ auto: 'dark', dark: 'light', light: 'auto' }[atual]);
  });
  $('#sair').addEventListener('click', () => { armazenar(CHAVE_LS, null); location.reload(); });
  addEventListener('hashchange', () => mostrarAba(location.hash.slice(1)));
  mostrarAba(location.hash.slice(1) || 'geral');
}

// ---------------------------------------------------------------- visão geral
function abaGeral(p) {
  const M = D.meta, S = D.serie;
  const idx = iso => S.dias.indexOf(iso);
  const g = M.por_grupo;
  kpis(p, [
    { rot: 'Posts no censo', val: fmt.int(M.posts), det: 'únicos, de contas conferidas' },
    { rot: 'Contas', val: fmt.int(M.contas), det: `${fmt.int(g.candidato)} candidatos · ${fmt.int(g.partido || 0)} partidos · ${fmt.int((g.veiculo_nacional || 0) + (g.veiculo_regional || 0))} veículos` },
    { rot: 'Dias com coleta', val: fmt.int(S.dias.length - S.sem_coleta.length), det: `de ${S.dias.length}, de ${dm(S.dias[0])} a ${dm(S.dias.at(-1))}` },
    { rot: 'Semanas', val: fmt.int(M.semanas.length), det: M.semanas.map(s => s.rotulo).join(' · ') },
  ]);
  const semColeta = faixas(S.dias.map(d => S.sem_coleta.includes(d)));
  const prov = faixas(S.provisorio);
  if (semColeta.length || prov.length) {
    const partes = [];
    if (semColeta.length) partes.push(`Sem dados de ${semColeta.map(f => `${dm(S.dias[f.i0])} a ${dm(S.dias[f.i1])}`).join(' e ')}: a semana ainda não foi baixada.`);
    if (prov.length) partes.push(`De ${dm(S.dias[prov[0].i0])} em diante, os posts vêm da captura diária das 20h30 e ficam provisórios até a semanal.`);
    aviso(p, partes.join(' '));
  }
  const bandas = [...semColeta.map(f => ({ ...f, tipo: 'sem', rot: 'sem coleta' })), ...prov.map(f => ({ ...f, tipo: 'prov', rot: 'provisório' }))];
  const marcos = [['2026-08-16', 'propaganda'], ['2026-08-28', 'horário eleitoral'], ['2026-10-04', '1º turno'], ['2026-10-25', '2º turno']]
    .map(([d, rot]) => ({ i: idx(d), rot }));
  const series = CAMPOS.map(c => ({ rot: SEG[c].rot, curto: SEG[c].curto, cor: SEG[c].cor, v: S.segmentos[c] }));
  grafico(p, {
    titulo: 'Posts por dia das contas de candidatos, por campo',
    legenda: 'Campo é a coligação presidencial do partido do candidato (dados do TSE). Dia UTC da publicação.',
    itens: series, nota: 'Brasília é UTC−3: o dia UTC começa às 21h do dia anterior.',
    desenhar: (el, w) => linhas(el, w, { x: S.dias, xFmt: dm, series, bandas, marcos, altura: 280 }),
    tabela: () => ({ cols: [{ rot: 'Dia' }, ...series.map(se => ({ rot: se.curto, n: true }))], linhas: S.dias.map((d, i) => [dm(d), ...series.map(se => fmt.int(se.v[i]))]) }),
  });
  const duas = h('div', { class: 'grade duas', style: 'margin-top:16px' });
  p.append(duas);
  const veic = S.segmentos.veiculo;
  grafico(duas, {
    titulo: 'Posts por dia dos veículos de notícia',
    legenda: 'Veículos nacionais e regionais do censo.',
    desenhar: (el, w) => linhas(el, w, { x: S.dias, xFmt: dm, series: [{ rot: 'Veículos', cor: 'var(--c-dado)', v: veic }], bandas, altura: 200, rotFim: false }),
    tabela: () => ({ cols: [{ rot: 'Dia' }, { rot: 'Posts', n: true }], linhas: S.dias.map((d, i) => [dm(d), fmt.int(veic[i])]) }),
  });
  grafico(duas, {
    titulo: 'Contas de candidatos que publicaram no dia',
    legenda: 'Quantas contas de candidatos do censo tiveram ao menos um post.',
    desenhar: (el, w) => linhas(el, w, { x: S.dias, xFmt: dm, series: [{ rot: 'Contas ativas', cor: 'var(--c-dado)', v: S.contas_ativas }], bandas, altura: 200, rotFim: false }),
    tabela: () => ({ cols: [{ rot: 'Dia' }, { rot: 'Contas', n: true }], linhas: S.dias.map((d, i) => [dm(d), fmt.int(S.contas_ativas[i])]) }),
  });
  const c = cartao(p, { titulo: 'Semanas de publicação', legenda: 'Semanas de domingo a sábado; a primeira começa no sábado 15/08, linha de base antes da propaganda.' });
  c.style.marginTop = '16px';
  c.append(tabelaEl([{ rot: 'Semana' }, { rot: 'Fonte' }, { rot: 'Posts', n: true }, { rot: 'Contas', n: true }],
    M.semanas.map(s => [s.rotulo, s.fonte, fmt.int(s.posts), fmt.int(s.contas)])));
}

// ---------------------------------------------------------------- perfis
function abaPerfis(p) {
  const todas = D.contasObj;
  const temas = D.temas.temas;
  const est = { q: '', grupo: 'todos', cargo: 'todos', uf: 'todas', seg: 'todos', ordem: 'posts', limite: 50 };
  const ufs = [...new Set(todas.map(c => c.uf).filter(Boolean))].sort();
  const filtros = h('div', { class: 'filtros' });
  const busca = h('input', { type: 'search', placeholder: 'Nome ou usuário', 'aria-label': 'Buscar conta' });
  busca.addEventListener('input', () => { est.q = busca.value.trim().toLowerCase(); est.limite = 50; desenhar(); });
  filtros.append(h('label', {}, 'Buscar', busca),
    seletor('Tipo de conta', GRUPOS, est.grupo, v => { est.grupo = v; est.limite = 50; desenhar(); }),
    seletor('Cargo', CARGOS, est.cargo, v => { est.cargo = v; est.limite = 50; desenhar(); }),
    seletor('UF', [['todas', 'Todas'], ...ufs.map(u => [u, u])], est.uf, v => { est.uf = v; est.limite = 50; desenhar(); }),
    seletor('Campo', [['todos', 'Todos'], ...CAMPOS.map(c => [c, SEG[c].rot])], est.seg, v => { est.seg = v; est.limite = 50; desenhar(); }),
    seletor('Ordenar por', [['posts', 'Posts'], ['med_curtidas', 'Mediana de curtidas'], ['med_comentarios', 'Mediana de comentários'], ['med_views', 'Mediana de visualizações'], ['nome', 'Nome']], est.ordem, v => { est.ordem = v; desenhar(); }));
  p.append(filtros);
  const ficha = h('div', { id: 'ficha' });
  p.append(ficha);
  const c = cartao(p, { titulo: 'Contas do censo', legenda: 'Clique numa conta para ver a ficha. Medianas por post na observação base (7 a 32 dias de vida), só com 10 posts ou mais; stories ficam fora.' });
  const alvo = h('div');
  c.append(alvo);

  const cols = [{ rot: 'Conta' }, { rot: 'Cargo · UF' }, { rot: 'Partido' }, { rot: 'Campo' }, { rot: 'Posts', n: true, k: 'posts' },
    { rot: 'Por semana' }, { rot: 'Curtidas', n: true, k: 'med_curtidas' }, { rot: 'Comentários', n: true, k: 'med_comentarios' }, { rot: 'Visualizações', n: true, k: 'med_views' }];
  function filtrar() {
    let r = todas.filter(c => (est.grupo === 'todos' || c.grupo === est.grupo) && (est.cargo === 'todos' || c.cargo === est.cargo) &&
      (est.uf === 'todas' || c.uf === est.uf) && (est.seg === 'todos' || c.seg === est.seg) &&
      (!est.q || c.usuario.toLowerCase().includes(est.q) || (c.nome || '').toLowerCase().includes(est.q)));
    const k = est.ordem;
    r = r.slice().sort(k === 'nome' ? (a, b) => (a.nome || a.usuario).localeCompare(b.nome || b.usuario, 'pt-BR') : (a, b) => (b[k] ?? -1) - (a[k] ?? -1));
    return r;
  }
  function desenhar() {
    const r = filtrar();
    const corpo = h('tbody', {}, r.slice(0, est.limite).map(conta => {
      const tr = h('tr', { class: 'clicavel', tabindex: 0 },
        h('td', {}, h('div', { class: 'conta-nome', text: conta.nome || conta.usuario }), h('div', { class: 'conta-user', text: '@' + conta.usuario })),
        h('td', { text: [CARGO_ROT[conta.cargo] || GRUPO_UM[conta.grupo] || '', conta.uf].filter(Boolean).join(' · ') }),
        h('td', { text: conta.partido || '—' }),
        h('td', {}, SEG[conta.seg] && CAMPOS.includes(conta.seg) ? h('span', { style: 'display:inline-flex;gap:6px;align-items:center' }, h('span', { class: 'chave-ponto', style: `background:${SEG[conta.seg].cor}` }), SEG[conta.seg].curto) : '—'),
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
    const mais = h('div', { class: 'mais' }, h('span', { text: `${fmt.int(Math.min(est.limite, r.length))} de ${fmt.int(r.length)} contas` }));
    if (r.length > est.limite) {
      const b = h('button', { type: 'button', text: 'Mostrar mais 50' });
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
    const descPares = conta.grupo === 'candidato' ? `${CARGO_ROT[conta.cargo] || 'mesmo cargo'}, ${SEG[conta.seg]?.curto || 'mesmo campo'}` : GRUPO_ROT[conta.grupo];
    const comp = k => {
      const mp = mediana(pr.map(o => o[k]));
      if (conta[k] == null || mp == null) return mp == null ? null : `pares: ${fmt.cp(mp)}`;
      return `pares: ${fmt.cp(mp)} · ${nf1.format(conta[k] / mp)}× a mediana`;
    };
    ficha.replaceChildren();
    const c = cartao(ficha, {});
    c.classList.add('ficha');
    c.style.marginBottom = '16px';
    const fechar = h('button', { class: 'fechar', type: 'button', text: 'Fechar' });
    fechar.addEventListener('click', () => { ficha.replaceChildren(); for (const x of document.querySelectorAll('tr.ativo')) x.classList.remove('ativo'); });
    const meta = h('div', { class: 'meta' });
    if (CAMPOS.includes(conta.seg)) meta.append(h('span', { class: 'chave-ponto', style: `background:${SEG[conta.seg].cor}` }), SEG[conta.seg].rot, ' · ');
    meta.append([CARGO_ROT[conta.cargo] || GRUPO_UM[conta.grupo], conta.uf, conta.partido, conta.lado7 && conta.lado7.replaceAll('_', ' '), conta.genero && conta.genero.toLowerCase()].filter(Boolean).join(' · '));
    c.append(h('div', { class: 'ficha-cab' },
      h('div', {}, h('h2', { text: conta.nome || conta.usuario }),
        h('div', { class: 'meta' }, h('a', { href: `https://www.instagram.com/${encodeURIComponent(conta.usuario)}/`, target: '_blank', rel: 'noopener noreferrer', text: '@' + conta.usuario })), meta),
      fechar));
    kpis(c, [
      { rot: 'Posts', val: fmt.int(conta.posts), det: `${fmt.int(conta.dias_ativos)} dias com post` },
      { rot: 'Mediana de curtidas', val: fmt.int(conta.med_curtidas), det: comp('med_curtidas') },
      { rot: 'Mediana de comentários', val: fmt.int(conta.med_comentarios), det: comp('med_comentarios') },
      { rot: 'Mediana de visualizações', val: fmt.cp(conta.med_views), det: comp('med_views') },
    ]);
    c.append(h('div', { class: 'nota', text: `Pares: ${fmt.int(pr.length)} contas (${descPares}).` }));
    const duas = h('div', { class: 'grade duas', style: 'margin-top:12px' });
    c.append(duas);
    const bloco1 = h('div'), bloco2 = h('div');
    duas.append(bloco1, bloco2);
    bloco1.append(h('div', { class: 'subtitulo', text: 'Posts por semana de publicação' }));
    const f1 = h('div', { class: 'fig' }); bloco1.append(f1);
    observar(f1, (el, w) => colunas(el, w, { rot: D.meta.semanas.map(s => s.rotulo.split('–')[0]), v: conta.por_semana, rotDica: i => `Semana ${D.meta.semanas[i].rotulo}` }));
    bloco2.append(h('div', { class: 'subtitulo', text: 'Formatos' }));
    const f2 = h('div', { class: 'fig' }); bloco2.append(f2);
    observar(f2, (el, w) => barras(el, w, {
      fmt: fmt.pct, max: 1,
      linhas: FORMATOS.map(([k, rot]) => ({ rot, v: conta[k] / conta.posts, dica: { titulo: rot, linhas: [{ rot: 'Posts', val: fmt.int(conta[k]) }, { rot: 'Parcela', val: fmt.pct(conta[k] / conta.posts) }] } })),
    }));
    if (conta.temas) {
      c.append(h('div', { class: 'subtitulo', text: 'Temas do dicionário: parcela dos posts que cita cada tema' }));
      const f3 = h('div', { class: 'fig' }); c.append(f3);
      const refs = temas.map((_, i) => mediana(pr.filter(o => o.temas).map(o => o.temas[i])));
      observar(f3, (el, w) => barras(el, w, {
        fmt: fmt.pct,
        linhas: temas.map((t, i) => ({ rot: t.rotulo, v: conta.temas[i], ref: refs[i], dica: { titulo: t.rotulo, linhas: [{ rot: 'Esta conta', val: fmt.pct(conta.temas[i]) }, { rot: 'Mediana dos pares', val: fmt.pct(refs[i]) }] } })),
      }));
      c.append(h('div', { class: 'nota', text: 'Traço vertical: mediana dos pares. Dicionário semente, ainda sem validação humana.' }));
    }
    if (conta.hashtags.length) {
      c.append(h('div', { class: 'subtitulo', text: 'Hashtags mais usadas (3 posts ou mais)' }));
      c.append(h('div', { class: 'chips' }, conta.hashtags.map(([t, n]) => h('span', { class: 'chip', text: `#${t} · ${fmt.int(n)}` }))));
    }
    ficha.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  desenhar();
}

// ---------------------------------------------------------------- engajamento
function abaEngajamento(p) {
  const E = D.engajamento;
  const semanasBase = D.meta.semanas.filter(s => !s.fonte.startsWith('provisória'));
  const est = { m: 'curtidas', cargo: 'todos', semana: semanasBase.at(-1)?.inicio };
  const filtros = h('div', { class: 'filtros' });
  filtros.append(
    seletor('Métrica', METRICAS, est.m, v => { est.m = v; desenhar(); }),
    seletor('Cargo', CARGOS, est.cargo, v => { est.cargo = v; desenhar(); }),
    seletor('Semana de publicação', semanasBase.map(s => [s.inicio, s.rotulo]), est.semana, v => { est.semana = v; desenhar(); }));
  p.append(filtros);
  aviso(p, 'O engajamento é medido na observação base: o post visto de 7 a 32 dias depois de publicado. A idade muda de semana para semana (veja a tabela), por isso compare os campos dentro da mesma semana. Stories não têm curtidas nem comentários e ficam de fora. Medianas só com 10 posts ou mais.');
  const alvo = h('div');
  p.append(alvo);

  function desenhar() {
    alvo.replaceChildren();
    const m = est.m, mr = METRICA_ROT[m].toLowerCase();
    const segs = CAMPOS;  // partidos e veículos têm outra escala (contas nacionais): ficam na tabela
    const segsTabela = est.cargo === 'todos' ? SEGMENTOS : CAMPOS;
    const linhaSeg = (r, seg) => ({
      rot: SEG[seg].rot, cor: SEG[seg].cor, chave: true, v: r ? r[`med_${m}`] : null,
      iqr: r && r[`p25_${m}`] != null ? [r[`p25_${m}`], r[`p75_${m}`]] : null,
      dica: r ? {
        titulo: SEG[seg].rot, linhas: [{ rot: 'Mediana', val: fmt.int(r[`med_${m}`]) }, { rot: '25% a 75%', val: `${fmt.int(r[`p25_${m}`])} a ${fmt.int(r[`p75_${m}`])}` },
          { rot: 'Posts', val: fmt.int(r[`n_${m}`]) }], extra: `Idade mediana na observação: ${nf1.format(r.idade_med / 24)} dias`,
      } : { titulo: SEG[seg].rot, linhas: [], extra: 'Menos de 10 posts.' },
    });
    const daSemana = E.por_semana.filter(r => r.semana === est.semana && r.cargo_g === est.cargo);
    grafico(alvo, {
      titulo: `Mediana de ${mr} por post · semana ${semanaRot[est.semana]}`,
      legenda: `Candidatos, ${CARGO_ROT[est.cargo].toLowerCase()}. A barra é a mediana; o traço fino vai do 1º ao 3º quartil.`,
      nota: 'Partidos e veículos de notícia, que têm outra escala, estão na tabela.',
      desenhar: (el, w) => barras(el, w, { linhas: segs.map(seg => linhaSeg(daSemana.find(r => r.seg === seg), seg)) }),
      tabela: () => ({
        cols: [{ rot: 'Semana' }, { rot: 'Segmento' }, { rot: 'Posts', n: true }, { rot: 'Mediana', n: true }, { rot: '1º quartil', n: true }, { rot: '3º quartil', n: true }, { rot: 'Idade mediana (dias)', n: true }],
        linhas: E.por_semana.filter(r => r.cargo_g === est.cargo && segsTabela.includes(r.seg)).map(r => [semanaRot[r.semana], SEG[r.seg].rot, fmt.int(r[`n_${m}`]), fmt.int(r[`med_${m}`]), fmt.int(r[`p25_${m}`]), fmt.int(r[`p75_${m}`]), fmt.dec(r.idade_med / 24)]),
      }),
    });
    const duas = h('div', { class: 'grade duas', style: 'margin-top:16px' });
    alvo.append(duas);
    const formatos = FORMATOS.filter(([f]) => f !== 'story');
    grafico(duas, {
      titulo: `Mediana de ${mr} por formato`,
      legenda: `Candidatos, ${CARGO_ROT[est.cargo].toLowerCase()}, todas as semanas com observação base.`,
      nota: 'Partidos e veículos na tabela.',
      desenhar: (el, w) => barras(el, w, {
        linhas: formatos.flatMap(([f, frot]) => segs.map(seg => {
          const r = E.por_formato.find(x => x.formato === f && x.cargo_g === est.cargo && x.seg === seg);
          return { grupo: frot, rot: SEG[seg].curto, cor: SEG[seg].cor, chave: true, v: r ? r[`med_${m}`] : null, dica: { titulo: `${frot} · ${SEG[seg].rot}`, linhas: [{ rot: 'Mediana', val: fmt.int(r?.[`med_${m}`]) }, { rot: 'Posts', val: fmt.int(r?.[`n_${m}`]) }] } };
        })),
      }),
      tabela: () => ({
        cols: [{ rot: 'Formato' }, { rot: 'Segmento' }, { rot: 'Posts', n: true }, { rot: 'Mediana', n: true }],
        linhas: E.por_formato.filter(r => r.cargo_g === est.cargo && segsTabela.includes(r.seg) && r.formato !== 'story').map(r => [FORMATO_ROT[r.formato], SEG[r.seg].rot, fmt.int(r[`n_${m}`]), fmt.int(r[`med_${m}`])]),
      }),
    });
    const faixasIdade = ['0–2 h', '2–4 h', '4–8 h', '8–12 h', '12–24 h'];
    const serieHoras = CAMPOS.map(c => ({ rot: SEG[c].rot, curto: SEG[c].curto, cor: SEG[c].cor, v: faixasIdade.map(f => E.primeiras_horas.find(r => r.faixa === f && r.seg === c)?.[`med_${m}`] ?? null) }));
    const semViews = serieHoras.every(se => se.v.every(v => v == null));
    grafico(duas, {
      titulo: `Primeiras horas: mediana de ${mr} pela idade do post`,
      legenda: 'Captura diária do próprio dia (20h30 de Brasília), todos os cargos. Cada post aparece uma vez, na idade em que foi visto.',
      itens: semViews ? null : serieHoras, nota: semViews ? 'As visualizações ainda não aparecem na captura das primeiras horas.' : null,
      desenhar: (el, w) => semViews ? el.append(h('p', { class: 'nota', text: 'Sem dados de visualização nessa captura.' })) :
        linhas(el, w, { x: faixasIdade, series: serieHoras, pontos: true, altura: 240, rotFim: false }),
      tabela: semViews ? null : () => ({ cols: [{ rot: 'Idade' }, ...serieHoras.map(se => ({ rot: se.curto, n: true }))], linhas: faixasIdade.map((f, i) => [f, ...serieHoras.map(se => fmt.int(se.v[i]))]) }),
    });
    const horas = [...Array(24).keys()];
    const serieHora = CAMPOS.map(c => {
      const tot = soma(E.horas.filter(r => r.seg === c).map(r => r.n));
      return { rot: SEG[c].rot, curto: SEG[c].curto, cor: SEG[c].cor, v: horas.map(hh => (E.horas.find(r => r.seg === c && r.hora_brt === hh)?.n || 0) / (tot || 1)) };
    });
    const c2 = h('div', { style: 'margin-top:16px' });
    alvo.append(c2);
    grafico(c2, {
      titulo: 'Horário das publicações (Brasília)',
      legenda: 'Parcela dos posts de cada campo publicada em cada hora do dia, todas as semanas e cargos.',
      itens: serieHora,
      desenhar: (el, w) => linhas(el, w, { x: horas, xFmt: v => `${v}h`, series: serieHora, yFmt: v => fmt.pct(v), altura: 220 }),
      tabela: () => ({ cols: [{ rot: 'Hora' }, ...serieHora.map(se => ({ rot: se.curto, n: true }))], linhas: horas.map(hh => [`${hh}h`, ...serieHora.map(se => fmt.pct(se.v[hh]))]) }),
    });
  }
  desenhar();
}

// ---------------------------------------------------------------- temas e menções
function abaTemas(p) {
  const T = D.temas;
  const semanas = [['todas', 'Todas as semanas'], ...D.meta.semanas.map(s => [s.inicio, s.rotulo])];
  const est = { semana: 'todas', alvo: 'lula', seg: 'lula' };
  const filtros = h('div', { class: 'filtros' });
  filtros.append(
    seletor('Semana', semanas, est.semana, v => { est.semana = v; desenhar(); }),
    seletor('Menção ao longo do tempo', T.alvos.map(a => [a.chave, a.rotulo]), est.alvo, v => { est.alvo = v; desenhar(); }),
    seletor('Hashtags de', SEGMENTOS.map(sg => [sg, SEG[sg].rot]), est.seg, v => { est.seg = v; desenhar(); }));
  p.append(filtros);
  aviso(p, 'Temas vêm da camada semente do dicionário do projeto (config/lexicon.yaml) e menções, de nomes e perfis dos presidenciáveis. É contagem de palavras, sem modelo e sem validação humana: um post que cita um tema pode falar dele de passagem. "Bolsonaro (qualquer)" inclui Flávio, Jair, Eduardo e Michelle.');
  const alvo = h('div');
  p.append(alvo);
  const colunasSeg = SEGMENTOS.map(sg => ({ id: sg, rot: SEG[sg].curto, cor: CAMPOS.includes(sg) ? SEG[sg].cor : null }));
  const reg = (sem, sg) => T.contagens.find(r => r.semana === sem && r.seg === sg);

  function desenhar() {
    alvo.replaceChildren();
    const duas = h('div', { class: 'grade duas' });
    alvo.append(duas);
    const mapa = (titulo, legenda, lista, pref) => grafico(duas, {
      titulo, legenda,
      desenhar: (el, w) => calor(el, w, {
        linhas: lista.map(t => ({ id: t.chave, rot: t.rotulo })), colunas: colunasSeg,
        valor: (l, c) => { const r = reg(est.semana, c.id); return r && r.total ? r[`${pref}_${l.id}`] / r.total : null; },
        dica: (l, c) => { const r = reg(est.semana, c.id); return { titulo: `${l.rot} · ${SEG[c.id].rot}`, linhas: [{ rot: 'Posts que citam', val: fmt.int(r?.[`${pref}_${l.id}`]) }, { rot: 'Posts no segmento', val: fmt.int(r?.total) }] }; },
      }),
      tabela: () => ({ cols: [{ rot: '' }, ...colunasSeg.map(c => ({ rot: c.rot, n: true }))], linhas: lista.map(t => [t.rotulo, ...colunasSeg.map(c => { const r = reg(est.semana, c.id); return r ? fmt.pct(r[`${pref}_${t.chave}`] / r.total) : '—'; })]) }),
    });
    mapa(`Temas · ${semanaRot[est.semana]}`, 'Parcela dos posts de cada segmento que cita cada tema.', T.temas, 'tema');
    mapa(`Menções · ${semanaRot[est.semana]}`, 'Parcela dos posts de cada segmento que cita cada nome.', T.alvos, 'alvo');

    const alvoRot = T.alvos.find(a => a.chave === est.alvo).rotulo;
    const sems = D.meta.semanas;
    const serie = [...CAMPOS, 'veiculo'].map(sg => ({
      rot: SEG[sg].rot, curto: SEG[sg].curto, cor: sg === 'veiculo' ? 'var(--c-outros)' : SEG[sg].cor,
      v: sems.map(s => { const r = reg(s.inicio, sg); return r && r.total ? r[`alvo_${est.alvo}`] / r.total : null; }),
    })).filter(se => se.v.some(v => v != null));
    const dois = h('div', { class: 'grade duas', style: 'margin-top:16px' });
    alvo.append(dois);
    grafico(dois, {
      titulo: `Posts que citam ${alvoRot}, por semana`,
      legenda: 'Parcela dos posts de cada segmento. A última semana ainda é provisória.',
      itens: serie.slice(0, 4), nota: 'Veículos de notícia em cinza escuro.',
      desenhar: (el, w) => linhas(el, w, { x: sems.map(s => s.rotulo), xFmt: v => v.split('–')[0], xDica: v => `Semana ${v}`, series: serie, yFmt: v => fmt.pct(v), pontos: true, altura: 240, rotFim: false }),
      tabela: () => ({ cols: [{ rot: 'Semana' }, ...serie.map(se => ({ rot: se.curto, n: true }))], linhas: sems.map((s, i) => [s.rotulo, ...serie.map(se => fmt.pct(se.v[i]))]) }),
    });
    const tags = D.hashtags.filter(r => r.semana === est.semana && r.seg === est.seg);
    grafico(dois, {
      titulo: `Hashtags · ${SEG[est.seg].rot}`,
      legenda: `${semanaRot[est.semana]}. Hashtags com 10 posts ou mais, de 3 contas ou mais.`,
      desenhar: (el, w) => tags.length ? barras(el, w, { linhas: tags.map(t => ({ rot: '#' + t.hashtag, v: t.n, dica: { titulo: '#' + t.hashtag, linhas: [{ rot: 'Posts', val: fmt.int(t.n) }] } })) })
        : el.append(h('p', { class: 'nota', text: 'Nenhuma hashtag passa do mínimo nesse recorte.' })),
      tabela: () => ({ cols: [{ rot: 'Hashtag' }, { rot: 'Posts', n: true }], linhas: tags.map(t => ['#' + t.hashtag, fmt.int(t.n)]) }),
    });
  }
  desenhar();
}

// ---------------------------------------------------------------- conversa pública
function abaConversa(p) {
  const C = D.conversa;
  if (!C) { aviso(p, 'A linha de conversa ainda não foi consolidada.'); return; }
  const tot = soma(C.semanas.map(s => s.posts));
  kpis(p, [
    { rot: 'Posts na base', val: fmt.int(tot), det: 'fora do censo, sem descartes' },
    { rot: 'Semanas', val: fmt.int(C.semanas.length), det: C.semanas.map(s => semanaRot[s.semana] || dm(s.semana)).join(' · ') },
    { rot: 'Contas por semana', val: fmt.cp(mediana(C.semanas.map(s => s.contas))), det: 'mediana de contas distintas' },
  ]);
  aviso(p, 'Posts sobre a eleição de contas fora do censo, achados por palavras-chave (consultas G1 a G4, docs/12). Tudo aqui é agregado por dia, consulta, termo ou hashtag; nada é mostrado por conta. As semanas entram 7 dias depois de terminar.');
  const x = C.dias;
  grafico(p, {
    titulo: 'Posts por dia na base da conversa',
    legenda: 'Um post conta uma vez, mesmo que tenha casado com mais de uma consulta.',
    desenhar: (el, w) => linhas(el, w, { x, xFmt: dm, series: [{ rot: 'Posts', cor: 'var(--c-dado)', v: C.total }], altura: 220, rotFim: false }),
    tabela: () => ({ cols: [{ rot: 'Dia' }, { rot: 'Posts', n: true }], linhas: x.map((d, i) => [dm(d), fmt.int(C.total[i])]) }),
  });
  p.append(h('div', { class: 'secao-titulo', text: 'Por consulta' }));
  const grade = h('div', { class: 'grade duas' });
  p.append(grade);
  for (const q of C.consultas) {
    const v = C.por_consulta[q.chave];
    if (!v) continue;
    grafico(grade, {
      titulo: `${q.chave} · ${q.rotulo}`,
      desenhar: (el, w) => linhas(el, w, { x, xFmt: dm, series: [{ rot: q.chave, cor: 'var(--c-dado)', v }], altura: 170, rotFim: false }),
      tabela: () => ({ cols: [{ rot: 'Dia' }, { rot: 'Posts', n: true }], linhas: x.map((d, i) => [dm(d), fmt.int(v[i])]) }),
    });
  }
  const semanas = C.semanas.map(s => [s.semana, semanaRot[s.semana] || dm(s.semana)]);
  const est = { semana: semanas.at(-1)[0] };
  const filtros = h('div', { class: 'filtros', style: 'margin-top:24px' });
  filtros.append(seletor('Semana', semanas, est.semana, v => { est.semana = v; desenhar(); }));
  p.append(filtros);
  const alvo = h('div', { class: 'grade duas' });
  p.append(alvo);
  function desenhar() {
    alvo.replaceChildren();
    const termos = C.termos.filter(r => r.semana === est.semana);
    grafico(alvo, {
      titulo: 'Termos que mais casaram',
      legenda: 'Termos das consultas encontrados no texto, como a busca da interface os lê (sem acento).',
      desenhar: (el, w) => barras(el, w, { linhas: termos.map(t => ({ rot: t.termo, v: t.n, dica: { titulo: t.termo, linhas: [{ rot: 'Posts', val: fmt.int(t.n) }] } })) }),
      tabela: () => ({ cols: [{ rot: 'Termo' }, { rot: 'Posts', n: true }], linhas: termos.map(t => [t.termo, fmt.int(t.n)]) }),
    });
    const tags = C.hashtags.filter(r => r.semana === est.semana);
    grafico(alvo, {
      titulo: 'Hashtags mais usadas',
      legenda: 'Com 20 posts ou mais, de 5 contas ou mais.',
      desenhar: (el, w) => barras(el, w, { linhas: tags.map(t => ({ rot: '#' + t.hashtag, v: t.n, dica: { titulo: '#' + t.hashtag, linhas: [{ rot: 'Posts', val: fmt.int(t.n) }] } })) }),
      tabela: () => ({ cols: [{ rot: 'Hashtag' }, { rot: 'Posts', n: true }], linhas: tags.map(t => ['#' + t.hashtag, fmt.int(t.n)]) }),
    });
  }
  desenhar();
}

// ---------------------------------------------------------------- anúncios
function abaAnuncios(p) {
  const A = D.anuncios;
  if (!A) { aviso(p, 'Nenhum arquivo da Ad Library consolidado ainda.'); return; }
  const T = A.total;
  const baixado = A.baixado_em ? `${A.baixado_em.slice(6, 8)}/${A.baixado_em.slice(4, 6)}` : '';
  kpis(p, [
    { rot: 'Anúncios', val: fmt.int(T.n), det: `${fmt.int(T.paginas)} páginas` },
    { rot: 'Gasto declarado', val: `${fmt.reais(T.gasto_min)} a ${fmt.cp(T.gasto_max).replace(/^R\$ /, '')}`, det: 'soma das faixas, em reais' },
    { rot: 'Impressões', val: `${fmt.cp(T.imp_min)} a ${fmt.cp(T.imp_max)}`, det: T.imp_sem_teto ? `${fmt.int(T.imp_sem_teto)} anúncios com 1 milhão ou mais, contados pelo piso` : 'soma das faixas' },
    { rot: 'Citam "Lula" no texto', val: fmt.pct(T.cita_lula / T.n), det: 'os demais casaram em outro campo do anúncio' },
    { rot: 'Casados com o TSE', val: fmt.pct(A.casados / T.n), det: 'pelo nome do responsável ("pago por")' },
  ]);
  aviso(p, `Anúncios que a busca por "${A.busca}" na Ad Library retornou (baixados em ${baixado}), com início de veiculação a partir de 16/08. É uma amostra por palavra-chave, não o total de anúncios políticos. Gasto e impressões vêm em faixas: a barra cheia vai até o piso e a parte clara até o teto.`);
  const segs = [...CAMPOS, 'sem_casamento'];
  const duas = h('div', { class: 'grade duas' });
  p.append(duas);
  const faixaDica = (rot, r) => ({ titulo: rot, linhas: [{ rot: 'Anúncios', val: fmt.int(r.n) }, { rot: 'Gasto', val: `${fmt.reais(r.gasto_min)} a ${fmt.reais(r.gasto_max)}` }, { rot: 'Impressões', val: `${fmt.cp(r.imp_min)} a ${fmt.cp(r.imp_max)}` }, { rot: 'Citam Lula', val: fmt.pct(r.cita_lula / r.n) }] });
  grafico(duas, {
    titulo: 'Gasto por campo do anunciante',
    legenda: 'Campo da candidatura casada pelo nome no TSE.',
    desenhar: (el, w) => barras(el, w, {
      faixa: true, fmt: fmt.reais, rotFaixa: r => `${fmt.reais(r.lo)} a ${fmt.cp(r.hi)}`,
      linhas: segs.map(sg => A.por_seg.find(r => r.seg === sg)).filter(Boolean).map(r => ({ rot: SEG[r.seg].rot, cor: SEG[r.seg].cor, chave: true, lo: r.gasto_min, hi: r.gasto_max, dica: faixaDica(SEG[r.seg].rot, r) })),
    }),
    tabela: () => ({ cols: [{ rot: 'Campo' }, { rot: 'Anúncios', n: true }, { rot: 'Páginas', n: true }, { rot: 'Gasto mín.', n: true }, { rot: 'Gasto máx.', n: true }, { rot: 'Citam Lula', n: true }],
      linhas: A.por_seg.map(r => [SEG[r.seg].rot, fmt.int(r.n), fmt.int(r.paginas), fmt.reais(r.gasto_min), fmt.reais(r.gasto_max), fmt.pct(r.cita_lula / r.n)]) }),
  });
  grafico(duas, {
    titulo: 'Quem usa o nome de Lula nos anúncios',
    legenda: 'Parcela dos anúncios de cada campo com "Lula" no texto.',
    desenhar: (el, w) => barras(el, w, {
      fmt: fmt.pct, max: 1,
      linhas: segs.map(sg => A.por_seg.find(r => r.seg === sg)).filter(Boolean).map(r => ({ rot: SEG[r.seg].rot, cor: SEG[r.seg].cor, chave: true, v: r.cita_lula / r.n, sub: `${fmt.int(r.n)} anúncios`, dica: faixaDica(SEG[r.seg].rot, r) })),
    }),
  });
  const dias = [...new Set(A.por_dia.map(r => r.ad_delivery_start_time))].sort();
  const serieDia = CAMPOS.map(c => ({ rot: SEG[c].rot, curto: SEG[c].curto, cor: SEG[c].cor, v: dias.map(d => A.por_dia.find(r => r.ad_delivery_start_time === d && r.seg === c)?.n || 0) }));
  const c1 = h('div', { style: 'margin-top:16px' });
  p.append(c1);
  grafico(c1, {
    titulo: 'Anúncios iniciados por dia, por campo',
    legenda: 'Dia de início da veiculação. Anúncios sem casamento com o TSE ficam fora deste gráfico.',
    itens: serieDia,
    desenhar: (el, w) => linhas(el, w, { x: dias, xFmt: dm, series: serieDia, altura: 240 }),
    tabela: () => ({ cols: [{ rot: 'Dia' }, ...serieDia.map(se => ({ rot: se.curto, n: true }))], linhas: dias.map((d, i) => [dm(d), ...serieDia.map(se => fmt.int(se.v[i]))]) }),
  });
  const dois = h('div', { class: 'grade duas', style: 'margin-top:16px' });
  p.append(dois);
  const cargoRot = { ...CARGO_ROT, outro: 'Outro cargo', sem_cargo: 'Sem cargo no "pago por"' };
  grafico(dois, {
    titulo: 'Gasto por cargo',
    desenhar: (el, w) => barras(el, w, {
      faixa: true, fmt: fmt.reais, rotFaixa: r => `${fmt.reais(r.lo)} a ${fmt.cp(r.hi)}`,
      linhas: A.por_cargo.slice().sort((a, b) => b.gasto_max - a.gasto_max).map(r => ({ rot: cargoRot[r.cargo_g] || r.cargo_g, lo: r.gasto_min, hi: r.gasto_max, dica: faixaDica(cargoRot[r.cargo_g] || r.cargo_g, r) })),
    }),
    tabela: () => ({ cols: [{ rot: 'Cargo' }, { rot: 'Anúncios', n: true }, { rot: 'Gasto mín.', n: true }, { rot: 'Gasto máx.', n: true }], linhas: A.por_cargo.map(r => [cargoRot[r.cargo_g] || r.cargo_g, fmt.int(r.n), fmt.reais(r.gasto_min), fmt.reais(r.gasto_max)]) }),
  });
  const plat = { 'facebook,instagram': 'Facebook e Instagram', instagram: 'Só Instagram', facebook: 'Só Facebook' };
  grafico(dois, {
    titulo: 'Plataformas',
    desenhar: (el, w) => barras(el, w, { linhas: A.plataformas.map(r => ({ rot: plat[r.plataformas] || r.plataformas, v: r.n, dica: { titulo: plat[r.plataformas] || r.plataformas, linhas: [{ rot: 'Anúncios', val: fmt.int(r.n) }] } })) }),
  });

  const top = A.top_paginas;
  const ct = cartao(p, { titulo: 'Maiores anunciantes', legenda: 'As 30 páginas com maior teto de gasto no recorte. Dados públicos da Ad Library.' });
  ct.style.marginTop = '16px';
  ct.append(tabelaEl([{ rot: 'Página' }, { rot: 'Cargo · UF' }, { rot: 'Partido' }, { rot: 'Campo' }, { rot: 'Anúncios', n: true }, { rot: 'Gasto', n: true }, { rot: 'Impressões', n: true }, { rot: 'Citam Lula', n: true }],
    top.map(r => [r.page_name, [cargoRot[r.cargo] || '', r.uf].filter(Boolean).join(' · '), r.partido || '—', SEG[r.seg]?.curto || '—', fmt.int(r.n), `${fmt.reais(r.gasto_min)} a ${fmt.cp(r.gasto_max)}`, `${fmt.cp(r.imp_min)} a ${fmt.cp(r.imp_max)}`, fmt.pct(r.cita_lula / r.n)])));

  const est = { seg: 'todos' };
  const filtros = h('div', { class: 'filtros', style: 'margin-top:24px' });
  filtros.append(seletor('Público de', [['todos', 'Todos os anúncios'], ...segs.map(sg => [sg, SEG[sg].rot])], est.seg, v => { est.seg = v; desenharPublico(); }));
  p.append(filtros);
  const alvo = h('div', { class: 'grade duas' });
  p.append(alvo);
  function desenharPublico() {
    alvo.replaceChildren();
    const demo = A.demografia.filter(r => r.seg === est.seg);
    const idades = [...new Set(demo.map(r => r.idade))].filter(i => i !== 'Unknown').sort();
    const generos = [['female', 'Mulheres'], ['male', 'Homens'], ['unknown', 'Não informado']];
    grafico(alvo, {
      titulo: 'Quem viu: idade e gênero',
      legenda: 'Parcela das impressões (ponto médio da faixa de cada anúncio).',
      desenhar: (el, w) => calor(el, w, {
        linhas: idades.map(i => ({ id: i, rot: i })), colunas: generos.map(([id, rot]) => ({ id, rot })),
        valor: (l, c) => demo.find(r => r.idade === l.id && r.genero === c.id)?.parcela ?? null,
        dica: (l, c) => ({ titulo: `${l.rot} · ${c.rot}`, linhas: [{ rot: 'Impressões', val: fmt.pct(demo.find(r => r.idade === l.id && r.genero === c.id)?.parcela) }] }),
      }),
      tabela: () => ({ cols: [{ rot: 'Idade' }, ...generos.map(([, rot]) => ({ rot, n: true }))], linhas: idades.map(i => [i, ...generos.map(([g]) => fmt.pct(demo.find(r => r.idade === i && r.genero === g)?.parcela))]) }),
    });
    const reg = A.regioes.filter(r => r.seg === est.seg).sort((a, b) => b.parcela - a.parcela);
    grafico(alvo, {
      titulo: 'Onde foi visto',
      legenda: 'Parcela das impressões por UF.',
      desenhar: (el, w) => barras(el, w, { fmt: fmt.pct, linhas: reg.map(r => ({ rot: r.uf, v: r.parcela, dica: { titulo: r.uf, linhas: [{ rot: 'Impressões', val: fmt.pct(r.parcela) }] } })) }),
      tabela: () => ({ cols: [{ rot: 'UF' }, { rot: 'Impressões', n: true }], linhas: reg.map(r => [r.uf, fmt.pct(r.parcela)]) }),
    });
  }
  desenharPublico();
}

// ---------------------------------------------------------------- cobertura e método
function abaMetodo(p) {
  const C = D.cobertura;
  const cap = t => t.charAt(0) + t.slice(1).toLowerCase();
  const bloco = (pai, titulo, legenda, lista) => grafico(pai, {
    titulo, legenda, nota: 'Barra: candidaturas com conta no censo. Traço: declararam Instagram ao TSE.',
    desenhar: (el, w) => barras(el, w, {
      fmt: fmt.pct, max: 1,
      linhas: lista.filter(r => r.registrados >= 10).map(r => ({
        rot: cap(r.grupo), v: r.no_censo / r.registrados, ref: r.com_instagram / r.registrados, sub: fmt.int(r.registrados),
        dica: { titulo: cap(r.grupo), linhas: [{ rot: 'Registradas', val: fmt.int(r.registrados) }, { rot: 'Instagram declarado', val: fmt.int(r.com_instagram) }, { rot: 'No censo', val: fmt.int(r.no_censo) }] },
      })),
    }),
    tabela: () => ({ cols: [{ rot: 'Grupo' }, { rot: 'Registradas', n: true }, { rot: 'Instagram declarado', n: true }, { rot: 'No censo', n: true }],
      linhas: lista.map(r => [cap(r.grupo), fmt.int(r.registrados), fmt.int(r.com_instagram), fmt.int(r.no_censo)]) }),
  });
  const tot = { registrados: soma(C.cargo.map(r => r.registrados)), no_censo: soma(C.cargo.map(r => r.no_censo)) };
  kpis(p, [
    { rot: 'Candidaturas registradas', val: fmt.int(tot.registrados), det: 'presidente, governador, senador e deputados' },
    { rot: 'No censo baixável', val: fmt.int(tot.no_censo), det: `${fmt.pct(tot.no_censo / tot.registrados)} das candidaturas` },
  ]);
  bloco(p, 'Cobertura por cargo', 'Parcela das candidaturas registradas no TSE que está no censo. Ao lado de cada grupo, o número de candidaturas.', C.cargo);
  const g2 = h('div', { class: 'grade duas', style: 'margin-top:16px' });
  p.append(g2);
  bloco(g2, 'Cobertura por gênero', 'Parcela das candidaturas no censo.', C.genero);
  bloco(g2, 'Cobertura por cor ou raça', 'Autodeclaração ao TSE; grupos com 10 candidaturas ou mais.', C.raca);

  const t = h('div', { class: 'cartao texto', style: 'margin-top:16px' });
  p.append(t);
  const secao = (tit, ...pars) => { t.append(h('h3', { text: tit })); for (const x of pars) t.append(Array.isArray(x) ? h('ul', {}, x.map(i => h('li', { text: i }))) : h('p', { text: x })); };
  secao('O que é este painel',
    'Um retrato agregado e descritivo do Instagram das candidaturas, partidos e veículos de notícia na campanha de 2026, atualizado a cada nova coleta. Esta é a fase 0: contagens, medianas e dicionários. As fases seguintes acrescentam rótulos por modelo, validados por amostra humana.');
  secao('De onde vêm os dados', [
    'Posts: Meta Content Library, exportação em CSV das contas baixáveis (25 mil seguidores ou selo de verificação) de candidatos, partidos e 130 veículos, conferidas contra o TSE.',
    'Semana de publicação baixada 7 dias depois de terminar (observação base). Desde 22/09, também uma captura do próprio dia às 20h30 de Brasília.',
    'Conversa pública: buscas por palavra-chave de contas fora do censo (consultas G1 a G4).',
    'Anúncios: Meta Ad Library, por busca de palavra-chave.',
    'Candidaturas, campo e coligações: arquivos públicos do TSE (14/09/2026).',
  ]);
  secao('Como ler', [
    'Campo é a coligação presidencial do partido do candidato: aliança eleitoral, não ideologia.',
    'Dias em UTC, como nos filtros da Content Library; Brasília é UTC−3.',
    'Medianas e quartis aparecem só com 10 posts ou mais; abaixo disso, "—".',
    'Temas e menções são contagens por dicionário, sem modelo e sem validação.',
  ]);
  secao('Ressalvas', [
    'O censo não é amostra aleatória: a cobertura é menor entre mulheres, candidatos pretos, pardos e indígenas, sem mandato e do Norte (gráficos acima).',
    'Engajamento depende da idade do post na observação; compare dentro da mesma semana.',
    'Cerca de 9% dos posts escondem as curtidas; o denominador de cada mediana é o número de posts com a métrica.',
    'A observação mede o que sobreviveu até a coleta, não tudo o que foi publicado.',
    'Nenhum resultado aqui é causal.',
  ]);
  secao('O que não está aqui',
    'Texto de post, identificador de post, links e mídia, identificadores internos da Meta e qualquer dado por conta na linha de conversa. Os dados brutos ficam só com os pesquisadores aprovados no projeto.');
  secao('Regras de uso', [
    'Painel restrito ao grupo do projeto; não repasse a senha.',
    'Nada é divulgado publicamente antes da diplomação, em 18/12/2026.',
    'Ao citar, indique a Meta Content Library e a Ad Library como fontes e o TSE para as candidaturas.',
  ]);
  secao('Próximas fases', [
    'Sentimento, incivilidade e função do discurso (aclamação, ataque, defesa) por modelo, com validação humana.',
    'Quem fala de quem, com a postura (favorável, desfavorável, neutra) de cada menção.',
    'Tópicos por perfil e tópicos emergentes.',
    'Modelos de engajamento com efeito fixo de conta (razões de taxas e razões de chances).',
  ]);
}

iniciar().catch(e => { const erro = $('#erro'); if (erro) erro.textContent = `Erro ao iniciar: ${e.message}`; });
})();
