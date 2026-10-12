import {
  actualizarLinea,
  calcularSubtotal,
  calcularTotal,
  contarPorCategoria,
  contarUnidades,
  esStockCritico,
  estaEnOferta,
  porcentajeDescuento,
  precioVigente,
} from './calculos.js'

describe('calculos', () => {
  describe('ofertas', () => {
    it('usa el precio de oferta solo cuando es menor que el precio normal', () => {
      expect(precioVigente({ precio: 100, precioOferta: 80 })).toBe(80)
      expect(precioVigente({ precio: 100, precioOferta: null })).toBe(100)
      // Una "oferta" igual al precio no es oferta (caso de borde).
      expect(estaEnOferta({ precio: 100, precioOferta: 100 })).toBeFalse()
    })

    it('calcula el porcentaje de descuento redondeado', () => {
      expect(porcentajeDescuento({ precio: 399990, precioOferta: 349990 })).toBe(13)
      expect(porcentajeDescuento({ precio: 100, precioOferta: null })).toBe(0)
    })
  })

  describe('stock crítico', () => {
    it('considera crítico el stock igual al umbral y no el que está sobre él', () => {
      expect(esStockCritico({ stock: 4, stockCritico: 4 })).toBeTrue() // límite exacto
      expect(esStockCritico({ stock: 2, stockCritico: 3 })).toBeTrue()
      expect(esStockCritico({ stock: 5, stockCritico: 4 })).toBeFalse()
    })

    it('nunca marca como crítico un producto sin umbral definido', () => {
      expect(esStockCritico({ stock: 0, stockCritico: null })).toBeFalse()
    })
  })

  describe('totales', () => {
    const items = [
      { precioUnitario: 479990, cantidad: 3 },
      { precioUnitario: 189990, cantidad: 3 },
    ]

    it('suma los subtotales de cada línea y las unidades', () => {
      expect(calcularSubtotal(items[0])).toBe(1439970)
      expect(calcularTotal(items)).toBe(2009940)
      expect(contarUnidades(items)).toBe(6)
    })

    it('devuelve 0 para un carrito vacío', () => {
      expect(calcularTotal([])).toBe(0)
      expect(contarUnidades([])).toBe(0)
    })
  })

  describe('carrito y catálogo', () => {
    it('pone al día nombre y precio de una línea con el producto del catálogo', () => {
      const linea = { codigo: 'A', nombre: 'Viejo', precioUnitario: 100, cantidad: 2 }
      const producto = { codigo: 'A', nombre: 'Nuevo', idCategoria: 'x', precio: 200, precioOferta: 150 }

      expect(actualizarLinea(linea, producto)).toEqual({ codigo: 'A', nombre: 'Nuevo', idCategoria: 'x', precioUnitario: 150, cantidad: 2 })
      expect(actualizarLinea(linea, null)).toBe(linea) // producto eliminado: queda igual
    })

    it('cuenta productos por categoría, incluso con un id como "constructor"', () => {
      const conteo = contarPorCategoria([{ idCategoria: 'a' }, { idCategoria: 'a' }, { idCategoria: 'constructor' }])

      expect(conteo.a).toBe(2)
      expect(conteo.constructor).toBe(1)
      expect(conteo.toString).toBeUndefined() // sin propiedades heredadas
    })
  })
})
