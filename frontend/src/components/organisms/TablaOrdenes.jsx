import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'

import { formatearFecha, formatearPrecio } from '../../utils/formato.js'
import EstadoOrden from '../atoms/EstadoOrden.jsx'

/**
 * Lista de órdenes del panel. La usan Órdenes y, en el Bloque 6b, el
 * Historial de compras de cada usuario.
 *
 * @param {object} props
 * @param {object[]} props.ordenes
 * @param {string} [props.mensajeVacio]
 */
function TablaOrdenes({ ordenes, mensajeVacio = 'No hay órdenes para mostrar.' }) {
  if (ordenes.length === 0) return <p className="text-secondary py-3 mb-0">{mensajeVacio}</p>

  return (
    // responsive: en pantallas chicas la tabla se desplaza hacia el lado.
    // Las columnas secundarias se ocultan en celular (d-none d-md-table-cell).
    <Table responsive hover className="align-middle mb-0">
      <thead>
        <tr>
          <th scope="col">N°</th>
          <th scope="col">Fecha</th>
          <th scope="col">Cliente</th>
          <th scope="col" className="d-none d-md-table-cell">Correo</th>
          <th scope="col" className="text-end">Total</th>
          <th scope="col">Estado</th>
          <th scope="col">
            <span className="visually-hidden">Acciones</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {ordenes.map((orden) => (
          <tr key={orden.numero}>
            <td>{orden.numero}</td>
            <td className="text-nowrap">{formatearFecha(orden.fecha)}</td>
            <td>
              {orden.cliente.nombre} {orden.cliente.apellidos}
              {/* Renderizado condicional: las compras sin cuenta se marcan. */}
              {!orden.cliente.run && <span className="badge text-bg-light border ms-1">Invitado</span>}
            </td>
            <td className="d-none d-md-table-cell">{orden.cliente.correo}</td>
            <td className="text-end text-nowrap">{formatearPrecio(orden.total)}</td>
            <td>
              <EstadoOrden estado={orden.estado} />
            </td>
            <td className="text-end">
              <Link to={`/admin/ordenes/${orden.numero}`} className="btn btn-outline-primary btn-sm text-nowrap">
                Ver boleta
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default TablaOrdenes
