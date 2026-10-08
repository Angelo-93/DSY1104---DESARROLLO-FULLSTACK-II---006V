/**
 * Usuarios con los que parte el sistema: uno por rol, más un segundo cliente.
 *
 * Cambios respecto a la EP1:
 * - Correos corregidos: dos usuarios tenían @inforcore.cl, dominio que la propia
 *   regla de negocio rechaza, así que no habrían podido iniciar sesión.
 * - Campo "contrasena" (4 a 10 caracteres): la EP1 solo simulaba el login.
 *
 * Las contraseñas se guardan en texto plano porque la EP2 no tiene backend:
 * es una simulación académica. La autenticación segura (contraseñas cifradas en
 * el servidor) corresponde a la EP3.
 *
 * Datos ficticios: el repositorio es público.
 */
export const USUARIOS_INICIALES = [
  {
    run: '182345679',
    nombre: 'Camila',
    apellidos: 'Fuentes Rojas',
    correo: 'camila.fuentes@profesor.duoc.cl',
    contrasena: 'admin123',
    fechaNacimiento: '1990-04-12',
    tipoUsuario: 'Administrador',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Providencia',
    direccion: 'Av. Holanda 099, Of. 1101',
  },
  {
    run: '167890121',
    nombre: 'Matías',
    apellidos: 'Soto Lagos',
    correo: 'matias.soto@duoc.cl',
    contrasena: 'vende123',
    fechaNacimiento: '1995-08-23',
    tipoUsuario: 'Vendedor',
    region: 'Región Metropolitana de Santiago',
    comuna: 'Ñuñoa',
    direccion: 'Los Leones 456',
  },
  {
    run: '201112222',
    nombre: 'Francisca',
    apellidos: 'Muñoz Díaz',
    correo: 'francisca.munoz@gmail.com',
    contrasena: 'cliente1',
    fechaNacimiento: '2001-01-30',
    tipoUsuario: 'Cliente',
    region: 'Región de Valparaíso',
    comuna: 'Viña del Mar',
    direccion: 'Av. San Martín 220',
  },
  {
    run: '156789011',
    nombre: 'Tomás',
    apellidos: 'Herrera Vidal',
    correo: 'tomas.herrera@duoc.cl',
    contrasena: 'cliente2',
    // Fecha de nacimiento vacía a propósito: es un campo opcional.
    fechaNacimiento: '',
    tipoUsuario: 'Cliente',
    region: 'Región del Biobío',
    comuna: 'Concepción',
    direccion: 'Barros Arana 890',
  },
]
