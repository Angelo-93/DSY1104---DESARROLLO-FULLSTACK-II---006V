import { Link } from 'react-router-dom'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import MarcaInforcore from '../atoms/MarcaInforcore.jsx'

// El año se calcula una vez, al cargar el archivo, y no dentro del componente:
// React espera que un componente sea "puro" (mismos datos, mismo resultado), y
// new Date() da un valor distinto cada vez que se llama. Así no hay que editar
// el año a mano cada enero y el componente sigue siendo puro.
const ANIO_ACTUAL = new Date().getFullYear()

/**
 * Pie de página de la tienda. Los datos de contacto son ficticios (decisión
 * del proyecto: el repositorio es público y no debe mostrar el correo ni la
 * dirección reales de la empresa). El dominio .example está reservado para
 * ejemplos (no pertenece a nadie), así que ningún correo llega a un tercero.
 */
function PiePagina() {
  return (
    <footer className="pie-pagina mt-auto d-print-none">
      <Container className="py-4">
        {/* xs=12 apila las columnas en el celular; md=4 las pone en fila desde tablet. */}
        <Row className="gy-4">
          <Col xs={12} md={4}>
            <MarcaInforcore clara />
            <p className="mt-2 mb-0 small">
              Hardware corporativo y educacional.
              <br />
              Av. Ejemplo 1234, Of. 56, Providencia, Santiago.
            </p>
          </Col>

          <Col xs={6} md={4}>
            <h2>Navegación</h2>
            <ul className="list-unstyled small mb-0">
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/categorias">Categorías</Link></li>
              <li><Link to="/ofertas">Ofertas</Link></li>
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/blogs">Blogs</Link></li>
            </ul>
          </Col>

          <Col xs={6} md={4}>
            <h2>Contacto</h2>
            <ul className="list-unstyled small mb-0">
              {/* En el celular esta columna mide media pantalla y el correo no cabe en
                  una línea: <wbr /> marca un punto donde el navegador PUEDE cortar
                  (después de la @) y text-break (Bootstrap) corta en cualquier
                  letra solo si aun así no cabe. Sin esto la página se desborda. */}
              <li>
                <a href="mailto:ventas@inforcore.example" className="text-break">
                  ventas@<wbr />inforcore.example
                </a>
              </li>
              <li><Link to="/contacto">Formulario de contacto</Link></li>
              <li>Providencia, Santiago</li>
            </ul>
          </Col>
        </Row>
      </Container>

      <div className="pie-pagina__legal text-center py-3">
        © {ANIO_ACTUAL} INFORCORE. Proyecto académico DSY1104 Desarrollo Fullstack II.
      </div>
    </footer>
  )
}

export default PiePagina
