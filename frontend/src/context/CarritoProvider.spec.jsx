import { act, renderHook } from '@testing-library/react'

import { useCarrito } from '../hooks/useCarrito.js'
import { CLAVES } from '../services/almacenamiento.js'
import { PRODUCTOS_PRUEBA } from '../testing/datosPrueba.js'
import { instalarLocalStorageFalso } from '../testing/localStorageFalso.js'
import { CarritoProvider } from './CarritoProvider.jsx'

const [NOTEBOOK, MOUSE_OFERTA, CAMARA_AGOTADA] = PRODUCTOS_PRUEBA

// renderHook ejecuta el hook dentro de un componente de prueba; "wrapper" lo
// envuelve en el Provider, igual que main.jsx envuelve a la app.
function usarCarrito() {
  return renderHook(() => useCarrito(), { wrapper: CarritoProvider })
}

describe('CarritoProvider (estado del carrito)', () => {
  let memoria

  beforeEach(() => {
    memoria = instalarLocalStorageFalso({ [CLAVES.productos]: PRODUCTOS_PRUEBA })
  })

  it('agrega productos, suma unidades al repetir y usa el precio de oferta', () => {
    const { result } = usarCarrito()

    // act(): avisa a React que se viene un cambio de estado y espera a que
    // termine de actualizar antes de revisar el resultado.
    act(() => result.current.agregarProducto(NOTEBOOK))
    act(() => result.current.agregarProducto(MOUSE_OFERTA, 2))
    act(() => result.current.agregarProducto(NOTEBOOK))

    expect(result.current.items.length).toBe(2)
    expect(result.current.cantidadUnidades).toBe(4)
    expect(result.current.items[1].precioUnitario).toBe(15000)
    expect(result.current.total).toBe(500000 * 2 + 15000 * 2)
  })

  it('no supera el stock disponible ni agrega productos agotados', () => {
    const { result } = usarCarrito()
    let resultado

    act(() => {
      resultado = result.current.agregarProducto(NOTEBOOK, 5)
    })
    expect(resultado).toBeFalse() // pidió 5, solo había 3
    expect(result.current.items[0].cantidad).toBe(3)

    act(() => {
      resultado = result.current.agregarProducto(CAMARA_AGOTADA)
    })
    expect(resultado).toBeFalse()
    expect(result.current.items.length).toBe(1)
  })

  it('limita la cantidad entre 1 y el stock, quita líneas y se vacía', () => {
    const { result } = usarCarrito()
    act(() => result.current.agregarProducto(MOUSE_OFERTA))
    act(() => result.current.agregarProducto(NOTEBOOK))

    act(() => result.current.cambiarCantidad('AC-1', 99))
    expect(result.current.items[0].cantidad).toBe(10)
    act(() => result.current.cambiarCantidad('AC-1', 0))
    expect(result.current.items[0].cantidad).toBe(1)

    act(() => result.current.quitarProducto('AC-1'))
    expect(result.current.items.map((i) => i.codigo)).toEqual(['NB-1'])

    act(() => result.current.vaciarCarrito())
    expect(result.current.items).toEqual([])
  })

  it('guarda el carrito en localStorage y lo recupera al volver a montarse', () => {
    const primero = usarCarrito()
    act(() => primero.result.current.agregarProducto(NOTEBOOK, 2))
    expect(JSON.parse(memoria[CLAVES.carrito])[0].cantidad).toBe(2)

    primero.unmount()
    const segundo = usarCarrito() // simula recargar la página
    expect(segundo.result.current.cantidadUnidades).toBe(2)
  })

  it('useCarrito avisa con un error claro si se usa fuera del Provider', () => {
    // React también registra el error en consola; el mock lo silencia.
    spyOn(console, 'error')
    expect(() => renderHook(() => useCarrito())).toThrowError(/dentro de <CarritoProvider>/)
  })
})
