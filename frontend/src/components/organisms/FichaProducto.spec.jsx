import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { PRODUCTOS_PRUEBA } from '../../testing/datosPrueba.js'
import FichaProducto from './FichaProducto.jsx'

const [NOTEBOOK, , CAMARA_AGOTADA] = PRODUCTOS_PRUEBA

function renderizarFicha(producto, onAgregar = () => {}) {
  return render(
    <MemoryRouter>
      <FichaProducto producto={producto} categoria={{ id: 'notebooks', nombre: 'Notebooks' }} onAgregar={onAgregar} />
    </MemoryRouter>,
  )
}

describe('FichaProducto', () => {
  it('entrega al padre el producto con la cantidad elegida en su estado', () => {
    const onAgregar = jasmine.createSpy('onAgregar')
    renderizarFicha(NOTEBOOK, onAgregar)

    fireEvent.click(screen.getByRole('button', { name: 'Aumentar cantidad' }))
    fireEvent.click(screen.getByRole('button', { name: 'Aumentar cantidad' }))
    fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }))

    expect(screen.getByRole('spinbutton').value).toBe('3')
    expect(onAgregar).toHaveBeenCalledOnceWith(NOTEBOOK, 3)
  })

  it('para un producto agotado avisa y no ofrece comprar', () => {
    renderizarFicha(CAMARA_AGOTADA)

    expect(screen.getByText('Producto agotado')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Agregar al carrito' })).toBeNull()
  })
})
