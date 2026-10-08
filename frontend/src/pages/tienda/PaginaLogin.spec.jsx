import { fireEvent, screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'

import { CLAVES } from '../../services/almacenamiento.js'
import { instalarLocalStorageFalso } from '../../testing/localStorageFalso.js'
import { renderizarConProveedores } from '../../testing/renderizarConProveedores.jsx'
import PaginaLogin from './PaginaLogin.jsx'

const USUARIOS = [
  { run: '182345679', nombre: 'Camila', apellidos: 'F', correo: 'camila@profesor.duoc.cl', contrasena: 'admin123', tipoUsuario: 'Administrador' },
  { run: '201112222', nombre: 'Francisca', apellidos: 'M', correo: 'fran@gmail.com', contrasena: 'cliente1', tipoUsuario: 'Cliente' },
]

function renderizarLogin() {
  return renderizarConProveedores(
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />
      <Route path="/admin" element={<p>Panel</p>} />
      <Route path="/" element={<p>Portada</p>} />
    </Routes>,
    { ruta: '/login' },
  )
}

function ingresar(correo, contrasena) {
  fireEvent.change(screen.getByLabelText('Correo'), { target: { value: correo } })
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: contrasena } })
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
}

describe('PaginaLogin', () => {
  beforeEach(() => {
    instalarLocalStorageFalso({ [CLAVES.usuarios]: USUARIOS })
  })

  it('con credenciales incorrectas muestra el error y se queda en el login', () => {
    renderizarLogin()
    ingresar('fran@gmail.com', 'malaClave')

    expect(screen.getByRole('alert').textContent).toBe('Correo o contraseña incorrectos.')
  })

  it('lleva al Administrador al panel', () => {
    renderizarLogin()
    ingresar('camila@profesor.duoc.cl', 'admin123')

    expect(screen.getByText('Panel')).toBeTruthy()
  })

  it('lleva al Cliente a la portada de la tienda', () => {
    renderizarLogin()
    ingresar('fran@gmail.com', 'cliente1')

    expect(screen.getByText('Portada')).toBeTruthy()
  })
})
