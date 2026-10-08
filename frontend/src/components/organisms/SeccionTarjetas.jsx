import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

/**
 * Sección con título y tres tarjetas de texto. La reutilizan "Sectores que
 * atendemos" y "Por qué elegir INFORCORE" (Inicio) y "Áreas que te acompañan"
 * (Nosotros): mismo diseño, distintos datos por props.
 *
 * @param {object} props
 * @param {string} props.titulo
 * @param {Array<{titulo: string, texto: string}>} props.items
 * @param {boolean} [props.fondoSuperficie=false] - Fondo gris para alternar secciones.
 * @param {'h2'|'h3'} [props.nivelTitulo='h2'] - h3 cuando va dentro de otra sección.
 */
function SeccionTarjetas({ titulo, items, fondoSuperficie = false, nivelTitulo = 'h2' }) {
  const Titulo = nivelTitulo
  const NivelItem = nivelTitulo === 'h2' ? 'h3' : 'h4'

  return (
    <section className={fondoSuperficie ? 'seccion bg-superficie' : 'seccion'}>
      <Container>
        <Titulo className="mb-4">{titulo}</Titulo>
        <Row xs={1} md={3} className="g-4">
          {items.map((item) => (
            <Col key={item.titulo}>
              <div className="tarjeta-texto h-100">
                <NivelItem className="h5">{item.titulo}</NivelItem>
                <p className="text-secondary mb-0">{item.texto}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}

export default SeccionTarjetas
