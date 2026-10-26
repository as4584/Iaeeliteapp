# Design — IAE Elite

Derived from the site's own CSS tokens and imagery (CLIENT_AUDIT §1, §2). Concept:
**"The private dossier."** Black field, gold rim light, serif authority, tactical caps labels.
Nothing floats; things are *set* — ruled lines, numbered steps, hairline frames.

## Color roles
| Token | Hex | Use |
| --- | --- | --- |
| `bg` | `#0A0A0B` obsidian | App background |
| `surface` | `#141417` graphite | Grouped rows, inputs |
| `surfaceRaised` | `#1B1B20` | Pressed/selected surface |
| `line` | `#2A2D33` steel | Hairlines, input borders |
| `text` | `#F4F1EA` bone | Primary text (contrast 18:1 on bg) |
| `textMuted` | `#A2A2A8` ash | Secondary text (8.0:1) |
| `textFaint` | `#8A8A91` | Captions (5.6:1, still AA) |
| `gold` | `#D9B25E` gold-bright | Accent text, active states, primary button fill (button text is obsidian) |
| `goldDeep` | `#A67C22` | Borders, gradients, badge outline |
| `night` | `#16202E` | Secondary tint (information badge) |
| `danger` | `#E07A6A` | Validation errors only |
Never: purple/blue gradients, glass for its own sake, white backgrounds.

## Typography
- Display: **Bodoni Moda** 500/600, italic 500 for the single accent word ("*watching.*").
- Labels/overlines/buttons/badges: **Archivo** 600–800, UPPERCASE, letter-spacing 1.5–2.4.
- Body: **Manrope** 400/500/600.

| Style | Font | Size/Line |
| --- | --- | --- |
| display | Bodoni 500 | 40/44 |
| title | Bodoni 500 | 28/32 |
| heading | Bodoni 500 | 22/27 |
| overline | Archivo 700 caps | 11/14, +2.2 tracking |
| body | Manrope 400 | 16/24 |
| bodySmall | Manrope 400 | 14/20 |
| label | Archivo 700 caps | 13/16, +1.6 |
Text respects Dynamic Type with `maxFontSizeMultiplier` 1.4 on display styles.

## Space, radius, elevation
Space scale 4/8/12/16/24/32/48/64; screen gutter 20. Radius: **2** on buttons/badges/inputs
(cut, not pill), 0 on imagery, 14 only on the hero film frame. No drop shadows; depth comes
from image gradients (`bg` → transparent) and 1px gold/steel hairlines.

## Imagery
Full-bleed, edge-to-edge, bottom gradient to obsidian so type sits on image. Aspect 4:5 for
service heroes, 16:10 for rows. Faces are rarely shown — keep it. Images are "representative
of the standard"; never captioned as specific client events.

## Components & language
- **Primary button**: gold fill, obsidian Archivo caps, 52pt tall, 2px radius, trailing →.
- **Secondary**: 1px gold-deep outline, bone label. **Text link**: gold caps with underline rule.
- **Overline + numeral**: "01 / REQUEST" — numbered sequences are the brand motif (site uses 01–06).
- **Rows** not cards: services list as full-width rows separated by hairlines, thumbnail left.
- Icons: SF Symbols, thin weight, in tabs/actions only.

## Badge system
| Badge | Meaning (verified basis) | Style |
| --- | --- | --- |
| FLAGSHIP | Full engagement — "One advance team, one run-of-show, one invoice." | Gold fill, obsidian text, crown glyph ◆ |
| 24-HR READY | "Small events facilitated in as little as twenty-four hours" | Gold outline, gold text |
| LICENSED PARTNERS | Secure detail is delivered by licensed partners, not IAE | Night fill, bone text |
Rules: max one badge per item; ≤ 3 badges visible per screen; text ≥ 11pt, contrast ≥ 4.5:1;
`accessibilityLabel` reads "Badge: Flagship". Badge kinds are an enum in the schema so the
client can move them but not invent unstyled ones.

## Motion
Durations: 160 ms (press), 240 ms (state), 420 ms (entrance). Easing `cubic-bezier(.22,.61,.36,1)`
(the site's `--ease`). Press = scale 0.98 + opacity. Respect Reduce Motion: entrances become
instant, film autoplay disabled (poster shown).

## Haptics
`selection` when toggling a service; `impactLight` on step advance; `notificationSuccess`
only when Mail reports `sent`. Nothing else.

## Signature moments
1. **Hero film** — muted looping reel behind the crest and "We move the people the world is
   *watching.*"; gold hairline draws across under the headline on load.
2. **The selection** — Step 1 rows: selecting a service draws a gold rail at the left edge,
   checks a square (not a circle) and the FLAGSHIP badge glints once on entrance.
3. **"Request on its way."** — outcome screen: the crest settles in, a gold rule draws, and the
   6-step engagement timeline shows "01 Request ✓" lit, with what happens next.

## Freeze
After V3 this file is frozen. Changes require a written defect, not a preference.
