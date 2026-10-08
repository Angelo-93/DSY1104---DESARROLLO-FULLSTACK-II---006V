import { Link, NavLink } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'

// Mismo orden que el diagrama de flujo del administrador (Anexo 1, Figura 10).
const ENLACES_ADMIN = [
  { ruta: '/admin', texto: 'Dashboard' },
  { ruta: '/admin/ordenes', texto: 'Órdenes' },
  { ruta: '/admin/productos', texto: 'Productos' },
  { ruta: '/admin/categorias', texto: 'Categorías' },
  { ruta: '/admin/usuarios', texto: 'Usuarios' },
  { ruta: '/admin/reportes', texto: 'Reportes' },
  { ruta: '/admin/perfil', texto: 'Perfil' },
]

/**
 * Menú del panel administrador. Desde tablet es una columna lateral;
 * en celular es una franja horizontal desplazable (flex-row + overflow-auto).
 */
function MenuLateralAdmin() {
  return (
    <nav aria-label="Menú del administrador" className="admin-menu h-100 p-2 p-md-3">
      <Nav className="flex-row flex-md-column flex-nowrap overflow-auto gap-1">
        {ENLACES_ADMIN.map((enlace) => (
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
      </Nav>
    </nav>
  )
}

export default MenuLateralAdmin
