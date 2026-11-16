'use client'

import { useEffect, useState } from 'react'

/** Línea dorada, arriba de todo, que avanza a medida que se lee la nota. */
export default function ProgresoLectura() {
  const [avance, setAvance] = useState(0)

  useEffect(() => {
    const medir = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setAvance(total > 0 ? Math.min(1, window.scrollY / total) : 0)
    }
    medir()
    window.addEventListener('scroll', medir, { passive: true })
    window.addEventListener('resize', medir)
    return () => {
      window.removeEventListener('scroll', medir)
      window.removeEventListener('resize', medir)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[3px]">
      <div className="h-full origin-left bg-oro" style={{ transform: `scaleX(${avance})` }} />
    </div>
  )
}
