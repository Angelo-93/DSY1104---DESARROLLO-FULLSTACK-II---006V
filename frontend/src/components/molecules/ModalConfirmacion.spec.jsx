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

  // RÚBRICA 5/10 · Props. Tarea del Anexo: "un botón recibe correctamente la
  // etiqueta y la función de evento onClick". El texto del botón llega por la prop
  // textoConfirmar ("Vaciar") y las funciones son mocks (jasmine.createSpy), que
  // registran si las llamaron y cuántas veces.
  it('[Rúbrica 5/10 · Props] usa el título y la etiqueta recibidos y llama a la función de cada botón', () => {
    // Preparar
    const onConfirmar = jasmine.createSpy('onConfirmar')
    const onCancelar = jasmine.createSpy('onCancelar')
    renderizarModal({ mostrar: true, onConfirmar, onCancelar })

    // Verificar que usa las props de texto
    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(screen.getByText('Vaciar carrito')).toBeTruthy()

    // Actuar: si la etiqueta no fuera "Vaciar", este botón no se encontraría.
    fireEvent.click(screen.getByRole('button', { name: 'Vaciar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    // Verificar: cada botón llamó a su propia función, una sola vez.
    expect(onConfirmar).toHaveBeenCalledTimes(1)
    expect(onCancelar).toHaveBeenCalledTimes(1)
  })
})
