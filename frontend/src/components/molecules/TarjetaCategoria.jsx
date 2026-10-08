import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'

import ImagenProducto from '../atoms/ImagenProducto.jsx'

/**
 * Tarjeta de una categoría en la vista Categorías (Anexo 1, Figura 4).
 * Toda la tarjeta lleva al detalle de la categoría.
 *
 * @param {object} props
 * @param {{id: string, nombre: string, descripcion?: string}} props.categoria
 * @param {number} props.cantidadProductos
 */
function TarjetaCategoria({ categoria, cantidadProductos }) {
  return (
    <Card className="tarjeta-producto h-100">
      <ImagenProducto idCategoria={categoria.id} nombre={categoria.nombre} className="card-img-top" />
      <Card.Body>
        <h2 className="h5 mb-1">
          {/* stretched-link (Bootstrap): el enlace cubre toda la tarjeta, así se
              puede pulsar en cualquier parte y el lector de pantalla lee solo el nombre. */}
          <Link to={`/categorias/${categoria.id}`} className="stretched-link link-dark text-decoration-none">
            {categoria.nombre}
          </Link>
        </h2>
        {categoria.descripcion && <p className="small text-secondary mb-2">{categoria.descripcion}</p>}
        <p className="small fw-semibold mb-0">
          {cantidadProductos} {cantidadProductos === 1 ? 'producto' : 'productos'}
        </p>
      </Card.Body>
    </Card>
  )
}

export default TarjetaCategoria
