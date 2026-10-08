import Table from 'react-bootstrap/Table'

import { calcularSubtotal } from '../../utils/calculos.js'
import { formatearPrecio } from '../../utils/formato.js'
import ImagenProducto from '../atoms/ImagenProducto.jsx'
import SelectorCantidad from '../molecules/SelectorCantidad.jsx'

/**
 * Tabla de líneas de compra (Figuras 5 a 8 del Anexo). Un solo componente con
 * dos modos según la prop "editable":
 * - true (Carrito): cantidad con botones − y +, y botón Eliminar.
 * - false (Checkout, boletas y admin): todo en solo lectura.
 * Así la misma tabla se escribe una vez y se usa en cinco vistas.
 *
 * @param {object} props
 * @param {Array<{codigo: string, nombre: string, idCategoria?: string,
 *   precioUnitario: number, cantidad: number}>} props.items
 * @param {boolean} [props.editable=false]
 * @param {Object<string, number>} [props.stockPorCodigo] - Solo editable: stock
 *   actual de cada producto, que es el tope de su cantidad.
 * @param {(codigo: string, cantidad: number) => void} [props.onCambiarCantidad]
 * @param {(codigo: string) => void} [props.onQuitar]
 */
function TablaCarrito({ items, editable = false, stockPorCodigo = {}, onCambiarCantidad, onQuitar }) {
  return (
    // En celular (bajo 768 px) cada fila se reacomoda como un bloque apilado
    // con CSS Grid (ver "tabla-carrito" en inforcore.css): así no hay que
    // desplazar la tabla hacia el lado para ver el subtotal o el botón Eliminar.
    <Table className="align-middle mb-0 tabla-carrito">
      <thead>
        <tr>
          <th scope="col">
            <span className="visually-hidden">Imagen</span>
          </th>
          <th scope="col">Producto</th>
          <th scope="col" className="text-end">Precio</th>
          <th scope="col" className="text-center">Cantidad</th>
          <th scope="col" className="text-end">Subtotal</th>
          {editable && (
            <th scope="col">
              <span className="visually-hidden">Acciones</span>
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          const stock = stockPorCodigo[item.codigo]
          const excedeStock = editable && stock !== undefined && item.cantidad > stock

          return (
            <tr key={item.codigo}>
              <td className="tabla-carrito__imagen">
                <ImagenProducto idCategoria={item.idCategoria} nombre={item.nombre} className="rounded border" />
              </td>
              <td className="tabla-carrito__nombre">
                {item.nombre}
                {/* Renderizado condicional: el aviso aparece solo si el stock
                    bajó después de agregar el producto al carrito. */}
                {excedeStock && (
                  <p className="small text-danger mb-0" role="alert">
                    {stock === 0 ? 'Sin stock: quítalo del carrito.' : `Solo quedan ${stock} unidades.`}
                  </p>
                )}
              </td>
              {/* data-etiqueta: en celular, el CSS la muestra antes del valor
                  ("Precio: $19.990"), porque ahí no se ve el encabezado. */}
              <td className="text-end text-nowrap tabla-carrito__precio" data-etiqueta="Precio: ">
                {formatearPrecio(item.precioUnitario)}
              </td>
              <td className="text-center tabla-carrito__cantidad" data-etiqueta={editable ? undefined : 'Cantidad: '}>
                {editable ? (
                  <SelectorCantidad
                    valor={item.cantidad}
                    maximo={stock ?? item.cantidad}
                    onCambiar={(cantidad) => onCambiarCantidad(item.codigo, cantidad)}
                    etiqueta={`Cantidad de ${item.nombre}`}
                  />
                ) : (
                  item.cantidad
                )}
              </td>
              <td className="text-end text-nowrap tabla-carrito__subtotal">{formatearPrecio(calcularSubtotal(item))}</td>
              {editable && (
                <td className="text-end tabla-carrito__acciones">
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => onQuitar(item.codigo)}
                    aria-label={`Quitar ${item.nombre} del carrito`}
                  >
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default TablaCarrito
