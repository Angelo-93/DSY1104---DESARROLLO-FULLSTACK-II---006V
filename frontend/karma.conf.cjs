/*
 * Configuración de Karma (ejecutor de pruebas) + Jasmine (sintaxis describe/it/expect).
 * Base: la configuración ya probada en el portafolio (Formativa 2).
 *
 * Por qué .cjs: package.json declara "type": "module", así que un .js se lee como
 * módulo ES. Karma carga su configuración con require() (CommonJS), por eso esta
 * extensión le dice a Node que este archivo es CommonJS.
 *
 * Por qué webpack + Babel: Vite compila la app, pero Karma no usa Vite. El navegador
 * no entiende JSX, así que webpack junta cada archivo con sus imports y Babel
 * traduce el JSX a JavaScript normal antes de mandarlo al navegador.
 */

// Archivos que Karma procesa: TODO el código de src (pruebas y componentes).
// Se incluyen también los componentes sin prueba para que el informe de cobertura
// los muestre en 0% en vez de ocultarlos (si no, la cobertura saldría inflada).
// Van como dos patrones separados porque Karma 6 falla con llaves tipo *.{js,jsx}.
const ARCHIVOS_JSX = 'src/**/*.jsx'
const ARCHIVOS_JS = 'src/**/*.js'

// `npm run test:rubrica` agrega la opción --rubrica: se ejecutan solo las 10
// pruebas cuyo nombre empieza con "[Rúbrica" y se muestra cada nombre en la
// terminal. Sin la opción, `npm test` ejecuta todas y mide la cobertura.
const SOLO_RUBRICA = process.argv.includes('--rubrica')

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'webpack'],
    // 'karma-*' carga automáticamente los plugins cuyo nombre empieza con karma-
    // (jasmine, webpack, coverage, chrome, firefox). El de Edge se publica con
    // otro nombre (@chiragrupani/...), así que se agrega a mano.
    plugins: [
      'karma-*',
      require('@chiragrupani/karma-chromium-edge-launcher'),
      require('./karma.reporte-lista.cjs'), // reporter propio para test:rubrica
    ],

    // --grep es una opción de karma-jasmine: ejecuta solo las pruebas cuyo nombre
    // contiene ese texto (literal); las demás se cuentan como "skipped" (omitidas).
    client: SOLO_RUBRICA ? { args: ['--grep', '[Rúbrica'] } : {},

    files: [
      { pattern: ARCHIVOS_JSX, watched: false },
      { pattern: ARCHIVOS_JS, watched: false },
    ],
    // main.jsx monta la app en #root: no es una unidad que se pruebe.
    exclude: ['src/main.jsx'],
    preprocessors: {
      [ARCHIVOS_JSX]: ['webpack'],
      [ARCHIVOS_JS]: ['webpack'],
    },

    webpack: {
      mode: 'development',
      // Mapas de fuente: si una prueba falla, el error apunta a la línea del .jsx original.
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                // runtime 'automatic': no hace falta importar React en cada archivo.
                presets: [['@babel/preset-react', { runtime: 'automatic' }]],
                // istanbul marca cada línea para saber cuáles ejecutaron las pruebas.
                // Se excluyen los *.spec y la carpeta testing/ (mocks y ayudantes de
                // prueba) a mano: istanbul solo ignora por defecto los *.test.*, y
                // medir el código de las pruebas inflaría la cobertura con líneas
                // que siempre se ejecutan.
                plugins: [['istanbul', { exclude: ['**/*.spec.js', '**/*.spec.jsx', '**/testing/**'] }]],
              },
            },
          },
          // Los estilos no se evalúan en pruebas unitarias: se cargan como texto
          // para que el import no rompa la compilación.
          { test: /\.css$/, type: 'asset/source' },
          // Imágenes como data URL: el componente recibe un src válido sin servir archivos.
          { test: /\.(png|jpe?g|webp|svg)$/, type: 'asset/inline' },
        ],
      },
      resolve: { extensions: ['.js', '.jsx'] },
    },

    // Con solo 10 pruebas la cobertura saldría baja y haría fallar el umbral del
    // 60%, por eso en modo rúbrica no se mide (el informe real es el de npm test).
    reporters: SOLO_RUBRICA ? ['lista'] : ['progress', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      subdir: '.',
      reporters: [
        { type: 'html' },          // coverage/index.html: informe navegable
        { type: 'text-summary' },  // resumen en la terminal
        { type: 'lcovonly' },      // formato estándar para herramientas externas
      ],
      // Umbral mínimo que el profesor indicó como aceptable (clase 28-09).
      // Si la cobertura baja de esto, `npm test` termina con error.
      check: { global: { statements: 60, branches: 60, functions: 60, lines: 60 } },
    },

    // ChromeHeadless = Chrome sin ventana. En un servidor de integración continua
    // (variable CI) Chrome necesita --no-sandbox para poder arrancar.
    browsers: [process.env.CI ? 'ChromeHeadlessCI' : 'ChromeHeadless'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
      },
    },

    singleRun: true,
    // La primera compilación de webpack puede tardar; evita que Karma corte antes.
    browserNoActivityTimeout: 60000,
  })
}
