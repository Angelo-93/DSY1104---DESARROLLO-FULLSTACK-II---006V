import { Link, useParams } from 'react-router-dom'
import Container from 'react-bootstrap/Container'

import ImagenProducto from '../../components/atoms/ImagenProducto.jsx'
import RutaNavegacion from '../../components/molecules/RutaNavegacion.jsx'
import { obtenerBlog } from '../../data/blogs.js'

/**
 * Una sola vista para todos los artículos: /blogs/:idBlog. En la EP1 había un
 * archivo HTML por artículo (blog-detalle-1.html y blog-detalle-2.html).
 */
function PaginaDetalleBlog() {
  const { idBlog } = useParams()
  const blog = obtenerBlog(idBlog)

  if (!blog) {
    return (
      <Container className="py-5">
        <h1 className="h3">Artículo no encontrado</h1>
        <Link to="/blogs">Volver a Blogs</Link>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <RutaNavegacion elementos={[{ texto: 'Blogs', ruta: '/blogs' }, { texto: blog.titulo }]} />
      <article className="texto-lectura">
        <p className="small text-secondary mb-1">{blog.etiqueta}</p>
        <h1 className="mb-4">{blog.titulo}</h1>
        <ImagenProducto idCategoria={blog.idCategoriaIlustracion} nombre={blog.titulo} className="rounded border mb-4" />
        {blog.parrafos.map((parrafo) => (
          <p key={parrafo.slice(0, 40)}>{parrafo}</p>
        ))}
      </article>
      <Link to="/blogs">Volver a Blogs</Link>
    </Container>
  )
}

export default PaginaDetalleBlog
