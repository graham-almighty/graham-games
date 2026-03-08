# Ancient Warfare — `ancient-warfare/index.html`

## Core Systems
- **Renderer:** Three.js r128, single `<script>` tag, CDN loaded
- **Camera:** RTS perspective (~45 degree angle), right-drag orbit, scroll zoom, WASD pan
- **Battlefield:** 40x30 green plane with decorative rocks and trees
- **Teams:** Blue (player, #4488ff) vs Red (AI, #ff4444)
- **Shadow maps, 3-light setup** (ambient + directional + hemisphere)

## Game Flow
1. **Title Screen** -> CAMPAIGN / SANDBOX / CONTINUE CAMPAIGN / EXIT buttons
2. **Campaign: Level Select** -> Grid of 20 levels, locked/unlocked/completed states
3. **Deployment Phase** — Sidebar unit picker, click left half to place, CLEAR ALL to reset
4. **Battle Phase** — Units auto-fight. Controls: pause (Space), 2x speed (F), select unit (click), command attack (right-click enemy), possess unit (P), camera orbit/zoom/pan
5. **End Screen** — Victory/Defeat with stats, achievement checks

### Screens
`title-screen`, `level-screen`, `deploy-screen`, `battle-screen`, `end-screen`, `campaign-end-screen`

## Game Modes

### Campaign Mode
- **20 levels** with fixed enemy armies (see Level Definitions below)
- Linear unlock: completing level N unlocks level N+1
- **Persistent progress:** `aw-campaign-progress` localStorage key -> `{ unlockedLevels: N }`
- **Run save/resume:** `aw-campaign-save` localStorage key stores `{ levelIndex, gold, survivors }` between sessions
- Each level provides a `startGold` budget for deployment
- **Survivors carry over:** surviving units persist between levels with partial healing (`healPct` per level)
- **Kill gold:** gold earned from killing enemies (equal to each killed unit's cost) carries to next level
- **Victory bonus:** +50g added to `aw-stats.bonusGold` on any non-sandbox victory (permanent deployment budget increase)
- **Retry on defeat:** restores pre-battle snapshot (gold + survivors) for the same level
- **Enemy preview:** sidebar shows enemy composition during deployment
- Campaign end screen shows kill gold, total gold, heal percentage, and victory bonus

### Sandbox Mode
- **Unlimited gold** (Infinity budget), no cost display
- **Both teams controllable:** toggle between BLUE ARMY / RED ARMY placement
- Deploy zones: blue on left half (x < 0), red on right half (x > 0)
- Red deploy zone shown with red grid overlay
- **All unit types available** (no shop unlock restrictions)
- Battle starts when both sides have at least one unit
- **No stats tracking** — sandbox battles do not increment wins/battles/bonusGold
- **No achievements** — achievement checks skipped for sandbox
- End screen shows PLAY AGAIN (returns to sandbox deploy) + EXIT TO LAUNCHER

## Unit Types (5 base + 3 special)
| Type | Cost | HP | Damage | Speed | Range | Cooldown | Special |
|------|------|----|--------|-------|-------|----------|---------|
| Swordsman | 10 | 100 | 15 | 1.5 | 1.5 (melee) | 0.8s | Balanced melee fighter |
| Archer | 15 | 60 | 12 | 1.2 | 8 | 1.0s | Ranged, 5 dmg melee, retreats if < 3 |
| Spearman | 12 | 130 | 12 | 1.0 | 1.8 (melee) | 0.8s | 2x vs cavalry/elephant |
| Cavalry | 25 | 90 | 20 | 3.0 | 1.8 (melee) | 0.8s | First hit 2x (charge) |
| Catapult | 40 | 80 | 45 | 0.4 | 12 | 3.0s | Splash radius 3, targets clusters |
| War Elephant* | 50 | 300 | 30 | 0.8 | 2.0 (melee) | 0.8s | Tank, trample |
| Trebuchet | 55 | 60 | 60 | 0.3 | 15 | 4.0s | Heavy siege, splash radius 4 |
| Ballista | 30 | 70 | 35 | 0.5 | 11 | 2.0s | Precision bolt, long range, single target |

*War Elephant requires G Bux shop unlock (`aw_war_elephant`) in campaign/skirmish. Available freely in sandbox.

## Combat AI
- Each unit: find nearest enemy -> move toward -> attack when in range
- Archers maintain distance, retreat if enemy < 3 units away
- Cavalry charge bonus on first hit (2x damage), then normal
- Catapults target clusters, creep forward if out of range, splash damage
- Trebuchets behave like catapults but with larger splash (4) and slower fire (4.0s)
- Ballistas fire precision bolts (single target), advance if out of range
- Spearman 2x damage vs cavalry and elephant types
- Attack cooldowns: melee 0.8s, archer 1.0s, ballista 2.0s, catapult 3.0s, trebuchet 4.0s

## Projectile System
- **Arrows:** straight line, speed 15, single target within 2 units of impact
- **Boulders:** parabolic arc (sin curve * dist * 0.3), speed 8, splash damage within radius (3 for catapult, 4 for trebuchet)
- **Bolts:** straight line, speed 20, single target within 2 units of impact
- Splash damage formula: `baseDmg * (1 - dist / (splash + 1))`

## Possession System
- Select a blue unit during battle, then press P (or click POSSESS button)
- First-person camera at unit eye height (varies by type)
- WASD movement, mouse look (pointer lock)
- Unit auto-attacks nearby enemies while possessed
- Possessed unit model hidden from view
- Exit with P key or if unit dies
- Eye heights: cavalry 1.55, elephant 2.35, trebuchet 1.5, archer/catapult 1.3, ballista 0.8, others 1.4

## Campaign Level Definitions (20 levels)
| # | Name | Start Gold | Heal % | Enemy Composition |
|---|------|-----------|--------|-------------------|
| 1 | Border Skirmish | 150 | 50% | 7 swordsman, 3 archer |
| 2 | Forest Ambush | 130 | 50% | 5 swordsman, 6 archer, 3 spearman |
| 3 | River Defense | 120 | 50% | 6 swordsman, 5 spearman, 3 cavalry |
| 4 | The Open Plains | 110 | 40% | 5 cavalry, 6 swordsman, 4 archer |
| 5 | The Siege Lines | 110 | 40% | 3 catapult, 8 spearman, 6 swordsman |
| 6 | Mountain Pass | 100 | 40% | 8 swordsman, 5 archer, 5 spearman, 3 cavalry |
| 7 | The War Camp | 100 | 30% | 8 swordsman, 5 archer, 5 spearman, 4 cavalry, 3 catapult |
| 8 | The Burning Fields | 90 | 30% | 6 cavalry, 4 catapult, 8 swordsman, 5 spearman, 2 elephant |
| 9 | The Iron Fortress | 90 | 30% | 10 swordsman, 8 spearman, 6 archer, 4 catapult, 4 cavalry, 3 elephant |
| 10 | The Final Battle | 80 | 25% | 12 swordsman, 8 archer, 8 spearman, 6 cavalry, 5 catapult, 4 elephant |
| 11 | The Scorched March | 80 | 25% | 10 swordsman, 6 archer, 6 cavalry, 3 catapult |
| 12 | Valley of Shadows | 75 | 25% | 8 spearman, 8 archer, 5 cavalry, 4 catapult, 3 elephant |
| 13 | The Warlord's Gate | 75 | 20% | 12 swordsman, 7 spearman, 6 archer, 5 cavalry, 4 catapult, 2 elephant, 2 ballista |
| 14 | Blood River Crossing | 70 | 20% | 8 cavalry, 8 spearman, 6 swordsman, 5 archer, 4 elephant, 3 ballista |
| 15 | The Dead Marshes | 70 | 20% | 14 swordsman, 8 archer, 6 spearman, 5 catapult, 4 cavalry, 3 elephant, 1 trebuchet, 2 ballista |
| 16 | Siege of Ironhold | 65 | 15% | 10 spearman, 8 swordsman, 7 archer, 6 catapult, 5 cavalry, 4 elephant, 3 trebuchet, 2 ballista |
| 17 | The Dragon's Spine | 65 | 15% | 10 cavalry, 8 archer, 8 swordsman, 6 spearman, 4 catapult, 4 elephant, 1 trebuchet, 3 ballista |
| 18 | Empire's Last Stand | 60 | 15% | 12 swordsman, 10 spearman, 8 archer, 6 cavalry, 5 catapult, 5 elephant, 2 trebuchet, 3 ballista |
| 19 | The Obsidian Throne | 60 | 10% | 14 swordsman, 10 archer, 8 spearman, 8 cavalry, 6 catapult, 5 elephant, 3 trebuchet, 3 ballista |
| 20 | Armageddon | 50 | 10% | 16 swordsman, 12 spearman, 10 archer, 8 cavalry, 7 catapult, 7 elephant, 4 trebuchet, 4 ballista |

Levels 1-12 use only base unit types + elephants. Levels 13+ introduce ballista and trebuchet in enemy armies. Starting gold decreases and heal percentage drops as levels progress, increasing difficulty.

## Deployment Budget
- **Sandbox:** Infinite gold, no restrictions
- **Campaign:** Per-level `startGold` + cumulative `bonusGold` from `aw-stats` (earned across all modes)
- **Default (non-campaign/sandbox):** `MAX_BUDGET` (200) + `bonusGold`
- `bonusGold` increases by +50 on every non-sandbox victory (persistent in `aw-stats`)

## Battle Horn Shop Buff
- Purchased via G Bux shop (`aw_battle_horn`)
- +10% damage for blue team for first 10 seconds of battle
- `battleHornActive` flag, `battleHornTimer` countdown

## Enemy AI Army Generator (non-campaign, non-sandbox)
- Matches player's spent budget + 50
- Weighted random unit selection (swordsman 30, spearman 25, archer 20, cavalry 15, elephant 8, ballista 6, catapult 5, trebuchet 3)
- Units placed in right half of field (x > 0)
- Respects shop unlock (no elephants without `aw_war_elephant`)

## Stats Persistence
- **localStorage key:** `aw-stats` -> `{ wins: N, battles: N, bonusGold: N }`
- Incremented after each non-sandbox battle, wins and bonusGold (+50) only on victory
- `bonusGold` is a permanent deployment budget increase applied in all modes

## Campaign Persistence
- **Progress key:** `aw-campaign-progress` -> `{ unlockedLevels: N }` (1-indexed, starts at 1)
- **Run save key:** `aw-campaign-save` -> `{ levelIndex, gold, survivors: [{type, hp, maxHp}] }`
- Run save created on NEXT LEVEL, loaded on CONTINUE CAMPAIGN from title
- Cleared on campaign completion (all 20 levels beaten)

## Sound Effects (Web Audio API)
- `SFX.swordClash()`, `SFX.arrowShot()`, `SFX.arrowHit()`, `SFX.catapultLaunch()`, `SFX.catapultImpact()`
- `SFX.cavalryCharge()`, `SFX.battleHorn()`, `SFX.victory()`, `SFX.defeat()`, `SFX.place()`
- `SFX.ballistaShot()`, `SFX.ballistaHit()`

## Achievements (10, 215G)
| ID | Name | Reward | Condition |
|----|------|--------|-----------|
| aw_first_battle | First Blood | 5G | Complete a battle |
| aw_victor | Victorious | 10G | Win a battle |
| aw_flawless | Flawless Victory | 30G | Win without losing a unit |
| aw_cavalry_charge | Cavalry Charge | 15G | Win with 5+ cavalry |
| aw_archer_army | Rain of Arrows | 15G | Win with 5+ archers |
| aw_balanced | Balanced Forces | 20G | Win using all 5 base unit types |
| aw_underdog | Underdog | 25G | Win outnumbered 2:1 |
| aw_speed_demon | Blitz | 20G | Win in under 30 seconds |
| aw_commander | Commander | 25G | Win 5 battles |
| aw_warlord | Warlord | 50G | Win 10 battles |

Achievements are only checked in non-sandbox battles.

## G Bux Shop Items
| ID | Cost | Effect |
|----|------|--------|
| aw_war_elephant | 75G | Unlocks War Elephant unit type (campaign/skirmish only; always available in sandbox) |
| aw_battle_horn | 50G | +10% damage for first 10s of battle |

## Blood Effects
- **Toggle:** checkbox on title screen, persisted in `aw-blood` localStorage key (default off)
- `toggleBlood(on)` — sets `bloodEnabled` and saves to localStorage
- `spawnBlood(pos)` — creates 6-12 small red sphere particles with random velocity when a unit dies (only if enabled)
- `updateBlood(dt)` — applies gravity (9.8), ground clamping, opacity fade; removes expired particles
- `clearBlood()` — removes all blood particles from scene (called on battle start and cleanup)
- Blood spawned in `applyDamage()` when unit HP reaches 0
- `refreshBloodToggle()` called in `refreshTitleScreen()` to sync checkbox state
