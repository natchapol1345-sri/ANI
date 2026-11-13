# Happy Anniversary Website 💕

A beautiful, animated single-page website to celebrate your anniversary. Features a romantic design with floating hearts, a photo gallery, a typewriter love letter, a relationship counter, and background music.

---

## Features

- 🎉 **Animated Title** – Eye-catching "Happy Anniversary" headline with CSS keyframe animations
- 💖 **Heart Animations** – Continuously floating hearts across the screen for a romantic atmosphere
- 🖼️ **Photo Gallery** – Showcase your favorite memories in a responsive masonry-style gallery
- ✍️ **Typewriter Love Letter** – Your heartfelt message revealed character-by-character
- 🎵 **Background Music** – Autoplay ambient/romantic music (with play/pause toggle)
- ⏱️ **Relationship Counter** – Live counter showing years, months, days, hours, minutes, and seconds together
- 💌 **Wishes / Guestbook** – Visitors can leave anniversary wishes, stored on the server

---

## Project Structure

```
ANI/
├── package.json              # Node.js project manifest
├── README.md                 # This file
├── server/
│   ├── server.js             # Express server entry point
│   ├── config.json           # Site content configuration
│   └── wishes.json           # Auto-created; stores guestbook entries
└── public/                   # Static frontend assets
    ├── index.html            # Main SPA page
    ├── css/
    │   └── style.css         # Styles & animations
    ├── js/
    │   └── main.js           # Frontend JavaScript
    ├── images/               # Drop your photos here
    │   ├── photo1.jpg
    │   └── ...
    └── audio/
        └── song.mp3          # Background music
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open in your browser
#    http://localhost:3000
```

For development with auto-reload:

```bash
npm run dev
```

---

## Customizing Content

All site content is controlled by **`server/config.json`**:

```json
{
  "title": "HAPPY ANNIVERSARY",
  "names": ["Your Name", "Partner's Name"],
  "startDate": "2020-02-14",
  "message": "Your heartfelt love letter here...",
  "photos": [
    "/images/photo1.jpg",
    "/images/photo2.jpg"
  ],
  "music": "/audio/song.mp3"
}
```

| Field       | Description                                                       |
|-------------|-------------------------------------------------------------------|
| `title`     | The main heading displayed on the page                            |
| `names`     | Array of two names shown in the counter section                   |
| `startDate` | Your anniversary / relationship start date (`YYYY-MM-DD`)         |
| `message`   | The love letter text (supports `\n` for line breaks)              |
| `photos`    | Array of image paths relative to the `public/` folder            |
| `music`     | Path to the background audio file relative to the `public/` folder|

---

## Adding Photos

1. Copy your photo files (`.jpg`, `.png`, `.webp`) into `public/images/`.
2. Add the corresponding paths to the `photos` array in `server/config.json`:

```json
"photos": [
  "/images/photo1.jpg",
  "/images/photo2.jpg",
  "/images/our-vacation.jpg"
]
```

3. Restart the server (`npm start`) — no rebuild needed.

> **Tip:** Resize photos to ≤ 1200 px wide before uploading to keep page loads fast.

---

## Deployment

### Vercel

```bash
npm install -g vercel
vercel deploy
```

Add a `vercel.json` at the project root to route all requests through the Express server:

```json
{
  "version": 2,
  "builds": [{ "src": "server/server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server/server.js" }]
}
```

### Render

1. Push the repository to GitHub.
2. Create a new **Web Service** on [Render](https://render.com).
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `node server/server.js`
5. Deploy — Render automatically sets `PORT` via environment variable.

### Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

Railway auto-detects Node.js and injects the `PORT` environment variable.

---

## API Reference

All endpoints are served from the same Express process.

### `GET /api/config`

Returns the full site configuration from `server/config.json`.

**Response `200 OK`:**
```json
{
  "title": "HAPPY ANNIVERSARY",
  "names": ["[NAME 1]", "[NAME 2]"],
  "startDate": "2020-02-14",
  "message": "...",
  "photos": ["/images/photo1.jpg"],
  "music": "/audio/song.mp3"
}
```

---

### `POST /api/wish`

Submit an anniversary wish to the guestbook.

**Rate limit:** 5 requests per 15 minutes per IP.

**Request body:**
```json
{
  "name": "Alice",
  "message": "Wishing you both endless happiness!"
}
```

| Field     | Type   | Constraints          |
|-----------|--------|----------------------|
| `name`    | string | 1 – 100 characters   |
| `message` | string | 1 – 1 000 characters |

**Response `200 OK`:**
```json
{ "success": true }
```

**Response `422 Unprocessable Entity`** (validation failure):
```json
{ "errors": [{ "msg": "Name must be between 1 and 100 characters.", ... }] }
```

---

### `GET /api/wishes`

Returns all submitted wishes.

**Response `200 OK`:**
```json
[
  {
    "name": "Alice",
    "message": "Wishing you both endless happiness!",
    "createdAt": "2024-02-14T10:30:00.000Z"
  }
]
```

Returns `[]` if no wishes have been submitted yet.

---

## License

MIT — do whatever you like with it. 💕
