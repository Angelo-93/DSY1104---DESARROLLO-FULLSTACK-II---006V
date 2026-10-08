import { Link, NavLink } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

import { puedeEntrarAlPanel } from '../../utils/permisos.js'
import MarcaInforcore from '../atoms/MarcaInforcore.jsx'

// Los enlaces van como datos y no como JSX repetido: sumar una vista al menú
// es agregar una línea a este arreglo.
const ENLACES_TIENDA = [
  { ruta: '/', texto: 'Inicio' },
  { ruta: '/productos', texto: 'Productos' },
  { ruta: '/categorias', texto: 'Categorías' },
  { ruta: '/ofertas', texto: 'Ofertas' },
  { ruta: '/nosotros', texto: 'Nosotros' },
  { ruta: '/blogs', texto: 'Blogs' },
  { ruta: '/contacto', texto: 'Contacto' },
]

/**
 * Menú superior de la tienda. En pantallas grandes muestra todo en una fila;
 * bajo 992 px (expand="lg") los enlaces se esconden tras el botón hamburguesa.
 *
 * El menú no lee el carrito ni la sesión por su cuenta: todo le llega por
 * props desde PlantillaTienda. Así su única responsabilidad es mostrar, y en
 * las pruebas basta con pasarle datos distintos para ver cada caso.
 *
 * @param {object} props
 * @param {number} [props.cantidadCarrito=0] - Unidades en el carrito.
 * @param {object|null} [props.usuario=null] - Usuario con sesión, o null.
 * @param {() => void} [props.onCerrarSesion] - Qué hacer al pulsar "Cerrar sesión".
 */
function BarraNavegacion({ cantidadCarrito = 0, usuario = null, onCerrarSesion }) {
  return (
    // collapseOnSelect cierra el menú móvil al elegir un enlace; para eso cada
    // Nav.Link necesita su eventKey.
    <Navbar expand="lg" sticky="top" collapseOnSelect className="barra-navegacion py-2">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <MarcaInforcore />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-principal" />

        <Navbar.Collapse id="menu-principal">
          {/* "Inicio" no necesita la prop "end" (a diferencia de "/admin" en el
              menú del admin): React Router trata la ruta "/" como caso especial
              y solo la marca activa en la portada. */}
          <Nav className="me-auto">
            {ENLACES_TIENDA.map((enlace) => (
              <Nav.Link
                key={enlace.ruta}
                as={NavLink}
                to={enlace.ruta}
                eventKey={enlace.ruta}
              >
                {enlace.texto}
              </Nav.Link>
            ))}
          </Nav>

          {/* Se usa Link con clases "btn" en vez del Button de React-Bootstrap:
              un Button con enlace agrega role="button", y estos elementos deben
              anunciarse como enlaces porque llevan a otra página. */}
          <div className="d-flex flex-wrap align-items-center gap-2 py-2 py-lg-0">
            {/* Renderizado condicional: con sesión se saluda y se ofrece salir;
                sin sesión, entrar o registrarse. */}
            {usuario ? (
              <>
                <span className="small text-secondary me-1">Hola, {usuario.nombre}</span>
                {puedeEntrarAlPanel(usuario) && (
                  <Link className="btn btn-outline-primary btn-sm" to="/admin">
                    Panel
                  </Link>
                )}
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onCerrarSesion}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-primary btn-sm" to="/login">
                  Iniciar sesión
                </Link>
                <Link className="btn btn-primary btn-sm" to="/registro">
                  Crear cuenta
                </Link>
              </>
            )}
            <Link
              className="btn btn-acento btn-sm"
              to="/carrito"
              aria-label={`Carrito, ${cantidadCarrito} productos`}
            >
              Carrito{' '}
              <span className="badge text-bg-light" data-testid="contador-carrito">
                {cantidadCarrito}
              </span>
            </Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default BarraNavegacion
