# HypertroQ Frontend

Modern fitness platform for gym-goers training for hypertrophy, built with Next.js 15+.

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with custom oklch color system
- **UI Components**: shadcn/ui (Neutral theme base)
- **Icons**: lucide-react
- **HTTP Client**: Custom fetch wrapper with Bearer auth

## Design System

**Brand Colors (oklch)**:
- Light Primary: `oklch(0.55 0.25 270)` - Rich purple-blue
- Dark Primary: `oklch(0.70 0.22 275)` - Lighter vibrant purple
- Accent: `oklch(0.65 0.22 290)` - Bright accent purple
- Charts: 5-color purple/blue spectrum

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── globals.css   # Global styles & design tokens
├── components/
│   ├── ui/          # shadcn primitives (button, input, card, etc.)
│   └── layout/      # Global layouts (Header, Sidebar)
├── features/
│   ├── auth/        # Authentication feature
│   │   ├── api.ts          # Auth API functions
│   │   ├── components.tsx  # LoginForm, RegisterForm
│   │   └── index.ts
│   ├── exercises/   # Exercise management
│   │   ├── api.ts   # Exercise CRUD
│   │   └── index.ts
│   └── programs/    # Program builder
│       ├── api.ts   # Program CRUD
│       └── index.ts
├── hooks/           # Custom React hooks
├── lib/
│   ├── api-client.ts # HTTP client with auth
│   └── utils.ts      # Utilities (cn helper)
└── types/
    └── index.ts     # Global TypeScript interfaces
```

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- Backend API running at `http://localhost:8000`

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Features

### Authentication
- User registration with organization auto-creation
- JWT-based authentication (access + refresh tokens)
- Bearer token storage in localStorage
- Protected routes with authentication guards

### Exercise Management
- Browse exercise library with pagination
- Filter by muscle group, equipment, difficulty
- View detailed exercise information
- Create custom exercises (coaches/trainers)

### Program Builder
- Create training programs
- Add exercises with sets/reps/weight
- Progressive overload tracking
- Share programs with team

## API Client

The app uses a centralized API client (`lib/api-client.ts`) with:

- Automatic Bearer token authentication
- Structured error handling with `APIError` class
- Type-safe request/response interfaces
- Token refresh logic (TODO)

**Example Usage**:

```typescript
import { apiClient } from '@/lib/api-client';

// Authenticated request
const exercises = await apiClient.get('/exercises', { requiresAuth: true });

// Public request
const healthCheck = await apiClient.get('/health');
```

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Adding shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

**Already installed**: button, input, card, dialog, dropdown-menu, avatar, form, label, select, table, sonner

## Architecture

**Feature-Based Organization**: Each feature (auth, exercises, programs) contains:
- `api.ts` - API integration functions
- `components.tsx` - Feature-specific components
- `index.ts` - Public exports

**Benefits**:
- Co-location of related code
- Clear boundaries between features
- Easy to locate and modify functionality
- Scalable as app grows

## Backend Integration

**Backend API**: HypertroQ FastAPI backend at `http://localhost:8000`

**Authentication Flow**:
1. User registers → Backend creates user + organization
2. User logs in → Backend returns access + refresh tokens
3. Frontend stores tokens in localStorage
4. All authenticated requests include `Authorization: Bearer <token>` header

**Type Safety**: TypeScript interfaces in `types/index.ts` match backend DTOs for compile-time safety.

## TODO

- [ ] Implement authentication components (LoginForm, RegisterForm)
- [ ] Create main layout with Sidebar and Header
- [ ] Build exercise list/grid components
- [ ] Implement program builder UI
- [ ] Add token refresh logic to API client
- [ ] Create protected route wrapper
- [ ] Add React Query for caching
- [ ] Implement optimistic updates
- [ ] Add error boundaries
- [ ] Build responsive mobile layouts

## Contributing

1. Create a feature branch
2. Make changes with clear commit messages
3. Test thoroughly
4. Submit PR with description

## License

Private - All rights reserved

