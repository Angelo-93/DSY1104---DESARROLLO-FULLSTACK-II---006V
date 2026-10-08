/**
 * Título de una vista del panel con sus acciones a la derecha (ej: "Nuevo
 * producto"). En celular las acciones bajan bajo el título.
 *
 * @param {object} props
 * @param {string} props.titulo
 * @param {string} [props.descripcion]
 * @param {React.ReactNode} [props.children] - Botones o enlaces de acción.
 */
function EncabezadoAdmin({ titulo, descripcion, children }) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-4">
      <div>
        <h1 className="h3 mb-1">{titulo}</h1>
        {descripcion && <p className="text-secondary small mb-0">{descripcion}</p>}
      </div>
      {children && <div className="d-flex flex-wrap gap-2 d-print-none">{children}</div>}
    </div>
  )
}

export default EncabezadoAdmin
