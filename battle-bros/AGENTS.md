# Battle Bros — `battle-bros/index.html`

## Overview
8-bit 2-player local fighting game with pixel-art sprites, Web Audio SFX, and a roster of 9 fighters.

## Core Systems
- **Renderer:** 2D Canvas (dual-canvas: low-res game canvas + scaled hi-res display canvas), `requestAnimationFrame` loop
- **Game canvas:** 384x216 (`GAME_W` x `GAME_H`), scaled to fill window with aspect ratio preserved
- **Display canvas:** full window width x (window height - toolbar), `imageSmoothingEnabled = false` for pixel-art look
- **Hi-res text overlay:** text queued via `queueText()` during draw, rendered at display resolution via `flushText()` on the scaled canvas (avoids blurry pixel-scaled text)
- **Font:** `Press Start 2P` for body, `Cinzel` for toolbar, `Segoe UI` for hi-res overlay text
- **Sprite system:** fighters are arrays of `[x, y, w, h, color]` rectangles, drawn per-frame with palette colors; `SPRITE_W = 32`, `SPRITE_H = 40`
- **Stage backgrounds:** pre-rendered to off-screen canvases (`stageCaches`) at init

## Controls

**Player 1:**
| Action | Key |
|--------|-----|
| Move left | A |
| Move right | D |
| Jump | W |
| Block (crouch) | S |
| Punch | E |
| Kick | Q |
| Special | H |

**Player 2:**
| Action | Key |
|--------|-----|
| Move left | Left Arrow |
| Move right | Right Arrow |
| Jump | Up Arrow |
| Block (crouch) | Down Arrow |
| Punch | / (Slash) |
| Kick | . (Period) |
| Special | L |

**Menu navigation:** W/S or Arrow Up/Down to browse, A/D or Arrow Left/Right for character grid, Enter/Space to confirm, Escape to go back.

## Physics Constants
| Constant | Value |
|----------|-------|
| GROUND_Y | 176 |
| GRAVITY | 0.15 |
| JUMP_VEL | -3.5 |
| SPRITE_W | 32 |
| SPRITE_H | 40 |
| SPECIAL_COOLDOWN | 240 frames (4s at 60fps) |

## Fighters (8 base + 1 hidden)

| ID | Name | HP | Speed | Punch DMG | Kick DMG | Special | Spec DMG | Spec Type | Catchphrase |
|----|------|----|-------|-----------|----------|---------|----------|-----------|-------------|
| blaze | Blaze | 100 | 0.8 | 8 | 12 | Fireball | 20 | projectile | "You got burned!" |
| frost | Frost | 100 | 0.9 | 7 | 10 | Ice Spike | 18 | dash (+30 extra stun) | "Ice cold, baby." |
| volt | Volt | 120 | 1.15 | 10 | 14 | Thunder Clap | 28 | aoe | "You never stood a chance!" |
| stone | Stone | 100 | 0.55 | 10 | 14 | Ground Pound | 25 | slam | "Rock solid." |
| shade | Shade | 100 | 1.1 | 7 | 11 | Shadow Step | 16 | teleport | "You never saw me coming." |
| gale | Gale | 100 | 0.95 | 6 | 10 | Tornado Kick | 19 | multihit | "Gone with the wind!" |
| fang | Fang | 100 | 0.85 | 9 | 13 | Claw Rush | 21 | dash | "The hunt is over." |
| nova | Nova | 100 | 0.8 | 8 | 11 | Star Burst | 24 | charged | "Stars aligned for me!" |
| omega | Omega | 100 | 0.85 | 8 | 12 | Omega Beam | 22 | projectile | "I am the end." |

- **Omega** is a hidden boss fighter, unlocked via G Bux shop purchase (`bb_boss_fighter`). Display name uses Greek letter: `\u03A9mega`.
- `FIGHTER_IDS` array excludes omega by default.
- Volt is the stat outlier: 120 HP (vs 100 for all others), highest speed (1.15), highest punch/kick damage.

## Special Attack Types
| Type | Behavior |
|------|----------|
| projectile | Spawns a projectile traveling at speed 1.5 in facing direction; 120 frame lifetime |
| dash | Fighter dashes 40px forward in facing direction |
| teleport | Fighter teleports behind opponent (40px past, facing reversed) |
| slam | Jump-up then slam-down animation (uses jump frames) |
| aoe | Standard melee hitbox attack |
| multihit | Standard melee hitbox attack |
| charged | Spawns a projectile (same as projectile type) |

## Combat System

### Attack Data
| Attack | Startup | Active | Recovery | Hitbox (X,Y,W,H) | Hitstun | Knockback |
|--------|---------|--------|----------|-------------------|---------|-----------|
| Punch | 6 | 8 | 10 | 20,6,16,16 | 20 | 4 |
| Kick | 10 | 8 | 14 | 22,10,20,12 | 28 | 6 |
| Special | 8 | 10 | 12 | 18,4,24,20 | 35 | 8 |

- Total attack duration = startup + active + recovery frames
- Hitbox position is relative to fighter, flipped based on facing direction
- Hurtbox: `{x+6, y+2, w: SPRITE_W-12, h: SPRITE_H-4}`

### Blocking
- Hold Down/S to block while grounded
- Blocks reduce damage to 25% (`Math.floor(dmg * 0.25)`) and apply 4px pushback
- **Specials cannot be blocked** (melee specials break through block)
- Projectiles CAN be blocked (4px pushback, no damage)

### Air Attacks
- Punch and kick can be performed while jumping (air punch / air kick)
- Special attacks cannot be used in the air

### Projectiles
- Spawned at fighter's edge, travel horizontally at speed 1.5
- Size: 8x6 pixels
- Lifetime: 120 frames
- Colors by fighter: Blaze = `#ff6600`, Frost = `#88bbff`, Omega = `#ff0000`, Nova = `#ff88cc`
- Projectile hits check against target hurtbox; blocking applies 4px pushback with no damage

### Hit Particles
- 6 particles spawned on hit at impact point
- Colors: white, yellow, orange (random)
- Particle sizes 1-3px, 15-25 frame lifetime

## Round/Match System
- **Best of 3 rounds** (first to win 2 rounds wins the match)
- **Round timer:** 60 seconds (3600 frames at 60fps)
- Round 1 has full announcement (100 frame timer); rounds 2+ transition instantly (1 frame timer)
- "ROUND N" text shown, then "FIGHT!" at 40 frames remaining in announcement
- Timer expiry awards round to fighter with more HP
- KO detected when fighter `animFrame >= 1` while in `ko` state
- P1 and P2 cannot pick the same fighter (P1's pick is locked/greyed out for P2)

### Match End Screen
- Shows winner label ("P1 WINS!" / "P2 WINS!"), winner fighter name and sprite, catchphrase, round score
- Menu options: REMATCH, CHARACTER SELECT, TITLE SCREEN
- 60-frame input delay before menu becomes interactive

## Stages (2)

| # | Name | Description |
|---|------|-------------|
| 0 | Dojo | Tan walls with horizontal detail lines, red banners with gold tassels, wooden plank floor |
| 1 | Rooftop | Night sky gradient with stars, city skyline silhouette with lit windows, concrete floor |

- Stage is randomly selected each match (`Math.floor(Math.random() * STAGES.length)`)
- Backgrounds are pre-cached to off-screen canvases at startup

## UI Flow
Title -> Character Select (P1 picks, then P2 picks) -> Fight (best of 3) -> Match End -> (Rematch / Char Select / Title)

## Animation System
Each fighter has 9 animation states with palette-colored rectangular sprite frames:
- `idle` (2 frames, speed 40), `walk` (4 frames, speed 12), `jump` (1 frame)
- `punch` (3 frames, speed 6), `kick` (3 frames, speed 7), `special` (3 frames, speed 7)
- `hit` (2 frames, speed 10), `block` (1 frame), `ko` (2 frames, speed 15)

`speed` = frames of game time per animation frame advance.

Stone's special animation is overridden with jump-frame-based slam sequence (3 frames, speed 10).

## Fighter Object Properties
```javascript
{
  charId, playerNum, def,
  x, y, vx, vy,
  hp, state, facing,
  animFrame, animTimer, stateTimer,
  hitstun, specialCooldown,
  hitThisAttack, attackPhase,
  isGrounded, specialData,
  prevPositions  // for shadow mode trail (array of {x,y})
}
```

## Saved Progress
- **localStorage key:** `bb-stats` -> `{ totalFights: N, wins: N, fighterWins: { [charId]: N } }`
- `totalFights` incremented after every match
- `wins` incremented only for P1 victories
- `fighterWins` tracks per-character P1 win counts

## Achievements (10, 210G)
| ID | Name | Reward | Condition |
|----|------|--------|-----------|
| bb_first_fight | First Bout | 5G | Complete a match |
| bb_first_win | Winner | 10G | P1 wins a match |
| bb_all_fighters | Roster Complete | 20G | Win at least once with every fighter (P1) |
| bb_perfect_round | Perfect | 25G | Win a round at full HP |
| bb_sweep | Flawless Victory | 20G | Win a match 2-0 (P1) |
| bb_10_wins | Veteran | 25G | Accumulate 10 P1 wins |
| bb_special_ko | Finishing Move | 15G | KO an opponent with a special attack |
| bb_comeback | Comeback Kid | 25G | P1 loses round 1 but wins the match |
| bb_speed_ko | Speed Demon | 15G | KO opponent within 10 seconds (600 frames) |
| bb_2p_match | Friendly Rival | 50G | Complete any match (always awarded) |

Note: `bb_first_fight` and `bb_2p_match` are both awarded at every match end. Most win-based achievements only trigger on P1 victory.

## G Bux Shop Items
| ID | Cost | Effect |
|----|------|--------|
| bb_boss_fighter | 75G | Unlocks Omega (hidden boss fighter) in character select |
| bb_shadow_mode | 50G | Adds motion trail to fighters (3 ghost images at 8%/16%/24% opacity) + scanline overlay on fight screen |

## Background Music (Web Audio API)
- **Style:** Upbeat chiptune video game music (same theme as Rogue Depths)
- **Scale:** C major pentatonic (262-660 Hz), 150 BPM, sixteenth note arpeggios
- **Instruments:** Square wave lead, triangle harmony (thirds), triangle bass, noise drums
- **Intensity:** Always intense (fighting game, no calm mode)
- **Controls:** M key toggle (no visible HUD button)
- **Hooks:** `startMatch()` starts music, match end stops music
- **Separate AudioContext** (`musicCtx`) from SFX (`audioCtx`)

## Sound Effects (Web Audio API)
| Function | Description |
|----------|-------------|
| `SFX.punch()` | Sawtooth 300Hz + square 800Hz, short |
| `SFX.kick()` | Sawtooth 180Hz + square 400Hz, slightly longer |
| `SFX.block()` | Sine 80Hz, low thud |
| `SFX.special()` | Square sweep 200Hz->1200Hz over 0.2s |
| `SFX.ko()` | Sine 60Hz + sawtooth 120Hz, 0.4s |
| `SFX.roundStart()` | 3-note ascending square chime (C5, E5, G5) |
| `SFX.victory()` | 4-note ascending square fanfare (C5, E5, G5, C6) |
| `SFX.defeat()` | 4-note descending triangle (C5, A4, F4, D4) |
| `SFX.select()` | Square 800Hz blip |
| `SFX.confirm()` | 2-note square chirp (600Hz, 900Hz) |
