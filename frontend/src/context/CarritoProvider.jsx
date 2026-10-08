/**
 * Estado global del carrito de compras.
 *
 * Por qué Context y no props: el carrito lo usan el menú (contador), el detalle
 * de producto (agregar), la vista Carrito y el Checkout, que están en ramas
 * distintas del árbol de componentes. Con props habría que pasarlo por cada
 * plantilla intermedia aunque no lo use ("prop drilling"). El Provider lo deja
 * disponible para cualquier componente que esté dentro de él.
 *
 * Context viene incluido en React (no es una librería aparte). Se reparte en
 * tres archivos porque la recarga en caliente de Vite (Fast Refresh) exige que
 * un archivo .jsx exporte solo componentes:
 * - CarritoContext.js: crea el contexto (el "canal" por donde viaja el dato).
 * - CarritoProvider.jsx: el componente que guarda el estado y lo publica.
 * - hooks/useCarrito.js: la forma de leerlo desde cualquier componente.
 */
import { useEffect, useState } from 'react'

import { CLAVES, guardarDato, leerDato } from '../services/almacenamiento.js'
import { obtenerProducto } from '../services/productosService.js'
import { calcularTotal, contarUnidades, precioVigente } from '../utils/calculos.js'
import { CarritoContext } from './CarritoContext.js'

// Stock actual del producto según el catálogo (puede haber cambiado desde que
// se agregó al carrito). Si el admin lo eliminó, queda en 0.
function stockDisponible(codigo) {
  return obtenerProducto(codigo)?.stock ?? 0
}

/**
 * Envuelve la aplicación (en main.jsx) y comparte el carrito con todos sus hijos.
 *
 * Cada línea guarda nombre y precio del momento en que se agregó, igual que
 * una orden; el checkout vuelve a verificar el stock antes de pagar.
 *
 * @param {{children: React.ReactNode}} props
 */
export function CarritoProvider({ children }) {
  // La función dentro de useState solo se ejecuta en el primer render: así no
  // se lee localStorage cada vez que el carrito cambia.
  const [items, setItems] = useState(() => leerDato(CLAVES.carrito, []))

  // Cada vez que cambian los items, se guardan. useEffect corre después de que
  // React actualizó la pantalla, así guardar no retrasa lo que ve el cliente.
  useEffect(() => {
    guardarDato(CLAVES.carrito, items)
  }, [items])

  /**
   * Agrega unidades de un producto, sin pasar del stock disponible.
   *
   * @param {object} producto - Producto del catálogo.
   * @param {number} [cantidad=1]
   * @returns {boolean} false si no se pudo agregar todo por falta de stock.
   */
  function agregarProducto(producto, cantidad = 1) {
    const existente = items.find((item) => item.codigo === producto.codigo)
    const cantidadActual = existente?.cantidad ?? 0
    const maximo = stockDisponible(producto.codigo)
    const nuevaCantidad = Math.min(cantidadActual + cantidad, maximo)

    if (nuevaCantidad <= cantidadActual) return false

    if (existente) {
      setItems(items.map((item) => (item.codigo === producto.codigo ? { ...item, cantidad: nuevaCantidad } : item)))
    } else {
      setItems([
        ...items,
        {
          codigo: producto.codigo,
          nombre: producto.nombre,
          precioUnitario: precioVigente(producto),
          cantidad: nuevaCantidad,
        },
      ])
    }
    return nuevaCantidad === cantidadActual + cantidad
  }

  /**
   * Fija la cantidad de una línea entre 1 y el stock disponible. Para sacar la
   * línea se usa quitarProducto: así un "0" escrito por error no borra nada.
   *
   * @param {string} codigo
   * @param {number} cantidad
   */
  function cambiarCantidad(codigo, cantidad) {
    const limitada = Math.max(1, Math.min(Math.floor(cantidad), stockDisponible(codigo)))
    setItems(items.map((item) => (item.codigo === codigo ? { ...item, cantidad: limitada } : item)))
  }

  /** @param {string} codigo */
  function quitarProducto(codigo) {
    setItems(items.filter((item) => item.codigo !== codigo))
  }

  function vaciarCarrito() {
    setItems([])
  }

  const valor = {
    items,
    total: calcularTotal(items),
    cantidadUnidades: contarUnidades(items),
    agregarProducto,
    cambiarCantidad,
    quitarProducto,
    vaciarCarrito,
  }

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>
}
