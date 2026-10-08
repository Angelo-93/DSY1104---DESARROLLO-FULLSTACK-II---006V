/**
 * CRUD de usuarios y verificación de credenciales del login.
 *
 * Las funciones que entregan usuarios hacia la interfaz les quitan la
 * contraseña: ninguna pantalla la necesita, y así no termina copiada en el
 * estado de React ni en la sesión.
 */
import { USUARIOS_INICIALES } from '../data/usuariosIniciales.js'
import { CLAVES, guardarDato, leerDato } from './almacenamiento.js'

function leerUsuarios() {
  return leerDato(CLAVES.usuarios, USUARIOS_INICIALES)
}

function guardarUsuarios(usuarios) {
  guardarDato(CLAVES.usuarios, usuarios)
}

// Desestructuración: separa "contrasena" y deja todo lo demás en "publico".
function sinContrasena(usuario) {
  const { contrasena: _omitida, ...publico } = usuario
  return publico
}

// Debe quedar siempre al menos un Administrador: si no, nadie podría volver a
// entrar al panel. Lo usan eliminar y actualizar (quitarle el rol).
function contarAdministradores(usuarios) {
  return usuarios.filter((u) => u.tipoUsuario === 'Administrador').length
}

function normalizarCorreo(correo) {
  return String(correo ?? '').trim().toLowerCase()
}

function prepararUsuario(datos) {
  return {
    run: String(datos.run).trim().toUpperCase(),
    nombre: String(datos.nombre).trim(),
    apellidos: String(datos.apellidos).trim(),
    correo: normalizarCorreo(datos.correo),
    contrasena: datos.contrasena,
    fechaNacimiento: datos.fechaNacimiento ?? '',
    // Quien se registra desde la tienda siempre es Cliente; solo el admin
    // puede crear Administradores o Vendedores.
    tipoUsuario: datos.tipoUsuario ?? 'Cliente',
    region: datos.region,
    comuna: datos.comuna,
    direccion: String(datos.direccion).trim(),
  }
}

/* ---------- Leer ---------- */

/** @returns {object[]} Todos los usuarios, sin contraseña. */
export function listarUsuarios() {
  return leerUsuarios().map(sinContrasena)
}

/**
 * @param {string} run - Sin puntos ni guion.
 * @returns {object|null} El usuario sin contraseña, o null.
 */
export function obtenerUsuario(run) {
  const buscado = String(run).toUpperCase()
  const usuario = leerUsuarios().find((u) => u.run === buscado)
  return usuario ? sinContrasena(usuario) : null
}

/**
 * Verifica las credenciales del login. El correo se compara sin mayúsculas
 * (para el usuario "Ana@Gmail.com" y "ana@gmail.com" son la misma cuenta);
 * la contraseña, exacta.
 *
 * @param {string} correo
 * @param {string} contrasena
 * @returns {object|null} El usuario sin contraseña si coinciden; si no, null.
 */
export function autenticarUsuario(correo, contrasena) {
  const correoBuscado = normalizarCorreo(correo)
  const usuario = leerUsuarios().find((u) => u.correo === correoBuscado && u.contrasena === contrasena)
  return usuario ? sinContrasena(usuario) : null
}

/* ---------- Crear, actualizar, eliminar ---------- */

/**
 * Usado por el registro de la tienda y por "Nuevo usuario" del admin.
 *
 * @param {object} datos - Valores ya validados con validarUsuario.
 * @returns {object} El usuario creado, sin contraseña.
 * @throws {Error} Si el RUN o el correo ya están registrados.
 */
export function crearUsuario(datos) {
  const usuarios = leerUsuarios()
  const nuevo = prepararUsuario(datos)

  if (usuarios.some((u) => u.run === nuevo.run)) throw new Error('Ya existe un usuario con ese RUN.')
  if (usuarios.some((u) => u.correo === nuevo.correo)) throw new Error('Ese correo ya está registrado.')

  usuarios.push(nuevo)
  guardarUsuarios(usuarios)
  return sinContrasena(nuevo)
}

/**
 * El RUN no cambia (identifica al usuario). Si la contraseña viene vacía se
 * mantiene la anterior: el admin no conoce las contraseñas y no debe tener que
 * escribirlas para editar otros datos.
 *
 * @param {string} run
 * @param {object} datos - Valores ya validados.
 * @returns {object} El usuario actualizado, sin contraseña.
 * @throws {Error} Si no existe, si el correo ya lo usa otro usuario o si se le
 *   quita el rol al único Administrador.
 */
export function actualizarUsuario(run, datos) {
  const usuarios = leerUsuarios()
  const indice = usuarios.findIndex((u) => u.run === run)
  if (indice === -1) throw new Error(`No existe el usuario con RUN ${run}.`)

  const actualizado = prepararUsuario({ ...datos, run })
  if (!datos.contrasena) actualizado.contrasena = usuarios[indice].contrasena
  if (!datos.tipoUsuario) actualizado.tipoUsuario = usuarios[indice].tipoUsuario

  if (usuarios.some((u) => u.run !== run && u.correo === actualizado.correo)) {
    throw new Error('Ese correo ya está registrado.')
  }
  if (usuarios[indice].tipoUsuario === 'Administrador' && actualizado.tipoUsuario !== 'Administrador'
    && contarAdministradores(usuarios) === 1) {
    throw new Error('No se puede quitar el rol al único Administrador.')
  }

  usuarios[indice] = actualizado
  guardarUsuarios(usuarios)
  return sinContrasena(actualizado)
}

/**
 * Regla de negocio: no se puede eliminar al último Administrador.
 *
 * @param {string} run
 * @throws {Error} Si no existe o si es el último Administrador.
 */
export function eliminarUsuario(run) {
  const usuarios = leerUsuarios()
  const usuario = usuarios.find((u) => u.run === run)
  if (!usuario) throw new Error(`No existe el usuario con RUN ${run}.`)

  if (usuario.tipoUsuario === 'Administrador' && contarAdministradores(usuarios) === 1) {
    throw new Error('No se puede eliminar al único Administrador.')
  }

  guardarUsuarios(usuarios.filter((u) => u.run !== run))
}
