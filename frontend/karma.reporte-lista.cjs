/*
 * Reporter de Karma que escribe el nombre de cada prueba con ✔ o ✘.
 * Lo usa `npm run test:rubrica` para mostrar en la terminal las 10 pruebas
 * marcadas para la rúbrica. `npm test` sigue usando el reporter "progress", que
 * solo muestra el contador (con más de 200 pruebas, una lista sería demasiado larga).
 *
 * Por qué uno propio: el reporter de lista más conocido (karma-spec-reporter)
 * estuvo años sin cambios y sacó una versión nueva hace poco; para estas pocas
 * líneas es más seguro no sumar una dependencia externa.
 *
 * Cómo funciona: Karma avisa a los "reporters" (objetos que reciben eventos)
 * cada vez que una prueba termina. baseReporterDecorator le entrega al objeto
 * el comportamiento estándar (write, resumen final, detalle de errores), y aquí
 * solo se cambia lo que se escribe por cada prueba.
 */
function crearReporteLista(baseReporterDecorator) {
  const reporte = {}
  baseReporterDecorator(reporte)

  // Jasmine ejecuta las pruebas en orden aleatorio (así detecta pruebas que
  // dependen unas de otras). Para leer la lista en orden, cada resultado se
  // guarda aquí y se escribe ordenado al final.
  const lineas = []
  // "describe › it": el mismo nombre que se ve en el archivo .spec.
  const nombreCompleto = (resultado) => [...resultado.suite, resultado.description].join(' › ')
  const detalleDeFallaBase = reporte.specFailure

  reporte.specSuccess = (_navegador, resultado) => {
    lineas.push({ orden: resultado.description, texto: `  ✔ ${nombreCompleto(resultado)}` })
  }

  reporte.specFailure = (navegador, resultado) => {
    lineas.push({ orden: resultado.description, texto: `  ✘ ${nombreCompleto(resultado)}` })
    detalleDeFallaBase(navegador, resultado) // muestra de inmediato el expect que falló
  }

  // Al final: la lista ordenada y "Executed 10 of … (skipped …) SUCCESS".
  // numeric: true ordena "10/10" después de "9/10" (y no después de "1/10").
  reporte.onBrowserComplete = (navegador) => {
    lineas.sort((a, b) => a.orden.localeCompare(b.orden, 'es', { numeric: true }))
    reporte.write(`\n${lineas.map((linea) => linea.texto).join('\n')}\n\n${reporte.renderBrowser(navegador)}\n`)
  }

  return reporte
}

// Karma crea el reporter con inyección de dependencias: $inject le dice qué
// pedirle (el decorador del reporter base) y 'factory' que llame a la función y
// use el objeto que devuelve.
crearReporteLista.$inject = ['baseReporterDecorator']

module.exports = { 'reporter:lista': ['factory', crearReporteLista] }
