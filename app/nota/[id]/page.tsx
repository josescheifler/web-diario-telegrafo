import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

// Componente asíncrono que consulta Prisma y espera los params
async function DetalleNota({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const article = await prisma.article.findUnique({
    where: { id },
    include: { author: true }
  })

  if (!article) return notFound()

  const fecha = new Date(article.createdAt).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <main className="max-w-4xl mx-auto p-6 lg:p-12 bg-white text-[#0a192f] font-serif min-h-screen">
      <span className="text-[#D4AF37] font-bold tracking-widest text-xs uppercase mb-2 block font-sans">
        {article.section}
      </span>
      <h1 className="text-4xl md:text-5xl font-bold border-b-4 border-[#D4AF37] pb-4 leading-tight">
        {article.title}
      </h1>
      <h3 className="text-xl md:text-2xl text-gray-600 mt-6 leading-relaxed font-serif">
        {article.header}
      </h3>
      
      <div className="flex items-center gap-4 my-8 pb-8 border-b border-gray-200">
        {article.author?.profilePic && (
          <img 
            src={article.author.profilePic} 
            className="w-14 h-14 border-2 border-[#D4AF37] object-cover" 
            alt={article.author.name} 
          />
        )}
        <div>
          <p className="font-bold text-lg">{article.author?.name || 'Redacción'}</p>
          <p className="text-sm text-gray-500 capitalize font-sans">{fecha}</p>
        </div>
      </div>

      {article.featuredImage && (
        <img 
          src={article.featuredImage} 
          alt={article.title} 
          className="w-full h-auto mb-10 object-cover border border-gray-200" 
        />
      )}

      {/* Cuerpo de nota con la letra capital dorada */}
      <div 
        className="prose prose-lg max-w-none text-gray-800 
                   first-letter:text-7xl first-letter:font-black first-letter:text-[#D4AF37] 
                   first-letter:float-left first-letter:mr-4 first-letter:mt-2"
        dangerouslySetInnerHTML={{ __html: article.content }} 
      />
    </main>
  )
}

// Componente principal de la ruta
export default function NotaPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Cabecera institucional */}
      <header className="bg-[#0a192f] text-white p-4 text-center border-b border-[#D4AF37]/30">
        <Link href="/" className="inline-flex items-center gap-3">
          <img src="/favicon.ico" alt="El Telégrafo" className="w-8 h-8 object-contain" />
          <h2 className="text-2xl md:text-3xl font-black text-[#D4AF37] tracking-widest uppercase hover:opacity-90 transition font-[family-name:var(--font-cinzel)]">
            El Telégrafo
          </h2>
        </Link>
      </header>

      {/* Suspense aísla la carga de datos del renderizado estático */}
      <Suspense fallback={
        <div className="max-w-4xl mx-auto p-12 text-center text-gray-400 font-sans text-sm animate-pulse">
          Cargando edición...
        </div>
      }>
        <DetalleNota params={params} />
      </Suspense>
    </div>
  )
}