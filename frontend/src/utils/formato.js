/**
 * Formatos de presentación para Chile: precios en pesos, fechas y RUN.
 * Solo cambian cómo se MUESTRA un dato; lo que se guarda sigue siendo el número,
 * la fecha ISO o el RUN sin puntos ni guion.
 */

// Se crean una sola vez: Intl.NumberFormat y DateTimeFormat son costosos de
// construir y aquí se reutilizan en cada producto de cada lista.
const FORMATO_PESOS = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

// Una fecha sola ("2026-10-07") JavaScript la interpreta como medianoche UTC; en
// Chile (UTC-3/-4) eso todavía es el día anterior. Por eso se formatea en UTC
// (aprendizaje de la Formativa 2).
const FORMATO_FECHA_SOLA = new Intl.DateTimeFormat('es-CL', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
})

// Una fecha con hora (las órdenes) sí es un instante exacto: se muestra en la
// hora de Chile sin importar la zona horaria del computador que abre la página.
const FORMATO_FECHA_HORA = new Intl.DateTimeFormat('es-CL', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'America/Santiago',
})

/**
 * @param {number} monto - Pesos chilenos (entero).
 * @returns {string} Ej: 549990 → "$549.990".
 */
export function formatearPrecio(monto) {
  return FORMATO_PESOS.format(monto)
}

/**
 * @param {string} fechaIso - "AAAA-MM-DD" o una fecha con hora en formato ISO.
 * @returns {string} "DD-MM-AAAA" o "DD-MM-AAAA, HH:MM"; '' si no hay fecha.
 */
export function formatearFecha(fechaIso) {
  if (!fechaIso) return ''
  const esFechaSola = /^\d{4}-\d{2}-\d{2}$/.test(fechaIso)
  const formato = esFechaSola ? FORMATO_FECHA_SOLA : FORMATO_FECHA_HORA
  return formato.format(new Date(fechaIso))
}

/**
 * @param {string} run - Sin puntos ni guion, como se guarda (ej: "182345679").
 * @returns {string} Con puntos y guion para leerlo (ej: "18.234.567-9").
 */
export function formatearRun(run) {
  const limpio = String(run ?? '').trim().toUpperCase()
  if (limpio.length < 2) return limpio
  const cuerpo = limpio.slice(0, -1)
  const dv = limpio.slice(-1)
  // Inserta un punto cada tres dígitos contando desde la derecha.
  const cuerpoConPuntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${cuerpoConPuntos}-${dv}`
}
