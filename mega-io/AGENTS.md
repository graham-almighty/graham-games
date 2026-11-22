# Mega IO — `mega-io/index.html`

## Core Systems
- **Renderer:** 2D Canvas, `requestAnimationFrame` loop
- **Grid:** 120x120 cells, 7px per cell
- **Controls:** WASD / Arrow Keys for direction
- **Style:** Dark background, glowing colored territories and players
- **Camera:** Centered on player, scrolls with movement
- **Music:** Procedural medieval war theme (Web Audio API), toggleable via ♫ button (top-right). D minor/Dorian scale, 120 BPM, always intense. Starts on game start, stops on game end.

## Game Constants
| Constant | Value |
|----------|-------|
| GRID_W | 300 |
| GRID_H | 300 |
| CELL | 8 |
| TOTAL_CELLS | 90000 |
| MAX_LIVES | 5 |
| KILL_WIN | 12 |
| BASE_SPEED | 11 cells/sec |
| BOT_COUNT | 15 |
| SPAWN_SIZE | 3 (3x3 starting territory) |
| INVULN_TIME | 2.0s |
| GAME_TIME_LIMIT | 600s (10 minutes) |

## Game Flow
Title Screen -> Game -> Victory/Game Over -> Title/Replay

## Mechanics
- Players always move in current direction (no stopping)
- Change direction with WASD/Arrows (no 180° reverse)
- Wall bounce: reverse direction on hitting map edge
- **Territory:** colored cells owned by a player
- **Trail:** cells left behind when moving outside own territory
- **Capture:** returning to own territory with a trail triggers flood fill — trail + enclosed area become territory
- **Kill:** crossing another player's trail kills them (they respawn after 1.5s in a safe spot)
- **Spawn safety:** `isSpawnClear()` checks a 7x7 area around spawn point for existing territory/trails and minimum 15-cell distance from other players (100 attempts before fallback)
- **Self-kill:** crossing own trail = death
- **Invulnerability:** 2s after spawn (flashing visual)
- **Lives:** each player/bot gets 5 lives. At 0 lives, permanently dead and territory cleared
- **Win conditions:** get 12 kills, own 100% of the map, eliminate all bots, or have the most territory when 10-minute timer expires
- **Timer:** 10-minute countdown. When it expires, the player with the most territory wins. If tied or behind, the player loses.
- **Lose condition:** run out of lives, or not leading when timer expires

## Territory Capture Algorithm
1. Trail cells become territory
2. Flood fill from all map edges, not passing through player's territory
3. Any unvisited cell becomes player's territory (enclosed area)
4. Overwrites other players' territory if enclosed

## Players
| Index | Color | Name |
|-------|-------|------|
| 0 | #4488ff (blue) | You |
| 1 | #ff4444 (red) | Jake |
| 2 | #44cc44 (green) | Lily |
| 3 | #ffaa00 (orange) | Max |
| 4 | #cc44cc (purple) | Zoe |
| 5 | #ff6688 (pink) | Mia |
| 6 | #44dddd (teal) | Finn |
| 7 | #dddd44 (yellow) | Kai |
| 8 | #ff8844 (coral) | Luna |
| 9 | #8866ff (indigo) | Rex |
| 10 | #66ff88 (mint) | Skye |
| 11 | #ff4488 (hot pink) | James |
| 12 | #88aa44 (olive) | Bill |
| 13 | #aa88ff (lavender) | Sasha |
| 14 | #44ff44 (lime) | Noah |
| 15 | #ffdd88 (peach) | Arnold |

## Bot AI
- 15% faster than player (BASE_SPEED * 1.15)
- Each bot has a unique personality via `BOT_PERSONALITY` object
- `dirToOwnTerritory()` scans 4 directions for nearest own territory
- `dirTowardPlayer()` steers toward player 1 (for hunting bots)

### Bot Personalities
| Name | Style | maxTrail | huntPlayer | trailLook | Notes |
|------|-------|----------|------------|-----------|-------|
| Jake | Aggressive idiot | 20 | 40% | 2 | Charges you, barely looks ahead |
| Lily | Careful | 6 | 5% | 5 | Methodical, short safe grabs |
| Max | Smart | 12 | 15% | 4 | Balanced all-round player |
| Zoe | Fast & risky | 15 | 25% | 3 | Quick decisions, takes chances |
| Mia | Timid | 5 | 0% | 5 | Tiny grabs, never hunts |
| Finn | Explorer | 10 | 10% | 4 | Steady expansion |
| Kai | Chaotic | 18 | 20% | 2 | Twitchy, erratic turns |
| Luna | Safe | 8 | 5% | 5 | Precise, cautious |
| Rex | Hunter | 16 | 35% | 3 | Targets the player |
| Skye | All-rounder | 10 | 10% | 4 | Default balanced personality |
| James | Bully | 18 | 45% | 2 | Like Jake but targets Zoe & Mia |
| Bill | Conquistador | 25 | 20% | 3 | Bold, huge territory grabs |
| Sasha | Survivor | 4 | 0% | 5 | Quiet, outlasts opponents |
| Noah | Dingus | 20 | 45% | 2 | Obsessed with hunting Arnold |
| Arnold | Dingus | 20 | 45% | 2 | Obsessed with hunting Noah |

## Fullscreen
- Toggle button on title screen and in-game (top-right corner)
- Uses `document.requestFullscreen()` / `document.exitFullscreen()`

## HUD
- Territory percentage
- Kill count
- Timer (countdown from 2:00)
- Leaderboard (all 5 players sorted by territory %)

## Game Over
- **Victory** triggers on: 12 kills, 100% territory, or all bots eliminated
- **Defeat** triggers on: player runs out of lives (0 remaining)
- Shows win reason, territory %, kills, lives remaining, time

## Achievements (10, 200G)
| ID | Name | Reward | Condition |
|----|------|--------|-----------|
| mio_first_capture | First Claim | 5G | Capture territory |
| mio_10_percent | Land Grab | 10G | Own 10% of map |
| mio_25_percent | Territory Lord | 20G | Own 25% of map |
| mio_50_percent | Domination | 30G | Own 50% of map |
| mio_kill | Eliminated | 10G | Kill a bot |
| mio_5_kills | Serial Eliminator | 25G | 5 kills in one game |
| mio_survive_5min | Survivor | 15G | Survive 5 minutes |
| mio_comeback | Comeback | 20G | Capture after dying |
| mio_speed_capture | Quick Claim | 15G | 20+ cells in one trail |
| mio_champion | Champion | 50G | Most territory at timer end |

## G Bux Shop Items
| ID | Cost | Effect |
|----|------|--------|
| mio_speed_boost | 50G | Move 20% faster |
| mio_trail_shield | 75G | Trail safe for 2s after leaving territory |

## IO Bux System
- **localStorage key:** `mio-save`
- **Data shape:** `{ ioBux, ownedSkins: [id], ownedLands: [id], ownedTrails: [id], activeSkin: id, activeLand: id, activeTrail: id }`
- **Earning:** 2 per kill, 1 per territory capture, 10 for winning, territory%/10 bonus at game end

### Player Skins (8)
| ID | Name | Cost | Emoji |
|----|------|------|-------|
| default | Default | Free | (circle) |
| burger | Burger | 15 | 🍔 |
| star | Star | 10 | ⭐ |
| skull | Skull | 20 | 💀 |
| fire | Fire | 25 | 🔥 |
| diamond | Diamond | 30 | 💎 |
| alien | Alien | 20 | 👽 |
| robot | Robot | 25 | 🤖 |

### Land Skins (8)
| ID | Name | Cost | Color |
|----|------|------|-------|
| default | Default | Free | #4488ff |
| purple | Purple | 10 | #9944ff |
| neon | Neon Green | 15 | #44ff44 |
| crimson | Crimson | 15 | #ff2244 |
| gold | Gold | 20 | #ffcc00 |
| pink | Pink | 20 | #ff66aa |
| cyan | Cyan | 25 | #00ffff |
| sunset | Sunset | 30 | #ff6600 |

### Trail Effects (8)
| ID | Name | Cost | Emoji |
|----|------|------|-------|
| default | Default | Free | (none) |
| pop_tarts | Pop Tarts | 45 | Custom (pastry + frosting + sprinkles) |
| stars | Stardust | 35 | ✨ |
| flames | Flames | 50 | 🔥 |
| hearts | Hearts | 40 | 💖 |
| lightning | Lightning | 55 | ⚡ |
| rainbows | Rainbows | 60 | 🌈 |
| skulls | Skulls | 50 | 💀 |

### Market
- Accessible from title screen via MARKET button
- Buy skins/lands/trails with IO Bux, click owned items to equip
- Active skin shown as emoji on player character
- Active land changes territory and trail color
- Active trail shows emoji on each trail cell behind player

## Sound Effects
| SFX | Description |
|-----|-------------|
| capture | Ascending sine (territory captured) |
| kill | Descending sawtooth (player killed) |
