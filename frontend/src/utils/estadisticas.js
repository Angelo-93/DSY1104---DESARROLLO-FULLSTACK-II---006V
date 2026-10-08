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

/* ---------- Reportes (solo órdenes pagadas) ---------- */

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

// Año y mes de la orden en la hora de Chile: una compra del 31 de agosto a
// las 23:00 en Chile ya es 1 de septiembre en UTC, y debe contar en agosto.
const FORMATO_ANIO_MES = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Santiago',
  year: 'numeric',
  month: '2-digit',
})

function anioMes(fechaIso) {
  const partes = FORMATO_ANIO_MES.formatToParts(new Date(fechaIso))
  const anio = Number(partes.find((p) => p.type === 'year').value)
  const mes = Number(partes.find((p) => p.type === 'month').value)
  return { anio, mes }
}

function pagadas(ordenes) {
  return ordenes.filter((orden) => orden.estado === 'pagada')
}

/**
 * Ventas de cada mes, del más antiguo al más reciente. Los meses sin ventas
 * entre el primero y el último aparecen con 0: si se omitieran, el gráfico
 * escondería justo los meses malos.
 *
 * @param {object[]} ordenes
 * @returns {Array<{etiqueta: string, total: number, ordenes: number}>} Ej: { etiqueta: 'Ago 2026', ... }
 */
export function ventasPorMes(ordenes) {
  const porMes = new Map() // clave "2026-08" → { total, ordenes }
  pagadas(ordenes).forEach((orden) => {
    const { anio, mes } = anioMes(orden.fecha)
    const clave = `${anio}-${String(mes).padStart(2, '0')}`
    const actual = porMes.get(clave) ?? { total: 0, ordenes: 0 }
    porMes.set(clave, { total: actual.total + orden.total, ordenes: actual.ordenes + 1 })
  })
  if (porMes.size === 0) return []

  const claves = [...porMes.keys()].sort()
  let [anio, mes] = claves[0].split('-').map(Number)
  const [anioFin, mesFin] = claves.at(-1).split('-').map(Number)

  const resultado = []
  while (anio < anioFin || (anio === anioFin && mes <= mesFin)) {
    const clave = `${anio}-${String(mes).padStart(2, '0')}`
    const datos = porMes.get(clave) ?? { total: 0, ordenes: 0 }
    resultado.push({ etiqueta: `${MESES[mes - 1]} ${anio}`, ...datos })
    mes += 1
    if (mes === 13) {
      mes = 1
      anio += 1
    }
  }
  return resultado
}

/**
 * Monto vendido por categoría, de mayor a menor. Se calcula con las líneas de
 * cada orden (una orden puede tener productos de varias categorías).
 *
 * @param {object[]} ordenes
 * @param {Object<string, string>} nombresCategoria - { idCategoria: nombre }.
 * @returns {Array<{nombre: string, total: number, unidades: number}>}
 */
export function ventasPorCategoria(ordenes, nombresCategoria) {
  const porCategoria = new Map()
  pagadas(ordenes).forEach((orden) => {
    orden.items.forEach((item) => {
      // Si la categoría se eliminó o la línea no la guardó, se agrupa aparte.
      const nombre = nombresCategoria[item.idCategoria] ?? 'Sin categoría'
      const actual = porCategoria.get(nombre) ?? { nombre, total: 0, unidades: 0 }
      actual.total += item.precioUnitario * item.cantidad
      actual.unidades += item.cantidad
      porCategoria.set(nombre, actual)
    })
  })
  return [...porCategoria.values()].sort((a, b) => b.total - a.total)
}

/**
 * Productos con más unidades vendidas (a igual cantidad, el de mayor monto).
 *
 * @param {object[]} ordenes
 * @param {number} [limite=5]
 * @returns {Array<{codigo: string, nombre: string, unidades: number, total: number}>}
 */
export function productosMasVendidos(ordenes, limite = 5) {
  const porProducto = new Map()
  pagadas(ordenes).forEach((orden) => {
    orden.items.forEach((item) => {
      const actual = porProducto.get(item.codigo) ?? { codigo: item.codigo, nombre: item.nombre, unidades: 0, total: 0 }
      actual.unidades += item.cantidad
      actual.total += item.precioUnitario * item.cantidad
      porProducto.set(item.codigo, actual)
    })
  })
  return [...porProducto.values()]
    .sort((a, b) => b.unidades - a.unidades || b.total - a.total)
    .slice(0, limite)
}
