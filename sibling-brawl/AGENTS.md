# Sibling Brawl -- `sibling-brawl/index.html`

## Overview
3D first-person sibling battle game with campaign levels, unit armies, character customization, and upgrades. Single HTML file using Three.js r128.

## Core Systems
- **Renderer:** Three.js r128 WebGL, first-person camera during battle
- **Controls:** Mouse look + WASD movement, Space to jump, click to attack
- **Style:** Dark purple theme (#1a1020), pink accents (#ff66aa)
- **Fonts:** Bangers (titles/HUD), Cinzel (UI)
- **Audio:** Web Audio API procedural SFX

## Game Constants
| Constant | Value |
|----------|-------|
| FIELD_W | 30 |
| FIELD_D | 20 |
| LANDING_DURATION | 6s |
| BOAT_SPEED | 1.8 |
| CAM_TRANS_DURATION | 1.5s |
| Player base speed | 3.5 |
| JUMP_SPEED | 6 |
| GRAVITY | 16 |
| FLAT_TOP_RADIUS | 8 |
| FLAT_TOP_Y | 2.7 |
| Pitch range | ±90° (full vertical aim) |

## Game Flow
Title -> Level Select -> Intro Cinematic -> Loadout -> Battle (FPS) -> Results

## Player Classes (5)
| Class | Icon | Damage | HP | Range | Cooldown | Type | Shop |
|-------|------|--------|----|-------|----------|------|------|
| Pillow Fighter | `*` | 15 | 100 | 2.5 | 0.8s | melee | - |
| Nerf Gunner | `*` | 12 | 70 | 10 | 1.0s | ranged | - |
| Poo Slinger | `*` | 40 | 70 | 10 | 2.5s | mortar | - |
| Cricket Launcher | `*` | 18 | 75 | 9 | 1.2s | ranged | - |
| Super Soaker | `💦` | 10 | 75 | 12 | 0.3s | ranged | sb_super_soaker |

## Unit Definitions (8 types, 7 NPC + 1 player-only)
| Unit | Cost | HP | Damage | Speed | Range | Special |
|------|------|----|--------|-------|-------|---------|
| Pillow Fighter | 10 | 100 | 15 | 1.5 | 1.5 | Basic melee |
| Nerf Gunner | 15 | 60 | 12 | 1.2 | 8 | Ranged darts, 5 melee fallback |
| Blanket Tank | 12 | 130 | 12 | 1.0 | 1.8 | antiScooter |
| Scooter Rider | 25 | 90 | 20 | 3.0 | 1.8 | Fast charge |
| Water Balloon | 40 | 80 | 45 | 0.4 | 12 | Splash 3 |
| Poo Slingshot | 35 | 70 | 40 | 0.5 | 10 | Splash 2.5 |
| Cricket Launcher | 30 | 75 | 18 | 0.6 | 9 | Bug projectiles |
| Super Soaker | 0 | 75 | 10 | 1.3 | 12 | Player-only, rapid fire water (G Bux) |

## Levels (8)
| # | Name | Theme | Special |
|---|------|-------|---------|
| 1 | The Living Room | Indoor | Standard |
| 2 | B-Day | Indoor | boatPhase, partyHats |
| 3 | Dog Poopic War I | Outdoor | poopWar, Roman enemies, Carthaginian allies |
| 4 | Dog Poopic War II | Outdoor | poopWar, Roman enemies, Carthaginian allies |
| 5 | Dog Poopic War III | Outdoor | poopWar, Roman enemies, Carthaginian allies |
| 6 | Cricket's Charge | Outdoor | cricketCharge, Union allies, Confederate enemies |
| 7 | Medium Flat Top | Outdoor | flatTop, Union allies, Confederate enemies |
| 8 | Siege of Toys | Outdoor | siegeOfToys, Greek allies, Roman enemies, destructible walls |

### Level Army Compositions (LEVEL_ARMIES)
| Level | Army |
|-------|------|
| Default (1-2) | 6 pillow, 3 nerf, 3 blanket, 2 scooter, 1 balloon |
| 3 | 5 pillow, 3 nerf, 2 blanket, 2 scooter, 2 pooSling |
| 4 | 6 pillow, 3 nerf, 3 blanket, 2 scooter, 3 pooSling, 1 balloon |
| 5 | 7 pillow, 4 nerf, 3 blanket, 3 scooter, 4 pooSling, 1 balloon |
| 6 | 4 pillow, 3 nerf, 2 blanket, 4 balloon, 5 cricket |
| 7 | 5 pillow, 4 nerf, 3 blanket, 3 balloon, 3 cricket, 3 scooter |
| 8 | 5 pillow, 5 nerf, 3 blanket, 4 balloon, 3 cricket, 2 scooter |

## Upgrades (6 types, candy currency, scaling costs)
Cost formula: `baseCost * (1 + level * 0.4)` — each level costs more.

| Upgrade | Per Level | Max | Base Cost |
|---------|-----------|-----|-----------|
| HP (Toughness) | +20 HP | 10 | 30 candy |
| Damage (Power) | +3 damage | 10 | 40 candy |
| Speed | +0.3 speed | 10 | 35 candy |
| Fire Rate | -10% cooldown | 10 | 45 candy |
| Range (Reach) | +10% range | 10 | 40 candy |
| Splash (Blast Radius) | +15% splash | 6 | 60 candy |

## Outfits (6, unlock by beating levels)
| ID | Name | Unlock | Description |
|----|------|--------|-------------|
| none | None | Always | No outfit |
| roman | Roman | Beat Lv3 | Galea helmet, lorica segmentata, scutum shield |
| carthaginian | Carthaginian | Beat Lv3 | Bronze helmet, leather cuirass, round shield |
| union | Union | Beat Lv6 | Navy kepi, brass-buttoned coat |
| confederate | Confederate | Beat Lv6 | Slouch hat, butternut coat |
| greek | Greek | Beat Lv8 | Corinthian helmet, bronze cuirass, hoplon shield |

## Character Customization
- **Hair color:** Color picker (default: #8B4513)
- **Shirt color:** Color picker (default: #4488ff)
- **Skin color:** Color picker (default: #ffcc99)
- **Hair style:** short (default) or long (matches mini-life style: top cap + back box)
- **Outfit:** Unlockable by clearing levels
- **Show Hat toggle:** When wearing an outfit, choose "Show Hat" (hat visible, hair hidden) or "Show Hair" (hat hidden, hair visible). Default: Show Hat. Toggle only appears when outfit != 'none'.
- **Mirror:** Real-time 3D preview (separate Three.js renderer, continuous rotation)

## Projectile Types
| Type | Speed | Splash |
|------|-------|--------|
| Dart (Nerf) | 15 | none |
| Balloon (Water) | 8 | 3 |
| Poo (Slingshot) | 7 | 2.5 |
| Cricket (Bug) | varies | none |
| Water (Soaker) | 18 | none |

## Candy Rewards
- Per kill: 5 candy
- Victory bonus: +50 candy

## Save/Load

### localStorage Keys
| Key | Description |
|-----|-------------|
| `sb-player` | Player data (class, colors, upgrades, progress) |
| `sb-stats` | Battle statistics (wins, battles) |
| `graham-games-data` | Cross-game G Bux |

### Player Data Shape
```javascript
{
  candy: number,
  playerClass: string,
  hairColor: string,
  shirtColor: string,
  skinColor: string,
  hairStyle: 'short' | 'long',
  outfit: string,
  showHat: boolean,
  upgrades: { hp, dmg, speed, firerate, range, splash },
  unlockedLevel: number,
  clearedLevels: { [id]: true }
}
```

## Intro Cinematics
Each level has narrative slides with canvas-drawn backgrounds:
- `INTRO_SLIDES` — Generic (levels 1)
- `BDAY_INTRO_SLIDES` — Level 2 (B-Day)
- `POOP_WAR_1_SLIDES` / `_2_` / `_3_` — Levels 3-5
- `CRICKET_CHARGE_SLIDES` — Level 6
- `FLAT_TOP_SLIDES` — Level 7
- `SIEGE_OF_TOYS_SLIDES` / `drawSiegeOfToysIntro` — Level 8

Slide text classes: `narration`, `small`, `dramatic`, `hero`, `villain`, `candy`

## Level Decorations
- **Indoor (Lv1-2):** Carpet, couch, walls
- **B-Day (Lv2):** Balloons, birthday banner, cake table, boats
- **Poop War (Lv3-5):** Grass field, poo landmines, fences
- **Cricket's Charge (Lv6):** Stone wall, split-rail fences, boulders
- **Medium Flat Top (Lv7):** Elevated flat-top mountain (height 2.5, radius 8), solid cone+cylinder core, dense rocky slopes (~60 columns × 7-9 rings), base boulders, sandbag fortifications, Union flag
- **Siege of Toys (Lv8):** Destructible toy block wall (HP 750/segment, colorful blocks), wall snipers (1 nerf per segment, invulnerable, die when wall crumbles), destructible castle towers at ends (HP 1200, radius 1.4, height 3.5, red body + blue cap, crack progression + 20-piece rubble), scattered toy blocks and action figures, bright sky

## SFX
| SFX | Description |
|-----|-------------|
| pillowHit | White noise lowpass 600Hz |
| nerfShot | Sine 1200->400Hz |
| splash | White noise lowpass 400Hz |
| scooterZoom | Sawtooth 150->300Hz |
| victory | Chord sweep (triangle) |
| defeat | Descending notes (sawtooth) |
| waterGun | Bandpass noise 1500Hz |
| pooLaunch | Sawtooth 80->200->60Hz |
| pooSplat | White noise lowpass 300Hz |
| cricketLaunch | Sine chirp 4000->5000->3500->4500Hz |
| wallCrumble | Low rumble noise lowpass 400Hz |

## Achievements (10, 185G)
| ID | Name | Reward | Condition |
|----|------|--------|-----------|
| sb_first_fight | First Fight | 5G | Complete any battle |
| sb_winner | Winner | 10G | Win a battle |
| sb_flawless | Untouchable | 30G | Win without damage |
| sb_pillow_army | Pillow Fort | 15G | 5+ kills in a battle |
| sb_nerf_squad | Nerf War | 15G | 10+ kills in a battle |
| sb_balanced | Mixed Tactics | 20G | Win with >= 50% HP |
| sb_underdog | Outnumbered | 25G | Win with <= 3 allies alive |
| sb_speed_win | Quick Fight | 20G | Win in < 30 seconds |
| sb_commander | Big Sibling | 25G | Win 5 total battles |
| sb_warlord | Supreme Sibling | 50G | Win 10 total battles |

## G Bux Shop Items (2, 125G)
| ID | Cost | Effect |
|----|------|--------|
| sb_super_soaker | 75G | Unlocks Super Soaker unit |
| sb_snack_boost | 50G | +10% damage for first 10s |
