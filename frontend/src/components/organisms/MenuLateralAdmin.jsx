import { Link, NavLink } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'

// Mismo orden que el diagrama de flujo del administrador (Anexo 1, Figura 10).
// soloAdmin: secciones que el Vendedor no ve (él solo consulta productos y órdenes).
const ENLACES_ADMIN = [
  { ruta: '/admin', texto: 'Dashboard' },
  { ruta: '/admin/ordenes', texto: 'Órdenes' },
  { ruta: '/admin/productos', texto: 'Productos' },
  { ruta: '/admin/categorias', texto: 'Categorías', soloAdmin: true },
  { ruta: '/admin/usuarios', texto: 'Usuarios', soloAdmin: true },
  { ruta: '/admin/reportes', texto: 'Reportes', soloAdmin: true },
  { ruta: '/admin/perfil', texto: 'Perfil' },
]

/**
 * Menú del panel administrador. Desde tablet es una columna lateral;
 * en celular es una franja horizontal desplazable (flex-row + overflow-auto).
 *
 * Ocultar un enlace solo ordena la vista: la protección real está en las rutas
 * (RutaProtegida), porque la URL se puede escribir a mano.
 *
 * @param {object} props
 * @param {boolean} [props.esAdministrador=false] - false para el Vendedor.
 * @param {() => void} [props.onCerrarSesion]
 */
function MenuLateralAdmin({ esAdministrador = false, onCerrarSesion }) {
  const enlacesVisibles = ENLACES_ADMIN.filter((enlace) => esAdministrador || !enlace.soloAdmin)

  return (
    <nav aria-label="Menú del administrador" className="admin-menu h-100 p-2 p-md-3">
      <Nav className="flex-row flex-md-column flex-nowrap overflow-auto gap-1">
        {enlacesVisibles.map((enlace) => (
          <Nav.Link
            key={enlace.ruta}
            as={NavLink}
            to={enlace.ruta}
            // "/admin" es el inicio del panel: sin "end" quedaría activo en
            // todas las páginas del admin.
            end={enlace.ruta === '/admin'}
          >
            {enlace.texto}
          </Nav.Link>
        ))}

        <hr className="d-none d-md-block" />

        {/* Link y no NavLink: salir a la tienda no es una sección del panel,
            así que nunca debe aparecer marcada como activa. */}
        <Nav.Link as={Link} to="/" className="text-primary">
          Ver tienda
        </Nav.Link>
        <button type="button" className="btn btn-outline-danger btn-sm text-nowrap ms-2 ms-md-0 mt-md-2" onClick={onCerrarSesion}>
          Cerrar sesión
        </button>
      </Nav>
    </nav>
  )
}

export default MenuLateralAdmin
