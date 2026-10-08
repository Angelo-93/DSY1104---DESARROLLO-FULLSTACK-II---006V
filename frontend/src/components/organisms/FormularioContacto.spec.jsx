import { fireEvent, render, screen } from '@testing-library/react'

import FormularioContacto from './FormularioContacto.jsx'

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

describe('FormularioContacto', () => {
  it('exige nombre y mensaje, pero acepta el correo vacío', () => {
    render(<FormularioContacto />)

    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getByText('El nombre es obligatorio.')).toBeTruthy()
    expect(screen.getByText('El comentario es obligatorio.')).toBeTruthy()
    expect(screen.queryByText('El correo es obligatorio.')).toBeNull()
  })

  it('cuenta los caracteres del mensaje mientras se escribe', () => {
    render(<FormularioContacto />)

    escribir('Mensaje', 'Hola')

    expect(screen.getByText('4 de 500 caracteres')).toBeTruthy()
  })

  it('con datos válidos confirma el envío y limpia el formulario', () => {
    render(<FormularioContacto />)
    escribir('Nombre completo', 'Ana Pérez')
    escribir('Mensaje', 'Necesito una cotización.')

    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getByRole('status').textContent).toContain('Gracias, Ana Pérez')
    expect(screen.getByLabelText('Nombre completo').value).toBe('')
  })
})
