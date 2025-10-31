# CRM Client v2 - Project Setup Complete

## Overview
This is a modern CRM client application built with the exact same tech stack as the sendy-client project.

## Tech Stack

### Core
- **React 19.1.1** - Latest React with improved performance
- **TypeScript 5.8.3** - Type safety and better DX
- **Vite 7.1.2** - Fast build tool and dev server

### State Management
- **Redux Toolkit 2.9.0** - State management
- **RTK Query** - API data fetching and caching
- **React Redux 9.2.0** - React bindings for Redux

### Routing
- **React Router 7.8.2** - Client-side routing with role-based access control

### Styling & UI
- **Tailwind CSS 4.1.13** - Utility-first CSS framework
- **@tailwindcss/vite** - Tailwind CSS Vite plugin
- **shadcn/ui** - High-quality UI components (New York style)
- **Radix UI** - Unstyled, accessible components
- **lucide-react** - Beautiful icons
- **class-variance-authority** - Component variants
- **next-themes** - Dark/light mode support

### Forms & Validation
- **React Hook Form 7.62.0** - Form management
- **Zod 4.1.5** - Schema validation
- **@hookform/resolvers** - Validation resolver for React Hook Form

### HTTP Client
- **Axios 1.11.0** - Promise-based HTTP client with interceptors

### Notifications
- **Sonner 2.0.7** - Toast notifications

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Navbar, DashboardLayout, etc.)
│   └── ui/             # shadcn/ui components (Button, Input, Card, etc.)
├── pages/              # Page components
│   ├── admin/          # Admin-specific pages
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Unauthorized.tsx
│   └── NotFound.tsx
├── redux/              # Redux store and slices
│   ├── features/       # Feature-specific API slices
│   │   └── auth/       # Authentication API
│   ├── store.ts        # Redux store configuration
│   ├── baseApi.ts      # RTK Query base API
│   ├── axiosBaseQuery.ts  # Custom axios base query
│   └── hook.ts         # Typed Redux hooks
├── routes/             # Route configuration
│   └── index.tsx       # Main router setup
├── providers/          # Context providers
│   └── ThemeProvider.tsx
├── lib/                # Utility functions
│   └── utils.ts        # cn() helper and other utilities
├── utils/              # Helper functions
│   ├── withAuth.tsx    # HOC for protected routes
│   └── generateRoutes.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
├── constants/          # Application constants
│   └── role.ts         # User role constants
├── config/             # Configuration files
│   └── index.ts
├── App.tsx             # Root App component
├── main.tsx            # Application entry point
└── index.css           # Global styles with Tailwind 4 theme
```

## Key Features Implemented

### 1. Authentication System
- ✅ Login page with form validation
- ✅ Register page with password confirmation
- ✅ Redux Toolkit Query for auth API calls
- ✅ Protected routes with role-based access control
- ✅ `withAuth` HOC for protecting components
- ✅ Current user query with caching

### 2. Routing
- ✅ React Router 7 setup
- ✅ Role-based dashboard layouts (Admin, Manager, User)
- ✅ Protected routes
- ✅ Unauthorized page
- ✅ 404 Not Found page
- ✅ Automatic redirects based on user role

### 3. UI Components
- ✅ shadcn/ui components (Button, Input, Label, Card)
- ✅ Dark/Light mode toggle
- ✅ Theme provider with localStorage persistence
- ✅ Responsive layouts
- ✅ Toast notifications with Sonner

### 4. Redux Setup
- ✅ Store configuration with Redux Toolkit
- ✅ RTK Query base API with axios
- ✅ Tag-based cache invalidation
- ✅ Typed hooks (useAppDispatch, useAppSelector)
- ✅ Auth API slice with login, register, logout, getCurrentUser

### 5. TypeScript Configuration
- ✅ Strict mode enabled
- ✅ Path aliases (@/*)
- ✅ Proper type definitions for components and APIs
- ✅ Type-safe Redux hooks

## Next Steps

To get started with development:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Update the backend URL:**
   - Edit `.env` file and set `VITE_API_BASE_URL` to your backend URL

4. **Add more features:**
   - Business management pages
   - User management pages
   - Task management pages
   - Content management
   - Analytics dashboard

5. **Add more shadcn/ui components as needed:**
   ```bash
   npx shadcn@latest add [component-name]
   ```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## API Endpoints Expected

The frontend expects the following API endpoints from the backend:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Additional endpoints can be added in:
- `src/redux/features/` - Create new API slices for different resources

## Redux Tag Types

Currently configured tag types for cache invalidation:
- `USER` - Current user data
- `USERS` - User list
- `BUSINESSES` - Business data
- `TASKS` - Task data
- `CONTENT` - Content data
- `LINKS` - Links data

## Role-Based Access Control

Three user roles are supported:
- `ADMIN` - Full access
- `MANAGER` - Intermediate access
- `USER` - Basic access

Routes are protected using the `withAuth` HOC which:
1. Checks if user is authenticated
2. Verifies user has required role
3. Redirects to `/login` if not authenticated
4. Redirects to `/unauthorized` if insufficient permissions

## Component Patterns

### Creating Protected Routes
```typescript
import { withAuth } from "@/utils/withAuth";
import { role } from "@/constants/role";

const ProtectedComponent = withAuth(YourComponent, role.admin);
```

### Using Redux API Hooks
```typescript
import { useLoginMutation } from "@/redux/features/auth/authApi";

const [login, { isLoading, error }] = useLoginMutation();
await login(credentials).unwrap();
```

### Form Validation with Zod
```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

## Build & Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Notes

- The project follows the exact structure of sendy-client
- All TypeScript files use strict mode
- Path aliases are configured for cleaner imports
- Dark mode support is built-in
- Toast notifications are configured with Sonner
- Form validation uses Zod schemas
- API calls use RTK Query with axios base query
- Protected routes use HOC pattern for reusability
