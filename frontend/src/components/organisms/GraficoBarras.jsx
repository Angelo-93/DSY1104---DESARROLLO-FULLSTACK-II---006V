import { useState } from 'react'
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Chart.js se arma por piezas: solo se registran las que usan estos gráficos
// (ejes, barras y el cuadro que aparece al pasar el mouse). Así no se carga
// todo el código de líneas, tortas, etc.
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

// El canvas no entiende variables CSS: se repiten aquí los colores de INFORCORE.
const COLOR_BARRA = '#0b3d63'
const COLOR_GRILLA = '#dde3e8'
const COLOR_TEXTO = '#5a6b78'

/**
 * Gráfico de barras de una sola serie (react-chartjs-2, clase del 15-09).
 * Una sola serie = un solo color y sin leyenda: el título ya dice qué se mide.
 *
 * @param {object} props
 * @param {string} props.titulo - También es el nombre accesible del gráfico.
 * @param {string[]} props.etiquetas - Una por barra.
 * @param {number[]} props.valores
 * @param {(valor: number) => string} [props.formatoValor] - Para ejes y tooltip.
 * @param {boolean} [props.horizontal=false] - Barras acostadas: mejor para
 *   nombres largos (productos, categorías).
 * @param {number} [props.alto=280] - Alto en píxeles.
 * @param {boolean} [props.soloEnteros=false] - El eje no muestra decimales
 *   (ej: unidades vendidas: no existen 0,5 unidades).
 */
function GraficoBarras({ titulo, etiquetas, valores, formatoValor = String, horizontal = false, alto = 280, soloEnteros = false }) {
  // Sin animación si el sistema pide reducir movimiento.
  const [reducirMovimiento] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  const datos = {
    labels: etiquetas,
    datasets: [
      {
        label: titulo,
        data: valores,
        backgroundColor: COLOR_BARRA,
        borderRadius: 4, // extremos redondeados
        maxBarThickness: 36, // barras delgadas aunque haya pocas
      },
    ],
  }

  const ejeValores = {
    beginAtZero: true,
    grid: { color: COLOR_GRILLA },
    // precision: 0 → Chart.js solo pone marcas en números enteros.
    ticks: { color: COLOR_TEXTO, callback: (valor) => formatoValor(valor), ...(soloEnteros && { precision: 0 }) },
  }
  const ejeCategorias = { grid: { display: false }, ticks: { color: COLOR_TEXTO } }

  const opciones = {
    indexAxis: horizontal ? 'y' : 'x',
    responsive: true, // se adapta al ancho de su contenedor
    maintainAspectRatio: false, // usa el alto del contenedor
    animation: reducirMovimiento ? false : undefined,
    plugins: {
      tooltip: { callbacks: { label: (contexto) => formatoValor(contexto.parsed[horizontal ? 'x' : 'y']) } },
    },
    scales: horizontal ? { x: ejeValores, y: ejeCategorias } : { x: ejeCategorias, y: ejeValores },
  }

  return (
    <div style={{ position: 'relative', height: alto }}>
      {/* role="img" + aria-label: un lector de pantalla anuncia el gráfico por
          su título. Los números exactos están en la tabla de la página. */}
      <Bar data={datos} options={opciones} role="img" aria-label={titulo} />
    </div>
  )
}

export default GraficoBarras
