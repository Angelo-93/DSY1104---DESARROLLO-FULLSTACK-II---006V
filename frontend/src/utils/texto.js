/**
 * Ayudantes para comparar y transformar texto escrito por personas.
 */

/**
 * Pasa a minúsculas y quita tildes, para comparar sin que importe cómo se
 * escribió: "Impresión", "impresion" e "IMPRESIÓN" quedan iguales.
 * normalize('NFD') separa cada letra de su tilde ("ó" → "o" + "´") y el
 * reemplazo borra esas tildes sueltas (rango Unicode \u0300-\u036f).
 *
 * @param {string} texto
 * @returns {string}
 */
export function normalizarTexto(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/**
 * Escribe una cantidad con la palabra en singular o plural según corresponda:
 * pluralizar(1, 'unidad', 'unidades') → "1 unidad"; con 3 → "3 unidades".
 * El plural se recibe completo porque en español no siempre basta con
 * agregar una "s" (unidad → unidades, orden → órdenes).
 *
 * @param {number} cantidad
 * @param {string} singular
 * @param {string} plural
 * @returns {string}
 */
export function pluralizar(cantidad, singular, plural) {
  return `${cantidad} ${cantidad === 1 ? singular : plural}`
}

/**
 * Convierte un nombre en un identificador apto para URL ("slug"):
 * "Audio y Videoconferencia" → "audio-y-videoconferencia".
 *
 * @param {string} texto
 * @returns {string}
 */
export function generarSlug(texto) {
  return normalizarTexto(texto)
    .replace(/[^a-z0-9]+/g, '-') // todo lo que no sea letra o número pasa a guion
    .replace(/^-+|-+$/g, '') // sin guiones al inicio ni al final
}
