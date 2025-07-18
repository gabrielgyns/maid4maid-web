---
inclusion: always
---

# Technology Stack

## Build System & Framework

- **Vite** - Fast build tool and dev server
- **React 18+** - Frontend framework with TypeScript
- **TypeScript** - Type-safe JavaScript

## UI & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library
- **class-variance-authority (CVA)** - Component variant management

## State Management & Data

- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management and caching
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

## Routing & Navigation

- **React Router DOM** - Client-side routing

## HTTP & API

- **Axios** - HTTP client with interceptors for auth

## Internationalization

- **React i18next** - Multi-language support
- **i18next-browser-languagedetector** - Language detection

## Development Tools

- **ESLint** - Code linting with Rocketseat config
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting
- **Commitlint** - Commit message linting

## Testing

- **Vitest** - Unit testing framework
- **Testing Library** - React component testing
- **MSW** - API mocking

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues and format
npm run format          # Format code with Prettier
npm run check:types     # TypeScript type checking
npm run check:all       # Run all checks (lint + types)

# Testing
npm run test            # Run tests
npm run test:ui         # Run tests with UI
npm run test:coverage   # Run tests with coverage

# Git Hooks
npm run prepare         # Install Husky hooks
```

## Environment Variables

- `VITE_API_URL` - Backend API URL (defaults to http://localhost:3333/v1)
