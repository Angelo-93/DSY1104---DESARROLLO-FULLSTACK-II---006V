import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Card from 'react-bootstrap/Card'

import EncabezadoAdmin from '../../components/molecules/EncabezadoAdmin.jsx'
import FormularioProducto from '../../components/organisms/FormularioProducto.jsx'
import { listarCategorias } from '../../services/categoriasService.js'
import { actualizarProducto, crearProducto, obtenerProducto } from '../../services/productosService.js'

/**
 * Nuevo producto (/admin/productos/nuevo) y Editar producto
 * (/admin/productos/:codigo/editar): una sola página, porque el formulario es
 * el mismo. Si la URL trae un código, es edición.
 */
function PaginaFormularioProducto() {
  const { codigo } = useParams()
  const navegar = useNavigate()
  const [categorias] = useState(listarCategorias)
  const [errorGeneral, setErrorGeneral] = useState('')
  const esEdicion = Boolean(codigo)
  const producto = esEdicion ? obtenerProducto(codigo) : null

  if (esEdicion && !producto) {
    return (
      <>
        <EncabezadoAdmin titulo="Producto no encontrado" />
        <p className="text-secondary">No existe un producto con el código {codigo}.</p>
        <Link to="/admin/productos">Volver a Productos</Link>
      </>
    )
  }

  function manejarGuardado(datos) {
    try {
      const guardado = esEdicion ? actualizarProducto(producto.codigo, datos) : crearProducto(datos)
      // El mensaje viaja a la lista, que lo muestra (ver useMensajeDeRuta).
      const accion = esEdicion ? 'actualizó' : 'creó'
      navegar('/admin/productos', { state: { mensaje: `Se ${accion} el producto ${guardado.nombre}.` } })
    } catch (error) {
      // Regla que solo el servicio puede revisar: código ya usado.
      setErrorGeneral(error.message)
    }
  }

  return (
    <>
      <EncabezadoAdmin titulo={esEdicion ? `Editar producto ${producto.codigo}` : 'Nuevo producto'} />
      <Card>
        <Card.Body className="p-3 p-md-4">
          <FormularioProducto
            producto={producto ?? undefined}
            categorias={categorias}
            onGuardar={manejarGuardado}
            onCancelar={() => navegar('/admin/productos')}
            errorGeneral={errorGeneral}
          />
        </Card.Body>
      </Card>
    </>
  )
}

export default PaginaFormularioProducto
