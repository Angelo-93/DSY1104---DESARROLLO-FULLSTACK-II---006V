import {
  calcularSubtotal,
  calcularTotal,
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
})
