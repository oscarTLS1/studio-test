import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware is currently disabled as authentication is handled client-side
// within the AuthProvider and AdminLayout.
// If server-side route protection is needed later (e.g., using cookies or tokens),
// this file can be updated.
export function middleware(request: NextRequest) {
  // console.log("Middleware executing for:", request.nextUrl.pathname);

  // Allow all requests to proceed for now.
  return NextResponse.next();
}

// Define paths where the middleware should NOT run (if needed).
// Currently, it runs everywhere by default if not disabled.
export const config = {
  // Example: matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
   matcher: [], // Disable middleware for all paths for now
};
