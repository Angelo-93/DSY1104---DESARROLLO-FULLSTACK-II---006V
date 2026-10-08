/**
 * CRUD de productos sobre localStorage: la "base de datos simulada" que pide el
 * Anexo 1 de la EP2. Tienda y admin leen de aquí, así que un cambio del admin
 * se ve de inmediato en el catálogo (en la EP1 eran dos copias separadas).
 *
 * Los servicios no validan formato (eso es de utils/validaciones.js, para que el
 * formulario muestre cada error bajo su campo). Sí protegen las reglas que
 * dependen de los datos guardados, como no repetir un código.
 */
import { PRODUCTOS_INICIALES } from '../data/productosIniciales.js'
import { esStockCritico, estaEnOferta } from '../utils/calculos.js'
import { CLAVES, guardarDato, leerDato } from './almacenamiento.js'

function leerProductos() {
  return leerDato(CLAVES.productos, PRODUCTOS_INICIALES)
}

function guardarProductos(productos) {
  guardarDato(CLAVES.productos, productos)
}

// Los formularios entregan todo como texto: aquí se pasa a los tipos que se
// guardan, y un opcional vacío queda en null (no en 0, que significaría otra cosa).
function aNumeroOpcional(valor) {
  return valor === null || valor === undefined || String(valor).trim() === '' ? null : Number(valor)
}

function prepararProducto(datos) {
  return {
    codigo: String(datos.codigo).trim().toUpperCase(),
    nombre: String(datos.nombre).trim(),
    idCategoria: datos.idCategoria,
    especificaciones: String(datos.especificaciones ?? '').trim(),
    descripcion: String(datos.descripcion ?? '').trim(),
    precio: Number(datos.precio),
    precioOferta: aNumeroOpcional(datos.precioOferta),
    stock: Number(datos.stock),
    stockCritico: aNumeroOpcional(datos.stockCritico),
  }
}

/* ---------- Leer ---------- */

/** @returns {object[]} Todos los productos. */
export function listarProductos() {
  return leerProductos()
}

/**
 * @param {string} codigo
 * @returns {object|null} null si no existe (la página muestra "no encontrado").
 */
export function obtenerProducto(codigo) {
  const buscado = String(codigo).toUpperCase()
  return leerProductos().find((producto) => producto.codigo === buscado) ?? null
}

/** @returns {object[]} Productos de una categoría. */
export function listarProductosPorCategoria(idCategoria) {
  return leerProductos().filter((producto) => producto.idCategoria === idCategoria)
}

/** @returns {object[]} Productos con una oferta válida (vista Ofertas). */
export function listarOfertas() {
  return leerProductos().filter(estaEnOferta)
}

/** @returns {object[]} Productos en o bajo su stock crítico (vista del admin). */
export function listarProductosCriticos() {
  return leerProductos().filter(esStockCritico)
}

/* ---------- Crear, actualizar, eliminar ---------- */

/**
 * @param {object} datos - Valores ya validados con validarProducto.
 * @returns {object} El producto guardado.
 * @throws {Error} Si ya existe un producto con ese código.
 */
export function crearProducto(datos) {
  const productos = leerProductos()
  const nuevo = prepararProducto(datos)

  if (productos.some((producto) => producto.codigo === nuevo.codigo)) {
    throw new Error(`Ya existe un producto con el código ${nuevo.codigo}.`)
  }

  productos.push(nuevo)
  guardarProductos(productos)
  return nuevo
}

/**
 * El código no se puede cambiar: es el identificador que usan el carrito, las
 * órdenes y la URL del detalle (/productos/:codigo).
 *
 * @param {string} codigo - Producto a modificar.
 * @param {object} datos - Valores ya validados.
 * @returns {object} El producto actualizado.
 * @throws {Error} Si el producto no existe.
 */
export function actualizarProducto(codigo, datos) {
  const productos = leerProductos()
  const indice = productos.findIndex((producto) => producto.codigo === codigo)
  if (indice === -1) throw new Error(`No existe el producto ${codigo}.`)

  const actualizado = { ...prepararProducto(datos), codigo }
  productos[indice] = actualizado
  guardarProductos(productos)
  return actualizado
}

/**
 * @param {string} codigo
 * @throws {Error} Si el producto no existe.
 */
export function eliminarProducto(codigo) {
  const productos = leerProductos()
  const restantes = productos.filter((producto) => producto.codigo !== codigo)
  if (restantes.length === productos.length) throw new Error(`No existe el producto ${codigo}.`)
  guardarProductos(restantes)
}

/* ---------- Stock ---------- */

/**
 * Revisa si alcanza el stock para una compra, sin modificar nada.
 *
 * @param {Array<{codigo: string, cantidad: number}>} items - Líneas del carrito.
 * @returns {Array<{codigo: string, nombre: string, solicitado: number, disponible: number}>}
 *   Los productos sin stock suficiente; vacío si alcanza para todo.
 */
export function verificarStock(items) {
  const productos = leerProductos()
  return items
    .map((item) => {
      const producto = productos.find((p) => p.codigo === item.codigo)
      return {
        codigo: item.codigo,
        nombre: producto?.nombre ?? item.nombre ?? item.codigo,
        solicitado: item.cantidad,
        disponible: producto?.stock ?? 0,
      }
    })
    .filter((linea) => linea.solicitado > linea.disponible)
}

/**
 * Descuenta del stock lo comprado. Es "todo o nada": si un solo producto no
 * alcanza, no se descuenta ninguno, para no dejar el inventario a medias.
 *
 * @param {Array<{codigo: string, cantidad: number}>} items
 * @throws {Error} Si algún producto no tiene stock suficiente.
 */
export function descontarStock(items) {
  const faltantes = verificarStock(items)
  if (faltantes.length > 0) {
    const nombres = faltantes.map((linea) => linea.nombre).join(', ')
    throw new Error(`Stock insuficiente para: ${nombres}.`)
  }

  const productos = leerProductos()
  items.forEach((item) => {
    const producto = productos.find((p) => p.codigo === item.codigo)
    producto.stock -= item.cantidad
  })
  guardarProductos(productos)
}
