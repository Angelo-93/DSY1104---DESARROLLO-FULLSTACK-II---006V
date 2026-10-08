import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'

import EncabezadoAdmin from '../../components/molecules/EncabezadoAdmin.jsx'
import TablaProductosAdmin from '../../components/organisms/TablaProductosAdmin.jsx'
import { useSesion } from '../../hooks/useSesion.js'
import { obtenerNombresCategoria } from '../../services/categoriasService.js'
import { listarProductosCriticos } from '../../services/productosService.js'
import { esAdministrador } from '../../utils/permisos.js'

/**
 * Productos en o bajo su stock crítico: lo que hay que reponer.
 * Del más urgente (menos stock) al menos urgente.
 */
function PaginaProductosCriticos() {
  const { usuario } = useSesion()
  const [criticos] = useState(() => listarProductosCriticos().toSorted((a, b) => a.stock - b.stock))
  const [nombresCategoria] = useState(obtenerNombresCategoria)

  return (
    <>
      <EncabezadoAdmin
        titulo="Productos críticos"
        descripcion="Productos cuyo stock llegó a su umbral crítico o bajó de él. Conviene reponerlos."
      >
        <Link to="/admin/productos" className="btn btn-outline-secondary">
          Volver a Productos
        </Link>
      </EncabezadoAdmin>

      <Card>
        <Card.Body>
          {/* Se reutiliza la tabla del inventario con otra lista de datos. */}
          <TablaProductosAdmin
            productos={criticos}
            nombresCategoria={nombresCategoria}
            puedeEditar={false}
            mensajeVacio="No hay productos en stock crítico."
          />
        </Card.Body>
      </Card>
      {esAdministrador(usuario) && criticos.length > 0 && (
        <p className="small text-secondary mt-2">Para reponer, edita el stock del producto desde Productos.</p>
      )}
    </>
  )
}

export default PaginaProductosCriticos
