import { render, screen } from '@testing-library/react'

import CampoFormulario from './CampoFormulario.jsx'

describe('CampoFormulario', () => {
  it('une la etiqueta con su campo y pasa las props extra al input', () => {
    render(<CampoFormulario id="c-correo" etiqueta="Correo" type="email" maxLength={100} value="" onChange={() => {}} />)

    const campo = screen.getByLabelText('Correo')
    expect(campo.getAttribute('type')).toBe('email')
    expect(campo.getAttribute('maxlength')).toBe('100')
  })

  it('muestra el error y marca el campo como inválido solo cuando recibe uno', () => {
    const { rerender } = render(<CampoFormulario id="c" etiqueta="Nombre" value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Nombre').classList.contains('is-invalid')).toBeFalse()

    rerender(<CampoFormulario id="c" etiqueta="Nombre" value="" onChange={() => {}} error="El nombre es obligatorio." />)
    expect(screen.getByLabelText('Nombre').classList.contains('is-invalid')).toBeTrue()
    expect(screen.getByText('El nombre es obligatorio.')).toBeTruthy()
  })
})
