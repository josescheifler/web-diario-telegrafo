import type { Metadata } from 'next'
import { Bodoni_Moda, Newsreader, Archivo } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'

// Bodoni Moda: didona de alto contraste, para el nombre del diario y los títulos.
// Newsreader: serif pensada para leer noticias (bajadas y cuerpo de las notas).
// Archivo: sans de la fundidora argentina Omnibus-Type (menú, firmas, formularios).
const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-bodoni',
  display: 'swap',
})

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
        className={`${bodoni.variable} ${newsreader.variable} ${archivo.variable} flex min-h-screen flex-col bg-papel font-serif text-tinta antialiased selection:bg-oro selection:text-tinta`}
      >
        <div className="flex-1 bg-papel">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
