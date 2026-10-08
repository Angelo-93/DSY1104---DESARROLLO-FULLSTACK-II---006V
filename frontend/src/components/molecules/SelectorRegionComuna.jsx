import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

import { REGIONES } from '../../data/regionesComunas.js'

/**
 * Selectores encadenados región → comuna (registro, checkout y admin).
 * Las comunas dependen de la región elegida; al cambiar de región se borra la
 * comuna, porque la anterior ya no pertenece a la nueva región.
 *
 * @param {object} props
 * @param {string} props.idPrefijo - Para que los id no choquen si hay dos formularios.
 * @param {string} props.region
 * @param {string} props.comuna
 * @param {(campo: 'region'|'comuna', valor: string) => void} props.onCambiar
 * @param {{region?: string, comuna?: string}} [props.errores]
 */
function SelectorRegionComuna({ idPrefijo, region, comuna, onCambiar, errores = {} }) {
  const comunas = REGIONES.find((r) => r.nombre === region)?.comunas ?? []

  function manejarRegion(evento) {
    onCambiar('region', evento.target.value)
    onCambiar('comuna', '')
  }

  return (
    <Row className="g-3 mb-3">
      <Col xs={12} md={6}>
        <Form.Group controlId={`${idPrefijo}-region`}>
          <Form.Label>Región</Form.Label>
          <Form.Select value={region} onChange={manejarRegion} isInvalid={Boolean(errores.region)}>
            <option value="">Selecciona la región</option>
            {REGIONES.map((r) => (
              <option key={r.id} value={r.nombre}>
                {r.nombre}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errores.region}</Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col xs={12} md={6}>
        <Form.Group controlId={`${idPrefijo}-comuna`}>
          <Form.Label>Comuna</Form.Label>
          {/* Deshabilitado hasta elegir región: sin región no hay comunas que ofrecer. */}
          <Form.Select
            value={comuna}
            onChange={(evento) => onCambiar('comuna', evento.target.value)}
            disabled={!region}
            isInvalid={Boolean(errores.comuna)}
          >
            <option value="">Selecciona la comuna</option>
            {comunas.map((nombreComuna) => (
              <option key={nombreComuna} value={nombreComuna}>
                {nombreComuna}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errores.comuna}</Form.Control.Feedback>
        </Form.Group>
      </Col>
    </Row>
  )
}

export default SelectorRegionComuna
