import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session'

// Redirige según el estado de la sesión. Es solo la primera barrera: cada
// server action vuelve a verificar la sesión con requireAdmin() (lib/auth.ts).
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const loggedIn = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)

  // Si intenta entrar a cualquier ruta de /admin excepto /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !loggedIn) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Si ya inició sesión y quiere ir a /admin/login, mandarlo al panel
  if (pathname === '/admin/login' && loggedIn) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
