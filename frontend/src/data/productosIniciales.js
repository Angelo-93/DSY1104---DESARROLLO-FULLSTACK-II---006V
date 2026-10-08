/**
 * Catálogo con el que parte la tienda: los 14 productos de la EP1.
 * Se copia a localStorage la primera vez; desde ahí el admin lo modifica.
 *
 * Cambios respecto a la EP1:
 * - "categoria" (nombre) pasa a "idCategoria": ver categoriasIniciales.js.
 * - Nuevo campo opcional "precioOferta" para la vista Ofertas.
 * - stockCritico puede ser null (el Anexo de la EP1 lo define como opcional).
 *
 * Algunos valores se ajustaron A PROPÓSITO para que cada caso especial exista
 * en los datos y se pueda mostrar sin inventarlo en la presentación:
 *
 * | Producto              | Caso que demuestra                                         |
 * | --------------------- | ---------------------------------------------------------- |
 * | NB-HPEB640G11         | Stock crítico justo en el límite (stock 4 = crítico 4)     |
 * | IM-HPLJM428FDW        | Stock bajo el crítico (2 < 3)                              |
 * | AU-POLYP5             | Producto agotado (stock 0)                                 |
 * | AC-HPDOCKG5           | Sin stock crítico definido: nunca aparece como crítico     |
 * | NB-HP240G10, MN-HPP24G5, AU-POLYSYNC20, AC-HP235COMBO | Productos en oferta |
 */
export const PRODUCTOS_INICIALES = [
  {
    codigo: 'NB-HP250G10',
    nombre: 'HP 250 G10',
    idCategoria: 'notebooks',
    especificaciones: 'Intel Core i5 · 16 GB RAM · 512 GB SSD · 15.6" FHD',
    descripcion: 'Notebook empresarial liviano, pensado para trabajo de oficina diario con buena autonomía de batería.',
    precio: 549990,
    precioOferta: null,
    stock: 18,
    stockCritico: 5,
  },
  {
    codigo: 'NB-HP240G10',
    nombre: 'HP 240 G10',
    idCategoria: 'notebooks',
    especificaciones: 'Intel Core i3 · 8 GB RAM · 256 GB SSD · 14" HD',
    descripcion: 'Notebook de entrada ideal para tareas administrativas y uso educativo básico.',
    precio: 399990,
    precioOferta: 349990,
    stock: 24,
    stockCritico: 6,
  },
  {
    codigo: 'NB-HPPB440G11',
    nombre: 'HP ProBook 440 G11',
    idCategoria: 'notebooks',
    especificaciones: 'Intel Core i7 · 16 GB RAM · 512 GB SSD · 14" FHD',
    descripcion: 'Notebook profesional de gama media-alta, orientado a ejecutivos y equipos técnicos.',
    precio: 899990,
    precioOferta: null,
    stock: 9,
    stockCritico: 4,
  },
  {
    codigo: 'NB-HPEB640G11',
    nombre: 'HP EliteBook 640 G11',
    idCategoria: 'notebooks',
    especificaciones: 'Intel Core i7 · 32 GB RAM · 1 TB SSD · 14" FHD',
    descripcion: 'Notebook premium para cargas de trabajo exigentes, con seguridad y gestión de nivel empresarial.',
    precio: 1190000,
    precioOferta: null,
    stock: 4,
    stockCritico: 4,
  },
  {
    codigo: 'DT-HPPD400G9',
    nombre: 'HP ProDesk 400 G9',
    idCategoria: 'desktops-y-aio',
    especificaciones: 'Intel Core i5 · 16 GB RAM · 512 GB SSD · Torre',
    descripcion: 'Equipo de escritorio compacto para estaciones de trabajo corporativas o laboratorios.',
    precio: 479990,
    precioOferta: null,
    stock: 14,
    stockCritico: 5,
  },
  {
    codigo: 'AIO-HPPO440G9',
    nombre: 'HP ProOne 440 G9 AIO',
    idCategoria: 'desktops-y-aio',
    especificaciones: 'Intel Core i5 · 16 GB RAM · 512 GB SSD · 23.8" FHD',
    descripcion: 'All-in-One que integra pantalla y equipo en un solo cuerpo, ideal para espacios reducidos.',
    precio: 649990,
    precioOferta: null,
    stock: 7,
    stockCritico: 3,
  },
  {
    codigo: 'MN-HPP24G5',
    nombre: 'Monitor HP P24 G5',
    idCategoria: 'monitores',
    especificaciones: '23.8" · Full HD · Panel IPS',
    descripcion: 'Monitor de oficina con panel IPS para buena reproducción de color y ángulos de visión amplios.',
    precio: 99990,
    precioOferta: 84990,
    stock: 32,
    stockCritico: 8,
  },
  {
    codigo: 'MN-HPE27G5',
    nombre: 'Monitor HP E27 G5',
    idCategoria: 'monitores',
    especificaciones: '27" · Quad HD · Panel IPS',
    descripcion: 'Monitor de mayor resolución para tareas de diseño, análisis de datos y multitarea.',
    precio: 189990,
    precioOferta: null,
    stock: 11,
    stockCritico: 4,
  },
  {
    codigo: 'AU-POLYSYNC20',
    nombre: 'Poly Sync 20',
    idCategoria: 'audio-y-videoconferencia',
    especificaciones: 'Speakerphone USB/Bluetooth · Cancelación de ruido',
    descripcion: 'Speakerphone portátil para salas de reunión pequeñas y videollamadas individuales.',
    precio: 89990,
    precioOferta: 74990,
    stock: 20,
    stockCritico: 6,
  },
  {
    codigo: 'AU-POLYP5',
    nombre: 'Poly Studio P5',
    idCategoria: 'audio-y-videoconferencia',
    especificaciones: 'Webcam Full HD · Micrófono integrado',
    descripcion: 'Cámara web profesional con corrección automática de luz, pensada para videoconferencias.',
    precio: 69990,
    precioOferta: null,
    stock: 0,
    stockCritico: 6,
  },
  {
    codigo: 'IM-HPLJM404DN',
    nombre: 'HP LaserJet Pro M404dn',
    idCategoria: 'impresion',
    especificaciones: 'Láser monocromática · Dúplex automático · Red',
    descripcion: 'Impresora láser de alto rendimiento para volúmenes de impresión medios en oficina.',
    precio: 259990,
    precioOferta: null,
    stock: 10,
    stockCritico: 3,
  },
  {
    codigo: 'IM-HPLJM428FDW',
    nombre: 'HP LaserJet Pro MFP M428fdw',
    idCategoria: 'impresion',
    especificaciones: 'Multifuncional láser · Wi-Fi · Escáner dúplex',
    descripcion: 'Equipo multifuncional que imprime, escanea y copia, con conectividad inalámbrica.',
    precio: 389990,
    precioOferta: null,
    stock: 2,
    stockCritico: 3,
  },
  {
    codigo: 'AC-HPDOCKG5',
    nombre: 'HP USB-C Dock G5',
    idCategoria: 'accesorios',
    especificaciones: 'Docking station · USB-C · Múltiples salidas de video',
    descripcion: 'Estación de conexión que expande los puertos del notebook para trabajar con doble monitor.',
    precio: 79990,
    precioOferta: null,
    stock: 15,
    stockCritico: null,
  },
  {
    codigo: 'AC-HP235COMBO',
    nombre: 'HP 235 Wireless Combo',
    idCategoria: 'accesorios',
    especificaciones: 'Teclado y mouse inalámbricos',
    descripcion: 'Combo inalámbrico de teclado y mouse para equipar puestos de trabajo de forma económica.',
    precio: 24990,
    precioOferta: 19990,
    stock: 40,
    stockCritico: 10,
  },
]
