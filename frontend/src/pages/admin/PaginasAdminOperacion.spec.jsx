/*
 * Vistas del Bloque 6a con la App completa (rutas reales y guardias de rol):
 * Dashboard, Órdenes, Boleta, Productos, Productos críticos y formulario.
 */
import { fireEvent, screen, within } from '@testing-library/react'

import App from '../../App.jsx'
import { CLAVES } from '../../services/almacenamiento.js'
import { ADMIN_PRUEBA, ORDEN_PRUEBA, PRODUCTOS_PRUEBA, VENDEDOR_PRUEBA } from '../../testing/datosPrueba.js'
import { instalarLocalStorageFalso } from '../../testing/localStorageFalso.js'
import { renderizarConProveedores } from '../../testing/renderizarConProveedores.jsx'

const ORDENES = [
  ORDEN_PRUEBA,
  { ...ORDEN_PRUEBA, numero: 1011, estado: 'rechazada', motivoRechazo: { tipo: 'simulado' }, total: 500 },
]

function iniciarCon(sesion) {
  return instalarLocalStorageFalso({
    [CLAVES.sesion]: sesion,
    [CLAVES.productos]: PRODUCTOS_PRUEBA,
    [CLAVES.categorias]: [{ id: 'notebooks', nombre: 'Notebooks' }, { id: 'accesorios', nombre: 'Accesorios' }],
    [CLAVES.ordenes]: ORDENES,
    [CLAVES.usuarios]: [ADMIN_PRUEBA, VENDEDOR_PRUEBA],
  })
}

function abrir(ruta) {
  return renderizarConProveedores(<App />, { ruta })
}

describe('Panel: Dashboard', () => {
  it('muestra los indicadores calculados con los datos guardados', () => {
    iniciarCon(ADMIN_PRUEBA)
    abrir('/admin')

    // 1 orden pagada de $1.015.000; 3 productos con 13 unidades (3 + 10 + 0).
    expect(screen.getByText('Ventas: $1.015.000 · 1 rechazadas')).toBeTruthy()
    expect(screen.getByText(/Inventario: 13 unidades/)).toBeTruthy()
    expect(screen.getByText('Clientes: 0 · Personal: 2')).toBeTruthy()
  })

  it('al Vendedor no le muestra cifras ni accesos de usuarios', () => {
    iniciarCon(VENDEDOR_PRUEBA)
    abrir('/admin')

    expect(screen.queryByText(/Clientes:/)).toBeNull()
    expect(screen.getByText('Productos sin stock disponible')).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Usuarios' })).toBeNull()
  })
})

describe('Panel: Órdenes y Boleta', () => {
  beforeEach(() => iniciarCon(VENDEDOR_PRUEBA))

  it('filtra por estado', () => {
    abrir('/admin/ordenes')
    expect(screen.getAllByRole('row').length - 1).toBe(2)

    fireEvent.change(screen.getByLabelText('Filtrar por estado'), { target: { value: 'rechazada' } })

    const filas = screen.getAllByRole('row').slice(1)
    expect(filas.length).toBe(1)
    expect(within(filas[0]).getByText('1011')).toBeTruthy()
  })

  it('la boleta de una orden rechazada muestra el motivo y que no se cobró', () => {
    abrir('/admin/ordenes/1011')

    expect(screen.getByRole('heading', { name: 'Boleta N° 1011' })).toBeTruthy()
    expect(screen.getByText(/rechazo simulado/)).toBeTruthy()
    expect(screen.getByText('Total (no cobrado): $500')).toBeTruthy()
  })
})

describe('Panel: Productos', () => {
  it('el Vendedor ve el inventario sin botones de edición', () => {
    iniciarCon(VENDEDOR_PRUEBA)
    abrir('/admin/productos')

    expect(screen.getByText(/Tu rol \(Vendedor\) permite consultar/)).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Nuevo producto' })).toBeNull()
    expect(screen.queryByRole('button', { name: /Eliminar/ })).toBeNull()
  })

  it('el Vendedor no puede abrir el formulario aunque escriba la URL', () => {
    iniciarCon(VENDEDOR_PRUEBA)
    abrir('/admin/productos/nuevo')

    expect(screen.getByRole('heading', { name: 'No tienes permiso para ver esta sección' })).toBeTruthy()
  })

  it('el Administrador elimina solo después de confirmar', () => {
    const memoria = iniciarCon(ADMIN_PRUEBA)
    abrir('/admin/productos')

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Mouse Oferta' }))
    expect(JSON.parse(memoria[CLAVES.productos]).length).toBe(3) // todavía no

    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Eliminar' }))

    expect(JSON.parse(memoria[CLAVES.productos]).map((p) => p.codigo)).toEqual(['NB-1', 'AU-0'])
    expect(screen.getByText('Se eliminó Mouse Oferta.')).toBeTruthy()
    expect(screen.queryByText('Mouse Oferta')).toBeNull()
  })

  it('crea un producto y vuelve a la lista con un mensaje', () => {
    const memoria = iniciarCon(ADMIN_PRUEBA)
    abrir('/admin/productos/nuevo')

    const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
    escribir('Código', 'ac-9')
    escribir('Nombre', 'Mouse Nuevo')
    escribir('Categoría', 'accesorios')
    escribir('Precio', '9990')
    escribir('Stock', '7')
    fireEvent.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(screen.getByText('Se creó el producto Mouse Nuevo.')).toBeTruthy()
    const creado = JSON.parse(memoria[CLAVES.productos]).find((p) => p.codigo === 'AC-9')
    expect(creado).toEqual(jasmine.objectContaining({ precio: 9990, stock: 7, precioOferta: null }))
  })

  it('si el código ya existe, avisa y se queda en el formulario', () => {
    iniciarCon(ADMIN_PRUEBA)
    abrir('/admin/productos/nuevo')

    const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
    escribir('Código', 'NB-1')
    escribir('Nombre', 'Repetido')
    escribir('Categoría', 'notebooks')
    escribir('Precio', '1')
    escribir('Stock', '1')
    fireEvent.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(screen.getByRole('alert').textContent).toBe('Ya existe un producto con el código NB-1.')
  })

  it('edita un producto existente y avisa si el código no existe', () => {
    const memoria = iniciarCon(ADMIN_PRUEBA)
    const { unmount } = abrir('/admin/productos/NB-1/editar')

    fireEvent.change(screen.getByLabelText('Stock'), { target: { value: '20' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(JSON.parse(memoria[CLAVES.productos]).find((p) => p.codigo === 'NB-1').stock).toBe(20)
    unmount()

    abrir('/admin/productos/NO-EXISTE/editar')
    expect(screen.getByRole('heading', { name: 'Producto no encontrado' })).toBeTruthy()
  })

  it('Productos críticos lista solo los que están en o bajo su umbral', () => {
    iniciarCon(VENDEDOR_PRUEBA)
    abrir('/admin/productos/criticos')

    // Solo la cámara (stock 0, crítico 5) está en stock crítico.
    const filas = screen.getAllByRole('row').slice(1)
    expect(filas.length).toBe(1)
    expect(within(filas[0]).getByText('Cámara Agotada')).toBeTruthy()
  })
})
