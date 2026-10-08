/**
 * Proceso de pago del checkout. Coordina dos servicios (productos y órdenes)
 * para que la compra sea consistente: o se paga y se descuenta el stock, o se
 * rechaza y el stock queda intacto.
 *
 * Sin backend no hay un banco que apruebe o rechace. El pago se rechaza por:
 * 1. Una causa REAL: algún producto ya no tiene stock suficiente (por ejemplo,
 *    el admin bajó el stock mientras el cliente tenía el carrito abierto).
 * 2. Una causa SIMULADA: el selector "Simulación del medio de pago" del
 *    checkout, que existe para poder mostrar ambos resultados a voluntad.
 * En la EP3, la causa simulada se reemplaza por la respuesta de la pasarela.
 */
import { crearOrden } from './ordenesService.js'
import { descontarStock, verificarStock } from './productosService.js'

/**
 * @param {object} datos
 * @param {object} datos.cliente - run (o null si es invitado), nombre, apellidos, correo.
 * @param {object} datos.direccion - calle, departamento, region, comuna, indicaciones.
 * @param {Array<{codigo: string, nombre: string, precioUnitario: number, cantidad: number}>} datos.items
 * @param {boolean} [datos.simularRechazo=false]
 * @returns {object} La orden creada, con estado 'pagada' o 'rechazada'.
 */
export function procesarCompra({ cliente, direccion, items, simularRechazo = false }) {
  // Se revisa el stock en el momento de pagar, no cuando se agregó al carrito:
  // entre ambos momentos el inventario pudo cambiar.
  const faltantes = verificarStock(items)

  let motivoRechazo = null
  if (faltantes.length > 0) motivoRechazo = { tipo: 'stock', faltantes }
  else if (simularRechazo) motivoRechazo = { tipo: 'simulado' }

  if (motivoRechazo) {
    // La orden rechazada también se registra: el admin la ve en Órdenes, y la
    // vista de error la usa para mostrar el detalle y reintentar el pago.
    return crearOrden({ cliente, direccion, items, estado: 'rechazada', motivoRechazo })
  }

  descontarStock(items)
  return crearOrden({ cliente, direccion, items, estado: 'pagada' })
}

/**
 * Texto para el cliente según el motivo guardado en la orden.
 *
 * @param {{tipo: string, faltantes?: object[]}|undefined} motivo - Las órdenes
 *   semilla no tienen motivo: se usa un mensaje genérico.
 * @returns {string}
 */
export function describirMotivoRechazo(motivo) {
  if (motivo?.tipo === 'stock') {
    const detalle = motivo.faltantes
      .map((linea) => `${linea.nombre} (pediste ${linea.solicitado}, quedan ${linea.disponible})`)
      .join('; ')
    return `No hay stock suficiente: ${detalle}. Ajusta tu carrito e inténtalo de nuevo.`
  }
  if (motivo?.tipo === 'simulado') {
    return 'El medio de pago rechazó la transacción (rechazo simulado para la demostración).'
  }
  return 'El medio de pago rechazó la transacción.'
}
