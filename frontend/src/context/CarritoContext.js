import { createContext } from 'react'

/**
 * Canal por donde CarritoProvider comparte el carrito. Parte en null: si un
 * componente lo lee fuera del Provider, useCarrito lo detecta y avisa.
 */
export const CarritoContext = createContext(null)
