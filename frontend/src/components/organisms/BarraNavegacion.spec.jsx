import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import BarraNavegacion from './BarraNavegacion.jsx'

// La barra usa Link y NavLink, que solo funcionan dentro de un router.
// MemoryRouter simula la URL en memoria, sin tocar la barra del navegador.
function renderizarEn(ruta, props = {}) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <BarraNavegacion {...props} />
    </MemoryRouter>,
  )
}

describe('BarraNavegacion', () => {
  it('renderiza los siete enlaces de la tienda', () => {
    renderizarEn('/')

    const textos = ['Inicio', 'Productos', 'Categorías', 'Ofertas', 'Nosotros', 'Blogs', 'Contacto']
    textos.forEach((texto) => {
      expect(screen.getByRole('link', { name: texto })).toBeTruthy()
    })
  })

  it('muestra en el botón del carrito la cantidad recibida por props', () => {
    renderizarEn('/', { cantidadCarrito: 3 })

    expect(screen.getByTestId('contador-carrito').textContent).toBe('3')
    expect(screen.getByRole('link', { name: 'Carrito, 3 productos' })).toBeTruthy()
  })

  it('marca como activo solo el enlace de la página actual', () => {
    renderizarEn('/productos')

    expect(screen.getByRole('link', { name: 'Productos' }).classList.contains('active')).toBeTrue()
    expect(screen.getByRole('link', { name: 'Inicio' }).classList.contains('active')).toBeFalse()
  })
})
