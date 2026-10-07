// Tags are random examples, not real children.

const YEAR_NAMES = ['Reception', ...Array.from({ length: 13 }, (_, i) => `Year ${i + 1}`)];

// Reception children are 4–5, Year 1 children are 5–6 … Year 13 students are 17–18.
export const YEARS = YEAR_NAMES.map((name, index) => ({
  name,
  minAge: index + 4,
  maxAge: index + 5,
}));

const INTERESTS_BY_AGE = [
  {
    maxAge: 7,
    interests: [
      'trains', 'dinosaurs', 'unicorns', 'building blocks', 'colouring', 'teddy bears',
      'tractors', 'fairies', 'puzzles', 'bubbles', 'animals', 'diggers', 'dressing up',
      'stickers', 'farm animals', 'cars', 'princesses', 'superheroes', 'painting',
      'picture books', 'play dough', 'the seaside', 'space rockets', 'dolls', 'music',
      'dancing', 'ball games', 'pirates', 'bugs and beetles', 'baking',
    ],
  },
  {
    maxAge: 11,
    interests: [
      'Lego', 'football', 'drawing', 'reading', 'slime', 'magic tricks', 'science kits',
      'board games', 'card games', 'rugby', 'gymnastics', 'horses', 'space', 'crafts',
      'remote control cars', 'dinosaurs', 'nature', 'swimming', 'baking', 'jewellery making',
      'comics', 'skateboarding', 'music', 'dancing', 'puzzles', 'animals', 'gaming',
      'camping', 'cooking', 'fashion design',
    ],
  },
  {
    maxAge: 15,
    interests: [
      'gaming', 'football', 'art', 'reading', 'music', 'skincare', 'make-up', 'fashion',
      'rugby', 'photography', 'cooking', 'baking', 'films', 'anime', 'skateboarding',
      'fitness', 'coding', 'drawing', 'surfing', 'nail art', 'basketball', 'hair styling',
      'board games', 'writing stories', 'science', 'cycling', 'horse riding', 'guitar',
      'animals', 'Lego',
    ],
  },
  {
    maxAge: 18,
    interests: [
      'gaming', 'football', 'music', 'fashion', 'skincare', 'make-up', 'photography',
      'cooking', 'films', 'fitness', 'tech gadgets', 'art', 'reading', 'rugby', 'surfing',
      'travel', 'gardening', 'cars', 'fragrance', 'anime', 'podcasts', 'baking', 'cycling',
      'camping', 'coffee', 'drawing', 'basketball', 'nail art', 'football shirts',
      'journalling',
    ],
  },
];

function randomInteger(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function twoDifferentInterests(age) {
  const { interests } = INTERESTS_BY_AGE.find((band) => age <= band.maxAge);
  const first = randomItem(interests);
  const second = randomItem(interests.filter((interest) => interest !== first));
  return [first, second];
}

// `year` is an item of YEARS, or null for any age from 4 to 18.
// `gender` is 'girl', 'boy', or null for either.
export function makeRandomTag({ year, gender }) {
  const age = year ? randomInteger(year.minAge, year.maxAge) : randomInteger(4, 18);
  const tagGender = gender ?? randomItem(['girl', 'boy']);
  return {
    age,
    gender: tagGender,
    interests: twoDifferentInterests(age),
  };
}

// "an 8 year old", "an 11 year old", "an 18 year old", but "a 6 year old".
export function describeTag(tag) {
  const article = [8, 11, 18].includes(tag.age) ? 'An' : 'A';
  const [first, second] = tag.interests;
  return `${article} ${tag.age} year old ${tag.gender} who loves ${first} and ${second}`;
}
