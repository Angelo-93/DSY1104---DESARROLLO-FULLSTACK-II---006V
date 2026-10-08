import { generarSlug, normalizarTexto } from './texto.js'

describe('texto', () => {
  it('normaliza sin mayúsculas, tildes ni espacios en los extremos', () => {
    expect(normalizarTexto('  IMPRESIÓN ')).toBe('impresion')
    expect(normalizarTexto('Ñuñoa')).toBe('nunoa')
  })

  it('genera un slug apto para URL a partir de un nombre', () => {
    expect(generarSlug('Audio y Videoconferencia')).toBe('audio-y-videoconferencia')
    expect(generarSlug('  Redes & Wi-Fi!! ')).toBe('redes-wi-fi')
  })
})
