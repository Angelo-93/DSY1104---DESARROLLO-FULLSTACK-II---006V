import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import { formatearFecha, formatearPrecio } from '../../utils/formato.js'
import TablaCarrito from './TablaCarrito.jsx'

// Un dato de solo lectura con su etiqueta. <dt>/<dd> (lista de definiciones)
// es la etiqueta HTML pensada para pares "nombre: valor".
function Dato({ etiqueta, valor, ancho = 4 }) {
  return (
    <Col xs={12} md={ancho}>
      <dt className="small text-secondary fw-normal">{etiqueta}</dt>
      <dd className="mb-3">{valor || '—'}</dd>
    </Col>
  )
}

/**
 * Detalle completo de una orden: cliente, dirección, productos y total
 * (Figuras 7 y 8 del Anexo). Lo usan la compra exitosa, el pago con error y,
 * en el Bloque 6, la boleta del panel administrador.
 *
 * @param {object} props
 * @param {object} props.orden - Una orden de ordenesService.
 * @param {string} [props.etiquetaTotal='Total'] - "Total pagado", "Total a pagar"...
 */
function DetalleOrden({ orden, etiquetaTotal = 'Total' }) {
  const { cliente, direccion } = orden

  return (
    <>
      <p className="small text-secondary">Fecha: {formatearFecha(orden.fecha)}</p>

      <h2 className="h5">Datos del cliente</h2>
      <Row as="dl" className="mb-2">
        <Dato etiqueta="Nombre" valor={cliente.nombre} />
        <Dato etiqueta="Apellidos" valor={cliente.apellidos} />
        <Dato etiqueta="Correo" valor={cliente.correo} />
      </Row>

      <h2 className="h5">Dirección de entrega</h2>
      <Row as="dl" className="mb-2">
        <Dato etiqueta="Calle" valor={direccion.calle} ancho={8} />
        <Dato etiqueta="Departamento" valor={direccion.departamento} />
        <Dato etiqueta="Región" valor={direccion.region} ancho={8} />
        <Dato etiqueta="Comuna" valor={direccion.comuna} />
        <Dato etiqueta="Indicaciones para la entrega" valor={direccion.indicaciones} ancho={12} />
      </Row>

      <h2 className="h5">Productos</h2>
      <TablaCarrito items={orden.items} />

      <p className="total-orden fs-4 fw-bold text-end mt-3 mb-0">
        {etiquetaTotal}: {formatearPrecio(orden.total)}
      </p>
    </>
  )
}

export default DetalleOrden
