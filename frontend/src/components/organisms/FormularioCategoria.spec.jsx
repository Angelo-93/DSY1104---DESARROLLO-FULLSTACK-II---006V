import { fireEvent, render, screen } from '@testing-library/react'

import FormularioCategoria from './FormularioCategoria.jsx'

describe('FormularioCategoria', () => {
  it('exige el nombre y entrega los datos válidos', () => {
    const onGuardar = jasmine.createSpy('onGuardar')
    render(<FormularioCategoria onGuardar={onGuardar} onCancelar={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: 'Crear categoría' }))
    expect(screen.getByText('El nombre es obligatorio.')).toBeTruthy()

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Redes' } })
    fireEvent.click(screen.getByRole('button', { name: 'Crear categoría' }))
    expect(onGuardar).toHaveBeenCalledOnceWith({ nombre: 'Redes', descripcion: '' })
  })
})
