import { fireEvent, render, screen, within } from '@testing-library/react'
import { useState } from 'react'

import SelectorRegionComuna from './SelectorRegionComuna.jsx'

// Padre de prueba que guarda los valores, como lo hace un formulario real.
function FormularioDePrueba() {
  const [datos, setDatos] = useState({ region: '', comuna: '' })
  return (
    <SelectorRegionComuna
      idPrefijo="prueba"
      region={datos.region}
      comuna={datos.comuna}
      onCambiar={(campo, valor) => setDatos((anterior) => ({ ...anterior, [campo]: valor }))}
    />
  )
}

describe('SelectorRegionComuna', () => {
  it('mantiene la comuna deshabilitada hasta elegir región', () => {
    render(<FormularioDePrueba />)

    expect(screen.getByLabelText('Comuna').disabled).toBeTrue()
  })

  it('ofrece solo las comunas de la región elegida', () => {
    render(<FormularioDePrueba />)

    fireEvent.change(screen.getByLabelText('Región'), { target: { value: 'Región de Arica y Parinacota' } })

    const opciones = within(screen.getByLabelText('Comuna')).getAllByRole('option').map((o) => o.textContent)
    expect(opciones).toEqual(['Selecciona la comuna', 'Arica', 'Camarones', 'Putre', 'General Lagos'])
  })

  it('al cambiar de región borra la comuna elegida antes', () => {
    render(<FormularioDePrueba />)
    fireEvent.change(screen.getByLabelText('Región'), { target: { value: 'Región de Arica y Parinacota' } })
    fireEvent.change(screen.getByLabelText('Comuna'), { target: { value: 'Putre' } })

    fireEvent.change(screen.getByLabelText('Región'), { target: { value: 'Región de Tarapacá' } })

    expect(screen.getByLabelText('Comuna').value).toBe('')
  })
})
