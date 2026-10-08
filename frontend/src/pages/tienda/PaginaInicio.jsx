import { useState } from 'react'
import { Link } from 'react-router-dom'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import ImagenProducto from '../../components/atoms/ImagenProducto.jsx'
import AvisoFlotante from '../../components/molecules/AvisoFlotante.jsx'
import GrillaProductos from '../../components/organisms/GrillaProductos.jsx'
import SeccionTarjetas from '../../components/organisms/SeccionTarjetas.jsx'
import { useAgregarAlCarrito } from '../../hooks/useAgregarAlCarrito.js'
import { obtenerNombresCategoria } from '../../services/categoriasService.js'
import { listarOfertas, listarProductos } from '../../services/productosService.js'

// Textos de la portada de la EP1, migrados tal cual.
const SECTORES = [
  { titulo: 'Sector corporativo', texto: 'Notebooks, workstations y periféricos de alta gama para ejecutivos y equipos técnicos.' },
  { titulo: 'Sector educativo', texto: 'Laboratorios de computación, dispositivos para el aula e impresión masiva para colegios y universidades.' },
  { titulo: 'Infraestructura crítica', texto: 'Networking y soluciones de respaldo eléctrico para proteger la continuidad operativa.' },
]

const RAZONES = [
  { titulo: 'Asesoría experta', texto: 'Te ayudamos a dimensionar el equipo exacto que necesita tu proyecto.' },
  { titulo: 'Garantía y soporte', texto: 'Acompañamiento post-venta para asegurar tu continuidad operativa.' },
  { titulo: 'Despacho ágil', texto: 'Logística eficiente para llegar a tu oficina o institución educativa con rapidez.' },
]

const CANTIDAD_DESTACADOS = 8 // igual que en la EP1

function PaginaInicio() {
  // La función en useState se ejecuta solo al montar la página: el catálogo
  // se lee una vez, no cada vez que la página se vuelve a dibujar.
  const [destacados] = useState(() => listarProductos().slice(0, CANTIDAD_DESTACADOS))
  const [ofertas] = useState(listarOfertas)
  const [nombresCategoria] = useState(obtenerNombresCategoria)
  const { agregar, aviso, cerrarAviso } = useAgregarAlCarrito()

  return (
    <>
      <section className="portada">
        <Container>
          <Row className="align-items-center g-5">
            <Col xs={12} lg={6}>
              <p className="portada__etiqueta">Tecnología corporativa y educativa</p>
              <h1 className="portada__titulo">Tu núcleo informático</h1>
              <p className="portada__texto">
                Equipamos empresas e instituciones educativas de todo Chile con hardware y soluciones integrales,
                combinando tecnología de vanguardia con asesoría técnica personalizada.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/productos" className="btn btn-acento btn-lg">
                  Ver catálogo
                </Link>
                <Link to="/ofertas" className="btn btn-outline-light btn-lg">
                  Ver ofertas
                </Link>
              </div>
            </Col>
            {/* La ilustración es decorativa: se oculta en celular para que el
                texto y el botón queden arriba sin desplazarse. */}
            <Col lg={6} className="d-none d-lg-block">
              <ImagenProducto idCategoria="monitores" nombre="equipamiento corporativo INFORCORE" className="portada__imagen" />
            </Col>
          </Row>
        </Container>
      </section>

      <SeccionTarjetas titulo="Sectores que atendemos" items={SECTORES} />

      <section className="seccion bg-superficie">
        <Container>
          <div className="d-flex flex-wrap justify-content-between align-items-baseline gap-2 mb-4">
            <h2 className="mb-0">Ofertas vigentes</h2>
            <Link to="/ofertas">Ver todas las ofertas</Link>
          </div>
          <GrillaProductos productos={ofertas} nombresCategoria={nombresCategoria} onAgregar={agregar} mensajeVacio="Hoy no hay ofertas vigentes." />
        </Container>
      </section>

      <section className="seccion">
        <Container>
          <div className="d-flex flex-wrap justify-content-between align-items-baseline gap-2 mb-4">
            <h2 className="mb-0">Productos destacados</h2>
            <Link to="/productos">Ver todo el catálogo</Link>
          </div>
          <GrillaProductos productos={destacados} nombresCategoria={nombresCategoria} onAgregar={agregar} />
        </Container>
      </section>

      <SeccionTarjetas titulo="Por qué elegir INFORCORE" items={RAZONES} fondoSuperficie />

      <AvisoFlotante aviso={aviso} onCerrar={cerrarAviso} />
    </>
  )
}

export default PaginaInicio
