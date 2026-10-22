'use client'
import { useEffect, useState } from 'react'

export default function Fecha() {
  const [fecha, setFecha] = useState('')

  useEffect(() => {
    setFecha(new Date().toLocaleDateString('es-AR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }))
  }, [])

  return <span>{fecha}</span>
}