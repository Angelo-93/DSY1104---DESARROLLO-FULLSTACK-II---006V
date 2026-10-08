/**
 * Categorías con las que parte la tienda (las seis de la EP1).
 * Desde la EP2 son editables en el admin; este arreglo es solo el punto de
 * partida que se copia a localStorage la primera vez.
 *
 * El "id" es un texto fijo y legible (no el nombre): los productos apuntan a la
 * categoría por id, así que el admin puede renombrar "Impresión" a "Impresoras"
 * sin dejar productos huérfanos. Además sirve como URL: /categorias/monitores.
 */
export const CATEGORIAS_INICIALES = [
  {
    id: 'notebooks',
    nombre: 'Notebooks',
    descripcion: 'Equipos portátiles para oficina, ejecutivos y aulas.',
  },
  {
    id: 'desktops-y-aio',
    nombre: 'Desktops y AIO',
    descripcion: 'Torres, equipos compactos y All-in-One para puestos fijos y laboratorios.',
  },
  {
    id: 'monitores',
    nombre: 'Monitores',
    descripcion: 'Pantallas Full HD y Quad HD para productividad y análisis.',
  },
  {
    id: 'audio-y-videoconferencia',
    nombre: 'Audio y Videoconferencia',
    descripcion: 'Speakerphones y cámaras para reuniones híbridas.',
  },
  {
    id: 'impresion',
    nombre: 'Impresión',
    descripcion: 'Impresoras láser y multifuncionales para volúmenes de oficina.',
  },
  {
    id: 'accesorios',
    nombre: 'Accesorios',
    descripcion: 'Docks, teclados y mouse para completar cada puesto de trabajo.',
  },
]
