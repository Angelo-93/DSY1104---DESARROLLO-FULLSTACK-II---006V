import { Link, Outlet } from 'react-router-dom'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import MarcaInforcore from '../atoms/MarcaInforcore'
import MenuLateralAdmin from '../organisms/MenuLateralAdmin'

/**
 * Esqueleto del panel administrador: cabecera, menú lateral y, a la derecha,
 * el contenido de la ruta hija (<Outlet />).
 */
function PlantillaAdmin() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="admin-cabecera px-3 py-2 d-flex align-items-center gap-3">
        <Link to="/admin" className="text-decoration-none">
          <MarcaInforcore clara />
        </Link>
        <span className="text-white-50 small">Panel administrador</span>
      </header>

      {/* fluid: el panel usa todo el ancho de la pantalla, a diferencia de la
          tienda, que centra el contenido. */}
      <Container fluid className="flex-grow-1 d-flex flex-column">
        {/* align-content-start: en celular el menú y el contenido van uno bajo
            el otro, y sin esto la fila repartiría la altura de la pantalla entre
            ambos. Desde tablet van lado a lado y se estiran a todo el alto. */}
        <Row className="flex-grow-1 align-content-start align-content-md-stretch">
          <Col xs={12} md={3} lg={2} className="px-0">
            <MenuLateralAdmin />
          </Col>
          <Col as="main" xs={12} md={9} lg={10} className="p-3 p-md-4">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default PlantillaAdmin
