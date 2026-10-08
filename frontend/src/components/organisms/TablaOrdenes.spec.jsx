import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { ORDEN_PRUEBA } from '../../testing/datosPrueba.js'
import TablaOrdenes from './TablaOrdenes.jsx'

const ORDENES = [
  ORDEN_PRUEBA, // invitado, pagada
  { ...ORDEN_PRUEBA, numero: 1011, estado: 'rechazada', cliente: { ...ORDEN_PRUEBA.cliente, run: '201112222' } },
]

function renderizarTabla(ordenes) {
  return render(
    <MemoryRouter>
      <TablaOrdenes ordenes={ordenes} mensajeVacio="Sin órdenes." />
    </MemoryRouter>,
  )
}

describe('TablaOrdenes', () => {
  it('muestra una fila por orden con su estado y enlace a la boleta', () => {
    renderizarTabla(ORDENES)
    const filas = screen.getAllByRole('row').slice(1)

    expect(filas.length).toBe(2)
    expect(within(filas[0]).getByText('Pagada')).toBeTruthy()
    expect(within(filas[1]).getByText('Rechazada')).toBeTruthy()
    expect(within(filas[1]).getByRole('link', { name: 'Ver boleta' }).getAttribute('href')).toBe('/admin/ordenes/1011')
  })

  it('marca como "Invitado" solo las compras sin cuenta', () => {
    renderizarTabla(ORDENES)
    const filas = screen.getAllByRole('row').slice(1)

    expect(within(filas[0]).queryByText('Invitado')).toBeTruthy()
    expect(within(filas[1]).queryByText('Invitado')).toBeNull()
  })

  it('sin órdenes muestra el mensaje recibido', () => {
    renderizarTabla([])

    expect(screen.getByText('Sin órdenes.')).toBeTruthy()
    expect(screen.queryByRole('table')).toBeNull()
  })
})
