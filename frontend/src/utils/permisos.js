/**
 * Qué puede hacer cada rol (Anexo 1 EP1):
 * - Administrador: acceso total al panel.
 * - Vendedor: entra al panel, pero solo para VER productos y órdenes.
 * - Cliente: solo la tienda.
 *
 * Funciones puras sobre el usuario de la sesión: las usan las rutas protegidas
 * (para dejar pasar o no) y los componentes (para mostrar u ocultar botones).
 */

/**
 * @param {{tipoUsuario: string}|null} usuario - Usuario con sesión, o null.
 * @returns {boolean} true para Administrador y Vendedor.
 */
export function puedeEntrarAlPanel(usuario) {
  return usuario?.tipoUsuario === 'Administrador' || usuario?.tipoUsuario === 'Vendedor'
}

/**
 * @param {{tipoUsuario: string}|null} usuario
 * @returns {boolean} true solo para Administrador: crear, editar y eliminar.
 */
export function esAdministrador(usuario) {
  return usuario?.tipoUsuario === 'Administrador'
}
