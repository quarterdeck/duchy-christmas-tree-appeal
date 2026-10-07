import { YEAR_GROUPS, SURPRISE_GROUP, makeRandomTag, describeTag } from './tags.js';
import { treeSvg, tagSpots } from './tree.js';
import { startSnow } from './snow.js';
import { startMusic, stopMusic } from './music.js';

// TODO: confirm the date and place with the school office.
const NEXT_STEP_MESSAGE =
  'Buy a present, wrap it, write the tag code on it, and bring it to school reception by [DATE TBC].';
const TAGS_PER_GROUP = 20;
const SAVED_TAGS_KEY = 'duchy-tree-tags';
// Saved tags expire, so last year's tags are gone when the appeal starts again.
const SAVED_TAG_LIFETIME_MS = 183 * 24 * 60 * 60 * 1000;
const MUSIC_KEY = 'duchy-tree-music';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const byId = (id) => document.getElementById(id);

// Web storage can be blocked (private mode, strict settings). The site must still work.
function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Not saved. Nothing else to do.
  }
}

// Random swing so the tags do not move together.
function swingStyle(element) {
  element.style.animationDelay = `${-Math.random() * 3}s`;
  element.style.animationDuration = `${2.2 + Math.random() * 1.6}s`;
}

// --- Tree view -------------------------------------------------------------

function renderTree() {
  byId('tree-art').innerHTML = treeSvg();

  const spots = tagSpots();
  YEAR_GROUPS.forEach((group, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `hanging-tag ${group.gender}`;
    button.style.left = `${spots[index].left}%`;
    button.style.top = `${spots[index].top}%`;
    button.setAttribute('aria-label', group.name);
    button.innerHTML = `<span class="tag-body"><span>${group.shortName}</span><span>${group.gender === 'girl' ? '♀' : '♂'}</span></span>`;
    swingStyle(button);
    button.addEventListener('click', () => showGroup(group));
    byId('tree-tags').append(button);

    const listItem = document.createElement('li');
    const listButton = document.createElement('button');
    listButton.type = 'button';
    listButton.textContent = group.name;
    listButton.addEventListener('click', () => showGroup(group));
    listItem.append(listButton);
    byId('group-list').append(listItem);
  });
}

// --- Group view --------------------------------------------------------------

function showGroup(group) {
  byId('group-title').textContent = group.name;
  const garland = byId('group-tags');
  garland.replaceChildren();

  for (let number = 1; number <= TAGS_PER_GROUP; number++) {
    const tag = makeRandomTag(group);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `hanging-tag mystery ${number % 2 ? 'red' : 'gold'}`;
    button.setAttribute('aria-label', `Mystery tag ${number}`);
    button.innerHTML = '<span class="tag-body"><span>❄</span></span>';
    swingStyle(button);
    button.addEventListener('click', () => {
      pickTag(tag, button);
      button.disabled = true;
      button.classList.add('taken');
    });
    garland.append(button);
  }

  byId('tree-view').hidden = true;
  byId('group-view').hidden = false;
  window.scrollTo({ top: 0 });
}

function showTree() {
  byId('group-view').hidden = true;
  byId('tree-view').hidden = false;
}

// --- Picked tag --------------------------------------------------------------

function showTagCard(tag) {
  byId('tag-text').textContent = `${describeTag(tag)}.`;
  byId('tag-code').textContent = tag.code;
  byId('tag-next').textContent = NEXT_STEP_MESSAGE;
  byId('tag-overlay').hidden = false;
  byId('close-tag-button').focus();
}

function closeTagCard() {
  byId('tag-overlay').hidden = true;
}

// The tag flies from where it hung to the top of the screen.
function flyFrom(sourceElement) {
  const card = byId('tag-card');
  if (prefersReducedMotion) return;
  const from = sourceElement.getBoundingClientRect();
  const to = card.getBoundingClientRect();
  const scale = from.width / to.width;
  const dx = from.left + from.width / 2 - (to.left + to.width / 2);
  const dy = from.top + from.height / 2 - (to.top + to.height / 2);
  card.animate(
    [
      { transform: `translate(${dx}px, ${dy}px) scale(${scale}) rotate(-20deg)`, opacity: 0.6 },
      { transform: 'translate(0, 0) scale(1.08) rotate(6deg)', opacity: 1, offset: 0.75 },
      { transform: 'none', opacity: 1 },
    ],
    { duration: 900, easing: 'cubic-bezier(.2,.8,.3,1)' }
  );
}

function pickTag(tag, sourceElement) {
  saveTag(tag);
  showTagCard(tag);
  flyFrom(sourceElement);
}

// --- Saved tags --------------------------------------------------------------

function savedTags() {
  const tags = readStorage(SAVED_TAGS_KEY, []);
  if (!Array.isArray(tags)) return [];
  const oldestAllowed = Date.now() - SAVED_TAG_LIFETIME_MS;
  return tags.filter((tag) => tag.savedAt > oldestAllowed);
}

function saveTag(tag) {
  writeStorage(SAVED_TAGS_KEY, [...savedTags(), { ...tag, savedAt: Date.now() }]);
  updateMyTagsButton();
}

function removeTag(code) {
  writeStorage(SAVED_TAGS_KEY, savedTags().filter((tag) => tag.code !== code));
  updateMyTagsButton();
  renderMyTags();
}

function updateMyTagsButton() {
  const count = savedTags().length;
  const button = byId('my-tags-button');
  button.hidden = count === 0;
  button.textContent = `My tags (${count})`;
}

function renderMyTags() {
  const list = byId('my-tags-list');
  list.replaceChildren();
  for (const tag of savedTags()) {
    const item = document.createElement('li');
    const viewButton = document.createElement('button');
    viewButton.type = 'button';
    viewButton.className = 'link-button';
    viewButton.textContent = `${tag.code}: ${describeTag(tag)}`;
    viewButton.addEventListener('click', () => {
      byId('my-tags-dialog').close();
      showTagCard(tag);
    });
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'pixel-button small';
    removeButton.textContent = 'Remove';
    removeButton.setAttribute('aria-label', `Remove tag ${tag.code}`);
    removeButton.addEventListener('click', () => removeTag(tag.code));
    item.append(viewButton, removeButton);
    list.append(item);
  }
  if (!list.children.length) list.innerHTML = '<li>No tags yet.</li>';
}

// --- Music -------------------------------------------------------------------

let isMusicWanted = readStorage(MUSIC_KEY, true);
let isMusicPlaying = false;

function setMusic(on) {
  isMusicWanted = on;
  isMusicPlaying = on;
  writeStorage(MUSIC_KEY, on);
  if (on) startMusic();
  else stopMusic();
  updateMusicButton();
}

function updateMusicButton() {
  const button = byId('music-button');
  button.textContent = isMusicPlaying ? '♪ Music on' : '♪ Music off';
  button.setAttribute('aria-pressed', String(isMusicPlaying));
}

// Browsers only allow sound after the first tap or key press.
function startMusicOnFirstInteraction() {
  const start = () => {
    window.removeEventListener('click', start);
    window.removeEventListener('keydown', start);
    if (isMusicWanted) setMusic(true);
  };
  window.addEventListener('click', start);
  window.addEventListener('keydown', start);
}

// --- Start -------------------------------------------------------------------

renderTree();
updateMyTagsButton();
updateMusicButton();
startMusicOnFirstInteraction();

startSnow(document.querySelector('.page-snow'), { flakeCount: 60, maxSize: 3 });
const globeSnow = startSnow(document.querySelector('.globe-snow'), { flakeCount: 140, maxSize: 3 });

byId('glass').addEventListener('click', (event) => {
  if (event.target.closest('.hanging-tag')) return;
  globeSnow.burst();
  const globe = document.querySelector('.globe');
  globe.classList.remove('shaking');
  void globe.offsetWidth; // restart the CSS animation
  globe.classList.add('shaking');
});

byId('surprise-button').addEventListener('click', (event) => pickTag(makeRandomTag(SURPRISE_GROUP), event.currentTarget));
byId('back-button').addEventListener('click', showTree);
byId('music-button').addEventListener('click', () => setMusic(!isMusicPlaying));
byId('print-button').addEventListener('click', () => window.print());
byId('close-tag-button').addEventListener('click', closeTagCard);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeTagCard();
});
byId('my-tags-button').addEventListener('click', () => {
  renderMyTags();
  byId('my-tags-dialog').showModal();
});
