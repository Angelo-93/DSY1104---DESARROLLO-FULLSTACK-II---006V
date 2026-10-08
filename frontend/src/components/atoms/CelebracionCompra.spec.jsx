import { render, screen } from '@testing-library/react'

import CelebracionCompra from './CelebracionCompra.jsx'

// Mock de matchMedia: simula la preferencia del sistema operativo sin cambiarla.
function simularReducirMovimiento(activo) {
  spyOn(window, 'matchMedia').and.returnValue({ matches: activo })
}

describe('CelebracionCompra', () => {
  it('dibuja el confeti en un canvas', () => {
    simularReducirMovimiento(false)
    render(<CelebracionCompra />)

    expect(screen.getByTestId('confeti').tagName).toBe('CANVAS')
  })

  it('no dibuja nada si el sistema pide reducir animaciones', () => {
    simularReducirMovimiento(true)
    const { container } = render(<CelebracionCompra />)

    expect(container.innerHTML).toBe('')
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
  })
})
