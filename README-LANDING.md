# StartupsClub landing page — how to add it to `startupsclub-web`

Built and checked on Next.js 16.4.6, React 19, Tailwind CSS 4.3.

## 1. Install the packages

```bash
npm i gsap locomotive-scroll next-themes lucide-react class-variance-authority clsx tailwind-merge
```

If you already ran `npx shadcn@latest init`, you have `lucide-react`, `class-variance-authority`,
`clsx` and `tailwind-merge` already.

## 2. Copy the files

Copy the `src/` folder into your project and merge it with yours.

- **Delete `src/app/page.tsx`** (the default Next.js page). The home page is now
  `src/app/(marketing)/page.tsx`, and two files cannot both serve `/`.
- **`src/app/globals.css`** replaces the default. If shadcn already generated tokens in your
  `globals.css`, keep your file and copy the colour values from this one into it.
- **`src/lib/utils.ts`** is the same `cn` helper shadcn creates. Keep only one copy.
- **`src/app/layout.tsx`** replaces the default root layout.

## 3. Run it

```bash
npm run dev
```

## Notes

- Fonts load through `next/font/google` (Inter and Onest), so the first build needs internet access.
- `/login` and `/signup` are linked but not built yet, so those links return 404 for now.
- All text is in `src/features/marketing/lib/content/home.ts`.
- To change the heading font, edit `src/lib/fonts.ts` only.
