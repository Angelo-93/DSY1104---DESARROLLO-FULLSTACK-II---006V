import { useState } from 'react'
import { Link } from 'react-router-dom'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import ImagenProducto from '../atoms/ImagenProducto.jsx'
import PrecioProducto from '../atoms/PrecioProducto.jsx'
import SelectorCantidad from '../molecules/SelectorCantidad.jsx'

/**
 * Ficha completa de un producto (vista Detalle). Guarda en su estado la
 * cantidad elegida; agregarla al carrito lo decide el padre por onAgregar.
 *
 * @param {object} props
 * @param {object} props.producto
 * @param {{id: string, nombre: string}|null} props.categoria
 * @param {(producto: object, cantidad: number) => void} props.onAgregar
 */
function FichaProducto({ producto, categoria, onAgregar }) {
  const [cantidad, setCantidad] = useState(1)
  const agotado = producto.stock === 0

  return (
    <Row className="g-4 align-items-start">
      <Col xs={12} md={6}>
        <ImagenProducto idCategoria={producto.idCategoria} nombre={producto.nombre} className="rounded border" />
      </Col>

      <Col xs={12} md={6}>
        {categoria && (
          <Link to={`/categorias/${categoria.id}`} className="small text-secondary">
            {categoria.nombre}
          </Link>
        )}
        <h1 className="h2 mt-1">{producto.nombre}</h1>
        <p className="text-secondary">{producto.especificaciones}</p>
        <PrecioProducto producto={producto} grande />

        {/* Renderizado condicional del estado del stock. */}
        <p className={`small mt-2 ${agotado ? 'text-danger' : 'text-secondary'}`}>
          {agotado ? 'Producto agotado' : `Stock disponible: ${producto.stock} unidades`}
        </p>

        {producto.descripcion && <p>{producto.descripcion}</p>}

        {!agotado && (
          <div className="d-flex flex-wrap gap-2 align-items-center mt-4">
            <SelectorCantidad valor={cantidad} maximo={producto.stock} onCambiar={setCantidad} />
            <button type="button" className="btn btn-acento" onClick={() => onAgregar(producto, cantidad)}>
              Agregar al carrito
            </button>
          </div>
        )}
      </Col>
    </Row>
  )
}

export default FichaProducto
