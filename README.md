# 25th Anniversary — Single Page

Files created:

- `index.html`
- `style.css`
- `script.js`

Suggested folders (create and put your media):

- `assets/photos/` — put images like `1.jpg`, `2.jpg`, ...
- `assets/videos/` — put video files like `1.mp4`, `2.mp4`, ...
- `assets/posters/` — thumbnails/posters for videos like `1.jpg` (used for poster attr)
- `assets/music/soft-piano.mp3` — optional background music file (button toggles play)

How to update content:

- Open `script.js` and edit the `photos` and `videos` arrays at the top. Use objects like:

  - `{ src: 'assets/photos/1.jpg', caption: 'Wedding day' }`
  - `{ src: 'assets/videos/1.mp4', poster: 'assets/posters/1.jpg', caption: 'Our clip' }`

Preview locally:

1. Use Live Server or open `index.html` in a browser.
2. For video autoplay on hover to work reliably, test in a modern desktop browser. Mobile: tap cards to play.

Notes & tips:

- All animations are CSS/JS-based and optimized (use transforms & opacity).
- Lightbox supports keyboard close (Esc) and arrow navigation.
- Keep images sized reasonably (web-optimized) to keep performance smooth.
