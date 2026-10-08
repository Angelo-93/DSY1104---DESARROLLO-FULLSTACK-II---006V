import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import TarjetaProducto from '../molecules/TarjetaProducto.jsx'

/**
 * Grilla responsiva de productos: 1 columna en celular, 2 en tablet, 3 en
 * notebook y 4 en pantallas grandes (props xs/sm/lg/xl de Row).
 *
 * @param {object} props
 * @param {object[]} props.productos
 * @param {Object<string, string>} [props.nombresCategoria] - { idCategoria: nombre }.
 * @param {(producto: object) => void} props.onAgregar
 * @param {string} [props.mensajeVacio] - Qué decir si no hay productos.
 */
function GrillaProductos({ productos, nombresCategoria = {}, onAgregar, mensajeVacio = 'No hay productos para mostrar.' }) {
  if (productos.length === 0) {
    return <p className="text-secondary py-4 mb-0">{mensajeVacio}</p>
  }

  return (
    <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
      {productos.map((producto) => (
        // key: React la usa para saber qué tarjeta es cuál al volver a dibujar
        // la lista (por ejemplo al filtrar). Debe ser única y estable: el código.
        <Col key={producto.codigo}>
          <TarjetaProducto
            producto={producto}
            nombreCategoria={nombresCategoria[producto.idCategoria]}
            onAgregar={onAgregar}
          />
        </Col>
      ))}
    </Row>
  )
}

export default GrillaProductos
