import {
  productosMasVendidos,
  resumirInventario,
  resumirUsuarios,
  resumirVentas,
  ventasPorCategoria,
  ventasPorMes,
} from './estadisticas.js'

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

  describe('reportes', () => {
    const linea = (codigo, idCategoria, precioUnitario, cantidad) => ({ codigo, nombre: codigo, idCategoria, precioUnitario, cantidad })
    const ORDENES = [
      { estado: 'pagada', fecha: '2026-08-10T15:00:00-04:00', total: 300, items: [linea('A', 'notebooks', 100, 3)] },
      // 31 de agosto a las 23:30 en Chile = 1 de septiembre en UTC: debe contar en agosto.
      { estado: 'pagada', fecha: '2026-09-01T03:30:00Z', total: 50, items: [linea('B', 'monitores', 50, 1)] },
      { estado: 'pagada', fecha: '2026-10-05T12:00:00-03:00', total: 200, items: [linea('B', 'monitores', 50, 4)] },
      { estado: 'rechazada', fecha: '2026-10-06T12:00:00-03:00', total: 9999, items: [linea('C', 'notebooks', 9999, 1)] },
    ]

    it('agrupa por mes en hora de Chile y completa los meses sin ventas con 0', () => {
      expect(ventasPorMes(ORDENES)).toEqual([
        { etiqueta: 'Ago 2026', total: 350, ordenes: 2 },
        { etiqueta: 'Sep 2026', total: 0, ordenes: 0 },
        { etiqueta: 'Oct 2026', total: 200, ordenes: 1 },
      ])
      expect(ventasPorMes([])).toEqual([])
    })

    it('suma por categoría desde las líneas, sin contar las órdenes rechazadas', () => {
      expect(ventasPorCategoria(ORDENES, { notebooks: 'Notebooks' })).toEqual([
        { nombre: 'Notebooks', total: 300, unidades: 3 },
        { nombre: 'Sin categoría', total: 250, unidades: 5 }, // "monitores" no está en el diccionario
      ])
    })

    it('ordena los productos por unidades vendidas y respeta el límite', () => {
      expect(productosMasVendidos(ORDENES).map((p) => [p.codigo, p.unidades])).toEqual([['B', 5], ['A', 3]])
      expect(productosMasVendidos(ORDENES, 1).length).toBe(1)
    })
  })
})
