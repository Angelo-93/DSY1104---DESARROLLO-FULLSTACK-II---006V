import { fireEvent, screen } from '@testing-library/react'

import { CLAVES } from '../../services/almacenamiento.js'
import { PRODUCTOS_PRUEBA } from '../../testing/datosPrueba.js'
import { instalarLocalStorageFalso } from '../../testing/localStorageFalso.js'
import { renderizarConProveedores } from '../../testing/renderizarConProveedores.jsx'
import PaginaInicio from './PaginaInicio.jsx'

describe('PaginaInicio', () => {
  let memoria

  beforeEach(() => {
    memoria = instalarLocalStorageFalso({ [CLAVES.productos]: PRODUCTOS_PRUEBA })
    renderizarConProveedores(<PaginaInicio />)
  })

  it('muestra la portada de la EP1 y las secciones informativas', () => {
    expect(screen.getByRole('heading', { level: 1, name: 'Tu núcleo informático' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Sectores que atendemos' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Por qué elegir INFORCORE' })).toBeTruthy()
  })

  it('lista en "Ofertas vigentes" solo los productos en oferta', () => {
    const seccionOfertas = screen.getByRole('heading', { name: 'Ofertas vigentes' }).closest('section')

    expect(seccionOfertas.querySelectorAll('h3').length).toBe(1)
    expect(seccionOfertas.textContent).toContain('Mouse Oferta')
  })

  it('agrega al carrito desde una tarjeta', () => {
    fireEvent.click(screen.getAllByRole('button', { name: 'Agregar Mouse Oferta al carrito' })[0])

    expect(JSON.parse(memoria[CLAVES.carrito])[0].codigo).toBe('AC-1')
  })
})
