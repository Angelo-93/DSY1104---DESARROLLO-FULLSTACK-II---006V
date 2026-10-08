import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import ModalConfirmacion from '../../components/molecules/ModalConfirmacion.jsx'
import RutaNavegacion from '../../components/molecules/RutaNavegacion.jsx'
import TablaCarrito from '../../components/organisms/TablaCarrito.jsx'
import { useCarrito } from '../../hooks/useCarrito.js'
import { obtenerProducto } from '../../services/productosService.js'
import { formatearPrecio } from '../../utils/formato.js'

/** Carrito de compras (Anexo 1, Figura 5). */
function PaginaCarrito() {
  const { items, total, cantidadUnidades, cambiarCantidad, quitarProducto, vaciarCarrito } = useCarrito()
  const [confirmarVaciado, setConfirmarVaciado] = useState(false)
  const navegar = useNavigate()

  if (items.length === 0) {
    return (
      <Container className="py-5 text-center">
        <RutaNavegacion elementos={[{ texto: 'Carrito' }]} />
        <h1 className="h3">Tu carrito está vacío</h1>
        <p className="text-secondary">Agrega productos desde el catálogo y aparecerán aquí.</p>
        <Link to="/productos" className="btn btn-primary">
          Ver catálogo
        </Link>
      </Container>
    )
  }

  // Stock actual de cada producto del carrito: es el tope de su cantidad y
  // permite avisar si bajó después de agregarlo (por ejemplo, otra compra).
  const stockPorCodigo = Object.fromEntries(items.map((item) => [item.codigo, obtenerProducto(item.codigo)?.stock ?? 0]))
  const excedeStock = items.some((item) => item.cantidad > stockPorCodigo[item.codigo])

  function confirmarVaciar() {
    vaciarCarrito()
    setConfirmarVaciado(false)
  }

  return (
    <Container className="py-4">
      <RutaNavegacion elementos={[{ texto: 'Carrito' }]} />
      <h1 className="mb-4">Carrito de compras</h1>

      {/* lg={8}/{4}: en pantallas grandes, tabla y resumen lado a lado;
          en celular y tablet, el resumen queda debajo de la tabla. */}
      <Row className="g-4 align-items-start">
        <Col xs={12} lg={8}>
          <Card>
            <Card.Body>
              <TablaCarrito
                items={items}
                editable
                stockPorCodigo={stockPorCodigo}
                onCambiarCantidad={cambiarCantidad}
                onQuitar={quitarProducto}
              />
            </Card.Body>
          </Card>
          <button type="button" className="btn btn-link text-danger px-0 mt-2" onClick={() => setConfirmarVaciado(true)}>
            Vaciar carrito
          </button>
        </Col>

        <Col xs={12} lg={4}>
          <Card className="resumen-compra">
            <Card.Body>
              <h2 className="h5">Resumen</h2>
              <p className="d-flex justify-content-between mb-1">
                <span>Productos</span>
                <span>{cantidadUnidades}</span>
              </p>
              <p className="d-flex justify-content-between fs-5 fw-bold">
                <span>Total</span>
                <span data-testid="total-carrito">{formatearPrecio(total)}</span>
              </p>
              {excedeStock && (
                <p className="small text-danger">Ajusta las cantidades marcadas en rojo para continuar.</p>
              )}
              <button
                type="button"
                className="btn btn-acento w-100"
                onClick={() => navegar('/checkout')}
                disabled={excedeStock}
              >
                Comprar ahora
              </button>
              <Link to="/productos" className="d-block text-center small mt-3">
                Seguir comprando
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ModalConfirmacion
        mostrar={confirmarVaciado}
        titulo="Vaciar carrito"
        mensaje="Se quitarán todos los productos del carrito. ¿Quieres continuar?"
        textoConfirmar="Vaciar carrito"
        onConfirmar={confirmarVaciar}
        onCancelar={() => setConfirmarVaciado(false)}
      />
    </Container>
  )
}

export default PaginaCarrito
