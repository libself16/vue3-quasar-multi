# Repository Guidelines

## Project Structure & Module Organization
The Quasar/Vue app lives in `src/`. Shared building blocks sit in `src/common` (components, composables, directives, utils) while page views stay in `src/common/pages`. Shared hooks that drive cross-tenant logic live alongside other shared modules in `src/`. Boot plugins (axios, i18n, dayjs) reside under `src/boot`. Routing is in `src/router`, Pinia stores in `src/stores`, and API clients in `src/api`. Static assets go to `public/`, Cordova shells to `src-cordova`, automation scripts to `tool/`, and production bundles to `dist/`. Tenant-specific layouts, assets, and feature hooks live in `template/<siteKey>` folders.

## Template Selection Workflow
This is a multi-tenant cash gaming platform. The active skin is resolved from `src/env/environment.json`. During startup the boot env module reads `siteKey` and loads the matching package in `template/<siteKey>` plus any shared overrides in `src/common`. Template packages encapsulate each brand's front-office pages, assets, and bespoke hooks. Update `siteKey` (or add new entries) when switching tenants locally; avoid hardcoding template paths inside components. When introducing a new template, scaffold `template/<newSite>` mirroring the default structure, wire brand hooks there, and register any special assets or localized strings.

## Build, Test, and Development Commands
Install dependencies with `npm install` or `yarn`. `npm run dev` launches the web dev server; `npm run dev:android` and `npm run dev:ios` target Cordova builds. Ship production assets with `npm run build`, or use `npm run build:onlyCode` / `npm run build:allCode` when you need web bundles only. Run `node tool/build/createEnv` after adding env keys and `node tool/i18n-generator/index.js` when copy changes to sync template strings.

## Coding Style & Naming Conventions
Prettier and ESLint enforce 2-space indentation, trailing commas, and single quotes; keep editor integrations enabled. Name Vue single-file components in PascalCase (`AgentBanner.vue`), composables as `useFeature.ts`, and Pinia stores ending in `Store`. Centralize shared Tailwind helpers in `src/common/css`, respect `.editorconfig`, and prefer TypeScript for new utilities or reusable hooks. When a hook is template-specific, implement it under `template/<siteKey>/hooks` and expose a thin adapter in shared code if others consume it.

## Testing Guidelines
Testing scripts are not declared yet; place new specs beside the source (e.g., `src/common/components/Card.spec.ts`) and state how to run them in the PR. Document manual verification per affected tenant, breakpoint, and platform. Exercise Cordova-sensitive changes with `npm run dev:<platform>` and list any data seeds or feature toggles reviewers need.

## Commit & Pull Request Guidelines
Commits on `main` stay brief and scope-first (see the recent `fix/title_set_cover` series); keep the first line <=50 characters and imperative. Develop on topic branches such as `feature/<scope>` or `fix/<issue>` and rebase before merge. PRs should explain scope, list manual test evidence, link tickets, attach UI screenshots or clips, and highlight template scripts that must be rerun.

## Configuration & Secrets
Environment templates (`env.development`, `env.production`, etc.) live at the repo root; copy them to local `.env` files and keep secrets out of Git. Add new keys through `tool/build/createEnv` and update helpers in `src/boot/env` so tenant overrides stay centralized. Agent branding belongs in `template/` and `src/common/assets`; avoid hardcoding tenant IDs in shared modules, and commit only sanitized `environment.json` examples.
