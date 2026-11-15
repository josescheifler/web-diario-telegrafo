// Sesión del panel de administración.
//
// La cookie ya no vale "true" (cualquiera podía escribirla a mano): ahora guarda
// un vencimiento firmado con HMAC-SHA256. Sin conocer el secreto del servidor no
// se puede fabricar una cookie válida.
//
// Usa Web Crypto para funcionar tanto en el middleware como en las server actions.

export const SESSION_COOKIE = 'admin_session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 días, en segundos

const encoder = new TextEncoder()

// SESSION_SECRET es opcional: si no está, la firma se deriva de ADMIN_PASSWORD
// (cambiar la contraseña cierra todas las sesiones abiertas).
function getSecret(): string | null {
  const secret = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD
  return secret ? `telegrafo-admin-session:${secret}` : null
}

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function fromHex(hex: string): Uint8Array<ArrayBuffer> | null {
  if (!/^[0-9a-f]{64}$/.test(hex)) return null
  const bytes = new Uint8Array(new ArrayBuffer(32))
  for (let i = 0; i < 32; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes
}

/** Crea el valor de la cookie: "<vencimiento>.<firma>". */
export async function createSessionToken(): Promise<string> {
  const secret = getSecret()
  if (!secret) throw new Error('ADMIN_PASSWORD no está configurada.')

  const expiresAt = String(Date.now() + SESSION_MAX_AGE * 1000)
  const key = await getKey(secret)
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(expiresAt))
  return `${expiresAt}.${toHex(signature)}`
}

/** Devuelve true solo si la firma es auténtica y la sesión no venció. */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  const secret = getSecret()
  if (!secret || !token) return false

  const [expiresAt, signatureHex, ...rest] = token.split('.')
  if (!expiresAt || !signatureHex || rest.length > 0) return false
  if (!/^\d{1,16}$/.test(expiresAt)) return false

  const signature = fromHex(signatureHex)
  if (!signature) return false

  try {
    const key = await getKey(secret)
    const valid = await crypto.subtle.verify('HMAC', key, signature, encoder.encode(expiresAt))
    return valid && Number(expiresAt) > Date.now()
  } catch {
    return false
  }
}
