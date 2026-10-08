import { Link } from 'react-router-dom'
import Breadcrumb from 'react-bootstrap/Breadcrumb'

/**
 * Migas de pan ("Inicio / Productos / HP 250 G10"), como en la EP1.
 * El último elemento es la página actual y no lleva enlace.
 *
 * @param {object} props
 * @param {Array<{texto: string, ruta?: string}>} props.elementos - Sin contar
 *   "Inicio", que siempre va primero.
 */
function RutaNavegacion({ elementos }) {
  const todos = [{ texto: 'Inicio', ruta: '/' }, ...elementos]

  return (
    <Breadcrumb aria-label="Ruta de navegación" className="small">
      {todos.map((elemento, indice) => {
        const esActual = indice === todos.length - 1
        return esActual ? (
          <Breadcrumb.Item key={elemento.texto} active>
            {elemento.texto}
          </Breadcrumb.Item>
        ) : (
          // linkAs: el Breadcrumb de Bootstrap dibuja <a href>, que recargaría la
          // página; con Link de React Router la navegación queda dentro de la SPA.
          <Breadcrumb.Item key={elemento.texto} linkAs={Link} linkProps={{ to: elemento.ruta }}>
            {elemento.texto}
          </Breadcrumb.Item>
        )
      })}
    </Breadcrumb>
  )
}

export default RutaNavegacion
