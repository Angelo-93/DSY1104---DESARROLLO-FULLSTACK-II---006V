import { useState } from 'react'
import Confetti from 'react-confetti'

/**
 * Lluvia de confeti al confirmar una compra (librería react-confetti, vista en
 * la clase del 15-09 como extra visual permitido una vez cubierta la rúbrica).
 *
 * Se omite si la persona configuró su sistema para reducir animaciones
 * (prefers-reduced-motion): para algunas personas el movimiento marea.
 */
function CelebracionCompra() {
  // Se leen una vez al montar: el confeti dura unos segundos y no hace falta
  // reaccionar si la ventana cambia de tamaño mientras cae.
  const [tamano] = useState(() => ({ ancho: window.innerWidth, alto: window.innerHeight }))
  const [reducirMovimiento] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  if (reducirMovimiento) return null

  return (
    <Confetti
      width={tamano.ancho}
      height={tamano.alto}
      recycle={false} // cae una sola vez, no se repite para siempre
      numberOfPieces={350}
      colors={['#0b3d63', '#14568c', '#d98c1f', '#f4f6f8']}
      style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 1080 }}
      data-testid="confeti"
    />
  )
}

export default CelebracionCompra
