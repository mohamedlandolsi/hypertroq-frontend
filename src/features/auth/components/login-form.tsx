'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '../hooks/use-auth';
import { PasswordInput } from './password-input';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus email input on mount
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange', // Enable real-time validation
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      // Trim whitespace from email
      const user = await login({
        email: data.email.trim(),
        password: data.password,
      });
      
      // Check if account is pending deletion
      if (user.deletion_requested_at) {
        // Redirect to account recovery page
        router.push('/account-recovery');
        return;
      }

      // Normal login - redirect to dashboard
      toast.success('Welcome back!', {
        description: 'You have been logged in successfully.',
      });
      router.push('/dashboard');
    } catch (error) {
      setHasError(true);
      
      // Handle specific error cases
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.detail;
        
        if (status === 401) {
          toast.error('Invalid credentials', {
            description: 'The email or password you entered is incorrect.',
          });
        } else if (status === 403) {
          toast.error('Account disabled', {
            description: 'Your account has been disabled. Please contact support.',
          });
        } else if (status === 429) {
          toast.error('Too many attempts', {
            description: 'Please wait a moment before trying again.',
          });
        } else if (status && status >= 500) {
          toast.error('Server error', {
            description: 'Something went wrong on our end. Please try again later.',
          });
        } else {
          toast.error('Login failed', {
            description: message || 'Please check your credentials and try again.',
          });
        }
      } else {
        toast.error('Login failed', {
          description: 'An unexpected error occurred. Please try again.',
        });
      }
      
      // Reset error animation after a short delay
      setTimeout(() => setHasError(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className={cn(
          'space-y-6 transition-transform',
          hasError && 'animate-shake'
        )}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={isLoading}
                  {...field}
                  ref={emailInputRef}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>
    </Form>
  );
}
