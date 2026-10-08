import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import { tieneErrores, validarCampoContrasena, validarCampoCorreo } from '../../utils/validaciones.js'
import CampoFormulario from '../molecules/CampoFormulario.jsx'

/**
 * Formulario de inicio de sesión. Solo se encarga del formulario: guardar lo
 * escrito, validar el formato y avisar al padre. Verificar las credenciales y
 * redirigir le corresponde a la página (PaginaLogin), que lo recibe por props.
 * Así el formulario se prueba solo, sin localStorage ni rutas.
 *
 * @param {object} props
 * @param {(datos: {correo: string, contrasena: string}) => void} props.onIngresar
 *   Se llama solo si el formato es válido.
 * @param {string} [props.errorCredenciales] - Error que viene del padre
 *   (ej: "Correo o contraseña incorrectos.").
 */
function FormularioLogin({ onIngresar, errorCredenciales }) {
  // Componentes controlados: React guarda el valor de cada campo en el estado,
  // y el input muestra siempre lo que dice el estado.
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [errores, setErrores] = useState({})

  function manejarEnvio(evento) {
    // Sin esto, el navegador recargaría la página al enviar el formulario.
    evento.preventDefault()

    const nuevosErrores = {}
    const errorCorreo = validarCampoCorreo(correo)
    const errorContrasena = validarCampoContrasena(contrasena)
    if (errorCorreo) nuevosErrores.correo = errorCorreo
    if (errorContrasena) nuevosErrores.contrasena = errorContrasena

    setErrores(nuevosErrores)
    if (!tieneErrores(nuevosErrores)) onIngresar({ correo, contrasena })
  }

  return (
    // noValidate: desactiva los globos de validación del navegador para que
    // se vean nuestros mensajes, iguales en Chrome, Firefox y Edge.
    <Form noValidate onSubmit={manejarEnvio}>
      {errorCredenciales && (
        <Alert variant="danger" className="py-2">
          {errorCredenciales}
        </Alert>
      )}

      <CampoFormulario
        id="login-correo"
        etiqueta="Correo"
        type="email"
        autoComplete="email"
        maxLength={100}
        value={correo}
        onChange={(evento) => setCorreo(evento.target.value)}
        error={errores.correo}
      />
      <CampoFormulario
        id="login-contrasena"
        etiqueta="Contraseña"
        type="password"
        autoComplete="current-password"
        maxLength={10}
        value={contrasena}
        onChange={(evento) => setContrasena(evento.target.value)}
        error={errores.contrasena}
      />

      <Button type="submit" variant="primary" className="w-100">
        Iniciar sesión
      </Button>
    </Form>
  )
}

export default FormularioLogin
