'use client';

import { useMemo } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordRequirement {
  label: string;
  regex: RegExp;
  met: boolean;
}

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({ password, className }: PasswordStrengthIndicatorProps) {
  const requirements = useMemo((): PasswordRequirement[] => {
    return [
      {
        label: 'At least 8 characters',
        regex: /.{8,}/,
        met: /.{8,}/.test(password),
      },
      {
        label: 'One uppercase letter',
        regex: /[A-Z]/,
        met: /[A-Z]/.test(password),
      },
      {
        label: 'One number',
        regex: /[0-9]/,
        met: /[0-9]/.test(password),
      },
      {
        label: 'One special character (@$!%*?&)',
        regex: /[@$!%*?&]/,
        met: /[@$!%*?&]/.test(password),
      },
    ];
  }, [password]);

  const strength = useMemo(() => {
    const metCount = requirements.filter((r) => r.met).length;
    return {
      score: metCount,
      percentage: (metCount / requirements.length) * 100,
      label: metCount === 0 ? 'Very Weak' : metCount === 1 ? 'Weak' : metCount === 2 ? 'Fair' : metCount === 3 ? 'Good' : 'Strong',
    };
  }, [requirements]);

  const getStrengthColor = (percentage: number) => {
    if (percentage <= 25) return 'bg-red-500';
    if (percentage <= 50) return 'bg-orange-500';
    if (percentage <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthTextColor = (percentage: number) => {
    if (percentage <= 25) return 'text-red-500';
    if (percentage <= 50) return 'text-orange-500';
    if (percentage <= 75) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (!password) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Strength Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Password strength</span>
          <span className={cn('font-medium', getStrengthTextColor(strength.percentage))}>
            {strength.label}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300 ease-out',
              getStrengthColor(strength.percentage)
            )}
            style={{ width: `${strength.percentage}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <ul className="space-y-1.5">
        {requirements.map((requirement, index) => (
          <li
            key={index}
            className={cn(
              'flex items-center gap-2 text-xs transition-colors duration-200',
              requirement.met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
            )}
          >
            {requirement.met ? (
              <Check className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
            )}
            <span>{requirement.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Export password validation regex for use in Zod schema
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).{8,}$/;

export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasNumber: /[0-9]/,
  hasSpecial: /[@$!%*?&]/,
};
