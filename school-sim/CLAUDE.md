# School Sim -- `school-sim/index.html`

## Overview
3D school crafting simulator. The player explores a classroom, collects school supplies, places two items on a crafting desk, and combines them into weird stronger tools.

## Core Systems
- **Renderer:** Three.js r128 WebGL, single HTML file
- **Controls:** WASD movement, mouse look after starting, E interact/open crafting table, C craft selected table recipe, Esc close crafting table, 1-6 select inventory slot
- **World:** Bigger spread-out campus layout with main and north hallway wings, a central commons gap, and separate craft classroom, library, art room, cafeteria, science room, gym, and restroom spaces, plus visible doorway frames/open doors, lockers, whiteboard, supply shelves, windows, floor tiles, classmates, and a dedicated crafting desk
- **Walls:** Adjacent rooms share single divider wall lines with door gaps, avoiding doubled-up parallel walls between side-by-side classrooms.
- **Collision:** Outer and interior walls use simple rectangle collision so players cannot walk through walls; movement resolves per axis so the player can slide along walls.
- **Items:** Eraser, Electric Screwdriver, Marker, Glue Stick, Ruler, Lunch Tray, Paper Stack, Calculator
- **Crafting desk:** Interacting with the desk opens a Minecraft-like crafting table popup with two input slots, a result slot, and supply buttons
- **Recipes:** Mega Eraser, Homework Blaster, Hall Pass Glider, Sticky Ruler, Lunch Shield
- **NPC jobs and quests:** Ms. Chalk, Mr. Mop, Coach Pop, and Book Boss each have a school job, bigger Dumb Chaos-style heads with pupil-only eyes and hair caps or panels, and request a crafted item. Active quest NPCs show a floating `!` marker instead of a name label.
- **Clothing:** Quest rewards can unlock clothing. Owned clothing appears in the hotbar and can be equipped with E when selected.
- **Restroom stall apartment:** Separate restroom room includes a stall Joey can sell for 60 candy. After purchase, the stall becomes a tiny apartment with bed/table/closet props, and the closet cycles equipped outfits.
- **Quests:** Classroom goals guide the player through collecting, crafting, testing crafted items, and finishing NPC job quests
- **Currency:** Candy stored in `school-sim-save`
- **Cross-game:** Uses `graham-games-data` achievements via `ggUnlockAchievement`

## Recipes
| Inputs | Output | Candy |
|--------|--------|-------|
| Eraser + Electric Screwdriver | Mega Eraser | 15 |
| Marker + Glue Stick | Homework Blaster | 12 |
| Ruler + Paper Stack | Hall Pass Glider | 18 |
| Glue Stick + Ruler | Sticky Ruler | 10 |
| Lunch Tray + Calculator | Lunch Shield | 20 |

## NPC Job Quests
| NPC | Job | Wants | Reward |
|-----|-----|-------|--------|
| Ms. Chalk | Teacher | Mega Eraser | 18 candy + Art Apron |
| Mr. Mop | Janitor | Sticky Ruler | 12 candy |
| Coach Pop | Gym Coach | Lunch Shield | 22 candy + Coach Jersey |
| Book Boss | Librarian | Hall Pass Glider | 20 candy + Library Cape |
| Joey | Classmate | Sells restroom stall | 60 candy cost |
| Maya, Nolan, Zoe, Amir | Classmates | Campus flavor dialogue | Free |

## Clothing
| ID | Name | Source |
|----|------|--------|
| schoolHoodie | School Hoodie | Starter outfit |
| artApron | Art Apron | Ms. Chalk quest |
| coachJersey | Coach Jersey | Coach Pop quest |
| libraryCape | Library Cape | Book Boss quest |

## Save Data
**localStorage key:** `school-sim-save`

```javascript
{
  candy: number,
  crafted: { [id]: true },
  collected: { [id]: true },
  usedCrafts: { [id]: true },
  completedQuests: { [npcId]: true },
  ownedClothes: { [id]: true },
  equippedOutfit: string,
  stallOwned: boolean,
  bestCombo: number,
  gamesPlayed: number
}
```

## Achievements (10, 200G)
| ID | Name | Reward | Condition |
|----|------|--------|-----------|
| sch_first_pickup | Supply Grabber | 5G | Pick up any supply |
| sch_first_craft | Desk Inventor | 10G | Craft any item |
| sch_mega_eraser | Mega Eraser | 15G | Craft Mega Eraser |
| sch_three_crafts | Triple Maker | 20G | Craft 3 different items |
| sch_all_supplies | Locker Loot | 20G | Collect all base supplies |
| sch_all_recipes | Craft Class Hero | 40G | Craft every recipe |
| sch_test_tool | Field Tester | 15G | Use a crafted item |
| sch_star_student | Candy Scholar | 25G | Earn 50 candy |
| sch_combo_two | Desk Combo | 20G | Craft two items in one run |
| sch_clean_board | Board Cleaner | 30G | Use Mega Eraser on the board |
