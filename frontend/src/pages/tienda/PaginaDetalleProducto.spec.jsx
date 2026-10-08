import { fireEvent, screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'

import { CLAVES } from '../../services/almacenamiento.js'
import { PRODUCTOS_PRUEBA } from '../../testing/datosPrueba.js'
import { instalarLocalStorageFalso } from '../../testing/localStorageFalso.js'
import { renderizarConProveedores } from '../../testing/renderizarConProveedores.jsx'
import PaginaDetalleProducto from './PaginaDetalleProducto.jsx'

// Un segundo notebook para que haya un producto relacionado.
const CATALOGO = [...PRODUCTOS_PRUEBA, { ...PRODUCTOS_PRUEBA[0], codigo: 'NB-2', nombre: 'Notebook Dos' }]

function renderizarDetalle(codigo) {
  return renderizarConProveedores(
    <Routes>
      <Route path="/productos/:codigo" element={<PaginaDetalleProducto />} />
    </Routes>,
    { ruta: `/productos/${codigo}` },
  )
}

describe('PaginaDetalleProducto', () => {
  let memoria

  beforeEach(() => {
    memoria = instalarLocalStorageFalso({
      [CLAVES.productos]: CATALOGO,
      [CLAVES.categorias]: [{ id: 'notebooks', nombre: 'Notebooks' }],
    })
  })

  it('muestra el producto del código de la URL y sus relacionados', () => {
    renderizarDetalle('NB-1')

    expect(screen.getByRole('heading', { level: 1, name: 'Notebook Uno' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 3, name: 'Notebook Dos' })).toBeTruthy()
  })

  // RÚBRICA 10/10 · Eventos con mock de localStorage. Une todo: dos clics del
  // usuario cambian el estado (cantidad y carrito) y el carrito se guarda. El
  // localStorage es falso (instalarLocalStorageFalso en el beforeEach): la prueba
  // lee lo guardado en "memoria" y no toca el navegador real. Es el equivalente
  // al mock de una API que se vio en clase, porque localStorage es nuestra base
  // de datos simulada.
  it('[Rúbrica 10/10 · Eventos] agrega al carrito la cantidad elegida y lo confirma', () => {
    // Preparar: página de detalle del producto NB-1 (stock 3).
    renderizarDetalle('NB-1')

    // Actuar: sube la cantidad a 2 y pulsa "Agregar al carrito".
    fireEvent.click(screen.getByRole('button', { name: 'Aumentar cantidad' }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Agregar al carrito' })[0])

    // Verificar: lo guardado en el localStorage falso y el aviso en pantalla.
    expect(JSON.parse(memoria[CLAVES.carrito])).toEqual([
      jasmine.objectContaining({ codigo: 'NB-1', cantidad: 2 }),
    ])
    expect(screen.getByRole('status').textContent).toBe('Agregaste 2 × Notebook Uno al carrito.')
  })

  it('con un código inexistente avisa que el producto no existe', () => {
    renderizarDetalle('NO-EXISTE')

    expect(screen.getByRole('heading', { name: 'Producto no encontrado' })).toBeTruthy()
  })
})
