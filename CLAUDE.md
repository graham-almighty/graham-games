# CLAUDE.md — Graham Games Project

## Workflow Rules

### Testing
- **Everything MUST be unit tested thoroughly.** No feature, bug fix, or change is considered complete without fully passing tests.
- Tests should cover interactable registration, action config values, save/load round-tripping, achievement triggers, collision bounds, floor transitions, and UI state.
- Run all tests before marking any task as done. If tests fail, fix them before proceeding.

### Save Revisions
- After each update is complete (and tests pass), prompt the user: **"Would you like me to save a revision of this?"**
- If **yes**: stage changed files, commit with a descriptive message, and push to `origin`.
- If **no**: do not commit or push. Leave changes unstaged.

### Documentation Maintenance
- **At the end of every session**, update the relevant `CLAUDE.md` files — both the main one and any game-specific ones affected by the session's changes.
- Remove information that is no longer accurate or relevant.
- Add any new systems, constants, achievements, shop items, or mechanics that were introduced.
- Keep the main `CLAUDE.md` slim (cross-game totals, project structure, conventions). Put game-specific details only in the per-game `CLAUDE.md` files.

### General
- All games are single HTML files. No build tools, no bundlers, no npm.
- Prefer editing existing files over creating new ones.
- Follow existing code patterns exactly (interactable registration, action config, achievement hooks, save/load).
- Do not add features, refactoring, or "improvements" beyond what was requested.

---

## Project Structure

```
/home/graham/src/
  index.html                    — Main launcher (dark/gold theme, G Bux system)
  mini-life/game.html          — 3D first-person life simulator (Three.js r128)
  hurgvibbit/index.html        — Punk/metal patty-cake rhythm game
  tower-defense/index.html     — 2D canvas tower defense game
  ancient-warfare/index.html   — 3D army battle simulator (Three.js r128)
  devious-driving/index.html   — 2D canvas top-down racing game (1-4 players + AI)
  brawl-monsters/index.html    — 2D monster catching/battling RPG
  battle-bros/index.html       — 2D 8-bit platform fighter
  rogue-depths/index.html      — 2D roguelike dungeon crawler
  sibling-brawl/index.html     — 3D first-person sibling battle game (Three.js r128)
  flying-ace/index.html        — Iframe wrapper for https://flying-ace-board-game.web.app
  combat/index.html            — Iframe wrapper for https://combat-retro-game.web.app
  CLAUDE.md                    — This file (cross-game overview)
  README.md                    — GitHub documentation
```

All games are standalone single-file HTML. External games (Flying Ace, Combat) use iframe wrappers with a shared toolbar (GG logo, title, EXIT TO LAUNCHER button).

**Game-specific docs** live in each game's subdirectory as `CLAUDE.md` — read those for detailed mechanics, constants, and patterns.

---

## Cross-Game G Bux System

**localStorage key:** `graham-games-data`

**Data shape:**
```javascript
{
  gBux: number,
  achievements: { [id: string]: true },
  shopPurchases: { [id: string]: true }
}
```

**Functions (in each game file):**
- `ggLoad()` — returns parsed data or defaults
- `ggSave(data)` — writes to localStorage
- `ggUnlockAchievement(id, name, reward)` — awards G Bux, shows toast, skips if already earned

**Achievements must be registered in TWO places:**
1. The game file itself (e.g., `ML_ACH` in mini-life, `HURV_ACH` in hurgvibbit)
2. The launcher file (`index.html`, `ALL_ACHIEVEMENTS` array ~line 1425)

### Launcher — `index.html`

- Dark/gold serpent double-G SVG logo
- Game cards with color-coded borders + hover video preview popups
- G Bux balance display (top right)
- Achievements panel, G Bux Shop
- School Mode: PIN-protected parental controls, quiz timer, blocks Combat & Ancient Warfare
- News panel with updates

### Achievement Summary (105 total, 2345G earnable)
| Game | Count | Total G |
|------|-------|---------|
| Hurgvibbit | 10 | 225G |
| Mini Life | 18 | 520G |
| Tower Defense | 10 | 185G |
| Ancient Warfare | 10 | 215G |
| Rogue Depths | 10 | 200G |
| Devious Driving | 8 | 175G |
| Brawl Monsters | 19 | 430G |
| Battle Bros | 10 | 210G |
| Sibling Brawl | 10 | 185G |

See each game's `CLAUDE.md` for full achievement tables.

### G Bux Shop (19 items, 1300G total)
| ID | Name | Cost | Game | Effect |
|----|------|------|------|--------|
| hurv_neon_theme | Neon Theme | 50G | Hurgvibbit | Neon color scheme |
| hurv_turbo_mode | Turbo Mode | 75G | Hurgvibbit | Insane speed difficulty |
| ml_pet_dog | Pet Dog | 50G | Mini Life | Unlocks BOTH dog & cat |
| ml_pool | Swimming Pool | 100G | Mini Life | Backyard pool (fun+hygiene) |
| ml_basement | Basement | 150G | Mini Life | Underground expansion |
| td_flame_tower | Flame Tower | 75G | Tower Defense | Unlocks 5th tower type |
| td_double_gold | War Bonds | 50G | Tower Defense | Start with $200 |
| aw_war_elephant | War Elephant | 75G | Ancient Warfare | Unlocks 6th unit type |
| aw_battle_horn | Battle Horn | 50G | Ancient Warfare | +10% damage for first 10s |
| rd_shadow_class | Rogue Class | 75G | Rogue Depths | Unlocks Rogue class |
| rd_enchanted_start | Enchanted Start | 50G | Rogue Depths | Start with uncommon weapon |
| dd_turbo_start | Turbo Start | 50G | Devious Driving | Timed boost at race start |
| dd_monster_truck | Monster Truck | 75G | Devious Driving | Bigger car with knockback |
| bm_drakovex | Drakovex | 75G | Brawl Monsters | Unlocks Drakovex monster |
| bm_stat_scanner | Monster Scanner | 50G | Brawl Monsters | See enemy stats in battle |
| bb_shadow_mode | Shadow Mode | 75G | Battle Bros | CRT scanlines + after-images |
| bb_boss_fighter | Boss Fighter | 50G | Battle Bros | Unlocks hidden fighter Omega |
| sb_super_soaker | Super Soaker | 75G | Sibling Brawl | Unlocks Super Soaker unit |
| sb_snack_boost | Snack Boost | 50G | Sibling Brawl | +10% damage for first 10s |

---

## Design Conventions

- **Fonts:** Cinzel for launcher/toolbar, Segoe UI for Mini Life HUD
- **Colors:** Dark backgrounds (#0a0a0f, #1a1a2e), gold accents (#c9a84c)
- **HUD:** Glass-blur panels (#00000088 + backdrop-filter: blur(4px))
- **Toolbar:** 42px fixed height, gradient background, GG serpent logo, EXIT TO LAUNCHER button
- **Toast notifications:** Achievement unlock toasts with queue system
- **Mobile responsive:** All pages must include `<meta name="viewport" ...>` and a `@media (max-width: 600px)` breakpoint. Scale down logos/titles, allow natural scrolling, adjust padding/font sizes for small screens.

---

## GitHub

- **Repo:** github.com/graham-almighty/graham-games (private)
- **Pages URL:** https://graham-almighty.github.io/graham-games/
- **Branch:** master
- **Remote:** origin (HTTPS)
