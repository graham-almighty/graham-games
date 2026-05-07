# School Sim -- `school-sim/index.html`

## Overview
3D school crafting simulator. The player explores a classroom, collects school supplies, places two items on a crafting desk, and combines them into weird stronger tools.

## Core Systems
- **Renderer:** Three.js r128 WebGL, single HTML file
- **Controls:** WASD movement, mouse look after starting, E interact, C craft at the desk, 1-6 select inventory slot
- **World:** One classroom with desks, lockers, whiteboard, supply shelves, windows, floor tiles, and a dedicated crafting desk
- **Items:** Eraser, Electric Screwdriver, Marker, Glue Stick, Ruler, Lunch Tray, Paper Stack, Calculator
- **Crafting desk:** Two selected base items can be placed on the desk and crafted into a new item
- **Recipes:** Mega Eraser, Homework Blaster, Hall Pass Glider, Sticky Ruler, Lunch Shield
- **Quests:** Classroom goals guide the player through collecting, crafting, and testing crafted items
- **Currency:** Stars stored in `school-sim-save`
- **Cross-game:** Uses `graham-games-data` achievements via `ggUnlockAchievement`

## Recipes
| Inputs | Output | Stars |
|--------|--------|-------|
| Eraser + Electric Screwdriver | Mega Eraser | 15 |
| Marker + Glue Stick | Homework Blaster | 12 |
| Ruler + Paper Stack | Hall Pass Glider | 18 |
| Glue Stick + Ruler | Sticky Ruler | 10 |
| Lunch Tray + Calculator | Lunch Shield | 20 |

## Save Data
**localStorage key:** `school-sim-save`

```javascript
{
  stars: number,
  crafted: { [id]: true },
  collected: { [id]: true },
  usedCrafts: { [id]: true },
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
| sch_star_student | Star Student | 25G | Earn 50 stars |
| sch_combo_two | Desk Combo | 20G | Craft two items in one run |
| sch_clean_board | Board Cleaner | 30G | Use Mega Eraser on the board |
