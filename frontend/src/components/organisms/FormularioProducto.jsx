import { useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

import { tieneErrores, validarProducto } from '../../utils/validaciones.js'
import CampoFormulario from '../molecules/CampoFormulario.jsx'

const VACIO = {
  codigo: '',
  nombre: '',
  idCategoria: '',
  especificaciones: '',
  descripcion: '',
  precio: '',
  precioOferta: '',
  stock: '',
  stockCritico: '',
}

// Los números del producto se pasan a texto para los campos del formulario;
// null (opcional vacío) queda como ''.
function aCamposDeTexto(producto) {
  const campos = { ...VACIO }
  Object.keys(VACIO).forEach((clave) => {
    const valor = producto[clave]
    campos[clave] = valor === null || valor === undefined ? '' : String(valor)
  })
  return campos
}

/**
 * Formulario de producto para "Nuevo producto" y "Editar producto" (un solo
 * componente para ambos: lo que cambia llega por props).
 *
 * @param {object} props
 * @param {object} [props.producto] - Si viene, el formulario es de edición.
 * @param {Array<{id: string, nombre: string}>} props.categorias
 * @param {(datos: object) => void} props.onGuardar - Recibe los datos válidos.
 * @param {() => void} props.onCancelar
 * @param {string} [props.errorGeneral] - Error del servicio (ej: código repetido).
 */
function FormularioProducto({ producto, categorias, onGuardar, onCancelar, errorGeneral }) {
  const esEdicion = Boolean(producto)
  const [datos, setDatos] = useState(() => (producto ? aCamposDeTexto(producto) : VACIO))
  const [errores, setErrores] = useState({})

  function propsCampo(nombre) {
    return {
      name: nombre,
      value: datos[nombre],
      onChange: (evento) => setDatos({ ...datos, [nombre]: evento.target.value }),
      error: errores[nombre],
    }
  }

  function manejarEnvio(evento) {
    evento.preventDefault()
    const nuevosErrores = validarProducto(datos)
    setErrores(nuevosErrores)
    if (!tieneErrores(nuevosErrores)) onGuardar(datos)
  }

  return (
    <Form noValidate onSubmit={manejarEnvio}>
      {errorGeneral && <Alert variant="danger">{errorGeneral}</Alert>}

      <Row className="g-3">
        <Col xs={12} md={4}>
          {/* El código identifica al producto en carritos, órdenes y URLs:
              en edición se muestra, pero no se puede cambiar. */}
          <CampoFormulario
            id="producto-codigo"
            etiqueta="Código"
            maxLength={20}
            disabled={esEdicion}
            ayuda={esEdicion ? 'El código no se puede cambiar.' : 'Mínimo 3 caracteres. Ej: NB-HP250G10'}
            {...propsCampo('codigo')}
          />
        </Col>
        <Col xs={12} md={8}>
          <CampoFormulario id="producto-nombre" etiqueta="Nombre" maxLength={100} {...propsCampo('nombre')} />
        </Col>
      </Row>

      <Form.Group className="mb-3" controlId="producto-categoria">
        <Form.Label>Categoría</Form.Label>
        <Form.Select
          name="idCategoria"
          value={datos.idCategoria}
          onChange={(evento) => setDatos({ ...datos, idCategoria: evento.target.value })}
          isInvalid={Boolean(errores.idCategoria)}
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">{errores.idCategoria}</Form.Control.Feedback>
      </Form.Group>

      <CampoFormulario
        id="producto-especificaciones"
        etiqueta="Características (opcional)"
        maxLength={200}
        placeholder="Ej: Intel Core i5 · 16 GB RAM · 512 GB SSD"
        ayuda="Línea corta que se muestra en la tarjeta del producto."
        {...propsCampo('especificaciones')}
      />
      <CampoFormulario
        id="producto-descripcion"
        etiqueta="Descripción (opcional)"
        as="textarea"
        rows={3}
        maxLength={500}
        ayuda={`${datos.descripcion.length} de 500 caracteres`}
        {...propsCampo('descripcion')}
      />

      <Row className="g-3">
        <Col xs={12} sm={6} lg={3}>
          <CampoFormulario id="producto-precio" etiqueta="Precio" type="number" min={0} step={1} {...propsCampo('precio')} />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <CampoFormulario
            id="producto-oferta"
            etiqueta="Precio oferta (opcional)"
            type="number"
            min={0}
            step={1}
            ayuda="Vacío = sin oferta."
            {...propsCampo('precioOferta')}
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <CampoFormulario id="producto-stock" etiqueta="Stock" type="number" min={0} step={1} {...propsCampo('stock')} />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <CampoFormulario
            id="producto-critico"
            etiqueta="Stock crítico (opcional)"
            type="number"
            min={0}
            step={1}
            ayuda="Bajo este número se avisa reponer."
            {...propsCampo('stockCritico')}
          />
        </Col>
      </Row>

      <div className="d-flex flex-wrap justify-content-end gap-2 mt-2">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          {esEdicion ? 'Guardar cambios' : 'Crear producto'}
        </button>
      </div>
    </Form>
  )
}

export default FormularioProducto
