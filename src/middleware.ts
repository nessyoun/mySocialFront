import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes and their required roles
const protectedRoutes = {
  '/dashboard': ['admin', 'back-office', 'superviseur'],
  '/admin': ['admin'],
  '/admin/users': ['admin', 'back-office'],
  '/admin/roles': ['admin'],
  '/activites/create': ['admin', 'back-office'],
  '/modules': ['admin', 'back-office', 'superviseur']
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if route is protected
  const requiredRoles = Object.entries(protectedRoutes).find(([route]) => 
    pathname.startsWith(route)
  )?.[1];

  if (requiredRoles) {
    // TODO(api): Implement proper JWT token validation
    const authCookie = request.cookies.get('auth-token');
    
    if (!authCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // TODO(api): Validate token and check user role
    // For now, we'll rely on client-side auth checks
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/activites/create/:path*',
    '/modules/:path*'
  ]
};