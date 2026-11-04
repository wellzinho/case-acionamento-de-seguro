(() => {
  const root = document.querySelector('#gem-chat');
  if (!root) return;

  const PROMPT = `Você é especialista em UX, acessibilidade e conversão.

Analise a tela anexada e responda com nota de 0 a 10:
1. Usabilidade: hierarquia, clareza e CTAs
2. Acessibilidade: contraste, toque e barreiras
3. Fricção: o que pode gerar abandono
4. Mapa de calor simulado: primeiro, segundo e terceiro foco

Feche com recomendações práticas.`;
  const TEXTS = [
    'Diagnóstico geral',
    '8,5',
    'A hierarquia está clara e o objetivo da etapa aparece cedo. O valor, os certificados e o botão Continuar sustentam a leitura. Eu revisaria o contraste e o bloco de texto antes da ação.',
    'Recomendações',
    'Contraste do valor e dos textos de apoio',
    'CTA Continuar sem competir com a lista de certificados',
    'Mapa de calor simulado: primeiro o valor, depois os certificados, por último o texto'
  ];

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const phone = document.querySelector('#s16 .gem-phone');
  const label = phone.querySelector('small');
  const typed = root.querySelector('.gem-typed');
  const field = root.querySelector('.gem-field');
  const placeholder = root.querySelector('.gem-placeholder');
  const send = root.querySelector('.gem-send');
  const chip = root.querySelector('.gem-chip');
  const thread = root.querySelector('.gem-thread');
  const user = root.querySelector('.gem-user');
  const userText = user.querySelector('p');
  const think = root.querySelector('.gem-think');
  const reply = root.querySelector('.gem-reply');
  const lines = [...root.querySelectorAll('[data-line]')];
  const suffix = root.querySelector('.gem-suffix');
  let ctrl = null;
  let onScreen = false;

  function wait(ms, signal) {
    return new Promise((resolve, reject) => {
      if (signal.aborted) {
        reject(new DOMException('aborted', 'AbortError'));
        return;
      }
      const timer = setTimeout(resolve, ms);
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new DOMException('aborted', 'AbortError'));
      }, { once: true });
    });
  }

  function delayFor(ch, base, slowPunct) {
    if (ch === '\n') return slowPunct ? 90 : 36;
    if (ch === '.' || ch === '!' || ch === '?') return (slowPunct ? 220 : 48) + Math.random() * 30;
    if (ch === ',' || ch === ':' || ch === ';') return (slowPunct ? 110 : 28) + Math.random() * 16;
    if (ch === ' ') return base * 0.35;
    return base + Math.random() * base * 0.4;
  }

  function scroll() {
    thread.scrollTop = thread.scrollHeight;
  }

  function reset() {
    typed.textContent = '';
    field.scrollTop = 0;
    placeholder.hidden = false;
    root.classList.remove('is-composing', 'is-restart');
    send.classList.remove('is-pop');
    chip.hidden = false;
    user.hidden = true;
    userText.textContent = '';
    think.hidden = true;
    reply.hidden = true;
    lines.forEach((line) => {
      line.hidden = true;
      line.textContent = '';
      line.classList.remove('is-typing');
    });
    suffix.hidden = true;
    phone.classList.remove('is-noted');
    label.textContent = 'Tela anexada';
    thread.scrollTop = 0;
  }

  function showFinal() {
    reset();
    chip.hidden = true;
    user.hidden = false;
    userText.textContent = PROMPT;
    reply.hidden = false;
    lines.forEach((line, index) => {
      line.hidden = false;
      line.textContent = TEXTS[index];
    });
    suffix.hidden = false;
    phone.classList.add('is-noted');
    label.textContent = 'Anotações da ferramenta';
    scroll();
  }

  async function typeInto(el, text, signal, base) {
    el.hidden = false;
    el.classList.add('is-typing');
    for (const ch of text) {
      el.textContent += ch;
      scroll();
      await wait(delayFor(ch, base, true), signal);
    }
    el.classList.remove('is-typing');
  }

  async function play(signal) {
    reset();
    await wait(420, signal);

    placeholder.hidden = true;
    root.classList.add('is-composing');
    for (const ch of PROMPT) {
      typed.textContent += ch;
      field.scrollTop = field.scrollHeight;
      await wait(delayFor(ch, 5, false), signal);
    }

    await wait(360, signal);
    send.classList.add('is-pop');
    await wait(160, signal);

    chip.hidden = true;
    typed.textContent = '';
    placeholder.hidden = false;
    root.classList.remove('is-composing');
    send.classList.remove('is-pop');
    user.hidden = false;
    userText.textContent = PROMPT;
    scroll();

    await wait(640, signal);
    think.hidden = false;
    scroll();
    await wait(1150, signal);
    think.hidden = true;
    reply.hidden = false;
    phone.classList.add('is-noted');
    label.textContent = 'Anotações da ferramenta';

    for (let i = 0; i < lines.length; i += 1) {
      await typeInto(lines[i], TEXTS[i], signal, 11);
      if (i === 1) suffix.hidden = false;
    }

    await wait(6800, signal);
    root.classList.add('is-restart');
    phone.classList.remove('is-noted');
    label.textContent = 'Tela anexada';
    await wait(420, signal);
  }

  async function loop(signal) {
    try {
      while (!signal.aborted) await play(signal);
    } catch (err) {
      if (!err || err.name !== 'AbortError') console.error(err);
    }
  }

  function stop() {
    ctrl?.abort();
    ctrl = null;
  }

  function start() {
    stop();
    if (reduced) {
      showFinal();
      return;
    }
    ctrl = new AbortController();
    loop(ctrl.signal);
  }

  const original = document.querySelector('.gem-original');
  const viewer = document.querySelector('#viewer');
  if (original && viewer) {
    const hint = viewer.querySelector('p');
    const hintDefault = hint.textContent;
    original.onclick = () => {
      const full = document.querySelector('#full');
      full.src = original.dataset.src;
      full.alt = original.getAttribute('aria-label');
      hint.textContent = 'Imagem completa · Esc para fechar';
      viewer.classList.add('is-fit');
      viewer.showModal();
    };
    viewer.addEventListener('close', () => {
      viewer.classList.remove('is-fit');
      hint.textContent = hintDefault;
    });
  }

  if (reduced) {
    showFinal();
    return;
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen && !document.hidden) start();
      else stop();
    }, { threshold: 0.22 }).observe(root);
  } else {
    start();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (onScreen) start();
  });
})();
