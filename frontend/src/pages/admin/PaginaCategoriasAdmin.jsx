import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'

import EncabezadoAdmin from '../../components/molecules/EncabezadoAdmin.jsx'
import ModalConfirmacion from '../../components/molecules/ModalConfirmacion.jsx'
import TablaCategoriasAdmin from '../../components/organisms/TablaCategoriasAdmin.jsx'
import { useMensajeDeRuta } from '../../hooks/useMensajeDeRuta.js'
import { eliminarCategoria, listarCategorias } from '../../services/categoriasService.js'
import { listarProductos } from '../../services/productosService.js'

function contarProductosPorCategoria() {
  return listarProductos().reduce((conteo, producto) => {
    conteo[producto.idCategoria] = (conteo[producto.idCategoria] ?? 0) + 1
    return conteo
  }, {})
}

/** Mantenedor de categorías (nuevo en la EP2: antes estaban fijas en el código). */
function PaginaCategoriasAdmin() {
  const [categorias, setCategorias] = useState(listarCategorias)
  const [cantidadPorCategoria] = useState(contarProductosPorCategoria)
  const [porEliminar, setPorEliminar] = useState(null)
  const [mensaje, cerrarMensaje] = useMensajeDeRuta('mensaje')
  // Resultado de la última eliminación: { tipo: 'success'|'danger', texto }.
  const [resultado, setResultado] = useState(null)

  function confirmarEliminacion() {
    // Solo se muestra el aviso más reciente: el que llegó desde el formulario
    // (ej: "Se creó...") se cierra para que no queden dos avisos apilados.
    cerrarMensaje()
    try {
      eliminarCategoria(porEliminar.id)
      setCategorias(listarCategorias())
      setResultado({ tipo: 'success', texto: `Se eliminó la categoría ${porEliminar.nombre}.` })
    } catch (error) {
      // Regla de negocio del servicio: no se elimina una categoría con productos.
      setResultado({ tipo: 'danger', texto: error.message })
    }
    setPorEliminar(null)
  }

  return (
    <>
      <EncabezadoAdmin titulo="Categorías" descripcion={`${categorias.length} categorías en la tienda.`}>
        <Link to="/admin/categorias/nueva" className="btn btn-primary">
          Nueva categoría
        </Link>
      </EncabezadoAdmin>

      {mensaje && (
        <Alert variant="success" dismissible onClose={cerrarMensaje}>
          {mensaje}
        </Alert>
      )}
      {resultado && (
        <Alert variant={resultado.tipo} dismissible onClose={() => setResultado(null)}>
          {resultado.texto}
        </Alert>
      )}

      <Card>
        <Card.Body>
          <TablaCategoriasAdmin categorias={categorias} cantidadPorCategoria={cantidadPorCategoria} onEliminar={setPorEliminar} />
        </Card.Body>
      </Card>

      <ModalConfirmacion
        mostrar={Boolean(porEliminar)}
        titulo="Eliminar categoría"
        mensaje={`Se eliminará la categoría "${porEliminar?.nombre}". Solo es posible si no tiene productos. ¿Continuar?`}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setPorEliminar(null)}
      />
    </>
  )
}

export default PaginaCategoriasAdmin
