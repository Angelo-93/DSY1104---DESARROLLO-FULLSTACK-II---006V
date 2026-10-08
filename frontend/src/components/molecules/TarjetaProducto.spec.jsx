import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { PRODUCTOS_PRUEBA } from '../../testing/datosPrueba.js'
import TarjetaProducto from './TarjetaProducto.jsx'

const [NOTEBOOK, MOUSE_OFERTA, CAMARA_AGOTADA] = PRODUCTOS_PRUEBA

function renderizarTarjeta(producto, onAgregar = () => {}) {
  return render(
    <MemoryRouter>
      <TarjetaProducto producto={producto} nombreCategoria="Notebooks" onAgregar={onAgregar} />
    </MemoryRouter>,
  )
}

describe('TarjetaProducto', () => {
  it('muestra los datos que recibe por props y enlaza al detalle', () => {
    renderizarTarjeta(NOTEBOOK)

    expect(screen.getByText('Notebooks')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Notebook Uno' }).getAttribute('href')).toBe('/productos/NB-1')
    expect(screen.getByText('$500.000')).toBeTruthy()
  })

  it('al pulsar "Agregar al carrito" entrega el producto al padre', () => {
    const onAgregar = jasmine.createSpy('onAgregar')
    renderizarTarjeta(NOTEBOOK, onAgregar)

    fireEvent.click(screen.getByRole('button', { name: 'Agregar Notebook Uno al carrito' }))

    expect(onAgregar).toHaveBeenCalledOnceWith(NOTEBOOK)
  })

  it('marca la oferta y deshabilita la compra de un producto agotado', () => {
    renderizarTarjeta(MOUSE_OFERTA)
    expect(screen.getByText('Oferta')).toBeTruthy()

    renderizarTarjeta(CAMARA_AGOTADA)
    const boton = screen.getByRole('button', { name: 'Cámara Agotada agotado' })
    expect(boton.disabled).toBeTrue()
  })
})
