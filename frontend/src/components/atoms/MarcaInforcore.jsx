/**
 * Logotipo de texto de INFORCORE (círculo ámbar + nombre).
 * Es un átomo porque es la pieza mínima de la identidad y se repite en el menú
 * de la tienda, el pie de página y la cabecera del panel administrador.
 *
 * @param {object} props
 * @param {boolean} [props.clara=false] - true cuando va sobre fondo oscuro.
 */
function MarcaInforcore({ clara = false }) {
  const clases = clara ? 'marca marca--clara' : 'marca'

  return (
    <span className={clases}>
      {/* El círculo es solo decorativo: el lector de pantalla lee "INFORCORE". */}
      <span className="marca__nucleo" aria-hidden="true"></span>
      INFORCORE
    </span>
  )
}

export default MarcaInforcore
