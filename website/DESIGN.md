# Learning Tokens — Design System

The visual identity for Learning Tokens, a Linux Foundation Decentralized Trust Lab that tokenizes the
learning process. This is the source of truth for the logo, color, type, and
usage. Everything here is derived from two given assets: the **LT monogram** and
a set of **Gunther Gerzso** paintings chosen as the palette reference.

**The memorable thing:** _a currency of expertise, minted in the visual language
of Mexican geometric modernism._ Warm, earthy, deliberate — a protocol that feels
like it was cut from stone and gold leaf, not shipped from a template.

---

## 1. Logo

The mark is an **LT monogram** built as an interlocking greca (a stepped-key
meander from Mesoamerican design): a square holding an interlocking L and T. The
letters live in the negative space, so the **counters carry the ground colour
straight through**. It is a single-colour vector — one path, any colour.

The master is the official vector (`public/brand/lt-mark.svg`, potrace,
`viewBox 0 0 270 270.985`). Do not redraw it. Colour it via `currentColor`
(components `LtMark` / `LtBadge`) or an explicit fill. For large/hero uses, the
painterly original `lt-painterly.png` (the mark in the Gerzso gold-leaf texture)
is also available.

| File / component | Use |
|------|-----|
| `LtMark` · `lt-mark.svg` | The mark, `currentColor`, transparent counters. The flexible primary — colour with CSS for any context. |
| `lt-black.svg` / `lt-white.svg` | Ready-made ink and paper (white) versions for slides, docs, print. |
| `LtBadge` · `lt-badge.svg` | Ochre tile + ink mark. **Primary badge** — app icon, avatar, favicon. |
| `lt-badge-heritage.svg` | Ochre tile + slate mark. Quotes the Gerzso source. Covers, decks. |
| `lt-painterly.png` | The original mark in the Gerzso gold-leaf texture. Hero / large uses only (raster). |
| `favicon.svg` | The badge, tuned for 16–32px. |

**Colour pairings:** on light grounds, ink mark (`lt-black`); on dark grounds,
paper or ochre mark; the gold **badge** whenever a filled tile helps it pop.

**Lockup:** mark/badge + wordmark set in Space Grotesk 600, wordmark cap height
≈ 80% of the mark height. Horizontal only.

**Clear space:** at least ¼ of the mark's width on all sides.
**Minimum size:** 20px. **Never:** stretch, rotate, recolour the counters
independently, add effects, or place it on a low-contrast field.

---

## 2. Color

Sampled directly from the Gerzso paintings. The system is warm and earthy: near-
black olive grounds, parchment light grounds, ochre gold as the brand primary,
pale slate as the cool secondary, and a single hot terracotta for one thing at a
time.

### Grounds
| Token | Hex | Role |
|-------|-----|------|
| `ink` | `#16150F` | Primary dark ground (warm olive-black) |
| `basalt` | `#2A2823` | Raised surface on dark |
| `paper` | `#E7E2CE` | Primary light ground (parchment) |
| `bone` | `#F3EFE2` | Raised surface on light |

### Primary — ochre (the mark's field)
| Token | Hex | Role |
|-------|-----|------|
| `ochre` | `#A98B4B` | Brand primary. Badges, key fills. |
| `gilt` | `#C9A24E` | Brighter gold. Hover, small accents, links on dark. |
| `olive` | `#6E6B45` | Muted olive. Borders and dividers on dark. |

### Secondary — slate (the mark's letters)
| Token | Hex | Role |
|-------|-----|------|
| `slate` | `#B3C2C1` | Cool pale blue-green. Secondary surfaces, quiet accents. |
| `pine` | `#3C4A46` | Deep teal-green. Secondary dark accent, charts. |

### Accent — terracotta (use sparingly)
| Token | Hex | Role |
|-------|-----|------|
| `terracotta` | `#B4471F` | Gerzso's red. One hot moment per view — a primary CTA, a live/alert state. Never as body or large fields. |

### Text
| On | Primary | Muted |
|----|---------|-------|
| Dark grounds | `paper #E7E2CE` | `#B9B4A0` |
| Light grounds | `ink #16150F` | `#6B6858` |

**Contrast:** paper-on-ink and ink-on-paper both clear AA for body. Ochre is a
_fill_ color, not a text color on light grounds — for gold text on dark use `gilt`.

---

## 3. Typography

The type is geometric and quiet so the mark and color carry the personality.

- **Display — Space Grotesk (600/700).** Its geometric, slightly technical cut
  rhymes with the greca. Headlines, wordmark, section titles.
- **Body — Inter (400/500).** Neutral, legible, gets out of the way.
- **Data / labels — IBM Plex Mono (400/500).** Token IDs, eyebrows, code,
  ledger figures. The "institutional register" voice.

Scale (fluid): display `clamp(2.75–4.5rem)`, h1 `clamp(2–2.75rem)`, h2
`clamp(1.5–2rem)`, h3 `1.25rem`, body `1rem`, eyebrow `0.75rem` uppercase
`0.18em` tracking in mono. Tighten display tracking to `-0.02em`.

---

## 4. Layout & motion

- **Planes, not cards.** Gerzso composes with overlapping hard-edged rectangles.
  Prefer flat bounded planes and hairline dividers over drop-shadowed cards.
- **The greca as structure.** A stepped-key rule or the counter motif can mark
  sections — but only where it encodes something (a boundary, a step), never as
  wallpaper.
- **Alternate grounds.** Rhythm the page ink → paper → ink, the way the paintings
  set a dark field against a light one.
- **Motion is minimal.** One deliberate entrance (e.g. a mint/reveal), hover
  state changes, `prefers-reduced-motion` respected. No ambient animation.

---

## 5. Sources

- **Monogram:** the LT greca, traced to vector from the original artwork. The
  master is `public/brand/lt-mark.svg`; the pre-vector rasters it came from are
  kept outside this repository.
- **Palette:** sampled from the paintings of Gunther Gerzso (1915–2000), Mexican
  geometric abstraction. Every hex above was drawn from those canvases. The works
  are under copyright and are deliberately not reproduced in this repository —
  only the colour values derived from them.
- **Live preview:** `/brand` route on the site.
