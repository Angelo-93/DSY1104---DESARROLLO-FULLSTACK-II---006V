import { fireEvent, screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'

import { CLAVES } from '../../services/almacenamiento.js'
import { PRODUCTOS_PRUEBA } from '../../testing/datosPrueba.js'
import { instalarLocalStorageFalso } from '../../testing/localStorageFalso.js'
import { renderizarConProveedores } from '../../testing/renderizarConProveedores.jsx'
import PaginaProductos from './PaginaProductos.jsx'

const CATEGORIAS = [
  { id: 'notebooks', nombre: 'Notebooks' },
  { id: 'accesorios', nombre: 'Accesorios' },
  { id: 'audio', nombre: 'Audio y Videoconferencia' },
]

function renderizarCatalogo(ruta = '/productos') {
  return renderizarConProveedores(
    <Routes>
      <Route path="/productos" element={<PaginaProductos />} />
    </Routes>,
    { ruta },
  )
}

function nombresVisibles() {
  return screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
}

describe('PaginaProductos (filtros)', () => {
  beforeEach(() => {
    instalarLocalStorageFalso({ [CLAVES.productos]: PRODUCTOS_PRUEBA, [CLAVES.categorias]: CATEGORIAS })
  })

  it('sin filtros muestra todo el catálogo y el total', () => {
    renderizarCatalogo()

    expect(nombresVisibles().length).toBe(3)
    expect(screen.getByText('3 productos')).toBeTruthy()
  })

  it('al elegir una categoría muestra solo sus productos', () => {
    renderizarCatalogo()

    fireEvent.change(screen.getByLabelText('Filtrar por categoría'), { target: { value: 'accesorios' } })

    expect(nombresVisibles()).toEqual(['Mouse Oferta'])
    expect(screen.getByText('1 producto')).toBeTruthy()
  })

  it('busca sin importar tildes ni mayúsculas, también por categoría', () => {
    renderizarCatalogo()

    fireEvent.change(screen.getByLabelText('Buscar productos en el catálogo'), { target: { value: 'CAMARA' } })
    expect(nombresVisibles()).toEqual(['Cámara Agotada'])

    fireEvent.change(screen.getByLabelText('Buscar productos en el catálogo'), { target: { value: 'videoconferencia' } })
    expect(nombresVisibles()).toEqual(['Cámara Agotada'])
  })

  it('aplica los filtros que vienen en la URL (desde el buscador del menú)', () => {
    renderizarCatalogo('/productos?categoria=notebooks')

    expect(screen.getByLabelText('Filtrar por categoría').value).toBe('notebooks')
    expect(nombresVisibles()).toEqual(['Notebook Uno'])
  })

  it('sin coincidencias muestra un mensaje que orienta', () => {
    renderizarCatalogo('/productos?buscar=xyz')

    expect(screen.getByText(/Ningún producto coincide/)).toBeTruthy()
  })
})
