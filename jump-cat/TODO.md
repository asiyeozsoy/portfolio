# TODO: original Jump Cat! HTML5 files

This folder is a **hosting shell only**. It is not a recreation of the game.

The original `cati-kedi` build is not in this repository. Copy these files from that build into `jump-cat/game/`:

- `index.html`
- `game.js`
- `style.css`
- `img/*` (pixel art, logo, start-screen frames — do not redraw)

Expected original game:

- Title: **Jump Cat!**
- Canvas: `DESIGN_W` 360 × `DESIGN_H` 640
- Font: Pixelify Sans
- Play: tap/click to jump, shop, score

After the files are in `jump-cat/game/`, this page (`/jump-cat/`) will load them automatically.

Then replace `thumbs/jump-cat.jpg` with the game logo, or a still from the start screen, using the same 16:10 tile treatment as the other Games covers.
