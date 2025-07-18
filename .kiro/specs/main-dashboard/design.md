# Main Dashboard Design Document

## Overview

The Main Dashboard is the central hub of the Maid4Maid platform, providing users with a comprehensive overview of their business operations. The design follows a card-based layout with responsive grid system, role-based content filtering, and real-time data updates. The dashboard prioritizes information hierarchy, accessibility, and mobile-first responsive design.

## Architecture

### Component Hierarchy

```
DashboardPage
├── DashboardHeader
│   ├── WelcomeMessage
│   └── QuickActions
├── MetricsGrid
│   ├── RevenueCard
│   ├── ClientsCard
│   ├── JobsCard
│   └── TeamUtilizationCard
├── TodayScheduleSection
│   ├── ScheduleHeader
│   └── JobsList
│       └── JobCard[]
├── ActivityFeed
│   ├── ActivityHeader
│   └── ActivityList
│       └── ActivityItem[]
└── NotificationBanner (conditional)
```

### State Management

- **Global State (Zustand)**: User role, organization context, theme preferences
- **Server State (TanStack Query)**: Dashboard metrics, today's jobs, activity feed
- **Local State**: Loading states, error states, UI interactions

### Data Flow

1. Dashboard loads → Check user role and permissions
2. Fetch dashboard data based on role (parallel requests)
3. Display loading skeletons while data loads
4. Render components with fetched data
5. Set up real-time updates via polling/websockets
6. Handle error states and retry mechanisms

## Components and Interfaces

### Core Dashboard Component

```typescript
interface DashboardProps {
  className?: string;
}

interface DashboardMetrics {
  revenue: {
    current: number;
    previous: number;
    currency: string;
  };
  clients: {
    total: number;
    active: number;
    new: number;
  };
  jobs: {
    completed: number;
    pending: number;
    inProgress: number;
  };
  teamUtilization: {
    percentage: number;
    activeMembers: number;
    totalMembers: number;
  };
}
```

### Job Schedule Components

```typescript
interface TodayJob {
  id: string;
  clientName: string;
  clientAddress: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  assignedTeam: {
    id: string;
    name: string;
    members: string[];
  };
  specialInstructions?: string;
}

interface JobCardProps {
  job: TodayJob;
  userRole: UserRole;
  onJobClick: (jobId: string) => void;
  onStatusUpdate?: (jobId: string, status: JobStatus) => void;
}
```

### Activity Feed Components

```typescript
interface ActivityItem {
  id: string;
  type:
    | 'client_added'
    | 'job_completed'
    | 'team_updated'
    | 'system_notification';
  title: string;
  description: string;
  timestamp: string;
  relatedEntityId?: string;
  priority: 'low' | 'medium' | 'high';
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
  showTimestamps?: boolean;
}
```

### Quick Actions Component

```typescript
interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  action: () => void;
  requiredPermissions: Permission[];
  variant: 'primary' | 'secondary';
}

interface QuickActionsProps {
  actions: QuickAction[];
  userPermissions: Permission[];
}
```

## Data Models

### Dashboard Data Structure

```typescript
interface DashboardData {
  metrics: DashboardMetrics;
  todayJobs: TodayJob[];
  recentActivity: ActivityItem[];
  notifications: SystemNotification[];
  lastUpdated: string;
}

interface SystemNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  dismissible: boolean;
  expiresAt?: string;
}
```

### Role-Based Data Filtering

```typescript
interface RoleBasedDashboard {
  admin: {
    showFinancialMetrics: true;
    showAllJobs: true;
    showTeamMetrics: true;
    showSystemNotifications: true;
  };
  manager: {
    showFinancialMetrics: true;
    showAllJobs: true;
    showTeamMetrics: true;
    showSystemNotifications: false;
  };
  staff: {
    showFinancialMetrics: false;
    showAllJobs: false; // Only assigned jobs
    showTeamMetrics: false;
    showSystemNotifications: false;
  };
}
```

## Layout Design

### Grid System

- **Desktop (≥1024px)**: 4-column grid for metrics, 2-column for main content
- **Tablet (768px-1023px)**: 2-column grid for metrics, single column for content
- **Mobile (<768px)**: Single column layout with stacked cards

### Card Layout Specifications

```typescript
interface CardLayout {
  metrics: {
    minHeight: '120px';
    padding: '1.5rem';
    borderRadius: '0.75rem';
    shadow: 'shadow-sm';
  };
  schedule: {
    maxHeight: '400px';
    overflow: 'scroll';
    padding: '1rem';
  };
  activity: {
    maxHeight: '300px';
    overflow: 'scroll';
    padding: '1rem';
  };
}
```

### Color Coding System

- **Job Status Colors**:

  - Pending: `text-yellow-600 bg-yellow-50`
  - In Progress: `text-blue-600 bg-blue-50`
  - Completed: `text-green-600 bg-green-50`
  - Overdue: `text-red-600 bg-red-50`

- **Metric Trend Colors**:
  - Positive: `text-green-600`
  - Negative: `text-red-600`
  - Neutral: `text-gray-600`

## Error Handling

### Error States

1. **Network Error**: Display retry button with offline indicator
2. **Permission Error**: Show appropriate access denied message
3. **Data Loading Error**: Display error card with refresh option
4. **Partial Data Error**: Show available data with warning indicators

### Error Recovery

```typescript
interface ErrorRecovery {
  retryAttempts: number;
  retryDelay: number;
  fallbackData: Partial<DashboardData>;
  errorBoundary: boolean;
}
```

## Testing Strategy

### Unit Testing

- **Component Testing**: Test each dashboard component in isolation
- **Hook Testing**: Test custom hooks for data fetching and state management
- **Utility Testing**: Test role-based filtering and data transformation functions

### Integration Testing

- **API Integration**: Test dashboard data fetching with MSW mocks
- **Role-Based Rendering**: Test different dashboard views for each user role
- **Real-time Updates**: Test data refresh and polling mechanisms

### E2E Testing

- **Dashboard Loading**: Test complete dashboard load flow
- **Quick Actions**: Test navigation and modal interactions
- **Responsive Behavior**: Test layout on different screen sizes
- **Accessibility**: Test keyboard navigation and screen reader compatibility

### Test Data Mocking

```typescript
interface MockDashboardData {
  metrics: MockMetrics;
  jobs: MockJob[];
  activities: MockActivity[];
  notifications: MockNotification[];
}
```

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Load non-critical components after initial render
2. **Data Caching**: Cache dashboard data with 5-minute TTL
3. **Skeleton Loading**: Show loading states for better perceived performance
4. **Debounced Updates**: Batch real-time updates to prevent excessive re-renders

### Bundle Optimization

- Code splitting for dashboard-specific components
- Tree shaking for unused chart libraries
- Image optimization for metric icons and illustrations

## Accessibility Features

### ARIA Implementation

- Proper heading hierarchy (h1 → h2 → h3)
- ARIA labels for interactive elements
- ARIA live regions for dynamic content updates
- ARIA expanded/collapsed states for collapsible sections

### Keyboard Navigation

- Tab order follows visual hierarchy
- Enter/Space activation for interactive elements
- Escape key for modal dismissal
- Arrow keys for navigating lists

### Screen Reader Support

- Descriptive alt text for visual elements
- Screen reader announcements for data updates
- Proper form labeling for quick actions
- Context information for metric changes
