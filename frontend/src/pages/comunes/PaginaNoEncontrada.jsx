import { Link, useLocation } from 'react-router-dom'
import Container from 'react-bootstrap/Container'

/**
 * Página 404: se muestra cuando la URL no coincide con ninguna ruta
 * (rutas comodín "*" en App.jsx, como se vio en la clase del 21-09).
 * Se usa en la tienda y en el panel; los botones llevan al inicio de cada uno.
 */
function PaginaNoEncontrada() {
  // useLocation entrega la URL actual: mostrarla ayuda al cliente a notar
  // si se equivocó al escribirla.
  const { pathname } = useLocation()
  const enPanel = pathname.startsWith('/admin')

  return (
    <Container className="py-5 text-center">
      <p className="codigo-error mb-3" aria-hidden="true">404</p>
      <h1 className="h3">No encontramos esta página</h1>
      <p className="text-secondary">
        La dirección <code>{pathname}</code> no existe {enPanel ? 'en el panel' : 'en la tienda'}.
      </p>
      <div className="d-flex justify-content-center flex-wrap gap-2 mt-4">
        {enPanel ? (
          <Link className="btn btn-primary" to="/admin">
            Volver al Dashboard
          </Link>
        ) : (
          <>
            <Link className="btn btn-primary" to="/">
              Volver al inicio
            </Link>
            <Link className="btn btn-outline-primary" to="/productos">
              Ver productos
            </Link>
          </>
        )}
      </div>
    </Container>
  )
}

export default PaginaNoEncontrada
