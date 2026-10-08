import { Link, useParams } from 'react-router-dom'
import Container from 'react-bootstrap/Container'

import AvisoFlotante from '../../components/molecules/AvisoFlotante.jsx'
import RutaNavegacion from '../../components/molecules/RutaNavegacion.jsx'
import FichaProducto from '../../components/organisms/FichaProducto.jsx'
import GrillaProductos from '../../components/organisms/GrillaProductos.jsx'
import { useAgregarAlCarrito } from '../../hooks/useAgregarAlCarrito.js'
import { obtenerCategoria, obtenerNombresCategoria } from '../../services/categoriasService.js'
import { listarProductosPorCategoria, obtenerProducto } from '../../services/productosService.js'

const MAXIMO_RELACIONADOS = 4 // como en la EP1

/** Detalle de un producto: /productos/:codigo (useParams, clase del 21-09). */
function PaginaDetalleProducto() {
  const { codigo } = useParams()
  const { agregar, aviso, cerrarAviso } = useAgregarAlCarrito()
  const producto = obtenerProducto(codigo)

  if (!producto) {
    return (
      <Container className="py-5">
        <h1 className="h3">Producto no encontrado</h1>
        <p className="text-secondary">
          No existe un producto con el código <code>{codigo}</code>. Puede que haya sido retirado del catálogo.
        </p>
        <Link to="/productos" className="btn btn-primary">
          Ver catálogo
        </Link>
      </Container>
    )
  }

  const relacionados = listarProductosPorCategoria(producto.idCategoria)
    .filter((otro) => otro.codigo !== producto.codigo)
    .slice(0, MAXIMO_RELACIONADOS)

  return (
    <Container className="py-4">
      <RutaNavegacion elementos={[{ texto: 'Productos', ruta: '/productos' }, { texto: producto.nombre }]} />

      {/* key: al pasar de un producto a un relacionado, React reutilizaría la
          misma ficha y conservaría la cantidad elegida. Con una key distinta
          por producto, la ficha parte de cero. */}
      <FichaProducto
        key={producto.codigo}
        producto={producto}
        categoria={obtenerCategoria(producto.idCategoria)}
        onAgregar={agregar}
      />

      <section className="mt-5" aria-labelledby="titulo-relacionados">
        <h2 id="titulo-relacionados" className="h4 mb-3">
          Productos relacionados
        </h2>
        <GrillaProductos
          productos={relacionados}
          nombresCategoria={obtenerNombresCategoria()}
          onAgregar={agregar}
          mensajeVacio="No hay otros productos en esta categoría."
        />
      </section>

      <AvisoFlotante aviso={aviso} onCerrar={cerrarAviso} />
    </Container>
  )
}

export default PaginaDetalleProducto
