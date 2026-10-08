import { render } from '@testing-library/react'

import MarcaInforcore from './MarcaInforcore'

describe('MarcaInforcore', () => {
  it('muestra el nombre INFORCORE con la variante normal por defecto', () => {
    const { container } = render(<MarcaInforcore />)
    const marca = container.querySelector('.marca')

    expect(marca.textContent).toBe('INFORCORE')
    expect(marca.classList.contains('marca--clara')).toBeFalse()
  })

  it('aplica la variante clara cuando recibe la prop clara', () => {
    const { container } = render(<MarcaInforcore clara />)

    expect(container.querySelector('.marca').classList.contains('marca--clara')).toBeTrue()
  })
})
