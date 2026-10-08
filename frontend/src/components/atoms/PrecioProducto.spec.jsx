import { render, screen } from '@testing-library/react'

import PrecioProducto from './PrecioProducto.jsx'

describe('PrecioProducto', () => {
  it('sin oferta muestra solo el precio normal', () => {
    render(<PrecioProducto producto={{ precio: 549990, precioOferta: null }} />)

    expect(screen.getByText('$549.990')).toBeTruthy()
    expect(screen.queryByTestId('precio-oferta')).toBeNull()
  })

  it('con oferta muestra el precio tachado, el de oferta y el descuento', () => {
    render(<PrecioProducto producto={{ precio: 399990, precioOferta: 349990 }} />)

    expect(screen.getByTestId('precio-normal').textContent).toBe('$399.990')
    expect(screen.getByTestId('precio-oferta').textContent).toBe('$349.990')
    expect(screen.getByText('-13%')).toBeTruthy()
  })
})
