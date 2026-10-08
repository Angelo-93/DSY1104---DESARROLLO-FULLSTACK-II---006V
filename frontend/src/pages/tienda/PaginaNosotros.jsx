import Container from 'react-bootstrap/Container'

import RutaNavegacion from '../../components/molecules/RutaNavegacion.jsx'
import SeccionTarjetas from '../../components/organisms/SeccionTarjetas.jsx'

// Texto de la EP1 (nosotros.html), migrado tal cual.
const AREAS = [
  { titulo: 'Asesoría comercial', texto: 'Dimensionamos el equipo o la solución exacta para tu proyecto, sin presionarte a comprar de más.' },
  { titulo: 'Soporte técnico', texto: 'Acompañamiento post-venta y gestión de garantías para que tu operación no se detenga.' },
  { titulo: 'Logística y despacho', texto: 'Coordinamos la entrega a oficinas, colegios y universidades en todo el país.' },
]

function PaginaNosotros() {
  return (
    <>
      {/* texto-lectura va en un div interno y no en el Container: así el texto
          queda alineado a la izquierda con el resto del sitio, solo más angosto. */}
      <Container className="pt-4">
        <RutaNavegacion elementos={[{ texto: 'Nosotros' }]} />
        <div className="texto-lectura">
          <h1>Quiénes somos</h1>
          <p>
            INFORCORE es una empresa dedicada a la venta de hardware y soluciones tecnológicas para empresas e
            instituciones educativas de todo Chile. Trabajamos con equipamiento actualizado y asesoría técnica
            cercana, para que cada cliente elija justo lo que su operación necesita, sin pagar de más ni quedarse
            corto.
          </p>
          <h2 className="h3 mt-4">Nuestra misión</h2>
          <p>
            Ser el socio tecnológico de confianza para organizaciones que están modernizando su infraestructura:
            equipos correctos, entrega a tiempo y soporte real después de la compra, no solo durante la venta.
          </p>
        </div>
      </Container>

      <SeccionTarjetas titulo="Áreas que te acompañan" items={AREAS} fondoSuperficie />

      <Container className="py-4">
        <div className="texto-lectura">
          <h2 className="h3">Sobre este sitio</h2>
          <p>
            Este sitio web fue desarrollado por Angelo Pastene, estudiante de Ingeniería en Informática de Duoc UC,
            como proyecto de la asignatura DSY1104 Desarrollo Fullstack II.
          </p>
        </div>
      </Container>
    </>
  )
}

export default PaginaNosotros
