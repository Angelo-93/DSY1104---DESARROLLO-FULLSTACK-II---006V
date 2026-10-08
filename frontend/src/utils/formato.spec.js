import { formatearFecha, formatearPrecio, formatearRun } from './formato.js'

describe('formato', () => {
  it('formatea precios en pesos chilenos con punto de miles y sin decimales', () => {
    expect(formatearPrecio(549990)).toBe('$549.990')
    expect(formatearPrecio(1190000)).toBe('$1.190.000')
    expect(formatearPrecio(0)).toBe('$0')
  })

  it('muestra una fecha sola sin correrla un día por la zona horaria', () => {
    expect(formatearFecha('2026-10-07')).toBe('07-10-2026')
    expect(formatearFecha('')).toBe('')
  })

  it('muestra una fecha con hora en la hora de Chile', () => {
    // 01:30 UTC del 6 de octubre = 22:30 del 5 de octubre en Chile (UTC-3).
    expect(formatearFecha('2026-10-06T01:30:00Z')).toBe('05-10-2026, 22:30')
  })

  it('agrega puntos y guion al RUN guardado sin formato', () => {
    expect(formatearRun('182345679')).toBe('18.234.567-9')
    expect(formatearRun('19011029k')).toBe('19.011.029-K')
  })
})
