import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import TablaCategoriasAdmin from './TablaCategoriasAdmin.jsx'

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
