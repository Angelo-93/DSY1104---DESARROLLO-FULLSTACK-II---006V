import { estaEnOferta, porcentajeDescuento } from '../../utils/calculos.js'
import { formatearPrecio } from '../../utils/formato.js'

/**
 * Precio de un producto. Con oferta muestra el precio normal tachado, el de
 * oferta destacado y el porcentaje de descuento; sin oferta, solo el precio.
 *
 * @param {object} props
 * @param {{precio: number, precioOferta?: number|null}} props.producto
 * @param {boolean} [props.grande=false] - Versión grande para el detalle.
 */
function PrecioProducto({ producto, grande = false }) {
  const claseMonto = grande ? 'fs-3 fw-bold' : 'fs-5 fw-bold'

  if (!estaEnOferta(producto)) {
    return <p className={`${claseMonto} mb-0`}>{formatearPrecio(producto.precio)}</p>
  }

  return (
    <p className="mb-0 d-flex flex-wrap align-items-baseline gap-2">
      {/* Para lectores de pantalla un precio tachado no se "ve": se aclara con
          texto oculto a la vista (visually-hidden). */}
      <span className="visually-hidden">Precio normal</span>
      <span className="text-secondary text-decoration-line-through small" data-testid="precio-normal">
        {formatearPrecio(producto.precio)}
      </span>
      <span className="visually-hidden">Precio oferta</span>
      <span className={`${claseMonto} text-acento-oscuro`} data-testid="precio-oferta">
        {formatearPrecio(producto.precioOferta)}
      </span>
      <span className="badge text-bg-warning">-{porcentajeDescuento(producto)}%</span>
    </p>
  )
}

export default PrecioProducto
