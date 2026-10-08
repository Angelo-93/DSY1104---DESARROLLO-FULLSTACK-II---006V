import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import MenuLateralAdmin from './MenuLateralAdmin'

describe('MenuLateralAdmin', () => {
  it('en una subpágina marca su sección y no el Dashboard', () => {
    render(
      <MemoryRouter initialEntries={['/admin/productos/nuevo']}>
        <MenuLateralAdmin />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Productos' }).classList.contains('active')).toBeTrue()
    expect(screen.getByRole('link', { name: 'Dashboard' }).classList.contains('active')).toBeFalse()
    expect(screen.getByRole('link', { name: 'Ver tienda' }).classList.contains('active')).toBeFalse()
  })
})
