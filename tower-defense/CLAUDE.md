# Tower Defense — `tower-defense/index.html`

## Core Systems
- **Renderer:** 2D Canvas, `requestAnimationFrame` loop
- **Grid:** 16x10 tiles (52px each), dynamic path per map
- **Controls:** Mouse click to place/select towers, keyboard shortcuts (1-7 tower types, Space = send wave, F = toggle speed, Escape = deselect)
- **30 waves**, game is winnable. 5s countdown between waves (or send early).
- **2x speed toggle** (F key)
- **UI flow:** Title -> Map Select -> Story Intro -> Game -> End -> (Story Outro on victory) -> Map Select
- **Cartoony visual style:** Custom drawn towers, enemies, projectiles, and effects (no simple circles/symbols)

## Campaign Maps (5 maps, linear unlock)

`MAP_DEFS` array. Progress stored in `td-map-progress` localStorage key (`{ unlockedMaps: N }`).

| # | Chapter | Name | HP Mult | Path Style |
|---|---------|------|---------|------------|
| 1 | I | The Forest Gate | 1.0x | S-curve (classic) |
| 2 | II | River Crossing | 1.15x | Zigzag, shorter horizontal runs |
| 3 | III | Mountain Pass | 1.3x | Spiral inward, exits mid-bottom |
| 4 | IV | The Dark Swamp | 1.5x | Winding with tight 90-degree corners |
| 5 | V | Dragon's Lair | 1.75x | Complex weaving, exits bottom-left |

- Map N playable if `N <= unlockedMaps` (1-indexed)
- Victory on map N: `unlockedMaps = max(current, N+1)`, capped at 5
- Each map has `buildPath()` returning `[[col,row], ...]`, `intro` and `victory` story objects
- Story screens: chapter, title, narration, dialogue with speaker/text
- Fantasy storyline: kingdom of Aurelion under siege, Commander Aric and Scout Lira NPCs

### Themed Map Visuals

Each map has a `theme` object controlling terrain colors and decorative features. Properties:

| Property | Description |
|----------|-------------|
| `grass`, `grassStroke` | Base terrain fill and outline colors |
| `path`, `pathStroke` | Path tile fill and outline colors |
| `tuft1`, `tuft2` | Two alternating colors for terrain detail strokes |
| `dot` | Color for path direction indicator dots |
| `trees` | Boolean — scattered cartoon trees on grass (Forest Gate) |
| `water`, `waterColor` | Boolean + color — river columns at c=7,8 (River Crossing) |
| `rocks` | Boolean — small pebbles instead of grass tufts (Mountain Pass) |
| `swamp` | Boolean — murky pools on grass tiles (Dark Swamp) |
| `fog` | Boolean — animated translucent fog overlay (Dark Swamp) |
| `lava` | Boolean — glowing lava pools on grass (Dragon's Lair) |
| `cavern` | Boolean — stalagmites, dark ambient overlay, animated lava veins (Dragon's Lair) |

Pre-generated `grassTufts` array provides random positions/sizes for terrain details on non-path tiles, regenerated each time `setMap()` is called.

## Towers (7 types)
| Type | Key | Cost | Damage | Range | Fire Rate | Special |
|------|-----|------|--------|-------|-----------|---------|
| Arrow | 1 | $25 | 10 | 3 tiles | 0.4s | Single target |
| Cannon | 2 | $60 | 40 | 2.5 tiles | 1.2s | Splash (1 tile radius) |
| Ice | 3 | $40 | 5 | 3 tiles | 0.8s | Slows 50% for 2s |
| Lightning | 4 | $80 | 25 | 3.5 tiles | 1.0s | Chains to 3 nearby enemies (60% dmg) |
| Flame* | 5 | $70 | 8/tick | 2 tiles | 0.1s | Burns all in range, DoT 3s |
| Zapper | 6 | $90 | 60 | 6 tiles | 2.0s | Long-range single target sniper |
| Tesla | 7 | $100 | 15 | 2.5 tiles | 1.5s | Burst damage to ALL enemies in range |

*Flame tower requires G Bux shop purchase (`td_flame_tower`)

- Internal key for Zapper is `sniper`; internal key for Tesla is `tesla`
- `TOWER_ORDER`: `['arrow', 'cannon', 'ice', 'lightning', 'flame', 'sniper', 'tesla']`
- Upgradable 2 levels (cost = base cost per upgrade)
- Upgrade: +50% damage, +15% range per level
- Sell refund: 75% of total invested

### Cartoon Tower Visuals
Each tower type has a unique drawn appearance via `drawCartoonTower()`:
- **Arrow:** Wooden turret with battlements and green arrow tip
- **Cannon:** Stone circular base with barrel and cannonball hole
- **Ice:** Crystal spire with inner shine and sparkles
- **Lightning:** Yellow tower with metal rod and bolt shape on top
- **Flame:** Stone brazier with animated flickering flames
- **Zapper:** Tall dark purple tower with crosshair/scope on top
- **Tesla:** Metal base with coil rings and pulsing electric spark

## Enemies (4 types)
| Type | HP | Speed | Gold | Visual |
|------|----|-------|------|--------|
| Basic | 40 | 1.4 | $7 | Brown blob/slime with googly eyes |
| Fast | 25 | 2.8 | $9 | Small blue bug with antennae |
| Armored | 120 | 0.85 | $13 | Grey turtle with shell + angry red eyes |
| Boss | 400 | 0.6 | $40 | Large red monster with horns and teeth |

- HP scales: `base * (1 + wave * 0.35) * mapHpMultiplier`
- Gold scales: `base * (1 + wave * 0.03)`
- All enemies drawn via `drawCartoonEnemy()` with unique character art, googly eyes, HP bars

## Wave System
- Waves 1-5: Basic only (8 to 18 count, formula: `8 + (w-1) * 2.5`)
- Waves 6-10: Basic + Fast (16 to 32 count, 1-in-3 are Fast)
- Waves 11-15: Basic + Fast + Armored (21 to 37 count, more armored)
- Waves 16-29: All types mixed (26 to 78 count, heavier)
- Boss waves 10, 20, 30: 3/4/6 bosses + 10/16/22 escorts (alternating fast/armored)
- 0.45s spawn delay between enemies

## Economy
- Start: $100 (or $200 with War Bonds shop unlock)
- Kill gold from enemies (scaled per wave)
- Wave clear bonus: $5 + wave (if no leaks that wave)
- Interest: 3% of gold (max $15) at wave start

## Lives & Scoring
- 20 lives. Enemy leak = -1 life, boss leak = -3 lives
- Score = kills * 10 + waves_completed * 50 + remaining_lives * 20 (on victory)
- Game over at 0 lives. Victory at wave 30 complete.

## Achievements (10, 185G)
| ID | Name | Reward | Condition |
|----|------|--------|-----------|
| td_first_blood | First Blood | 5G | Kill first enemy |
| td_wave_5 | Getting Started | 10G | Complete wave 5 |
| td_wave_10 | Holding Strong | 15G | Complete wave 10 |
| td_wave_20 | Veteran Defender | 25G | Complete wave 20 |
| td_all_towers | Arsenal | 10G | Build all 4 base tower types in one game |
| td_max_upgrade | Fully Loaded | 15G | Fully upgrade any tower |
| td_rich | War Chest | 10G | Have 500+ gold at once |
| td_no_leaks_10 | Impenetrable | 25G | Reach wave 10 with 20 lives |
| td_speed_demon | Speed Demon | 20G | Complete wave 15+ on 2x speed |
| td_victory | Supreme Commander | 50G | Beat wave 30 |

## G Bux Shop Items
| ID | Cost | Effect |
|----|------|--------|
| td_flame_tower | 75G | Unlocks 5th tower type (Flame) |
| td_double_gold | 50G | Start each game with $200 |
