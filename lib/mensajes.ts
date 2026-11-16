import prisma from '@/lib/prisma'

export const TIPOS_MENSAJE = ['CONTACTO', 'CARTA'] as const
export type TipoMensaje = (typeof TIPOS_MENSAJE)[number]

export const MOTIVOS_CONTACTO = [
  'Enviar una noticia o un dato',
  'Pedir una corrección o aclaración',
  'Publicidad',
  'Otra consulta',
] as const

export const LIMITES = { nombre: 120, email: 200, localidad: 120, asunto: 160, mensaje: 6000 }

// La tabla Message se agregó después de crear la base. Para no depender de que
// alguien corra `prisma db push`, se crea sola antes de la primera consulta
// (no hace nada si ya existe). Las columnas coinciden con prisma/schema.prisma.
let tablaLista: Promise<void> | null = null

export function asegurarTablaMensajes(): Promise<void> {
  if (tablaLista) return tablaLista

  const creando: Promise<void> = prisma
    .$executeRawUnsafe(
      `CREATE TABLE IF NOT EXISTS "Message" (
        "id" TEXT NOT NULL,
        "kind" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT,
        "locality" TEXT,
        "subject" TEXT,
        "body" TEXT NOT NULL,
        "read" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
      )`
    )
    .then(() => undefined)
    .catch((error: unknown) => {
      tablaLista = null // se reintenta en la próxima consulta
      throw error
    })

  tablaLista = creando
  return creando
}
