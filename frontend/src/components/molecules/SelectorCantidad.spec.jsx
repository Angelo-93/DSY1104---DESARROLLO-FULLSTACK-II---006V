import { fireEvent, render, screen } from '@testing-library/react'

import SelectorCantidad from './SelectorCantidad.jsx'

describe('SelectorCantidad', () => {
  // RÚBRICA 9/10 · Eventos. Tarea del Anexo: "simula un clic en un botón y
  // comprueba que se ejecute una función específica". La cantidad la guarda el
  // padre; el selector solo avisa el valor nuevo llamando a onCambiar (un mock).
  it('[Rúbrica 9/10 · Eventos] avisa la cantidad nueva al pulsar + y −', () => {
    // Preparar: cantidad actual 2, máximo 5.
    const onCambiar = jasmine.createSpy('onCambiar')
    render(<SelectorCantidad valor={2} maximo={5} onCambiar={onCambiar} />)

    // Actuar: un clic en + y otro en −.
    fireEvent.click(screen.getByRole('button', { name: 'Aumentar cantidad' }))
    fireEvent.click(screen.getByRole('button', { name: 'Disminuir cantidad' }))

    // Verificar: calls.allArgs() lista cada llamada en orden: primero 2+1, luego 2−1.
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

  // Regresión: antes el campo no se podía vaciar y lo escrito quedaba pegado ("13").
  it('permite borrar el número para escribir otro, y al salir vacío vuelve a la cantidad', () => {
    const onCambiar = jasmine.createSpy('onCambiar')
    render(<SelectorCantidad valor={1} maximo={5} onCambiar={onCambiar} />)
    const campo = screen.getByRole('spinbutton')

    fireEvent.change(campo, { target: { value: '' } })
    expect(campo.value).toBe('')
    expect(onCambiar).not.toHaveBeenCalled()

    fireEvent.change(campo, { target: { value: '3' } })
    expect(onCambiar).toHaveBeenCalledOnceWith(3)

    fireEvent.change(campo, { target: { value: '' } })
    fireEvent.blur(campo)
    expect(campo.value).toBe('1')
  })
})
