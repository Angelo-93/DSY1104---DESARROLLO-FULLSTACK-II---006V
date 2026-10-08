import { render, screen } from '@testing-library/react'

import TarjetaIndicador from './TarjetaIndicador.jsx'

describe('TarjetaIndicador', () => {
  it('muestra título, valor y detalle con la variante de color recibida', () => {
    const { container } = render(<TarjetaIndicador titulo="Compras" valor={6} detalle="Ventas: $1" variante="exito" />)

    expect(screen.getByText('Compras')).toBeTruthy()
    expect(screen.getByText('6')).toBeTruthy()
    expect(container.firstChild.classList.contains('tarjeta-indicador--exito')).toBeTrue()
  })
})
