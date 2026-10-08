import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { CarritoProvider } from '../context/CarritoProvider.jsx'
import { SesionProvider } from '../context/SesionProvider.jsx'

/**
 * Renderiza un componente con los mismos envoltorios que main.jsx (router,
 * sesión y carrito), pero con MemoryRouter para elegir la URL de partida.
 * Lo usan las pruebas de páginas completas.
 *
 * Los Providers leen localStorage al montarse: conviene instalar antes el mock
 * (instalarLocalStorageFalso) con la sesión y el carrito que la prueba necesite.
 *
 * @param {React.ReactElement} ui
 * @param {{ruta?: string}} [opciones]
 */
export function renderizarConProveedores(ui, { ruta = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <SesionProvider>
        <CarritoProvider>{ui}</CarritoProvider>
      </SesionProvider>
    </MemoryRouter>,
  )
}
