import { screen } from '@testing-library/react'
import { Route, Routes, useLocation } from 'react-router-dom'

import { CLAVES } from '../services/almacenamiento.js'
import { CLIENTE_PRUEBA, VENDEDOR_PRUEBA } from '../testing/datosPrueba.js'
import { instalarLocalStorageFalso } from '../testing/localStorageFalso.js'
import { renderizarConProveedores } from '../testing/renderizarConProveedores.jsx'
import { puedeEntrarAlPanel } from '../utils/permisos.js'
import RutaProtegida from './RutaProtegida.jsx'

// Login de mentira: solo muestra desde dónde lo mandaron, para comprobar
// que la guardia recuerda la página que el usuario quería ver.
function LoginFalso() {
  const { state } = useLocation()
  return <p>Login (desde {state?.desde})</p>
}

function renderizarPanelProtegido() {
  return renderizarConProveedores(
    <Routes>
      <Route path="/login" element={<LoginFalso />} />
      <Route
        path="/admin/ordenes"
        element={
          <RutaProtegida permiso={puedeEntrarAlPanel}>
            <p>Contenido del panel</p>
          </RutaProtegida>
        }
      />
    </Routes>,
    { ruta: '/admin/ordenes' },
  )
}

describe('RutaProtegida', () => {
  it('sin sesión redirige al login recordando la página pedida', () => {
    instalarLocalStorageFalso()
    renderizarPanelProtegido()

    expect(screen.getByText('Login (desde /admin/ordenes)')).toBeTruthy()
    expect(screen.queryByText('Contenido del panel')).toBeNull()
  })

  it('con sesión de un rol sin permiso muestra la página 403', () => {
    instalarLocalStorageFalso({ [CLAVES.sesion]: CLIENTE_PRUEBA })
    renderizarPanelProtegido()

    expect(screen.getByRole('heading', { name: 'No tienes permiso para ver esta sección' })).toBeTruthy()
    expect(screen.queryByText('Contenido del panel')).toBeNull()
  })

  it('con un rol permitido muestra el contenido protegido', () => {
    instalarLocalStorageFalso({ [CLAVES.sesion]: VENDEDOR_PRUEBA })
    renderizarPanelProtegido()

    expect(screen.getByText('Contenido del panel')).toBeTruthy()
  })
})
