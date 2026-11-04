(() => {
  const root = document.querySelector('#bench-show');
  if (!root) return;
  const slides = [...root.querySelectorAll('.desk-slide')];
  const dots = [...root.querySelectorAll('.desk-dots button')];
  const tracks = [...root.querySelectorAll('.desk-track')];
  const url = root.querySelector('.desk-url');
  const count = root.querySelector('.desk-count');
  const refZoom = root.querySelector('[data-zoom="ref"]');
  const appZoom = root.querySelector('[data-zoom="app"]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const urls = [
    'www.bradescoseguros.com.br',
    'www.bradescoseguros.com.br',
    'portal.sulamericaseguros.com.br'
  ];
  const refs = [
    'imagens/bench/cobertura.jpg',
    'imagens/bench/prazo-completo.jpg',
    'imagens/bench/envio-completo.jpg'
  ];
  const apps = [
    'imagens/edu0.png',
    'imagens/analysis.png',
    'imagens/reel/screens/docs.png'
  ];
  let index = 0;

  function go(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const on = i === index;
      slide.classList.toggle('is-on', on);
      slide.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    dots.forEach((dot, i) => dot.setAttribute('aria-selected', String(i === index)));
    tracks.forEach((track) => track.style.setProperty('--i', String(index)));
    url.classList.add('is-dim');
    window.setTimeout(() => {
      url.textContent = urls[index];
      url.classList.remove('is-dim');
    }, reduce ? 0 : 140);
    count.textContent = String(index + 1).padStart(2, '0') + ' / 0' + slides.length;
    refZoom.dataset.src = refs[index];
    appZoom.dataset.src = apps[index];
    refZoom.setAttribute('aria-label', 'Ampliar a referência ' + (index + 1));
    appZoom.setAttribute('aria-label', 'Ampliar a tela da jornada ' + (index + 1));
  }

  root.querySelector('.desk-prev').addEventListener('click', () => go(index - 1));
  root.querySelector('.desk-next').addEventListener('click', () => go(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));
  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); go(index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(index - 1); }
  });

  const view = root.querySelector('.browser-view');
  let startX = null;
  view.addEventListener('pointerdown', (event) => { startX = event.clientX; });
  view.addEventListener('pointerup', (event) => {
    if (startX == null) return;
    const delta = event.clientX - startX;
    startX = null;
    if (Math.abs(delta) > 48) go(index + (delta < 0 ? 1 : -1));
  });
  view.addEventListener('pointercancel', () => { startX = null; });

  root.querySelector('.desk-dots').addEventListener('animationend', (event) => {
    if (reduce || event.animationName !== 'desk-meter') return;
    if (event.target !== dots[index]) return;
    go(index + 1);
  });

  const preset = Number(new URLSearchParams(location.search).get('b'));
  if (preset) go(preset);
})();
