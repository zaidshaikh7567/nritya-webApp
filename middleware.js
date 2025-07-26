import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Landing page should be SSR
  if (pathname === '/') {
    return NextResponse.next()
  }

  // All other routes should be CSR
  if (pathname.startsWith('/search') || 
      pathname.startsWith('/studio') || 
      pathname.startsWith('/workshop') || 
      pathname.startsWith('/login') ||
      pathname.startsWith('/profile') ||
      pathname.startsWith('/about') ||
      pathname.startsWith('/contact')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 