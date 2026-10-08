import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'

/**
 * Categorías del panel con su cantidad de productos.
 *
 * @param {object} props
 * @param {Array<{id: string, nombre: string, descripcion?: string}>} props.categorias
 * @param {Object<string, number>} props.cantidadPorCategoria - { idCategoria: cantidad }.
 * @param {(categoria: object) => void} props.onEliminar - Pide confirmar la eliminación.
 */
function TablaCategoriasAdmin({ categorias, cantidadPorCategoria, onEliminar }) {
  if (categorias.length === 0) return <p className="text-secondary py-3 mb-0">No hay categorías. Crea la primera.</p>

  return (
    <Table responsive hover className="align-middle mb-0">
      <thead>
        <tr>
          <th scope="col">Nombre</th>
          <th scope="col" className="d-none d-md-table-cell">Descripción</th>
          <th scope="col" className="text-end">Productos</th>
          <th scope="col">
            <span className="visually-hidden">Acciones</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {categorias.map((categoria) => (
          <tr key={categoria.id}>
            <td>
              {categoria.nombre}
              {/* El id es la dirección pública de la categoría (/categorias/:id). */}
              <span className="d-block small text-secondary">/{categoria.id}</span>
            </td>
            <td className="d-none d-md-table-cell text-secondary small">{categoria.descripcion || '—'}</td>
            <td className="text-end">{cantidadPorCategoria[categoria.id] ?? 0}</td>
            <td className="text-end text-nowrap">
              <Link
                to={`/admin/categorias/${categoria.id}/editar`}
                className="btn btn-outline-primary btn-sm me-1"
                aria-label={`Editar ${categoria.nombre}`}
              >
                Editar
              </Link>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => onEliminar(categoria)}
                aria-label={`Eliminar ${categoria.nombre}`}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default TablaCategoriasAdmin
