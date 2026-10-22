import type { Metadata } from 'next'
import { Playfair_Display, Cinzel } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-playfair'
})

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-cinzel'
})

export const metadata: Metadata = {
  title: 'El Telégrafo | Portal Digital',
  description: 'Diario digital El Telégrafo. Noticias de economía, política, sociedad y actualidad.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" style={{ colorScheme: 'light', backgroundColor: '#ffffff' }}>
      <body 
        style={{ colorScheme: 'light', backgroundColor: '#ffffff', color: '#0a192f' }}
        className={`${playfair.variable} ${cinzel.variable} font-serif antialiased bg-white text-[#0a192f] selection:bg-[#D4AF37] selection:text-[#0a192f] min-h-screen flex flex-col justify-between`}
      >
        <div className="bg-white">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}