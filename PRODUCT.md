# Product

## Register

brand

Triplit ships both a marketing landing page (`/`) and an authenticated dashboard
app (`/dashboard`). The **landing page is the primary surface**: it's where the
brand impression is made, so design IS the product there. The dashboard is a
secondary product surface where design serves the workflow; override the register
to `product` when working inside `/dashboard`.

## Users

Friends planning a trip together: a small group (3-6 people) splitting a flat,
booking activities, and tracking who paid for what. They're casual travelers, not
power users or accountants. Context: planning excitedly before the trip (on a
laptop, evenings) and reconciling money during/after it (on a phone, on the go).
The job to be done: plan the trip together, then split and settle the shared money
fairly without anyone doing spreadsheet math or chasing people for cash.

## Product Purpose

Triplit turns group travel from a logistics headache into something the group does
together: collaborative trip planning, a travel assistant for itinerary ideas, a
shared expense ledger, and a settlement engine that reduces "who owes whom" to the
fewest possible peer-to-peer transfers. Success: a group finishes a trip with the
money squared away in a couple of taps and nobody feeling like the unpaid
treasurer.

## Brand Personality

Warm, social, playful. The voice of a well-traveled friend who's good with money,
not a fintech tool and not a corporate booking engine. Trips with friends should
feel joyful; even the settling-up should feel light. Confident and specific, never
hypey. Emotional goals: anticipation (the trip ahead), togetherness (doing it as a
group), and relief (the money is handled).

## Anti-references

- **Generic AI SaaS template** (the current landing page, and the primary thing to
  escape): gradient-clipped hero text, decorative glassmorphism, aurora-mesh
  backgrounds with floating glow orbs, a tiny uppercase tracked eyebrow above every
  section, identical icon-card bento grids, big rounded icon tiles over every
  heading. If it could be any AI-generated SaaS startup, it has failed.
- **Crypto/fintech dark-and-gold** "premium" luxe aesthetic.
- **Sterile corporate booking engine** (Expedia/Booking.com): cold, dense,
  transactional, soulless.

## Design Principles

1. **It's a trip, not a SaaS dashboard.** Lead with place, people, and the feeling
   of going somewhere together, not with feature cards and product chrome.
2. **Show the real thing.** Demonstrate the planning, splitting, and settling with
   concrete, believable content (real destinations, real-looking numbers), not
   abstract marketing claims.
3. **Make the money feel light.** The settlement smarts are a genuine differentiator;
   present them as relief and fairness among friends, not as finance or accounting.
4. **Warmth comes from craft, not decoration.** Personality lives in type, color,
   copy, and imagery, not in glow orbs, glass, and gradient effects.
5. **Specific over generic.** Every headline, label, and example should sound like
   this product and these users, never like a category-template placeholder.

## Accessibility & Inclusion

Target WCAG 2.1 AA: body text ≥4.5:1 and large text ≥3:1 against its background
(no light-gray-on-tint), full keyboard navigation with visible focus, semantic
HTML/landmarks. Every animation needs a `prefers-reduced-motion` alternative.
Status and money colors (paid/owed/settled) must not rely on hue alone: pair them
with text or icon cues so they read for colorblind users.
