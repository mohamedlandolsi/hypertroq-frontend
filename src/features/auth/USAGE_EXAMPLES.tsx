/**
 * Authentication Usage Examples
 * 
 * This file demonstrates how to use the auth store in various scenarios
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useAuthStore, ProtectedRoute } from '@/features/auth';
import type { Exercise } from '@/types';

// ============================================================================
// 1. LOGIN EXAMPLE
// ============================================================================

function LoginPage() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login({
        username: email, // Note: FastAPI expects 'username' not 'email'
        password,
      });
      
      // Success! User is now authenticated
      // Redirect handled by auth store or manually:
      router.push('/dashboard');
    } catch (error) {
      // Error toast already shown by axios interceptor
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

// ============================================================================
// 2. REGISTER EXAMPLE
// ============================================================================

function RegisterPage() {
  const { register, isLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    organization_name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await register(formData);
      
      // Success! User is registered and logged in
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      // Error toast already shown
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.full_name}
        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
        placeholder="Full Name"
        required
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password"
        required
      />
      <input
        type="text"
        value={formData.organization_name}
        onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
        placeholder="Organization Name"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Register'}
      </button>
    </form>
  );
}

// ============================================================================
// 3. PROTECTED ROUTE EXAMPLE
// ============================================================================

function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
        <p>This page is only visible to authenticated users</p>
      </div>
    </ProtectedRoute>
  );
}

// ============================================================================
// 4. USER PROFILE DISPLAY EXAMPLE
// ============================================================================

function UserProfile() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h2>{user.full_name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// ============================================================================
// 5. NAVIGATION GUARD EXAMPLE
// ============================================================================

function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header>
      <nav>
        {isAuthenticated ? (
          <>
            <span>Welcome, {user?.full_name}</span>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/exercises">Exercises</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

// ============================================================================
// 6. LOAD PROFILE ON APP MOUNT EXAMPLE
// ============================================================================

function AppInitializer({ children }: { children: React.ReactNode }) {
  const { loadProfile, isAuthenticated } = useAuth();

  useEffect(() => {
    // If we have a token but no user, load profile
    const token = localStorage.getItem('access_token');
    if (token && !isAuthenticated) {
      loadProfile().catch(() => {
        // Failed to load profile, token might be expired
        console.log('Failed to load profile');
      });
    }
  }, []);

  return <>{children}</>;
}

// ============================================================================
// 7. CONDITIONAL RENDERING BASED ON AUTH STATE
// ============================================================================

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      <h3>{exercise.name}</h3>
      
      {/* Only show edit button to authenticated users */}
      {isAuthenticated && (
        <button>Edit Exercise</button>
      )}
      
      {/* Only show to admins */}
      {user?.role === 'ADMIN' && (
        <button>Delete Exercise</button>
      )}
    </div>
  );
}

// ============================================================================
// 8. DIRECT STORE ACCESS (ADVANCED)
// ============================================================================

function AdvancedComponent() {
  // Access store directly without re-render on every state change
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  
  // Or get the entire state
  const auth = useAuthStore();
  
  return (
    <div>
      <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
      <p>User: {user?.full_name}</p>
    </div>
  );
}

// ============================================================================
// 9. LOGOUT WITH CONFIRMATION
// ============================================================================

function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}

// ============================================================================
// 10. CHECK AUTH STATUS BEFORE ACTION
// ============================================================================

function SaveExerciseButton({ exercise }: { exercise: Exercise }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleSave = async () => {
    if (!isAuthenticated) {
      // Redirect to login
      router.push('/login?redirect=/exercises');
      return;
    }

    // Save exercise (example - implement your own save logic)
    console.log('Saving exercise:', exercise);
    // await apiClient.post('/exercises', exercise);
  };

  return <button onClick={handleSave}>Save Exercise</button>;
}
