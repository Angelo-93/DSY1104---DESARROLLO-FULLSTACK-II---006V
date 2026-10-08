import { fireEvent, render, screen } from '@testing-library/react'

import FormularioUsuario from './FormularioUsuario.jsx'

const USUARIO = {
  run: '201112222', nombre: 'Francisca', apellidos: 'Muñoz', correo: 'fran@gmail.com', tipoUsuario: 'Cliente',
  fechaNacimiento: '', region: 'Región de Valparaíso', comuna: 'Viña del Mar', direccion: 'Av. San Martín 220',
}

describe('FormularioUsuario', () => {
  it('en modo nuevo exige contraseña y rol', () => {
    render(<FormularioUsuario modo="nuevo" onGuardar={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: 'Crear usuario' }))

    expect(screen.getByText('La contraseña es obligatoria.')).toBeTruthy()
    expect(screen.getByText('Selecciona un tipo de usuario.')).toBeTruthy()
  })

  it('en modo editar bloquea el RUN y acepta la contraseña vacía', () => {
    const onGuardar = jasmine.createSpy('onGuardar')
    render(<FormularioUsuario modo="editar" usuario={USUARIO} onGuardar={onGuardar} />)

    expect(screen.getByLabelText('RUN').disabled).toBeTrue()
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(onGuardar).toHaveBeenCalledOnceWith(jasmine.objectContaining({ run: '201112222', contrasena: '' }))
  })

  it('bloquea el rol cuando el administrador se edita a sí mismo', () => {
    render(<FormularioUsuario modo="editar" usuario={USUARIO} bloquearRol onGuardar={() => {}} />)

    expect(screen.getByLabelText('Tipo de usuario').disabled).toBeTrue()
    expect(screen.getByText('No puedes cambiar tu propio rol.')).toBeTruthy()
  })

  it('en modo perfil no muestra el rol', () => {
    render(<FormularioUsuario modo="perfil" usuario={USUARIO} onGuardar={() => {}} />)

    expect(screen.queryByLabelText('Tipo de usuario')).toBeNull()
    expect(screen.getByRole('button', { name: 'Guardar mi perfil' })).toBeTruthy()
  })
})
