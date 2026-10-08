import { instalarLocalStorageFalso } from '../testing/localStorageFalso.js'
import { CLAVES } from './almacenamiento.js'
import { crearOrden, listarOrdenes, listarOrdenesPorCorreo, obtenerOrden } from './ordenesService.js'

const CLIENTE = { run: null, nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com' }

describe('ordenesService (con localStorage simulado)', () => {
  beforeEach(() => {
    instalarLocalStorageFalso({
      [CLAVES.ordenes]: [
        { numero: 1001, cliente: { correo: 'ana@gmail.com' }, items: [], total: 0 },
        { numero: 1002, cliente: { correo: 'otro@duoc.cl' }, items: [], total: 0 },
      ],
    })
  })

  it('lista de la más reciente a la más antigua y busca por número aunque llegue como texto', () => {
    expect(listarOrdenes().map((o) => o.numero)).toEqual([1002, 1001])
    expect(obtenerOrden('1001').numero).toBe(1001)
    expect(obtenerOrden(9999)).toBeNull()
  })

  it('crea la orden con el número siguiente, la fecha actual y el total calculado', () => {
    // Mock del reloj: la fecha de la orden queda fija y la prueba es repetible.
    jasmine.clock().install()
    jasmine.clock().mockDate(new Date('2026-10-07T15:00:00Z'))

    const orden = crearOrden({
      cliente: CLIENTE,
      direccion: { calle: 'X' },
      estado: 'pagada',
      items: [{ codigo: 'A', nombre: 'A', precioUnitario: 1000, cantidad: 3 }],
    })
    jasmine.clock().uninstall()

    expect(orden.numero).toBe(1003)
    expect(orden.fecha).toBe('2026-10-07T15:00:00.000Z')
    expect(orden.total).toBe(3000)
    expect(listarOrdenesPorCorreo('ANA@gmail.com').map((o) => o.numero)).toEqual([1003, 1001])
  })
})
