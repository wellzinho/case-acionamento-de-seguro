(() => {
  const fit = document.querySelector(".journey-fit");
  const frame = document.querySelector("#journey-frame");
  const restart = document.querySelector("#journey-restart");
  if (!fit || !frame) return;

  function scale() {
    fit.style.setProperty("--scale", String(fit.clientHeight / 780));
  }

  scale();
  addEventListener("resize", scale);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(scale);

  if (restart) {
    restart.addEventListener("click", () => {
      frame.src = "jornada/index.html";
    });
  }
})();
