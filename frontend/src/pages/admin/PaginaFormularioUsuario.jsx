import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Card from 'react-bootstrap/Card'

import EncabezadoAdmin from '../../components/molecules/EncabezadoAdmin.jsx'
import FormularioUsuario from '../../components/organisms/FormularioUsuario.jsx'
import { useSesion } from '../../hooks/useSesion.js'
import { actualizarUsuario, crearUsuario, obtenerUsuario } from '../../services/usuariosService.js'

/** Nuevo usuario (/admin/usuarios/nuevo) y Editar usuario (/admin/usuarios/:run/editar). */
function PaginaFormularioUsuario() {
  const { run } = useParams()
  const navegar = useNavigate()
  const { usuario: sesion, actualizarSesion } = useSesion()
  const [errorGeneral, setErrorGeneral] = useState('')
  const esEdicion = Boolean(run)
  const usuario = esEdicion ? obtenerUsuario(run) : null
  // El admin que se edita a sí mismo no puede cambiar su rol: podría quedar
  // fuera del panel en medio de la edición.
  const esSuPropiaCuenta = esEdicion && usuario?.run === sesion.run

  if (esEdicion && !usuario) {
    return (
      <>
        <EncabezadoAdmin titulo="Usuario no encontrado" />
        <Link to="/admin/usuarios">Volver a Usuarios</Link>
      </>
    )
  }

  function manejarGuardado(datos) {
    try {
      const guardado = esEdicion ? actualizarUsuario(usuario.run, datos) : crearUsuario(datos)
      // Si se editó a sí mismo, el menú y la cabecera deben mostrar los datos nuevos.
      if (esSuPropiaCuenta) actualizarSesion(guardado)
      const accion = esEdicion ? 'actualizó' : 'creó'
      navegar('/admin/usuarios', { state: { mensaje: `Se ${accion} la cuenta de ${guardado.nombre} ${guardado.apellidos}.` } })
    } catch (error) {
      setErrorGeneral(error.message) // RUN o correo repetido, último Administrador
    }
  }

  return (
    <>
      <EncabezadoAdmin titulo={esEdicion ? `Editar usuario ${usuario.nombre} ${usuario.apellidos}` : 'Nuevo usuario'} />
      <Card>
        <Card.Body className="p-3 p-md-4">
          <FormularioUsuario
            modo={esEdicion ? 'editar' : 'nuevo'}
            usuario={usuario ?? undefined}
            bloquearRol={esSuPropiaCuenta}
            onGuardar={manejarGuardado}
            onCancelar={() => navegar('/admin/usuarios')}
            errorGeneral={errorGeneral}
          />
        </Card.Body>
      </Card>
    </>
  )
}

export default PaginaFormularioUsuario
