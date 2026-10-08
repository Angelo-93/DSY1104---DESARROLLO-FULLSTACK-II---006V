/**
 * Botones − y + con la cantidad al medio. Se usa en el detalle de producto y
 * en el carrito. No guarda la cantidad: la recibe y avisa los cambios al
 * padre (componente controlado), así el padre decide qué hacer con ella.
 *
 * @param {object} props
 * @param {number} props.valor - Cantidad actual.
 * @param {number} props.maximo - Tope (el stock disponible).
 * @param {(nuevoValor: number) => void} props.onCambiar
 * @param {string} [props.etiqueta='Cantidad'] - Nombre accesible del grupo.
 */
function SelectorCantidad({ valor, maximo, onCambiar, etiqueta = 'Cantidad' }) {
  // Lo escrito a mano también se limita entre 1 y el máximo.
  function manejarEscritura(evento) {
    const numero = Number.parseInt(evento.target.value, 10)
    if (Number.isNaN(numero)) return
    onCambiar(Math.max(1, Math.min(numero, maximo)))
  }

  return (
    <div className="input-group selector-cantidad" role="group" aria-label={etiqueta}>
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={() => onCambiar(valor - 1)}
        disabled={valor <= 1}
        aria-label="Disminuir cantidad"
      >
        −
      </button>
      <input
        type="number"
        className="form-control text-center"
        value={valor}
        min={1}
        max={maximo}
        onChange={manejarEscritura}
        aria-label={etiqueta}
      />
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={() => onCambiar(valor + 1)}
        disabled={valor >= maximo}
        aria-label="Aumentar cantidad"
      >
        +
      </button>
    </div>
  )
}

export default SelectorCantidad
