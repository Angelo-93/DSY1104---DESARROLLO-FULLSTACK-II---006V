/* Vistas nuevas de catálogo: Categorías, detalle de categoría y Ofertas. */
import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'

import { CLAVES } from '../../services/almacenamiento.js'
import { PRODUCTOS_PRUEBA } from '../../testing/datosPrueba.js'
import { instalarLocalStorageFalso } from '../../testing/localStorageFalso.js'
import { renderizarConProveedores } from '../../testing/renderizarConProveedores.jsx'
import PaginaCategorias from './PaginaCategorias.jsx'
import PaginaDetalleCategoria from './PaginaDetalleCategoria.jsx'
import PaginaOfertas from './PaginaOfertas.jsx'

const CATEGORIAS = [
  { id: 'notebooks', nombre: 'Notebooks', descripcion: 'Portátiles' },
  { id: 'accesorios', nombre: 'Accesorios', descripcion: '' },
  { id: 'vacia', nombre: 'Vacía', descripcion: '' },
]

function renderizarEn(ruta) {
  return renderizarConProveedores(
    <Routes>
      <Route path="/categorias" element={<PaginaCategorias />} />
      <Route path="/categorias/:idCategoria" element={<PaginaDetalleCategoria />} />
      <Route path="/ofertas" element={<PaginaOfertas />} />
    </Routes>,
    { ruta },
  )
}

describe('Vistas de catálogo nuevas', () => {
  beforeEach(() => {
    instalarLocalStorageFalso({
      [CLAVES.productos]: [
        ...PRODUCTOS_PRUEBA,
        { codigo: 'AC-2', nombre: 'Teclado Rebajado', idCategoria: 'accesorios', precio: 10000, precioOferta: 5000, stock: 4, stockCritico: 1 },
      ],
      [CLAVES.categorias]: CATEGORIAS,
    })
  })

  it('Categorías muestra una tarjeta por categoría con su cantidad de productos', () => {
    renderizarEn('/categorias')

    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(['Notebooks', 'Accesorios', 'Vacía'])
    expect(screen.getByText('2 productos')).toBeTruthy() // accesorios
    expect(screen.getByText('0 productos')).toBeTruthy() // vacía
  })

  it('el detalle de categoría lista solo sus productos y marca la categoría actual', () => {
    renderizarEn('/categorias/accesorios')

    expect(screen.getByRole('heading', { level: 1, name: 'Accesorios' })).toBeTruthy()
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['Mouse Oferta', 'Teclado Rebajado'])
    expect(screen.getByRole('link', { name: 'Accesorios' }).classList.contains('active')).toBeTrue()
  })

  it('una categoría sin productos lo dice, y una inexistente avisa', () => {
    const { unmount } = renderizarEn('/categorias/vacia')
    expect(screen.getByText('Esta categoría todavía no tiene productos.')).toBeTruthy()
    unmount()

    renderizarEn('/categorias/no-existe')
    expect(screen.getByRole('heading', { name: 'Categoría no encontrada' })).toBeTruthy()
  })

  it('Ofertas lista solo productos rebajados, del mayor al menor descuento', () => {
    renderizarEn('/ofertas')

    // Teclado: 50 %; Mouse: 25 %.
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['Teclado Rebajado', 'Mouse Oferta'])
  })
})
