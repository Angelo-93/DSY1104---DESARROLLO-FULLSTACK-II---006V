import { render, screen } from '@testing-library/react'

import { ORDEN_PRUEBA } from '../../testing/datosPrueba.js'
import DetalleOrden from './DetalleOrden.jsx'

describe('DetalleOrden', () => {
  it('muestra cliente, dirección, productos y el total con la etiqueta recibida', () => {
    render(<DetalleOrden orden={ORDEN_PRUEBA} etiquetaTotal="Total pagado" />)

    expect(screen.getByText('Pérez Soto')).toBeTruthy()
    expect(screen.getByText('Maipú')).toBeTruthy()
    expect(screen.getByText('Dejar en conserjería.')).toBeTruthy()
    expect(screen.getByText('Notebook Uno')).toBeTruthy()
    expect(screen.getByText('Total pagado: $1.015.000')).toBeTruthy()
  })

  it('muestra un guion en los datos opcionales vacíos', () => {
    render(<DetalleOrden orden={ORDEN_PRUEBA} />)

    const departamento = screen.getByText('Departamento').nextElementSibling
    expect(departamento.textContent).toBe('—')
  })
})
