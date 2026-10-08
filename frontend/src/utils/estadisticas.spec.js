import { resumirInventario, resumirUsuarios, resumirVentas } from './estadisticas.js'

describe('estadisticas', () => {
  it('cuenta como venta solo las órdenes pagadas', () => {
    const resumen = resumirVentas([
      { estado: 'pagada', total: 1000 },
      { estado: 'rechazada', total: 5000 },
      { estado: 'pagada', total: 250 },
    ])

    expect(resumen).toEqual({ pagadas: 2, rechazadas: 1, montoVendido: 1250 })
  })

  it('resume el inventario: unidades, críticos (incluido el límite exacto) y agotados', () => {
    const resumen = resumirInventario([
      { stock: 10, stockCritico: 2 },
      { stock: 4, stockCritico: 4 }, // crítico justo en el límite
      { stock: 0, stockCritico: 3 }, // agotado y crítico
      { stock: 0, stockCritico: null }, // agotado, sin umbral: no es crítico
    ])

    expect(resumen).toEqual({ productos: 4, unidades: 14, criticos: 2, agotados: 2 })
  })

  it('separa clientes del personal de la tienda', () => {
    const resumen = resumirUsuarios([{ tipoUsuario: 'Administrador' }, { tipoUsuario: 'Vendedor' }, { tipoUsuario: 'Cliente' }])

    expect(resumen).toEqual({ usuarios: 3, clientes: 1, personal: 2 })
  })

  it('con listas vacías devuelve ceros', () => {
    expect(resumirVentas([]).montoVendido).toBe(0)
    expect(resumirInventario([]).unidades).toBe(0)
  })
})
