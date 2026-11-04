(() => {
  if (typeof boardCards === 'undefined') return;
  const fig = document.querySelector('#s12 figure');
  if (!fig) return;
  const cards = boardCards.flow;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const svgEl = (tag, attrs) => { const n = document.createElementNS('http://www.w3.org/2000/svg', tag); Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v)); return n; };
  const open = (src, alt) => {
    const full = document.querySelector('#full');
    full.src = src; full.alt = alt;
    document.querySelector('#viewer').showModal();
  };
  const cardOf = i => cards[i];

  const routes = [
    {
      tab: '01 · Jornada no app',
      kicker: 'Caminho principal · MVP',
      title: 'Perda de renda CLT',
      lead: 'O cliente escolhe a cobertura, confere se o caso é elegível e prepara os documentos para abrir o pedido.',
      spine: [
        { id: 'home', kind: 'start', label: 'Home', note: 'Entrada no app', card: 8 },
        { id: 'sub', kind: 'step', label: 'Subhome', note: 'Acionar seguro', card: 9 },
        { id: 'pick', kind: 'step', label: 'Seleciona a cobertura', note: 'Tipo que possui contratado', card: 14 },
        { id: 'cover', kind: 'step', label: 'Perda de renda', note: 'Cobertura priorizada no MVP', card: 23 },
        { id: 'elig', kind: 'step', label: 'Elegibilidade', note: 'O que o seguro cobre e não cobre', card: 29 },
        { id: 'docs', kind: 'step', label: 'Lista de documentos', note: 'Incluir o formulário (conta para receber)', card: 44 },
        { id: 'happened', kind: 'step', label: 'O que aconteceu?', card: 58 },
        { id: 'upload', kind: 'step', label: 'Upload de documentos', card: 59 },
        { id: 'confirm', kind: 'step', label: 'Confirmação', note: 'Tela de confirmação de informação', card: 69 },
        { id: 'proto', kind: 'end', label: 'Protocolo e status', note: 'Prazo de 30 dias para retorno', card: 70 }
      ],
      forks: [
        { after: 'sub', id: 'icatu', kind: 'decision', label: 'Todas as apólices são da Icatu?', card: 12, next: [
          { id: 'icatu-yes', kind: 'action', label: 'Direciona para a Icatu', card: 10 },
          { id: 'icatu-ours', kind: 'step', label: 'Aciona por aqui as nossas', card: 15 }
        ]},
        { after: 'upload', id: 'all', kind: 'decision', label: 'Tem todos os documentos?', card: 67, next: [
          { id: 'later', kind: 'pending', label: 'Enviar pendentes em até 60 dias', card: 66 },
          { id: 'fail', kind: 'decision', label: 'Falha ao fazer upload?', card: 63 },
          { id: 'closed', kind: 'decision', label: 'Fechou o app sem querer?', card: 65 },
          { id: 'timeout', kind: 'action', label: 'Análise finalizada por falta de envio', card: 60 }
        ]},
        { after: 'proto', id: 'more', kind: 'decision', label: 'Necessidade de novos documentos?', card: 71, next: [
          { id: 'has-icatu', kind: 'decision', label: 'Possui apólices com a Icatu?', card: 72 },
          { id: 'rest', kind: 'action', label: 'Direciona à Icatu as apólices restantes', card: 73 },
          { id: 'result', kind: 'end', label: 'Retorno positivo ou negativo', note: 'Mapear todos os motivos de recusa', card: 74 }
        ]}
      ]
    },
    {
      tab: '02 · Outras coberturas',
      kicker: 'Mesmo caminho · documentos específicos',
      title: 'Invalidez por acidente',
      lead: 'O fluxo mantém a orientação sobre cobertura e passa a exigir documentos específicos, como a declaração médica que comprova o grau de invalidez.',
      covers: [
        { name: 'Invalidez permanente', title: 'Invalidez / invalidez permanente', lead: 'Declaração médica por acidente comprovando o grau da invalidez; exames com laudo; B.O. ou BRAT; RG/CPF/CNH.', cover: 17, docs: 55 },
        { name: 'Seguro de vida', title: 'Seguro de vida', lead: 'Em caso de falecimento do titular, a abertura é pela jornada externa.', cover: 16, docs: 54 },
        { name: 'Diárias hospitalar', title: 'Diárias hospitalar', lead: 'Elegibilidade e lista de documentos, com o formulário de conta para receber.', cover: 18, docs: 39 },
        { name: 'Doenças graves', title: 'Doenças graves', lead: 'O caminho no app se mantém; mudam os documentos exigidos para a cobertura.', cover: 19, docs: 40 },
        { name: 'Despesas hospitalares', title: 'Despesas hospitalares e odontológicas', lead: 'Mesma sequência de orientação, documentos e envio.', cover: 20, docs: 41 },
        { name: 'Vida para seus pais', title: 'Vida para seus pais', lead: 'Ramificações de cônjuge, filhos e pais; falecimento do titular segue pela jornada externa.', cover: 21, docs: 42 },
        { name: 'Assistência funeral', title: 'Assistência funeral', lead: 'Certidão de óbito, documentos do segurado e notas fiscais do serviço prestado no funeral.', cover: 22, docs: 56 }
      ],
      spine: [
        { id: 'cover', kind: 'step', label: 'Invalidez permanente', note: 'Cobertura selecionada', card: 17 },
        { id: 'elig', kind: 'step', label: 'Elegibilidade', note: 'O que o seguro cobre e não cobre', card: 24 },
        { id: 'docs', kind: 'step', label: 'Lista de documentos', note: 'Específicos desta cobertura', card: 38 },
        { id: 'reuse', kind: 'decision', label: 'Reaproveitar documento pessoal?', card: 47 },
        { id: 'upload', kind: 'step', label: 'Upload de documentos', card: 59 },
        { id: 'confirm', kind: 'step', label: 'Confirmação', card: 69 },
        { id: 'proto', kind: 'end', label: 'Protocolo e status', note: 'Prazo de 30 dias para retorno', card: 70 }
      ],
      forks: [
        { after: 'cover', id: 'external', kind: 'pending', label: 'Falecimento do titular → jornada externa', card: 28, next: [] }
      ]
    },
    {
      tab: '03 · Jornada externa · V2',
      kicker: 'Fora do app · domínio a definir',
      title: 'Morte por acidente',
      lead: 'Com o falecimento do titular, outra pessoa precisa iniciar o pedido pela web. O fluxo prevê identificar quem está acionando o seguro.',
      spine: [
        { id: 'ext', kind: 'start', label: 'Jornada externa', note: 'Domínio a definir', card: 75 },
        { id: 'open', kind: 'step', label: 'Acionar seguro', card: 76 },
        { id: 'cover', kind: 'step', label: 'Morte por acidente', card: 81 },
        { id: 'third', kind: 'decision', label: 'É segurado terceiro?', card: 87 },
        { id: 'elig', kind: 'step', label: 'Elegibilidade', note: 'O que o seguro cobre e não cobre', card: 93 },
        { id: 'docs', kind: 'step', label: 'Lista de documentos', card: 96 },
        { id: 'who', kind: 'step', label: 'Quem está acionando', note: 'Solicita dados pessoais e contato', card: 105 },
        { id: 'cpf', kind: 'decision', label: 'Informou o CPF de quem aciona?', card: 106 },
        { id: 'upload', kind: 'step', label: 'Upload de documentos', card: 115 },
        { id: 'sms', kind: 'step', label: 'Validação por SMS / WhatsApp', card: 122 },
        { id: 'proto', kind: 'end', label: 'Protocolo e status', note: 'Prazo de 30 dias para retorno', card: 124 }
      ],
      forks: [
        { after: 'cpf', id: 'nocpf', kind: 'action', label: 'Sem CPF do solicitante não segue o envio', card: 109, next: [] },
        { after: 'proto', id: 'icatu', kind: 'decision', label: 'Possui apólices com a Icatu?', card: 126, next: [
          { id: 'rest', kind: 'action', label: 'Direciona à Icatu as apólices restantes', card: 127 },
          { id: 'result', kind: 'end', label: 'Retorno positivo ou negativo', card: 130 }
        ]}
      ]
    }
  ];

  const root = el('div', 'flow-atlas');
  root.setAttribute('role', 'region');
  root.setAttribute('aria-label', 'User Flow do acionamento de seguro, reproduzido a partir do quadro original');

  const head = el('div', 'flow-head');
  const titleBox = el('div');
  titleBox.append(el('span', 'flow-kicker', 'User Flow · Validação técnica'), el('p', '', 'Reprodução editorial do quadro original. As ramificações, documentos e exceções são os mesmos do fluxo percorrido com engenharia.'));
  const tools = el('div');
  tools.style.display = 'flex';
  tools.style.gap = '8px';
  const play = el('button', 'flow-play', '▶ Percorrer o fluxo'); play.type = 'button'; play.setAttribute('aria-pressed', 'false');
  const original = el('button', 'flow-original', 'Quadro original ⤢'); original.type = 'button';
  original.onclick = () => open('imagens/flow.png', 'User Flow — jornada principal, alternativas e cenários de evolução');
  tools.append(play, original);
  head.append(titleBox, tools);

  const tabs = el('div', 'flow-tabs'); tabs.setAttribute('role', 'tablist');
  const covers = el('div', 'flow-covers'); covers.hidden = true;
  const stage = el('div', 'flow-stage');
  const svg = svgEl('svg', { class: 'flow-svg', 'aria-hidden': 'true' });
  const defs = svgEl('defs', {});
  const glow = svgEl('filter', { id: 'flowGlow', x: '-40%', y: '-40%', width: '180%', height: '180%' });
  glow.append(svgEl('feGaussianBlur', { stdDeviation: '2.4', result: 'b' }), svgEl('feMerge', {}));
  const merge = glow.querySelector('feMerge');
  merge.append(svgEl('feMergeNode', { in: 'b' }), svgEl('feMergeNode', { in: 'SourceGraphic' }));
  defs.append(glow); svg.append(defs);
  const wires = svgEl('g', { class: 'wires' });
  const neons = svgEl('g', { class: 'neons' });
  svg.append(wires, neons);
  const rows = el('div', 'flow-rows');
  const branch = el('div', 'flow-branch');
  stage.append(svg, rows, branch);

  const detail = el('div', 'flow-detail');
  const copy = el('div', 'flow-copy');
  const crop = el('button', 'flow-crop'); crop.type = 'button';
  const cropImg = el('img'); cropImg.alt = ''; crop.append(cropImg);
  detail.append(copy, crop);

  const legend = el('div', 'flow-legend');
  [['l-main', 'Jornada principal'], ['l-dec', 'Decisão'], ['l-act', 'Encaminhamento'], ['l-pen', 'Ponto pendente / prazo'], ['l-end', 'Protocolo / retorno']].forEach(([cls, t]) => {
    const s = el('span', cls); s.append(el('i'), document.createTextNode(t)); legend.append(s);
  });
  const foot = el('p', 'flow-foot', 'O material de origem não foi alterado. Toque em um passo para ler o texto original e ampliar o recorte do quadro. Setas ← → percorrem o caminho quando o atlas está em foco.');

  root.append(head, tabs, covers, stage, detail, legend, foot);

  let routeI = 0, stepI = 0, coverI = 0, timer = null, nodes = [];

  function kinds(n) { return n.kind === 'decision' ? 'Decisão' : n.kind === 'action' ? 'Encaminhamento' : n.kind === 'pending' ? 'Pendente' : n.kind === 'end' ? 'Saída' : n.kind === 'start' ? 'Entrada' : 'Etapa'; }

  function pair(a, b, hot, host) {
    const A = a.getBoundingClientRect(), B = b.getBoundingClientRect();
    const x1 = A.left + A.width / 2 - host.left, y1 = A.top + A.height / 2 - host.top;
    const x2 = B.left + B.width / 2 - host.left, y2 = B.top + B.height / 2 - host.top;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const d = Math.abs(y2 - y1) > 24
      ? `M${x1.toFixed(1)} ${y1.toFixed(1)} C ${x1.toFixed(1)} ${my.toFixed(1)}, ${x2.toFixed(1)} ${my.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`
      : `M${x1.toFixed(1)} ${y1.toFixed(1)} C ${mx.toFixed(1)} ${y1.toFixed(1)}, ${mx.toFixed(1)} ${y2.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`;
    wires.append(svgEl('path', { class: 'wire', d }));
    neons.append(svgEl('path', { class: hot ? 'neon lit' : 'neon', d }));
  }

  function drawWires() {
    wires.replaceChildren(); neons.replaceChildren();
    const host = stage.getBoundingClientRect();
    const spineNodes = [...rows.querySelectorAll('.flow-node')];
    for (let i = 0; i < spineNodes.length - 1; i++) pair(spineNodes[i], spineNodes[i + 1], i < stepI, host);
    const forkNodes = [...branch.querySelectorAll('.flow-node')];
    if (spineNodes.length && forkNodes.length) {
      const from = spineNodes[Math.min(stepI, spineNodes.length - 1)];
      forkNodes.forEach((n, i) => pair(i ? forkNodes[i - 1] : from, n, true, host));
    }
  }

  function show(step) {
    const c = cardOf(step.card);
    copy.replaceChildren(
      el('span', 'flow-kicker', kinds(step) + ' · recorte original'),
      el('h3', '', step.label)
    );
    if (step.note) copy.append(el('p', '', step.note));
    if (c && c.t !== step.label && c.t !== step.note) copy.append(el('p', 'flow-note', c.t));
    cropImg.src = 'imagens/cards/' + c.f;
    cropImg.alt = c.t;
    crop.onclick = () => open(cropImg.src, c.t);
    crop.setAttribute('aria-label', 'Ampliar recorte original: ' + step.label);
    nodes.forEach(n => n.classList.toggle('is-on', n.dataset.id === step.id));
  }

  function makeNode(s, caption) {
    const b = el('button', 'flow-node'); b.type = 'button';
    b.dataset.id = s.id; b.dataset.kind = s.kind;
    b.append(el('small', '', caption), el('b', '', s.label));
    return b;
  }

  function activeFork(route) {
    const spine = route.spine;
    const here = spine[stepI]?.id;
    const forks = route.forks || [];
    const exact = forks.find(f => f.after === here);
    if (exact) return exact;
    let last = null;
    spine.forEach((s, i) => { if (i <= stepI && forks.some(f => f.after === s.id)) last = forks.find(f => f.after === s.id); });
    return last;
  }

  function renderForks() {
    const route = routes[routeI];
    branch.replaceChildren();
    nodes = nodes.filter(n => n.closest('.flow-rows'));
    const f = activeFork(route);
    if (!f) { drawWires(); return; }
    [f, ...(f.next || [])].forEach(s => {
      const b = makeNode(s, kinds(s));
      b.onclick = () => { stop(); show(s); };
      branch.append(b); nodes.push(b);
    });
    drawWires();
  }

  function render() {
    const route = routes[routeI];
    [...tabs.children].forEach((b, i) => b.setAttribute('aria-pressed', String(i === routeI)));
    if (route.covers) {
      covers.hidden = false;
      covers.replaceChildren();
      route.covers.forEach((c, i) => {
        const b = el('button', '', c.name); b.type = 'button';
        b.setAttribute('aria-pressed', String(i === coverI));
        b.onclick = () => { coverI = i; applyCover(); };
        covers.append(b);
      });
    } else covers.hidden = true;

    const spine = route.spine;
    const per = spine.length > 6 ? Math.ceil(spine.length / 2) : spine.length;
    rows.replaceChildren();
    nodes = [];
    spine.forEach((s, i) => {
      if (i % per === 0) rows.append(el('div', 'flow-row'));
      const col = el('div', 'flow-col');
      const b = makeNode(s, String(i + 1).padStart(2, '0'));
      b.onclick = () => { stop(); stepI = i; show(s); renderForks(); };
      col.append(b); rows.lastChild.append(col); nodes.push(b);
    });

    stepI = Math.min(stepI, spine.length - 1);
    show(spine[stepI]);
    renderForks();
  }

  function applyCover() {
    const route = routes[routeI];
    const c = route.covers[coverI];
    route.title = c.title; route.lead = c.lead;
    route.spine[0].label = c.name; route.spine[0].card = c.cover;
    const docs = route.spine.find(s => s.id === 'docs'); if (docs) docs.card = c.docs;
    [...covers.children].forEach((b, i) => b.setAttribute('aria-pressed', String(i === coverI)));
    stepI = 0; render();
  }

  routes.forEach((r, i) => {
    const b = el('button', '', r.tab); b.type = 'button'; b.setAttribute('role', 'tab');
    b.onclick = () => { stop(); routeI = i; stepI = 0; coverI = 0; render(); };
    tabs.append(b);
  });

  function tick() {
    const spine = routes[routeI].spine;
    timer = setTimeout(() => {
      timer = null;
      if (stepI >= spine.length - 1) { stop(); return; }
      stepI += 1; show(spine[stepI]); renderForks(); tick();
    }, reduced.matches ? 4200 : 2800);
  }
  function start() {
    if (timer) return;
    if (stepI >= routes[routeI].spine.length - 1) stepI = 0;
    play.setAttribute('aria-pressed', 'true'); play.textContent = '❚❚ Pausar';
    show(routes[routeI].spine[stepI]); renderForks(); tick();
  }
  function stop() {
    clearTimeout(timer); timer = null;
    play.setAttribute('aria-pressed', 'false'); play.textContent = '▶ Percorrer o fluxo';
  }
  play.onclick = () => (timer ? stop() : start());
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });

  root.addEventListener('keydown', e => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d || e.target.closest('input,textarea,select')) return;
    e.preventDefault(); e.stopPropagation(); stop();
    const spine = routes[routeI].spine;
    stepI = Math.max(0, Math.min(spine.length - 1, stepI + d));
    show(spine[stepI]); renderForks();
  });

  addEventListener('resize', () => requestAnimationFrame(drawWires));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(items => items.forEach(it => { if (!it.isIntersecting) stop(); }), { threshold: 0 });
    io.observe(root);
  }

  fig.replaceWith(root);
  render();
})();
