import { Link } from 'react-router-dom'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'

/**
 * Aviso que aparece en una esquina sin mover el resto de la página (Toast de
 * Bootstrap) y se cierra solo a los 4 segundos.
 *
 * @param {object} props
 * @param {{tipo: 'exito'|'advertencia', texto: string}|null} props.aviso - null = oculto.
 * @param {() => void} props.onCerrar
 */
function AvisoFlotante({ aviso, onCerrar }) {
  return (
    <ToastContainer position="bottom-end" className="p-3 position-fixed">
      <Toast show={Boolean(aviso)} onClose={onCerrar} delay={4000} autohide bg={aviso?.tipo === 'advertencia' ? 'warning' : 'light'}>
        <Toast.Header closeLabel="Cerrar aviso">
          <strong className="me-auto">{aviso?.tipo === 'advertencia' ? 'Stock limitado' : 'Carrito actualizado'}</strong>
        </Toast.Header>
        <Toast.Body>
          {/* role="status": el lector de pantalla anuncia el mensaje sin mover el foco. */}
          <p className="mb-2" role="status">{aviso?.texto}</p>
          <Link to="/carrito" className="small">
            Ver carrito
          </Link>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  )
}

export default AvisoFlotante
