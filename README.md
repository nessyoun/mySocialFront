# Backoffice Social - OCP Group

A production-ready backoffice application for managing social activities, built with Next.js 15, TypeScript, and PrimeReact.

## 🚀 Features

### Core Modules
- **Récréatives**: Travel and recreational activities with ranking system
- **Bourse de fond**: Educational grants with document management
- **Billetterie**: Event ticket reservations with family quotas
- **Badges ETS/Hammams**: Thermal facility access management
- **Foyers**: Social center activities and workshops
- **Prix élèves**: Student grade management and ranking
- **Jeux Ramadan**: Ramadan competitions and games
- **Terrains**: Sports facility reservations (S-1 rule)
- **Tournois Ramadan**: Inter-site football tournament

### Administration
- User management with role-based access control
- Dynamic form builder with conditional fields
- Import/Export functionality
- Audit logs and system monitoring
- Email template management

### Technical Features
- Role-based authentication (Admin, Back-office, Superviseur, Délégué, Collaborateur)
- Responsive design with dark/light theme support
- Real-time eligibility rule validation
- File upload with document management
- Advanced data tables with filtering and export
- Multi-step wizards for complex workflows

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Library**: PrimeReact
- **Styling**: Tailwind CSS
- **State Management**: 
  - React Query (server state)
  - Zustand (UI state)
- **Forms**: React Hook Form + Zod validation
- **Date/Time**: dayjs
- **Testing**: 
  - Jest (unit tests)
  - Playwright (e2e tests)

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run e2e tests
npm run test:e2e

# Build for production
npm run build
```

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (mock endpoints)
│   ├── modules/           # Module-specific pages
│   ├── admin/             # Administration pages
│   ├── shared/            # Shared components (sidebar, toolbar)
│   └── entities/          # TypeScript interfaces
├── components/            # Reusable UI components
│   ├── auth/             # Authentication guards
│   ├── forms/            # Form builder and components
│   ├── layout/           # Layout components
│   └── shared/           # Shared utilities
├── lib/                  # Core business logic
│   ├── auth.ts           # Authentication service
│   ├── rules.ts          # Eligibility and business rules
│   ├── types.ts          # TypeScript definitions
│   └── mock-data.ts      # Mock data for development
├── hooks/                # Custom React hooks
└── stores/               # Zustand stores
```

## 🔐 Authentication & Authorization

The application uses a role-based access control system:

### Roles Hierarchy
1. **Admin**: Full system access
2. **Back-office**: User and activity management
3. **Superviseur**: Dashboard and reporting access
4. **Délégué**: Limited management functions
5. **Collaborateur**: Basic user access

### Test Accounts
- Admin: `admin@ocpgroup.ma` / `password`
- Collaborateur: `user@ocpgroup.ma` / `password`

## 🎯 Key Components

### FormBuilder
Dynamic form generation from JSON schema with Zod validation:

```typescript
const fields: FormField[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    validation: z.string().email()
  }
];

<FormBuilder fields={fields} onSubmit={handleSubmit} />
```

### Guard Component
Route protection with role-based access:

```typescript
<Guard role="admin">
  <AdminPanel />
</Guard>
```

### DataTableWrapper
Standardized data table with filtering, sorting, and export:

```typescript
<DataTableWrapper
  data={users}
  columns={columns}
  onEdit={handleEdit}
  onDelete={handleDelete}
  globalFilterFields={['name', 'email']}
/>
```

## 📋 Business Rules

### Eligibility System
Centralized rules engine in `/src/lib/rules.ts`:

- **Category eligibility**: OE, TAMCA, HC, CDI, CDD
- **Family status**: Single, couple, family with children
- **Seniority requirements**: Minimum years of service
- **Capacity management**: Activity limits and waiting lists
- **Date restrictions**: Registration periods and deadlines

### Module-Specific Rules

#### Récréatives
- Ranking by points then seniority
- 48-hour withdrawal deadline
- Payment required for most activities

#### Terrains
- S-1 reservation rule (next week only)
- Maximum 2 reservations per week
- No same-day multiple reservations

#### Billetterie
- Family quota system (max 4 tickets per event)
- OCP couple restriction (once per year)
- Monthly quota reset

#### Tournois Ramadan
- Maximum 2 teams per site
- 11-16 players per team
- Signed player list required

## 🔌 API Integration

All components are designed with mock APIs that can be easily replaced with real endpoints. Look for `// TODO(api)` comments throughout the codebase.

### Mock API Structure
```
/app/api/
├── users/route.ts         # User CRUD operations
├── activites/route.ts     # Activity management
└── inscriptions/route.ts  # Registration handling
```

### Real API Integration
Replace mock services in:
1. `/src/hooks/useApi.ts` - API hooks
2. `/src/lib/auth.ts` - Authentication service
3. `/src/app/api/*` - Route handlers

## 🧪 Testing

### Unit Tests
```bash
npm test
```

Tests cover:
- Eligibility rules validation
- Capacity management
- Ranking calculations
- Form validation

### E2E Tests
```bash
npm run test:e2e
```

Smoke tests for:
- Authentication flow
- Dashboard navigation
- Activity inscription
- Admin functions

## 🚀 Deployment

The application is ready for deployment on any platform supporting Next.js:

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Environment Variables
Create `.env.local` for local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME="Backoffice Social"
```

### Theme Customization
Modify `/src/app/globals.css` and `/tailwind.config.ts` for custom styling.

## 📝 Development Guidelines

1. **File Organization**: Keep components under 200 lines, use proper imports/exports
2. **Type Safety**: All components are fully typed with TypeScript
3. **Error Handling**: Comprehensive error boundaries and validation
4. **Performance**: Optimized with React Query caching and lazy loading
5. **Accessibility**: WCAG compliant with proper ARIA labels

## 🤝 Contributing

1. Follow the established patterns for new modules
2. Add tests for new business rules
3. Update mock data when adding new features
4. Maintain TypeScript strict mode compliance

## 📞 Support

For questions about implementation or business rules, refer to the functional specification document or contact the development team.