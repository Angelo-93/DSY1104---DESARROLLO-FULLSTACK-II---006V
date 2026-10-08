import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * Lee un mensaje que otra página envió en el "state" de la navegación
 * (ej: navegar('/admin/productos', { state: { mensaje: 'Producto creado.' } })).
 *
 * El mensaje se copia a un estado propio y se borra del historial del
 * navegador: si no, volvería a aparecer cada vez que se recarga la página.
 *
 * @param {string} clave - Nombre del dato dentro del state ('mensaje', 'bienvenida'...).
 * @returns {[string|null, () => void]} El mensaje (o null) y una función para cerrarlo.
 */
export function useMensajeDeRuta(clave) {
  const ubicacion = useLocation()
  const navegar = useNavigate()
  const [mensaje, setMensaje] = useState(ubicacion.state?.[clave] ?? null)

  useEffect(() => {
    if (ubicacion.state?.[clave]) navegar(ubicacion.pathname, { replace: true, state: null })
  }, [ubicacion, navegar, clave])

  return [mensaje, () => setMensaje(null)]
}
