# Design Audit and Visual Issues Report

This document records the visual, layout, and UX/UI defects identified in the Jardin Luxury Boutique web application based on screenshot analysis of each section.

---

## Section 1: Header & Hero Section (`screenshot_section_1.png`)
* **[CRITICAL] Transparent Header Text Contrast Over Hero Left:** At the top of the page, the header is transparent. The left side of the Hero section is extremely dark/black (`#090909`), while the navigation links ("apparel", "jewelry", etc.) in the header default to `text-brand-dark` (black/dark gray). This makes the left-side navigation links completely invisible (black text on a black background).
* **[CRITICAL] Split Logo Visual Break:** The logo `"JARDIN LUXURY BOUTIQUE"` is centered on the exact vertical split of the screen. Since the left background is dark and the right background is light, and the text color is dark, the `"JAR"` part of the logo is completely invisible against the black background, while `"DIN"` is visible against the light background. The logo looks severed and broken.
* **Header Actions Consistency:** The buttons on the right (search, wishlist, bag) are visible because they sit over the light side of the hero, but they lack uniform visual framing.
* **Layout Balance:** The split screen divides attention equally, but the transition line between the dark and light halves of the hero is a hard line that cuts right through the logo, adding unnecessary visual noise.

---

## Section 2: Brand Marquee Banner (`screenshot_section_2.png`)
* **Plain Text brand "Logos":** The marquee uses standard un-styled text (e.g., `Givenchy Paris`, `Saint Laurent`) separated by bullet points. For a luxury site, this feels generic. The text should be highly stylized, using elegant typography, varying opacity, or custom letter-spacing to resemble high-fashion logos.
* **Low Contrast Borders:** The top and bottom borders (`border-brand-gold/15`) are extremely faint. Increasing the gold luxury border opacity or adding a subtle glow/dimension would elevate the premium aesthetic.

---

## Section 3: Editorial Philosophy Section (`screenshot_section_3.png`)
* **[TYPOGRAPHY BUG] Character Splitting Word Wrap:** The quote text is split character-by-character into individual `span` elements with `display: inline-block` for a GSAP scroll reveal. Because standard layout engines wrap `inline-block` elements individually, words break in the middle (e.g., "curation" splitting as "cur-" and "ation" across lines). This looks highly unprofessional and ruins legibility.
* **Background Text Contrast & Depth:** The giant background outline text `"JARDIN"` uses `.font-outline` with `-webkit-text-stroke: 1px rgba(10, 10, 10, 0.2)`. On standard light backgrounds, it can look a bit flat and compete with the readability of the quote in front of it. Adding a slight text shadow or adjusting its z-index/opacity will create better depth.

---

## Section 4: Curated Categories Asymmetrical Grid (`screenshot_section_4.png`)
* **Missing Section Title/Header:** The categories grid starts abruptly below the editorial philosophy section with no header or introduction. It needs a minimalist, tracked section title (e.g., `"Curated Collections"`) to establish a clear visual hierarchy.
* **Card Interactions & Styling:** The cards hover zoom effect is nice, but the slide-up "Discover" text starts at `opacity-0` and suddenly appears on hover. Adding a smooth transition for the entire text overlay (such as a slight upward translation) will make the interaction feel incredibly polished.

---

## Section 5: Shop Section (`screenshot_section_5.png`)
* **Boxy, Standard Card Layout:** The product grid cards use a light border (`border-brand-champagne/30`) and a very standard white background card layout. This feels like an e-commerce template rather than an ultra-exclusive luxury showroom. Removing rigid card borders and adopting a borderless, airy, editorial card layout with elegant, asymmetrical details will dramatically elevate the high-fashion feel.
* **Filter Pill Styling:** The category filter buttons use a very standard pill shape. While functional, it is standard and does not reflect a bespoke boutique. A minimal, elegant underline filter tab system or highly tracked rectangular buttons would be more cohesive.
* **Price & CTA Prominence:** The price and "Add to bag" button are crammed together in a standard bottom bar. Adding better spacing, using the classic gold color accent, or making the "Add to bag" interaction more tactile will enhance the UX.

---

## Section 6: Boutique Atelier Description / About Us (`screenshot_section_6.png`)
* **Visual Congestion:** This section immediately follows the shop grid without a soft layout transition. Adding a subtle background color shift (e.g., using a soft champagne or warm beige block) or increasing the vertical padding will give the brand story more breathing room.
* **Image Cohesion:** The Unsplash placeholder images in the left column grid feel disconnected from the high-contrast black/white and warm champagne aesthetic. Selecting highly cohesive, monochromatic high-fashion imagery will unify the brand story.

---

## Section 7: Bridal & Custom Workshops / Exclusive Consultations (`screenshot_section_7.png`)
* **Flat Banner Background:** The booking call-to-action banner is a flat, solid beige block (`bg-brand-champagne/40`). While clean, it feels empty. Adding a highly desaturated, low-opacity background image of the showroom interior with an elegant overlay would make this call-to-action feel exclusive and inviting.
* **Button Style:** The CTA button ("Request Private Booking") transitions instantly on hover. Adding a custom transition with a gold border outline expand or a subtle scale will align it with high-end luxury websites.

---

## Section 8: Instagram Social Feed & Footer (`screenshot_section_8.png`)
* **Repetitive Social Grid Images:** The Instagram feed duplicates the exact product shots used in the store section. An authentic brand social feed should showcase lifestyle shots, showroom details, customer-styled apparel, and close-ups to look alive and organic.
* **Newsletter Input Styling:** The newsletter email field is a plain rectangular box. Elevating it with a bottom-only border and a highly tracked label, keeping in line with the Saint Laurent or Givenchy minimalist forms, will complete the luxury experience.
