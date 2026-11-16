import type { Metadata } from 'next'
import { Newsreader, Archivo } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'

// Newsreader: serif pensada para leer noticias (títulos y texto).
// Archivo: sans de la fundidora argentina Omnibus-Type (menú, firmas, formularios).
const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-newsreader',
  display: 'swap',
})

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'El Telégrafo de Los Charrúas | Diario digital de Entre Ríos',
    template: '%s | El Telégrafo de Los Charrúas',
  },
  description:
    'Diario digital de Los Charrúas: noticias de la localidad y de toda la provincia de Entre Ríos. Política, economía, sociedad, país y mundo.',
  openGraph: {
    siteName: 'El Telégrafo de Los Charrúas',
    locale: 'es_AR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-AR" style={{ colorScheme: 'light', backgroundColor: '#ffffff' }}>
      <body
        style={{ colorScheme: 'light', backgroundColor: '#ffffff', color: '#0d1e32' }}
        className={`${newsreader.variable} ${archivo.variable} flex min-h-screen flex-col bg-papel font-serif text-tinta antialiased selection:bg-oro selection:text-tinta`}
      >
        <div className="flex-1 bg-papel">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
