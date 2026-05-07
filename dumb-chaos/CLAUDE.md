# Dumb Chaos -- `dumb-chaos/index.html`

## Overview
3D first-person goofy arena shooter. The player uses joke weapons to defeat Chaos Bots and named rival-player avatars for Chaos Coins, then spends coins on weapons and upgrades.

## Core Systems
- **Renderer:** Three.js r128 WebGL, single HTML file
- **Controls:** WASD movement relative to current mouse/camera facing, Space jump, mouse look with vertical aim, click fire, 1-5 weapon select, R shop
- **People style:** Mini Life-inspired blocky characters with box legs/torso/arms, sphere heads, hair styles, outfits, eyes, shoes, and name tags. Hands are intentionally omitted.
- **Customization:** Title-screen Custom Look + Weapon Select panel saves skin, hair color, hair style, paid outfits, and selected owned weapon; Chaos Twin rivals can spawn using the saved look.
- **Preview:** Custom Look + Weapon Select uses a live Three.js 360-degree character preview built with the same `buildMiniLifePerson()` geometry used in-game.
- **Hair:** Buzz cut is rendered as tiny hair dots on top of the head. Long hair uses a cap plus a back hair panel behind the head.
- **Animation:** Enemy characters swing legs/arms while walking; the first-person weapon bobs while moving and recoils on fire.
- **Visible weapon:** Current weapon is attached to the camera as a first-person model with no visible hands.
- **GG Merch:** GG Merch outfit uses canvas texture text: the actual shirt says "GG" on the front and back.
- **Enemy weapons:** Enemies visibly carry random goofy weapons and fire matching projectiles at the player or nearby NPCs.
- **NPC targeting:** NPCs choose the closest visible target from the player or other NPCs, so arena fights break out without every enemy focusing only on the player.
- **Unique names:** Active enemies never share the same visible name. Duplicates get numbered while active, and names are released when an enemy leaves the arena.
- **Map:** Arena is a big house with large rooms, ceiling-height interior/exterior walls, properly sized visible door frames/doors that fill 4-unit wall openings, room furniture, goofy room props, a raised play room floor, an upper hallway loft, and a high roof/ceiling.
- **Cover:** House walls and furniture cover structures block line of sight, catch projectiles, and have simple collision so players/NPCs can hide behind them. Non-furniture junk obstacles are not spawned in the house map.
- **Climbable props:** Smaller goofy props are climbable; big cover blocks have visible ladders that lift the player to the top, and house stairs connect the different floor heights.
- **Rubber chicken projectile:** Rubber Chicken Slapper projectile is shaped like a small chicken with body, neck, head, beak, comb, and tail.
- **Toilet projectile:** Poo & Pee Toilet Cannon alternates between yellow pee stream shots and brown poo lump shots.
- **Cat cannon projectile:** Bouncy Ball Cat Cannon fires a spherical cat ball with ears and pupils, no ring/tail, randomized colors, and infinite lifetime/range until it hits something or reaches its third bounce. The first-person weapon preview shows the next cat color before the player fires.
- **Hitboxes:** Projectile hits use full player/NPC body height and width instead of only checking distance to the character base point.
- **Health bars:** Every enemy gets a sprite health bar above the name tag, color-shifting from green to yellow to red.
- **Eyes:** Characters use pupil-only black dot eyes with no whites; the Custom Look + Weapon Select panel includes a "YOU" preview with pupils.
- **Currency:** Chaos Coins stored in `dumb-chaos-save`
- **Respawn:** Restores HP and moves player to spawn with no Chaos Coin penalty
- **Countdowns:** Pressing Create Chaos starts a 10-second countdown before bots spawn and fighting begins. When knocked out, the player waits through a 10-second countdown before respawning.
- **Cross-game:** Uses `graham-games-data` achievements via `ggUnlockAchievement`
- **Game flow:** Title -> Arena -> Shop/Respawn loop

## Controls
| Key | Action |
|-----|--------|
| W | Move forwards |
| A | Move left |
| S | Move backwards |
| D | Move right |
| Space | Jump |
| Mouse | Look around |
| Click | Fire current weapon |
| 1-5 | Select owned weapon |
| R | Open Goofy Shop |

## Weapons
| ID | Name | Cost | Damage | Cooldown | Splash |
|----|------|------|--------|----------|--------|
| pineapple | Pineapple Launcher | 0 | 38 | 0.7s | 3.1 |
| rubber | Rubber Chicken Slapper | 60 | 12 | 0.25s | 0 |
| waffle | Waffle Mine Tosser | 90 | 65 | 1.1s | 4.2 |
| toilet | Poo & Pee Toilet Cannon | 40 | 24 | 0.55s | 1.8 |
| catball | Bouncy Ball Cat Cannon | 1250 | 72 | 1.0s | 3.8 |

Purchasable Chaos Coin items are priced at 5x the original launch values.

## Paid Outfits
| Outfit | Cost |
|--------|------|
| Casual Blue | 150 |
| Sporty Red | 175 |
| Forest Green | 175 |
| Pink Pop | 200 |
| Golden Drip | 275 |
| GG Merch | 200 |
| Pizza Pajamas | 190 |
| Cosmic Hoodie | 240 |
| Slime Suit | 225 |
| Cardboard Hero | 160 |
| Neon Zebra | 300 |
| Royal Purple | 325 |

Existing and new saves start with Casual Blue owned so the player always has one outfit equipped. Other outfits must be bought with Chaos Coins before equipping.

## Hats
| Hat | Cost |
|-----|------|
| No Hat | 0 |
| Traffic Cone | 50 |
| Bucket Hat | 70 |
| Tiny Crown | 125 |
| Propeller Cap | 110 |

Hats are bought with Chaos Coins in the Custom Look + Weapon Select panel. Bucket Hat uses bucket body/rim/handle geometry; Tiny Crown uses a detailed band, points, and jewels. Enemies can spawn with random hats; Boss uses Tiny Crown.

## Upgrades
| ID | Cost | Effect |
|----|------|--------|
| speedShoes | 450 | Higher move speed |
| biggerBooms | 700 | Splash weapons get wider explosions |
| helmet | 600 | Reduces incoming damage |
| coinMagnet | 800 | Extra Chaos Coins per splat |
| springyPants | 550 | Higher jumps |
| snackTax | 650 | Extra Chaos Coins per splat |
| bubbleWrap | 725 | Further incoming damage reduction |
| sockCannonGrease | 500 | Slightly faster player weapon reloads |

## G Bux Shop Items
| ID | Cost | Effect |
|----|------|--------|
| dc_fast_reload | 50G | 18% faster weapon cooldowns |
| dc_confetti_blast | 75G | Larger splash radius |
| dc_chaos_socks | 50G | 15% move speed bonus |
| dc_bucket_armor | 75G | Start with 125 HP |

## Save Data
**localStorage key:** `dumb-chaos-save`

```javascript
{
  coins: number,
  totalCoins: number,
  totalKills: number,
  botKills: number,
  playerKills: number,
  bestStreak: number,
  ownedWeapons: { [id]: true },
  ownedOutfits: { [index]: true },
  ownedHats: { [id]: true },
  upgrades: { [id]: true },
  equipped: string,
  bossKills: number,
  appearance: { skin, hair, hairStyle, outfit }
}
```

## Achievements (10, 210G)
| ID | Name | Reward | Condition |
|----|------|--------|-----------|
| dc_first_splat | First Splat | 5G | Defeat any enemy |
| dc_bot_bonker | Bot Bonker | 10G | Defeat 10 bots |
| dc_player_prank | Player Prankster | 15G | Defeat 3 rival-player avatars |
| dc_pineapple_party | Pineapple Party | 15G | Get 8 splats in a match with the pineapple launcher |
| dc_shop_goof | Shop Goof | 10G | Buy any weapon or upgrade |
| dc_streak_5 | Five Alarm Chaos | 20G | Reach a 5-splat streak |
| dc_big_money | Coin Gobbler | 20G | Earn 500 total Chaos Coins |
| dc_all_weapons | Full Dumb Arsenal | 30G | Own all weapons |
| dc_boss_splat | Big Dummy Down | 35G | Defeat Big Dummy |
| dc_chaos_king | Chaos King | 50G | Reach 100 total splats |
