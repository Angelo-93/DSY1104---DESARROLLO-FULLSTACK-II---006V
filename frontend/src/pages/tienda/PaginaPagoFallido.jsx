import { Link, useNavigate, useParams } from 'react-router-dom'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import IconoEstado from '../../components/atoms/IconoEstado.jsx'
import DetalleOrden from '../../components/organisms/DetalleOrden.jsx'
import { describirMotivoRechazo } from '../../services/compraService.js'
import { obtenerOrden } from '../../services/ordenesService.js'

/** Pago con error (Anexo 1, Figura 8): explica el rechazo y permite reintentar. */
function PaginaPagoFallido() {
  const { numeroOrden } = useParams()
  const navegar = useNavigate()
  const orden = obtenerOrden(numeroOrden)

  if (!orden || orden.estado !== 'rechazada') {
    return (
      <Container className="py-5">
        <h1 className="h3">Orden no encontrada</h1>
        <p className="text-secondary">No existe un pago rechazado con el número {numeroOrden}.</p>
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
      </Container>
    )
  }

  const faltaStock = orden.motivoRechazo?.tipo === 'stock'

  // El número de la orden viaja en el "state" de la navegación: el checkout lo
  // usa para precargar los mismos datos y el cliente no tiene que reescribirlos.
  function reintentarPago() {
    navegar('/checkout', { state: { reintentarOrden: orden.numero } })
  }

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} lg={10} xl={9}>
          <Card className="shadow-sm">
            <Card.Body className="p-3 p-md-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <IconoEstado tipo="error" />
                <h1 className="h3 mb-0">No se pudo realizar el pago. Orden N° {orden.numero}</h1>
              </div>

              <Alert variant="danger">{describirMotivoRechazo(orden.motivoRechazo)}</Alert>

              <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                {/* Renderizado condicional: sin stock, reintentar daría el mismo
                    error, así que primero se ofrece corregir el carrito. */}
                {faltaStock ? (
                  <Link to="/carrito" className="btn btn-acento">
                    Revisar carrito
                  </Link>
                ) : (
                  <button type="button" className="btn btn-success" onClick={reintentarPago}>
                    Volver a realizar el pago
                  </button>
                )}
              </div>

              <DetalleOrden orden={orden} etiquetaTotal="Total a pagar" />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default PaginaPagoFallido
