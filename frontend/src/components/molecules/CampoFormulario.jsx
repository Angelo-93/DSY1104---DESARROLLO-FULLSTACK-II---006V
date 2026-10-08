import Form from 'react-bootstrap/Form'

/**
 * Etiqueta + campo + mensaje de error: la combinación que se repite en todos
 * los formularios (login, registro, contacto, checkout, mantenedores).
 * Es una molécula: junta tres átomos de Bootstrap en una unidad con sentido.
 *
 * @param {object} props
 * @param {string} props.id - Une la etiqueta con su campo (clic en la etiqueta
 *   enfoca el campo, y el lector de pantalla lee la etiqueta).
 * @param {string} props.etiqueta
 * @param {string} [props.error] - Si viene, el campo se pinta en rojo y el
 *   mensaje aparece debajo.
 * @param {string} [props.ayuda] - Texto de apoyo bajo el campo.
 * El resto de las props (type, value, onChange, as, maxLength...) pasa directo
 * al campo de Bootstrap.
 */
function CampoFormulario({ id, etiqueta, error, ayuda, ...propsCampo }) {
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>{etiqueta}</Form.Label>
      <Form.Control isInvalid={Boolean(error)} {...propsCampo} />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      {ayuda && <Form.Text muted>{ayuda}</Form.Text>}
    </Form.Group>
  )
}

export default CampoFormulario
