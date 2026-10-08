/**
 * Reglas de cálculo del negocio: precios, ofertas, totales y stock crítico.
 * Funciones puras (no leen ni guardan nada): reciben datos y devuelven un
 * resultado. Por eso las usan por igual la tienda, el admin y los datos semilla,
 * y se prueban sin preparar nada.
 */

/**
 * Indica si el producto tiene una oferta válida: un precio de oferta definido
 * y menor que el precio normal. Una "oferta" igual o mayor al precio no se muestra.
 *
 * @param {{precio: number, precioOferta?: number|null}} producto
 * @returns {boolean}
 */
export function estaEnOferta(producto) {
  return (
    typeof producto.precioOferta === 'number' &&
    producto.precioOferta >= 0 &&
    producto.precioOferta < producto.precio
  )
}

/**
 * Precio que paga el cliente hoy: el de oferta si hay una válida, si no el normal.
 *
 * @param {{precio: number, precioOferta?: number|null}} producto
 * @returns {number}
 */
export function precioVigente(producto) {
  return estaEnOferta(producto) ? producto.precioOferta : producto.precio
}

/**
 * Porcentaje de descuento redondeado al entero, para la etiqueta "-15%".
 *
 * @param {{precio: number, precioOferta?: number|null}} producto
 * @returns {number} 0 si no está en oferta.
 */
export function porcentajeDescuento(producto) {
  if (!estaEnOferta(producto) || producto.precio === 0) return 0
  return Math.round((1 - producto.precioOferta / producto.precio) * 100)
}

/**
 * Un producto está en stock crítico cuando su stock llegó al umbral o bajó de él.
 * Se usa <= y no <: con stock 4 y crítico 4 ya hay que reponer (caso de borde
 * visto en la clase del 28-09). Sin umbral definido, nunca es crítico.
 *
 * @param {{stock: number, stockCritico?: number|null}} producto
 * @returns {boolean}
 */
export function esStockCritico(producto) {
  if (producto.stockCritico === null || producto.stockCritico === undefined) return false
  return producto.stock <= producto.stockCritico
}

/**
 * @param {{precioUnitario: number, cantidad: number}} item - Línea de carrito u orden.
 * @returns {number}
 */
export function calcularSubtotal(item) {
  return item.precioUnitario * item.cantidad
}

/**
 * @param {Array<{precioUnitario: number, cantidad: number}>} items
 * @returns {number} Suma de los subtotales; 0 para una lista vacía.
 */
export function calcularTotal(items) {
  return items.reduce((total, item) => total + calcularSubtotal(item), 0)
}

/**
 * @param {Array<{cantidad: number}>} items
 * @returns {number} Unidades totales (lo que muestra el contador del carrito).
 */
export function contarUnidades(items) {
  return items.reduce((total, item) => total + item.cantidad, 0)
}
