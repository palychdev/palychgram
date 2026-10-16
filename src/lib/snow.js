/* Снег как в ExteraGram: canvas-оверлей, ноль зависимостей. */
(function () {
  "use strict";
  let canvas = null, raf = 0, flakes = [];
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (canvas) canvas.remove();
    canvas = null;
  }
  function startFx() {
    stop();
    canvas = document.createElement("canvas");
    canvas.id = "pg-snow";
    canvas.style.cssText = "position:fixed;inset:0;z-index:999998;pointer-events:none";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
    resize();
    addEventListener("resize", resize);
    flakes = Array.from({ length: 120 }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      r: 1 + Math.random() * 2.5, s: 0.4 + Math.random() * 1.2, o: 0.4 + Math.random() * 0.6
    }));
    const frame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#fff";
      for (const f of flakes) {
        ctx.globalAlpha = f.o;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, 7);
        ctx.fill();
        f.y += f.s;
        f.x += Math.sin(f.y / 40) * 0.4;
        if (f.y > innerHeight) { f.y = -4; f.x = Math.random() * innerWidth; }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    frame();
  }
  function apply(s) {
    if (s.forceSnow) startFx();
    else stop();
  }
  window.PalychSnow = { apply };
})();
