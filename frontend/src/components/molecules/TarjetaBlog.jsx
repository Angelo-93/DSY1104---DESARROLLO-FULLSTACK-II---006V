import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'

import ImagenProducto from '../atoms/ImagenProducto.jsx'

/**
 * Resumen de un artículo en la lista de Blogs.
 *
 * @param {object} props
 * @param {{id: string, etiqueta: string, titulo: string, resumen: string,
 *   idCategoriaIlustracion: string}} props.blog
 */
function TarjetaBlog({ blog }) {
  return (
    <Card className="h-100">
      <ImagenProducto idCategoria={blog.idCategoriaIlustracion} nombre={blog.titulo} className="card-img-top" />
      <Card.Body className="d-flex flex-column">
        <p className="small text-secondary mb-1">{blog.etiqueta}</p>
        <h2 className="h5">{blog.titulo}</h2>
        <p className="text-secondary">{blog.resumen}</p>
        <Link to={`/blogs/${blog.id}`} className="mt-auto">
          Leer caso completo
        </Link>
      </Card.Body>
    </Card>
  )
}

export default TarjetaBlog
