import { useState } from 'react'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'

import EncabezadoAdmin from '../../components/molecules/EncabezadoAdmin.jsx'
import TarjetaIndicador from '../../components/molecules/TarjetaIndicador.jsx'
import GraficoBarras from '../../components/organisms/GraficoBarras.jsx'
import { obtenerNombresCategoria } from '../../services/categoriasService.js'
import { listarOrdenes } from '../../services/ordenesService.js'
import { productosMasVendidos, resumirVentas, ventasPorCategoria, ventasPorMes } from '../../utils/estadisticas.js'
import { formatearPrecio } from '../../utils/formato.js'

// Montos de los ejes en forma corta ($1,2 M, $350 mil): el valor exacto
// aparece en el tooltip y en la tabla.
const FORMATO_CORTO = new Intl.NumberFormat('es-CL', { notation: 'compact', maximumFractionDigits: 1 })
function precioCorto(valor) {
  return `$${FORMATO_CORTO.format(valor)}`
}

function calcularReporte() {
  const ordenes = listarOrdenes()
  const resumen = resumirVentas(ordenes)
  return {
    resumen,
    ticketPromedio: resumen.pagadas ? Math.round(resumen.montoVendido / resumen.pagadas) : 0,
    porMes: ventasPorMes(ordenes),
    porCategoria: ventasPorCategoria(ordenes, obtenerNombresCategoria()),
    masVendidos: productosMasVendidos(ordenes, 5),
  }
}

/** Reportes de ventas (solo Administrador). Cuentan solo las órdenes pagadas. */
function PaginaReportes() {
  const [reporte] = useState(calcularReporte)
  const { resumen, ticketPromedio, porMes, porCategoria, masVendidos } = reporte

  if (resumen.pagadas === 0) {
    return (
      <>
        <EncabezadoAdmin titulo="Reportes" />
        <p className="text-secondary">Todavía no hay compras pagadas para generar reportes.</p>
      </>
    )
  }

  return (
    <>
      <EncabezadoAdmin titulo="Reportes" descripcion="Calculados con las órdenes pagadas; las rechazadas no cuentan como venta.">
        <button type="button" className="btn btn-outline-primary" onClick={() => window.print()}>
          Imprimir
        </button>
      </EncabezadoAdmin>

      <Row xs={1} md={3} className="g-3 mb-4">
        <Col>
          <TarjetaIndicador titulo="Ventas totales" valor={formatearPrecio(resumen.montoVendido)} detalle={`${resumen.pagadas} compras pagadas`} />
        </Col>
        <Col>
          <TarjetaIndicador titulo="Ticket promedio" valor={formatearPrecio(ticketPromedio)} detalle="Monto medio por compra" variante="exito" />
        </Col>
        <Col>
          <TarjetaIndicador
            titulo="Unidades vendidas"
            valor={porCategoria.reduce((total, c) => total + c.unidades, 0)}
            detalle={`${resumen.rechazadas} pagos rechazados`}
            variante="acento"
          />
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <h2 className="h5">Ventas por mes</h2>
          <GraficoBarras
            titulo="Ventas por mes"
            etiquetas={porMes.map((m) => m.etiqueta)}
            valores={porMes.map((m) => m.total)}
            formatoValor={precioCorto}
          />
        </Card.Body>
      </Card>

      {/* Dos gráficos lado a lado desde pantallas grandes; uno bajo otro en celular. */}
      <Row className="g-4 mb-4">
        <Col xs={12} lg={6}>
          <Card className="h-100">
            <Card.Body>
              <h2 className="h5">Ventas por categoría</h2>
              <GraficoBarras
                titulo="Ventas por categoría"
                etiquetas={porCategoria.map((c) => c.nombre)}
                valores={porCategoria.map((c) => c.total)}
                formatoValor={precioCorto}
                horizontal
              />
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card className="h-100">
            <Card.Body>
              <h2 className="h5">Productos más vendidos (unidades)</h2>
              <GraficoBarras
                titulo="Productos más vendidos en unidades"
                etiquetas={masVendidos.map((p) => p.nombre)}
                valores={masVendidos.map((p) => p.unidades)}
                formatoValor={(valor) => `${valor} u.`}
                horizontal
                soloEnteros
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Los mismos datos en tabla: valores exactos, y una alternativa para
          quien no puede ver el gráfico. */}
      <Card>
        <Card.Body>
          <h2 className="h5">Detalle por categoría</h2>
          <Table responsive className="mb-0">
            <thead>
              {/* text-nowrap: sin él, "% del total" se parte en tres líneas en el
                  celular y deja un hueco alto sobre los demás encabezados. */}
              <tr className="text-nowrap">
                <th scope="col">Categoría</th>
                <th scope="col" className="text-end">Unidades</th>
                <th scope="col" className="text-end">Ventas</th>
                <th scope="col" className="text-end">% del total</th>
              </tr>
            </thead>
            <tbody>
              {porCategoria.map((categoria) => (
                <tr key={categoria.nombre}>
                  <td>{categoria.nombre}</td>
                  <td className="text-end">{categoria.unidades}</td>
                  <td className="text-end">{formatearPrecio(categoria.total)}</td>
                  <td className="text-end">{Math.round((categoria.total / resumen.montoVendido) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  )
}

export default PaginaReportes
