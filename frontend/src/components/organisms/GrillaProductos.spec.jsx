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
  // RÚBRICA 1/10 · Renderizado. Tarea del Anexo: "una lista renderiza todos los
  // elementos de un conjunto de datos". Datos: PRODUCTOS_PRUEBA (3 productos).
  it('[Rúbrica 1/10 · Renderizado] renderiza una tarjeta por cada producto del conjunto de datos', () => {
    // Preparar y actuar: se dibuja la grilla con el conjunto de datos de prueba.
    renderizarGrilla(PRODUCTOS_PRUEBA, { nombresCategoria: { notebooks: 'Notebooks' } })

    // Verificar: cada producto tiene su tarjeta, no sobran tarjetas y se ve la categoría.
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
