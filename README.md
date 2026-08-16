# SprintDesk — Enterprise Sprint Management Dashboard

**SprintDesk** is a production-grade, architectural React application built for modern engineering teams to manage active agile sprints, track velocity, and monitor deliverables. Built with zero external UI kits, clean separation of concerns, multi-tier state management, automated JWT token refresh with request retry, fluid @dnd-kit drag-and-drop, and Recharts analytics calculated directly from application state.

---

## Key Features

1. **Enterprise Authentication Lifecycle**:
   - Integrated with DummyJSON Auth (`/auth/login` and `/auth/refresh`).
   - Token separation: Access token in memory/Zustand, Refresh token in secure storage.
   - Automatic `401 Unauthorized` interceptor with request queuing and retry.
   - Session restoration on reload and protected route redirection.
   - Quick-switch demo account buttons for seamless evaluation.

2. **Fluid Kanban Sprint Board**:
   - 4 development columns: **Backlog**, **In Progress**, **In Review**, and **Done**.
   - Integrated `@dnd-kit/core` & `@dnd-kit/sortable` with `Pointer` and `Keyboard` sensors.
   - Reorder within columns or drag across columns with live dynamic column counts.
   - Undo Move history tracking with instant state rollback.
   - Initial 30-task seed data adapter from JSONPlaceholder with reset capability.

3. **Task Management & Slide-Over Drawer**:
   - Slide-over detail panel with focus trap, Escape listener, and return-focus management.
   - Live inline editable title, description, priority, status, assignee, and due dates.
   - Threaded comments system with user avatars and relative timestamps.
   - Task creation modal with validation and safe destructive deletion confirmation dialogs.

4. **Pure State-Driven Analytics**:
   - Zero hardcoded chart data; all charts derive directly from the board store.
   - **Sprint Velocity**: Historical vs current sprint commitment and completion.
   - **Status Distribution**: Donut chart breakdown across workflow stages.
   - **Priority Breakdown**: Stacked bar chart of High, Medium, and Low priorities by column.
   - **Burndown & Completion Trend**: Cumulative gradient area chart.
   - 2x2 responsive desktop grid collapsing cleanly to a 1-column mobile layout.

5. **Smart Simulated Real-Time Notifications**:
   - Background polling against JSONPlaceholder posts.
   - **Page Visibility API**: Automatically pauses polling when the browser tab is hidden to save power and network bandwidth, resuming immediately upon tab focus.
   - Real-time toast alerts when new notifications arrive and the notification panel is closed.
   - Unread badge counter, mark as read, and clear all controls.

6. **Custom Design System & Theming**:
   - Hand-crafted Tailwind CSS components: `Button`, `Input`, `Select`, `Modal`, `Drawer`, `Toast`, `Badge`, `Skeleton`, `DataTable`, `ConfirmDialog`, `EmptyState`.
   - Dark and Light mode toggle persisted to localStorage with zero flash.
   - Fully responsive design from 375px mobile viewports to ultra-wide displays.

7. **Strict Testing & Code Quality**:
   - 100% strict TypeScript without unsafe `any`.
   - Vitest and React Testing Library test suites for `boardStore`, `useToast`, `authInterceptor`, `analyticsSelectors`, and `taskAdapter`.

---

## Tech Stack

| Domain | Technology |
|---|---|
| **Core Framework** | React 18 (Strict Mode), TypeScript 5.7, Vite 6 |
| **Server State** | TanStack Query v5 (`@tanstack/react-query`) |
| **Client State** | Zustand 5 with custom persistence & memoized selectors |
| **Routing** | React Router v6 with `React.lazy()` route splitting |
| **Styling** | Tailwind CSS v3 (Dark Mode `class`), Tailwind Merge, CLSX |
| **Drag & Drop** | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` |
| **Charts** | Recharts v2 |
| **Icons** | Lucide React |
| **Testing** | Vitest 3, React Testing Library, JSDOM |

---

## Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation
```bash
# Clone repository and enter directory
cd Assignment

# Install dependencies
npm install
```

### Environment Variables
Copy the example environment configuration:
```bash
cp .env.example .env
```

Default variables in `.env`:
```env
VITE_APP_NAME=SprintDesk
VITE_AUTH_API_URL=
VITE_DATA_API_URL=
VITE_NOTIFICATION_POLL_INTERVAL_MS=
```

### Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### Demo Credentials
You can log in using either the quick-fill demo buttons on the login page or enter manually:
- **Username**: `emilys` / **Password**: `emilyspass`
- **Username**: `michaelw` / **Password**: `michaelwpass`

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite local development server |
| `npm run build` | Compiles TypeScript and builds production bundle into `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run test` | Runs all Vitest unit tests |
| `npm run test:watch` | Runs Vitest in interactive watch mode |

---

## Architecture & Data Flow Overview

```text
Server Data (DummyJSON / JSONPlaceholder)
        │
        ▼
   API Client & Auth Interceptor (401 auto-refresh & request queue)
        │
        ▼
   Task Adapter (Maps raw API to rich SprintDesk entities)
        │
        ▼
   Zustand Store (Single Source of Truth + LocalStorage Persistence)
        │
   ┌────┴────────────────────────┬────────────────────────┐
   ▼                             ▼                        ▼
Kanban Board & Cards       Dashboard Metrics       Analytics Selectors
(dnd-kit drag & drop)      (KPIs & Health)         (Velocity, Donut, Trend)
   │
   ▼
Task Details Drawer & Modals
```

For a comprehensive breakdown of architectural decisions, state layers, and performance considerations, see [ARCHITECTURE.md](file:///c:/Users/Shivam%20jain/Downloads/Assignment/ARCHITECTURE.md).

For endpoint definitions, interceptor logic, and error handling contracts, see [API.md](file:///c:/Users/Shivam%20jain/Downloads/Assignment/API.md).
