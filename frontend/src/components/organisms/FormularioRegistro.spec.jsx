import { fireEvent, render, screen } from '@testing-library/react'

import FormularioRegistro from './FormularioRegistro.jsx'

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

function llenarDatosValidos() {
  escribir('RUN', '19011029K')
  escribir('Nombre', 'Pedro')
  escribir('Apellidos', 'Rojas')
  escribir('Correo electrónico', 'pedro@gmail.com')
  escribir('Contraseña', 'clave1')
  escribir('Confirmar contraseña', 'clave1')
  escribir('Región', 'Región Metropolitana de Santiago')
  escribir('Comuna', 'Maipú')
  escribir('Dirección', 'Av. Pajaritos 123')
}

describe('FormularioRegistro', () => {
  let onRegistrar

  beforeEach(() => {
    onRegistrar = jasmine.createSpy('onRegistrar')
  })

  it('al enviar vacío muestra los errores de los campos obligatorios', () => {
    render(<FormularioRegistro onRegistrar={onRegistrar} />)

    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(screen.getByText('El RUN es obligatorio.')).toBeTruthy()
    expect(screen.getByText('Selecciona una región.')).toBeTruthy()
    expect(onRegistrar).not.toHaveBeenCalled()
  })

  it('detecta un RUN con dígito verificador incorrecto y contraseñas distintas', () => {
    render(<FormularioRegistro onRegistrar={onRegistrar} />)
    llenarDatosValidos()
    escribir('RUN', '190110290')
    escribir('Confirmar contraseña', 'otra1')

    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(screen.getByText(/dígito verificador/)).toBeTruthy()
    expect(screen.getByText('Las contraseñas no coinciden.')).toBeTruthy()
    expect(onRegistrar).not.toHaveBeenCalled()
  })

  it('con datos válidos entrega todos los datos al padre', () => {
    render(<FormularioRegistro onRegistrar={onRegistrar} />)
    llenarDatosValidos()

    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(onRegistrar).toHaveBeenCalledTimes(1)
    expect(onRegistrar.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({
      run: '19011029K',
      correo: 'pedro@gmail.com',
      comuna: 'Maipú',
    }))
  })

  it('muestra el error general que recibe del padre', () => {
    render(<FormularioRegistro onRegistrar={onRegistrar} errorGeneral="Ese correo ya está registrado." />)

    expect(screen.getByRole('alert').textContent).toBe('Ese correo ya está registrado.')
  })
})
