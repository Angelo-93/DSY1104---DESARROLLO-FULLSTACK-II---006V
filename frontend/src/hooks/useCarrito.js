import { useContext } from 'react'

import { CarritoContext } from '../context/CarritoContext.js'

/**
 * Hook para leer el carrito desde cualquier componente dentro de <CarritoProvider>.
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
  return contexto
}
