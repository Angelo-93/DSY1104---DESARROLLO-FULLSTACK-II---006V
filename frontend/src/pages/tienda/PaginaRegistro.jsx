import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import RutaNavegacion from '../../components/molecules/RutaNavegacion.jsx'
import FormularioRegistro from '../../components/organisms/FormularioRegistro.jsx'
import { useSesion } from '../../hooks/useSesion.js'
import { crearUsuario } from '../../services/usuariosService.js'

/**
 * Registro de clientes. Al crear la cuenta inicia sesión automáticamente,
 * para que el cliente no tenga que volver a escribir su correo y contraseña.
 */
function PaginaRegistro() {
  const { usuario, iniciarSesion } = useSesion()
  const navegar = useNavigate()
  const [errorGeneral, setErrorGeneral] = useState('')

  function manejarRegistro(datos) {
    // La confirmación solo sirve para validar: no se guarda.
    const { confirmarContrasena: _confirmacion, ...nuevoUsuario } = datos
    try {
      crearUsuario(nuevoUsuario)
    } catch (error) {
      // RUN o correo ya registrados: reglas que solo el servicio puede revisar.
      setErrorGeneral(error.message)
      return
    }
    iniciarSesion(nuevoUsuario.correo, nuevoUsuario.contrasena)
    // El nombre viaja en el "state" de la navegación para que la portada
    // confirme que la cuenta se creó.
    navegar('/', { state: { bienvenida: nuevoUsuario.nombre.trim() } })
  }

  return (
    <Container className="py-4">
      <RutaNavegacion elementos={[{ texto: 'Crear cuenta' }]} />
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8} xl={7}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h1 className="h3 mb-4">Crear cuenta</h1>
              {usuario ? (
                <p className="mb-0">
                  Ya tienes una sesión iniciada como <strong>{usuario.nombre}</strong>. <Link to="/">Ir a la tienda</Link>
                </p>
              ) : (
                <>
                  <FormularioRegistro onRegistrar={manejarRegistro} errorGeneral={errorGeneral} />
                  <p className="text-center small mt-3 mb-0">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
                  </p>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default PaginaRegistro
