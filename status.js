(() => {
  const root = document.querySelector('#status-carousel');
  if (!root) return;
  const windowEl = root.querySelector('.status-window');
  const track = root.querySelector('.status-track');
  const real = [...track.children];
  const dots = [...root.querySelectorAll('.status-dots button')];
  const zoom = root.querySelector('.status-zoom');
  const names = real.map((slide) => slide.querySelector('p').textContent);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const narrow = window.matchMedia('(max-width: 760px)');
  const count = real.length;

  real.forEach((slide, i) => { slide.dataset.i = String(i); });
  const before = document.createDocumentFragment();
  const after = document.createDocumentFragment();
  real.forEach((slide) => {
    const copy = (node) => {
      const clone = node.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      return clone;
    };
    before.append(copy(slide));
    after.append(copy(slide));
  });
  track.prepend(before);
  track.append(after);

  let index = 0;
  let pointer = null;
  let snapping = false;

  function mod(n) { return (n % count + count) % count; }
  function place() {
    const active = track.children[count + index];
    const left = active.offsetLeft - track.offsetLeft;
    const x = (windowEl.clientWidth - active.offsetWidth) / 2 - left;
    track.style.transform = `translate3d(${x}px,0,0)`;
  }
  function paint() {
    const shown = mod(index);
    [...track.children].forEach((slide, i) => slide.classList.toggle('is-on', i === count + index));
    real.forEach((slide, i) => slide.setAttribute('aria-current', i === shown ? 'true' : 'false'));
    dots.forEach((dot, i) => dot.setAttribute('aria-selected', String(i === shown)));
    const img = real[shown].querySelector('img');
    zoom.dataset.src = img.getAttribute('src');
    zoom.setAttribute('aria-label', 'Ampliar a tela ' + names[shown]);
  }
  function freeze() {
    track.style.transition = 'none';
    [...track.children].forEach((slide) => { slide.style.transition = 'none'; });
  }
  function thaw() {
    track.style.transition = '';
    [...track.children].forEach((slide) => { slide.style.transition = ''; });
  }
  function show(next) {
    if (reduce) {
      index = mod(next);
      paint();
      place();
      return;
    }
    if (index < 0 || index >= count) {
      const delta = next - index;
      index = mod(index);
      freeze();
      paint();
      place();
      track.getBoundingClientRect();
      thaw();
      next = index + delta;
    }
    index = next;
    paint();
    place();
  }
  function settle() {
    if (index >= 0 && index < count) return;
    snapping = true;
    index = mod(index);
    freeze();
    paint();
    place();
    requestAnimationFrame(() => {
      thaw();
      snapping = false;
    });
  }

  root.querySelector('.status-prev').addEventListener('click', () => show(index - 1));
  root.querySelector('.status-next').addEventListener('click', () => show(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    const shown = mod(index);
    let delta = i - shown;
    if (delta > count / 2) delta -= count;
    if (delta < -count / 2) delta += count;
    show(index + delta);
  }));
  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(index - 1); }
  });
  track.addEventListener('transitionend', (event) => {
    if (event.target !== track || event.propertyName !== 'transform' || snapping) return;
    settle();
  });
  windowEl.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button')) return;
    pointer = { x: event.clientX };
    windowEl.setPointerCapture(event.pointerId);
  });
  windowEl.addEventListener('pointerup', (event) => {
    if (!pointer) return;
    const dx = event.clientX - pointer.x;
    pointer = null;
    if (dx <= -40) show(index + 1);
    else if (dx >= 40) show(index - 1);
  });
  windowEl.addEventListener('pointercancel', () => { pointer = null; });
  narrow.addEventListener('change', () => place());
  window.addEventListener('resize', () => place());
  show(0);
})();
