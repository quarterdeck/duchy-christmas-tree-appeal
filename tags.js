// Tags are random examples, not real children.
// Gift lists come from the school. Girls-only gifts never go on a boy's tag.

const RECEPTION_TO_YEAR_2_GIFTS = {
  unisexGifts: [
    'dinosaurs', 'cars', 'monsters', 'Lego', 'princesses', 'colouring books', 'craft',
    'Frozen', 'teddies', 'animals', 'books', 'football', 'jigsaws', 'fairies', 'kittens',
  ],
  girlsOnlyGifts: [],
};

const YEAR_3_GIFTS = {
  unisexGifts: [
    'dinosaurs', 'cars', 'monsters', 'Lego', 'colouring books', 'craft', 'teddies',
    'animals', 'books', 'football', 'jigsaws',
  ],
  girlsOnlyGifts: ['fairies', 'kittens', 'princesses', 'Frozen'],
};

const YEAR_4_TO_6_UNISEX_GIFTS = [
  'dinosaurs', 'cars', 'Lego', 'colouring books', 'craft', 'animals', 'books', 'football',
  'jigsaws', 'games', 'puzzles',
];

const YEAR_4_GIFTS = {
  unisexGifts: YEAR_4_TO_6_UNISEX_GIFTS,
  girlsOnlyGifts: ['teddies'],
};

const YEAR_5_TO_6_GIFTS = {
  unisexGifts: YEAR_4_TO_6_UNISEX_GIFTS,
  girlsOnlyGifts: ['make up', 'toiletries (Primark, Lush)'],
};

const COOL_TOILETRIES =
  'cool toiletries (Indu, Lav Teens, Blossom & Beau, Bare la Terre, Sundae whipped shower foam, Monday hair care, Bubble)';
const SECONDARY_GIRLS_ONLY_GIFTS = ['make up', 'crafts', 'manicure set', 'nail polish'];

const YEAR_7_TO_9_GIFTS = {
  unisexGifts: ['animals', 'books', 'football', 'games', 'puzzles', COOL_TOILETRIES],
  girlsOnlyGifts: SECONDARY_GIRLS_ONLY_GIFTS,
};

const YEAR_10_TO_13_GIFTS = {
  unisexGifts: ['books', 'football', 'games', 'puzzles', COOL_TOILETRIES],
  girlsOnlyGifts: SECONDARY_GIRLS_ONLY_GIFTS,
};

const GIFTS_BY_YEAR = [
  RECEPTION_TO_YEAR_2_GIFTS, // Reception
  RECEPTION_TO_YEAR_2_GIFTS, // Year 1
  RECEPTION_TO_YEAR_2_GIFTS, // Year 2
  YEAR_3_GIFTS,
  YEAR_4_GIFTS,
  YEAR_5_TO_6_GIFTS, // Year 5
  YEAR_5_TO_6_GIFTS, // Year 6
  YEAR_7_TO_9_GIFTS, // Year 7
  YEAR_7_TO_9_GIFTS, // Year 8
  YEAR_7_TO_9_GIFTS, // Year 9
  YEAR_10_TO_13_GIFTS, // Year 10
  YEAR_10_TO_13_GIFTS, // Year 11
  YEAR_10_TO_13_GIFTS, // Year 12
  YEAR_10_TO_13_GIFTS, // Year 13
];

const YEAR_NAMES = ['Reception', ...Array.from({ length: 13 }, (_, i) => `Year ${i + 1}`)];

// Reception children are 4–5, Year 1 children are 5–6 … Year 13 students are 17–18.
export const YEARS = YEAR_NAMES.map((name, index) => ({
  name,
  minAge: index + 4,
  maxAge: index + 5,
  ...GIFTS_BY_YEAR[index],
}));

const TREATS = ['chocolates', 'sweets'];

function randomInteger(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// `year` is an item of YEARS, or null for any year.
// `gender` is 'girl', 'boy', or null for either.
export function makeRandomTag({ year, gender }) {
  const tagYear = year ?? randomItem(YEARS);
  const tagGender = gender ?? randomItem(['girl', 'boy']);
  const gifts =
    tagGender === 'girl' ? [...tagYear.unisexGifts, ...tagYear.girlsOnlyGifts] : tagYear.unisexGifts;
  return {
    age: randomInteger(tagYear.minAge, tagYear.maxAge),
    gender: tagGender,
    gift: randomItem(gifts),
    treat: randomItem(TREATS),
  };
}

// "an 8 year old", "an 11 year old", "an 18 year old", but "a 6 year old".
export function describeTag(tag) {
  const article = [8, 11, 18].includes(tag.age) ? 'An' : 'A';
  return `${article} ${tag.age} year old ${tag.gender} who loves ${tag.gift} and ${tag.treat}`;
}
