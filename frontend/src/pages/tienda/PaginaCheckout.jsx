import { startTransition } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import RutaNavegacion from '../../components/molecules/RutaNavegacion.jsx'
import FormularioEntrega from '../../components/organisms/FormularioEntrega.jsx'
import TablaCarrito from '../../components/organisms/TablaCarrito.jsx'
import { useCarrito } from '../../hooks/useCarrito.js'
import { useSesion } from '../../hooks/useSesion.js'
import { procesarCompra } from '../../services/compraService.js'
import { obtenerOrden } from '../../services/ordenesService.js'
import { formatearPrecio } from '../../utils/formato.js'

/**
 * Datos con que parte el formulario, en orden de prioridad:
 * 1. Reintento de un pago rechazado: los mismos datos de esa orden.
 * 2. Sesión iniciada: los datos del usuario (lo que pide la nota de la Figura 6).
 * 3. Invitado: formulario vacío.
 */
function calcularDatosIniciales(numeroReintento, usuario) {
  const ordenAnterior = numeroReintento ? obtenerOrden(numeroReintento) : null
  if (ordenAnterior) return { ...ordenAnterior.cliente, ...ordenAnterior.direccion }

  if (usuario) {
    return {
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      correo: usuario.correo,
      calle: usuario.direccion,
      region: usuario.region,
      comuna: usuario.comuna,
    }
  }
  return {}
}

/** Checkout: resumen, datos del cliente y dirección de entrega (Anexo 1, Figura 6). */
function PaginaCheckout() {
  const { items, total, vaciarCarrito } = useCarrito()
  const { usuario } = useSesion()
  const ubicacion = useLocation()
  const navegar = useNavigate()

  if (items.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h1 className="h3">No hay productos para pagar</h1>
        <p className="text-secondary">Tu carrito está vacío.</p>
        <Link to="/productos" className="btn btn-primary">
          Ver catálogo
        </Link>
      </Container>
    )
  }

  const datosIniciales = calcularDatosIniciales(ubicacion.state?.reintentarOrden, usuario)

  function manejarPago(datos, { simularRechazo }) {
    const orden = procesarCompra({
      cliente: {
        run: usuario?.run ?? null, // null = compra como invitado
        nombre: datos.nombre.trim(),
        apellidos: datos.apellidos.trim(),
        correo: datos.correo.trim().toLowerCase(),
      },
      direccion: {
        calle: datos.calle.trim(),
        departamento: datos.departamento.trim(),
        region: datos.region,
        comuna: datos.comuna,
        indicaciones: datos.indicaciones.trim(),
      },
      items,
      simularRechazo,
    })

    // startTransition: vaciar el carrito y navegar se aplican juntos (mismo
    // motivo que en useCerrarSesion). Si no, el checkout alcanzaría a mostrar
    // "No hay productos para pagar" antes de cambiar de página.
    startTransition(() => {
      if (orden.estado === 'pagada') {
        vaciarCarrito() // un pago rechazado conserva el carrito para reintentar
        navegar(`/compra/exitosa/${orden.numero}`)
      } else {
        navegar(`/compra/fallida/${orden.numero}`)
      }
    })
  }

  return (
    <Container className="py-4">
      <RutaNavegacion elementos={[{ texto: 'Carrito', ruta: '/carrito' }, { texto: 'Checkout' }]} />

      <Row className="justify-content-center">
        <Col xs={12} lg={10} xl={9}>
          <Card className="shadow-sm">
            <Card.Body className="p-3 p-md-4">
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                <div>
                  <h1 className="h3 mb-1">Carrito de compra</h1>
                  <p className="text-secondary small mb-0">Completa la siguiente información.</p>
                </div>
                <span className="badge text-bg-primary fs-6 py-2 px-3">Total a pagar: {formatearPrecio(total)}</span>
              </div>

              <TablaCarrito items={items} />

              {!usuario && (
                <Alert variant="info" className="mt-4 small">
                  ¿Tienes cuenta?{' '}
                  {/* state.desde: tras iniciar sesión, el login devuelve aquí. */}
                  <Link to="/login" state={{ desde: '/checkout' }}>
                    Inicia sesión
                  </Link>{' '}
                  y completamos tus datos automáticamente. También puedes comprar como invitado.
                </Alert>
              )}

              <hr className="my-4" />
              <FormularioEntrega datosIniciales={datosIniciales} total={total} onPagar={manejarPago} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default PaginaCheckout
