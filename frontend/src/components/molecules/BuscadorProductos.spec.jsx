import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'

import BuscadorProductos from './BuscadorProductos.jsx'

function MostrarUrl() {
  const { pathname, search } = useLocation()
  return <p>URL: {pathname + search}</p>
}

describe('BuscadorProductos', () => {
  it('al buscar lleva al catálogo con el texto en la URL y limpia el campo', () => {
    render(
      <MemoryRouter>
        <BuscadorProductos />
        <Routes>
          <Route path="*" element={<MostrarUrl />} />
        </Routes>
      </MemoryRouter>,
    )
    const campo = screen.getByRole('searchbox', { name: 'Buscar productos' })

    fireEvent.change(campo, { target: { value: '  monitor hp ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }))

    expect(screen.getByText('URL: /productos?buscar=monitor%20hp')).toBeTruthy()
    expect(campo.value).toBe('')
  })
})
