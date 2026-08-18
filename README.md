# Fallout Hub word & field games

Three single-file HTML5 games for the browser, [FH Companion](https://fallouthub.blog) (Android WebView), and a Blogger embed on fallouthub.blog.

They are fan-made and unofficial. Not affiliated with Bethesda, Microsoft, Amazon, ZeniMax Media, or The New York Times.

| File | Game | What it is |
| --- | --- | --- |
| `Wasteland Words.html` | Wasteland Words | 5-letter daily word game (Wordle rules, wasteland answers) |
| `Terminal Wordlock.html` | Terminal Wordlock | RobCo-style terminal hack (likeness, not Wordle) |
| `Nuka Field.html` | Nuka Field | Minesweeper — clear unexploded Nuka |

No build step, no server, no account, no CDN, no webfonts, no network after the page loads. Open a file in any modern browser.

Orange `#ff9000` is the Hub accent on a dark shell. On a phone the game fills the viewport (max width 430px, 9:16-friendly, safe-area insets, no pinch-zoom). On a wide desktop window it sits in a 9:16 card.

---

## Shared behavior

- **Modes** — Easy / Normal / Extreme (Wordlock labels them Novice / Advanced / Master). The rules stay the same; the word pool or the field size changes.
- **Deep link** — `?mode=easy`, `?mode=normal`, or `?mode=extreme` starts that mode.
- **Sound** — Web Audio beeps, toggle in-game. Preference is stored on the device.
- **Stats** — Per mode, in `localStorage`. Private / blocked storage is ignored; the game still plays.
- **Back** — Returns to the title. Daily progress is kept; you can reopen today’s puzzle.
- **Reduced motion** — Honors `prefers-reduced-motion`.

### Play locally

Double-click any of the three HTML files, or serve the folder:

```
python -m http.server 8080
```

Then open `http://localhost:8080/Wasteland%20Words.html` (and the other two files the same way).

### Ship it

Same pattern as the other Hub mini-games (`Poker.html`, `MemoryGame.html`).

1. Push this repo and turn on GitHub Pages, **or**
2. Copy each file into [Angelyze/Game](https://github.com/Angelyze/Game). Prefer names **without spaces** on GitHub (`WastelandWords.html`, `TerminalWordlock.html`, `NukaField.html`) so the live URLs stay clean.

Example live paths:

```
https://angelyze.github.io/Game/WastelandWords.html
https://angelyze.github.io/Game/TerminalWordlock.html
https://angelyze.github.io/Game/NukaField.html
```

### Blogger (fallouthub.blog)

A **plain link only**, same as Caps Poker. No `onclick`, no `?popup=`, no auto `window.open`.

```html
<a href="https://angelyze.github.io/Game/WastelandWords.html">WASTELAND WORDS</a>
<a href="https://angelyze.github.io/Game/TerminalWordlock.html">TERMINAL WORDLOCK</a>
<a href="https://angelyze.github.io/Game/NukaField.html">NUKA FIELD</a>
```

### FH Companion

Point the in-app WebView at the same GitHub Pages URL. Optional: append `?mode=easy` (or `normal` / `extreme`) to land on that difficulty.

---

## 1. Wasteland Words

Guess the **5-letter** wasteland word in **6 tries**. Classic Wordle scoring, Fallout answers.

**File:** `Wasteland Words.html`

### How to play

Type a 5-letter word (on-screen keyboard or a hardware keyboard) and press Enter.

- **Orange** — right letter, right place.
- **Amber** — right letter, wrong place.
- **Gray** — not in the word.

Duplicate letters are scored in two passes, like the original: greens first, then yellows against leftover counts.

Each guess must be a real word: any answer from any mode, plus a large English 5-letter list. Invalid words shake and toast “Not in word list.” Too-short guesses toast “Not enough letters.”

After a win or loss the result card shows the word, a short flavor hint, and where it comes from (game / show). **Share** copies a text grid (🟧 yellow-place 🟨 gray ⬛). **Practice another** deals a random word from the same mode that is not today’s daily. **Change mode** goes back to the title.

### Modes

The rules never change. Only the **answer list** does.

| Mode | Answers | What shows up |
| --- | ---: | --- |
| Easy | 267 | Household names from the games and the TV show (VAULT, GHOUL, VEGAS, MAXIM, PIPER…) |
| Normal | 183 | Towns, companions, mid-tier lore (TYCHO, SULIK, NOVAC, PRIMM…) |
| Extreme | 174 | Deep cuts (TALUS, MYNOC, NAGOR…) |

About **624** possible answers in total.

### Daily vs practice

Each mode has its **own daily** word. Everyone who plays that mode on that calendar day (local date) gets the same answer, from `hash(YYYY-MM-DD:mode)` into that mode’s list.

Today’s daily is saved as you type. Leave and come back — the same grid is still there. The title badges show `Play`, a live `n/6`, a finished `n/6`, or `X/6`.

Practice games are random, skip today’s daily word, and **do not** write stats or overwrite the daily save.

There is no “new daily” button on the title. Today’s puzzle stays today’s puzzle. Practice is how you play more.

### Hard mode

Title-screen toggle. Once a hint is revealed, later guesses must:

- keep every **green** letter in that exact slot, and
- still contain every **amber** letter.

Break that and the row is rejected with a toast.

### Controls

- On-screen keys, plus `A–Z`, Enter, Backspace.
- `?` opens How to play. The bar chart icon opens stats.
- Sound toggle on the title and in the header.
- Escape closes an overlay. Tap a finished board to reopen the result.

### Stats (per mode)

Played, win %, current streak, max streak, and a 1–6 guess distribution. Streaks only count **daily** games, and only the first finish of that mode that day. Stored as `ww-stats`, `ww-settings`, `ww-daily`.

---

## 2. Terminal Wordlock

A RobCo-style **memory dump**. One highlighted word is the password. This is **not** Wordle.

**File:** `Terminal Wordlock.html`

### How to play

The screen is a hex dump of junk glyphs with real words embedded in it. Tap a word to probe it.

The terminal reports **likeness**: how many letters sit in the **exact same place** as the password. Wrong-place letters do **not** count.

Example: password `HOUSE`, guess `HORSE` → likeness **4/5** (`H`, `O`, `_`, `S`, `E`).

Use up your attempts and the lockout engages.

**Bracket exploits** — pairs like `<...>` or `[...]` in the dump. Tap one to either:

- **remove a dud** (a wrong word disappears), or
- **replenish attempts** (about 35% of the time, or whenever no duds are left).

The log at the bottom echoes probes, likeness, duds, and lockout. **Share** copies a short ACCESS GRANTED / LOCKOUT line. **New dump** is practice. **Change mode** returns to the title.

### Modes

| Title label | Key | Word length | Words on screen | Tries |
| --- | --- | --- | ---: | ---: |
| Novice | `easy` | 5 letters | 8 | 5 |
| Advanced | `normal` | 6 or 7 letters | 10 | 4 |
| Master | `extreme` | 8, 9, or 10 letters | 12 | 4 |

Answers are Fallout terms that would not fit a 5-letter grid (PIPBOY, DOGMEAT, DEATHCLAW, POWERARMOR, FUSIONCORE…). Length for the daily is chosen from that mode’s list by the daily seed.

### Daily vs practice

Same idea as Words. Daily seed is `hash(YYYY-MM-DD:mode:tw)`, so the password, the candidate set, and the dump layout are stable for that mode that day. Reopening the daily restores tries already used.

Practice (`New dump`) rolls a fresh random seed. Practice does not write stats or the daily save.

### Controls

- Tap a word to probe. Tap a bracket pair for an exploit.
- Header: back, how to hack, sound.
- Title: How to hack, Stats.

### Stats (per mode)

Played, win %, streak, max streak. Daily only; one record per mode per day. Stored as `tw-stats`, `tw-settings`, `tw-daily`.

---

## 3. Nuka Field

Minesweeper with Nuka paint. Clear every safe tile. The nukes stay buried.

**File:** `Nuka Field.html`

There is **no daily puzzle**. Every run is a new field. Play as many as you want.

### How to play

- **Tap / click** a closed tile to open it.
- A **number** is how many nukes sit in the eight tiles around it. A blank tile auto-opens the region around it.
- **Flag** a suspected nuke: long-press (~380 ms), right-click, or turn on **FLAG** and tap.
- **Chord:** if a number’s neighbors already have the right number of flags, tap that number to open the rest. A wrong flag on a chord detonates.
- Open every safe tile to clear the field. Open a nuke and the field detonates.

The **first tap is always safe** (that tile and its neighbors are kept clear of nukes) and usually opens a wide patch. Boards are generated to be **solvable with logic** — the builder retries until a single-point / subset solver can finish, so you should not be forced into a 50/50.

The HUD is classic: leftover-nuke counter, face (☺ / ☻ / ☠), and a timer that starts on the first open (caps at 999). ☺ or **NEW FIELD** rebuilds the same mode. Back returns to the title.

Win = **FIELD CLEARED** and the time. Loss = **DETONATION**; remaining nukes and wrong flags are shown.

### Modes

| Mode | Grid | Nukes | Density |
| --- | --- | ---: | ---: |
| Easy | 8×10 (80 tiles) | 10 | 12.5% |
| Normal | 9×13 (117 tiles) | 22 | ~19% |
| Extreme | 9×16 (144 tiles) | 36 | 25% |

Tiles are locked to a square pixel size so the grid does not stretch when numbers appear. The field is fitted to the play area.

### Controls

- Tap to open. Long-press or right-click to flag.
- **FLAG** on the dock toggles flag-tap mode (highlights when on). Starting a new field turns it off.
- **NEW FIELD** / face: another board, same mode.
- Header: back, how to sweep, sound.
- Title shows each mode’s **best time**.

### Stats (per mode)

Fields played, clear %, and best time. Every finished field counts (there is no daily gate). Stored as `nf-stats`, `nf-settings`.

---

## Device storage

| Game | Keys |
| --- | --- |
| Wasteland Words | `ww-stats`, `ww-settings`, `ww-daily` |
| Terminal Wordlock | `tw-stats`, `tw-settings`, `tw-daily` |
| Nuka Field | `nf-stats`, `nf-settings` |

Clearing site data for the host (or the Companion WebView) resets stats, settings, and any in-progress daily.

---

## Technical notes

- Vanilla HTML / CSS / JS in one file per game.
- Mobile-first: `viewport-fit=cover`, `100dvh` / `100svh`, `touch-action: manipulation`, `user-scalable=no`.
- Desktop card: viewport at least 520px wide **and** aspect at least 3:4; height capped around 860px.
- Words and Wordlock persist the daily so a refresh does not deal a new word.
- Nuka Field sizes the grid after the play screen is shown (`#board-wrap`) so the field is a real multi-column grid, not a single strip.

Copy the HTML you actually edited up to GitHub Pages if you play from the live Hub URL — the Pages file is not updated until you push or paste it.
