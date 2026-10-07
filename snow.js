const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Falling snow on a canvas. `burst()` throws the flakes up, like a shaken snow globe.
export function startSnow(canvas, { flakeCount, maxSize }) {
  const context = canvas.getContext('2d');
  const speed = prefersReducedMotion ? 0.3 : 1;
  let width = 0;
  let height = 0;

  function resize() {
    const pixelRatio = window.devicePixelRatio || 1;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function newFlake(startAnywhere) {
    return {
      x: Math.random() * width,
      y: startAnywhere ? Math.random() * height : -5,
      size: 1 + Math.floor(Math.random() * maxSize),
      fallSpeed: 0.3 + Math.random() * 0.7,
      upSpeed: 0,
      swayOffset: Math.random() * Math.PI * 2,
    };
  }

  resize();
  window.addEventListener('resize', resize);
  const flakes = Array.from({ length: flakeCount }, () => newFlake(true));

  function draw(time) {
    context.clearRect(0, 0, width, height);
    context.fillStyle = '#ffffff';
    for (const flake of flakes) {
      flake.upSpeed *= 0.96;
      flake.y += (flake.fallSpeed - flake.upSpeed) * speed;
      flake.x += Math.sin(time / 1000 + flake.swayOffset) * 0.3 * speed;
      if (flake.y > height + 5) Object.assign(flake, newFlake(false));
      // Square flakes keep the pixel-art look.
      context.fillRect(Math.round(flake.x), Math.round(flake.y), flake.size, flake.size);
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  return {
    burst() {
      for (const flake of flakes) {
        flake.upSpeed = 3 + Math.random() * 6;
        flake.y = height * (0.5 + Math.random() * 0.5);
      }
    },
  };
}
