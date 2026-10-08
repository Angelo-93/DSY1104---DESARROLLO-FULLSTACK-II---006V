import { fireEvent, screen, within } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'

import { CLAVES } from '../../services/almacenamiento.js'
import { ITEMS_PRUEBA, PRODUCTOS_PRUEBA } from '../../testing/datosPrueba.js'
import { instalarLocalStorageFalso } from '../../testing/localStorageFalso.js'
import { renderizarConProveedores } from '../../testing/renderizarConProveedores.jsx'
import PaginaCarrito from './PaginaCarrito.jsx'

function renderizarCarrito() {
  return renderizarConProveedores(
    <Routes>
      <Route path="/carrito" element={<PaginaCarrito />} />
      <Route path="/checkout" element={<p>Checkout</p>} />
    </Routes>,
    { ruta: '/carrito' },
  )
}

describe('PaginaCarrito', () => {
  let memoria

  beforeEach(() => {
    // PRODUCTOS_PRUEBA: Notebook Uno tiene stock 3 y el Mouse 10.
    memoria = instalarLocalStorageFalso({ [CLAVES.productos]: PRODUCTOS_PRUEBA, [CLAVES.carrito]: ITEMS_PRUEBA })
  })

  it('sin productos muestra el carrito vacío', () => {
    memoria[CLAVES.carrito] = '[]'
    renderizarCarrito()

    expect(screen.getByRole('heading', { name: 'Tu carrito está vacío' })).toBeTruthy()
  })

  it('al cambiar una cantidad actualiza el total', () => {
    renderizarCarrito()
    expect(screen.getByTestId('total-carrito').textContent).toBe('$1.015.000')

    const filaMouse = screen.getByText('Mouse Oferta').closest('tr')
    fireEvent.click(within(filaMouse).getByRole('button', { name: 'Aumentar cantidad' }))

    expect(screen.getByTestId('total-carrito').textContent).toBe('$1.030.000')
  })

  it('vacía el carrito solo después de confirmar en la ventana', () => {
    renderizarCarrito()

    fireEvent.click(screen.getByRole('button', { name: 'Vaciar carrito' }))
    expect(screen.getByText('Notebook Uno')).toBeTruthy() // todavía no se vació

    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Vaciar carrito' }))
    expect(screen.getByRole('heading', { name: 'Tu carrito está vacío' })).toBeTruthy()
  })

  it('bloquea "Comprar ahora" si una cantidad supera el stock actual', () => {
    memoria[CLAVES.carrito] = JSON.stringify([{ ...ITEMS_PRUEBA[0], cantidad: 5 }]) // stock 3
    renderizarCarrito()

    expect(screen.getByRole('button', { name: 'Comprar ahora' }).disabled).toBeTrue()
    expect(screen.getByText('Solo quedan 3 unidades.')).toBeTruthy()
  })

  it('"Comprar ahora" lleva al checkout', () => {
    renderizarCarrito()

    fireEvent.click(screen.getByRole('button', { name: 'Comprar ahora' }))

    expect(screen.getByText('Checkout')).toBeTruthy()
  })
})
