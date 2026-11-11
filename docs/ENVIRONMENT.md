# Environment Setup — StartupsClub Web

## 1. Requirements

| Tool                    | Version                               | Notes                                       |
| ----------------------- | ------------------------------------- | ------------------------------------------- |
| Node.js                 | 22 (see `.nvmrc`)                     | Required by the Taste skill too.            |
| npm                     | Bundled with Node                     | Package manager (TO CONFIRM).               |
| Git                     | Current                               |                                             |
| VS Code (or any editor) |                                       | Install the Prettier and ESLint extensions. |
| Chromium for Playwright | via `npx playwright install chromium` |                                             |
| Claude Code             | Current                               | For AI-assisted work.                       |

## 2. First-time setup

```bash
git clone <repository-url>
cd startupsclub-web
npm install                      # also installs Husky hooks (prepare script)
cp .env.example .env.local       # Windows PowerShell: Copy-Item .env.example .env.local
npx playwright install chromium
npm run dev
```

The backend (NestJS) runs from its own repository. Until it exists the app runs on fixtures
(`docs/STATE_AND_DATA.md`).

## 3. Environment variables

See `.env.example` and `docs/TRD.md` section 6. All frontend variables are public.
**AI agents must never read `.env*` files.** Ask the developer if a value is needed.

## 4. MCP servers (`.mcp.json`)

| Server             | Purpose                                        | Needs              |
| ------------------ | ---------------------------------------------- | ------------------ |
| `shadcn`           | Browse and add shadcn/ui components and blocks | Nothing            |
| `magic` (21st.dev) | Generate and refine UI components              | API key            |
| `playwright`       | Control a browser to inspect the running site  | Chromium installed |

### 21st.dev API key (never in the repository)

Create the key in your 21st.dev account (see the 21st.dev Magic MCP documentation), then set it
in **your own shell environment** under the name `TWENTY_FIRST_API_KEY`. `.mcp.json` passes it to
the server as `API_KEY` without storing it.

- macOS / Linux: add `export TWENTY_FIRST_API_KEY="..."` to your shell profile.
- Windows PowerShell (persistent): `setx TWENTY_FIRST_API_KEY "..."`, then restart the terminal.
  The key is stored in your user environment, not in any project file.

### Windows note

Claude Code on native Windows can need the `cmd /c` wrapper to start `npx` servers. If a server
fails to start, change that server in your **local** MCP configuration (not the committed file) to:

```json
{ "command": "cmd", "args": ["/c", "npx", "-y", "@21st-dev/magic@latest"] }
```

Use WSL if you prefer a Linux-style setup. Ask the owner before changing the committed `.mcp.json`.

## 5. Taste skill

```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

This is the install form documented by the skill's repository (MIT licence). It installs one skill,
`design-taste-frontend`, with scripts that need Node 22+ and a Chromium-based browser. It is used
for the marketing site only (`AGENTS.md`). The shorter `npx skills add Leonxlnx/taste-skill` form
may work too, but may ask which skill to install.

## 6. Husky

`npm install` runs `husky` through the `prepare` script. Hooks live in `.husky/`:

- `pre-commit`: branch guard and lint-staged.
- `pre-push`: type check.

If hooks do not run, run `npx husky` once, and make sure the files are executable
(`chmod +x .husky/*` on macOS/Linux).

## 7. Useful commands

| Command                           | Purpose                      |
| --------------------------------- | ---------------------------- |
| `npm run dev`                     | Start the dev server         |
| `npm run build` / `npm run start` | Production build and server  |
| `npm run lint`                    | ESLint (no warnings allowed) |
| `npm run format` / `format:check` | Prettier write / check       |
| `npm run typecheck`               | `tsc --noEmit`               |
| `npm run test:e2e`                | Playwright tests             |

## 8. Sentry in local development

- Leave `NEXT_PUBLIC_SENTRY_DSN` empty in `.env.local`: no events are sent.
- To verify the setup, use a separate development Sentry project and its DSN (`docs/MONITORING.md`
  section 10). Remove any test code before committing.
- `SENTRY_AUTH_TOKEN` is not needed locally. Never put it in a project file.
- `.env.sentry-build-plugin` (created by the Sentry wizard) is git-ignored; AI agents must not read it.

## 9. Troubleshooting

- **Hooks not running:** see section 6.
- **MCP server not starting:** check Node 22, network access, and the Windows note above.
- **Port 3000 in use:** `npm run dev -- -p 3001`.
- **Type errors after pulling:** run `npm install`, then `npm run typecheck`.
