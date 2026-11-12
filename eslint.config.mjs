import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // AGENTS.md hard rule 3: no `any` (explicit or `as any`) and no @ts-ignore. Pinned here so a
  // change in the Next.js preset can never weaken them; the pre-commit hook relies on these.
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        { "ts-ignore": true, "ts-expect-error": "allow-with-description" },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored third-party skill (tracked by skills-lock.json), not project code. The skill is
    // also committed as real files under .claude/skills (locally a junction to .agents, which
    // ESLint does not follow, so only CI sees that copy).
    ".agents/**",
    ".claude/**",
  ]),
]);

export default eslintConfig;
