/*
 * Mapa de rutas de INFORCORE. Sigue el diagrama de flujo del Anexo 1 de la EP2
 * (Figura 3 para la tienda y Figura 10 para el administrador).
 *
 * Las rutas se anidan dentro de una plantilla: la plantilla dibuja lo que se
 * repite (menú, pie, menú lateral) y la ruta hija se dibuja en su <Outlet />.
 *
 * Mientras una vista no existe, su ruta muestra PaginaEnConstruccion. Cada
 * bloque siguiente reemplaza el "element" de su ruta por la página real.
 */
import { Route, Routes } from 'react-router-dom'

import PlantillaAdmin from './components/templates/PlantillaAdmin.jsx'
import PlantillaTienda from './components/templates/PlantillaTienda.jsx'
import PaginaEnConstruccion from './pages/comunes/PaginaEnConstruccion.jsx'
import PaginaNoEncontrada from './pages/comunes/PaginaNoEncontrada.jsx'

function App() {
  return (
    <Routes>
      {/* ---------- Tienda (pública) ---------- */}
      <Route element={<PlantillaTienda />}>
        <Route index element={<PaginaEnConstruccion titulo="Inicio" />} />
        <Route path="productos" element={<PaginaEnConstruccion titulo="Productos" />} />
        {/* ":codigo" es un parámetro: /productos/NB-HP250G10 entrega
            codigo = "NB-HP250G10" a la página mediante useParams(). */}
        <Route path="productos/:codigo" element={<PaginaEnConstruccion titulo="Detalle de producto" />} />
        <Route path="categorias" element={<PaginaEnConstruccion titulo="Categorías" />} />
        <Route path="categorias/:idCategoria" element={<PaginaEnConstruccion titulo="Detalle de categoría" />} />
        <Route path="ofertas" element={<PaginaEnConstruccion titulo="Ofertas" />} />
        <Route path="nosotros" element={<PaginaEnConstruccion titulo="Nosotros" />} />
        <Route path="blogs" element={<PaginaEnConstruccion titulo="Blogs" />} />
        <Route path="blogs/:idBlog" element={<PaginaEnConstruccion titulo="Detalle de blog" />} />
        <Route path="contacto" element={<PaginaEnConstruccion titulo="Contacto" />} />
        <Route path="login" element={<PaginaEnConstruccion titulo="Iniciar sesión" />} />
        <Route path="registro" element={<PaginaEnConstruccion titulo="Crear cuenta" />} />
        <Route path="carrito" element={<PaginaEnConstruccion titulo="Carrito de compras" />} />
        <Route path="checkout" element={<PaginaEnConstruccion titulo="Checkout" />} />
        <Route path="compra/exitosa/:numeroOrden" element={<PaginaEnConstruccion titulo="Compra exitosa" />} />
        <Route path="compra/fallida/:numeroOrden" element={<PaginaEnConstruccion titulo="Pago con error" />} />

        {/* Comodín: cualquier URL que no calzó arriba (ni en /admin) cae aquí. */}
        <Route path="*" element={<PaginaNoEncontrada />} />
      </Route>

      {/* ---------- Panel administrador ---------- */}
      <Route path="admin" element={<PlantillaAdmin />}>
        <Route index element={<PaginaEnConstruccion titulo="Dashboard" />} />
        <Route path="ordenes" element={<PaginaEnConstruccion titulo="Órdenes y boletas" />} />
        <Route path="ordenes/:numeroOrden" element={<PaginaEnConstruccion titulo="Boleta" />} />
        <Route path="productos" element={<PaginaEnConstruccion titulo="Productos" />} />
        <Route path="productos/nuevo" element={<PaginaEnConstruccion titulo="Nuevo producto" />} />
        <Route path="productos/criticos" element={<PaginaEnConstruccion titulo="Productos críticos" />} />
        <Route path="productos/:codigo/editar" element={<PaginaEnConstruccion titulo="Editar producto" />} />
        <Route path="categorias" element={<PaginaEnConstruccion titulo="Categorías" />} />
        <Route path="categorias/nueva" element={<PaginaEnConstruccion titulo="Nueva categoría" />} />
        <Route path="categorias/:idCategoria/editar" element={<PaginaEnConstruccion titulo="Editar categoría" />} />
        <Route path="usuarios" element={<PaginaEnConstruccion titulo="Usuarios" />} />
        <Route path="usuarios/nuevo" element={<PaginaEnConstruccion titulo="Nuevo usuario" />} />
        <Route path="usuarios/:run/editar" element={<PaginaEnConstruccion titulo="Editar usuario" />} />
        <Route path="usuarios/:run/historial" element={<PaginaEnConstruccion titulo="Historial de compras" />} />
        <Route path="reportes" element={<PaginaEnConstruccion titulo="Reportes" />} />
        <Route path="perfil" element={<PaginaEnConstruccion titulo="Perfil" />} />
      </Route>
    </Routes>
  )
}

export default App
