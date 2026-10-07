# Duchy Christmas Tree Appeal

A virtual Christmas tree for Duchy College and Duchy Prep School, in aid of Barnardo's.
People scan a QR code, pick a year-group tag on a pixel-art tree in a snow globe, and get a tag
such as "A 6 year old boy who loves trains and dinosaurs". They buy and wrap a present for that tag.

The tags are random examples, not real children. A year-group tag sets the age range
(Reception = 4–5 … Year 13 = 17–18) and the gender. "Surprise me" can be any age from 4 to 18.

Plain HTML, CSS and JavaScript. No build step. It runs on GitHub Pages:
<https://quarterdeck.github.io/duchy-christmas-tree-appeal/>

The QR sticker and poster maker is at
<https://quarterdeck.github.io/duchy-christmas-tree-appeal/qr/>.

## Change things

| What | Where |
| --- | --- |
| Drop-off date and place shown on the tag | `NEXT_STEP_MESSAGE` in `app.js` |
| Number of tags per year group | `TAGS_PER_GROUP` in `app.js` |
| Interests for each age band | `INTERESTS_BY_AGE` in `tags.js` |
| Songs | `SONGS` in `music.js` |
| Colours | `:root` in `styles.css` |

## Files

- `index.html`, `styles.css`, `app.js`: the page.
- `tags.js`: year groups and random tag text.
- `tree.js`: the pixel-art tree (SVG) and where the tags hang.
- `snow.js`: falling snow. Tap the globe to shake it.
- `music.js`: 8-bit carols made with the Web Audio API. Music starts after the first tap,
  because browsers block sound before that. On iOS 16.4 or later it plays with the silent switch
  on. On older iOS, turn the silent switch off.
- `qr/index.html`: makes the QR sticker and A4 poster as SVG or PNG.
- `images/barnardos-logo.svg`: Barnardo's logo. Check Barnardo's brand rules before you print it.

Picked tags are kept in the browser's `localStorage`, so people can see them again on the same
device ("My tags"). Saved tags expire after 6 months (`SAVED_TAG_LIFETIME_MS` in `app.js`), so the
list is empty again for next year's appeal. If storage is blocked, the site still works, but tags
are not kept.

## Hosting and QR codes

The site publishes from the `main` branch, `/ (root)`. Every push to `main` updates the live site.

1. Open the QR maker. The website address is filled in for you.
2. Download the sticker and poster files. Make the QR codes only after the address is final:
   if the address changes, the printed codes stop working.

## Before you print

- Order a proof of the glitter sticker. Scan it with an iPhone and an Android phone.
- Keep the QR area solid black and white. Glitter only on the red ring.
- Fonts in the SVG files are Arial Black. If the printer does not have it, use the PNG file.

## Licence

[MIT](LICENSE). The Barnardo's logo is not covered by the MIT licence. It belongs to Barnardo's.
