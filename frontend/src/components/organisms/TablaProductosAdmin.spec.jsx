import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { PRODUCTOS_PRUEBA } from '../../testing/datosPrueba.js'
import TablaProductosAdmin from './TablaProductosAdmin.jsx'

// PRODUCTOS_PRUEBA: Notebook (stock 3, crítico 1), Mouse en oferta (10/2), Cámara agotada (0/5).
function renderizarTabla(props) {
  return render(
    <MemoryRouter>
      <TablaProductosAdmin productos={PRODUCTOS_PRUEBA} nombresCategoria={{ notebooks: 'Notebooks' }} {...props} />
    </MemoryRouter>,
  )
}

describe('TablaProductosAdmin', () => {
  it('marca el stock agotado y no muestra acciones en solo lectura', () => {
    renderizarTabla()

    const filaCamara = screen.getByText('Cámara Agotada').closest('tr')
    expect(within(filaCamara).getByText('Agotado')).toBeTruthy()
    expect(screen.queryByRole('link', { name: /Editar/ })).toBeNull()
    expect(screen.queryByRole('button', { name: /Eliminar/ })).toBeNull()
  })

  it('con permiso de edición enlaza al formulario y avisa qué producto eliminar', () => {
    const onEliminar = jasmine.createSpy('onEliminar')
    renderizarTabla({ puedeEditar: true, onEliminar })

    expect(screen.getByRole('link', { name: 'Editar Notebook Uno' }).getAttribute('href')).toBe('/admin/productos/NB-1/editar')
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Mouse Oferta' }))

    expect(onEliminar).toHaveBeenCalledOnceWith(PRODUCTOS_PRUEBA[1])
  })

  it('muestra el nombre de la categoría o "Sin categoría" si no existe', () => {
    renderizarTabla()

    expect(screen.getByText('Notebooks')).toBeTruthy()
    expect(screen.getAllByText('Sin categoría').length).toBe(2)
  })
})
