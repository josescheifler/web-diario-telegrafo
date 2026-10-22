import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Suspense } from 'react'
import Fecha from '@/components/Fecha'

// 1. Grilla que consulta las noticias publicadas en Neon
async function GrillaNoticias() {
  const notas = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
    include: { author: true }
  })

  if (notas.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500 font-sans">
        Aún no hay noticias publicadas. Ingresá al panel de administración para redactar la primera.
      </div>
    )
  }

  const principal = notas[0]
  const secundarias = notas.slice(1)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Nota Principal */}
      <article className="lg:col-span-8 flex flex-col border-r lg:pr-8 border-gray-200">
        <span className="text-[#D4AF37] font-bold tracking-widest text-xs uppercase mb-2">
          {principal.section}
        </span>
        <Link href={`/nota/${principal.id}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 hover:text-[#D4AF37] transition-colors leading-tight">
            {principal.title}
          </h2>
        </Link>
        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
          {principal.header}
        </p>
        <Link href={`/nota/${principal.id}`}>
          <img 
            src={principal.featuredImage} 
            alt={principal.title} 
            className="w-full max-h-[500px] object-cover border border-gray-200 hover:opacity-90 transition-opacity" 
          />
        </Link>
      </article>

      {/* Notas Secundarias */}
      <aside className="lg:col-span-4 flex flex-col gap-8">
        {secundarias.map((nota) => (
          <article key={nota.id} className="border-b border-gray-200 pb-8 last:border-0">
            <span className="text-[#D4AF37] font-bold tracking-widest text-xs uppercase mb-1 block">
              {nota.section}
            </span>
            <Link href={`/nota/${nota.id}`}>
              <h3 className="text-2xl font-bold mb-2 hover:text-[#D4AF37] transition-colors leading-snug">
                {nota.title}
              </h3>
            </Link>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              {nota.header}
            </p>
            <Link href={`/nota/${nota.id}`}>
              <img 
                src={nota.featuredImage} 
                alt={nota.title} 
                className="w-full h-[200px] object-cover border border-gray-200 hover:opacity-90 transition-opacity" 
              />
            </Link>
          </article>
        ))}

        {/* Espacio Publicitario Lateral */}
        <div className="bg-gray-50 p-6 text-center border border-gray-300 h-[250px] flex items-center justify-center">
          <span className="text-gray-400 text-xs tracking-widest uppercase font-sans">
            Espacio Publicitario
          </span>
        </div>
      </aside>
    </div>
  )
}

// 2. Portada principal
export default function Home() {
  const secciones = ['ECONOMÍA', 'LOCAL', 'REGIONAL', 'MUNDO', 'PAÍS', 'POLÍTICA', 'SOCIEDAD']

  return (
    <div className="min-h-screen bg-white text-[#0a192f] font-serif">
      {/* Cabecera del Diario */}
      <header className="bg-[#0a192f] text-white">
        <div className="container mx-auto px-4 py-6 flex flex-col items-center border-b border-[#D4AF37]/30">
          <Link href="/" className="flex items-center gap-4 group">
            <img 
              src="/favicon.ico" 
              alt="El Telégrafo" 
              className="w-12 h-12 md:w-16 md:h-16 object-contain" 
            />
            <h1 className="text-4xl md:text-7xl font-black text-[#D4AF37] tracking-widest uppercase font-[family-name:var(--font-cinzel)] group-hover:opacity-90 transition">
              El Telégrafo
            </h1>
          </Link>
          <div className="text-sm text-gray-300 font-sans tracking-widest mt-2">
            <Fecha />
          </div>
        </div>
        
        {/* Barra de Secciones */}
        <nav className="container mx-auto px-4 py-3">
          <ul className="flex flex-wrap justify-center gap-6 text-xs md:text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
            {secciones.map(seccion => {
              const url = seccion.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
              return (
                <li key={seccion}>
                  <Link href={`/seccion/${url}`} className="hover:text-white transition-colors">
                    {seccion}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </header>

      {/* Contenido Editorial Principal */}
      <main className="container mx-auto px-4 py-10 bg-white">
        <Suspense fallback={
          <div className="text-center py-20 text-sm font-bold text-gray-400 font-sans">
            Cargando la edición del día...
          </div>
        }>
          <GrillaNoticias />
        </Suspense>
      </main>
    </div>
  )
}