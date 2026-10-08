import { useState } from 'react'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import RutaNavegacion from '../../components/molecules/RutaNavegacion.jsx'
import TarjetaCategoria from '../../components/molecules/TarjetaCategoria.jsx'
import { listarCategorias } from '../../services/categoriasService.js'
import { listarProductos } from '../../services/productosService.js'

/** Vista Categorías (nueva en la EP2, Anexo 1 Figura 4): una tarjeta por categoría. */
function PaginaCategorias() {
  const [categorias] = useState(listarCategorias)
  const [productos] = useState(listarProductos)

  // Cuenta productos por categoría recorriendo el catálogo una sola vez:
  // { notebooks: 4, monitores: 2, ... }
  const cantidadPorCategoria = productos.reduce((conteo, producto) => {
    conteo[producto.idCategoria] = (conteo[producto.idCategoria] ?? 0) + 1
    return conteo
  }, {})

  return (
    <Container className="py-4">
      <RutaNavegacion elementos={[{ texto: 'Categorías' }]} />
      <h1>Categorías</h1>
      <p className="text-secondary mb-4">Explora el catálogo según el tipo de equipo que necesitas.</p>

      <Row xs={1} sm={2} lg={3} className="g-4">
        {categorias.map((categoria) => (
          <Col key={categoria.id}>
            <TarjetaCategoria categoria={categoria} cantidadProductos={cantidadPorCategoria[categoria.id] ?? 0} />
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default PaginaCategorias
