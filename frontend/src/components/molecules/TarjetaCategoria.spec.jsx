import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import TarjetaCategoria from './TarjetaCategoria.jsx'

function renderizarTarjeta(cantidad) {
  return render(
    <MemoryRouter>
      <TarjetaCategoria categoria={{ id: 'monitores', nombre: 'Monitores', descripcion: 'Pantallas' }} cantidadProductos={cantidad} />
    </MemoryRouter>,
  )
}

describe('TarjetaCategoria', () => {
  it('enlaza al detalle de la categoría y muestra su descripción', () => {
    renderizarTarjeta(2)

    expect(screen.getByRole('link', { name: 'Monitores' }).getAttribute('href')).toBe('/categorias/monitores')
    expect(screen.getByText('Pantallas')).toBeTruthy()
    expect(screen.getByText('2 productos')).toBeTruthy()
  })

  it('usa singular cuando hay un solo producto', () => {
    renderizarTarjeta(1)

    expect(screen.getByText('1 producto')).toBeTruthy()
  })
})
