import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { ADMIN_PRUEBA, CLIENTE_PRUEBA } from '../../testing/datosPrueba.js'
import FormularioCategoria from './FormularioCategoria.jsx'
import TablaCategoriasAdmin from './TablaCategoriasAdmin.jsx'
import TablaUsuariosAdmin from './TablaUsuariosAdmin.jsx'

describe('TablaCategoriasAdmin', () => {
  it('muestra la cantidad de productos de cada categoría y avisa cuál eliminar', () => {
    const onEliminar = jasmine.createSpy('onEliminar')
    const categorias = [{ id: 'monitores', nombre: 'Monitores' }, { id: 'vacia', nombre: 'Vacía' }]
    render(
      <MemoryRouter>
        <TablaCategoriasAdmin categorias={categorias} cantidadPorCategoria={{ monitores: 2 }} onEliminar={onEliminar} />
      </MemoryRouter>,
    )

    const filaVacia = screen.getByText('Vacía').closest('tr')
    expect(within(filaVacia).getByText('0')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Monitores' }))
    expect(onEliminar).toHaveBeenCalledOnceWith(categorias[0])
  })
})

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

describe('TablaUsuariosAdmin', () => {
  it('formatea el RUN y no ofrece eliminar la cuenta con sesión', () => {
    render(
      <MemoryRouter>
        <TablaUsuariosAdmin usuarios={[ADMIN_PRUEBA, CLIENTE_PRUEBA]} runSesion={ADMIN_PRUEBA.run} onEliminar={() => {}} />
      </MemoryRouter>,
    )

    const filaAdmin = screen.getByText('18.234.567-9').closest('tr')
    expect(within(filaAdmin).getByText('Tú')).toBeTruthy()
    expect(within(filaAdmin).queryByRole('button', { name: /Eliminar/ })).toBeNull()
    expect(screen.getByRole('button', { name: 'Eliminar Francisca' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Historial de compras de Francisca' }).getAttribute('href')).toBe('/admin/usuarios/201112222/historial')
  })
})
