/*
 * Mapa de rutas de INFORCORE. Sigue el diagrama de flujo del Anexo 1 de la EP2
 * (Figura 3 para la tienda y Figura 10 para el administrador).
 *
 * Las rutas se anidan dentro de una plantilla: la plantilla dibuja lo que se
 * repite (menú, pie, menú lateral) y la ruta hija se dibuja en su <Outlet />.
 *
 * El panel tiene dos niveles de acceso (RutaProtegida):
 * - puedeEntrarAlPanel: Administrador y Vendedor (consultar productos y órdenes).
 * - esAdministrador: solo Administrador (crear, editar, categorías, usuarios, reportes).
 */
import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import PlantillaAdmin from './components/templates/PlantillaAdmin.jsx'
import PlantillaTienda from './components/templates/PlantillaTienda.jsx'
import PaginaBoleta from './pages/admin/PaginaBoleta.jsx'
import PaginaCategoriasAdmin from './pages/admin/PaginaCategoriasAdmin.jsx'
import PaginaDashboard from './pages/admin/PaginaDashboard.jsx'
import PaginaFormularioCategoria from './pages/admin/PaginaFormularioCategoria.jsx'
import PaginaFormularioProducto from './pages/admin/PaginaFormularioProducto.jsx'
import PaginaFormularioUsuario from './pages/admin/PaginaFormularioUsuario.jsx'
import PaginaHistorialCompras from './pages/admin/PaginaHistorialCompras.jsx'
import PaginaOrdenes from './pages/admin/PaginaOrdenes.jsx'
import PaginaPerfil from './pages/admin/PaginaPerfil.jsx'
import PaginaProductosAdmin from './pages/admin/PaginaProductosAdmin.jsx'
import PaginaProductosCriticos from './pages/admin/PaginaProductosCriticos.jsx'
import PaginaUsuariosAdmin from './pages/admin/PaginaUsuariosAdmin.jsx'
import PaginaNoEncontrada from './pages/comunes/PaginaNoEncontrada.jsx'
import PaginaBlogs from './pages/tienda/PaginaBlogs.jsx'
import PaginaCarrito from './pages/tienda/PaginaCarrito.jsx'
import PaginaCategorias from './pages/tienda/PaginaCategorias.jsx'
import PaginaCheckout from './pages/tienda/PaginaCheckout.jsx'
import PaginaCompraExitosa from './pages/tienda/PaginaCompraExitosa.jsx'
import PaginaContacto from './pages/tienda/PaginaContacto.jsx'
import PaginaDetalleCategoria from './pages/tienda/PaginaDetalleCategoria.jsx'
import PaginaDetalleBlog from './pages/tienda/PaginaDetalleBlog.jsx'
import PaginaDetalleProducto from './pages/tienda/PaginaDetalleProducto.jsx'
import PaginaInicio from './pages/tienda/PaginaInicio.jsx'
import PaginaLogin from './pages/tienda/PaginaLogin.jsx'
import PaginaNosotros from './pages/tienda/PaginaNosotros.jsx'
import PaginaOfertas from './pages/tienda/PaginaOfertas.jsx'
import PaginaPagoFallido from './pages/tienda/PaginaPagoFallido.jsx'
import PaginaProductos from './pages/tienda/PaginaProductos.jsx'
import PaginaRegistro from './pages/tienda/PaginaRegistro.jsx'
import RutaProtegida from './routing/RutaProtegida.jsx'
import { esAdministrador, puedeEntrarAlPanel } from './utils/permisos.js'

// Reportes se carga "bajo demanda" (lazy): es la única vista que usa Chart.js,
// una librería grande. Así los clientes de la tienda no la descargan; el
// navegador la pide recién cuando un Administrador abre Reportes.
const PaginaReportes = lazy(() => import('./pages/admin/PaginaReportes.jsx'))

function App() {
  return (
    <Routes>
      {/* ---------- Tienda (pública) ---------- */}
      <Route element={<PlantillaTienda />}>
        <Route index element={<PaginaInicio />} />
        <Route path="productos" element={<PaginaProductos />} />
        {/* ":codigo" es un parámetro: /productos/NB-HP250G10 entrega
            codigo = "NB-HP250G10" a la página mediante useParams(). */}
        <Route path="productos/:codigo" element={<PaginaDetalleProducto />} />
        <Route path="categorias" element={<PaginaCategorias />} />
        <Route path="categorias/:idCategoria" element={<PaginaDetalleCategoria />} />
        <Route path="ofertas" element={<PaginaOfertas />} />
        <Route path="nosotros" element={<PaginaNosotros />} />
        <Route path="blogs" element={<PaginaBlogs />} />
        <Route path="blogs/:idBlog" element={<PaginaDetalleBlog />} />
        <Route path="contacto" element={<PaginaContacto />} />
        <Route path="login" element={<PaginaLogin />} />
        <Route path="registro" element={<PaginaRegistro />} />
        <Route path="carrito" element={<PaginaCarrito />} />
        <Route path="checkout" element={<PaginaCheckout />} />
        <Route path="compra/exitosa/:numeroOrden" element={<PaginaCompraExitosa />} />
        <Route path="compra/fallida/:numeroOrden" element={<PaginaPagoFallido />} />

        {/* Comodín: cualquier URL que no calzó arriba (ni en /admin) cae aquí. */}
        <Route path="*" element={<PaginaNoEncontrada />} />
      </Route>

      {/* ---------- Panel administrador ---------- */}
      <Route
        path="admin"
        element={
          <RutaProtegida permiso={puedeEntrarAlPanel}>
            <PlantillaAdmin />
          </RutaProtegida>
        }
      >
        {/* Consulta: Administrador y Vendedor */}
        <Route index element={<PaginaDashboard />} />
        <Route path="ordenes" element={<PaginaOrdenes />} />
        <Route path="ordenes/:numeroOrden" element={<PaginaBoleta />} />
        <Route path="productos" element={<PaginaProductosAdmin />} />
        <Route path="productos/criticos" element={<PaginaProductosCriticos />} />
        <Route path="perfil" element={<PaginaPerfil />} />

        {/* Administración: solo Administrador. Esta ruta no tiene "path": solo
            agrupa a sus hijas detrás de una segunda guardia (layout route). */}
        <Route element={<RutaProtegida permiso={esAdministrador} />}>
          <Route path="productos/nuevo" element={<PaginaFormularioProducto />} />
          <Route path="productos/:codigo/editar" element={<PaginaFormularioProducto />} />
          <Route path="categorias" element={<PaginaCategoriasAdmin />} />
          <Route path="categorias/nueva" element={<PaginaFormularioCategoria />} />
          <Route path="categorias/:idCategoria/editar" element={<PaginaFormularioCategoria />} />
          <Route path="usuarios" element={<PaginaUsuariosAdmin />} />
          <Route path="usuarios/nuevo" element={<PaginaFormularioUsuario />} />
          <Route path="usuarios/:run/editar" element={<PaginaFormularioUsuario />} />
          <Route path="usuarios/:run/historial" element={<PaginaHistorialCompras />} />
          <Route
            path="reportes"
            element={
              // Suspense muestra este aviso mientras llega el código de Reportes.
              <Suspense fallback={<p className="text-secondary">Cargando reportes...</p>}>
                <PaginaReportes />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
