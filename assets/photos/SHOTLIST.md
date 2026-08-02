# Photo shot list — Case One: Widow's Point

Drop finished masters in this folder using the exact filenames. One high-res
master per photo (~1500–2000px on the long edge, JPG fine); the zoom "closer"
crops get cut from the masters by script — just make sure the required text
is sharp enough to survive a 3× crop.

**⚠️ Doctrine (see AGENTS.md):** the REQUIRED TEXT lines are puzzle clues and
must be exactly as written. The MUST-NOT items are anti-leak rules — a stray
visible date or extra cipher pair breaks a gate's difficulty.

Look: all six should feel like one camera roll (slightly imperfect phone
photos, coastal Pacific-Northwest light) — except the strip and the chart,
which are photos OF old paper.

---

## 1. `ph-wallpaper.jpg` — the fair photo strip  *(also the lock screen)*
Photo-booth souvenir strip, rescanned/rephotographed: two girls (~10 and ~13),
sunburnt, mid-laugh, sharing cotton candy at a county fair. The older one
looks at the younger one, not the camera.
- REQUIRED TEXT, tiny, along the strip's bottom edge:
  `© BRENNAN CO. FAIR — SOUVENIR STRIP — 2008`
  Must be illegible at a glance, crisp when zoomed 3×. This is the lock-screen
  passcode clue.
- MUST NOT: any other date or year anywhere; no readable location besides the fair name.
- DIY note: easiest to fabricate — any suitable photo laid out as a 3-frame
  booth strip with the print line added, then photographed at a slight angle.

## 2. `ph-ozzy.jpg` — the bird
A sky-blue budgie standing on a curtain rod, posture of a building inspector
who has found several violations. Warm indoor light, slightly grainy.
- REQUIRED TEXT: none.
- MUST NOT: any visible date, calendar, or text at all. (The bird's name and
  the year that pairs with it live on other surfaces — that's the puzzle.)

## 3. `ph-chart.jpg` — the torn cipher chart  *(best made by hand)*
A torn HALF-page of old paper photographed lying on carpet. Crayon title in a
kid's hand, pencil list below, lower edge torn and scorched like someone
tried to retire it.
- REQUIRED TEXT:
  - Crayon: `THE GAME — RULE 1: never write the real thing.`
  - Pencil, two-column: `A—Z`  `B—Y`  `C—X` … and NOTHING after the C pair —
    the tear/burn eats the rest mid-list.
- MUST NOT: a fourth pair even partially legible; any name signed on it.
- DIY note: ten minutes with crayon, pencil, a lighter, and carpet. A real
  prop will beat anything generated.

## 4. `ph-flyer.jpg` — Eli's memorial
A photocopied memorial flyer taped INSIDE a window, shot from the street with
faint glass reflection; candle stubs on the sill below. Flyer photo: a young
man in orange rain gear laughing into the wind on a boat deck.
- REQUIRED TEXT, one line under the photo (legible zoomed — this is the
  tidewater-password source):
  `ELI SOTO · 1991–2025 · CREW, F/V DORA MAE`
  and smaller beneath: `"the water doesn't forgive." · PORT BRENNAN SEAMEN'S HALL`
- MUST NOT: any other boat name or second date range.

## 5. `ph-ferry.jpg` — the timetable board
A dockside printed timetable board photographed at an angle with glare, like
a photo taken fast so nobody notices.
- REQUIRED TEXT:
  - Header: `NORTH LINE`
  - Stops line: `Port Brennan · Tessley · Kestrel Bay · Ardenwall`
  - A schedule column where the first sailing `5:40 AM` is circled twice in
    ballpoint, hard enough to dent the paper.
- MUST NOT: a map, or any distance/duration figures that would single out one
  town. (The triangulation needs the florist email + postmark to close.)

## 6. `ph-overlook.jpg` — Widow's Point
Grey water a long way down, shot from a guardrail at dusk. No horizon, no
people, no color. The kind of photo nobody takes for fun.
- REQUIRED TEXT: none.
- MUST NOT: people, cars, signs.

---

## Optional batch B — camera-roll noise (any count, no rules)
For the difficulty pass: mundane filler so the evidence hides. Coffee, plants
on a windowsill, a harbor at lunch, a blurry cat that isn't hers, a sunset
like everyone's sunset, mom asleep in an armchair, a cracked phone screen
someone else's. No text constraints — just nothing that contradicts the
timeline (no snow, no palm trees, no visible dates after Oct 11).

---

# Generation prompts v2 — TEXT-FREE bases (paste-ready)

All text, handwriting, and pen marks get composited in post from the exact
strings above — do NOT let the generator attempt any lettering. Each prompt
reserves a clean BLANK ZONE where the type will land; when picking takes,
check the blank zone is truly empty and roughly flat/undistorted.

Style preamble for #2, #4, #5, #6 — prepend to each, same model + settings
for all four (one camera roll):

> Candid iPhone photo, photorealistic, coastal Pacific Northwest, overcast
> marine light, muted colors, slightly imperfect framing, mild grain, no
> watermark, no text anywhere.

## 1 · ph-wallpaper.jpg  (tall portrait, e.g. 9:16)
> A scanned photo-booth souvenir strip from a 2000s county fair: three
> stacked flash-lit frames on slightly yellowed glossy paper with a wide
> plain white border, the bottom border noticeably taller and completely
> blank. Two sisters, about 10 and 13, sunburnt and mid-laugh, sharing pink
> cotton candy; in the last frame the older girl looks at the younger one
> instead of the camera. Slight scan glare. No text, dates, or logos
> anywhere on the strip.

BLANK ZONE: the tall bottom border → I print the © fair line there, tiny.

## 2 · ph-ozzy.jpg  (3:4) — no text needed, unchanged
> [style preamble] A sky-blue budgie parakeet perched on a curtain rod near
> the ceiling of an ordinary apartment, looking down at the camera with the
> stern posture of a building inspector. Warm late-afternoon window light,
> soft focus. No letters, numbers, screens, or calendars anywhere in frame.

## 3 · ph-chart.jpg  (3:4)
> Overhead phone photo of a torn half-sheet of aged, slightly yellowed
> lined notebook paper lying on beige carpet. The page is completely blank
> — nothing written on it. Its lower edge is torn away and scorched
> brown-black, as if the bottom half burned off. Soft window light, slight
> shadow of the phone over one corner, realistic paper fibers and carpet
> texture.

BLANK ZONE: the whole page → I add the crayon title and the three pencil
pairs in handwriting faces, textured to sit in the paper.

## 4 · ph-flyer.jpg  (3:4)
> [style preamble] Street-level photo through a shop window: a photocopied
> flyer taped inside the glass with a faint reflection of the street on the
> glass, two burned-down candle stubs on the windowsill below. The flyer is
> mostly filled by a black-and-white photocopied photo of a young fisherman
> in orange rain-gear overalls laughing into the wind on a boat deck; below
> the photo the flyer's lower third is blank white paper. No lettering
> anywhere on the flyer.

BLANK ZONE: the flyer's lower third → I set the ELI SOTO memorial lines in
photocopy-degraded type.

## 5 · ph-ferry.jpg  (3:4 or 4:3)
> [style preamble] A hurried photo taken at a steep angle of a plain
> printed notice behind glass in a dockside display case, a band of glare
> across the glass, the edge of a dock railing intruding into one corner.
> The paper shows only a faint empty table grid — a header band and one
> column of empty rows, all blank, no characters. Grey morning light.

BLANK ZONE: header + rows → I set NORTH LINE, the four stops, the times
column, and draw the double ballpoint circle around 5:40 AM.

## 6 · ph-overlook.jpg  (3:4) — no text needed, unchanged
> [style preamble] From a cliff overlook at dusk, shot carelessly over a
> galvanized guardrail: grey ocean a long way down, thin drizzle haze, flat
> light draining all color, no visible horizon, no people, no signs, no
> birds. Slightly tilted framing. The kind of photo nobody takes for fun.

---

Compositing (my side, once masters land in this folder): perspective-warp
the type into each blank zone, match grain/blur/color cast, then cut the
"closer" crops. Tool: sharp via scratchpad (SVG type rasterized onto the
photo), per the house playbook — no Pillow on this machine.

## 7. `ph-tcar.jpg` — the saved screenshot (Night 8; described-card until art lands)
Her own car in the marina lot at night, photographed from across the
street. Sodium light, sea as a black wall. In the car's REAR WINDOW: the
photographer's reflection — high-vis jacket, HARBOR PATROL stenciled
across the chest, face obscured. The reflection must be findable at zoom
but not obvious at a glance.
- MUST NOT: a legible face; any name tag.
