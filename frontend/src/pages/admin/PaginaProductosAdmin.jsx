import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

import EncabezadoAdmin from '../../components/molecules/EncabezadoAdmin.jsx'
import ModalConfirmacion from '../../components/molecules/ModalConfirmacion.jsx'
import TablaProductosAdmin from '../../components/organisms/TablaProductosAdmin.jsx'
import { useMensajeDeRuta } from '../../hooks/useMensajeDeRuta.js'
import { useSesion } from '../../hooks/useSesion.js'
import { obtenerNombresCategoria } from '../../services/categoriasService.js'
import { eliminarProducto, listarProductos } from '../../services/productosService.js'
import { esAdministrador } from '../../utils/permisos.js'
import { normalizarTexto } from '../../utils/texto.js'

/**
 * Inventario del panel. El Administrador crea, edita y elimina; el Vendedor
 * ve la misma lista en solo lectura (Anexo 1 EP1: roles).
 */
function PaginaProductosAdmin() {
  const { usuario } = useSesion()
  const puedeEditar = esAdministrador(usuario)
  const [productos, setProductos] = useState(listarProductos)
  const [nombresCategoria] = useState(obtenerNombresCategoria)
  const [busqueda, setBusqueda] = useState('')
  const [porEliminar, setPorEliminar] = useState(null) // producto que espera confirmación
  const [mensaje, cerrarMensaje] = useMensajeDeRuta('mensaje') // viene del formulario al guardar
  const [mensajeEliminado, setMensajeEliminado] = useState('')

  const buscado = normalizarTexto(busqueda)
  const filtrados = productos.filter((producto) =>
    normalizarTexto(`${producto.codigo} ${producto.nombre}`).includes(buscado),
  )

  function confirmarEliminacion() {
    eliminarProducto(porEliminar.codigo)
    // Se vuelve a leer desde el servicio: así la tabla muestra lo que
    // realmente quedó guardado, no una copia que podría desincronizarse.
    setProductos(listarProductos())
    setMensajeEliminado(`Se eliminó ${porEliminar.nombre}.`)
    // Solo se muestra el aviso más reciente: el que llegó desde el formulario
    // (ej: "Producto creado") se cierra para que no queden dos avisos apilados.
    cerrarMensaje()
    setPorEliminar(null)
  }

  return (
    <>
      <EncabezadoAdmin titulo="Productos" descripcion={`${productos.length} productos en el catálogo.`}>
        <Link to="/admin/productos/criticos" className="btn btn-outline-primary">
          Productos críticos
        </Link>
        {puedeEditar && (
          <Link to="/admin/productos/nuevo" className="btn btn-primary">
            Nuevo producto
          </Link>
        )}
      </EncabezadoAdmin>

      {mensaje && (
        <Alert variant="success" dismissible onClose={cerrarMensaje}>
          {mensaje}
        </Alert>
      )}
      {mensajeEliminado && (
        <Alert variant="success" dismissible onClose={() => setMensajeEliminado('')}>
          {mensajeEliminado}
        </Alert>
      )}
      {!puedeEditar && (
        <Alert variant="info" className="small">
          Tu rol (Vendedor) permite consultar el inventario. Para cambiarlo, contacta a un Administrador.
        </Alert>
      )}

      <Form.Control
        type="search"
        className="mb-3"
        placeholder="Buscar por código o nombre..."
        aria-label="Buscar productos"
        value={busqueda}
        onChange={(evento) => setBusqueda(evento.target.value)}
      />

      <Card>
        <Card.Body>
          <TablaProductosAdmin
            productos={filtrados}
            nombresCategoria={nombresCategoria}
            puedeEditar={puedeEditar}
            onEliminar={setPorEliminar}
            mensajeVacio="Ningún producto coincide con la búsqueda."
          />
        </Card.Body>
      </Card>

      <ModalConfirmacion
        mostrar={Boolean(porEliminar)}
        titulo="Eliminar producto"
        mensaje={`Se eliminará "${porEliminar?.nombre}" del catálogo. Las órdenes anteriores conservan su detalle. ¿Continuar?`}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setPorEliminar(null)}
      />
    </>
  )
}

export default PaginaProductosAdmin
