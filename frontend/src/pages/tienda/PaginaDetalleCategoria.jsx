import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Container from 'react-bootstrap/Container'

import AvisoFlotante from '../../components/molecules/AvisoFlotante.jsx'
import NavegacionCategorias from '../../components/molecules/NavegacionCategorias.jsx'
import RutaNavegacion from '../../components/molecules/RutaNavegacion.jsx'
import GrillaProductos from '../../components/organisms/GrillaProductos.jsx'
import { useAgregarAlCarrito } from '../../hooks/useAgregarAlCarrito.js'
import { listarCategorias } from '../../services/categoriasService.js'
import { listarProductosPorCategoria } from '../../services/productosService.js'

/** Productos de una categoría: /categorias/:idCategoria. */
function PaginaDetalleCategoria() {
  const { idCategoria } = useParams()
  const [categorias] = useState(listarCategorias)
  const { agregar, aviso, cerrarAviso } = useAgregarAlCarrito()

  // Se recalcula en cada render a partir de la URL: al pulsar otra categoría
  // en la fila de arriba cambia idCategoria y la página muestra la nueva.
  const categoria = categorias.find((c) => c.id === idCategoria)

  if (!categoria) {
    return (
      <Container className="py-5">
        <h1 className="h3">Categoría no encontrada</h1>
        <p className="text-secondary">Puede que haya sido renombrada o eliminada.</p>
        <Link to="/categorias" className="btn btn-primary">
          Ver categorías
        </Link>
      </Container>
    )
  }

  const productos = listarProductosPorCategoria(idCategoria)

  return (
    <Container className="py-4">
      <RutaNavegacion elementos={[{ texto: 'Categorías', ruta: '/categorias' }, { texto: categoria.nombre }]} />
      <NavegacionCategorias categorias={categorias} />

      <h1>{categoria.nombre}</h1>
      {categoria.descripcion && <p className="text-secondary">{categoria.descripcion}</p>}
      <p className="small text-secondary">
        {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
      </p>

      <GrillaProductos
        productos={productos}
        onAgregar={agregar}
        mensajeVacio="Esta categoría todavía no tiene productos."
      />

      <AvisoFlotante aviso={aviso} onCerrar={cerrarAviso} />
    </Container>
  )
}

export default PaginaDetalleCategoria
