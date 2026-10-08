/*
 * Vistas del Bloque 6b con la App completa: Categorías, Usuarios,
 * Historial de compras, Perfil y Reportes.
 */
import { fireEvent, screen, within } from '@testing-library/react'

import App from '../../App.jsx'
import { CLAVES } from '../../services/almacenamiento.js'
import { ORDEN_PRUEBA, PRODUCTOS_PRUEBA } from '../../testing/datosPrueba.js'
import { instalarLocalStorageFalso } from '../../testing/localStorageFalso.js'
import { renderizarConProveedores } from '../../testing/renderizarConProveedores.jsx'

// Usuarios guardados (con contraseña) y la sesión (sin ella), como en la app.
const ADMIN = {
  run: '182345679', nombre: 'Camila', apellidos: 'Fuentes', correo: 'camila@profesor.duoc.cl', contrasena: 'admin123',
  tipoUsuario: 'Administrador', fechaNacimiento: '', region: 'Región Metropolitana de Santiago', comuna: 'Providencia', direccion: 'Av. Holanda 099',
}
const CLIENTE = { ...ADMIN, run: '201112222', nombre: 'Ana', apellidos: 'Pérez Soto', correo: 'ana@gmail.com', contrasena: 'cliente1', tipoUsuario: 'Cliente' }
const { contrasena: _sinClave, ...SESION_ADMIN } = ADMIN

function iniciar() {
  return instalarLocalStorageFalso({
    [CLAVES.sesion]: SESION_ADMIN,
    [CLAVES.usuarios]: [ADMIN, CLIENTE],
    [CLAVES.productos]: PRODUCTOS_PRUEBA,
    [CLAVES.categorias]: [{ id: 'notebooks', nombre: 'Notebooks', descripcion: '' }, { id: 'vacia', nombre: 'Vacía', descripcion: '' }],
    // ORDEN_PRUEBA es de ana@gmail.com (como invitada) y está pagada.
    [CLAVES.ordenes]: [ORDEN_PRUEBA, { ...ORDEN_PRUEBA, numero: 1011, estado: 'rechazada' }],
  })
}

function abrir(ruta) {
  return renderizarConProveedores(<App />, { ruta })
}

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

function confirmarEnVentana(textoBoton) {
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: textoBoton }))
}

describe('Panel: Categorías', () => {
  it('no elimina una categoría con productos y lo explica', () => {
    const memoria = iniciar()
    abrir('/admin/categorias')

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Notebooks' }))
    confirmarEnVentana('Eliminar')

    expect(screen.getByText(/No se puede eliminar: la categoría tiene 1 producto/)).toBeTruthy()
    expect(JSON.parse(memoria[CLAVES.categorias]).length).toBe(2)
  })

  it('elimina una categoría vacía', () => {
    const memoria = iniciar()
    abrir('/admin/categorias')

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Vacía' }))
    confirmarEnVentana('Eliminar')

    expect(screen.getByText('Se eliminó la categoría Vacía.')).toBeTruthy()
    expect(JSON.parse(memoria[CLAVES.categorias]).map((c) => c.id)).toEqual(['notebooks'])
  })

  it('crea una categoría y rechaza un nombre repetido', () => {
    iniciar()
    abrir('/admin/categorias/nueva')

    escribir('Nombre', 'notebooks')
    fireEvent.click(screen.getByRole('button', { name: 'Crear categoría' }))
    expect(screen.getByRole('alert').textContent).toContain('Ya existe la categoría')

    escribir('Nombre', 'Redes y WiFi')
    fireEvent.click(screen.getByRole('button', { name: 'Crear categoría' }))
    expect(screen.getByText('Se creó la categoría Redes y WiFi.')).toBeTruthy()
    expect(screen.getByText('/redes-y-wifi')).toBeTruthy()
  })

  // Regresión: el aviso "Se creó..." quedaba apilado sobre "Se eliminó...".
  it('al eliminar después de crear muestra solo el aviso más reciente', () => {
    iniciar()
    abrir('/admin/categorias/nueva')
    escribir('Nombre', 'Redes y WiFi')
    fireEvent.click(screen.getByRole('button', { name: 'Crear categoría' }))

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Redes y WiFi' }))
    confirmarEnVentana('Eliminar')

    expect(screen.getByText('Se eliminó la categoría Redes y WiFi.')).toBeTruthy()
    expect(screen.queryByText('Se creó la categoría Redes y WiFi.')).toBeNull()
  })
})

describe('Panel: Usuarios', () => {
  it('crea un usuario con rol elegido', () => {
    const memoria = iniciar()
    abrir('/admin/usuarios/nuevo')

    escribir('RUN', '167890121')
    escribir('Tipo de usuario', 'Vendedor')
    escribir('Nombre', 'Matías')
    escribir('Apellidos', 'Soto')
    escribir('Correo', 'matias@duoc.cl')
    escribir('Contraseña', 'vende1')
    escribir('Región', 'Región Metropolitana de Santiago')
    escribir('Comuna', 'Ñuñoa')
    escribir('Dirección', 'Los Leones 456')
    fireEvent.click(screen.getByRole('button', { name: 'Crear usuario' }))

    expect(screen.getByText('Se creó la cuenta de Matías Soto.')).toBeTruthy()
    expect(JSON.parse(memoria[CLAVES.usuarios]).find((u) => u.run === '167890121').tipoUsuario).toBe('Vendedor')
  })

  it('al editar con la contraseña vacía conserva la anterior', () => {
    const memoria = iniciar()
    abrir('/admin/usuarios/201112222/editar')

    escribir('Nombre', 'Anita')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    const guardado = JSON.parse(memoria[CLAVES.usuarios]).find((u) => u.run === '201112222')
    expect(guardado.nombre).toBe('Anita')
    expect(guardado.contrasena).toBe('cliente1')
  })

  it('elimina un usuario tras confirmar', () => {
    const memoria = iniciar()
    abrir('/admin/usuarios')

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar Ana' }))
    confirmarEnVentana('Eliminar')

    expect(screen.getByText('Se eliminó la cuenta de Ana Pérez Soto.')).toBeTruthy()
    expect(JSON.parse(memoria[CLAVES.usuarios]).length).toBe(1)
  })

  it('el historial incluye las compras hechas como invitado con el mismo correo', () => {
    iniciar()
    abrir('/admin/usuarios/201112222/historial')

    expect(screen.getByRole('heading', { name: 'Historial de compras de Ana Pérez Soto' })).toBeTruthy()
    expect(screen.getAllByRole('row').length - 1).toBe(2)
    expect(screen.getByText('$1.015.000', { selector: '.tarjeta-indicador__valor' })).toBeTruthy()
  })
})

describe('Panel: Perfil', () => {
  it('guarda los datos propios y actualiza la cabecera del panel', () => {
    const memoria = iniciar()
    abrir('/admin/perfil')

    escribir('Nombre', 'Camila Andrea')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar mi perfil' }))

    expect(screen.getByText('Tus datos se guardaron correctamente.')).toBeTruthy()
    expect(screen.getByText('Camila Andrea Fuentes (Administrador)')).toBeTruthy()
    expect(JSON.parse(memoria[CLAVES.sesion]).nombre).toBe('Camila Andrea')
  })
})

describe('Panel: Reportes', () => {
  it('muestra los gráficos y la tabla con solo las órdenes pagadas', async () => {
    iniciar()
    abrir('/admin/reportes')

    // Vista cargada bajo demanda: se espera a que aparezca.
    expect(await screen.findByRole('img', { name: 'Ventas por mes' })).toBeTruthy()
    expect(screen.getByRole('img', { name: 'Productos más vendidos en unidades' })).toBeTruthy()
    // Una sola orden pagada de $1.015.000 (la rechazada no cuenta).
    expect(screen.getByText('1 compras pagadas')).toBeTruthy()
    const filaNotebooks = screen.getByRole('cell', { name: 'Notebooks' }).closest('tr')
    expect(within(filaNotebooks).getByText('$1.000.000')).toBeTruthy()
  })
})
