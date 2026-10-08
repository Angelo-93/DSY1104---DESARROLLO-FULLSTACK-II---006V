import { fireEvent, render, screen } from '@testing-library/react'

import FormularioLogin from './FormularioLogin.jsx'

describe('FormularioLogin', () => {
  let onIngresar

  beforeEach(() => {
    // Mock de función: registra si la llamaron y con qué datos, sin hacer nada más.
    onIngresar = jasmine.createSpy('onIngresar')
  })

  function escribir(etiqueta, valor) {
    fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
  }

  // RÚBRICA 7/10 · Estado. Tarea del Anexo: "el estado de un formulario cambia
  // correctamente cuando el usuario introduce texto". Los campos son controlados:
  // lo que muestran sale del useState del formulario, así que si el estado no se
  // actualizara, el valor seguiría vacío.
  it('[Rúbrica 7/10 · Estado] actualiza el estado de cada campo mientras el usuario escribe', () => {
    // Preparar: el formulario parte con el estado vacío.
    render(<FormularioLogin onIngresar={onIngresar} />)
    expect(screen.getByLabelText('Correo').value).toBe('')
    expect(screen.getByLabelText('Contraseña').value).toBe('')

    // Actuar: fireEvent.change simula lo que el usuario escribe en cada campo.
    escribir('Correo', 'ana@duoc.cl')
    escribir('Contraseña', 'clave1')

    // Verificar: cada campo guardó su propio valor, sin pisar al otro.
    expect(screen.getByLabelText('Correo').value).toBe('ana@duoc.cl')
    expect(screen.getByLabelText('Contraseña').value).toBe('clave1')
  })

  it('al enviar vacío muestra los errores y no avisa al padre', () => {
    render(<FormularioLogin onIngresar={onIngresar} />)
    expect(screen.queryByText('El correo es obligatorio.')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(screen.getByText('El correo es obligatorio.')).toBeTruthy()
    expect(screen.getByText('La contraseña es obligatoria.')).toBeTruthy()
    expect(onIngresar).not.toHaveBeenCalled()
  })

  it('rechaza un dominio no permitido aunque el correo tenga buen formato', () => {
    render(<FormularioLogin onIngresar={onIngresar} />)
    escribir('Correo', 'ana@yahoo.com')
    escribir('Contraseña', 'abcd')

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(screen.getByText(/Solo se aceptan correos/)).toBeTruthy()
    expect(onIngresar).not.toHaveBeenCalled()
  })

  it('con datos válidos llama a onIngresar con el correo y la contraseña', () => {
    render(<FormularioLogin onIngresar={onIngresar} />)
    escribir('Correo', 'ana@gmail.com')
    escribir('Contraseña', 'clave1')

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(onIngresar).toHaveBeenCalledOnceWith({ correo: 'ana@gmail.com', contrasena: 'clave1' })
  })

  it('muestra el error de credenciales que recibe por props', () => {
    render(<FormularioLogin onIngresar={onIngresar} errorCredenciales="Correo o contraseña incorrectos." />)

    expect(screen.getByRole('alert').textContent).toBe('Correo o contraseña incorrectos.')
  })

  it('borra el error de un campo en cuanto el usuario lo corrige', () => {
    render(<FormularioLogin onIngresar={onIngresar} />)
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    expect(screen.getByText('El correo es obligatorio.')).toBeTruthy()

    escribir('Correo', 'a')

    expect(screen.queryByText('El correo es obligatorio.')).toBeNull()
    expect(screen.getByText('La contraseña es obligatoria.')).toBeTruthy() // el otro sigue
  })
})
