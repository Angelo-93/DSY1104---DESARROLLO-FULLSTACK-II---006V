import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

import { quitarError, TIPOS_USUARIO, tieneErrores, validarUsuario } from '../../utils/validaciones.js'
import CampoFormulario from '../molecules/CampoFormulario.jsx'
import SelectorRegionComuna from '../molecules/SelectorRegionComuna.jsx'

const VACIO = {
  run: '',
  nombre: '',
  apellidos: '',
  correo: '',
  contrasena: '',
  fechaNacimiento: '',
  tipoUsuario: '',
  region: '',
  comuna: '',
  direccion: '',
}

const TEXTO_BOTON = { nuevo: 'Crear usuario', editar: 'Guardar cambios', perfil: 'Guardar mi perfil' }

/**
 * Formulario de usuario con tres modos (lo que cambia llega por la prop "modo"):
 * - nuevo:  todo editable; la contraseña es obligatoria.
 * - editar: el RUN queda bloqueado; contraseña vacía = mantener la actual.
 * - perfil: como editar, pero sin el rol (nadie se cambia su propio rol).
 *
 * @param {object} props
 * @param {'nuevo'|'editar'|'perfil'} props.modo
 * @param {object} [props.usuario] - Datos actuales (sin contraseña), salvo en "nuevo".
 * @param {boolean} [props.bloquearRol=false] - true si el admin se edita a sí mismo.
 * @param {(datos: object) => void} props.onGuardar
 * @param {() => void} [props.onCancelar]
 * @param {string} [props.errorGeneral] - Error del servicio (ej: correo repetido).
 */
function FormularioUsuario({ modo, usuario, bloquearRol = false, onGuardar, onCancelar, errorGeneral }) {
  const [datos, setDatos] = useState(() => ({ ...VACIO, ...usuario, contrasena: '' }))
  const [errores, setErrores] = useState({})
  const esNuevo = modo === 'nuevo'
  const muestraRol = modo !== 'perfil'

  function cambiarCampo(campo, valor) {
    setDatos((anterior) => ({ ...anterior, [campo]: valor }))
    setErrores((anteriores) => quitarError(anteriores, campo))
  }

  function propsCampo(nombre) {
    return { name: nombre, value: datos[nombre], onChange: (evento) => cambiarCampo(nombre, evento.target.value), error: errores[nombre] }
  }

  function manejarEnvio(evento) {
    evento.preventDefault()
    const nuevosErrores = validarUsuario(datos, { exigirContrasena: esNuevo, exigirTipo: muestraRol })
    setErrores(nuevosErrores)
    if (!tieneErrores(nuevosErrores)) onGuardar(datos)
  }

  return (
    <Form noValidate onSubmit={manejarEnvio}>
      {errorGeneral && <Alert variant="danger">{errorGeneral}</Alert>}

      <Row className="g-3">
        <Col xs={12} md={muestraRol ? 6 : 12}>
          <CampoFormulario
            id="usuario-run"
            etiqueta="RUN"
            maxLength={9}
            disabled={!esNuevo}
            placeholder="Sin puntos ni guion"
            ayuda={esNuevo ? undefined : 'El RUN identifica al usuario y no se puede cambiar.'}
            {...propsCampo('run')}
          />
        </Col>
        {muestraRol && (
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="usuario-rol">
              <Form.Label>Tipo de usuario</Form.Label>
              <Form.Select
                value={datos.tipoUsuario}
                onChange={(evento) => cambiarCampo('tipoUsuario', evento.target.value)}
                disabled={bloquearRol}
                isInvalid={Boolean(errores.tipoUsuario)}
              >
                <option value="">Selecciona un tipo</option>
                {TIPOS_USUARIO.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errores.tipoUsuario}</Form.Control.Feedback>
              {bloquearRol && <Form.Text muted>No puedes cambiar tu propio rol.</Form.Text>}
            </Form.Group>
          </Col>
        )}
      </Row>

      <Row className="g-3">
        <Col xs={12} md={6}>
          <CampoFormulario id="usuario-nombre" etiqueta="Nombre" maxLength={50} {...propsCampo('nombre')} />
        </Col>
        <Col xs={12} md={6}>
          <CampoFormulario id="usuario-apellidos" etiqueta="Apellidos" maxLength={100} {...propsCampo('apellidos')} />
        </Col>
      </Row>
      <Row className="g-3">
        <Col xs={12} md={6}>
          <CampoFormulario id="usuario-correo" etiqueta="Correo" type="email" maxLength={100} {...propsCampo('correo')} />
        </Col>
        <Col xs={12} md={6}>
          <CampoFormulario
            id="usuario-contrasena"
            etiqueta={esNuevo ? 'Contraseña' : 'Nueva contraseña (opcional)'}
            type="password"
            maxLength={10}
            autoComplete="new-password"
            ayuda={esNuevo ? 'Entre 4 y 10 caracteres.' : 'Déjala vacía para mantener la actual.'}
            {...propsCampo('contrasena')}
          />
        </Col>
      </Row>
      <CampoFormulario id="usuario-fecha" etiqueta="Fecha de nacimiento (opcional)" type="date" {...propsCampo('fechaNacimiento')} />
      <SelectorRegionComuna idPrefijo="usuario" region={datos.region} comuna={datos.comuna} onCambiar={cambiarCampo} errores={errores} />
      <CampoFormulario id="usuario-direccion" etiqueta="Dirección" maxLength={300} {...propsCampo('direccion')} />

      <div className="d-flex flex-wrap justify-content-end gap-2">
        {onCancelar && (
          <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {TEXTO_BOTON[modo]}
        </button>
      </div>
    </Form>
  )
}

export default FormularioUsuario
