# Rogue Depths -- `rogue-depths/index.html`

## Core Systems
- **Renderer:** 2D Canvas, `requestAnimationFrame` loop
- **Canvas:** 800x608 (25x19 viewport tiles at 32px each)
- **Map size:** 30x30 tiles
- **Controls:** WASD/Arrows for movement (mouse-relative: W=forward toward cursor, A/D=strafe), mouse aim, left-click to attack
- **Style:** Cartoon rendering with outlined sprites, shadows, and gradient shading
- **Camera:** Player-centered, clamped to map bounds
- **Fog of war:** 5-tile sight radius + full room reveal on entry

## Game Constants
| Constant | Value |
|----------|-------|
| TILE | 32 |
| MAP_W | 30 |
| MAP_H | 30 |
| VIEWPORT_TILES_X | 25 |
| VIEWPORT_TILES_Y | 19 |
| CANVAS_W | 800 |
| CANVAS_H | 608 |
| MAX_FLOORS | 15 |
| BOSS_FLOORS | 5, 10, 15 |

## Tile Types
| Constant | Value | Description |
|----------|-------|-------------|
| TILE_WALL | 0 | Impassable |
| TILE_FLOOR | 1 | Room interior |
| TILE_CORRIDOR | 2 | Hallway between rooms |
| TILE_STAIRS | 3 | Descend to next floor |
| TILE_CHEST | 4 | Openable treasure chest |

## UI Flow
Title -> Class Select -> Game -> (per-floor loop: Shop -> next floor) -> Death/Victory -> Class Select

## Controls (In-Game)
| Key | Action |
|-----|--------|
| WASD / Arrows | Move (mouse-relative direction) |
| Mouse aim | Face cursor |
| Left click | Attack (melee swing or ranged projectile) |
| E | Open adjacent chest / pick up item (equip weapon, use potion/armor) |
| Q | Store picked-up item in inventory (weapons, potions) |
| 1-9, 0 | Use inventory slot 1-10 (potion = consume, weapon = swap with equipped) |
| R | Drop item from selected inventory slot |
| ESC | Pause / Resume |

## Character Classes (4)
| Class | HP | Speed | Start Weapon | Color | Special | Shop Unlock |
|-------|-----|-------|-------------|-------|---------|-------------|
| Warrior | 150 | 2.5 | Sword | #4488ff | High HP, melee specialist | -- |
| Archer | 100 | 3.0 | Bow | #44bb44 | Ranged attacks, moderate HP | -- |
| Mage | 80 | 2.8 | Staff | #aa44ff | Magic projectiles, low HP | -- |
| Rogue | 90 | 3.5 | Scythe | #ff8844 | Fast, backstab bonus (1.5x from behind) | `rd_shadow_class` |

- Rogue backstab: checks dot product of enemy facing vs attack direction; if > 0.3, damage is multiplied by 1.5

## Weapon Types (6)
| Weapon | Type | Base Dmg | Range | Cooldown | Arc | Special |
|--------|------|----------|-------|----------|-----|---------|
| Sword | melee | 12 | 1.5 tiles | 0.5s | 90 | -- |
| Axe | melee | 20 | 1.3 tiles | 0.9s | 120 | High damage, slow |
| Scythe | melee | 9 | 2.8 tiles | 0.4s | 110 | Long range, fast, custom curved blade rendering |
| Spear | melee | 14 | 2.0 tiles | 0.65s | 45 | Narrow arc, medium range |
| Bow | ranged | 10 | 8 tiles | 0.6s | -- | Projectile speed 8 |
| Staff | ranged | 14 | 7 tiles | 0.8s | -- | Projectile speed 6, pierce (hits multiple enemies) |

- Melee weapons have swing animation with alternating direction
- Range is multiplied by TILE (32px) for pixel distance
- Damage is modified by rarity multiplier

## Rarity System (4 tiers)
| Rarity | Color | Damage Multiplier |
|--------|-------|-------------------|
| Common | #aaaaaa | 1.0x |
| Uncommon | #44cc44 | 1.3x |
| Rare | #4488ff | 1.6x |
| Epic | #aa44ff | 2.0x |

- Higher floors increase rarity chance: `rareBonus = floor * 2`
- Rarity roll: Epic < 2 + rareBonus*0.3, Rare < 10 + rareBonus, Uncommon < 35 + rareBonus*1.5, else Common

## Enemy Types (8)
| Type | Name | HP | Speed | Damage | Gold | Min Floor | Radius | AI | Atk CD | Special |
|------|------|----|-------|--------|------|-----------|--------|----|--------|---------|
| rat | Rat | 15 | 2.5 | 5 | 3 | 1 | 6 | chase | 1.0s | -- |
| skeleton | Skeleton | 30 | 1.5 | 10 | 5 | 1 | 8 | chase | 1.2s | -- |
| bat | Bat | 20 | 3.0 | 7 | 4 | 2 | 5 | zigzag | 0.8s | Perpendicular movement |
| slime | Slime | 60 | 0.8 | 8 | 6 | 3 | 10 | chase | 1.5s | Splits into 2 smaller slimes on death |
| goblinArcher | Goblin Archer | 25 | 1.2 | 12 | 7 | 4 | 7 | ranged | 1.8s | Range 6, shoots projectiles |
| darkKnight | Dark Knight | 100 | 0.7 | 20 | 12 | 7 | 10 | chase | 1.4s | High HP tank |
| wraith | Wraith | 40 | 1.8 | 15 | 10 | 9 | 8 | phase | 1.0s | Ignores walls |
| fireImp | Fire Imp | 35 | 1.5 | 18 | 9 | 11 | 7 | ranged | 2.0s | Range 5 |

- HP scales per floor: `base * (1 + (floor-1) * 0.15)`
- Damage scales per floor: `base * (1 + (floor-1) * 0.1)`
- Enemy count per floor: `8 + floor * 1.5`
- Slime splits: 2 children with 30% HP, 60% damage, 130% speed, 60% radius
- Enemies only activate when their tile is revealed (fog of war)

## Enemy AI Types
| AI | Behavior |
|----|----------|
| chase | Move directly toward player, melee attack |
| zigzag | Chase with perpendicular oscillation (0.5s period), melee attack |
| ranged | Keep distance (retreat if < 3 tiles, approach if > range), shoot projectiles with LOS check |
| phase | Move toward player ignoring walls, melee attack |
| boss | Special per-boss behavior |

## Boss Enemies (3)
| Boss | Floor | HP | Speed | Damage | Gold | Radius | Ability |
|------|-------|----|-------|--------|------|--------|---------|
| Spider Queen | 5 | 400 | 1.0 | 15 | 50 | 16 | Spawns 2 spiderlings every 4s |
| The Lich | 10 | 600 | 0.8 | 20 | 80 | 14 | Teleports + summons skeletons (max 4) every 5s, shoots dark bolts |
| Ancient Dragon | 15 | 1000 | 1.2 | 30 | 150 | 20 | Alternates fire breath (2s cone, DPS) and charge (1.5s, 3x speed, 1.5x damage) every 6s |

- Bosses spawn in the stairs room on boss floors
- Stairs tile appears after boss is killed
- Boss floors: 5, 10, 15
- Bosses always drop a weapon (rarity 1-3)
- Spiderlings: 10 HP, 4 dmg, speed 2.5, 2 gold
- Lich summons: standard skeletons (30 HP), teleports to random spot in stairs room
- Dragon fire breath: 45-degree cone, 4-tile range, DPS = damage * 0.3 per frame
- Dragon charge: 3x speed, contact damage = 1.5x base damage

## Item System

### Item Types
| Type | Pickup (E) | Store (Q) | Notes |
|------|-----------|-----------|-------|
| weapon | Equip (swaps with current, drops old on ground) | Store in inventory | Can swap from inventory with 1-5 keys |
| potion | Store in inventory | Store in inventory | Use from inventory with 1-5 keys |
| armor | Instantly apply defense bonus | -- | Defense capped at 50% |
| gold | Instantly collect | -- | -- |

### Inventory
- 20 slots (2 rows of 10), displayed as bottom HUD bar
- Keys 1-9 and 0 to use slots 1-10 (potions heal, weapons swap with equipped)
- Click any slot to use it (all 20 slots)
- R key to drop selected item on ground
- Weapons and potions can be stored; armor and gold are instant-use only
- Each item shows a short abbreviation label below the icon (e.g., SP, MP, LP, SWD, AXE, ARM)

### Potion Types
| Name | Abbrev | Heal | Weight (drop chance) |
|------|--------|------|----------------------|
| Small Potion | SP | 25 | 10 |
| Medium Potion | MP | 50 | 5 |
| Large Potion | LP | 100 | 2 |

### Armor
- Defense = `5 + random(0, min(floor, 5)) * 2` percent
- Stacks additively, capped at 50%
- Damage reduction: `actual = max(1, dmg - floor(dmg * defense / 100))`

### Loot Generation
- `generateLoot()`: 40% weapon, 35% potion, 25% armor
- Enemies: 25% chance to drop loot on death (bosses always drop)
- Chests: 1-3 items + gold (10 + random(20) + floor*3)

## Dungeon Generation
- Rooms: 4 + min(floor*0.2, 3) rooms per floor (4-7 range)
- Room size: width 4-8, height 4-7
- Rooms placed with 1-tile gap minimum, no overlap
- Minimum 3 rooms required (retries if fewer)
- Connected with L-shaped corridors (horizontal then vertical, or vice versa)
- Last room connects to first for loop connectivity

### Room Types
| Type | Assignment | Contents |
|------|-----------|----------|
| start | Always room 0 | Player spawn, no enemies |
| stairs | Furthest room from start (Manhattan distance) | Stairs tile (or boss on boss floors) |
| enemy | 60% of remaining rooms | 2-8 enemies |
| treasure | 20% of remaining rooms | Chest + 1-2 guard enemies |
| empty | 20% of remaining rooms | Nothing |

## Between-Floor Shop
- Shown after clearing each floor (except floor 15 which is victory)
- Displays current HP bar, gold, and inventory
- Two purchasable items:

| Item | Price | Effect |
|------|-------|--------|
| Small Potion | 25 gold | Restores 25 HP (added to inventory) |
| Large Potion | 50 gold | Restores 100 HP (added to inventory) |

- Cannot buy if inventory is full or can't afford
- "CONTINUE" button advances to next floor

## Player Combat
- Melee: arc-based hit detection in facing direction, range in tiles * TILE pixels
- Ranged: spawns projectile with speed and range, hits first enemy (or pierces for staff)
- Invulnerability: 0.3s after taking damage (flashing visual)
- Attack cooldown per weapon definition

## Save/Load System
- **localStorage key:** `rd-save`
- Single save slot (roguelike -- deleted on death or victory)
- Save triggered via pause menu "SAVE & QUIT"
- "CONTINUE" button on title screen if save exists

### Save Data Shape
```javascript
{
  version: 1,
  player: {
    x, y, hp, maxHp, defense, speed, className,
    color, radius, weapon: { base, rarity, type, damage, name, color },
    inventory: [item | null, ...],  // 20 slots
    attackTimer, invulnTimer, gold, floor, kills, bossKills,
    damageTakenThisBoss, facingAngle, swingTimer, swingDuration, swingDir
  },
  floorElapsed,  // seconds elapsed on current floor (rebased on load)
  dungeon: {
    tiles: [[int, ...], ...],  // 30x30
    rooms: [{ x, y, w, h, cx, cy, type, revealed }, ...],
    stairsRoomIndex, startRoomIndex,
    isBossFloor, floor
  },
  revealed: [[bool, ...], ...],  // 30x30 fog of war
  enemies: [{ type, x, y, hp, maxHp, damage, speed, radius, color, ai, ... }, ...],
  groundItems: [{ x, y, item: { type, name, ... } }, ...],
  projectiles: [{ x, y, vx, vy, damage, range, traveled, radius, color, owner, pierce, hitEnemiesIndices }, ...],
  runStats: { startTime }
}
```

## Minimap
- 120x120 pixels, top-right corner (offset 8px from edge, 40px from top)
- Shows revealed tiles, enemy dots (red, bosses yellow), player dot (white)
- Stairs shown in gold (#c9a84c)

## Sound Effects (Web Audio API)
| SFX | Description |
|-----|-------------|
| hit | Noise + low tone (enemy hit) |
| slash | Short noise burst (melee swing) |
| shoot | Descending sine tones (ranged attack) |
| pickup | Ascending sine tones (item pickup) |
| gold | High sine tones (gold collect) |
| stairs | Triangle tones (floor transition) |
| hurt | Sawtooth + noise (player damage) |
| die | Descending sawtooth (player death) |
| boss | Low square tones (boss kill) |
| victory | C-E-G ascending sine (victory) |
| potion | Ascending sine (potion use) |

## Achievements (10, 200G)
| ID | Name | Reward | Condition |
|----|------|--------|-----------|
| rd_first_blood | First Blood | 5G | Kill your first enemy |
| rd_floor_5 | Into the Deep | 10G | Reach floor 5 |
| rd_floor_10 | Almost There | 20G | Reach floor 10 |
| rd_floor_15 | Rock Bottom | 30G | Reach floor 15 |
| rd_boss_slayer | Boss Slayer | 15G | Defeat any boss |
| rd_dragon_slayer | Dragon Slayer | 50G | Defeat the Ancient Dragon |
| rd_rare_find | Rare Find | 10G | Find a rare or better weapon |
| rd_hoarder | Gold Hoarder | 15G | Collect 500+ gold in one run |
| rd_speedrun | Speed Runner | 20G | Clear a floor in under 30 seconds |
| rd_no_hit_boss | Untouchable | 25G | Beat a boss without taking damage |

## G Bux Shop Items
| ID | Cost | Effect |
|----|------|--------|
| rd_shadow_class | 75G | Unlocks the Rogue class (fast, backstab bonus) |
| rd_enchanted_start | 50G | Start each run with an uncommon weapon (rarity 1 instead of 0) |
