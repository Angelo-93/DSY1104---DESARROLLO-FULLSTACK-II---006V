/**
 * Tarjeta de color con un número destacado (Anexo 1, Figura 9: Compras,
 * Productos, Usuarios).
 *
 * @param {object} props
 * @param {string} props.titulo
 * @param {string|number} props.valor - El número grande.
 * @param {string} props.detalle - Línea de contexto bajo el número.
 * @param {'primario'|'exito'|'acento'} [props.variante='primario'] - Color de fondo.
 */
function TarjetaIndicador({ titulo, valor, detalle, variante = 'primario' }) {
  return (
    <div className={`tarjeta-indicador tarjeta-indicador--${variante} h-100`}>
      <p className="tarjeta-indicador__titulo mb-1">{titulo}</p>
      <p className="tarjeta-indicador__valor mb-1">{valor}</p>
      <p className="tarjeta-indicador__detalle small mb-0">{detalle}</p>
    </div>
  )
}

export default TarjetaIndicador
