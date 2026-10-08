import { render, screen } from '@testing-library/react'

import SeccionTarjetas from './SeccionTarjetas.jsx'

describe('SeccionTarjetas', () => {
  it('dibuja el título y una tarjeta por item, con el nivel de título pedido', () => {
    render(
      <SeccionTarjetas
        titulo="Sectores"
        nivelTitulo="h3"
        items={[
          { titulo: 'Corporativo', texto: 'A' },
          { titulo: 'Educativo', texto: 'B' },
        ]}
      />,
    )

    expect(screen.getByRole('heading', { level: 3, name: 'Sectores' })).toBeTruthy()
    expect(screen.getAllByRole('heading', { level: 4 }).map((h) => h.textContent)).toEqual(['Corporativo', 'Educativo'])
  })
})
