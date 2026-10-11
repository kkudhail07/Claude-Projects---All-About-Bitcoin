# All About Bitcoin

A calm, curated education site for understanding Bitcoin — built as a fast,
no-build static website. Dark "digital gold" theme, live network data, and
hand-picked videos, books and essays.

## Pages

| File | Page | Highlights |
|------|------|-----------|
| `index.html` | Home | Learning-first: hero, what-is-Bitcoin intro, featured video, explore + reading shelf |
| `learn.html` | Learn | 5-step beginner's guide + mini-glossary + getting-started |
| `why.html` | Why | Why Bitcoin matters (real-world uses) + "Bitcoin isn't 'crypto'" |
| `faq.html` | FAQ | Plain-English answers to newcomers' doubts (accordion) |
| `safety.html` | Safety | Staying-safe guide — golden rule, simple rules, looking after your own coins & common scams |
| `videos.html` | Videos | 6 embedded videos (play in-page) with short summaries |
| `books.html` | Books | 6 books with summaries and buy links |
| `articles.html` | Articles | 2 essential essays |
| `network.html` | Network | **Live dashboard** (price GBP/USD, coins mined, blocks, halving, market cap) + reachable-nodes estimate + "what these numbers mean" |

## Live data

Powers the **Network page** dashboard plus the slim ticker at the top of every page except the home page.
Fetched client-side, no API key, auto-refreshing:

- **Price (GBP + USD), 24h change, market cap** — [CoinGecko](https://www.coingecko.com/) (`/simple/price`), polled every 30s.
- **Coins mined, % of 21M, block height, halving countdown** — [mempool.space](https://mempool.space/) (`/api/blocks/tip/height`), polled every 60s. The exact mined supply is computed from block height, summing the subsidy across each halving epoch.
- **Reachable nodes** — a static estimate (~16,000) with a "see the live count" link to [bitnodes.io](https://bitnodes.io/). bitnodes has no reliable browser-CORS endpoint, so a *true* live count would need a small serverless proxy (Netlify/Cloudflare function).

If a request fails the page keeps the last value and the "Live" dot turns grey
until it reconnects.

## Build the CSS

Tailwind is **compiled** (not the runtime CDN), so there's a one-time build step.
The output is committed to `css/tailwind.css`, so you only need this if you change
markup/classes:

```bash
npm install        # once
npm run build:css  # regenerate css/tailwind.css (minified)
# or: npm run watch:css   (rebuilds on save while developing)
```

`tailwind.config.js` scans every `*.html` **and** `js/main.js` (which injects the
shared nav/footer), so utility classes used there are never purged.

## Run it

It's plain HTML/CSS/JS — serve it over `http://` (not `file://`) so the live data loads:

```bash
# from this folder — no-cache dev server (always serves the latest files)
python serve.py
# then visit http://localhost:8080

# or the stock server (may cache CSS/JS between edits):
# python -m http.server 8080
```

`serve.py` just disables caching so the browser never shows a stale `main.js`/`styles.css`
while you iterate — it's dev-only; production hosts handle caching themselves.

## Deploy (free)

`css/tailwind.css` is pre-built and committed, so deploys need **no build command** —
just publish the folder (run `npm run build:css` first if you've edited markup).

- **Netlify** — drag this folder onto https://app.netlify.com/drop
- **GitHub Pages** — push to a repo, enable Pages on the root
- **Vercel / Cloudflare Pages** — point at the folder, output dir = root

## Tech

- **Tailwind CSS, compiled** to `css/tailwind.css` (~9 KB minified) via the Tailwind
  CLI — no runtime CDN — plus a custom `css/styles.css` design layer
- Fonts: Space Grotesk (display), **Satoshi** (body, via Fontshare), Fira Code (data)
- Shared nav/footer: defined once in `js/main.js`, injected into every page
- Vanilla JS — `js/livedata.js` (live feed), `js/main.js` (chrome, theme, motion)

## Notes

- Videos embed via `youtube-nocookie.com` (privacy-friendly) and play in-page.
- Book/article links point to Amazon / the original sites; this project isn't
  affiliated with the authors or publishers.
- Educational resource only — **not financial advice.**
