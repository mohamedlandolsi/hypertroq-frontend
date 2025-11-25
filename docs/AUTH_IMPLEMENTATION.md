# Authentication Implementation - Quick Reference

## ✅ Completed

### 1. **Auth Service** (`src/features/auth/api/auth-service.ts`)
Handles all authentication API calls:
- ✅ `loginUser()` - POST /auth/login (form-urlencoded)
- ✅ `registerUser()` - POST /auth/register (JSON)
- ✅ `getCurrentUserProfile()` - GET /users/me
- ✅ `logoutUser()` - Client-side cleanup

**Important:** Login uses `application/x-www-form-urlencoded`, not JSON!

### 2. **Zustand Store** (`src/features/auth/store/auth-store.ts`)
Global state management with persistence:

**State:**
```typescript
{
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

**Actions:**
- `login(credentials)` - Login and load profile
- `register(data)` - Register and auto-login
- `logout()` - Clear tokens and redirect to /login
- `loadProfile()` - Fetch user profile from /users/me
- `setLoading(loading)` - Manual loading state control

**Features:**
- ✅ Token persistence in localStorage
- ✅ Auto-login after registration
- ✅ Toast notifications (sonner)
- ✅ State persisted via zustand/persist

### 3. **useAuth Hook** (`src/features/auth/hooks/use-auth.ts`)
Convenient hook for accessing auth state:
```typescript
const { user, isAuthenticated, isLoading, login, register, logout, loadProfile } = useAuth();
```

### 4. **ProtectedRoute Component** (`src/features/auth/components/protected-route.tsx`)
Route guard for authenticated pages:
```tsx
<ProtectedRoute redirectTo="/login">
  <DashboardPage />
</ProtectedRoute>
```

Features:
- Auto-loads profile on mount if token exists
- Shows loading spinner
- Redirects to login if not authenticated

### 5. **Usage Examples** (`src/features/auth/USAGE_EXAMPLES.tsx`)
10 comprehensive examples:
1. Login form
2. Register form
3. Protected routes
4. User profile display
5. Navigation guards
6. Profile loading on app mount
7. Conditional rendering
8. Direct store access
9. Logout with confirmation
10. Check auth before actions

## API Contract

### Login
```typescript
POST /auth/login
Content-Type: application/x-www-form-urlencoded

Body: username=user@email.com&password=secret123

Response: {
  access_token: string;
  token_type: "bearer";
  refresh_token?: string;
}
```

### Register
```typescript
POST /auth/register
Content-Type: application/json

Body: {
  email: string;
  password: string;
  full_name: string;
  organization_name: string;
}

Response: User object
```

### Get Profile
```typescript
GET /users/me
Authorization: Bearer <token>

Response: User object
```

## Usage Quick Start

### 1. Login
```tsx
import { useAuth } from '@/features/auth';

function LoginForm() {
  const { login, isLoading } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ username: email, password });
    // Success! Redirects automatically
  };
}
```

### 2. Register
```tsx
const { register, isLoading } = useAuth();

await register({
  email: 'user@example.com',
  password: 'secure123',
  full_name: 'John Doe',
  organization_name: 'My Gym',
});
// Auto-logs in after registration
```

### 3. Protected Page
```tsx
import { ProtectedRoute } from '@/features/auth';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Dashboard Content</div>
    </ProtectedRoute>
  );
}
```

### 4. Display User Info
```tsx
const { user, isAuthenticated, logout } = useAuth();

return (
  <div>
    {isAuthenticated ? (
      <>
        <p>Welcome, {user?.full_name}</p>
        <button onClick={logout}>Logout</button>
      </>
    ) : (
      <Link href="/login">Login</Link>
    )}
  </div>
);
```

### 5. Check Auth Before Action
```tsx
const { isAuthenticated } = useAuth();

const handleSave = () => {
  if (!isAuthenticated) {
    router.push('/login');
    return;
  }
  // Proceed with save
};
```

## Token Flow

1. **Login/Register** → Tokens stored in localStorage
2. **API Requests** → Axios interceptor auto-adds Authorization header
3. **401 Response** → Interceptor clears tokens, shows toast, redirects to /login
4. **Logout** → Tokens removed, state cleared, redirect to /login

## State Persistence

Zustand persists to localStorage with key: `auth-storage`

**Persisted:**
- `user`
- `isAuthenticated`

**Not Persisted:**
- `isLoading` (always starts false)

## Toast Notifications

- ✅ "Logged in successfully!" - on login
- ✅ "Account created successfully!" - on register
- ✅ "Logged out successfully" - on logout
- ❌ Error messages - on failed requests (via axios interceptor)

## Next Steps

1. Create `/login` page with LoginForm component
2. Create `/register` page with RegisterForm component
3. Wrap authenticated pages with `<ProtectedRoute>`
4. Add user menu/dropdown in header
5. Implement "Remember me" functionality (optional)
6. Add token refresh logic if backend supports it
