import { fireEvent, render, screen } from '@testing-library/react'

import FormularioProducto from './FormularioProducto.jsx'

const CATEGORIAS = [{ id: 'monitores', nombre: 'Monitores' }]
const PRODUCTO = {
  codigo: 'MN-1', nombre: 'Monitor', idCategoria: 'monitores', especificaciones: '', descripcion: '',
  precio: 100000, precioOferta: null, stock: 5, stockCritico: null,
}

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

describe('FormularioProducto', () => {
  let onGuardar

  beforeEach(() => {
    onGuardar = jasmine.createSpy('onGuardar')
  })

  it('en modo nuevo parte vacío, valida y no guarda con errores', () => {
    render(<FormularioProducto categorias={CATEGORIAS} onGuardar={onGuardar} onCancelar={() => {}} />)

    escribir('Código', 'AB')
    fireEvent.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(screen.getByText('Mínimo 3 caracteres.')).toBeTruthy()
    expect(screen.getByText('Selecciona una categoría.')).toBeTruthy()
    expect(onGuardar).not.toHaveBeenCalled()
  })

  it('en modo edición precarga los datos (opcionales vacíos) y bloquea el código', () => {
    render(<FormularioProducto producto={PRODUCTO} categorias={CATEGORIAS} onGuardar={onGuardar} onCancelar={() => {}} />)

    expect(screen.getByLabelText('Código').disabled).toBeTrue()
    expect(screen.getByLabelText('Precio').value).toBe('100000')
    expect(screen.getByLabelText('Precio oferta (opcional)').value).toBe('')
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeTruthy()
  })

  it('entrega los datos al padre cuando son válidos', () => {
    render(<FormularioProducto producto={PRODUCTO} categorias={CATEGORIAS} onGuardar={onGuardar} onCancelar={() => {}} />)

    escribir('Stock', '12')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(onGuardar).toHaveBeenCalledOnceWith(jasmine.objectContaining({ codigo: 'MN-1', stock: '12' }))
  })

  it('rechaza un precio de oferta mayor o igual al precio', () => {
    render(<FormularioProducto producto={PRODUCTO} categorias={CATEGORIAS} onGuardar={onGuardar} onCancelar={() => {}} />)

    escribir('Precio oferta (opcional)', '100000')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(screen.getByText('El precio de oferta debe ser menor que el precio normal.')).toBeTruthy()
  })
})
