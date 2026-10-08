import { Outlet } from 'react-router-dom'

import BarraNavegacion from '../organisms/BarraNavegacion'
import PiePagina from '../organisms/PiePagina'

/**
 * Esqueleto de todas las páginas públicas: menú arriba, pie abajo, y en medio
 * la página que corresponda a la URL.
 *
 * <Outlet /> es el "hueco" donde React Router dibuja la ruta hija activa.
 * Así el menú y el pie se escriben una sola vez, no en cada página.
 */
function PlantillaTienda() {
  return (
    // min-vh-100 + flex-column + mt-auto en el pie: el pie queda pegado abajo
    // aunque la página tenga poco contenido.
    <div className="d-flex flex-column min-vh-100">
      <BarraNavegacion />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <PiePagina />
    </div>
  )
}

export default PlantillaTienda
