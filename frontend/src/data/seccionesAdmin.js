/**
 * Secciones del panel administrador, en el orden del diagrama de flujo del
 * Anexo 1 (Figura 10). De esta lista salen el menú lateral y las tarjetas de
 * acceso del Dashboard (Figura 9): agregar una sección es agregar una línea.
 *
 * soloAdmin: secciones que el Vendedor no ve (él solo consulta productos y
 * órdenes). Ocultarlas ordena la vista; la protección real está en las rutas.
 */
export const SECCIONES_ADMIN = [
  { ruta: '/admin', texto: 'Dashboard', descripcion: 'Visión general de las métricas clave de la tienda.' },
  { ruta: '/admin/ordenes', texto: 'Órdenes', descripcion: 'Seguimiento de las compras y sus boletas.' },
  { ruta: '/admin/productos', texto: 'Productos', descripcion: 'Inventario, precios y productos con stock crítico.' },
  { ruta: '/admin/categorias', texto: 'Categorías', descripcion: 'Organiza los productos para facilitar la navegación.', soloAdmin: true },
  { ruta: '/admin/usuarios', texto: 'Usuarios', descripcion: 'Cuentas, roles e historial de compras.', soloAdmin: true },
  { ruta: '/admin/reportes', texto: 'Reportes', descripcion: 'Gráficos de ventas por mes, categoría y producto.', soloAdmin: true },
  { ruta: '/admin/perfil', texto: 'Perfil', descripcion: 'Tus datos personales y tu contraseña.' },
]

/**
 * @param {boolean} esAdministrador
 * @returns {object[]} Las secciones que ese rol puede ver.
 */
export function seccionesVisibles(esAdministrador) {
  return SECCIONES_ADMIN.filter((seccion) => esAdministrador || !seccion.soloAdmin)
}
