import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import App from './App.jsx'

function renderizarAppEn(ruta) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App (rutas)', () => {
  it('muestra la página 404 con la dirección cuando la URL no existe', () => {
    renderizarAppEn('/pagina-que-no-existe')

    expect(screen.getByRole('heading', { name: 'No encontramos esta página' })).toBeTruthy()
    expect(screen.getByText('/pagina-que-no-existe')).toBeTruthy()
  })

  it('dibuja las rutas públicas dentro de la plantilla de la tienda', () => {
    renderizarAppEn('/productos/NB-HP250G10')

    expect(screen.getByRole('heading', { name: 'Detalle de producto' })).toBeTruthy()
    expect(screen.getByRole('contentinfo')).toBeTruthy() // <footer> de la tienda
  })

  it('dibuja las rutas /admin dentro de la plantilla del administrador', () => {
    renderizarAppEn('/admin/reportes')

    expect(screen.getByRole('heading', { name: 'Reportes' })).toBeTruthy()
    expect(screen.getByRole('navigation', { name: 'Menú del administrador' })).toBeTruthy()
    expect(screen.queryByRole('contentinfo')).toBeNull() // el admin no lleva el pie de la tienda
  })
})
