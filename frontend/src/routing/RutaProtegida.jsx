import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useSesion } from '../hooks/useSesion.js'
import PaginaAccesoDenegado from '../pages/comunes/PaginaAccesoDenegado.jsx'

/**
 * Guardia de rutas: decide si lo que está dentro se muestra o no.
 * 1. Sin sesión → redirige al login, recordando a dónde se quería ir.
 * 2. Con sesión pero sin permiso → página 403.
 * 3. Con permiso → muestra el contenido.
 *
 * Proteger en la ruta (y no solo ocultando el enlace del menú) importa: el
 * usuario puede escribir la URL /admin/usuarios directo en el navegador.
 *
 * Nota: en la EP2 esto es una protección de interfaz. Como todo vive en el
 * navegador, alguien con conocimientos podría editar localStorage; la
 * protección real llega en la EP3, cuando el servidor verifique cada petición.
 *
 * @param {object} props
 * @param {(usuario: object) => boolean} props.permiso - Función que decide si
 *   el usuario puede pasar (ej: puedeEntrarAlPanel o esAdministrador). Se pasa
 *   una función por props para reutilizar la misma guardia con reglas distintas.
 * @param {React.ReactNode} [props.children] - Contenido protegido. Si no se
 *   entrega, se usa <Outlet /> y la guardia protege a todas sus rutas hijas.
 */
function RutaProtegida({ permiso, children }) {
  const { usuario } = useSesion()
  const ubicacion = useLocation()

  if (!usuario) {
    // replace: el login reemplaza la entrada en el historial, así el botón
    // "Atrás" no devuelve a una página que vuelve a redirigir al login.
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
  }

  if (!permiso(usuario)) return <PaginaAccesoDenegado />

  return children ?? <Outlet />
}

export default RutaProtegida
