# Copilot Instructions for CLINICAL-FRONT-ORIGIN

## Project Overview
- This is an Angular 16+ project (Angular CLI v20) for a clinical management frontend.
- The codebase is organized by feature modules under `src/app/pages/` (e.g., `analysis`, `exams`, `medics`, `patient`, `take-exam`).
- Shared utilities, components, models, and services are under `src/app/shared/`.
- The project uses SCSS for styling and Tailwind CSS (see `tailwind.config.js`).

## Key Architectural Patterns
- **Feature-based structure:** Each domain (e.g., `analysis`, `exams`) has its own `components/`, `models/`, and `services/` folders.
- **Service communication:** Services in each feature (e.g., `analysis.ts`, `exams.ts`) handle API calls and business logic. Shared services (e.g., `alert.ts`, `default-table.ts`) provide cross-cutting utilities.
- **Routing:** App routes are defined in `src/app/app.routes.ts`.
- **Animations:** Custom Angular animations are in `src/app/shared/animations/`.
- **Reusable components:** Common UI elements are in `src/app/shared/components/reusables/`.

## Developer Workflows
- **Start dev server:** `ng serve` (or `npm start`)
- **Run unit tests:** `ng test` (or `npm test`)
- **Build for production:** `ng build`
- **Generate components/services:** Use Angular CLI, e.g., `ng generate component pages/analysis/components/analysis-list`

## Project-Specific Conventions
- **File naming:** Use kebab-case for files and folders, PascalCase for Angular classes.
- **Interfaces:** Request/response interfaces for each feature are in `models/` (e.g., `analysis-request.interface.ts`).
- **No barrel files:** Imports are explicit, not via `index.ts`.
- **SCSS structure:** Global styles in `src/styles.scss`, feature styles in their respective folders.
- **Environment config:** Use `src/environments/` for environment-specific settings.

## Integration & Dependencies
- **API endpoints:** Managed via utility files in `src/app/shared/utils/` (e.g., `endpoints.util.ts`).
- **Tailwind CSS:** Configured in `tailwind.config.js` and used alongside SCSS.
- **No e2e framework by default:** Add your own if needed.

## Examples
- To add a new feature, create a folder under `src/app/pages/` with `components/`, `models/`, and `services/`.
- To add a reusable button, place it in `src/app/shared/components/reusables/` and import it where needed.
- To update API endpoints, edit `src/app/shared/utils/endpoints.util.ts`.

## References
- See `README.md` for basic Angular CLI usage.
- See `src/app/app.routes.ts` for routing structure.
- See `src/app/shared/animations/` for animation patterns.

---

_Keep these conventions and structure in mind when generating or editing code in this project._
