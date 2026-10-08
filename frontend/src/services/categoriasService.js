/**
 * CRUD de categorías. Nuevo en la EP2: en la EP1 las categorías estaban fijas
 * en el código; ahora el administrador las crea, edita y elimina.
 */
import { CATEGORIAS_INICIALES } from '../data/categoriasIniciales.js'
import { generarSlug, normalizarTexto } from '../utils/texto.js'
import { CLAVES, guardarDato, leerDato } from './almacenamiento.js'
import { listarProductosPorCategoria } from './productosService.js'

function leerCategorias() {
  return leerDato(CLAVES.categorias, CATEGORIAS_INICIALES)
}

function guardarCategorias(categorias) {
  guardarDato(CLAVES.categorias, categorias)
}

// "Monitores" y "monitores " son la misma categoría para una persona: se
// compara sin mayúsculas, tildes ni espacios sobrantes.
function nombreRepetido(categorias, nombre, idExcluido = null) {
  const buscado = normalizarTexto(nombre)
  return categorias.some(
    (categoria) => categoria.id !== idExcluido && normalizarTexto(categoria.nombre) === buscado,
  )
}

// El id sale del nombre ("Redes y WiFi" → "redes-y-wifi"); si ya existe, se le
// agrega un número para que siga siendo único.
function generarIdUnico(categorias, nombre) {
  const base = generarSlug(nombre) || 'categoria'
  let id = base
  let contador = 2
  while (categorias.some((categoria) => categoria.id === id)) {
    id = `${base}-${contador}`
    contador++
  }
  return id
}

/** @returns {object[]} Todas las categorías. */
export function listarCategorias() {
  return leerCategorias()
}

/**
 * @param {string} id
 * @returns {object|null}
 */
export function obtenerCategoria(id) {
  return leerCategorias().find((categoria) => categoria.id === id) ?? null
}

/**
 * @param {{nombre: string, descripcion?: string}} datos - Ya validados.
 * @returns {object} La categoría creada, con su id generado.
 * @throws {Error} Si ya existe una categoría con ese nombre.
 */
export function crearCategoria(datos) {
  const categorias = leerCategorias()
  const nombre = String(datos.nombre).trim()
  if (nombreRepetido(categorias, nombre)) throw new Error(`Ya existe la categoría "${nombre}".`)

  const nueva = {
    id: generarIdUnico(categorias, nombre),
    nombre,
    descripcion: String(datos.descripcion ?? '').trim(),
  }
  categorias.push(nueva)
  guardarCategorias(categorias)
  return nueva
}

/**
 * Cambia nombre y descripción. El id se mantiene: los productos y la URL de la
 * categoría siguen funcionando aunque cambie el nombre.
 *
 * @param {string} id
 * @param {{nombre: string, descripcion?: string}} datos - Ya validados.
 * @returns {object} La categoría actualizada.
 * @throws {Error} Si no existe o si el nombre nuevo ya lo usa otra categoría.
 */
export function actualizarCategoria(id, datos) {
  const categorias = leerCategorias()
  const indice = categorias.findIndex((categoria) => categoria.id === id)
  if (indice === -1) throw new Error(`No existe la categoría ${id}.`)

  const nombre = String(datos.nombre).trim()
  if (nombreRepetido(categorias, nombre, id)) throw new Error(`Ya existe la categoría "${nombre}".`)

  categorias[indice] = { id, nombre, descripcion: String(datos.descripcion ?? '').trim() }
  guardarCategorias(categorias)
  return categorias[indice]
}

/**
 * Regla de negocio: no se elimina una categoría que todavía tiene productos,
 * porque esos productos quedarían sin categoría (y la categoría es obligatoria).
 *
 * @param {string} id
 * @throws {Error} Si no existe o si tiene productos asociados.
 */
export function eliminarCategoria(id) {
  const categorias = leerCategorias()
  if (!categorias.some((categoria) => categoria.id === id)) throw new Error(`No existe la categoría ${id}.`)

  const cantidadProductos = listarProductosPorCategoria(id).length
  if (cantidadProductos > 0) {
    throw new Error(
      `No se puede eliminar: la categoría tiene ${cantidadProductos} producto(s). Muévelos a otra categoría primero.`,
    )
  }

  guardarCategorias(categorias.filter((categoria) => categoria.id !== id))
}
