# SprintDesk — Architecture & Technical Design Document

This document details the architectural decisions, state management strategies, security flows, component hierarchies, and performance optimizations implemented in **SprintDesk**.

---

## 1. Architectural Principles

1. **Separation of Concerns**: Business logic is strictly isolated into domain features (`src/features/`), leaving UI components reusable and domain-agnostic (`src/components/ui/`), and page components as composition roots (`src/pages/`).
2. **Single Source of Truth**: The board state in Zustand serves as the single source of truth for tasks. The Kanban board, Dashboard metrics, Task Details drawer, and Analytics charts all compute their views from this shared store using pure selector functions without state duplication.
3. **Resilient Offline-First Experience**: Data is normalized at the API boundary, written to store state, and safely synchronized with `localStorage` with fallback handling for corrupted data.
4. **Zero External UI Kit Dependency**: Every button, modal, drawer, input, and skeleton loader was built from the ground up using Tailwind CSS and accessible WAI-ARIA standards.

---

## 2. Directory Structure

```text
src/
├── app/
│   ├── App.tsx             # Root application component
│   ├── router.tsx          # React Router v6 configuration & code splitting
│   └── providers.tsx       # QueryClientProvider & ErrorBoundary wrappers
│
├── components/
│   ├── ui/                 # Domain-independent reusable UI system
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── Drawer.tsx
│   │   ├── Toast.tsx
│   │   ├── Badge.tsx
│   │   ├── Skeleton.tsx
│   │   ├── DataTable.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── EmptyState.tsx
│   │
│   ├── layout/             # Application shell & layout components
│   │   ├── AppLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── MobileNavigation.tsx
│   │
│   └── ErrorBoundary.tsx   # Top-level React error boundary
│
├── features/
│   ├── auth/               # Authentication domain
│   │   ├── api/authApi.ts
│   │   ├── components/LoginForm.tsx, ProtectedRoute.tsx
│   │   ├── hooks/useAuth.ts
│   │   ├── store/authStore.ts
│   │   └── types.ts
│   │
│   ├── board/              # Board & Task management domain
│   │   ├── api/taskApi.ts
│   │   ├── components/KanbanBoard.tsx, KanbanColumn.tsx, TaskCard.tsx,
│   │   │              TaskDetailsDrawer.tsx, CreateTaskModal.tsx, BoardFilters.tsx
│   │   ├── selectors/boardSelectors.ts
│   │   ├── store/boardStore.ts
│   │   ├── types.ts
│   │   └── utils/taskAdapter.ts
│   │
│   ├── analytics/          # Analytics & Charting domain
│   │   ├── components/VelocityChart.tsx, StatusDistributionChart.tsx,
│   │   │              PriorityBreakdownChart.tsx, CompletionTrendChart.tsx,
│   │   │              AnalyticsSummaryCards.tsx
│   │   └── selectors/analyticsSelectors.ts
│   │
│   └── notifications/      # Real-time polling & notification system
│       ├── api/notificationApi.ts
│       ├── components/NotificationPopover.tsx
│       ├── hooks/useNotificationPolling.ts
│       ├── store/notificationStore.ts
│       └── types.ts
│
├── pages/                  # Page routes (composed with features)
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── BoardPage.tsx
│   └── AnalyticsPage.tsx
│
├── services/               # Core infrastructure services
│   ├── apiClient.ts        # Centralized HTTP request client
│   ├── authInterceptor.ts  # Fetch interceptor with 401 retry queue
│   └── storage.ts          # Safe localStorage abstraction
│
├── hooks/
│   ├── useToast.ts         # Global toast dispatch hook
│   └── useTheme.ts         # Dark/Light theme manager
│
├── lib/
│   └── queryClient.ts      # TanStack Query client configuration
│
├── types/
│   └── common.ts           # Common API & error types
│
├── utils/
│   ├── cn.ts               # Tailwind class merge utility
│   └── date.ts             # Date and relative time helpers
│
├── index.css
└── main.tsx
```

---

## 3. Three-Tier State Management Strategy

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. Server State: TanStack Query v5                          │
│    - API queries & mutations                                │
│    - Notification polling triggers                          │
│    - Caching, garbage collection, and failure retries       │
├─────────────────────────────────────────────────────────────┤
│ 2. Application Client State: Zustand + Persist              │
│    - Auth store (user profile, tokens in memory)            │
│    - Board store (tasks, filters, undo history)             │
│    - Notification store (unread list, popover state)        │
│    - Theme store (light/dark/system mode)                   │
├─────────────────────────────────────────────────────────────┤
│ 3. Local UI State: React useState / useRef                  │
│    - Modal & Drawer visibility                              │
│    - Active drag element in dnd-kit                         │
│    - Local temporary form inputs                            │
│    - Profile and popover open states                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Authentication Lifecycle & Interceptor Flow

```text
User signs in via LoginForm
        │
        ▼
DummyJSON Auth POST /auth/login
        │
        ▼
Receive AccessToken (valid 30m) & RefreshToken
        │
        ▼
AccessToken stored in Memory (Zustand)
RefreshToken stored in secure LocalStorage simulation
        │
        ▼
API Request sent via authFetch()
        │
        ├── Authorization header attached: Bearer <AccessToken>
        │
        ▼
Backend returns 200 OK  ──►  Return parsed response
        │
        ▼
Backend returns 401 Unauthorized
        │
        ├── Has RefreshToken?
        │     ├── NO  ──► Clear auth, logout, redirect /login
        │     └── YES ──► Is another request already refreshing?
        │                   ├── YES ──► Queue request promise
        │                   └── NO  ──► Set isRefreshing = true
        │                                 │
        │                                 ▼
        │                         POST /auth/refresh
        │                                 │
        │                        ┌────────┴────────┐
        │                        ▼                 ▼
        │                     Success           Failure
        │                        │                 │
        │               Update AccessToken     Clear auth & Logout
        │               Process queued reqs    Throw ApiError
        │               Retry original req
        │                        │
        │                        ▼
        └────────────────► Return Response
```

---

## 5. Board Domain & Drag-and-Drop Architecture

The Kanban board relies on `@dnd-kit/core` with `closestCorners` collision detection.

### Flow on Task Drag:
1. **DragStart**: Active task is captured; a floating `<DragOverlay />` clone is rendered.
2. **DragOver**: When hovering over a card in a target column, `moveTask(taskId, targetStatus, index)` updates positions fluidly.
3. **DragEnd**: Final destination is computed:
   - If dropped within same column: `reorderTaskInColumn(id, sourceIdx, destIdx)`.
   - If dropped in different column: `moveTask(id, targetStatus, destIdx)`.
4. **State Snapshot**: Before any modification, the previous task array is saved to `previousTasks` in Zustand.
5. **Undo Action**: Triggering `undoLastMove()` rolls back the exact array and updates column counts and analytics instantly.

---

## 6. Analytics Pure Selectors

All analytics charts are rendered from pure, testable selector functions in `src/features/analytics/selectors/analyticsSelectors.ts`:

- `getTaskStatusDistribution(tasks)`: Summarizes total counts per column for Donut charts.
- `getPriorityBreakdown(tasks)`: Aggregates High, Medium, and Low priorities by column for Stacked Bar charts.
- `getSprintVelocity(tasks)`: Combines historical sprint benchmarks with current sprint commitments and deliverables.
- `getCompletionTrend(tasks)`: Trajectory model showing completed vs remaining scope over a 10-day sprint cycle.
- `getSummaryMetrics(tasks)`: Key indicators including completion rate %, bottleneck column identification, and high-priority risks.

---

## 7. Performance & Optimization

- **Route-Level Code Splitting**: All pages (`LoginPage`, `DashboardPage`, `BoardPage`, `AnalyticsPage`) use `React.lazy()` and `<Suspense />` with tailored skeleton loading screens.
- **Pure Derived Selectors**: Chart calculations are computed inside `useMemo()` hooks to avoid re-calculating on unrelated parent re-renders.
- **Smart Background Polling**: Uses the **Page Visibility API** (`document.visibilityState`) to halt polling intervals when the tab is hidden and resume immediately upon focus.
- **Component Memoization**: `TaskCard` is wrapped with `React.memo()` to prevent unnecessary re-rendering of non-dragged items in large boards.
