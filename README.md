# Wasteland Words

A Fallout-themed word game for the browser. Guess the 5-letter wasteland word in six tries. Fan-made and unofficial — not affiliated with Bethesda, Microsoft, Amazon, or The New York Times.

Open `index.html` in any modern browser. No build step, no server, no account.

## Play

- **Easy** — household names from the games and the TV show
- **Normal** — towns, companions, mid-tier lore
- **Extreme** — deep cuts
- Each mode has its own **daily** puzzle (same word for everyone that day)
- **Practice** another word after you finish, or whenever you like
- Hard mode makes you reuse revealed hints
- Stats, streaks, and a shareable orange/yellow/black grid are stored on the device

Orange (`#ff9000`) means right letter, right place. Amber means right letter, wrong place.

## Ship it

This is the same single-file pattern as the other Fallout Hub mini-games (`Poker.html`, `MemoryGame.html`).

1. Push this repo and turn on GitHub Pages, **or**
2. Copy `index.html` into [Angelyze/Game](https://github.com/Angelyze/Game) as `WastelandWords.html`

It will then live at:

`https://angelyze.github.io/Game/WastelandWords.html`

### Blogger (fallouthub.blog)

The other Hub games (Caps Poker, Great War, Crazy Eights) are **500×700** and open in a sized popup, not a full tab. Use this as the game link on the Mini-Games page (HTML view):

```html
<a href="https://angelyze.github.io/Game/Wasteland%20Words.html"
   onclick="window.open(this.href,'WastelandWords','width=500,height=700,scrollbars=no,resizable=yes,menubar=no,toolbar=no,location=no,status=no');return false;">WASTELAND WORDS (Fallout Wordle)</a>
```

`return false` keeps Blogger from navigating the current page. The game file also relaunches itself as that same 500×700 window if someone hits the plain URL on desktop. Phones and the FH Companion WebView stay full-screen.

### FH Companion

Point the in-app WebView at the same GitHub Pages URL. Deep-link a mode with `?mode=easy`, `?mode=normal`, or `?mode=extreme`.

The page is self-contained: no CDN, no webfonts, no network calls after load. It honors safe-area insets and will not pinch-zoom.

## Local test

Double-click `index.html`, or serve the folder:

```
python -m http.server 8080
```

Then open `http://localhost:8080/`.
