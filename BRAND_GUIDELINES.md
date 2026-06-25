# Mama Flowers — Brand Guidelines

## 1. Brand Identity

Mama Flowers is a bold, fashion-forward floral house based in Tirana, with delivery
across the city. Where many flower brands lean soft and pastel, Mama Flowers is
unapologetically vivid: vibrant fuchsia and magenta blooms set against deep plum,
sculptural couture arrangements, and statement event decor.

The brand is modern, glamorous, and confident — flowers as fashion. Every bouquet
and installation is designed to make an entrance, whether it is a hand-tied bouquet,
a sculptural box arrangement, or full decor for a wedding or event.

- **Personality:** bold, glamorous, fashion-forward, confident, modern
- **Promise:** statement blooms and couture event decor, crafted fresh in Tirana
- **Instagram:** [@mamaflowers__](https://instagram.com/mamaflowers__)
- **Location:** Tirana, Albania — with same-day delivery across the city
- **Languages:** English & Albanian (fully bilingual website)

## 2. Logo

The primary mark pairs a bold, modern bloom symbol with the wordmark **MAMA** set in
widely tracked uppercase, above the tagline **FLOWERS & DECOR · TIRANA**.

- **Wordmark:** "MAMA" — Montserrat-style geometric caps, generously letter-spaced.
- **Bloom mark:** a sculptural fuchsia bloom (`#C4286E`) with deeper plum detail (`#9C1E55`).
- **Tagline lockup:** a thin hairline rule above the tagline in deep plum (`#9C1E55`).
- **Backgrounds:** preferred on the soft champagne tint (`#FBF0F4`) or deep plum night (`#190711`).
- **Clear space:** keep at least the height of the "M" clear on all sides.
- **Don't:** recolor the bloom outside the palette, condense the tracking, or place the
  wordmark on busy imagery without an overlay.

The master logo lives at `Brand/logo.svg`.

## 3. Color Palette

| Token            | Hex       | Role                                              |
| ---------------- | --------- | ------------------------------------------------- |
| brand-dark       | `#2A0E1C` | Primary ink / body text                           |
| brand-night      | `#190711` | Deepest backgrounds (loader, hero, footer)        |
| brand-gold       | `#C4286E` | Signature accent — vivid fuchsia                  |
| brand-deep       | `#9C1E55` | Darker accent for text & hairlines on light       |
| brand-champagne  | `#FBF0F4` | Soft section background tint                       |
| brand-red        | `#C01E63` | Highlight / notification accent                   |

The system is fully token-based via Tailwind. Vivid fuchsia and magenta carry the
brand against deep plum and near-black plum darks; the champagne tint keeps light
sections warm without going pastel.

## 4. Typography

- **Cormorant Garamond** (serif) — editorial headlines and display quotes. Elegant,
  high-contrast, couture.
- **Montserrat** (display) — wordmark, eyebrows, navigation, buttons. Geometric,
  confident, widely tracked uppercase.
- **Inter** (sans) — body copy and UI. Clean and highly legible.

Typographic style: generous letter-spacing on uppercase Montserrat, italic accents
in Cormorant Garamond, and restrained, airy body text in Inter.

## 5. Website Style & Layout

- Full-bleed video hero over deep plum, with fuchsia eyebrow and serif headline.
- Sticky navbar that morphs from transparent (over hero) to solid white on scroll.
- Infinite-scroll brand marquee, parallax imagery, and GSAP scroll-reveal sections.
- Editorial philosophy quote, floral collections grid, and a fresh-this-season shop
  grid with a product detail modal and a favourites drawer.
- Weddings & events consultation block for statement decor commissions.
- Visit section with a desaturated Leaflet map, opening hours, and contact details.
- Custom desktop cursor, bilingual EN/AL toggle, accessible focus rings, and full
  reduced-motion support.

The overall feel is glamorous and modern — couture flowers presented like a fashion
editorial.

## 6. Tech

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS (token-based brand palette)
- **Animation:** GSAP + ScrollTrigger (`@gsap/react`)
- **Icons:** lucide-react
- **Map:** Leaflet (OpenStreetMap tiles, desaturated)
- **Fonts:** Google Fonts — Cormorant Garamond, Montserrat, Inter
