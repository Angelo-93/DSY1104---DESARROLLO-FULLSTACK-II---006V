import { fireEvent, render, screen, within } from '@testing-library/react'

import { ITEMS_PRUEBA } from '../../testing/datosPrueba.js'
import TablaCarrito from './TablaCarrito.jsx'

function filas() {
  // La primera fila es el encabezado.
  return screen.getAllByRole('row').slice(1)
}

describe('TablaCarrito', () => {
  // RÚBRICA 2/10 · Renderizado. Además de contar las filas, revisa que los datos
  // salgan con formato chileno ($500.000) y que el subtotal esté bien calculado.
  it('[Rúbrica 2/10 · Renderizado] renderiza una fila por línea con precio, cantidad y subtotal formateados', () => {
    // Preparar y actuar: ITEMS_PRUEBA trae 2 líneas (2 notebooks y 1 mouse).
    render(<TablaCarrito items={ITEMS_PRUEBA} />)

    // Verificar
    expect(filas().length).toBe(2)
    const primera = within(filas()[0])
    expect(primera.getByText('Notebook Uno')).toBeTruthy()
    expect(primera.getByText('$500.000')).toBeTruthy()
    expect(primera.getByText('$1.000.000')).toBeTruthy() // 2 × 500.000
  })

  it('en solo lectura no muestra controles; editable sí', () => {
    const { rerender } = render(<TablaCarrito items={ITEMS_PRUEBA} />)
    expect(screen.queryByRole('button', { name: /Quitar/ })).toBeNull()
    expect(screen.queryAllByRole('spinbutton').length).toBe(0)

    rerender(<TablaCarrito items={ITEMS_PRUEBA} editable stockPorCodigo={{ 'NB-1': 5, 'AC-1': 5 }} onCambiarCantidad={() => {}} onQuitar={() => {}} />)
    expect(screen.getAllByRole('spinbutton').length).toBe(2)
    expect(screen.getByRole('button', { name: 'Quitar Mouse Oferta del carrito' })).toBeTruthy()
  })

  it('avisa al padre qué línea cambiar o quitar', () => {
    const onCambiarCantidad = jasmine.createSpy('onCambiarCantidad')
    const onQuitar = jasmine.createSpy('onQuitar')
    render(<TablaCarrito items={ITEMS_PRUEBA} editable stockPorCodigo={{ 'NB-1': 5, 'AC-1': 5 }} onCambiarCantidad={onCambiarCantidad} onQuitar={onQuitar} />)

    fireEvent.click(within(filas()[0]).getByRole('button', { name: 'Aumentar cantidad' }))
    fireEvent.click(screen.getByRole('button', { name: 'Quitar Mouse Oferta del carrito' }))

    expect(onCambiarCantidad).toHaveBeenCalledOnceWith('NB-1', 3)
    expect(onQuitar).toHaveBeenCalledOnceWith('AC-1')
  })

  it('muestra el aviso de stock solo en la línea que lo supera', () => {
    render(<TablaCarrito items={ITEMS_PRUEBA} editable stockPorCodigo={{ 'NB-1': 1, 'AC-1': 5 }} onCambiarCantidad={() => {}} onQuitar={() => {}} />)

    expect(within(filas()[0]).getByRole('alert').textContent).toBe('Solo quedan 1 unidades.')
    expect(within(filas()[1]).queryByRole('alert')).toBeNull()
  })
})
