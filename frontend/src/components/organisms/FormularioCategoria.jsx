import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'

import { quitarError, tieneErrores, validarCategoria } from '../../utils/validaciones.js'
import CampoFormulario from '../molecules/CampoFormulario.jsx'

/**
 * Formulario de categoría para "Nueva categoría" y "Editar categoría".
 *
 * @param {object} props
 * @param {{nombre: string, descripcion?: string}} [props.categoria] - Si viene, es edición.
 * @param {(datos: {nombre: string, descripcion: string}) => void} props.onGuardar
 * @param {() => void} props.onCancelar
 * @param {string} [props.errorGeneral] - Error del servicio (ej: nombre repetido).
 */
function FormularioCategoria({ categoria, onGuardar, onCancelar, errorGeneral }) {
  const [datos, setDatos] = useState({ nombre: categoria?.nombre ?? '', descripcion: categoria?.descripcion ?? '' })
  const [errores, setErrores] = useState({})

  function propsCampo(nombre) {
    return {
      name: nombre,
      value: datos[nombre],
      onChange: (evento) => {
        setDatos({ ...datos, [nombre]: evento.target.value })
        setErrores((anteriores) => quitarError(anteriores, nombre))
      },
      error: errores[nombre],
    }
  }

  function manejarEnvio(evento) {
    evento.preventDefault()
    const nuevosErrores = validarCategoria(datos)
    setErrores(nuevosErrores)
    if (!tieneErrores(nuevosErrores)) onGuardar(datos)
  }

  return (
    <Form noValidate onSubmit={manejarEnvio}>
      {errorGeneral && <Alert variant="danger">{errorGeneral}</Alert>}
      <CampoFormulario
        id="categoria-nombre"
        etiqueta="Nombre"
        maxLength={50}
        ayuda={categoria ? 'Cambiar el nombre no cambia la dirección de la categoría.' : undefined}
        {...propsCampo('nombre')}
      />
      <CampoFormulario
        id="categoria-descripcion"
        etiqueta="Descripción (opcional)"
        as="textarea"
        rows={2}
        maxLength={200}
        {...propsCampo('descripcion')}
      />
      <div className="d-flex flex-wrap justify-content-end gap-2">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          {categoria ? 'Guardar cambios' : 'Crear categoría'}
        </button>
      </div>
    </Form>
  )
}

export default FormularioCategoria
