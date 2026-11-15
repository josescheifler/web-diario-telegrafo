import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session'

/** ¿La petición actual trae una sesión de administrador válida? */
export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)
}

/**
 * Debe llamarse al principio de TODA server action del panel.
 * El middleware solo protege las páginas de /admin; las server actions son
 * endpoints públicos y tienen que verificar la sesión por su cuenta.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    redirect('/admin/login')
  }
}
