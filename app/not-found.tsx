import Link from 'next/link'
import Cabecera from '@/components/Cabecera'

export default function NotFound() {
  return (
    <>
      <Cabecera />
      <main className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="titular text-6xl italic">Esta página no existe</h1>
        <p className="mt-4 font-serif text-xl text-tinta/75">
          Puede que la nota se haya dado de baja o que la dirección esté mal escrita.
        </p>
        <Link href="/" className="boton mt-8">Ir a la portada</Link>
      </main>
    </>
  )
}
