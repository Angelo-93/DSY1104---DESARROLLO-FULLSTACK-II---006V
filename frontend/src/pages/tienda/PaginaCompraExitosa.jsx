import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import CelebracionCompra from '../../components/atoms/CelebracionCompra.jsx'
import IconoEstado from '../../components/atoms/IconoEstado.jsx'
import DetalleOrden from '../../components/organisms/DetalleOrden.jsx'
import { obtenerOrden } from '../../services/ordenesService.js'

/**
 * Compra exitosa (Anexo 1, Figura 7): confirma la orden y muestra la boleta.
 *
 * Nota: en la EP2 todo vive en el navegador del cliente, así que cualquiera
 * que escriba la URL ve la orden. En la EP3 el servidor solo la entregará a
 * su dueño.
 */
function PaginaCompraExitosa() {
  const { numeroOrden } = useParams()
  const orden = obtenerOrden(numeroOrden)
  const [boletaEnviada, setBoletaEnviada] = useState(false)

  // Una orden rechazada no tiene boleta: no se muestra aquí aunque exista.
  if (!orden || orden.estado !== 'pagada') {
    return (
      <Container className="py-5">
        <h1 className="h3">Orden no encontrada</h1>
        <p className="text-secondary">No existe una compra pagada con el número {numeroOrden}.</p>
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      {/* d-print-none (Bootstrap): no aparece al imprimir la boleta. */}
      <div className="d-print-none">
        <CelebracionCompra />
      </div>

      <Row className="justify-content-center">
        <Col xs={12} lg={10} xl={9}>
          <Card className="shadow-sm">
            <Card.Body className="p-3 p-md-4">
              <div className="d-flex align-items-center gap-3 mb-2">
                <IconoEstado tipo="exito" />
                <h1 className="h3 mb-0">Se ha realizado la compra. Orden N° {orden.numero}</h1>
              </div>
              <p className="text-secondary">
                Te enviaremos la confirmación del despacho a <strong>{orden.cliente.correo}</strong>.
              </p>

              <DetalleOrden orden={orden} etiquetaTotal="Total pagado" />

              {boletaEnviada && (
                <Alert variant="info" className="mt-3 small d-print-none" onClose={() => setBoletaEnviada(false)} dismissible>
                  Simulación: la boleta se enviaría a {orden.cliente.correo}. El envío real de correos requiere el
                  backend de la EP3.
                </Alert>
              )}

              <div className="d-flex flex-wrap justify-content-center gap-2 mt-4 d-print-none">
                {/* window.print() abre el diálogo de impresión del navegador,
                    donde se puede elegir "Guardar como PDF". Sin librerías extra. */}
                <button type="button" className="btn btn-outline-danger" onClick={() => window.print()}>
                  Imprimir boleta en PDF
                </button>
                <button type="button" className="btn btn-outline-success" onClick={() => setBoletaEnviada(true)}>
                  Enviar boleta por email
                </button>
                <Link to="/productos" className="btn btn-primary">
                  Seguir comprando
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default PaginaCompraExitosa
