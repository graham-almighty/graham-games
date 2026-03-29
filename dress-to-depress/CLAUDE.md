# Dress to Depress — `dress-to-depress/index.html`

## Core Systems
- **Renderer:** Three.js r128, single `<script>` tag, CDN loaded
- **Theme:** Hot pink (#ff69b4) accent color, dark background
- **Concept:** Dress as horribly and mismatched as possible, compete against 3 bots for ugliest outfit

## Game Flow
1. **Title Screen** — Character setup (skin tone, hair color, hair style), PLAY button
2. **Theme Reveal** — Shows round number and themed scenario (e.g. "Job Interview")
3. **Dress-Up Phase** — 3D preview (rotating character), clothing panel with category tabs, color picker for variable items, 45s timer (60s with shop upgrade)
4. **Runway Walk** — Character walks down 3D catwalk with spotlight, audience flashes, 8-10s automated sequence
5. **Rating Screen** — Player rates 3 bot competitors' outfits (1-5 stars), bots rate player (algorithm-based)
6. **Round Results** — Leaderboard showing player + 3 bots ranked by algorithm score, breakdown shown
7. **Final Results** — After 5 rounds, shows overall leaderboard with total scores across all rounds

### Screens
`title-screen`, `theme-screen`, `dressup-screen`, `runway-screen`, `rating-screen`, `judging-screen`, `final-screen`

## Bot Competitor System
- **3 Bots:** Bella Disastro, Sir Wrinkleton, Missy Mishmash
- Each round, bots receive random outfits via `generateRandomOutfit()`
- Bot scores calculated by the same `calcTotalScore()` algorithm as the player
- **Rating Screen:** Player rates bots 1-5 stars (interactive engagement), bots rate player based on algorithm score
- **Leaderboard:** All 4 participants ranked by algorithm score each round
- **Final leaderboard:** Total scores across all 5 rounds determine overall winner

### Bot character appearances
| Bot | Skin Tone | Hair Style | Hair Color |
|-----|-----------|------------|------------|
| Bella Disastro | 1 | long | 2 |
| Sir Wrinkleton | 3 | buzz | 0 |
| Missy Mishmash | 0 | curly | 4 |

## 3D Character Model
- `buildModel(opts, outfitOpts)` builds a Three.js group with skin body, clothing overlays, hair, etc.
- **Skin body mesh** renders underneath all clothing to prevent gaps (tank top, crop top, etc.)
- Arms use skin material for sleeveless tops (Tank Top, Crop Top)
- Special mesh handling for: Tutu, Kilt, Cargo Shorts, Cowboy/Rain/Armor Boots, Crocs, Flip Flops, Bathrobe, Armor Breastplate, Hawaiian Shirt, Lab Coat, Tank Top, Crop Top

## Clothing System (5 categories)

**Hats (12):** None, Baseball Cap*, Top Hat, Cowboy Hat, Beanie*, Crown, Chef Hat, Viking Helmet, Propeller Hat*, Pirate Hat, Shower Cap, Tinfoil Hat
**Tops (10):** Plain T-Shirt*, Suit Jacket, Hawaiian Shirt, Tuxedo Shirt, Hoodie, Tank Top*, Bathrobe, Armor Breastplate, Crop Top*, Lab Coat
**Bottoms (10):** Jeans, Suit Pants, Cargo Shorts, Sweatpants, Kilt, Tutu, Pajama Pants, Board Shorts*, Lederhosen, Tuxedo Pants
**Shoes (8):** Sneakers*, Dress Shoes, Flip Flops*, Cowboy Boots, Crocs*, Slippers, Rain Boots, Armor Boots
**Accessories (8):** None, Bow Tie*, Sunglasses, Feather Boa, Fanny Pack*, Monocle, Rubber Duck, Toy Sword

*Items marked with \* have variable colors (10-color palette)

Each item has a `style` tag used for scoring: casual, formal, western, royal, occupation, costume, silly, bathroom, conspiracy, vacation, gym, medieval, trendy, dance, sleepwear, beach, cool, glam, tourist, posh, weather, controversial

## Scoring Algorithm (0-100 per round)

**Style Mismatch (0-30):** Count unique style tags across worn items. 1 style=0, 2=5, 3=12, 4=22, 5=30.

**Color Clash (0-30):** Pairwise hue distance between item colors. Complementary colors (+5), moderate clash (+3). Bonus +8 for 4+ different hue groups. Capped at 30.

**Theme Inappropriateness (0-40):** +7 per inappropriate style, -4 per appropriate style. Bonus combos (specific item pairs) add extra points. Capped at 40.

**Star Rating:** 0-20=1★, 21-40=2★, 41-60=3★, 61-80=4★, 81-100=5★

## Themes (5 total)
| Theme | Appropriate | Key Inappropriate Styles |
|-------|------------|--------------------------|
| Job Interview | formal | bathroom, sleepwear, costume, silly |
| Royal Wedding | formal, royal | gym, beach, bathroom, casual |
| First Date | casual, trendy | bathroom, sleepwear, medieval |
| Beach Party | beach, casual | formal, medieval, occupation |
| School Picture Day | casual | costume, bathroom, medieval, glam |

Each theme has 4 bonus combos (specific item pairs with funny comments).

## NPC Judges
- **Francesca Von Flair** — Snooty fashion critic
- **Chad Broseph** — Bro-themed commentary
- **Granny Mildred** — Grandma-themed reactions

Each judge has 5 tiers of comments (matching star rating). Scores are total/10 with ±0.5 random variance.

## Music (Web Audio API)
- **Style:** Cheesy upbeat fashion show music
- **Scale:** C major, 120 BPM
- **Instruments:** Square wave bass, sawtooth melody, kick/snare/hihat, triangle brass stabs, quirky trills
- **Toggle:** HUD button + M key

## SFX
- `sfxFlash()` — Camera flash click
- `sfxApplause()` — White noise applause
- `sfxFanfare()` — Ascending triangle notes (high score)
- `sfxBuzzer()` — Low sawtooth (low score)
- `sfxClick()` — UI click

## Achievements (10, 200G)
| ID | Name | Reward | Condition |
|----|------|--------|-----------|
| dtd_first_show | First Show | 5G | Complete a round |
| dtd_full_outfit | Fully Dressed | 10G | Equip hat + accessory (all slots filled) |
| dtd_3_stars | Fashion Disaster | 15G | Get 3+ stars on a round |
| dtd_5_stars | Depressingly Perfect | 30G | Get 5 stars on a round |
| dtd_all_themes | World Tour of Shame | 25G | Play all 5 themes |
| dtd_color_clash | Rainbow Wreck | 15G | Max color clash score (30/30) |
| dtd_style_clash | Identity Crisis | 20G | Max style mismatch (30/30) |
| dtd_bonus_combo | Combo Breaker | 15G | Trigger any bonus combo |
| dtd_high_score | Master of Disaster | 40G | Total 400+ across all 5 rounds |
| dtd_speed_dresser | Speed Dresser | 25G | Dress in under 15 seconds |

## G Bux Shop Items
| ID | Cost | Effect |
|----|------|--------|
| dtd_wild_card | 50G | Adds 3 wild clothing items |
| dtd_extra_time | 75G | 60 seconds per round instead of 45 |

## Stats Persistence
- **localStorage key:** `dtd-stats` → `{ gamesPlayed, bestRound, bestTotal, themesPlayed: [] }`

## 3D Scenes
- **Preview scene:** `prevScene` with rotating character on dark disc, ambient + directional light
- **Runway scene:** `runScene` with long catwalk (dark floor, gold edge strips), spotlights (pink + blue), audience silhouettes with random camera flashes, fog
