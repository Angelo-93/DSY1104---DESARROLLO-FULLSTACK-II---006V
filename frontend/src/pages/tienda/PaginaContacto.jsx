import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import RutaNavegacion from '../../components/molecules/RutaNavegacion.jsx'
import FormularioContacto from '../../components/organisms/FormularioContacto.jsx'

function PaginaContacto() {
  return (
    <Container className="py-4">
      <RutaNavegacion elementos={[{ texto: 'Contacto' }]} />
      <Row className="justify-content-center">
        <Col xs={12} md={9} lg={7}>
          <h1>Contacto</h1>
          <p className="text-secondary">
            ¿Tienes dudas sobre algún producto o cotización? Escríbenos y te respondemos a la brevedad.
          </p>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <FormularioContacto />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default PaginaContacto
