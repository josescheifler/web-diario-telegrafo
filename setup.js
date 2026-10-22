const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dirs = [
  'prisma',
  'lib',
  'app/admin',
  'app/nota/[id]'
];

const files = {
  '.env': `DATABASE_URL="postgresql://[usuario]:[contraseña]@[tu-host-de-neon].neon.tech/neondb?sslmode=require"`,
  
  'prisma/schema.prisma': `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Article {
  id              String   @id @default(cuid())
  title           String
  header          String
  content         String   @db.Text
  featuredImage   String
  section         Section
  authorId        String
  author          Author   @relation(fields: [authorId], references: [id])
  published       Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Author {
  id          String    @id @default(cuid())
  name        String
  profilePic  String?
  bio         String?
  isFeatured  Boolean   @default(false)
  articles    Article[]
}

model Advertisement {
  id          String   @id @default(cuid())
  name        String
  adCode      String   @db.Text
  location    String
  isActive    Boolean  @default(true)
}

enum Section {
  ECONOMIA
  LOCAL
  REGIONAL
  MUNDO
  PAIS
  POLITICA
  SOCIEDAD
}`,

  'lib/prisma.ts': `import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
export default prisma;`,

  'app/admin/page.tsx': `'use client'
import { useState } from 'react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('notas')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-[#0a192f]">
      <div className="bg-[#0a192f] p-4 text-white flex justify-between items-center">
        <h1 className="text-[#D4AF37] font-bold text-2xl">El Telégrafo - Administración</h1>
      </div>
      <div className="flex px-6 bg-white border-b gap-6">
        <button onClick={() => setActiveTab('notas')} className={\`py-4 font-semibold \${activeTab === 'notas' ? 'border-b-2 border-[#D4AF37]' : 'text-gray-400'}\`}>Notas</button>
        <button onClick={() => setActiveTab('autores')} className={\`py-4 font-semibold \${activeTab === 'autores' ? 'border-b-2 border-[#D4AF37]' : 'text-gray-400'}\`}>Autores</button>
        <button onClick={() => setActiveTab('publicidad')} className={\`py-4 font-semibold \${activeTab === 'publicidad' ? 'border-b-2 border-[#D4AF37]' : 'text-gray-400'}\`}>Publicidad</button>
      </div>
      <div className="p-6 max-w-5xl mx-auto w-full">
        {activeTab === 'notas' && (
          <form className="flex flex-col gap-4 bg-white p-6 rounded shadow-sm">
            <h2 className="text-xl font-bold mb-2">Redactar Nueva Nota</h2>
            <input type="text" placeholder="Título" className="p-3 border rounded outline-none focus:ring-2 focus:ring-[#D4AF37]" />
            <input type="text" placeholder="Encabezado" className="p-3 border rounded outline-none focus:ring-2 focus:ring-[#D4AF37]" />
            <textarea placeholder="Cuerpo HTML de la nota..." className="p-3 border rounded h-64 outline-none focus:ring-2 focus:ring-[#D4AF37]" />
            <button className="bg-[#0a192f] text-white font-bold py-3 px-6 rounded w-48 border border-[#D4AF37]">Publicar</button>
          </form>
        )}
      </div>
    </div>
  )
}`,

  'app/nota/[id]/page.tsx': `export default function NotaPage() {
  const article = {
    title: "El impacto de las nuevas medidas económicas en la región",
    header: "Un análisis detallado sobre cómo las recientes políticas afectarán el desarrollo.",
    content: "<p>Las recientes decisiones tomadas por el ministerio han generado un fuerte revuelo en los mercados. La primera letra se transforma automáticamente en una letra capital gigante y dorada, dándole ese estilo clásico de diario impreso que buscamos para El Telégrafo.</p><p>Además, al usar HTML, aquí mismo se podrán insertar las imágenes.</p>",
    author: { name: "Carlos Periodista" }
  }

  return (
    <main className="max-w-4xl mx-auto p-6 lg:p-12 bg-white text-[#0a192f] font-serif">
      <h1 className="text-4xl md:text-5xl font-bold border-b-4 border-[#D4AF37] pb-4">{article.title}</h1>
      <h3 className="text-xl md:text-2xl text-gray-600 mt-6">{article.header}</h3>
      <div className="my-8 pb-8 border-b font-bold text-lg">{article.author.name}</div>
      <div 
        className="prose prose-lg max-w-none text-gray-800 first-letter:text-7xl first-letter:font-black first-letter:text-[#D4AF37] first-letter:float-left first-letter:mr-4 first-letter:mt-2"
        dangerouslySetInnerHTML={{ __html: article.content }} 
      />
    </main>
  )
}`
};

console.log('Creando estructura de carpetas...');
dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
});

console.log('Escribiendo archivos...');
Object.entries(files).forEach(([filePath, content]) => {
  fs.writeFileSync(path.join(__dirname, filePath), content);
});

console.log('Instalando dependencias (Prisma v5 y TipTap)...');
execSync('npm install prisma@5 @prisma/client@5 @tiptap/react @tiptap/starter-kit', { stdio: 'inherit' });

console.log('Generando cliente de Prisma localmente...');
execSync('npx prisma@5 generate', { stdio: 'inherit' });

console.log('\n¡Proyecto configurado! Solo falta que pongas tu URL real de Neon en el archivo .env y corras "npx prisma@5 db push"');