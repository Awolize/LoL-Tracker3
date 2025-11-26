### **TS**

* Prefer `unknown` instead of `any`.
* Use `satisfies` for object literals.
* Use guard clauses and custom type guards.
* Narrow unions early (avoid optional chaining everywhere).
* Use discriminated unions + exhaustive `never` checks.
* Favor `readonly` and `as const` where possible.

### **React**

* Keep state close to where it's used (colocation).
* Avoid derived state; compute it instead.
* Use custom hooks for non-UI logic.
* Memoize only when needed (avoid “reflexive” `useCallback`/`useMemo`).
* Use stable keys for lists.
* Keep components pure (no side effects in render).

### **Stack & Conventions**

* React + TypeScript (Vite).
* TanStack Router / Start for routing + SSR.
* TanStack Query for data fetching + caching.
* TailwindCSS for styling.
* Zustand for client-side state.
* Drizzle ORM + drizzle-kit for schema + migrations.
* Zod for runtime validation.
* Sentry for error tracking.
* MinIO for object storage.
* Sharp for image processing.
* Use Biome for formatting/linting (`format`, `lint`, `check` scripts).
* Use `tsx` for TS execution in scripts.
* Use `vite-tsconfig-paths` for path aliases.
    * @/components
    * @/db
    * @/features
    * @/hooks
    * @/integrations
    * @/routes
    * @/server
    * @/stores

### Misc
* No tests exists in the project and is not wanted.
* Don't run any pnpm build nor pnpm dev. 
* Ask me for feedback if this is needed. 