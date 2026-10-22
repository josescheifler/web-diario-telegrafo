import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function NotaPage({ params }: { params: Promise<{ id: string }> }) {
  // Esperamos a que Next.js resuelva el ID dinámico de la URL
  const { id } = await params

  // Buscamos la nota real en la base de datos Neon
  const article = await prisma.article.findUnique({
    where: { id },
    include: { author: true }
  })

  // Si el ID no existe en la base de datos, tira error 404
  if (!article) return notFound()

  // Formateamos la fecha de publicación
  const fecha = new Date(article.createdAt).toLocaleDateString('es-AR', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header minimalista para navegar de vuelta */}
      <header className="bg-[#0a192f] text-white p-4 text-center border-b border-[#D4AF37]/30">
        <Link href="/">
          <h2 className="text-2xl md:text-3xl font-black text-[#D4AF37] tracking-widest uppercase hover:opacity-90 transition">
            El Telégrafo
          </h2>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto p-6 lg:p-12 bg-white text-[#0a192f] font-serif shadow-sm min-h-screen">
        <h1 className="text-4xl md:text-5xl font-bold border-b-4 border-[#D4AF37] pb-4 leading-tight">
          {article.title}
        </h1>
        <h3 className="text-xl md:text-2xl text-gray-600 mt-6 leading-relaxed">
          {article.header}
        </h3>
        
        <div className="flex items-center gap-4 my-8 pb-8 border-b border-gray-200">
          {article.author?.profilePic && (
            <img src={article.author.profilePic} className="w-14 h-14 rounded-full border-2 border-[#D4AF37] object-cover" alt={article.author.name} />
          )}
          <div>
            <p className="font-bold text-lg">{article.author?.name || 'Redacción'}</p>
            <p className="text-sm text-gray-500 capitalize">{fecha}</p>
          </div>
        </div>

        {article.featuredImage && (
          <img src={article.featuredImage} alt={article.title} className="w-full h-auto mb-10 shadow-md object-cover" />
        )}

        {/* El contenido HTML inyectado desde TipTap con la letra capital dorada */}
        <div 
          className="prose prose-lg max-w-none text-gray-800 
                     first-letter:text-7xl first-letter:font-black first-letter:text-[#D4AF37] 
                     first-letter:float-left first-letter:mr-4 first-letter:mt-2"
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />
      </main>
    </div>
  )
}