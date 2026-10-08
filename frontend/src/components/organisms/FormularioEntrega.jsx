import { useState } from 'react'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

import { formatearPrecio } from '../../utils/formato.js'
import { quitarError, tieneErrores, validarDatosEntrega } from '../../utils/validaciones.js'
import CampoFormulario from '../molecules/CampoFormulario.jsx'
import SelectorRegionComuna from '../molecules/SelectorRegionComuna.jsx'

const VACIO = {
  nombre: '',
  apellidos: '',
  correo: '',
  calle: '',
  departamento: '',
  region: '',
  comuna: '',
  indicaciones: '',
}

/**
 * Datos del cliente y dirección de entrega del checkout (Anexo 1, Figura 6).
 *
 * El autocompletado lo decide la página: el formulario solo recibe los datos
 * con que debe partir (props.datosIniciales). Así funciona igual con sesión
 * iniciada, como invitado o al reintentar un pago rechazado.
 *
 * @param {object} props
 * @param {object} [props.datosIniciales] - Valores para precargar.
 * @param {number} props.total - Monto que muestra el botón de pago.
 * @param {(datos: object, opciones: {simularRechazo: boolean}) => void} props.onPagar
 *   Se llama solo si los datos son válidos.
 */
function FormularioEntrega({ datosIniciales = {}, total, onPagar }) {
  // Los datos iniciales se mezclan sobre el objeto vacío: si falta algún
  // campo (ej: el usuario no tiene departamento), queda en '' y no en undefined.
  const [datos, setDatos] = useState(() => ({ ...VACIO, ...datosIniciales }))
  const [errores, setErrores] = useState({})
  const [simularRechazo, setSimularRechazo] = useState(false)

  function cambiarCampo(campo, valor) {
    setDatos((anterior) => ({ ...anterior, [campo]: valor }))
    setErrores((anteriores) => quitarError(anteriores, campo))
  }

  function propsCampo(nombre) {
    return {
      name: nombre,
      value: datos[nombre],
      onChange: (evento) => cambiarCampo(nombre, evento.target.value),
      error: errores[nombre],
    }
  }

  function manejarEnvio(evento) {
    evento.preventDefault()
    const nuevosErrores = validarDatosEntrega(datos)
    setErrores(nuevosErrores)
    if (!tieneErrores(nuevosErrores)) onPagar(datos, { simularRechazo })
  }

  return (
    <Form noValidate onSubmit={manejarEnvio}>
      <h2 className="h5">Información del cliente</h2>
      <Row className="g-3">
        <Col xs={12} md={6}>
          <CampoFormulario id="entrega-nombre" etiqueta="Nombre" maxLength={50} autoComplete="given-name" {...propsCampo('nombre')} />
        </Col>
        <Col xs={12} md={6}>
          <CampoFormulario id="entrega-apellidos" etiqueta="Apellidos" maxLength={100} autoComplete="family-name" {...propsCampo('apellidos')} />
        </Col>
      </Row>
      <CampoFormulario id="entrega-correo" etiqueta="Correo" type="email" maxLength={100} autoComplete="email" {...propsCampo('correo')} />

      <h2 className="h5 mt-2">Dirección de entrega de los productos</h2>
      <Row className="g-3">
        <Col xs={12} md={8}>
          <CampoFormulario id="entrega-calle" etiqueta="Calle y número" maxLength={300} autoComplete="street-address" {...propsCampo('calle')} />
        </Col>
        <Col xs={12} md={4}>
          <CampoFormulario id="entrega-departamento" etiqueta="Departamento (opcional)" maxLength={50} placeholder="Ej: 603" {...propsCampo('departamento')} />
        </Col>
      </Row>
      <SelectorRegionComuna
        idPrefijo="entrega"
        region={datos.region}
        comuna={datos.comuna}
        onCambiar={cambiarCampo}
        errores={errores}
      />
      <CampoFormulario
        id="entrega-indicaciones"
        etiqueta="Indicaciones para la entrega (opcional)"
        as="textarea"
        rows={2}
        maxLength={300}
        placeholder="Ej: entre calles, color del edificio, no tiene timbre."
        {...propsCampo('indicaciones')}
      />

      {/* Sin pasarela de pago real en la EP2: este bloque permite mostrar
          ambos resultados en la presentación. Está rotulado como simulación
          para que nadie lo confunda con una opción de pago verdadera. */}
      <fieldset className="simulacion-pago p-3 mb-3">
        <legend className="h6 mb-1">Simulación del medio de pago</legend>
        <p className="small text-secondary mb-2">Solo para demostración: la EP2 no tiene una pasarela de pago real.</p>
        <Form.Check
          type="radio"
          id="simulacion-aprobar"
          name="simulacion"
          label="Aprobar el pago"
          checked={!simularRechazo}
          onChange={() => setSimularRechazo(false)}
        />
        <Form.Check
          type="radio"
          id="simulacion-rechazar"
          name="simulacion"
          label="Rechazar el pago"
          checked={simularRechazo}
          onChange={() => setSimularRechazo(true)}
        />
      </fieldset>

      <div className="text-end">
        {/* <button> con clases y no el Button de React-Bootstrap: este no tiene
            una variante "acento", que es el color propio de INFORCORE. */}
        <button type="submit" className="btn btn-acento btn-lg">
          Pagar ahora {formatearPrecio(total)}
        </button>
      </div>
    </Form>
  )
}

export default FormularioEntrega
