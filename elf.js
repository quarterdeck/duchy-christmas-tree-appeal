// Pixel-art angry elf. Pops out from behind the tree when someone taps the glass.

const SPRITE = [
  '............Y.',
  '...........GG.',
  '..........GG..',
  '.........GGG..',
  '.......GGGGG..',
  '.....GGGGGGGG.',
  '....WWWWWWWW..',
  'SS..KSSSSSSK..',
  'SS.SSKKSSKKSS.',
  '.G..SSKSSKSS..',
  '.G..CSSSSSSC..',
  '..G.SSKKKKSS..',
  '..G.SKSSSSKS..',
  '...GGSSSSSSGG.',
  '...GGGGGGGGGG.',
  '...GGYYYYYYGG.',
];

const COLOURS = {
  G: '#2a9d3f', // hat, tunic and arm
  W: '#ffffff', // hat fur
  Y: '#f2b134', // bell and belt
  S: '#f5c9a0', // skin
  K: '#222222', // angry brows, eyes and frown
  C: '#e8333a', // red cheeks
};

function elfSvg() {
  const pixels = [];
  SPRITE.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      if (cell === '.') return;
      pixels.push(`<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${COLOURS[cell]}"/>`);
    });
  });
  return `<svg viewBox="0 0 ${SPRITE[0].length} ${SPRITE.length}" shape-rendering="crispEdges">${pixels.join('')}</svg>`;
}

export function startElf(element) {
  element.innerHTML = elfSvg();

  return {
    popOut() {
      element.classList.remove('popping');
      void element.offsetWidth; // restart the CSS animation
      element.classList.add('popping');
    },
  };
}
