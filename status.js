(() => {
  const root = document.querySelector('#status-carousel');
  if (!root) return;
  const stage = root.querySelector('.status-window');
  const track = root.querySelector('.status-track');
  const slides = [...track.children];
  const dots = [...root.querySelectorAll('.status-dots button')];
  const zoom = root.querySelector('.status-zoom');
  const names = slides.map((slide) => slide.querySelector('p').textContent.trim());
  const count = slides.length;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 760px)');

  const floor = document.createElement('div');
  floor.className = 'status-floor';
  floor.setAttribute('aria-hidden', 'true');
  stage.prepend(floor);

  const title = document.createElement('p');
  title.className = 'status-active';
  const dock = document.createElement('div');
  dock.className = 'status-dock';
  dock.setAttribute('role', 'group');
  dock.setAttribute('aria-label', 'Controles do carrossel');
  const pos = document.createElement('span');
  pos.className = 'status-pos';
  const prev = root.querySelector('.status-prev');
  const next = root.querySelector('.status-next');
  dock.append(pos, prev, next);
  const bottom = document.createElement('div');
  bottom.className = 'status-bottom';
  const hint = document.createElement('p');
  hint.className = 'status-hint';
  hint.textContent = 'Arraste para explorar';
  bottom.append(title, dock, hint);
  stage.after(bottom);

  let index = 0;
  let drag = 0;
  let dragging = false;
  let gesture = null;
  let suppressUntil = 0;

  const wrap = (n) => (n % count + count) % count;
  const reach = () => (narrow.matches ? 1 : 2);

  function layout() {
    const width = stage.clientWidth || 1;
    const card = Math.min(narrow.matches ? 210 : 248, width * (narrow.matches ? 0.46 : 0.26));
    const step = card * 0.78;
    const shown = wrap(index);
    const limit = reach();
    slides.forEach((slide, i) => {
      let delta = i - shown;
      if (delta > count / 2) delta -= count;
      if (delta < -count / 2) delta += count;
      const offset = delta + drag;
      const distance = Math.abs(offset);
      const visible = delta >= -limit && delta <= limit;
      const selected = delta === 0;
      slide.classList.toggle('is-on', selected);
      slide.classList.toggle('is-far', !visible);
      slide.style.setProperty('--shade', String(Math.min(distance, 2) * 0.2));
      slide.style.zIndex = String(10 - Math.abs(delta));
      slide.style.opacity = visible ? '1' : '0';
      slide.style.pointerEvents = visible ? '' : 'none';
      slide.style.transform = `translate(-50%, -50%) translate3d(${offset * step}px, 0, ${-Math.min(distance, 3) * 130}px) rotateY(${-Math.max(-42, Math.min(42, offset * 30))}deg) scale(${1 - Math.min(distance, 3) * 0.08})`;
      slide.setAttribute('aria-current', selected ? 'true' : 'false');
      slide.tabIndex = selected ? 0 : -1;
    });
    dots.forEach((dot, i) => dot.setAttribute('aria-selected', String(i === shown)));
    const img = slides[shown].querySelector('img');
    zoom.dataset.src = img.getAttribute('src');
    zoom.setAttribute('aria-label', 'Ampliar a tela ' + names[shown]);
    title.textContent = names[shown];
    pos.innerHTML = `<b>${String(shown + 1).padStart(2, '0')}</b><span>/</span><span>${String(count).padStart(2, '0')}</span>`;
    stage.style.setProperty('--card', card + 'px');
  }

  function show(next) {
    index = wrap(next);
    drag = 0;
    layout();
  }

  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      if (performance.now() < suppressUntil) return;
      let delta = i - wrap(index);
      if (delta > count / 2) delta -= count;
      if (delta < -count / 2) delta += count;
      if (delta === 0) zoom.click();
      else show(index + delta);
    });
  });
  root.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(index - 1); }
    if (event.key === 'Home') { event.preventDefault(); show(0); }
    if (event.key === 'End') { event.preventDefault(); show(count - 1); }
  });

  stage.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.target.closest('button')) return;
    gesture = { x: event.clientX, y: event.clientY, t: performance.now(), horizontal: false };
  });
  stage.addEventListener('pointermove', (event) => {
    if (!gesture) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (!gesture.horizontal && Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) {
      gesture = null;
      return;
    }
    if (!gesture.horizontal && Math.abs(dx) > 8) {
      gesture.horizontal = true;
      dragging = true;
      stage.setPointerCapture(event.pointerId);
      stage.dataset.dragging = 'true';
    }
    if (gesture.horizontal) {
      const card = parseFloat(stage.style.getPropertyValue('--card')) || 220;
      drag = Math.max(-1.2, Math.min(1.2, dx / (card * 0.78)));
      layout();
    }
  });
  function endGesture(event, cancel) {
    if (!gesture) return;
    const start = gesture;
    gesture = null;
    if (start.horizontal) {
      const dx = event.clientX - start.x;
      const card = parseFloat(stage.style.getPropertyValue('--card')) || 220;
      const velocity = Math.abs(dx) / Math.max(1, performance.now() - start.t);
      if (!cancel && (Math.abs(dx) > Math.min(55, card * 0.18) || (Math.abs(dx) > 14 && velocity > 0.35))) {
        show(index + (dx < 0 ? 1 : -1));
      }
      suppressUntil = performance.now() + 300;
    }
    drag = 0;
    dragging = false;
    delete stage.dataset.dragging;
    layout();
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
  }
  stage.addEventListener('pointerup', (event) => endGesture(event, false));
  stage.addEventListener('pointercancel', (event) => endGesture(event, true));
  addEventListener('resize', () => layout());
  narrow.addEventListener('change', () => layout());
  reduced.addEventListener('change', () => layout());
  layout();
})();
