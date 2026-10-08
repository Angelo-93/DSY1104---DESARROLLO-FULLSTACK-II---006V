import { fireEvent, screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'

import { CLAVES } from '../../services/almacenamiento.js'
import { instalarLocalStorageFalso } from '../../testing/localStorageFalso.js'
import { renderizarConProveedores } from '../../testing/renderizarConProveedores.jsx'
import PaginaRegistro from './PaginaRegistro.jsx'

const EXISTENTE = { run: '201112222', nombre: 'Francisca', correo: 'fran@gmail.com', contrasena: 'cliente1', tipoUsuario: 'Cliente' }

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

function registrar(correo) {
  escribir('RUN', '19011029K')
  escribir('Nombre', 'Pedro')
  escribir('Apellidos', 'Rojas')
  escribir('Correo electrónico', correo)
  escribir('Contraseña', 'clave1')
  escribir('Confirmar contraseña', 'clave1')
  escribir('Región', 'Región Metropolitana de Santiago')
  escribir('Comuna', 'Maipú')
  escribir('Dirección', 'Av. Pajaritos 123')
  fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
}

describe('PaginaRegistro', () => {
  let memoria

  beforeEach(() => {
    memoria = instalarLocalStorageFalso({ [CLAVES.usuarios]: [EXISTENTE] })
    renderizarConProveedores(
      <Routes>
        <Route path="/registro" element={<PaginaRegistro />} />
        <Route path="/" element={<p>Portada</p>} />
      </Routes>,
      { ruta: '/registro' },
    )
  })

  it('crea la cuenta como Cliente, inicia sesión y lleva a la portada', () => {
    registrar('pedro@gmail.com')

    expect(screen.getByText('Portada')).toBeTruthy()
    const guardado = JSON.parse(memoria[CLAVES.usuarios]).find((u) => u.run === '19011029K')
    expect(guardado.tipoUsuario).toBe('Cliente')
    expect(guardado.confirmarContrasena).toBeUndefined() // la confirmación no se guarda
    expect(JSON.parse(memoria[CLAVES.sesion]).nombre).toBe('Pedro')
  })

  it('si el correo ya está registrado lo informa y no crea la cuenta', () => {
    registrar('fran@gmail.com')

    expect(screen.getByRole('alert').textContent).toBe('Ese correo ya está registrado.')
    expect(JSON.parse(memoria[CLAVES.usuarios]).length).toBe(1)
  })
})
