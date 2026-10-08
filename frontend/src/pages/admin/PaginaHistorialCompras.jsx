import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import EncabezadoAdmin from '../../components/molecules/EncabezadoAdmin.jsx'
import TarjetaIndicador from '../../components/molecules/TarjetaIndicador.jsx'
import TablaOrdenes from '../../components/organisms/TablaOrdenes.jsx'
import { listarOrdenesPorCorreo } from '../../services/ordenesService.js'
import { obtenerUsuario } from '../../services/usuariosService.js'
import { resumirVentas } from '../../utils/estadisticas.js'
import { formatearPrecio, formatearRun } from '../../utils/formato.js'

/**
 * Historial de compras de un usuario: /admin/usuarios/:run/historial.
 * Busca por correo, así también aparecen las compras que hizo como invitado
 * antes de crear su cuenta (ver ordenesService.listarOrdenesPorCorreo).
 */
function PaginaHistorialCompras() {
  const { run } = useParams()
  const [usuario] = useState(() => obtenerUsuario(run))
  const [ordenes] = useState(() => (usuario ? listarOrdenesPorCorreo(usuario.correo) : []))

  if (!usuario) {
    return (
      <>
        <EncabezadoAdmin titulo="Usuario no encontrado" />
        <Link to="/admin/usuarios">Volver a Usuarios</Link>
      </>
    )
  }

  const resumen = resumirVentas(ordenes)

  return (
    <>
      <EncabezadoAdmin
        titulo={`Historial de compras de ${usuario.nombre} ${usuario.apellidos}`}
        descripcion={`RUN ${formatearRun(usuario.run)} · ${usuario.correo}`}
      >
        <Link to="/admin/usuarios" className="btn btn-outline-secondary">
          Volver a Usuarios
        </Link>
      </EncabezadoAdmin>

      <Row xs={1} md={2} className="g-3 mb-4">
        <Col>
          <TarjetaIndicador titulo="Compras pagadas" valor={resumen.pagadas} detalle={`${resumen.rechazadas} pagos rechazados`} />
        </Col>
        <Col>
          <TarjetaIndicador titulo="Total gastado" valor={formatearPrecio(resumen.montoVendido)} detalle="Suma de las compras pagadas" variante="exito" />
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <TablaOrdenes ordenes={ordenes} mensajeVacio="Este usuario todavía no ha comprado." />
        </Card.Body>
      </Card>
    </>
  )
}

export default PaginaHistorialCompras
