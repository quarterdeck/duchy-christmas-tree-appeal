# Duchy Christmas Tree Appeal

A virtual Christmas tree for Duchy College and Duchy Prep School, in aid of Barnardo's.
People scan a QR code, tap a tag on a pixel-art tree in a snow globe, and get a tag
such as "A 6 year old boy who loves trains and dinosaurs". They buy a present for that tag and bring it to school
unwrapped. Barnardo's sorts and wraps the presents, so it must see what each one is.

The tags are random examples, not real children. Two optional filters above the tree set the
gender and the year group (Pre-school = 3–4 … Year 13 = 17–18). With no filters set, a tag can be
a girl or a boy of any age from 3 to 18.

The title shows the current year. The tree is open from October to December. From January to
September the page shows "Come back in October" (`isAppealOpen` in `app.js`). This check runs in
the browser and uses the device's date, so it only hides the tree; it does not lock the site.

Plain HTML, CSS and JavaScript. No build step. It runs on GitHub Pages:
<https://quarterdeck.github.io/duchy-christmas-tree-appeal/>

The QR code maker is at
<https://quarterdeck.github.io/duchy-christmas-tree-appeal/qr/>.

## Change things

| What | Where |
| --- | --- |
| Drop-off date and place shown on the tag | `PRIMARY_NEXT_STEP_MESSAGE` (Pre-school to Year 6) and `SECONDARY_NEXT_STEP_MESSAGE` (Year 7 to 13) in `app.js` |
| Tag colours and icons on the tree | `TAG_COLOURS` and `TAG_ICONS` in `app.js` |
| Gift ideas for each year group (unisex and girls only) | `GIFTS_BY_YEAR` in `tags.js` |
| Songs | `SONGS` in `music.js` |
| Colours | `:root` in `styles.css` |

## Files

- `index.html`, `styles.css`, `app.js`: the page.
- `tags.js`: year groups and random tag text.
- `tree.js`: the pixel-art tree (SVG) and where the tags hang.
- `snow.js`: falling snow. Tap the globe to shake it.
- `santa.js`: an 8-bit Santa and reindeer that fly across the page every 20–40 seconds.
  Not shown if the device is set to reduce motion.
- `music.js`: 8-bit carols made with the Web Audio API. Music starts after the first tap,
  because browsers block sound before that. On iOS 16.4 or later it plays with the silent switch
  on. On older iOS, turn the silent switch off.
- `qr/index.html`: makes a plain square QR code as SVG or PNG.
- `images/barnardos-logo.svg`: Barnardo's logo. Check Barnardo's brand rules before you print it.

Picked tags are kept in the browser's `localStorage`, so people can see them again on the same
device ("My tags"). Saved tags expire after 6 months (`SAVED_TAG_LIFETIME_MS` in `app.js`), so the
list is empty again for next year's appeal. If storage is blocked, the site still works, but tags
are not kept.

## Hosting and QR codes

The site publishes from the `main` branch, `/ (root)`. Every push to `main` updates the live site.

1. Open the QR maker. The website address is filled in for you.
2. Download the QR code. Make the QR codes only after the address is final:
   if the address changes, the printed codes stop working.

## Before you print

- Order a proof. Scan it with an iPhone and an Android phone.
- Keep the QR code solid black and white, with the white margin around it.

## Licence

[MIT](LICENSE). The Barnardo's logo is not covered by the MIT licence. It belongs to Barnardo's.
