# Picoteo - Local Marketplace MVP

## About the App
Picoteo is a local marketplace application for seasonal produce and community goods. It connects local business owners with customers in their community, allowing shop owners to list their products and customers to browse and purchase from nearby shops.

### Core Features
- **Customer View**: Browse local shops, view products, manage shopping basket
- **Business Owner View**: Create and manage shops, add products, handle orders
- **Role-based Access**: Dynamic routing based on customer/owner roles
- **Real-time Data**: Powered by Convex for live updates

## Architecture Guidelines

### Component Organization
```
src/
├── app/                    # Next.js app router pages (RENDERING ONLY)
├── components/             # Reusable UI components  
├── forms/                  # Form components with validation
├── hooks/                  # Custom React hooks (business logic)
├── lib/                    # Utility functions and configurations
└── types/                  # TypeScript type definitions
```

### Critical Rules

#### 1. Parent Rendering Only
- **Page components** (`src/app/**/page.tsx`) should ONLY handle rendering
- **NO business logic** in page components - declare everything first
- All logic must be extracted to hooks, utilities, or separate functions
- Pages should be clean, declarative templates

#### 1.5. Inline Components & Minimal Props
- **Prefer inline components** over external files when possible
- **Minimize props** - avoid prop drilling and complex interfaces
- **Sub-components in same file** rather than separate component files
- **Direct data access** over passing data through props when practical

#### 2. Logic Separation
```tsx
// ❌ BAD - Logic mixed with rendering
export default function Page() {
  const [data, setData] = useState();
  const handleSubmit = async (formData) => {
    // complex logic here...
  };
  
  return <div>...</div>;
}

// ✅ GOOD - Logic declared first, rendering separate  
const usePageLogic = () => {
  // all logic here
};

export default function Page() {
  const { data, handleSubmit } = usePageLogic();
  
  return <div>...</div>; // only rendering
}
```

#### 3. Component Guidelines
- **Components** go in `src/components/` - reusable UI only
- **Forms** go in `src/forms/` - with validation schemas
- **Hooks** go in `src/hooks/` - extract all business logic
- **Types** go in `src/types/` - shared TypeScript definitions

#### 4. Form Standards
- All forms use **Zod validation** schemas from `src/forms/schemas.ts`
- Forms use **React Hook Form** with `@hookform/resolvers/zod`
- Form modals use the **FormModal wrapper** (`src/forms/FormModal.tsx`)
- **Keyboard shortcuts**: Esc to close, Enter to submit

#### 5. State Management
- Use **Convex** for server state (queries/mutations)
- Use **React hooks** for local component state
- Extract complex state logic to custom hooks

### Development Commands
```bash
# Start development
npm run dev

# Run linting (if available)
npm run lint

# Run type checking (if available)  
npm run typecheck
```

### Code Style
- **No comments** unless explicitly requested
- **Clean, readable code** with proper TypeScript types
- **Separation of concerns** - logic separate from rendering
- **Consistent naming** - use descriptive function/variable names

### Current Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Convex (serverless functions + real-time database)
- **Forms**: React Hook Form + Zod validation
- **State**: React hooks + Convex queries/mutations

### Architecture Notes
- **Role-based routing** between customer/owner views
- **Real-time updates** via Convex subscriptions  
- **Type-safe** form validation with Zod schemas
- **Clean component architecture** with separated concerns