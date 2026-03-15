# Mini Life — `mini-life/game.html`

## Core Systems
- **Renderer:** Three.js r128, single `<script>` tag
- **Controls:** Pointer lock, WASD movement, mouse look, crosshair raycasting
- **Needs:** hunger, energy, fun, hygiene (all start 100, decay over time)
- **Day/night cycle:** `gameTime` in minutes, `GAME_SPEED = 0.2` game-minutes/real-second
- **Money:** starts $50, earn via computer/workbench/art easel, spend on food/furniture

## Floor System
| Constant | Value | Location |
|----------|-------|----------|
| GROUND_Y | 0.15 | Home ground, town, mansion ground, yard |
| UPPER_Y | 3.65 | Home second floor |
| BASEMENT_Y | -3.35 | Basement |
| MANSION_UPPER_Y | 3.65 | Mansion upper floor |

**Stair zones** use AABB bounding boxes. Player Y interpolates based on position within the stair zone. `currentFloor` tracks which floor (-1, 0, 1).

## Locations

**Home** (origin 0,0,0):
- House interior: X=-5 to 5, Z=-5 to 5
- Yard: X=5 to 18, Z=-8 to 8
- Door gap: Z=-0.5 to 2.0 at X=5
- Home stair: X=-5 to -3.5, Z=-4.5 to -0.5
- Basement stair: X=5.3 to 8, Z=-4.5 to -2.5

**Town** (TOWN_ORIGIN X=122.5, Z=0):
- Bounds: X=88-157, Z=-28 to 28
- Main road at X=118 (width 6), cross street at Z=-0.5 (width 5), sidewalks at X=114 and X=122
- **North side buildings (Z=4-10):** Cafe (X=104-112), Library (X=92-100), Town Hall (X=127-137), GG Merch Store (X=139-145), Restaurant (X=148-156)
- **South side buildings:** Shop (X=104-112, Z=-12 to -4.5), Gym (X=92-100, Z=-8 to -16), Arcade Hall (X=148-156, Z=-8 to -16), Army Fort (X=92-100, Z=-18 to -26), Fast Food "Mic Ronaldz" (X=148-156, Z=-18 to -26)
- Basketball court: X=130-140, Z=-16 to -26 (with backboards)
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

## Interactable System

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

**Instant actions** (return early in `startAction`, no config needed): mirror, jukebox, door, grandPiano, car, townCar, mansionCar, merchCounter.

## All Action Configs

**Home:**
| Type | Need | Restore | Duration | Cost | Special |
|------|------|---------|----------|------|---------|
| fridge | hunger | 40 | 3s | $5 | Quest hook: coffee_run |
| bed | energy | 60 | 6s | $0 | Sleep sound |
| tv | fun | 45 | 4s | $0 | |
| shower | hygiene | 50 | 3.5s | $2 | Shower sound |
| computer | - | - | 10s | $0 | Earn $10+minigame bonus, -10 fun |
| workbench | - | - | 4s | $0 | Earn $25, quest hook: supply_run |
| pool | fun | 35 | 4s | $0 | +20 hygiene |
| treadmill | energy | 10 | 3s | $0 | -15 hunger, tracks treadmillUses |
| bookshelf | fun | 40 | 4s | $0 | Tracks booksRead |
| lavaLamp | fun | 25 | 2s | $0 | |
| fishTank | fun | 35 | 3s | $0 | |
| bed2 | energy | 55 | 5s | $0 | Sleep sound |
| ggPoster | fun | 15 | 2s | $0 | Second floor, merch store purchase |

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

**Town Buildings** (activity mini-games, see Town Activity Mini-games section):
| Type | Need | Restore | Duration | Cost | Special |
|------|------|---------|----------|------|---------|
| libraryRead | fun | 40 | 4s | $0 | Mini-game: type words |
| gymWorkout | energy | 10 | 3s | $0 | Mini-game: power bar, -15 hunger |
| restaurantEat | hunger | 50 | 4s | $10 | Mini-game: match dishes |
| arcadePlay | fun | 50 | 5s | $5 | Mini-game: brick breaker |
| basketballCourt | fun | varies | instant | $0 | Picker: Play Basketball or Cheerleading |
| fastfoodEat | hunger | 35 | 3s | $5 | Mini-game: catch food |

## Shop Expansion Pattern

To add a new purchasable expansion:
1. Add to `expansions` array in `renderShopItems()` with name, desc, cost, purchased flag, onBuy function
2. Create `purchaseXxx()` function: check cost, deduct money, set flag, play SFX, show tip, trigger achievement
3. Create `buildXxx()` function: construct THREE.Group, add geometry, register interactables, set action configs, call `rebuildInteractMeshes()`, add to scene
4. Add to `saveGame()` save object
5. Add to `loadGame()` restoration logic (rebuild if owned)
6. Add to `restartGame()` teardown (remove group, reset flag, splice interactables, delete action configs)

## Graham Games Merch Store

**Location:** Town, X=139-145, Z=1-7 (east of Town Hall)
- Red exterior (`0xcc2222`), dark interior, gold/dark sign
- Door gap at X=141.1-142.9 on Z=7 face
- Contains: display counter with mannequin wearing GG Merch, folded shirt displays, interior light
- NPC: "GG Superfan" (merch clerk) inside store
- **Interactable:** `merchCounter` (instant action) — opens purchase overlay for GG Merch outfit ($40), GG Beaver ($100), GG Poster ($50)
- GG Merch outfit: `OUTFITS[8]` (red shirt `0xcc2222`, black pants `0x1a1a1a`), `GG_MERCH_IDX = 8`
- Shirt has canvas texture: "GRAHAM GAMES / is my life" on front, green "G G" logo on back
- Not shown in regular P-key shop — only purchasable at merch store counter
- Excluded from "Living Large" achievement requirement
- **GG Beaver pet** ($100 in-game money): Hip-height beaver with big cute eyes, buck teeth, paddle tail, wearing GG red shirt. +10 fun every 30s. Saved in `hasBeaverPet`. Follows player at home, hidden at town/mansion. Appears in pet menu when owned (works independently of G Bux pet unlock).
- **GG Poster** ($50, requires second floor): Canvas texture poster always showing Graham (medium skin, curly blonde hair, male, GG merch outfit — never the player's character) with "GRAHAM" in red on top, "GG" in gold on bottom, gold border, dark wood frame. Located on second floor near bed at (-1, UPPER_Y+1.6, 4.9), floor 1. Interactable `ggPoster` gives +15 fun in 2s. Saved in `hasGGPoster`.
- **GG TV** ($75, requires second floor): Retro boxy CRT TV (red plastic body, dark bezel, two dial knobs, speaker grille, rabbit-ear antenna, stubby feet) on floor upstairs at (-0.5, UPPER_Y, 4.75). Interactable `ggTV` opens channel picker. Saved in `hasGGTV`.
  - **GG Trivia**: 89 trivia questions about all Graham Games. Pick 5 random, answer for fun (20 + correct*10).
  - **GG News**: 24 news stories reported by Tina Tonkins (side ponytail, blonde) and Chuck Chuckleton (short brown hair, all black). Canvas-drawn mini reporter characters at news desk with speech bubble subtitles and typewriter effect. +30 fun. Shows 3 random stories per viewing.
  - **TV Ads**: 8 product ads (`GG_TV_ADS` array) shown between news stories (2 per viewing). Each ad shows product name, icon, tagline, description, price, and effect. Ads hint about using the phone to order. Stored in `window._lastSeenAds` for phone catalog.
  - News reporters defined in `GG_NEWS_REPORTERS` with character appearance opts for `drawPosterCharacter()`.
- **GG Landline** ($100 in-game money, requires basement): Retro dark red rotary phone on small wooden table in basement at (3, BASEMENT_Y+0.77, 3). Interactable `ggPhone` opens `openPhoneCatalog()` showing all TV ad products. Ordered items are permanently placed in the basement as colored boxes with interactable actions. Saved in `hasPhone`, orders in `phoneOrders` array of itemIds. Built by `buildPhone()`, stored in `phoneGroup`. Items built by `buildPhoneItem(itemId)`.
  - **TV Ad Products** (8 unlockable items, placed in basement when ordered):
    - Mega Blaster 3000 ($30) — `megaBlaster`, +25 fun
    - Turbo Sneakers XL ($40) — `turboSneakers`, +20 energy
    - Glow Lava Lamp EXTREME ($35) — `glowLamp`, +30 fun
    - Chef's Kiss Apron ($45) — `chefApron`, +35 hunger
    - Ultra Comfy Pillow ($25) — `comfyPillow`, +30 energy
    - Sparkle Shampoo ($20) — `sparkleShampoo`, +25 hygiene
    - Joke Book Vol. 9 ($15) — `jokeBook`, +20 fun
    - Power Protein Bars ($35) — `proteinBars`, +25 hunger +15 energy
  - Each item uses action config `phone_{itemId}` with 3s duration.
- **GG Superfan dialogue**: Cycles through fan-themed lines; offers "Browse Merch" button (pre-purchase) or "Equip GG Merch" (post-purchase). Uses `window._merchDialogIdx` for cycling.

## Driving System

- `startDrivingTransition(destination)` — 'town', 'mansion', or 'home'
- 2-second overlay with road animation
- Lazy-builds destination on first visit (`buildTown()`, `buildMansion()`)
- Toggles visibility for subsequent visits
- Adjusts fog distance and shadow camera bounds per location
- Pets stay home (hidden at town/mansion)
- If mansion is owned, clicking home car opens "Where to?" destination chooser

## Save/Load (Multi-Slot)

**3 save slots** with named saves. Slot metadata stored in `minilife-slots` (array of 3). Per-slot data in `minilife-slot-0`, `minilife-slot-1`, `minilife-slot-2`.

**Metadata shape:** `[{name, day, money}, null, null]`

**Per-slot data:** needs, money, gameTime, day, charOpts, ownedOutfits, ownedFurniture, currentTrackId, doorOpen, hasSecondFloor, booksRead, treadmillUses, activePet, currentFloor, playerPos, yaw, pitch, hasCar, inTown, hasMansion, inMansion, questLog, questsCompleted, jobLastDay, totalShiftsWorked, hasBeaverPet, hasGGPoster, hasGGTV, hasPhone, phoneOrders, militaryTraining.

**Rename save:** HUD "NAME" button calls `renameSave()` — prompts for new name, updates slot metadata.

**Flow:** Creator screen shows 3 slot rows (LOAD/DELETE for occupied, "Empty" for free). First save prompts for name. Subsequent saves auto-save to active slot. Old `minilife-save` auto-migrated to slot 0 on first load.

On load: rebuilds character, second floor, furniture, car, town/mansion as needed. Re-checks all achievements.

## NPC & Quest System

**11 NPCs** (defined in `TOWN_NPC_DEFS`): Barista Bean, Merchant Mike, Mayor Maple, Old Pete, GG Superfan (merch clerk), Librarian Linda, Coach Carl, Chef Rosa, Gamer Gary, Sgt. Briggs, Mic Ronaldz (scale 0.55 — toddler-sized, black hair). Built with `buildCharacter()`, tagged with `userData.type='npc'` for raycasting.

**4 Quests** (defined in `QUESTS`):
| Quest | NPC | Condition | Reward |
|-------|-----|-----------|--------|
| Coffee Run | barista | Use fridge at home | $75 |
| Supply Run | merchant | Use workbench | $100 |
| Town Spirit | mayor | All needs > 70% | $150 |
| Tall Tales | old_pete | Read 3 books | $50 + 30 fun |

## Town Jobs (TOWN_JOBS)

| NPC ID | Name | Base Pay | Mini-game |
|--------|------|----------|-----------|
| barista | Order Rush | $15 | Fill drink orders (A/D select, Space serve) |
| merchant | Shelf Stocker | $15 | Catch falling items (A/D move) |
| mayor | Stamp Sorter | $15 | Sort documents (A approve, D deny) |
| sergeant | Target Practice | $20 | Aim crosshair (WASD) + Space shoot |
| sergeant_mission | Military Mission | $35 | Side-scrolling combat (A/D move, W jump, Space shoot) |
| frycook | Fry Cook | $12 | Match orders (1-4 keys) |

**Pay formula:** `basePay + floor(score / 2)`
**Cooldown:** One job per NPC per day (`jobLastDay[npcId] === day`). `sergeant_mission` shares cooldown with `sergeant`.

## Military Progression

- `militaryTraining` counter (0-4 = training, 5 = missions unlocked)
- Each target practice completion increments counter (max 5)
- At 5, sergeant dialogue switches to mission greetings and offers "Deploy!" button
- Saved/loaded with `militaryTraining` in save data

## Town Activity Mini-games

Activities in town buildings are interactive mini-games (not progress bars):
| Type | Building | Mini-game | Need | Restore |
|------|----------|-----------|------|---------|
| libraryRead | Library | Type words | fun | 40 |
| gymWorkout | Gym | Power bar timing | energy | 10 |
| restaurantEat | Restaurant | Match dishes | hunger | 50 |
| arcadePlay | Arcade Hall | Brick breaker | fun | 50 |
| fastfoodEat | Fast Food | Catch falling food | hunger | 35 |

Intercepted in `beginAction()` via `ACTIVITY_MINIGAMES` array → `startActivityMiniGame()`.

**Basketball Court** (`basketballCourt` type, instant action): Opens picker for Play Basketball or Cheerleading.
- **Play Basketball**: 8 shots, time a power bar to hit the green zone (0.4-0.65). Canvas mini-game with court, backboard, hoop, player character, and bouncing crowd. Fun = 20 + baskets*5.
- **Cheerleading**: 15 quick-fire rhythm moves (CLAP/Space, LEFT ARM/A, RIGHT ARM/D, JUMP/W, STOMP/S) with 1.5s timer each. Three cheerleaders in pink with pom-poms match poses. Combo system (score += 10 + combo*2). Fun = 25 + score/10.

## Character Customization

**`charOpts`:** `{ skinTone, gender, hairStyle, hairColor, outfit, accessory, dress }`

**6 Skin Tones:** Light, Fair, Medium, Olive, Brown, Dark
**7 Hair Colors:** Black, Brown, Blonde, Red, Orange, White, Blue
**8 Hair Styles:** Short, Long, Curly (dense ball clusters wrapping head), Buzz Cut, Ponytail (with red hair tie), Bun (sphere on back of head), Curly Long (curly balls cascading from crown to shoulders with side curls), Side Ponytail (hangs to right side with red hair tie — used by news reporter Tina Tonkins)
**9 Outfits:** Casual Blue (free), Sporty Red ($20), Forest Green ($25), Purple Royale ($30), Sunset Orange ($30), All Black ($35), Pink Pop ($35), Golden Drip ($50), GG Merch ($40 — sold exclusively at Graham Games Merch Store in town, not in regular shop; red shirt with gold "Graham Games is my life" text on front, GG logo on back, black pants)
**8 Dresses:** Blue ($25), Red ($25), Green ($30), Purple ($35), Orange ($35), Black ($40), Pink ($40), Gold ($55) — each color matches corresponding outfit. Renders bodice + flared skirt + waist seam + hem with skin-colored legs below. Equipping a dress unequips outfit and vice versa. Stored in `ownedDresses` set, `charOpts.dress` (-1 = none).
**5 Accessories:** None, Backpack (with straps), Purse (crossbody front-right), Satchel (crossbody front-left), Tote Bag (crossbody front-right) — all bags have straps wrapping over shoulder, across front+back, and under opposite arm

`buildCharacter(opts)` creates a `THREE.Group` with head, eyes, torso, arms, legs, hair, and accessory meshes. Gender affects body proportions (bodyW, hipW, armX).

Preview system: separate `prevScene` with `updatePreview()` that rebuilds on any option change.

## Materials (`mat` object)
floor, wall, wallInner, grass, skin, shirt, pants, hair, fridge, bed, bedsheet, pillow, tv, tvScreen, couch, couchCushion, shower, showerMetal, table, chrome, rubber, water, sand, rug, door, window, monitor, monitorScreen, keyboard.

## Achievements (18, 520G)
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
| ml_first_shift | First Shift | 10G | Complete a town job |
| ml_hard_worker | Hard Worker | 25G | Complete 10 town job shifts |
| ml_employee_month | Employee of the Month | 50G | Complete 25 town job shifts |

## G Bux Shop Items
| ID | Cost | Effect |
|----|------|--------|
| ml_pet_dog | 50G | Unlocks BOTH dog & cat |
| ml_pool | 100G | Backyard pool (fun+hygiene) |
| ml_basement | 150G | Underground expansion |
