/*
 * Flujo completo de compra con las páginas reales: Checkout → Compra exitosa
 * o Pago con error → reintento. Prueba de integración: confirma que las
 * piezas (carrito, sesión, servicios y rutas) funcionan juntas.
 */
import { fireEvent, screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'

import { CLAVES } from '../../services/almacenamiento.js'
import { ITEMS_PRUEBA, PRODUCTOS_PRUEBA } from '../../testing/datosPrueba.js'
import { instalarLocalStorageFalso } from '../../testing/localStorageFalso.js'
import { renderizarConProveedores } from '../../testing/renderizarConProveedores.jsx'
import PaginaCheckout from './PaginaCheckout.jsx'
import PaginaCompraExitosa from './PaginaCompraExitosa.jsx'
import PaginaPagoFallido from './PaginaPagoFallido.jsx'

const SESION = {
  run: '201112222',
  nombre: 'Francisca',
  apellidos: 'Muñoz Díaz',
  correo: 'francisca.munoz@gmail.com',
  tipoUsuario: 'Cliente',
  region: 'Región de Valparaíso',
  comuna: 'Viña del Mar',
  direccion: 'Av. San Martín 220',
}

function renderizarCompra(ruta = '/checkout') {
  return renderizarConProveedores(
    <Routes>
      <Route path="/checkout" element={<PaginaCheckout />} />
      <Route path="/compra/exitosa/:numeroOrden" element={<PaginaCompraExitosa />} />
      <Route path="/compra/fallida/:numeroOrden" element={<PaginaPagoFallido />} />
      <Route path="/carrito" element={<p>Carrito</p>} />
    </Routes>,
    { ruta },
  )
}

function pagar() {
  fireEvent.click(screen.getByRole('button', { name: /Pagar ahora/ }))
}

describe('Flujo de compra', () => {
  let memoria

  beforeEach(() => {
    // El confeti no se dibuja en estas pruebas (mock de la preferencia del sistema).
    spyOn(window, 'matchMedia').and.returnValue({ matches: true })
    memoria = instalarLocalStorageFalso({
      [CLAVES.productos]: PRODUCTOS_PRUEBA,
      [CLAVES.carrito]: ITEMS_PRUEBA,
      [CLAVES.ordenes]: [],
      [CLAVES.sesion]: SESION,
    })
  })

  function guardado(clave) {
    return JSON.parse(memoria[clave])
  }

  it('con sesión iniciada autocompleta los datos de entrega', () => {
    renderizarCompra()

    expect(screen.getByLabelText('Correo').value).toBe('francisca.munoz@gmail.com')
    expect(screen.getByLabelText('Calle y número').value).toBe('Av. San Martín 220')
    expect(screen.getByLabelText('Región').value).toBe('Región de Valparaíso')
  })

  it('sin sesión invita a iniciar sesión y deja el formulario vacío', () => {
    delete memoria[CLAVES.sesion]
    renderizarCompra()

    expect(screen.getByRole('link', { name: 'Inicia sesión' })).toBeTruthy()
    expect(screen.getByLabelText('Correo').value).toBe('')
  })

  it('pago aprobado: muestra la boleta, vacía el carrito y descuenta el stock', () => {
    renderizarCompra()
    pagar()

    expect(screen.getByRole('heading', { level: 1, name: 'Se ha realizado la compra. Orden N° 1001' })).toBeTruthy()
    expect(screen.getByText('Total pagado: $1.015.000')).toBeTruthy()
    expect(guardado(CLAVES.carrito)).toEqual([])
    expect(guardado(CLAVES.productos).find((p) => p.codigo === 'NB-1').stock).toBe(1) // 3 - 2
    expect(guardado(CLAVES.ordenes)[0].cliente.run).toBe('201112222')
  })

  it('pago rechazado (simulado): muestra el error y conserva el carrito', () => {
    renderizarCompra()
    fireEvent.click(screen.getByLabelText('Rechazar el pago'))
    pagar()

    expect(screen.getByRole('heading', { level: 1, name: 'No se pudo realizar el pago. Orden N° 1001' })).toBeTruthy()
    expect(screen.getByText(/rechazo simulado/)).toBeTruthy()
    expect(guardado(CLAVES.carrito).length).toBe(2)
  })

  it('"Volver a realizar el pago" regresa al checkout con los datos de la orden', () => {
    memoria[CLAVES.ordenes] = JSON.stringify([
      {
        numero: 1001,
        fecha: '2026-10-07T15:00:00Z',
        estado: 'rechazada',
        motivoRechazo: { tipo: 'simulado' },
        cliente: { run: null, nombre: 'Invitado', apellidos: 'Prueba', correo: 'invitado@duoc.cl' },
        direccion: { calle: 'Calle Falsa 123', departamento: '7', region: 'Región de Tarapacá', comuna: 'Iquique', indicaciones: '' },
        items: ITEMS_PRUEBA,
        total: 1015000,
      },
    ])
    renderizarCompra('/compra/fallida/1001')

    fireEvent.click(screen.getByRole('button', { name: 'Volver a realizar el pago' }))

    // Prioridad: los datos de la orden rechazada, no los de la sesión.
    expect(screen.getByLabelText('Correo').value).toBe('invitado@duoc.cl')
    expect(screen.getByLabelText('Departamento (opcional)').value).toBe('7')
  })

  it('si falta stock al pagar, rechaza y ofrece revisar el carrito', () => {
    memoria[CLAVES.carrito] = JSON.stringify([{ ...ITEMS_PRUEBA[0], cantidad: 5 }]) // stock 3
    renderizarCompra()
    pagar()

    expect(screen.getByText(/No hay stock suficiente: Notebook Uno \(pediste 5, quedan 3\)/)).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Revisar carrito' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Volver a realizar el pago' })).toBeNull()
  })

  it('una URL de compra exitosa con una orden rechazada no muestra boleta', () => {
    memoria[CLAVES.ordenes] = JSON.stringify([{ numero: 1001, estado: 'rechazada' }])
    renderizarCompra('/compra/exitosa/1001')

    expect(screen.getByRole('heading', { name: 'Orden no encontrada' })).toBeTruthy()
  })

  it('"Enviar boleta por email" muestra el aviso de simulación', () => {
    renderizarCompra()
    pagar()

    fireEvent.click(screen.getByRole('button', { name: 'Enviar boleta por email' }))

    expect(screen.getByText(/Simulación: la boleta se enviaría a francisca.munoz@gmail.com/)).toBeTruthy()
  })
})
