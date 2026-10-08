import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'

import { formatearRun } from '../../utils/formato.js'

// Color de la insignia de cada rol (el texto dice el rol: el color no es lo único).
const CLASE_ROL = {
  Administrador: 'text-bg-primary',
  Vendedor: 'text-bg-info',
  Cliente: 'text-bg-light border',
}

/**
 * Usuarios del panel. La cuenta con sesión iniciada no se puede eliminar
 * desde aquí: se marca con "Tú" en vez del botón.
 *
 * @param {object} props
 * @param {object[]} props.usuarios - Sin contraseña.
 * @param {string} props.runSesion - RUN del usuario conectado.
 * @param {(usuario: object) => void} props.onEliminar
 */
function TablaUsuariosAdmin({ usuarios, runSesion, onEliminar }) {
  return (
    <Table responsive hover className="align-middle mb-0">
      <thead>
        <tr>
          <th scope="col">RUN</th>
          <th scope="col">Nombre</th>
          <th scope="col" className="d-none d-md-table-cell">Correo</th>
          <th scope="col">Rol</th>
          <th scope="col" className="d-none d-lg-table-cell">Comuna</th>
          <th scope="col">
            <span className="visually-hidden">Acciones</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((usuario) => {
          const esSesion = usuario.run === runSesion
          return (
            <tr key={usuario.run}>
              <td className="text-nowrap">{formatearRun(usuario.run)}</td>
              <td>
                {usuario.nombre} {usuario.apellidos}
              </td>
              <td className="d-none d-md-table-cell">{usuario.correo}</td>
              <td>
                <span className={`badge ${CLASE_ROL[usuario.tipoUsuario]}`}>{usuario.tipoUsuario}</span>
              </td>
              <td className="d-none d-lg-table-cell">{usuario.comuna}</td>
              <td className="text-end text-nowrap">
                <Link
                  to={`/admin/usuarios/${usuario.run}/historial`}
                  className="btn btn-outline-secondary btn-sm me-1"
                  aria-label={`Historial de compras de ${usuario.nombre}`}
                >
                  Historial
                </Link>
                <Link
                  to={`/admin/usuarios/${usuario.run}/editar`}
                  className="btn btn-outline-primary btn-sm me-1"
                  aria-label={`Editar ${usuario.nombre}`}
                >
                  Editar
                </Link>
                {esSesion ? (
                  <span className="badge text-bg-secondary align-middle">Tú</span>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => onEliminar(usuario)}
                    aria-label={`Eliminar ${usuario.nombre}`}
                  >
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}

export default TablaUsuariosAdmin
