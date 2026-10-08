import { fireEvent, render, screen } from '@testing-library/react'

import SelectorCantidad from './SelectorCantidad.jsx'

describe('SelectorCantidad', () => {
  it('avisa la cantidad nueva al pulsar + y −', () => {
    const onCambiar = jasmine.createSpy('onCambiar')
    render(<SelectorCantidad valor={2} maximo={5} onCambiar={onCambiar} />)

    fireEvent.click(screen.getByRole('button', { name: 'Aumentar cantidad' }))
    fireEvent.click(screen.getByRole('button', { name: 'Disminuir cantidad' }))

    expect(onCambiar.calls.allArgs()).toEqual([[3], [1]])
  })

  it('deshabilita − en 1 y + en el máximo (casos de borde)', () => {
    const { rerender } = render(<SelectorCantidad valor={1} maximo={3} onCambiar={() => {}} />)
    expect(screen.getByRole('button', { name: 'Disminuir cantidad' }).disabled).toBeTrue()

    rerender(<SelectorCantidad valor={3} maximo={3} onCambiar={() => {}} />)
    expect(screen.getByRole('button', { name: 'Aumentar cantidad' }).disabled).toBeTrue()
  })

  it('limita lo escrito a mano entre 1 y el máximo', () => {
    const onCambiar = jasmine.createSpy('onCambiar')
    render(<SelectorCantidad valor={1} maximo={4} onCambiar={onCambiar} />)

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '9' } })

    expect(onCambiar).toHaveBeenCalledWith(4)
  })
})
