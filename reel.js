(() => {
  const mount = document.querySelector('#app-reel');
  if (!mount) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HOLD = 3600;
  const shots = [
    { src: 'imagens/reel/screens/home.png', label: 'Acionar pelo app', x: 68, y: 31 },
    { src: 'imagens/reel/screens/reasons.png', label: 'Escolher perda de renda', x: 26, y: 36 },
    { src: 'imagens/reel/screens/cover.png', label: 'Entender a cobertura', x: 50, y: 92 },
    { src: 'imagens/reel/screens/docs.png', label: 'Enviar os documentos', x: 50, y: 93 },
    { src: 'imagens/reel/screens/done.png', label: 'Acompanhar o pedido', x: 50, y: 91 }
  ];
  const labels = shots.map(shot => shot.label);

  mount.innerHTML = `<div class="reel-stage">
    <div class="reel-wash" aria-hidden="true">${shots.map(shot => `<img src="${shot.src}" alt="">`).join('')}</div>
    <div class="reel-bezel">
      <div class="reel-viewport" aria-hidden="true">
        <div class="reel-fit">${shots.map(shot => `<img class="reel-screen" src="${shot.src}" alt="">`).join('')}<i class="reel-tap" hidden></i></div>
      </div>
    </div>
    <div class="reel-dock">
      <div class="reel-meter" role="tablist" aria-label="Trechos da jornada">${labels.map((label) => `<button type="button" role="tab" aria-label="${label}"><i></i></button>`).join('')}</div>
      <div class="reel-meta">
        <p><small id="reel-count">01 / 0${labels.length}</small><span id="reel-label">${labels[0]}</span></p>
        <button type="button" class="reel-toggle" aria-pressed="false">Reproduzir</button>
      </div>
    </div>
  </div>`;

  const viewport = mount.querySelector('.reel-viewport');
  const fit = mount.querySelector('.reel-fit');
  const frames = [...mount.querySelectorAll('.reel-screen')];
  const wash = [...mount.querySelectorAll('.reel-wash img')];
  const tabs = [...mount.querySelectorAll('.reel-meter button')];
  const fills = tabs.map(tab => tab.querySelector('i'));
  const tap = mount.querySelector('.reel-tap');
  const count = mount.querySelector('#reel-count');
  const caption = mount.querySelector('#reel-label');
  const toggle = mount.querySelector('.reel-toggle');
  let index = 0;
  let playing = false;
  let auto = !reduced;
  let onScreen = false;
  let beatReady = false;
  let remaining = HOLD;
  let started = 0;
  let timer = null;

  function scale() {
    const width = viewport.clientWidth;
    if (width) fit.style.transform = `scale(${width / 360})`;
  }

  function placeTap() {
    const shot = shots[index];
    tap.hidden = false;
    tap.style.left = `${shot.x / 100 * 360}px`;
    tap.style.top = `${shot.y / 100 * 780}px`;
  }

  function paintToggle() {
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.textContent = playing ? 'Pausar' : 'Reproduzir';
  }

  function show(i) {
    index = i;
    clearTimeout(timer);
    beatReady = true;
    remaining = HOLD;
    frames.forEach((frame, n) => frame.classList.toggle('on', n === i));
    wash.forEach((img, n) => img.classList.toggle('on', n === i));
    tabs.forEach((tab, n) => {
      tab.classList.toggle('done', n < i);
      tab.classList.toggle('now', n === i);
      tab.setAttribute('aria-selected', n === i ? 'true' : 'false');
    });
    fills.forEach((fill, n) => {
      fill.style.transition = 'none';
      fill.style.width = n < i ? '100%' : '0%';
    });
    count.textContent = `${String(i + 1).padStart(2, '0')} / 0${labels.length}`;
    caption.textContent = labels[i];
    fit.classList.remove('is-beat', 'is-paused');
    void fit.offsetWidth;
    fit.classList.add('is-beat');
    placeTap();
    if (!playing) {
      fit.classList.add('is-paused');
      return;
    }
    const bar = fills[i];
    void bar.offsetWidth;
    bar.style.transition = `width ${HOLD}ms linear`;
    bar.style.width = '100%';
    started = performance.now();
    timer = setTimeout(advance, HOLD);
  }

  function advance() {
    show((index + 1) % frames.length);
  }

  function freeze() {
    if (!playing) return;
    clearTimeout(timer);
    remaining = Math.max(80, remaining - (performance.now() - started));
    const bar = fills[index];
    const parent = bar.parentElement.getBoundingClientRect().width || 1;
    const ratio = Math.min(1, bar.getBoundingClientRect().width / parent);
    bar.style.transition = 'none';
    bar.style.width = `${ratio * 100}%`;
    playing = false;
    fit.classList.add('is-paused');
    paintToggle();
  }

  function play() {
    if (playing) return;
    playing = true;
    fit.classList.remove('is-paused');
    paintToggle();
    if (!beatReady) { show(index); return; }
    const bar = fills[index];
    bar.style.transition = `width ${remaining}ms linear`;
    requestAnimationFrame(() => { bar.style.width = '100%'; });
    started = performance.now();
    timer = setTimeout(advance, remaining);
  }

  function sync() {
    if (auto && onScreen && !document.hidden) play();
    else freeze();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => { auto = false; freeze(); show(i); });
  });
  toggle.addEventListener('click', () => {
    if (playing) { auto = false; freeze(); }
    else { auto = true; play(); }
  });

  const stage = mount.querySelector('.reel-stage');
  const bezel = mount.querySelector('.reel-bezel');
  const washEl = mount.querySelector('.reel-wash');
  const dock = mount.querySelector('.reel-dock');
  const turn = document.createElement('div');
  const rotor = document.createElement('div');
  const back = document.createElement('div');
  turn.className = 'reel-turn';
  rotor.className = 'reel-rotor';
  back.className = 'reel-back';
  back.setAttribute('aria-hidden', 'true');
  back.innerHTML = '<span class="reel-cam"><i></i><i></i><b></b></span>';
  bezel.replaceWith(turn);
  rotor.append(bezel, back);
  turn.append(rotor);

  const run = document.createElement('div');
  const pin = document.createElement('div');
  run.className = 'reel-run';
  pin.className = 'reel-pin';
  if (!reduced) run.classList.add('is-armed');
  run.append(pin);
  mount.replaceWith(run);
  pin.append(mount);

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v) => Math.max(0, Math.min(1, v));
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  let spinQueued = false;

  function paintSpin() {
    spinQueued = false;
    if (motion.matches) {
      run.classList.remove('is-armed');
      stage.classList.remove('is-turning');
      rotor.style.transform = '';
      pin.style.transform = '';
      dock.style.opacity = '';
      return;
    }
    const rect = run.getBoundingClientRect();
    const stickyTop = Math.max(72, (innerHeight - pin.offsetHeight) * 0.42);
    const travel = Math.max(1, run.offsetHeight - pin.offsetHeight);
    const raw = (stickyTop - rect.top) / travel;
    const held = clamp(raw);
    pin.style.transform = raw > 0 ? `translate3d(0, ${held * travel}px, 0)` : '';
    if (raw <= 0 || rect.bottom < -160) {
      stage.classList.remove('is-turning');
      rotor.style.transform = '';
      dock.style.opacity = '';
      washEl.style.setProperty('--sway', '0');
      washEl.style.setProperty('--surge', '0');
      return;
    }
    const spun = easeInOut(held);
    const arc = Math.sin(clamp(spun) * Math.PI);
    stage.classList.add('is-turning');
    rotor.style.transform = `translate3d(0, ${arc * -54}px, 0) rotateX(${8 - spun * 360}deg) scale(${1 + arc * 0.2})`;
    washEl.style.setProperty('--sway', String(Math.sin(spun * Math.PI * 2) * -5));
    washEl.style.setProperty('--surge', String(arc));
    dock.style.opacity = String(Math.max(0, 1 - arc * 1.2));
  }

  function requestSpin() {
    if (!spinQueued) {
      spinQueued = true;
      requestAnimationFrame(paintSpin);
    }
  }

  if (!reduced) {
    addEventListener('scroll', requestSpin, { passive: true });
    addEventListener('resize', requestSpin);
    motion.addEventListener('change', requestSpin);
    requestSpin();
  }

  scale();
  show(0);
  addEventListener('resize', scale);
  if ('ResizeObserver' in window) new ResizeObserver(scale).observe(viewport);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting && entry.intersectionRatio >= 0.4;
      sync();
    }, { threshold: [0, 0.4, 0.75] }).observe(mount);
  } else {
    onScreen = true;
    sync();
  }
  document.addEventListener('visibilitychange', sync);

  const original = document.querySelector('.reel-original');
  if (original) original.addEventListener('click', () => {
    const full = document.querySelector('#full');
    full.src = original.dataset.src;
    full.alt = 'Apólices agrupadas na experiência de acionamento';
    document.querySelector('#viewer').showModal();
  });
})();
