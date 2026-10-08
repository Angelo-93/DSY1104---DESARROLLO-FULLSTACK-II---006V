import { useState } from 'react'
import Container from 'react-bootstrap/Container'

import AvisoFlotante from '../../components/molecules/AvisoFlotante.jsx'
import RutaNavegacion from '../../components/molecules/RutaNavegacion.jsx'
import GrillaProductos from '../../components/organisms/GrillaProductos.jsx'
import { useAgregarAlCarrito } from '../../hooks/useAgregarAlCarrito.js'
import { obtenerNombresCategoria } from '../../services/categoriasService.js'
import { listarOfertas } from '../../services/productosService.js'
import { porcentajeDescuento } from '../../utils/calculos.js'

/** Vista Ofertas (nueva en la EP2): productos con precio de oferta vigente. */
function PaginaOfertas() {
  // Primero el mayor descuento: es lo que más le interesa a quien entra a Ofertas.
  // toSorted no modifica el arreglo original (sort sí lo haría).
  const [ofertas] = useState(() => listarOfertas().toSorted((a, b) => porcentajeDescuento(b) - porcentajeDescuento(a)))
  const [nombresCategoria] = useState(obtenerNombresCategoria)
  const { agregar, aviso, cerrarAviso } = useAgregarAlCarrito()

  return (
    <Container className="py-4">
      <RutaNavegacion elementos={[{ texto: 'Ofertas' }]} />
      <h1>Ofertas</h1>
      <p className="text-secondary mb-4">
        {ofertas.length > 0
          ? `${ofertas.length} productos con precio rebajado, ordenados de mayor a menor descuento.`
          : 'Revisa más adelante: publicamos ofertas nuevas cada semana.'}
      </p>

      <GrillaProductos
        productos={ofertas}
        nombresCategoria={nombresCategoria}
        onAgregar={agregar}
        mensajeVacio="Hoy no hay ofertas vigentes."
      />

      <AvisoFlotante aviso={aviso} onCerrar={cerrarAviso} />
    </Container>
  )
}

export default PaginaOfertas
