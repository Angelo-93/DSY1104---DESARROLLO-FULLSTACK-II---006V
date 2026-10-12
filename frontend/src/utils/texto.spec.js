import { generarSlug, normalizarTexto, pluralizar } from './texto.js'

describe('texto', () => {
  it('normaliza sin mayúsculas, tildes ni espacios en los extremos', () => {
    expect(normalizarTexto('  IMPRESIÓN ')).toBe('impresion')
    expect(normalizarTexto('Ñuñoa')).toBe('nunoa')
  })

  it('escribe la cantidad en singular solo cuando es 1', () => {
    expect(pluralizar(1, 'unidad', 'unidades')).toBe('1 unidad')
    expect(pluralizar(0, 'unidad', 'unidades')).toBe('0 unidades')
    expect(pluralizar(3, 'orden', 'órdenes')).toBe('3 órdenes')
  })

  it('genera un slug apto para URL a partir de un nombre', () => {
    expect(generarSlug('Audio y Videoconferencia')).toBe('audio-y-videoconferencia')
    expect(generarSlug('  Redes & Wi-Fi!! ')).toBe('redes-wi-fi')
  })
})
