/*
 * Mapa de rutas de INFORCORE. Sigue el diagrama de flujo del Anexo 1 de la EP2
 * (Figura 3 para la tienda y Figura 10 para el administrador).
 *
 * Las rutas se anidan dentro de una plantilla: la plantilla dibuja lo que se
 * repite (menú, pie, menú lateral) y la ruta hija se dibuja en su <Outlet />.
 *
 * Mientras una vista no existe, su ruta muestra PaginaEnConstruccion. Cada
 * bloque siguiente reemplaza el "element" de su ruta por la página real.
 *
 * El panel tiene dos niveles de acceso (RutaProtegida):
 * - puedeEntrarAlPanel: Administrador y Vendedor (consultar productos y órdenes).
 * - esAdministrador: solo Administrador (crear, editar, categorías, usuarios, reportes).
 */
import { Route, Routes } from 'react-router-dom'

import PlantillaAdmin from './components/templates/PlantillaAdmin.jsx'
import PlantillaTienda from './components/templates/PlantillaTienda.jsx'
import PaginaEnConstruccion from './pages/comunes/PaginaEnConstruccion.jsx'
import PaginaNoEncontrada from './pages/comunes/PaginaNoEncontrada.jsx'
import PaginaBlogs from './pages/tienda/PaginaBlogs.jsx'
import PaginaContacto from './pages/tienda/PaginaContacto.jsx'
import PaginaDetalleBlog from './pages/tienda/PaginaDetalleBlog.jsx'
import PaginaDetalleProducto from './pages/tienda/PaginaDetalleProducto.jsx'
import PaginaInicio from './pages/tienda/PaginaInicio.jsx'
import PaginaLogin from './pages/tienda/PaginaLogin.jsx'
import PaginaNosotros from './pages/tienda/PaginaNosotros.jsx'
import PaginaProductos from './pages/tienda/PaginaProductos.jsx'
import PaginaRegistro from './pages/tienda/PaginaRegistro.jsx'
import RutaProtegida from './routing/RutaProtegida.jsx'
import { esAdministrador, puedeEntrarAlPanel } from './utils/permisos.js'

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
        <Route path="categorias" element={<PaginaEnConstruccion titulo="Categorías" />} />
        <Route path="categorias/:idCategoria" element={<PaginaEnConstruccion titulo="Detalle de categoría" />} />
        <Route path="ofertas" element={<PaginaEnConstruccion titulo="Ofertas" />} />
        <Route path="nosotros" element={<PaginaNosotros />} />
        <Route path="blogs" element={<PaginaBlogs />} />
        <Route path="blogs/:idBlog" element={<PaginaDetalleBlog />} />
        <Route path="contacto" element={<PaginaContacto />} />
        <Route path="login" element={<PaginaLogin />} />
        <Route path="registro" element={<PaginaRegistro />} />
        <Route path="carrito" element={<PaginaEnConstruccion titulo="Carrito de compras" />} />
        <Route path="checkout" element={<PaginaEnConstruccion titulo="Checkout" />} />
        <Route path="compra/exitosa/:numeroOrden" element={<PaginaEnConstruccion titulo="Compra exitosa" />} />
        <Route path="compra/fallida/:numeroOrden" element={<PaginaEnConstruccion titulo="Pago con error" />} />

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
        <Route index element={<PaginaEnConstruccion titulo="Dashboard" />} />
        <Route path="ordenes" element={<PaginaEnConstruccion titulo="Órdenes y boletas" />} />
        <Route path="ordenes/:numeroOrden" element={<PaginaEnConstruccion titulo="Boleta" />} />
        <Route path="productos" element={<PaginaEnConstruccion titulo="Productos" />} />
        <Route path="productos/criticos" element={<PaginaEnConstruccion titulo="Productos críticos" />} />
        <Route path="perfil" element={<PaginaEnConstruccion titulo="Perfil" />} />

        {/* Administración: solo Administrador. Esta ruta no tiene "path": solo
            agrupa a sus hijas detrás de una segunda guardia (layout route). */}
        <Route element={<RutaProtegida permiso={esAdministrador} />}>
          <Route path="productos/nuevo" element={<PaginaEnConstruccion titulo="Nuevo producto" />} />
          <Route path="productos/:codigo/editar" element={<PaginaEnConstruccion titulo="Editar producto" />} />
          <Route path="categorias" element={<PaginaEnConstruccion titulo="Categorías" />} />
          <Route path="categorias/nueva" element={<PaginaEnConstruccion titulo="Nueva categoría" />} />
          <Route path="categorias/:idCategoria/editar" element={<PaginaEnConstruccion titulo="Editar categoría" />} />
          <Route path="usuarios" element={<PaginaEnConstruccion titulo="Usuarios" />} />
          <Route path="usuarios/nuevo" element={<PaginaEnConstruccion titulo="Nuevo usuario" />} />
          <Route path="usuarios/:run/editar" element={<PaginaEnConstruccion titulo="Editar usuario" />} />
          <Route path="usuarios/:run/historial" element={<PaginaEnConstruccion titulo="Historial de compras" />} />
          <Route path="reportes" element={<PaginaEnConstruccion titulo="Reportes" />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
