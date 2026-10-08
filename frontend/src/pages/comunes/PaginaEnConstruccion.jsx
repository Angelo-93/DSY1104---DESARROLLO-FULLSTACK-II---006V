import Container from 'react-bootstrap/Container'

/**
 * Página temporal para las rutas que aún no tienen su vista.
 * Existe para que toda la navegación del Anexo 1 funcione desde el Bloque 1;
 * cada bloque siguiente reemplaza una de estas por la página real.
 *
 * @param {object} props
 * @param {string} props.titulo - Nombre de la vista que irá en esta ruta.
 */
function PaginaEnConstruccion({ titulo }) {
  return (
    <Container className="py-5">
      <h1 className="h3">{titulo}</h1>
      <p className="text-secondary mb-0">Esta vista se construye en un bloque posterior.</p>
    </Container>
  )
}

export default PaginaEnConstruccion
