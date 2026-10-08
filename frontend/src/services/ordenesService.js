/**
 * Órdenes de compra (boletas). Las crea el checkout y las lee el admin
 * (órdenes, boleta, reportes) y el historial de compras de cada usuario.
 *
 * No hay "editar" ni "eliminar" a propósito: una boleta emitida es un registro
 * contable y no se modifica.
 */
import { ORDENES_INICIALES } from '../data/ordenesIniciales.js'
import { calcularTotal } from '../utils/calculos.js'
import { CLAVES, guardarDato, leerDato } from './almacenamiento.js'

const PRIMER_NUMERO = 1001

function leerOrdenes() {
  return leerDato(CLAVES.ordenes, ORDENES_INICIALES)
}

/** @returns {object[]} Todas las órdenes, de la más reciente a la más antigua. */
export function listarOrdenes() {
  return leerOrdenes().sort((a, b) => b.numero - a.numero)
}

/**
 * @param {number|string} numero - Puede llegar como texto desde la URL (/admin/ordenes/1004).
 * @returns {object|null}
 */
export function obtenerOrden(numero) {
  return leerOrdenes().find((orden) => orden.numero === Number(numero)) ?? null
}

/**
 * Historial de compras de una persona. Se busca por correo y no por RUN porque
 * también incluye las compras que hizo como invitado, antes de crear su cuenta.
 *
 * @param {string} correo
 * @returns {object[]} Sus órdenes, de la más reciente a la más antigua.
 */
export function listarOrdenesPorCorreo(correo) {
  const buscado = String(correo ?? '').trim().toLowerCase()
  return listarOrdenes().filter((orden) => orden.cliente.correo.toLowerCase() === buscado)
}

/**
 * Registra una orden nueva. El número, la fecha y el total los calcula el
 * servicio (no el formulario), para que no se puedan alterar desde la interfaz.
 *
 * @param {object} datos
 * @param {{run: string|null, nombre: string, apellidos: string, correo: string}} datos.cliente
 * @param {object} datos.direccion - calle, departamento, region, comuna, indicaciones.
 * @param {Array<{codigo: string, nombre: string, precioUnitario: number, cantidad: number}>} datos.items
 * @param {'pagada'|'rechazada'} datos.estado
 * @param {{tipo: 'stock'|'simulado', faltantes?: object[]}} [datos.motivoRechazo]
 *   Solo en órdenes rechazadas: por qué falló el pago (lo muestra la vista de error).
 * @returns {object} La orden guardada.
 */
export function crearOrden({ cliente, direccion, items, estado, motivoRechazo }) {
  const ordenes = leerOrdenes()
  const ultimoNumero = ordenes.reduce((mayor, orden) => Math.max(mayor, orden.numero), PRIMER_NUMERO - 1)

  const nueva = {
    numero: ultimoNumero + 1,
    fecha: new Date().toISOString(),
    estado,
    cliente,
    direccion,
    items,
    total: calcularTotal(items),
  }
  // Se agrega solo si existe, para que las órdenes pagadas no lleven un campo vacío.
  if (motivoRechazo) nueva.motivoRechazo = motivoRechazo

  ordenes.push(nueva)
  guardarDato(CLAVES.ordenes, ordenes)
  return nueva
}
