import { Link } from 'react-router-dom'

/**
 * Acceso directo a una sección del panel (fila inferior de la Figura 9).
 * Toda la tarjeta es el enlace.
 *
 * @param {object} props
 * @param {{ruta: string, texto: string, descripcion: string}} props.seccion
 */
function TarjetaAcceso({ seccion }) {
  return (
    <Link to={seccion.ruta} className="tarjeta-acceso card h-100 text-decoration-none">
      <div className="card-body">
        <h2 className="h6 mb-1">{seccion.texto}</h2>
        <p className="small text-secondary mb-0">{seccion.descripcion}</p>
      </div>
    </Link>
  )
}

export default TarjetaAcceso
