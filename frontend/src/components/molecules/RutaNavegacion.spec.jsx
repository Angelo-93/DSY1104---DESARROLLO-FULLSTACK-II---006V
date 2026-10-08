import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import RutaNavegacion from './RutaNavegacion.jsx'

describe('RutaNavegacion', () => {
  it('parte en Inicio y deja sin enlace la página actual', () => {
    render(
      <MemoryRouter>
        <RutaNavegacion elementos={[{ texto: 'Productos', ruta: '/productos' }, { texto: 'HP 250 G10' }]} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Inicio' }).getAttribute('href')).toBe('/')
    expect(screen.getByRole('link', { name: 'Productos' }).getAttribute('href')).toBe('/productos')
    expect(screen.queryByRole('link', { name: 'HP 250 G10' })).toBeNull()
    expect(screen.getByText('HP 250 G10')).toBeTruthy()
  })
})
