import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

import { quitarError, tieneErrores, validarUsuario } from '../../utils/validaciones.js'
import CampoFormulario from '../molecules/CampoFormulario.jsx'
import SelectorRegionComuna from '../molecules/SelectorRegionComuna.jsx'

const VACIO = {
  run: '',
  nombre: '',
  apellidos: '',
  correo: '',
  contrasena: '',
  confirmarContrasena: '',
  fechaNacimiento: '',
  region: '',
  comuna: '',
  direccion: '',
}

/**
 * Formulario de registro con las reglas de la EP1. Valida el formato; crear la
 * cuenta (y detectar un RUN o correo ya registrado) le toca a la página.
 *
 * @param {object} props
 * @param {(datos: object) => void} props.onRegistrar - Recibe los datos válidos.
 * @param {string} [props.errorGeneral] - Error del padre (ej: correo ya registrado).
 */
function FormularioRegistro({ onRegistrar, errorGeneral }) {
  const [datos, setDatos] = useState(VACIO)
  const [errores, setErrores] = useState({})

  function cambiarCampo(campo, valor) {
    // Forma funcional de set: toma el estado más reciente. Necesaria aquí porque
    // el selector de región llama dos veces seguidas (región y comuna).
    setDatos((anterior) => ({ ...anterior, [campo]: valor }))
    setErrores((anteriores) => quitarError(anteriores, campo))
  }

  function manejarCambio(evento) {
    cambiarCampo(evento.target.name, evento.target.value)
  }

  function manejarEnvio(evento) {
    evento.preventDefault()
    const nuevosErrores = validarUsuario(datos)
    setErrores(nuevosErrores)
    if (!tieneErrores(nuevosErrores)) onRegistrar(datos)
  }

  // Props comunes de cada campo de texto, para no repetirlas 8 veces.
  function propsCampo(nombre) {
    return { name: nombre, value: datos[nombre], onChange: manejarCambio, error: errores[nombre] }
  }

  return (
    <Form noValidate onSubmit={manejarEnvio}>
      {errorGeneral && <Alert variant="danger">{errorGeneral}</Alert>}

      <CampoFormulario
        id="registro-run"
        etiqueta="RUN"
        maxLength={9}
        placeholder="Sin puntos ni guion, ej: 123456785"
        {...propsCampo('run')}
      />
      <Row className="g-3">
        <Col xs={12} md={6}>
          <CampoFormulario id="registro-nombre" etiqueta="Nombre" maxLength={50} {...propsCampo('nombre')} />
        </Col>
        <Col xs={12} md={6}>
          <CampoFormulario id="registro-apellidos" etiqueta="Apellidos" maxLength={100} {...propsCampo('apellidos')} />
        </Col>
      </Row>
      <CampoFormulario
        id="registro-correo"
        etiqueta="Correo electrónico"
        type="email"
        maxLength={100}
        placeholder="tucorreo@duoc.cl"
        ayuda="Se aceptan correos @duoc.cl, @profesor.duoc.cl y @gmail.com."
        {...propsCampo('correo')}
      />
      <Row className="g-3">
        <Col xs={12} md={6}>
          <CampoFormulario
            id="registro-contrasena"
            etiqueta="Contraseña"
            type="password"
            maxLength={10}
            ayuda="Entre 4 y 10 caracteres."
            {...propsCampo('contrasena')}
          />
        </Col>
        <Col xs={12} md={6}>
          <CampoFormulario
            id="registro-confirmar"
            etiqueta="Confirmar contraseña"
            type="password"
            maxLength={10}
            {...propsCampo('confirmarContrasena')}
          />
        </Col>
      </Row>
      <CampoFormulario
        id="registro-fecha"
        etiqueta="Fecha de nacimiento (opcional)"
        type="date"
        {...propsCampo('fechaNacimiento')}
      />
      <SelectorRegionComuna
        idPrefijo="registro"
        region={datos.region}
        comuna={datos.comuna}
        onCambiar={cambiarCampo}
        errores={errores}
      />
      <CampoFormulario id="registro-direccion" etiqueta="Dirección" maxLength={300} {...propsCampo('direccion')} />

      <Button type="submit" variant="primary" className="w-100">
        Crear cuenta
      </Button>
    </Form>
  )
}

export default FormularioRegistro
