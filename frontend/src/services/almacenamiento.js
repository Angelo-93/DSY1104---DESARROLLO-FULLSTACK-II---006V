/**
 * Único punto del proyecto que lee y escribe localStorage.
 *
 * Por qué centralizarlo:
 * - Los servicios (productos, usuarios, órdenes...) no repiten JSON.parse ni
 *   JSON.stringify ni el manejo de errores.
 * - En las pruebas basta con reemplazar localStorage por un mock para controlar
 *   todos los datos de la aplicación.
 * - En la EP3, cuando exista el backend, los servicios cambiarán estas llamadas
 *   por peticiones a la API sin que los componentes se enteren.
 */

/** Claves de localStorage. Todas con el prefijo inforcore_ (regla del proyecto). */
export const CLAVES = {
  productos: 'inforcore_productos',
  categorias: 'inforcore_categorias',
  usuarios: 'inforcore_usuarios',
  ordenes: 'inforcore_ordenes',
  carrito: 'inforcore_carrito',
  sesion: 'inforcore_sesion',
}

/**
 * Copia profunda: quien recibe los datos puede modificarlos sin alterar por
 * accidente los arreglos semilla de src/data.
 */
function copiar(valor) {
  return structuredClone(valor)
}

/**
 * Lee un dato guardado. La primera vez (clave inexistente) guarda y devuelve
 * el valor inicial: así los datos semilla quedan en localStorage y desde ese
 * momento todos los cambios del admin persisten.
 *
 * @param {string} clave - Una de CLAVES.
 * @param {*} valorInicial - Lo que se usa si no hay nada guardado.
 * @returns {*} El dato guardado, o una copia del valor inicial.
 */
export function leerDato(clave, valorInicial) {
  try {
    const guardado = localStorage.getItem(clave)
    if (guardado === null) {
      guardarDato(clave, valorInicial)
      return copiar(valorInicial)
    }
    return JSON.parse(guardado)
  } catch (error) {
    // JSON dañado (alguien lo editó a mano en DevTools) o almacenamiento
    // bloqueado por el navegador: la tienda sigue funcionando con los datos
    // iniciales en vez de quedar en blanco.
    console.warn(`No se pudo leer "${clave}" de localStorage; se usan los datos iniciales.`, error)
    return copiar(valorInicial)
  }
}

/**
 * @param {string} clave - Una de CLAVES.
 * @param {*} valor - Cualquier dato que se pueda convertir a JSON.
 */
export function guardarDato(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor))
}

/** @param {string} clave - Una de CLAVES. */
export function eliminarDato(clave) {
  localStorage.removeItem(clave)
}

/**
 * Borra todos los datos de INFORCORE: en la próxima lectura cada servicio
 * vuelve a los datos semilla. Útil para dejar la tienda limpia antes de una
 * demostración.
 */
export function restablecerDatos() {
  Object.values(CLAVES).forEach(eliminarDato)
}
