import Link from 'next/link'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Fecha from '@/components/Fecha'

// 1. Le decimos a Next.js exactamente qué URLs existen para evitar el error de pre-renderizado
export function generateStaticParams() {
  return [
    { section: 'economia' },
    { section: 'local' },
    { section: 'regional' },
    { section: 'mundo' },
    { section: 'pais' },
    { section: 'politica' },
    { section: 'sociedad' }
  ]
}

const sectionMap: Record<string, any> = {
  'economia': 'ECONOMIA',
  'local': 'LOCAL',
  'regional': 'REGIONAL',
  'mundo': 'MUNDO',
  'pais': 'PAIS',
  'politica': 'POLITICA',
  'sociedad': 'SOCIEDAD'
}

// 2. Componente que hace la llamada a la BD
async function GrillaSeccion({ section }: { section: string }) {
  const dbSection = sectionMap[section]

  if (!dbSection) return notFound()

  const notas = await prisma.article.findMany({
    where: { 
      section: dbSection,
      published: true 
    },
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  })

  if (notas.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg">
        Aún no hay noticias publicadas en esta categoría.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {notas.map((nota) => (
        <article key={nota.id} className="flex flex-col border-b lg:border-b-0 lg:border-r lg:last:border-0 lg:pr-4 border-gray-200 pb-6">
          <Link href={`/nota/${nota.id}`}>
            {nota.featuredImage && (
              <img src={nota.featuredImage} alt={nota.title} className="w-full h-56 object-cover mb-4 shadow-sm hover:opacity-90 transition" />
            )}
            <h3 className="text-2xl font-bold mb-2 hover:text-[#D4AF37] leading-tight transition-colors">
              {nota.title}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm mb-4 flex-1">{nota.header}</p>
          <div className="text-xs text-gray-400 font-sans border-t pt-2 mt-auto">
            Por {nota.author?.name || 'Redacción'}
          </div>
        </article>
      ))}
    </div>
  )
}

// 3. Componente Principal
export default async function SeccionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  const cleanSection = section.toLowerCase()
  
  const seccionesMenu = ['ECONOMÍA', 'LOCAL', 'REGIONAL', 'MUNDO', 'PAÍS', 'POLÍTICA', 'SOCIEDAD']

  return (
    <div className="min-h-screen bg-white text-[#0a192f] font-serif">
      <header className="bg-[#0a192f] text-white">
        <div className="container mx-auto px-4 py-6 flex flex-col items-center border-b border-[#D4AF37]/30">
          <Link href="/">
            <h1 className="text-5xl md:text-7xl font-black text-[#D4AF37] tracking-widest uppercase mb-2 hover:opacity-90 transition">
              El Telégrafo
            </h1>
          </Link>
          <div className="text-sm text-gray-300 font-sans tracking-widest">
            <Fecha />
          </div>
        </div>
        
        <nav className="container mx-auto px-4 py-3">
          <ul className="flex flex-wrap justify-center gap-6 text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
            {seccionesMenu.map(s => {
              const urlSeccion = s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
              return (
                <li key={s}>
                  <Link href={`/seccion/${urlSeccion}`} className="hover:text-white transition-colors">
                    {s}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold border-b-2 border-[#D4AF37] pb-2 mb-8 uppercase text-[#0a192f]">
          {cleanSection === 'pais' ? 'país' : cleanSection === 'economia' ? 'economía' : cleanSection === 'politica' ? 'política' : cleanSection}
        </h2>

        <Suspense fallback={
          <div className="text-center py-20 text-xl font-bold text-gray-400 animate-pulse">
            Cargando noticias...
          </div>
        }>
          <GrillaSeccion section={cleanSection} />
        </Suspense>
      </main>
    </div>
  )
}