# School Nurse Simulator — `school-nurse/index.html`

## Core Concept
Play as a school nurse. Students come in with ailments — some real, some faking. Examine patients, spot the fakers, and choose the right treatment. Reputation drops if you make mistakes; at 0% you're fired.

## Game Flow
Title Screen → Day Announce → Patient Encounters → Day Summary → Next Day (or Game Over)

### Screens
`title-screen`, `day-screen`, `game-screen` (with HUD + canvas + UI panel), `summary-screen`, `gameover-screen`

## Patient System
- **10 Conditions:** Stomach Ache, Headache, Scraped Knee, Twisted Ankle, Fever, Sore Throat, Nausea, Allergic Reaction, Eye Irritation, Bad Cough
- **Allergic Reaction** is always real (never faked) — keeps players honest
- Each condition has real and fake variants with distinct complaints and exam results
- Fake complaints tagged by difficulty: `easy`, `medium`, `hard`

### Patient Generation
`generatePatient(isFaker, difficulty)` → returns patient object with:
- Appearance: name, gender, grade, skinTone, hairColor, hairStyle, shirtColor
- Medical: condition, complaint, faking (bool), examResults, correctTreatment, conditionEffect
- Faker info: fakeReason (null if real)

### Day Scaling
| Days | Patients | Fakers | Difficulty |
|------|----------|--------|------------|
| 1-2 | 3 | 1 | easy |
| 3-4 | 4 | 2 | medium |
| 5-6 | 5 | 2 | medium |
| 7+ | 5 | 2-3 | hard |

## Examination System
4 exam types per patient, player can use up to 3:
1. **Take Temperature** — thermometer reading (real sick kids have elevated temps)
2. **Physical Check** — context-dependent label per condition (e.g. "Press on Stomach", "Check the Ankle")
3. **Observe Behavior** — watch how they act (energy level, consistency, tells)
4. **Ask Questions** — reveals context clues (test avoidance, story inconsistencies)

Each exam reveals a clue in the "Nurse's Notes" panel.

## Treatments (8 options)
| ID | Name | Used For |
|----|------|----------|
| bandage | Band-Aid & Clean | Scrapes, cuts |
| icePack | Ice Pack | Sprains, swelling |
| medicine | Pain Reliever | Headaches, stomach aches |
| rest | Rest + Call Parents | Fever, nausea |
| lozenge | Warm Drink & Lozenge | Sore throat, cough |
| allergyMed | Allergy Medicine | Allergic reactions |
| eyeWash | Eye Wash Station | Eye irritation |
| sendBack | Send Back to Class | Calling out fakers |

## Scoring & Reputation
| Action | Score | Reputation |
|--------|-------|------------|
| Correct treatment (real) | +100 | +10 |
| Caught faker (sendBack) | +150 | +15 |
| Wrong treatment (real) | -25 | -5 |
| Treated a faker | -50 | -10 |
| Sent real kid back | -100 | -20 |
| Missed allergic reaction | -100 | -30 |

- Reputation: 0-100, starts at 60
- Displayed as a gradient progress bar in HUD
- Game over at 0 reputation

## Visual System
- **Canvas** (400×320): Nurse's office scene with mint green walls, checkered floor, exam table, medical cabinet with colored bottles, window with curtains, "WASH YOUR HANDS" poster, clock, desk
- **Student characters** drawn on exam table with: skin tone, hair (5 styles), shirt color, facial expressions
- **Condition effects**: pale/green face (nausea), flushed face + cheek blush (fever), red hives (allergic), red eye, visible scrape, swollen ankle
- **Speech bubble** with word-wrapped complaint text

## Achievements (10, 250G)
| ID | Name | Reward | Condition |
|----|------|--------|-----------|
| sn_first_patient | First Patient | 10G | Treat first patient |
| sn_clean_sweep | Clean Sweep | 20G | No mistakes in a full day |
| sn_faker_buster | Faker Buster | 25G | Catch 10 fakers total |
| sn_week_survivor | Week Survivor | 20G | Complete 5 days |
| sn_perfect_week | Perfect Week | 50G | 5 days with zero mistakes |
| sn_nurse_of_year | Nurse of the Year | 30G | Reach 100% reputation |
| sn_allergy_alert | Allergy Alert | 15G | Correctly treat allergic reaction |
| sn_gut_feeling | Gut Feeling | 20G | Catch faker without any exams |
| sn_veteran_nurse | Veteran Nurse | 25G | Treat 50 patients total |
| sn_no_fakers | No Fakers Left Behind | 35G | Catch 25 fakers total |

## Stats Persistence
- **localStorage key:** `school-nurse-save` → `{ highScore, totalPatients, totalCorrect, totalFakersCaught, bestDay, gamesPlayed }`
- Stats accumulate across runs (totalPatients, totalFakersCaught)
- Title screen shows high score, best day, patients treated, fakers caught

## Theme
- Accent color: `#4caa64` (medical green)
- Dark background with green accents
- Glass-blur HUD panels
- Cinzel font for titles, Segoe UI for body
