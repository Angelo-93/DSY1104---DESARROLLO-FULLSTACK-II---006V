import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

/**
 * Ventana que pide confirmar una acción que no se puede deshacer (vaciar el
 * carrito; en el admin, eliminar productos, categorías o usuarios).
 * Reemplaza a window.confirm(), que no se puede estilar ni probar bien.
 *
 * @param {object} props
 * @param {boolean} props.mostrar
 * @param {string} props.titulo
 * @param {string} props.mensaje
 * @param {string} [props.textoConfirmar='Confirmar']
 * @param {() => void} props.onConfirmar
 * @param {() => void} props.onCancelar - También se llama al cerrar con la X o Escape.
 */
function ModalConfirmacion({ mostrar, titulo, mensaje, textoConfirmar = 'Confirmar', onConfirmar, onCancelar }) {
  return (
    <Modal show={mostrar} onHide={onCancelar} centered>
      <Modal.Header closeButton closeLabel="Cerrar">
        <Modal.Title as="h2" className="h5">
          {titulo}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{mensaje}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirmar}>
          {textoConfirmar}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalConfirmacion
