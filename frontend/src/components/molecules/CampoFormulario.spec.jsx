import { render, screen } from '@testing-library/react'

import CampoFormulario from './CampoFormulario.jsx'

describe('CampoFormulario', () => {
  it('une la etiqueta con su campo y pasa las props extra al input', () => {
    render(<CampoFormulario id="c-correo" etiqueta="Correo" type="email" maxLength={100} value="" onChange={() => {}} />)

    const campo = screen.getByLabelText('Correo')
    expect(campo.getAttribute('type')).toBe('email')
    expect(campo.getAttribute('maxlength')).toBe('100')
  })

  // RÚBRICA 3/10 · Renderizado condicional. Tarea del Anexo: "un mensaje de error
  // solo se muestra cuando hay un error presente". rerender vuelve a dibujar el
  // mismo componente con otras props, para comparar los dos casos.
  it('[Rúbrica 3/10 · Renderizado condicional] muestra el error y marca el campo como inválido solo cuando recibe uno', () => {
    // Caso 1, sin error: el campo no se marca y no hay mensaje.
    const { rerender } = render(<CampoFormulario id="c" etiqueta="Nombre" value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Nombre').classList.contains('is-invalid')).toBeFalse()
    expect(screen.queryByText('El nombre es obligatorio.')).toBeNull()

    // Caso 2, con error: borde rojo (is-invalid de Bootstrap) y mensaje visible.
    rerender(<CampoFormulario id="c" etiqueta="Nombre" value="" onChange={() => {}} error="El nombre es obligatorio." />)
    expect(screen.getByLabelText('Nombre').classList.contains('is-invalid')).toBeTrue()
    expect(screen.getByText('El nombre es obligatorio.')).toBeTruthy()
  })
})
