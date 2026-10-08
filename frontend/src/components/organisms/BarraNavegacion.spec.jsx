import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { ADMIN_PRUEBA, CLIENTE_PRUEBA } from '../../testing/datosPrueba.js'
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

  it('sin sesión ofrece iniciar sesión y crear cuenta', () => {
    renderizarEn('/')

    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Crear cuenta' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Cerrar sesión' })).toBeNull()
  })

  it('con sesión de cliente saluda, oculta el panel y avisa al cerrar sesión', () => {
    const onCerrarSesion = jasmine.createSpy('onCerrarSesion')
    renderizarEn('/', { usuario: CLIENTE_PRUEBA, onCerrarSesion })

    expect(screen.getByText('Hola, Francisca')).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Panel' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Iniciar sesión' })).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(onCerrarSesion).toHaveBeenCalledTimes(1)
  })

  it('con sesión de administrador muestra el acceso al panel', () => {
    renderizarEn('/', { usuario: ADMIN_PRUEBA })

    expect(screen.getByRole('link', { name: 'Panel' }).getAttribute('href')).toBe('/admin')
  })

  it('marca como activo solo el enlace de la página actual', () => {
    renderizarEn('/productos')

    expect(screen.getByRole('link', { name: 'Productos' }).classList.contains('active')).toBeTrue()
    expect(screen.getByRole('link', { name: 'Inicio' }).classList.contains('active')).toBeFalse()
  })
})
