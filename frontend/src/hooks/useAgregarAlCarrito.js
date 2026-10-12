import { useState } from 'react'

import { useCarrito } from './useCarrito.js'

/**
 * Agrega al carrito y prepara el mensaje que confirma al cliente qué pasó.
 * Lo comparten todas las páginas con botón "Agregar al carrito", para que el
 * mensaje sea el mismo en todas.
 *
 * @returns {{agregar: (producto: object, cantidad?: number) => void,
 *   aviso: {tipo: 'exito'|'advertencia', texto: string}|null,
 *   cerrarAviso: () => void}}
 */
export function useAgregarAlCarrito() {
  const { agregarProducto } = useCarrito()
  const [aviso, setAviso] = useState(null)

  function agregar(producto, cantidad = 1) {
    const agregadas = agregarProducto(producto, cantidad)
    if (agregadas === cantidad) {
      setAviso({ tipo: 'exito', texto: `Agregaste ${cantidad} × ${producto.nombre} al carrito.` })
    } else if (agregadas > 0) {
      // Agregado parcial: se dice cuántas entraron para que no parezca que no pasó nada.
      setAviso({ tipo: 'advertencia', texto: `Solo pudimos agregar ${agregadas} de ${cantidad} × ${producto.nombre}: tu carrito ya tiene todo el stock disponible.` })
    } else {
      setAviso({ tipo: 'advertencia', texto: `No hay más stock de ${producto.nombre}: tu carrito ya tiene el máximo disponible.` })
    }
  }

  return { agregar, aviso, cerrarAviso: () => setAviso(null) }
}
