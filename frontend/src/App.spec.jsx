import { fireEvent, screen } from '@testing-library/react'

import App from './App.jsx'
import { CLAVES } from './services/almacenamiento.js'
import { ADMIN_PRUEBA, VENDEDOR_PRUEBA } from './testing/datosPrueba.js'
import { instalarLocalStorageFalso } from './testing/localStorageFalso.js'
import { renderizarConProveedores } from './testing/renderizarConProveedores.jsx'

function renderizarAppEn(ruta) {
  return renderizarConProveedores(<App />, { ruta })
}

describe('App (rutas)', () => {
  it('muestra la página 404 con la dirección cuando la URL no existe', () => {
    instalarLocalStorageFalso()
    renderizarAppEn('/pagina-que-no-existe')

    expect(screen.getByRole('heading', { name: 'No encontramos esta página' })).toBeTruthy()
    expect(screen.getByText('/pagina-que-no-existe')).toBeTruthy()
  })

  it('dibuja las rutas públicas dentro de la plantilla de la tienda', () => {
    instalarLocalStorageFalso()
    renderizarAppEn('/productos/NB-HP250G10')

    expect(screen.getByRole('heading', { name: 'Detalle de producto' })).toBeTruthy()
    expect(screen.getByRole('contentinfo')).toBeTruthy() // <footer> de la tienda
  })

  it('sin sesión, una ruta del panel lleva al login', () => {
    instalarLocalStorageFalso()
    renderizarAppEn('/admin/reportes')

    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeTruthy()
  })

  it('con sesión de Administrador dibuja el panel con su plantilla', () => {
    instalarLocalStorageFalso({ [CLAVES.sesion]: ADMIN_PRUEBA })
    renderizarAppEn('/admin/reportes')

    expect(screen.getByRole('heading', { name: 'Reportes' })).toBeTruthy()
    expect(screen.getByRole('navigation', { name: 'Menú del administrador' })).toBeTruthy()
    expect(screen.queryByRole('contentinfo')).toBeNull() // el admin no lleva el pie de la tienda
  })

  it('el Vendedor consulta órdenes pero no entra a Usuarios', () => {
    instalarLocalStorageFalso({ [CLAVES.sesion]: VENDEDOR_PRUEBA })

    const { unmount } = renderizarAppEn('/admin/ordenes')
    expect(screen.getByRole('heading', { name: 'Órdenes y boletas' })).toBeTruthy()
    unmount()

    renderizarAppEn('/admin/usuarios')
    expect(screen.getByRole('heading', { name: 'No tienes permiso para ver esta sección' })).toBeTruthy()
  })

  it('al cerrar sesión desde el panel lleva a la portada y no al login', () => {
    // Prueba de regresión: antes de useCerrarSesion, la guardia del panel
    // alcanzaba a redirigir al login antes de que llegara la navegación.
    instalarLocalStorageFalso({ [CLAVES.sesion]: ADMIN_PRUEBA })
    renderizarAppEn('/admin/reportes')

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))

    expect(screen.getByRole('heading', { name: 'Inicio' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeTruthy()
  })
})
