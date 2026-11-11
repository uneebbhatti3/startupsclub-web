# Design System — StartupsClub Web

Two tiers share one set of tokens:

| Tier          | Where                     | Look                                                                                       | Built from                                                               |
| ------------- | ------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| **App**       | `src/app/(app)`, `(auth)` | Clean, dense, product UI                                                                   | shadcn/ui components and the shadcn **dashboard** block, used as shipped |
| **Marketing** | `src/app/(marketing)`     | Notion-inspired: calm, neutral, spacious, line icons; **expressive, eye-catching buttons** | shadcn + 21st.dev MCP + Taste skill, GSAP, Locomotive Scroll             |

Owner decisions (11 Nov 2026): the Notion influence applies to the **marketing site only**. The
app uses the shadcn dashboard component. Palette is simple. Pure black is never used.

> Values in **bold "derived"** were chosen by the assistant to complete the palette. Only
> `#0076DE` and `#0A0A0A` came from the owner. The owner must confirm the derived values.

## 1. Principles

1. Simple palette: one blue, a neutral scale, one red for danger. No other hues.
2. Content first; decoration is quiet. Colour carries meaning (action, status), not decoration.
3. Same tokens everywhere, so light and dark both work without per-component overrides.
4. Accessible by default (WCAG 2.1 AA).
5. Marketing may be expressive; the app stays calm and consistent.

## 2. Colour tokens

Define as CSS variables in `src/app/globals.css` and map them to the shadcn/Tailwind theme.
Hex shown for clarity; shadcn may store them in another colour space, the values must match.

| Token                     | Light     | Dark      | Use                                                     |
| ------------------------- | --------- | --------- | ------------------------------------------------------- |
| `--background`            | `#FFFFFF` | `#0A0A0A` | Page background                                         |
| `--foreground`            | `#0A0A0A` | `#FAFAFA` | Main text (derived light value `#FAFAFA`)               |
| `--card` / `--popover`    | `#FFFFFF` | `#111111` | Surfaces (derived)                                      |
| `--muted` / `--secondary` | `#F5F5F5` | `#1A1A1A` | Subtle fills (derived)                                  |
| `--muted-foreground`      | `#6B6B6B` | `#A3A3A3` | Secondary text (derived)                                |
| `--border` / `--input`    | `#E5E5E5` | `#262626` | Borders (derived)                                       |
| `--primary`               | `#0076DE` | `#0076DE` | Brand and primary actions (**owner**)                   |
| `--primary-foreground`    | `#FFFFFF` | `#FFFFFF` | Text on primary                                         |
| `--primary-text`          | `#0076DE` | `#4DA3FF` | Blue **text and links** (derived dark value, see below) |
| `--accent`                | `#EAF3FC` | `#0F1B2D` | Hover or selected tint of the blue (derived)            |
| `--accent-foreground`     | `#0A0A0A` | `#FAFAFA` |                                                         |
| `--destructive`           | `#D92D20` | `#F97066` | Danger (derived)                                        |
| `--ring`                  | `#0076DE` | `#4DA3FF` | Focus ring                                              |

**Contrast (measured, WCAG formula):**

- White on `#0076DE`: **4.52:1** (passes AA for normal text, barely).
- `#0076DE` text on `#0A0A0A`: **4.38:1**, which fails AA for small text. Therefore blue text and
  links in dark mode use `--primary-text` `#4DA3FF` (**7.54:1**). Solid blue buttons keep `#0076DE`.
- `#6B6B6B` on white: 5.33:1. `#A3A3A3` on `#0A0A0A`: 7.85:1.
- Re-measure after any change. Never lower a contrast ratio below 4.5:1 for text.

Rules: no pure black (`#000`) or `black` in code; no colours outside this table; chart colours,
if ever needed, are tints of the blue and neutrals (ask first).

## 3. Typography

| Use                   | Font                                                | Notes                                                                                                          |
| --------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| App and all body text | **Inter** (Google Fonts through `next/font/google`) | Variable font, `display: "swap"`, CSS variable `--font-sans`.                                                  |
| Marketing headings    | A different **sans-serif** — **OPEN**               | Not Inter. Exposed as `--font-heading`, used only inside `(marketing)`. Owner must choose; the agent must not. |

Scale (Tailwind classes; adjust only with approval):

| Role    | App                             | Marketing                             |
| ------- | ------------------------------- | ------------------------------------- |
| Display | n/a                             | `text-5xl`–`text-7xl`, tight tracking |
| H1      | `text-2xl font-semibold`        | `text-4xl`–`text-5xl`                 |
| H2      | `text-xl font-semibold`         | `text-3xl`–`text-4xl`                 |
| H3      | `text-lg font-medium`           | `text-xl`–`text-2xl`                  |
| Body    | `text-sm`                       | `text-base`–`text-lg`                 |
| Caption | `text-xs text-muted-foreground` | `text-sm text-muted-foreground`       |

Line length 60–75 characters for reading text. Marketing body text has `leading-relaxed`.

## 4. Spacing, radius, elevation

- Spacing follows Tailwind's 4 px scale. Prefer 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Radius token `--radius`: **app** `0.5rem` (shadcn default feel); **marketing** surfaces
  `0.5rem`–`0.75rem`, buttons per section 7. Do not mix random radii.
- Elevation: borders first, shadows second. App: no shadow except popovers and dialogs.
  Marketing: soft, low-contrast shadows for product mockups and cards.

## 5. Icons

- **Lucide** only (`lucide-react`). Stroke width 1.5 on marketing, default on app.
- Sizes: 16 (inline), 20 (default), 24 (feature), 32+ (marketing illustrations).
- Icons with meaning have an accessible label; decorative icons are `aria-hidden`.
- Do not copy Notion's icons, logo or illustrations. They are proprietary.

## 6. App tier (shadcn dashboard)

- Shell: the shadcn **dashboard** block (sidebar, header, content area). Exact block id
  (for example `dashboard-01`) is confirmed through the Shadcn MCP before installing.
- Use shadcn components as shipped: Button, Input, Select, Dialog, Sheet, Tabs, Table, Card,
  Badge, Avatar, Dropdown Menu, Tooltip, Skeleton, Toast (Sonner), Form, Checkbox, Switch, Calendar.
- Buttons: shadcn variants only (`default`, `secondary`, `outline`, `ghost`, `destructive`, `link`),
  sizes `sm`, `default`, `lg`, `icon`.
- Density: compact tables and lists; page titles `text-2xl`; consistent page header
  (title, description, primary action on the right).
- Required states on every screen: loading (skeleton), empty (illustration-free, one sentence and
  one action), error (message and retry), disabled, focus-visible.
- Pro-gated features show a `Badge` "Pro" and an upgrade dialog, never a hidden control.
- No GSAP, no smooth scroll, minimal motion (shadcn defaults; see section 9).

- Error screens (`error.tsx`, `global-error.tsx`, 404): plain sentence, one action (try again or go
  home), the event ID in muted text. No stack traces or technical messages shown to users.

## 7. Marketing tier

### 7.1 Notion-inspired direction (derived from how Notion's site looks; Notion publishes no public design system)

- Calm neutral surfaces with generous whitespace and a strong readable headline.
- Large, confident headings and short supporting text.
- Product screenshots and UI mockups in clean windows with subtle borders and soft shadows.
- Thin line icons, small decorative restraint, a single accent colour.
- Content in clear sections with consistent vertical rhythm (96–128 px between sections).
- Illustration and imagery chosen with the Taste skill and 21st.dev; real photographs or product
  UI preferred over generic stock art. Licences must be checked.

### 7.2 Layout

- Container max width `1200px` (`max-w-6xl`/`7xl`), 24 px side padding on mobile.
- 12-column grid on desktop; single column on mobile.
- Header: sticky, blurred background on scroll, theme toggle and Sign up button on the right.
- Footer: product, company, resources, legal links, theme toggle, social links.

### 7.3 Expressive buttons (marketing only)

All variants meet contrast and focus rules, work in both themes, have 44 px touch height, and
disable motion when `prefers-reduced-motion` is set. Build them as variants of one `MarketingButton`
component in `features/marketing/components/`, using `cva`. Final visuals are designed with 21st.dev and the
Taste skill, then approved by the owner.

| Variant           | Where                | Description                                                    |
| ----------------- | -------------------- | -------------------------------------------------------------- |
| `glow`            | Primary hero CTA     | Solid `#0076DE`, soft blue glow, slight lift on hover.         |
| `shine`           | Pricing and key CTAs | Solid blue with a light sweep that crosses on hover.           |
| `gradient-border` | Secondary hero CTA   | Transparent fill, animated blue border, fill on hover.         |
| `arrow-slide`     | "Learn more" actions | Pill; arrow icon slides in and text shifts on hover.           |
| `magnetic`        | Footer and final CTA | Button gently follows the cursor within a small radius (GSAP). |
| `ghost-underline` | Inline and nav links | Text button with an animated underline.                        |

Do not use these in `(app)`.

## 8. Theming

- `next-themes` with the `class` attribute on `<html>`; default `system` (**TO CONFIRM**), toggle
  with Light, Dark, System. Use the shadcn dark-mode setup and its mode-toggle component.
- No flash of wrong theme: `suppressHydrationWarning` on `<html>` and theme script from `next-themes`.
- Test every page in both themes.

## 9. Motion

| Area      | Rule                                                                                        |
| --------- | ------------------------------------------------------------------------------------------- |
| App       | Shadcn default transitions only (150–200 ms). No page animations.                           |
| Marketing | GSAP for entrance, scroll-linked and hover effects; Locomotive Scroll for smooth scrolling. |
| All       | Honour `prefers-reduced-motion`: no smooth-scroll, no parallax, no large movement.          |
| All       | Animate `transform` and `opacity` only; avoid layout-affecting properties.                  |

Details in `docs/LANDING_PAGE.md`.

## 10. Do not

- No colours outside the tokens; no pure black; no gradients with new hues.
- No second UI library; no custom components that duplicate shadcn ones.
- No Notion styling in the app; no shadcn default look on the marketing buttons.
- No text over images without a contrast check.