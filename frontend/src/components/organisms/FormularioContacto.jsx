import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import { quitarError, tieneErrores, validarContacto } from '../../utils/validaciones.js'
import CampoFormulario from '../molecules/CampoFormulario.jsx'

const VACIO = { nombre: '', correo: '', comentario: '' }

/**
 * Formulario de contacto de la EP1: nombre, correo opcional y mensaje.
 * Sin backend no hay a quién enviarlo: se valida y se confirma en pantalla,
 * igual que en la EP1. En la EP3 se enviará a la API.
 */
function FormularioContacto() {
  // Un solo objeto de estado para todo el formulario: con varios campos es más
  // ordenado que un useState por campo.
  const [datos, setDatos] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const [enviadoPor, setEnviadoPor] = useState('')

  // Una función para todos los campos: usa el atributo "name" del input para
  // saber qué propiedad del objeto cambiar.
  function manejarCambio(evento) {
    const { name, value } = evento.target
    setDatos({ ...datos, [name]: value })
    setErrores((anteriores) => quitarError(anteriores, name))
  }

  function manejarEnvio(evento) {
    evento.preventDefault()
    const nuevosErrores = validarContacto(datos)
    setErrores(nuevosErrores)
    if (tieneErrores(nuevosErrores)) return

    setEnviadoPor(datos.nombre.trim())
    setDatos(VACIO) // se limpia para que se note que el mensaje salió
  }

  return (
    <Form noValidate onSubmit={manejarEnvio}>
      {enviadoPor && (
        <Alert variant="success" role="status" onClose={() => setEnviadoPor('')} dismissible>
          Gracias, {enviadoPor}. Recibimos tu mensaje y te responderemos a la brevedad.
        </Alert>
      )}

      <CampoFormulario
        id="contacto-nombre"
        etiqueta="Nombre completo"
        name="nombre"
        maxLength={100}
        value={datos.nombre}
        onChange={manejarCambio}
        error={errores.nombre}
      />
      <CampoFormulario
        id="contacto-correo"
        etiqueta="Correo electrónico (opcional)"
        name="correo"
        type="email"
        maxLength={100}
        placeholder="tucorreo@duoc.cl"
        value={datos.correo}
        onChange={manejarCambio}
        error={errores.correo}
      />
      <CampoFormulario
        id="contacto-comentario"
        etiqueta="Mensaje"
        name="comentario"
        as="textarea"
        rows={5}
        maxLength={500}
        value={datos.comentario}
        onChange={manejarCambio}
        error={errores.comentario}
        ayuda={`${datos.comentario.length} de 500 caracteres`}
      />

      <Button type="submit" variant="primary" className="w-100">
        Enviar mensaje
      </Button>
    </Form>
  )
}

export default FormularioContacto
