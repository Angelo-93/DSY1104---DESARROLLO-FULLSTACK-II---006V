import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'

import { esStockCritico } from '../../utils/calculos.js'
import PrecioProducto from '../atoms/PrecioProducto.jsx'

/**
 * Inventario del panel. La columna de acciones existe solo si puedeEditar es
 * true (Administrador): el Vendedor ve la misma tabla, en solo lectura.
 *
 * @param {object} props
 * @param {object[]} props.productos
 * @param {Object<string, string>} props.nombresCategoria - { idCategoria: nombre }.
 * @param {boolean} [props.puedeEditar=false]
 * @param {(producto: object) => void} [props.onEliminar] - Pide confirmar la eliminación.
 * @param {string} [props.mensajeVacio]
 */
function TablaProductosAdmin({ productos, nombresCategoria, puedeEditar = false, onEliminar, mensajeVacio = 'No hay productos para mostrar.' }) {
  if (productos.length === 0) return <p className="text-secondary py-3 mb-0">{mensajeVacio}</p>

  return (
    <Table responsive hover className="align-middle mb-0">
      <thead>
        <tr>
          <th scope="col">Código</th>
          <th scope="col">Nombre</th>
          <th scope="col" className="d-none d-lg-table-cell">Categoría</th>
          <th scope="col">Precio</th>
          <th scope="col" className="text-end">Stock</th>
          <th scope="col" className="text-end d-none d-md-table-cell">Stock crítico</th>
          {puedeEditar && (
            <th scope="col">
              <span className="visually-hidden">Acciones</span>
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {productos.map((producto) => (
          <tr key={producto.codigo}>
            <td className="text-nowrap small">{producto.codigo}</td>
            <td>{producto.nombre}</td>
            <td className="d-none d-lg-table-cell">{nombresCategoria[producto.idCategoria] ?? 'Sin categoría'}</td>
            <td className="text-nowrap">
              <PrecioProducto producto={producto} compacto />
            </td>
            <td className="text-end text-nowrap">
              {producto.stock}
              {producto.stock === 0 ? (
                <span className="badge text-bg-secondary ms-2">Agotado</span>
              ) : (
                esStockCritico(producto) && <span className="badge text-bg-warning ms-2">Crítico</span>
              )}
            </td>
            <td className="text-end d-none d-md-table-cell">{producto.stockCritico ?? '—'}</td>
            {puedeEditar && (
              <td className="text-end text-nowrap">
                <Link
                  to={`/admin/productos/${producto.codigo}/editar`}
                  className="btn btn-outline-primary btn-sm me-1"
                  aria-label={`Editar ${producto.nombre}`}
                >
                  Editar
                </Link>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => onEliminar(producto)}
                  aria-label={`Eliminar ${producto.nombre}`}
                >
                  Eliminar
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default TablaProductosAdmin
