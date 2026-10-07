// Pixel-art Santa, sleigh and reindeer. Flies across the page now and then.

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SPRITE = [
  '......W..................................',
  '.....RR..................................',
  '....RRRR..............D.D............D.D.',
  '....WWWW...............D..............D..',
  '....SSKS..............BBB............BBB.',
  '....WWWW..............BBBD...........BBBN',
  '...RRWWRRSGGG........BB.............BB...',
  'Y..RRRRRRR..YGWBBBBBBBB...GGGWBBBBBBBB...',
  'YrrrrrrrrrrrY..BBBBBBB........BBBBBBB....',
  '.rrrrrrrrrrr...D.D..D.D.......D.D..D.D...',
  '..Y.......Y...D...DD...D.....D...DD...D..',
  'YYYYYYYYYYYY.............................',
];

const COLOURS = {
  R: '#d62839', // suit
  r: '#a3162a', // sleigh
  W: '#ffffff',
  S: '#f5c9a0', // skin
  K: '#222222',
  Y: '#f2b134', // sleigh trim and runners
  G: '#f2b134', // reins
  B: '#8a5a2b', // reindeer
  D: '#5a3418', // antlers and legs
  N: '#ff3b3b', // red nose
};

const FIRST_FLIGHT_MS = 8000;
const MIN_GAP_MS = 20000;
const MAX_GAP_MS = 40000;

function santaSvg() {
  const pixels = [];
  SPRITE.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      if (cell === '.') return;
      pixels.push(`<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${COLOURS[cell]}"/>`);
    });
  });
  return `<svg viewBox="0 0 ${SPRITE[0].length} ${SPRITE.length}" shape-rendering="crispEdges">${pixels.join('')}</svg>`;
}

export function startSanta(element) {
  if (prefersReducedMotion) return;
  element.innerHTML = santaSvg();

  function fly() {
    element.style.top = `${5 + Math.random() * 30}%`;
    element.classList.add('flying');
  }

  // The bob animation on the SVG never ends, so only the flight ends here.
  element.addEventListener('animationend', (event) => {
    if (event.target !== element) return;
    element.classList.remove('flying');
    setTimeout(fly, MIN_GAP_MS + Math.random() * (MAX_GAP_MS - MIN_GAP_MS));
  });

  setTimeout(fly, FIRST_FLIGHT_MS);
}
