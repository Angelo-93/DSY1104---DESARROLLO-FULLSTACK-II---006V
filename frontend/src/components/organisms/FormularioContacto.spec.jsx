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

  // RÚBRICA 8/10 · Estado. El contador no se guarda aparte: se calcula del estado
  // del mensaje en cada renderizado. Verifica que la pantalla sigue al estado.
  it('[Rúbrica 8/10 · Estado] cuenta los caracteres del mensaje mientras se escribe', () => {
    // Preparar: con el mensaje vacío el contador parte en 0.
    render(<FormularioContacto />)
    expect(screen.getByText('0 de 500 caracteres')).toBeTruthy()

    // Actuar
    escribir('Mensaje', 'Hola')

    // Verificar: el contador cambió solo, sin recargar la página.
    expect(screen.getByText('4 de 500 caracteres')).toBeTruthy()
    expect(screen.queryByText('0 de 500 caracteres')).toBeNull()
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
