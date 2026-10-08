/**
 * Datos mínimos y controlados que comparten varias pruebas de componentes.
 * Cada uno existe para un caso; así los resultados esperados son fáciles de
 * calcular a mano.
 */

export const PRODUCTOS_PRUEBA = [
  { codigo: 'NB-1', nombre: 'Notebook Uno', idCategoria: 'notebooks', precio: 500000, precioOferta: null, stock: 3, stockCritico: 1 },
  { codigo: 'AC-1', nombre: 'Mouse Oferta', idCategoria: 'accesorios', precio: 20000, precioOferta: 15000, stock: 10, stockCritico: 2 },
  { codigo: 'AU-0', nombre: 'Cámara Agotada', idCategoria: 'audio', precio: 70000, precioOferta: null, stock: 0, stockCritico: 5 },
]

// Usuarios tal como quedan en la sesión: sin contraseña.
export const ADMIN_PRUEBA = {
  run: '182345679', nombre: 'Camila', apellidos: 'Fuentes', correo: 'camila@profesor.duoc.cl', tipoUsuario: 'Administrador',
}
export const VENDEDOR_PRUEBA = {
  run: '167890121', nombre: 'Matías', apellidos: 'Soto', correo: 'matias@duoc.cl', tipoUsuario: 'Vendedor',
}
export const CLIENTE_PRUEBA = {
  run: '201112222', nombre: 'Francisca', apellidos: 'Muñoz', correo: 'fran@gmail.com', tipoUsuario: 'Cliente',
}
