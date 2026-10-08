import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import FormularioLogin from '../../components/organisms/FormularioLogin.jsx'
import { useSesion } from '../../hooks/useSesion.js'
import { puedeEntrarAlPanel } from '../../utils/permisos.js'

/**
 * Vista de inicio de sesión. Conecta el formulario con la sesión y decide a
 * dónde ir después.
 */
function PaginaLogin() {
  const { usuario, iniciarSesion } = useSesion()
  const navegar = useNavigate()
  const ubicacion = useLocation()
  const [errorCredenciales, setErrorCredenciales] = useState('')

  function manejarIngreso({ correo, contrasena }) {
    const autenticado = iniciarSesion(correo, contrasena)
    if (!autenticado) {
      // Mensaje genérico a propósito: no revela si el correo existe o no.
      setErrorCredenciales('Correo o contraseña incorrectos.')
      return
    }

    // Si RutaProtegida mandó aquí al usuario, vuelve a donde quería ir; si no,
    // el personal de INFORCORE va al panel y el cliente a la tienda.
    const destino = ubicacion.state?.desde ?? (puedeEntrarAlPanel(autenticado) ? '/admin' : '/')
    navegar(destino, { replace: true })
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={7} lg={5}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h1 className="h3 mb-4">Iniciar sesión</h1>

              {usuario ? (
                <p className="mb-0">
                  Ya iniciaste sesión como <strong>{usuario.nombre}</strong>.{' '}
                  <Link to="/">Ir a la tienda</Link>
                </p>
              ) : (
                <>
                  <FormularioLogin onIngresar={manejarIngreso} errorCredenciales={errorCredenciales} />
                  <p className="text-center small mt-3 mb-0">
                    ¿No tienes cuenta? <Link to="/registro">Crea una aquí</Link>
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

export default PaginaLogin
