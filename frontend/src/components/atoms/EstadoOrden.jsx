/**
 * Insignia del estado de una orden: verde si se pagó, roja si se rechazó.
 * El texto dice el estado, así el color nunca es el único indicador.
 *
 * @param {object} props
 * @param {'pagada'|'rechazada'} props.estado
 */
function EstadoOrden({ estado }) {
  const pagada = estado === 'pagada'
  return <span className={`badge ${pagada ? 'text-bg-success' : 'text-bg-danger'}`}>{pagada ? 'Pagada' : 'Rechazada'}</span>
}

export default EstadoOrden
