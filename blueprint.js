/* Service Blueprint interativo (seção 07).
   Substitui o print do quadro por um mapa legível: etapas × camadas,
   com as notas originais da dinâmica, decisões ancoradas e minimapa. */
(() => {
  if (typeof blueprintMap === 'undefined' || typeof boardCards === 'undefined') return;
  const sec = document.querySelector('#s7');
  if (!sec) return;
  const data = blueprintMap, cards = boardCards.blueprint, L = data.lanes, S = data.stages;
  const PERIOD = 5500;
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const pad = n => String(n + 1).padStart(2, '0');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const viewer = document.querySelector('#viewer'), full = document.querySelector('#full');
  const open = (src, alt) => { full.src = src; full.alt = alt; viewer.showModal(); };
  const figure = sec.querySelector('figure.bp-original') || sec.querySelector('figure');
  const focusPanel = sec.querySelector('.bp-focus');
  const notes = sec.querySelector('details.notes p');
  const total = S.reduce((n, s) => n + s.cells.reduce((m, c) => m + c.length, 0), 0);

  /* ---------- estrutura ---------- */
  const root = el('div', 'bpx');
  root.setAttribute('role', 'region');
  root.setAttribute('aria-label', 'Service Blueprint interativo do acionamento de seguro');
  root.style.setProperty('--period', PERIOD + 'ms');

  const head = el('div', 'bpx-head');
  const title = el('div', 'bpx-title');
  title.append(el('span', 'bpx-kicker', 'Service Blueprint · Acionamento no app'), el('p', '', S.length + ' etapas · ' + L.length + ' camadas · ' + total + ' notas da dinâmica'));
  const tools = el('div', 'bpx-tools');
  const play = el('button', 'bpx-play', '▶ Percorrer etapas'); play.type = 'button'; play.setAttribute('aria-pressed', 'false');
  const mapBtn = el('button', 'bpx-mapbtn', 'Quadro original ⤢'); mapBtn.type = 'button';
  mapBtn.onclick = () => open('imagens/blueprint-overview.webp', 'Service Blueprint completo, como ficou ao final da dinâmica');
  tools.append(play, mapBtn); head.append(title, tools);

  const steps = el('div', 'bpx-steps'); steps.setAttribute('role', 'tablist'); steps.setAttribute('aria-label', 'Etapas da jornada');
  const stepButtons = S.map((s, i) => {
    const b = el('button', 'bpx-step'); b.type = 'button'; b.setAttribute('role', 'tab'); b.id = 'bpx-tab-' + i;
    b.append(el('small', '', pad(i)), el('b', '', s.name), el('i', 'bpx-bar'));
    b.onclick = () => { stop(); select(i); };
    steps.append(b); return b;
  });

  const grid = el('div', 'bpx-grid'); grid.style.setProperty('--cols', S.length);
  const cellsByLane = [], laneButtons = [];
  L.forEach((lane, li) => {
    if (li > 0 && data.lines[li - 1]) { const line = el('div', 'bpx-line'); line.append(el('span', '', data.lines[li - 1])); grid.append(line); }
    const lb = el('button', 'bpx-lane'); lb.type = 'button'; lb.style.setProperty('--lane', lane.color); lb.setAttribute('aria-pressed', 'false');
    lb.append(el('b', '', lane.name), el('span', '', lane.sub)); lb.title = 'Focar apenas esta camada';
    lb.onclick = () => { stop(); focusLane(laneFocus === li ? -1 : li); };
    grid.append(lb); laneButtons.push(lb);
    const row = [];
    S.forEach((s, si) => {
      const items = s.cells[li], n = items.length, dec = data.decisions.filter(d => d.stage === si && d.lane === li), empty = s.empty && s.empty[li];
      const c = el('button', 'bpx-cell' + (si === 0 ? ' edge-l' : si >= S.length - 2 ? ' edge-r' : '')); c.type = 'button'; c.style.setProperty('--lane', lane.color); c.style.setProperty('--d', si);
      const dots = el('span', 'bpx-dots'); const shown = Math.min(n, 9);
      for (let k = 0; k < shown; k++) { const d = el('i'); d.style.setProperty('--k', k); dots.append(d); }
      if (n > shown) dots.append(el('em', '', '+' + (n - shown)));
      c.append(dots);
      if (dec.length) { const pin = el('span', 'bpx-pin', dec.length > 1 ? String(dec.length) : ''); c.append(pin); c.classList.add('has-decision'); }
      if (!n) c.classList.add('empty');
      const count = n ? n + (n > 1 ? ' notas' : ' nota') : (empty || 'sem notas');
      c.dataset.tip = count + (dec.length ? ' · ◆ ' + dec.map(d => d.tag).join(', ') : '');
      c.setAttribute('aria-label', s.name + ' · ' + lane.name + ': ' + c.dataset.tip);
      c.onclick = () => { stop(); select(si, li); };
      grid.append(c); row.push(c);
    });
    cellsByLane.push(row);
  });

  const detail = el('div', 'bpx-detail'); detail.setAttribute('aria-live', 'polite');
  const story = el('div', 'bpx-story'), notesCol = el('div', 'bpx-notes');
  notesCol.setAttribute('role', 'group');
  notesCol.setAttribute('aria-roledescription', 'carrossel');
  notesCol.setAttribute('aria-label', 'Notas da etapa por camada');
  const car = el('div', 'bpx-car');
  const prev = el('button', 'bpx-car-btn'); prev.type = 'button';
  const prevName = el('span');
  prev.append(el('i', 'bpx-car-arrow', '←'), prevName);
  const next = el('button', 'bpx-car-btn'); next.type = 'button';
  const nextName = el('span');
  next.append(nextName, el('i', 'bpx-car-arrow', '→'));
  const carCopy = el('div', 'bpx-car-copy');
  const carName = el('b');
  const carMeta = el('span');
  carCopy.append(carName, carMeta);
  car.append(prev, carCopy, next);
  const carView = el('div', 'bpx-car-view');
  const dots = el('div', 'bpx-car-dots');
  const dotBtns = L.map((lane, li) => {
    const b = el('button', 'bpx-car-dot'); b.type = 'button';
    b.setAttribute('aria-label', lane.name);
    b.onclick = () => { stop(); showLane(li); };
    dots.append(b); return b;
  });
  notesCol.append(car, carView, dots);
  detail.append(story, notesCol);
  const mini = el('button', 'bpx-mini'); mini.type = 'button'; mini.setAttribute('aria-label', 'Abrir o quadro original ampliado');
  const miniImg = el('img'); miniImg.src = 'imagens/blueprint.png'; miniImg.alt = ''; miniImg.loading = 'lazy';
  const miniMark = el('span', 'bpx-mark');
  mini.append(miniImg, miniMark, el('span', 'bpx-mini-label', 'Posição no quadro original'));
  mini.onclick = () => open('imagens/blueprint-overview.webp', 'Service Blueprint completo, como ficou ao final da dinâmica');

  const foot = el('p', 'bpx-foot', 'Reconstrução legível do quadro da dinâmica. As cores seguem as camadas originais; toque em uma nota para ver o post-it como foi escrito. Setas ← → percorrem as etapas.');
  root.append(head, steps, grid, detail, foot);

  /* ---------- estado ---------- */
  let current = -1, laneFocus = -1, noteLane = 0, noteDir = 1, timer = null;

  function render(i, spot) {
    const s = S[i];
    story.replaceChildren();
    const sh = el('div', 'bpx-stage-head');
    sh.append(el('small', 'bpx-kicker', 'Etapa ' + pad(i) + ' de ' + S.length), el('h3', '', s.name), el('p', '', s.summary));
    story.append(sh);
    const decs = data.decisions.filter(d => d.stage === i && (laneFocus < 0 || d.lane === laneFocus));
    if (decs.length) {
      const wrap = el('div', 'bpx-decisions'); wrap.append(el('small', 'bpx-kicker', decs.length > 1 ? 'Decisões facilitadas na dinâmica' : 'Decisão facilitada na dinâmica'));
      decs.forEach(d => {
        const c = cards[d.card], card = el('article', 'bpx-decision'), copy = el('div');
        copy.append(el('span', 'bpx-tag', d.tag), el('h4', '', d.q), el('p', '', d.a));
        const crop = el('button', 'bpx-crop'); crop.type = 'button'; crop.setAttribute('aria-label', 'Ampliar nota original: ' + d.tag);
        const im = el('img'); im.src = 'imagens/cards/' + c.f; im.alt = c.t; im.loading = 'lazy'; crop.append(im);
        crop.onclick = () => open(im.src, c.t);
        card.append(copy, crop); wrap.append(card);
      });
      story.append(wrap);
    }
    story.append(mini);

    renderNotes(spot === noteLane);
    placeMark();
    if (!reduced.matches) detail.animate([{ opacity: .25, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 340, easing: 'cubic-bezier(.2,.8,.25,1)' });
  }

  function placeMark() {
    const s = S[current];
    const [x0, x1] = s.span, [y0, y1] = data.laneSpans[noteLane];
    Object.assign(miniMark.style, { left: x0 * 100 + '%', width: (x1 - x0) * 100 + '%', top: y0 * 100 + '%', height: (y1 - y0) * 100 + '%' });
    cellsByLane.forEach((row, j) => row.forEach(c => c.classList.toggle('lane-on', j === noteLane)));
  }
  function renderNotes(spot) {
    const s = S[current], lane = L[noteLane], items = s.cells[noteLane];
    const prevLane = L[(noteLane + L.length - 1) % L.length], nextLane = L[(noteLane + 1) % L.length];
    carCopy.style.setProperty('--lane', lane.color);
    carName.textContent = lane.name;
    const count = items.length ? items.length + (items.length > 1 ? ' notas' : ' nota') : ((s.empty && s.empty[noteLane]) || 'Sem notas nesta etapa');
    carMeta.textContent = lane.sub + ' · ' + count;
    prevName.textContent = prevLane.name;
    nextName.textContent = nextLane.name;
    prev.setAttribute('aria-label', 'Camada anterior: ' + prevLane.name);
    next.setAttribute('aria-label', 'Próxima camada: ' + nextLane.name);
    dotBtns.forEach((b, j) => {
      b.style.setProperty('--lane', L[j].color);
      if (j === noteLane) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
    const group = el('section', 'bpx-group');
    group.style.setProperty('--lane', lane.color);
    if (items.length) {
      const list = el('ul', 'bpx-list');
      items.forEach(({ i: ci, s: short }, k) => {
        const c = cards[ci], item = el('li'), b = el('button', 'bpx-note');
        b.type = 'button'; b.style.setProperty('--k', k); b.append(el('span', '', short || c.t));
        b.title = c.t; b.setAttribute('aria-label', (short || c.t) + '. Abrir nota original');
        b.onclick = () => open('imagens/cards/' + c.f, c.t);
        item.append(b); list.append(item);
      });
      group.append(list);
    } else {
      group.classList.add('is-empty');
      group.append(el('p', 'bpx-empty', (s.empty && s.empty[noteLane]) || 'Sem notas nesta etapa'));
    }
    if (spot) group.classList.add('spot');
    carView.replaceChildren(group);
  }
  function showLane(li) {
    const next = (li + L.length) % L.length;
    noteDir = li < noteLane ? -1 : 1;
    noteLane = next;
    renderNotes(false);
    placeMark();
    if (!reduced.matches) carView.animate([{ opacity: 0, transform: 'translateX(' + (noteDir * 18) + 'px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.2,.8,.25,1)' });
  }
  prev.onclick = () => { stop(); showLane(noteLane - 1); };
  next.onclick = () => { stop(); showLane(noteLane + 1); };
  notesCol.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault(); e.stopPropagation(); stop();
    showLane(noteLane + (e.key === 'ArrowRight' ? 1 : -1));
  });

  function select(i, spot) {
    current = i;
    if (typeof spot === 'number') noteLane = spot;
    stepButtons.forEach((b, j) => { b.setAttribute('aria-selected', String(j === i)); b.tabIndex = j === i ? 0 : -1; });
    cellsByLane.forEach(row => row.forEach((c, j) => c.classList.toggle('active', j === i)));
    render(i, spot);
  }
  function focusLane(li) {
    laneFocus = li;
    if (li > -1) noteLane = li;
    laneButtons.forEach((b, j) => b.setAttribute('aria-pressed', String(j === li)));
    grid.classList.toggle('lane-focus', li > -1);
    cellsByLane.forEach((row, j) => row.forEach(c => c.classList.toggle('dim', li > -1 && j !== li)));
    render(current);
  }

  /* ---------- modo percorrer ---------- */
  function restartBar() { const bar = stepButtons[current].querySelector('.bpx-bar'); bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; }
  function start() {
    if (timer) return;
    if (current >= S.length - 1) select(0);
    root.classList.add('playing'); play.setAttribute('aria-pressed', 'true'); play.textContent = '❚❚ Pausar'; restartBar(); tick();
  }
  function tick() {
    timer = setTimeout(() => {
      timer = null;
      if (current >= S.length - 1) { stop(); return; }
      select(current + 1); tick();
    }, reduced.matches ? PERIOD * 1.4 : PERIOD);
  }
  function stop() {
    if (!timer && !root.classList.contains('playing')) return;
    clearTimeout(timer); timer = null;
    root.classList.remove('playing'); play.setAttribute('aria-pressed', 'false'); play.textContent = '▶ Percorrer etapas';
  }
  play.onclick = () => (timer ? stop() : start());
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });

  /* ---------- teclado ---------- */
  root.addEventListener('keydown', e => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : e.key === 'Home' ? -Infinity : e.key === 'End' ? Infinity : 0;
    if (!d || !e.target.closest('.bpx-steps,.bpx-grid')) return;
    e.preventDefault(); e.stopPropagation(); stop();
    const n = Math.max(0, Math.min(S.length - 1, d === -Infinity ? 0 : d === Infinity ? S.length - 1 : current + d));
    select(n); stepButtons[n].focus();
  });

  /* ---------- montagem ---------- */
  if (figure) figure.replaceWith(root); else sec.querySelector('.inner').append(root);
  if (focusPanel) focusPanel.remove();
  if (notes) notes.append(' Na apresentação, percorra as etapas do blueprint: cada coluna mostra o que o cliente vê e o que acontece nos bastidores, com as notas originais ao toque.');
  select(0);

  if (!reduced.matches && 'IntersectionObserver' in window) {
    root.classList.add('bpx-animate');
    const io = new IntersectionObserver(items => items.forEach(it => {
      if (it.isIntersecting) { root.classList.add('assembled'); io.unobserve(root); }
    }), { threshold: .18 });
    io.observe(root);
    const away = new IntersectionObserver(items => items.forEach(it => { if (!it.isIntersecting) stop(); }), { threshold: 0 });
    away.observe(root);
  }
})();
