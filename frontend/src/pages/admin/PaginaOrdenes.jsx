import { useState } from 'react'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

import EncabezadoAdmin from '../../components/molecules/EncabezadoAdmin.jsx'
import TablaOrdenes from '../../components/organisms/TablaOrdenes.jsx'
import { listarOrdenes } from '../../services/ordenesService.js'
import { normalizarTexto } from '../../utils/texto.js'

/** Órdenes y boletas: lista con filtro por estado y búsqueda. */
function PaginaOrdenes() {
  const [ordenes] = useState(listarOrdenes)
  const [estado, setEstado] = useState('')
  const [busqueda, setBusqueda] = useState('')

  // Busca por número, nombre o correo, sin importar tildes ni mayúsculas.
  const buscado = normalizarTexto(busqueda)
  const filtradas = ordenes.filter((orden) => {
    const texto = normalizarTexto(`${orden.numero} ${orden.cliente.nombre} ${orden.cliente.apellidos} ${orden.cliente.correo}`)
    return (!estado || orden.estado === estado) && (!buscado || texto.includes(buscado))
  })

  return (
    <>
      <EncabezadoAdmin titulo="Órdenes y boletas" descripcion={`${ordenes.length} órdenes registradas.`} />

      <Form role="search" onSubmit={(evento) => evento.preventDefault()} className="mb-3">
        <Row className="g-2">
          <Col xs={12} md={4}>
            <Form.Select aria-label="Filtrar por estado" value={estado} onChange={(evento) => setEstado(evento.target.value)}>
              <option value="">Todos los estados</option>
              <option value="pagada">Pagadas</option>
              <option value="rechazada">Rechazadas</option>
            </Form.Select>
          </Col>
          <Col xs={12} md={8}>
            <Form.Control
              type="search"
              placeholder="Buscar por N°, cliente o correo..."
              aria-label="Buscar órdenes"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </Col>
        </Row>
      </Form>

      <Card>
        <Card.Body>
          <TablaOrdenes ordenes={filtradas} mensajeVacio="Ninguna orden coincide con el filtro." />
        </Card.Body>
      </Card>
    </>
  )
}

export default PaginaOrdenes
