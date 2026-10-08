import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { useCarrito } from '../../hooks/useCarrito.js'
import { useCerrarSesion } from '../../hooks/useCerrarSesion.js'
import { useSesion } from '../../hooks/useSesion.js'
import { listarCategorias } from '../../services/categoriasService.js'
import BarraNavegacion from '../organisms/BarraNavegacion.jsx'
import PiePagina from '../organisms/PiePagina.jsx'

/**
 * Esqueleto de todas las páginas públicas: menú arriba, pie abajo, y en medio
 * la página que corresponda a la URL.
 *
 * <Outlet /> es el "hueco" donde React Router dibuja la ruta hija activa.
 * Así el menú y el pie se escriben una sola vez, no en cada página.
 *
 * La plantilla es quien lee el carrito y la sesión (con los hooks) y se los
 * pasa al menú por props: el menú queda como componente que solo muestra.
 */
function PlantillaTienda() {
  const { usuario } = useSesion()
  const { cantidadUnidades } = useCarrito()
  const manejarCierreSesion = useCerrarSesion()
  const { pathname } = useLocation()
  // Se leen al montar la tienda: si el admin crea una categoría, aparece en el
  // menú la próxima vez que se entra a la tienda (al salir del panel).
  const [categorias] = useState(listarCategorias)

  // En una SPA el navegador no vuelve arriba al cambiar de página (no hay
  // recarga): sin esto, al abrir un producto desde el final de la grilla, el
  // detalle aparecería ya desplazado hacia abajo.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    // min-vh-100 + flex-column + mt-auto en el pie: el pie queda pegado abajo
    // aunque la página tenga poco contenido.
    <div className="d-flex flex-column min-vh-100">
      <BarraNavegacion
        cantidadCarrito={cantidadUnidades}
        usuario={usuario}
        onCerrarSesion={manejarCierreSesion}
        categorias={categorias}
      />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <PiePagina />
    </div>
  )
}

export default PlantillaTienda
