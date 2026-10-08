import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import RutaNavegacion from '../../components/molecules/RutaNavegacion.jsx'
import TarjetaBlog from '../../components/molecules/TarjetaBlog.jsx'
import { BLOGS } from '../../data/blogs.js'

function PaginaBlogs() {
  return (
    <Container className="py-4">
      <RutaNavegacion elementos={[{ texto: 'Blogs' }]} />
      <h1>Blog INFORCORE</h1>
      <p className="text-secondary mb-4">Casos y noticias sobre tecnología, pensados para empresas e instituciones educativas.</p>

      <Row xs={1} md={2} className="g-4">
        {BLOGS.map((blog) => (
          <Col key={blog.id}>
            <TarjetaBlog blog={blog} />
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default PaginaBlogs
