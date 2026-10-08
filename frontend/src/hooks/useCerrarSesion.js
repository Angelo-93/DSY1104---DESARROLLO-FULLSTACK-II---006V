import { startTransition } from 'react'
import { useNavigate } from 'react-router-dom'

import { useSesion } from './useSesion.js'

/**
 * Cierra la sesión y lleva a la portada de la tienda.
 *
 * Por qué startTransition: React Router hace cada navegación como una
 * "transición" (actualización de baja prioridad), y borrar la sesión es una
 * actualización normal (alta prioridad). Si van por separado, React dibuja
 * primero "sin sesión" en la página del panel: la guardia RutaProtegida lo ve y
 * redirige al login antes de que llegue la navegación a la portada. Dentro de
 * la misma transición, ambos cambios se aplican juntos.
 *
 * @returns {() => void} Función para el botón "Cerrar sesión".
 */
export function useCerrarSesion() {
  const { cerrarSesion } = useSesion()
  const navegar = useNavigate()

  return function cerrarSesionYSalir() {
    startTransition(() => {
      cerrarSesion()
      navegar('/')
    })
  }
}
