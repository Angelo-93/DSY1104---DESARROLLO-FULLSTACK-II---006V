import { useContext } from 'react'

import { SesionContext } from '../context/SesionContext.js'

/**
 * Hook para leer la sesión desde cualquier componente dentro de <SesionProvider>.
 *
 * @returns {{usuario: object|null, iniciarSesion: Function,
 *   cerrarSesion: Function, actualizarSesion: Function}}
 * @throws {Error} Si se usa fuera de <SesionProvider>.
 */
export function useSesion() {
  const contexto = useContext(SesionContext)
  if (!contexto) throw new Error('useSesion debe usarse dentro de <SesionProvider>.')
  return contexto
}
