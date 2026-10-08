/**
 * Indicadores del panel administrador, calculados a partir de los datos.
 * Funciones puras: reciben los arreglos ya leídos y devuelven números. Así el
 * Dashboard (y los Reportes del Bloque 6b) no repiten cálculos, y cada
 * fórmula se prueba con datos pequeños hechos a mano.
 */
import { esStockCritico } from './calculos.js'

/**
 * Solo las órdenes pagadas cuentan como venta: una rechazada no movió dinero.
 *
 * @param {object[]} ordenes
 * @returns {{pagadas: number, rechazadas: number, montoVendido: number}}
 */
export function resumirVentas(ordenes) {
  const pagadas = ordenes.filter((orden) => orden.estado === 'pagada')
  return {
    pagadas: pagadas.length,
    rechazadas: ordenes.length - pagadas.length,
    montoVendido: pagadas.reduce((total, orden) => total + orden.total, 0),
  }
}

/**
 * @param {object[]} productos
 * @returns {{productos: number, unidades: number, criticos: number, agotados: number}}
 */
export function resumirInventario(productos) {
  return {
    productos: productos.length,
    unidades: productos.reduce((total, producto) => total + producto.stock, 0),
    criticos: productos.filter(esStockCritico).length,
    agotados: productos.filter((producto) => producto.stock === 0).length,
  }
}

/**
 * @param {Array<{tipoUsuario: string}>} usuarios
 * @returns {{usuarios: number, clientes: number, personal: number}}
 *   personal = Administradores + Vendedores.
 */
export function resumirUsuarios(usuarios) {
  const clientes = usuarios.filter((usuario) => usuario.tipoUsuario === 'Cliente').length
  return { usuarios: usuarios.length, clientes, personal: usuarios.length - clientes }
}
