/**
 * Ícono circular de resultado: visto bueno (éxito) o equis (error), como en
 * las Figuras 7 y 8 del Anexo. Es decorativo: el título que lo acompaña ya
 * dice el resultado, por eso se oculta a los lectores de pantalla.
 *
 * @param {object} props
 * @param {'exito'|'error'} props.tipo
 */
function IconoEstado({ tipo }) {
  const esExito = tipo === 'exito'
  const color = esExito ? 'var(--bs-success)' : 'var(--bs-danger)'

  return (
    <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true" className="flex-shrink-0" data-tipo={tipo}>
      <circle cx="12" cy="12" r="10.5" fill="none" stroke={color} strokeWidth="1.8" />
      {esExito ? (
        <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  )
}

export default IconoEstado
