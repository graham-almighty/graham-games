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

### General
- All games are single HTML files. No build tools, no bundlers, no npm.
- Prefer editing existing files over creating new ones.
- Follow existing code patterns exactly (interactable registration, action config, achievement hooks, save/load).
- Do not add features, refactoring, or "improvements" beyond what was requested.

---

## Project Structure

```
/home/graham/src/
  graham-games/index.html   — Main launcher (dark/gold theme, G Bux system)
  mini-life/game.html        — 3D first-person life simulator (Three.js r128)
  hurgvibbit/index.html      — Punk/metal patty-cake rhythm game
  flying-ace/index.html      — Iframe wrapper for https://flying-ace-board-game.web.app
  combat/index.html          — Iframe wrapper for https://combat-retro-game.web.app
  CLAUDE.md                  — This file
  README.md                  — GitHub documentation
```

All games are standalone single-file HTML. External games (Flying Ace, Combat) use iframe wrappers with a shared toolbar (GG logo, title, EXIT TO LAUNCHER button).

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
2. The launcher file (`graham-games/index.html`, achievement arrays starting ~line 723)

---

## Launcher — `graham-games/index.html`

- Dark/gold serpent double-G SVG logo
- 4 game cards with color-coded borders
- G Bux balance display (top right)
- Achievements panel (25 total achievements)
- G Bux Shop (5 items)

### Achievements (25 total, 665 G Bux earnable)

**Hurgvibbit (10 achievements, 225G):**
| ID | Name | Reward | Condition |
|----|------|--------|-----------|
| hurv_first_timer | First Timer | 5G | Complete a round |
| hurv_combo_10 | Combo King | 10G | 10x combo |
| hurv_grade_a | Grade A | 15G | Get A grade |
| hurv_grade_s | Grade S | 25G | Zero MEH/LAME hits |
| hurv_combo_25 | Combo Legend | 20G | 25x combo |
| hurv_hard_complete | Hard Mode | 30G | Complete Hard |
| hurv_score_5000 | Score 5K | 15G | 5,000 points |
| hurv_score_15000 | Score 15K | 25G | 15,000 points |
| hurv_flawless | Flawless | 30G | 100% hit rate |
| hurv_rhythm_master | Rhythm Master | 50G | S grade on Hard |

**Mini Life (15 achievements, 440G):**
| ID | Name | Reward | Condition |
|----|------|--------|-----------|
| ml_new_home | New Home | 5G | Start first game |
| ml_survivor | Survivor | 10G | Survive 3 days |
| ml_week_warrior | Week Warrior | 20G | Survive 7 days |
| ml_shopaholic | Shopaholic | 10G | Buy any item |
| ml_interior_designer | Interior Designer | 25G | Buy all 4 furniture |
| ml_fashion_icon | Fashion Icon | 10G | Buy any outfit |
| ml_moving_up | Moving Up | 20G | Buy second floor |
| ml_arcade_pro | Arcade Pro | 15G | Score 25+ in computer minigame |
| ml_high_roller | High Roller | 20G | Have $500 at once |
| ml_living_large | Living Large | 50G | Own everything |
| ml_bookworm | Knowledge is Power | 50G | Read 3 books |
| ml_gym_rat | Gym Rat | 50G | Treadmill 3 times |
| ml_helpful_neighbor | Helpful Neighbor | 25G | Complete 1 quest |
| ml_town_hero | Town Hero | 50G | Complete all 4 quests |
| ml_mansion_mogul | Mansion Mogul | 75G | Purchase mansion |

### G Bux Shop (5 items, 425G total)
| ID | Name | Cost | Effect |
|----|------|------|--------|
| hurv_neon_theme | Neon Theme | 50G | Neon colors for Hurgvibbit |
| hurv_turbo_mode | Turbo Mode | 75G | Insane speed difficulty |
| ml_pet_dog | Pet Dog | 50G | Unlocks BOTH dog & cat |
| ml_pool | Swimming Pool | 100G | Backyard pool (fun+hygiene) |
| ml_basement | Basement | 150G | Underground expansion |

---

## Mini Life — `mini-life/game.html`

### Core Systems
- **Renderer:** Three.js r128, single `<script>` tag
- **Controls:** Pointer lock, WASD movement, mouse look, crosshair raycasting
- **Needs:** hunger, energy, fun, hygiene (all start 100, decay over time)
- **Day/night cycle:** `gameTime` in minutes, `GAME_SPEED = 0.2` game-minutes/real-second
- **Money:** starts $50, earn via computer/workbench/art easel, spend on food/furniture

### Floor System
| Constant | Value | Location |
|----------|-------|----------|
| GROUND_Y | 0.15 | Home ground, town, mansion ground, yard |
| UPPER_Y | 3.65 | Home second floor |
| BASEMENT_Y | -3.35 | Basement |
| MANSION_UPPER_Y | 3.65 | Mansion upper floor |

**Stair zones** use AABB bounding boxes. Player Y interpolates based on position within the stair zone. `currentFloor` tracks which floor (−1, 0, 1).

### Locations

**Home** (origin 0,0,0):
- House interior: X=-5 to 5, Z=-5 to 5
- Yard: X=5 to 18, Z=-8 to 8
- Door gap: Z=-0.5 to 2.0 at X=5
- Home stair: X=-5 to -3.5, Z=-4.5 to -0.5
- Basement stair: X=5.3 to 8, Z=-4.5 to -2.5

**Town** (TOWN_ORIGIN X=122.5, Z=0):
- Bounds: X=100-145, Z=-15 to 15
- Road at X=118 (width 6), sidewalks at X=114 and X=122
- Buildings: Cafe (X=104-112, Z=1-7), Shop (X=104-112, Z=-12 to -4.5), Town Hall (X=127-137, Z=1-7)
- Parking lot: X=130-140, Z=-12 to -4
- Park: Z=9-15 (trees, bench, fountain)
- Player spawn: (135, 0.15, -8)

**Mansion** (MANSION_ORIGIN X=280, Z=0):
- Bounds: X=250-310, Z=-25 to 25
- Building footprint: X=265-305, Z=-10 to 10
- Ground floor rooms: foyer (265-275), kitchen (275-285, Z=-10 to -3), living room (275-285, Z=3-10), theater (285-295, Z=-10 to -3), spa (295-305, Z=-10 to -3)
- Staircase: X=285-288, Z=3-10
- Upper floor rooms: master bedroom (265-280, Z=-10 to 0), library (265-280, Z=0-10), art studio (280-290, Z=-10 to 0), game room (290-305, Z=-10 to 0), balcony+hot tub (290-305, Z=0-10)
- Outdoor: tennis court (255-265, Z=5-15), zen garden (265-275, Z=12-20), fountain (260, 0), driveway (258, -10)
- Player spawn: (258, 0.15, -12)

### Interactable System

**Registration pattern:**
```javascript
interactables.push({
  mesh: THREE.Mesh,       // for raycasting
  group: THREE.Group,     // for positioning/cleanup
  type: 'typeName',       // action identifier
  label: 'Display Text',  // hover label
  need: 'hunger',         // which need restored (or null)
  usePos: new THREE.Vector3(x, y, z),  // walk-to position
  floor: 0               // 0=ground, 1=upper, -1=basement
});
```
After registration, call `rebuildInteractMeshes()`.

**Action config pattern:**
```javascript
actionConfig.typeName = {
  label: 'Doing thing...',  // progress bar text
  duration: 4,              // seconds
  restore: 50,              // amount added to need
  cost: 0,                  // money deducted
  earn: 0,                  // money earned
  funBonus: 0,              // extra fun restored
  hygieneBonus: 0,          // extra hygiene restored
  energyBonus: 0,           // extra energy restored
  hungerDrain: 0,           // hunger removed
};
```

**Instant actions** (return early in `startAction`, no config needed): mirror, jukebox, door, grandPiano, car, townCar, mansionCar.

### All Action Configs

**Home:**
| Type | Need | Restore | Duration | Cost | Special |
|------|------|---------|----------|------|---------|
| fridge | hunger | 40 | 3s | $5 | Quest hook: coffee_run |
| bed | energy | 60 | 6s | $0 | Sleep sound |
| tv | fun | 45 | 4s | $0 | |
| shower | hygiene | 50 | 3.5s | $2 | Shower sound |
| computer | — | — | 10s | $0 | Earn $10+minigame bonus, -10 fun |
| workbench | — | — | 4s | $0 | Earn $25, quest hook: supply_run |
| pool | fun | 35 | 4s | $0 | +20 hygiene |
| treadmill | energy | 10 | 3s | $0 | -15 hunger, tracks treadmillUses |
| bookshelf | fun | 40 | 4s | $0 | Tracks booksRead |
| lavaLamp | fun | 25 | 2s | $0 | |
| fishTank | fun | 35 | 3s | $0 | |
| bed2 | energy | 55 | 5s | $0 | Sleep sound |

**Mansion:**
| Type | Need | Restore | Duration | Cost | Special |
|------|------|---------|----------|------|---------|
| mansionKitchen | hunger | 70 | 4s | $0 | Free food! |
| grandPiano | fun | 50 | instant | $0 | Instant action |
| homeTheater | fun | 60 | 5s | $0 | |
| mansionSpa | hygiene | 80 | 6s | $0 | +20 fun, shower sound |
| kingBed | energy | 85 | 7s | $0 | Sleep sound |
| mansionLibrary | fun | 55 | 4s | $0 | Tracks booksRead |
| artEasel | fun | 40 | 6s | $0 | Earn $15 |
| mansionArcade | fun | 50 | 5s | $0 | |
| hotTub | hygiene | 70 | 5s | $0 | +25 fun, shower sound |
| wineRack | fun | 35 | 3s | $0 | |
| tennisCourt | fun | 45 | 5s | $0 | +20 energy, -15 hunger |
| zenGarden | fun | 30 | 4s | $0 | +10 hygiene |

### Shop Expansion Pattern

To add a new purchasable expansion:
1. Add to `expansions` array in `renderShopItems()` with name, desc, cost, purchased flag, onBuy function
2. Create `purchaseXxx()` function: check cost, deduct money, set flag, play SFX, show tip, trigger achievement
3. Create `buildXxx()` function: construct THREE.Group, add geometry, register interactables, set action configs, call `rebuildInteractMeshes()`, add to scene
4. Add to `saveGame()` save object
5. Add to `loadGame()` restoration logic (rebuild if owned)
6. Add to `restartGame()` teardown (remove group, reset flag, splice interactables, delete action configs)

### Driving System

- `startDrivingTransition(destination)` — 'town', 'mansion', or 'home'
- 2-second overlay with road animation
- Lazy-builds destination on first visit (`buildTown()`, `buildMansion()`)
- Toggles visibility for subsequent visits
- Adjusts fog distance and shadow camera bounds per location
- Pets stay home (hidden at town/mansion)
- If mansion is owned, clicking home car opens "Where to?" destination chooser

### Save/Load

**localStorage key:** `minilife-save`

Saves: needs, money, gameTime, day, charOpts, ownedOutfits, ownedFurniture, currentTrackId, doorOpen, hasSecondFloor, booksRead, treadmillUses, activePet, currentFloor, playerPos, yaw, pitch, hasCar, inTown, hasMansion, inMansion, questLog, questsCompleted.

On load: rebuilds character, second floor, furniture, car, town/mansion as needed. Re-checks all achievements.

### NPC & Quest System

**4 NPCs** (defined in `TOWN_NPC_DEFS`): Barista Bean, Merchant Mike, Mayor Maple, Old Pete. Built with `buildCharacter()`, tagged with `userData.type='npc'` for raycasting.

**4 Quests** (defined in `QUESTS`):
| Quest | NPC | Condition | Reward |
|-------|-----|-----------|--------|
| Coffee Run | barista | Use fridge at home | $75 |
| Supply Run | merchant | Use workbench | $100 |
| Town Spirit | mayor | All needs > 70% | $150 |
| Tall Tales | old_pete | Read 3 books | $50 + 30 fun |

### Materials (`mat` object)
floor, wall, wallInner, grass, skin, shirt, pants, hair, fridge, bed, bedsheet, pillow, tv, tvScreen, couch, couchCushion, shower, showerMetal, table, chrome, rubber, water, sand, rug, door, window, monitor, monitorScreen, keyboard.

---

## Hurgvibbit — `hurgvibbit/index.html`

- Punk/metal patty-cake rhythm game
- 4 note lanes: Clap (D/Space), Left (F), Right (J), Both (K)
- Mouse: Left click = Left lane, Right click = Right lane, Both within 80ms = Both lane
- Difficulties: Easy/Normal/Hard + Turbo (G Bux unlock)
- Scoring: Perfect 300pts, Great 200pts, OK 100pts, Miss -5 combo
- **S grade:** requires ZERO MEH/LAME hits (not percentage-based)
- Grades: S (all perfect/great), A (>85%), B (>70%), C (>50%), D (<50%)
- Web Audio API synthesized sounds (guitar riffs, death metal vocals)
- Neon Theme unlockable changes CSS custom properties
- Credits: "by graham f who is a numbskull"

---

## Design Conventions

- **Fonts:** Cinzen for launcher/toolbar, Segoe UI for Mini Life HUD
- **Colors:** Dark backgrounds (#0a0a0f, #1a1a2e), gold accents (#c9a84c)
- **HUD:** Glass-blur panels (#00000088 + backdrop-filter: blur(4px))
- **Toolbar:** 42px fixed height, gradient background, GG serpent logo, EXIT TO LAUNCHER button
- **Toast notifications:** Achievement unlock toasts with queue system

---

## GitHub

- **Repo:** github.com/graham-almighty/graham-games (private)
- **Branch:** master
- **Remote:** origin (HTTPS)
