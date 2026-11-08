# Velvet Viking Strength — prototype

A usable, single-file prototype of a separate strength-training app. It follows
the Valhalla app's (`velvet-viking-valhalla-2`) structure and hierarchy rules:

- **Same tokens** — colours, radii, shadows copied from Valhalla's `:root`;
  Cinzel / Oswald / JetBrains Mono.
- **Same accent rules** — gold is the brand (wordmark, eyebrows, current item,
  selected tab); cherry only marks the button that moves you forward and
  progression (ring, rest timer, ticked sets).
- **Same screen jobs** — Today = do, This Week = manage, Program = plan,
  Training = understand, Settings = configure.
- **Same bottom nav** — Valhalla's icons and glow treatment.

The one deliberate departure from the mockup: exercises (and days, weeks,
history) are **overlapping stacked cards**, not separate rows. Tap a card to
open it; the stack below moves down.

## What works

- Today's session with 5 exercises, prefilled weights and reps
- Tick a set → rest timer starts (±15s, skip, vibrate/beep options)
- Progression: hit the top of the rep range on every set → next session adds load
- Finish → summary with new bests; session goes to Training history
- This Week: move a missed session to today; Program: 6-week block with deload
- kg / lb; everything saved on the device (localStorage)

Sample "Example" sessions are seeded so there are last-time numbers to show;
clear them in Settings.

## Run it

Open `index.html` in a browser. No build step. It is kept outside `src/` and
`public/` so the website neither builds nor deploys it; move this folder into
its own repository when the app gets one.
