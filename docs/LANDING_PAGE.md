# Landing Site Spec — StartupsClub Web (marketing)

A real multi-page SaaS marketing site in `src/app/(marketing)`. **Never a single page.**
Visual rules: `docs/DESIGN_SYSTEM.md` section 7. Build with the **21st.dev MCP**, the **Shadcn
MCP** and the **Taste skill**. Copy below is direction, not final text: ask before inventing claims,
numbers, testimonials, logos or prices.

## 1. Sitemap (approved by the owner)

| Page              | Route                   | Purpose                                                         |
| ----------------- | ----------------------- | --------------------------------------------------------------- |
| Home              | `/`                     | Explain the product and convert to sign-up.                     |
| Features          | `/features`             | Deep dive: standup, ship logs, clubs and seasons, AI, composer. |
| Pricing           | `/pricing`              | Free vs Pro comparison.                                         |
| About             | `/about`                | Story, mission, team.                                           |
| Community / Clubs | `/community`            | How clubs and seasons work; leaderboard preview.                |
| Blog              | `/blog`, `/blog/[slug]` | Articles (content source open).                                 |
| Changelog         | `/changelog`            | Product updates.                                                |
| Contact           | `/contact`              | Contact form and details.                                       |
| FAQ               | `/faq`                  | Common questions.                                               |
| Privacy           | `/privacy`              | Privacy policy.                                                 |
| Terms             | `/terms`                | Terms of use.                                                   |

Shared: header, footer, 404, sign-up and log-in links to `(auth)`.

## 2. Home page sections (in order)

1. **Hero:** headline, one-sentence subtext, primary CTA (`glow`), secondary CTA
   (`gradient-border`), product mockup (dashboard with standup and streak).
2. **Problem:** why WhatsApp and Discord groups fail (buried posts, anonymous members, no accountability).
3. **How it works:** three steps — post a daily standup, ship and log it, stay accountable with your club.
4. **Features grid:** standup, ship logs, clubs, seasons and streaks, AI coach, post composer.
5. **Clubs and seasons:** six-week seasons, small groups, leaderboard.
6. **AI section:** coach, matching, knowledge assistant, with plan labels.
7. **Composer:** write once, post to StartupsClub and LinkedIn, schedule (Pro).
8. **Pricing teaser:** Free and Pro cards linking to `/pricing`.
9. **Social proof:** only real content. If none exists yet, omit the section. No invented testimonials.
10. **FAQ preview** and **final CTA** (`magnetic`).

## 3. Other pages (outline)

- **Features:** one section per capability with a mockup, short text and the plan badge.
- **Pricing:** Free and Pro columns with a feature comparison table. **Prices, billing periods
  and the Pro AI quota number are not decided: use clearly marked placeholders until the owner
  answers.** Known rules: Free = instant posting to both targets, 5 AI posts a month (resets
  monthly, no rollover), watermark; Pro = scheduling, higher AI quota, optional watermark, AI
  coach, matching and knowledge assistant.
- **About:** mission and team (Uneeb Bhatti, Hadia Abid, M. Ahtisham Shahid). Ask before adding bios or photos.
- **Community:** explain clubs (up to 20 members, leader approval), seasons (six weeks,
  three-day join window), scoring in plain language once confirmed.
- **Blog / Changelog:** hard-coded entries in the repository (content source to be decided).
- **Contact:** form UI only until the backend exists; ask what receives submissions.
- **FAQ:** accordion (shadcn). Questions to be supplied or approved by the owner.
- **Privacy / Terms:** structure only; legal text must come from the owner or a lawyer.

## 4. Animation (GSAP) rules

- GSAP only inside `(marketing)`; loaded dynamically; plugins registered once.
- Use `useGSAP` (or an effect) with cleanup so nothing leaks on route changes.
- Typical effects: hero text reveal, staggered card entrance, scroll-triggered section reveals,
  parallax on mockups, number count-ups, magnetic button.
- Animate `transform` and `opacity` only. No animation blocks content from being readable.
- Respect `prefers-reduced-motion`: render content immediately and skip motion.
- Keep the first screen fast: no heavy animation before first paint (Largest Contentful Paint).

## 5. Smooth scrolling (Locomotive Scroll)

- Locomotive Scroll v5 (built on Lenis) is mounted once in `features/marketing/components/smooth-scroll-provider.tsx`
  and used only in `(marketing)/layout.tsx`.
- GSAP ScrollTrigger must be kept in sync with the scroll engine so triggers do not drift.
  **How to wire Locomotive's instance to ScrollTrigger must be verified against its current
  documentation before implementing. If it cannot be synced cleanly, stop and ask the owner
  before substituting another library.**
- Destroy the instance on unmount. Disable on touch devices if it causes problems, and for
  reduced motion. Anchor links and keyboard scrolling must still work.

## 6. Theme and fonts on this site

- Light and dark mode on every page (toggle in header and footer).
- Body text uses Inter; headings use the marketing heading font (**OPEN**, a sans-serif that is
  not Inter). Do not choose it without the owner.
- Dark background `#0A0A0A`; blue `#0076DE` (use `--primary-text` for blue text in dark mode).

## 7. SEO and performance

- One `h1` per page; semantic landmarks; `generateMetadata` per page; Open Graph images;
  `sitemap.xml` and `robots.txt`.
- Images through `next/image` with dimensions; lazy-load below the fold.
- Static rendering. Measure with Lighthouse before claiming a score.

## 8. Using the tools

1. Read this file and `docs/DESIGN_SYSTEM.md`.
2. Taste skill for design direction (marketing only; the design system wins on conflict).
3. 21st.dev MCP for component inspiration and generation; Shadcn MCP for base components.
4. Implement; look at it with Playwright in both themes at 1440 px and 390 px.
5. Pull request with screenshots.

## 9. Open questions

- Marketing heading font. Blog content source. Prices and Pro quota. Contact form destination.
- Real social proof, logos and team photos (none exist yet).
- Legal text for privacy and terms.
- The Privacy page must disclose Sentry error and performance diagnostics (owner provides the wording).