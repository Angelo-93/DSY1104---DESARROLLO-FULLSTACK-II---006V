import { useId } from 'react'

/*
 * Ilustración de producto dibujada con SVG, una por categoría, sobre un fondo
 * de cuadrícula tipo plano técnico.
 *
 * Por qué no fotos: la EP1 no tenía imágenes, las fotos de los fabricantes
 * tienen derechos de autor, y cargar imágenes de otros sitios hace que la
 * tienda dependa de servidores ajenos. Un SVG es código: pesa poco, se ve
 * nítido en cualquier pantalla y toma los colores de INFORCORE.
 */

const AZUL = 'var(--inf-primario, #0b3d63)'
const AZUL_CLARO = 'var(--inf-primario-claro, #14568c)'
const AMBAR = 'var(--inf-acento, #d98c1f)'
const BLANCO = '#ffffff'

// Un dibujo por categoría inicial. Las categorías que cree el admin usan el
// dibujo genérico (un chip), así la tienda nunca muestra un hueco vacío.
const DIBUJOS = {
  notebooks: (
    <>
      <rect x="90" y="58" width="140" height="92" rx="6" fill={AZUL} />
      <rect x="100" y="68" width="120" height="72" rx="2" fill={AZUL_CLARO} />
      <path d="M70 156 H250 L236 172 H84 Z" fill={AZUL} />
      <rect x="146" y="160" width="28" height="4" rx="2" fill={AMBAR} />
    </>
  ),
  'desktops-y-aio': (
    <>
      <rect x="62" y="55" width="132" height="86" rx="5" fill={AZUL} />
      <rect x="71" y="64" width="114" height="68" rx="2" fill={AZUL_CLARO} />
      <rect x="118" y="141" width="20" height="22" fill={AZUL} />
      <rect x="98" y="163" width="60" height="8" rx="3" fill={AZUL} />
      <rect x="212" y="66" width="48" height="105" rx="5" fill={AZUL} />
      <circle cx="236" cy="84" r="6" fill={AMBAR} />
      <rect x="222" y="104" width="28" height="4" rx="2" fill={AZUL_CLARO} />
      <rect x="222" y="114" width="28" height="4" rx="2" fill={AZUL_CLARO} />
    </>
  ),
  monitores: (
    <>
      <rect x="58" y="48" width="204" height="118" rx="6" fill={AZUL} />
      <rect x="68" y="58" width="184" height="98" rx="2" fill={AZUL_CLARO} />
      <path d="M150 166 H170 L176 184 H144 Z" fill={AZUL} />
      <rect x="124" y="184" width="72" height="8" rx="3" fill={AZUL} />
      <circle cx="160" cy="161" r="2.5" fill={AMBAR} />
    </>
  ),
  'audio-y-videoconferencia': (
    <>
      <ellipse cx="128" cy="158" rx="64" ry="22" fill={AZUL} />
      <ellipse cx="128" cy="150" rx="64" ry="22" fill={AZUL_CLARO} />
      <circle cx="128" cy="150" r="9" fill={AMBAR} />
      <circle cx="102" cy="150" r="3" fill={AZUL} />
      <circle cx="154" cy="150" r="3" fill={AZUL} />
      <rect x="194" y="66" width="76" height="42" rx="21" fill={AZUL} />
      <circle cx="232" cy="87" r="11" fill={AZUL_CLARO} />
      <circle cx="232" cy="87" r="5" fill={AMBAR} />
      <rect x="224" y="108" width="16" height="14" fill={AZUL} />
    </>
  ),
  impresion: (
    <>
      <rect x="110" y="42" width="100" height="58" fill={BLANCO} stroke={AZUL} strokeWidth="3" />
      <rect x="74" y="90" width="172" height="72" rx="8" fill={AZUL} />
      <circle cx="222" cy="108" r="5" fill={AMBAR} />
      <rect x="94" y="140" width="132" height="8" rx="2" fill={AZUL_CLARO} />
      <rect x="104" y="148" width="112" height="42" fill={BLANCO} stroke={AZUL} strokeWidth="3" />
      <rect x="118" y="160" width="70" height="4" rx="2" fill={AZUL_CLARO} />
      <rect x="118" y="170" width="50" height="4" rx="2" fill={AZUL_CLARO} />
    </>
  ),
  accesorios: (
    <>
      <rect x="46" y="112" width="176" height="62" rx="6" fill={AZUL} />
      {[0, 1, 2].map((fila) =>
        [0, 1, 2, 3, 4, 5, 6, 7].map((columna) => (
          <rect
            key={`${fila}-${columna}`}
            x={56 + columna * 20}
            y={122 + fila * 15}
            width="15"
            height="10"
            rx="2"
            fill={AZUL_CLARO}
          />
        )),
      )}
      <rect x="236" y="110" width="42" height="64" rx="21" fill={AZUL} />
      <rect x="255" y="120" width="4" height="14" rx="2" fill={AMBAR} />
    </>
  ),
}

const DIBUJO_GENERICO = (
  <>
    {[0, 1, 2, 3].map((i) => (
      <g key={i} fill={AZUL_CLARO}>
        <rect x={128 + i * 18} y="62" width="6" height="16" rx="2" />
        <rect x={128 + i * 18} y="162" width="6" height="16" rx="2" />
        <rect x="102" y={88 + i * 18} width="16" height="6" rx="2" />
        <rect x="202" y={88 + i * 18} width="16" height="6" rx="2" />
      </g>
    ))}
    <rect x="115" y="75" width="90" height="90" rx="8" fill={AZUL} />
    <rect x="145" y="105" width="30" height="30" rx="4" fill={AMBAR} />
  </>
)

/**
 * @param {object} props
 * @param {string} props.idCategoria - Elige el dibujo.
 * @param {string} props.nombre - Texto alternativo para lectores de pantalla.
 * @param {string} [props.className]
 */
function ImagenProducto({ idCategoria, nombre, className = '' }) {
  // useId entrega un id único por cada imagen: el patrón de la cuadrícula se
  // define con un id, y si se repitiera en varias tarjetas de la misma página
  // el HTML sería inválido. Se dejan solo letras, números y guiones porque el
  // id se usa dentro de url(#...), y ahí otros símbolos pueden romperlo.
  const idPatron = `cuadricula-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const tieneDibujo = Object.hasOwn(DIBUJOS, idCategoria)

  return (
    <svg
      viewBox="0 0 320 240"
      role="img"
      aria-label={`Ilustración de ${nombre}`}
      className={`imagen-producto ${className}`.trim()}
      data-dibujo={tieneDibujo ? idCategoria : 'generico'}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id={idPatron} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 H0 V20" fill="none" stroke="var(--inf-borde, #dde3e8)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="320" height="240" fill="var(--inf-superficie, #f4f6f8)" />
      <rect width="320" height="240" fill={`url(#${idPatron})`} />
      {tieneDibujo ? DIBUJOS[idCategoria] : DIBUJO_GENERICO}
    </svg>
  )
}

export default ImagenProducto
