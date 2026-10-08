import { fireEvent, render, screen } from '@testing-library/react'

import ModalConfirmacion from './ModalConfirmacion.jsx'

function renderizarModal(props) {
  return render(
    <ModalConfirmacion titulo="Vaciar carrito" mensaje="¿Seguro?" textoConfirmar="Vaciar" onConfirmar={() => {}} onCancelar={() => {}} {...props} />,
  )
}

describe('ModalConfirmacion', () => {
  it('no se muestra mientras "mostrar" es false', () => {
    renderizarModal({ mostrar: false })

    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('al confirmar o cancelar llama a la función que corresponde', () => {
    const onConfirmar = jasmine.createSpy('onConfirmar')
    const onCancelar = jasmine.createSpy('onCancelar')
    renderizarModal({ mostrar: true, onConfirmar, onCancelar })

    expect(screen.getByRole('dialog')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Vaciar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onConfirmar).toHaveBeenCalledTimes(1)
    expect(onCancelar).toHaveBeenCalledTimes(1)
  })
})
