---
inclusion: always
---

# Project Structure

## Root Configuration

- `vite.config.ts` - Vite build configuration with path aliases
- `tailwind.config.js` - Tailwind CSS configuration with custom theme
- `tsconfig.json` - TypeScript configuration with path mapping
- `package.json` - Dependencies and npm scripts
- `.eslintrc.js` - ESLint configuration with Rocketseat preset

## Source Code Organization (`src/`)

### Core Application

- `main.tsx` - Application entry point
- `App.tsx` - Root component with providers
- `index.css` - Global styles and CSS variables

### Components (`src/components/`)

- `ui/` - shadcn/ui components (Button, Dialog, Form, etc.)
- `form/` - Custom form components with validation
- `layouts/` - Layout components
- `sidebar/` - Application sidebar components
- `ScheduleCalendar/` - Schedule-specific calendar components

### Pages (`src/pages/`)

- `dashboard/` - Main dashboard page
- `clients/` - Client management pages
- `users/` - User management pages
- `teams/` - Team management pages
- `schedule/` - Job scheduling pages
- `login/`, `register/`, `forgot-password/` - Authentication pages

### Services (`src/services/`)

- `api.service.ts` - Axios configuration with auth interceptors
- `auth.service.ts` - Authentication API calls
- `*.service.ts` - Domain-specific API services (client, user, job, etc.)

### State Management

- `stores/` - Zustand stores for global state
- `contexts/` - React contexts (auth, theme)
- `providers/` - Provider components (TanStack Query)

### Utilities & Configuration

- `hooks/` - Custom React hooks
- `schemas/` - Zod validation schemas and TypeScript types
- `utils/` - Utility functions
- `i18n/` - Internationalization setup and translations

## Path Aliases

- `@/*` maps to `src/*` for clean imports

## Naming Conventions

- **Files**: kebab-case
- **Components**: PascalCase with descriptive names
- **Hooks**: camelCase starting with "use"
- **Services**: camelCase ending with ".service"
- **Types**: PascalCase ending with "Type" or descriptive names
- **Constants**: UPPER_SNAKE_CASE

## Component Structure

- Index files (`index.tsx`) for clean imports
- Co-located styles when needed
- Separate files for complex components
- Group related components in folders

## Import Organization

- External libraries first
- Internal imports with `@/` alias
- Relative imports last
- Automatic sorting via ESLint plugin
