# RentHub - GitHub Copilot Instructions

## Project Context

RentHub is a performance-optimized rental platform with a dual-stack architecture:

- **Backend**: Laravel 12 + Filament v4 admin panel (located in `Rental-Platform-main/backend/`)
- **Frontend**: React 19 + TypeScript + Vite (located in `Renthub/`)
- **Performance Goal**: Achieve 95+ Lighthouse performance score
- **Current Performance**: 82/100 with a roadmap to optimize

## Technology Stack

### Backend
- PHP 8.2+
- Laravel 12 framework
- Filament v4 for admin panel
- Laravel Sanctum for API authentication
- MySQL/PostgreSQL database
- RESTful API architecture
- Laravel Scout with Meilisearch for search

### Frontend
- React 19
- TypeScript (strict mode)
- Vite 6 as build tool
- Radix UI for component library
- Tailwind CSS v4 for styling
- TanStack Query for data fetching
- React Router v7 for routing
- Framer Motion for animations

### Performance Tools
- Lighthouse CI for performance auditing
- Performance budgets enforced via `lighthouse-budget.json`
- GitHub Actions for automated CI/CD

## Development Standards

### Architecture Guidelines

#### Backend (Laravel + Filament)
- Follow Laravel best practices and conventions
- Use Eloquent ORM for database interactions
- Implement API resources for structured JSON responses
- Use Form Requests for validation
- Organize Filament resources in `app/Filament/Resources/`
- Keep business logic in Service classes, not Controllers
- Use Laravel Policies for authorization
- Follow PSR-12 coding standards

#### Frontend (React + TypeScript)
- Use functional components with hooks only (no class components)
- Implement strict TypeScript typing (avoid `any`)
- Follow React 19 best practices
- Use Radix UI components for accessibility
- Implement route-based code splitting for performance
- Keep components small and focused (single responsibility)
- Use TanStack Query for server state management
- Organize code by feature/domain

### Code Organization

#### Backend Structure
```
backend/
├── app/
│   ├── Filament/Resources/    # Admin CRUD interfaces
│   ├── Http/Controllers/      # API controllers
│   ├── Models/                # Eloquent models
│   ├── Services/              # Business logic
│   └── Policies/              # Authorization
├── database/migrations/       # Database schema
├── routes/api.php            # API routes
└── tests/                    # PHPUnit tests
```

#### Frontend Structure
```
Renthub/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   └── features/        # Feature-specific components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript types
```

### Performance Requirements

**Critical**: All changes must maintain or improve performance metrics

#### Performance Budgets
- JavaScript bundle: 500KB max
- CSS bundle: 100KB max
- Images: 1000KB max
- First Contentful Paint (FCP): < 1800ms
- Largest Contentful Paint (LCP): < 2500ms
- Total Blocking Time (TBT): < 200ms

#### Performance Best Practices
- Lazy load images and components
- Implement code splitting by route
- Use WebP/AVIF image formats
- Enable Brotli compression
- Minimize render-blocking resources
- Optimize bundle size (use tree-shaking)
- Implement proper caching strategies

### Testing Standards

#### Backend Testing
- Write feature tests for API endpoints
- Use PHPUnit for testing
- Run tests with: `php artisan test`
- Maintain test coverage for critical paths
- Use database factories for test data

#### Frontend Testing
- Write tests for critical user flows
- Follow existing test patterns in the repository
- Test component behavior, not implementation details

### Code Style

#### PHP/Laravel
- Use Laravel Pint for code formatting
- Follow PSR-12 coding standards
- Use type hints for all method parameters and return types
- Write descriptive variable and method names
- Add PHPDoc comments for complex methods

#### TypeScript/React
- Use ESLint for code linting
- Run `npm run lint` before committing
- Prefer functional programming patterns
- Use descriptive component and function names
- Add JSDoc comments for complex functions
- Use consistent file naming: kebab-case for files, PascalCase for components

### Git Workflow

#### Commit Messages
- Use clear, descriptive commit messages
- Follow conventional commits format when possible
- Reference issue numbers when applicable

#### Branch Strategy
- Create feature branches for new work
- Keep changes focused and atomic
- Test locally before pushing

### Documentation

#### When to Update Documentation
- Add/update API endpoints → Update API documentation
- Change database schema → Update schema documentation
- Add new features → Update relevant README files
- Performance optimizations → Document impact in commit message

#### Documentation Files
- `README.md` - Main project overview
- `PROJECT_STRUCTURE.md` - Project organization
- `LIGHTHOUSE_QUICK_START.md` - Performance optimization guide
- `LIGHTHOUSE_README.md` - Navigation hub
- `PERFORMANCE_ROI.md` - Business case and metrics

### Security

#### Backend Security
- Validate all user input
- Use Laravel's CSRF protection
- Implement proper authentication with Sanctum
- Use Laravel Policies for authorization
- Sanitize database queries (use Eloquent ORM)
- Keep dependencies updated

#### Frontend Security
- Sanitize user input before rendering
- Use environment variables for sensitive data
- Implement proper CORS configuration
- Validate API responses

### API Development

#### API Standards
- Use RESTful conventions
- Return consistent JSON structure
- Include proper HTTP status codes
- Implement pagination for list endpoints
- Version APIs when making breaking changes
- Document all endpoints

#### API Response Format
```json
{
  "data": {},
  "message": "Success message",
  "status": 200
}
```

### Database

#### Migration Guidelines
- Never modify existing migrations in production
- Create new migrations for schema changes
- Use descriptive migration names
- Add indexes for foreign keys and frequently queried columns
- Test migrations both up and down

#### Model Conventions
- Define fillable or guarded properties
- Add relationships between models
- Use accessors/mutators for data transformation
- Implement model events when needed

### Filament Admin Panel

#### Resource Guidelines
- Create Filament resources for CRUD operations
- Use form builders for complex forms
- Implement table filters and actions
- Add proper validation rules
- Use relationship managers for related data
- Customize list and form views as needed

### Frontend Components

#### Component Guidelines
- Keep components small and focused
- Use Radix UI for accessible components
- Implement proper TypeScript types
- Use Tailwind CSS for styling
- Optimize for performance (lazy loading, memoization)
- Make components reusable when possible

### Build and Deployment

#### Backend Build
```bash
cd Rental-Platform-main/backend
composer install
php artisan migrate
php artisan serve
```

#### Frontend Build
```bash
cd Renthub
npm install
npm run dev          # Development
npm run build        # Production build
npm run preview      # Preview production build
```

### Continuous Integration

#### Automated Checks
- Lighthouse CI runs on every PR
- Performance budgets are enforced
- Tests must pass before merging
- Code quality checks via linters

#### Performance Monitoring
- Monitor Lighthouse scores
- Track Core Web Vitals
- Review bundle sizes
- Check for regressions

## Common Tasks

### Adding a New API Endpoint
1. Create route in `routes/api.php`
2. Create controller in `app/Http/Controllers/`
3. Add validation via Form Request
4. Implement business logic in Service class
5. Return API Resource response
6. Write feature tests
7. Document the endpoint

### Creating a New Filament Resource
1. Run: `php artisan make:filament-resource ModelName`
2. Define form fields in `form()` method
3. Configure table columns in `table()` method
4. Add filters, actions, and bulk actions
5. Implement authorization in Policy
6. Test in admin panel

### Adding a New React Component
1. Create component file in appropriate directory
2. Define TypeScript types/interfaces
3. Implement component with proper props
4. Add Tailwind CSS styling
5. Export component
6. Use in parent component
7. Test functionality

### Optimizing Performance
1. Analyze bundle size: Check `npm run build` output
2. Implement code splitting for routes
3. Lazy load images with loading="lazy"
4. Use WebP/AVIF image formats
5. Minimize JavaScript execution
6. Test with Lighthouse: Check CI results
7. Monitor Core Web Vitals

## Troubleshooting

### Backend Issues
- Clear cache: `php artisan cache:clear`
- Clear config: `php artisan config:clear`
- Rebuild autoload: `composer dump-autoload`
- Check logs: `storage/logs/laravel.log`

### Frontend Issues
- Clear Vite cache: `rm -rf node_modules/.vite`
- Rebuild dependencies: `rm -rf node_modules && npm install`
- Check browser console for errors
- Review network requests in DevTools

## Key Priorities

1. **Performance First**: All changes should maintain or improve performance metrics
2. **Type Safety**: Use TypeScript strictly, avoid `any` types
3. **Code Quality**: Follow linting rules and conventions
4. **Testing**: Write tests for critical functionality
5. **Documentation**: Keep documentation up-to-date
6. **Security**: Validate input, sanitize output, follow security best practices
7. **Accessibility**: Use semantic HTML and ARIA attributes where needed
8. **User Experience**: Optimize for fast load times and smooth interactions

## Resources

### Internal Documentation
- [LIGHTHOUSE_README.md](../LIGHTHOUSE_README.md) - Navigation hub
- [LIGHTHOUSE_QUICK_START.md](../LIGHTHOUSE_QUICK_START.md) - Implementation guide
- [PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md) - Project organization
- [PERFORMANCE_ROI.md](../PERFORMANCE_ROI.md) - Business case

### External Resources
- [Laravel Documentation](https://laravel.com/docs)
- [Filament Documentation](https://filamentphp.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Web.dev Performance](https://web.dev/performance/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)

## Notes for Copilot

- When making changes, consider the impact on performance metrics
- Follow the existing code patterns and conventions in the repository
- Ask for clarification if the requirements are ambiguous
- Suggest performance optimizations when relevant
- Keep changes minimal and focused on the specific task
- Test changes locally when possible before suggesting them
- Consider accessibility in UI changes
- Maintain backward compatibility unless explicitly asked to make breaking changes
