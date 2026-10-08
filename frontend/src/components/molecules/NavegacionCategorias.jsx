import { NavLink } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav'

/**
 * Fila de categorías para saltar de una a otra sin volver atrás (la fila
 * superior de la Figura 4 del Anexo). Marca la categoría actual.
 *
 * @param {object} props
 * @param {Array<{id: string, nombre: string}>} props.categorias
 */
function NavegacionCategorias({ categorias }) {
  return (
    <Nav variant="pills" className="flex-nowrap overflow-auto gap-1 pb-2 mb-3" aria-label="Categorías">
      <Nav.Link as={NavLink} to="/categorias" end className="text-nowrap">
        Todas
      </Nav.Link>
      {categorias.map((categoria) => (
        <Nav.Link key={categoria.id} as={NavLink} to={`/categorias/${categoria.id}`} className="text-nowrap">
          {categoria.nombre}
        </Nav.Link>
      ))}
    </Nav>
  )
}

export default NavegacionCategorias
