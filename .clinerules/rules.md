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
* RustFS for object storage (S3-compatible; it replaced MinIO).
* Sharp for image processing.
* Use oxlint/oxfmt for formatting/linting (`format`, `lint`, `check` scripts). Biome was the
  earlier toolchain and is no longer used.
* Use `tsx` for TS execution in scripts.
* Path aliases resolve through Vite's native `resolve.tsconfigPaths`; `vite-tsconfig-paths` is
  no longer used.
    * ~/components
    * ~/db
    * ~/features
    * ~/hooks
    * ~/routes
    * ~/server
    * ~/stores

### Misc
* No tests exists in the project and is not wanted.
* Don't run any pnpm build nor pnpm dev. 
* Ask me for feedback if this is needed. 

### Troubleshooting, things to remember

#### Problem

In your TanStack Start project, importing server-side code (like db or Node modules such as pg) directly in route files caused browser errors.

Even if client code didn’t use the server functionality, the bundler attempted to include everything from the module.

This happened because server helper functions were defined in the same file as createServerFn, mixing server-only logic with code that was statically imported by routes.

As a result, the browser tried to load Node-only modules, causing runtime errors.

#### Resolution

Separate server functions from internal helpers: Place all createServerFn files inside the /server folder with a .api.ts suffix. These are the only server functions client code or route loaders should import.

Keep internal helpers and DB logic separate: Domain-specific helpers remain suffixless and are only imported by server functions, never by client code.

Client code only imports .api server functions: All data fetching from routes, loaders, or components goes through these .api files, ensuring Node-only modules like pg never reach the client bundle.