import { calcularTotal } from '../utils/calculos.js'

/**
 * Órdenes de ejemplo para que el admin (dashboard, órdenes, reportes, historial
 * de compras) tenga datos que mostrar desde el primer arranque.
 *
 * Cada línea guarda nombre y precio COPIADOS al momento de la compra (no solo el
 * código): si mañana el producto cambia de precio o se elimina, la boleta antigua
 * debe seguir mostrando lo que realmente se cobró.
 *
 * Casos incluidos a propósito:
 * - Compras de clientes registrados (Francisca y Tomás) → historial por usuario.
 * - Compras de invitados sin cuenta (run: null) → el checkout no exige sesión.
 * - Una orden "rechazada" (N° 1005) → estado de pago con error en el admin.
 * - Una compra con precio de oferta (N° 1004) y una de varias unidades (N° 1006).
 *
 * Las fechas llevan la zona horaria de Chile: -04:00 hasta el cambio de hora de
 * septiembre y -03:00 después (horario de verano). Así el día que se muestra no
 * depende de la zona horaria del computador que abre la página.
 */
function crearOrden(datos) {
  return { ...datos, total: calcularTotal(datos.items) }
}

const DIRECCION_FRANCISCA = {
  calle: 'Av. San Martín 220',
  departamento: '',
  region: 'Región de Valparaíso',
  comuna: 'Viña del Mar',
  indicaciones: '',
}

const DIRECCION_TOMAS = {
  calle: 'Barros Arana 890',
  departamento: 'Depto 42',
  region: 'Región del Biobío',
  comuna: 'Concepción',
  indicaciones: 'Dejar en conserjería.',
}

export const ORDENES_INICIALES = [
  crearOrden({
    numero: 1001,
    fecha: '2026-08-21T10:15:00-04:00',
    estado: 'pagada',
    cliente: { run: '201112222', nombre: 'Francisca', apellidos: 'Muñoz Díaz', correo: 'francisca.munoz@gmail.com' },
    direccion: DIRECCION_FRANCISCA,
    items: [
      { codigo: 'NB-HP250G10', idCategoria: 'notebooks', nombre: 'HP 250 G10', precioUnitario: 549990, cantidad: 1 },
      { codigo: 'AC-HP235COMBO', idCategoria: 'accesorios', nombre: 'HP 235 Wireless Combo', precioUnitario: 24990, cantidad: 1 },
    ],
  }),
  crearOrden({
    numero: 1002,
    fecha: '2026-09-03T18:40:00-04:00',
    estado: 'pagada',
    cliente: { run: '156789011', nombre: 'Tomás', apellidos: 'Herrera Vidal', correo: 'tomas.herrera@duoc.cl' },
    direccion: DIRECCION_TOMAS,
    items: [
      { codigo: 'MN-HPP24G5', idCategoria: 'monitores', nombre: 'Monitor HP P24 G5', precioUnitario: 99990, cantidad: 2 },
    ],
  }),
  crearOrden({
    numero: 1003,
    fecha: '2026-09-12T12:05:00-03:00',
    estado: 'pagada',
    cliente: { run: null, nombre: 'Javiera', apellidos: 'Rojas Pinto', correo: 'javiera.rojas@gmail.com' },
    direccion: {
      calle: 'Av. Pajaritos 1450',
      departamento: '',
      region: 'Región Metropolitana de Santiago',
      comuna: 'Maipú',
      indicaciones: '',
    },
    items: [
      { codigo: 'IM-HPLJM404DN', idCategoria: 'impresion', nombre: 'HP LaserJet Pro M404dn', precioUnitario: 259990, cantidad: 1 },
    ],
  }),
  crearOrden({
    numero: 1004,
    fecha: '2026-09-26T09:30:00-03:00',
    estado: 'pagada',
    cliente: { run: '201112222', nombre: 'Francisca', apellidos: 'Muñoz Díaz', correo: 'francisca.munoz@gmail.com' },
    direccion: DIRECCION_FRANCISCA,
    items: [
      { codigo: 'AU-POLYSYNC20', idCategoria: 'audio-y-videoconferencia', nombre: 'Poly Sync 20', precioUnitario: 74990, cantidad: 1 },
    ],
  }),
  crearOrden({
    numero: 1005,
    fecha: '2026-10-02T20:10:00-03:00',
    estado: 'rechazada',
    cliente: { run: '156789011', nombre: 'Tomás', apellidos: 'Herrera Vidal', correo: 'tomas.herrera@duoc.cl' },
    direccion: DIRECCION_TOMAS,
    items: [
      { codigo: 'NB-HPEB640G11', idCategoria: 'notebooks', nombre: 'HP EliteBook 640 G11', precioUnitario: 1190000, cantidad: 1 },
    ],
  }),
  crearOrden({
    numero: 1006,
    fecha: '2026-10-05T15:45:00-03:00',
    estado: 'pagada',
    cliente: { run: null, nombre: 'Rodrigo', apellidos: 'Paredes Soto', correo: 'rodrigo.paredes@profesor.duoc.cl' },
    direccion: {
      calle: 'Av. Vicuña Mackenna 4917',
      departamento: '',
      region: 'Región Metropolitana de Santiago',
      comuna: 'San Joaquín',
      indicaciones: 'Entregar en recepción del laboratorio.',
    },
    items: [
      { codigo: 'DT-HPPD400G9', idCategoria: 'desktops-y-aio', nombre: 'HP ProDesk 400 G9', precioUnitario: 479990, cantidad: 3 },
      { codigo: 'MN-HPE27G5', idCategoria: 'monitores', nombre: 'Monitor HP E27 G5', precioUnitario: 189990, cantidad: 3 },
    ],
  }),
]
