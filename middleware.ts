import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('admin_session')
  const { pathname } = request.nextUrl

  // Si intenta entrar a cualquier ruta de /admin excepto /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!session || session.value !== 'true') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Si ya inició sesión y quiere ir a /admin/login, mandarlo al panel
  if (pathname === '/admin/login' && session?.value === 'true') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}