import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { PRODUCTOS_PRUEBA } from '../../testing/datosPrueba.js'
import GrillaProductos from './GrillaProductos.jsx'

function renderizarGrilla(productos, props = {}) {
  return render(
    <MemoryRouter>
      <GrillaProductos productos={productos} onAgregar={() => {}} {...props} />
    </MemoryRouter>,
  )
}

describe('GrillaProductos', () => {
  it('renderiza una tarjeta por cada producto del conjunto de datos', () => {
    renderizarGrilla(PRODUCTOS_PRUEBA, { nombresCategoria: { notebooks: 'Notebooks' } })

    PRODUCTOS_PRUEBA.forEach((producto) => {
      expect(screen.getByRole('heading', { name: producto.nombre })).toBeTruthy()
    })
    expect(screen.getAllByRole('heading').length).toBe(PRODUCTOS_PRUEBA.length)
    expect(screen.getByText('Notebooks')).toBeTruthy()
  })

  it('con la lista vacía muestra el mensaje recibido en lugar de la grilla', () => {
    renderizarGrilla([], { mensajeVacio: 'Sin resultados.' })

    expect(screen.getByText('Sin resultados.')).toBeTruthy()
    expect(screen.queryAllByRole('heading').length).toBe(0)
  })
})
