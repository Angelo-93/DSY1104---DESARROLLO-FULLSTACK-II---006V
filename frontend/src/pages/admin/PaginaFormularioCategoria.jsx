import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Card from 'react-bootstrap/Card'

import EncabezadoAdmin from '../../components/molecules/EncabezadoAdmin.jsx'
import FormularioCategoria from '../../components/organisms/FormularioCategoria.jsx'
import { actualizarCategoria, crearCategoria, obtenerCategoria } from '../../services/categoriasService.js'

/**
 * Nueva categoría (/admin/categorias/nueva) y Editar categoría
 * (/admin/categorias/:idCategoria/editar). En la Figura 10 del Anexo esta
 * rama dice "Editar usuario": se interpreta como "Editar categoría".
 */
function PaginaFormularioCategoria() {
  const { idCategoria } = useParams()
  const navegar = useNavigate()
  const [errorGeneral, setErrorGeneral] = useState('')
  const esEdicion = Boolean(idCategoria)
  const categoria = esEdicion ? obtenerCategoria(idCategoria) : null

  if (esEdicion && !categoria) {
    return (
      <>
        <EncabezadoAdmin titulo="Categoría no encontrada" />
        <Link to="/admin/categorias">Volver a Categorías</Link>
      </>
    )
  }

  function manejarGuardado(datos) {
    try {
      const guardada = esEdicion ? actualizarCategoria(categoria.id, datos) : crearCategoria(datos)
      const accion = esEdicion ? 'actualizó' : 'creó'
      navegar('/admin/categorias', { state: { mensaje: `Se ${accion} la categoría ${guardada.nombre}.` } })
    } catch (error) {
      setErrorGeneral(error.message) // nombre repetido
    }
  }

  return (
    <>
      <EncabezadoAdmin titulo={esEdicion ? `Editar categoría ${categoria.nombre}` : 'Nueva categoría'} />
      <Card style={{ maxWidth: '40rem' }}>
        <Card.Body className="p-3 p-md-4">
          <FormularioCategoria
            categoria={categoria ?? undefined}
            onGuardar={manejarGuardado}
            onCancelar={() => navegar('/admin/categorias')}
            errorGeneral={errorGeneral}
          />
        </Card.Body>
      </Card>
    </>
  )
}

export default PaginaFormularioCategoria
