/**
 * Artículos del blog, migrados textualmente de la EP1 (blog-detalle-1.html y
 * blog-detalle-2.html). Pasarlos a datos permite tener UNA sola vista de
 * detalle (/blogs/:idBlog) en vez de un archivo HTML por artículo.
 */
export const BLOGS = [
  {
    id: 'renovar-equipos',
    etiqueta: 'Caso curioso #1',
    titulo: '5 señales de que es hora de renovar los equipos de tu empresa',
    resumen:
      'Rendimiento lento, fallas frecuentes y software que ya no corre bien son más caros de lo que parecen. Te contamos qué mirar antes de decidir.',
    idCategoriaIlustracion: 'notebooks',
    parrafos: [
      'Un notebook que ya tiene varios años no siempre avisa que está fallando con una pantalla azul. Muchas veces avisa con algo más silencioso: minutos perdidos cada mañana esperando que arranque, reuniones que se atrasan porque el equipo se congela, o un técnico que visita la oficina cada cierto tiempo para "dejarlo andando de nuevo".',
      'Estas son cinco señales concretas que conviene revisar: tiempos de carga que superan varios minutos, batería que no dura ni la mitad de una jornada, software de trabajo que ya no es compatible con el sistema operativo instalado, ventiladores que hacen ruido constante por acumulación de polvo interno, y soporte técnico del fabricante que ya no está disponible porque el modelo salió de garantía hace tiempo.',
      'Ninguna de estas señales por sí sola obliga a comprar equipos nuevos de inmediato, pero cuando aparecen dos o tres juntas, el costo real ya no es el precio del notebook: es el tiempo del equipo completo esperando a que la máquina responda. En INFORCORE podemos revisar el parque de equipos de tu empresa y proponer una renovación por etapas, priorizando los puestos donde el impacto es mayor.',
    ],
  },
  {
    id: 'laboratorio-escolar',
    etiqueta: 'Caso curioso #2',
    titulo: 'Cómo equipar un laboratorio de computación escolar sin pasarte del presupuesto',
    resumen:
      'Priorizar durabilidad, garantía y soporte por sobre el precio más bajo suele salir más barato en el tiempo. Revisamos un caso real.',
    idCategoriaIlustracion: 'desktops-y-aio',
    parrafos: [
      'Cuando un colegio necesita renovar su laboratorio de computación, la tentación habitual es buscar el equipo más barato disponible y comprar la mayor cantidad posible con el presupuesto asignado. El problema aparece uno o dos años después, cuando varios equipos empiezan a fallar al mismo tiempo, justo cuando ya no queda presupuesto para reemplazarlos.',
      'Un colegio que trabajó con nosotros el año pasado decidió cambiar el enfoque: en vez de maximizar la cantidad de equipos, priorizó desktops con garantía extendida y soporte técnico incluido, aunque eso significó comprar algunos equipos menos de los que tenía presupuestados en un principio. El resultado fue un laboratorio que se mantuvo operativo durante todo el año escolar, sin interrupciones de clases por equipos en reparación.',
      'La recomendación práctica es simple: define primero cuántos puestos de trabajo son realmente indispensables, y con lo que sobre del presupuesto, prioriza garantía y soporte antes que unidades adicionales. Un laboratorio con menos equipos pero todos funcionando es más útil que uno completo con la mitad de las máquinas en el taller.',
    ],
  },
]

/**
 * @param {string} id
 * @returns {object|null}
 */
export function obtenerBlog(id) {
  return BLOGS.find((blog) => blog.id === id) ?? null
}
