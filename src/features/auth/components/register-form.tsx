'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
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
import { PasswordStrengthIndicator, PASSWORD_REQUIREMENTS } from './password-strength-indicator';
import { cn } from '@/lib/utils';

const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(PASSWORD_REQUIREMENTS.minLength, `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`)
    .regex(PASSWORD_REQUIREMENTS.hasUppercase, 'Password must contain at least one uppercase letter')
    .regex(PASSWORD_REQUIREMENTS.hasNumber, 'Password must contain at least one number')
    .regex(PASSWORD_REQUIREMENTS.hasSpecial, 'Password must contain at least one special character (@$!%*?&)'),
  organization_name: z.string().min(2, 'Organization name must be at least 2 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus email input on mount
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      organization_name: '',
    },
    mode: 'onChange', // Enable real-time validation
  });

  const password = form.watch('password');

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      // Trim whitespace from email
      const trimmedData = {
        ...data,
        email: data.email.trim(),
      };
      
      await register(trimmedData);
      
      // Success! Show toast and redirect
      toast.success('Account created! Redirecting...', {
        description: 'Welcome to HypertroQ!',
      });
      
      router.push('/dashboard');
    } catch (error) {
      setHasError(true);
      
      // Handle specific error cases
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        const message = error.response?.data?.detail || error.message;
        
        if (status === 409) {
          toast.error('Account already exists', {
            description: 'An account with this email already exists. Try logging in instead.',
          });
        } else if (status === 422) {
          toast.error('Validation error', {
            description: message || 'Please check your input and try again.',
          });
        } else if (status && status >= 500) {
          toast.error('Server error', {
            description: 'Something went wrong on our end. Please try again later.',
          });
        } else {
          toast.error('Registration failed', {
            description: message || 'Please try again.',
          });
        }
      } else {
        toast.error('Registration failed', {
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
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  onChange={(e) => {
                    field.onChange(e);
                  }}
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
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <PasswordStrengthIndicator password={password} className="mt-3" />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="organization_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Your Gym or Organization"
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
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </Button>
      </form>
    </Form>
  );
}
