# MSW Testing Implementation Design

## Overview

This design document outlines the implementation of Mock Service Worker (MSW) for the Maid4Maid frontend application. The solution provides comprehensive API mocking capabilities for testing and development, organized around the existing service architecture and data models. The implementation follows a modular approach that mirrors the current service structure while providing flexibility for future GraphQL migration.

## Architecture

### Core Components

```
src/
├── mocks/
│   ├── browser.ts          # Browser MSW setup
│   ├── server.ts           # Node.js MSW setup
│   ├── handlers/           # Request handlers by domain
│   │   ├── index.ts        # Combined handlers export
│   │   ├── auth.handlers.ts
│   │   ├── client.handlers.ts
│   │   ├── user.handlers.ts
│   │   ├── team.handlers.ts
│   │   ├── job.handlers.ts
│   │   ├── address.handlers.ts
│   │   ├── organization.handlers.ts
│   │   └── role.handlers.ts
│   ├── data/               # Mock data generators
│   │   ├── index.ts
│   │   ├── auth.data.ts
│   │   ├── client.data.ts
│   │   ├── user.data.ts
│   │   ├── team.data.ts
│   │   ├── job.data.ts
│   │   ├── address.data.ts
│   │   ├── organization.data.ts
│   │   └── role.data.ts
│   └── utils/              # Mock utilities
│       ├── response.utils.ts
│       ├── auth.utils.ts
│       └── data.utils.ts
├── test/
│   ├── setup.ts            # Test environment setup
│   └── utils/
│       └── test.utils.ts   # Test helper functions
```

### Integration Points

- **Vite Configuration**: MSW worker registration for development mode
- **Vitest Setup**: Automatic MSW server initialization for tests
- **Environment Detection**: Conditional MSW activation based on environment
- **Service Layer**: Transparent integration with existing Axios-based services

## Components and Interfaces

### Handler Structure

Each domain handler follows a consistent pattern:

```typescript
// Example: auth.handlers.ts
import { http, HttpResponse } from 'msw';
import { authData } from '../data/auth.data';
import {
  createSuccessResponse,
  createErrorResponse,
} from '../utils/response.utils';

export const authHandlers = [
  // POST /auth/login
  http.post('/api/v1/auth/login', async ({ request }) => {
    const body = await request.json();
    // Handler logic
    return HttpResponse.json(createSuccessResponse(data));
  }),

  // Additional auth endpoints...
];
```

### Data Generator Pattern

Mock data generators provide realistic, type-safe data:

```typescript
// Example: user.data.ts
import { faker } from '@faker-js/faker';
import type { User, CreateUserRequest } from '@/schemas/user.types';

export const createMockUser = (overrides?: Partial<User>): User => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  role: faker.helpers.arrayElement(['admin', 'manager', 'staff']),
  organizationId: faker.string.uuid(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides,
});

export const createMockUsers = (count: number = 10): User[] =>
  Array.from({ length: count }, () => createMockUser());
```

### Response Utilities

Standardized response formatting:

```typescript
// response.utils.ts
export const createSuccessResponse = <T>(data: T, message?: string) => ({
  success: true,
  data,
  message: message || 'Operation successful',
});

export const createErrorResponse = (message: string, code?: string) => ({
  success: false,
  error: {
    message,
    code: code || 'GENERIC_ERROR',
  },
});

export const createPaginatedResponse = <T>(
  items: T[],
  page: number = 1,
  limit: number = 10,
) => ({
  success: true,
  data: {
    items: items.slice((page - 1) * limit, page * limit),
    pagination: {
      page,
      limit,
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
    },
  },
});
```

## Data Models

### Mock Data Relationships

The mock data maintains referential integrity across domains:

- **Organizations** → **Users**, **Teams**, **Clients**, **Jobs**
- **Users** → **Teams** (many-to-many through assignments)
- **Clients** → **Addresses** (one-to-many)
- **Jobs** → **Clients**, **Teams**, **Addresses** (many-to-one)
- **Roles** → **Users** (one-to-many)

### Data Persistence Strategy

For testing consistency, mock data uses in-memory storage with reset capabilities:

```typescript
// data.utils.ts
class MockDataStore {
  private data: Map<string, any[]> = new Map();

  get<T>(key: string): T[] {
    return this.data.get(key) || [];
  }

  set<T>(key: string, items: T[]): void {
    this.data.set(key, items);
  }

  reset(): void {
    this.data.clear();
  }

  seed(): void {
    // Initialize with default data
  }
}

export const mockStore = new MockDataStore();
```

## Error Handling

### Error Response Patterns

MSW handlers implement consistent error handling:

```typescript
// Common error scenarios
const errorHandlers = {
  unauthorized: () =>
    HttpResponse.json(
      createErrorResponse('Unauthorized access', 'UNAUTHORIZED'),
      { status: 401 },
    ),

  forbidden: () =>
    HttpResponse.json(
      createErrorResponse('Insufficient permissions', 'FORBIDDEN'),
      { status: 403 },
    ),

  notFound: (resource: string) =>
    HttpResponse.json(
      createErrorResponse(`${resource} not found`, 'NOT_FOUND'),
      { status: 404 },
    ),

  validationError: (errors: string[]) =>
    HttpResponse.json(
      createErrorResponse('Validation failed', 'VALIDATION_ERROR'),
      { status: 422 },
    ),
};
```

### Authentication Simulation

Mock authentication state management:

```typescript
// auth.utils.ts
export class MockAuthState {
  private currentUser: User | null = null;
  private token: string | null = null;

  login(user: User): string {
    this.currentUser = user;
    this.token = faker.string.alphanumeric(32);
    return this.token;
  }

  logout(): void {
    this.currentUser = null;
    this.token = null;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

export const mockAuth = new MockAuthState();
```

## Testing Strategy

### Test Environment Setup

```typescript
// test/setup.ts
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '@/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Test Utilities

Helper functions for common testing scenarios:

```typescript
// test/utils/test.utils.ts
export const createAuthenticatedUser = (role: string = 'admin') => {
  const user = createMockUser({ role });
  mockAuth.login(user);
  return user;
};

export const mockApiError = (
  endpoint: string,
  status: number,
  message: string,
) => {
  server.use(
    http.get(endpoint, () =>
      HttpResponse.json(createErrorResponse(message), { status }),
    ),
  );
};

export const waitForApiCall = async (endpoint: string) => {
  // Implementation for waiting for specific API calls
};
```

### Component Testing Integration

```typescript
// Example component test
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAuthenticatedUser } from '@/test/utils/test.utils'
import UserList from '@/pages/users'

test('displays user list', async () => {
  createAuthenticatedUser('admin')

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })

  render(
    <QueryClientProvider client={queryClient}>
      <UserList />
    </QueryClientProvider>
  )

  expect(await screen.findByText(/users/i)).toBeInTheDocument()
})
```

### Development Mode Integration

Optional MSW activation for development:

```typescript
// main.tsx
async function enableMocking() {
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === 'true') {
    const { worker } = await import('./mocks/browser')
    return worker.start({
      onUnhandledRequest: 'warn'
    })
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
})
```

### Configuration Management

Environment-based MSW configuration:

```typescript
// vite.config.ts additions
export default defineConfig({
  // ... existing config
  define: {
    __MSW_ENABLED__: JSON.stringify(process.env.VITE_ENABLE_MSW === 'true'),
  },
});
```

This design provides a comprehensive, maintainable MSW implementation that supports the current REST API structure while being flexible enough to adapt to future GraphQL migration.
