import { render, screen } from '@testing-library/react'

import GraficoBarras from './GraficoBarras.jsx'

describe('GraficoBarras', () => {
  it('dibuja un canvas accesible con el título como nombre', () => {
    render(<GraficoBarras titulo="Ventas por mes" etiquetas={['Ago', 'Sep']} valores={[100, 200]} />)

    const grafico = screen.getByRole('img', { name: 'Ventas por mes' })
    expect(grafico.tagName).toBe('CANVAS')
  })

  it('usa el alto recibido por props', () => {
    const { container } = render(<GraficoBarras titulo="X" etiquetas={['a']} valores={[1]} alto={150} />)

    expect(container.firstChild.style.height).toBe('150px')
  })
})
