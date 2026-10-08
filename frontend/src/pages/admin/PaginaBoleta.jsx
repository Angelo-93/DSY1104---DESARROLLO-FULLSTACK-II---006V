import { Link, useParams } from 'react-router-dom'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'

import EstadoOrden from '../../components/atoms/EstadoOrden.jsx'
import EncabezadoAdmin from '../../components/molecules/EncabezadoAdmin.jsx'
import DetalleOrden from '../../components/organisms/DetalleOrden.jsx'
import { describirMotivoRechazo } from '../../services/compraService.js'
import { obtenerOrden } from '../../services/ordenesService.js'

/** Boleta de una orden en el panel: /admin/ordenes/:numeroOrden. */
function PaginaBoleta() {
  const { numeroOrden } = useParams()
  const orden = obtenerOrden(numeroOrden)

  if (!orden) {
    return (
      <>
        <EncabezadoAdmin titulo="Orden no encontrada" />
        <p className="text-secondary">No existe la orden N° {numeroOrden}.</p>
        <Link to="/admin/ordenes">Volver a Órdenes</Link>
      </>
    )
  }

  return (
    <>
      <EncabezadoAdmin titulo={`Boleta N° ${orden.numero}`}>
        <Link to="/admin/ordenes" className="btn btn-outline-secondary">
          Volver
        </Link>
        <button type="button" className="btn btn-primary" onClick={() => window.print()}>
          Imprimir
        </button>
      </EncabezadoAdmin>

      <Card>
        <Card.Body className="p-3 p-md-4">
          <p className="mb-3">
            Estado: <EstadoOrden estado={orden.estado} />
            {/* El cliente sin cuenta (invitado) no tiene RUN. */}
            <span className="text-secondary small ms-3">{orden.cliente.run ? 'Cliente registrado' : 'Compra como invitado'}</span>
          </p>
          {orden.estado === 'rechazada' && <Alert variant="danger">{describirMotivoRechazo(orden.motivoRechazo)}</Alert>}
          <DetalleOrden orden={orden} etiquetaTotal={orden.estado === 'pagada' ? 'Total pagado' : 'Total (no cobrado)'} />
        </Card.Body>
      </Card>
    </>
  )
}

export default PaginaBoleta
