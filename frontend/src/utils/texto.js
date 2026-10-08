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
