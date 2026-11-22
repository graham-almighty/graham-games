# Fat Cat Pamperer -- `fat-cat-pamperer/index.html`

## Overview
Cozy spoil-a-cat sim — **not** an upkeep game. There are no happiness/needs meters, no decay, and no penalties. The player simply earns **Chonk Koins** by pampering Mochi and completing bizarrely hard tasks, then spends them getting her a bunch of stuff (furniture, toys, luxuries) that appears in her house, plus outfits earned from tasks. Mochi is a lazy chubby cat who only eats, sleeps and watches Cat TV (she plays only sometimes, ~10% of cravings).

## Layout
- **Fullscreen house scene** (`#house`, fills the viewport below the 42px GG toolbar): window with sun, picture, Cat TV, couch, rug, and Mochi (inline SVG) centred. **Mochi (she/her) SITS on her bed** — cat and bed live in one anchored unit (`#cat-seat`): `#mochi-bed` (plush pink cushion, nameplate) at the unit's base and `#cat-wrap` positioned so her body bottom (67px in unit space) sinks ~15px below the cushion top (82px), with `.cat-contact-shadow` exactly at the contact line, front paws planted forward on the cushion, and only a tight 2px drop shadow — no float gap at any viewport size (her name/outfit labels are absolutely positioned so they don't lift her off the bed). Bought stuff renders in `#stuff-layer` at fixed spots; Luxury Couch re-skins the couch purple, Cat TV Deluxe enlarges the TV.
- **Options live in a menu**: bottom menu bar (`Pamper / Bizarre Tasks / Get Stuff / Wardrobe / Log`) opens a slide-in drawer (`#drawer`). HUD chips (top-right) show Chonk Koins, Stuff x/10, Tasks x/6, Outfits x/6. No side panels in the scene itself.

## Core Systems
- **Renderer:** Single HTML file, DOM + inline SVG cat (breathing/chomping/play-bounce animations, outfit layers), no build tools.
- **Cat cravings:** `eat`/`sleep`/`tv`/`play` weighted 40/25/25/10, rotating every 15s or after a matched pamper — flavour and bonus only. Matching a craving pays **double** Chonk Koins; nothing ever drains or punishes. Eyes close + `💤` while sleeping.
- **Pamper actions (11, in the Pamper menu):** Kibble/Tuna/Salmon (eat), Tuck In/Pillow/Warm Blanket (sleep), Change Channel/Cat TV Marathon (tv), Laser/Feather/Brush (play). Each only *earns* Koins (4-8, doubled on a match) with short cooldowns. Brush on a sleepy cat can trigger the Belly Trap (still paid). TV actions cycle 6 Cat TV channels.
- **Currency:** **Chonk Koins** (🪙), start at 30, stored as `chonkKoins` in the save (legacy `pamperPoints` saves migrate automatically).
- **Animated Cat TV:** `#tv-scene` renders a live scene per channel (`renderTV()`/`tvSceneHTML()`): birds fly across Bird Watch, fish swim + bubbles rise on Fish Tank TV, a laser dot zigzags with a swiping paw on Laser Dot News, a yarn ball rolls on Yarn Ball Drama, a lion paces on Big Cat Planet, and a cat naps with floating `💤` on Nap Cam. TV actions cycle channels with the caption updating underneath.
- **Get Stuff (10 items, 5,400 Koins total):** Toy Mouse 200, Fancy Food Bowl 300, Scratching Post 350, Toy Box 400, Cozy Cat Bed 500, Cat Tree 600, Sun Hammock 650, Fish Tank 700, Luxury Couch 800, Cat TV Deluxe 900 (all literally 10x the launch prices). Purchases persist and appear in the house as big physical objects (3.6rem, ground-shadow ellipse, no text label underneath — tooltip only), House items are **drawn SVG objects at room scale, not emojis** (`stuffSVG()`), all **standing on the floor at full normal scale** (fixed px, never shrunk: hammock 430px — nearly twice Mochi's 230px, bed 360px, fish tank 320px, cat tree 275px, toy box 225px, bowl 165px, post 135px, mouse 120px) **scattered casually** across the 2400px side-scrolling house at 8 different floor depths with uneven gaps (tree back-left, hammock front-left, toy box tipped by the couch, bowl/mouse dropped by her bed, scratching post at the back, bed and tank on the right), small items tipped at lived-in angles — no row, no evenly-spaced zones. Scroll with the mouse wheel, by dragging, the scrollbar, or the ‹ › arrow buttons; the view starts centred on Mochi (`centerHouse()`). Furniture that shouldn't move **doesn't**: hammock, cat tree, scratching post, toy box, bed and bowl are static (only the pop-in when bought); only the wind-up toy mouse scurries and the fish swim inside the tank (the tank itself is still), plus light effects on the luxury couch / deluxe TV. Clicking any bought item bonks it and gets a reaction line from Mochi (`STUFF_REACTIONS`).
- **Cross-game:** Uses `graham-games-data` achievements via `ggUnlockAchievement`; `fcp_golden_bowl` shop item adds +2 Koins to feeding, `fcp_luxury_couch` pre-owns the luxury couch look.

## Bizarrely Hard Tasks (sequential unlock, all animated, FULLSCREEN + FIRST PERSON, REPLAYABLE)
Tasks unlock sequentially the first time, but **completed tasks can be done again forever** via the ↻ DO AGAIN button: replays pay half the Koins (rounded up) and the outfit is already owned. First-completion achievements only fire once.
Every task opens fullscreen (`#quest-modal` fills the viewport) and is played first-person — you see your own gloves/hands/fists/eyelids/whisk/flip-flops, never a little character. Bought house items render as large objects with ground shadows and **no name label underneath** (name is only a hover tooltip); clicking one bonks it for a Mochi reaction.
| Quest | Minigame + animation | Reward |
|-------|----------------------|--------|
| Climb Mount Everest | Mash CLIMB; first-person 🧤 gloves alternate reaching up a fullscreen snowy slope (falling ❄, summit 🚩 grows as you near it, altitude counter, wind gusts); 30 climbs | Bunny Onesie + 50🪙 |
| Win the NBA Finals | NO power bar: a rotating **dotted trajectory line** (14 dots) previews exactly where the ball will fly — rotate it with mouse/touch or ← → arrow keys (28°-72°), dots turn green and the net glows when the line runs through the drawn hoop (SVG backboard + orange square, rim, swishing net); click the court or SHOOT and the ball flies down the dotted path; 3 of 5 | Champion Chain + 50🪙 |
| Fight Off 20 Trained Ninjas | Ninjas pop/spin into a 3×3 grid coming at you, your 👊 fists punch out on each hit and ninjas spin-fall; 20 hits | Ninja Headband + 60🪙 |
| Out-Stare a Stone Sphinx | Hold to stare through your own eyes (eyelid bars creep in when you release) at a huge swaying drawn Sphinx (SVG: nemes-headdress head, lion body, front paws) while 🪶 feathers float at you; hold to 100% — on the win the Sphinx EXPLODES in phases: cracks spread → tremble → a big **clipart KABOOM! starburst** (layered red/orange/yellow SVG burst, `#clipart-boom`) pops over the statue with white flash + expanding fireball + shockwave ring → stone debris launched then falling under gravity → smoke/dust settles → head topples and a rubble pile remains — the whole sequence unfolds step-by-step over 5 seconds (STEP 1 cracks → STEP 2 KABOOM → STEP 3 debris → STEP 4 dust/rubble) with the collect button hidden and close locked until it finishes — rewards are granted only at the end via finishWinQuest(); the staring contest starts with ONE click and runs automatically (~2s at +4 per 80ms, no holding), then the explosion sequence plays automatically | Sphinx Crown + 50🪙 |
| Bake a 5-Star Soufflé | Watch a 5-step sequence build up as a row of icons (every step shown separately, so adjacent repeats like 🍋🍋 are countable — previously a single flashing emoji hid repeats and made ~59% of sequences unwinnable); first-person 🥄 whisk stirs as the 🍮 visibly rises/grows per correct step (steam 💨), collapses on error. Your entered ingredients are echoed back as you click. | Chef Hat + 50🪙 |
| Marathon in Flip-Flops | Alternate LEFT/RIGHT (buttons or A/D); first-person view looking down at YOUR 🩴 flip-flops stepping while the road scrolls underneath toward a growing 🏁; 40 steps | Astronaut Suit + 60🪙 |

Outfits are equipped from the Wardrobe menu and render as SVG layers on Mochi (`outfit-bunny-ears/body`, `outfit-chain`, `outfit-headband`, `outfit-crown`, `outfit-chef`, `outfit-astro`).

## Restart
The **↺ Restart** button sits at the end of the bottom menu bar. It is a two-click safety: the first click arms it (`⚠️ Erase EVERYTHING? Click again!` for 4 seconds), the second click calls `restartGame()` — wiping the `fat-cat-pamperer-save` (Chonk Koins back to 30, all stuff/outfits/task progress gone, cat back to Bare Chonk on her bed) and re-rendering the house. Launcher G Bux achievements in `graham-games-data` are **not** reset.

## Save Data
**localStorage key:** `fat-cat-pamperer-save`
```javascript
{ chonkKoins, totalPampers, equipped, outfits:{[id]:true}, quests:{[id]:true}, stuff:{[id]:true}, counts:{eat,sleep,tv,play} }
```

## Achievements (10, 205G)
| ID | Name | Reward | Condition |
|----|------|--------|-----------|
| fcp_first_pamper | First Pamper | 5G | First matched-craving pamper |
| fcp_full_belly | Full Belly Service | 10G | 10 eat pampers |
| fcp_nap_time | Professional Tucker-Inner | 10G | 5 sleep pampers |
| fcp_tv_addict | Cat TV Dealer | 15G | 10 TV pampers |
| fcp_playtime | She Played?! | 20G | 3 matched play pampers |
| fcp_bunny | Bunny Onesie Earned | 20G | Complete Everest quest |
| fcp_champion | NBA Champion (For a Cat) | 20G | Complete NBA quest |
| fcp_ninja | Ninja Fighter | 30G | Complete Ninjas quest |
| fcp_wardrobe | Cat Couture | 25G | Own 3 outfits |
| fcp_ultimate | Ultimate Pamperer | 50G | Complete all 6 quests |

## Tests
`fat-cat-pamperer/tests.html` — no-upkeep design checks, want weights, quest/outfit mapping, animated-stage coverage, stuff catalogue/prices, save/load + legacy migration, achievement totals. Mirrors `tests.html` style at repo root.
