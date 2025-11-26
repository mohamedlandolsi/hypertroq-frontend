/**
 * Global TypeScript type definitions for HypertroQ
 */

export interface User {
  id: string;
  email: string;
  full_name: string;
  organization_id: string;
  organization_name?: string; // Optional: may be included in profile response
  role: 'USER' | 'ADMIN';
  is_active: boolean;
  is_verified: boolean;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  subscription_tier: 'FREE' | 'PRO' | 'ENTERPRISE';
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  equipment: string;
  muscle_contributions: Record<string, number>;
  image_url: string | null;
  is_global: boolean;
  created_by_user_id: string | null;
  organization_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  structure_type: 'WEEKLY' | 'BLOCK' | 'CUSTOM';
  organization_id: string;
  created_at: string;
  updated_at: string;
}
