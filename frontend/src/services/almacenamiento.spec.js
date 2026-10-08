import { instalarLocalStorageFalso } from '../testing/localStorageFalso.js'
import { CLAVES, guardarDato, leerDato, restablecerDatos } from './almacenamiento.js'

describe('almacenamiento (con localStorage simulado)', () => {
  it('la primera lectura guarda y devuelve una copia de los datos iniciales', () => {
    const memoria = instalarLocalStorageFalso()
    const iniciales = [{ id: 1 }]

    const leidos = leerDato(CLAVES.categorias, iniciales)

    expect(leidos).toEqual(iniciales)
    expect(leidos).not.toBe(iniciales) // copia: modificarla no altera la semilla
    expect(JSON.parse(memoria[CLAVES.categorias])).toEqual(iniciales)
  })

  it('si ya hay datos guardados, devuelve esos y no los iniciales', () => {
    instalarLocalStorageFalso({ [CLAVES.categorias]: [{ id: 'guardada' }] })

    expect(leerDato(CLAVES.categorias, [{ id: 'inicial' }])).toEqual([{ id: 'guardada' }])
  })

  it('si el JSON guardado está dañado, avisa y usa los datos iniciales', () => {
    const memoria = instalarLocalStorageFalso()
    memoria[CLAVES.productos] = '{esto no es json'
    spyOn(console, 'warn') // mock: evita ensuciar la consola y permite verificar el aviso

    expect(leerDato(CLAVES.productos, [])).toEqual([])
    expect(console.warn).toHaveBeenCalled()
  })

  it('restablecerDatos borra todas las claves de INFORCORE', () => {
    const memoria = instalarLocalStorageFalso()
    guardarDato(CLAVES.carrito, [{ codigo: 'X', cantidad: 1 }])
    guardarDato(CLAVES.sesion, { run: '1' })

    restablecerDatos()

    expect(Object.keys(memoria)).toEqual([])
    expect(localStorage.removeItem).toHaveBeenCalledTimes(Object.keys(CLAVES).length)
  })
})
