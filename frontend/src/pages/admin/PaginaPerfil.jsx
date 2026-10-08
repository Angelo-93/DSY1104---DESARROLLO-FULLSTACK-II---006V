import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'

import EncabezadoAdmin from '../../components/molecules/EncabezadoAdmin.jsx'
import FormularioUsuario from '../../components/organisms/FormularioUsuario.jsx'
import { useSesion } from '../../hooks/useSesion.js'
import { actualizarUsuario, obtenerUsuario } from '../../services/usuariosService.js'

/**
 * Perfil del usuario conectado (Administrador o Vendedor): sus datos y su
 * contraseña. El rol no aparece: nadie se cambia su propio rol.
 */
function PaginaPerfil() {
  const { usuario: sesion, actualizarSesion } = useSesion()
  // Se leen los datos guardados (y no los de la sesión) por si otro
  // Administrador los cambió después de que este usuario inició sesión.
  const [usuario, setUsuario] = useState(() => obtenerUsuario(sesion.run))
  const [resultado, setResultado] = useState(null)
  // Cambia después de cada guardado: con una key nueva el formulario se
  // vuelve a montar y el campo de contraseña queda vacío otra vez.
  const [versionFormulario, setVersionFormulario] = useState(0)

  function manejarGuardado(datos) {
    try {
      const actualizado = actualizarUsuario(sesion.run, datos)
      actualizarSesion(actualizado) // el menú y la cabecera muestran lo nuevo
      setUsuario(actualizado) // el formulario vuelve a partir de lo guardado
      setResultado({ tipo: 'success', texto: 'Tus datos se guardaron correctamente.' })
      setVersionFormulario((version) => version + 1)
    } catch (error) {
      setResultado({ tipo: 'danger', texto: error.message })
    }
  }

  return (
    <>
      <EncabezadoAdmin titulo="Mi perfil" descripcion={`Rol: ${sesion.tipoUsuario}`} />
      {resultado && (
        <Alert variant={resultado.tipo} dismissible onClose={() => setResultado(null)}>
          {resultado.texto}
        </Alert>
      )}
      <Card>
        <Card.Body className="p-3 p-md-4">
          <FormularioUsuario key={versionFormulario} modo="perfil" usuario={usuario} onGuardar={manejarGuardado} />
        </Card.Body>
      </Card>
    </>
  )
}

export default PaginaPerfil
