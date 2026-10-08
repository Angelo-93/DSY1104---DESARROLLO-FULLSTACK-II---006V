/**
 * Mock de localStorage para las pruebas.
 *
 * Reemplaza getItem, setItem y removeItem por versiones que guardan en un objeto
 * en memoria. Así cada prueba:
 * - parte desde un estado conocido (el que le pasemos),
 * - no ensucia el localStorage real del navegador donde corre Karma,
 * - puede revisar exactamente qué se guardó.
 *
 * Se espía Storage.prototype y no el objeto localStorage: en el navegador,
 * escribir localStorage.getItem = ... no reemplaza el método, sino que guarda un
 * dato llamado "getItem".
 *
 * Jasmine deshace los spyOn al terminar cada prueba, así que no hay que limpiar nada.
 * Debe llamarse dentro de un beforeEach o un it.
 *
 * @param {Object<string, *>} [datosIniciales] - { clave: valor } ya guardados
 *   antes de la prueba. Los valores se convierten a JSON como haría la app.
 * @returns {Object<string, string>} La "memoria" del mock, para inspeccionarla.
 */
export function instalarLocalStorageFalso(datosIniciales = {}) {
  const memoria = {}
  Object.entries(datosIniciales).forEach(([clave, valor]) => {
    memoria[clave] = JSON.stringify(valor)
  })

  spyOn(Storage.prototype, 'getItem').and.callFake((clave) => (clave in memoria ? memoria[clave] : null))
  spyOn(Storage.prototype, 'setItem').and.callFake((clave, valor) => {
    memoria[clave] = String(valor)
  })
  spyOn(Storage.prototype, 'removeItem').and.callFake((clave) => {
    delete memoria[clave]
  })

  return memoria
}
