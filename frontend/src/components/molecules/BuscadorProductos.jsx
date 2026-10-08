import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Buscador del menú superior (como en el template del Anexo 1). Al buscar,
 * lleva al catálogo con el texto en la URL: /productos?buscar=monitor.
 */
function BuscadorProductos() {
  const [texto, setTexto] = useState('')
  const navegar = useNavigate()

  function manejarEnvio(evento) {
    evento.preventDefault()
    const limpio = texto.trim()
    // encodeURIComponent: espacios y tildes viajan seguros dentro de la URL.
    navegar(limpio ? `/productos?buscar=${encodeURIComponent(limpio)}` : '/productos')
    setTexto('')
  }

  return (
    <form role="search" onSubmit={manejarEnvio} className="d-flex gap-1 buscador-menu">
      <input
        type="search"
        className="form-control form-control-sm"
        placeholder="Buscar"
        aria-label="Buscar productos"
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
      />
      <button type="submit" className="btn btn-outline-primary btn-sm">
        Buscar
      </button>
    </form>
  )
}

export default BuscadorProductos
