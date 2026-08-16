# SprintDesk — API Documentation

This document outlines all external endpoints, request/response formats, interceptor behaviors, and error handling protocols used in **SprintDesk**.

---

## 1. Authentication Endpoints (DummyJSON)

Base URL: `https://dummyjson.com`

### 1.1 User Login
Authenticates user credentials and returns JWT access & refresh tokens.

- **Method**: `POST`
- **Path**: `/auth/login`
- **Headers**: `Content-Type: application/json`

**Request Body**:
```json
{
  "username": "emilys",
  "password": "emilyspass",
  "expiresInMins": 30
}
```

**Response (200 OK)**:
```json
{
  "id": 1,
  "username": "emilys",
  "email": "emily.smith@x.dummyjson.com",
  "firstName": "Emily",
  "lastName": "Smith",
  "gender": "female",
  "image": "https://dummyjson.com/icon/emilys/128",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5c...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5c..."
}
```

**Error Response (400 Bad Request)**:
```json
{
  "message": "Invalid credentials"
}
```

---

### 1.2 Token Refresh
Generates a new access token when the current access token has expired.

- **Method**: `POST`
- **Path**: `/auth/refresh`
- **Headers**: `Content-Type: application/json`

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5c...",
  "expiresInMins": 30
}
```

**Response (200 OK)**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5c...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5c..."
}
```

---

### 1.3 Authenticated User Profile
Retrieves the profile of the currently authenticated token owner.

- **Method**: `GET`
- **Path**: `/auth/me`
- **Headers**: `Authorization: Bearer <accessToken>`

**Response (200 OK)**:
```json
{
  "id": 1,
  "username": "emilys",
  "email": "emily.smith@x.dummyjson.com",
  "firstName": "Emily",
  "lastName": "Smith",
  "gender": "female",
  "image": "https://dummyjson.com/icon/emilys/128"
}
```

---

## 2. Data & Notification Endpoints (JSONPlaceholder)

Base URL: `https://jsonplaceholder.typicode.com`

### 2.1 Initial Tasks Fetch
Fetches raw todo items used by the SprintDesk Task Adapter to initialize board state.

- **Method**: `GET`
- **Path**: `/todos?_limit=30`

**Response (200 OK)**:
```json
[
  {
    "userId": 1,
    "id": 1,
    "title": "delectus aut autem",
    "completed": false
  },
  {
    "userId": 1,
    "id": 2,
    "title": "quis ut nam facilis et officia qui",
    "completed": false
  }
]
```

---

### 2.2 Notifications Polling
Polls latest posts to simulate incoming team updates and sprint notifications.

- **Method**: `GET`
- **Path**: `/posts?_limit=5`

**Response (200 OK)**:
```json
[
  {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit suscipit recusandae consequuntur expedita et cum..."
  }
]
```

---

## 3. Internal Application Task Model

The JSONPlaceholder raw data is transformed into the following internal domain model:

```typescript
type TaskStatus = 'backlog' | 'in-progress' | 'review' | 'done';
type TaskPriority = 'low' | 'medium' | 'high';

interface Comment {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  assigneeAvatar?: string;
  dueDate: string;
  order: number;
  tags?: string[];
  comments: Comment[];
}
```

---

## 4. API Client & Interceptor Specification

All network requests are made through `apiClient` (`src/services/apiClient.ts`) which wraps `authFetch` (`src/services/authInterceptor.ts`):

1. **Token Injection**: Attaches `Authorization: Bearer <accessToken>` if user is authenticated.
2. **401 Interception**:
   - Detects `401 Unauthorized`.
   - Queues parallel requests if a refresh is already in flight.
   - Calls `/auth/refresh` with the stored `refreshToken`.
   - On success: updates access token in memory, retries original request, and resolves all queued requests.
   - On failure: cleans auth tokens, invokes `logout()`, and redirects to `/login`.
3. **Error Normalization**: Maps non-2xx responses into structured `ApiError` instances containing HTTP status code, server message, and error details.
