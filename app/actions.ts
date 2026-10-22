'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// --- AUTENTICACIÓN ADMIN ---

export async function loginAdmin(prevState: any, formData: FormData) {
  const password = formData.get('password') as string
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'telegrafo123'

  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // Sesión por 7 días
      path: '/',
    })
    redirect('/admin')
  }

  return { error: 'Contraseña incorrecta' }
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/admin/login')
}

// --- AUTORES ---

export async function getAutores() {
  // Ordenamos por nombre alfabético porque Author no tiene createdAt
  return await prisma.author.findMany({
    orderBy: { name: 'asc' }
  })
}

export async function crearAutor(formData: FormData) {
  const name = formData.get('name') as string
  const bio = formData.get('bio') as string
  const profilePic = formData.get('profilePic') as string
  
  await prisma.author.create({
    data: { name, bio, profilePic }
  })
  
  revalidatePath('/admin')
}

export async function borrarAutor(id: string) {
  await prisma.author.delete({ 
    where: { id } 
  })
  
  revalidatePath('/admin')
  return { success: true }
}

// --- NOTAS / ARTÍCULOS ---

export async function getNotas() {
  return await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  })
}

export async function crearNota(formData: FormData, content: string) {
  const title = formData.get('title') as string
  const header = formData.get('header') as string
  const section = formData.get('section') as any
  const featuredImage = formData.get('featuredImage') as string
  let authorId = formData.get('authorId') as string
  
  if (!authorId) {
    let fallbackAuthor = await prisma.author.findFirst()
    if (!fallbackAuthor) {
      fallbackAuthor = await prisma.author.create({
        data: { name: 'Redacción El Telégrafo', bio: 'Equipo editorial' }
      })
    }
    authorId = fallbackAuthor.id
  }

  await prisma.article.create({
    data: {
      title,
      header,
      section,
      featuredImage,
      content,
      authorId,
      published: true
    }
  })

  revalidatePath('/') 
  revalidatePath('/admin')
  return { success: true }
}

export async function borrarNota(id: string) {
  await prisma.article.delete({ 
    where: { id } 
  })

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}