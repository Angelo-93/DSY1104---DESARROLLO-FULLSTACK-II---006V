import { useContext } from 'react'

import { CarritoContext } from '../context/CarritoContext.js'
import { listarProductos } from '../services/productosService.js'
import { actualizarLinea, calcularTotal, contarUnidades } from '../utils/calculos.js'

/**
 * Hook para leer el carrito desde cualquier componente dentro de <CarritoProvider>.
 *
 * El Provider guarda solo qué productos y cuántos. El precio, el nombre y los
 * totales se calculan aquí, con el catálogo del momento: cada página que usa
 * el hook se vuelve a dibujar al navegar, así que si el admin cambió un precio
 * u oferta, el carrito muestra el valor nuevo (el mismo que se cobra al pagar).
 *
 * @returns {{items: object[], total: number, cantidadUnidades: number,
 *   agregarProducto: Function, cambiarCantidad: Function,
 *   quitarProducto: Function, vaciarCarrito: Function}}
 * @throws {Error} Si se usa fuera de <CarritoProvider>: falla con un mensaje
 *   claro en vez de un "cannot read properties of null" difícil de rastrear.
 */
export function useCarrito() {
  const contexto = useContext(CarritoContext)
  if (!contexto) throw new Error('useCarrito debe usarse dentro de <CarritoProvider>.')

  const catalogo = listarProductos()
  const items = contexto.items.map((item) => actualizarLinea(item, catalogo.find((p) => p.codigo === item.codigo)))
  return { ...contexto, items, total: calcularTotal(items), cantidadUnidades: contarUnidades(items) }
}
