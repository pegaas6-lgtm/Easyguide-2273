# Easy Guide — design system

Warm, "travel journal" feel. Paper + terracotta + deep forest green. Real Lviv photography is the hero of every screen.

## Colors (CSS vars in packages/web/src/web/styles.css)
- `--paper` #F4ECDF — page background (with subtle grain)
- `--paper-2` #EADFCB — secondary surfaces, chips
- `--ink` #22180F — main text
- `--ink-soft` #6B5B4B — secondary text
- `--terracotta` #C0502D — primary accent (CTA, active, route line)
- `--forest` #1E3A2C — dark sections, footer, map markers
- `--ochre` #D9A13B — highlights, badges ("безкоштовно", "сьогодні")

## Typography
- Display: **Fraunces** (serif, 500–700, optical size, italic for accents)
- Body/UI: **Poppins** (400/500/600)
- Headlines tight leading (1.0–1.1), body 1.6. Uppercase tracked micro-labels (11–12px, tracking 0.14em).

## Shapes & layout
- Cards: 1.25rem radius images, no heavy shadows; thin 1px ink/10 borders.
- Stamps / ticket-like badges with dashed borders for event dates.
- Asymmetric hero: big photo with overlapping paper card.
- Mobile-first; bottom nav on mobile, top nav on desktop.

## Motion
- Staggered fade-up on page load (motion/react). Hover: image scale 1.04.
