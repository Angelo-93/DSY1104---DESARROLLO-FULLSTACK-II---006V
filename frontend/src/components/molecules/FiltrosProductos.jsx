import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

/**
 * Filtro por categoría y búsqueda por texto del catálogo (como en la EP1).
 * Componente controlado: los valores viven en la página, que los guarda en la
 * URL para que un filtro se pueda compartir o recargar.
 *
 * @param {object} props
 * @param {Array<{id: string, nombre: string}>} props.categorias
 * @param {string} props.idCategoria - '' = todas.
 * @param {string} props.textoBusqueda
 * @param {(id: string) => void} props.onCambiarCategoria
 * @param {(texto: string) => void} props.onCambiarBusqueda
 */
function FiltrosProductos({ categorias, idCategoria, textoBusqueda, onCambiarCategoria, onCambiarBusqueda }) {
  return (
    // role="search" anuncia el bloque como buscador a los lectores de pantalla.
    // onSubmit evita que Enter recargue la página: el filtro ya se aplica al escribir.
    <Form role="search" onSubmit={(evento) => evento.preventDefault()} className="mb-4">
      <Row className="g-2">
        <Col xs={12} md={4}>
          <Form.Select
            aria-label="Filtrar por categoría"
            value={idCategoria}
            onChange={(evento) => onCambiarCategoria(evento.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={12} md={8}>
          <Form.Control
            type="search"
            placeholder="Buscar por nombre, característica o categoría..."
            aria-label="Buscar productos en el catálogo"
            value={textoBusqueda}
            onChange={(evento) => onCambiarBusqueda(evento.target.value)}
          />
        </Col>
      </Row>
    </Form>
  )
}

export default FiltrosProductos
