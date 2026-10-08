import { fireEvent, render, screen } from '@testing-library/react'

import FormularioEntrega from './FormularioEntrega.jsx'

const DATOS_SESION = {
  nombre: 'Francisca',
  apellidos: 'Muñoz Díaz',
  correo: 'francisca.munoz@gmail.com',
  calle: 'Av. San Martín 220',
  region: 'Región de Valparaíso',
  comuna: 'Viña del Mar',
}

describe('FormularioEntrega', () => {
  let onPagar

  beforeEach(() => {
    onPagar = jasmine.createSpy('onPagar')
  })

  it('parte con los datos que recibe por props (autocompletado con sesión)', () => {
    render(<FormularioEntrega datosIniciales={DATOS_SESION} total={1000} onPagar={onPagar} />)

    expect(screen.getByLabelText('Nombre').value).toBe('Francisca')
    expect(screen.getByLabelText('Calle y número').value).toBe('Av. San Martín 220')
    expect(screen.getByLabelText('Comuna').value).toBe('Viña del Mar')
    expect(screen.getByRole('button', { name: 'Pagar ahora $1.000' })).toBeTruthy()
  })

  it('sin datos iniciales exige los campos obligatorios y no paga', () => {
    render(<FormularioEntrega total={1000} onPagar={onPagar} />)

    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }))

    expect(screen.getByText('La calle es obligatoria.')).toBeTruthy()
    expect(screen.getByText('Selecciona una región.')).toBeTruthy()
    expect(onPagar).not.toHaveBeenCalled()
  })

  it('entrega los datos y la opción de simulación elegida', () => {
    render(<FormularioEntrega datosIniciales={DATOS_SESION} total={1000} onPagar={onPagar} />)

    fireEvent.click(screen.getByLabelText('Rechazar el pago'))
    fireEvent.change(screen.getByLabelText('Departamento (opcional)'), { target: { value: '42' } })
    fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }))

    expect(onPagar).toHaveBeenCalledTimes(1)
    const [datos, opciones] = onPagar.calls.mostRecent().args
    expect(datos).toEqual(jasmine.objectContaining({ correo: 'francisca.munoz@gmail.com', departamento: '42', indicaciones: '' }))
    expect(opciones).toEqual({ simularRechazo: true })
  })
})
