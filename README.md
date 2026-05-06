# Graham Games

A collection of browser-based games with a shared achievement and currency system. All games are single HTML files with zero build tools or dependencies.

## Games

### Mini Life
A 3D first-person life simulator built with Three.js. Manage your needs (hunger, energy, fun, hygiene), earn money, buy furniture, and explore.

- **Character creator** with skin tones, hairstyles, and outfits
- **4 needs** that decay over time — keep them up or it's game over
- **Day/night cycle** with a money system
- **Purchasable furniture:** Lava Lamp, Fish Tank, Treadmill, Jukebox
- **Second floor** expansion ($200) with bookshelf and cozy bed
- **Car** ($200) to drive to town
- **Town** with 4 NPCs, 4 quests, shops, a park, and a parking lot
- **Mansion** ($1000) — luxury estate with 12 interactable rooms across 2 floors plus outdoor grounds (theater, spa, hot tub, tennis court, art studio, grand piano, and more)
- **Basement** (G Bux unlock) with workbench and punching bag
- **Swimming Pool** (G Bux unlock) in the backyard
- **Pets** (G Bux unlock) — dog and cat that follow you around
- **Save/Load** system with localStorage

### Hurgvibbit
A punk/metal patty-cake rhythm game. Notes fall down 4 lanes — hit them with keyboard or mouse to score points.

- **3 difficulties** (Easy, Normal, Hard) plus unlockable Turbo Mode
- **Keyboard controls:** D/Space (Clap), F (Left), J (Right), K (Both)
- **Mouse controls:** Left click, Right click, or both simultaneously
- **Scoring:** Perfect (300pts), Great (200pts), OK (100pts), Miss (-5 combo)
- **S grade** requires zero bad hits
- **Synthesized metal soundtrack** with death metal vocals and guitar riffs
- **Neon Theme** unlockable via G Bux Shop

### Flying Ace
A board game hosted externally, accessed via iframe wrapper.

### Combat
A retro-style game hosted externally, accessed via iframe wrapper.

### Dumb Chaos
A 3D first-person goofy arena shooter. Fire joke weapons like a pineapple launcher, defeat Chaos Bots and rival-player avatars, earn Chaos Coins, and buy more ridiculous gear.

- **First-person controls:** WASD, mouse look, click to fire
- **Goofy weapons:** pineapple launcher, rubber chicken, waffle mines, poo/pee toilet cannon, bouncy ball cat cannon
- **Chaos Coins** earned from splats and spent in the in-game shop
- **G Bux unlocks** for faster reloads, bigger blasts, speed, and extra HP

## G Bux System

All games share a cross-game achievement and currency system:

- **157 achievements** across the Graham Games catalog — earn up to **3480 G Bux**
- **G Bux Shop** with 29 unlockable items across multiple games
- Achievements and purchases persist across all games via shared localStorage
- The launcher displays your G Bux balance, earned achievements, and available shop items

## How to Play

1. Open `index.html` in a browser — this is the launcher
2. Click any game card to play
3. Earn G Bux by completing achievements
4. Spend G Bux in the shop to unlock content across games

All files are self-contained HTML. No server, no install, no build step needed. Just open in a browser.

## File Structure

```
index.html                 — Launcher with G Bux system
mini-life/game.html        — Mini Life (Three.js, ~6000 lines)
hurgvibbit/index.html      — Hurgvibbit rhythm game
dumb-chaos/index.html      — Dumb Chaos first-person arena shooter
flying-ace/index.html      — Flying Ace iframe wrapper
combat/index.html          — Combat iframe wrapper
```

## Tech Stack

- **Three.js r128** (3D games) — loaded from CDN
- **Web Audio API** — synthesized sound effects and music (no audio files)
- **Speech Synthesis API** — Hurgvibbit announcer voice
- **localStorage** — save/load and cross-game data
- **Zero dependencies** — no npm, no build tools, no frameworks

---

*by graham f who is a numbskull*
