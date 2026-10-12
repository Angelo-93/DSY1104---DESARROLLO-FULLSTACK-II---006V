import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

import EncabezadoAdmin from '../../components/molecules/EncabezadoAdmin.jsx'
import ModalConfirmacion from '../../components/molecules/ModalConfirmacion.jsx'
import TablaUsuariosAdmin from '../../components/organisms/TablaUsuariosAdmin.jsx'
import { useMensajeDeRuta } from '../../hooks/useMensajeDeRuta.js'
import { useSesion } from '../../hooks/useSesion.js'
import { eliminarUsuario, listarUsuarios } from '../../services/usuariosService.js'
import { normalizarTexto, pluralizar } from '../../utils/texto.js'

/** Mantenedor de usuarios (solo Administrador). */
function PaginaUsuariosAdmin() {
  const { usuario: sesion } = useSesion()
  const [usuarios, setUsuarios] = useState(listarUsuarios)
  const [busqueda, setBusqueda] = useState('')
  // El usuario elegido se conserva aunque el modal se cierre: así su nombre no
  // desaparece del texto durante la animación de cierre. Que el modal se vea
  // lo decide "confirmando".
  const [porEliminar, setPorEliminar] = useState(null)
  const [confirmando, setConfirmando] = useState(false)
  const [mensaje, cerrarMensaje] = useMensajeDeRuta('mensaje')
  const [resultado, setResultado] = useState(null)

  const buscado = normalizarTexto(busqueda)
  const filtrados = usuarios.filter((u) =>
    normalizarTexto(`${u.run} ${u.nombre} ${u.apellidos} ${u.correo} ${u.tipoUsuario}`).includes(buscado),
  )

  function pedirConfirmacion(usuario) {
    setPorEliminar(usuario)
    setConfirmando(true)
  }

  function confirmarEliminacion() {
    // Un segundo clic durante la animación de cierre no debe eliminar dos veces.
    if (!confirmando) return
    setConfirmando(false)
    // Solo se muestra el aviso más reciente: el que llegó desde el formulario
    // (ej: "Se creó...") se cierra para que no queden dos avisos apilados.
    cerrarMensaje()
    try {
      eliminarUsuario(porEliminar.run)
      setUsuarios(listarUsuarios())
      setResultado({ tipo: 'success', texto: `Se eliminó la cuenta de ${porEliminar.nombre} ${porEliminar.apellidos}.` })
    } catch (error) {
      setResultado({ tipo: 'danger', texto: error.message }) // ej: único Administrador
    }
  }

  return (
    <>
      <EncabezadoAdmin titulo="Usuarios" descripcion={`${pluralizar(usuarios.length, 'cuenta registrada', 'cuentas registradas')}.`}>
        <Link to="/admin/usuarios/nuevo" className="btn btn-primary">
          Nuevo usuario
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

      <Form.Control
        type="search"
        className="mb-3"
        placeholder="Buscar por RUN, nombre, correo o rol..."
        aria-label="Buscar usuarios"
        value={busqueda}
        onChange={(evento) => setBusqueda(evento.target.value)}
      />

      <Card>
        <Card.Body>
          <TablaUsuariosAdmin
            usuarios={filtrados}
            runSesion={sesion.run}
            onEliminar={pedirConfirmacion}
            mensajeVacio="Ningún usuario coincide con la búsqueda."
          />
        </Card.Body>
      </Card>

      <ModalConfirmacion
        mostrar={confirmando}
        titulo="Eliminar usuario"
        mensaje={`Se eliminará la cuenta de ${porEliminar?.nombre} ${porEliminar?.apellidos}. Sus órdenes se conservan. ¿Continuar?`}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setConfirmando(false)}
      />
    </>
  )
}

export default PaginaUsuariosAdmin
