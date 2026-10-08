import { useState } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import EncabezadoAdmin from '../../components/molecules/EncabezadoAdmin.jsx'
import TarjetaAcceso from '../../components/molecules/TarjetaAcceso.jsx'
import TarjetaIndicador from '../../components/molecules/TarjetaIndicador.jsx'
import { seccionesVisibles } from '../../data/seccionesAdmin.js'
import { useSesion } from '../../hooks/useSesion.js'
import { listarOrdenes } from '../../services/ordenesService.js'
import { listarProductos } from '../../services/productosService.js'
import { listarUsuarios } from '../../services/usuariosService.js'
import { resumirInventario, resumirUsuarios, resumirVentas } from '../../utils/estadisticas.js'
import { formatearPrecio } from '../../utils/formato.js'
import { esAdministrador } from '../../utils/permisos.js'

/** Inicio del panel (Anexo 1, Figura 9): indicadores y accesos directos. */
function PaginaDashboard() {
  const { usuario } = useSesion()
  // Los resúmenes se calculan una vez al abrir el Dashboard.
  const [ventas] = useState(() => resumirVentas(listarOrdenes()))
  const [inventario] = useState(() => resumirInventario(listarProductos()))
  const [usuarios] = useState(() => resumirUsuarios(listarUsuarios()))
  const administrador = esAdministrador(usuario)

  // El Dashboard no se enlaza a sí mismo: se quita de los accesos.
  const accesos = seccionesVisibles(administrador).filter((seccion) => seccion.ruta !== '/admin')

  return (
    <>
      <EncabezadoAdmin titulo="Dashboard" descripcion={`Hola, ${usuario.nombre}. Este es el resumen de la tienda.`} />

      <Row xs={1} md={3} className="g-3 mb-4">
        <Col>
          <TarjetaIndicador
            titulo="Compras"
            valor={ventas.pagadas}
            detalle={`Ventas: ${formatearPrecio(ventas.montoVendido)} · ${ventas.rechazadas} rechazadas`}
          />
        </Col>
        <Col>
          <TarjetaIndicador
            titulo="Productos"
            valor={inventario.productos}
            detalle={`Inventario: ${inventario.unidades} unidades · ${inventario.criticos} en stock crítico`}
            variante="exito"
          />
        </Col>
        <Col>
          {/* Las cifras de usuarios son del Administrador; el Vendedor no
              gestiona usuarios, así que ve el inventario agotado en su lugar. */}
          {administrador ? (
            <TarjetaIndicador
              titulo="Usuarios"
              valor={usuarios.usuarios}
              detalle={`Clientes: ${usuarios.clientes} · Personal: ${usuarios.personal}`}
              variante="acento"
            />
          ) : (
            <TarjetaIndicador
              titulo="Agotados"
              valor={inventario.agotados}
              detalle="Productos sin stock disponible"
              variante="acento"
            />
          )}
        </Col>
      </Row>

      <Row xs={1} sm={2} xl={3} className="g-3">
        {accesos.map((seccion) => (
          <Col key={seccion.ruta}>
            <TarjetaAcceso seccion={seccion} />
          </Col>
        ))}
        <Col>
          <TarjetaAcceso seccion={{ ruta: '/', texto: 'Tienda', descripcion: 'Ver la tienda como la ven los clientes.' }} />
        </Col>
      </Row>
    </>
  )
}

export default PaginaDashboard
