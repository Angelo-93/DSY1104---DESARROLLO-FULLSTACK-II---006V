import { Link, NavLink, useLocation } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Navbar from 'react-bootstrap/Navbar'

import { puedeEntrarAlPanel } from '../../utils/permisos.js'
import MarcaInforcore from '../atoms/MarcaInforcore.jsx'
import BuscadorProductos from '../molecules/BuscadorProductos.jsx'

// Los enlaces van como datos y no como JSX repetido: sumar una vista al menú
// es agregar una línea a un arreglo. Van en dos grupos porque entre ellos se
// dibuja el desplegable "Categorías", como en el template del Anexo 1.
const ENLACES_ANTES = [
  { ruta: '/', texto: 'Inicio' },
  { ruta: '/productos', texto: 'Productos' },
]
const ENLACES_DESPUES = [
  { ruta: '/ofertas', texto: 'Ofertas' },
  { ruta: '/nosotros', texto: 'Nosotros' },
  { ruta: '/blogs', texto: 'Blogs' },
  { ruta: '/contacto', texto: 'Contacto' },
]

function EnlaceMenu({ enlace }) {
  return (
    <Nav.Link as={NavLink} to={enlace.ruta} eventKey={enlace.ruta}>
      {enlace.texto}
    </Nav.Link>
  )
}

/**
 * Menú superior de la tienda, en dos filas como el template del Anexo 1:
 * - Fila 1: marca, buscador y carrito (siempre visibles, también en celular).
 * - Fila 2: enlaces y cuenta. Bajo 992 px (expand="lg") se esconden tras el
 *   botón hamburguesa.
 * El orden visual lo dan las clases order-* de Bootstrap: en celular el
 * buscador baja a una línea propia para no apretar la marca.
 *
 * El menú no lee el carrito ni la sesión por su cuenta: todo le llega por
 * props desde PlantillaTienda. Así su única responsabilidad es mostrar, y en
 * las pruebas basta con pasarle datos distintos para ver cada caso.
 *
 * @param {object} props
 * @param {number} [props.cantidadCarrito=0] - Unidades en el carrito.
 * @param {object|null} [props.usuario=null] - Usuario con sesión, o null.
 * @param {() => void} [props.onCerrarSesion] - Qué hacer al pulsar "Cerrar sesión".
 * @param {Array<{id: string, nombre: string}>} [props.categorias=[]] - Opciones
 *   del desplegable. Llegan por props porque el admin puede crear categorías.
 */
function BarraNavegacion({ cantidadCarrito = 0, usuario = null, onCerrarSesion, categorias = [] }) {
  // El desplegable no es un NavLink, así que se marca activo a mano cuando la
  // URL está dentro de /categorias.
  const { pathname } = useLocation()
  const enCategorias = pathname.startsWith('/categorias')

  return (
    // collapseOnSelect cierra el menú móvil al elegir un enlace; para eso cada
    // Nav.Link necesita su eventKey.
    <Navbar expand="lg" sticky="top" collapseOnSelect className="barra-navegacion py-2 d-print-none">
      <Container className="flex-wrap">
        <Navbar.Brand as={Link} to="/">
          <MarcaInforcore />
        </Navbar.Brand>

        <BuscadorProductos />

        <div className="d-flex align-items-center gap-2 ms-auto">
          {/* Se usa Link con clases "btn" en vez del Button de React-Bootstrap:
              un Button con enlace agrega role="button", y estos elementos deben
              anunciarse como enlaces porque llevan a otra página. */}
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
          <Navbar.Toggle aria-controls="menu-principal" aria-label="Abrir menú" />
        </div>

        <Navbar.Collapse id="menu-principal" className="order-last w-100 mt-lg-2">
          {/* "Inicio" no necesita la prop "end" (a diferencia de "/admin" en el
              menú del admin): React Router trata la ruta "/" como caso especial
              y solo la marca activa en la portada. */}
          <Nav className="me-auto">
            {ENLACES_ANTES.map((enlace) => (
              <EnlaceMenu key={enlace.ruta} enlace={enlace} />
            ))}
            <NavDropdown title="Categorías" id="menu-categorias" active={enCategorias}>
              <NavDropdown.Item as={Link} to="/categorias" eventKey="/categorias">
                Todas las categorías
              </NavDropdown.Item>
              <NavDropdown.Divider />
              {categorias.map((categoria) => (
                <NavDropdown.Item
                  key={categoria.id}
                  as={Link}
                  to={`/categorias/${categoria.id}`}
                  eventKey={`/categorias/${categoria.id}`}
                >
                  {categoria.nombre}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            {ENLACES_DESPUES.map((enlace) => (
              <EnlaceMenu key={enlace.ruta} enlace={enlace} />
            ))}
          </Nav>

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
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default BarraNavegacion
