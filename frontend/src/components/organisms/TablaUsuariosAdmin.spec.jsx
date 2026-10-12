import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { ADMIN_PRUEBA, CLIENTE_PRUEBA } from '../../testing/datosPrueba.js'
import TablaUsuariosAdmin from './TablaUsuariosAdmin.jsx'

function renderizarTabla(usuarios) {
  return render(
    <MemoryRouter>
      <TablaUsuariosAdmin usuarios={usuarios} runSesion={ADMIN_PRUEBA.run} onEliminar={() => {}} mensajeVacio="Sin resultados." />
    </MemoryRouter>,
  )
}

describe('TablaUsuariosAdmin', () => {
  it('formatea el RUN y no ofrece eliminar la cuenta con sesión', () => {
    renderizarTabla([ADMIN_PRUEBA, CLIENTE_PRUEBA])

    const filaAdmin = screen.getByText('18.234.567-9').closest('tr')
    expect(within(filaAdmin).getByText('Tú')).toBeTruthy()
    expect(within(filaAdmin).queryByRole('button', { name: /Eliminar/ })).toBeNull()
    expect(screen.getByRole('button', { name: 'Eliminar Francisca' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Historial de compras de Francisca' }).getAttribute('href')).toBe('/admin/usuarios/201112222/historial')
  })

  it('con la lista vacía muestra el mensaje recibido en vez de una tabla sin filas', () => {
    renderizarTabla([])

    expect(screen.getByText('Sin resultados.')).toBeTruthy()
    expect(screen.queryByRole('table')).toBeNull()
  })
})
