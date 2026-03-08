# Devious Driving — `devious-driving/index.html`

## Core Systems
- **Renderer:** 2D Canvas, `requestAnimationFrame` loop
- **Canvas:** 832x624
- **Car dimensions:** 12x22 pixels
- **Controls:** 1-4 players (WASD, Arrows, IJKL, Numpad 8456) + CPU bots
- **3 laps** per race, ESC to quit mid-race

## Physics Constants
| Constant | Value |
|----------|-------|
| MAX_SPEED | 250 |
| ACCEL | 180 |
| BRAKE | 250 |
| FRICTION | 80 |
| TURN_SPEED | 3.2 |
| DRIFT_THRESHOLD | 120 |
| TRACK_WIDTH | 120 |
| NITRO_DURATION | 2 |
| NITRO_BOOST | 150 |
| BOMB_RADIUS | 22 |
| BOMB_RESPAWN_TIME | 5 |

## Maps (6)
| # | Name | Style |
|---|------|-------|
| 0 | Oval Speedway | Simple oval (40 waypoints) |
| 1 | Figure Eight | Crossing figure-8 (40 waypoints) |
| 2 | Seaside Circuit | Tight hairpins (15 waypoints) |
| 3 | Mountain Pass | Winding switchbacks (20 waypoints) |
| 4 | Downtown | City grid with sharp corners + wall buildings (20 waypoints) |
| 5 | Highway | Long gentle sweeps (80 waypoints) |

- Downtown has `walls` array of `{x, y, w, h}` building rectangles with collision
- Tracks defined as waypoint arrays, rendered as thick stroked paths

## Car Designs (12 unlockable)
| ID | Name | Color | Unlock |
|----|------|-------|--------|
| stock | Stock Racer | #e91e63 | Default |
| sedan | Sedan | #9e9e9e | Default |
| muscle | Muscle Car | #2962ff | Default |
| speeder | Speed Demon | #ff5722 | Win 1 race |
| hotrod | Hot Rod | #ff9800 | Win 3 races |
| rally | Rally | #4caf50 | Win on 2 maps |
| tank | Tank | #607d8b | Win 5 races |
| cop | Cop Car | #1a237e | Win on 4 maps |
| f1 | F1 | #d50000 | Win on all maps |
| monster | Monster | #8bc34a | Win 10 races |
| ghost | Ghost | #b0bec5 | Win 15 races |
| golden | Golden | #ffc107 | Win 20 races |

- Each design has unique visual rendering in `drawCarBody()`
- Players pick cars sequentially in multiplayer (P1 first, then P2, etc.)
- Picked cars greyed out for subsequent players
- P1's choice saved as `equippedCar` in stats

## UI Flow
Title -> Map Select -> Mode Select (1-4 players) -> Bot Select -> Car Select (per player) -> Race -> Results

## Saved Progress
- **localStorage key:** `dd-stats` -> `{ wins: N, mapWins: {}, equippedCar: 'stock' }`
- Car unlocks computed dynamically from stats (win count + map completion)

## Lap Tracking
- `nearestWaypoint()` finds closest waypoint by distance
- Waypoint index advances only if nearest is +1 or +2 from current
- Lap counted when `wayIdx <= 1 && prevWayIdx >= wp.length - 3` (handles fast cars skipping wp 0)

## Power-Up System
- 3 power-ups: Bomb (47%), Nitro (48%), Swap/Teleport (5%)
- **Quick tap brake** (< 0.2s press+release) to activate power-up; **hold brake** to reverse normally
- `usePowerUp()` always consumes the power-up (no return value)
- **Bomb:** instant explosion directly behind car. Any car in blast radius (BOMB_RADIUS=22) is destroyed and respawns at the explosion location after 5 seconds. Not a mine — explodes immediately.
- **Nitro:** 2-second speed boost (MAX_SPEED + 150)
- **Swap (teleport):** swaps position with the leader. If no one is ahead (already in 1st), the power-up is wasted/consumed but nothing happens.
- Destroyed cars: `car.destroyed = true`, `car.respawnTimer` counts down, car is invisible and skips all updates/collisions during respawn

## Background Music
- Web Audio API synthesized racing jingle (bass + lead + hi-hat, 140 BPM)
- `startBGM()` called at countdown start, `stopBGM()` on race end/quit
- Loops indefinitely via scheduled oscillator/buffer patterns

## AI
- Follows track centerline with look-ahead targeting
- Brakes for upcoming sharp turns proportional to speed
- Corrects toward center when drifting off-track
- AI uses power-ups independently via `shouldAIUsePowerUp()` (random chance per type)
- AI won't use swap if already in 1st place
- AI won't use swap if already in 1st place

## Achievements (8, 175G)
| ID | Name | Reward | Condition |
|----|------|--------|-----------|
| dd_first_race | Learner's Permit | 5G | Complete a race |
| dd_first_win | Checkered Flag | 10G | Win a race |
| dd_all_maps | World Tour | 25G | Win on all 6 maps |
| dd_no_walls | Clean Driver | 20G | Win with 0 wall hits |
| dd_drift_king | Drift King | 15G | 5+ seconds drifting in a race |
| dd_photo_finish | Photo Finish | 20G | Win by < 1 second |
| dd_unbeatable | Unbeatable | 30G | Win 10 races |
| dd_human_victor | Rivalry | 50G | Win a 2+ player race |

## G Bux Shop Items
| ID | Cost | Effect |
|----|------|--------|
| dd_turbo_start | 50G | Timed boost at race start (hit Space at GO) |
| dd_monster_truck | 75G | Bigger car with more knockback |
