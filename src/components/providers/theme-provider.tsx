"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * Light and dark theme provider (shadcn dark-mode setup on top of `next-themes`).
 * Mounted once in the root layout; puts the `dark` class on `<html>`.
 *
 * @packageDocumentation
 */

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
