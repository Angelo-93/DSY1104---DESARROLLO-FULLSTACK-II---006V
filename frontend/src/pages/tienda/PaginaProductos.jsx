import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Container from 'react-bootstrap/Container'

import AvisoFlotante from '../../components/molecules/AvisoFlotante.jsx'
import FiltrosProductos from '../../components/molecules/FiltrosProductos.jsx'
import RutaNavegacion from '../../components/molecules/RutaNavegacion.jsx'
import GrillaProductos from '../../components/organisms/GrillaProductos.jsx'
import { useAgregarAlCarrito } from '../../hooks/useAgregarAlCarrito.js'
import { listarCategorias } from '../../services/categoriasService.js'
import { listarProductos } from '../../services/productosService.js'
import { normalizarTexto } from '../../utils/texto.js'

/**
 * Catálogo con filtro por categoría y búsqueda por texto.
 *
 * Los filtros se guardan en la URL (/productos?categoria=monitores&buscar=hp)
 * con useSearchParams en vez de useState: así el buscador del menú puede
 * mandar aquí una búsqueda, y un filtro sobrevive a recargar la página.
 */
function PaginaProductos() {
  const [productos] = useState(listarProductos)
  const [categorias] = useState(listarCategorias)
  const [parametros, setParametros] = useSearchParams()
  const { agregar, aviso, cerrarAviso } = useAgregarAlCarrito()

  const idCategoria = parametros.get('categoria') ?? ''
  const textoBusqueda = parametros.get('buscar') ?? ''

  // Cambia un parámetro y deja el otro; un valor vacío se quita de la URL.
  // replace: escribir letra por letra no debe llenar el historial del botón "Atrás".
  function cambiarParametro(nombre, valor) {
    const nuevos = new URLSearchParams(parametros)
    if (valor) nuevos.set(nombre, valor)
    else nuevos.delete(nombre)
    setParametros(nuevos, { replace: true })
  }

  const nombresCategoria = Object.fromEntries(categorias.map((c) => [c.id, c.nombre]))

  // Se calcula en cada render a partir de la URL: no hace falta otro estado
  // para "productos filtrados" (sería un dato duplicado que hay que sincronizar).
  // La búsqueda mira nombre, características y categoría: en la EP1 era solo
  // el nombre, y así "impresora" o "monitor" no encontraban nada, porque los
  // nombres son de modelo ("HP LaserJet...").
  // normalizarTexto: "impresion" encuentra "Impresión".
  const buscado = normalizarTexto(textoBusqueda)
  const filtrados = productos.filter((producto) => {
    const textoProducto = normalizarTexto(
      `${producto.nombre} ${producto.especificaciones} ${nombresCategoria[producto.idCategoria] ?? ''}`,
    )
    return (!idCategoria || producto.idCategoria === idCategoria) && (!buscado || textoProducto.includes(buscado))
  })

  return (
    <Container className="py-4">
      <RutaNavegacion elementos={[{ texto: 'Productos' }]} />
      <h1 className="mb-3">Productos</h1>

      <FiltrosProductos
        categorias={categorias}
        idCategoria={idCategoria}
        textoBusqueda={textoBusqueda}
        onCambiarCategoria={(valor) => cambiarParametro('categoria', valor)}
        onCambiarBusqueda={(valor) => cambiarParametro('buscar', valor)}
      />

      {/* aria-live: el lector de pantalla anuncia el nuevo total al filtrar. */}
      <p className="text-secondary small" aria-live="polite">
        {filtrados.length} {filtrados.length === 1 ? 'producto' : 'productos'}
      </p>

      <GrillaProductos
        productos={filtrados}
        nombresCategoria={nombresCategoria}
        onAgregar={agregar}
        mensajeVacio="Ningún producto coincide con tu búsqueda. Prueba con otra palabra o con todas las categorías."
      />

      <AvisoFlotante aviso={aviso} onCerrar={cerrarAviso} />
    </Container>
  )
}

export default PaginaProductos
