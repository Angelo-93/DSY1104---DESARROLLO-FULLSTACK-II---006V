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

  // RÚBRICA 4/10 · Renderizado condicional con mock. La condición viene del
  // sistema operativo (preferencia "reducir movimiento"); spyOn reemplaza
  // window.matchMedia por una respuesta fija, así la prueba no depende del
  // computador donde se ejecuta. Jasmine restaura el original al terminar.
  it('[Rúbrica 4/10 · Renderizado condicional] no dibuja nada si el sistema pide reducir animaciones', () => {
    // Preparar: el mock responde "sí, reducir movimiento".
    simularReducirMovimiento(true)

    // Actuar
    const { container } = render(<CelebracionCompra />)

    // Verificar: no se dibujó nada y el componente consultó la preferencia correcta.
    expect(container.innerHTML).toBe('')
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
  })
})
