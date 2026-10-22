import type { Metadata } from 'next'
import { Playfair_Display, Cinzel } from 'next/font/google'
import './globals.css'

// Fuente para el cuerpo del texto y bajadas
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-playfair'
})

// Fuente súper sharp, recta y clásica para el nombre "El Telégrafo"
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-cinzel'
})

export const metadata: Metadata = {
  title: 'El Telégrafo | Portal Digital',
  description: 'Diario digital El Telégrafo. Noticias de economía, política, sociedad y actualidad.',
  icons: {
    icon: '/icon.svg', // Conecta con tu archivo app/icon.svg o public/favicon.ico
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${playfair.variable} ${cinzel.variable} font-serif antialiased bg-white text-[#0a192f] selection:bg-[#D4AF37] selection:text-[#0a192f]`}>
        {children}
      </body>
    </html>
  )
}