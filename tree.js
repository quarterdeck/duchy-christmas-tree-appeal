// Pixel-art tree, drawn on a 64 × 64 grid as SVG rectangles.

const GRID_SIZE = 64;
const CENTRE_X = 32;

const COLOURS = {
  light: '#3fa34d',
  mid: '#2a7a3b',
  dark: '#1b5530',
  trunk: '#7a4a24',
  trunkDark: '#5a3418',
  snow: '#f4f8ff',
  snowShade: '#cfdcf2',
  star: '#ffd23f',
  starShine: '#fff4b0',
};

const BAUBLE_COLOURS = ['#e8333a', '#ffd23f', '#4fc3f7', '#f78fb3', '#ffffff'];

// Three stacked triangles. Half width grows from `topHalfWidth` to `bottomHalfWidth`.
const TIERS = [
  { top: 6, bottom: 22, topHalfWidth: 1, bottomHalfWidth: 9 },
  { top: 16, bottom: 36, topHalfWidth: 3, bottomHalfWidth: 16 },
  { top: 29, bottom: 51, topHalfWidth: 4, bottomHalfWidth: 25 },
];

const STAR = [
  '...#...',
  '..###..',
  '#######',
  '.#####.',
  '.##.##.',
  '#.....#',
];

function treeHalfWidthAt(y) {
  return Math.max(
    -1,
    ...TIERS.filter((tier) => y >= tier.top && y <= tier.bottom).map((tier) => {
      const progress = (y - tier.top) / (tier.bottom - tier.top);
      return Math.round(tier.topHalfWidth + progress * (tier.bottomHalfWidth - tier.topHalfWidth));
    })
  );
}

function branchColour(x, y, halfWidth) {
  const offset = x - CENTRE_X;
  if (offset > halfWidth * 0.45) return COLOURS.dark;
  if (offset < -halfWidth * 0.3 && (x + y) % 3 === 0) return COLOURS.light;
  return COLOURS.mid;
}

function pixel(x, y, colour, className = '') {
  const classAttribute = className ? ` class="${className}"` : '';
  return `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${colour}"${classAttribute}/>`;
}

export function treeSvg() {
  const pixels = [];

  // Snow mound
  for (let y = 53; y < GRID_SIZE; y++) {
    const halfWidth = Math.round(Math.sqrt(Math.max(0, 900 - (GRID_SIZE + 6 - y) ** 2 * 3)));
    for (let x = CENTRE_X - halfWidth; x <= CENTRE_X + halfWidth; x++) {
      pixels.push(pixel(x, y, (x + y * 3) % 11 === 0 ? COLOURS.snowShade : COLOURS.snow));
    }
  }

  // Trunk
  for (let y = 50; y < 56; y++) {
    for (let x = CENTRE_X - 3; x <= CENTRE_X + 2; x++) {
      pixels.push(pixel(x, y, x >= CENTRE_X + 1 ? COLOURS.trunkDark : COLOURS.trunk));
    }
  }

  // Branches, decorations and snow on the branch tips
  for (let y = 0; y < GRID_SIZE; y++) {
    const halfWidth = treeHalfWidthAt(y);
    for (let x = CENTRE_X - halfWidth; x <= CENTRE_X + halfWidth; x++) {
      const isEdge = Math.abs(x - CENTRE_X) === halfWidth;
      const isBaubleSpot = (x * 7 + y * 13) % 37 === 0 && !isEdge;
      const isLightSpot = (x * 5 + y * 11) % 23 === 0 && !isEdge;
      if (isBaubleSpot) {
        pixels.push(pixel(x, y, BAUBLE_COLOURS[(x + y) % BAUBLE_COLOURS.length]));
      } else if (isLightSpot) {
        pixels.push(pixel(x, y, BAUBLE_COLOURS[(x * 3 + y) % 4], `light light-${(x + y) % 3}`));
      } else if (isEdge && (x + y) % 2 === 0) {
        pixels.push(pixel(x, y, COLOURS.snow));
      } else {
        pixels.push(pixel(x, y, branchColour(x, y, halfWidth)));
      }
    }
  }

  // Star
  STAR.forEach((row, rowIndex) => {
    [...row].forEach((cell, columnIndex) => {
      if (cell !== '#') return;
      const isShine = rowIndex === 2 && columnIndex === 3;
      pixels.push(pixel(CENTRE_X - 3 + columnIndex, rowIndex, isShine ? COLOURS.starShine : COLOURS.star, 'star'));
    });
  });

  return `<svg class="tree" viewBox="0 0 ${GRID_SIZE} ${GRID_SIZE}" shape-rendering="crispEdges" aria-hidden="true">${pixels.join('')}</svg>`;
}

// Tag positions in rows of 1, 2, 3 … 7 (28 tags), as percentages of the globe.
export function tagSpots(rowCount = 7) {
  const firstRowY = 11;
  const rowGap = 6;
  const tagGap = 7.2;
  const spots = [];
  for (let row = 0; row < rowCount; row++) {
    const tagsInRow = row + 1;
    for (let index = 0; index < tagsInRow; index++) {
      const x = CENTRE_X + (index - (tagsInRow - 1) / 2) * tagGap;
      const y = firstRowY + row * rowGap;
      spots.push({ left: (x / GRID_SIZE) * 100, top: (y / GRID_SIZE) * 100 });
    }
  }
  return spots;
}
