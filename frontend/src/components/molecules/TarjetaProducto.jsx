import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'

import { esStockCritico, estaEnOferta } from '../../utils/calculos.js'
import ImagenProducto from '../atoms/ImagenProducto.jsx'
import PrecioProducto from '../atoms/PrecioProducto.jsx'

/**
 * Tarjeta de un producto en una grilla (Inicio, Productos, Categorías, Ofertas,
 * relacionados). Solo muestra: el carrito lo maneja el padre por onAgregar.
 *
 * @param {object} props
 * @param {object} props.producto
 * @param {string} [props.nombreCategoria] - Se muestra sobre el nombre.
 * @param {(producto: object) => void} props.onAgregar
 */
function TarjetaProducto({ producto, nombreCategoria, onAgregar }) {
  const agotado = producto.stock === 0
  const quedanPocas = !agotado && esStockCritico(producto)
  const rutaDetalle = `/productos/${producto.codigo}`

  return (
    <Card className="tarjeta-producto h-100">
      <Link to={rutaDetalle} className="position-relative d-block" tabIndex={-1} aria-hidden="true">
        <ImagenProducto idCategoria={producto.idCategoria} nombre={producto.nombre} className="card-img-top" />
        {/* Etiquetas sobre la imagen: renderizado condicional según el producto. */}
        <span className="position-absolute top-0 start-0 m-2 d-flex gap-1">
          {estaEnOferta(producto) && <span className="badge text-bg-warning">Oferta</span>}
          {agotado && <span className="badge text-bg-secondary">Agotado</span>}
          {quedanPocas && <span className="badge text-bg-light border">Últimas unidades</span>}
        </span>
      </Link>

      <Card.Body className="d-flex flex-column">
        {nombreCategoria && <p className="small text-secondary mb-1">{nombreCategoria}</p>}
        <h3 className="h6 mb-1">
          <Link to={rutaDetalle} className="link-dark text-decoration-none">
            {producto.nombre}
          </Link>
        </h3>
        <p className="small text-secondary mb-3">{producto.especificaciones}</p>

        <div className="mt-auto">
          <PrecioProducto producto={producto} />
          <button
            type="button"
            className="btn btn-acento btn-sm w-100 mt-2"
            onClick={() => onAgregar(producto)}
            disabled={agotado}
            aria-label={agotado ? `${producto.nombre} agotado` : `Agregar ${producto.nombre} al carrito`}
          >
            {agotado ? 'Agotado' : 'Agregar al carrito'}
          </button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default TarjetaProducto
