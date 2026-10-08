import { Link } from 'react-router-dom'
import Container from 'react-bootstrap/Container'

import { useSesion } from '../../hooks/useSesion.js'
import { puedeEntrarAlPanel } from '../../utils/permisos.js'

/**
 * Se muestra cuando hay sesión pero el rol no alcanza: un Cliente que escribe
 * /admin, o un Vendedor que intenta entrar a Usuarios.
 * Se distingue del caso "sin sesión", que en cambio lleva al login.
 */
function PaginaAccesoDenegado() {
  const { usuario } = useSesion()

  return (
    <Container className="py-5 text-center">
      <p className="codigo-error mb-3" aria-hidden="true">403</p>
      <h1 className="h3">No tienes permiso para ver esta sección</h1>
      <p className="text-secondary">
        Iniciaste sesión como {usuario.nombre} ({usuario.tipoUsuario}).
      </p>
      <div className="d-flex justify-content-center flex-wrap gap-2 mt-4">
        {/* Renderizado condicional: el botón al panel solo tiene sentido
            para quien puede entrar a él (el Vendedor). */}
        {puedeEntrarAlPanel(usuario) && (
          <Link className="btn btn-primary" to="/admin">
            Volver al panel
          </Link>
        )}
        <Link className="btn btn-outline-primary" to="/">
          Ir a la tienda
        </Link>
      </div>
    </Container>
  )
}

export default PaginaAccesoDenegado
