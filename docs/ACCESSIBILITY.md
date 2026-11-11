# Accessibility — StartupsClub Web

Target: **WCAG 2.1 Level AA** on every route, in light and dark mode.

## 1. Colour and contrast

- Text 4.5:1 minimum (3:1 for large text and UI component boundaries).
- Measured values and the dark-mode blue text rule are in `docs/DESIGN_SYSTEM.md` section 2.
  Blue **text** in dark mode uses `--primary-text`, not `--primary`.
- Never rely on colour alone: status badges also have text or an icon.
- Check contrast for any text placed over images or gradients.

## 2. Keyboard and focus

- Every interactive element is reachable and operable with the keyboard; logical tab order.
- Visible focus ring (`--ring`) on all focusable elements; never `outline: none` without a replacement.
- Dialogs, sheets and menus trap focus and restore it on close (shadcn/Radix does this; do not break it).
- "Skip to content" link as the first focusable element on every layout.
- No keyboard traps; custom widgets follow WAI-ARIA authoring patterns, or use shadcn primitives.

## 3. Structure and semantics

- One `h1` per page; headings in order. Landmarks: `header`, `nav`, `main`, `footer`.
- Use native elements (`button`, `a`, `label`, `input`) before ARIA. Links navigate; buttons act.
- Forms: every input has a visible label; errors are linked with `aria-describedby` and announced;
  required fields are indicated in text.
- Icon-only buttons have `aria-label`. Decorative icons and images are `aria-hidden` / `alt=""`.
- Meaningful images have descriptive `alt`.
- Data tables have headers; lists use list elements.
- Live updates (toasts, saved states) use `aria-live="polite"`.

## 4. Motion

- Respect `prefers-reduced-motion`: disable smooth scrolling, parallax, auto-playing and large
  movement. Content must be fully usable without animation.
- Nothing flashes more than three times per second.

## 5. Responsive and zoom

- Usable at 320 px width and at 200% zoom without horizontal scrolling or lost content.
- Touch targets at least 44 × 44 px on mobile (24 px minimum with spacing on desktop).
- Do not disable pinch zoom.

## 6. Language and time

- `<html lang="en">`. Dates and times shown in the user's timezone with a clear format.

## 7. Testing

1. Keyboard-only pass on each new page.
2. Playwright MCP check in both themes (`docs/TESTING.md`).
3. Automated axe scan (`@axe-core/playwright`) once approved as a dependency.
4. Screen reader spot check (NVDA on Windows or VoiceOver) for key flows before release.
5. Automated tools find only a part of the issues; manual checks are required.

## 8. Definition of done (accessibility)

- [ ] Keyboard operable, focus visible
- [ ] Contrast checked in light and dark
- [ ] Labels, alt text, headings, landmarks correct
- [ ] Reduced-motion respected
- [ ] 320 px and 200% zoom checked

## 9. Error and feedback screens

- Error messages are announced (`role="alert"` or `aria-live`), focus moves to the message, and the
  retry control is keyboard reachable.
- If the Sentry user feedback widget is ever enabled, it must meet the same contrast, focus and
  keyboard rules and be themed for light and dark mode.
