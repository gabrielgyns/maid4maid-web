---
inclusion: always
---

# Product Context

Maid4Maid is a cleaning service management platform with multi-language support and role-based access control.

## Core Domains

- **Clients**: Customer profiles with multiple addresses
- **Teams**: Staff organization with role assignments
- **Jobs**: Calendar-based scheduling with drag-and-drop
- **Users**: Multi-role authentication system
- **Organizations**: Multi-tenant support

## Business Rules

- Multi-language: English, Spanish, Portuguese (use i18n keys)
- Role-based permissions (admin, manager, staff)
- Organization-scoped data isolation
- Address management per client
- Calendar scheduling with time slots

## User Experience Patterns

- Responsive design (mobile-first approach)
- Dark/light/system theme support
- Form validation with Zod schemas
- Toast notifications for user feedback
- Confirmation dialogs for destructive actions
- Loading states and error handling

## Data Relationships

- Organizations contain Users, Teams, Clients, Jobs
- Users belong to Teams and have Roles
- Clients have multiple Addresses
- Jobs link Clients, Teams, and time slots
- Calendar events represent scheduled Jobs

## Development Guidelines

- Use TypeScript interfaces for all data models
- Implement proper error boundaries
- Follow accessibility standards (ARIA labels)
- Maintain consistent naming conventions
- Use React Query for server state management
- Implement optimistic updates where appropriate
