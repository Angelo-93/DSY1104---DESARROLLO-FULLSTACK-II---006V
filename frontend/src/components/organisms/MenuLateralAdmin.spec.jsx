import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import MenuLateralAdmin from './MenuLateralAdmin.jsx'

function renderizarEn(ruta, props = {}) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <MenuLateralAdmin {...props} />
    </MemoryRouter>,
  )
}

describe('MenuLateralAdmin', () => {
  it('en una subpágina marca su sección y no el Dashboard', () => {
    renderizarEn('/admin/productos/nuevo', { esAdministrador: true })

    expect(screen.getByRole('link', { name: 'Productos' }).classList.contains('active')).toBeTrue()
    expect(screen.getByRole('link', { name: 'Dashboard' }).classList.contains('active')).toBeFalse()
    expect(screen.getByRole('link', { name: 'Ver tienda' }).classList.contains('active')).toBeFalse()
  })

  it('al Administrador le muestra las siete secciones', () => {
    renderizarEn('/admin', { esAdministrador: true })

    expect(screen.getAllByRole('link').length).toBe(8) // 7 secciones + "Ver tienda"
    expect(screen.getByRole('link', { name: 'Usuarios' })).toBeTruthy()
  })

  it('al Vendedor le oculta Categorías, Usuarios y Reportes', () => {
    renderizarEn('/admin', { esAdministrador: false })

    expect(screen.getByRole('link', { name: 'Órdenes' })).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Categorías' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Usuarios' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Reportes' })).toBeNull()
  })

  it('avisa al padre cuando se pulsa Cerrar sesión', () => {
    const onCerrarSesion = jasmine.createSpy('onCerrarSesion')
    renderizarEn('/admin', { onCerrarSesion })

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))

    expect(onCerrarSesion).toHaveBeenCalled()
  })
})
