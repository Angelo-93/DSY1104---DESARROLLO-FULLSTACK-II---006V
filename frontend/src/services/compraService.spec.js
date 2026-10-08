import { instalarLocalStorageFalso } from '../testing/localStorageFalso.js'
import { CLAVES } from './almacenamiento.js'
import { describirMotivoRechazo, procesarCompra } from './compraService.js'

const CLIENTE = { run: null, nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com' }
const DIRECCION = { calle: 'Av. Siempre Viva 1', departamento: '', region: 'R', comuna: 'C', indicaciones: '' }

describe('compraService (con localStorage simulado)', () => {
  let memoria

  beforeEach(() => {
    memoria = instalarLocalStorageFalso({
      [CLAVES.productos]: [
        { codigo: 'AAA', nombre: 'Monitor', precio: 100, stock: 5 },
        { codigo: 'BBB', nombre: 'Mouse', precio: 10, stock: 1 },
      ],
      [CLAVES.ordenes]: [],
    })
  })

  function stockGuardado(codigo) {
    return JSON.parse(memoria[CLAVES.productos]).find((p) => p.codigo === codigo).stock
  }

  it('aprueba el pago: crea la orden pagada y descuenta el stock', () => {
    const orden = procesarCompra({
      cliente: CLIENTE,
      direccion: DIRECCION,
      items: [{ codigo: 'AAA', nombre: 'Monitor', precioUnitario: 100, cantidad: 2 }],
    })

    expect(orden.estado).toBe('pagada')
    expect(orden.total).toBe(200)
    expect(stockGuardado('AAA')).toBe(3)
  })

  it('con rechazo simulado registra la orden rechazada sin tocar el stock', () => {
    const orden = procesarCompra({
      cliente: CLIENTE,
      direccion: DIRECCION,
      items: [{ codigo: 'AAA', nombre: 'Monitor', precioUnitario: 100, cantidad: 2 }],
      simularRechazo: true,
    })

    expect(orden.estado).toBe('rechazada')
    expect(orden.motivoRechazo).toEqual({ tipo: 'simulado' })
    expect(stockGuardado('AAA')).toBe(5)
  })

  it('rechaza si el stock ya no alcanza, aunque la simulación diga aprobar', () => {
    const orden = procesarCompra({
      cliente: CLIENTE,
      direccion: DIRECCION,
      items: [{ codigo: 'BBB', nombre: 'Mouse', precioUnitario: 10, cantidad: 2 }],
    })

    expect(orden.estado).toBe('rechazada')
    expect(orden.motivoRechazo.tipo).toBe('stock')
    expect(describirMotivoRechazo(orden.motivoRechazo)).toContain('Mouse (pediste 2, quedan 1)')
    expect(stockGuardado('BBB')).toBe(1)
  })

  it('describe con un mensaje genérico las órdenes sin motivo guardado', () => {
    expect(describirMotivoRechazo(undefined)).toBe('El medio de pago rechazó la transacción.')
    expect(describirMotivoRechazo({ tipo: 'simulado' })).toContain('simulado')
  })
})
