import { render, screen } from '@testing-library/react'

import ImagenProducto from './ImagenProducto.jsx'

describe('ImagenProducto', () => {
  it('dibuja la ilustración de su categoría con un texto alternativo', () => {
    render(<ImagenProducto idCategoria="monitores" nombre="Monitor HP P24 G5" />)

    const imagen = screen.getByRole('img', { name: 'Ilustración de Monitor HP P24 G5' })
    expect(imagen.getAttribute('data-dibujo')).toBe('monitores')
  })

  it('usa el dibujo genérico para una categoría creada por el admin', () => {
    render(<ImagenProducto idCategoria="redes-y-wifi" nombre="Router" />)

    expect(screen.getByRole('img').getAttribute('data-dibujo')).toBe('generico')
  })

  it('da un id distinto al patrón de cada imagen de la misma página', () => {
    const { container } = render(
      <>
        <ImagenProducto idCategoria="notebooks" nombre="A" />
        <ImagenProducto idCategoria="notebooks" nombre="B" />
      </>,
    )
    const ids = [...container.querySelectorAll('pattern')].map((patron) => patron.id)

    expect(ids.length).toBe(2)
    expect(ids[0]).not.toBe(ids[1])
  })
})
